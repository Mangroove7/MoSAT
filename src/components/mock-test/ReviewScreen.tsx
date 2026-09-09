import React from 'react';
import { Bookmark, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface ReviewScreenProps {
  moduleName: string;
  totalQuestions: number;
  questionIds: string[];
  answers: Record<string, string>;
  flaggedIndices: Set<number>;
  onSelectIndex: (index: number) => void;
  onSubmitModule: () => void;
  onReturnToTest: () => void;
}

export const ReviewScreen: React.FC<ReviewScreenProps> = ({
  moduleName,
  totalQuestions,
  questionIds,
  answers,
  flaggedIndices,
  onSelectIndex,
  onSubmitModule,
  onReturnToTest
}) => {
  const answeredCount = questionIds.filter(id => answers[id] && answers[id].trim().length > 0).length;
  const unansweredCount = totalQuestions - answeredCount;
  const flaggedCount = flaggedIndices.size;

  return (
    <div className="flex-1 bg-slate-50 overflow-y-auto p-4 sm:p-8 flex flex-col justify-between">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        {/* Header summary */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                End of Module Review
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                Tinjau Jawaban {moduleName}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Periksa kembali semua nomor sebelum menyelesaikan modul ini. Setelah modul di-submit, Anda tidak dapat kembali ke modul ini.
              </p>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-3">
              <div className="px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                <div className="text-sm font-bold text-emerald-700">{answeredCount}</div>
                <div className="text-[10px] text-emerald-600 font-medium">Terjawab</div>
              </div>
              <div className={`px-3 py-2 rounded-xl text-center border ${
                unansweredCount > 0 ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                <div className="text-sm font-bold">{unansweredCount}</div>
                <div className="text-[10px] font-medium">Kosong</div>
              </div>
              <div className="px-3 py-2 bg-purple-50 border border-purple-200 rounded-xl text-center">
                <div className="text-sm font-bold text-purple-700">{flaggedCount}</div>
                <div className="text-[10px] text-purple-600 font-medium">Ditandai</div>
              </div>
            </div>
          </div>

          {unansweredCount > 0 && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Masih ada <strong>{unansweredCount} soal</strong> yang belum Anda jawab. Tidak ada penalti salah di SAT, disarankan mengisi semua nomor!
              </span>
            </div>
          )}
        </div>

        {/* Question Cards Grid */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Daftar Soal Modul</h3>
            <span className="text-xs text-slate-500">Klik nomor untuk meninjau soal</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {Array.from({ length: totalQuestions }).map((_, idx) => {
              const qId = questionIds[idx];
              const ans = answers[qId];
              const isAnswered = Boolean(ans && ans.trim().length > 0);
              const isFlagged = flaggedIndices.has(idx);

              return (
                <button
                  key={idx}
                  onClick={() => onSelectIndex(idx)}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between h-20 transition-all hover:scale-102 ${
                    isAnswered 
                      ? 'border-blue-200 bg-blue-50/40 hover:bg-blue-50 hover:border-blue-400' 
                      : 'border-2 border-dashed border-amber-300 bg-amber-50/30 hover:bg-amber-50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-sm text-slate-900">
                      Soal {idx + 1}
                    </span>
                    {isFlagged && (
                      <Bookmark className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    )}
                  </div>

                  <div className="text-xs">
                    {isAnswered ? (
                      <span className="font-semibold text-blue-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Jawaban: {ans}
                      </span>
                    ) : (
                      <span className="text-amber-700 font-semibold italic">
                        Belum Diisi
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-4xl mx-auto w-full pt-6 flex items-center justify-between">
        <button
          onClick={onReturnToTest}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 font-semibold text-xs text-slate-700 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Soal Terakhir</span>
        </button>

        <button
          onClick={onSubmitModule}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-xs text-white shadow-md transition-all hover:shadow-lg flex items-center gap-2"
        >
          <span>Selesaikan & Kirim Modul</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};
