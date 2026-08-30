import React from 'react';
import { ActiveTab, ColorGrade, SyncState } from '../types';
import { GRADES } from '../data/initialData';
import {
  Smartphone,
  Layers,
  PlusCircle,
  CheckSquare,
  SlidersHorizontal,
  Sparkles,
  Search,
  Volume2,
  VolumeX,
  Globe,
  Download,
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
  onOpenSectionManager,
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-3 sm:px-8 py-3.5 bg-[#0e0d0b]/90 backdrop-blur-md border-b border-[#f3efe6]/10 transition-all duration-300">
      {/* Left: Brand Identity & Search Quick Jump */}
      <div className="flex items-center gap-2.5 sm:gap-5">
        <button
          onClick={() => setActiveTab('ecosystem')}
          className="flex items-center gap-2 text-[12.5px] sm:text-[14.5px] font-bold tracking-[0.08em] uppercase text-[#f3efe6] hover:opacity-90 transition-opacity cursor-pointer group"
          aria-label="Hands & Head Master Logo"
        >
          <span
            className="w-2.5 h-2.5 rounded-full transition-colors duration-500 group-hover:scale-125"
            style={{ backgroundColor: accentColor || '#b14a26' }}
          />
          <span className="truncate">{t.brand.name}</span>
          <span className="hidden lg:inline text-[9px] tracking-[0.2em] text-[#f3efe6]/40 font-mono pl-1 border-l border-[#f3efe6]/20">
            {t.brand.tagline}
          </span>
        </button>

        {/* Command Palette Trigger Button (⌘K) */}
        <button
          onClick={onOpenCommandPalette}
          title="Open Command Palette (Cmd/Ctrl+K)"
          className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#161512] border border-[#f3efe6]/15 hover:border-[#f3efe6]/40 text-[10px] sm:text-[11px] font-mono tracking-wider transition-all cursor-pointer group text-[#f3efe6]/70 hover:text-[#f3efe6]"
        >
          <Search className="w-3 h-3 text-[#c8b89a]" />
          <span className="hidden md:inline">{t.nav.searchOrJump}</span>
          <span className="md:hidden">⌘K</span>
        </button>

        {/* Live Multi-Device Sync Pill Button */}
        <button
          onClick={onOpenSyncModal}
          title="Multi-Device Task Sync Status. Click to connect another device or view room."
          className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded bg-[#161512] border border-[#f3efe6]/15 hover:border-[#f3efe6]/40 text-[10px] font-mono tracking-wider transition-all cursor-pointer group shadow-sm"
        >
          <div className="relative flex items-center justify-center">
            <span
              className={`w-2 h-2 rounded-full ${
                syncState.isConnected ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            {syncState.isConnected && (
              <span className="absolute w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-75" />
            )}
          </div>
          <Smartphone className="w-3 h-3 text-[#f3efe6]/60 group-hover:text-[#f3efe6]" />
          <span className="text-[#f3efe6]/90 font-medium hidden md:inline">
            SYNC: <span className="text-emerald-400 font-semibold">{syncState.roomId}</span>
          </span>
          <span className="text-[#f3efe6]/50 text-[9px] bg-[#f3efe6]/10 px-1.5 py-0.2 rounded">
            {syncState.deviceCount} {syncState.deviceCount === 1 ? 'DEV' : 'DEVS'}
          </span>
        </button>
      </div>

      {/* Center: Main View Navigation */}
      <nav className="flex items-center gap-1 bg-[#161512] p-1 rounded-lg border border-[#f3efe6]/15 font-mono text-[10.5px] sm:text-[11.5px] tracking-wider uppercase shadow-inner">
        <button
          onClick={() => setActiveTab('ecosystem')}
          className={`px-2 sm:px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'ecosystem'
              ? 'bg-[#f3efe6] text-[#0e0d0b] font-bold shadow-sm'
              : 'text-[#f3efe6]/60 hover:text-[#f3efe6] hover:bg-[#f3efe6]/5'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden xs:inline sm:inline">{t.nav.stage}</span>
        </button>

        <button
          onClick={() => setActiveTab('rawx-showcase')}
          title="Open RAWx Master OS Ultra Slider System with all 16 slider architectures"
          className={`px-2 sm:px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5 relative ${
            activeTab === 'rawx-showcase'
              ? 'bg-amber-400 text-[#0e0d0b] font-bold shadow-md shadow-amber-400/20'
              : 'text-amber-300 hover:text-amber-200 hover:bg-amber-400/10 border border-amber-400/30'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:animate-spin" />
          <span className="font-bold">{t.nav.sliders16}</span>
        </button>

        <button
          onClick={() => setActiveTab('tasks-hub')}
          className={`px-2 sm:px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'tasks-hub'
              ? 'bg-[#f3efe6] text-[#0e0d0b] font-bold shadow-sm'
              : 'text-[#f3efe6]/60 hover:text-[#f3efe6] hover:bg-[#f3efe6]/5'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5" />
          <span className="hidden xs:inline sm:inline">{t.nav.tasks}</span>
          {tasksCount.pending > 0 && (
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'tasks-hub'
                  ? 'bg-[#0e0d0b] text-[#f3efe6]'
                  : 'bg-[#b14a26] text-white'
              }`}
            >
              {tasksCount.pending}
            </span>
          )}
        </button>
      </nav>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 font-mono">
        {/* Ambient Audio Toggle */}
        <button
          onClick={onToggleSound}
          title={isSoundEnabled ? t.nav.soundOn : t.nav.soundOff}
          className={`px-2 py-1.5 text-[10px] sm:text-[11px] uppercase tracking-wider border rounded transition-all cursor-pointer flex items-center gap-1.5 ${
            isSoundEnabled
              ? 'border-emerald-400/80 bg-emerald-400/10 text-emerald-300 font-bold'
              : 'border-[#f3efe6]/15 bg-[#141310] text-[#f3efe6]/60 hover:text-[#f3efe6]'
          }`}
        >
          {isSoundEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">{t.nav.sound}</span>
              <span className="flex items-center gap-0.5 h-2.5">
                <span className="w-0.5 h-2.5 bg-emerald-400 animate-pulse" />
                <span className="w-0.5 h-1.5 bg-emerald-400 animate-pulse" />
                <span className="w-0.5 h-3 bg-emerald-400 animate-pulse" />
              </span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-[#f3efe6]/40" />
              <span className="hidden md:inline">{t.nav.sound}</span>
            </>
          )}
        </button>

        {/* Language Switcher Button (EN / BN) */}
        <button
          onClick={onToggleLanguage}
          title="Switch Language (English / বাংলা)"
          className="px-2 py-1.5 text-[10px] sm:text-[11px] uppercase tracking-wider border border-[#f3efe6]/15 bg-[#141310] hover:border-[#f3efe6]/40 text-[#f3efe6] transition-all cursor-pointer rounded flex items-center gap-1"
        >
          <Globe className="w-3 h-3 text-cyan-400" />
          <span className="font-bold">{language === 'en' ? 'EN' : 'বাং'}</span>
        </button>

        {/* PWA Install Button (if available) */}
        {canInstallPwa && (
          <button
            onClick={onPromptInstall}
            title={t.nav.installApp}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-[10px] uppercase tracking-wider border border-amber-400/60 bg-amber-400/10 text-amber-300 hover:bg-amber-400 hover:text-black transition-all cursor-pointer rounded font-bold"
          >
            <Download className="w-3 h-3" />
            <span>{t.nav.installApp}</span>
          </button>
        )}

        {/* Color Grade LUT Button */}
        <button
          onClick={onCycleGrade}
          title="Toggle Cinematic Film Grade LUT"
          className={`px-2 py-1.5 text-[10px] sm:text-[11px] uppercase tracking-wider border rounded transition-all cursor-pointer flex items-center gap-1 ${
            currentGrade !== 'off'
              ? 'border-amber-400/80 bg-amber-400/10 text-amber-300 font-bold'
              : 'border-[#f3efe6]/15 bg-[#141310] text-[#f3efe6]/70 hover:border-[#f3efe6]/40 hover:text-[#f3efe6]'
          }`}
        >
          <span>◈</span>
          <span className="hidden lg:inline">{t.nav.grade}:</span>
          <span>{activeGradeObj.label}</span>
        </button>

        {/* Speed / Easing console button */}
        <button
          onClick={onToggleConsole}
          title="Toggle speed and transition easing console"
          className={`px-2 py-1.5 text-[10px] sm:text-[11px] uppercase tracking-wider border rounded transition-all cursor-pointer flex items-center gap-1 ${
            isConsoleOpen
              ? 'border-[#f3efe6] bg-[#f3efe6] text-[#0e0d0b] font-bold'
              : 'border-[#f3efe6]/15 bg-[#141310] text-[#f3efe6]/70 hover:border-[#f3efe6]/40 hover:text-[#f3efe6]'
          }`}
        >
          <SlidersHorizontal className="w-3 h-3" />
          <span className="hidden xl:inline">{t.nav.speed}</span>
        </button>

        {/* Index Overlay Button */}
        <button
          onClick={onOpenIndex}
          className="px-2.5 sm:px-3 py-1.5 text-[10.5px] sm:text-[11.5px] uppercase tracking-[0.14em] text-[#f3efe6] border border-[#f3efe6]/25 hover:border-[#f3efe6] hover:bg-[#f3efe6]/10 transition-all cursor-pointer rounded font-medium"
        >
          {t.nav.index}
        </button>
      </div>
    </header>
  );
}
