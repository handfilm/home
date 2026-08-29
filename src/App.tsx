import React, { useState, useEffect, useRef, useMemo } from 'react';
import { TaskItem, SectionItem, SyncState, ActiveTab, ColorGrade, EasingType } from './types';
import { INITIAL_SECTIONS, INITIAL_TASKS, GRADES, EASING_OPTIONS } from './data/initialData';
import { MultiDeviceSyncEngine, getStoredRoomId, getDeviceName } from './services/syncService';

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

export default function App() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('ecosystem');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

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

  // Initialize Sync Engine
  useEffect(() => {
    const engine = new MultiDeviceSyncEngine(
      initialRoom,
      (remoteTasks, remoteSections, remoteDevices, source) => {
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
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
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
  }, [currentGrade]);

  const cycleGrade = () => {
    const gradeKeys: ColorGrade[] = ['off', 'teal', 'amber', 'noir', 'bleach'];
    const currIdx = gradeKeys.indexOf(currentGrade);
    const nextGrade = gradeKeys[(currIdx + 1) % gradeKeys.length];
    setCurrentGrade(nextGrade);
  };

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
          <b>HANDS &amp; HEAD</b> — MASTER OS
        </div>
        <div className="w-48 h-[1px] bg-[#f3efe6]/20 relative overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-full bg-[#f3efe6] animate-[load_1s_ease_forwards]" />
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
          />
        )}

        {activeTab === 'rawx-showcase' && (
          <RawxShowcase
            speed={speed}
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
