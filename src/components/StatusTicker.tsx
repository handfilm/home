import React, { useState, useEffect } from 'react';
import { SectionItem } from '../types';
import { Radio, ChevronUp, ChevronDown, Pause, Play, Sparkles } from 'lucide-react';
import { TranslationDictionary } from '../i18n/translations';

interface StatusTickerProps {
  sections: SectionItem[];
  onSelectSection: (index: number) => void;
  currentSectionIndex: number;
  t: TranslationDictionary;
}

export default function StatusTicker({
  sections,
  onSelectSection,
  currentSectionIndex,
  t,
}: StatusTickerProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeTickerIndex, setActiveTickerIndex] = useState(0);

  // Derive ticker items from current sections and translations
  const tickerItems = sections.map((sec, idx) => {
    const localizedSection = t.sections?.[sec.id];
    const statusText = localizedSection?.status || localizedSection?.sub || sec.sub || 'PORTAL ACTIVE';

    return {
      index: idx,
      id: sec.id,
      title: localizedSection?.title || sec.title,
      accent: sec.accent || '#c8b89a',
      status: statusText,
    };
  });

  // Rotate items when not paused
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveTickerIndex((prev) => (prev + 1) % tickerItems.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused, tickerItems.length]);

  const currentItem = tickerItems[activeTickerIndex] || tickerItems[0];

  return (
    <aside
      aria-label="Ecosystem Status Ticker"
      className="fixed bottom-0 left-0 right-0 z-40 font-mono text-[10px] tracking-wider transition-all duration-300 pointer-events-auto"
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-8 pb-2">
        <div
          className={`bg-[#12110e]/90 backdrop-blur-md border border-[#f3efe6]/15 rounded-lg shadow-xl overflow-hidden transition-all duration-300 ${
            isCollapsed ? 'py-1.5 px-3' : 'py-2 px-3 sm:px-4'
          }`}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="flex items-center justify-between gap-3">
            {/* Left Tag */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[9.5px] uppercase font-bold text-[#c8b89a] hidden sm:inline">
                {t.ticker.prefix}
              </span>
            </div>

            {/* Middle Rotating Status item */}
            {!isCollapsed && currentItem && (
              <div
                onClick={() => onSelectSection(currentItem.index)}
                className="flex-1 flex items-center justify-center gap-2 sm:gap-3 text-center cursor-pointer group truncate px-2"
              >
                <span
                  className="px-1.5 py-0.2 rounded text-[9px] font-bold text-[#0e0d0b] uppercase flex-shrink-0"
                  style={{ backgroundColor: currentItem.accent }}
                >
                  {currentItem.title}
                </span>
                <span className="text-[#f3efe6]/90 group-hover:text-[#f3efe6] transition-colors truncate font-medium">
                  {currentItem.status}
                </span>
                <span className="text-[#c8b89a] opacity-0 group-hover:opacity-100 transition-opacity text-[9px] hidden md:inline">
                  → JUMP
                </span>
              </div>
            )}

            {/* Right Controls */}
            <div className="flex items-center gap-2 flex-shrink-0 text-[#f3efe6]/50">
              <button
                onClick={() => setIsPaused((prev) => !prev)}
                title={isPaused ? t.ticker.resume : t.ticker.pause}
                className="p-1 hover:text-[#f3efe6] transition-colors cursor-pointer"
                aria-label={isPaused ? 'Resume Ticker' : 'Pause Ticker'}
              >
                {isPaused ? <Play className="w-3 h-3 text-amber-400" /> : <Pause className="w-3 h-3" />}
              </button>

              <button
                onClick={() => setIsCollapsed((prev) => !prev)}
                title={isCollapsed ? 'Expand Ticker' : 'Collapse Ticker'}
                className="p-1 hover:text-[#f3efe6] transition-colors cursor-pointer"
                aria-label={isCollapsed ? 'Expand Ticker' : 'Collapse Ticker'}
              >
                {isCollapsed ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
