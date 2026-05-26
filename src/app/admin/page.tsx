import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatARS } from "@/lib/format";
import { Logo } from "@/components/Logo";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const bookings = await prisma.booking.findMany({
    include: { room: true },
    orderBy: { createdAt: "desc" },
  });

  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
  const upcoming = bookings.filter(b => b.checkIn >= todayStart);
  const totalRevenue = bookings.reduce((s, b) => s + b.totalPrice, 0);
  const totalDeposits = bookings.reduce((s, b) => s + b.depositPaid, 0);

  return (
    <main className="min-h-screen bg-ink-950">
      <nav className="border-b hairline bg-ink-900/60 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href="/"><Logo size={42} /></Link>
            <span className="eyebrow">Panel administración</span>
          </div>
          <Link href="/" className="cta-link">Ver sitio público</Link>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <p className="eyebrow mb-4">Reservas</p>
        <h1 className="font-display text-5xl text-ink-50">Panel de <span className="italic text-gold-300">control</span></h1>
        <span className="rule mt-6 block" />
        <p className="text-ink-100/50 mt-6 italic font-display">
          Esteban Echeverría 3040, Munro · 40 habitaciones
        </p>

        <div className="mt-14 grid md:grid-cols-4 gap-4">
          <Stat label="Reservas totales" value={String(bookings.length)} />
          <Stat label="Próximas" value={String(upcoming.length)} />
          <Stat label="Señas cobradas" value={formatARS(totalDeposits)} accent />
          <Stat label="Facturación bruta" value={formatARS(totalRevenue)} />
        </div>

        <div className="mt-16 border hairline">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b hairline eyebrow !text-[10px]">
            <div className="col-span-2">Código</div>
            <div className="col-span-3">Huésped</div>
            <div className="col-span-2">Habitación</div>
            <div className="col-span-2">Entrada</div>
            <div className="col-span-1">Turnos</div>
            <div className="col-span-2 text-right">Total / Seña</div>
          </div>
          {bookings.length === 0 && (
            <div className="px-6 py-20 text-center text-ink-100/40 italic font-display">
              No hay reservas aún.
            </div>
          )}
          {bookings.map(b => {
            const nights = Math.round((b.checkOut.getTime() - b.checkIn.getTime()) / 86400000);
            return (
              <div key={b.id} className="grid grid-cols-12 gap-4 px-6 py-5 border-b hairline last:border-0 hover:bg-ink-800/40 transition-colors">
                <div className="col-span-2 font-mono text-xs text-gold-300 tracking-widest self-center">
                  {b.id.slice(-8).toUpperCase()}
                </div>
                <div className="col-span-3 self-center">
                  <p className="font-display text-ink-50">{b.guestName}</p>
                  <p className="text-xs text-ink-100/40 italic">{b.guestEmail}</p>
                </div>
                <div className="col-span-2 self-center font-display text-ink-100">{b.room.name}</div>
                <div className="col-span-2 self-center font-display text-ink-100">{b.checkIn.toLocaleDateString("es-AR")}</div>
                <div className="col-span-1 self-center font-display text-ink-100">{nights}</div>
                <div className="col-span-2 text-right self-center">
                  <p className="font-display text-ink-50">{formatARS(b.totalPrice)}</p>
                  <p className="text-xs text-gold-300 italic">Seña: {formatARS(b.depositPaid)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`bg-ink-900/60 border hairline p-8 ${accent ? "border-gold-300/40" : ""}`}>
      <p className="eyebrow">{label}</p>
      <p className={`font-display text-4xl mt-4 ${accent ? "text-gold-300" : "text-ink-50"}`}>{value}</p>
    </div>
  );
}
