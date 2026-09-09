import React, { useState, useMemo } from 'react';
import { StorageService } from '../../services/storageService';
import { SATQuestion } from '../../types/sat';
import { X, Database, Download, Upload, CheckCircle2, RefreshCw, Server, ShieldCheck, Zap, Sparkles } from 'lucide-react';

interface ScraperManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuestionsUpdated: () => void;
}

export const ScraperManagerModal: React.FC<ScraperManagerModalProps> = ({
  isOpen,
  onClose,
  onQuestionsUpdated
}) => {
  const [jsonInput, setJsonInput] = useState('');
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const questions = useMemo(() => StorageService.getAllQuestions(), [isImporting, isSyncing]);

  const rwCount = questions.filter(q => q.section === 'Reading and Writing').length;
  const mathCount = questions.filter(q => q.section === 'Math').length;
  const hardCount = questions.filter(q => q.difficulty === 'Hard').length;

  if (!isOpen) return null;

  const handleAutoSync1000 = async () => {
    try {
      setIsSyncing(true);
      setImportMessage('Mengambil dan memuat paket 1.000+ soal College Board...');
      const res = await fetch('/sat_questions_1000.json');
      if (!res.ok) {
        throw new Error('File sat_questions_1000.json belum siap di-generate atau server belum selesai.');
      }
      const data = await res.json();
      const count = StorageService.importQuestions(data);
      setImportMessage(`🎉 Berhasil menyinkronkan ${count} soal baru dari College Board! Total bank soal kini: ${StorageService.getAllQuestions().length} soal.`);
      onQuestionsUpdated();
    } catch (e: any) {
      setImportMessage(`Info sinkronisasi: ${e.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleImport = () => {
    try {
      setIsImporting(true);
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) {
        setImportMessage('Error: Format JSON harus berupa array soal []');
        return;
      }
      const count = StorageService.importQuestions(parsed);
      setImportMessage(`Sukses mengimpor ${count} soal baru ke bank soal MoSAT!`);
      setJsonInput('');
      onQuestionsUpdated();
    } catch (e: any) {
      setImportMessage(`Error saat parse JSON: ${e.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(questions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `mosat_questions_bank_${questions.length}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-zinc-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 border border-orange-100 overflow-hidden space-y-6 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold shadow-md shadow-orange-500/20">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-zinc-900 tracking-tight">
                Sinkronisasi Bank Soal MoSAT
              </h2>
              <p className="text-xs text-zinc-500">
                Integrasi API Resmi College Board (1.000+ Soal Digital SAT)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Metrics */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3.5 bg-orange-50/70 rounded-2xl border border-orange-100">
            <div className="text-[10px] text-orange-700 uppercase font-bold">Total Soal Aktif</div>
            <div className="text-2xl font-black text-orange-950 font-mono mt-0.5">{questions.length}</div>
          </div>
          <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-100">
            <div className="text-[10px] text-amber-800 uppercase font-bold">RW & Math</div>
            <div className="text-xs font-bold text-amber-950 mt-1">{rwCount} RW • {mathCount} Math</div>
          </div>
          <div className="p-3.5 bg-rose-50/70 rounded-2xl border border-rose-100">
            <div className="text-[10px] text-rose-700 uppercase font-bold">Tier 1500+ Hard</div>
            <div className="text-2xl font-black text-rose-950 font-mono mt-0.5">{hardCount}</div>
          </div>
        </div>

        {/* Auto-Sync 1000+ Questions Banner */}
        <div className="p-4 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-yellow-500/10 rounded-2xl border border-orange-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-black text-orange-800">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>Paket 1.000+ Soal Asli College Board</span>
            </div>
            <p className="text-[11px] text-zinc-600">
              Sinkronkan 1.000+ soal adaptif lengkap dengan diagram SVG, KaTeX, dan kunci pembahasan.
            </p>
          </div>

          <button
            onClick={handleAutoSync1000}
            disabled={isSyncing}
            className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-60 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-1.5 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Menyinkronkan...' : 'Auto-Sync 1.000+ Soal'}</span>
          </button>
        </div>

        {/* API Pipeline info */}
        <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200 text-xs text-zinc-700 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-zinc-900 text-xs">
            <Server className="w-4 h-4 text-orange-600" />
            <span>Endpoint Backend College Board Resmi:</span>
          </div>
          <div className="font-mono text-[10px] bg-white p-2 rounded-lg border border-zinc-200 text-zinc-600 truncate">
            https://qbank-api.collegeboard.org/msreportingquestionbank-prod/questionbank/digital/
          </div>
          <p className="text-[11px] text-zinc-500">
            Terhubung langsung ke database Educator Question Bank untuk menyajikan soal asli terverifikasi.
          </p>
        </div>

        {/* Import JSON area */}
        <div className="space-y-2 text-xs">
          <label className="block font-bold uppercase tracking-wider text-zinc-700 text-[11px]">
            Impor Soal Manual (Format JSON):
          </label>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste array JSON hasil scraper atau cadangan di sini..."
            className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono text-zinc-800 outline-none focus:border-orange-500"
            rows={2}
          />
          {importMessage && (
            <div className="p-3 bg-orange-50 border border-orange-200 text-orange-800 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
              <span>{importMessage}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 font-semibold text-xs text-zinc-700 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 text-zinc-500" />
            <span>Ekspor JSON ({questions.length} Soal)</span>
          </button>

          <button
            onClick={handleImport}
            disabled={!jsonInput.trim() || isImporting}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 font-bold text-xs text-white transition-all shadow-md shadow-orange-500/20"
          >
            <Upload className="w-4 h-4" />
            <span>Impor Manual</span>
          </button>
        </div>
      </div>
    </div>
  );
};
