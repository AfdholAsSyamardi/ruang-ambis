"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    registerAs: "student",
  });
  const [pesan, setPesan] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setPesan("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        setPesan(data.message);
        setTimeout(() => router.push("/login"), 2500);
      } else {
        setPesan(data.message);
      }
    } catch (error) {
      setPesan("Gagal terhubung ke server.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden flex flex-col md:flex-row border border-slate-200/80">
        <div className="md:w-1/2 bg-white p-8 sm:p-10 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-slate-100">
          <div className="text-center flex flex-col items-center">
            <div className="mb-8 sm:mb-10 w-60 sm:w-64 md:w-72">
              <img src="/logo-ruangambis.png" alt="Logo RuangAmbis" className="w-full h-auto object-contain" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-800 mb-4 leading-tight">
              {formData.registerAs === "student" ? "Mulai Perjalanan Belajarmu" : "Bagikan Ilmu, Tumbuhkan Ambisi"}
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-sm">
              {formData.registerAs === "student" 
                ? "Buat akun siswa dan temukan kelas yang sesuai dengan ambisimu." 
                : "Daftar sebagai calon guru di RuangAmbis dan bangun kelas onlinemu."}
            </p>
          </div>
        </div>
        <div className="md:w-1/2 p-8 sm:p-10 flex flex-col justify-center bg-white">
          {pesan && (
            <div className={`p-4 rounded-xl mb-6 text-sm font-medium text-center shadow-sm ${isSuccess ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
              {pesan}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5" autoComplete="off">
            <div className="w-full">
              <label className="block w-full text-center text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">Mendaftar Sebagai</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, registerAs: "student" })}
                  className={`py-3 px-4 flex items-center justify-center gap-2 rounded-xl text-sm font-bold border-2 transition-all ${formData.registerAs === "student" ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm" : "bg-white border-slate-200 text-slate-500 hover:border-emerald-200 hover:bg-slate-50"}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                  </svg>
                  Siswa
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, registerAs: "teacher" })}
                  className={`py-3 px-4 flex items-center justify-center gap-2 rounded-xl text-sm font-bold border-2 transition-all ${formData.registerAs === "teacher" ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm" : "bg-white border-slate-200 text-slate-500 hover:border-emerald-200 hover:bg-slate-50"}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                  </svg>
                  Guru
                </button>
              </div>
              {formData.registerAs === "teacher" && (
                <div className="mt-3 bg-emerald-50/80 p-3 rounded-lg flex gap-3 items-start border border-emerald-100">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                  </svg>
                  <p className="text-xs text-emerald-700 leading-relaxed font-medium">
                    Akun Anda akan aktif sebagai Siswa terlebih dahulu. Akses Guru diberikan setelah verifikasi Admin.
                  </p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Nama Lengkap</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-slate-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </div>
                <input 
                  type="text" 
                  name="username" 
                  value={formData.username} 
                  onChange={handleChange} 
                  placeholder="Masukkan nama lengkap" 
                  required 
                  className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium" 
                />
              </div>
            </div>
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
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="Masukkan email" 
                  required 
                  className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Kata Sandi</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-slate-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                </div>
                <input 
                  type="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  placeholder="Masukkan kata sandi" 
                  required 
                  className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium" 
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={isLoading || isSuccess} 
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-4 rounded-xl mt-4 shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-70 flex items-center justify-center gap-2 group"
            >
              {isLoading ? "Memproses..." : isSuccess ? "Berhasil!" : (
                <>
                  Daftar sebagai {formData.registerAs === "student" ? "Siswa" : "Guru"} 
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </>
              )}
            </button>
          </form>
          <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm font-medium text-slate-600">
            Sudah punya akun? <Link href="/login" prefetch={false} className="text-emerald-600 hover:text-emerald-700 font-bold ml-1 hover:underline">Masuk</Link>
          </div>
        </div>
      </div>
    </main>
  );
}