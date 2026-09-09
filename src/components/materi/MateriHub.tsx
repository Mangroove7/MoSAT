import React, { useState } from 'react';
import { QUICK_NOTES, NoteSection, CurriculumTier } from '../../data/quickNotesData';
import { DesmosModal } from '../common/DesmosModal';
import { 
  Zap, 
  Search, 
  BookOpen, 
  Calculator, 
  Target, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  Copy,
  Check,
  Compass,
  ArrowRight,
  GraduationCap
} from 'lucide-react';

interface MateriHubProps {
  onStartDrillWithDomain?: (domain: string) => void;
}

export const MateriHub: React.FC<MateriHubProps> = ({ onStartDrillWithDomain }) => {
  const [selectedTier, setSelectedTier] = useState<'all' | CurriculumTier>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'grammar' | 'desmos' | 'strategy' | 'formulas'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDesmosOpen, setIsDesmosOpen] = useState(false);
  const [desmosPreset, setDesmosPreset] = useState<string | undefined>(undefined);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredNotes = QUICK_NOTES.filter(note => {
    if (selectedTier !== 'all' && note.tier !== selectedTier) return false;
    if (selectedCategory !== 'all' && note.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        note.title.toLowerCase().includes(q) ||
        note.summary.toLowerCase().includes(q) ||
        note.pedagogicalObjective.toLowerCase().includes(q) ||
        note.keyTakeaways.some(k => k.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openDesmosWithPreset = (preset: string) => {
    setDesmosPreset(preset);
    setIsDesmosOpen(true);
  };

  return (
    <div className="flex-1 bg-zinc-950 overflow-y-auto p-4 sm:p-8 text-zinc-100">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Header Card with DSAT16 Gradient */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 relative z-10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/30 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-orange-400" />
                Pedagogi Kurikulum Terarah
              </span>
              <span className="text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-full font-mono">
                Target 1500–1600
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Kurikulum Berjenjang Digital SAT
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
              Disusun secara hierarkis: dari fondasi aturan tata bahasa baku, strategi akselerasi Desmos, hingga pembedahan soal jebakan tertinggi penentu skor 1550+.
            </p>
          </div>

          <button
            onClick={() => setIsDesmosOpen(true)}
            className="shrink-0 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-zinc-950 font-black text-xs rounded-2xl shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2"
          >
            <Calculator className="w-4 h-4" />
            <span>Buka Floating Desmos</span>
          </button>
        </div>

        {/* Tier Selector Bar (3 Pathways) */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
          {[
            { id: 'all' as const, label: 'Semua Materi', desc: 'Seluruh tingkatan materi' },
            { id: 'tier1_foundation' as const, label: 'Tier 1: Fondasi', desc: '1200–1400: Aturan Baku' },
            { id: 'tier2_strategies' as const, label: 'Tier 2: Strategi & Desmos', desc: '1400–1520: Trik Cepat' },
            { id: 'tier3_elite' as const, label: 'Tier 3: Elite Mastery', desc: '1500–1600: Jebakan Sulit' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTier(t.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                selectedTier === t.id
                  ? 'bg-orange-500/15 border-orange-500 text-white ring-1 ring-orange-500'
                  : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <div className="font-bold text-xs">{t.label}</div>
              <div className="text-[10px] text-zinc-500 mt-0.5 font-medium">{t.desc}</div>
            </button>
          ))}
        </div>

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-900/80 p-3 rounded-2xl border border-zinc-800">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari konsep, rumus, kata transisi..."
              className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {[
              { id: 'all', label: 'Semua Kategori' },
              { id: 'grammar', label: 'Tata Bahasa' },
              { id: 'desmos', label: 'Trik Desmos' },
              { id: 'strategy', label: 'Strategi Soal' },
              { id: 'formulas', label: 'Aljabar & Rumus' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-zinc-800 text-orange-400 border border-orange-500/30 font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="space-y-4">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 p-6 rounded-3xl transition-all space-y-4 shadow-lg"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-mono font-bold bg-orange-500/15 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-md">
                      {note.tierLabel}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-amber-300 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                      Target {note.targetScoreRange}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-medium hidden sm:inline">
                      Domain: {note.domainFocus}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {note.title}
                  </h3>
                </div>

                {note.category === 'desmos' && (
                  <button
                    onClick={() => openDesmosWithPreset('linear_reg')}
                    className="shrink-0 px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Coba di Desmos</span>
                  </button>
                )}
              </div>

              {/* Pedagogical Objective Box */}
              <div className="p-3 bg-zinc-950/70 border border-zinc-800/80 rounded-2xl flex items-start gap-2.5">
                <Target className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-orange-400 block">Tujuan Pembelajaran:</span>
                  <p className="text-xs text-zinc-300">{note.pedagogicalObjective}</p>
                </div>
              </div>

              {/* Summary */}
              <p className="text-xs text-zinc-400 leading-relaxed">
                {note.summary}
              </p>

              {/* Key Takeaways */}
              <div className="space-y-2">
                <div className="text-[11px] uppercase font-extrabold tracking-wider text-zinc-500">
                  Poin Kunci & Aturan Mutlak:
                </div>
                <ul className="space-y-1.5 text-xs text-zinc-300">
                  {note.keyTakeaways.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Examples & Trap Warnings */}
              {note.examples.length > 0 && (
                <div className="space-y-3 pt-2">
                  {note.examples.map((ex, exIdx) => (
                    <div key={exIdx} className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-[11px]">{ex.title}</span>
                        <button
                          onClick={() => handleCopy(ex.codeOrText, `${note.id}-${exIdx}`)}
                          className="text-[10px] text-zinc-500 hover:text-white flex items-center gap-1 transition-colors"
                        >
                          {copiedId === `${note.id}-${exIdx}` ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400 font-bold">Disalin</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Salin</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="font-mono text-[11px] bg-zinc-900 p-2.5 rounded-xl border border-zinc-800/80 text-orange-300 whitespace-pre-wrap leading-relaxed">
                        {ex.codeOrText}
                      </pre>
                      <p className="text-zinc-400 text-[11px] leading-relaxed">
                        <span className="font-semibold text-zinc-300">Penjelasan: </span>
                        {ex.explanation}
                      </p>
                      {ex.trapWarning && (
                        <div className="flex items-start gap-1.5 text-[11px] text-rose-400 bg-rose-500/10 p-2 rounded-xl border border-rose-500/20">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span><span className="font-bold">Jebakan College Board: </span>{ex.trapWarning}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Floating Desmos Modal */}
      <DesmosModal
        isOpen={isDesmosOpen}
        initialPreset={desmosPreset}
        onClose={() => setIsDesmosOpen(false)}
      />
    </div>
  );
};
