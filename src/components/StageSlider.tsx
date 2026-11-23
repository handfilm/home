import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SectionItem } from '../types';
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Plus,
  Sparkles,
  CheckSquare,
  Radio,
  Share2,
  Check,
} from 'lucide-react';
import LiveEmbedPortal from './LiveEmbedPortal';
import { Language, TranslationDictionary } from '../i18n/translations';
import { copyPortalShareLink } from '../services/deepLinkService';
import { trackEvent } from '../services/analytics';
import { recordPortalVisit } from '../services/visitorState';

interface StageSliderProps {
  sections: SectionItem[];
  currentSectionIndex: number;
  setCurrentSectionIndex: (idx: number) => void;
  onSetCursorLabel: (label: string) => void;
  onOpenSectionManager: () => void;
  onOpenTasksForSection: (sectionId: string) => void;
  sectionTasksCount: Record<string, number>;
  onOpenSliders?: () => void;
  isActiveTab?: boolean;
  language: Language;
  t: TranslationDictionary;
}

export default function StageSlider({
  sections,
  currentSectionIndex,
  setCurrentSectionIndex,
  onSetCursorLabel,
  onOpenSectionManager,
  onOpenTasksForSection,
  sectionTasksCount,
  onOpenSliders,
  isActiveTab = true,
  language,
  t,
}: StageSliderProps) {
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [copiedSectionId, setCopiedSectionId] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const stageRef = useRef<HTMLDivElement | null>(null);

  const total = sections.length;
  const currentSection = sections[currentSectionIndex] || sections[0];

  const goTo = useCallback(
    (index: number) => {
      let next = index;
      if (next < 0) next = total - 1;
      if (next >= total) next = 0;
      setCurrentSectionIndex(next);
      if (sections[next]) {
        recordPortalVisit(sections[next].id);
        trackEvent('MASTER_SECTION_VIEW', { sectionId: sections[next].id, title: sections[next].title });
      }
    },
    [total, setCurrentSectionIndex, sections]
  );

  // Parallax mouse move effect
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 20;
    const y = (clientY / innerHeight - 0.5) * 20;
    setMouseOffset({ x, y });
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isActiveTab) return;

    const handleKeyDown = (e: KeyboardEvent) => {
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
  }, [isActiveTab, currentSectionIndex, goTo, total, currentSection]);

  // Mouse wheel navigation
  useEffect(() => {
    if (!isActiveTab) return;

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
  }, [isActiveTab, currentSectionIndex, goTo]);

  const handleActivate = (s: SectionItem) => {
    trackEvent('MASTER_SECTION_CLICK', { sectionId: s.id, url: s.dest });
    if (s.dest) {
      window.open(s.dest, '_blank', 'noopener');
    }
  };

  const handleShare = async (e: React.MouseEvent, section: SectionItem) => {
    e.stopPropagation();
    trackEvent('MASTER_SHARE_CLICK', { sectionId: section.id });
    const copied = await copyPortalShareLink(section.id);
    if (copied) {
      setCopiedSectionId(section.id);
      setTimeout(() => setCopiedSectionId(null), 2500);
    }
  };

  // Helper to get translated content for standard and extended sections
  const getDisplayDetails = (section: SectionItem) => {
    const trans = t.sections[section.id];
    if (trans) {
      return {
        title: trans.title,
        category: trans.category,
        sub: trans.sub,
        desc: trans.desc,
        cta: trans.cta,
      };
    }

    return {
      title: section.title,
      category: section.category,
      sub: section.sub || section.subtitle || '',
      desc: section.desc || section.description || '',
      cta: section.cta,
    };
  };

  const isBn = language === 'bn';

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`relative w-full h-[calc(100vh-130px)] md:h-[calc(100vh-80px)] mt-[130px] md:mt-[80px] overflow-hidden hh-theme-transition ${isBn ? 'bangla-text' : ''}`}
      style={{
        backgroundColor: 'var(--hh-bg)',
        color: 'var(--hh-text)',
      }}
    >
      {/* Subtle stage-reactive bottom ambient glow */}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 h-32 z-10 transition-all duration-700"
        style={{
          background: `radial-gradient(ellipse 60% 90% at 50% 100%, ${currentSection?.accent || '#c8b89a'}26, transparent 75%)`,
        }}
        aria-hidden="true"
      />
      {/* Side Navigation Rail */}
      <nav
        className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-1 sm:gap-1.5 items-end font-mono text-[9.5px] sm:text-[10px] tracking-[0.14em] uppercase max-h-[80vh] overflow-y-auto no-scrollbar py-2.5 px-3 rounded-2xl border backdrop-blur-md shadow-xl hh-theme-transition"
        style={{
          backgroundColor: 'var(--hh-glass-bg)',
          borderColor: 'var(--hh-border)',
        }}
        aria-label="Section Navigation Rail"
      >
        {sections.map((s, idx) => {
          const isActive = idx === currentSectionIndex;
          const pendingCount = sectionTasksCount[s.id] || 0;
          const display = getDisplayDetails(s);

          return (
            <button
              key={s.id}
              onClick={() => goTo(idx)}
              onMouseEnter={() => onSetCursorLabel(`${t.actions.view} ${display.title}`)}
              className="flex items-center gap-2 py-0.5 cursor-pointer transition-all duration-200 group"
              style={{
                color: isActive ? 'var(--hh-text)' : 'var(--hh-muted)',
                fontWeight: isActive ? 700 : 500,
              }}
            >
              {pendingCount > 0 && (
                <span
                  className="text-[8px] px-1.5 py-0.2 rounded-full font-bold"
                  style={{
                    backgroundColor: 'var(--hh-accent)',
                    color: 'var(--hh-accent-ink)',
                  }}
                >
                  {pendingCount}
                </span>
              )}
              <span className="text-[8.5px] font-mono opacity-60 tabular-nums">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <span className="group-hover:underline">{display.title}</span>
              <span
                className="h-[2px] transition-all duration-300 rounded-full"
                style={{
                  width: isActive ? '24px' : '10px',
                  backgroundColor: isActive ? (s.accent || 'var(--hh-accent)') : 'var(--hh-border)',
                }}
              />
            </button>
          );
        })}
        <button
          onClick={onOpenSectionManager}
          title={t.nav.addSite}
          className="flex items-center gap-2 py-1 mt-1 cursor-pointer text-[9px] transition-colors"
          style={{ color: 'var(--hh-accent)' }}
        >
          <span>{t.nav.addSite}</span>
          <span className="w-2.5 h-[1px]" style={{ backgroundColor: 'var(--hh-accent)' }} />
        </button>
        {onOpenSliders && (
          <button
            onClick={onOpenSliders}
            title="Open RAWx Master OS 19-Slider System"
            className="flex items-center gap-1.5 py-1 text-amber-500 hover:text-amber-400 font-bold cursor-pointer text-[9px] border-t pt-1.5"
            style={{ borderColor: 'var(--hh-border)' }}
          >
            <Sparkles className="w-2.5 h-2.5 text-amber-500 animate-pulse" />
            <span>19 SLIDERS ↗</span>
          </button>
        )}
      </nav>

      {/* Prev / Next Floating Arrows */}
      <button
        onClick={() => goTo(currentSectionIndex - 1)}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-30 hidden sm:flex w-12 h-12 items-center justify-center rounded-full border backdrop-blur-md transition-all cursor-pointer shadow-lg group"
        style={{
          backgroundColor: 'var(--hh-glass-bg)',
          borderColor: 'var(--hh-border)',
          color: 'var(--hh-text)',
        }}
        aria-label="Previous Section"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
      </button>

      <button
        onClick={() => goTo(currentSectionIndex + 1)}
        className="fixed right-4 sm:right-52 top-1/2 -translate-y-1/2 z-30 hidden sm:flex w-12 h-12 items-center justify-center rounded-full border backdrop-blur-md transition-all cursor-pointer shadow-lg group"
        style={{
          backgroundColor: 'var(--hh-glass-bg)',
          borderColor: 'var(--hh-border)',
          color: 'var(--hh-text)',
        }}
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
          const display = getDisplayDetails(section);
          const isCopied = copiedSectionId === section.id;

          return (
            <div
              key={section.id}
              onClick={() => {
                if (idx !== currentSectionIndex) {
                  goTo(idx);
                }
              }}
              onMouseEnter={() => onSetCursorLabel(`${display.cta} →`)}
              className={`relative h-full overflow-hidden transition-all duration-700 select-none ${
                window.innerWidth > 780 ? 'flex-shrink-0' : 'w-full min-h-[85vh]'
              }`}
              style={{
                width: window.innerWidth > 780 ? `${100 / sections.length}%` : '100%',
              }}
            >
              {/* Background Layer: Live Embed Portal OR Image/Texture */}
              {section.sectionType === 'live-embed' || section.embedUrl ? (
                <LiveEmbedPortal
                  embedUrl={section.embedUrl || section.dest}
                  fallbackImage={section.embedFallback || section.imageUrl}
                  fallbackTexture={section.tex || 'tex-film'}
                  isActive={isActive}
                  isAdjacent={Math.abs(idx - currentSectionIndex) <= 1}
                  title={display.title}
                  accent={section.accent}
                  onOpenDirect={() => handleActivate(section)}
                />
              ) : (
                <>
                  {/* Permanent Dark-Obsidian Architectural Fallback Backdrop */}
                  <div
                    className={`absolute inset-0 bg-[#0A0B0D] transition-transform duration-1000 ease-[cubic-bezier(.16,.84,.32,1)] ${
                      section.tex || 'tex-manuf'
                    } ${isActive ? 'scale-100 opacity-100' : 'scale-105 opacity-70'}`}
                    style={{
                      transform: isActive
                        ? `scale(1) translate(${mouseOffset.x * 0.25}px, ${mouseOffset.y * 0.25}px)`
                        : 'scale(1.05)',
                    }}
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 pointer-events-none opacity-[0.08]"
                    style={{
                      backgroundImage:
                        'linear-gradient(rgba(243,239,230,0.45) 1px, transparent 1px), linear-gradient(90deg, rgba(243,239,230,0.45) 1px, transparent 1px)',
                      backgroundSize: '64px 64px',
                    }}
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `radial-gradient(ellipse 65% 55% at 72% 30%, ${section.accent || '#C8A96A'}33, transparent 70%)`,
                    }}
                  />

                  {/* High-Res Photo Layer (gracefully hides on network/CORS error to reveal obsidian backdrop) */}
                  {section.imageUrl && !failedImages[section.id] && (
                    <img
                      src={section.imageUrl}
                      alt={`${display.title} — ${display.sub}`}
                      referrerPolicy="no-referrer"
                      loading={Math.abs(idx - currentSectionIndex) <= 2 ? 'eager' : 'lazy'}
                      onError={() =>
                        setFailedImages((prev) => ({
                          ...prev,
                          [section.id]: true,
                        }))
                      }
                      className={`absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 ease-[cubic-bezier(.16,.84,.32,1)] ${
                        isActive ? 'scale-100 opacity-75' : 'scale-105 opacity-35'
                      }`}
                      style={{
                        transform: isActive
                          ? `scale(1) translate(${mouseOffset.x * 0.4}px, ${mouseOffset.y * 0.4}px)`
                          : 'scale(1.05)',
                      }}
                    />
                  )}

                  {/* Scrim Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0D] via-[#0A0B0D]/62 to-[#0A0B0D]/38 pointer-events-none z-10" />
                  <div className="rx-scanlines z-10 opacity-30" />
                </>
              )}

              {/* Category tag top left */}
              <div className="absolute top-6 left-6 sm:left-12 z-20 font-mono text-[11px] sm:text-[12px] tracking-[0.2em] text-[#f3efe6]/70 uppercase flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: section.accent }}
                />
                <span>{display.category}</span>
                {section.sectionType === 'live-embed' && (
                  <span className="text-[9px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
                    <Radio className="w-2.5 h-2.5 animate-pulse text-amber-400" />
                    LIVE PORTAL
                  </span>
                )}
                {section.isCustom && (
                  <span className="text-[9px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
                    CUSTOM
                  </span>
                )}
              </div>

              {/* Main Content Area at Bottom — Low Text, Super Bold Tagline, Bigger Buttons & Animated Hover Card */}
              <div
                className="relative z-20 h-full flex flex-col justify-end px-6 sm:px-16 pb-24 sm:pb-28 max-w-4xl transition-transform duration-300"
                style={{
                  transform: isActive
                    ? `translate(${mouseOffset.x * -0.3}px, ${mouseOffset.y * -0.3}px)`
                    : 'none',
                }}
              >
                {/* Eyebrow */}
                <div
                  className={`font-mono text-xs tracking-[0.2em] text-[#f3efe6]/70 uppercase mb-2.5 flex items-center gap-3 transition-all duration-500 ${
                    isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                  }`}
                >
                  <span style={{ color: section.accent }} className="font-black">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span>/ {String(sections.length).padStart(2, '0')}</span>
                  <span className="opacity-50">·</span>
                  <span className="text-[#f3efe6]/85">{section.url}</span>
                </div>

                {/* Big Display Title */}
                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-[#f3efe6] leading-[0.9] mb-3">
                  {display.title}
                </h1>

                {/* Super Bold Tagline / Subtitle with Animated Hover Card for Full Description */}
                <div className="group/stagebrief relative max-w-2xl mb-6">
                  <p className="text-lg sm:text-2xl text-[#f3efe6] font-extrabold tracking-tight leading-snug">
                    {display.sub}
                  </p>
                  {display.desc && (
                    <div
                      className="pointer-events-none absolute left-0 bottom-full mb-3 w-[320px] sm:w-[400px] max-w-[calc(100vw-3rem)] rounded-2xl border p-4 backdrop-blur-2xl shadow-2xl opacity-0 translate-y-2 scale-95 group-hover/stagebrief:opacity-100 group-hover/stagebrief:translate-y-0 group-hover/stagebrief:scale-100 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] z-30"
                      style={{
                        backgroundColor: 'rgba(12, 12, 16, 0.90)',
                        borderColor: section.accent || 'rgba(255,255,255,0.2)',
                      }}
                    >
                      <div className="text-sm font-black text-white mb-1">{display.title}</div>
                      <p className="text-sm text-zinc-200 leading-snug font-medium">{display.desc}</p>
                    </div>
                  )}
                </div>

                {/* Bigger, Cleaner Action Buttons Row */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 font-mono text-xs sm:text-sm tracking-wider uppercase">
                  {(section.id === 'articles' || section.title.toLowerCase().includes('rawx')) &&
                  onOpenSliders ? (
                    <a
                      href="#sliders"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onOpenSliders();
                      }}
                      className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-extrabold transition-all duration-200 cursor-pointer bg-amber-400 text-[#0e0d0b] shadow-xl shadow-amber-400/25 group hover:scale-[1.03] hover:bg-amber-300"
                    >
                      <Sparkles className="w-5 h-5 text-[#0e0d0b]" />
                      <span>RAWx 19 SLIDERS</span>
                    </a>
                  ) : (
                    <a
                      href={section.dest}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.stopPropagation();
                        trackEvent('MASTER_SECTION_CLICK', { sectionId: section.id, url: section.dest });
                      }}
                      className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-extrabold transition-all duration-200 cursor-pointer shadow-lg group hover:scale-[1.03]"
                      style={{
                        backgroundColor: section.accent || '#f3efe6',
                        color: '#f3efe6',
                      }}
                    >
                      <span>{display.cta}</span>
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  )}

                  {/* Share Icon Button */}
                  <button
                    onClick={(e) => handleShare(e, section)}
                    aria-label="Copy Portal Link"
                    title="Copy Portal Link"
                    className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all cursor-pointer hover:scale-105 ${
                      isCopied
                        ? 'bg-emerald-500 text-black border-emerald-400 font-bold'
                        : 'bg-[#161512]/90 hover:bg-[#201e1a] text-[#f3efe6] border-[#f3efe6]/20'
                    }`}
                  >
                    {isCopied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5 text-[#c8b89a]" />}
                  </button>

                  {/* Section Tasks Icon Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenTasksForSection(section.id);
                    }}
                    aria-label={`${t.nav.tasks} (${pendingTasks})`}
                    title={t.nav.tasks}
                    className="relative w-12 h-12 bg-[#161512]/90 hover:bg-[#201e1a] text-[#f3efe6] border border-[#f3efe6]/20 hover:border-[#f3efe6]/50 rounded-2xl flex items-center justify-center transition-all cursor-pointer hover:scale-105"
                  >
                    <CheckSquare className="w-5 h-5 text-emerald-400" />
                    {pendingTasks > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#b14a26] text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                        {pendingTasks}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
