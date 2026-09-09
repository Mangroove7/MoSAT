import React, { useState } from 'react';
import { VocabularyItem } from '../../types/sat';
import { Sparkles, Eye, Check, Star, BookOpen, Volume2 } from 'lucide-react';

interface VocabCardProps {
  item: VocabularyItem;
  onUpdateMastery: (id: string, mastery: 'new' | 'learning' | 'mastered') => void;
}

export const VocabCard: React.FC<VocabCardProps> = ({ item, onUpdateMastery }) => {
  const [showSatHint, setShowSatHint] = useState(false);

  const speakWord = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        {/* Top Word header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {item.word}
              </h3>
              <button
                onClick={() => speakWord(item.word)}
                className="p-1 text-zinc-400 hover:text-orange-500 rounded-lg transition-colors"
                title="Dengarkan Pengucapan"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-500">
              <span className="font-mono text-zinc-400">{item.pronunciation}</span>
              <span>•</span>
              <span className="italic font-semibold text-orange-600">{item.partOfSpeech}</span>
            </div>
          </div>

          {/* Mastery Badge */}
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
            item.mastery === 'mastered' 
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
              : item.mastery === 'learning'
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
          }`}>
            {item.mastery === 'mastered' ? 'Dikuasai' : item.mastery === 'learning' ? 'Dipahami' : 'Baru'}
          </span>
        </div>

        {/* Simplified Meaning */}
        <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
            Arti yang Disederhanakan:
          </div>
          <div className="text-sm font-bold text-amber-950">
            {item.simplifiedMeaning}
          </div>
          <div className="text-xs text-zinc-600 italic">
            "{item.englishMeaning}"
          </div>
        </div>

        {/* Synonyms & Antonyms */}
        <div className="text-xs space-y-1.5 pt-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-bold text-zinc-600 text-[11px]">Sinonim:</span>
            {item.synonyms.map((s, idx) => (
              <span key={idx} className="bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded text-[11px] font-medium">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Contextual SAT Sentence Hint Mode */}
        <div className="pt-2">
          {showSatHint ? (
            <div className="p-3.5 bg-zinc-950 text-white rounded-xl space-y-2 text-xs animate-in fade-in border border-orange-500/20">
              <div className="flex items-center justify-between text-amber-300 font-bold text-[11px]">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Konteks Kalimat Soal Asli Digital SAT:
                </span>
                <button
                  onClick={() => setShowSatHint(false)}
                  className="text-zinc-400 hover:text-white text-[10px]"
                >
                  Sembunyikan
                </button>
              </div>
              <div className="text-zinc-200 sat-passage text-xs leading-relaxed italic border-l-2 border-orange-500 pl-3">
                "{item.satQuestionSentence}"
              </div>
              {item.satQuestionSource && (
                <div className="text-[10px] text-zinc-400">
                  Sumber: {item.satQuestionSource}
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowSatHint(true)}
              className="w-full py-2 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border border-orange-200 text-orange-800 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Buka Hint Konteks Kalimat Soal SAT Asli</span>
            </button>
          )}
        </div>
      </div>

      {/* Mastery Status Selector Buttons */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-400">Status:</span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onUpdateMastery(item.id, 'new')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
              item.mastery === 'new' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            Belum Hafal
          </button>
          <button
            onClick={() => onUpdateMastery(item.id, 'learning')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
              item.mastery === 'learning' ? 'bg-amber-500 text-white' : 'text-amber-700 hover:bg-amber-50'
            }`}
          >
            Belajar
          </button>
          <button
            onClick={() => onUpdateMastery(item.id, 'mastered')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
              item.mastery === 'mastered' ? 'bg-emerald-600 text-white' : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            Dikuasai ✓
          </button>
        </div>
      </div>
    </div>
  );
};
