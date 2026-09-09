import React, { useState } from 'react';
import { SATQuestion } from '../../types/sat';
import { MathRenderer } from '../common/MathRenderer';
import { Strikethrough, Sparkles } from 'lucide-react';

interface QuestionCardProps {
  question: SATQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: string;
  onSelectAnswer: (answer: string) => void;
  isEliminationMode: boolean;
  struckThroughOptions: string[]; // list of option IDs struck through
  onToggleStrikeThrough: (optionId: string) => void;
  showExplanationDirectly?: boolean; // For Drill mode
  onOpenDesmos?: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
  isEliminationMode,
  struckThroughOptions,
  onToggleStrikeThrough,
  showExplanationDirectly = false,
  onOpenDesmos
}) => {
  const [sprInput, setSprInput] = useState(selectedAnswer || '');

  const handleSprChange = (val: string) => {
    // SAT SPR grid-in rules: max 5-6 characters, numbers, slash (/), decimal point (.)
    const clean = val.replace(/[^0-9\/\.\-]/g, '').slice(0, 7);
    setSprInput(clean);
    onSelectAnswer(clean);
  };

  const hasStimulus = Boolean(question.stimulus && question.stimulus.trim().length > 0);

  return (
    <div className="flex-1 overflow-hidden flex flex-col md:flex-row bg-slate-50 divide-y md:divide-y-0 md:divide-x divide-slate-200">
      {/* Left Column: Passage / Stimulus / Background */}
      {hasStimulus && (
        <div className="md:w-1/2 p-6 sm:p-8 overflow-y-auto bg-white sat-passage text-slate-900 text-sm sm:text-base leading-relaxed select-text border-b md:border-b-0 border-slate-200">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Passage / Context
            </span>
            <span className="text-xs text-blue-600 font-medium">
              {question.domain} • {question.skill}
            </span>
          </div>

          <MathRenderer content={question.stimulus || ''} />
        </div>
      )}

      {/* Right Column (or Full Width if no stimulus): Question Prompt & Answer Options */}
      <div className={`${hasStimulus ? 'md:w-1/2' : 'w-full max-w-4xl mx-auto'} p-6 sm:p-8 overflow-y-auto flex flex-col justify-between bg-white`}>
        <div className="space-y-6">
          {/* Question Number & Tags */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                {questionNumber}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                of {totalQuestions}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {question.difficulty === 'Hard' && (
                <span className="text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  🔥 1500–1600 Tier
                </span>
              )}
              <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
                {question.skill}
              </span>
            </div>
          </div>

          {/* Question Stem */}
          <div className="text-slate-900 font-medium text-sm sm:text-base leading-relaxed">
            <MathRenderer content={question.stem} />
          </div>

          {/* Answer Area: MCQ or SPR */}
          {question.type === 'mcq' && question.options ? (
            <div className="space-y-3 pt-2">
              {question.options.map(option => {
                const isSelected = selectedAnswer === option.letter;
                const isStruck = struckThroughOptions.includes(option.id);

                return (
                  <div 
                    key={option.id}
                    className={`relative flex items-center rounded-xl border transition-all duration-150 ${
                      isSelected 
                        ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-1 ring-blue-600' 
                        : isStruck
                          ? 'border-slate-200 bg-slate-100/70 opacity-40'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                    }`}
                  >
                    {/* Option Selection Click Area */}
                    <button
                      onClick={() => {
                        if (isEliminationMode) {
                          onToggleStrikeThrough(option.id);
                        } else {
                          onSelectAnswer(option.letter);
                        }
                      }}
                      className="flex-1 flex items-start gap-3.5 p-3.5 sm:p-4 text-left"
                    >
                      {/* Letter badge */}
                      <span className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                        isSelected 
                          ? 'bg-blue-600 text-white' 
                          : isStruck
                            ? 'bg-slate-300 text-slate-600 line-through'
                            : 'bg-slate-100 text-slate-700 border border-slate-300'
                      }`}>
                        {option.letter}
                      </span>

                      {/* Option Text */}
                      <div className={`text-sm text-slate-800 leading-relaxed pt-0.5 ${
                        isStruck ? 'line-through text-slate-400' : ''
                      }`}>
                        <MathRenderer content={option.content} />
                      </div>
                    </button>

                    {/* Strikethrough Quick Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleStrikeThrough(option.id);
                      }}
                      className={`p-3 text-slate-400 hover:text-slate-700 rounded-r-xl transition-colors ${
                        isStruck ? 'text-red-500 font-bold' : ''
                      }`}
                      title={isStruck ? "Batalkan coret" : "Coret pilihan ini (eliminasi)"}
                    >
                      <Strikethrough className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Student Produced Response (SPR) / Grid-in */
            <div className="pt-4 max-w-sm space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Student-Produced Response (Grid-in)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={sprInput}
                  onChange={(e) => handleSprChange(e.target.value)}
                  placeholder="Contoh: 14.5 atau 3/4"
                  className="w-full text-lg font-mono px-4 py-3 bg-white border-2 border-slate-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 shadow-sm"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Ketikkan angka desimal atau pecahan murni. Maksimal 5-6 karakter.
              </p>
            </div>
          )}

          {/* Drill Mode: Direct Rationale & Desmos Solver Tip */}
          {showExplanationDirectly && selectedAnswer && (
            <div className="mt-6 p-5 rounded-2xl bg-slate-900 text-white space-y-4 shadow-lg animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    selectedAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase()
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {selectedAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase()
                      ? '✓ Jawaban Anda Benar'
                      : `✗ Salah (Kunci: ${question.correctAnswer})`
                    }
                  </span>
                </div>

                {question.desmosTip && onOpenDesmos && (
                  <button
                    onClick={onOpenDesmos}
                    className="flex items-center gap-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg font-semibold transition-colors shadow"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Buka Trik Desmos</span>
                  </button>
                )}
              </div>

              {/* Rationale Text */}
              <div>
                <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2">
                  Penjelasan Resmi College Board:
                </h4>
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <MathRenderer content={question.rationale} />
                </div>
              </div>

              {/* Trap Analysis */}
              {question.trapAnalysis && (
                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-xs text-amber-200/90">
                  <span className="font-bold text-amber-400">⚠️ Analisis Jebakan (Distractor): </span>
                  {question.trapAnalysis}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
