// Lógica de turnos y pernoctes para Ruta Hotel
//
// REGLAS DE NEGOCIO
// =================
//
// Tipos de habitación:
// - "Simple"            → SIEMPRE turnos de 2hs (todo el día)
// - "Con cochera"       → 3hs entre 12-20hs · 2hs fuera de ese horario
// - "Con cochera e hidromasaje" → idem
// - "Premier con hidromasaje"   → idem
//
// Cleanup: después de cada turno, el cuarto NO está disponible por 2hs (limpieza).
// El siguiente turno puede arrancar después de fin del turno + cleanup.
//
// Slots posibles: cada hora en punto (00:00, 01:00, ..., 23:00)
//
// Pernocte:
// - Dom-Jue: 22:00 (día N) → 10:00 (día N+1). 12 horas.
// - Vie-Sáb: 02:00 (día N) → 12:00 (día N). 10 horas.
// El pernocte de un día bloquea ese día completo para turnos.

export const CLEANUP_HOURS = 2;
// Buffer adicional entre turnos (margen logístico para que el cliente pueda entrar)
export const BUFFER_HOURS = 1;

export type RoomKind = "simple" | "premium"; // simple = 2hs siempre · premium = el resto

export function getRoomKind(roomType: string): RoomKind {
  const lower = roomType.toLowerCase();
  if (lower.includes("simple") && !lower.includes("cochera")) return "simple";
  return "premium";
}

/**
 * Duración del turno según habitación y hora de inicio
 */
export function getTurnoDuration(roomType: string, startHour: number): number {
  const kind = getRoomKind(roomType);
  if (kind === "simple") return 2;
  // premium: 3hs si el turno arranca entre 12 y 17 (último turno de 3hs sería 17:00-20:00)
  if (startHour >= 12 && startHour <= 17) return 3;
  return 2;
}

/**
 * Pernocte según el día de la semana
 * @param date - fecha del día de inicio
 */
export function getPernocte(date: Date): { startTime: string; endTime: string; duration: number; description: string } {
  const dayOfWeek = date.getDay(); // 0=dom, 5=vie, 6=sáb
  const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;

  if (isWeekend) {
    return {
      startTime: "02:00",
      endTime: "12:00",
      duration: 10,
      description: "De 02:00 a 12:00 del mismo día",
    };
  }
  return {
    startTime: "22:00",
    endTime: "10:00",
    duration: 12,
    description: "De 22:00 a 10:00 del día siguiente",
  };
}

/**
 * Convierte "HH:mm" a minutos desde medianoche
 */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/**
 * Convierte minutos a "HH:mm"
 */
export function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * Rango ocupado por una reserva (en minutos desde medianoche del día de la reserva).
 * Para pernocte que cruza el día, el rango puede pasar de 1440.
 */
export function bookingRange(booking: { type: string; startTime: string; durationHours: number }): { start: number; end: number } {
  const start = timeToMinutes(booking.startTime);
  const end = start + booking.durationHours * 60;
  return { start, end };
}

/**
 * Genera los slots horarios posibles del día (cada hora en punto).
 * Para habitación simple: todos los slots de 00 a 23.
 * Para premium: todos los slots de 00 a 23 también (el sistema decide la duración por slot).
 */
export function generateSlots(): string[] {
  return Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2, "0")}:00`);
}

/**
 * Dado un set de reservas existentes para un día (y opcionalmente el día anterior si hay
 * pernocte cruzado), devuelve qué slots están disponibles para iniciar un turno.
 *
 * @param roomType - tipo de habitación
 * @param targetDate - día para el que queremos saber slots
 * @param sameDayBookings - reservas del mismo día
 * @param previousDayPernocte - pernocte del día anterior (si existe, ocupa hasta 10:00 o 12:00 de hoy)
 */
export function getAvailableSlots(
  roomType: string,
  targetDate: Date,
  sameDayBookings: Array<{ type: string; startTime: string; durationHours: number }>,
  previousDayPernocte: { type: string; startTime: string; durationHours: number } | null
): Array<{ time: string; duration: number; available: boolean }> {
  const allSlots = generateSlots();

  // Si hay pernocte hoy, ningún turno se puede tomar
  const hasTodayPernocte = sameDayBookings.some(b => b.type === "pernocte");
  if (hasTodayPernocte) {
    return allSlots.map(time => ({
      time,
      duration: getTurnoDuration(roomType, parseInt(time)),
      available: false,
    }));
  }

  // Construir ventanas ocupadas: [start del turno, end + cleanup + buffer]
  const occupied: Array<{ start: number; end: number }> = [];

  for (const b of sameDayBookings) {
    const start = timeToMinutes(b.startTime);
    const end = start + b.durationHours * 60 + (CLEANUP_HOURS + BUFFER_HOURS) * 60;
    occupied.push({ start, end });
  }

  // Pernocte del día anterior que cruza al día actual (Dom-Jue: 22→10 del siguiente)
  if (previousDayPernocte) {
    const startH = parseInt(previousDayPernocte.startTime);
    if (startH >= 22) {
      const endOnToday = ((startH + previousDayPernocte.durationHours) % 24) * 60;
      occupied.push({ start: 0, end: endOnToday + (CLEANUP_HOURS + BUFFER_HOURS) * 60 });
    }
  }

  return allSlots.map(time => {
    const slotStart = timeToMinutes(time);
    const duration = getTurnoDuration(roomType, parseInt(time));
    // El slot incluye su propio cleanup + buffer (para no chocar con la próxima reserva)
    const slotEnd = slotStart + duration * 60 + (CLEANUP_HOURS + BUFFER_HOURS) * 60;

    // Bloqueado si el slot solapa con alguna ventana ocupada
    const isBlocked = occupied.some(o => slotStart < o.end && slotEnd > o.start);

    return {
      time,
      duration,
      available: !isBlocked,
    };
  });
}

/**
 * Valida si una reserva nueva no solapa con las existentes.
 */
export function canBook(
  type: "turno" | "pernocte",
  startTime: string,
  durationHours: number,
  existing: Array<{ type: string; startTime: string; durationHours: number }>
): boolean {
  if (type === "pernocte") {
    // No puede haber NADA ese día
    return existing.length === 0;
  }

  // Turno: no puede haber pernocte ese día
  if (existing.some(b => b.type === "pernocte")) return false;

  const newStart = timeToMinutes(startTime);
  const newEnd = newStart + durationHours * 60 + (CLEANUP_HOURS + BUFFER_HOURS) * 60;

  for (const b of existing) {
    const start = timeToMinutes(b.startTime);
    const end = start + b.durationHours * 60 + (CLEANUP_HOURS + BUFFER_HOURS) * 60;
    if (newStart < end && newEnd > start) return false;
  }
  return true;
}
