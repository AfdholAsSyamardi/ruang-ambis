import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { decrypt } from "../lib/session";
import pool from "../lib/db";

export default async function HomePage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("ruangambis_session")?.value;
  const session = await decrypt(sessionToken);

  async function handleLogout() {
    "use server";
    const cookieStore = await cookies();
    cookieStore.delete("ruangambis_session");
    redirect("/");
  }

  let courses = [];
  try {
    const result = await pool.query(`
      SELECT 
        c.id, 
        c.title, 
        c.description, 
        cat.name as category_name, 
        u.username as teacher_name
      FROM courses c
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN users u ON c.teacher_id = u.id
      ORDER BY c.created_at DESC
      LIMIT 6
    `);
    courses = result.rows;
  } catch (error) {
    console.error("Gagal mengambil data courses:", error);
  }

  let enrolledCourseIds = [];
  if (session && session.role === "student") {
    try {
      const enrollments = await pool.query(
        "SELECT course_id FROM enrollments WHERE student_id = $1",
        [session.id]
      );
      enrolledCourseIds = enrollments.rows.map(row => row.course_id);
    } catch (error) {
      console.error("Gagal mengambil data enrollments:", error);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-200 selection:text-emerald-900">
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center gap-3">
              <img 
                src="/logo-ruangambis.png" 
                alt="Logo RuangAmbis" 
                className="h-10 sm:h-12 w-auto object-contain mix-blend-multiply" 
              />
              <span className="hidden sm:block font-extrabold text-xl text-slate-800 tracking-tight">
                Ruang<span className="text-emerald-600">Ambis</span>
              </span>
            </div>

            <div className="flex items-center gap-3 sm:gap-5">
              {session ? (
                <>
                  <div className="hidden md:flex flex-col items-end mr-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{session.role}</span>
                    <span className="text-sm font-bold text-slate-700">Halo, {session.username}</span>
                  </div>
                  <Link 
                    href="/dashboard" 
                    className="text-sm font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2.5 rounded-xl transition-colors"
                  >
                    Dashboard
                  </Link>
                  <form action={handleLogout}>
                    <button 
                      type="submit" 
                      className="bg-white hover:bg-red-50 text-slate-600 hover:text-red-600 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border border-slate-200 hover:border-red-200 shadow-sm"
                    >
                      Keluar
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors px-3 py-2"
                  >
                    Masuk
                  </Link>
                  <Link 
                    href="/register" 
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 sm:px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/30"
                  >
                    Daftar
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 transform translate-x-1/3 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 transform -translate-x-1/2 translate-y-1/4"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wide mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Pendaftaran Kelas 2026 Dibuka
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight max-w-4xl mx-auto">
            Belajar Lebih Fokus, <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">
              Raih Masa Depan Lebih Jauh.
            </span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed">
            Platform pembelajaran modern yang didesain khusus untuk membantumu mencapai target akademis dan karir bersama mentor profesional.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href={session ? "/dashboard" : "/register"} 
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl text-base font-bold transition-all shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 group"
            >
              {session ? "Masuk ke Dashboard" : "Mulai Belajar Sekarang"}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <a 
              href="#katalog" 
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-4 rounded-2xl text-base font-bold transition-all shadow-sm flex items-center justify-center gap-2"
            >
              Lihat Kelas
            </a>
          </div>
        </div>
      </header>

      <section id="katalog" className="py-24 bg-slate-50 relative border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Katalog Kelas Unggulan</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">Pilih dari berbagai materi yang disusun oleh para ahli untuk meningkatkan kemampuanmu ke level selanjutnya.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.length > 0 ? (
              courses.map((course) => {
                const isEnrolled = enrolledCourseIds.includes(course.id);
                return (
                  <div key={course.id} className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xl shadow-slate-200/30 hover:-translate-y-2 hover:shadow-2xl hover:border-emerald-200 transition-all duration-300 group flex flex-col">
                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{course.category_name}</span>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{course.title}</h3>
                    <p className="text-slate-600 text-sm mb-4 leading-relaxed line-clamp-3">{course.description}</p>
                    <div className="text-sm font-medium text-slate-500 mb-6">
                      Pengajar: <span className="text-slate-700 font-bold">{course.teacher_name}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-slate-100 pt-5 mt-auto">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-400 font-medium line-through">Rp 150.000</span>
                        <span className="text-lg font-extrabold text-slate-900">Gratis</span>
                      </div>
                      
                      {!session ? (
                        <Link href="/login" className="text-emerald-600 font-bold text-sm hover:underline bg-emerald-50 px-4 py-2 rounded-lg">
                          Login untuk Ikut
                        </Link>
                      ) : session.role === "teacher" || session.role === "admin" ? (
                        <Link href={`/course/${course.id}`} className="text-emerald-600 font-bold text-sm hover:underline bg-emerald-50 px-4 py-2 rounded-lg">
                          Lihat Detail
                        </Link>
                      ) : isEnrolled ? (
                        <Link href={`/course/${course.id}`} className="text-indigo-600 font-bold text-sm hover:underline bg-indigo-50 px-4 py-2 rounded-lg">
                          Lanjutkan Belajar
                        </Link>
                      ) : (
                        <Link href={`/course/${course.id}/enroll`} className="text-emerald-600 font-bold text-sm hover:underline bg-emerald-50 px-4 py-2 rounded-lg">
                          Ikuti Kelas
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-10">
                <p className="text-slate-500 text-lg">Belum ada kelas yang ditambahkan.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo-ruangambis.png" alt="Logo" className="h-8 w-auto mix-blend-multiply" />
            <span className="font-extrabold text-lg text-slate-800 tracking-tight">
              Ruang<span className="text-emerald-600">Ambis</span>
            </span>
          </div>
          <p className="text-sm font-medium text-slate-400">
            © {new Date().getFullYear()} RuangAmbis. Dibuat dengan 💚 untuk pendidikan.
          </p>
        </div>
      </footer>
    </div>
  );
}