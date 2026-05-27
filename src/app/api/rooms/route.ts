import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const rooms = await prisma.room.findMany({ orderBy: { pricePerNight: "desc" } });
  return NextResponse.json(rooms);
}
