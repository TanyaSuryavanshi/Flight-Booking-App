import { Suspense } from "react";
import BookPageClient from "@/components/book/book-page-client";

export default function BookPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <BookPageClient />
    </Suspense>
  );
}
