import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ActiveTab, SectionItem } from '../../types';
import { PORTAL_CATEGORIES } from '../../data/initialData';
import {
  Compass,
  Activity,
  ChevronLeft,
  ChevronRight,
  Layers,
  LayoutGrid,
  Play,
  Pause,
  ExternalLink,
  Check,
} from 'lucide-react';
import { Language, TranslationDictionary } from '../../i18n/translations';
import { useTheme } from '../../context/ThemeContext';
import { RawxForgedIcon } from './BrandTabIcons';
import IconHoverCard from './IconHoverCard';

export interface BottomCommandDockProps {
  sections: SectionItem[];
  currentSectionIndex: number;
  onSelectSection: (index: number) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenIndex: () => void;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  language: Language;
  t: TranslationDictionary;
}

type FilterKey = 'all' | 'commerce' | 'content' | 'manuf' | 'lifestyle' | 'food' | 'apps';

interface CategoryFilterOption {
  key: FilterKey;
  label: string;
}

const CATEGORY_FILTER_OPTIONS: CategoryFilterOption[] = [
  { key: 'all', label: 'All Wings' },
  { key: 'commerce', label: 'Commerce' },
  { key: 'content', label: 'Content' },
  { key: 'manuf', label: 'Manufacturing' },
  { key: 'lifestyle', label: 'Lifestyle' },
  { key: 'food', label: 'Food' },
  { key: 'apps', label: 'Apps' },
];

function AuralEqualizerIcon({ isPlaying }: { isPlaying: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="w-5 h-5 shrink-0"
    >
      <rect
        x="3.5"
        y={isPlaying ? '7' : '11'}
        width="3"
        height={isPlaying ? '13' : '9'}
        rx="1.5"
        fill="currentColor"
        className={isPlaying ? 'hh-eq-bar hh-eq-bar-1' : ''}
      />
      <rect
        x="8.5"
        y={isPlaying ? '4' : '8'}
        width="3"
        height={isPlaying ? '16' : '12'}
        rx="1.5"
        fill="currentColor"
        className={isPlaying ? 'hh-eq-bar hh-eq-bar-2' : ''}
      />
      <rect
        x="13.5"
        y={isPlaying ? '6' : '10'}
        width="3"
        height={isPlaying ? '14' : '10'}
        rx="1.5"
        fill="currentColor"
        className={isPlaying ? 'hh-eq-bar hh-eq-bar-3' : ''}
      />
      <rect
        x="18.5"
        y={isPlaying ? '9' : '13'}
        width="3"
        height={isPlaying ? '11' : '7'}
        rx="1.5"
        fill="currentColor"
        className={isPlaying ? 'hh-eq-bar hh-eq-bar-4' : ''}
      />
    </svg>
  );
}

export default function BottomCommandDock({
  sections,
  currentSectionIndex,
  onSelectSection,
  activeTab,
  setActiveTab,
  onOpenIndex,
  isSoundEnabled,
  onToggleSound,
  language,
  t,
}: BottomCommandDockProps) {
  const { palette, isDark } = useTheme();
  const [activeCategory, setActiveCategory] = useState<FilterKey>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterMenuRef = useRef<HTMLDivElement | null>(null);
  const isBangla = language === 'bn';

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const totalSections = sections.length || 1;
  const safeIndex = ((currentSectionIndex % totalSections) + totalSections) % totalSections;
  const currentSection = sections[safeIndex] || sections[0];
  const stageAccent = currentSection?.accent || palette.accent;
  const progressPercent = ((safeIndex + 1) / totalSections) * 100;

  const filteredIndices = useMemo(() => {
    if (activeCategory === 'all') {
      return sections.map((_, idx) => idx);
    }
    const group = PORTAL_CATEGORIES.find((c) => c.key === activeCategory);
    if (!group) return sections.map((_, idx) => idx);
    const matches = sections
      .map((sec, idx) => (group.sectionIds.includes(sec.id) ? idx : -1))
      .filter((idx) => idx !== -1);
    return matches.length > 0 ? matches : sections.map((_, idx) => idx);
  }, [activeCategory, sections]);

  const prevTargetIndex = useMemo(() => {
    const pos = filteredIndices.indexOf(safeIndex);
    if (pos !== -1) {
      return filteredIndices[(pos - 1 + filteredIndices.length) % filteredIndices.length];
    }
    return (safeIndex - 1 + totalSections) % totalSections;
  }, [filteredIndices, safeIndex, totalSections]);

  const nextTargetIndex = useMemo(() => {
    const pos = filteredIndices.indexOf(safeIndex);
    if (pos !== -1) {
      return filteredIndices[(pos + 1) % filteredIndices.length];
    }
    return (safeIndex + 1) % totalSections;
  }, [filteredIndices, safeIndex, totalSections]);

  const getLocalizedSection = (sec: SectionItem | undefined) => {
    if (!sec) {
      return { title: 'PORTAL', sub: '' };
    }
    const loc = t.sections?.[sec.id];
    return {
      title: loc?.title || sec.title,
      sub: loc?.sub || sec.sub || sec.subtitle || '',
    };
  };

  const currentInfo = getLocalizedSection(currentSection);
  const prevSection = sections[prevTargetIndex];
  const prevInfo = getLocalizedSection(prevSection);
  const nextSection = sections[nextTargetIndex];
  const nextInfo = getLocalizedSection(nextSection);

  const hubIndex = useMemo(() => {
    const idx = sections.findIndex((s) => s.id === 'hub');
    return idx >= 0 ? idx : 0;
  }, [sections]);

  const activeCategoryLabel =
    CATEGORY_FILTER_OPTIONS.find((opt) => opt.key === activeCategory)?.label || 'All Wings';

  const handleSelectCategory = (key: FilterKey) => {
    setActiveCategory(key);
    setIsFilterOpen(false);
    if (key === 'all') return;

    const group = PORTAL_CATEGORIES.find((c) => c.key === key);
    if (!group) return;
    const firstIdx = sections.findIndex((s) => group.sectionIds.includes(s.id));
    if (firstIdx !== -1) {
      onSelectSection(firstIdx);
    }
  };

  const compactWingCounter = `${String(safeIndex + 1).padStart(2, '0')}/${String(
    totalSections
  ).padStart(2, '0')}`;

  return (
    <aside
      aria-label="Ecosystem Floating Command Dock"
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-fit max-w-[min(calc(100vw-1.5rem),48rem)] pointer-events-auto"
    >
      {/* Subtle Stage-Reactive Ambient Halo Behind Dock */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-6 -inset-y-3 rounded-full blur-2xl opacity-35 transition-colors duration-700"
        style={{
          background: `radial-gradient(ellipse at center, ${stageAccent}44, transparent 70%)`,
        }}
      />

      <div
        className="relative flex items-center gap-1 sm:gap-2 px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl border backdrop-blur-xl shadow-2xl hh-theme-transition max-w-full overflow-x-auto sm:overflow-visible no-scrollbar"
        style={{
          backgroundColor: 'var(--hh-glass-bg)',
          borderColor: isDark ? 'rgba(255,255,255,0.14)' : 'rgba(15,23,42,0.12)',
          color: 'var(--hh-text)',
          boxShadow: isDark
            ? `0 20px 50px rgba(0,0,0,0.65), 0 0 0 1px ${stageAccent}22`
            : `0 18px 42px rgba(15,23,42,0.14), 0 0 0 1px ${stageAccent}18`,
        }}
      >
        {/* Subtle Stage Progress Hairline Along Bottom Edge */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-3 right-3 bottom-0 h-[2px] rounded-full overflow-hidden opacity-75"
          style={{ backgroundColor: 'var(--hh-border)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: stageAccent,
              boxShadow: `0 0 10px ${stageAccent}`,
            }}
          />
        </div>

        {/* LEFT CLUSTER: Wing Position Compass + Telemetry Pulse */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <IconHoverCard
            onClick={() => {
              if (activeTab !== 'ecosystem') {
                onSelectSection(safeIndex);
              } else {
                onOpenIndex();
              }
            }}
            ariaLabel={`Active Wing ${compactWingCounter}: ${currentInfo.title}`}
            buttonSize="md"
            buttonShape="rounded-xl"
            title={currentInfo.title}
            badge={`${String(safeIndex + 1).padStart(2, '0')} / ${String(
              totalSections
            ).padStart(2, '0')}`}
            description={currentInfo.sub}
            align="left"
            position="top"
            isBangla={isBangla}
            accentColor={stageAccent}
            cornerBadge={
              <span
                aria-hidden="true"
                className="absolute -top-1 -right-1 px-1 rounded-full font-mono text-[7.5px] font-bold leading-[13px] tabular-nums border shadow-sm"
                style={{
                  backgroundColor: stageAccent,
                  borderColor: 'var(--hh-bg)',
                  color: '#ffffff',
                }}
              >
                {compactWingCounter}
              </span>
            }
            footerAction={
              currentSection ? (
                <div className="flex items-center justify-between w-full gap-2">
                  <span
                    className="font-mono text-[10.5px] truncate opacity-85"
                    style={{ color: 'var(--hh-muted)' }}
                  >
                    {currentSection.url}
                  </span>
                  <a
                    href={currentSection.dest}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-[11px] font-bold shrink-0 hover:underline"
                    style={{ color: stageAccent }}
                  >
                    <span>Open</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ) : undefined
            }
            icon={<Compass className="w-5 h-5" style={{ color: stageAccent }} />}
          />

          <IconHoverCard
            onClick={() => onSelectSection(hubIndex)}
            ariaLabel="Ecosystem Status — Control Spine & Telemetry Stack Online"
            buttonSize="md"
            buttonShape="rounded-xl"
            title="Ecosystem Status"
            badge="ONLINE"
            badgeTone="emerald"
            urlLabel="hub.handsandhead.com"
            description="Control Spine & Telemetry Stack Online across all 24 nodes"
            hint="Inspect Hub →"
            align="left"
            position="top"
            isBangla={isBangla}
            accentColor="#10b981"
            cornerBadge={
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            }
            icon={<Activity className="w-5 h-5 text-emerald-500" />}
          />
        </div>

        {/* Hairline Divider */}
        <div
          aria-hidden="true"
          className="w-px h-6 mx-0.5 sm:mx-1 shrink-0"
          style={{ backgroundColor: 'var(--hh-border)' }}
        />

        {/* CENTER CLUSTER: Prev Wing + Next Wing + RAWx 19-Slider Engine + Wing Category Filter */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <IconHoverCard
            onClick={() => onSelectSection(prevTargetIndex)}
            ariaLabel={`Previous Wing: ${prevInfo.title}`}
            buttonSize="md"
            buttonShape="rounded-xl"
            title={prevInfo.title}
            badge="← Prev Wing"
            urlLabel={prevSection?.url}
            description={prevInfo.sub || 'Jump to previous ecosystem wing'}
            hint="Click to jump ←"
            align="center"
            position="top"
            isBangla={isBangla}
            accentColor={prevSection?.accent || palette.accent}
            icon={<ChevronLeft className="w-5 h-5" />}
          />

          <IconHoverCard
            onClick={() => onSelectSection(nextTargetIndex)}
            ariaLabel={`Next Wing: ${nextInfo.title}`}
            buttonSize="md"
            buttonShape="rounded-xl"
            title={nextInfo.title}
            badge="Next Wing →"
            urlLabel={nextSection?.url}
            description={nextInfo.sub || 'Jump to next ecosystem wing'}
            hint="Click to jump →"
            align="center"
            position="top"
            isBangla={isBangla}
            accentColor={nextSection?.accent || palette.accent}
            icon={<ChevronRight className="w-5 h-5" />}
          />

          <IconHoverCard
            onClick={() => setActiveTab('rawx-showcase')}
            ariaLabel="RAWx 19 Ultra Sliders — Interactive Lookbook & LUT Lab"
            isActive={activeTab === 'rawx-showcase'}
            activeStyle={
              activeTab === 'rawx-showcase'
                ? {
                    backgroundColor: isDark ? '#d97706' : '#b45309',
                    borderColor: isDark ? '#d97706' : '#b45309',
                    color: isDark ? '#0c0b0a' : '#ffffff',
                  }
                : undefined
            }
            buttonSize="md"
            buttonShape="rounded-xl"
            title="RAWx 19 Ultra Sliders"
            badge="19 LABS"
            badgeTone="amber"
            urlLabel="rawx.handsandhead.com"
            description="Interactive Lookbook & 19 Cinematic Slider Engines"
            align="center"
            position="top"
            isBangla={isBangla}
            accentColor={isDark ? '#d97706' : '#b45309'}
            icon={<RawxForgedIcon isActive={activeTab === 'rawx-showcase'} className="!w-5 !h-5" />}
          />

          {/* Wing Category Filter Popover */}
          <div ref={filterMenuRef} className="relative shrink-0">
            <IconHoverCard
              onClick={() => setIsFilterOpen((prev) => !prev)}
              ariaLabel={`Filter Wings (${activeCategoryLabel})`}
              ariaExpanded={isFilterOpen}
              ariaHaspopup="listbox"
              isActive={isFilterOpen || activeCategory !== 'all'}
              activeStyle={
                isFilterOpen || activeCategory !== 'all'
                  ? {
                      backgroundColor: palette.accent,
                      borderColor: palette.accent,
                      color:
                        isDark && (palette.tabKey === 'handfilm' || palette.tabKey === 'rawx')
                          ? '#09090b'
                          : '#ffffff',
                    }
                  : undefined
              }
              suppressCard={isFilterOpen}
              buttonSize="md"
              buttonShape="rounded-xl"
              title="Wing Filter"
              badge={activeCategory === 'all' ? 'ALL 24' : activeCategoryLabel.toUpperCase()}
              description={`Active filter: ${activeCategoryLabel} · Focus stage navigation by division`}
              align="center"
              position="top"
              isBangla={isBangla}
              cornerBadge={
                activeCategory !== 'all' ? (
                  <span
                    aria-hidden="true"
                    className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400"
                  />
                ) : undefined
              }
              icon={<Layers className="w-5 h-5" />}
            />

            {isFilterOpen && (
              <div
                role="listbox"
                aria-label="Filter Ecosystem Wings"
                className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-56 rounded-2xl border backdrop-blur-2xl p-1.5 shadow-2xl z-50"
                style={{
                  backgroundColor: 'var(--hh-glass-bg)',
                  borderColor: 'var(--hh-border)',
                  color: 'var(--hh-text)',
                  boxShadow: 'var(--hh-card-shadow)',
                }}
              >
                <div
                  className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider border-b mb-1"
                  style={{ color: 'var(--hh-muted)', borderColor: 'var(--hh-border)' }}
                >
                  Filter Wings
                </div>
                {CATEGORY_FILTER_OPTIONS.map((opt) => {
                  const isSelected = activeCategory === opt.key;
                  const count =
                    opt.key === 'all'
                      ? sections.length
                      : PORTAL_CATEGORIES.find((c) => c.key === opt.key)?.sectionIds.length || 0;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelectCategory(opt.key)}
                      className="w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer hover:bg-black/5 dark:hover:bg-white/5"
                      style={
                        isSelected
                          ? {
                              backgroundColor: palette.accent,
                              color:
                                isDark &&
                                (palette.tabKey === 'handfilm' || palette.tabKey === 'rawx')
                                  ? '#09090b'
                                  : '#ffffff',
                              fontWeight: 700,
                            }
                          : { color: 'var(--hh-text)' }
                      }
                    >
                      <span>{opt.label}</span>
                      <span className="flex items-center gap-1.5 font-mono text-[10px] tabular-nums opacity-80">
                        <span>{count}</span>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Hairline Divider */}
        <div
          aria-hidden="true"
          className="w-px h-6 mx-0.5 sm:mx-1 shrink-0"
          style={{ backgroundColor: 'var(--hh-border)' }}
        />

        {/* RIGHT CLUSTER: Aural Acoustic Lab Equalizer + All Apps Grid */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <IconHoverCard
            onClick={onToggleSound}
            ariaLabel={
              isSoundEnabled
                ? 'Aural Acoustic Lab — Pause Atmospheric Stream'
                : 'Aural Acoustic Lab — Play Atmospheric Stream'
            }
            isActive={isSoundEnabled}
            activeStyle={
              isSoundEnabled
                ? {
                    backgroundColor: 'rgba(16, 185, 129, 0.16)',
                    borderColor: '#10b981',
                    color: '#10b981',
                  }
                : undefined
            }
            buttonSize="md"
            buttonShape="rounded-xl"
            title="Aural Acoustic Lab"
            badge={isSoundEnabled ? 'PLAYING' : 'PAUSED'}
            badgeTone={isSoundEnabled ? 'emerald' : 'neutral'}
            description="Atmospheric Frequency Stream · Procedural Ambient Audio"
            align="right"
            position="top"
            isBangla={isBangla}
            accentColor="#10b981"
            footerAction={
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSound();
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer"
                style={{
                  backgroundColor: isSoundEnabled
                    ? isDark
                      ? 'rgba(16, 185, 129, 0.2)'
                      : 'rgba(5, 150, 105, 0.14)'
                    : 'var(--hh-surface-2)',
                  color: isSoundEnabled ? (isDark ? '#34d399' : '#047857') : 'var(--hh-text)',
                }}
              >
                {isSoundEnabled ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause Stream</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Play Stream</span>
                  </>
                )}
              </button>
            }
            icon={<AuralEqualizerIcon isPlaying={isSoundEnabled} />}
          />

          <IconHoverCard
            onClick={onOpenIndex}
            ariaLabel="24 Ecosystem Apps — Open Full Launcher"
            buttonSize="md"
            buttonShape="rounded-xl"
            title="24 Ecosystem Apps"
            badge={`${sections.length} APPS`}
            badgeTone="emerald"
            urlLabel="apps.handsandhead.com"
            description="Open the Master Directory & Interactive Ecosystem Map"
            hint="Open Launcher →"
            align="right"
            position="top"
            isBangla={isBangla}
            accentColor={isDark ? '#10b981' : '#059669'}
            icon={<LayoutGrid className="w-5 h-5" />}
          />
        </div>
      </div>
    </aside>
  );
}
// END OF FILE: src/components/navigation/BottomCommandDock.tsx
