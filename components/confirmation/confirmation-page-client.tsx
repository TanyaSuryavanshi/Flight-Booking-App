
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase/client";
import SiteHeader from "@/components/layout/site-header";
import Button from "@/components/ui/button";

type BookingDetail = {
  id: string;
  pnr_code: string;
  status: string;
  total_price: number;
  flight: {
    flight_no: string;
    origin: string;
    destination: string;
    departs_at: string;
    arrives_at: string;
  };
  passengers: Array<{
    full_name: string;
    passport_no: string;
    nationality: string;
    dob: string;
  }>;
};


export default function ConfirmationPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("bookingId");
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingId) {
      setError("Missing booking reference.");
      setLoading(false);
      return;
    }

    const fetchBooking = async () => {
      const { data, error: fetchError } = await supabaseClient
        .from("bookings")
        .select(`id, pnr_code, status, total_price, flight:flights (flight_no, origin, destination, departs_at, arrives_at), passenger:passengers (full_name, passport_no, nationality, dob)`)
        .eq("id", bookingId)
        .single();

      if (fetchError) {
        setError(fetchError.message);
        setBooking(null);
      } else {
        setBooking(data as BookingDetail);
      }
      setLoading(false);
    };

    void fetchBooking();
  }, [bookingId]);

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
          {loading ? (
            <p className="text-slate-600">Loading confirmation...</p>
          ) : error ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>
          ) : booking ? (
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Booking confirmed</p>
                <h1 className="text-3xl font-semibold text-slate-900">Your flight is reserved.</h1>
                <p className="text-sm text-slate-600">PNR code: <span className="font-semibold text-slate-900">{booking.pnr_code}</span></p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <h2 className="text-lg font-semibold text-slate-900">Flight details</h2>
                  <p className="mt-3 text-sm text-slate-600">{booking.flight.flight_no}</p>
                  <p className="mt-2 text-slate-900">{booking.flight.origin} → {booking.flight.destination}</p>
                  <p className="mt-2 text-sm text-slate-600">Depart {new Date(booking.flight.departs_at).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</p>
                  <p className="mt-1 text-sm text-slate-600">Arrive {new Date(booking.flight.arrives_at).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <h2 className="text-lg font-semibold text-slate-900">Passenger</h2>
                  {booking?.passengers?.[0]?(
                    <>
                      <p className="mt-3 text-sm text-slate-600">{booking.passengers[0].full_name}</p>
                      <p className="mt-2 text-sm text-slate-600">Passport {booking.passengers[0].passport_no}</p>
                      <p className="mt-2 text-sm text-slate-600">{booking.passengers[0].nationality}</p>
                      <p className="mt-2 text-sm text-slate-600">Born {new Date(booking.passengers[0].dob).toLocaleDateString()}</p>
                    </>
                  ) : (
                    <p className="mt-3 text-sm text-slate-600">Passenger information is unavailable.</p>
                  )}
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Button onClick={() => router.push("/bookings")}>View bookings</Button>
                <Button variant="secondary" onClick={() => router.push("/search")}>Search more flights</Button>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 text-slate-600">Booking not found.</div>
          )}
        </div>
      </main>
    </div>
  );
}