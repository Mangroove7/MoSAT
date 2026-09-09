import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  X, 
  Minus, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Sparkles, 
  BookOpen, 
  GripHorizontal 
} from 'lucide-react';

interface DesmosModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPreset?: string;
}

export const DesmosModal: React.FC<DesmosModalProps> = ({ isOpen, onClose, initialPreset }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const calculatorRef = useRef<any>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  // Floating window states
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'calc' | 'presets'>('calc');

  // Coordinates for dragging
  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    const defaultX = typeof window !== 'undefined' ? Math.max(20, window.innerWidth - 560) : 100;
    const defaultY = 65;
    return { x: defaultX, y: defaultY };
  });

  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initialPosX: number; initialPosY: number }>({
    startX: 0,
    startY: 0,
    initialPosX: 0,
    initialPosY: 0
  });
  const currentPosRef = useRef(position);
  currentPosRef.current = position;

  // Initialize Desmos Calculator IMMEDIATELY upon mount (Persistent instance)
  useEffect(() => {
    const initCalc = () => {
      if (containerRef.current && window.Desmos && !calculatorRef.current) {
        calculatorRef.current = window.Desmos.GraphingCalculator(containerRef.current, {
          keypad: true,
          graphingCalc: true,
          expressions: true,
          settingsMenu: true,
          zoomButtons: true,
          border: false,
          lockViewport: false
        });

        if (initialPreset) {
          applyPreset(initialPreset);
        }
      }
    };

    if (window.Desmos) {
      initCalc();
    } else {
      const checkTimer = setInterval(() => {
        if (window.Desmos) {
          initCalc();
          clearInterval(checkTimer);
        }
      }, 50);
      return () => clearInterval(checkTimer);
    }
  }, []);

  // When isOpen or size changes, trigger instant resize
  useEffect(() => {
    if (isOpen && calculatorRef.current) {
      // 0ms instant resize
      requestAnimationFrame(() => {
        calculatorRef.current?.resize();
      });
    }
  }, [isOpen, isMinimized, isExpanded, activeTab]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (calculatorRef.current) {
        calculatorRef.current.destroy();
        calculatorRef.current = null;
      }
    };
  }, []);

  // Hardware-accelerated GPU Dragging without React re-render lag
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input')) {
      return;
    }
    isDraggingRef.current = true;
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialPosX: currentPosRef.current.x,
      initialPosY: currentPosRef.current.y
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current || !windowRef.current) return;
    const deltaX = e.clientX - dragStartRef.current.startX;
    const deltaY = e.clientY - dragStartRef.current.startY;

    const winWidth = isExpanded ? 720 : 520;
    const winHeight = isExpanded ? 600 : 500;
    const maxX = Math.max(10, window.innerWidth - winWidth - 10);
    const maxY = Math.max(10, window.innerHeight - winHeight - 10);

    const newX = Math.min(Math.max(10, dragStartRef.current.initialPosX + deltaX), maxX);
    const newY = Math.min(Math.max(10, dragStartRef.current.initialPosY + deltaY), maxY);

    // Direct DOM transform update for 120fps smooth movement
    windowRef.current.style.left = `${newX}px`;
    windowRef.current.style.top = `${newY}px`;
  }, [isExpanded]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    if (windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect();
      setPosition({ x: rect.left, y: rect.top });
    }
  }, []);

  const handleReset = () => {
    if (calculatorRef.current) {
      calculatorRef.current.setBlank();
    }
  };

  const applyPreset = (type: string) => {
    if (!calculatorRef.current) return;
    calculatorRef.current.setBlank();

    if (type === 'linear_reg') {
      calculatorRef.current.setExpression({ id: 'table1', latex: 'x_1=[1,2,3,4,5]' });
      calculatorRef.current.setExpression({ id: 'table2', latex: 'y_1=[3,5,7,9,11]' });
      calculatorRef.current.setExpression({ id: 'reg', latex: 'y_1\\sim m x_1+b' });
    } else if (type === 'quadratic_reg') {
      calculatorRef.current.setExpression({ id: 'table1', latex: 'x_1=[-2,-1,0,1,2]' });
      calculatorRef.current.setExpression({ id: 'table2', latex: 'y_1=[4,1,0,1,4]' });
      calculatorRef.current.setExpression({ id: 'reg', latex: 'y_1\\sim a x_1^2+b x_1+c' });
    } else if (type === 'systems') {
      calculatorRef.current.setExpression({ id: 'eq1', latex: 'y=-1.5' });
      calculatorRef.current.setExpression({ id: 'eq2', latex: 'y=x^2+8x+a' });
    } else if (type === 'circle') {
      calculatorRef.current.setExpression({ id: 'circle', latex: '(x-3)^2+(y+2)^2=25' });
    } else if (type === 'vertex') {
      calculatorRef.current.setExpression({ id: 'quad', latex: 'f(x)=2(x-3)^2-8' });
    }
    setActiveTab('calc');
    requestAnimationFrame(() => calculatorRef.current?.resize());
  };

  // Minimized Floating Pill Mode
  if (isMinimized && isOpen) {
    return (
      <div 
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
        className="fixed z-50 pointer-events-auto select-none animate-in fade-in zoom-in-95"
      >
        <div 
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="flex items-center gap-2.5 px-3.5 py-2 bg-zinc-950/95 hover:bg-zinc-900 border border-orange-500/40 text-white rounded-2xl shadow-2xl shadow-black/50 cursor-grab active:cursor-grabbing transition-all backdrop-blur-md"
        >
          <GripHorizontal className="w-3.5 h-3.5 text-zinc-500" />
          <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center font-black text-[10px] text-zinc-950">
            D
          </div>
          <span className="text-xs font-bold text-orange-400">Desmos Calculator</span>
          <div className="flex items-center gap-1 ml-2 border-l border-zinc-800 pl-2">
            <button
              onClick={() => {
                setIsMinimized(false);
                requestAnimationFrame(() => calculatorRef.current?.resize());
              }}
              className="p-1 hover:text-amber-400 text-zinc-400 transition-colors"
              title="Perbesar Jendela"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:text-rose-400 text-zinc-400 transition-colors"
              title="Tutup"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const winWidth = isExpanded ? 'w-[720px]' : 'w-[520px] max-w-[94vw]';
  const winHeight = isExpanded ? 'h-[620px]' : 'h-[500px] max-h-[85vh]';

  // Persistent floating container: Hidden via CSS when not open, zero initialization delay!
  return (
    <div 
      ref={windowRef}
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        display: isOpen && !isMinimized ? 'flex' : 'none'
      }}
      className={`fixed z-50 pointer-events-auto select-none ${winWidth} ${winHeight} flex-col bg-zinc-950 rounded-2xl shadow-2xl shadow-black/70 border border-zinc-700/80 overflow-hidden animate-in fade-in zoom-in-95 duration-75`}
    >
      {/* Draggable Header Bar */}
      <div 
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="bg-zinc-950 text-white px-3.5 py-2.5 flex items-center justify-between border-b border-zinc-800 cursor-grab active:cursor-grabbing select-none shrink-0"
      >
        <div className="flex items-center gap-2">
          <GripHorizontal className="w-4 h-4 text-zinc-500" />
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center font-black text-xs text-zinc-950 shadow-md shadow-orange-500/20">
            D
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5 leading-none">
              <span>Desmos Graphing</span>
              <span className="text-[9px] uppercase font-extrabold bg-orange-500/20 text-orange-400 border border-orange-500/30 px-1 py-0.2 rounded">
                Official SAT
              </span>
            </div>
          </div>
        </div>

        {/* Window Controls */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-zinc-900 p-0.5 rounded-lg text-[11px] font-semibold mr-1 border border-zinc-800">
            <button
              onClick={() => {
                setActiveTab('calc');
                requestAnimationFrame(() => calculatorRef.current?.resize());
              }}
              className={`px-2 py-1 rounded-md transition-all ${
                activeTab === 'calc' 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Kalkulator
            </button>
            <button
              onClick={() => setActiveTab('presets')}
              className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 ${
                activeTab === 'presets' 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Shortcut</span>
            </button>
          </div>

          <button
            onClick={handleReset}
            className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
            title="Reset Papan Grafik"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
            title="Minimize ke Floating Pill"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              setIsExpanded(!isExpanded);
              requestAnimationFrame(() => calculatorRef.current?.resize());
            }}
            className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
            title={isExpanded ? "Ukuran Standar" : "Perbesar Penuh"}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-rose-950/60 rounded-lg text-zinc-400 hover:text-rose-400 transition-colors"
            title="Tutup Jendela"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 relative bg-white overflow-hidden flex flex-col">
        {/* Desmos Iframe Container */}
        <div 
          ref={containerRef} 
          className={`w-full h-full flex-1 ${activeTab === 'calc' ? 'block' : 'hidden'}`}
        />

        {/* SAT Presets / Shortcut Panel */}
        {activeTab === 'presets' && (
          <div className="absolute inset-0 bg-zinc-950 p-4 overflow-y-auto space-y-3 z-10 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="font-bold text-amber-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                Template Trik Desmos Digital SAT
              </span>
              <span className="text-[11px] text-zinc-400">Klik template untuk langsung memasukkan rumus</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              <button
                onClick={() => applyPreset('linear_reg')}
                className="p-3 bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 rounded-xl text-left transition-colors group"
              >
                <div className="font-bold text-white group-hover:text-amber-400">Regresi Linier Otomatis (y1 ~ mx1 + b)</div>
                <div className="text-[11px] text-zinc-400 mt-1 font-mono">y_1 ~ m*x_1 + b</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">Mencari gradien m dan konstanta b dari tabel titik koordinat tanpa rumus manual.</div>
              </button>

              <button
                onClick={() => applyPreset('quadratic_reg')}
                className="p-3 bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 rounded-xl text-left transition-colors group"
              >
                <div className="font-bold text-white group-hover:text-amber-400">Regresi Kuadratik (y1 ~ ax1^2 + bx1 + c)</div>
                <div className="text-[11px] text-zinc-400 mt-1 font-mono">y_1 ~ a*x_1^2 + b*x_1 + c</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">Menemukan fungsi kuadrat dari 3 titik data secara instan.</div>
              </button>

              <button
                onClick={() => applyPreset('systems')}
                className="p-3 bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 rounded-xl text-left transition-colors group"
              >
                <div className="font-bold text-white group-hover:text-amber-400">Sistem Persamaan & Slider Nilai a</div>
                <div className="text-[11px] text-zinc-400 mt-1 font-mono">y = -1.5, y = x^2 + 8x + a</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">Mencari nilai konstanta a agar sistem memiliki tepat satu solusi (titik singgung).</div>
              </button>

              <button
                onClick={() => applyPreset('circle')}
                className="p-3 bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 rounded-xl text-left transition-colors group"
              >
                <div className="font-bold text-white group-hover:text-amber-400">Persamaan Lingkaran & Radius</div>
                <div className="text-[11px] text-zinc-400 mt-1 font-mono">(x - h)^2 + (y - k)^2 = r^2</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">Visualisasi pusat lingkaran (h, k) dan jari-jari r untuk soal geometri koordinat.</div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
