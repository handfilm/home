import React from 'react';
import { SectionItem } from '../types';
import { ExternalLink, Layers, ArrowRight, Sparkles } from 'lucide-react';

interface IndexOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  sections: SectionItem[];
  onSelectSection: (index: number) => void;
  onOpenSectionManager: () => void;
  onOpenSliders?: () => void;
}

export default function IndexOverlay({
  isOpen,
  onClose,
  sections,
  onSelectSection,
  onOpenSectionManager,
  onOpenSliders,
}: IndexOverlayProps) {
  if (!isOpen) return null;

  return (
    <div
      id="indexOverlay"
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[110] bg-[#0e0d0b]/98 backdrop-blur-lg flex items-center justify-center p-6 transition-all duration-500 overflow-y-auto"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 sm:top-8 right-6 sm:right-10 text-[#f3efe6] font-mono text-[11px] tracking-[0.14em] uppercase flex items-center gap-2 hover:opacity-75 transition-opacity cursor-pointer"
      >
        <span>CLOSE</span>
        <span>✕</span>
      </button>

      {/* Index Content Container */}
      <div className="w-full max-w-3xl space-y-6 my-auto">
        <div className="flex items-center justify-between border-b border-[#f3efe6]/15 pb-4">
          <div className="font-mono text-[11px] sm:text-[12px] text-[#f3efe6]/60 tracking-[0.2em] uppercase">
            MASTER INDEX — ALL ECOSYSTEM SECTIONS &amp; ENGINES
          </div>
          <button
            onClick={onOpenSectionManager}
            className="text-[11px] font-mono text-emerald-400 hover:underline uppercase cursor-pointer"
          >
            + Add Website
          </button>
        </div>

        {/* Featured RAWx 16 Sliders Engine Banner */}
        {onOpenSliders && (
          <div
            onClick={() => {
              onOpenSliders();
              onClose();
            }}
            className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-amber-950/40 via-[#161512] to-amber-950/20 border border-amber-500/40 hover:border-amber-400 cursor-pointer group transition-all duration-300 shadow-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono tracking-widest text-amber-400 uppercase font-bold">
                    FEATURED ENGINE
                  </span>
                  <span className="text-[9px] bg-amber-400 text-black px-1.5 py-0.2 rounded font-bold uppercase">
                    16 Types
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold uppercase text-[#f3efe6] tracking-tight group-hover:text-amber-300 transition-colors">
                  RAWx Master OS · Ultra Slider System v3.0
                </h3>
                <p className="text-xs text-[#f3efe6]/60 font-mono mt-0.5">
                  21:9 Hero · Matrix · 32:9 Ultra · Zoom-Burst · Inertia · Countdown · Wipes
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold group-hover:translate-x-1 transition-transform">
              <span>EXPLORE</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        )}

        <div className="space-y-1 divide-y divide-[#f3efe6]/10">
          {sections.map((sec, idx) => (
            <div
              key={sec.id}
              onClick={() => {
                onSelectSection(idx);
                onClose();
              }}
              className="group flex items-center justify-between py-4 sm:py-5 px-2 hover:px-4 rounded-lg cursor-pointer transition-all duration-300 hover:bg-[#f3efe6]/5"
            >
              <div className="flex items-center gap-4 sm:gap-6">
                <span className="font-mono text-sm sm:text-base text-[#f3efe6]/40 group-hover:text-[#f3efe6] transition-colors">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                {sec.imageUrl && (
                  <div
                    className="w-12 h-8 rounded bg-cover bg-center border border-[#f3efe6]/20 group-hover:border-[#f3efe6]/60 transition-all flex-shrink-0"
                    style={{ backgroundImage: `url('${sec.imageUrl}')` }}
                  />
                )}
                <span
                  className="text-xl sm:text-3xl font-bold uppercase tracking-tight text-[#f3efe6] group-hover:translate-x-3 transition-transform duration-300"
                  style={{
                    color: sec.accent ? undefined : '#f3efe6',
                  }}
                >
                  {sec.title}
                </span>
              </div>

              <div className="flex items-center gap-4 font-mono text-[11px] text-[#f3efe6]/50">
                <span className="hidden sm:inline-block">{sec.url}</span>
                <ArrowRight className="w-4 h-4 text-[#f3efe6]/40 group-hover:text-[#f3efe6] group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-[#f3efe6]/10 flex flex-wrap items-center justify-between font-mono text-[10.5px] text-[#f3efe6]/40 uppercase">
          <span>Hands &amp; Head Digital Platform</span>
          <span>Press ESC or click outside to close</span>
        </div>
      </div>
    </div>
  );
}
