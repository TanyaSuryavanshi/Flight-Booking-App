"use client";

import { useEffect, useMemo, useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import type { SeatClass } from "@/lib/types/db";

export type SeatData = {
  id: string;
  flight_id: string;
  seat_number: string;
  class: SeatClass;
  is_available: boolean;
  extra_fee: number;
};

type SeatMapProps = {
  flightId: string;
  initialSeats: SeatData[];
  selectedSeatId: string | null;
  onSelectSeat: (seat: SeatData) => void;
};

const seatsByClass = (seats: SeatData[]) => {
  return ["first", "business", "economy"].map((seatClass) => ({
    seatClass: seatClass as SeatClass,
    seats: seats.filter((seat) => seat.class === seatClass)
  }));
};

export default function SeatMap({ flightId, initialSeats, selectedSeatId, onSelectSeat }: SeatMapProps) {
  const [seats, setSeats] = useState<SeatData[]>(initialSeats);
  const grouped = useMemo(() => seatsByClass(seats), [seats]);

  useEffect(() => {
    const channel = supabaseClient
      .channel(`public:seats:flight:${flightId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "seats", filter: `flight_id=eq.${flightId}` },
        (payload) => {
          setSeats((current) =>
            current.map((seat) => (seat.id === payload.new.id ? { ...seat, is_available: payload.new.is_available } : seat))
          );
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [flightId]);

  return (
    <div className="space-y-8 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
      <div className="overflow-x-auto pb-2">
        <div className="grid gap-6 md:grid-cols-3">
          {grouped.map(({ seatClass, seats }) => (
            <div key={seatClass} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-base font-semibold text-slate-900">{seatClass.charAt(0).toUpperCase() + seatClass.slice(1)}</h3>
              <p className="mt-1 text-sm text-slate-500">{seats.length} seats</p>
              <div className="mt-4 grid gap-3">
                {seats.map((seat) => {
                  const isSelected = selectedSeatId === seat.id;
                  return (
                    <button
                      key={seat.id}
                      type="button"
                      disabled={!seat.is_available}
                      onClick={() => onSelectSeat(seat)}
                      className={`rounded-3xl border px-4 py-3 text-left text-sm transition-all duration-200 ease-in-out ${
                        seat.is_available
                          ? isSelected
                            ? "border-primary bg-sky-50 text-navy shadow-md"
                            : "border-slate-200 bg-white text-navy hover:border-primary hover:bg-sky-50/50"
                          : "cursor-not-allowed border-danger/20 bg-danger/10 text-danger/70"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold">{seat.seat_number}</span>
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-600">
                          {seat.is_available ? "Available" : "Booked"}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-slate-500">Extra ${seat.extra_fee.toFixed(2)}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 sm:grid-cols-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-3 w-3 rounded-full bg-success" /> Available seat
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex h-3 w-3 rounded-full bg-danger" /> Occupied seat
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex h-3 w-3 rounded-full bg-primary" /> Your selected seat
        </div>
      </div>
    </div>
  );
}
