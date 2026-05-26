import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { nightsBetween } from "@/lib/format";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const BookingSchema = z.object({
  roomId: z.string().min(1).max(50),
  checkIn: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)),
  checkOut: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)),
  guestName: z.string().trim().min(2).max(100),
  guestEmail: z.string().trim().email().max(150),
  guestPhone: z.string().trim().min(6).max(30),
  website: z.string().optional(), // honeypot — bots completan este campo
});

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const limit = rateLimit(`booking:${ip}`, 5, 15 * 60 * 1000);
    if (!limit.ok) {
      return NextResponse.json(
        { error: "Demasiados intentos. Intentá nuevamente en unos minutos." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((limit.resetAt - Date.now()) / 1000)) } }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Body inválido" }, { status: 400 });

    const parsed = BookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    if (parsed.data.website && parsed.data.website.length > 0) {
      // honeypot triggered — fingir éxito pero no crear nada
      return NextResponse.json({ id: "spam-detected" }, { status: 201 });
    }

    const { roomId, checkIn, checkOut, guestName, guestEmail, guestPhone } = parsed.data;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return NextResponse.json({ error: "Fechas inválidas" }, { status: 400 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (checkInDate < today) {
      return NextResponse.json({ error: "La fecha de entrada no puede ser anterior a hoy" }, { status: 400 });
    }

    if (checkOutDate <= checkInDate) {
      return NextResponse.json({ error: "El check-out debe ser posterior al check-in" }, { status: 400 });
    }

    const maxFuture = new Date();
    maxFuture.setFullYear(maxFuture.getFullYear() + 1);
    if (checkInDate > maxFuture) {
      return NextResponse.json({ error: "No se aceptan reservas con más de 1 año de anticipación" }, { status: 400 });
    }

    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) return NextResponse.json({ error: "Habitación no encontrada" }, { status: 404 });

    const overlap = await prisma.booking.findFirst({
      where: {
        roomId,
        status: { not: "cancelled" },
        AND: [
          { checkIn: { lt: checkOutDate } },
          { checkOut: { gt: checkInDate } },
        ],
      },
    });
    if (overlap) {
      return NextResponse.json({ error: "La habitación no está disponible en esas fechas" }, { status: 409 });
    }

    const nights = nightsBetween(checkInDate, checkOutDate);
    const totalPrice = room.pricePerNight * nights;
    const depositPaid = Math.round(totalPrice * 0.3);

    const booking = await prisma.booking.create({
      data: {
        roomId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
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
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
