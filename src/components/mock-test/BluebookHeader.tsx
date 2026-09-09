import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, HelpCircle, ChevronDown } from 'lucide-react';

interface BluebookHeaderProps {
  sectionTitle: string;
  moduleText: string;
  initialTimeSeconds: number;
  onTimeExpired: () => void;
  onOpenDirections: () => void;
  isPaused?: boolean;
}

export const BluebookHeader: React.FC<BluebookHeaderProps> = ({
  sectionTitle,
  moduleText,
  initialTimeSeconds,
  onTimeExpired,
  onOpenDirections,
  isPaused = false
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(initialTimeSeconds);
  const [isTimerHidden, setIsTimerHidden] = useState(false);
  const [showFiveMinWarning, setShowFiveMinWarning] = useState(false);

  useEffect(() => {
    setSecondsRemaining(initialTimeSeconds);
  }, [initialTimeSeconds]);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeExpired();
          return 0;
        }
        if (prev === 300) {
          setShowFiveMinWarning(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, onTimeExpired]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  const isUrgent = secondsRemaining <= 300; // 5 mins or less

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 px-4 py-2.5 flex items-center justify-between select-none relative z-30">
      {/* Left: Section and Module Info */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <span className="text-xs text-slate-400 font-medium tracking-wide">SECTION</span>
          <h1 className="text-sm sm:text-base font-bold text-white leading-tight">
            {sectionTitle}: <span className="text-blue-400 font-semibold">{moduleText}</span>
          </h1>
        </div>
        <button
          onClick={onOpenDirections}
          className="ml-2 flex items-center gap-1 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 px-2.5 py-1.5 rounded-md transition-colors border border-slate-700"
        >
          <span>Directions</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center: Official Bluebook Timer */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2">
          {isTimerHidden ? (
            <div className="text-sm font-semibold text-slate-400 tracking-wider">
              --:--
            </div>
          ) : (
            <div className={`text-base sm:text-lg font-bold font-mono tracking-wider ${
              isUrgent ? 'text-red-400 animate-pulse' : 'text-white'
            }`}>
              {timeFormatted}
            </div>
          )}
          <button
            onClick={() => setIsTimerHidden(!isTimerHidden)}
            className="text-xs text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
            title={isTimerHidden ? "Tampilkan Waktu" : "Sembunyikan Waktu"}
          >
            {isTimerHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>
        <button
          onClick={() => setIsTimerHidden(!isTimerHidden)}
          className="text-[10px] text-slate-400 hover:text-slate-200 tracking-wide uppercase font-medium"
        >
          {isTimerHidden ? 'Show' : 'Hide'}
        </button>
      </div>

      {/* Right: College Board Bluebook Emblem */}
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <div className="text-xs font-semibold text-slate-200">MoSAT Exam Mode</div>
          <div className="text-[10px] text-slate-400">Digital SAT Environment</div>
        </div>
        <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-700 to-indigo-900 border border-blue-500/30 flex items-center justify-center font-bold text-xs text-white shadow-sm">
          SAT
        </div>
      </div>

      {/* 5-minute warning banner */}
      {showFiveMinWarning && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-amber-500 text-slate-950 font-bold text-xs px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2 animate-bounce z-50">
          <span>⚠️ 5 menit tersisa di modul ini!</span>
          <button 
            onClick={() => setShowFiveMinWarning(false)}
            className="text-slate-900 hover:text-black font-extrabold ml-1"
          >
            ✕
          </button>
        </div>
      )}
    </header>
  );
};
