import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-white">
      <div className="rounded-3xl border border-white/10 bg-slate-900/95 p-10 text-center shadow-soft">
        <h1 className="text-4xl font-semibold">Offline mode</h1>
        <p className="mt-4 max-w-xl text-slate-300">
          You are offline. Cached search and booking information is available while the app reconnects.
        </p>
        <Link href="/" className="mt-8 inline-flex rounded-2xl bg-white px-5 py-3 text-slate-950 transition hover:bg-slate-100">
          Return home
        </Link>
      </div>
    </main>
  );
}
