import React, { useState, useMemo } from 'react';
import { SAT_VOCABULARY } from '../../data/vocabData';
import { StorageService } from '../../services/storageService';
import { VocabularyItem } from '../../types/sat';
import { VocabCard } from './VocabCard';
import { FlashcardDeck } from './FlashcardDeck';
import { Search, Sparkles, Layers, BookOpen, CheckCircle2, Star } from 'lucide-react';

export const VocabHub: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'flashcard'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMastery, setFilterMastery] = useState<'all' | 'new' | 'learning' | 'mastered'>('all');

  // Load user mastery state from storage
  const [masteryMap, setMasteryMap] = useState<Record<string, 'new' | 'learning' | 'mastered'>>(() => {
    return StorageService.getVocabMastery();
  });

  const handleUpdateMastery = (id: string, status: 'new' | 'learning' | 'mastered') => {
    StorageService.setVocabMastery(id, status);
    setMasteryMap(prev => ({ ...prev, [id]: status }));
  };

  const vocabListWithMastery: VocabularyItem[] = useMemo(() => {
    return SAT_VOCABULARY.map(item => ({
      ...item,
      mastery: masteryMap[item.id] || item.mastery
    }));
  }, [masteryMap]);

  const filteredVocab = useMemo(() => {
    return vocabListWithMastery.filter(item => {
      if (filterMastery !== 'all' && item.mastery !== filterMastery) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          item.word.toLowerCase().includes(q) ||
          item.simplifiedMeaning.toLowerCase().includes(q) ||
          item.englishMeaning.toLowerCase().includes(q) ||
          item.synonyms.some(s => s.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [vocabListWithMastery, filterMastery, searchQuery]);

  const stats = useMemo(() => {
    const total = vocabListWithMastery.length;
    const mastered = vocabListWithMastery.filter(v => v.mastery === 'mastered').length;
    const learning = vocabListWithMastery.filter(v => v.mastery === 'learning').length;
    const isNew = vocabListWithMastery.filter(v => v.mastery === 'new').length;
    return { total, mastered, learning, isNew, percent: Math.round((mastered / total) * 100) };
  }, [vocabListWithMastery]);

  return (
    <div className="flex-1 bg-zinc-50 overflow-y-auto p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-orange-100/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-orange-700 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                Bedah Kosakata Digital SAT
              </span>
              <span className="text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Contextual Learning Mode
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
              Vocab Lab & Flashcards
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-xl">
              Kuasai kata-kata frekuensi tinggi SAT dengan <strong>arti yang disederhanakan</strong> dan <strong>hint kalimat kontekstual dari soal SAT asli</strong>.
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-zinc-100 p-1 rounded-2xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'grid' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Daftar Kata</span>
            </button>
            <button
              onClick={() => setViewMode('flashcard')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'flashcard' ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Mode Flashcard</span>
            </button>
          </div>
        </div>

        {/* Progress Bar & Stats */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-zinc-400 font-medium">Total Kata SAT</div>
            <div className="text-2xl font-black text-zinc-900 mt-0.5">{stats.total}</div>
          </div>
          <div>
            <div className="text-xs text-emerald-600 font-semibold">Sudah Dikuasai</div>
            <div className="text-2xl font-black text-emerald-600 mt-0.5">{stats.mastered}</div>
          </div>
          <div>
            <div className="text-xs text-amber-600 font-semibold">Sedang Dipelajari</div>
            <div className="text-2xl font-black text-amber-600 mt-0.5">{stats.learning}</div>
          </div>
          <div>
            <div className="text-xs text-zinc-400 font-medium">Penguasaan Kosakata</div>
            <div className="text-2xl font-black text-orange-600 mt-0.5">{stats.percent}%</div>
          </div>
        </div>

        {/* Main Content Area: Flashcard or Grid */}
        {viewMode === 'flashcard' ? (
          <FlashcardDeck
            cards={filteredVocab}
            onUpdateMastery={handleUpdateMastery}
            onExit={() => setViewMode('grid')}
          />
        ) : (
          <div className="space-y-6">
            {/* Search & Filter bar */}
            <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Search input */}
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari kata atau arti (contoh: ambiguous, mendua)..."
                  className="w-full pl-9 pr-4 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-orange-500 text-zinc-900 transition-colors"
                />
              </div>

              {/* Status filter buttons */}
              <div className="flex items-center gap-1.5 text-xs overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setFilterMastery('all')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors shrink-0 ${
                    filterMastery === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Semua ({stats.total})
                </button>
                <button
                  onClick={() => setFilterMastery('mastered')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors shrink-0 ${
                    filterMastery === 'mastered' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  Dikuasai ({stats.mastered})
                </button>
                <button
                  onClick={() => setFilterMastery('learning')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors shrink-0 ${
                    filterMastery === 'learning' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                  }`}
                >
                  Belajar ({stats.learning})
                </button>
                <button
                  onClick={() => setFilterMastery('new')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors shrink-0 ${
                    filterMastery === 'new' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Belum ({stats.isNew})
                </button>
              </div>
            </div>

            {/* Vocab Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredVocab.map(item => (
                <VocabCard
                  key={item.id}
                  item={item}
                  onUpdateMastery={handleUpdateMastery}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
