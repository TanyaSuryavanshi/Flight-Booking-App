"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase/client";
import SiteHeader from "@/components/layout/site-header";
import Button from "@/components/ui/button";
import SeatMap, { type SeatData } from "@/components/seat-map/seat-map";
import type { BookingStatus, Database } from "@/lib/types/db";

type BookingDetail = {
  id: string;
  status: BookingStatus;
  flight: {
    id: string;
    flight_no: string;
    origin: string;
    destination: string;
    departs_at: string;
    arrives_at: string;
    base_price: number;
  };
};

type FlightOption = {
  id: string;
  flight_no: string;
  origin: string;
  destination: string;
  departs_at: string;
  arrives_at: string;
  base_price: number;
};

export default function RescheduleBookingPage() {
  const params = useParams();
  const bookingId = params?.id as string;
  const router = useRouter();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [candidates, setCandidates] = useState<FlightOption[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<FlightOption | null>(null);
  const [seats, setSeats] = useState<SeatData[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<SeatData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isReadyToReschedule = useMemo(() => selectedFlight && selectedSeat, [selectedFlight, selectedSeat]);

  useEffect(() => {
    const loadBooking = async () => {
      setLoading(true);
      const { data, error: bookingError } = await supabaseClient
        .from("bookings")
        .select(`id, status, flight:flights (id, flight_no, origin, destination, departs_at, arrives_at, base_price)`)
        .eq("id", bookingId)
        .single();

      if (bookingError) {
        setError(bookingError.message);
        setLoading(false);
        return;
      }

      const bookingData = data as BookingDetail;
      setBooking(bookingData);
      const { data: flights, error: flightsError } = await supabaseClient
        .from("flights")
        .select("id, flight_no, origin, destination, departs_at, arrives_at, base_price")
        .eq("origin", bookingData.flight.origin)
        .eq("destination", bookingData.flight.destination)
        .gt("departs_at", bookingData.flight.departs_at)
        .order("departs_at", { ascending: true })
        .limit(4);

      if (flightsError) {
        setError(flightsError.message);
      } else {
        setCandidates(flights as FlightOption[]);
      }
      setLoading(false);
    };

    void loadBooking();
  }, [bookingId]);

  useEffect(() => {
    if (!selectedFlight) return;

    const loadSeats = async () => {
      const { data, error: seatError } = await supabaseClient
        .from("seats")
        .select("id, flight_id, seat_number, class, is_available, extra_fee")
        .eq("flight_id", selectedFlight.id)
        .order("seat_number", { ascending: true });

      if (seatError) {
        setError(seatError.message);
        return;
      }

      setSeats(data as SeatData[]);
      setSelectedSeat(null);
    };

    void loadSeats();
  }, [selectedFlight]);

  const handleReschedule = async () => {
    if (!booking || !selectedFlight || !selectedSeat) return;
    setActionLoading(true);
    setError(null);

    const fee = Math.max(0, selectedFlight.base_price - booking.flight.base_price);
    const { error: rescheduleError } = await supabaseClient.rpc(
      "reschedule_booking",
      {
        booking_uuid: booking.id,
        new_flight_uuid: selectedFlight.id,
        new_seat_uuid: selectedSeat.id,
        fee_charged: fee
      } as any
    );

    setActionLoading(false);

    if (rescheduleError) {
      setError(rescheduleError.message);
      return;
    }

    router.push(`/bookings/${booking.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Reschedule booking</p>
              <h1 className="text-3xl font-semibold text-slate-900">Choose a new flight and seat</h1>
            </div>
            <Button variant="ghost" onClick={() => router.push(`/bookings/${bookingId}`)}>
              Back to booking
            </Button>
          </div>

          {loading ? (
            <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-10 text-slate-600">Loading reschedule options...</div>
          ) : error ? (
            <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-8 text-red-700">{error}</div>
          ) : (
            <div className="mt-8 grid gap-8 xl:grid-cols-[0.8fr_1.2fr]">
              <aside className="space-y-6 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <div>
                  <p className="text-sm text-slate-600">Current flight</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{booking?.flight.flight_no}</p>
                  <p className="text-sm text-slate-600">{booking?.flight.origin} → {booking?.flight.destination}</p>
                </div>
                <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Available flights</p>
                  {candidates.length ? (
                    <div className="space-y-3">
                      {candidates.map((flight) => (
                        <button
                          key={flight.id}
                          type="button"
                          onClick={() => setSelectedFlight(flight)}
                          className={`w-full rounded-3xl border px-4 py-4 text-left text-sm transition ${
                            selectedFlight?.id === flight.id ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-white hover:border-blue-400"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-semibold text-slate-900">{flight.flight_no}</span>
                            <span className="text-slate-600">${flight.base_price.toFixed(2)}</span>
                          </div>
                          <p className="mt-2 text-slate-600">Depart {new Date(flight.departs_at).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</p>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-600">No alternate flights are available for this route yet.</p>
                  )}
                </div>
                {selectedFlight ? (
                  <div className="rounded-3xl border border-slate-200 bg-white p-5">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Selected flight</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{selectedFlight.flight_no}</p>
                    <p className="text-sm text-slate-600">${selectedFlight.base_price.toFixed(2)}</p>
                  </div>
                ) : null}
              </aside>
              <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6">
                {selectedFlight ? (
                  <>
                    <h2 className="text-xl font-semibold text-slate-900">Select a seat for the new flight</h2>
                    <SeatMap
                      flightId={selectedFlight.id}
                      initialSeats={seats}
                      selectedSeatId={selectedSeat?.id ?? null}
                      onSelectSeat={(seat) => setSelectedSeat(seat)}
                    />
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <p className="text-sm text-slate-600">Reschedule fee</p>
                      <p className="mt-2 text-2xl font-semibold text-slate-900">
                        ${Math.max(0, selectedFlight.base_price - (booking?.flight ? new Date(booking.flight.departs_at).getTime() : 0)).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                      <Button onClick={handleReschedule} disabled={!isReadyToReschedule || actionLoading}>
                        {actionLoading ? "Rescheduling..." : "Confirm reschedule"}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-slate-600">Select an alternate flight to view seat options.</div>
                )}
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
