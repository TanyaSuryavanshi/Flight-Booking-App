"use client";

import Link from "next/link";
import { ArrowRight, Plane, Calendar, MapPin } from "lucide-react";

export default function HeroLanding() {
  return (
    <section className="relative overflow-hidden py-16">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#E6F7FF] via-white to-[#F8FAFF] opacity-80" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-slate-500">Welcome aboard</p>
            <h1 className="text-4xl font-extrabold leading-tight text-navy sm:text-5xl">
              Book smarter. Fly happier.
            </h1>
            <p className="max-w-xl text-lg text-slate-600">flight booking and management with realtime seat selection, rescheduling, and clean receipts.</p>

            <div className="flex flex-wrap items-center gap-4">
              <Link href="/search" className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-white cta-gradient shadow-blue-soft transition-transform hover:-translate-y-0.5">
                Search flights
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/bookings" className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-medium text-navy bg-white border border-slate-100 shadow-sm hover:shadow-lg">
                My bookings
              </Link>
            </div>

            <div className="mt-6 flex items-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-sky-500" />
                <span>Realtime availability</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-sky-500" />
                <span>Global routes</span>
              </div>
            </div>
          </div>

          <div aria-hidden className="hidden lg:block" />
        </div>
      </div>
    </section>
  );
}
