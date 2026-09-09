import React, { useEffect, useRef, useState } from 'react';
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

  // Coordinates for dragging (default: placed on upper-right quadrant)
  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    const defaultX = typeof window !== 'undefined' ? Math.max(20, window.innerWidth - 560) : 100;
    const defaultY = 65;
    return { x: defaultX, y: defaultY };
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initialPosX: number; initialPosY: number }>({
    startX: 0,
    startY: 0,
    initialPosX: 0,
    initialPosY: 0
  });

  // Initialize Desmos Calculator
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
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
      } else if (calculatorRef.current) {
        calculatorRef.current.resize();
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [isOpen, initialPreset, isMinimized, isExpanded]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (calculatorRef.current) {
        calculatorRef.current.destroy();
        calculatorRef.current = null;
      }
    };
  }, []);

  // Handle Dragging
  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input')) {
      return;
    }
    setIsDragging(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialPosX: position.x,
      initialPosY: position.y
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.startX;
    const deltaY = e.clientY - dragStartRef.current.startY;

    const winWidth = isExpanded ? 720 : 520;
    const winHeight = isExpanded ? 600 : 500;

    const maxX = Math.max(10, window.innerWidth - winWidth - 10);
    const maxY = Math.max(10, window.innerHeight - winHeight - 10);

    const newX = Math.min(Math.max(10, dragStartRef.current.initialPosX + deltaX), maxX);
    const newY = Math.min(Math.max(10, dragStartRef.current.initialPosY + deltaY), maxY);

    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

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
      calculatorRef.current.setExpression({ id: 'slider', latex: 'a=14.5', sliderBounds: { min: '-20', max: '30', step: '0.5' } });
    } else if (type === 'circle') {
      calculatorRef.current.setExpression({ id: 'circle1', latex: '(x-3)^2+(y+2)^2=25' });
      calculatorRef.current.setExpression({ id: 'center', latex: '(3,-2)' });
    } else if (type === 'vertex') {
      calculatorRef.current.setExpression({ id: 'quad', latex: 'f(x)=2(x-3)^2-8' });
    }
    setActiveTab('calc');
    setTimeout(() => calculatorRef.current?.resize(), 100);
  };

  if (!isOpen) return null;

  // Minimized Floating Pill Mode
  if (isMinimized) {
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
                setTimeout(() => calculatorRef.current?.resize(), 100);
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

  // Active Floating Window Mode (NO backdrop, question behind is 100% interactive!)
  const winWidth = isExpanded ? 'w-[720px]' : 'w-[520px] max-w-[94vw]';
  const winHeight = isExpanded ? 'h-[620px]' : 'h-[500px] max-h-[85vh]';

  return (
    <div 
      ref={windowRef}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      className={`fixed z-50 pointer-events-auto select-none ${winWidth} ${winHeight} flex flex-col bg-zinc-950 rounded-2xl shadow-2xl shadow-black/70 border border-zinc-700/80 overflow-hidden animate-in fade-in zoom-in-95 duration-100`}
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
          {/* Tabs */}
          <div className="flex items-center bg-zinc-900 p-0.5 rounded-lg text-[11px] font-semibold mr-1 border border-zinc-800">
            <button
              onClick={() => {
                setActiveTab('calc');
                setTimeout(() => calculatorRef.current?.resize(), 50);
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
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Preset SAT</span>
            </button>
          </div>

          <button
            onClick={handleReset}
            title="Reset Kanvas"
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsMinimized(true)}
            title="Kecilkan ke Bar Mengambang (Minimize)"
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              setIsExpanded(!isExpanded);
              setTimeout(() => calculatorRef.current?.resize(), 100);
            }}
            title={isExpanded ? "Ukuran Standar" : "Perbesar"}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onClose}
            title="Tutup Kalkulator"
            className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Calculator Body */}
      <div className="flex-1 bg-white overflow-hidden relative">
        {activeTab === 'calc' ? (
          <div 
            ref={containerRef} 
            className="w-full h-full"
          />
        ) : (
          <div className="p-4 overflow-y-auto h-full bg-zinc-50 space-y-4 text-xs">
            <div>
              <h4 className="font-bold text-zinc-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Preset Rumus Cepat SAT Math</span>
              </h4>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Klik salah satu template di bawah untuk langsung menyalin ke kalkulator Desmos.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {/* Linear Regression */}
              <div className="p-3 bg-white rounded-xl border border-zinc-200 shadow-sm flex items-center justify-between">
                <div>
                  <div className="font-bold text-zinc-900 text-xs">Regresi Linear (Tabel x1, y1)</div>
                  <div className="text-[10px] font-mono text-orange-600">y1 ~ m x1 + b</div>
                </div>
                <button
                  onClick={() => applyPreset('linear_reg')}
                  className="px-3 py-1.5 bg-orange-50 hover:bg-orange-600 hover:text-white text-orange-700 text-xs font-bold rounded-lg transition-colors"
                >
                  Terapkan
                </button>
              </div>

              {/* Systems of Equations with Slider */}
              <div className="p-3 bg-white rounded-xl border border-zinc-200 shadow-sm flex items-center justify-between">
                <div>
                  <div className="font-bold text-zinc-900 text-xs">Sistem Persamaan & Slider Konstanta</div>
                  <div className="text-[10px] font-mono text-orange-600">y = x^2 + 8x + a (Titik Singgung)</div>
                </div>
                <button
                  onClick={() => applyPreset('systems')}
                  className="px-3 py-1.5 bg-orange-50 hover:bg-orange-600 hover:text-white text-orange-700 text-xs font-bold rounded-lg transition-colors"
                >
                  Terapkan
                </button>
              </div>

              {/* Quadratic Regression */}
              <div className="p-3 bg-white rounded-xl border border-zinc-200 shadow-sm flex items-center justify-between">
                <div>
                  <div className="font-bold text-zinc-900 text-xs">Regresi Parabola Kuadratik</div>
                  <div className="text-[10px] font-mono text-orange-600">y1 ~ a x1^2 + b x1 + c</div>
                </div>
                <button
                  onClick={() => applyPreset('quadratic_reg')}
                  className="px-3 py-1.5 bg-orange-50 hover:bg-orange-600 hover:text-white text-orange-700 text-xs font-bold rounded-lg transition-colors"
                >
                  Terapkan
                </button>
              </div>

              {/* Circles */}
              <div className="p-3 bg-white rounded-xl border border-zinc-200 shadow-sm flex items-center justify-between">
                <div>
                  <div className="font-bold text-zinc-900 text-xs">Persamaan Lingkaran & Titik Pusat</div>
                  <div className="text-[10px] font-mono text-orange-600">(x-h)^2 + (y-k)^2 = r^2</div>
                </div>
                <button
                  onClick={() => applyPreset('circle')}
                  className="px-3 py-1.5 bg-orange-50 hover:bg-orange-600 hover:text-white text-orange-700 text-xs font-bold rounded-lg transition-colors"
                >
                  Terapkan
                </button>
              </div>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-[11px] text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                <span>Tips Floating Desmos:</span>
              </div>
              <p>• Geser header kalkulator ke sisi kanan agar soal di sebelah kiri tetap bebas dibaca dan diklik.</p>
              <p>• Gunakan tombol minimize (-) untuk melipat kalkulator sementara saat membaca bacaan panjang.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
