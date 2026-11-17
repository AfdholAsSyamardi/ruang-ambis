import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET() {
  try {
    // Mencoba melakukan query sederhana mengambil waktu saat ini
    const result = await pool.query("SELECT NOW()");
    
    return NextResponse.json({
      status: "Berhasil 🎉",
      pesan: "Database RuangAmbis sukses terhubung!",
      waktu_database: result.rows[0].now
    }, { status: 200 });

  } catch (error) {
    console.error("Error Database:", error);
    
    return NextResponse.json({
      status: "Gagal ❌",
      pesan: "Koneksi database gagal. Cek kembali file .env.local",
      detail_error: error.message
    }, { status: 500 });
  }
}