"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatARS, nightsBetween } from "@/lib/format";

type Room = {
  id: string;
  name: string;
  type: string;
  pricePerNight: number;
  capacity: number;
  imageUrl: string;
};

export default function ReservationForm({ rooms, preselectedRoomId }: { rooms: Room[]; preselectedRoomId?: string }) {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  const [roomId, setRoomId] = useState(preselectedRoomId || rooms[0]?.id || "");
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected = useMemo(() => rooms.find(r => r.id === roomId), [rooms, roomId]);
  const nights = useMemo(() => nightsBetween(new Date(checkIn), new Date(checkOut)), [checkIn, checkOut]);
  const total = (selected?.pricePerNight ?? 0) * nights;
  const deposit = Math.round(total * 0.3);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, checkIn, checkOut, guestName, guestEmail, guestPhone, website })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear la reserva");
      router.push(`/confirmacion/${data.id}`);
    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid lg:grid-cols-5 gap-12">
      {/* Honeypot — campo oculto para bots. Los humanos no lo ven. */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={e => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: 0 }}
      />
      <div className="lg:col-span-3 space-y-12">
        {/* Habitación */}
        <fieldset>
          <legend className="eyebrow mb-6">1 · Elegí la habitación</legend>
          <div className="space-y-3">
            {rooms.map((room) => (
              <label key={room.id} className={`flex gap-5 p-4 cursor-pointer border transition-all ${roomId === room.id ? "border-rose-500 bg-rose-500/5" : "border-night-700 hover:border-night-400"}`}>
                <input type="radio" name="room" value={room.id} checked={roomId === room.id} onChange={() => setRoomId(room.id)} className="sr-only" />
                <img src={room.imageUrl} alt={room.name} className="w-24 h-24 object-cover" />
                <div className="flex-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-display text-xl text-night-50">{room.name}</h3>
                    <span className="eyebrow">{room.type}</span>
                  </div>
                  <p className="text-xs text-night-300 mt-1">Hasta {room.capacity} {room.capacity === 1 ? "persona" : "personas"}</p>
                  <p className="mt-3 font-medium text-sm text-night-50">{formatARS(room.pricePerNight)} <span className="text-night-300">/turno</span></p>
                </div>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Fechas */}
        <fieldset>
          <legend className="eyebrow mb-6">2 · Fecha y horario</legend>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="text-xs text-night-300 block mb-2">Entrada</label>
              <input type="date" min={today} value={checkIn} onChange={e => setCheckIn(e.target.value)} className="input" required />
            </div>
            <div>
              <label className="text-xs text-night-300 block mb-2">Salida</label>
              <input type="date" min={checkIn} value={checkOut} onChange={e => setCheckOut(e.target.value)} className="input" required />
            </div>
          </div>
          <p className="text-xs text-night-300 mt-4">{nights} {nights === 1 ? "noche" : "noches"} · Pernocte incluye desayuno</p>
        </fieldset>

        {/* Datos */}
        <fieldset>
          <legend className="eyebrow mb-6">3 · Tus datos</legend>
          <div className="space-y-6">
            <div>
              <label className="text-xs text-night-300 block mb-2">Nombre y apellido</label>
              <input value={guestName} onChange={e => setGuestName(e.target.value)} className="input" required />
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="text-xs text-night-300 block mb-2">Email</label>
                <input type="email" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} className="input" required />
              </div>
              <div>
                <label className="text-xs text-night-300 block mb-2">Teléfono</label>
                <input type="tel" value={guestPhone} onChange={e => setGuestPhone(e.target.value)} className="input" required />
              </div>
            </div>
          </div>
        </fieldset>
      </div>

      {/* Resumen */}
      <aside className="lg:col-span-2">
        <div className="lg:sticky lg:top-8 border hairline p-8 bg-night-800/50 backdrop-blur">
          <p className="eyebrow mb-6">Resumen</p>
          {selected && (
            <>
              <div className="flex justify-between text-sm py-3 border-b hairline">
                <span className="text-night-300">Habitación</span>
                <span className="text-night-50">{selected.name}</span>
              </div>
              <div className="flex justify-between text-sm py-3 border-b hairline">
                <span className="text-night-300">{nights} {nights === 1 ? "turno" : "turnos"} × {formatARS(selected.pricePerNight)}</span>
                <span className="text-night-50">{formatARS(total)}</span>
              </div>
              <div className="flex justify-between text-base py-4 border-b hairline">
                <span className="text-night-100">Total</span>
                <span className="font-display text-2xl text-night-50">{formatARS(total)}</span>
              </div>
              <div className="mt-6 p-4 bg-rose-500/10 border border-rose-500/30">
                <p className="eyebrow !text-rose-400 mb-2">Seña 30%</p>
                <p className="font-display text-3xl text-rose-400">{formatARS(deposit)}</p>
                <p className="text-xs text-night-200 mt-2">Saldo de {formatARS(total - deposit)} al llegar</p>
              </div>
            </>
          )}
          {error && <p className="mt-4 text-sm text-rose-300 bg-rose-900/30 p-3 border border-rose-700/40">{error}</p>}
          <button type="submit" disabled={submitting} className="btn-primary w-full mt-8">
            {submitting ? "Procesando…" : "Confirmar y pagar seña →"}
          </button>
          <p className="text-xs text-night-300 mt-4 text-center">Pago seguro vía Mercado Pago</p>
        </div>
      </aside>
    </form>
  );
}
