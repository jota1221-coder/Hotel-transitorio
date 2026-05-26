"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { formatARS, nightsBetween } from "@/lib/format";

type Room = {
  id: string;
  name: string;
  type: string;
  pricePerNight: number;
  capacity: number;
  imageUrl: string;
};

export default function ReservationForm({
  rooms,
  preselectedRoomId,
  initialCheckIn,
  initialCheckOut,
}: {
  rooms: Room[];
  preselectedRoomId?: string;
  initialCheckIn?: string;
  initialCheckOut?: string;
}) {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  const [roomId, setRoomId] = useState(preselectedRoomId || rooms[0]?.id || "");
  const [showAllRooms, setShowAllRooms] = useState(!preselectedRoomId);
  const [checkIn, setCheckIn] = useState(initialCheckIn || today);
  const [checkOut, setCheckOut] = useState(initialCheckOut || tomorrow);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [website, setWebsite] = useState("");
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
        body: JSON.stringify({ roomId, checkIn, checkOut, guestName, guestEmail, guestPhone, website }),
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
    <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-16">
      {/* Honeypot — solo bots lo completan */}
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

      <div className="lg:col-span-7 space-y-16">
        {/* 1 · Habitación */}
        <fieldset>
          <p className="eyebrow mb-6">01 · Habitación</p>

          {!showAllRooms && selected ? (
            // Vista compacta: solo la habitación preseleccionada
            <div className="flex gap-6 items-start border hairline p-5">
              <div className="relative w-32 h-32 shrink-0 mood">
                <Image src={selected.imageUrl} alt={selected.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="eyebrow mb-1">{selected.type}</p>
                <h3 className="font-display text-2xl text-ink-50">{selected.name}</h3>
                <p className="mt-2 text-sm text-ink-100/60 italic font-display">
                  Hasta {selected.capacity} {selected.capacity === 1 ? "persona" : "personas"}
                </p>
                <p className="mt-3 font-display text-xl text-gold-300">
                  {formatARS(selected.pricePerNight)} <span className="text-ink-100/40 text-sm">/turno</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAllRooms(true)}
                className="cta-link self-center"
              >
                Cambiar
              </button>
            </div>
          ) : (
            // Vista expandida: todas las habitaciones
            <div className="space-y-3">
              {rooms.map(room => (
                <label
                  key={room.id}
                  className={`flex gap-5 p-4 cursor-pointer border transition-all ${
                    roomId === room.id ? "border-gold-300 bg-gold-300/5" : "border-ink-400/40 hover:border-ink-100/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="room"
                    value={room.id}
                    checked={roomId === room.id}
                    onChange={() => setRoomId(room.id)}
                    className="sr-only"
                  />
                  <div className="relative w-24 h-24 shrink-0 mood">
                    <Image src={room.imageUrl} alt={room.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="eyebrow !text-[10px] mb-1">{room.type}</p>
                    <h3 className="font-display text-xl text-ink-50">{room.name}</h3>
                    <p className="mt-3 font-display text-base text-gold-300">
                      {formatARS(room.pricePerNight)} <span className="text-ink-100/40 text-xs">/turno</span>
                    </p>
                  </div>
                </label>
              ))}
              {preselectedRoomId && (
                <button
                  type="button"
                  onClick={() => setShowAllRooms(false)}
                  className="cta-link mt-4"
                >
                  Volver a la elegida
                </button>
              )}
            </div>
          )}
        </fieldset>

        {/* 2 · Fechas */}
        <fieldset>
          <p className="eyebrow mb-6">02 · Fecha y horario</p>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="field-label">Entrada</label>
              <input
                type="date"
                min={today}
                value={checkIn}
                onChange={e => setCheckIn(e.target.value)}
                className="input"
                required
              />
            </div>
            <div>
              <label className="field-label">Salida</label>
              <input
                type="date"
                min={checkIn}
                value={checkOut}
                onChange={e => setCheckOut(e.target.value)}
                className="input"
                required
              />
            </div>
          </div>
          <p className="text-xs text-ink-100/50 mt-4 italic font-display">
            {nights} {nights === 1 ? "turno" : "turnos"} · El pernocte incluye desayuno
          </p>
        </fieldset>

        {/* 3 · Datos */}
        <fieldset>
          <p className="eyebrow mb-6">03 · Tus datos</p>
          <div className="space-y-8">
            <div>
              <label className="field-label">Nombre y apellido</label>
              <input
                value={guestName}
                onChange={e => setGuestName(e.target.value)}
                className="input"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="field-label">Email</label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={e => setGuestEmail(e.target.value)}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="field-label">Teléfono</label>
                <input
                  type="tel"
                  value={guestPhone}
                  onChange={e => setGuestPhone(e.target.value)}
                  className="input"
                  required
                />
              </div>
            </div>
          </div>
        </fieldset>
      </div>

      {/* Resumen */}
      <aside className="lg:col-span-5">
        <div className="lg:sticky lg:top-32 border hairline p-10 bg-ink-900/60 backdrop-blur">
          <p className="eyebrow mb-8">Resumen</p>
          {selected && (
            <>
              <div className="flex justify-between py-4 border-b hairline">
                <span className="text-sm text-ink-100/50 italic font-display">Habitación</span>
                <span className="font-display text-ink-50">{selected.name}</span>
              </div>
              <div className="flex justify-between py-4 border-b hairline">
                <span className="text-sm text-ink-100/50 italic font-display">
                  {nights} × {formatARS(selected.pricePerNight)}
                </span>
                <span className="font-display text-ink-50">{formatARS(total)}</span>
              </div>
              <div className="flex justify-between py-6 border-b hairline">
                <span className="font-display text-lg text-ink-50">Total</span>
                <span className="font-display text-3xl text-ink-50">{formatARS(total)}</span>
              </div>

              <div className="mt-8 py-6 border border-gold-300/30 bg-gold-300/5 px-6">
                <p className="eyebrow text-gold-300 mb-3">Seña 30%</p>
                <p className="font-display text-3xl text-gold-300">{formatARS(deposit)}</p>
                <p className="text-xs text-ink-100/60 mt-3 italic font-display">
                  Saldo de {formatARS(total - deposit)} al llegar
                </p>
              </div>
            </>
          )}

          {error && (
            <p className="mt-6 text-sm text-wine-300 italic font-display bg-wine-900/40 px-4 py-3 border border-wine-500/40">
              {error}
            </p>
          )}

          <button type="submit" disabled={submitting} className="cta-solid w-full mt-10">
            {submitting ? "Procesando…" : "Confirmar y pagar seña"}
          </button>
          <p className="text-[10px] text-ink-100/40 mt-5 text-center eyebrow">
            Pago seguro vía Mercado Pago
          </p>
        </div>
      </aside>
    </form>
  );
}
