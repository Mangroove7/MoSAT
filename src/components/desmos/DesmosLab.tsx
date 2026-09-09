import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, RotateCcw, Copy, Check, BookOpen, Layers, Maximize2 } from 'lucide-react';

export const DesmosLab: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const calculatorRef = useRef<any>(null);
  const [copiedPreset, setCopiedPreset] = useState<string | null>(null);

  useEffect(() => {
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

      // Default sample formula for quadratic
      calculatorRef.current.setExpression({ id: 'f1', latex: 'y=x^2-4x+3' });
      calculatorRef.current.setExpression({ id: 'f2', latex: 'y=2x-6' });
    }

    return () => {
      if (calculatorRef.current) {
        calculatorRef.current.destroy();
        calculatorRef.current = null;
      }
    };
  }, []);

  const handleApplyPreset = (presetName: string) => {
    if (!calculatorRef.current) return;
    calculatorRef.current.setBlank();

    if (presetName === 'linear_reg') {
      calculatorRef.current.setExpression({ id: 'table_x', latex: 'x_1=[2, 4, 6, 8]' });
      calculatorRef.current.setExpression({ id: 'table_y', latex: 'y_1=[5, 11, 17, 23]' });
      calculatorRef.current.setExpression({ id: 'reg', latex: 'y_1\\sim m x_1+b' });
    } else if (presetName === 'quadratic_reg') {
      calculatorRef.current.setExpression({ id: 'table_x', latex: 'x_1=[-1, 0, 1, 2, 3]' });
      calculatorRef.current.setExpression({ id: 'table_y', latex: 'y_1=[3, 0, -1, 0, 3]' });
      calculatorRef.current.setExpression({ id: 'reg', latex: 'y_1\\sim a x_1^2+b x_1+c' });
    } else if (presetName === 'tangent_slider') {
      calculatorRef.current.setExpression({ id: 'f', latex: 'y=x^2+8x+a' });
      calculatorRef.current.setExpression({ id: 'line', latex: 'y=-1.5' });
      calculatorRef.current.setExpression({ id: 'slider', latex: 'a=14.5', sliderBounds: { min: '-10', max: '25', step: '0.1' } });
    } else if (presetName === 'circle') {
      calculatorRef.current.setExpression({ id: 'circle_eq', latex: '(x-4)^2+(y+1)^2=36' });
      calculatorRef.current.setExpression({ id: 'center', latex: '(4, -1)' });
    } else if (presetName === 'vertex_form') {
      calculatorRef.current.setExpression({ id: 'vertex', latex: 'y=a(x-h)^2+k' });
      calculatorRef.current.setExpression({ id: 'a', latex: 'a=1', sliderBounds: { min: '-5', max: '5', step: '0.5' } });
      calculatorRef.current.setExpression({ id: 'h', latex: 'h=3', sliderBounds: { min: '-10', max: '10', step: '1' } });
      calculatorRef.current.setExpression({ id: 'k', latex: 'k=-4', sliderBounds: { min: '-10', max: '10', step: '1' } });
    }
  };

  const handleReset = () => {
    if (calculatorRef.current) {
      calculatorRef.current.setBlank();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 overflow-hidden select-none">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between border-b border-slate-800 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-sm shadow-md">
            D
          </div>
          <div>
            <h1 className="text-sm font-bold flex items-center gap-2">
              <span>Desmos Graphing Lab (SAT Suite Edition)</span>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                Official API Active
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">
              Uji coba grafik, sistem persamaan, dan template regresi khusus soal SAT Math
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-slate-300 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Lembar Kerja</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: The Desmos Canvas */}
        <div className="flex-1 bg-white h-full relative">
          <div ref={containerRef} className="w-full h-full min-h-[500px]" />
        </div>

        {/* Right: SAT Preset Toolbox */}
        <div className="w-full lg:w-80 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 p-5 overflow-y-auto space-y-5 shadow-sm">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Template Formula SAT Cepat
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Klik template untuk langsung diplot di Desmos:
            </p>
          </div>

          <div className="space-y-3">
            {/* Linear Regression */}
            <div className="p-3 bg-slate-50 hover:bg-blue-50/50 rounded-xl border border-slate-200 transition-all">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-slate-900">Regresi Linear</span>
                <span className="text-[10px] font-mono text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded font-bold">y1 ~ mx1+b</span>
              </div>
              <p className="text-[11px] text-slate-600 mb-2">
                Hitung gradien m dan titik potong b dari data tabel koordinat.
              </p>
              <button
                onClick={() => handleApplyPreset('linear_reg')}
                className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm"
              >
                Muat ke Desmos
              </button>
            </div>

            {/* Quadratic Regression */}
            <div className="p-3 bg-slate-50 hover:bg-blue-50/50 rounded-xl border border-slate-200 transition-all">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-slate-900">Regresi Kuadratik</span>
                <span className="text-[10px] font-mono text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded font-bold">y1 ~ ax1²+bx1+c</span>
              </div>
              <p className="text-[11px] text-slate-600 mb-2">
                Cari persamaan parabola dari titik-titik koordinat secara instan.
              </p>
              <button
                onClick={() => handleApplyPreset('quadratic_reg')}
                className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm"
              >
                Muat ke Desmos
              </button>
            </div>

            {/* Tangent with Slider */}
            <div className="p-3 bg-slate-50 hover:bg-blue-50/50 rounded-xl border border-slate-200 transition-all">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-slate-900">Konstanta & Slider (a/k)</span>
                <span className="text-[10px] font-mono text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded font-bold">1 Solusi / Singgung</span>
              </div>
              <p className="text-[11px] text-slate-600 mb-2">
                Sistem parabola dan garis: geser nilai slider hingga kedua kurva bersinggungan.
              </p>
              <button
                onClick={() => handleApplyPreset('tangent_slider')}
                className="w-full py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm"
              >
                Muat ke Desmos
              </button>
            </div>

            {/* Circle */}
            <div className="p-3 bg-slate-50 hover:bg-blue-50/50 rounded-xl border border-slate-200 transition-all">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-slate-900">Persamaan Lingkaran</span>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-bold">(x-h)²+(y-k)²=r²</span>
              </div>
              <p className="text-[11px] text-slate-600 mb-2">
                Gambar lingkaran dan plot pusat (h, k) untuk mencari radius r.
              </p>
              <button
                onClick={() => handleApplyPreset('circle')}
                className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm"
              >
                Muat ke Desmos
              </button>
            </div>

            {/* Vertex Form */}
            <div className="p-3 bg-slate-50 hover:bg-blue-50/50 rounded-xl border border-slate-200 transition-all">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-slate-900">Bentuk Puncak (Vertex)</span>
                <span className="text-[10px] font-mono text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded font-bold">y = a(x-h)² + k</span>
              </div>
              <p className="text-[11px] text-slate-600 mb-2">
                Titik puncak (h, k). Geser nilai h dan k untuk mencocokkan titik ekstrim.
              </p>
              <button
                onClick={() => handleApplyPreset('vertex_form')}
                className="w-full py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm"
              >
                Muat ke Desmos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
