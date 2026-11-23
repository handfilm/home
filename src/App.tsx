import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { TaskItem, SectionItem, SyncState, ActiveTab, ColorGrade, EasingType } from './types';
import { INITIAL_SECTIONS, INITIAL_TASKS, GRADES } from './data/initialData';
import { MultiDeviceSyncEngine, getStoredRoomId, getDeviceName } from './services/syncService';
import { TRANSLATIONS, Language, isSupportedLanguage } from './i18n/translations';
import { audioEngine } from './services/audioEngine';
import { getInitialRouteFromUrl, updateUrlForTab } from './services/deepLinkService';
import { initPwa, subscribeToInstallPrompt, promptPwaInstall } from './services/pwaService';
import { getStoredVisitorState, recordPortalVisit } from './services/visitorState';
import { trackEvent } from './services/analytics';
import { useSeoHead } from './hooks/useSeoHead';
import { ThemeProvider, useTheme } from './context/ThemeContext';

import GrainCanvas from './components/GrainCanvas';
import CustomCursor from './components/CustomCursor';
import MasterHeader from './components/MasterHeader';
import HomeLanding from './components/HomeLanding';
import HandFilmHubView from './components/handfilm/HandFilmHubView';
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

interface AppShellProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  targetRawxDropId: string | null;
  sections: SectionItem[];
  setSections: React.Dispatch<React.SetStateAction<SectionItem[]>>;
  tasks: TaskItem[];
  setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>;
  currentSectionIndex: number;
  setCurrentSectionIndex: React.Dispatch<React.SetStateAction<number>>;
}

function AppShell({
  activeTab,
  setActiveTab,
  targetRawxDropId,
  sections,
  setSections,
  tasks,
  setTasks,
  currentSectionIndex,
  setCurrentSectionIndex,
}: AppShellProps) {
  const { colorMode, toggleColorMode, palette, isDark } = useTheme();
  const [loading, setLoading] = useState(true);

  // Language State (8 Languages: EN | BN | HI | ZH | JA | ES | DE | NL)
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (isSupportedLanguage(saved)) return saved;
    } catch {
      // ignore
    }
    return 'en';
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', language);
    }
  }, [language]);

  const t = TRANSLATIONS[language];

  const handleSelectLanguage = useCallback((nextLang: Language) => {
    setLanguage(nextLang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLang);
    } catch {
      // ignore
    }
    trackEvent('MASTER_LANGUAGE_SELECT', { language: nextLang });
  }, []);

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
  const [speed, setSpeed] = useState<number>(7);
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
  const [cursorLabel, setCursorLabel] = useState('EXPLORE →');

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

  // 2. Synchronize document head SEO tags dynamically across tabs & all 24 slides
  useSeoHead({
    activeTab,
    currentSection: sections[currentSectionIndex],
    sectionsCount: sections.length,
  });

  // 3. Synchronize URL hash, ambient audio, and visited portals
  useEffect(() => {
    const cur = sections[currentSectionIndex];
    if (activeTab === 'ecosystem' && cur) {
      updateUrlForTab('ecosystem', cur.id);
      audioEngine.setPortal(cur.id);

      const updated = recordPortalVisit(cur.id);
      setVisitedPortals(updated.visitedPortals);
    } else {
      updateUrlForTab(activeTab);
    }
  }, [activeTab, currentSectionIndex, sections]);

  // 4. Initialize Sync Engine
  useEffect(() => {
    const engine = new MultiDeviceSyncEngine(
      initialRoom,
      (remoteTasks, remoteSections, remoteDevices) => {
        if (Array.isArray(remoteTasks) && remoteTasks.length > 0) {
          setTasks(remoteTasks);
        }
        if (Array.isArray(remoteSections) && remoteSections.length > 0) {
          const coreIds = new Set(INITIAL_SECTIONS.map((s) => s.id));
          const customRemote = remoteSections.filter((s) => s.isCustom && !coreIds.has(s.id));
          setSections([...INITIAL_SECTIONS, ...customRemote]);
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
  }, [initialRoom, setSections, setTasks]);

  // Dismiss loader on boot
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 350);
    return () => clearTimeout(timer);
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

  // Direct jump to any of the 24 sections from Home or overlays
  const handleJumpToSectionId = useCallback(
    (sectionId: string) => {
      const idx = sections.findIndex((s) => s.id.toLowerCase() === sectionId.toLowerCase());
      if (idx !== -1) {
        setCurrentSectionIndex(idx);
      }
      setActiveTab('ecosystem');
    },
    [sections, setActiveTab, setCurrentSectionIndex]
  );

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

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
      if (e.key === '1') setActiveTab('home');
      if (e.key === '2') setActiveTab('ecosystem');
      if (e.key === '3') setActiveTab('rawx-showcase');
      if (e.key === '4') setActiveTab('tasks-hub');
      if (e.key === '5') setActiveTab('handfilm');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cycleGrade, setActiveTab]);

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
    const updatedTasks = tasks.map((tItem) =>
      tItem.id === id
        ? {
            ...tItem,
            ...updates,
            updatedAt: new Date().toISOString(),
            deviceOrigin: getDeviceName(),
          }
        : tItem
    );
    setTasks(updatedTasks);

    if (syncEngineRef.current) {
      syncEngineRef.current.broadcast(updatedTasks, sections, 'Updated Task');
    }
  };

  const handleDeleteTask = (id: string) => {
    const updatedTasks = tasks.filter((tItem) => tItem.id !== id);
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

  const sectionTasksCount = useMemo(() => {
    const counts: Record<string, number> = {};
    tasks.forEach((tItem) => {
      if (tItem.status !== 'done') {
        counts[tItem.sectionId] = (counts[tItem.sectionId] || 0) + 1;
      }
    });
    return counts;
  }, [tasks]);

  const tasksSummary = useMemo(
    () => ({
      total: tasks.length,
      pending: tasks.filter((tItem) => tItem.status !== 'done').length,
      done: tasks.filter((tItem) => tItem.status === 'done').length,
    }),
    [tasks]
  );

  const activeGradeObj = GRADES.find((g) => g.id === currentGrade);
  const currentSection = sections[currentSectionIndex] || sections[0];
  const activeAccentColor =
    activeTab === 'home' || activeTab === 'handfilm' || activeTab === 'rawx-showcase'
      ? palette.accent
      : currentSection?.accent || palette.accent;

  return (
    <div
      className={`min-h-screen relative hh-theme-transition ${activeGradeObj?.cls || ''} ${
        language === 'bn' ? 'bangla-text' : ''
      }`}
      style={{
        backgroundColor: 'var(--hh-bg)',
        color: 'var(--hh-text)',
      }}
    >
      {/* Background Film Grain (subtle in dark mode) */}
      {isDark && <GrainCanvas />}

      {/* GPU Ambient Shader Canvas (subtle ambient glow in dark mode) */}
      {isDark && (
        <AmbientShaderCanvas
          accentColor={activeAccentColor}
          portalId={
            activeTab === 'home'
              ? 'home'
              : activeTab === 'handfilm'
              ? 'studio'
              : currentSection?.id || 'd2c'
          }
        />
      )}

      {/* Custom Crosshair Desktop Cursor */}
      <CustomCursor label={cursorLabel} />

      {/* Initial Page Loader */}
      <div
        id="loader"
        className={`fixed inset-0 z-[200] flex flex-col items-center justify-center gap-4 transition-opacity duration-500 ${
          loading ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ backgroundColor: 'var(--hh-bg)', color: 'var(--hh-text)' }}
      >
        <div className="text-sm tracking-[0.3em] uppercase font-mono flex items-center gap-2 opacity-85">
          <b>{t.brand.name}</b> — {t.brand.tagline}
        </div>
        <div className="w-48 h-[1px] relative overflow-hidden" style={{ backgroundColor: 'var(--hh-border)' }}>
          <div
            className="absolute left-0 top-0 h-full w-full animate-[load_0.8s_ease_forwards]"
            style={{ backgroundColor: palette.accent }}
          />
        </div>
      </div>

      {/* Top Universal Master Header */}
      <MasterHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        accentColor={activeAccentColor}
        syncState={syncState}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        onOpenIndex={() => setIsIndexOpen(true)}
        onOpenSectionManager={() => setIsSectionManagerOpen(true)}
        currentGrade={currentGrade}
        onCycleGrade={cycleGrade}
        onToggleConsole={() => setIsConsoleOpen((prev) => !prev)}
        isConsoleOpen={isConsoleOpen}
        tasksCount={tasksSummary}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={handleToggleSound}
        language={language}
        onSelectLanguage={handleSelectLanguage}
        canInstallPwa={canInstallPwa}
        onPromptInstall={promptPwaInstall}
        t={t}
      />

      {/* Non-Destructive Zero-Latency Keep-Alive Views */}
      <main className="relative z-10">
        {/* TAB 1: HOME — Dynamic Enterprise OS */}
        <div
          id="panel-home"
          className={activeTab === 'home' ? 'block' : 'hidden'}
          aria-hidden={activeTab !== 'home'}
        >
          <HomeLanding
            sections={sections}
            syncState={syncState}
            tasksCount={tasksSummary}
            onNavigateTab={setActiveTab}
            onJumpToSection={handleJumpToSectionId}
            onOpenSyncModal={() => setIsSyncModalOpen(true)}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
            onSetCursorLabel={setCursorLabel}
            language={language}
            t={t}
          />
        </div>

        {/* TAB 2: HANDFILM — CapCut-Inspired Airy Creator Studio */}
        <div
          id="panel-handfilm"
          className={activeTab === 'handfilm' ? 'block' : 'hidden'}
          aria-hidden={activeTab !== 'handfilm'}
        >
          <HandFilmHubView onSetCursorLabel={setCursorLabel} language={language} t={t} />
        </div>

        {/* TAB 4: APPS — Existing 24-Section Ultra-Fast Stage Slider Engine */}
        <div
          id="panel-apps"
          className={activeTab === 'ecosystem' ? 'block' : 'hidden'}
          aria-hidden={activeTab !== 'ecosystem'}
        >
          <StageSlider
            sections={sections}
            currentSectionIndex={currentSectionIndex}
            setCurrentSectionIndex={setCurrentSectionIndex}
            onSetCursorLabel={setCursorLabel}
            onOpenSectionManager={() => setIsSectionManagerOpen(true)}
            onOpenTasksForSection={handleOpenTasksForSection}
            sectionTasksCount={sectionTasksCount}
            onOpenSliders={() => setActiveTab('rawx-showcase')}
            isActiveTab={activeTab === 'ecosystem'}
            language={language}
            t={t}
          />
        </div>

        {/* TAB 3: RAWx — Brutalist Industrial Luxury Storefront & 19 Slider Engines */}
        <div
          id="panel-sliders"
          className={activeTab === 'rawx-showcase' ? 'block' : 'hidden'}
          aria-hidden={activeTab !== 'rawx-showcase'}
        >
          <RawxShowcase
            speed={speed}
            currentGrade={currentGrade}
            targetDropId={targetRawxDropId}
            onBackToEcosystem={() => setActiveTab('ecosystem')}
            isActiveTab={activeTab === 'rawx-showcase'}
            language={language}
            t={t}
            onOpenLightbox={(items, startIndex) => {
              setLightboxState({
                isOpen: true,
                items,
                currentIndex: startIndex,
              });
            }}
          />
        </div>

        {/* UTILITY VIEW: Multi-Device Task Sync Hub */}
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

      {/* Ecosystem Status Ticker (bottom ambient HUD bar) */}
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
        onSelectLanguage={handleSelectLanguage}
        colorMode={colorMode}
        onToggleTheme={toggleColorMode}
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

export default function App() {
  const [sections, setSections] = useState<SectionItem[]>(INITIAL_SECTIONS);
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);

  const initialRoute = useMemo(
    () => getInitialRouteFromUrl(INITIAL_SECTIONS.map((s) => s.id)),
    []
  );

  const [activeTab, setActiveTabState] = useState<ActiveTab>(initialRoute.tab);
  const [targetRawxDropId, setTargetRawxDropId] = useState<string | null>(initialRoute.rawxDropId);
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(() => {
    if (initialRoute.portalId) {
      const idx = INITIAL_SECTIONS.findIndex(
        (s) => s.id.toLowerCase() === initialRoute.portalId!.toLowerCase()
      );
      if (idx !== -1) return idx;
    }
    return 0;
  });

  const setActiveTab = useCallback((nextTab: ActiveTab) => {
    setActiveTabState(nextTab);
    if (nextTab !== 'rawx-showcase') {
      setTargetRawxDropId(null);
    }
    if (
      typeof window !== 'undefined' &&
      (nextTab === 'home' || nextTab === 'handfilm' || nextTab === 'rawx-showcase' || nextTab === 'tasks-hub')
    ) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, []);

  // Listen for browser hashchange / deep-link navigation
  useEffect(() => {
    const handleHashChange = () => {
      const resolved = getInitialRouteFromUrl(sections.map((s) => s.id));
      setActiveTabState(resolved.tab);
      setTargetRawxDropId(resolved.rawxDropId);
      if (resolved.portalId) {
        const idx = sections.findIndex(
          (s) => s.id.toLowerCase() === resolved.portalId!.toLowerCase()
        );
        if (idx !== -1) {
          setCurrentSectionIndex(idx);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [sections]);

  return (
    <ThemeProvider activeTab={activeTab}>
      <AppShell
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        targetRawxDropId={targetRawxDropId}
        sections={sections}
        setSections={setSections}
        tasks={tasks}
        setTasks={setTasks}
        currentSectionIndex={currentSectionIndex}
        setCurrentSectionIndex={setCurrentSectionIndex}
      />
    </ThemeProvider>
  );
}
// END OF FILE: src/App.tsx

