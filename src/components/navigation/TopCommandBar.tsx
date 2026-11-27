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
  MoreVertical,
  Check,
  ChevronRight,
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

interface UtilityTileMeta {
  id: string;
  title: string;
  badge: string;
  description: string;
  accent: string;
  icon: React.ReactNode;
  onClick: () => void;
  hasChevron?: boolean;
  active?: boolean;
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
  const [isUtilityMenuOpen, setIsUtilityMenuOpen] = useState(false);
  const [isLangPickerExpanded, setIsLangPickerExpanded] = useState(false);
  const [hoveredUtilId, setHoveredUtilId] = useState<string>('search');
  const [installFeedback, setInstallFeedback] = useState(false);
  const utilityMenuRef = useRef<HTMLDivElement | null>(null);

  const isBangla = language === 'bn';

  const handleTabNav = (e: React.MouseEvent<HTMLElement>, tab: ActiveTab) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    setActiveTab(tab);
  };

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (utilityMenuRef.current && !utilityMenuRef.current.contains(e.target as Node)) {
        setIsUtilityMenuOpen(false);
        setIsLangPickerExpanded(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsUtilityMenuOpen(false);
        setIsLangPickerExpanded(false);
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
          ? '0 0 26px rgba(225, 29, 72, 0.48)'
          : '0 8px 22px rgba(190, 18, 60, 0.30)',
      };
    }
    if (tabKey === 'handfilm' && activeTab === 'handfilm') {
      return {
        backgroundColor: palette.accent,
        borderColor: palette.accent,
        color: isDark ? '#041218' : '#ffffff',
        boxShadow: isDark
          ? '0 0 26px rgba(6, 182, 212, 0.44)'
          : '0 8px 22px rgba(2, 132, 199, 0.28)',
      };
    }
    if (tabKey === 'rawx' && activeTab === 'rawx-showcase') {
      return {
        backgroundColor: palette.accent,
        borderColor: palette.accent,
        color: isDark ? '#0c0b0a' : '#ffffff',
        boxShadow: isDark
          ? '0 0 26px rgba(217, 119, 6, 0.46)'
          : '0 8px 22px rgba(180, 83, 9, 0.30)',
      };
    }
    if (tabKey === 'apps' && activeTab === 'ecosystem') {
      return {
        backgroundColor: isDark ? '#f3efe6' : '#0f172a',
        borderColor: isDark ? '#f3efe6' : '#0f172a',
        color: isDark ? '#09090b' : '#ffffff',
        boxShadow: isDark
          ? '0 0 22px rgba(16, 185, 129, 0.34)'
          : '0 8px 22px rgba(15, 23, 42, 0.26)',
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

  const utilityTiles: UtilityTileMeta[] = [
    {
      id: 'search',
      title: 'Quick Jump',
      badge: '⌘K',
      description: 'Instant search across all 24 portals, tools & shortcuts',
      accent: palette.accent,
      icon: <Search className="w-5 h-5" style={{ color: palette.accent }} />,
      onClick: () => {
        setIsUtilityMenuOpen(false);
        onOpenCommandPalette();
      },
    },
    {
      id: 'sync',
      title: 'Mesh Sync',
      badge: syncState.isConnected ? 'LIVE' : syncState.roomId,
      description: `Room ${syncState.roomId} · ${syncState.deviceCount} ${
        syncState.deviceCount === 1 ? 'Device' : 'Devices'
      } Connected`,
      accent: '#10b981',
      icon: <Radio className="w-5 h-5 text-emerald-500" />,
      onClick: () => {
        setIsUtilityMenuOpen(false);
        onOpenSyncModal();
      },
    },
    {
      id: 'tasks',
      title: t.nav.tasks,
      badge: `${tasksCount.pending} OPEN`,
      description: `${tasksCount.pending} Open / ${tasksCount.total} Total Operational Dispatches`,
      accent: '#10b981',
      active: activeTab === 'tasks-hub',
      icon: <CheckSquare className="w-5 h-5 text-emerald-500" />,
      onClick: () => {
        setIsUtilityMenuOpen(false);
        setActiveTab('tasks-hub');
      },
    },
    {
      id: 'language',
      title: 'Language',
      badge: currentLangOption?.shortLabel || language.toUpperCase(),
      description: `Active: ${currentLangOption?.nativeLabel || 'English'} · 8 Languages`,
      accent: palette.accent,
      hasChevron: true,
      active: isLangPickerExpanded,
      icon: <Globe className="w-5 h-5" />,
      onClick: () => setIsLangPickerExpanded((prev) => !prev),
    },
    {
      id: 'theme',
      title: 'Theme Canvas',
      badge: colorMode === 'dark' ? 'DARK' : 'LIGHT',
      description: isDark ? 'Switch to Crisp Light Mode' : 'Switch to Obsidian Dark Mode',
      accent: palette.secondaryAccent,
      icon: isDark ? (
        <Sun className="w-5 h-5" style={{ color: palette.secondaryAccent }} />
      ) : (
        <Moon className="w-5 h-5" style={{ color: palette.secondaryAccent }} />
      ),
      onClick: () => toggleColorMode(),
    },
    {
      id: 'install',
      title: 'Install PWA',
      badge: canInstallPwa ? 'READY' : installFeedback ? 'MENU' : 'APP',
      description: installFeedback
        ? 'Use browser menu → Install App for offline PWA mode'
        : 'Install Desktop & Mobile Offline Progressive App',
      accent: palette.secondaryAccent,
      icon: <Download className="w-5 h-5" />,
      onClick: () => {
        void handleInstallClick();
      },
    },
    {
      id: 'index',
      title: 'Portal Index',
      badge: '01–24',
      description: 'Jump directly to any Ecosystem Wing (01–24)',
      accent: palette.accent,
      icon: <LayoutGrid className="w-5 h-5" />,
      onClick: () => {
        setIsUtilityMenuOpen(false);
        onOpenIndex();
      },
    },
  ];

  const activeHoveredTile =
    utilityTiles.find((item) => item.id === hoveredUtilId) || utilityTiles[0];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-2xl hh-theme-transition"
      style={{
        backgroundColor: 'var(--hh-header-bg)',
        borderColor: 'var(--hh-border)',
        color: 'var(--hh-text)',
      }}
    >
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 py-2 flex flex-wrap md:flex-nowrap items-center justify-between gap-x-4 gap-y-2">
        {/* ZONE 1: Left Brand Lockup (Logo + SUPER BOLD Tagline Beneath) */}
        <a
          href="#home"
          onClick={(e) => handleTabNav(e, 'home')}
          className="group flex flex-col justify-center min-w-0 shrink-0 cursor-pointer hover:opacity-95 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-lg py-0.5"
          style={{ color: 'var(--hh-text)' }}
          aria-label="HANDS & HEAD — One Core, Many Worlds."
        >
          <span className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full transition-transform duration-300 group-hover:scale-125 shrink-0"
              style={{ backgroundColor: palette.accent }}
              aria-hidden="true"
            />
            <span
              className={`text-lg sm:text-xl font-extrabold uppercase leading-none whitespace-nowrap ${
                isBangla ? 'bangla-text tracking-normal' : 'tracking-[0.14em]'
              }`}
              style={isBangla ? { letterSpacing: 0 } : undefined}
            >
              {t.brand.name}
            </span>
          </span>
          <span
            className={`text-xs sm:text-[13.5px] font-black tracking-tight mt-1 leading-none pl-[18px] whitespace-nowrap ${
              isBangla ? 'bangla-text' : ''
            }`}
            style={{
              color: palette.secondaryAccent,
              ...(isBangla ? { letterSpacing: 0 } : undefined),
            }}
          >
            {t.home.motto}
          </span>
        </a>

        {/* ZONE 2: Center Primary Module Dock (MUCH BIGGER HOME, HANDFILM, RAWx, APPS) */}
        <nav
          aria-label="Primary Operating System Views"
          data-active-theme-tab={themeTabKey}
          className="order-3 md:order-2 w-full md:w-auto flex items-center justify-center shrink-0"
        >
          <div
            className="inline-flex items-center gap-2 sm:gap-2.5 p-1.5 rounded-2xl border hh-theme-transition"
            style={{
              backgroundColor: 'var(--hh-surface)',
              borderColor: 'var(--hh-border)',
              boxShadow: isDark
                ? 'inset 0 1px 0 rgba(255,255,255,0.05), 0 12px 32px rgba(0,0,0,0.4)'
                : '0 6px 20px rgba(15,23,42,0.06)',
            }}
          >
            <IconHoverCard
              href="#home"
              onClick={(e) => handleTabNav(e, 'home')}
              ariaLabel="HOME — Enterprise Command Core"
              ariaCurrent={activeTab === 'home' ? 'page' : undefined}
              isActive={activeTab === 'home'}
              activeStyle={getTabActiveStyle('home')}
              buttonSize="xl"
              buttonShape="rounded-2xl"
              buttonStyle={{ backgroundColor: 'transparent', borderColor: 'transparent' }}
              title={t.nav.home}
              badge="CORE"
              urlLabel="handsandhead.com"
              description="Enterprise Command Core · Operating Pillars & Routing Matrix"
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
              buttonSize="xl"
              buttonShape="rounded-2xl"
              buttonStyle={{ backgroundColor: 'transparent', borderColor: 'transparent' }}
              title={t.nav.handfilm}
              badge="STUDIO"
              urlLabel="storyboard.handsandhead.com"
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
              buttonSize="xl"
              buttonShape="rounded-2xl"
              buttonStyle={{ backgroundColor: 'transparent', borderColor: 'transparent' }}
              title="RAWx"
              badge="19 ENGINES"
              badgeTone="amber"
              urlLabel="rawx.handsandhead.com"
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
              buttonSize="xl"
              buttonShape="rounded-2xl"
              buttonStyle={{ backgroundColor: 'transparent', borderColor: 'transparent' }}
              title={t.nav.apps}
              badge="24 PORTALS"
              badgeTone="emerald"
              urlLabel="apps.handsandhead.com"
              description="Ecosystem Directory · Browse & Launch All 24 Portals"
              align="center"
              position="bottom"
              isBangla={isBangla}
              accentColor={isDark ? '#10b981' : '#059669'}
              icon={<AppsMatrixIcon isActive={activeTab === 'ecosystem'} />}
            />
          </div>
        </nav>

        {/* ZONE 3: Very Low Priority Utility Menu (Quiet 3-Dots Smart Dropdown) */}
        <div ref={utilityMenuRef} className="order-2 md:order-3 relative flex items-center shrink-0">
          <IconHoverCard
            onClick={() => setIsUtilityMenuOpen((prev) => !prev)}
            ariaLabel="System Utilities & Settings Menu"
            ariaExpanded={isUtilityMenuOpen}
            ariaHaspopup="menu"
            isActive={isUtilityMenuOpen}
            suppressCard={isUtilityMenuOpen}
            buttonSize="sm"
            buttonShape="rounded-xl"
            buttonClassName="opacity-70 hover:opacity-100"
            buttonStyle={{
              backgroundColor: isUtilityMenuOpen ? 'var(--hh-surface-2)' : 'transparent',
              borderColor: isUtilityMenuOpen ? 'var(--hh-border)' : 'transparent',
            }}
            title="System Utilities"
            badge="7 TOOLS"
            description="Quick Jump ⌘K · Sync · Tasks · 8 Languages · Theme · PWA · Index"
            align="right"
            position="bottom"
            isBangla={isBangla}
            cornerBadge={
              tasksCount.pending > 0 ? (
                <span
                  aria-hidden="true"
                  className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500"
                />
              ) : undefined
            }
            icon={<MoreVertical className="w-[18px] h-[18px]" style={{ color: 'var(--hh-muted)' }} />}
          />

          {/* Smart 3-Dots Dropdown with Super Smart Icons + Animated Hover Preview Card */}
          {isUtilityMenuOpen && (
            <div
              role="menu"
              aria-label="Workspace Utilities"
              className="absolute right-0 top-full mt-3 w-[320px] sm:w-[344px] max-w-[calc(100vw-1.5rem)] rounded-2xl border backdrop-blur-2xl p-3.5 shadow-2xl z-50 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                backgroundColor: 'var(--hh-glass-bg)',
                borderColor: 'var(--hh-border)',
                color: 'var(--hh-text)',
                boxShadow: isDark
                  ? '0 28px 60px rgba(0, 0, 0, 0.72), inset 0 1px 0 rgba(255,255,255,0.06)'
                  : '0 24px 52px rgba(15, 23, 42, 0.16)',
              }}
            >
              {/* Smart 4-Column Square Icon Matrix */}
              <div className="grid grid-cols-4 gap-2">
                {utilityTiles.map((tile) => {
                  const isFocused = hoveredUtilId === tile.id;
                  return (
                    <button
                      key={tile.id}
                      type="button"
                      role="menuitem"
                      aria-label={tile.title}
                      onMouseEnter={() => setHoveredUtilId(tile.id)}
                      onFocus={() => setHoveredUtilId(tile.id)}
                      onClick={tile.onClick}
                      className={`group relative aspect-square rounded-xl border flex flex-col items-center justify-center gap-1 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer hover:scale-105 hover:-translate-y-0.5 active:scale-95 ${
                        tile.active ? 'ring-1' : ''
                      }`}
                      style={{
                        backgroundColor:
                          isFocused || tile.active ? 'var(--hh-surface-2)' : 'var(--hh-surface)',
                        borderColor:
                          isFocused || tile.active ? tile.accent : 'var(--hh-border)',
                        color: 'var(--hh-text)',
                      }}
                    >
                      <div className="transition-transform duration-200 group-hover:scale-110">
                        {tile.icon}
                      </div>

                      {tile.id === 'tasks' && tasksCount.pending > 0 && (
                        <span
                          aria-hidden="true"
                          className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-rose-600 text-white font-mono text-[9px] font-bold flex items-center justify-center tabular-nums"
                        >
                          {tasksCount.pending}
                        </span>
                      )}

                      {tile.id === 'sync' && syncState.isConnected && (
                        <span
                          aria-hidden="true"
                          className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500"
                        />
                      )}

                      {tile.hasChevron && (
                        <ChevronRight
                          className={`w-3 h-3 absolute bottom-1 right-1 opacity-60 transition-transform ${
                            isLangPickerExpanded ? 'rotate-90' : ''
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Animated Hover Detail Card inside the 3-Dots Menu */}
              <div
                key={activeHoveredTile.id}
                className="mt-3 rounded-xl border p-3 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  backgroundColor: 'var(--hh-surface)',
                  borderColor: 'var(--hh-border)',
                }}
              >
                <div
                  className="h-[2.5px] w-10 rounded-full mb-2 transition-all duration-200"
                  style={{ backgroundColor: activeHoveredTile.accent }}
                />
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[14px] font-extrabold tracking-tight" style={{ color: 'var(--hh-text)' }}>
                    {activeHoveredTile.title}
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-md border font-mono text-[10px] font-bold uppercase tracking-wider tabular-nums"
                    style={{
                      backgroundColor: 'var(--hh-surface-2)',
                      borderColor: 'var(--hh-border)',
                      color: activeHoveredTile.accent,
                    }}
                  >
                    {activeHoveredTile.badge}
                  </span>
                </div>
                <p
                  className={`text-[12.5px] leading-snug ${isBangla ? 'bangla-text' : ''}`}
                  style={{
                    color: 'var(--hh-muted)',
                    ...(isBangla ? { letterSpacing: 0 } : undefined),
                  }}
                >
                  {activeHoveredTile.description}
                </p>
              </div>

              {/* Inline Expandable 8-Language Selector */}
              {isLangPickerExpanded && (
                <div
                  role="listbox"
                  aria-label={t.theme.selectLanguage}
                  className="mt-2.5 pt-2.5 border-t grid grid-cols-2 gap-1.5"
                  style={{ borderColor: 'var(--hh-border)' }}
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
                          setIsLangPickerExpanded(false);
                          setIsUtilityMenuOpen(false);
                        }}
                        className={`flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 ${
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
                        <span className="truncate">{opt.nativeLabel}</span>
                        {isSelected ? (
                          <Check className="w-3 h-3 shrink-0" />
                        ) : (
                          <span className="font-mono text-[9.5px] opacity-60">{opt.shortLabel}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
// END OF FILE: src/components/navigation/TopCommandBar.tsx
