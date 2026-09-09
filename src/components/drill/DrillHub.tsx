import React, { useState, useMemo } from 'react';
import { SATDomain, SATDifficulty, SATQuestion } from '../../types/sat';
import { StorageService } from '../../services/storageService';
import { 
  BookOpen, 
  Calculator, 
  Sparkles, 
  Filter, 
  Flame, 
  CheckCircle2, 
  Clock, 
  Layers,
  ArrowRight,
  TrendingUp,
  RotateCcw
} from 'lucide-react';

interface DrillHubProps {
  onStartDrill: (filteredQuestions: SATQuestion[], mode: 'instant' | 'timed') => void;
  onOpenMistakeReview?: () => void;
}

const DOMAINS_CONFIG: {
  domain: SATDomain;
  section: 'Reading and Writing' | 'Math';
  description: string;
  icon: string;
  color: string;
}[] = [
  // RW
  {
    domain: 'Information and Ideas',
    section: 'Reading and Writing',
    description: 'Central Ideas, Inferences, Command of Evidence (Textual & Quantitative)',
    icon: '📊',
    color: 'border-amber-200 hover:border-amber-400 bg-amber-50/30'
  },
  {
    domain: 'Craft and Structure',
    section: 'Reading and Writing',
    description: 'Words in Context, Text Structure & Purpose, Cross-Text Connections',
    icon: '🔍',
    color: 'border-orange-200 hover:border-orange-400 bg-orange-50/30'
  },
  {
    domain: 'Expression of Ideas',
    section: 'Reading and Writing',
    description: 'Rhetorical Synthesis, Transitions & Sentence Flow',
    icon: '💡',
    color: 'border-yellow-200 hover:border-yellow-400 bg-yellow-50/30'
  },
  {
    domain: 'Standard English Conventions',
    section: 'Reading and Writing',
    description: 'Boundaries (Punctuation, Comma Splices), Form, Structure & Sense',
    icon: '✍️',
    color: 'border-amber-200 hover:border-amber-400 bg-amber-50/30'
  },
  // Math
  {
    domain: 'Algebra',
    section: 'Math',
    description: 'Linear equations in 1-2 variables, Linear functions, Systems & Inequalities',
    icon: '📐',
    color: 'border-orange-200 hover:border-orange-400 bg-orange-50/30'
  },
  {
    domain: 'Advanced Math',
    section: 'Math',
    description: 'Nonlinear functions, Quadratics, Exponential models, Equivalent expressions',
    icon: '⚡',
    color: 'border-amber-200 hover:border-amber-400 bg-amber-50/30'
  },
  {
    domain: 'Problem-Solving and Data Analysis',
    section: 'Math',
    description: 'Ratios, Percentages, Probability, Statistical claims, Scatterplots',
    icon: '📈',
    color: 'border-yellow-200 hover:border-yellow-400 bg-yellow-50/30'
  },
  {
    domain: 'Geometry and Trigonometry',
    section: 'Math',
    description: 'Area, Volume, Circles, Right triangles & Special trigonometry',
    icon: '⚪',
    color: 'border-orange-200 hover:border-orange-400 bg-orange-50/30'
  }
];

export const DrillHub: React.FC<DrillHubProps> = ({ onStartDrill, onOpenMistakeReview }) => {
  const [selectedSection, setSelectedSection] = useState<'All' | 'Reading and Writing' | 'Math'>('All');
  const [selectedDomain, setSelectedDomain] = useState<SATDomain | 'All'>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<SATDifficulty | 'All'>('All');
  const [onlyHard1600, setOnlyHard1600] = useState(false);
  const [drillMode, setDrillMode] = useState<'instant' | 'timed'>('instant');

  const allQuestions = useMemo(() => StorageService.getAllQuestions(), []);
  const mistakes = useMemo(() => StorageService.getMistakes(), []);
  const unresolvedMistakesCount = useMemo(() => mistakes.filter(m => !m.resolved).length, [mistakes]);

  // Filtered pool
  const filteredQuestions = useMemo(() => {
    return allQuestions.filter(q => {
      if (selectedSection !== 'All' && q.section !== selectedSection) return false;
      if (selectedDomain !== 'All' && q.domain !== selectedDomain) return false;
      if (onlyHard1600 && q.difficulty !== 'Hard') return false;
      if (!onlyHard1600 && selectedDifficulty !== 'All' && q.difficulty !== selectedDifficulty) return false;
      return true;
    });
  }, [allQuestions, selectedSection, selectedDomain, selectedDifficulty, onlyHard1600]);

  const handleStart = () => {
    if (filteredQuestions.length === 0) return;
    onStartDrill(filteredQuestions, drillMode);
  };

  return (
    <div className="flex-1 bg-stone-50 overflow-y-auto p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-orange-700 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                DSAT16 Targeted Lab
              </span>
              <span className="text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                Target 1500–1600
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Drill Soal Terarah Digital SAT
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-xl">
              Pilih dari 8 domain resmi College Board. Asah sub-skill spesifik dengan bedah alasan trap answer dan trik instan Desmos.
            </p>
          </div>

          {/* Quick Action Button */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3">
            {unresolvedMistakesCount > 0 && onOpenMistakeReview && (
              <button
                onClick={onOpenMistakeReview}
                className="w-full sm:w-auto px-5 py-3.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 hover:scale-102"
                title="Buka dan latih ulang soal-soal yang pernah salah"
              >
                <RotateCcw className="w-4 h-4 text-rose-600" />
                <span>Buku Dosa ({unresolvedMistakesCount} Salah)</span>
              </button>
            )}

            <button
              onClick={handleStart}
              disabled={filteredQuestions.length === 0}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 font-bold text-sm text-white rounded-2xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 hover:scale-102"
            >
              <span>Mulai Drill ({filteredQuestions.length} Soal)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4">
            {/* Section tabs */}
            <div className="flex items-center bg-stone-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => { setSelectedSection('All'); setSelectedDomain('All'); }}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedSection === 'All' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Semua Bagian
              </button>
              <button
                onClick={() => { setSelectedSection('Reading and Writing'); setSelectedDomain('All'); }}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedSection === 'Reading and Writing' ? 'bg-white text-orange-700 shadow-sm' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Reading & Writing
              </button>
              <button
                onClick={() => { setSelectedSection('Math'); setSelectedDomain('All'); }}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedSection === 'Math' ? 'bg-white text-amber-700 shadow-sm' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Math (Desmos)
              </button>
            </div>

            {/* Special 1500-1600 Hard Filter Toggle */}
            <button
              onClick={() => setOnlyHard1600(!onlyHard1600)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                onlyHard1600
                  ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-sm ring-1 ring-rose-300'
                  : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <Flame className={`w-4 h-4 ${onlyHard1600 ? 'fill-rose-600 text-rose-600' : 'text-stone-400'}`} />
              <span>Hanya Soal Hard (Tier 1500–1600)</span>
            </button>

            {/* Mode selection */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-500 font-medium">Mode Latihan:</span>
              <div className="flex items-center bg-stone-100 p-1 rounded-xl">
                <button
                  onClick={() => setDrillMode('instant')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    drillMode === 'instant' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
                  }`}
                  title="Pembahasan dan analisis jebakan langsung tampil setelah menjawab"
                >
                  Instant Rationale
                </button>
                <button
                  onClick={() => setDrillMode('timed')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    drillMode === 'timed' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
                  }`}
                  title="Waktu berjalan per soal menyerupai ujian"
                >
                  Timed Mode
                </button>
              </div>
            </div>
          </div>

          {/* Difficulty filter if not onlyHard1600 */}
          {!onlyHard1600 && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-500 font-medium">Tingkat Kesulitan:</span>
              {(['All', 'Easy', 'Medium', 'Hard'] as const).map(diff => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
                    selectedDifficulty === diff 
                      ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm' 
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {diff === 'All' ? 'Semua Kesulitan' : diff}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 8 Domains Grid with Yellow-Orange Accents */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-stone-900">
              Pilih Domain Spesifik
            </h2>
            <span className="text-xs text-stone-500 font-medium">
              Total {allQuestions.length} soal autentik College Board tersimpan
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DOMAINS_CONFIG.filter(d => selectedSection === 'All' || d.section === selectedSection).map(item => {
              const count = allQuestions.filter(q => q.domain === item.domain).length;
              const isSelected = selectedDomain === item.domain;

              return (
                <button
                  key={item.domain}
                  onClick={() => setSelectedDomain(isSelected ? 'All' : item.domain)}
                  className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between h-44 ${
                    isSelected 
                      ? 'border-orange-500 ring-2 ring-orange-500/30 bg-orange-50/50 shadow-md' 
                      : item.color
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 border border-stone-200 text-stone-800 shadow-sm">
                        {count} Soal
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-stone-900 leading-snug">
                      {item.domain}
                    </h3>
                    <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs font-semibold text-orange-600">
                    <span>{isSelected ? 'Terpilih ✓' : 'Pilih Domain'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
