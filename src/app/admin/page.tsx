import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatARS } from "@/lib/format";
import { Logo } from "@/components/Logo";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const bookings = await prisma.booking.findMany({
    include: { room: true },
    orderBy: { createdAt: "desc" }
  });

  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
  const upcoming = bookings.filter(b => b.checkIn >= todayStart);
  const totalRevenue = bookings.reduce((s, b) => s + b.totalPrice, 0);
  const totalDeposits = bookings.reduce((s, b) => s + b.depositPaid, 0);

  return (
    <main className="min-h-screen bg-night-950">
      <nav className="border-b hairline bg-night-900">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/">
              <Logo size={36} />
            </Link>
            <span className="eyebrow">Panel administración</span>
          </div>
          <Link href="/" className="text-xs eyebrow hover:text-rose-400 transition-colors">Ver sitio público →</Link>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="font-display text-4xl text-night-50">Reservas</h1>
        <p className="text-night-300 text-sm mt-2">Esteban Echeverría 3040, Munro · 40 habitaciones</p>

        {/* Stats */}
        <div className="mt-10 grid md:grid-cols-4 gap-4">
          <Stat label="Reservas totales" value={String(bookings.length)} />
          <Stat label="Próximas" value={String(upcoming.length)} />
          <Stat label="Señas cobradas" value={formatARS(totalDeposits)} accent />
          <Stat label="Facturación bruta" value={formatARS(totalRevenue)} />
        </div>

        {/* Tabla */}
        <div className="mt-12 bg-night-900 border hairline">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b hairline eyebrow !text-[10px]">
            <div className="col-span-2">Código</div>
            <div className="col-span-3">Huésped</div>
            <div className="col-span-2">Habitación</div>
            <div className="col-span-2">Entrada</div>
            <div className="col-span-1">Turnos</div>
            <div className="col-span-2 text-right">Total / Seña</div>
          </div>
          {bookings.length === 0 && (
            <div className="px-6 py-16 text-center text-night-400 text-sm">No hay reservas aún.</div>
          )}
          {bookings.map(b => {
            const nights = Math.round((b.checkOut.getTime() - b.checkIn.getTime()) / 86400000);
            return (
              <div key={b.id} className="grid grid-cols-12 gap-4 px-6 py-4 border-b hairline last:border-0 text-sm hover:bg-night-800/40">
                <div className="col-span-2 font-mono text-xs text-rose-400">{b.id.slice(-8).toUpperCase()}</div>
                <div className="col-span-3">
                  <p className="text-night-50">{b.guestName}</p>
                  <p className="text-xs text-night-400">{b.guestEmail}</p>
                </div>
                <div className="col-span-2 text-night-100">{b.room.name}</div>
                <div className="col-span-2 text-night-100">{b.checkIn.toLocaleDateString("es-AR")}</div>
                <div className="col-span-1 text-night-100">{nights}</div>
                <div className="col-span-2 text-right">
                  <p className="font-medium text-night-50">{formatARS(b.totalPrice)}</p>
                  <p className="text-xs text-rose-400">Seña: {formatARS(b.depositPaid)}</p>
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
    <div className={`bg-night-900 border hairline p-6 ${accent ? "border-rose-500/40" : ""}`}>
      <p className="eyebrow">{label}</p>
      <p className={`font-display text-4xl mt-3 ${accent ? "text-rose-400" : "text-night-50"}`}>{value}</p>
    </div>
  );
}
