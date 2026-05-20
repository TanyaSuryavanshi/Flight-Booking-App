import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-3 text-lg font-semibold text-slate-900">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">✈</span>
          Flight Management
        </Link>
        <nav className="flex items-center gap-4 text-sm text-slate-700">
          <Link href="/search" className="hover:text-slate-900">
            Search
          </Link>
          <Link href="/bookings" className="hover:text-slate-900">
            My Bookings
          </Link>
        </nav>
      </div>
    </header>
  );
}
