import React, { useState, useEffect } from 'react';
import { Coffee, ArrowRight, CheckCircle2, ShieldCheck, BatteryCharging } from 'lucide-react';

interface BreakScreenProps {
  onEndBreak: () => void;
}

export const BreakScreen: React.FC<BreakScreenProps> = ({ onEndBreak }) => {
  const [secondsLeft, setSecondsLeft] = useState(600); // 10 minutes

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onEndBreak();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onEndBreak]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  return (
    <div className="flex-1 bg-slate-900 text-white p-6 sm:p-12 flex flex-col items-center justify-center select-none overflow-y-auto">
      <div className="max-w-xl w-full text-center space-y-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Coffee Icon */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-xl shadow-blue-500/10">
          <Coffee className="w-10 h-10" />
        </div>

        {/* Section info */}
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-950 px-3 py-1 rounded-full border border-blue-800">
            Jeda Ujian Resmi SAT (10 Menit)
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
            Bagian Reading & Writing Selesai!
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Ambil napas, rilekskan mata, dan minum air. Bagian berikutnya adalah <strong>Math (Module 1 & Module 2)</strong>.
          </p>
        </div>

        {/* Big Timer */}
        <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 shadow-2xl backdrop-blur-sm">
          <div className="text-5xl sm:text-6xl font-mono font-extrabold text-white tracking-wider">
            {mins}:{secs < 10 ? '0' : ''}{secs}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Waktu istirahat yang tersisa
          </div>
        </div>

        {/* Tips list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-700/60 flex items-start gap-2.5 text-xs text-slate-300">
            <BatteryCharging className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white">Reset Mental:</span> Alihkan pandangan dari layar selama 2-3 menit ke titik jauh.
            </div>
          </div>
          <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-700/60 flex items-start gap-2.5 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white">Persiapan Math:</span> Siapkan kertas buram & pensil, kalkulator Desmos sudah tersedia di modul!
            </div>
          </div>
        </div>

        {/* Resume Button */}
        <div className="pt-4">
          <button
            onClick={onEndBreak}
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 font-bold text-sm text-white rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 mx-auto hover:scale-102"
          >
            <span>Lanjutkan ke Bagian Math Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
