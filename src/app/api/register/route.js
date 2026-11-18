import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function POST(request) {
  try {
    const { username, email, password, registerAs } = await request.json();

    if (!username || !email || !password || !registerAs) {
      return NextResponse.json(
        { message: "Semua field wajib diisi!" },
        { status: 400 }
      );
    }

    if (!["student", "teacher"].includes(registerAs)) {
      return NextResponse.json(
        { message: "Pilihan role tidak valid!" },
        { status: 400 }
      );
    }


    const statusAwal = registerAs === "teacher" ? "pending" : "active";

    const roleAwal = "student";

    await pool.query(
      "INSERT INTO users (username, email, password, role, status) VALUES ($1, $2, $3, $4, $5)",
      [username, email, password, roleAwal, statusAwal]
    );

    const pesanSukses = registerAs === "teacher"
      ? "Pendaftaran berhasil! Akun Pengajar Anda sedang berstatus Pending menunggu verifikasi Admin."
      : "Registrasi Siswa berhasil! Silakan login.";

    return NextResponse.json({ message: pesanSukses }, { status: 201 });
  } catch (error) {

    if (error.code === "23505") {
      return NextResponse.json(
        { message: "Email sudah terdaftar. Gunakan email lain." },
        { status: 409 }
      );
    }
    console.error("Error Register:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}