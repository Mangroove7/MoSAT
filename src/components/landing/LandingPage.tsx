import React from 'react';
import { 
  Target, 
  Layers, 
  BookOpen, 
  Calculator, 
  BarChart3, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Flame,
  Clock,
  Compass,
  FileText
} from 'lucide-react';

interface LandingPageProps {
  onStartPractice: () => void;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartPractice,
  onOpenAuth
}) => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-orange-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-zinc-800/80 bg-gradient-to-b from-zinc-900/60 via-zinc-950 to-zinc-950">
        {/* Background glow circle */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold tracking-wide shadow-sm">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
            <span>Digital SAT Preparation Lab • Target 1500–1600</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Kuasai Digital SAT dengan Standar Ujian Asli{' '}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-orange-500 bg-clip-text text-transparent">
              College Board
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-zinc-400 text-sm sm:text-base leading-relaxed">
            Platform latihan mandiri dengan adaptivitas 2-modul Bluebook, 2.881+ bank soal terverifikasi, kalkulator Desmos floating terintegrasi, dan evaluasi Buku Dosa terarah.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <button
              onClick={onStartPractice}
              className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-zinc-950 font-black text-sm rounded-2xl shadow-xl shadow-orange-500/20 transition-all hover:scale-102 flex items-center justify-center gap-2 group"
            >
              <span>Mulai Latihan Mandiri (Mode Tamu)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => onOpenAuth('signup')}
              className="w-full sm:w-auto px-7 py-3.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-white font-bold text-sm rounded-2xl transition-all hover:border-zinc-600 flex items-center justify-center gap-2"
            >
              <span>Daftar / Masuk Akun</span>
            </button>
          </div>

          {/* Authentic Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-10 max-w-4xl mx-auto">
            <div className="bg-zinc-900/70 border border-zinc-800 p-3.5 rounded-2xl text-left">
              <div className="text-2xl font-black text-white font-mono">2.881+</div>
              <div className="text-xs text-zinc-400 font-medium mt-0.5">Soal Resmi College Board</div>
            </div>

            <div className="bg-zinc-900/70 border border-zinc-800 p-3.5 rounded-2xl text-left">
              <div className="text-2xl font-black text-amber-400 font-mono">100%</div>
              <div className="text-xs text-zinc-400 font-medium mt-0.5">Adaptif Standar Bluebook</div>
            </div>

            <div className="bg-zinc-900/70 border border-zinc-800 p-3.5 rounded-2xl text-left">
              <div className="text-2xl font-black text-orange-400 font-mono">Desmos</div>
              <div className="text-xs text-zinc-400 font-medium mt-0.5">Floating Non-blocking API</div>
            </div>

            <div className="bg-zinc-900/70 border border-zinc-800 p-3.5 rounded-2xl text-left">
              <div className="text-2xl font-black text-white font-mono">1500–1600</div>
              <div className="text-xs text-zinc-400 font-medium mt-0.5">Fokus Evaluasi & Target</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center space-y-2 mb-12">
          <div className="text-xs uppercase font-extrabold tracking-wider text-orange-400">
            Arsitektur Latihan Terarah
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Empat Fitur Kunci Persiapan Digital SAT
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto">
            Dibangun untuk mencerminkan kondisi ujian sesungguhnya tanpa kompromi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Pillar 1 */}
          <div className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800/80 hover:border-orange-500/40 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Simulasi Ujian Adaptif Bluebook
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Format penuh 2 Modul Reading & Writing (27 soal x 2, 64 menit) dan 2 Modul Math (22 soal x 2, 70 menit). Modul 2 dialihkan secara adaptif (Easy vs Hard) dengan konversi tabel skor resmi College Board 200–800.
            </p>
            <ul className="text-xs text-zinc-400 space-y-1.5 pt-2 border-t border-zinc-800">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span>Timer countdown, flag for review, dan grid soal</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span>Jeda istirahat 10 menit antar bagian (Break Screen)</span>
              </li>
            </ul>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800/80 hover:border-orange-500/40 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Floating Desmos Graphing Lab
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Kalkulator grafik Desmos resmi (`calculator-1.11.min.js`) dengan jendela non-blocking. Dapat digeser bebas (*draggable*) dan disematkan (*dockable*) di sisi soal tanpa menghalangi bacaan stimulus matematika.
            </p>
            <ul className="text-xs text-zinc-400 space-y-1.5 pt-2 border-t border-zinc-800">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Lembar rumus resmi Digital SAT (Math Reference Sheet)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Papan grafik penuh untuk analisis regresi dan sistem persamaan</span>
              </li>
            </ul>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800/80 hover:border-orange-500/40 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Buku Dosa (Mistake Analytics)
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Pencatatan otomatis setiap butir salah dari simulasi dan drill. Dikelompokkan ke 4 kategori kesalahan: Kelemahan Konsep, Kecerobohan, Manajemen Waktu, atau Salah Baca Soal.
            </p>
            <ul className="text-xs text-zinc-400 space-y-1.5 pt-2 border-t border-zinc-800">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>Fitur re-attempt interaktif untuk menguji pemahaman ulang</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>Sinkronisasi otomatis ke Cloud Firestore saat login</span>
              </li>
            </ul>
          </div>

          {/* Pillar 4 */}
          <div className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800/80 hover:border-orange-500/40 transition-colors space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Bedah Kosakata Kontekstual
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              70 kosakata berfrekuensi tinggi dalam SAT dengan arti sederhana dan kalimat stimulus yang dikutip langsung dari soal College Board asli untuk pembelajaran berbasis konteks.
            </p>
            <ul className="text-xs text-zinc-400 space-y-1.5 pt-2 border-t border-zinc-800">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                <span>Mode Flashcard interaktif dengan flip animasi</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                <span>Tingkat penguasaan: Baru, Sedang Dipelajari, Dikuasai</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* SAT Domains Coverage */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full border-t border-zinc-800/80">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Cakupan Lengkap 8 Domain Digital SAT
          </h2>
          <p className="text-xs text-zinc-400">
            2.881 soal diklasifikasikan berdasarkan domain dan tingkat kesulitan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-2xl space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              <span>Reading and Writing (1.500+ Soal)</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-zinc-300 font-medium">
              <div className="p-2 bg-zinc-950/60 rounded-xl border border-zinc-800/60">• Information & Ideas</div>
              <div className="p-2 bg-zinc-950/60 rounded-xl border border-zinc-800/60">• Craft & Structure</div>
              <div className="p-2 bg-zinc-950/60 rounded-xl border border-zinc-800/60">• Expression of Ideas</div>
              <div className="p-2 bg-zinc-950/60 rounded-xl border border-zinc-800/60">• Standard English Conv.</div>
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-2xl space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              <span>Mathematics (1.300+ Soal)</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-zinc-300 font-medium">
              <div className="p-2 bg-zinc-950/60 rounded-xl border border-zinc-800/60">• Algebra</div>
              <div className="p-2 bg-zinc-950/60 rounded-xl border border-zinc-800/60">• Advanced Math</div>
              <div className="p-2 bg-zinc-950/60 rounded-xl border border-zinc-800/60">• Problem Solving & Data</div>
              <div className="p-2 bg-zinc-950/60 rounded-xl border border-zinc-800/60">• Geometry & Trig.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 border border-orange-500/30 text-center space-y-4 relative overflow-hidden">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Mulai Persiapan SAT Mandiri Hari Ini
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-lg mx-auto">
            Simpan setiap kemajuan latihan, pantau perkembangan skor berkala, dan eliminasi kesalahan secara sistematis.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onOpenAuth('signup')}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-zinc-950 font-black text-xs sm:text-sm rounded-xl shadow-lg transition-transform hover:scale-102"
            >
              Daftar Akun Baru
            </button>
            <button
              onClick={onStartPractice}
              className="w-full sm:w-auto px-8 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors"
            >
              Masuk Mode Tamu
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-zinc-800/60 text-center text-xs text-zinc-500">
        <p>MoSAT • Digital SAT Preparation Lab (Target 1500–1600)</p>
        <p className="text-[11px] text-zinc-600 mt-1">
          Materi soal bersumber dari publikasi edukasi College Board untuk tujuan studi mandiri.
        </p>
      </footer>
    </div>
  );
};
