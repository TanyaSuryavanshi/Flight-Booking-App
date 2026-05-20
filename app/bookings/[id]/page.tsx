"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase/client";
import type { BookingStatus, Database } from "@/lib/types/db";
import SiteHeader from "@/components/layout/site-header";
import Button from "@/components/ui/button";
import Link from "next/link";

type BookingDetail = {
  id: string;
  pnr_code: string;
  status: BookingStatus;
  total_price: number;
  booked_at: string;
  flight: {
    flight_no: string;
    origin: string;
    destination: string;
    departs_at: string;
    arrives_at: string;
    aircraft_type: string;
  };
  passenger: {
    full_name: string;
    passport_no: string;
    nationality: string;
    dob: string;
  };
};

export default function BookingDetailPage() {
  const params = useParams();
  const bookingId = params?.id as string;
  const router = useRouter();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      setLoading(true);
      const { data, error: fetchError } = await supabaseClient
        .from("bookings")
        .select(`id, pnr_code, status, total_price, booked_at, flight:flights (flight_no, origin, destination, departs_at, arrives_at, aircraft_type), passenger:passengers (full_name, passport_no, nationality, dob)`)
        .eq("id", bookingId)
        .single();

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setBooking(data as BookingDetail);
      }
      setLoading(false);
    };

    void fetchBooking();
  }, [bookingId]);

  const handleCancel = async () => {
    if (!booking) return;
    setIsCancelling(true);
    setActionError(null);

    const { error: cancelError } = await supabaseClient.rpc(
      "cancel_booking",
      { booking_uuid: booking.id } as any
    );

    setIsCancelling(false);

    if (cancelError) {
      setActionError(cancelError.message);
      return;
    }

    router.refresh();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Booking details</p>
              <h1 className="text-3xl font-semibold text-slate-900">Reservation overview</h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/bookings" className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Back to bookings
              </Link>
              <Link href={`/bookings/${bookingId}/reschedule`} className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                Reschedule
              </Link>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-slate-600 shadow-soft">Loading booking details...</div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-700 shadow-soft">{error}</div>
        ) : booking ? (
          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <span className="text-sm uppercase tracking-[0.25em] text-slate-500">PNR code</span>
                  <p className="text-2xl font-semibold text-slate-900">{booking.pnr_code}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Flight</h2>
                    <p className="mt-3 text-lg font-semibold text-slate-900">{booking.flight.origin} → {booking.flight.destination}</p>
                    <p className="mt-2 text-sm text-slate-600">{booking.flight.flight_no}</p>
                    <p className="mt-2 text-sm text-slate-600">Depart {new Date(booking.flight.departs_at).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</p>
                    <p className="text-sm text-slate-600">Arrive {new Date(booking.flight.arrives_at).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Passenger</h2>
                    <p className="mt-3 text-lg font-semibold text-slate-900">{booking.passenger.full_name}</p>
                    <p className="mt-2 text-sm text-slate-600">Passport: {booking.passenger.passport_no}</p>
                    <p className="mt-2 text-sm text-slate-600">Nationality: {booking.passenger.nationality}</p>
                    <p className="mt-2 text-sm text-slate-600">DOB: {new Date(booking.passenger.dob).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </section>
            <aside className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Status</p>
                <p className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold uppercase tracking-[0.2em] text-slate-700">{booking.status}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Total paid</p>
                <p className="mt-3 text-2xl font-semibold text-slate-900">${booking.total_price.toFixed(2)}</p>
              </div>
              {actionError ? <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{actionError}</div> : null}
              <Button variant="ghost" onClick={handleCancel} disabled={isCancelling || booking.status === "cancelled"}>
                {isCancelling ? "Cancelling..." : booking.status === "cancelled" ? "Booking cancelled" : "Cancel booking"}
              </Button>
            </aside>
          </div>
        ) : null}
      </main>
    </div>
  );
}
