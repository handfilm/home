import React from 'react';
import { EasingType } from '../types';
import { EASING_OPTIONS } from '../data/initialData';
import { Sliders, X } from 'lucide-react';

interface SpeedConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  speed: number;
  setSpeed: (speed: number) => void;
  easing: EasingType;
  setEasing: (easing: EasingType) => void;
}

export default function SpeedConsole({
  isOpen,
  onClose,
  speed,
  setSpeed,
  easing,
  setEasing,
}: SpeedConsoleProps) {
  if (!isOpen) return null;

  return (
    <div
      id="rx-console"
      className="fixed bottom-0 left-0 right-0 z-[95] bg-[#0a0a0a]/95 border-t border-[#f3efe6]/15 px-6 py-3.5 backdrop-blur-lg flex flex-wrap items-center justify-between gap-4 font-mono text-xs shadow-2xl transition-all"
    >
      {/* Speed Slider */}
      <div className="flex items-center gap-4">
        <span className="text-[10px] tracking-[0.2em] uppercase text-[#f3efe6]/50">
          Transition Speed
        </span>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="1"
            max="20"
            step="1"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-28 sm:w-36 h-1 bg-[#2a2a2a] rounded-none cursor-pointer accent-[#c8b89a]"
          />
          <span className="text-[#c8b89a] font-bold min-w-[36px]">
            {(speed / 10).toFixed(1)}s
          </span>
        </div>
      </div>

      {/* Easing Options */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] tracking-[0.2em] uppercase text-[#f3efe6]/50 mr-2">
          Easing:
        </span>
        {EASING_OPTIONS.map((opt) => {
          const isSelected = easing === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setEasing(opt.id)}
              className={`px-3 py-1 text-[10px] uppercase tracking-widest border rounded transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#c8b89a] text-[#c8b89a] bg-[#c8b89a]/10 font-bold'
                  : 'border-[#2a2a2a] text-[#f3efe6]/50 hover:text-[#f3efe6] hover:border-[#f3efe6]/30'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="text-[#f3efe6]/50 hover:text-[#f3efe6] flex items-center gap-1 cursor-pointer ml-auto"
      >
        <X className="w-3.5 h-3.5" />
        <span className="text-[10px] uppercase tracking-wider">Close</span>
      </button>
    </div>
  );
}
