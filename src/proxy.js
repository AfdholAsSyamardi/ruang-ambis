import { NextResponse } from "next/server";
import { decrypt } from "./lib/session";

export async function proxy(request) {
  // 1. Cek halaman (path) apa yang sedang coba dibuka oleh user
  const path = request.nextUrl.pathname;

  const isProtectedRoute = path.startsWith("/dashboard");

  const isAuthRoute = path === "/login" || path === "/register";

  const cookie = request.cookies.get("ruangambis_session")?.value;
  
  const session = await decrypt(cookie);


  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.png$|favicon.ico).*)",
  ],
};