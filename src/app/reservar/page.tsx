import { prisma } from "@/lib/db";
import ReservationForm from "@/components/ReservationForm";
import { Logo } from "@/components/Logo";
import Link from "next/link";

export default async function ReservarPage({ searchParams }: { searchParams: { room?: string } }) {
  const rooms = await prisma.room.findMany({ orderBy: { pricePerNight: "asc" } });
  const preselected = searchParams.room;

  return (
    <main className="min-h-screen">
      <nav className="border-b hairline bg-night-900/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <Logo size={38} />
          </Link>
          <Link href="/" className="text-xs eyebrow hover:text-rose-400 transition-colors">← Volver</Link>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <p className="eyebrow mb-4">Reserva</p>
        <h1 className="font-display text-5xl lg:text-6xl text-night-50">Reservá tu <span className="italic text-rose-400">habitación</span>.</h1>
        <p className="mt-6 text-night-200 max-w-md leading-relaxed">
          Completá el formulario en 3 pasos. Recibirás la confirmación por email
          y abonarás la seña por Mercado Pago.
        </p>

        <div className="mt-16">
          <ReservationForm rooms={rooms} preselectedRoomId={preselected} />
        </div>
      </section>
    </main>
  );
}
