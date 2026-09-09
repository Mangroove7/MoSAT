import React, { useState } from 'react';
import { QUICK_NOTES, NoteSection } from '../../data/quickNotesData';
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
  Check
} from 'lucide-react';

export const MateriHub: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'grammar' | 'desmos' | 'strategy' | 'formulas'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDesmosOpen, setIsDesmosOpen] = useState(false);
  const [desmosPreset, setDesmosPreset] = useState<string | undefined>(undefined);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredNotes = QUICK_NOTES.filter(note => {
    if (selectedCategory !== 'all' && note.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        note.title.toLowerCase().includes(q) ||
        note.summary.toLowerCase().includes(q) ||
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
    <div className="flex-1 bg-slate-50 overflow-y-auto p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                Materi Kilat Digital SAT
              </span>
              <span className="text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full">
                High-Yield Cheat Sheets
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Rangkuman Kilat Rumus, Grammar & Desmos Hacks
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
              Intisari materi berbobot tertinggi yang wajib dikuasai untuk mengamankan skor 1500–1600.
            </p>
          </div>

          <button
            onClick={() => { setDesmosPreset(undefined); setIsDesmosOpen(true); }}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 shrink-0 hover:scale-102"
          >
            <Calculator className="w-4 h-4" />
            <span>Buka Desmos Calculator</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold overflow-x-auto w-full sm:w-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-2 rounded-lg transition-colors shrink-0 ${
                selectedCategory === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua Materi
            </button>
            <button
              onClick={() => setSelectedCategory('grammar')}
              className={`px-3.5 py-2 rounded-lg transition-colors shrink-0 flex items-center gap-1.5 ${
                selectedCategory === 'grammar' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Grammar</span>
            </button>
            <button
              onClick={() => setSelectedCategory('desmos')}
              className={`px-3.5 py-2 rounded-lg transition-colors shrink-0 flex items-center gap-1.5 ${
                selectedCategory === 'desmos' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Desmos Hacks</span>
            </button>
            <button
              onClick={() => setSelectedCategory('strategy')}
              className={`px-3.5 py-2 rounded-lg transition-colors shrink-0 flex items-center gap-1.5 ${
                selectedCategory === 'strategy' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Strategi 1500+</span>
            </button>
            <button
              onClick={() => setSelectedCategory('formulas')}
              className={`px-3.5 py-2 rounded-lg transition-colors shrink-0 flex items-center gap-1.5 ${
                selectedCategory === 'formulas' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Formula Sheet</span>
            </button>
          </div>

          {/* Search input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari materi, rumus, aturan..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-900"
            />
          </div>
        </div>

        {/* Note Sections List */}
        <div className="space-y-6">
          {filteredNotes.map(note => (
            <div key={note.id} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
                      {note.category.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
                      {note.badge}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                    {note.title}
                  </h2>
                </div>

                <p className="text-xs text-slate-500 max-w-sm sm:text-right">
                  {note.summary}
                </p>
              </div>

              {/* Key Takeaways */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Poin Kunci Wajib Diingat:
                </h3>
                <div className="space-y-2">
                  {note.keyTakeaways.map((point, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs text-slate-800 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Examples and Code */}
              {note.examples && note.examples.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Contoh & Penerapan Praktis:
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {note.examples.map((ex, idx) => (
                      <div key={idx} className="p-4 bg-slate-900 text-white rounded-2xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-blue-300">
                            {ex.title}
                          </span>
                          <div className="flex items-center gap-2">
                            {note.category === 'desmos' && (
                              <button
                                onClick={() => openDesmosWithPreset(note.id === 'desmos-regression' ? 'linear_reg' : 'systems')}
                                className="text-[10px] bg-blue-600 hover:bg-blue-500 px-2.5 py-1 rounded font-bold transition-colors flex items-center gap-1"
                              >
                                <Sparkles className="w-3 h-3 text-amber-300" />
                                <span>Coba di Desmos</span>
                              </button>
                            )}
                            <button
                              onClick={() => handleCopy(ex.codeOrText, `${note.id}-${idx}`)}
                              className="p-1 text-slate-400 hover:text-white rounded transition-colors"
                              title="Salin Teks"
                            >
                              {copiedId === `${note.id}-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        {/* Code snippet */}
                        <pre className="p-3 bg-slate-950/80 rounded-xl font-mono text-xs text-emerald-300 overflow-x-auto whitespace-pre-wrap">
                          {ex.codeOrText}
                        </pre>

                        {/* Explanation */}
                        <div className="text-xs text-slate-300 leading-relaxed">
                          {ex.explanation}
                        </div>

                        {/* Trap Warning */}
                        {ex.trapWarning && (
                          <div className="p-2.5 bg-amber-950/40 border border-amber-800/60 rounded-xl text-xs text-amber-200/90 flex items-start gap-2">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <span>{ex.trapWarning}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Desmos Modal */}
      <DesmosModal
        isOpen={isDesmosOpen}
        onClose={() => setIsDesmosOpen(false)}
        initialPreset={desmosPreset}
      />
    </div>
  );
};
