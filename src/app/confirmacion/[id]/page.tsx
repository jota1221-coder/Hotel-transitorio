import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatARS } from "@/lib/format";
import { Logo } from "@/components/Logo";

export default async function ConfirmacionPage({ params }: { params: { id: string } }) {
  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: { room: true },
  });
  if (!booking) notFound();

  return (
    <main className="min-h-screen">
      <nav className="border-b hairline">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/"><Logo size={42} /></Link>
        </div>
      </nav>

      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 border border-gold-300/60 rounded-full mb-10">
          <svg viewBox="0 0 24 24" className="w-7 h-7 stroke-gold-300" fill="none" strokeWidth="1.2">
            <path d="M5 12l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="eyebrow mb-6">Reserva confirmada</p>
        <h1 className="font-display text-5xl lg:text-7xl text-ink-50 leading-tight font-light">
          Te <span className="italic text-gold-300">esperamos</span>,<br/>
          <span className="font-script text-gold-300 text-6xl lg:text-8xl block py-3">
            {booking.guestName.split(" ")[0]}
          </span>
        </h1>
        <div className="flex justify-center mt-8"><span className="rule rule-gold" /></div>
        <p className="mt-10 text-ink-100/70 italic font-display">
          Enviamos los detalles a <span className="text-ink-50 not-italic">{booking.guestEmail}</span>
        </p>

        <div className="mt-16 text-left border hairline bg-ink-900/40">
          <div className="p-6 border-b hairline flex justify-between items-center">
            <span className="eyebrow">Código</span>
            <span className="font-mono text-sm text-gold-300 tracking-widest">
              {booking.id.slice(-8).toUpperCase()}
            </span>
          </div>
          <div className="p-8 space-y-5">
            <Row label="Habitación" value={booking.room.name} />
            <Row label="Categoría" value={booking.room.type} />
            <Row label="Tipo" value={booking.type === "pernocte" ? "Pernocte" : "Turno"} />
            <Row label="Día" value={booking.date.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })} />
            <Row label="Horario" value={`${booking.startTime} → ${booking.endTime}`} />
            <Row label="Duración" value={`${booking.durationHours} horas`} />
            <Row label="Total" value={formatARS(booking.totalPrice)} />
            <Row label="Seña abonada" value={formatARS(booking.depositPaid)} accent />
            <Row label="Saldo al llegar" value={formatARS(booking.totalPrice - booking.depositPaid)} />
          </div>
        </div>

        <p className="mt-12 text-sm text-ink-100/60 italic font-display">
          Esteban Echeverría 3040, Munro · Entrada por cochera privada
        </p>

        <Link href="/" className="cta-link mt-12 inline-block">Volver al inicio</Link>
      </section>
    </main>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between items-baseline py-2 border-b hairline last:border-0">
      <span className="text-xs text-ink-100/50 italic font-display">{label}</span>
      <span className={`font-display ${accent ? "text-gold-300 text-lg" : "text-ink-50"}`}>{value}</span>
    </div>
  );
}
