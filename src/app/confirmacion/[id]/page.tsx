import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatARS, nightsBetween } from "@/lib/format";
import { Logo } from "@/components/Logo";

export default async function ConfirmacionPage({ params }: { params: { id: string } }) {
  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: { room: true }
  });
  if (!booking) notFound();

  const nights = nightsBetween(booking.checkIn, booking.checkOut);

  return (
    <main className="min-h-screen">
      <nav className="border-b hairline">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <Logo size={38} />
          </Link>
        </div>
      </nav>

      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-rose-500 rounded-full mb-8">
          <svg viewBox="0 0 24 24" className="w-7 h-7 stroke-rose-400" fill="none" strokeWidth="1.5"><path d="M5 12l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <p className="eyebrow mb-4">Reserva confirmada</p>
        <h1 className="font-display text-5xl lg:text-6xl text-night-50">Te <span className="italic text-rose-400">esperamos</span>, {booking.guestName.split(" ")[0]}.</h1>
        <p className="mt-6 text-night-200">
          Te enviamos los detalles a <span className="text-night-50">{booking.guestEmail}</span>.
        </p>

        <div className="mt-16 text-left border hairline bg-night-800/40">
          <div className="p-6 border-b hairline flex justify-between items-center bg-night-900">
            <span className="eyebrow">Código de reserva</span>
            <span className="font-mono text-sm text-rose-400">{booking.id.slice(-8).toUpperCase()}</span>
          </div>
          <div className="p-6 space-y-4">
            <Row label="Habitación" value={booking.room.name} />
            <Row label="Categoría" value={booking.room.type} />
            <Row label="Entrada" value={booking.checkIn.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })} />
            <Row label="Salida" value={booking.checkOut.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })} />
            <Row label="Turnos" value={String(nights)} />
            <Row label="Total" value={formatARS(booking.totalPrice)} />
            <Row label="Seña abonada" value={formatARS(booking.depositPaid)} accent />
            <Row label="Saldo al llegar" value={formatARS(booking.totalPrice - booking.depositPaid)} />
          </div>
        </div>

        <p className="mt-10 text-sm text-night-300">
          Esteban Echeverría 3040, Munro · Entrada por cochera privada
        </p>

        <Link href="/" className="btn-ghost mt-8 inline-flex">← Volver al inicio</Link>
      </section>
    </main>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between py-3 border-b hairline last:border-0">
      <span className="text-sm text-night-300">{label}</span>
      <span className={`text-sm ${accent ? "text-rose-400 font-medium" : "text-night-50"}`}>{value}</span>
    </div>
  );
}
