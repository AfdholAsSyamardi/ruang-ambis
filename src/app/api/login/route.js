// src/app/api/login/route.js
import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    const result = await pool.query(
      "SELECT id, username, email, password, role, status, approved_at FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) return NextResponse.json({ message: "Email tidak ditemukan." }, { status: 401 });

    const user = result.rows[0];

    if (user.password !== password) return NextResponse.json({ message: "Password salah." }, { status: 401 });

    const sessionData = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
      approved_at: user.approved_at,
    };

    const response = NextResponse.json({ message: "Login berhasil!" }, { status: 200 });

    response.cookies.set("ruangambis_session", JSON.stringify(sessionData), {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24, 
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: "Terjadi kesalahan server." }, { status: 500 });
  }
}