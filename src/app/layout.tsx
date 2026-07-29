import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Pinyon_Script } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const pinyon = Pinyon_Script({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-script",
  display: "swap",
});

const title = "Ruta Hotel · Albergue Transitorio en Munro";
const description =
  "La ruta hacia el placer de tus momentos íntimos. Habitaciones premium con jacuzzi, cochera y room service. Abierto las 24 hs en Munro, Vicente López.";

export const metadata: Metadata = {
  metadataBase: new URL("https://hotel-transitorio.vercel.app"),
  title,
  description,
  openGraph: {
    title,
    description,
    url: "https://hotel-transitorio.vercel.app",
    siteName: "Ruta Hotel",
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${cormorant.variable} ${inter.variable} ${pinyon.variable}`}>
      <body className="min-h-screen bg-ink-950 text-ink-50 antialiased">
        {children}
      </body>
    </html>
  );
}
