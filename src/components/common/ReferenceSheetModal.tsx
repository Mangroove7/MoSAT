import React from 'react';
import { X, FileText } from 'lucide-react';

interface ReferenceSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReferenceSheetModal: React.FC<ReferenceSheetModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-sat-blue text-white px-6 py-4 flex items-center justify-between select-none">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-blue-300" />
            <div>
              <h2 className="text-base font-bold">SAT Math Reference Sheet</h2>
              <p className="text-xs text-blue-200">Lembar referensi rumus resmi yang tersedia selama modul Math</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-sm">
          {/* Section 1: 2D Geometry */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 border-b pb-1">
              Rumus Luas & Keliling (2D Shapes)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Circle */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <svg className="w-16 h-16 mx-auto mb-2" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#2563eb" strokeWidth="3" />
                  <line x1="50" y1="50" x2="90" y2="50" stroke="#ef4444" strokeWidth="2" strokeDasharray="3,3" />
                  <text x="68" y="44" fontSize="12" fill="#ef4444" fontWeight="bold">r</text>
                </svg>
                <div className="font-bold text-slate-900">Lingkaran</div>
                <div className="text-xs text-slate-600 mt-1 font-mono">A = πr²</div>
                <div className="text-xs text-slate-600 font-mono">C = 2πr</div>
              </div>

              {/* Rectangle */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <svg className="w-16 h-16 mx-auto mb-2" viewBox="0 0 100 100">
                  <rect x="15" y="25" width="70" height="50" fill="none" stroke="#2563eb" strokeWidth="3" />
                  <text x="48" y="20" fontSize="11" fill="#475569">w</text>
                  <text x="88" y="53" fontSize="11" fill="#475569">l</text>
                </svg>
                <div className="font-bold text-slate-900">Persegi Panjang</div>
                <div className="text-xs text-slate-600 mt-1 font-mono">A = lw</div>
              </div>

              {/* Triangle */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <svg className="w-16 h-16 mx-auto mb-2" viewBox="0 0 100 100">
                  <polygon points="15,75 85,75 50,20" fill="none" stroke="#2563eb" strokeWidth="3" />
                  <line x1="50" y1="20" x2="50" y2="75" stroke="#ef4444" strokeWidth="2" strokeDasharray="3,3" />
                  <text x="54" y="52" fontSize="11" fill="#ef4444" fontWeight="bold">h</text>
                  <text x="48" y="88" fontSize="11" fill="#475569">b</text>
                </svg>
                <div className="font-bold text-slate-900">Segitiga</div>
                <div className="text-xs text-slate-600 mt-1 font-mono">A = ½bh</div>
              </div>

              {/* Pythagorean */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <svg className="w-16 h-16 mx-auto mb-2" viewBox="0 0 100 100">
                  <polygon points="20,80 80,80 20,25" fill="none" stroke="#2563eb" strokeWidth="3" />
                  <rect x="20" y="70" width="10" height="10" fill="none" stroke="#64748b" strokeWidth="1.5" />
                  <text x="10" y="55" fontSize="11" fill="#475569">a</text>
                  <text x="48" y="94" fontSize="11" fill="#475569">b</text>
                  <text x="56" y="48" fontSize="11" fill="#ef4444" fontWeight="bold">c</text>
                </svg>
                <div className="font-bold text-slate-900">Pythagoras</div>
                <div className="text-xs text-slate-600 mt-1 font-mono">c² = a² + b²</div>
              </div>
            </div>
          </div>

          {/* Section 2: Special Right Triangles */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 border-b pb-1">
              Segitiga Siku-Siku Khusus (Special Right Triangles)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 30-60-90 */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-4">
                <svg className="w-24 h-24 shrink-0" viewBox="0 0 120 120">
                  <polygon points="20,100 100,100 20,30" fill="none" stroke="#2563eb" strokeWidth="3" />
                  <rect x="20" y="88" width="12" height="12" fill="none" stroke="#64748b" strokeWidth="1.5" />
                  <text x="10" y="68" fontSize="11" fill="#475569" fontWeight="bold">x</text>
                  <text x="54" y="115" fontSize="11" fill="#475569" fontWeight="bold">x√3</text>
                  <text x="64" y="60" fontSize="11" fill="#ef4444" fontWeight="bold">2x</text>
                  <text x="26" y="48" fontSize="10" fill="#3b82f6">30°</text>
                  <text x="76" y="94" fontSize="10" fill="#3b82f6">60°</text>
                </svg>
                <div>
                  <div className="font-bold text-slate-900">Segitiga 30° - 60° - 90°</div>
                  <div className="text-xs text-slate-600 mt-1 space-y-0.5">
                    <div>• Sisi depan 30° = <span className="font-mono font-bold">x</span></div>
                    <div>• Sisi depan 60° = <span className="font-mono font-bold">x√3</span></div>
                    <div>• Hipotenusa = <span className="font-mono font-bold text-blue-600">2x</span></div>
                  </div>
                </div>
              </div>

              {/* 45-45-90 */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-4">
                <svg className="w-24 h-24 shrink-0" viewBox="0 0 120 120">
                  <polygon points="20,100 90,100 20,30" fill="none" stroke="#2563eb" strokeWidth="3" />
                  <rect x="20" y="88" width="12" height="12" fill="none" stroke="#64748b" strokeWidth="1.5" />
                  <text x="10" y="70" fontSize="11" fill="#475569" fontWeight="bold">s</text>
                  <text x="52" y="115" fontSize="11" fill="#475569" fontWeight="bold">s</text>
                  <text x="60" y="62" fontSize="11" fill="#ef4444" fontWeight="bold">s√2</text>
                  <text x="26" y="52" fontSize="10" fill="#3b82f6">45°</text>
                  <text x="66" y="94" fontSize="10" fill="#3b82f6">45°</text>
                </svg>
                <div>
                  <div className="font-bold text-slate-900">Segitiga 45° - 45° - 90°</div>
                  <div className="text-xs text-slate-600 mt-1 space-y-0.5">
                    <div>• Kaki segitiga = <span className="font-mono font-bold">s</span></div>
                    <div>• Hipotenusa = <span className="font-mono font-bold text-blue-600">s√2</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: 3D Volume */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 border-b pb-1">
              Rumus Volume Bangun Ruang (3D Solids)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <div className="font-bold text-xs text-slate-900">Balok</div>
                <div className="text-xs font-mono text-blue-700 font-bold mt-1">V = lwh</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <div className="font-bold text-xs text-slate-900">Tabung</div>
                <div className="text-xs font-mono text-blue-700 font-bold mt-1">V = πr²h</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <div className="font-bold text-xs text-slate-900">Bola</div>
                <div className="text-xs font-mono text-blue-700 font-bold mt-1">V = ⁴⁄₃πr³</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <div className="font-bold text-xs text-slate-900">Kerucut</div>
                <div className="text-xs font-mono text-blue-700 font-bold mt-1">V = ⅓πr²h</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center col-span-2 sm:col-span-1">
                <div className="font-bold text-xs text-slate-900">Piramida</div>
                <div className="text-xs font-mono text-blue-700 font-bold mt-1">V = ⅓lwh</div>
              </div>
            </div>
          </div>

          {/* Section 4: Key Angular Facts */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-1">
            <div className="font-bold text-sm text-blue-950 mb-1">Catatan Sudut & Derajat:</div>
            <div>• Jumlah besar sudut dalam lingkaran penuh adalah <strong>360°</strong> atau <strong>2π radian</strong>.</div>
            <div>• Jumlah besar sudut dalam sebuah segitiga adalah <strong>180°</strong> atau <strong>π radian</strong>.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
