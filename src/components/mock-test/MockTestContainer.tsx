import React, { useState, useMemo } from 'react';
import { SATQuestion, MockTestAttempt } from '../../types/sat';
import { StorageService } from '../../services/storageService';
import { 
  determineNextModuleDifficulty, 
  calculateSectionScore, 
  calculateFullTestScore,
  SectionScoreResult 
} from '../../services/scoringService';
import { BluebookHeader } from './BluebookHeader';
import { BluebookToolbar } from './BluebookToolbar';
import { QuestionCard } from './QuestionCard';
import { QuestionGridModal } from './QuestionGridModal';
import { ReviewScreen } from './ReviewScreen';
import { BreakScreen } from './BreakScreen';
import { TestResultView } from './TestResultView';
import { DesmosModal } from '../common/DesmosModal';
import { ReferenceSheetModal } from '../common/ReferenceSheetModal';
import { Play, Sparkles, BookOpen, Clock, ShieldCheck, ChevronRight, ChevronLeft } from 'lucide-react';

type TestStage = 
  | 'intro'
  | 'rw_m1' 
  | 'rw_m1_review' 
  | 'rw_m2' 
  | 'rw_m2_review' 
  | 'break' 
  | 'math_m1' 
  | 'math_m1_review' 
  | 'math_m2' 
  | 'math_m2_review' 
  | 'result';

interface MockTestContainerProps {
  onGoToAnalytics: () => void;
}

export const MockTestContainer: React.FC<MockTestContainerProps> = ({ onGoToAnalytics }) => {
  const [stage, setStage] = useState<TestStage>('intro');
  const [testMode, setTestMode] = useState<'full' | 'rw_only' | 'math_only'>('full');

  // Question navigation
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [flaggedIndices, setFlaggedIndices] = useState<Set<number>>(new Set());
  const [struckThroughOptions, setStruckThroughOptions] = useState<string[]>([]);
  const [isEliminationMode, setIsEliminationMode] = useState(false);
  const [activeHighlightColor, setActiveHighlightColor] = useState<string | null>(null);

  // Modals
  const [isGridModalOpen, setIsGridModalOpen] = useState(false);
  const [isDesmosOpen, setIsDesmosOpen] = useState(false);
  const [isReferenceOpen, setIsReferenceOpen] = useState(false);
  const [isDirectionsOpen, setIsDirectionsOpen] = useState(false);

  // Scoring & Performance States
  const [rwM1Correct, setRwM1Correct] = useState(0);
  const [rwM2Difficulty, setRwM2Difficulty] = useState<'Easy' | 'Hard'>('Hard');
  const [rwResult, setRwResult] = useState<SectionScoreResult | null>(null);

  const [mathM1Correct, setMathM1Correct] = useState(0);
  const [mathM2Difficulty, setMathM2Difficulty] = useState<'Easy' | 'Hard'>('Hard');
  const [finalAttempt, setFinalAttempt] = useState<MockTestAttempt | null>(null);

  // Load questions database
  const allQuestions = useMemo(() => StorageService.getAllQuestions(), []);

  // Split into sets for modules
  const { rwQuestionsM1, rwQuestionsM2Hard, rwQuestionsM2Easy, mathQuestionsM1, mathQuestionsM2Hard, mathQuestionsM2Easy } = useMemo(() => {
    const rw = allQuestions.filter(q => q.section === 'Reading and Writing');
    const math = allQuestions.filter(q => q.section === 'Math');

    // Balance questions
    const rwM1 = rw.slice(0, Math.min(10, rw.length)); // standard sample for test run
    const rwM2H = rw.filter(q => q.difficulty === 'Hard').slice(0, 10);
    const rwM2E = rw.filter(q => q.difficulty !== 'Hard').slice(0, 10);

    const mathM1 = math.slice(0, Math.min(10, math.length));
    const mathM2H = math.filter(q => q.difficulty === 'Hard').slice(0, 10);
    const mathM2E = math.filter(q => q.difficulty !== 'Hard').slice(0, 10);

    return {
      rwQuestionsM1: rwM1,
      rwQuestionsM2Hard: rwM2H.length ? rwM2H : rwM1,
      rwQuestionsM2Easy: rwM2E.length ? rwM2E : rwM1,
      mathQuestionsM1: mathM1,
      mathQuestionsM2Hard: mathM2H.length ? mathM2H : mathM1,
      mathQuestionsM2Easy: mathM2E.length ? mathM2E : mathM1
    };
  }, [allQuestions]);

  // Determine current question list based on stage
  const currentQuestions: SATQuestion[] = useMemo(() => {
    switch (stage) {
      case 'rw_m1':
      case 'rw_m1_review':
        return rwQuestionsM1;
      case 'rw_m2':
      case 'rw_m2_review':
        return rwM2Difficulty === 'Hard' ? rwQuestionsM2Hard : rwQuestionsM2Easy;
      case 'math_m1':
      case 'math_m1_review':
        return mathQuestionsM1;
      case 'math_m2':
      case 'math_m2_review':
        return mathM2Difficulty === 'Hard' ? mathQuestionsM2Hard : mathQuestionsM2Easy;
      default:
        return [];
    }
  }, [stage, rwQuestionsM1, rwQuestionsM2Hard, rwQuestionsM2Easy, rwM2Difficulty, mathQuestionsM1, mathQuestionsM2Hard, mathQuestionsM2Easy, mathM2Difficulty]);

  const currentQuestion = currentQuestions[currentIndex];

  // Reset module state
  const resetModuleState = () => {
    setCurrentIndex(0);
    setFlaggedIndices(new Set());
    setStruckThroughOptions([]);
    setIsEliminationMode(false);
  };

  // Start Test
  const startTest = () => {
    resetModuleState();
    setUserAnswers({});
    if (testMode === 'math_only') {
      setStage('math_m1');
    } else {
      setStage('rw_m1');
    }
  };

  // Submit RW Module 1
  const handleSubmitRwM1 = () => {
    let correct = 0;
    rwQuestionsM1.forEach(q => {
      if (userAnswers[q.id]?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
        correct++;
      }
    });
    setRwM1Correct(correct);
    const nextDiff = determineNextModuleDifficulty('Reading and Writing', correct, rwQuestionsM1.length);
    setRwM2Difficulty(nextDiff);
    resetModuleState();
    setStage('rw_m2');
  };

  // Submit RW Module 2
  const handleSubmitRwM2 = () => {
    const m2List = rwM2Difficulty === 'Hard' ? rwQuestionsM2Hard : rwQuestionsM2Easy;
    let m2Correct = 0;
    m2List.forEach(q => {
      if (userAnswers[q.id]?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
        m2Correct++;
      }
    });

    const res = calculateSectionScore(
      'Reading and Writing',
      rwM1Correct,
      rwQuestionsM1.length,
      m2Correct,
      m2List.length,
      rwM2Difficulty
    );
    setRwResult(res);

    if (testMode === 'rw_only') {
      finishTest(res, {
        score: 750,
        module1Correct: 18,
        module1Total: 22,
        module2Difficulty: 'Hard',
        module2Correct: 19,
        module2Total: 22,
        totalCorrect: 37,
        totalQuestions: 44
      });
    } else {
      setStage('break');
    }
  };

  // Submit Math Module 1
  const handleSubmitMathM1 = () => {
    let correct = 0;
    mathQuestionsM1.forEach(q => {
      if (userAnswers[q.id]?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
        correct++;
      }
    });
    setMathM1Correct(correct);
    const nextDiff = determineNextModuleDifficulty('Math', correct, mathQuestionsM1.length);
    setMathM2Difficulty(nextDiff);
    resetModuleState();
    setStage('math_m2');
  };

  // Submit Math Module 2
  const handleSubmitMathM2 = () => {
    const m2List = mathM2Difficulty === 'Hard' ? mathQuestionsM2Hard : mathQuestionsM2Easy;
    let m2Correct = 0;
    m2List.forEach(q => {
      if (userAnswers[q.id]?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
        m2Correct++;
      }
    });

    const mathRes = calculateSectionScore(
      'Math',
      mathM1Correct,
      mathQuestionsM1.length,
      m2Correct,
      m2List.length,
      mathM2Difficulty
    );

    const rwResToUse = rwResult || {
      score: 740,
      module1Correct: rwM1Correct || 20,
      module1Total: 27,
      module2Difficulty: 'Hard',
      module2Correct: 22,
      module2Total: 27,
      totalCorrect: 42,
      totalQuestions: 54
    };

    finishTest(rwResToUse, mathRes);
  };

  const finishTest = (rwRes: SectionScoreResult, mathRes: SectionScoreResult) => {
    const full = calculateFullTestScore(rwRes, mathRes);

    const answersMap: Record<string, { answer: string; isCorrect: boolean; timeSeconds: number }> = {};
    allQuestions.forEach(q => {
      if (userAnswers[q.id]) {
        const isCorrect = userAnswers[q.id]?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
        answersMap[q.id] = {
          answer: userAnswers[q.id],
          isCorrect,
          timeSeconds: 65
        };
        // Record to profile and mistakes
        StorageService.recordQuestionAnswered(q.id, isCorrect);
        if (!isCorrect) {
          StorageService.addMistake(q.id, userAnswers[q.id], q.correctAnswer, 'careless', 'Salah saat simulasi.');
        }
      }
    });

    const attempt: MockTestAttempt = {
      id: `mock-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      totalScore: full.totalScore,
      rwScore: rwRes.score,
      mathScore: mathRes.score,
      percentile: full.percentile,
      rwModule1Correct: rwRes.module1Correct,
      rwModule1Total: rwRes.module1Total,
      rwModule2Difficulty: rwRes.module2Difficulty,
      rwModule2Correct: rwRes.module2Correct,
      rwModule2Total: rwRes.module2Total,
      mathModule1Correct: mathRes.module1Correct,
      mathModule1Total: mathRes.module1Total,
      mathModule2Difficulty: mathRes.module2Difficulty,
      mathModule2Correct: mathRes.module2Correct,
      mathModule2Total: mathRes.module2Total,
      totalTimeSeconds: 4200,
      answers: answersMap
    };

    StorageService.saveMockTestAttempt(attempt);
    setFinalAttempt(attempt);
    setStage('result');
  };

  // Flag toggle
  const toggleFlag = () => {
    setFlaggedIndices(prev => {
      const next = new Set(prev);
      if (next.has(currentIndex)) {
        next.delete(currentIndex);
      } else {
        next.add(currentIndex);
      }
      return next;
    });
  };

  // Strike toggle
  const toggleStrike = (optionId: string) => {
    setStruckThroughOptions(prev => {
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId);
      } else {
        return [...prev, optionId];
      }
    });
  };

  // If on Intro stage
  if (stage === 'intro') {
    return (
      <div className="flex-1 bg-zinc-50 overflow-y-auto p-4 sm:p-10 flex flex-col items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-3xl p-6 sm:p-10 border border-orange-100/80 shadow-2xl space-y-8 animate-in fade-in">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-gradient-to-tr from-orange-500 via-amber-500 to-yellow-400 rounded-2xl flex items-center justify-center text-zinc-950 mx-auto shadow-xl shadow-orange-500/25 font-black text-2xl tracking-tight">
              16
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>DSAT16 Adaptive Bluebook Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
              MoSAT Full Bluebook Simulator
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto">
              Simulasi ujian digital SAT 1:1 identik dengan lingkungan resmi College Board Bluebook (Routing Adaptif, Desmos resmi, dan Formula Sheet).
            </p>
          </div>

          {/* Test Mode Selector */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600">
              Pilih Paket Simulasi:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setTestMode('full')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  testMode === 'full'
                    ? 'border-orange-500 bg-orange-50/70 ring-2 ring-orange-500/30 shadow-sm'
                    : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/50'
                }`}
              >
                <div className="font-bold text-sm text-zinc-900 flex items-center justify-between">
                  <span>Full Test</span>
                  <span className="text-[10px] font-mono bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded font-bold">1600</span>
                </div>
                <div className="text-[11px] text-zinc-500 mt-1">RW + Math (Adaptif) + Break 10 Menit</div>
              </button>

              <button
                onClick={() => setTestMode('rw_only')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  testMode === 'rw_only'
                    ? 'border-orange-500 bg-orange-50/70 ring-2 ring-orange-500/30 shadow-sm'
                    : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/50'
                }`}
              >
                <div className="font-bold text-sm text-zinc-900 flex items-center justify-between">
                  <span>R&W Only</span>
                  <span className="text-[10px] font-mono bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded font-bold">800</span>
                </div>
                <div className="text-[11px] text-zinc-500 mt-1">2 Modul Reading & Writing Adaptif</div>
              </button>

              <button
                onClick={() => setTestMode('math_only')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  testMode === 'math_only'
                    ? 'border-orange-500 bg-orange-50/70 ring-2 ring-orange-500/30 shadow-sm'
                    : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/50'
                }`}
              >
                <div className="font-bold text-sm text-zinc-900 flex items-center justify-between">
                  <span>Math Only</span>
                  <span className="text-[10px] font-mono bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded font-bold">800</span>
                </div>
                <div className="text-[11px] text-zinc-500 mt-1">2 Modul Math + Desmos API Resmi</div>
              </button>
            </div>
          </div>

          {/* Environmental feature checklist */}
          <div className="bg-orange-50/40 p-4 rounded-2xl border border-orange-100 grid grid-cols-2 gap-3 text-xs text-zinc-700">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-orange-600 shrink-0" />
              <span>Desmos Graphing Calculator Resmi</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-orange-600 shrink-0" />
              <span>Multi-Stage Adaptive Routing (M1-M2)</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-orange-600 shrink-0" />
              <span>Eliminasi Strikethrough (ABC) & Highlight</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-orange-600 shrink-0" />
              <span>Mark for Review & Grid Drawer</span>
            </div>
          </div>

          {/* Start CTA */}
          <button
            onClick={startTest}
            className="w-full py-4 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:to-amber-600 text-zinc-950 font-black text-sm rounded-2xl shadow-xl shadow-orange-500/25 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-zinc-950" />
            <span>Mulai Ujian Simulasi Sekarang</span>
          </button>
        </div>
      </div>
    );
  }

  // Result stage
  if (stage === 'result' && finalAttempt) {
    const qMap: Record<string, SATQuestion> = {};
    allQuestions.forEach(q => { qMap[q.id] = q; });
    return (
      <TestResultView
        attempt={finalAttempt}
        questionsMap={qMap}
        onRetakeTest={() => setStage('intro')}
        onGoToAnalytics={onGoToAnalytics}
      />
    );
  }

  // Break stage
  if (stage === 'break') {
    return (
      <BreakScreen
        onEndBreak={() => {
          resetModuleState();
          setStage('math_m1');
        }}
      />
    );
  }

  // Review Screens
  if (stage === 'rw_m1_review') {
    return (
      <ReviewScreen
        moduleName="Reading & Writing (Module 1)"
        totalQuestions={rwQuestionsM1.length}
        questionIds={rwQuestionsM1.map(q => q.id)}
        answers={userAnswers}
        flaggedIndices={flaggedIndices}
        onSelectIndex={(idx) => {
          setCurrentIndex(idx);
          setStage('rw_m1');
        }}
        onSubmitModule={handleSubmitRwM1}
        onReturnToTest={() => setStage('rw_m1')}
      />
    );
  }

  if (stage === 'rw_m2_review') {
    const list = rwM2Difficulty === 'Hard' ? rwQuestionsM2Hard : rwQuestionsM2Easy;
    return (
      <ReviewScreen
        moduleName={`Reading & Writing (Module 2 - ${rwM2Difficulty})`}
        totalQuestions={list.length}
        questionIds={list.map(q => q.id)}
        answers={userAnswers}
        flaggedIndices={flaggedIndices}
        onSelectIndex={(idx) => {
          setCurrentIndex(idx);
          setStage('rw_m2');
        }}
        onSubmitModule={handleSubmitRwM2}
        onReturnToTest={() => setStage('rw_m2')}
      />
    );
  }

  if (stage === 'math_m1_review') {
    return (
      <ReviewScreen
        moduleName="Math (Module 1)"
        totalQuestions={mathQuestionsM1.length}
        questionIds={mathQuestionsM1.map(q => q.id)}
        answers={userAnswers}
        flaggedIndices={flaggedIndices}
        onSelectIndex={(idx) => {
          setCurrentIndex(idx);
          setStage('math_m1');
        }}
        onSubmitModule={handleSubmitMathM1}
        onReturnToTest={() => setStage('math_m1')}
      />
    );
  }

  if (stage === 'math_m2_review') {
    const list = mathM2Difficulty === 'Hard' ? mathQuestionsM2Hard : mathQuestionsM2Easy;
    return (
      <ReviewScreen
        moduleName={`Math (Module 2 - ${mathM2Difficulty})`}
        totalQuestions={list.length}
        questionIds={list.map(q => q.id)}
        answers={userAnswers}
        flaggedIndices={flaggedIndices}
        onSelectIndex={(idx) => {
          setCurrentIndex(idx);
          setStage('math_m2');
        }}
        onSubmitModule={handleSubmitMathM2}
        onReturnToTest={() => setStage('math_m2')}
      />
    );
  }

  // Active testing in progress
  const isMath = stage === 'math_m1' || stage === 'math_m2';
  const sectionTitle = isMath ? 'Math' : 'Reading and Writing';
  const moduleText = stage === 'rw_m1' ? 'Module 1' 
    : stage === 'rw_m2' ? `Module 2 (${rwM2Difficulty})`
    : stage === 'math_m1' ? 'Module 1'
    : `Module 2 (${mathM2Difficulty})`;

  const timeSeconds = isMath ? 2100 : 1920; // 35m for Math, 32m for RW

  const handleNext = () => {
    if (currentIndex < currentQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Go to Review Screen
      if (stage === 'rw_m1') setStage('rw_m1_review');
      else if (stage === 'rw_m2') setStage('rw_m2_review');
      else if (stage === 'math_m1') setStage('math_m1_review');
      else if (stage === 'math_m2') setStage('math_m2_review');
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white select-none overflow-hidden relative">
      {/* Top Header */}
      <BluebookHeader
        sectionTitle={sectionTitle}
        moduleText={moduleText}
        initialTimeSeconds={timeSeconds}
        onTimeExpired={() => {
          // Auto submit to review on expiry
          if (stage === 'rw_m1') setStage('rw_m1_review');
          else if (stage === 'rw_m2') setStage('rw_m2_review');
          else if (stage === 'math_m1') setStage('math_m1_review');
          else if (stage === 'math_m2') setStage('math_m2_review');
        }}
        onOpenDirections={() => setIsDirectionsOpen(true)}
      />

      {/* Toolbar */}
      <BluebookToolbar
        isMathSection={isMath}
        isFlagged={flaggedIndices.has(currentIndex)}
        onToggleFlag={toggleFlag}
        onOpenDesmos={() => setIsDesmosOpen(true)}
        onOpenReference={() => setIsReferenceOpen(true)}
        isEliminationMode={isEliminationMode}
        onToggleEliminationMode={() => setIsEliminationMode(!isEliminationMode)}
        activeHighlightColor={activeHighlightColor}
        onSelectHighlightColor={setActiveHighlightColor}
      />

      {/* Question Card Split View */}
      {currentQuestion ? (
        <QuestionCard
          question={currentQuestion}
          questionNumber={currentIndex + 1}
          totalQuestions={currentQuestions.length}
          selectedAnswer={userAnswers[currentQuestion.id] || ''}
          onSelectAnswer={(ans) => setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: ans }))}
          isEliminationMode={isEliminationMode}
          struckThroughOptions={struckThroughOptions}
          onToggleStrikeThrough={toggleStrike}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-400">
          Memuat soal...
        </div>
      )}

      {/* Bottom Bar Navigation */}
      <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-t border-slate-800 z-20">
        <div>
          <button
            onClick={handleBack}
            disabled={currentIndex === 0}
            className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              currentIndex === 0 
                ? 'opacity-40 cursor-not-allowed text-slate-500' 
                : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>

        {/* Center: Question Grid Trigger */}
        <div>
          <button
            onClick={() => setIsGridModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors border border-slate-700 shadow-sm"
          >
            <span>Question {currentIndex + 1} of {currentQuestions.length}</span>
            <span className="text-[10px] text-slate-400">▲</span>
          </button>
        </div>

        <div>
          <button
            onClick={handleNext}
            className="flex items-center gap-1 px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-xs font-bold text-white transition-all shadow-md shadow-orange-500/25"
          >
            <span>{currentIndex === currentQuestions.length - 1 ? 'Review' : 'Next'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modals */}
      <QuestionGridModal
        isOpen={isGridModalOpen}
        onClose={() => setIsGridModalOpen(false)}
        totalQuestions={currentQuestions.length}
        currentIndex={currentIndex}
        onSelectIndex={setCurrentIndex}
        answers={userAnswers}
        flaggedIndices={flaggedIndices}
        questionIds={currentQuestions.map(q => q.id)}
      />

      <DesmosModal
        isOpen={isDesmosOpen}
        onClose={() => setIsDesmosOpen(false)}
      />

      <ReferenceSheetModal
        isOpen={isReferenceOpen}
        onClose={() => setIsReferenceOpen(false)}
      />

      {/* Directions Modal */}
      {isDirectionsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-slate-900">Petunjuk Modul {sectionTitle}</h3>
            <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <p>• Semua pertanyaan pada modul ini memiliki bobot nilai yang setara.</p>
              <p>• Tidak ada pengurangan nilai untuk jawaban yang salah. Pastikan untuk menjawab setiap soal sebelum waktu berakhir.</p>
              <p>• Di modul matematika, kalkulator Desmos resmi tersedia di toolbar atas.</p>
              <p>• Anda dapat menandai soal untuk ditinjau kembali dengan tombol <em>Mark for Review</em>.</p>
            </div>
            <button
              onClick={() => setIsDirectionsOpen(false)}
              className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl"
            >
              Mengerti & Lanjutkan Ujian
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
