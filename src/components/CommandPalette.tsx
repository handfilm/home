import React, { useState, useEffect, useRef, useMemo } from 'react';
import { SectionItem, ActiveTab, ColorGrade } from '../types';
import { Search, ArrowRight, CornerDownLeft, Sparkles, CheckSquare, Layers, Volume2, Globe, Download, Smartphone, SlidersHorizontal } from 'lucide-react';
import { Language, TranslationDictionary } from '../i18n/translations';
import { trackEvent } from '../services/analytics';

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
  onToggleLanguage: () => void;
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
  activeTab,
  setActiveTab,
  onToggleSound,
  isSoundEnabled,
  language,
  onToggleLanguage,
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
      id: 'view-stage',
      category: 'views',
      title: 'Stage Ecosystem Slider',
      subtitle: 'Primary full-screen portal showcase',
      shortcut: 'Key 1',
      icon: <Layers className="w-3.5 h-3.5 text-[#c8b89a]" />,
      keywords: ['stage', 'slider', 'ecosystem', 'main', 'home', 'portal'],
      action: () => {
        setActiveTab('ecosystem');
        onClose();
      },
    });

    list.push({
      id: 'view-rawx',
      category: 'views',
      title: 'RAWx 16 Sliders Ultra System',
      subtitle: 'Architectural showcase of all 16 slider variants',
      shortcut: 'Key 2',
      icon: <Sparkles className="w-3.5 h-3.5 text-amber-400" />,
      keywords: ['rawx', 'sliders', '16', 'ultra', 'gallery', 'showcase'],
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
      shortcut: 'Key 3',
      icon: <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />,
      keywords: ['tasks', 'todo', 'sync', 'devices', 'project', 'hub'],
      action: () => {
        setActiveTab('tasks-hub');
        onClose();
      },
    });

    // 3. Workspace Controls & Settings
    list.push({
      id: 'control-sound',
      category: 'controls',
      title: isSoundEnabled ? 'Disable Ambient Audio Layer' : 'Enable Ambient Audio Layer (Web Audio)',
      subtitle: isSoundEnabled ? 'Currently playing procedural soundscape' : 'Off by default · Generates organic synthesized drones',
      shortcut: 'Audio',
      icon: <Volume2 className={`w-3.5 h-3.5 ${isSoundEnabled ? 'text-emerald-400' : 'text-[#f3efe6]/60'}`} />,
      keywords: ['sound', 'audio', 'music', 'drone', 'ambient', 'synth', 'mute', 'unmute'],
      action: () => {
        onToggleSound();
        onClose();
      },
    });

    list.push({
      id: 'control-language',
      category: 'controls',
      title: language === 'en' ? 'Switch to Bengali (বাংলা)' : 'Switch to English (EN)',
      subtitle: 'Toggle master UI dictionary and section translations',
      shortcut: language === 'en' ? 'বাংলা' : 'EN',
      icon: <Globe className="w-3.5 h-3.5 text-cyan-400" />,
      keywords: ['language', 'translate', 'bengali', 'bangla', 'english', 'i18n', 'ভাষা'],
      action: () => {
        onToggleLanguage();
        onClose();
      },
    });

    list.push({
      id: 'control-grade',
      category: 'controls',
      title: 'Cycle Color Grading LUT',
      subtitle: 'Teal & Steel · Amber Pulse · Deep Noir · Bleach Bypass',
      shortcut: 'Key G',
      icon: <span className="font-mono text-xs text-amber-300">◈</span>,
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
      icon: <SlidersHorizontal className="w-3.5 h-3.5 text-[#f3efe6]/60" />,
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
    onToggleLanguage,
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
      className="fixed inset-0 z-[120] bg-[#0e0d0b]/85 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 px-4 p-6 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#141310] border border-[#f3efe6]/20 rounded-xl shadow-2xl overflow-hidden font-mono flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#f3efe6]/15 bg-[#181714]">
          <Search className="w-4 h-4 text-[#c8b89a]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={t.command.placeholder}
            className="flex-1 bg-transparent text-[#f3efe6] text-sm placeholder-[#f3efe6]/40 outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-[#f3efe6]/50 hover:text-[#f3efe6] px-1.5 py-0.5 rounded bg-[#f3efe6]/5 cursor-pointer"
            >
              Clear
            </button>
          )}
          <span className="text-[10px] uppercase tracking-wider text-[#f3efe6]/40 px-2 py-1 rounded bg-[#f3efe6]/5 border border-[#f3efe6]/10">
            ESC
          </span>
        </div>

        {/* Command Results List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#f3efe6]/5 p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#f3efe6]/50 font-mono">
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
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                    isSelected ? 'bg-[#f3efe6]/10 text-[#f3efe6] border border-[#f3efe6]/20' : 'text-[#f3efe6]/70 hover:bg-[#f3efe6]/5'
                  }`}
                >
                  <div className="flex items-center gap-3.5 overflow-hidden">
                    <div className="w-7 h-7 rounded bg-[#1f1e1a] border border-[#f3efe6]/10 flex items-center justify-center flex-shrink-0">
                      {cmd.icon}
                    </div>
                    <div className="truncate">
                      <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#f3efe6]">
                        {cmd.title}
                      </div>
                      <div className="text-[10px] text-[#f3efe6]/50 truncate">{cmd.subtitle}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 pl-2">
                    {cmd.shortcut && (
                      <span className="text-[9.5px] uppercase tracking-wider text-[#c8b89a] px-2 py-0.5 rounded bg-[#c8b89a]/10 border border-[#c8b89a]/20">
                        {cmd.shortcut}
                      </span>
                    )}
                    {isSelected && <CornerDownLeft className="w-3.5 h-3.5 text-[#f3efe6]/60" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Guidance */}
        <div className="px-4 py-2.5 bg-[#0e0d0b] border-t border-[#f3efe6]/10 flex items-center justify-between text-[10px] text-[#f3efe6]/40 uppercase">
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
