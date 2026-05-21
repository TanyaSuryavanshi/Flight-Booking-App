import { Suspense } from "react";
import ConfirmationPageClient from "@/components/book/book-page-client";

export default function ConfirmationPage() {
return (
   <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
        <ConfirmationPageClient />
      </Suspense>
);
}
