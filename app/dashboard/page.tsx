import Link from "next/link";
import { Ticket, Clock, Calendar, Plane } from "lucide-react";

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-slate-500">Dashboard</p>
            <h1 className="mt-2 text-3xl font-extrabold text-navy">My Bookings</h1>
            <p className="mt-1 text-sm text-slate-600">Overview of your upcoming flights and recent activity.</p>
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <Link href="/search" className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold text-white cta-gradient shadow-blue-soft">
              Book a flight
            </Link>
          </div>
        </div>
      </div>

      <section className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-soft">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Upcoming</p>
              <p className="mt-2 text-2xl font-semibold text-navy">0</p>
            </div>
            <div className="rounded-xl bg-sky-50 p-3 text-sky-600">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-soft">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Confirmed</p>
              <p className="mt-2 text-2xl font-semibold text-navy">0</p>
            </div>
            <div className="rounded-xl bg-green-50 p-3 text-success">
              <Ticket className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-soft">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Recent activity</p>
              <p className="mt-2 text-2xl font-semibold text-navy">—</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 text-slate-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="rounded-3xl bg-white p-8 shadow-soft">
          <h2 className="text-lg font-semibold text-navy">Recent bookings</h2>
          <p className="mt-2 text-sm text-slate-600">You have no recent bookings. Book a flight to see it here.</p>

          <div className="mt-6 flex flex-col items-center justify-center gap-4 border-t border-slate-100 pt-8">
            <div className="text-center">
              <Plane className="mx-auto h-12 w-12 text-sky-400" />
              <p className="mt-4 text-sm text-slate-500">Nothing here yet</p>
              <p className="mt-1 text-sm text-slate-400">Your upcoming flights will appear here once you book.</p>
            </div>

            <div className="w-full max-w-xs">
              <Link href="/search" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white cta-gradient shadow-blue-soft">
                Search flights
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
