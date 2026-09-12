import React, { useState, useMemo, useEffect } from 'react';
import { StorageService } from '../../services/storageService';
import { UserMistakeRecord, SATQuestion, ErrorType } from '../../types/sat';
import { MathRenderer } from '../common/MathRenderer';
import { DesmosModal } from '../common/DesmosModal';
import { 
  X, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  BookOpen, 
  Clock, 
  HelpCircle, 
  Check, 
  Filter,
  Flame,
  FileEdit,
  Award,
  Calculator,
  Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MistakeReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMistakesUpdated?: () => void;
  initialQuestionId?: string | null;
}

export const MistakeReviewModal: React.FC<MistakeReviewModalProps> = ({
  isOpen,
  onClose,
  onMistakesUpdated,
  initialQuestionId
}) => {
  const [mistakes, setMistakes] = useState<UserMistakeRecord[]>(() => StorageService.getMistakes());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filterType, setFilterType] = useState<'all' | 'unresolved' | 'resolved'>('unresolved');
  const [errorFilter, setErrorFilter] = useState<'all' | ErrorType>('all');
  const [sectionFilter, setSectionFilter] = useState<'all' | 'Reading and Writing' | 'Math'>('all');

  // Interactive Re-attempt states
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrectOnRetry, setIsCorrectOnRetry] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [isDesmosOpen, setIsDesmosOpen] = useState(false);

  const [allQuestions, setAllQuestions] = useState<SATQuestion[]>(() => StorageService.getAllQuestions());
  const [isLoadingBank, setIsLoadingBank] = useState<boolean>(false);

  // Subscribe to Question Bank changes & trigger loading if needed
  useEffect(() => {
    const unsubscribe = StorageService.onQuestionsLoaded(() => {
      setAllQuestions(StorageService.getAllQuestions());
      setIsLoadingBank(false);
    });

    if (StorageService.getAllQuestions().length <= 40) {
      setIsLoadingBank(true);
      StorageService.loadFullQuestionBank().then((loaded) => {
        setAllQuestions(loaded);
        setIsLoadingBank(false);
      }).catch(() => {
        setIsLoadingBank(false);
      });
    }

    return () => {
      unsubscribe();
    };
  }, []);

  const questionMap = useMemo(() => {
    const map: Record<string, SATQuestion> = {};
    for (const q of allQuestions) {
      map[q.id] = q;
    }
    return map;
  }, [allQuestions]);

  // Sync when modal opens or initialQuestionId changes
  useEffect(() => {
    if (isOpen) {
      const fresh = StorageService.getMistakes();
      setMistakes(fresh);

      const bank = StorageService.getAllQuestions();
      setAllQuestions(bank);
      if (bank.length <= 40) {
        setIsLoadingBank(true);
        StorageService.loadFullQuestionBank().then((loaded) => {
          setAllQuestions(loaded);
          setIsLoadingBank(false);
        }).catch(() => setIsLoadingBank(false));
      }

      if (initialQuestionId) {
        setFilterType('all');
        const idx = fresh.findIndex(m => m.questionId === initialQuestionId);
        if (idx !== -1) {
          setCurrentIndex(idx);
        } else {
          setCurrentIndex(0);
        }
      } else {
        setCurrentIndex(0);
      }
      setSelectedAnswer('');
      setHasSubmitted(false);
      setIsCorrectOnRetry(false);
      setIsEditingNote(false);
    }
  }, [isOpen, initialQuestionId]);

  // Filtered list of mistakes
  const filteredMistakes = useMemo(() => {
    return mistakes.filter(m => {
      if (filterType === 'unresolved' && m.resolved) return false;
      if (filterType === 'resolved' && !m.resolved) return false;
      if (errorFilter !== 'all' && m.errorType !== errorFilter) return false;

      const q = questionMap[m.questionId];
      if (sectionFilter !== 'all' && q && q.section !== sectionFilter) return false;

      return true;
    });
  }, [mistakes, filterType, errorFilter, sectionFilter, questionMap]);

  // Reset attempt when changing question
  const safeIndex = filteredMistakes.length > 0 
    ? Math.min(Math.max(0, currentIndex), filteredMistakes.length - 1)
    : 0;
  const currentMistake = filteredMistakes[safeIndex];
  const currentQuestion = currentMistake ? questionMap[currentMistake.questionId] : null;

  const handleSelectQuestion = (idx: number) => {
    setCurrentIndex(idx);
    setSelectedAnswer('');
    setHasSubmitted(false);
    setIsCorrectOnRetry(false);
    setIsEditingNote(false);
  };

  const handleDeleteMistake = (mistakeId: string) => {
    StorageService.deleteMistake(mistakeId);
    const updated = StorageService.getMistakes();
    setMistakes(updated);
    if (currentIndex >= updated.length) {
      setCurrentIndex(Math.max(0, updated.length - 1));
    }
    if (onMistakesUpdated) onMistakesUpdated();
  };

  const handleCheckRetry = () => {
    if (!selectedAnswer.trim() || !currentQuestion || !currentMistake) return;
    const isCorrect = selectedAnswer.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();
    setIsCorrectOnRetry(isCorrect);
    setHasSubmitted(true);

    if (isCorrect) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {}
      // Record practice progress
      StorageService.recordQuestionAnswered(currentQuestion.id, true);
    } else {
      StorageService.recordQuestionAnswered(currentQuestion.id, false);
    }
  };

  const handleToggleMastered = () => {
    if (!currentMistake) return;
    StorageService.resolveMistake(currentMistake.id);
    const updated = StorageService.getMistakes();
    setMistakes(updated);
    if (onMistakesUpdated) onMistakesUpdated();
  };

  const handleUpdateCategory = (newType: ErrorType) => {
    if (!currentMistake) return;
    StorageService.updateMistakeNotes(currentMistake.id, currentMistake.userNotes || '', newType);
    const updated = StorageService.getMistakes();
    setMistakes(updated);
    if (onMistakesUpdated) onMistakesUpdated();
  };

  const handleSaveReflection = () => {
    if (!currentMistake) return;
    StorageService.updateMistakeNotes(currentMistake.id, noteText, currentMistake.errorType);
    const updated = StorageService.getMistakes();
    setMistakes(updated);
    setIsEditingNote(false);
    if (onMistakesUpdated) onMistakesUpdated();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full h-[92vh] flex flex-col border border-orange-100 overflow-hidden animate-in zoom-in-95">
        
        {/* Top Header */}
        <div className="bg-zinc-950 text-white px-5 py-3.5 flex items-center justify-between border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-zinc-950 font-black text-sm shadow-md shadow-orange-500/25">
              BD
            </div>
            <div>
              <div className="text-sm font-black text-white flex items-center gap-2">
                <span>Lab Review Buku Dosa (Mistake Practice)</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  Target 1600
                </span>
              </div>
              <div className="text-[11px] text-zinc-400">
                Selesaikan kembali soal yang pernah salah hingga 100% memahami konsep dan jebakan.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentQuestion?.section === 'Math' && (
              <button
                onClick={() => setIsDesmosOpen(prev => !prev)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-amber-400 hover:text-amber-300 font-bold text-xs rounded-xl border border-zinc-700 transition-colors shadow-sm"
                title="Buka Floating Desmos Calculator"
              >
                <Calculator className="w-3.5 h-3.5 text-orange-400" />
                <span>Desmos</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-colors border border-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Navigation Bar */}
        <div className="bg-zinc-900 px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-zinc-800 shrink-0 text-zinc-300">
          {/* Status Filters */}
          <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800 gap-1">
            <button
              onClick={() => { setFilterType('unresolved'); setCurrentIndex(0); }}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors ${
                filterType === 'unresolved' 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Belum Dikuasai ({mistakes.filter(m => !m.resolved).length})
            </button>
            <button
              onClick={() => { setFilterType('resolved'); setCurrentIndex(0); }}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors ${
                filterType === 'resolved' 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Sudah Dikuasai ({mistakes.filter(m => m.resolved).length})
            </button>
            <button
              onClick={() => { setFilterType('all'); setCurrentIndex(0); }}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors ${
                filterType === 'all' 
                  ? 'bg-zinc-800 text-white' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Semua ({mistakes.length})
            </button>
          </div>

          {/* Section & Error Type Filter */}
          <div className="flex items-center gap-2">
            <select
              value={sectionFilter}
              onChange={(e) => { setSectionFilter(e.target.value as any); setCurrentIndex(0); }}
              className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs rounded-xl px-2.5 py-1.5 outline-none focus:border-orange-500"
            >
              <option value="all">Semua Seksi (RW & Math)</option>
              <option value="Reading and Writing">Reading & Writing</option>
              <option value="Math">Math</option>
            </select>

            <select
              value={errorFilter}
              onChange={(e) => { setErrorFilter(e.target.value as any); setCurrentIndex(0); }}
              className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs rounded-xl px-2.5 py-1.5 outline-none focus:border-orange-500"
            >
              <option value="all">Semua Kategori Kesalahan</option>
              <option value="careless">Careless / Kurang Teliti</option>
              <option value="concept">Salah Konsep</option>
              <option value="trap">Jebakan College Board</option>
              <option value="timing">Waktu / Panik</option>
            </select>
          </div>
        </div>

        {/* Main Review Body */}
        {filteredMistakes.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600 border border-emerald-200 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900">
                Tidak Ada Soal Salah dalam Kategori Ini! 🎉
              </h3>
              <p className="text-xs text-zinc-500 max-w-sm mt-1">
                Semua soal di kategori ini telah kamu kuasai atau belum ada catatan kesalahan baru. Lanjutkan latihan drill soal untuk menjaga streak!
              </p>
            </div>
          </div>
        ) : !currentQuestion ? (
          isLoadingBank ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500">
                <RotateCcw className="w-5 h-5 animate-spin" />
              </div>
              <div className="text-sm font-bold text-zinc-800">Menyinkronkan Bank Soal...</div>
              <div className="text-xs text-zinc-500 max-w-xs">
                Sedang memuat data 2,881+ soal resmi College Board.
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Left Column: Fallback Question Info */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 border-b md:border-b-0 md:border-r border-zinc-200">
                <div className="flex items-center justify-between text-xs pb-3 border-b border-zinc-100">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200 font-mono">
                      Soal {safeIndex + 1} dari {filteredMistakes.length}
                    </span>
                    <span className="font-bold text-zinc-700">
                      ID Soal: {currentMistake?.questionId}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                    <span>Naskah Lengkap Soal Tidak Ditemukan di Database Lokal</span>
                  </div>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    Soal ini tercatat pada Buku Dosa Anda dengan ID <strong className="font-mono bg-amber-100 px-1.5 py-0.5 rounded text-amber-900">{currentMistake?.questionId}</strong>. Data jawaban, tanggal, dan evaluasi refleksi Anda tetap tersimpan utuh di bawah.
                  </p>
                </div>

                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-3">
                  <div className="font-bold text-xs text-zinc-800">Rekap Kesalahan:</div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-white border border-rose-200 rounded-xl">
                      <div className="text-[10px] text-rose-600 font-bold uppercase">Jawaban Anda:</div>
                      <div className="text-base font-black text-rose-950 font-mono mt-0.5">{currentMistake?.userAnswer || '-'}</div>
                    </div>
                    <div className="p-3 bg-white border border-emerald-200 rounded-xl">
                      <div className="text-[10px] text-emerald-600 font-bold uppercase">Kunci Jawaban Resmi:</div>
                      <div className="text-base font-black text-emerald-950 font-mono mt-0.5">{currentMistake?.correctAnswer || '-'}</div>
                    </div>
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    Dicatat pada: <span className="font-semibold text-zinc-700">{currentMistake?.date}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={handleToggleMastered}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ${
                      currentMistake?.resolved 
                        ? 'bg-emerald-600 text-white shadow-emerald-600/20' 
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>{currentMistake?.resolved ? '✓ Sudah Ditandai Dikuasai' : 'Tandai Sudah Dikuasai'}</span>
                  </button>

                  <button
                    onClick={() => currentMistake && handleDeleteMistake(currentMistake.id)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all flex items-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Hapus Catatan Ini</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Error Category & Reflection Notes */}
              <div className="w-full md:w-[420px] bg-zinc-50/50 overflow-y-auto p-5 sm:p-6 space-y-5 shrink-0 text-xs">
                {/* Category Selection */}
                <div className="p-4 bg-white rounded-2xl border border-zinc-200 shadow-sm space-y-3">
                  <div className="font-bold text-zinc-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Filter className="w-4 h-4 text-orange-500" />
                    <span>Kategori Akar Kesalahan:</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { type: 'careless', label: 'Kurang Teliti' },
                      { type: 'concept', label: 'Salah Konsep' },
                      { type: 'trap', label: 'Jebakan College Board' },
                      { type: 'timing', label: 'Waktu / Rushing' }
                    ].map(cat => (
                      <button
                        key={cat.type}
                        onClick={() => handleUpdateCategory(cat.type as ErrorType)}
                        className={`py-1.5 px-2 rounded-xl text-[10px] font-bold border transition-colors ${
                          currentMistake?.errorType === cat.type 
                            ? 'bg-orange-50 border-orange-500 text-orange-800 ring-1 ring-orange-500' 
                            : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Personal Reflection Notes */}
                <div className="p-4 bg-white rounded-2xl border border-zinc-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-800 text-xs flex items-center gap-1">
                      <FileEdit className="w-3.5 h-3.5 text-orange-500" />
                      Catatan Refleksi Pribadi:
                    </span>
                    {!isEditingNote && (
                      <button
                        onClick={() => {
                          setNoteText(currentMistake?.userNotes || '');
                          setIsEditingNote(true);
                        }}
                        className="text-[11px] font-bold text-orange-600 hover:text-orange-700"
                      >
                        {currentMistake?.userNotes ? 'Edit' : '+ Tambah'}
                      </button>
                    )}
                  </div>

                  {isEditingNote ? (
                    <div className="space-y-2">
                      <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Kenapa tadi bisa salah? Trik apa yang harus diingat agar tidak terulang di exam resmi?"
                        rows={3}
                        className="w-full p-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs outline-none focus:border-orange-500"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setIsEditingNote(false)}
                          className="px-3 py-1 text-zinc-500 text-xs font-semibold"
                        >
                          Batal
                        </button>
                        <button
                          onClick={handleSaveReflection}
                          className="px-3.5 py-1 bg-orange-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-orange-500"
                        >
                          Simpan
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-600 italic bg-zinc-50 p-2.5 rounded-xl border border-zinc-100">
                      {currentMistake?.userNotes ? `"${currentMistake.userNotes}"` : 'Belum ada catatan refleksi untuk soal ini.'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Left Column: Question Stem & Re-attempt Options */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 border-b md:border-b-0 md:border-r border-zinc-200">
              {/* Question metadata badge */}
              <div className="flex items-center justify-between text-xs pb-3 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <span className="font-black text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200 font-mono">
                    Soal {safeIndex + 1} dari {filteredMistakes.length}
                  </span>
                  <span className="font-bold text-zinc-700">
                    {currentQuestion.section} • {currentQuestion.domain}
                  </span>
                </div>

                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                  currentQuestion.difficulty === 'Hard' ? 'bg-rose-100 text-rose-800' :
                  currentQuestion.difficulty === 'Medium' ? 'bg-amber-100 text-amber-800' :
                  'bg-emerald-100 text-emerald-800'
                }`}>
                  Tingkat: {currentQuestion.difficulty}
                </span>
              </div>

              {/* Passage / Stimulus */}
              {currentQuestion.stimulus && (
                <div className="bg-zinc-50/80 p-4 rounded-2xl border border-zinc-200 text-xs text-zinc-800 leading-relaxed sat-passage">
                  <MathRenderer content={currentQuestion.stimulus} />
                </div>
              )}

              {/* Stem */}
              <div className="text-sm font-semibold text-zinc-900 leading-relaxed">
                <MathRenderer content={currentQuestion.stem} />
              </div>

              {/* Options */}
              {currentQuestion.options && (
                <div className="space-y-2.5 pt-2">
                  {currentQuestion.options.map((opt) => {
                    const isSelected = selectedAnswer === opt.letter;
                    const isCorrectKey = currentQuestion.correctAnswer.trim().toLowerCase() === opt.letter.toLowerCase();

                    let optionStyle = "border-zinc-200 hover:border-orange-300 hover:bg-orange-50/30 text-zinc-800";
                    if (hasSubmitted) {
                      if (isCorrectKey) {
                        optionStyle = "border-emerald-500 bg-emerald-50/70 text-emerald-950 font-bold ring-2 ring-emerald-500/30";
                      } else if (isSelected && !isCorrectKey) {
                        optionStyle = "border-rose-500 bg-rose-50/70 text-rose-950 font-bold ring-2 ring-rose-500/30";
                      }
                    } else if (isSelected) {
                      optionStyle = "border-orange-500 bg-orange-50/70 text-orange-950 font-bold ring-2 ring-orange-500/30";
                    }

                    return (
                      <button
                        key={opt.id || opt.letter}
                        onClick={() => {
                          if (!hasSubmitted) setSelectedAnswer(opt.letter);
                        }}
                        disabled={hasSubmitted}
                        className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${optionStyle}`}
                      >
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                          hasSubmitted && isCorrectKey ? 'bg-emerald-600 text-white' :
                          hasSubmitted && isSelected && !isCorrectKey ? 'bg-rose-600 text-white' :
                          isSelected ? 'bg-orange-500 text-white' : 'bg-zinc-100 text-zinc-700'
                        }`}>
                          {opt.letter}
                        </div>
                        <div className="text-xs leading-relaxed mt-0.5">
                          <MathRenderer content={opt.content} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Student Produced Response (SPR) */}
              {currentQuestion.type === 'spr' && (
                <div className="pt-2 space-y-2">
                  <label className="block text-xs font-bold text-zinc-700">Tulis Jawaban Isian:</label>
                  <input
                    type="text"
                    value={selectedAnswer}
                    onChange={(e) => setSelectedAnswer(e.target.value)}
                    disabled={hasSubmitted}
                    placeholder="Contoh: 14 atau 3/4"
                    className="w-48 px-3.5 py-2 text-sm font-mono font-bold bg-zinc-50 border border-zinc-300 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                </div>
              )}

              {/* Submit Retry Action */}
              {!hasSubmitted ? (
                <button
                  onClick={handleCheckRetry}
                  disabled={!selectedAnswer.trim()}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white font-bold text-xs rounded-2xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Periksa Jawaban Ulang (Re-attempt)</span>
                </button>
              ) : (
                <div className="pt-2">
                  {isCorrectOnRetry ? (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
                      <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>Jawaban Kamu Sekarang BENAR! 🎉</span>
                      </div>
                      <p className="text-xs text-emerald-700">
                        Kamu berhasil memecahkan soal ini pada kesempatan kedua. Jangan lupa menandai sudah dikuasai jika konsepnya sudah matang.
                      </p>
                      <button
                        onClick={handleToggleMastered}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ${
                          currentMistake?.resolved 
                            ? 'bg-emerald-600 text-white shadow-emerald-600/20' 
                            : 'bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-600 hover:text-white'
                        }`}
                      >
                        <Check className="w-4 h-4" />
                        <span>{currentMistake?.resolved ? '✓ Sudah Ditandai Dikuasai' : 'Tandai Sudah Dikuasai (Selesai)'}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-2">
                      <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                        <AlertCircle className="w-5 h-5 text-rose-600" />
                        <span>Masih Belum Tepat. Pelajari Analisis di Sebelah Kanan!</span>
                      </div>
                      <p className="text-xs text-rose-700">
                        Kunci jawaban yang tepat adalah <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-rose-300 text-rose-900">{currentQuestion.correctAnswer}</span>.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Diagnostic Comparison, Trap Breakdown & Reflection */}
            <div className="w-full md:w-[420px] bg-zinc-50/50 overflow-y-auto p-5 sm:p-6 space-y-5 shrink-0 text-xs">
              {/* Comparison Box */}
              <div className="p-4 bg-white rounded-2xl border border-zinc-200 shadow-sm space-y-3">
                <div className="font-bold text-zinc-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-orange-500" />
                  <span>Riwayat Diagnostik Soal Ini:</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-rose-50/60 rounded-xl border border-rose-200/60">
                    <div className="text-[10px] text-rose-700 uppercase font-bold">Jawaban Saat Ujian:</div>
                    <div className="text-base font-black font-mono text-rose-950 mt-0.5">
                      {currentMistake?.userAnswer || '-'}
                    </div>
                    <div className="text-[10px] text-rose-500">{currentMistake?.date}</div>
                  </div>

                  <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-200/60">
                    <div className="text-[10px] text-emerald-700 uppercase font-bold">Kunci Jawaban Resmi:</div>
                    <div className="text-base font-black font-mono text-emerald-950 mt-0.5">
                      {currentQuestion.correctAnswer}
                    </div>
                    <div className="text-[10px] text-emerald-600">College Board</div>
                  </div>
                </div>

                {/* Error Type Selector */}
                <div className="space-y-1 pt-2 border-t border-zinc-100">
                  <label className="block text-[11px] font-bold text-zinc-700">Kategori Penyebab Salah:</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { type: 'careless', label: 'Kurang Teliti' },
                      { type: 'concept', label: 'Salah Konsep' },
                      { type: 'trap', label: 'Jebakan Opsi' },
                      { type: 'timing', label: 'Waktu / Rushing' }
                    ].map(cat => (
                      <button
                        key={cat.type}
                        onClick={() => handleUpdateCategory(cat.type as ErrorType)}
                        className={`py-1.5 px-2 rounded-xl text-[10px] font-bold border transition-colors ${
                          currentMistake?.errorType === cat.type 
                            ? 'bg-orange-50 border-orange-500 text-orange-800 ring-1 ring-orange-500' 
                            : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Official Rationale / Pembahasan */}
              <div className="p-4 bg-white rounded-2xl border border-zinc-200 shadow-sm space-y-2">
                <div className="font-bold text-zinc-900 text-xs flex items-center gap-1.5 text-orange-700">
                  <BookOpen className="w-4 h-4" />
                  <span>Pembahasan Resmi College Board:</span>
                </div>
                <div className="text-xs text-zinc-700 leading-relaxed font-medium sat-passage max-h-64 overflow-y-auto">
                  <MathRenderer content={currentQuestion.rationale || 'Pembahasan tidak tersedia.'} />
                </div>
              </div>

              {/* Trap Analysis */}
              {currentQuestion.trapAnalysis && (
                <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-1 text-amber-950">
                  <div className="font-bold text-[11px] flex items-center gap-1 text-amber-800">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Bedah Jebakan (Distractor Trap):</span>
                  </div>
                  <p className="text-[11px] text-amber-900 leading-relaxed">
                    {currentQuestion.trapAnalysis}
                  </p>
                </div>
              )}

              {/* Personal Reflection Notes */}
              <div className="p-4 bg-white rounded-2xl border border-zinc-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-800 text-xs flex items-center gap-1">
                    <FileEdit className="w-3.5 h-3.5 text-orange-500" />
                    Catatan Refleksi Pribadi:
                  </span>
                  {!isEditingNote && (
                    <button
                      onClick={() => {
                        setNoteText(currentMistake?.userNotes || '');
                        setIsEditingNote(true);
                      }}
                      className="text-[11px] font-bold text-orange-600 hover:text-orange-700"
                    >
                      {currentMistake?.userNotes ? 'Edit' : '+ Tambah'}
                    </button>
                  )}
                </div>

                {isEditingNote ? (
                  <div className="space-y-2">
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Kenapa tadi bisa salah? Trik apa yang harus diingat agar tidak terulang di exam resmi?"
                      rows={3}
                      className="w-full p-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs outline-none focus:border-orange-500"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setIsEditingNote(false)}
                        className="px-3 py-1 text-zinc-500 text-xs font-semibold"
                      >
                        Batal
                      </button>
                      <button
                        onClick={handleSaveReflection}
                        className="px-3.5 py-1 bg-orange-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-orange-500"
                      >
                        Simpan
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-zinc-600 italic bg-zinc-50 p-2.5 rounded-xl border border-zinc-100">
                    {currentMistake?.userNotes ? `"${currentMistake.userNotes}"` : 'Belum ada catatan refleksi untuk soal ini.'}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="bg-zinc-950 text-white px-5 py-3 flex items-center justify-between border-t border-zinc-800 shrink-0">
          <button
            onClick={() => handleSelectQuestion(Math.max(0, safeIndex - 1))}
            disabled={safeIndex === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Sebelumnya</span>
          </button>

          <div className="text-xs font-bold text-zinc-400">
            {filteredMistakes.length > 0 ? (
              <span>{safeIndex + 1} / {filteredMistakes.length} Soal</span>
            ) : null}
          </div>

          <button
            onClick={() => handleSelectQuestion(Math.min(filteredMistakes.length - 1, safeIndex + 1))}
            disabled={safeIndex >= filteredMistakes.length - 1}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-xs text-white transition-all shadow-md shadow-orange-500/20"
          >
            <span>Berikutnya</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      <DesmosModal
        isOpen={isDesmosOpen}
        onClose={() => setIsDesmosOpen(false)}
      />
    </div>
  );
};
