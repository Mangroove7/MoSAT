import React, { useState } from 'react';
import { MockTestAttempt, SATQuestion } from '../../types/sat';
import { StorageService } from '../../services/storageService';
import { MathRenderer } from '../common/MathRenderer';
import { 
  Trophy, 
  Target, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Bookmark, 
  Sparkles, 
  AlertTriangle,
  ArrowRight,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TestResultViewProps {
  attempt: MockTestAttempt;
  questionsMap: Record<string, SATQuestion>;
  onRetakeTest: () => void;
  onGoToAnalytics: () => void;
}

export const TestResultView: React.FC<TestResultViewProps> = ({
  attempt,
  questionsMap,
  onRetakeTest,
  onGoToAnalytics
}) => {
  const [filter, setFilter] = useState<'all' | 'incorrect' | 'correct'>('all');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [addedToMistakes, setAddedToMistakes] = useState<Record<string, boolean>>({});

  React.useEffect(() => {
    if (attempt.totalScore >= 1500) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  }, [attempt.totalScore]);

  const questionIds = Object.keys(attempt.answers);

  const filteredQuestionIds = questionIds.filter(id => {
    const isCorrect = attempt.answers[id]?.isCorrect;
    if (filter === 'incorrect') return !isCorrect;
    if (filter === 'correct') return isCorrect;
    return true;
  });

  const handleAddMistake = (q: SATQuestion, userAns: string) => {
    StorageService.addMistake(q.id, userAns, q.correctAnswer, 'careless', 'Salah saat simulasi mock test.');
    setAddedToMistakes(prev => ({ ...prev, [q.id]: true }));
  };

  const selectedQuestion = selectedQuestionId ? questionsMap[selectedQuestionId] : null;

  return (
    <div className="flex-1 bg-slate-50 overflow-y-auto p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Score Banner */}
        <div className="bg-gradient-to-br from-slate-900 via-sat-blue to-blue-950 text-white p-6 sm:p-10 rounded-3xl shadow-xl border border-blue-900/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="text-center md:text-left space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full border border-blue-400/30">
                Official Score Report
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
                Hasil Simulasi Digital SAT
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                Diskor menggunakan kurva penskoran Multi-Stage Adaptive resmi College Board
              </p>
            </div>

            {/* Big Score Box */}
            <div className="flex items-center gap-6 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center">
              <div>
                <div className="text-xs uppercase font-bold tracking-wider text-blue-200">
                  Total Score
                </div>
                <div className="text-5xl sm:text-6xl font-extrabold text-white font-mono tracking-tight mt-1">
                  {attempt.totalScore}
                </div>
                <div className="text-[11px] font-semibold text-amber-300 mt-1 flex items-center justify-center gap-1">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Top {attempt.percentile}% Persentil</span>
                </div>
              </div>

              <div className="h-16 w-px bg-white/20" />

              {/* Subscores */}
              <div className="space-y-3 text-left">
                <div>
                  <div className="text-[10px] text-slate-300 uppercase font-semibold">Reading & Writing</div>
                  <div className="text-xl font-bold font-mono text-blue-300">{attempt.rwScore}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-300 uppercase font-semibold">Math (Desmos)</div>
                  <div className="text-xl font-bold font-mono text-emerald-300">{attempt.mathScore}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Adaptive Routing Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* RW Module breakdown */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Reading and Writing Modules</h3>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                attempt.rwModule2Difficulty === 'Hard' 
                  ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                Module 2: {attempt.rwModule2Difficulty} Route
              </span>
            </div>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Modul 1 (Routing):</span>
                <span className="font-bold text-slate-800">{attempt.rwModule1Correct} / {attempt.rwModule1Total} Benar</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Modul 2 ({attempt.rwModule2Difficulty}):</span>
                <span className="font-bold text-slate-800">{attempt.rwModule2Correct} / {attempt.rwModule2Total} Benar</span>
              </div>
            </div>
          </div>

          {/* Math Module breakdown */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Math Modules</h3>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                attempt.mathModule2Difficulty === 'Hard' 
                  ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                Module 2: {attempt.mathModule2Difficulty} Route
              </span>
            </div>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Modul 1 (Routing):</span>
                <span className="font-bold text-slate-800">{attempt.mathModule1Correct} / {attempt.mathModule1Total} Benar</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Modul 2 ({attempt.mathModule2Difficulty}):</span>
                <span className="font-bold text-slate-800">{attempt.mathModule2Correct} / {attempt.mathModule2Total} Benar</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Question Review Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900">Bedah Soal & Penjelasan Lengkap</h2>
              <p className="text-xs text-slate-500">Analisis setiap kesalahan untuk mencapai skor 1600</p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  filter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua ({questionIds.length})
              </button>
              <button
                onClick={() => setFilter('incorrect')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1 ${
                  filter === 'incorrect' ? 'bg-rose-600 text-white shadow-sm' : 'text-rose-600 hover:bg-rose-50'
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Salah ({questionIds.filter(id => !attempt.answers[id]?.isCorrect).length})</span>
              </button>
              <button
                onClick={() => setFilter('correct')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1 ${
                  filter === 'correct' ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-600 hover:bg-emerald-50'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Benar ({questionIds.filter(id => attempt.answers[id]?.isCorrect).length})</span>
              </button>
            </div>
          </div>

          {/* Question List Accordion / Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List column */}
            <div className="lg:col-span-1 space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredQuestionIds.map((qId, idx) => {
                const q = questionsMap[qId];
                const ansInfo = attempt.answers[qId];
                const isSelected = selectedQuestionId === qId;

                return (
                  <button
                    key={qId}
                    onClick={() => setSelectedQuestionId(qId)}
                    className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isSelected 
                        ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-600' 
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {ansInfo?.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                      <div>
                        <div className="font-bold text-xs text-slate-900">
                          {q?.section} • #{idx + 1}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[180px]">
                          {q?.skill || q?.domain}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        ansInfo?.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {ansInfo?.isCorrect ? 'Benar' : 'Salah'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Detail Preview Column */}
            <div className="lg:col-span-2 bg-slate-50 rounded-2xl border border-slate-200 p-6 overflow-y-auto max-h-[600px]">
              {selectedQuestion ? (
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                        {selectedQuestion.domain} • {selectedQuestion.skill}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">
                        Soal ID: {selectedQuestion.id}
                      </h4>
                    </div>

                    {!attempt.answers[selectedQuestion.id]?.isCorrect && (
                      <button
                        onClick={() => handleAddMistake(selectedQuestion, attempt.answers[selectedQuestion.id]?.answer || '')}
                        disabled={addedToMistakes[selectedQuestion.id]}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-sm ${
                          addedToMistakes[selectedQuestion.id]
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 border border-rose-200'
                        }`}
                      >
                        {addedToMistakes[selectedQuestion.id] ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Tersimpan di Buku Dosa</span>
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

                  {/* Stimulus if exists */}
                  {selectedQuestion.stimulus && (
                    <div className="p-4 bg-white rounded-xl border border-slate-200 sat-passage text-xs leading-relaxed">
                      <MathRenderer content={selectedQuestion.stimulus} />
                    </div>
                  )}

                  {/* Question Stem */}
                  <div className="text-sm font-medium text-slate-900">
                    <MathRenderer content={selectedQuestion.stem} />
                  </div>

                  {/* Options */}
                  {selectedQuestion.options && (
                    <div className="space-y-2">
                      {selectedQuestion.options.map(opt => {
                        const isUserAnswer = attempt.answers[selectedQuestion.id]?.answer === opt.letter;
                        const isCorrectAnswer = selectedQuestion.correctAnswer === opt.letter;

                        let style = 'border-slate-200 bg-white';
                        if (isCorrectAnswer) style = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold ring-1 ring-emerald-500';
                        else if (isUserAnswer && !isCorrectAnswer) style = 'border-rose-400 bg-rose-50 text-rose-950';

                        return (
                          <div key={opt.id} className={`p-3 rounded-xl border flex items-start gap-3 text-xs ${style}`}>
                            <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs shrink-0">
                              {opt.letter}
                            </span>
                            <div className="flex-1">
                              <MathRenderer content={opt.content} />
                            </div>
                            {isCorrectAnswer && <span className="text-[10px] font-bold text-emerald-700">KUNCI</span>}
                            {isUserAnswer && !isCorrectAnswer && <span className="text-[10px] font-bold text-rose-700">JAWABAN ANDA</span>}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Rationale */}
                  <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2 text-xs">
                    <div className="font-bold text-blue-300 uppercase tracking-wider text-[10px]">
                      Penjelasan Resmi College Board:
                    </div>
                    <div className="text-slate-300 leading-relaxed">
                      <MathRenderer content={selectedQuestion.rationale} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400 text-xs">
                  <Sparkles className="w-8 h-8 mb-2 text-slate-300" />
                  <span>Pilih soal di daftar sebelah kiri untuk melihat bedah jawaban</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4">
          <button
            onClick={onRetakeTest}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 font-semibold text-xs text-slate-800 transition-colors shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Simulasi Ulang</span>
          </button>

          <button
            onClick={onGoToAnalytics}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white transition-colors shadow-lg shadow-blue-600/20"
          >
            <span>Buka Dashboard Analisis & Rekomendasi</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
