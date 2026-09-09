import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { MockTestContainer } from './components/mock-test/MockTestContainer';
import { DrillHub } from './components/drill/DrillHub';
import { DrillSession } from './components/drill/DrillSession';
import { VocabHub } from './components/vocab/VocabHub';
import { MateriHub } from './components/materi/MateriHub';
import { DesmosLab } from './components/desmos/DesmosLab';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { ScraperManagerModal } from './components/common/ScraperManagerModal';
import { AuthModal } from './components/auth/AuthModal';
import { MistakeReviewModal } from './components/mistakes/MistakeReviewModal';
import { AuthService, AuthUser } from './services/authService';
import { StorageService } from './services/storageService';
import { SATQuestion } from './types/sat';
import { 
  Target, 
  Layers, 
  BookOpen, 
  Zap, 
  Calculator, 
  BarChart3 
} from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('mock');
  const [isScraperModalOpen, setIsScraperModalOpen] = useState(false);

  // Authentication state
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => AuthService.getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');

  // Drill active state
  const [activeDrillQuestions, setActiveDrillQuestions] = useState<SATQuestion[] | null>(null);
  const [drillMode, setDrillMode] = useState<'instant' | 'timed'>('instant');

  // Mistake Review modal state
  const [isMistakeReviewOpen, setIsMistakeReviewOpen] = useState(false);
  const [selectedMistakeQuestionId, setSelectedMistakeQuestionId] = useState<string | null>(null);

  // Subscribe to real-time auth changes and trigger cloud sync
  useEffect(() => {
    const unsubscribe = AuthService.initAuthListener(async (user) => {
      setCurrentUser(user);
      if (user) {
        await StorageService.syncFromCloud();
      }
    });

    const handleStorageChange = () => {
      setCurrentUser(AuthService.getCurrentUser());
    };
    window.addEventListener('storage', handleStorageChange);

    // Initial cloud sync if already signed in
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
  };

  // Triggered when user starts a drill from DrillHub
  const handleStartDrill = (questions: SATQuestion[], mode: 'instant' | 'timed') => {
    setActiveDrillQuestions(questions);
    setDrillMode(mode);
  };

  const handleExitDrill = () => {
    setActiveDrillQuestions(null);
  };

  // Switch to analytics from mock test result
  const handleGoToAnalytics = () => {
    setActiveTab('analytics');
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-zinc-50 font-sans">
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
        onSignOut={handleSignOut}
      />

      {/* Main Views */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
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
              onOpenMistakeReview={() => {
                setSelectedMistakeQuestionId(null);
                setIsMistakeReviewOpen(true);
              }}
            />
          )
        )}

        {activeTab === 'vocab' && (
          <VocabHub />
        )}

        {activeTab === 'materi' && (
          <MateriHub />
        )}

        {activeTab === 'desmos' && (
          <DesmosLab />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            onStartTargetedDrill={(qs) => {
              setActiveTab('drill');
              handleStartDrill(qs, 'instant');
            }}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar - DSAT16 Yellow-Orange Theme */}
      <div className="md:hidden bg-zinc-950 border-t border-zinc-800 px-3 py-2 flex items-center justify-around text-zinc-400 z-30 shrink-0">
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
          // Trigger refresh
        }}
      />

      {/* Real Multi-User Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
        }}
        initialMode={authModalMode}
      />

      {/* Interactive Mistake Review & Re-attempt Modal */}
      <MistakeReviewModal
        isOpen={isMistakeReviewOpen}
        initialQuestionId={selectedMistakeQuestionId}
        onClose={() => setIsMistakeReviewOpen(false)}
      />
    </div>
  );
};

export default App;
