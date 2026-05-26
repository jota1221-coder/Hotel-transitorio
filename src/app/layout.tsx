import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ruta Hotel · Albergue Transitorio en Munro",
  description: "La ruta hacia el placer de tus momentos íntimos. Habitaciones premium con jacuzzi, cochera y room service. Abierto las 24 hs en Munro, Vicente López.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-night-900 text-night-50 antialiased">{children}</body>
    </html>
  );
}
