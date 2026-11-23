import React, { useState, useRef, useEffect } from 'react';
import { ActiveTab, ColorGrade, SyncState } from '../types';
import { GRADES } from '../data/initialData';
import {
  Smartphone,
  CheckSquare,
  SlidersHorizontal,
  Search,
  Volume2,
  VolumeX,
  Globe,
  Download,
  Sun,
  Moon,
  Check,
} from 'lucide-react';
import {
  Language,
  LANGUAGE_OPTIONS,
  TranslationDictionary,
} from '../i18n/translations';
import { useTheme } from '../context/ThemeContext';
import {
  HomeCoreIcon,
  HandfilmCinemaIcon,
  RawxForgedIcon,
  AppsMatrixIcon,
} from './navigation/BrandTabIcons';

interface MasterHeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  accentColor: string;
  syncState: SyncState;
  onOpenSyncModal: () => void;
  onOpenIndex: () => void;
  onOpenSectionManager: () => void;
  currentGrade: ColorGrade;
  onCycleGrade: () => void;
  onToggleConsole: () => void;
  isConsoleOpen: boolean;
  tasksCount: { total: number; pending: number; done: number };
  onOpenCommandPalette: () => void;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  language: Language;
  onSelectLanguage: (lang: Language) => void;
  canInstallPwa: boolean;
  onPromptInstall: () => void;
  t: TranslationDictionary;
}

export default function MasterHeader({
  activeTab,
  setActiveTab,
  syncState,
  onOpenSyncModal,
  onOpenIndex,
  currentGrade,
  onCycleGrade,
  onToggleConsole,
  isConsoleOpen,
  tasksCount,
  onOpenCommandPalette,
  isSoundEnabled,
  onToggleSound,
  language,
  onSelectLanguage,
  canInstallPwa,
  onPromptInstall,
  t,
}: MasterHeaderProps) {
  const { colorMode, toggleColorMode, themeTabKey, palette } = useTheme();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement | null>(null);
  const activeGradeObj = GRADES.find((g) => g.id === currentGrade) || GRADES[0];

  const handleTabNav = (e: React.MouseEvent<HTMLAnchorElement>, tab: ActiveTab) => {
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

  const isDark = colorMode === 'dark';

  const getTabActiveStyle = (tabKey: 'home' | 'handfilm' | 'rawx' | 'apps'): React.CSSProperties | undefined => {
    if (tabKey === 'home' && activeTab === 'home') {
      return {
        backgroundColor: palette.accent,
        color: '#ffffff',
        boxShadow: isDark
          ? '0 0 18px rgba(225, 29, 72, 0.42)'
          : '0 6px 16px rgba(190, 18, 60, 0.28)',
      };
    }
    if (tabKey === 'handfilm' && activeTab === 'handfilm') {
      return {
        backgroundColor: palette.accent,
        color: isDark ? '#041218' : '#ffffff',
        boxShadow: isDark
          ? '0 0 18px rgba(6, 182, 212, 0.38)'
          : '0 6px 16px rgba(2, 132, 199, 0.25)',
      };
    }
    if (tabKey === 'rawx' && activeTab === 'rawx-showcase') {
      return {
        backgroundColor: palette.accent,
        color: isDark ? '#0c0b0a' : '#ffffff',
        boxShadow: isDark
          ? '0 0 18px rgba(217, 119, 6, 0.38)'
          : '0 6px 16px rgba(180, 83, 9, 0.28)',
      };
    }
    if (tabKey === 'apps' && activeTab === 'ecosystem') {
      return {
        backgroundColor: isDark ? '#f3efe6' : '#0f172a',
        color: isDark ? '#09090b' : '#ffffff',
        boxShadow: isDark
          ? '0 0 14px rgba(16, 185, 129, 0.28)'
          : '0 6px 16px rgba(15, 23, 42, 0.22)',
      };
    }
    return undefined;
  };

  const currentLangOption = LANGUAGE_OPTIONS.find((opt) => opt.code === language);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-2 px-3 sm:px-8 py-2.5 backdrop-blur-xl hh-theme-transition border-b"
      style={{
        backgroundColor: 'var(--hh-header-bg)',
        borderColor: 'var(--hh-border)',
        color: 'var(--hh-text)',
      }}
    >
      {/* Left: Brand Identity & Quick Tools */}
      <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
        <a
          href="#home"
          onClick={(e) => handleTabNav(e, 'home')}
          className="flex items-center gap-2 text-[12px] sm:text-[13.5px] font-bold tracking-[0.08em] uppercase hover:opacity-90 transition-opacity cursor-pointer group whitespace-nowrap shrink-0"
          style={{ color: 'var(--hh-text)' }}
          aria-label="Hands & Head Master OS Home"
        >
          <span
            className="w-2.5 h-2.5 rounded-full transition-transform duration-300 group-hover:scale-125 shrink-0"
            style={{ backgroundColor: palette.accent }}
          />
          <span className={`truncate ${language === 'bn' ? 'bangla-text' : ''}`}>{t.brand.name}</span>
          <span
            className="hidden xl:inline text-[9px] tracking-[0.2em] font-mono pl-2 border-l"
            style={{
              color: palette.secondaryAccent,
              borderColor: 'var(--hh-border)',
            }}
          >
            {t.brand.tagline}
          </span>
        </a>

        {/* Command Palette Trigger Button (⌘K) */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          title="Open Command Palette (Cmd/Ctrl+K)"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-[10px] sm:text-[11px] font-mono tracking-wider hh-theme-transition cursor-pointer whitespace-nowrap shrink-0 hover:opacity-90"
          style={{
            backgroundColor: 'var(--hh-surface)',
            borderColor: 'var(--hh-border)',
            color: 'var(--hh-muted)',
          }}
        >
          <Search className="w-3 h-3 shrink-0" style={{ color: palette.accent }} />
          <span className="hidden lg:inline">{t.nav.searchOrJump}</span>
          <span className="lg:hidden">⌘K</span>
        </button>

        {/* Live Multi-Device Sync Hardware Button */}
        <button
          type="button"
          onClick={onOpenSyncModal}
          title="Multi-Device Task Sync Status"
          className="hidden md:flex items-center gap-1.5 px-2 py-1.5 rounded-md border text-[10px] font-mono tracking-wider hh-theme-transition cursor-pointer group whitespace-nowrap shrink-0"
          style={{
            backgroundColor: 'var(--hh-surface)',
            borderColor: 'var(--hh-border)',
            color: 'var(--hh-text)',
          }}
        >
          <div className="relative flex items-center justify-center">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                syncState.isConnected ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            {syncState.isConnected && (
              <span className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping opacity-75" />
            )}
          </div>
          <Smartphone className="w-3 h-3 opacity-65" />
          <span className="font-semibold hidden xl:inline tabular-nums text-emerald-500">
            {syncState.roomId}
          </span>
          <span className="opacity-60 text-[9px] tabular-nums">
            {syncState.deviceCount} {syncState.deviceCount === 1 ? 'DEV' : 'DEVS'}
          </span>
        </button>
      </div>

      {/* Center: Hardware 4-Tab Switcher (HOME | HANDFILM | RAWx | APPS) with Bold Custom Animated Icons */}
      <nav
        aria-label="Primary Operating System Views"
        data-active-theme-tab={themeTabKey}
        className="flex items-center gap-0.5 sm:gap-1 p-1 rounded-xl border font-mono text-[10.5px] sm:text-[11px] tracking-[0.12em] uppercase hh-theme-transition shrink-0"
        style={{
          backgroundColor: 'var(--hh-surface)',
          borderColor: 'var(--hh-border)',
          boxShadow: isDark ? 'inset 0 1px 0 rgba(255,255,255,0.04)' : '0 2px 10px rgba(15,23,42,0.05)',
        }}
      >
        <a
          href="#home"
          onClick={(e) => handleTabNav(e, 'home')}
          aria-current={activeTab === 'home' ? 'page' : undefined}
          style={getTabActiveStyle('home')}
          className={`group px-2.5 sm:px-3.5 py-1.5 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
            activeTab === 'home'
              ? 'font-bold'
              : 'opacity-75 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <HomeCoreIcon isActive={activeTab === 'home'} />
          <span className={language === 'bn' ? 'bangla-text' : ''}>{t.nav.home}</span>
        </a>

        <a
          href="#handfilm"
          onClick={(e) => handleTabNav(e, 'handfilm')}
          aria-current={activeTab === 'handfilm' ? 'page' : undefined}
          title="HandFilm Studio — Product & AI Model Showcase"
          style={getTabActiveStyle('handfilm')}
          className={`group px-2.5 sm:px-3.5 py-1.5 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
            activeTab === 'handfilm'
              ? 'font-bold'
              : 'opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <HandfilmCinemaIcon isActive={activeTab === 'handfilm'} />
          <span className={language === 'bn' ? 'bangla-text' : ''}>{t.nav.handfilm}</span>
        </a>

        <a
          href="#rawx"
          onClick={(e) => handleTabNav(e, 'rawx-showcase')}
          aria-current={activeTab === 'rawx-showcase' ? 'page' : undefined}
          title="RAWx — Hide, Steel & Heavyweight Apparel Storefront & 19-Drop Studio"
          style={getTabActiveStyle('rawx')}
          className={`group px-2.5 sm:px-3.5 py-1.5 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
            activeTab === 'rawx-showcase'
              ? 'font-bold'
              : 'opacity-85 hover:opacity-100 hover:bg-amber-500/10'
          }`}
        >
          <RawxForgedIcon isActive={activeTab === 'rawx-showcase'} />
          <span className="normal-case tracking-[0.10em] font-bold">RAWx</span>
        </a>

        <a
          href="#apps"
          onClick={(e) => handleTabNav(e, 'ecosystem')}
          aria-current={activeTab === 'ecosystem' ? 'page' : undefined}
          title="24-Section Ultra-Fast Stage Slider Engine"
          style={getTabActiveStyle('apps')}
          className={`group px-2.5 sm:px-3.5 py-1.5 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
            activeTab === 'ecosystem'
              ? 'font-bold'
              : 'opacity-75 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <AppsMatrixIcon isActive={activeTab === 'ecosystem'} />
          <span className={language === 'bn' ? 'bangla-text' : ''}>{t.nav.apps}</span>
        </a>
      </nav>

      {/* Right HUD Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2 font-mono shrink-0">
        {/* Tasks Sync Hub Quick Access */}
        <a
          href="#tasks"
          onClick={(e) => handleTabNav(e, 'tasks-hub')}
          aria-current={activeTab === 'tasks-hub' ? 'page' : undefined}
          title="Multi-Device Task Sync Hub"
          className={`px-2 py-1.5 text-[10px] sm:text-[11px] uppercase tracking-wider border rounded-lg hh-theme-transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            activeTab === 'tasks-hub'
              ? 'border-emerald-500 bg-emerald-500/15 text-emerald-500 font-bold'
              : 'hover:opacity-90'
          }`}
          style={
            activeTab === 'tasks-hub'
              ? undefined
              : {
                  backgroundColor: 'var(--hh-surface)',
                  borderColor: 'var(--hh-border)',
                  color: 'var(--hh-text)',
                }
          }
        >
          <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
          <span className="hidden xl:inline">{t.nav.tasks}</span>
          {tasksCount.pending > 0 && (
            <span className="text-[9px] font-bold text-rose-500 tabular-nums">
              {tasksCount.pending}
            </span>
          )}
        </a>

        {/* Ambient Audio Toggle */}
        <button
          type="button"
          onClick={onToggleSound}
          title={isSoundEnabled ? t.nav.soundOn : t.nav.soundOff}
          aria-label={isSoundEnabled ? t.nav.soundOn : t.nav.soundOff}
          className={`p-1.5 sm:px-2 sm:py-1.5 text-[10px] sm:text-[11px] uppercase tracking-wider border rounded-lg hh-theme-transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            isSoundEnabled ? 'border-emerald-500/80 bg-emerald-500/10 text-emerald-500 font-bold' : ''
          }`}
          style={
            isSoundEnabled
              ? undefined
              : {
                  backgroundColor: 'var(--hh-surface)',
                  borderColor: 'var(--hh-border)',
                  color: 'var(--hh-muted)',
                }
          }
        >
          {isSoundEnabled ? (
            <Volume2 className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 opacity-60" />
          )}
          <span className="hidden 2xl:inline">{t.nav.sound}</span>
        </button>

        {/* Global Light / Dark Mode Toggle Button (Icon-Only Pill) */}
        <button
          type="button"
          onClick={toggleColorMode}
          aria-label={isDark ? t.theme.switchToLight : t.theme.switchToDark}
          title={isDark ? t.theme.switchToLight : t.theme.switchToDark}
          className="w-8 h-8 rounded-full border flex items-center justify-center hh-theme-transition cursor-pointer shrink-0 hover:scale-105"
          style={{
            backgroundColor: 'var(--hh-surface)',
            borderColor: 'var(--hh-border)',
            color: palette.secondaryAccent,
          }}
        >
          {isDark ? (
            <Sun className="w-4 h-4 transition-transform duration-200 hover:rotate-45" />
          ) : (
            <Moon className="w-4 h-4 transition-transform duration-200 hover:-rotate-12" />
          )}
        </button>

        {/* 8-Language Icon-Only Dropdown (Globe icon only on closed trigger) */}
        <div ref={langMenuRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setIsLangOpen((prev) => !prev)}
            aria-haspopup="listbox"
            aria-expanded={isLangOpen}
            aria-label={`${t.theme.selectLanguage}: ${currentLangOption?.nativeLabel || language}`}
            title={`${t.theme.selectLanguage} (${currentLangOption?.nativeLabel || language})`}
            className="w-8 h-8 rounded-full border flex items-center justify-center hh-theme-transition cursor-pointer shrink-0 hover:scale-105"
            style={{
              backgroundColor: isLangOpen ? palette.accent : 'var(--hh-surface)',
              borderColor: isLangOpen ? palette.accent : 'var(--hh-border)',
              color: isLangOpen ? palette.accent === '#f3efe6' ? '#09090b' : '#ffffff' : palette.accent,
            }}
          >
            <Globe className="w-4 h-4" />
          </button>

          {isLangOpen && (
            <div
              role="listbox"
              aria-label={t.theme.selectLanguage}
              className="absolute right-0 top-full mt-2 w-52 rounded-2xl border backdrop-blur-2xl p-1.5 shadow-2xl z-50"
              style={{
                backgroundColor: 'var(--hh-glass-bg)',
                borderColor: 'var(--hh-border)',
                color: 'var(--hh-text)',
                boxShadow: 'var(--hh-card-shadow)',
              }}
            >
              {LANGUAGE_OPTIONS.map((opt) => {
                const isSelected = language === opt.code;
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
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                      opt.code === 'bn' ? 'bangla-text' : 'font-sans'
                    }`}
                    style={
                      isSelected
                        ? {
                            backgroundColor: palette.accent,
                            color: isDark && themeTabKey === 'handfilm' ? '#041218' : isDark && themeTabKey === 'rawx' ? '#0c0b0a' : '#ffffff',
                            fontWeight: 700,
                          }
                        : {
                            color: 'var(--hh-text)',
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

        {/* PWA Install Button (if available) */}
        {canInstallPwa && (
          <button
            type="button"
            onClick={onPromptInstall}
            title={t.nav.installApp}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-[10px] uppercase tracking-wider border rounded-lg transition-all cursor-pointer font-bold whitespace-nowrap shrink-0"
            style={{
              borderColor: palette.secondaryAccent,
              color: palette.secondaryAccent,
              backgroundColor: 'var(--hh-surface)',
            }}
          >
            <Download className="w-3 h-3" />
            <span>{t.nav.installApp}</span>
          </button>
        )}

        {/* Color Grade LUT Button */}
        <button
          type="button"
          onClick={onCycleGrade}
          title="Toggle Cinematic Film Grade LUT"
          className="hidden sm:flex px-2 py-1.5 text-[10px] sm:text-[11px] uppercase tracking-wider border rounded-lg hh-theme-transition cursor-pointer items-center gap-1 whitespace-nowrap shrink-0"
          style={{
            backgroundColor: currentGrade !== 'off' ? palette.accent : 'var(--hh-surface)',
            borderColor: currentGrade !== 'off' ? palette.accent : 'var(--hh-border)',
            color: currentGrade !== 'off' ? '#ffffff' : 'var(--hh-muted)',
          }}
        >
          <span>◈</span>
          <span className="hidden 2xl:inline">{activeGradeObj.name}</span>
        </button>

        {/* Speed / Easing console button */}
        <button
          type="button"
          onClick={onToggleConsole}
          title="Toggle speed and transition easing console"
          className="hidden md:flex px-2 py-1.5 text-[10px] sm:text-[11px] uppercase tracking-wider border rounded-lg hh-theme-transition cursor-pointer items-center gap-1 whitespace-nowrap shrink-0"
          style={{
            backgroundColor: isConsoleOpen ? palette.accent : 'var(--hh-surface)',
            borderColor: isConsoleOpen ? palette.accent : 'var(--hh-border)',
            color: isConsoleOpen ? '#ffffff' : 'var(--hh-muted)',
          }}
        >
          <SlidersHorizontal className="w-3 h-3" />
        </button>

        {/* Index Overlay Button */}
        <button
          type="button"
          onClick={onOpenIndex}
          className="px-2.5 sm:px-3 py-1.5 text-[10.5px] sm:text-[11px] uppercase tracking-[0.14em] border rounded-lg hh-theme-transition cursor-pointer font-medium whitespace-nowrap shrink-0"
          style={{
            backgroundColor: 'var(--hh-surface)',
            borderColor: 'var(--hh-border)',
            color: 'var(--hh-text)',
          }}
        >
          {t.nav.index}
        </button>
      </div>
    </header>
  );
}
// END OF FILE: src/components/MasterHeader.tsx
