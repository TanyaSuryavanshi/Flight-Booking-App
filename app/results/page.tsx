import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FlightCard from "@/components/results/flight-card";
import SiteHeader from "@/components/layout/site-header";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { flightSearchSchema } from "@/lib/validations/flight";
import type { Database } from "@/lib/types/db";

export const metadata: Metadata = {
  title: "Flight results | Flight Management App"
};

type ResultsPageProps = {
  searchParams: {
    origin?: string;
    destination?: string;
    departureDate?: string;
    passengers?: string;
  };
};

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const parsed = flightSearchSchema.safeParse({
    origin: searchParams.origin ?? "",
    destination: searchParams.destination ?? "",
    departureDate: searchParams.departureDate ?? "",
    passengers: searchParams.passengers ?? "1"
  });

  if (!parsed.success) {
    notFound();
  }

  const { origin, destination, departureDate, passengers } = parsed.data;
  const supabase = createSupabaseServerClient();

  const start = `${departureDate}T00:00:00Z`;
  const end = `${departureDate}T23:59:59Z`;

  const { data, error } = await supabase
    .from("flights")
    .select("id, flight_no, origin, destination, departs_at, arrives_at, aircraft_type, status, base_price")
    .eq("origin", origin)
    .eq("destination", destination)
    .gte("departs_at", start)
    .lte("departs_at", end)
    .order("departs_at", { ascending: true });

  const flights = (data as Database["public"]["Tables"]["flights"]["Row"][] | null) ?? [];

  if (error) {
    throw new Error(error.message);
  }

  const routeSummary = flights?.length
    ? `${flights[0].origin} → ${flights[0].destination}`
    : `${origin} → ${destination}`;

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
          <h1 className="text-3xl font-semibold text-slate-900">Flight results</h1>
          <p className="mt-2 text-sm text-slate-600">
            {flights?.length ? `${flights.length} flight${flights.length > 1 ? "s" : ""} found for ${routeSummary} on ${departureDate}` : "No flights matched your search."}
          </p>
        </div>
        <div className="grid gap-6">
          {flights?.length ? (
            flights.map((flight) => <FlightCard key={flight.id} {...flight} />)
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-soft">
              No flights matched these filters. Try adjusting your route or departure date.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
