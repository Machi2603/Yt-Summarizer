import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const protectedPaths = ["/chat", "/settings"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected =
    protectedPaths.some((p) => pathname.startsWith(p)) ||
    (pathname.startsWith("/api/") &&
      !pathname.startsWith("/api/auth/login") &&
      !pathname.startsWith("/api/auth/logout"));

  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get("token")?.value;

  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  const payload = await verifyToken(token);

  if (!payload) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/chat/:path*", "/settings/:path*", "/api/((?!auth/login|auth/logout).*)"],
};
