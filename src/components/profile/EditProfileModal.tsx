import React, { useState, useEffect } from 'react';
import { StorageService } from '../../services/storageService';
import { AuthService } from '../../services/authService';
import { UserProfile } from '../../types/sat';
import { 
  X, 
  User, 
  Target, 
  Calendar, 
  Flame, 
  Clock, 
  Compass, 
  Check, 
  Save 
} from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated: (profile: UserProfile) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  onProfileUpdated
}) => {
  const [profile, setProfile] = useState<UserProfile>(() => StorageService.getProfile());
  const [name, setName] = useState(profile.name);
  const [targetScore, setTargetScore] = useState(profile.targetScore);
  const [dailyGoal, setDailyGoal] = useState(profile.dailyGoal);
  const [targetExamDate, setTargetExamDate] = useState(profile.targetExamDate || '3-4 bulan');
  const [studyPace, setStudyPace] = useState<'steady' | 'balanced' | 'intensive'>(profile.studyPace || 'balanced');
  const [focusArea, setFocusArea] = useState<'both' | 'math' | 'rw'>(profile.focusArea || 'both');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const p = StorageService.getProfile();
      setProfile(p);
      setName(p.name);
      setTargetScore(p.targetScore);
      setDailyGoal(p.dailyGoal);
      setTargetExamDate(p.targetExamDate || '3-4 bulan');
      setStudyPace(p.studyPace || 'balanced');
      setFocusArea(p.focusArea || 'both');
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updated = StorageService.updateProfile({
      name: name.trim() || 'SAT Scholar',
      targetScore,
      dailyGoal,
      targetExamDate,
      studyPace,
      focusArea
    });

    // Also update current active user name in AuthService if signed in
    const activeUser = AuthService.getCurrentUser();
    if (activeUser) {
      AuthService.setCurrentUser({
        ...activeUser,
        name: name.trim() || activeUser.name,
        targetScore
      });
    }

    setSavedSuccess(true);
    onProfileUpdated(updated);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-orange-100 overflow-hidden animate-in zoom-in-95 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 p-6 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center font-bold text-xs shadow-inner">
              <User className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100">
              Pengaturan Profil Murid
            </span>
          </div>

          <h2 className="text-2xl font-black tracking-tight mt-1 text-white">
            Edit Profil & Target SAT
          </h2>
          <p className="text-xs text-orange-100 mt-0.5">
            Perbarui target skor, kecepatan belajar, dan komitmen soal harian Anda.
          </p>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl flex items-center gap-2 font-semibold">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Profil berhasil diperbarui dan tersinkronisasi!</span>
            </div>
          )}

          {/* Nama Lengkap */}
          <div>
            <label className="block font-bold text-zinc-700 mb-1">Nama Lengkap</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Anda"
                className="w-full pl-9 pr-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white text-zinc-900 text-xs transition-colors"
              />
            </div>
          </div>

          {/* Target Skor SAT */}
          <div>
            <label className="block font-bold text-zinc-700 mb-1">Target Skor Digital SAT (1400–1600)</label>
            <div className="grid grid-cols-5 gap-1.5">
              {[1400, 1450, 1500, 1550, 1600].map(sc => (
                <button
                  type="button"
                  key={sc}
                  onClick={() => setTargetScore(sc)}
                  className={`py-2 rounded-xl font-mono font-bold border transition-colors ${
                    targetScore === sc
                      ? 'bg-orange-50 border-orange-500 text-orange-700 ring-1 ring-orange-500'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                  }`}
                >
                  {sc}
                </button>
              ))}
            </div>
          </div>

          {/* Target Jadwal Ujian */}
          <div>
            <label className="block font-bold text-zinc-700 mb-1">Jadwal Ujian SAT</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: '1-2 bulan', title: '1–2 Bulan (Intensif)', pace: 'intensive' as const },
                { id: '3-4 bulan', title: '3–4 Bulan (Berimbang)', pace: 'balanced' as const },
                { id: '5+ bulan', title: '5+ Bulan (Bertahap)', pace: 'steady' as const }
              ].map(item => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => {
                    setTargetExamDate(item.id);
                    setStudyPace(item.pace);
                  }}
                  className={`p-2.5 rounded-xl border text-center font-medium transition-colors ${
                    targetExamDate === item.id
                      ? 'bg-orange-50 border-orange-500 text-orange-800 ring-1 ring-orange-500'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                  }`}
                >
                  <div className="text-[11px] font-bold">{item.title}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Daily Question Target */}
          <div>
            <label className="block font-bold text-zinc-700 mb-1">Target Soal Harian (Daily Goal)</label>
            <div className="grid grid-cols-4 gap-2">
              {[10, 15, 20, 35].map(g => (
                <button
                  type="button"
                  key={g}
                  onClick={() => setDailyGoal(g)}
                  className={`py-2 rounded-xl font-mono font-bold border transition-colors ${
                    dailyGoal === g
                      ? 'bg-orange-50 border-orange-500 text-orange-700 ring-1 ring-orange-500'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                  }`}
                >
                  {g} Soal
                </button>
              ))}
            </div>
          </div>

          {/* Focus Area */}
          <div>
            <label className="block font-bold text-zinc-700 mb-1">Area Fokus Prioritas</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'both' as const, label: 'Seimbang (Semua)' },
                { id: 'math' as const, label: 'Fokus Math' },
                { id: 'rw' as const, label: 'Fokus Reading & Writing' }
              ].map(item => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setFocusArea(item.id)}
                  className={`p-2.5 rounded-xl border text-center font-medium transition-colors ${
                    focusArea === item.id
                      ? 'bg-orange-50 border-orange-500 text-orange-800 ring-1 ring-orange-500'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                  }`}
                >
                  <div className="text-[11px] font-bold">{item.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/20 text-xs transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
