import React, { useState, useEffect, useRef, useMemo } from 'react';
import { SectionItem, ActiveTab } from '../types';
import { Search, CornerDownLeft, Sparkles, CheckSquare, Layers, Volume2, Globe, Download, Smartphone, SlidersHorizontal, Home, Film, Factory, Sun, Moon } from 'lucide-react';
import { Language, LANGUAGE_OPTIONS, TranslationDictionary } from '../i18n/translations';
import { trackEvent } from '../services/analytics';
import { ColorMode } from '../context/ThemeContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  sections: SectionItem[];
  onSelectSection: (index: number) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onToggleSound: () => void;
  isSoundEnabled: boolean;
  language: Language;
  onSelectLanguage: (lang: Language) => void;
  colorMode: ColorMode;
  onToggleTheme: () => void;
  onCycleGrade: () => void;
  onOpenSyncModal: () => void;
  onOpenSpeedConsole: () => void;
  onPromptInstall: () => void;
  canInstallPwa: boolean;
  t: TranslationDictionary;
}

interface CommandItem {
  id: string;
  category: 'portals' | 'views' | 'controls' | 'system';
  title: string;
  subtitle: string;
  shortcut?: string;
  icon: React.ReactNode;
  keywords: string[];
  action: () => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
  sections,
  onSelectSection,
  setActiveTab,
  onToggleSound,
  isSoundEnabled,
  language,
  onSelectLanguage,
  colorMode,
  onToggleTheme,
  onCycleGrade,
  onOpenSyncModal,
  onOpenSpeedConsole,
  onPromptInstall,
  canInstallPwa,
  t,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      trackEvent('MASTER_COMMAND_PALETTE_OPEN');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Build command list
  const commands: CommandItem[] = useMemo(() => {
    const list: CommandItem[] = [];

    // 1. Portals
    sections.forEach((sec, idx) => {
      list.push({
        id: `portal-${sec.id}`,
        category: 'portals',
        title: sec.title,
        subtitle: sec.sub,
        shortcut: `Jump #${idx + 1}`,
        icon: <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sec.accent || '#b14a26' }} />,
        keywords: [
          sec.id,
          sec.title.toLowerCase(),
          sec.sub.toLowerCase(),
          sec.category.toLowerCase(),
          sec.url.toLowerCase(),
          sec.id === 'd2c' ? 'shop commerce store buy leather drop' : '',
          sec.id === 'b2b' ? 'wholesale corporate order enterprise arutemika' : '',
          sec.id === 'articles' ? 'read essay research news blog post editorial' : '',
          sec.id === 'handfilm' ? 'video stream cinema film movie trailer' : '',
        ],
        action: () => {
          onSelectSection(idx);
          setActiveTab('ecosystem');
          onClose();
        },
      });
    });

    // 2. View Switches
    list.push({
      id: 'view-home',
      category: 'views',
      title: 'HOME — Enterprise Overview',
      subtitle: 'HANDS & HEAD Main Hub, 3 Core Pillars & Live Telemetry',
      shortcut: 'Key 1',
      icon: <Home className="w-3.5 h-3.5 text-[#e11d48]" />,
      keywords: ['home', 'main', 'hub', 'overview', 'landing', 'pillars'],
      action: () => {
        setActiveTab('home');
        onClose();
      },
    });

    list.push({
      id: 'view-handfilm',
      category: 'views',
      title: 'HANDFILM — Product & AI Model Hub',
      subtitle: 'Easy, Beast, CapCut & AD Studio showcase connected to Storyboard',
      shortcut: 'Key 5',
      icon: <Film className="w-3.5 h-3.5 text-[#06b6d4]" />,
      keywords: ['handfilm', 'capcut', 'beast', 'easy', 'ad studio', 'storyboard', 'ai', 'editor'],
      action: () => {
        setActiveTab('handfilm');
        onClose();
      },
    });

    list.push({
      id: 'view-stage',
      category: 'views',
      title: 'APPS — 24-Section Stage Slider',
      subtitle: 'Primary full-screen 24-module ecosystem showcase',
      shortcut: 'Key 2',
      icon: <Layers className="w-3.5 h-3.5 text-emerald-400" />,
      keywords: ['apps', 'stage', 'slider', 'ecosystem', '24', 'portal'],
      action: () => {
        setActiveTab('ecosystem');
        onClose();
      },
    });

    list.push({
      id: 'view-rawx',
      category: 'views',
      title: 'RAWx — Hide, Steel & 19-Drop Studio',
      subtitle: 'Standalone RAWx Brand Storefront + 19 Interactive Slider Engines',
      shortcut: 'Key 3',
      icon: <Sparkles className="w-3.5 h-3.5 text-amber-500" />,
      keywords: ['rawx', 'hide', 'steel', '316l', 'apparel', 'sliders', '19', 'lookbook', 'drops', 'showcase'],
      action: () => {
        setActiveTab('rawx-showcase');
        onClose();
      },
    });

    list.push({
      id: 'view-tasks',
      category: 'views',
      title: 'Multi-Device Task Sync Hub',
      subtitle: 'Bidirectional encrypted project task management',
      shortcut: 'Key 4',
      icon: <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />,
      keywords: ['tasks', 'todo', 'sync', 'devices', 'project', 'hub'],
      action: () => {
        setActiveTab('tasks-hub');
        onClose();
      },
    });

    list.push({
      id: 'ext-storyboard',
      category: 'portals',
      title: 'Handfilm & Storyboard (WebGL2 AI Video)',
      subtitle: 'storyboard.handsandhead.com — NLE Editor, Player & Cloudflare Host',
      shortcut: 'External ↗',
      icon: <Film className="w-3.5 h-3.5 text-[#e11d48]" />,
      keywords: ['handfilm', 'storyboard', 'webgl2', 'video', 'nle', 'cinema', 'ai'],
      action: () => {
        window.open('https://storyboard.handsandhead.com/', '_blank', 'noopener,noreferrer');
        onClose();
      },
    });

    list.push({
      id: 'ext-b2b-wings',
      category: 'portals',
      title: 'B2B & Industrial Wings',
      subtitle: 'b2b.handsandhead.com — RMG, Streetwear, Leather, Jackets & 316L/516SS',
      shortcut: 'External ↗',
      icon: <Factory className="w-3.5 h-3.5 text-amber-500" />,
      keywords: ['b2b', 'industrial', 'rmg', 'streetwear', 'leather', 'jackets', '316l', '516ss', 'hardware'],
      action: () => {
        window.open('https://b2b.handsandhead.com/', '_blank', 'noopener,noreferrer');
        onClose();
      },
    });

    // 3. Workspace Controls & Settings
    list.push({
      id: 'control-theme',
      category: 'controls',
      title: colorMode === 'dark' ? t.theme.switchToLight : t.theme.switchToDark,
      subtitle: 'Adapt all 4 OS tabs cleanly between Dark and Light palettes',
      shortcut: colorMode === 'dark' ? 'Light' : 'Dark',
      icon: colorMode === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-sky-500" />,
      keywords: ['theme', 'light', 'dark', 'mode', 'appearance'],
      action: () => {
        onToggleTheme();
        onClose();
      },
    });

    list.push({
      id: 'control-sound',
      category: 'controls',
      title: isSoundEnabled ? 'Disable Ambient Audio Layer' : 'Enable Ambient Audio Layer (Web Audio)',
      subtitle: isSoundEnabled ? 'Currently playing procedural soundscape' : 'Off by default · Generates organic synthesized drones',
      shortcut: 'Audio',
      icon: <Volume2 className={`w-3.5 h-3.5 ${isSoundEnabled ? 'text-emerald-400' : 'opacity-60'}`} />,
      keywords: ['sound', 'audio', 'music', 'drone', 'ambient', 'synth', 'mute', 'unmute'],
      action: () => {
        onToggleSound();
        onClose();
      },
    });

    LANGUAGE_OPTIONS.forEach((opt) => {
      list.push({
        id: `control-lang-${opt.code}`,
        category: 'controls',
        title: `Language: ${opt.nativeLabel} (${opt.shortLabel})`,
        subtitle: `Switch Master OS interface to ${opt.englishName}`,
        shortcut: language === opt.code ? 'ACTIVE' : opt.shortLabel,
        icon: <Globe className="w-3.5 h-3.5 text-cyan-400" />,
        keywords: ['language', 'translate', opt.code, opt.englishName.toLowerCase(), opt.nativeLabel.toLowerCase(), 'i18n'],
        action: () => {
          onSelectLanguage(opt.code);
          onClose();
        },
      });
    });

    list.push({
      id: 'control-grade',
      category: 'controls',
      title: 'Cycle Color Grading LUT',
      subtitle: 'Teal & Steel · Amber Pulse · Deep Noir · Bleach Bypass',
      shortcut: 'Key G',
      icon: <span className="font-mono text-xs text-amber-400">◈</span>,
      keywords: ['grade', 'color', 'lut', 'filter', 'teal', 'amber', 'noir'],
      action: () => {
        onCycleGrade();
        onClose();
      },
    });

    list.push({
      id: 'control-speed',
      category: 'controls',
      title: 'Transition Speed & Easing Console',
      subtitle: 'Adjust cubic bezier timing curves and duration',
      shortcut: 'Speed',
      icon: <SlidersHorizontal className="w-3.5 h-3.5 opacity-70" />,
      keywords: ['speed', 'easing', 'timing', 'duration', 'console'],
      action: () => {
        onOpenSpeedConsole();
        onClose();
      },
    });

    list.push({
      id: 'system-sync',
      category: 'system',
      title: 'Multi-Device Cloud Pairing QR',
      subtitle: 'Connect smartphone, iPad, or secondary laptop',
      shortcut: 'QR Pair',
      icon: <Smartphone className="w-3.5 h-3.5 text-emerald-400" />,
      keywords: ['sync', 'qr', 'pair', 'connect', 'phone', 'device'],
      action: () => {
        onOpenSyncModal();
        onClose();
      },
    });

    if (canInstallPwa) {
      list.push({
        id: 'system-pwa',
        category: 'system',
        title: 'Install Hands & Head to Desktop / Mobile',
        subtitle: 'Standalone PWA offline-first workspace application',
        shortcut: 'PWA',
        icon: <Download className="w-3.5 h-3.5 text-amber-400" />,
        keywords: ['install', 'pwa', 'app', 'download', 'homescreen'],
        action: () => {
          onPromptInstall();
          onClose();
        },
      });
    }

    return list;
  }, [
    sections,
    onSelectSection,
    setActiveTab,
    isSoundEnabled,
    onToggleSound,
    language,
    onSelectLanguage,
    colorMode,
    onToggleTheme,
    t.theme.switchToDark,
    t.theme.switchToLight,
    onCycleGrade,
    onOpenSpeedConsole,
    onOpenSyncModal,
    canInstallPwa,
    onPromptInstall,
    onClose,
  ]);

  // Fuzzy filter commands
  const filteredCommands = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return commands;

    return commands.filter((cmd) => {
      if (cmd.title.toLowerCase().includes(q)) return true;
      if (cmd.subtitle.toLowerCase().includes(q)) return true;
      return cmd.keywords.some((k) => k.includes(q));
    });
  }, [commands, query]);

  // Keyboard navigation inside palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = filteredCommands[selectedIndex];
        if (selected) {
          trackEvent('MASTER_COMMAND_EXECUTE', { commandId: selected.id, title: selected.title });
          selected.action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[120] backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 px-4 p-6 animate-fadeIn"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.55)' }}
      onClick={onClose}
    >
      <div
        className={`w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden font-mono flex flex-col max-h-[80vh] border hh-theme-transition ${
          language === 'bn' ? 'bangla-text' : ''
        }`}
        style={{
          backgroundColor: 'var(--hh-surface)',
          borderColor: 'var(--hh-border)',
          color: 'var(--hh-text)',
          boxShadow: 'var(--hh-card-shadow)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div
          className="flex items-center gap-3 px-4 py-3.5 border-b"
          style={{
            borderColor: 'var(--hh-border)',
            backgroundColor: 'var(--hh-surface-2)',
          }}
        >
          <Search className="w-4 h-4 shrink-0" style={{ color: 'var(--hh-accent)' }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={t.command.placeholder}
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: 'var(--hh-text)' }}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-xs px-1.5 py-0.5 rounded cursor-pointer border"
              style={{
                color: 'var(--hh-muted)',
                borderColor: 'var(--hh-border)',
                backgroundColor: 'var(--hh-surface)',
              }}
            >
              Clear
            </button>
          )}
          <span
            className="text-[10px] uppercase tracking-wider px-2 py-1 rounded border"
            style={{
              color: 'var(--hh-muted)',
              borderColor: 'var(--hh-border)',
              backgroundColor: 'var(--hh-surface)',
            }}
          >
            ESC
          </span>
        </div>

        {/* Command Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="py-12 text-center text-xs font-mono" style={{ color: 'var(--hh-muted)' }}>
              {t.command.noResults} &quot;{query}&quot;
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    trackEvent('MASTER_COMMAND_EXECUTE', { commandId: cmd.id, title: cmd.title });
                    cmd.action();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className="flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border"
                  style={{
                    backgroundColor: isSelected ? 'var(--hh-surface-2)' : 'transparent',
                    borderColor: isSelected ? 'var(--hh-accent)' : 'transparent',
                    color: isSelected ? 'var(--hh-text)' : 'var(--hh-muted)',
                  }}
                >
                  <div className="flex items-center gap-3.5 overflow-hidden">
                    <div
                      className="w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: 'var(--hh-bg)',
                        borderColor: 'var(--hh-border)',
                      }}
                    >
                      {cmd.icon}
                    </div>
                    <div className="truncate">
                      <div
                        className="text-xs sm:text-sm font-semibold uppercase tracking-wider truncate"
                        style={{ color: 'var(--hh-text)' }}
                      >
                        {cmd.title}
                      </div>
                      <div className="text-[10px] truncate" style={{ color: 'var(--hh-muted)' }}>
                        {cmd.subtitle}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 pl-2">
                    {cmd.shortcut && (
                      <span
                        className="text-[9.5px] uppercase tracking-wider px-2 py-0.5 rounded border font-semibold"
                        style={{
                          color: 'var(--hh-accent)',
                          borderColor: 'var(--hh-border)',
                          backgroundColor: 'var(--hh-bg)',
                        }}
                      >
                        {cmd.shortcut}
                      </span>
                    )}
                    {isSelected && <CornerDownLeft className="w-3.5 h-3.5" style={{ color: 'var(--hh-accent)' }} />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Guidance */}
        <div
          className="px-4 py-2.5 border-t flex items-center justify-between text-[10px] uppercase"
          style={{
            backgroundColor: 'var(--hh-surface-2)',
            borderColor: 'var(--hh-border)',
            color: 'var(--hh-muted)',
          }}
        >
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>
          <span>Hands &amp; Head Master OS</span>
        </div>
      </div>
    </div>
  );
}
