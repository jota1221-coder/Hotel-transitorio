"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BookingBar() {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);

  function handleSearch() {
    const params = new URLSearchParams({ checkIn, checkOut });
    router.push(`/reservar?${params.toString()}`);
  }

  return (
    <div className="booking-bar">
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-8">
        <div className="hidden md:flex items-center gap-3">
          <span className="font-script text-2xl text-ink-50 leading-none">Reservá</span>
          <span className="w-8 h-px bg-gold-300/40" />
        </div>

        <div className="flex flex-1 gap-4 md:gap-8">
          <div className="flex-1">
            <label className="field-label">Entrada</label>
            <input
              type="date"
              min={today}
              value={checkIn}
              onChange={e => {
                setCheckIn(e.target.value);
                if (e.target.value >= checkOut) {
                  const next = new Date(e.target.value);
                  next.setDate(next.getDate() + 1);
                  setCheckOut(next.toISOString().slice(0, 10));
                }
              }}
              className="input !py-1 !text-sm md:!text-base"
            />
          </div>
          <div className="flex-1">
            <label className="field-label">Salida</label>
            <input
              type="date"
              min={checkIn}
              value={checkOut}
              onChange={e => setCheckOut(e.target.value)}
              className="input !py-1 !text-sm md:!text-base"
            />
          </div>
        </div>

        <button onClick={handleSearch} className="cta-solid !py-3 !px-6 whitespace-nowrap">
          Reservar
        </button>
      </div>
    </div>
  );
}
