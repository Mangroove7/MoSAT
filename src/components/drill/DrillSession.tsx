import React, { useState } from 'react';
import { SATQuestion } from '../../types/sat';
import { StorageService } from '../../services/storageService';
import { isAnswerCorrect } from '../../services/scoringService';
import { QuestionCard } from '../mock-test/QuestionCard';
import { DesmosModal } from '../common/DesmosModal';
import { ReferenceSheetModal } from '../common/ReferenceSheetModal';
import { 
  ArrowLeft, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Calculator, 
  FileText, 
  Sparkles,
  Trophy,
  RotateCcw,
  Home
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DrillSessionProps {
  questions: SATQuestion[];
  mode: 'instant' | 'timed';
  onExit: () => void;
}

export const DrillSession: React.FC<DrillSessionProps> = ({ questions, mode, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [hasChecked, setHasChecked] = useState(false);
  const [struckThroughOptions, setStruckThroughOptions] = useState<string[]>([]);
  const [isEliminationMode, setIsEliminationMode] = useState(false);
  const [isDesmosOpen, setIsDesmosOpen] = useState(false);
  const [isReferenceOpen, setIsReferenceOpen] = useState(false);
  const [addedToMistakes, setAddedToMistakes] = useState<Record<string, boolean>>({});
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  // Summary counts
  const [correctCount, setCorrectCount] = useState(0);

  const currentQuestion = questions[currentIndex] || questions[0];
  const isLast = currentIndex === questions.length - 1;
  const currentAnswer = userAnswers[currentQuestion?.id] || '';

  const isCorrect = currentQuestion ? isAnswerCorrect(currentAnswer, currentQuestion.correctAnswer) : false;

  const handleSelectAnswer = (ans: string) => {
    setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: ans }));
    if (mode === 'instant') {
      setHasChecked(true);
      const isRight = isAnswerCorrect(ans, currentQuestion.correctAnswer);
      StorageService.recordQuestionAnswered(currentQuestion.id, isRight);
      if (isRight) {
        setCorrectCount(prev => prev + 1);
      } else {
        StorageService.addMistake(currentQuestion.id, ans, currentQuestion.correctAnswer, 'careless', 'Salah saat drill soal.');
      }
    }
  };

  const handleNext = () => {
    if (isLast) {
      // Calculate latest accuracy
      const latestCorrect = isCorrect && mode === 'instant' ? correctCount : (
        mode === 'instant' ? correctCount : (
          questions.reduce((acc, q) => {
            const ans = userAnswers[q.id];
            return acc + (isAnswerCorrect(ans, q.correctAnswer) ? 1 : 0);
          }, 0)
        )
      );

      // Save drill session history to storage
      const answersMap: Record<string, { answer: string; isCorrect: boolean; timeSeconds: number }> = {};
      questions.forEach(q => {
        const a = userAnswers[q.id] || '';
        answersMap[q.id] = {
          answer: a,
          isCorrect: isAnswerCorrect(a, q.correctAnswer),
          timeSeconds: 60
        };
      });

      StorageService.saveDrillSession({
        id: `drill-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        domain: currentQuestion.domain,
        difficulty: currentQuestion.difficulty,
        totalQuestions: questions.length,
        correctCount: latestCorrect,
        totalTimeSeconds: questions.length * 60,
        questionIds: questions.map(q => q.id),
        answers: answersMap
      });

      confetti({ particleCount: 90, spread: 65 });
      setShowSummaryModal(true);
    } else {
      setCurrentIndex(prev => prev + 1);
      setHasChecked(false);
      setStruckThroughOptions([]);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setUserAnswers({});
    setHasChecked(false);
    setStruckThroughOptions([]);
    setCorrectCount(0);
    setAddedToMistakes({});
    setShowSummaryModal(false);
  };

  const toggleStrike = (optId: string) => {
    setStruckThroughOptions(prev => 
      prev.includes(optId) ? prev.filter(x => x !== optId) : [...prev, optId]
    );
  };

  const handleAddToMistakes = () => {
    StorageService.addMistake(
      currentQuestion.id, 
      currentAnswer || 'Tidak dijawab', 
      currentQuestion.correctAnswer, 
      'careless',
      'Ditandai dari sesi drill soal.'
    );
    setAddedToMistakes(prev => ({ ...prev, [currentQuestion.id]: true }));
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white select-none overflow-hidden relative">
      {/* Header */}
      <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg transition-colors text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Keluar Drill</span>
          </button>
          <div>
            <div className="text-xs text-blue-400 font-semibold uppercase tracking-wider">
              {currentQuestion.domain}
            </div>
            <div className="text-xs text-slate-400 hidden sm:block">
              {currentQuestion.skill}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3">
          <div className="text-xs font-semibold text-slate-300">
            Soal <span className="text-white font-bold text-sm">{currentIndex + 1}</span> / {questions.length}
          </div>
          <div className="w-24 sm:w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Quick Tools */}
        <div className="flex items-center gap-2">
          {currentQuestion.section === 'Math' && (
            <>
              <button
                onClick={() => setIsDesmosOpen(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
                title="Buka Desmos Calculator"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Desmos</span>
              </button>
              <button
                onClick={() => setIsReferenceOpen(true)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                title="Lembar Rumus"
              >
                <FileText className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Question Display */}
      <QuestionCard
        key={currentQuestion.id}
        question={currentQuestion}
        questionNumber={currentIndex + 1}
        totalQuestions={questions.length}
        selectedAnswer={currentAnswer}
        onSelectAnswer={handleSelectAnswer}
        isEliminationMode={isEliminationMode}
        struckThroughOptions={struckThroughOptions}
        onToggleStrikeThrough={toggleStrike}
        showExplanationDirectly={hasChecked}
        onOpenDesmos={() => setIsDesmosOpen(true)}
      />

      {/* Bottom Bar */}
      <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between border-t border-slate-800 z-20">
        <div className="flex items-center gap-3">
          {hasChecked && !isCorrect && (
            <button
              onClick={handleAddToMistakes}
              disabled={addedToMistakes[currentQuestion.id]}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                addedToMistakes[currentQuestion.id]
                  ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700'
                  : 'bg-slate-800 hover:bg-rose-900/50 text-rose-300 border border-slate-700 hover:border-rose-700'
              }`}
            >
              {addedToMistakes[currentQuestion.id] ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tercatat di Buku Dosa</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Catat ke Buku Dosa</span>
                </>
              )}
            </button>
          )}
        </div>

        <div>
          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-102"
          >
            <span>{isLast ? 'Selesaikan Drill' : 'Soal Berikutnya'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modals */}
      <DesmosModal
        isOpen={isDesmosOpen}
        onClose={() => setIsDesmosOpen(false)}
      />

      <ReferenceSheetModal
        isOpen={isReferenceOpen}
        onClose={() => setIsReferenceOpen(false)}
      />

      {/* Drill Completion Summary Modal */}
      {showSummaryModal && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-orange-500/30 text-white">
              <Trophy className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full">
                {currentQuestion.domain}
              </span>
              <h3 className="text-2xl font-black text-stone-900 tracking-tight pt-2">
                Sesi Drill Selesai!
              </h3>
              <p className="text-xs text-stone-600">
                Pencapaian latihan spesifik Anda telah disimpan ke riwayat drill lokal.
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-stone-50 border border-stone-200 p-3 rounded-2xl">
                <div className="text-xl font-black text-emerald-600">
                  {correctCount}
                </div>
                <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Benar</div>
              </div>

              <div className="bg-stone-50 border border-stone-200 p-3 rounded-2xl">
                <div className="text-xl font-black text-orange-600">
                  {questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0}%
                </div>
                <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Akurasi</div>
              </div>

              <div className="bg-stone-50 border border-stone-200 p-3 rounded-2xl">
                <div className="text-xl font-black text-rose-600">
                  {questions.length - correctCount}
                </div>
                <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Salah</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={handleRestart}
                className="w-full sm:w-1/2 py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ulangi Drill</span>
              </button>

              <button
                onClick={onExit}
                className="w-full sm:w-1/2 py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Menu Drill Hub</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
