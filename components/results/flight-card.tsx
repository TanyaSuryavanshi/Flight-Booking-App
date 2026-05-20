"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FlightStatus } from "@/lib/types/db";
import { useFlightStore } from "@/store/flight-store";
import Button from "@/components/ui/button";

export type FlightCardProps = {
  id: string;
  flight_no: string;
  origin: string;
  destination: string;
  departs_at: string;
  arrives_at: string;
  aircraft_type: string;
  status: FlightStatus;
  base_price: number;
};

export default function FlightCard({ id, flight_no, origin, destination, departs_at, arrives_at, aircraft_type, status, base_price }: FlightCardProps) {
  const router = useRouter();
  const setSelectedFlight = useFlightStore((state) => state.setSelectedFlight);

  const handleSelectFlight = () => {
    setSelectedFlight({
      flightId: id,
      flightNo: flight_no,
      origin,
      destination,
      departsAt: departs_at,
      arrivesAt: arrives_at,
      aircraftType: aircraft_type,
      status,
      basePrice: base_price
    });
    router.push(`/book?flightId=${encodeURIComponent(id)}`);
  };

  const badgeClass = () => {
    if (status === "on-time") return "bg-success/10 text-success ring-1 ring-success/20";
    if (status === "cancelled") return "bg-danger/10 text-danger ring-1 ring-danger/20";
    if (status === "delayed") return "bg-yellow-100 text-amber-600 ring-1 ring-amber-100";
    if (status === "boarding") return "bg-sky-50 text-primary ring-1 ring-sky-100";
    return "bg-slate-100 text-slate-700";
  };

  return (
    <article className="rounded-3xl bg-white p-6 shadow-lg transition-transform duration-300 hover:-translate-y-1">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">{flight_no}</p>
          <h2 className="mt-2 text-2xl font-semibold text-navy">
            {origin} → {destination}
          </h2>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${badgeClass()}`}>
          {status}
        </span>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-sm text-slate-500">Departure</p>
          <p className="mt-1 text-lg font-semibold text-navy">{new Date(departs_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Arrival</p>
          <p className="mt-1 text-lg font-semibold text-navy">{new Date(arrives_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Base fare</p>
          <p className="mt-1 text-lg font-semibold text-navy">${base_price.toFixed(2)}</p>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button onClick={handleSelectFlight} className="w-full sm:w-auto">
          Select flight
        </Button>
      </div>
    </article>
  );
}
