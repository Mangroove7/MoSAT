import React from 'react';
import { Bookmark, X } from 'lucide-react';

interface QuestionGridModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalQuestions: number;
  currentIndex: number;
  onSelectIndex: (index: number) => void;
  answers: Record<string, string>;
  flaggedIndices: Set<number>;
  questionIds: string[];
}

export const QuestionGridModal: React.FC<QuestionGridModalProps> = ({
  isOpen,
  onClose,
  totalQuestions,
  currentIndex,
  onSelectIndex,
  answers,
  flaggedIndices,
  questionIds
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-5 border border-slate-200 animate-in slide-in-from-bottom-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Navigasi Soal Modul</h3>
            <p className="text-xs text-slate-500">Pilih nomor soal untuk langsung melompat</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-around py-3 border-b border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded border border-slate-900 bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">
              1
            </span>
            <span>Saat Ini</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded border-2 border-dashed border-slate-400 bg-slate-100 flex items-center justify-center font-bold text-[10px] text-slate-400">
              2
            </span>
            <span>Belum Dijawab</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded border border-blue-600 bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-[10px]">
              3
            </span>
            <span>Terjawab</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded border border-slate-300 bg-white text-slate-800 flex items-center justify-center font-bold text-[10px] relative">
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full" />
              4
            </span>
            <span>Review</span>
          </div>
        </div>

        {/* Questions Grid */}
        <div className="grid grid-cols-6 sm:grid-cols-9 gap-2.5 py-4 max-h-[50vh] overflow-y-auto">
          {Array.from({ length: totalQuestions }).map((_, idx) => {
            const isCurrent = currentIndex === idx;
            const qId = questionIds[idx];
            const hasAnswer = Boolean(answers[qId] && answers[qId].trim().length > 0);
            const isFlagged = flaggedIndices.has(idx);

            let buttonClass = 'border-slate-300 bg-white text-slate-700 hover:border-blue-400';
            if (isCurrent) {
              buttonClass = 'border-slate-900 bg-slate-900 text-white shadow-md ring-2 ring-slate-900/20';
            } else if (hasAnswer) {
              buttonClass = 'border-blue-600 bg-blue-50 text-blue-700 font-semibold';
            } else {
              buttonClass = 'border-2 border-dashed border-slate-300 text-slate-400 hover:border-slate-400';
            }

            return (
              <button
                key={idx}
                onClick={() => {
                  onSelectIndex(idx);
                  onClose();
                }}
                className={`relative h-11 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${buttonClass}`}
              >
                {idx + 1}
                {isFlagged && (
                  <Bookmark className="w-3 h-3 fill-amber-500 text-amber-500 absolute top-1 right-1" />
                )}
              </button>
            );
          })}
        </div>

        {/* Close Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors"
          >
            Tutup Navigasi
          </button>
        </div>
      </div>
    </div>
  );
};
