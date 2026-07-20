import type { Metadata } from "next";
import { Bebas_Neue, Inter, Geist } from "next/font/google";
import "../globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://krfunverse.com"),
  title: {
    default: `${site.name} | Go-Karting in Ghatkesar, Hyderabad`,
    template: `%s | ${site.name}`,
  },
  description:
    "KR Funverse — Hyderabad's high-octane go-karting, box cricket and indoor games arena in Ghatkesar. Race. Play. Repeat.",
  keywords: [
    "go karting hyderabad",
    "go karting ghatkesar",
    "KR Funverse",
    "box cricket hyderabad",
    "karting near me",
    "yamnampet karting",
  ],
  openGraph: {
    title: `${site.name} | Race. Play. Repeat.`,
    description:
      "High-octane go-karting, box cricket and indoor games in Ghatkesar, Hyderabad.",
    url: "https://krfunverse.com",
    siteName: site.name,
    images: [{ url: "/images/hero.jpg", width: 1600, height: 900, alt: site.name }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | Race. Play. Repeat.`,
    description:
      "High-octane go-karting, box cricket and indoor games in Ghatkesar, Hyderabad.",
    images: ["/images/hero.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={cn("h-full", "antialiased", bebas.variable, inter.variable, "font-sans", geist.variable)}
    >
      <body className="flex min-h-full flex-col bg-ink text-chalk">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingActions />
        </Providers>
      </body>
    </html>
  );
}
