import React, { useState } from 'react';
import { AuthService, AuthUser } from '../../services/authService';
import { StorageService } from '../../services/storageService';
import { isFirebaseConfigured } from '../../services/firebase';
import { X, Lock, Mail, User, AlertCircle, Loader2, Cloud, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: AuthUser) => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'signin'
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetScore, setTargetScore] = useState(1550);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'signin') {
        const res = await AuthService.signIn(email, password);
        if (res.success && res.user) {
          await StorageService.syncFromCloud();
          onSuccess(res.user);
          onClose();
        } else {
          setError(res.error || 'Gagal masuk. Periksa kembali email dan password.');
        }
      } else {
        const res = await AuthService.signUp(name, email, password, targetScore);
        if (res.success && res.user) {
          await StorageService.syncFromCloud();
          onSuccess(res.user);
          onClose();
        } else {
          setError(res.error || 'Gagal mendaftar.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan sistem saat autentikasi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const res = await AuthService.signInWithGoogle();
      if (res.success && res.user) {
        await StorageService.syncFromCloud();
        onSuccess(res.user);
        onClose();
      } else {
        setError(res.error || 'Gagal masuk dengan akun Google.');
      }
    } catch (err: any) {
      setError(err.message || 'Gagal terhubung ke layanan Google.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-zinc-950/70 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-orange-100 overflow-hidden animate-in zoom-in-95">
        {/* Top Header with Orange/Amber gradient banner */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 p-6 text-white relative">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="absolute top-4 right-4 p-1.5 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center font-bold text-xs shadow-inner">
              M
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100">
              MoSAT • DSAT16 Account
            </span>
          </div>

          <h2 className="text-2xl font-black tracking-tight mt-1 text-white">
            {mode === 'signin' ? 'Masuk ke Akun Anda' : 'Buat Akun Mandiri'}
          </h2>
          <p className="text-xs text-orange-100 mt-0.5">
            {mode === 'signin' 
              ? 'Lanjutkan latihan dan pantau progres menuju 1500–1600'
              : 'Daftar sekarang untuk menyimpan riwayat drill dan Buku Dosa'}
          </p>

          {/* Sync badge status */}
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-amber-100/90 bg-black/15 w-fit px-2.5 py-0.5 rounded-full">
            <Cloud className="w-3 h-3 text-amber-200" />
            <span>
              {isFirebaseConfigured 
                ? 'Firebase Firestore Terhubung (mosat-5dc4f)' 
                : 'Penyimpanan Mandiri (Offline & LocalStorage)'}
            </span>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="px-6 pt-5">
          <div className="grid grid-cols-2 p-1 bg-zinc-100 rounded-2xl text-xs font-bold">
            <button
              onClick={() => { setMode('signin'); setError(null); }}
              disabled={isLoading}
              className={`py-2 rounded-xl transition-all ${
                mode === 'signin' 
                  ? 'bg-white text-zinc-900 shadow-sm' 
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Masuk (Sign In)
            </button>
            <button
              onClick={() => { setMode('signup'); setError(null); }}
              disabled={isLoading}
              className={`py-2 rounded-xl transition-all ${
                mode === 'signup' 
                  ? 'bg-white text-zinc-900 shadow-sm' 
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Daftar Baru (Sign Up)
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 text-xs">
          {/* Google Sign-in Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-700 font-semibold rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2.5 disabled:opacity-60"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.88c2.27-2.09 3.66-5.17 3.66-9.09z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.09C3.27 21.39 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.32c-.25-.72-.38-1.49-.38-2.32s.13-1.6.38-2.32V6.59H1.26C.46 8.18 0 9.99 0 12s.46 3.82 1.26 5.41l4.02-3.09z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.61 1.26 6.59l4.02 3.09c.95-2.83 3.6-4.93 6.72-4.93z"
              />
            </svg>
            <span>Lanjutkan dengan Akun Google</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-zinc-200"></div>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">atau dengan email</span>
            <div className="flex-1 h-px bg-zinc-200"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Nama Lengkap</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    required
                    disabled={isLoading}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Sarah Nurhaliza"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white text-zinc-900 text-xs transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-bold text-zinc-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="email"
                  required
                  disabled={isLoading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white text-zinc-900 text-xs transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-zinc-700 mb-1">Kata Sandi</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="password"
                  required
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white text-zinc-900 text-xs transition-colors"
                />
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Target Skor Digital SAT</label>
                <div className="grid grid-cols-4 gap-2">
                  {[1450, 1500, 1550, 1600].map(sc => (
                    <button
                      type="button"
                      key={sc}
                      disabled={isLoading}
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
            )}

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/20 text-xs transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Masuk Sekarang' : 'Daftar Akun Baru'}</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
