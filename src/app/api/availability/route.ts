import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAvailableSlots, getPernocte, getTurnoDuration } from "@/lib/turnos";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get("roomId");
    const dateStr = searchParams.get("date"); // YYYY-MM-DD

    if (!roomId || !dateStr) {
      return NextResponse.json({ error: "Faltan parámetros roomId y date" }, { status: 400 });
    }

    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) return NextResponse.json({ error: "Habitación no encontrada" }, { status: 404 });

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

    const slots = getAvailableSlots(room.type, date, sameDayBookings, previousDayPernocte);

    // Datos del pernocte para ese día
    const pernocte = getPernocte(date);
    const pernocteAvailable = sameDayBookings.length === 0 && !previousDayPernocte;

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
