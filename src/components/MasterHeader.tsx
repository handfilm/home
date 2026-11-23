import React from 'react';
import { ActiveTab, ColorGrade, SyncState } from '../types';
import { GRADES } from '../data/initialData';
import {
  Smartphone,
  Layers,
  CheckSquare,
  SlidersHorizontal,
  Sparkles,
  Search,
  Volume2,
  VolumeX,
  Globe,
  Download,
  Home,
  Film,
} from 'lucide-react';
import { Language, TranslationDictionary } from '../i18n/translations';

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
  onToggleLanguage: () => void;
  canInstallPwa: boolean;
  onPromptInstall: () => void;
  t: TranslationDictionary;
}

export default function MasterHeader({
  activeTab,
  setActiveTab,
  accentColor,
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
  onToggleLanguage,
  canInstallPwa,
  onPromptInstall,
  t,
}: MasterHeaderProps) {
  const activeGradeObj = GRADES.find((g) => g.id === currentGrade) || GRADES[0];

  const handleTabNav = (e: React.MouseEvent<HTMLAnchorElement>, tab: ActiveTab) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    setActiveTab(tab);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-2 px-3 sm:px-8 py-3 bg-[#0A0B0D]/92 backdrop-blur-md border-b border-[#f3efe6]/10 transition-colors duration-200">
      {/* Left: Brand Identity & Quick Tools */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <a
          href="#home"
          onClick={(e) => handleTabNav(e, 'home')}
          className="flex items-center gap-2 text-[12.5px] sm:text-[14px] font-bold tracking-[0.08em] uppercase text-[#f3efe6] hover:opacity-90 transition-opacity cursor-pointer group whitespace-nowrap shrink-0"
          aria-label="Hands & Head Master OS Home"
        >
          <span
            className="w-2.5 h-2.5 rounded-full transition-colors duration-300 group-hover:scale-125 shrink-0"
            style={{
              backgroundColor:
                activeTab === 'home' || activeTab === 'handfilm'
                  ? '#e11d48'
                  : accentColor || '#C8A96A',
            }}
          />
          <span className="truncate">{t.brand.name}</span>
          <span className="hidden xl:inline text-[9px] tracking-[0.2em] text-[#C8A96A]/70 font-mono pl-2 border-l border-[#f3efe6]/20">
            {t.brand.tagline}
          </span>
        </a>

        {/* Command Palette Trigger Button (⌘K) */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          title="Open Command Palette (Cmd/Ctrl+K)"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#14161A] border border-[#f3efe6]/12 hover:border-[#f3efe6]/35 text-[10px] sm:text-[11px] font-mono tracking-wider transition-all cursor-pointer text-[#f3efe6]/70 hover:text-[#f3efe6] whitespace-nowrap shrink-0"
        >
          <Search className="w-3 h-3 text-[#C8A96A]" />
          <span className="hidden lg:inline">{t.nav.searchOrJump}</span>
          <span className="lg:hidden">⌘K</span>
        </button>

        {/* Live Multi-Device Sync Hardware Button */}
        <button
          type="button"
          onClick={onOpenSyncModal}
          title="Multi-Device Task Sync Status. Click to connect another device or view room."
          className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded bg-[#14161A] border border-[#f3efe6]/12 hover:border-[#f3efe6]/35 text-[10px] font-mono tracking-wider transition-all cursor-pointer group whitespace-nowrap shrink-0"
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
          <Smartphone className="w-3 h-3 text-[#f3efe6]/60 group-hover:text-[#f3efe6]" />
          <span className="text-[#f3efe6]/90 font-medium hidden xl:inline tabular-nums">
            <span className="text-emerald-400 font-semibold">{syncState.roomId}</span>
          </span>
          <span className="text-[#f3efe6]/50 text-[9px] tabular-nums">
            {syncState.deviceCount} {syncState.deviceCount === 1 ? 'DEV' : 'DEVS'}
          </span>
        </button>
      </div>

      {/* Center: Hardware-Style 4-Tab Top-Level Switcher (HOME | HANDFILM | APPS | SLIDERS) */}
      <nav
        aria-label="Primary Operating System Views"
        className="flex items-center gap-0.5 sm:gap-1 bg-[#14161A] p-1 rounded-lg border border-[#f3efe6]/15 font-mono text-[10.5px] sm:text-[11px] tracking-[0.14em] uppercase shadow-inner shrink-0"
      >
        <a
          href="#home"
          onClick={(e) => handleTabNav(e, 'home')}
          aria-current={activeTab === 'home' ? 'page' : undefined}
          className={`px-2.5 sm:px-3.5 py-1.5 rounded-md transition-all duration-150 cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            activeTab === 'home'
              ? 'bg-[#e11d48] text-white font-bold shadow-[0_0_16px_rgba(225,29,72,0.38)]'
              : 'text-[#f3efe6]/65 hover:text-[#f3efe6] hover:bg-[#f3efe6]/5'
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span>{t.nav.home}</span>
        </a>

        <a
          href="#handfilm"
          onClick={(e) => handleTabNav(e, 'handfilm')}
          aria-current={activeTab === 'handfilm' ? 'page' : undefined}
          title="HandFilm Studio — Product & AI Model Showcase"
          className={`px-2.5 sm:px-3.5 py-1.5 rounded-md transition-all duration-150 cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            activeTab === 'handfilm'
              ? 'bg-[#e11d48] text-white font-bold shadow-[0_0_16px_rgba(225,29,72,0.4)]'
              : 'text-[#f3efe6]/75 hover:text-[#f3efe6] hover:bg-[#f3efe6]/5'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span className={language === 'bn' ? 'bangla-text' : ''}>{t.nav.handfilm}</span>
        </a>

        <a
          href="#apps"
          onClick={(e) => handleTabNav(e, 'ecosystem')}
          aria-current={activeTab === 'ecosystem' ? 'page' : undefined}
          title="24-Section Ultra-Fast Stage Slider Engine"
          className={`px-2.5 sm:px-3.5 py-1.5 rounded-md transition-all duration-150 cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            activeTab === 'ecosystem'
              ? 'bg-[#f3efe6] text-[#0A0B0D] font-bold shadow-sm'
              : 'text-[#f3efe6]/65 hover:text-[#f3efe6] hover:bg-[#f3efe6]/5'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{t.nav.apps}</span>
        </a>

        <a
          href="#sliders"
          onClick={(e) => handleTabNav(e, 'rawx-showcase')}
          aria-current={activeTab === 'rawx-showcase' ? 'page' : undefined}
          title="RAWx 16 Ultra Sliders Visual Engine"
          className={`px-2.5 sm:px-3.5 py-1.5 rounded-md transition-all duration-150 cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            activeTab === 'rawx-showcase'
              ? 'bg-[#C8A96A] text-[#0A0B0D] font-bold shadow-[0_0_14px_rgba(200,169,106,0.28)]'
              : 'text-[#C8A96A]/85 hover:text-[#C8A96A] hover:bg-[#C8A96A]/10'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.nav.sliders}</span>
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
          className={`px-2 py-1.5 text-[10px] sm:text-[11px] uppercase tracking-wider border rounded transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            activeTab === 'tasks-hub'
              ? 'border-emerald-400 bg-emerald-400/15 text-emerald-300 font-bold'
              : 'border-[#f3efe6]/12 bg-[#14161A] text-[#f3efe6]/70 hover:border-[#f3efe6]/35 hover:text-[#f3efe6]'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden xl:inline">{t.nav.tasks}</span>
          {tasksCount.pending > 0 && (
            <span className="text-[9px] font-bold text-[#E50914] tabular-nums">
              {tasksCount.pending}
            </span>
          )}
        </a>

        {/* Ambient Audio Toggle */}
        <button
          type="button"
          onClick={onToggleSound}
          title={isSoundEnabled ? t.nav.soundOn : t.nav.soundOff}
          className={`px-2 py-1.5 text-[10px] sm:text-[11px] uppercase tracking-wider border rounded transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            isSoundEnabled
              ? 'border-emerald-400/80 bg-emerald-400/10 text-emerald-300 font-bold'
              : 'border-[#f3efe6]/12 bg-[#14161A] text-[#f3efe6]/60 hover:text-[#f3efe6]'
          }`}
        >
          {isSoundEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden 2xl:inline">{t.nav.sound}</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-[#f3efe6]/45" />
              <span className="hidden 2xl:inline">{t.nav.sound}</span>
            </>
          )}
        </button>

        {/* Language Switcher Button (EN / BN) */}
        <button
          type="button"
          onClick={onToggleLanguage}
          title="Switch Language (English / বাংলা)"
          className="px-2 py-1.5 text-[10px] sm:text-[11px] uppercase tracking-wider border border-[#f3efe6]/12 bg-[#14161A] hover:border-[#f3efe6]/35 text-[#f3efe6] transition-all cursor-pointer rounded flex items-center gap-1 whitespace-nowrap shrink-0"
        >
          <Globe className="w-3 h-3 text-[#C8A96A]" />
          <span className="font-bold">{language === 'en' ? 'EN' : 'বাং'}</span>
        </button>

        {/* PWA Install Button (if available) */}
        {canInstallPwa && (
          <button
            type="button"
            onClick={onPromptInstall}
            title={t.nav.installApp}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-[10px] uppercase tracking-wider border border-[#C8A96A]/60 bg-[#C8A96A]/10 text-[#C8A96A] hover:bg-[#C8A96A] hover:text-black transition-all cursor-pointer rounded font-bold whitespace-nowrap shrink-0"
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
          className={`hidden sm:flex px-2 py-1.5 text-[10px] sm:text-[11px] uppercase tracking-wider border rounded transition-all cursor-pointer items-center gap-1 whitespace-nowrap shrink-0 ${
            currentGrade !== 'off'
              ? 'border-[#C8A96A]/80 bg-[#C8A96A]/10 text-[#C8A96A] font-bold'
              : 'border-[#f3efe6]/12 bg-[#14161A] text-[#f3efe6]/70 hover:border-[#f3efe6]/35 hover:text-[#f3efe6]'
          }`}
        >
          <span>◈</span>
          <span className="hidden 2xl:inline">{activeGradeObj.name}</span>
        </button>

        {/* Speed / Easing console button */}
        <button
          type="button"
          onClick={onToggleConsole}
          title="Toggle speed and transition easing console"
          className={`hidden md:flex px-2 py-1.5 text-[10px] sm:text-[11px] uppercase tracking-wider border rounded transition-all cursor-pointer items-center gap-1 whitespace-nowrap shrink-0 ${
            isConsoleOpen
              ? 'border-[#f3efe6] bg-[#f3efe6] text-[#0A0B0D] font-bold'
              : 'border-[#f3efe6]/12 bg-[#14161A] text-[#f3efe6]/70 hover:border-[#f3efe6]/35 hover:text-[#f3efe6]'
          }`}
        >
          <SlidersHorizontal className="w-3 h-3" />
        </button>

        {/* Index Overlay Button */}
        <button
          type="button"
          onClick={onOpenIndex}
          className="px-2.5 sm:px-3 py-1.5 text-[10.5px] sm:text-[11px] uppercase tracking-[0.14em] text-[#f3efe6] border border-[#f3efe6]/20 hover:border-[#C8A96A] hover:bg-[#14161A] transition-all cursor-pointer rounded font-medium whitespace-nowrap shrink-0"
        >
          {t.nav.index}
        </button>
      </div>
    </header>
  );
}
