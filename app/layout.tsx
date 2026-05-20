import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flight Management App",
  description: "Search, book, and manage flights with realtime seat selection and rescheduling.",
  icons: {
    icon: "/icon-192x192.png"
  }
  ,manifest: "/manifest.json"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg text-navy antialiased">
        <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-white to-[#F8FAFF]">
          <div>{children}</div>
        </div>
      </body>
    </html>
  );
}
