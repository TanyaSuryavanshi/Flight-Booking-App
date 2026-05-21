-- Enable required extensions for UUID and cryptographic utilities
create extension if not exists "pgcrypto";

-- Flights table
create table if not exists flights (
  id uuid primary key default gen_random_uuid(),
  flight_no text not null unique,
  origin text not null,
  destination text not null,
  departs_at timestamptz not null,
  arrives_at timestamptz not null,
  aircraft_type text not null,
  status text not null default 'on-time',
  base_price numeric not null check (base_price >= 0)
);

-- Seats table
create table if not exists seats (
  id uuid primary key default gen_random_uuid(),
  flight_id uuid not null references flights(id) on delete cascade,
  seat_number text not null,
  class text not null check (class in ('economy', 'business', 'first')),
  is_available boolean not null default true,
  extra_fee numeric not null default 0,
  unique (flight_id, seat_number)
);
create index if not exists seats_flight_availability_idx on seats(flight_id, is_available);

-- Bookings table
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  flight_id uuid not null references flights(id) on delete cascade,
  seat_id uuid not null references seats(id) on delete restrict,
  status text not null default 'confirmed',
  booked_at timestamptz not null default now(),
  total_price numeric not null check (total_price >= 0),
  pnr_code text not null unique
);
create index if not exists bookings_user_id_idx on bookings(user_id);

-- Passengers table
create table if not exists passengers (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  full_name text not null,
  passport_no text not null,
  nationality text not null,
  dob date not null
);

-- Reschedules table
create table if not exists reschedules (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  old_flight_id uuid not null references flights(id),
  new_flight_id uuid not null references flights(id),
  requested_at timestamptz not null default now(),
  fee_charged numeric not null default 0
);

-- Row-level security policies
alter table flights enable row level security;
alter table seats enable row level security;
alter table bookings enable row level security;
alter table passengers enable row level security;
alter table reschedules enable row level security;

create policy "public select flights" on flights for select using (true);
create policy "public select seats" on seats for select using (true);

create policy "user can manage own bookings" on bookings
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "user can read own passengers" on passengers
  for select using (
    exists (
      select 1 from bookings where bookings.id = passengers.booking_id and bookings.user_id = auth.uid()
    )
  );

create policy "user can modify own reschedules" on reschedules
  for select using (
    exists (
      select 1 from bookings where bookings.id = reschedules.booking_id and bookings.user_id = auth.uid()
    )
  );

-- RPC function to reserve a seat atomically and prevent race conditions.
create or replace function reserve_seat(flight_uuid uuid, seat_uuid uuid)
  returns seats
  language plpgsql security definer as $$
declare
  seat_record seats%rowtype;
begin
  select * into seat_record
  from seats
  where id = seat_uuid and flight_id = flight_uuid
  for update;

  if not found then
    raise exception 'Seat not found for selected flight.';
  end if;

  if not seat_record.is_available then
    raise exception 'Selected seat is no longer available.';
  end if;

  update seats set is_available = false where id = seat_record.id;
  return seat_record;
end;
$$;

-- RPC function to release a seat when a booking is cancelled or changed.
create or replace function release_seat(booking_uuid uuid)
  returns seats
  language plpgsql security definer as $$
declare
  booking_record bookings%rowtype;
  seat_record seats%rowtype;
begin
  select * into booking_record from bookings where id = booking_uuid for update;
  if not found then
    raise exception 'Booking not found.';
  end if;

  select * into seat_record from seats where id = booking_record.seat_id for update;
  if not found then
    raise exception 'Seat not found for booking.';
  end if;

  update seats set is_available = true where id = seat_record.id;
  return seat_record;
end;
$$;

-- RPC function to create a booking atomically after reserving the seat.
create or replace function create_booking(
  user_uuid uuid,
  flight_uuid uuid,
  seat_uuid uuid,
  passenger_full_name text,
  passenger_passport_no text,
  passenger_nationality text,
  passenger_dob date,
  total numeric,
  pnr text
)
  returns bookings
  language plpgsql security definer as $$
declare
  reserved_seat seats%rowtype;
  booking_record bookings%rowtype;
begin
  select * into reserved_seat from seats where id = seat_uuid and flight_id = flight_uuid for update;
  if not found then
    raise exception 'Seat not found for selected flight.';
  end if;
  if not reserved_seat.is_available then
    raise exception 'Selected seat is no longer available.';
  end if;
  update seats set is_available = false where id = reserved_seat.id;

  insert into bookings (user_id, flight_id, seat_id, status, booked_at, total_price, pnr_code)
    values (user_uuid, flight_uuid, seat_uuid, 'confirmed', now(), total, pnr)
    returning * into booking_record;

  insert into passengers (booking_id, full_name, passport_no, nationality, dob)
    values (booking_record.id, passenger_full_name, passenger_passport_no, passenger_nationality, passenger_dob);

  return booking_record;
end;
$$;

-- RPC function to cancel a booking atomically, releasing the reserved seat.
create or replace function cancel_booking(booking_uuid uuid)
  returns bookings
  language plpgsql security definer as $$
declare
  booking_record bookings%rowtype;
  current_seat seats%rowtype;
begin
  select * into booking_record from bookings where id = booking_uuid for update;
  if not found then
    raise exception 'Booking not found.';
  end if;

  if booking_record.status = 'cancelled' then
    raise exception 'Booking is already cancelled.';
  end if;

  select * into current_seat from seats where id = booking_record.seat_id for update;
  if not found then
    raise exception 'Seat not found for booking.';
  end if;

  update bookings set status = 'cancelled' where id = booking_record.id;
  update seats set is_available = true where id = current_seat.id;

  return (select * from bookings where id = booking_record.id);
end;
$$;

-- RPC function to reschedule a booking to a new flight and seat.
create or replace function reschedule_booking(
  booking_uuid uuid,
  new_flight_uuid uuid,
  new_seat_uuid uuid,
  fee_charged numeric
)
  returns bookings
  language plpgsql security definer as $$
declare
  booking_record bookings%rowtype;
  old_seat seats%rowtype;
  new_seat seats%rowtype;
  updated_booking bookings%rowtype;
begin
  select * into booking_record from bookings where id = booking_uuid for update;
  if not found then
    raise exception 'Booking not found.';
  end if;

  select * into old_seat from seats where id = booking_record.seat_id for update;
  if not found then
    raise exception 'Original seat not found.';
  end if;

  select * into new_seat from seats where id = new_seat_uuid and flight_id = new_flight_uuid for update;
  if not found then
    raise exception 'Desired seat not found on the chosen flight.';
  end if;

  if not new_seat.is_available then
    raise exception 'Desired seat is already booked.';
  end if;

  update seats set is_available = true where id = old_seat.id;
  update seats set is_available = false where id = new_seat.id;

  update bookings
    set flight_id = new_flight_uuid,
        seat_id = new_seat.id,
        status = 'rescheduled',
        total_price = booking_record.total_price + fee_charged,
        booked_at = now()
    where id = booking_record.id
    returning * into updated_booking;

  insert into reschedules (booking_id, old_flight_id, new_flight_id, requested_at, fee_charged)
    values (booking_record.id, booking_record.flight_id, new_flight_uuid, now(), fee_charged);

  return updated_booking;
end;
$$;
-- Trigger to enforce cancellation cutoff within two hours of departure.
create or replace function prevent_cancel_within_two_hours()
  returns trigger
  language plpgsql security definer as $$
begin
  if (tg_op = 'UPDATE' and new.status = 'cancelled' and old.status <> 'cancelled') then
    if exists (
      select 1 from flights where id = new.flight_id and departs_at < now() + interval '2 hours'
    ) then
      raise exception 'Cancellations are not permitted within two hours of departure.';
    end if;
  end if;
  return new;
end;
$$;

create trigger bookings_cancel_protection
  before update on bookings
  for each row
  execute function prevent_cancel_within_two_hours();
