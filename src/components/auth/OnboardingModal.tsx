import React, { useState } from 'react';
import { StorageService } from '../../services/storageService';
import { UserProfile } from '../../types/sat';
import { 
  Target, 
  Calendar, 
  Clock, 
  Compass, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (updatedProfile: UserProfile) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete
}) => {
  const [step, setStep] = useState<number>(1);
  const [targetScore, setTargetScore] = useState<number>(1550);
  const [targetTimeline, setTargetTimeline] = useState<string>('3-4 bulan');
  const [dailyGoal, setDailyGoal] = useState<number>(20);
  const [studyPace, setStudyPace] = useState<'steady' | 'balanced' | 'intensive'>('balanced');
  const [focusArea, setFocusArea] = useState<'both' | 'math' | 'rw'>('both');

  if (!isOpen) return null;

  const handleFinish = () => {
    const updated = StorageService.updateProfile({
      targetScore,
      dailyGoal,
      studyPace,
      focusArea,
      targetExamDate: targetTimeline,
      onboardingCompleted: true
    });
    onComplete(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-orange-100 overflow-hidden animate-in zoom-in-95">
        {/* Header with step progress */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 p-6 text-white relative">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                {step}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-100">
                Langkah {step} dari 4 • Penyesuaian Pace Belajar
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-white/90">
              {Math.round((step / 4) * 100)}%
            </span>
          </div>

          <div className="w-full bg-black/20 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-white h-full transition-all duration-300 rounded-full"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-3 text-white">
            {step === 1 && 'Tentukan Target Skor Digital SAT Anda'}
            {step === 2 && 'Kapan Jadwal Ujian SAT Anda?'}
            {step === 3 && 'Berapa Komitmen Latihan Harian Anda?'}
            {step === 4 && 'Pilih Area Fokus Utama Persiapan'}
          </h2>
          <p className="text-xs text-orange-100 mt-1">
            {step === 1 && 'MoSAT akan menyesuaikan tingkat kesulitan drill dan simulasi sesuai target ini.'}
            {step === 2 && 'Digunakan untuk menyusun roadmap dan rekomendasi modul belajar berkala.'}
            {step === 3 && 'Pace belajar akan menyesuaikan jumlah target soal harian (Daily Goal).'}
            {step === 4 && 'Algoritma akan memprioritaskan rekomendasi soal pada domain yang Anda pilih.'}
          </p>
        </div>

        {/* Form Steps Body */}
        <div className="p-6 space-y-4">
          {/* Step 1: Target Score */}
          {step === 1 && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { score: 1400, desc: 'Target 93rd Percentile (Fondasi Kuat)' },
                  { score: 1450, desc: 'Target 96th Percentile (Kompetitif Top-50)' },
                  { score: 1500, desc: 'Target 98th Percentile (Ivy & Top-20)' },
                  { score: 1550, desc: 'Target 99th Percentile (Beasiswa Penuh)' },
                  { score: 1600, desc: 'Target Skor Sempurna (100th Percentile)' }
                ].map((item) => (
                  <button
                    key={item.score}
                    type="button"
                    onClick={() => setTargetScore(item.score)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      targetScore === item.score
                        ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-500/30'
                        : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-lg text-zinc-900">{item.score}</span>
                      {targetScore === item.score && (
                        <CheckCircle2 className="w-4 h-4 text-orange-600" />
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-0.5">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Timeline */}
          {step === 2 && (
            <div className="space-y-3">
              {[
                { id: '1-2 bulan', pace: 'intensive' as const, title: '1–2 Bulan (Mode Intensif)', desc: 'Persiapan kilat terfokus pada trik Desmos dan pembedahan Buku Dosa.' },
                { id: '3-4 bulan', pace: 'balanced' as const, title: '3–4 Bulan (Mode Berimbang)', desc: 'Ritme ideal untuk menuntaskan materi kurikulum dan simulasi adaptif berkala.' },
                { id: '5+ bulan', pace: 'steady' as const, title: '5+ Bulan (Mode Bertahap)', desc: 'Membangun fondasi tata bahasa dan matematika mendalam dari dasar.' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setTargetTimeline(item.id);
                    setStudyPace(item.pace);
                  }}
                  className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start justify-between ${
                    targetTimeline === item.id
                      ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-500/30'
                      : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="font-bold text-xs sm:text-sm text-zinc-900">{item.title}</div>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">{item.desc}</p>
                  </div>
                  {targetTimeline === item.id && (
                    <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Step 3: Daily Goal & Pace */}
          {step === 3 && (
            <div className="space-y-3">
              {[
                { goal: 10, title: '15 Menit / 10 Soal Harian', desc: 'Santai namun konsisten menjaga rentetan streak setiap hari.' },
                { goal: 20, title: '30 Menit / 20 Soal Harian', desc: 'Pilihan paling direkomendasikan untuk kenaikan skor stabil 100+ poin.' },
                { goal: 35, title: '60+ Menit / 35 Soal Harian', desc: 'Pace akselerasi tinggi untuk murid yang mengejar ujian bulan depan.' }
              ].map((item) => (
                <button
                  key={item.goal}
                  type="button"
                  onClick={() => setDailyGoal(item.goal)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start justify-between ${
                    dailyGoal === item.goal
                      ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-500/30'
                      : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="font-bold text-xs sm:text-sm text-zinc-900">{item.title}</div>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">{item.desc}</p>
                  </div>
                  {dailyGoal === item.goal && (
                    <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Step 4: Focus Area */}
          {step === 4 && (
            <div className="space-y-3">
              {[
                { id: 'both' as const, title: 'Seimbang (Reading & Writing + Math)', desc: 'Pengembangan simultan untuk kedua section Digital SAT.' },
                { id: 'math' as const, title: 'Prioritas Matematika (Incar 800 Math)', desc: 'Fokus intensif pada Advanced Math, Aljabar, dan trik kalkulator Desmos.' },
                { id: 'rw' as const, title: 'Prioritas Reading & Writing (Incar 750+ RW)', desc: 'Fokus penguasaan tata bahasa baku, sintesis retoris, dan bedah kosakata.' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFocusArea(item.id)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start justify-between ${
                    focusArea === item.id
                      ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-500/30'
                      : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="font-bold text-xs sm:text-sm text-zinc-900">{item.title}</div>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">{item.desc}</p>
                  </div>
                  {focusArea === item.id && (
                    <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Controls Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-800 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Sebelumnya</span>
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5"
              >
                <span>Lanjutkan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
              >
                <span>Mulai Belajar Sekarang</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
