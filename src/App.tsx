import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { ScraperManagerModal } from './components/common/ScraperManagerModal';
import { AuthModal } from './components/auth/AuthModal';
import { MistakeReviewModal } from './components/mistakes/MistakeReviewModal';
import { EditProfileModal } from './components/profile/EditProfileModal';
import { OnboardingModal } from './components/auth/OnboardingModal';
import { AuthService, AuthUser } from './services/authService';
import { StorageService } from './services/storageService';
import { SATQuestion } from './types/sat';
import { 
  Target, 
  Layers, 
  BookOpen, 
  Zap, 
  Calculator, 
  BarChart3,
  Loader2
} from 'lucide-react';

// Code-split heavy modules to achieve sub-second initial load time
const MockTestContainer = lazy(() => import('./components/mock-test/MockTestContainer').then(m => ({ default: m.MockTestContainer })));
const DrillHub = lazy(() => import('./components/drill/DrillHub').then(m => ({ default: m.DrillHub })));
const DrillSession = lazy(() => import('./components/drill/DrillSession').then(m => ({ default: m.DrillSession })));
const VocabHub = lazy(() => import('./components/vocab/VocabHub').then(m => ({ default: m.VocabHub })));
const MateriHub = lazy(() => import('./components/materi/MateriHub').then(m => ({ default: m.MateriHub })));
const DesmosLab = lazy(() => import('./components/desmos/DesmosLab').then(m => ({ default: m.DesmosLab })));
const AnalyticsDashboard = lazy(() => import('./components/analytics/AnalyticsDashboard').then(m => ({ default: m.AnalyticsDashboard })));

const ViewLoadingFallback = () => (
  <div className="flex-1 flex flex-col items-center justify-center p-8 bg-zinc-950 text-zinc-400 space-y-3">
    <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
      <Loader2 className="w-5 h-5 animate-spin" />
    </div>
    <div className="text-xs font-semibold text-zinc-300">Memuat Modul Latihan...</div>
  </div>
);

export const App: React.FC = () => {
  // Authentication state
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => AuthService.getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');

  // Landing page visible if visitor is not logged in
  const [showLanding, setShowLanding] = useState<boolean>(() => !AuthService.getCurrentUser());

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('mock');
  const [isScraperModalOpen, setIsScraperModalOpen] = useState(false);

  // Drill active state
  const [activeDrillQuestions, setActiveDrillQuestions] = useState<SATQuestion[] | null>(null);
  const [drillMode, setDrillMode] = useState<'instant' | 'timed'>('instant');

  // Mistake Review modal state
  const [isMistakeReviewOpen, setIsMistakeReviewOpen] = useState(false);
  const [selectedMistakeQuestionId, setSelectedMistakeQuestionId] = useState<string | null>(null);

  // Edit Profile & Onboarding states
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Prefetch full question bank in background & subscribe to auth state
  useEffect(() => {
    // 1. Asynchronously load the 2,881+ question bank without blocking first paint
    StorageService.loadFullQuestionBank().catch(() => {});

    // 2. Real-time Firebase Auth listener
    const unsubscribe = AuthService.initAuthListener(async (user) => {
      setCurrentUser(user);
      if (user) {
        setShowLanding(false);
        await StorageService.syncFromCloud();
      }
    });

    const handleStorageChange = () => {
      const u = AuthService.getCurrentUser();
      setCurrentUser(u);
      if (u) setShowLanding(false);
    };
    window.addEventListener('storage', handleStorageChange);

    // 3. Cloud sync if signed in
    const active = AuthService.getCurrentUser();
    if (active) {
      StorageService.syncFromCloud().catch(() => {});
    }

    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleOpenAuthModal = (mode: 'signin' | 'signup') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleSignOut = async () => {
    await AuthService.signOut();
    setCurrentUser(null);
    setShowLanding(true);
  };

  const handleStartDrill = (questions: SATQuestion[], mode: 'instant' | 'timed') => {
    setActiveDrillQuestions(questions);
    setDrillMode(mode);
  };

  const handleExitDrill = () => {
    setActiveDrillQuestions(null);
  };

  const handleGoToAnalytics = () => {
    setActiveTab('analytics');
    setShowLanding(false);
  };

  // If visitor is on landing page
  if (showLanding) {
    return (
      <div className="min-h-screen w-screen bg-zinc-950 flex flex-col font-sans overflow-x-hidden">
        {/* Simplified Header for Landing Page */}
        <header className="h-16 px-4 sm:px-6 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 via-amber-500 to-yellow-400 flex items-center justify-center font-black text-zinc-950 text-sm shadow-md shadow-orange-500/20">
              16
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black text-white tracking-tight">MoSAT</span>
              <span className="text-[10px] uppercase font-bold text-orange-400 bg-orange-500/10 border border-orange-500/30 px-1.5 py-0.5 rounded">
                DSAT16
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowLanding(false)}
              className="px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
            >
              Mode Tamu
            </button>
            <button
              onClick={() => handleOpenAuthModal('signin')}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-zinc-950 font-bold text-xs rounded-xl shadow-md shadow-orange-500/25 transition-transform hover:scale-102"
            >
              Masuk / Daftar
            </button>
          </div>
        </header>

        <main className="flex-1">
          <LandingPage
            onStartPractice={() => setShowLanding(false)}
            onOpenAuth={(mode) => handleOpenAuthModal(mode)}
          />
        </main>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={(user) => {
            setCurrentUser(user);
            setShowLanding(false);
          }}
          initialMode={authModalMode}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-zinc-950 font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setActiveDrillQuestions(null);
        }}
        onOpenScraperModal={() => setIsScraperModalOpen(true)}
        currentUser={currentUser}
        onOpenAuthModal={handleOpenAuthModal}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* Main Views with Lazy Suspense */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <Suspense fallback={<ViewLoadingFallback />}>
          {activeTab === 'mock' && (
            <MockTestContainer
              onGoToAnalytics={handleGoToAnalytics}
            />
          )}

          {activeTab === 'drill' && (
            activeDrillQuestions ? (
              <DrillSession
                questions={activeDrillQuestions}
                mode={drillMode}
                onExit={handleExitDrill}
              />
            ) : (
              <DrillHub
                onStartDrill={handleStartDrill}
                onOpenMistakeReview={() => setIsMistakeReviewOpen(true)}
              />
            )
          )}

          {activeTab === 'vocab' && <VocabHub />}

          {activeTab === 'materi' && <MateriHub />}

          {activeTab === 'desmos' && <DesmosLab />}

          {activeTab === 'analytics' && (
            <AnalyticsDashboard
              onStartTargetedDrill={(qs) => handleStartDrill(qs, 'instant')}
            />
          )}
        </Suspense>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden flex items-center justify-around py-2.5 px-2 bg-zinc-950/95 border-t border-zinc-800 text-zinc-400 shrink-0 z-30">
        <button
          onClick={() => { setActiveTab('mock'); setActiveDrillQuestions(null); }}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
            activeTab === 'mock' ? 'text-orange-400 font-bold' : 'hover:text-white'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Simulasi</span>
        </button>

        <button
          onClick={() => { setActiveTab('drill'); setActiveDrillQuestions(null); }}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
            activeTab === 'drill' ? 'text-orange-400 font-bold' : 'hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Drill</span>
        </button>

        <button
          onClick={() => { setActiveTab('vocab'); setActiveDrillQuestions(null); }}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
            activeTab === 'vocab' ? 'text-orange-400 font-bold' : 'hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Vocab</span>
        </button>

        <button
          onClick={() => { setActiveTab('materi'); setActiveDrillQuestions(null); }}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
            activeTab === 'materi' ? 'text-orange-400 font-bold' : 'hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Materi</span>
        </button>

        <button
          onClick={() => { setActiveTab('desmos'); setActiveDrillQuestions(null); }}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
            activeTab === 'desmos' ? 'text-orange-400 font-bold' : 'hover:text-white'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Desmos</span>
        </button>

        <button
          onClick={() => { setActiveTab('analytics'); setActiveDrillQuestions(null); }}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
            activeTab === 'analytics' ? 'text-orange-400 font-bold' : 'hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analisis</span>
        </button>
      </div>

      {/* Scraper / Question Bank Manager Modal */}
      <ScraperManagerModal
        isOpen={isScraperModalOpen}
        onClose={() => setIsScraperModalOpen(false)}
        onQuestionsUpdated={() => {
          // Trigger state refresh
        }}
      />

      {/* Real Multi-User Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          setShowLanding(false);
          const prof = StorageService.getProfile();
          if (!prof.onboardingCompleted) {
            setIsOnboardingOpen(true);
          }
        }}
        initialMode={authModalMode}
      />

      {/* Interactive Mistake Review & Re-attempt Modal */}
      <MistakeReviewModal
        isOpen={isMistakeReviewOpen}
        initialQuestionId={selectedMistakeQuestionId}
        onClose={() => setIsMistakeReviewOpen(false)}
      />

      {/* Edit Profile & SAT Target Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        onProfileUpdated={() => {
          setCurrentUser(AuthService.getCurrentUser());
        }}
      />

      {/* Onboarding Diagnostic & Study Pace Setup Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={() => {
          setIsOnboardingOpen(false);
          setCurrentUser(AuthService.getCurrentUser());
        }}
      />
    </div>
  );
};

export default App;
