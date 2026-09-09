import React, { useState } from 'react';
import { VocabularyItem } from '../../types/sat';
import { Sparkles, RotateCw, ChevronLeft, ChevronRight, Volume2, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FlashcardDeckProps {
  cards: VocabularyItem[];
  onUpdateMastery: (id: string, mastery: 'new' | 'learning' | 'mastered') => void;
  onExit: () => void;
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({ cards, onUpdateMastery, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);

  if (!cards || cards.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500">
        Tidak ada kartu kosakata untuk kategori ini.
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setShowHint(false);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      confetti({ particleCount: 100, spread: 70 });
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setShowHint(false);
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleRate = (mastery: 'new' | 'learning' | 'mastered') => {
    onUpdateMastery(currentCard.id, mastery);
    handleNext();
  };

  const speakWord = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onExit}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
        >
          ← Kembali ke Daftar Kata
        </button>

        <div className="text-xs font-bold text-slate-500">
          Kartu {currentIndex + 1} dari {cards.length}
        </div>
      </div>

      {/* 3D Flip Card Container */}
      <div 
        onClick={() => setIsFlipped(!isFlipped)}
        className="min-h-[380px] sm:min-h-[420px] cursor-pointer perspective-1000 select-none"
      >
        <div 
          className={`w-full h-full min-h-[380px] sm:min-h-[420px] rounded-3xl p-8 border-2 transition-all duration-300 transform shadow-xl flex flex-col justify-between ${
            isFlipped 
              ? 'bg-slate-900 text-white border-slate-800' 
              : 'bg-white text-slate-900 border-slate-200 hover:border-blue-400'
          }`}
        >
          {/* Top Info */}
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
              isFlipped ? 'bg-blue-900/60 text-blue-300' : 'bg-slate-100 text-slate-600'
            }`}>
              {currentCard.partOfSpeech}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speakWord(currentCard.word);
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  isFlipped ? 'text-slate-300 hover:text-white' : 'text-slate-400 hover:text-blue-600'
                }`}
                title="Dengar Audio"
              >
                <Volume2 className="w-5 h-5" />
              </button>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <RotateCw className="w-3.5 h-3.5" />
                Klik untuk Balik
              </span>
            </div>
          </div>

          {/* Center Card Content */}
          {!isFlipped ? (
            /* FRONT: Word & Context Hint */
            <div className="text-center space-y-4 my-auto">
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                {currentCard.word}
              </h2>
              <div className="font-mono text-sm text-slate-400">
                {currentCard.pronunciation}
              </div>

              {/* Context Hint on front */}
              <div className="pt-4 max-w-lg mx-auto" onClick={(e) => e.stopPropagation()}>
                {showHint ? (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-left text-xs space-y-1.5 animate-in fade-in">
                    <div className="text-[10px] font-bold uppercase text-blue-700 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      Hint Kontekstual Soal SAT Asli:
                    </div>
                    <div className="text-slate-800 sat-passage italic">
                      "{currentCard.satQuestionSentence}"
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowHint(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Lihat Hint Kalimat di Soal SAT Asli</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* BACK: Simplified Definition & Analysis */
            <div className="space-y-4 my-auto">
              <div className="space-y-1">
                <div className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                  Arti yang Disederhanakan:
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white">
                  {currentCard.simplifiedMeaning}
                </div>
                <div className="text-xs text-slate-400 italic">
                  "{currentCard.englishMeaning}"
                </div>
              </div>

              <div className="pt-2">
                <div className="text-xs font-bold text-slate-400 mb-1">Sinonim:</div>
                <div className="flex flex-wrap gap-1.5">
                  {currentCard.synonyms.map((s, idx) => (
                    <span key={idx} className="bg-slate-800 text-blue-300 px-2.5 py-1 rounded-lg text-xs font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-1">
                <div className="text-xs font-bold text-slate-400 mb-1">Contoh Kalimat:</div>
                <div className="text-xs text-slate-300 italic sat-passage bg-slate-800/60 p-3 rounded-xl">
                  "{currentCard.sampleSentence}"
                </div>
              </div>
            </div>
          )}

          {/* Bottom Card Footer */}
          <div className="text-center text-xs text-slate-400">
            {isFlipped ? 'Pilih tingkat penguasaan di bawah' : 'Tebak artinya sebelum membalik kartu!'}
          </div>
        </div>
      </div>

      {/* Bottom Rating Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl disabled:opacity-30 text-slate-700 transition-colors shadow-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* 3 Rating Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleRate('new')}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            Belum Hafal
          </button>
          <button
            onClick={() => handleRate('learning')}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-colors shadow-sm shadow-amber-500/20"
          >
            Masih Ragu
          </button>
          <button
            onClick={() => handleRate('mastered')}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors shadow-sm shadow-emerald-600/20 flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Sudah Paham!</span>
          </button>
        </div>

        <button
          onClick={handleNext}
          className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 transition-colors shadow-sm"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
