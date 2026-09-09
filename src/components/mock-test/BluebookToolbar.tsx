import React from 'react';
import { 
  Bookmark, 
  Calculator, 
  FileText, 
  Highlighter, 
  Strikethrough,
  Check
} from 'lucide-react';

interface BluebookToolbarProps {
  isMathSection: boolean;
  isFlagged: boolean;
  onToggleFlag: () => void;
  onOpenDesmos: () => void;
  onOpenReference: () => void;
  isEliminationMode: boolean;
  onToggleEliminationMode: () => void;
  activeHighlightColor: string | null;
  onSelectHighlightColor: (color: string | null) => void;
}

export const BluebookToolbar: React.FC<BluebookToolbarProps> = ({
  isMathSection,
  isFlagged,
  onToggleFlag,
  onOpenDesmos,
  onOpenReference,
  isEliminationMode,
  onToggleEliminationMode,
  activeHighlightColor,
  onSelectHighlightColor
}) => {
  return (
    <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between select-none text-xs text-slate-700 shadow-sm">
      {/* Left: Mark for review */}
      <button
        onClick={onToggleFlag}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-all ${
          isFlagged 
            ? 'bg-amber-50 border-amber-300 text-amber-800 shadow-sm' 
            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
        }`}
      >
        <Bookmark className={`w-4 h-4 ${isFlagged ? 'fill-amber-500 text-amber-500' : 'text-slate-500'}`} />
        <span>Mark for Review</span>
      </button>

      {/* Right: Tools & Utilities */}
      <div className="flex items-center gap-2">
        {/* Math tools */}
        {isMathSection && (
          <>
            <button
              onClick={onOpenDesmos}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-semibold transition-colors shadow-sm"
              title="Buka Desmos Graphing Calculator"
            >
              <Calculator className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">Calculator (Desmos)</span>
            </button>

            <button
              onClick={onOpenReference}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium transition-colors"
              title="Buka Lembar Rumus Resmi"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Reference</span>
            </button>
          </>
        )}

        {/* Answer Choice Eliminator (Strikethrough tool) */}
        <button
          onClick={onToggleEliminationMode}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-all ${
            isEliminationMode 
              ? 'bg-slate-800 border-slate-900 text-white shadow-inner' 
              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
          title="Eliminasi Opsi Jawaban (Strikethrough)"
        >
          <span className="font-mono font-bold tracking-tighter text-xs">ABC</span>
          <Strikethrough className="w-3.5 h-3.5" />
        </button>

        {/* Highlighter Tool */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 gap-1">
          <Highlighter className="w-3.5 h-3.5 text-slate-500 ml-1 mr-0.5" />
          <button
            onClick={() => onSelectHighlightColor(activeHighlightColor === 'yellow' ? null : 'yellow')}
            className={`w-5 h-5 rounded-full bg-yellow-300 border border-yellow-400 flex items-center justify-center transition-transform ${
              activeHighlightColor === 'yellow' ? 'scale-110 ring-2 ring-slate-800' : 'hover:scale-105'
            }`}
            title="Stabilo Kuning"
          >
            {activeHighlightColor === 'yellow' && <Check className="w-3 h-3 text-slate-900" />}
          </button>
          <button
            onClick={() => onSelectHighlightColor(activeHighlightColor === 'green' ? null : 'green')}
            className={`w-5 h-5 rounded-full bg-emerald-300 border border-emerald-400 flex items-center justify-center transition-transform ${
              activeHighlightColor === 'green' ? 'scale-110 ring-2 ring-slate-800' : 'hover:scale-105'
            }`}
            title="Stabilo Hijau"
          >
            {activeHighlightColor === 'green' && <Check className="w-3 h-3 text-slate-900" />}
          </button>
          <button
            onClick={() => onSelectHighlightColor(activeHighlightColor === 'pink' ? null : 'pink')}
            className={`w-5 h-5 rounded-full bg-pink-300 border border-pink-400 flex items-center justify-center transition-transform ${
              activeHighlightColor === 'pink' ? 'scale-110 ring-2 ring-slate-800' : 'hover:scale-105'
            }`}
            title="Stabilo Merah Muda"
          >
            {activeHighlightColor === 'pink' && <Check className="w-3 h-3 text-slate-900" />}
          </button>
          {activeHighlightColor && (
            <button
              onClick={() => onSelectHighlightColor(null)}
              className="text-[10px] text-slate-500 hover:text-slate-800 px-1 font-semibold"
              title="Matikan Stabilo"
            >
              Off
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
