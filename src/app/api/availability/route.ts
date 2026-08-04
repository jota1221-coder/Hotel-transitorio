import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  generateSlots,
  getAvailableSlots,
  getPernocte,
  getTurnoDuration,
  nowInBuenosAires,
  timeToMinutes,
} from "@/lib/turnos";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get("roomId");
    const dateStr = searchParams.get("date"); // YYYY-MM-DD

    if (!roomId || !dateStr) {
      return NextResponse.json({ error: "Faltan parámetros roomId y date" }, { status: 400 });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return NextResponse.json({ error: "Formato de fecha inválido" }, { status: 400 });
    }

    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) return NextResponse.json({ error: "Habitación no encontrada" }, { status: 404 });

    const now = nowInBuenosAires();

    // Fecha pasada: no se muestra nada disponible. Las fechas en formato
    // YYYY-MM-DD se comparan como strings sin ambigüedad de zona horaria.
    if (dateStr < now.dateStr) {
      return NextResponse.json({
        slots: generateSlots().map(time => ({
          time,
          duration: getTurnoDuration(room.type, parseInt(time)),
          available: false,
        })),
        pernocte: { ...getPernocte(new Date(dateStr + "T00:00:00")), available: false, price: room.pricePerNight + 5000 },
        roomType: room.type,
        past: true,
      });
    }

    // Si es hoy, los turnos que ya arrancaron no se pueden reservar.
    const minStartMinutes = dateStr === now.dateStr ? now.minutes : null;

    const date = new Date(dateStr + "T00:00:00");
    const prevDate = new Date(date);
    prevDate.setDate(prevDate.getDate() - 1);

    // Bookings del día actual y del día anterior (por pernocte que cruza)
    const sameDayBookings = await prisma.booking.findMany({
      where: {
        roomId,
        date,
        status: { not: "cancelled" },
      },
      select: { type: true, startTime: true, durationHours: true },
    });

    const prevDayBookings = await prisma.booking.findMany({
      where: {
        roomId,
        date: prevDate,
        status: { not: "cancelled" },
      },
      select: { type: true, startTime: true, durationHours: true },
    });

    const previousDayPernocte = prevDayBookings.find(b => b.type === "pernocte") ?? null;

    const slots = getAvailableSlots(room.type, date, sameDayBookings, previousDayPernocte, minStartMinutes);

    // Datos del pernocte para ese día
    const pernocte = getPernocte(date);
    const pernocteStarted =
      minStartMinutes !== null && timeToMinutes(pernocte.startTime) < minStartMinutes;
    const pernocteAvailable =
      sameDayBookings.length === 0 && !previousDayPernocte && !pernocteStarted;

    return NextResponse.json({
      slots,
      pernocte: {
        ...pernocte,
        available: pernocteAvailable,
        price: room.pricePerNight + 5000, // pernocte = precio turno + $5.000
      },
      roomType: room.type,
    });
  } catch (err) {
    console.error("[GET /api/availability]", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
