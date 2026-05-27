export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/db";
import ReservationForm from "@/components/ReservationForm";
import { Logo } from "@/components/Logo";

export default async function ReservarPage({
  searchParams,
}: {
  searchParams: { room?: string; date?: string };
}) {
  const rooms = await prisma.room.findMany({ orderBy: { pricePerNight: "asc" } });

  return (
    <main className="min-h-screen">
      <nav className="border-b hairline bg-ink-900/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/">
            <Logo size={42} />
          </Link>
          <Link href="/" className="cta-link">← Volver</Link>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <p className="eyebrow mb-6">Reserva</p>
        <h1 className="font-display text-5xl lg:text-7xl text-ink-50 leading-tight">
          Reservá tu <span className="italic text-gold-300">habitación</span>.
        </h1>
        <span className="rule mt-8 block" />
        <p className="mt-8 text-ink-100/70 italic font-display text-lg max-w-md">
          Tres pasos. Sin protocolos. Recibís confirmación por email y abonás la seña por Mercado Pago.
        </p>

        <div className="mt-20">
          <ReservationForm
            rooms={rooms}
            preselectedRoomId={searchParams.room}
            initialDate={searchParams.date}
          />
        </div>
      </section>
    </main>
  );
}
