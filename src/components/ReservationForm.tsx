"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { formatARS } from "@/lib/format";

type Room = {
  id: string;
  name: string;
  type: string;
  pricePerNight: number;
  capacity: number;
  imageUrl: string;
};

type Slot = { time: string; duration: number; available: boolean };
type Availability = {
  slots: Slot[];
  pernocte: { startTime: string; endTime: string; duration: number; description: string; available: boolean; price: number };
  roomType: string;
};

export default function ReservationForm({
  rooms,
  preselectedRoomId,
  initialDate,
}: {
  rooms: Room[];
  preselectedRoomId?: string;
  initialDate?: string;
}) {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);

  const [roomId, setRoomId] = useState(preselectedRoomId || rooms[0]?.id || "");
  const [showAllRooms, setShowAllRooms] = useState(!preselectedRoomId);
  const [date, setDate] = useState(initialDate || today);
  const [bookingType, setBookingType] = useState<"turno" | "pernocte">("turno");
  const [startTime, setStartTime] = useState<string>("");
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected = useMemo(() => rooms.find(r => r.id === roomId), [rooms, roomId]);

  // Fetch disponibilidad cuando cambia room o fecha
  useEffect(() => {
    if (!roomId || !date) return;
    setLoadingAvailability(true);
    setStartTime("");
    fetch(`/api/availability?roomId=${roomId}&date=${date}`)
      .then(r => r.json())
      .then(data => {
        setAvailability(data);
        setLoadingAvailability(false);
      })
      .catch(() => setLoadingAvailability(false));
  }, [roomId, date]);

  // Cuando se cambia a pernocte, setear startTime automático
  useEffect(() => {
    if (bookingType === "pernocte" && availability) {
      setStartTime(availability.pernocte.startTime);
    } else if (bookingType === "turno") {
      setStartTime("");
    }
  }, [bookingType, availability]);

  const selectedSlot = availability?.slots.find(s => s.time === startTime);
  const turnoPrice = selected?.pricePerNight ?? 0;
  const pernoctePrice = availability?.pernocte.price ?? 0;
  const totalPrice = bookingType === "pernocte" ? pernoctePrice : turnoPrice;
  const deposit = Math.round(totalPrice * 0.3);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!startTime) {
      setError("Elegí un horario");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          type: bookingType,
          date,
          startTime,
          guestName,
          guestEmail,
          guestPhone,
          website,
        }),
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
      {/* Honeypot */}
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
              <button type="button" onClick={() => setShowAllRooms(true)} className="cta-link self-center">
                Cambiar
              </button>
            </div>
          ) : (
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
                <button type="button" onClick={() => setShowAllRooms(false)} className="cta-link mt-4">
                  Volver a la elegida
                </button>
              )}
            </div>
          )}
        </fieldset>

        {/* 2 · Día */}
        <fieldset>
          <p className="eyebrow mb-6">02 · Día</p>
          <div className="max-w-xs">
            <label className="field-label">Fecha</label>
            <input
              type="date"
              min={today}
              value={date}
              onChange={e => setDate(e.target.value)}
              className="input"
              required
            />
          </div>
        </fieldset>

        {/* 3 · Tipo de reserva */}
        <fieldset>
          <p className="eyebrow mb-6">03 · Tipo de reserva</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setBookingType("turno")}
              className={`p-6 border text-left transition-all ${
                bookingType === "turno" ? "border-gold-300 bg-gold-300/5" : "border-ink-400/40 hover:border-ink-100/30"
              }`}
            >
              <p className="eyebrow mb-2">Turno</p>
              <p className="font-display text-2xl text-ink-50">2 ó 3 horas</p>
              <p className="text-xs text-ink-100/50 italic mt-2 font-display">
                Según habitación y horario
              </p>
            </button>
            <button
              type="button"
              onClick={() => setBookingType("pernocte")}
              disabled={availability ? !availability.pernocte.available : false}
              className={`p-6 border text-left transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                bookingType === "pernocte" ? "border-gold-300 bg-gold-300/5" : "border-ink-400/40 hover:border-ink-100/30"
              }`}
            >
              <p className="eyebrow mb-2">Pernocte</p>
              <p className="font-display text-2xl text-ink-50">
                {availability ? `${availability.pernocte.startTime} → ${availability.pernocte.endTime}` : "—"}
              </p>
              <p className="text-xs text-ink-100/50 italic mt-2 font-display">
                {availability?.pernocte.description ?? ""}
                {availability && !availability.pernocte.available && " · No disponible"}
              </p>
              <p className="text-xs text-gold-300 italic mt-1 font-display">
                +{formatARS(5000)} sobre tarifa
              </p>
            </button>
          </div>
        </fieldset>

        {/* 4 · Horario */}
        {bookingType === "turno" && (
          <fieldset>
            <p className="eyebrow mb-6">04 · Horario de inicio</p>
            {loadingAvailability && (
              <p className="text-sm text-ink-100/50 italic font-display">Cargando disponibilidad…</p>
            )}
            {availability && !loadingAvailability && (
              <>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {availability.slots.map(slot => (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setStartTime(slot.time)}
                      className={`py-3 px-2 text-center border transition-all font-display ${
                        startTime === slot.time
                          ? "border-gold-300 bg-gold-300/10 text-gold-300"
                          : slot.available
                          ? "border-ink-400/40 text-ink-50 hover:border-ink-100/30"
                          : "border-ink-400/20 text-ink-100/25 line-through cursor-not-allowed"
                      }`}
                    >
                      <span className="text-base">{slot.time}</span>
                      <span className="block text-[10px] text-ink-100/40 mt-0.5">
                        {slot.duration}h
                      </span>
                    </button>
                  ))}
                </div>
                {startTime && selectedSlot && (
                  <p className="mt-6 text-sm text-ink-100/70 italic font-display">
                    Turno de <span className="text-gold-300 not-italic">{startTime}</span> a{" "}
                    <span className="text-gold-300 not-italic">
                      {String((parseInt(startTime) + selectedSlot.duration) % 24).padStart(2, "0")}:00
                    </span>{" "}
                    · {selectedSlot.duration} horas
                  </p>
                )}
              </>
            )}
          </fieldset>
        )}

        {/* 5 · Datos */}
        <fieldset>
          <p className="eyebrow mb-6">05 · Tus datos</p>
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
              <Row label="Habitación" value={selected.name} />
              <Row label="Día" value={new Date(date + "T00:00:00").toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })} />
              <Row label="Tipo" value={bookingType === "pernocte" ? "Pernocte" : "Turno"} />
              {startTime && (
                <Row
                  label="Horario"
                  value={
                    bookingType === "pernocte" && availability
                      ? `${availability.pernocte.startTime} → ${availability.pernocte.endTime}`
                      : selectedSlot
                      ? `${startTime} → ${String((parseInt(startTime) + selectedSlot.duration) % 24).padStart(2, "0")}:00`
                      : startTime
                  }
                />
              )}

              <div className="flex justify-between py-6 border-b hairline mt-2">
                <span className="font-display text-lg text-ink-50">Total</span>
                <span className="font-display text-3xl text-ink-50">{formatARS(totalPrice)}</span>
              </div>

              <div className="mt-8 py-6 border border-gold-300/30 bg-gold-300/5 px-6">
                <p className="eyebrow text-gold-300 mb-3">Seña 30%</p>
                <p className="font-display text-3xl text-gold-300">{formatARS(deposit)}</p>
                <p className="text-xs text-ink-100/60 mt-3 italic font-display">
                  Saldo de {formatARS(totalPrice - deposit)} al llegar
                </p>
              </div>
            </>
          )}

          {error && (
            <p className="mt-6 text-sm text-wine-300 italic font-display bg-wine-900/40 px-4 py-3 border border-wine-500/40">
              {error}
            </p>
          )}

          <button type="submit" disabled={submitting || !startTime} className="cta-solid w-full mt-10 disabled:opacity-50">
            {submitting ? "Procesando…" : "Confirmar reserva"}
          </button>
          <p className="text-[10px] text-ink-100/40 mt-5 text-center eyebrow">
            Seña a coordinar al confirmar
          </p>
        </div>
      </aside>
    </form>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-6 py-3 border-b hairline">
      <span className="text-sm text-ink-100/50 italic font-display whitespace-nowrap">{label}</span>
      <span className="font-display text-ink-50 text-right">{value}</span>
    </div>
  );
}
