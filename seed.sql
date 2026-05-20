-- Seed flights and seats for the Flight Management App

insert into flights (id, flight_no, origin, destination, departs_at, arrives_at, aircraft_type, status, base_price) values
  (gen_random_uuid(), 'FA123', 'LAX', 'JFK', '2026-06-10 08:00:00+00', '2026-06-10 16:00:00+00', 'Airbus A321', 'on-time', 298),
  (gen_random_uuid(), 'FA124', 'LAX', 'JFK', '2026-06-10 15:30:00+00', '2026-06-10 23:45:00+00', 'Boeing 737', 'delayed', 318),
  (gen_random_uuid(), 'FB210', 'SFO', 'SEA', '2026-06-11 09:15:00+00', '2026-06-11 11:10:00+00', 'Embraer 175', 'on-time', 138),
  (gen_random_uuid(), 'FB211', 'SFO', 'SEA', '2026-06-11 14:40:00+00', '2026-06-11 16:35:00+00', 'Airbus A220', 'boarding', 148),
  (gen_random_uuid(), 'FC331', 'ORD', 'MIA', '2026-06-12 07:20:00+00', '2026-06-12 11:05:00+00', 'Boeing 737 MAX', 'on-time', 248),
  (gen_random_uuid(), 'FC332', 'ORD', 'MIA', '2026-06-12 18:00:00+00', '2026-06-12 21:40:00+00', 'Airbus A320', 'on-time', 258),
  (gen_random_uuid(), 'FD451', 'DFW', 'LHR', '2026-06-13 20:00:00+00', '2026-06-14 08:45:00+00', 'Boeing 787', 'on-time', 798),
  (gen_random_uuid(), 'FD452', 'DFW', 'LHR', '2026-06-14 11:15:00+00', '2026-06-14 22:00:00+00', 'Airbus A330', 'delayed', 828);

with flight_data as (
  select id, flight_no from flights
)
insert into seats (flight_id, seat_number, class, is_available, extra_fee)
select f.id, s.seat_number, s.class, true, s.extra_fee
from flight_data f,
  (values
    -- first class
    ('1A','first', 220),
    ('1B','first', 220),
    ('1C','first', 220),
    ('1D','first', 220),
    -- business class
    ('2A','business', 120),
    ('2B','business', 120),
    ('2C','business', 120),
    ('2D','business', 120),
    ('2E','business', 120),
    ('2F','business', 120),
    ('3A','business', 110),
    ('3B','business', 110),
    ('3C','business', 110),
    ('3D','business', 110),
    ('3E','business', 110),
    ('3F','business', 110),
    -- economy class
    ('6A','economy', 0),
    ('6B','economy', 0),
    ('6C','economy', 0),
    ('6D','economy', 0),
    ('6E','economy', 0),
    ('6F','economy', 0),
    ('7A','economy', 0),
    ('7B','economy', 0),
    ('7C','economy', 0),
    ('7D','economy', 0),
    ('7E','economy', 0),
    ('7F','economy', 0)
  ) as s(seat_number, class, extra_fee);
