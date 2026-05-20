"use client";

import { useEffect, useState } from "react";
import SiteHeader from "@/components/layout/site-header";
import SignOutButton from "@/components/auth/sign-out-button";
import { supabaseClient } from "@/lib/supabase/client";
import type { BookingStatus } from "@/lib/types/db";
import Link from "next/link";

type BookingRow = {
  id: string;
  flight_id: string;
  pnr_code: string;
  status: BookingStatus;
  total_price: number;
  flight: {
    flight_no: string;
    origin: string;
    destination: string;
    departs_at: string;
    arrives_at: string;
  };
};

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabaseClient
        .from("bookings")
        .select(`id, pnr_code, status, total_price, flight:flights (flight_no, origin, destination, departs_at, arrives_at)`)
        .order("booked_at", { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        setBookings([]);
      } else if (data) {
        setBookings(data as BookingRow[]);
      }

      setIsLoading(false);
    };

    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:flex-row sm:justify-between sm:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">My bookings</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Manage reservations and reschedules</h1>
          </div>
          <SignOutButton />
        </div>

        {isLoading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-soft">Loading bookings...</div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-700 shadow-soft">{error}</div>
        ) : bookings.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-soft">
            No bookings found. Start with a search and reserve your first flight.
            <Link href="/search" className="mt-4 inline-flex rounded-2xl bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700">
              Search flights
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <article key={booking.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-slate-500">PNR {booking.pnr_code}</p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-900">{booking.flight.origin} → {booking.flight.destination}</h2>
                    <p className="mt-2 text-sm text-slate-600">{booking.flight.flight_no} • Depart {new Date(booking.flight.departs_at).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</p>
                  </div>
                  <div className="grid gap-3 sm:text-right">
                    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold uppercase text-slate-700">{booking.status}</span>
                    <p className="text-sm text-slate-600">Total ${booking.total_price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href={`/bookings/${booking.id}`} className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
                    View details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
