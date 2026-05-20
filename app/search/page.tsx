import SiteHeader from "@/components/layout/site-header";
import FlightSearchForm from "@/components/search/flight-search-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/types/db";

export default async function SearchPage() {
  let origins: string[] = [];
  let destinations: string[] = [];

  // If Supabase isn't configured at build time, avoid calling the server client
  // so static builds or environments without env vars don't fail.
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = createSupabaseServerClient();

    const { data: originData } = await supabase
      .from("flights")
      .select("origin", { distinct: true })
      .order("origin", { ascending: true });

    const { data: destinationData } = await supabase
      .from("flights")
      .select("destination", { distinct: true })
      .order("destination", { ascending: true });

    origins = (originData as { origin: string }[] | null)?.map((row) => row.origin) ?? [];
    destinations = (destinationData as { destination: string }[] | null)?.map((row) => row.destination) ?? [];
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-blue-700 p-10 text-white shadow-soft">
            <div className="max-w-xl space-y-6">
              <p className="text-sm uppercase tracking-[0.26em] text-slate-300">Book your next trip</p>
              <h1 className="text-4xl font-semibold leading-tight">Search flights, choose seats, and confirm bookings in one flow.</h1>
              <p className="text-base leading-7 text-slate-300">
                Enter your route and date to compare available flights with dynamic pricing, realtime seat statuses, and a clean booking experience.
              </p>
            </div>
          </section>
          <section className="rounded-[2rem] bg-white p-8 shadow-soft">
            <h2 className="text-2xl font-semibold text-slate-900">Flight search</h2>
            <p className="mt-2 text-sm text-slate-600">Start with a quick search and continue to booking details next.</p>
            <div className="mt-8">
              <FlightSearchForm origins={origins} destinations={destinations} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
