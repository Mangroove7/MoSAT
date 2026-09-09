import React, { useState } from 'react';
import { SATQuestion } from '../../types/sat';
import { StorageService } from '../../services/storageService';
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
  Trophy
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

  // Summary counts
  const [correctCount, setCorrectCount] = useState(0);

  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const currentAnswer = userAnswers[currentQuestion.id] || '';

  const isCorrect = currentAnswer.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();

  const handleSelectAnswer = (ans: string) => {
    setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: ans }));
    if (mode === 'instant') {
      setHasChecked(true);
      const isRight = ans.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();
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
      // Finish drill
      confetti({ particleCount: 80, spread: 60 });
      onExit();
    } else {
      setCurrentIndex(prev => prev + 1);
      setHasChecked(false);
      setStruckThroughOptions([]);
    }
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
    </div>
  );
};
