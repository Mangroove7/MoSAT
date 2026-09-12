import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Target, 
  Calculator, 
  Layers, 
  BookOpen, 
  Zap, 
  BarChart3, 
  Database,
  Maximize,
  Minimize,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { AuthService, AuthUser } from '../services/authService';
import { UserProfile } from '../types/sat';

export type ActiveTab = 'mock' | 'drill' | 'vocab' | 'materi' | 'desmos' | 'analytics';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenScraperModal: () => void;
  currentUser: AuthUser | null;
  onOpenAuthModal: (mode: 'signin' | 'signup') => void;
  onOpenEditProfile: () => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenScraperModal,
  currentUser,
  onOpenAuthModal,
  onOpenEditProfile,
  onSignOut
}) => {
  const [profile, setProfile] = useState<UserProfile>(() => StorageService.getProfile());

  useEffect(() => {
    const handleUpdate = () => {
      setProfile(StorageService.getProfile());
    };
    window.addEventListener('mosat-profile-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('mosat-profile-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="bg-zinc-950 text-white border-b border-zinc-800/80 px-4 sm:px-6 py-2.5 flex items-center justify-between select-none z-30 shrink-0 shadow-lg">
      {/* Brand: MoSAT - DSAT16 Style */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onSelectTab('mock')}
          className="flex items-center gap-2.5 text-left group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 via-amber-500 to-yellow-400 flex items-center justify-center font-black text-zinc-950 text-base shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-transform">
            16
          </div>
          <div>
            <div className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
              <span>MoSAT</span>
              <span className="text-[10px] uppercase font-extrabold tracking-wider bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-400 border border-orange-500/30 px-1.5 py-0.2 rounded-md">
                DSAT16
              </span>
            </div>
            <div className="text-[10px] text-zinc-400 -mt-0.5 hidden sm:block font-medium">
              Digital SAT Lab 1500–1600
            </div>
          </div>
        </button>
      </div>

      {/* Navigation Tabs - DSAT16 Yellow-Orange Theme */}
      <nav className="hidden md:flex items-center bg-zinc-900/90 p-1 rounded-2xl border border-zinc-800 text-xs font-semibold gap-0.5 shadow-inner">
        <button
          onClick={() => onSelectTab('mock')}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'mock'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-md shadow-orange-500/20'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>Simulasi SAT</span>
        </button>

        <button
          onClick={() => onSelectTab('drill')}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'drill'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-md shadow-orange-500/20'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Drill Soal</span>
        </button>

        <button
          onClick={() => onSelectTab('vocab')}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'vocab'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-md shadow-orange-500/20'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Bedah Vocab</span>
        </button>

        <button
          onClick={() => onSelectTab('materi')}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'materi'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-md shadow-orange-500/20'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-300" />
          <span>Materi Kilat</span>
        </button>

        <button
          onClick={() => onSelectTab('desmos')}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'desmos'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-md shadow-orange-500/20'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>Desmos Lab</span>
        </button>

        <button
          onClick={() => onSelectTab('analytics')}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'analytics'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-md shadow-orange-500/20'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </button>
      </nav>

      {/* Right Controls: Streak, Goal, Account, Tools */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Streak Pill with Orange Glow */}
        <div 
          className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-orange-500/30 rounded-full text-xs font-black text-amber-400 shadow-sm"
          title={`Streak aktif: ${profile.streak} hari berturut-turut!`}
        >
          <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
          <span>{profile.streak} Hari</span>
        </div>

        {/* Daily Goal Pill */}
        <div 
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 rounded-full text-xs text-zinc-300 border border-zinc-800"
          title="Target soal harian"
        >
          <span className="text-[10px] text-zinc-400">Target:</span>
          <span className="font-bold text-orange-400 font-mono">{profile.todayAnsweredCount}/{profile.dailyGoal}</span>
        </div>

        {/* Database & Scraper sync */}
        <button
          onClick={onOpenScraperModal}
          className="p-1.5 text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-colors border border-zinc-800"
          title="Sinkronisasi Bank Soal (College Board & satquestionbank)"
        >
          <Database className="w-4 h-4" />
        </button>

        {/* Fullscreen toggle */}
        <button
          onClick={toggleFullscreen}
          className="p-1.5 text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-colors border border-zinc-800 hidden sm:block"
          title={isFullscreen ? "Keluar Layar Penuh" : "Layar Penuh (Bluebook Immersion)"}
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>

        {/* User Account / Login Button */}
        {currentUser ? (
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1 pl-2 bg-zinc-900 hover:bg-zinc-800 rounded-full border border-zinc-800 transition-colors"
            >
              <div className="text-right hidden xl:block">
                <div className="text-[11px] font-bold text-white leading-tight">{currentUser.name}</div>
                <div className="text-[9px] text-orange-400 font-semibold">Target {currentUser.targetScore}</div>
              </div>
              <div className={`w-7 h-7 rounded-full ${currentUser.avatarColor || 'bg-orange-500'} text-zinc-950 font-black text-xs flex items-center justify-center shadow-md`}>
                {getInitials(currentUser.name)}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 pr-0.5" />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl p-2 z-50 text-xs text-zinc-300 animate-in fade-in zoom-in-95">
                <div className="p-3 border-b border-zinc-800">
                  <div className="font-bold text-white text-sm">{currentUser.name}</div>
                  <div className="text-zinc-400 text-[11px] truncate">{currentUser.email}</div>
                  <div className="mt-2 text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 inline-block">
                    Target Skor: {currentUser.targetScore}
                  </div>
                </div>

                <div className="p-1 space-y-0.5">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onOpenEditProfile();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-zinc-800 hover:text-white transition-colors flex items-center gap-2 font-medium text-amber-400"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Edit Profil & Target SAT</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectTab('analytics');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-zinc-800 hover:text-white transition-colors flex items-center gap-2 font-medium"
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-orange-400" />
                    <span>Dashboard & Buku Dosa</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onOpenAuthModal('signin');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-zinc-800 hover:text-white transition-colors flex items-center gap-2 font-medium text-zinc-400"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Ganti Akun Lain</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onSignOut();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-950/40 text-rose-400 transition-colors flex items-center gap-2 font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar (Sign Out)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => onOpenAuthModal('signin')}
            className="px-4 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 font-bold text-xs text-white rounded-xl shadow-md shadow-orange-500/25 transition-all flex items-center gap-1.5"
          >
            <User className="w-3.5 h-3.5" />
            <span>Masuk / Daftar</span>
          </button>
        )}
      </div>
    </header>
  );
};
