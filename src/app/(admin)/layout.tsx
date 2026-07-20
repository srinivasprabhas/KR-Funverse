import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/dashboard/theme-provider";
import { BookingStoreProvider } from "@/lib/dashboard/store";
import { Toaster } from "@/components/ui/sonner";

/**
 * Admin root layout — deliberately independent of the marketing root at
 * `(site)/layout.tsx`. This app is destined to move to admin.<domain> and must
 * stay liftable, so nothing here imports marketing code, fonts or tokens.
 */

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: "Bookings | KR Funverse Admin",
    template: "%s | KR Funverse Admin",
  },
  description: "Slot and booking management for KR Funverse.",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`h-full antialiased ${geist.variable}`} suppressHydrationWarning>
      {/* data-app opts this document out of the marketing body styles in globals.css. */}
      <body
        data-app="admin"
        className="min-h-full bg-background font-sans text-foreground"
      >
        <ThemeProvider>
          <BookingStoreProvider>{children}</BookingStoreProvider>
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
