import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { TaskItem, SectionItem, SyncState, ActiveTab, ColorGrade, EasingType } from './types';
import { INITIAL_SECTIONS, INITIAL_TASKS, GRADES } from './data/initialData';
import { MultiDeviceSyncEngine, getStoredRoomId, getDeviceName } from './services/syncService';
import { TRANSLATIONS, Language } from './i18n/translations';
import { audioEngine } from './services/audioEngine';
import { getInitialPortalFromUrl, updateUrlForPortal } from './services/deepLinkService';
import { initPwa, subscribeToInstallPrompt, promptPwaInstall } from './services/pwaService';
import { getStoredVisitorState, recordPortalVisit } from './services/visitorState';
import { trackEvent } from './services/analytics';

import GrainCanvas from './components/GrainCanvas';
import CustomCursor from './components/CustomCursor';
import MasterHeader from './components/MasterHeader';
import StageSlider from './components/StageSlider';
import RawxShowcase from './components/RawxShowcase';
import TaskSyncHub from './components/TaskSyncHub';
import SyncModal from './components/SyncModal';
import WebsiteSectionManager from './components/WebsiteSectionManager';
import IndexOverlay from './components/IndexOverlay';
import SpeedConsole from './components/SpeedConsole';
import KeyboardHud from './components/KeyboardHud';
import LightboxModal, { LightboxItem } from './components/LightboxModal';
import AmbientShaderCanvas from './components/AmbientShaderCanvas';
import CommandPalette from './components/CommandPalette';
import StatusTicker from './components/StatusTicker';
import ReturningVisitorBanner from './components/ReturningVisitorBanner';

const LANGUAGE_STORAGE_KEY = 'hh_master_language';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('ecosystem');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  // Language State (EN | BN)
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved === 'bn' || saved === 'en') return saved;
    } catch {
      // ignore
    }
    return 'en';
  });

  const t = TRANSLATIONS[language];

  // Ambient Sound State (Off by default)
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);

  // PWA State
  const [canInstallPwa, setCanInstallPwa] = useState(false);

  // Command Palette State
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Visited Portals State
  const [visitedPortals, setVisitedPortals] = useState<string[]>(() => {
    const state = getStoredVisitorState();
    return state.visitedPortals;
  });

  // Sections & Tasks State
  const [sections, setSections] = useState<SectionItem[]>(INITIAL_SECTIONS);
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);

  // Sync Engine State
  const initialRoom = useMemo(() => getStoredRoomId(), []);
  const [syncState, setSyncState] = useState<SyncState>({
    roomId: initialRoom,
    isConnected: false,
    isSyncing: false,
    lastSyncedAt: null,
    connectedDevices: [],
    deviceCount: 1,
    offlineChangesCount: 0,
  });

  const syncEngineRef = useRef<MultiDeviceSyncEngine | null>(null);

  // Grade & Speed Settings
  const [currentGrade, setCurrentGrade] = useState<ColorGrade>('off');
  const [speed, setSpeed] = useState<number>(7); // 0.7s
  const [easing, setEasing] = useState<EasingType>('ease');
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);

  // Modal States
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isSectionManagerOpen, setIsSectionManagerOpen] = useState(false);
  const [isIndexOpen, setIsIndexOpen] = useState(false);

  // Lightbox State
  const [lightboxState, setLightboxState] = useState<{
    isOpen: boolean;
    items: LightboxItem[];
    currentIndex: number;
  }>({
    isOpen: false,
    items: [],
    currentIndex: 0,
  });

  // Cursor Label State
  const [cursorLabel, setCursorLabel] = useState('ENTER →');

  // Filter tasks for a specific section when jumped from Stage
  const [filterSectionId, setFilterSectionId] = useState<string | null>(null);

  // 1. Initialize PWA
  useEffect(() => {
    initPwa();
    const unsubscribe = subscribeToInstallPrompt((canInstall) => {
      setCanInstallPwa(canInstall);
    });
    return () => unsubscribe();
  }, []);

  // 2. Initialize Deep Linking & initial section selection
  useEffect(() => {
    const initialPortalId = getInitialPortalFromUrl(sections[0]?.id || 'd2c');
    const matchedIdx = sections.findIndex((s) => s.id.toLowerCase() === initialPortalId.toLowerCase());
    if (matchedIdx !== -1) {
      setCurrentSectionIndex(matchedIdx);
    }
  }, [sections]);

  // 3. Update URL & Audio on section change
  useEffect(() => {
    const cur = sections[currentSectionIndex];
    if (cur) {
      updateUrlForPortal(cur.id, cur.title);
      audioEngine.setPortal(cur.id);

      const updated = recordPortalVisit(cur.id);
      setVisitedPortals(updated.visitedPortals);
    }
  }, [currentSectionIndex, sections]);

  // 4. Initialize Sync Engine
  useEffect(() => {
    const engine = new MultiDeviceSyncEngine(
      initialRoom,
      (remoteTasks, remoteSections, remoteDevices) => {
        if (Array.isArray(remoteTasks) && remoteTasks.length > 0) {
          setTasks(remoteTasks);
        }
        if (Array.isArray(remoteSections) && remoteSections.length > 0) {
          setSections(remoteSections);
        }
        setSyncState((prev) => ({
          ...prev,
          isConnected: true,
          lastSyncedAt: new Date().toLocaleTimeString(),
          connectedDevices: remoteDevices,
          deviceCount: remoteDevices.length || 1,
        }));
      },
      (isConnected, deviceCount) => {
        setSyncState((prev) => ({
          ...prev,
          isConnected,
          deviceCount: Math.max(1, deviceCount),
        }));
      }
    );

    syncEngineRef.current = engine;

    return () => {
      engine.disconnect();
    };
  }, [initialRoom]);

  // Dismiss loader on boot
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  // Language Switcher Handler
  const handleToggleLanguage = useCallback(() => {
    setLanguage((prev) => {
      const next: Language = prev === 'en' ? 'bn' : 'en';
      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
      } catch {
        // ignore
      }
      trackEvent('MASTER_LANGUAGE_TOGGLE', { language: next });
      return next;
    });
  }, []);

  // Ambient Sound Toggle Handler
  const handleToggleSound = useCallback(() => {
    setIsSoundEnabled((prev) => {
      const next = !prev;
      audioEngine.setEnabled(next);
      trackEvent('MASTER_SOUND_TOGGLE', { enabled: next });
      return next;
    });
  }, []);

  // Color Grade Cycle
  const cycleGrade = useCallback(() => {
    const gradeKeys: ColorGrade[] = ['off', 'teal', 'amber', 'noir', 'bleach'];
    const currIdx = gradeKeys.indexOf(currentGrade);
    const nextGrade = gradeKeys[(currIdx + 1) % gradeKeys.length];
    setCurrentGrade(nextGrade);
    trackEvent('MASTER_COLOR_GRADE_CHANGE', { grade: nextGrade });
  }, [currentGrade]);

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      // Cmd+K or Ctrl+K or / opens Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      if (e.key === '/' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
        return;
      }

      if (e.key === 'g' || e.key === 'G') {
        cycleGrade();
      }
      if (e.key === '1') setActiveTab('ecosystem');
      if (e.key === '2') setActiveTab('rawx-showcase');
      if (e.key === '3') setActiveTab('tasks-hub');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cycleGrade]);

  const handleJoinRoom = (newRoomId: string) => {
    if (syncEngineRef.current) {
      syncEngineRef.current.setRoomId(newRoomId);
      setSyncState((prev) => ({
        ...prev,
        roomId: newRoomId.toUpperCase().trim(),
      }));
      syncEngineRef.current.fetchInitialState();
    }
  };

  const handleForceSync = () => {
    if (syncEngineRef.current) {
      syncEngineRef.current.broadcast(tasks, sections, 'Manual Force Sync');
      syncEngineRef.current.fetchInitialState();
    }
  };

  // Task Mutations
  const handleAddTask = (newTaskData: Omit<TaskItem, 'id' | 'createdAt' | 'updatedAt' | 'deviceOrigin'>) => {
    const createdTask: TaskItem = {
      ...newTaskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deviceOrigin: getDeviceName(),
    };

    const updatedTasks = [createdTask, ...tasks];
    setTasks(updatedTasks);

    if (syncEngineRef.current) {
      syncEngineRef.current.broadcast(updatedTasks, sections, `Added Task: ${createdTask.title}`);
    }
  };

  const handleUpdateTask = (id: string, updates: Partial<TaskItem>) => {
    const updatedTasks = tasks.map((t) =>
      t.id === id
        ? {
            ...t,
            ...updates,
            updatedAt: new Date().toISOString(),
            deviceOrigin: getDeviceName(),
          }
        : t
    );
    setTasks(updatedTasks);

    if (syncEngineRef.current) {
      syncEngineRef.current.broadcast(updatedTasks, sections, 'Updated Task');
    }
  };

  const handleDeleteTask = (id: string) => {
    const updatedTasks = tasks.filter((t) => t.id !== id);
    setTasks(updatedTasks);

    if (syncEngineRef.current) {
      syncEngineRef.current.broadcast(updatedTasks, sections, 'Deleted Task');
    }
  };

  // Section Mutations
  const handleAddSection = (newSectionData: Omit<SectionItem, 'id'>) => {
    const createdSection: SectionItem = {
      ...newSectionData,
      id: `sec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };

    const updatedSections = [...sections, createdSection];
    setSections(updatedSections);

    if (syncEngineRef.current) {
      syncEngineRef.current.broadcast(tasks, updatedSections, `Added Section: ${createdSection.title}`);
    }
  };

  const handleDeleteSection = (id: string) => {
    const updatedSections = sections.filter((s) => s.id !== id);
    setSections(updatedSections);

    if (syncEngineRef.current) {
      syncEngineRef.current.broadcast(tasks, updatedSections, 'Deleted Section');
    }
  };

  const handleOpenTasksForSection = (sectionId: string) => {
    setFilterSectionId(sectionId);
    setActiveTab('tasks-hub');
  };

  // Section tasks counts
  const sectionTasksCount = useMemo(() => {
    const counts: Record<string, number> = {};
    tasks.forEach((t) => {
      if (t.status !== 'done') {
        counts[t.sectionId] = (counts[t.sectionId] || 0) + 1;
      }
    });
    return counts;
  }, [tasks]);

  const activeGradeObj = GRADES.find((g) => g.id === currentGrade);
  const currentSection = sections[currentSectionIndex] || sections[0];

  return (
    <div
      className={`min-h-screen bg-[#0e0d0b] text-[#f3efe6] relative selection:bg-[#b14a26] selection:text-[#0e0d0b] ${
        activeGradeObj?.cls || ''
      }`}
    >
      {/* Background Film Grain */}
      <GrainCanvas />

      {/* GPU Ambient Shader Canvas */}
      <AmbientShaderCanvas
        accentColor={currentSection?.accent || '#b14a26'}
        portalId={currentSection?.id || 'd2c'}
      />

      {/* Custom Crosshair Desktop Cursor */}
      <CustomCursor label={cursorLabel} />

      {/* Initial Page Loader */}
      <div
        id="loader"
        className={`fixed inset-0 z-[200] bg-[#0e0d0b] flex flex-col items-center justify-center gap-4 transition-opacity duration-700 ${
          loading ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="text-sm tracking-[0.3em] uppercase text-[#f3efe6]/80 font-mono flex items-center gap-2">
          <b>{t.brand.name}</b> — {t.brand.tagline}
        </div>
        <div className="w-48 h-[1px] bg-[#f3efe6]/20 relative overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-full bg-[#f3efe6] animate-[load_0.8s_ease_forwards]" />
        </div>
      </div>

      {/* Top Universal Master Header */}
      <MasterHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        accentColor={currentSection?.accent || '#b14a26'}
        syncState={syncState}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        onOpenIndex={() => setIsIndexOpen(true)}
        onOpenSectionManager={() => setIsSectionManagerOpen(true)}
        currentGrade={currentGrade}
        onCycleGrade={cycleGrade}
        onToggleConsole={() => setIsConsoleOpen((prev) => !prev)}
        isConsoleOpen={isConsoleOpen}
        tasksCount={{
          total: tasks.length,
          pending: tasks.filter((t) => t.status !== 'done').length,
          done: tasks.filter((t) => t.status === 'done').length,
        }}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={handleToggleSound}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        canInstallPwa={canInstallPwa}
        onPromptInstall={promptPwaInstall}
        t={t}
      />

      {/* Main Tab Content */}
      <main className="relative z-10">
        {activeTab === 'ecosystem' && (
          <StageSlider
            sections={sections}
            currentSectionIndex={currentSectionIndex}
            setCurrentSectionIndex={setCurrentSectionIndex}
            onSetCursorLabel={setCursorLabel}
            onOpenSectionManager={() => setIsSectionManagerOpen(true)}
            onOpenTasksForSection={handleOpenTasksForSection}
            sectionTasksCount={sectionTasksCount}
            onOpenSliders={() => setActiveTab('rawx-showcase')}
            language={language}
            t={t}
          />
        )}

        {activeTab === 'rawx-showcase' && (
          <RawxShowcase
            speed={speed}
            onBackToEcosystem={() => setActiveTab('ecosystem')}
            onOpenLightbox={(items, startIndex) => {
              setLightboxState({
                isOpen: true,
                items,
                currentIndex: startIndex,
              });
            }}
          />
        )}

        {activeTab === 'tasks-hub' && (
          <TaskSyncHub
            tasks={tasks}
            sections={sections}
            syncState={syncState}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onOpenSyncModal={() => setIsSyncModalOpen(true)}
            onOpenSectionManager={() => setIsSectionManagerOpen(true)}
            onForceSync={handleForceSync}
            filterSectionId={filterSectionId}
            onClearSectionFilter={() => setFilterSectionId(null)}
          />
        )}
      </main>

      {/* Ecosystem Status Ticker (bottom ambient bar) */}
      <StatusTicker
        sections={sections}
        onSelectSection={(idx) => {
          setCurrentSectionIndex(idx);
          setActiveTab('ecosystem');
        }}
        currentSectionIndex={currentSectionIndex}
        t={t}
      />

      {/* Subtle Returning Visitor Banner */}
      <ReturningVisitorBanner
        sections={sections}
        onSelectSection={(idx) => {
          setCurrentSectionIndex(idx);
          setActiveTab('ecosystem');
        }}
        t={t}
      />

      {/* Command Palette (⌘K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        sections={sections}
        onSelectSection={(idx) => {
          setCurrentSectionIndex(idx);
          setActiveTab('ecosystem');
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onToggleSound={handleToggleSound}
        isSoundEnabled={isSoundEnabled}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onCycleGrade={cycleGrade}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        onOpenSpeedConsole={() => setIsConsoleOpen(true)}
        onPromptInstall={promptPwaInstall}
        canInstallPwa={canInstallPwa}
        t={t}
      />

      {/* Master Index Drawer Overlay */}
      <IndexOverlay
        isOpen={isIndexOpen}
        onClose={() => setIsIndexOpen(false)}
        sections={sections}
        onSelectSection={(idx) => {
          setCurrentSectionIndex(idx);
          setActiveTab('ecosystem');
        }}
        onOpenSectionManager={() => {
          setIsIndexOpen(false);
          setIsSectionManagerOpen(true);
        }}
        onOpenSliders={() => {
          setIsIndexOpen(false);
          setActiveTab('rawx-showcase');
        }}
        visitedPortals={visitedPortals}
        t={t}
      />

      {/* Device Sync Pairing QR Modal */}
      <SyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        syncState={syncState}
        onJoinRoom={handleJoinRoom}
      />

      {/* Website & Section Extensibility Manager Modal */}
      <WebsiteSectionManager
        isOpen={isSectionManagerOpen}
        onClose={() => setIsSectionManagerOpen(false)}
        sections={sections}
        onAddSection={handleAddSection}
        onDeleteSection={handleDeleteSection}
      />

      {/* High-Res Image Lightbox Modal */}
      <LightboxModal
        isOpen={lightboxState.isOpen}
        onClose={() => setLightboxState((prev) => ({ ...prev, isOpen: false }))}
        items={lightboxState.items}
        currentIndex={lightboxState.currentIndex}
        onNavigate={(idx) => setLightboxState((prev) => ({ ...prev, currentIndex: idx }))}
      />

      {/* Transition Speed & Easing Console */}
      <SpeedConsole
        isOpen={isConsoleOpen}
        onClose={() => setIsConsoleOpen(false)}
        speed={speed}
        setSpeed={setSpeed}
        easing={easing}
        setEasing={setEasing}
      />

      {/* Keyboard Shortcut HUD */}
      <KeyboardHud />
    </div>
  );
}
