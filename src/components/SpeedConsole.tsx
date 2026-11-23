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
      className="fixed bottom-0 left-0 right-0 z-[95] border-t px-6 py-3.5 backdrop-blur-lg flex flex-wrap items-center justify-between gap-4 font-mono text-xs shadow-2xl transition-all hh-theme-transition"
      style={{
        backgroundColor: 'var(--hh-header-bg)',
        borderColor: 'var(--hh-border)',
        color: 'var(--hh-text)',
      }}
    >
      {/* Speed Slider */}
      <div className="flex items-center gap-4">
        <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: 'var(--hh-muted)' }}>
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
            className="w-28 sm:w-36 h-1 rounded-none cursor-pointer"
            style={{
              backgroundColor: 'var(--hh-border)',
              accentColor: 'var(--hh-accent)',
            }}
          />
          <span className="font-bold min-w-[36px] tabular-nums" style={{ color: 'var(--hh-accent)' }}>
            {(speed / 10).toFixed(1)}s
          </span>
        </div>
      </div>

      {/* Easing Options */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] tracking-[0.2em] uppercase mr-2" style={{ color: 'var(--hh-muted)' }}>
          Easing:
        </span>
        {EASING_OPTIONS.map((opt) => {
          const isSelected = easing === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setEasing(opt.id)}
              className="px-3 py-1 text-[10px] uppercase tracking-widest border rounded transition-all cursor-pointer"
              style={{
                backgroundColor: isSelected ? 'var(--hh-accent)' : 'var(--hh-surface)',
                borderColor: isSelected ? 'var(--hh-accent)' : 'var(--hh-border)',
                color: isSelected ? 'var(--hh-accent-ink)' : 'var(--hh-muted)',
                fontWeight: isSelected ? 700 : 500,
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="flex items-center gap-1 cursor-pointer ml-auto opacity-75 hover:opacity-100 transition-opacity"
        style={{ color: 'var(--hh-text)' }}
      >
        <X className="w-3.5 h-3.5" />
        <span className="text-[10px] uppercase tracking-wider">Close</span>
      </button>
    </div>
  );
}
