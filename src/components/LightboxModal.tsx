import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';

export interface LightboxItem {
  url: string;
  tag?: string;
  title?: string;
}

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: LightboxItem[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

export default function LightboxModal({
  isOpen,
  onClose,
  items,
  currentIndex,
  onNavigate,
}: LightboxModalProps) {
  const [controlsVisible, setControlsVisible] = useState(true);

  const total = items.length;
  const currentItem = items[currentIndex] || items[0];

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        onNavigate((currentIndex + 1) % total);
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        onNavigate((currentIndex - 1 + total) % total);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, total, onClose, onNavigate]);

  if (!isOpen || !currentItem) return null;

  return (
    <div
      id="rx-lb"
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[130] bg-black flex items-center justify-center select-none"
    >
      {/* Fullscreen Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-500"
        style={{ backgroundImage: `url('${currentItem.url}')` }}
      />

      {/* Vignette and scanlines */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-black/80 pointer-events-none z-10" />
      <div className="rx-scanlines z-10" />

      {/* Top Bar */}
      <div
        className={`absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-6 bg-gradient-to-b from-black/85 to-transparent transition-transform duration-300 ${
          controlsVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#c8b89a]/70">
          RAWx · Master OS Lightbox
        </span>
        <button
          onClick={onClose}
          className="w-10 h-10 bg-[#050505]/80 border border-[#f3efe6]/10 text-[#c8b89a] hover:text-[#f3efe6] flex items-center justify-center font-mono text-xs cursor-pointer rounded"
        >
          ESC
        </button>
      </div>

      {/* Prev / Next Arrows */}
      <button
        onClick={() => onNavigate((currentIndex - 1 + total) % total)}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full bg-black/60 border border-[#f3efe6]/20 text-[#c8b89a] hover:text-white flex items-center justify-center cursor-pointer transition-all hover:scale-110"
        aria-label="Previous Slide"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <button
        onClick={() => onNavigate((currentIndex + 1) % total)}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full bg-black/60 border border-[#f3efe6]/20 text-[#c8b89a] hover:text-white flex items-center justify-center cursor-pointer transition-all hover:scale-110"
        aria-label="Next Slide"
      >
        <ArrowRight className="w-5 h-5" />
      </button>

      {/* Bottom Info Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-30 flex items-end justify-between p-8 bg-gradient-to-t from-black/95 to-transparent transition-transform duration-300 ${
          controlsVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
      >
        <div>
          {currentItem.tag && (
            <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#c8b89a] block mb-1">
              [ {currentItem.tag} ]
            </span>
          )}
          <h2 className="serif-display italic text-2xl sm:text-4xl text-white">
            {currentItem.title || 'Slide Frame'}
          </h2>
        </div>

        <div className="text-right font-mono">
          <span className="text-3xl sm:text-5xl font-bold text-[#c8b89a]/20 leading-none block">
            {String(currentIndex + 1).padStart(2, '0')}
          </span>
          <span className="text-[10px] text-[#f3efe6]/40 tracking-widest uppercase">
            / {String(total).padStart(2, '0')} LIGHTBOX
          </span>
        </div>
      </div>

      {/* Bottom Thumb Strip */}
      <div className="absolute bottom-3 left-0 right-0 z-40 flex items-center justify-center gap-1.5 px-4 overflow-x-auto">
        {items.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onNavigate(idx)}
            className={`w-10 h-6 rounded-sm bg-cover bg-center border-b-2 transition-all cursor-pointer ${
              idx === currentIndex
                ? 'opacity-100 border-[#c8b89a] scale-110'
                : 'opacity-30 border-transparent hover:opacity-75'
            }`}
            style={{ backgroundImage: `url('${item.url}')` }}
          />
        ))}
      </div>
    </div>
  );
}
