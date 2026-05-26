"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BookingBar() {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);

  function handleSearch() {
    router.push(`/reservar?date=${date}`);
  }

  return (
    <div className="booking-bar">
      <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-10">
        <div className="hidden md:flex items-center gap-3">
          <span className="font-script text-2xl text-ink-50 leading-none">Reservá</span>
          <span className="w-8 h-px bg-gold-300/40" />
        </div>

        <div className="flex-1">
          <label className="field-label">Fecha</label>
          <input
            type="date"
            min={today}
            value={date}
            onChange={e => setDate(e.target.value)}
            className="input !py-1 !text-sm md:!text-base"
          />
        </div>

        <button onClick={handleSearch} className="cta-solid !py-3 !px-8 whitespace-nowrap">
          Ver turnos
        </button>
      </div>
    </div>
  );
}
