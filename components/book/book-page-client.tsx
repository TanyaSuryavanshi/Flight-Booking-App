"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFlightStore } from "@/store/flight-store";
import { useUserStore } from "@/store/user-store";
import { supabaseClient } from "@/lib/supabase/client";
import { generatePnr } from "@/lib/helpers/pnr";
import { passengerSchema } from "@/lib/validations/passenger";
import type { Database } from "@/lib/types/db";
import type { SeatData } from "@/components/seat-map/seat-map";
import Button from "@/components/ui/button";
import SiteHeader from "@/components/layout/site-header";
import PassengerForm from "@/components/booking/passenger-form";
import SeatMap from "@/components/seat-map/seat-map";

export default function BookPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedFlight, selectedSeat, setSelectedFlight, setSelectedSeat, passengerForm, updatePassengerForm } = useFlightStore();
  const session = useUserStore((state) => state.session);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validation, setValidation] = useState<Partial<Record<keyof typeof passengerForm, string>>>({});
  const [seats, setSeats] = useState<SeatData[]>([]);

  const flightId = searchParams.get("flightId") || selectedFlight?.flightId;

  useEffect(() => {
    if (!selectedFlight && flightId) {
      const loadFlight = async () => {
        const { data } = await supabaseClient
          .from("flights")
          .select("id, flight_no, origin, destination, departs_at, arrives_at, aircraft_type, status, base_price")
          .eq("id", flightId)
          .single();

        const flightData = data as Database["public"]["Tables"]["flights"]["Row"] | null;

        if (flightData) {
          setSelectedFlight({
            flightId: flightData.id,
            flightNo: flightData.flight_no,
            origin: flightData.origin,
            destination: flightData.destination,
            departsAt: flightData.departs_at,
            arrivesAt: flightData.arrives_at,
            aircraftType: flightData.aircraft_type,
            status: flightData.status,
            basePrice: flightData.base_price
          });
        }
      };

      void loadFlight();
    }
  }, [flightId, selectedFlight, setSelectedFlight]);

  const totalPrice = useMemo(() => {
    if (!selectedFlight || !selectedSeat) return 0;
    return selectedFlight.basePrice + selectedSeat.extraFee;
  }, [selectedFlight, selectedSeat]);

  const handleLoadSeats = async () => {
    if (!flightId) {
      setError("Missing flight selection.");
      return;
    }

    const { data, error: loadError } = await supabaseClient
      .from("seats")
      .select("id, flight_id, seat_number, class, is_available, extra_fee")
      .eq("flight_id", flightId)
      .order("seat_number", { ascending: true });

    if (loadError) {
      setError(loadError.message);
      return;
    }

    setSeats(data ?? []);
  };

  useEffect(() => {
    if (flightId) {
      void handleLoadSeats();
    }
  }, [flightId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const passengerValidation = passengerSchema.safeParse(passengerForm);
    if (!passengerValidation.success) {
      setValidation(passengerValidation.error.flatten().fieldErrors as Record<string, string>);
      return;
    }

    if (!selectedSeat || !selectedFlight) {
      setError("Please select a seat and flight before continuing.");
      return;
    }

    if (!session) {
      setError("You must sign in before you can confirm a booking.");
      router.push("/auth/sign-in");
      return;
    }

    setIsLoading(true);

    const pnr = generatePnr();
    const { data, error: checkoutError } = await supabaseClient.rpc(
      "create_booking",
      {
        user_uuid: session.userId,
        flight_uuid: selectedFlight.flightId,
        seat_uuid: selectedSeat.seatId,
        passenger_full_name: passengerForm.fullName,
        passenger_passport_no: passengerForm.passportNo,
        passenger_nationality: passengerForm.nationality,
        passenger_dob: passengerForm.dob,
        total: totalPrice,
        pnr
      } as any
    );

    setIsLoading(false);

    if (checkoutError) {
      setError(checkoutError.message);
      return;
    }

    router.push(`/confirmation?bookingId=${(data as { id: string })?.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
          <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Confirm booking</p>
                <h1 className="text-3xl font-semibold text-slate-900">Seat selection and passenger details</h1>
              </div>
              <Button variant="secondary" onClick={handleLoadSeats}>
                Load seats
              </Button>
            </div>
            {error ? <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}
            {seats.length > 0 ? (
              <SeatMap
                flightId={flightId!}
                initialSeats={seats}
                selectedSeatId={selectedSeat?.seatId ?? null}
                onSelectSeat={(seat) => setSelectedSeat({ seatId: seat.id, seatNumber: seat.seat_number, seatClass: seat.class, extraFee: seat.extra_fee })}
              />
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-600 shadow-soft">
                Press &quot;Load seats&quot; to view the real-time map for this flight.
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <PassengerForm passengerForm={passengerForm} onChange={updatePassengerForm} errors={validation} />
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-soft sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-600">Estimated total price</p>
                  <p className="mt-1 text-3xl font-semibold text-slate-900">${totalPrice.toFixed(2)}</p>
                </div>
                <Button type="submit" className="w-full sm:w-auto" disabled={isLoading || seats.length === 0 || !selectedSeat}>
                  {isLoading ? "Confirming booking..." : "Confirm booking"}
                </Button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
