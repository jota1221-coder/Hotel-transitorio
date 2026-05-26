import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { canBook, getPernocte, getTurnoDuration } from "@/lib/turnos";

const BookingSchema = z.object({
  roomId: z.string().min(1).max(50),
  type: z.enum(["turno", "pernocte"]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  guestName: z.string().trim().min(2).max(100),
  guestEmail: z.string().trim().email().max(150),
  guestPhone: z.string().trim().min(6).max(30),
  website: z.string().optional(), // honeypot
});

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const limit = rateLimit(`booking:${ip}`, 5, 15 * 60 * 1000);
    if (!limit.ok) {
      return NextResponse.json(
        { error: "Demasiados intentos. Probá nuevamente en unos minutos." },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Body inválido" }, { status: 400 });

    const parsed = BookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    // Honeypot: si está completo, fingir éxito
    if (parsed.data.website && parsed.data.website.length > 0) {
      return NextResponse.json({ id: "spam-detected" }, { status: 201 });
    }

    const { roomId, type, date, startTime, guestName, guestEmail, guestPhone } = parsed.data;

    const dateObj = new Date(date + "T00:00:00");
    if (isNaN(dateObj.getTime())) {
      return NextResponse.json({ error: "Fecha inválida" }, { status: 400 });
    }

    // Validar que no sea en el pasado
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dateObj < today) {
      return NextResponse.json({ error: "La fecha no puede ser anterior a hoy" }, { status: 400 });
    }

    // No más de 1 año en el futuro
    const maxFuture = new Date();
    maxFuture.setFullYear(maxFuture.getFullYear() + 1);
    if (dateObj > maxFuture) {
      return NextResponse.json({ error: "No se aceptan reservas con más de 1 año de anticipación" }, { status: 400 });
    }

    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) return NextResponse.json({ error: "Habitación no encontrada" }, { status: 404 });

    // Calcular duración + endTime según el tipo
    let durationHours: number;
    let endTime: string;
    let totalPrice: number;

    if (type === "pernocte") {
      const pernocte = getPernocte(dateObj);
      if (startTime !== pernocte.startTime) {
        return NextResponse.json({ error: "Horario de pernocte inválido para ese día" }, { status: 400 });
      }
      durationHours = pernocte.duration;
      endTime = pernocte.endTime;
      totalPrice = room.pricePerNight + 5000;
    } else {
      // turno
      const startHour = parseInt(startTime.split(":")[0]);
      if (isNaN(startHour) || startHour < 0 || startHour > 23) {
        return NextResponse.json({ error: "Hora de inicio inválida" }, { status: 400 });
      }
      durationHours = getTurnoDuration(room.type, startHour);
      const endHour = (startHour + durationHours) % 24;
      endTime = `${String(endHour).padStart(2, "0")}:00`;
      totalPrice = room.pricePerNight;
    }

    // Verificar disponibilidad
    const existing = await prisma.booking.findMany({
      where: { roomId, date: dateObj, status: { not: "cancelled" } },
      select: { type: true, startTime: true, durationHours: true },
    });

    if (!canBook(type, startTime, durationHours, existing)) {
      return NextResponse.json({ error: "Ese turno ya no está disponible" }, { status: 409 });
    }

    const depositPaid = Math.round(totalPrice * 0.3);

    const booking = await prisma.booking.create({
      data: {
        roomId,
        type,
        date: dateObj,
        startTime,
        endTime,
        durationHours,
        guestName,
        guestEmail: guestEmail.toLowerCase(),
        guestPhone,
        totalPrice,
        depositPaid,
        status: "confirmed",
      },
    });

    return NextResponse.json({ id: booking.id }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/bookings]", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: { room: true },
      orderBy: { createdAt: "desc" },
      take: 500,
    });
    return NextResponse.json(bookings);
  } catch (err) {
    console.error("[GET /api/bookings]", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
