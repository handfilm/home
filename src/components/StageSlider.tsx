import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SectionItem } from '../types';
import { ArrowLeft, ArrowRight, ExternalLink, Plus, Sparkles, CheckSquare } from 'lucide-react';

interface StageSliderProps {
  sections: SectionItem[];
  currentSectionIndex: number;
  setCurrentSectionIndex: (idx: number) => void;
  onSetCursorLabel: (label: string) => void;
  onOpenSectionManager: () => void;
  onOpenTasksForSection: (sectionId: string) => void;
  sectionTasksCount: Record<string, number>;
}

export default function StageSlider({
  sections,
  currentSectionIndex,
  setCurrentSectionIndex,
  onSetCursorLabel,
  onOpenSectionManager,
  onOpenTasksForSection,
  sectionTasksCount,
}: StageSliderProps) {
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const total = sections.length;
  const currentSection = sections[currentSectionIndex] || sections[0];

  const goTo = useCallback(
    (index: number) => {
      let next = index;
      if (next < 0) next = total - 1;
      if (next >= total) next = 0;
      setCurrentSectionIndex(next);
    },
    [total, setCurrentSectionIndex]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if typing in an input or modal is open
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === 'ArrowRight') {
        goTo(currentSectionIndex + 1);
      } else if (e.key === 'ArrowLeft') {
        goTo(currentSectionIndex - 1);
      } else if (e.key === 'Home') {
        goTo(0);
      } else if (e.key === 'End') {
        goTo(total - 1);
      } else if (e.key === 'Enter') {
        if (currentSection?.dest) {
          window.open(currentSection.dest, '_blank', 'noopener');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSectionIndex, goTo, total, currentSection]);

  // Mouse wheel navigation
  useEffect(() => {
    let wheelLock = false;
    const handleWheel = (e: WheelEvent) => {
      if (window.innerWidth <= 780) return;
      if (wheelLock) return;
      if (Math.abs(e.deltaY) < 16 && Math.abs(e.deltaX) < 16) return;

      wheelLock = true;
      if (e.deltaY > 0 || e.deltaX > 0) {
        goTo(currentSectionIndex + 1);
      } else {
        goTo(currentSectionIndex - 1);
      }
      setTimeout(() => {
        wheelLock = false;
      }, 600);
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [currentSectionIndex, goTo]);

  const handleActivate = (s: SectionItem) => {
    if (s.dest) {
      window.open(s.dest, '_blank', 'noopener');
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-65px)] mt-[65px] overflow-hidden bg-[#0e0d0b]">
      {/* Side Navigation Rail */}
      <nav
        className="fixed right-6 sm:right-10 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-3.5 items-end font-mono text-[10px] tracking-[0.14em] uppercase"
        aria-label="Section Navigation Rail"
      >
        {sections.map((s, idx) => {
          const isActive = idx === currentSectionIndex;
          const pendingCount = sectionTasksCount[s.id] || 0;
          return (
            <button
              key={s.id}
              onClick={() => goTo(idx)}
              onMouseEnter={() => onSetCursorLabel(`VIEW ${s.title}`)}
              className={`flex items-center gap-3 py-1 cursor-pointer transition-all duration-300 group ${
                isActive ? 'text-[#f3efe6] font-bold' : 'text-[#f3efe6]/40 hover:text-[#f3efe6]'
              }`}
            >
              {pendingCount > 0 && (
                <span className="text-[8px] bg-[#b14a26] text-white px-1.5 py-0.2 rounded-full">
                  {pendingCount}
                </span>
              )}
              <span>{s.title}</span>
              <span
                className="h-[1px] transition-all duration-300"
                style={{
                  width: isActive ? '32px' : '16px',
                  backgroundColor: isActive ? s.accent : 'rgba(243,239,230,0.2)',
                }}
              />
            </button>
          );
        })}
        <button
          onClick={onOpenSectionManager}
          title="Add another website as section"
          className="flex items-center gap-2 py-1 mt-2 text-[#f3efe6]/40 hover:text-emerald-400 cursor-pointer text-[9px]"
        >
          <span>+ ADD SITE</span>
          <span className="w-3 h-[1px] bg-[#f3efe6]/20" />
        </button>
      </nav>

      {/* Prev / Next Floating Arrows */}
      <button
        onClick={() => goTo(currentSectionIndex - 1)}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-30 hidden sm:flex w-12 h-12 items-center justify-center rounded-full bg-[#0e0d0b]/70 border border-[#f3efe6]/15 hover:border-[#f3efe6] text-[#f3efe6]/70 hover:text-[#f3efe6] backdrop-blur-md transition-all cursor-pointer shadow-lg group"
        aria-label="Previous Section"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
      </button>

      <button
        onClick={() => goTo(currentSectionIndex + 1)}
        className="fixed right-4 sm:right-28 top-1/2 -translate-y-1/2 z-30 hidden sm:flex w-12 h-12 items-center justify-center rounded-full bg-[#0e0d0b]/70 border border-[#f3efe6]/15 hover:border-[#f3efe6] text-[#f3efe6]/70 hover:text-[#f3efe6] backdrop-blur-md transition-all cursor-pointer shadow-lg group"
        aria-label="Next Section"
      >
        <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Main Sliding Panels Container */}
      <div
        ref={stageRef}
        id="stage"
        className="relative w-full h-full flex flex-col md:flex-row transition-transform duration-700 ease-[cubic-bezier(.16,.84,.32,1)]"
        style={{
          width: window.innerWidth > 780 ? `${sections.length * 100}%` : '100%',
          transform:
            window.innerWidth > 780
              ? `translateX(-${(currentSectionIndex * 100) / sections.length}%)`
              : 'none',
        }}
        onTouchStart={(e) => {
          setTouchStartY(e.touches[0].clientY);
          setTouchStartX(e.touches[0].clientX);
        }}
        onTouchEnd={(e) => {
          if (touchStartX === null) return;
          const dx = touchStartX - e.changedTouches[0].clientX;
          if (Math.abs(dx) > 45) {
            goTo(dx > 0 ? currentSectionIndex + 1 : currentSectionIndex - 1);
          }
          setTouchStartX(null);
          setTouchStartY(null);
        }}
      >
        {sections.map((section, idx) => {
          const isActive = idx === currentSectionIndex;
          const pendingTasks = sectionTasksCount[section.id] || 0;

          return (
            <div
              key={section.id}
              onClick={() => {
                if (idx !== currentSectionIndex) {
                  goTo(idx);
                }
              }}
              onMouseEnter={() => onSetCursorLabel(`${section.cta} →`)}
              className={`relative h-full overflow-hidden transition-all duration-700 select-none ${
                window.innerWidth > 780 ? 'flex-shrink-0' : 'w-full min-h-[85vh]'
              }`}
              style={{
                width: window.innerWidth > 780 ? `${100 / sections.length}%` : '100%',
              }}
            >
              {/* Background with image or texture and zoom effect */}
              {section.imageUrl ? (
                <div
                  className={`absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-[cubic-bezier(.16,.84,.32,1)] ${
                    isActive ? 'scale-100 opacity-80' : 'scale-105 opacity-40'
                  }`}
                  style={{ backgroundImage: `url('${section.imageUrl}')` }}
                />
              ) : (
                <div
                  className={`absolute inset-0 transition-transform duration-1000 ease-[cubic-bezier(.16,.84,.32,1)] ${
                    section.tex || 'tex-d2c'
                  } ${isActive ? 'scale-100 opacity-100' : 'scale-105 opacity-60'}`}
                />
              )}

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0d0b] via-[#0e0d0b]/60 to-[#0e0d0b]/40 pointer-events-none z-10" />
              <div className="rx-scanlines z-10 opacity-30" />

              {/* Category tag top left */}
              <div className="absolute top-6 left-6 sm:left-12 z-20 font-mono text-[11px] sm:text-[12px] tracking-[0.2em] text-[#f3efe6]/70 uppercase flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: section.accent }}
                />
                <span>{section.category}</span>
                {section.isCustom && (
                  <span className="text-[9px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
                    CUSTOM
                  </span>
                )}
              </div>

              {/* Main Content Area at Bottom */}
              <div className="relative z-20 h-full flex flex-col justify-end px-6 sm:px-16 pb-20 sm:pb-24 max-w-4xl">
                {/* Eyebrow */}
                <div
                  className={`font-mono text-[11px] tracking-[0.2em] text-[#f3efe6]/60 uppercase mb-3 sm:mb-4 flex items-center gap-3 transition-all duration-500 ${
                    isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                  }`}
                >
                  <span style={{ color: section.accent }} className="font-bold">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span>/ {String(sections.length).padStart(2, '0')}</span>
                  <span>— H&amp;H ECOSYSTEM</span>
                </div>

                {/* Big Display Title */}
                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tight text-[#f3efe6] leading-[0.9] mb-4">
                  {section.title}
                </h1>

                {/* Subtitle in elegant serif font */}
                <p className="serif-display italic text-lg sm:text-2xl text-[#f3efe6]/90 mb-3 max-w-2xl font-light">
                  {section.sub}
                </p>

                {/* Description */}
                <p className="text-sm sm:text-base text-[#f3efe6]/70 max-w-xl mb-6 leading-relaxed">
                  {section.desc}
                </p>

                {/* Action Buttons Row */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 font-mono text-[11px] sm:text-[12px] tracking-wider uppercase">
                  {/* Enter destination link */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleActivate(section);
                    }}
                    className="flex items-center gap-2.5 px-5 py-3 rounded font-bold transition-all duration-300 cursor-pointer text-[#0e0d0b] shadow-lg group hover:scale-[1.02]"
                    style={{ backgroundColor: section.accent || '#f3efe6', color: '#f3efe6' }}
                  >
                    <span>{section.cta}</span>
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                  </button>

                  {/* Open Section Tasks */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenTasksForSection(section.id);
                    }}
                    className="flex items-center gap-2 px-4 py-3 bg-[#161512]/90 hover:bg-[#201e1a] text-[#f3efe6] border border-[#f3efe6]/20 hover:border-[#f3efe6]/50 rounded transition-all cursor-pointer"
                  >
                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                    <span>Manage Tasks</span>
                    {pendingTasks > 0 && (
                      <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] bg-[#b14a26] text-white font-bold">
                        {pendingTasks}
                      </span>
                    )}
                  </button>

                  <span className="hidden sm:inline-block text-[11px] text-[#f3efe6]/40 border-b border-[#f3efe6]/15 pb-0.5">
                    {section.url}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Status Strip */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-between px-6 sm:px-12 py-4 bg-[#0e0d0b]/90 border-t border-[#f3efe6]/10 backdrop-blur-md font-mono text-[11px] text-[#f3efe6]/60">
        {/* Left: Counter */}
        <div className="flex items-center gap-2 tracking-widest text-[#f3efe6]">
          <span className="font-bold text-[13px]">{String(currentSectionIndex + 1).padStart(2, '0')}</span>
          <span className="text-[#f3efe6]/40">/ {String(sections.length).padStart(2, '0')} SECTIONS</span>
        </div>

        {/* Center: Navigation Keyboard Hint */}
        <div className="hidden md:flex items-center gap-2 text-[10px] tracking-wider uppercase text-[#f3efe6]/50">
          <span className="border border-[#f3efe6]/20 px-1.5 py-0.5 rounded text-[#f3efe6]">←</span>
          <span className="border border-[#f3efe6]/20 px-1.5 py-0.5 rounded text-[#f3efe6]">→</span>
          <span>NAVIGATE</span>
          <span className="mx-2 text-[#f3efe6]/20">|</span>
          <span className="border border-[#f3efe6]/20 px-1.5 py-0.5 rounded text-[#f3efe6]">ENTER</span>
          <span>OPEN SITE</span>
        </div>

        {/* Right: Quick Jump Links */}
        <div className="flex items-center gap-4 text-[10px] tracking-wider uppercase">
          {sections.slice(0, 4).map((s, idx) => (
            <button
              key={s.id}
              onClick={() => goTo(idx)}
              className={`hover:text-[#f3efe6] transition-colors cursor-pointer ${
                idx === currentSectionIndex ? 'text-[#f3efe6] font-bold underline underline-offset-4' : ''
              }`}
            >
              {s.title}
            </button>
          ))}
          {sections.length > 4 && (
            <button onClick={onOpenSectionManager} className="text-emerald-400 hover:underline">
              +{sections.length - 4} MORE
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
