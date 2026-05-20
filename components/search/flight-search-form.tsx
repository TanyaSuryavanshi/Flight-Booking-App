"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFlightStore } from "@/store/flight-store";
import Button from "@/components/ui/button";

type FlightSearchFormProps = {
  origins: string[];
  destinations: string[];
};

const selectClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

export default function FlightSearchForm({ origins, destinations }: FlightSearchFormProps) {
  const router = useRouter();
  const { activeSearchQuery, setSearchQuery } = useFlightStore();
  const [formState, setFormState] = useState(activeSearchQuery);
  const [errors, setErrors] = useState({ origin: "", destination: "", departureDate: "" });

  const handleChange = (field: keyof typeof formState, value: string | number) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = {
      origin: formState.origin.trim() ? "" : "Origin is required.",
      destination: formState.destination.trim() ? "" : "Destination is required.",
      departureDate: formState.departureDate ? "" : "Departure date is required."
    };

    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    setSearchQuery(formState);
    router.push(`/results?origin=${encodeURIComponent(formState.origin)}&destination=${encodeURIComponent(formState.destination)}&departureDate=${encodeURIComponent(formState.departureDate)}&passengers=${formState.passengers}`);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:grid-cols-2">
      <label className="space-y-2 text-sm text-slate-700">
        <span className="font-medium">Origin</span>
        <select
          className={selectClass}
          value={formState.origin}
          onChange={(event) => handleChange("origin", event.target.value)}
        >
          <option value="">Select origin</option>
          {origins.map((origin) => (
            <option key={origin} value={origin}>
              {origin}
            </option>
          ))}
        </select>
        {errors.origin ? <span className="text-xs text-red-600">{errors.origin}</span> : null}
      </label>

      <label className="space-y-2 text-sm text-slate-700">
        <span className="font-medium">Destination</span>
        <select
          className={selectClass}
          value={formState.destination}
          onChange={(event) => handleChange("destination", event.target.value)}
        >
          <option value="">Select destination</option>
          {destinations.map((destination) => (
            <option key={destination} value={destination}>
              {destination}
            </option>
          ))}
        </select>
        {errors.destination ? <span className="text-xs text-red-600">{errors.destination}</span> : null}
      </label>

      <label className="space-y-2 text-sm text-slate-700">
        <span className="font-medium">Departure Date</span>
        <input
          className={selectClass}
          type="date"
          value={formState.departureDate}
          onChange={(event) => handleChange("departureDate", event.target.value)}
        />
        {errors.departureDate ? <span className="text-xs text-red-600">{errors.departureDate}</span> : null}
      </label>

      <label className="space-y-2 text-sm text-slate-700">
        <span className="font-medium">Passengers</span>
        <input
          className={selectClass}
          type="number"
          min={1}
          value={formState.passengers}
          onChange={(event) => handleChange("passengers", Number(event.target.value))}
        />
      </label>

      <div className="sm:col-span-2">
        <Button type="submit" className="w-full">
          Search flights
        </Button>
      </div>
    </form>
  );
}
