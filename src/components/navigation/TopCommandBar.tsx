import React, { useState, useRef, useEffect } from 'react';
import { ActiveTab, SyncState } from '../../types';
import {
  Search,
  Radio,
  CheckSquare,
  Globe,
  Sun,
  Moon,
  Download,
  LayoutGrid,
  Check,
} from 'lucide-react';
import {
  Language,
  LANGUAGE_OPTIONS,
  TranslationDictionary,
} from '../../i18n/translations';
import { useTheme } from '../../context/ThemeContext';
import {
  HomeCoreIcon,
  HandfilmCinemaIcon,
  RawxForgedIcon,
  AppsMatrixIcon,
} from './BrandTabIcons';
import IconHoverCard from './IconHoverCard';

export interface TopCommandBarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  syncState: SyncState;
  onOpenSyncModal: () => void;
  onOpenIndex: () => void;
  tasksCount: { total: number; pending: number; done: number };
  onOpenCommandPalette: () => void;
  language: Language;
  onSelectLanguage: (lang: Language) => void;
  canInstallPwa: boolean;
  onPromptInstall: () => Promise<boolean> | void;
  t: TranslationDictionary;
}

export default function TopCommandBar({
  activeTab,
  setActiveTab,
  syncState,
  onOpenSyncModal,
  onOpenIndex,
  tasksCount,
  onOpenCommandPalette,
  language,
  onSelectLanguage,
  canInstallPwa,
  onPromptInstall,
  t,
}: TopCommandBarProps) {
  const { colorMode, toggleColorMode, themeTabKey, palette, isDark } = useTheme();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [installFeedback, setInstallFeedback] = useState(false);
  const langMenuRef = useRef<HTMLDivElement | null>(null);

  const isBangla = language === 'bn';

  const handleTabNav = (e: React.MouseEvent<HTMLElement>, tab: ActiveTab) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    setActiveTab(tab);
  };

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const getTabActiveStyle = (
    tabKey: 'home' | 'handfilm' | 'rawx' | 'apps'
  ): React.CSSProperties | undefined => {
    if (tabKey === 'home' && activeTab === 'home') {
      return {
        backgroundColor: palette.accent,
        borderColor: palette.accent,
        color: '#ffffff',
        boxShadow: isDark
          ? '0 0 20px rgba(225, 29, 72, 0.42)'
          : '0 6px 18px rgba(190, 18, 60, 0.28)',
      };
    }
    if (tabKey === 'handfilm' && activeTab === 'handfilm') {
      return {
        backgroundColor: palette.accent,
        borderColor: palette.accent,
        color: isDark ? '#041218' : '#ffffff',
        boxShadow: isDark
          ? '0 0 20px rgba(6, 182, 212, 0.38)'
          : '0 6px 18px rgba(2, 132, 199, 0.26)',
      };
    }
    if (tabKey === 'rawx' && activeTab === 'rawx-showcase') {
      return {
        backgroundColor: palette.accent,
        borderColor: palette.accent,
        color: isDark ? '#0c0b0a' : '#ffffff',
        boxShadow: isDark
          ? '0 0 20px rgba(217, 119, 6, 0.4)'
          : '0 6px 18px rgba(180, 83, 9, 0.28)',
      };
    }
    if (tabKey === 'apps' && activeTab === 'ecosystem') {
      return {
        backgroundColor: isDark ? '#f3efe6' : '#0f172a',
        borderColor: isDark ? '#f3efe6' : '#0f172a',
        color: isDark ? '#09090b' : '#ffffff',
        boxShadow: isDark
          ? '0 0 18px rgba(16, 185, 129, 0.28)'
          : '0 6px 18px rgba(15, 23, 42, 0.24)',
      };
    }
    return undefined;
  };

  const handleInstallClick = async () => {
    const installed = await Promise.resolve(onPromptInstall());
    if (!installed && !canInstallPwa) {
      setInstallFeedback(true);
      setTimeout(() => setInstallFeedback(false), 2600);
    }
  };

  const currentLangOption = LANGUAGE_OPTIONS.find((opt) => opt.code === language);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-2xl hh-theme-transition"
      style={{
        backgroundColor: 'var(--hh-header-bg)',
        borderColor: 'var(--hh-border)',
        color: 'var(--hh-text)',
      }}
    >
      <div className="mx-auto max-w-[1600px] px-3 sm:px-6 lg:px-8 py-2 flex flex-wrap md:flex-nowrap items-center justify-between gap-x-4 gap-y-2">
        {/* ZONE 1: Left Brand Lockup (Bigger Logo + Stacked Tagline) */}
        <a
          href="#home"
          onClick={(e) => handleTabNav(e, 'home')}
          className="group flex flex-col justify-center min-w-0 shrink-0 cursor-pointer hover:opacity-95 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-lg py-0.5"
          style={{ color: 'var(--hh-text)' }}
          aria-label="HANDS & HEAD — One Core, Many Worlds."
        >
          <span className="flex items-center gap-2.5">
            <span
              className="w-2.5 h-2.5 rounded-full transition-transform duration-300 group-hover:scale-125 shrink-0"
              style={{ backgroundColor: palette.accent }}
              aria-hidden="true"
            />
            <span
              className={`text-xl sm:text-2xl font-extrabold uppercase leading-none whitespace-nowrap ${
                isBangla ? 'bangla-text tracking-normal' : 'tracking-[0.14em]'
              }`}
              style={isBangla ? { letterSpacing: 0 } : undefined}
            >
              {t.brand.name}
            </span>
          </span>
          <span
            className={`text-[11px] sm:text-xs font-serif italic opacity-80 tracking-normal mt-0.5 leading-tight pl-5 whitespace-nowrap ${
              isBangla ? 'bangla-text not-italic' : ''
            }`}
            style={{
              color: 'var(--hh-muted)',
              ...(isBangla ? { letterSpacing: 0 } : undefined),
            }}
          >
            {t.home.motto}
          </span>
        </a>

        {/* ZONE 2: Center Primary Module Dock (4 Large Icon-Only Buttons, 46x46px) */}
        <nav
          aria-label="Primary Operating System Views"
          data-active-theme-tab={themeTabKey}
          className="order-3 md:order-2 w-full md:w-auto flex items-center justify-center shrink-0"
        >
          <div
            className="inline-flex items-center gap-1.5 sm:gap-2 p-1 rounded-2xl border hh-theme-transition"
            style={{
              backgroundColor: 'var(--hh-surface)',
              borderColor: 'var(--hh-border)',
              boxShadow: isDark
                ? 'inset 0 1px 0 rgba(255,255,255,0.04)'
                : '0 4px 14px rgba(15,23,42,0.05)',
            }}
          >
            <IconHoverCard
              href="#home"
              onClick={(e) => handleTabNav(e, 'home')}
              ariaLabel="HOME — Enterprise Command Core"
              ariaCurrent={activeTab === 'home' ? 'page' : undefined}
              isActive={activeTab === 'home'}
              activeStyle={getTabActiveStyle('home')}
              buttonSize="lg"
              buttonShape="rounded-xl"
              buttonStyle={{ backgroundColor: 'transparent', borderColor: 'transparent' }}
              title={t.nav.home}
              badge="CORE"
              description="Enterprise Command Core · 3 Operating Pillars & Live Routing Matrix"
              align="center"
              position="bottom"
              isBangla={isBangla}
              accentColor={palette.accent}
              icon={<HomeCoreIcon isActive={activeTab === 'home'} />}
            />

            <IconHoverCard
              href="#handfilm"
              onClick={(e) => handleTabNav(e, 'handfilm')}
              ariaLabel="HANDFILM — AI Cinema & Video Studio"
              ariaCurrent={activeTab === 'handfilm' ? 'page' : undefined}
              isActive={activeTab === 'handfilm'}
              activeStyle={getTabActiveStyle('handfilm')}
              buttonSize="lg"
              buttonShape="rounded-xl"
              buttonStyle={{ backgroundColor: 'transparent', borderColor: 'transparent' }}
              title={t.nav.handfilm}
              badge="STUDIO"
              description="AI Cinema & Video Studio · Launch Easy, Beast, CapCut & AD Modes"
              align="center"
              position="bottom"
              isBangla={isBangla}
              accentColor={isDark ? '#06b6d4' : '#0284c7'}
              icon={<HandfilmCinemaIcon isActive={activeTab === 'handfilm'} />}
            />

            <IconHoverCard
              href="#rawx"
              onClick={(e) => handleTabNav(e, 'rawx-showcase')}
              ariaLabel="RAWx — Flagship Brand & Visual Lab"
              ariaCurrent={activeTab === 'rawx-showcase' ? 'page' : undefined}
              isActive={activeTab === 'rawx-showcase'}
              activeStyle={getTabActiveStyle('rawx')}
              buttonSize="lg"
              buttonShape="rounded-xl"
              buttonStyle={{ backgroundColor: 'transparent', borderColor: 'transparent' }}
              title="RAWx"
              badge="19 ENGINES"
              badgeTone="amber"
              description="Flagship Brand & Visual Lab · 19 Interactive Slider Engines & Drops"
              align="center"
              position="bottom"
              isBangla={isBangla}
              accentColor={isDark ? '#d97706' : '#b45309'}
              icon={<RawxForgedIcon isActive={activeTab === 'rawx-showcase'} />}
            />

            <IconHoverCard
              href="#apps"
              onClick={(e) => handleTabNav(e, 'ecosystem')}
              ariaLabel="APPS — 24 Ecosystem Portals"
              ariaCurrent={activeTab === 'ecosystem' ? 'page' : undefined}
              isActive={activeTab === 'ecosystem'}
              activeStyle={getTabActiveStyle('apps')}
              buttonSize="lg"
              buttonShape="rounded-xl"
              buttonStyle={{ backgroundColor: 'transparent', borderColor: 'transparent' }}
              title={t.nav.apps}
              badge="24 PORTALS"
              badgeTone="emerald"
              description="Ecosystem Directory · Browse & Launch All 24 Portals"
              align="center"
              position="bottom"
              isBangla={isBangla}
              accentColor={isDark ? '#10b981' : '#059669'}
              icon={<AppsMatrixIcon isActive={activeTab === 'ecosystem'} />}
            />
          </div>
        </nav>

        {/* ZONE 3: Right Utility Dock (7 Tactile Icon-Only Buttons, 42x42px) */}
        <div className="order-2 md:order-3 flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* 1. Command Search (⌘K) */}
          <IconHoverCard
            onClick={onOpenCommandPalette}
            ariaLabel="Quick Jump Command Palette (Cmd+K)"
            buttonSize="md"
            buttonShape="rounded-xl"
            title="Quick Jump"
            badge="⌘K"
            description="Quick Jump (⌘K) · Instant search across 24 portals & tools"
            align="right"
            position="bottom"
            isBangla={isBangla}
            icon={<Search className="w-5 h-5" style={{ color: palette.accent }} />}
          />

          {/* 2. Sync Mesh (Live green indicator dot) */}
          <IconHoverCard
            onClick={onOpenSyncModal}
            ariaLabel="Multi-Device Mesh Sync"
            buttonSize="md"
            buttonShape="rounded-xl"
            title="Mesh Sync"
            badge={syncState.isConnected ? 'LIVE' : 'MESH'}
            badgeTone={syncState.isConnected ? 'emerald' : 'amber'}
            description={`Mesh Sync Active · ${syncState.roomId} · ${syncState.deviceCount} ${
              syncState.deviceCount === 1 ? 'Device' : 'Devices'
            } Connected`}
            align="right"
            position="bottom"
            isBangla={isBangla}
            accentColor="#10b981"
            cornerBadge={
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2" aria-hidden="true">
                {syncState.isConnected && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    syncState.isConnected ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
              </span>
            }
            icon={<Radio className="w-5 h-5" />}
          />

          {/* 3. Tasks (Compact corner count dot) */}
          <IconHoverCard
            href="#tasks"
            onClick={(e) => handleTabNav(e, 'tasks-hub')}
            ariaLabel={`Active Tasks (${tasksCount.pending} Open)`}
            ariaCurrent={activeTab === 'tasks-hub' ? 'page' : undefined}
            isActive={activeTab === 'tasks-hub'}
            activeStyle={
              activeTab === 'tasks-hub'
                ? {
                    backgroundColor: 'rgba(16, 185, 129, 0.16)',
                    borderColor: '#10b981',
                    color: '#10b981',
                  }
                : undefined
            }
            buttonSize="md"
            buttonShape="rounded-xl"
            title={t.nav.tasks}
            badge={`${tasksCount.pending} OPEN`}
            badgeTone="emerald"
            description={`Active Tasks · ${tasksCount.pending} Open / ${tasksCount.total} Total Operational Dispatches`}
            align="right"
            position="bottom"
            isBangla={isBangla}
            accentColor="#10b981"
            cornerBadge={
              tasksCount.pending > 0 ? (
                <span
                  aria-hidden="true"
                  className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-rose-600 text-white font-mono text-[9px] font-bold flex items-center justify-center tabular-nums shadow-sm border"
                  style={{ borderColor: 'var(--hh-bg)' }}
                >
                  {tasksCount.pending}
                </span>
              ) : undefined
            }
            icon={<CheckSquare className="w-5 h-5 text-emerald-500" />}
          />

          {/* 4. Language Selector (Globe Icon Only + 8-Language Dropdown) */}
          <div ref={langMenuRef} className="relative shrink-0">
            <IconHoverCard
              onClick={() => setIsLangOpen((prev) => !prev)}
              ariaLabel={`${t.theme.selectLanguage}: ${currentLangOption?.nativeLabel || language}`}
              ariaExpanded={isLangOpen}
              ariaHaspopup="listbox"
              isActive={isLangOpen}
              activeStyle={
                isLangOpen
                  ? {
                      backgroundColor: palette.accent,
                      borderColor: palette.accent,
                      color:
                        isDark && (themeTabKey === 'handfilm' || themeTabKey === 'rawx')
                          ? '#09090b'
                          : '#ffffff',
                    }
                  : undefined
              }
              suppressCard={isLangOpen}
              buttonSize="md"
              buttonShape="rounded-xl"
              title="Language"
              badge={currentLangOption?.shortLabel || language.toUpperCase()}
              description={`Language · Switch Interface Locale (${
                currentLangOption?.nativeLabel || 'English'
              })`}
              align="right"
              position="bottom"
              isBangla={isBangla}
              icon={<Globe className="w-5 h-5" />}
            />

            {isLangOpen && (
              <div
                role="listbox"
                aria-label={t.theme.selectLanguage}
                className="absolute right-0 top-full mt-3 w-52 rounded-2xl border backdrop-blur-2xl p-1.5 shadow-2xl z-50"
                style={{
                  backgroundColor: 'var(--hh-glass-bg)',
                  borderColor: 'var(--hh-border)',
                  color: 'var(--hh-text)',
                  boxShadow: 'var(--hh-card-shadow)',
                }}
              >
                {LANGUAGE_OPTIONS.map((opt) => {
                  const isSelected = language === opt.code;
                  const optIsBn = opt.code === 'bn';
                  return (
                    <button
                      key={opt.code}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        onSelectLanguage(opt.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 ${
                        optIsBn ? 'bangla-text' : 'font-sans'
                      }`}
                      style={
                        isSelected
                          ? {
                              backgroundColor: palette.accent,
                              color:
                                isDark && themeTabKey === 'handfilm'
                                  ? '#041218'
                                  : isDark && themeTabKey === 'rawx'
                                  ? '#0c0b0a'
                                  : '#ffffff',
                              fontWeight: 700,
                              ...(optIsBn ? { letterSpacing: 0 } : undefined),
                            }
                          : {
                              color: 'var(--hh-text)',
                              ...(optIsBn ? { letterSpacing: 0 } : undefined),
                            }
                      }
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        <span className="font-mono text-[10px] uppercase tracking-wider opacity-75 w-5 shrink-0">
                          {opt.shortLabel}
                        </span>
                        <span className="truncate">{opt.nativeLabel}</span>
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 5. Light / Dark Mode Toggle */}
          <IconHoverCard
            onClick={toggleColorMode}
            ariaLabel={isDark ? t.theme.switchToLight : t.theme.switchToDark}
            buttonSize="md"
            buttonShape="rounded-xl"
            title="Theme Mode"
            badge={colorMode === 'dark' ? 'DARK' : 'LIGHT'}
            description="Theme Mode · Switch Light & Dark Canvas"
            align="right"
            position="bottom"
            isBangla={isBangla}
            accentColor={palette.secondaryAccent}
            icon={
              isDark ? (
                <Sun
                  className="w-5 h-5 transition-transform duration-200 group-hover:rotate-45"
                  style={{ color: palette.secondaryAccent }}
                />
              ) : (
                <Moon
                  className="w-5 h-5 transition-transform duration-200 group-hover:-rotate-12"
                  style={{ color: palette.secondaryAccent }}
                />
              )
            }
          />

          {/* 6. Install App (PWA) */}
          <IconHoverCard
            onClick={handleInstallClick}
            ariaLabel="Install Desktop & Mobile Offline PWA"
            buttonSize="md"
            buttonShape="rounded-xl"
            title="Install App"
            badge={canInstallPwa ? 'READY' : installFeedback ? 'BROWSER MENU' : 'PWA'}
            badgeTone={canInstallPwa ? 'emerald' : 'neutral'}
            description={
              installFeedback
                ? 'Use browser menu → Install App for offline PWA access'
                : 'Install App · Desktop & Mobile Offline PWA'
            }
            hint={installFeedback ? 'PWA manifest active ✓' : 'Click to install →'}
            align="right"
            position="bottom"
            isBangla={isBangla}
            accentColor={palette.secondaryAccent}
            icon={<Download className="w-5 h-5" />}
          />

          {/* 7. Master Index */}
          <IconHoverCard
            onClick={onOpenIndex}
            ariaLabel="Portal Index — Jump to Any Wing (01–24)"
            buttonSize="md"
            buttonShape="rounded-xl"
            title="Portal Index"
            badge="01–24"
            description="Portal Index · Jump to Any Wing (01–24)"
            align="right"
            position="bottom"
            isBangla={isBangla}
            icon={<LayoutGrid className="w-5 h-5" />}
          />
        </div>
      </div>
    </header>
  );
}
// END OF FILE: src/components/navigation/TopCommandBar.tsx
