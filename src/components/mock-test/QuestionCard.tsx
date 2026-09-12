import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { SATQuestion } from '../../types/sat';
import { MathRenderer } from '../common/MathRenderer';
import { Strikethrough, Sparkles, X, Check, CornerDownLeft, Lock } from 'lucide-react';
import { isAnswerCorrect } from '../../services/scoringService';

interface QuestionCardProps {
  question: SATQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: string;
  onSelectAnswer: (answer: string) => void;
  isEliminationMode: boolean;
  struckThroughOptions: string[];
  onToggleStrikeThrough: (optionId: string) => void;
  showExplanationDirectly?: boolean;
  onOpenDesmos?: () => void;
  activeHighlightColor?: string | null;
}

function getSafeSavedContent(id: string, type: 'stim' | 'stem', fallback: string | null | undefined): string {
  try {
    const raw = sessionStorage.getItem(`mosat_hl_${id}_${type}`);
    if (raw && raw !== 'null' && raw !== 'undefined' && raw.trim().length > 0) {
      return raw;
    }
  } catch {}
  return fallback || '';
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
  onOpenDesmos,
  activeHighlightColor = null
}) => {
  // SPR strictly synced with current question and answer
  const [sprInput, setSprInput] = useState(selectedAnswer || '');

  useEffect(() => {
    setSprInput(selectedAnswer || '');
  }, [question.id, selectedAnswer]);

  // Only update local input while typing - do NOT immediately validate
  const handleSprChange = (val: string) => {
    const clean = val.replace(/[^0-9\/\.\-]/g, '').slice(0, 7);
    setSprInput(clean);
  };

  // Commit and validate answer on explicit user action (Enter key or Submit button)
  const handleCommitSpr = () => {
    const clean = sprInput.trim();
    if (!clean) return;
    onSelectAnswer(clean);
  };

  const handleSprKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommitSpr();
    }
  };

  const handleSprBlur = () => {
    // In Mock Test / Pre-Test (non-instant mode), save on blur so student doesn't lose answer if clicking Next
    // In Instant Drill mode, do not trigger on blur to prevent accidental early validation when clicking tools
    if (!showExplanationDirectly && sprInput.trim() && sprInput.trim() !== selectedAnswer) {
      onSelectAnswer(sprInput.trim());
    }
  };

  const hasStimulus = Boolean(question.stimulus && question.stimulus.trim().length > 0);

  // Highlighting refs & state
  const passageRef = useRef<HTMLDivElement>(null);
  const stemRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const [floatingMenu, setFloatingMenu] = useState<{ x: number; y: number } | null>(null);

  // Content states with null guard
  const [passageContent, setPassageContent] = useState<string>(() => 
    getSafeSavedContent(question.id, 'stim', question.stimulus)
  );
  const [stemContent, setStemContent] = useState<string>(() => 
    getSafeSavedContent(question.id, 'stem', question.stem)
  );

  useEffect(() => {
    setPassageContent(getSafeSavedContent(question.id, 'stim', question.stimulus));
    setStemContent(getSafeSavedContent(question.id, 'stem', question.stem));
    setFloatingMenu(null);
  }, [question.id, question.stimulus, question.stem]);

  // Apply highlight directly to range without destroying KaTeX
  const applyHighlight = useCallback((range: Range, color: string) => {
    try {
      const mark = document.createElement('mark');
      mark.className = `highlight-${color} cursor-pointer hover:opacity-85 transition-opacity`;
      mark.setAttribute('data-color', color);
      mark.setAttribute('title', 'Klik untuk menghapus stabilo');

      const extracted = range.extractContents();
      mark.appendChild(extracted);
      range.insertNode(mark);

      // Save HTML to sessionStorage safely
      if (passageRef.current && passageRef.current.contains(mark)) {
        const h = passageRef.current.innerHTML;
        if (h && h !== 'null') {
          sessionStorage.setItem(`mosat_hl_${question.id}_stim`, h);
        }
      } else if (stemRef.current && stemRef.current.contains(mark)) {
        const h = stemRef.current.innerHTML;
        if (h && h !== 'null') {
          sessionStorage.setItem(`mosat_hl_${question.id}_stem`, h);
        }
      }
    } catch {
      try {
        const mark = document.createElement('mark');
        mark.className = `highlight-${color} cursor-pointer hover:opacity-85 transition-opacity`;
        range.surroundContents(mark);
      } catch (err) {
        console.warn('[MoSAT] Text highlight notice:', err);
      }
    }
    window.getSelection()?.removeAllRanges();
    setFloatingMenu(null);
  }, [question.id]);

  // Universal text selection listener across Passage and Question Stem
  const handleMouseUp = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount) {
      setFloatingMenu(null);
      return;
    }

    const text = sel.toString().trim();
    if (!text || text.length === 0) {
      setFloatingMenu(null);
      return;
    }

    const range = sel.getRangeAt(0);
    const inPassage = passageRef.current && passageRef.current.contains(range.commonAncestorContainer);
    const inStem = stemRef.current && stemRef.current.contains(range.commonAncestorContainer);

    if (!inPassage && !inStem) {
      setFloatingMenu(null);
      return;
    }

    // If toolbar color is active, highlight immediately!
    if (activeHighlightColor) {
      applyHighlight(range, activeHighlightColor);
      return;
    }

    // Show floating action pill outside the layout
    const rect = range.getBoundingClientRect();
    if (rect && rect.width > 0) {
      savedRangeRef.current = range.cloneRange();
      setFloatingMenu({
        x: Math.max(10, rect.left + rect.width / 2 - 75),
        y: Math.max(10, rect.top - 46)
      });
    }
  }, [activeHighlightColor, applyHighlight]);

  // Click on existing mark to unwrap (remove highlight)
  const handleContentClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const mark = target.closest('mark');
    if (mark) {
      e.stopPropagation();
      const parent = mark.parentNode;
      if (parent) {
        while (mark.firstChild) {
          parent.insertBefore(mark.firstChild, mark);
        }
        parent.removeChild(mark);
        parent.normalize();

        // Update storage
        if (passageRef.current && passageRef.current.contains(parent)) {
          sessionStorage.setItem(`mosat_hl_${question.id}_stim`, passageRef.current.innerHTML);
        } else if (stemRef.current && stemRef.current.contains(parent)) {
          sessionStorage.setItem(`mosat_hl_${question.id}_stem`, stemRef.current.innerHTML);
        }
      }
      setFloatingMenu(null);
    }
  };

  const handleColorClick = (color: string) => {
    if (savedRangeRef.current) {
      applyHighlight(savedRangeRef.current, color);
      savedRangeRef.current = null;
    }
  };

  return (
    <div 
      onMouseUp={handleMouseUp}
      onClick={handleContentClick}
      className="flex-1 overflow-hidden flex flex-col md:flex-row bg-slate-50 divide-y md:divide-y-0 md:divide-x divide-slate-200"
    >
      {/* Floating Highlight Pill mounted via Portal to document.body so it NEVER interferes with flex layout */}
      {floatingMenu && typeof document !== 'undefined' && createPortal(
        <div
          style={{ 
            position: 'fixed', 
            left: `${floatingMenu.x}px`, 
            top: `${floatingMenu.y}px`,
            zIndex: 9999
          }}
          className="flex items-center gap-1.5 bg-slate-900 text-white px-2.5 py-1.5 rounded-xl shadow-2xl border border-slate-700 animate-in fade-in zoom-in-95 pointer-events-auto"
        >
          <button
            onClick={() => handleColorClick('yellow')}
            className="w-5 h-5 rounded-full bg-yellow-300 hover:scale-110 transition-transform shadow cursor-pointer"
            title="Stabilo Kuning"
          />
          <button
            onClick={() => handleColorClick('green')}
            className="w-5 h-5 rounded-full bg-emerald-300 hover:scale-110 transition-transform shadow cursor-pointer"
            title="Stabilo Hijau"
          />
          <button
            onClick={() => handleColorClick('pink')}
            className="w-5 h-5 rounded-full bg-pink-300 hover:scale-110 transition-transform shadow cursor-pointer"
            title="Stabilo Merah Muda"
          />
          <button
            onClick={() => setFloatingMenu(null)}
            className="p-1 hover:text-slate-200 text-slate-400 cursor-pointer ml-0.5"
            title="Batal"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>,
        document.body
      )}

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

          <div ref={passageRef} className="select-text focus:outline-none">
            <MathRenderer content={passageContent} />
          </div>
        </div>
      )}

      {/* Right Column: Question Prompt & Answer Options */}
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

          {/* Question Stem with Highlighter Support */}
          <div ref={stemRef} className="text-slate-900 font-medium text-sm sm:text-base leading-relaxed select-text focus:outline-none">
            <MathRenderer content={stemContent} />
          </div>

          {/* Answer Area: MCQ or SPR */}
          {question.type === 'mcq' && question.options ? (
            <div className="space-y-3 pt-2">
              {question.options.map(option => {
                const isSelected = selectedAnswer === option.letter;
                const isStruck = struckThroughOptions.includes(option.id);
                const isLocked = Boolean(selectedAnswer);

                return (
                  <div 
                    key={option.id}
                    className={`relative flex items-center rounded-xl border transition-all duration-150 ${
                      isSelected 
                        ? 'border-blue-600 bg-blue-50/60 shadow-sm ring-2 ring-blue-500/20' 
                        : isLocked
                          ? 'border-slate-200 bg-slate-50/50 opacity-55'
                          : isStruck
                            ? 'border-slate-200 bg-slate-100/70 opacity-40'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                    }`}
                  >
                    {/* Option Selection Click Area */}
                    <button
                      type="button"
                      disabled={isLocked}
                      onClick={() => {
                        if (isLocked) return;
                        if (isEliminationMode) {
                          onToggleStrikeThrough(option.id);
                        } else {
                          onSelectAnswer(option.letter);
                        }
                      }}
                      className={`flex-1 flex items-start gap-3.5 p-3.5 sm:p-4 text-left ${
                        isLocked ? 'cursor-default' : 'cursor-pointer'
                      }`}
                    >
                      {/* Letter badge */}
                      <span className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                        isSelected 
                          ? 'bg-blue-600 text-white shadow-xs' 
                          : isStruck
                            ? 'bg-slate-300 text-slate-600 line-through'
                            : 'bg-slate-100 text-slate-700 border border-slate-300'
                      }`}>
                        {option.letter}
                      </span>

                      {/* Option Text */}
                      <div className={`text-sm text-slate-800 leading-relaxed pt-0.5 select-text ${
                        isStruck ? 'line-through text-slate-400' : ''
                      }`}>
                        <MathRenderer content={option.content} />
                      </div>
                    </button>

                    {/* Strikethrough Quick Button */}
                    <button
                      type="button"
                      disabled={isLocked}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isLocked) return;
                        onToggleStrikeThrough(option.id);
                      }}
                      className={`p-3 text-slate-400 hover:text-slate-700 rounded-r-xl transition-colors disabled:opacity-20 disabled:hover:text-slate-400 ${
                        isStruck ? 'text-red-500 font-bold' : ''
                      }`}
                      title={isLocked ? "Jawaban sudah terkunci" : (isStruck ? "Batalkan coret" : "Coret pilihan ini (eliminasi)")}
                    >
                      <Strikethrough className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Student Produced Response (SPR) / Grid-in */
            <div className="pt-4 max-w-md space-y-3" key={`spr-wrapper-${question.id}`}>
              <div className="flex items-center justify-between">
                <label htmlFor={`spr-input-${question.id}`} className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Student-Produced Response (Grid-in)
                </label>
                {selectedAnswer && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                    Tersimpan: <span className="font-mono font-bold text-slate-900">{selectedAnswer}</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  id={`spr-input-${question.id}`}
                  key={`spr-input-${question.id}`}
                  type="text"
                  value={sprInput}
                  onChange={(e) => handleSprChange(e.target.value)}
                  onKeyDown={handleSprKeyDown}
                  onBlur={handleSprBlur}
                  disabled={Boolean(selectedAnswer)}
                  placeholder="Contoh: 14.5 atau 3/4"
                  autoComplete="off"
                  className="flex-1 text-lg font-mono font-bold px-4 py-3 bg-white border-2 border-slate-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 shadow-sm disabled:bg-slate-100 disabled:text-slate-500 transition-all"
                />
                <button
                  type="button"
                  onClick={handleCommitSpr}
                  disabled={!sprInput.trim() || Boolean(selectedAnswer)}
                  className="px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap active:scale-95"
                  title="Tekan Enter atau klik untuk mengonfirmasi jawaban"
                >
                  <Check className="w-4 h-4" />
                  <span>{selectedAnswer ? 'Tersimpan ✓' : 'Jawab (Enter)'}</span>
                </button>
              </div>
              {selectedAnswer ? (
                <p className="text-[11px] text-slate-500 flex items-center gap-1.5 font-semibold animate-in fade-in">
                  <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Jawaban isian terkunci: <strong className="font-mono text-slate-800">{selectedAnswer}</strong></span>
                </p>
              ) : (
                <p className="text-[11px] text-slate-500 flex items-center gap-1.5 flex-wrap">
                  <span>Ketik angka desimal atau pecahan murni, lalu tekan</span>
                  <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-[10px] font-mono font-bold text-slate-700">Enter ↵</kbd>
                  <span>atau klik tombol <strong>Jawab</strong>.</span>
                </p>
              )}
            </div>
          )}

          {/* Drill Mode: Direct Rationale & Desmos Solver Tip */}
          {showExplanationDirectly && selectedAnswer && (
            <div className="mt-6 p-5 rounded-2xl bg-slate-900 text-white space-y-4 shadow-lg animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    isAnswerCorrect(selectedAnswer, question.correctAnswer)
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {isAnswerCorrect(selectedAnswer, question.correctAnswer)
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
