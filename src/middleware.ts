import { NextRequest, NextResponse } from "next/server";

const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Ruta Hotel Admin"' },
  });
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isBookingsApi = pathname === "/api/bookings";

  if (isBookingsApi && req.method !== "GET") return NextResponse.next();

  if (!ADMIN_PASSWORD) {
    return new NextResponse(
      "Server misconfigured: ADMIN_PASSWORD not set in environment.",
      { status: 500 }
    );
  }

  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) return unauthorized();

  try {
    const decoded = atob(auth.slice(6));
    const [user, pass] = decoded.split(":");
    if (user === ADMIN_USER && pass === ADMIN_PASSWORD) {
      return NextResponse.next();
    }
  } catch {
    return unauthorized();
  }

  return unauthorized();
}

export const config = {
  matcher: ["/admin/:path*", "/api/bookings"],
};
