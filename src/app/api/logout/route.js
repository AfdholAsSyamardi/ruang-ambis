// src/app/api/logout/route.js
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logout berhasil" }, { status: 200 });
  response.cookies.delete("ruangambis_session");
  return response;
}