"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        setErrorMsg(data.message);
      }
    } catch (error) {
      setErrorMsg("Gagal terhubung ke server.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleLupaSandi = (e) => {
    e.preventDefault();
    alert("Fitur Lupa Sandi sedang dalam tahap pemeliharaan. Silakan hubungi Admin di admin@ruangambis.com untuk mereset kata sandi Anda.");
  };

  return (
    <main className="min-h-screen bg-white text-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden flex flex-col md:flex-row-reverse border border-slate-200/80">
        <div className="md:w-1/2 bg-white p-8 sm:p-10 flex flex-col justify-center items-center border-b md:border-b-0 md:border-l border-slate-100">
          <div className="text-center flex flex-col items-center">
            <div className="mb-8 sm:mb-10 w-60 sm:w-64 md:w-72">
              <img src="/logo-ruangambis.png" alt="Logo RuangAmbis" className="w-full h-auto object-contain" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-800 mb-4 leading-tight">
              Selamat Datang Kembali!
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-sm">
              Lanjutkan perjalanan belajarmu bersama RuangAmbis dan capai targetmu hari ini.
            </p>
          </div>
        </div>
        <div className="md:w-1/2 p-8 sm:p-10 flex flex-col justify-center bg-white">
          {errorMsg && (
            <div className="p-4 rounded-xl mb-6 text-sm font-medium text-center shadow-sm bg-red-50 text-red-700 border border-red-200">
              {errorMsg}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5" autoComplete="off">
            <p className="block w-full text-center text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
              Masuk ke Akun
            </p>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-slate-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                </div>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="Masukkan email" 
                  required 
                  className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium" 
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-bold text-slate-700">Kata Sandi</label>
                <button type="button" onClick={handleLupaSandi} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline">
                  Lupa kata sandi?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-slate-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                </div>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Masukkan kata sandi" 
                  required 
                  className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium" 
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-4 rounded-xl mt-4 shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-70 flex items-center justify-center gap-2 group"
            >
              {isLoading ? "Memeriksa Akun..." : (
                <>
                  Masuk Sekarang 
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </>
              )}
            </button>
          </form>
          <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm font-medium text-slate-600">
            Belum punya akun? <Link href="/register" prefetch={false} className="text-emerald-600 hover:text-emerald-700 font-bold ml-1 hover:underline">Daftar sekarang</Link>
          </div>
        </div>
      </div>
    </main>
  );
}