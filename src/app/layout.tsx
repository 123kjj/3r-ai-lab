import type { Metadata, Viewport } from "next";
import { Fredoka, Nunito, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { AuthProvider } from "@/context/AuthContext";
import { ImpactProvider } from "@/context/ImpactContext";

// Editorial serif for major headings — distinctive, field-journal feel.
const serif = Fredoka({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["500", "600", "700"],
});

// Clean sans for interface text and body copy.
const sans = Nunito({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "600", "700", "800"],
});

// Monospace for data/figures (emissions values, units) — gives the
// "material science lab" data a deliberate, instrument-readout feel.
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "3R-AI: Sort, Learn, Reuse",
  description:
    "An evidence-based material intelligence platform: check an everyday item and compare its realistic reuse, recycling and disposal futures, backed by sourced EPA data.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#E8F6FF",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body className="font-sans bg-paper text-charcoal-800">
        <AuthProvider>
          <ImpactProvider>
            <Nav />
            <main className="pb-24 md:pb-0">{children}</main>
          </ImpactProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
