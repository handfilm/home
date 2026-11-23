import React, { useState, useMemo } from 'react';
import { TaskItem, SectionItem, SyncState, Priority, TaskStatus } from '../types';
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Smartphone,
  Laptop,
  Globe,
  Trash2,
  Edit3,
  QrCode,
  RefreshCw,
  Share2,
  Calendar,
  Tag,
  CheckSquare,
  Sparkles,
  ArrowUpDown,
  Layers,
  Send,
} from 'lucide-react';

interface TaskSyncHubProps {
  tasks: TaskItem[];
  sections: SectionItem[];
  syncState: SyncState;
  onAddTask: (task: Omit<TaskItem, 'id' | 'createdAt' | 'updatedAt' | 'deviceOrigin'>) => void;
  onUpdateTask: (id: string, updates: Partial<TaskItem>) => void;
  onDeleteTask: (id: string) => void;
  onOpenSyncModal: () => void;
  onOpenSectionManager: () => void;
  onForceSync: () => void;
  filterSectionId?: string | null;
  onClearSectionFilter?: () => void;
}

export default function TaskSyncHub({
  tasks,
  sections,
  syncState,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onOpenSyncModal,
  onOpenSectionManager,
  onForceSync,
  filterSectionId,
  onClearSectionFilter,
}: TaskSyncHubProps) {
  const [selectedSection, setSelectedSection] = useState<string>(filterSectionId || 'all');
  const [statusFilter, setStatusFilter] = useState<'all' | TaskStatus | 'urgent'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'updated' | 'dueDate' | 'priority'>('updated');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newSectionId, setNewSectionId] = useState(sections[0]?.id || 'd2c');
  const [newPriority, setNewPriority] = useState<Priority>('medium');
  const [newDueDate, setNewDueDate] = useState('');
  const [newTags, setNewTags] = useState('');

  // Quick Inline Capture State
  const [quickTitle, setQuickTitle] = useState('');

  // Filtered & Sorted Tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        // Section filter
        if (selectedSection !== 'all' && t.sectionId !== selectedSection) return false;
        // Status filter
        if (statusFilter === 'urgent' && t.priority !== 'urgent') return false;
        if (statusFilter !== 'all' && statusFilter !== 'urgent' && t.status !== statusFilter) return false;
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = t.title.toLowerCase().includes(q);
          const matchesDesc = t.description?.toLowerCase().includes(q);
          const matchesTags = t.tags?.some((tag) => tag.toLowerCase().includes(q));
          if (!matchesTitle && !matchesDesc && !matchesTags) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'priority') {
          const weight: Record<Priority, number> = { urgent: 4, high: 3, medium: 2, low: 1 };
          return weight[b.priority] - weight[a.priority];
        }
        if (sortBy === 'dueDate') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.localeCompare(b.dueDate);
        }
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, [tasks, selectedSection, statusFilter, searchQuery, sortBy]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'done').length;
    const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
    const pending = total - completed;
    const urgentCount = tasks.filter((t) => t.priority === 'urgent' && t.status !== 'done').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, inProgress, pending, urgentCount, completionRate };
  }, [tasks]);

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    onAddTask({
      title: quickTitle.trim(),
      sectionId: selectedSection !== 'all' ? selectedSection : sections[0]?.id || 'd2c',
      priority: 'medium',
      status: 'todo',
      tags: ['Quick Capture'],
    });
    setQuickTitle('');
  };

  const handleCreateDetailedTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const parsedTags = newTags
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    onAddTask({
      title: newTitle.trim(),
      description: newDescription.trim() || undefined,
      sectionId: newSectionId,
      priority: newPriority,
      status: 'todo',
      dueDate: newDueDate || undefined,
      tags: parsedTags.length > 0 ? parsedTags : undefined,
    });

    setNewTitle('');
    setNewDescription('');
    setNewDueDate('');
    setNewTags('');
    setShowAddModal(false);
  };

  const getSection = (id: string) => sections.find((s) => s.id === id);

  const getPriorityBadge = (p: Priority) => {
    switch (p) {
      case 'urgent':
        return 'bg-red-500/15 text-red-500 border-red-500/40';
      case 'high':
        return 'bg-amber-500/15 text-amber-500 border-amber-500/40';
      case 'medium':
        return 'bg-blue-500/15 text-blue-500 border-blue-500/40';
      case 'low':
        return 'bg-neutral-500/15 text-neutral-500 border-neutral-500/40';
    }
  };

  return (
    <div
      className="w-full min-h-[calc(100vh-118px)] md:min-h-[calc(100vh-70px)] mt-[118px] md:mt-[70px] px-4 sm:px-8 py-8 pb-28 hh-theme-transition"
      style={{
        backgroundColor: 'var(--hh-bg)',
        color: 'var(--hh-text)',
      }}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Multi-Device Live Sync Control Bar */}
        <div
          className="border rounded-xl p-5 sm:p-6 shadow-xl relative overflow-hidden"
          style={{
            backgroundColor: 'var(--hh-surface)',
            borderColor: 'var(--hh-border)',
          }}
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
            {/* Left: Sync Status & Room ID */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] tracking-[0.2em] uppercase" style={{ color: 'var(--hh-muted)' }}>
                    Cross-Device Sync Protocol
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      syncState.isConnected
                        ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {syncState.isConnected ? 'LIVE BIDIRECTIONAL SYNC' : 'CONNECTING...'}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-mono flex items-center gap-3" style={{ color: 'var(--hh-text)' }}>
                  ROOM: <span className="text-emerald-500 tracking-wider">{syncState.roomId}</span>
                </h2>
              </div>
            </div>

            {/* Right: Actions & Connected Devices Pill */}
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
              {/* Connected Devices Badge */}
              <div
                className="flex items-center gap-2 px-3 py-2 border rounded-lg"
                style={{
                  backgroundColor: 'var(--hh-bg)',
                  borderColor: 'var(--hh-border)',
                }}
              >
                <Laptop className="w-4 h-4 text-emerald-500" />
                <span className="font-medium" style={{ color: 'var(--hh-text)' }}>
                  {syncState.deviceCount} {syncState.deviceCount === 1 ? 'Device' : 'Devices'} Connected
                </span>
              </div>

              {/* Pair Device via QR Code */}
              <button
                onClick={onOpenSyncModal}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-all cursor-pointer shadow-md"
              >
                <QrCode className="w-4 h-4" />
                <span>Pair Phone / Tablet</span>
              </button>

              {/* Force Sync button */}
              <button
                onClick={onForceSync}
                title="Force refresh & sync with cloud room"
                className="flex items-center gap-1.5 px-3 py-2 border rounded-lg transition-all cursor-pointer"
                style={{
                  backgroundColor: 'var(--hh-bg)',
                  borderColor: 'var(--hh-border)',
                  color: 'var(--hh-text)',
                }}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t font-mono text-xs"
            style={{ borderColor: 'var(--hh-border)' }}
          >
            <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--hh-bg)', borderColor: 'var(--hh-border)' }}>
              <span className="block text-[10px] uppercase" style={{ color: 'var(--hh-muted)' }}>Active Tasks</span>
              <span className="text-lg font-bold tabular-nums" style={{ color: 'var(--hh-text)' }}>{stats.pending}</span>
            </div>
            <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--hh-bg)', borderColor: 'var(--hh-border)' }}>
              <span className="block text-[10px] uppercase" style={{ color: 'var(--hh-muted)' }}>Completed</span>
              <span className="text-lg font-bold text-emerald-500 tabular-nums">{stats.completed}</span>
            </div>
            <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--hh-bg)', borderColor: 'var(--hh-border)' }}>
              <span className="block text-[10px] uppercase" style={{ color: 'var(--hh-muted)' }}>High / Urgent</span>
              <span className="text-lg font-bold text-amber-500 tabular-nums">{stats.urgentCount}</span>
            </div>
            <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--hh-bg)', borderColor: 'var(--hh-border)' }}>
              <span className="block text-[10px] uppercase" style={{ color: 'var(--hh-muted)' }}>Completion Rate</span>
              <span className="text-lg font-bold text-blue-500 tabular-nums">{stats.completionRate}%</span>
            </div>
          </div>
        </div>

        {/* Quick Add Bar */}
        <form
          onSubmit={handleQuickAdd}
          className="flex items-center gap-3 border p-2 rounded-xl shadow-lg"
          style={{
            backgroundColor: 'var(--hh-surface)',
            borderColor: 'var(--hh-border)',
          }}
        >
          <input
            type="text"
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            placeholder="Quick capture a task to sync across all connected devices... (Press Enter)"
            className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none font-sans"
            style={{ color: 'var(--hh-text)' }}
          />
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="hidden sm:flex items-center gap-1 px-3 py-2 text-xs font-mono rounded-lg border cursor-pointer"
            style={{
              backgroundColor: 'var(--hh-bg)',
              borderColor: 'var(--hh-border)',
              color: 'var(--hh-text)',
            }}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Full Form</span>
          </button>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2.5 font-bold text-xs rounded-lg transition-all cursor-pointer font-mono"
            style={{
              backgroundColor: 'var(--hh-accent)',
              color: 'var(--hh-accent-ink)',
            }}
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </form>

        {/* Section Navigation Tabs & Add Website Button */}
        <div
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4"
          style={{ borderColor: 'var(--hh-border)' }}
        >
          {/* Section Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedSection('all')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-mono tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 border"
              style={{
                backgroundColor: selectedSection === 'all' ? 'var(--hh-accent)' : 'var(--hh-surface)',
                borderColor: selectedSection === 'all' ? 'var(--hh-accent)' : 'var(--hh-border)',
                color: selectedSection === 'all' ? 'var(--hh-accent-ink)' : 'var(--hh-muted)',
                fontWeight: selectedSection === 'all' ? 700 : 500,
              }}
            >
              <span>All Ecosystem</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/15 font-bold">
                {tasks.length}
              </span>
            </button>

            {sections.map((sec) => {
              const count = tasks.filter((t) => t.sectionId === sec.id).length;
              const isSelected = selectedSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setSelectedSection(sec.id)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-mono tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 border"
                  style={{
                    backgroundColor: isSelected ? sec.accent : 'var(--hh-surface)',
                    borderColor: isSelected ? sec.accent : 'var(--hh-border)',
                    color: isSelected ? '#ffffff' : 'var(--hh-muted)',
                    fontWeight: isSelected ? 700 : 500,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: isSelected ? '#ffffff' : sec.accent }}
                  />
                  <span>{sec.title}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/15 font-bold">
                    {count}
                  </span>
                </button>
              );
            })}

            {/* "+ Add Website" Button */}
            <button
              onClick={onOpenSectionManager}
              title="Add a new website as section"
              className="flex items-center gap-1.5 px-3 py-1.5 border border-dashed hover:border-emerald-500 hover:text-emerald-500 text-xs font-mono rounded-lg transition-all cursor-pointer whitespace-nowrap"
              style={{
                backgroundColor: 'var(--hh-surface)',
                borderColor: 'var(--hh-border)',
                color: 'var(--hh-muted)',
              }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Website</span>
            </button>
          </div>

          {/* Status Filters & Search */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--hh-muted)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="border rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none w-40 sm:w-48 font-mono"
                style={{
                  backgroundColor: 'var(--hh-surface)',
                  borderColor: 'var(--hh-border)',
                  color: 'var(--hh-text)',
                }}
              />
            </div>

            {/* Status Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'todo' | 'in_progress' | 'done' | 'urgent')}
              className="border rounded-lg px-2.5 py-1.5 text-xs font-mono focus:outline-none"
              style={{
                backgroundColor: 'var(--hh-surface)',
                borderColor: 'var(--hh-border)',
                color: 'var(--hh-text)',
              }}
            >
              <option value="all">All Status</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Completed</option>
              <option value="urgent">Urgent Only</option>
            </select>
          </div>
        </div>

        {/* Task Cards List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div
              className="text-center py-16 px-4 border border-dashed rounded-xl"
              style={{
                backgroundColor: 'var(--hh-surface)',
                borderColor: 'var(--hh-border)',
              }}
            >
              <CheckSquare className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: 'var(--hh-muted)' }} />
              <h3 className="text-base font-bold font-mono uppercase mb-1" style={{ color: 'var(--hh-text)' }}>
                No Tasks Found
              </h3>
              <p className="text-xs max-w-sm mx-auto mb-4" style={{ color: 'var(--hh-muted)' }}>
                Add a task above or switch your filters. Any task created here instantly syncs across all
                connected devices.
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 text-xs font-mono font-bold rounded-lg cursor-pointer"
                style={{
                  backgroundColor: 'var(--hh-accent)',
                  color: 'var(--hh-accent-ink)',
                }}
              >
                + Create First Task
              </button>
            </div>
          ) : (
            filteredTasks.map((task) => {
              const sec = getSection(task.sectionId);
              const isDone = task.status === 'done';

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl border transition-all duration-200 ${
                    isDone ? 'opacity-65' : 'shadow-md'
                  }`}
                  style={{
                    backgroundColor: 'var(--hh-surface)',
                    borderColor: 'var(--hh-border)',
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: Checkbox + Title + Description */}
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      <button
                        onClick={() =>
                          onUpdateTask(task.id, {
                            status: isDone ? 'todo' : 'done',
                            updatedAt: new Date().toISOString(),
                          })
                        }
                        className="mt-0.5 hover:text-emerald-500 cursor-pointer transition-colors"
                        style={{ color: 'var(--hh-muted)' }}
                        aria-label={isDone ? 'Mark as incomplete' : 'Mark as complete'}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          {/* Section Tag */}
                          {sec && (
                            <span
                              className="text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider text-white"
                              style={{ backgroundColor: sec.accent }}
                            >
                              {sec.title}
                            </span>
                          )}

                          {/* Priority Pill */}
                          <span
                            className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border font-semibold tracking-wider ${getPriorityBadge(
                              task.priority
                            )}`}
                          >
                            {task.priority}
                          </span>

                          {/* Due Date */}
                          {task.dueDate && (
                            <span className="text-[10px] font-mono flex items-center gap-1" style={{ color: 'var(--hh-muted)' }}>
                              <Calendar className="w-3 h-3" />
                              <span>Due: {task.dueDate}</span>
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h4
                          className={`text-sm sm:text-base font-semibold ${isDone ? 'line-through opacity-60' : ''}`}
                          style={{ color: 'var(--hh-text)' }}
                        >
                          {task.title}
                        </h4>

                        {/* Description */}
                        {task.description && (
                          <p className="text-xs mt-1 leading-relaxed line-clamp-2" style={{ color: 'var(--hh-muted)' }}>
                            {task.description}
                          </p>
                        )}

                        {/* Tags & Origin Device Badge */}
                        <div className="flex flex-wrap items-center gap-2 mt-2.5 font-mono text-[10px]" style={{ color: 'var(--hh-muted)' }}>
                          {task.tags &&
                            task.tags.map((tg, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded border"
                                style={{
                                  backgroundColor: 'var(--hh-bg)',
                                  borderColor: 'var(--hh-border)',
                                }}
                              >
                                #{tg}
                              </span>
                            ))}

                          <span className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/25 ml-auto">
                            <Smartphone className="w-2.5 h-2.5" />
                            <span>{task.deviceOrigin}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-1 font-mono" style={{ color: 'var(--hh-muted)' }}>
                      {/* Status quick toggle */}
                      <select
                        value={task.status}
                        onChange={(e) =>
                          onUpdateTask(task.id, {
                            status: e.target.value as TaskStatus,
                            updatedAt: new Date().toISOString(),
                          })
                        }
                        className="border rounded px-2 py-1 text-[10px] focus:outline-none"
                        style={{
                          backgroundColor: 'var(--hh-bg)',
                          borderColor: 'var(--hh-border)',
                          color: 'var(--hh-text)',
                        }}
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Completed</option>
                      </select>

                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="p-1.5 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors cursor-pointer"
                        title="Delete task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add Full Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="border rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl space-y-5 hh-theme-transition"
            style={{
              backgroundColor: 'var(--hh-surface)',
              borderColor: 'var(--hh-border)',
              color: 'var(--hh-text)',
            }}
          >
            <div
              className="flex items-center justify-between border-b pb-4"
              style={{ borderColor: 'var(--hh-border)' }}
            >
              <div>
                <span className="text-[10px] font-mono tracking-[0.2em] text-emerald-500 uppercase">
                  Multi-Device Cloud Sync
                </span>
                <h3 className="text-xl font-bold uppercase font-mono" style={{ color: 'var(--hh-text)' }}>
                  Create New Task
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="opacity-70 hover:opacity-100 font-mono text-sm cursor-pointer"
                style={{ color: 'var(--hh-text)' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDetailedTask} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block uppercase tracking-wider mb-1.5" style={{ color: 'var(--hh-muted)' }}>
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Update B2B catalogue pricing matrix"
                  className="w-full border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 font-sans"
                  style={{
                    backgroundColor: 'var(--hh-bg)',
                    borderColor: 'var(--hh-border)',
                    color: 'var(--hh-text)',
                  }}
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider mb-1.5" style={{ color: 'var(--hh-muted)' }}>
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Detailed instructions or specifications..."
                  className="w-full border rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:border-emerald-500 font-sans"
                  style={{
                    backgroundColor: 'var(--hh-bg)',
                    borderColor: 'var(--hh-border)',
                    color: 'var(--hh-text)',
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider mb-1.5" style={{ color: 'var(--hh-muted)' }}>
                    Website / Section
                  </label>
                  <select
                    value={newSectionId}
                    onChange={(e) => setNewSectionId(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-xs focus:outline-none"
                    style={{
                      backgroundColor: 'var(--hh-bg)',
                      borderColor: 'var(--hh-border)',
                      color: 'var(--hh-text)',
                    }}
                  >
                    {sections.map((sec) => (
                      <option key={sec.id} value={sec.id}>
                        {sec.title} ({sec.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-wider mb-1.5" style={{ color: 'var(--hh-muted)' }}>
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as Priority)}
                    className="w-full border rounded-lg px-3 py-2 text-xs focus:outline-none"
                    style={{
                      backgroundColor: 'var(--hh-bg)',
                      borderColor: 'var(--hh-border)',
                      color: 'var(--hh-text)',
                    }}
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider mb-1.5" style={{ color: 'var(--hh-muted)' }}>
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-xs focus:outline-none"
                    style={{
                      backgroundColor: 'var(--hh-bg)',
                      borderColor: 'var(--hh-border)',
                      color: 'var(--hh-text)',
                    }}
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider mb-1.5" style={{ color: 'var(--hh-muted)' }}>
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    placeholder="e.g. ERP, Drops, WhatsApp"
                    className="w-full border rounded-lg px-3 py-2 text-xs focus:outline-none font-sans"
                    style={{
                      backgroundColor: 'var(--hh-bg)',
                      borderColor: 'var(--hh-border)',
                      color: 'var(--hh-text)',
                    }}
                  />
                </div>
              </div>

              <div
                className="flex items-center justify-end gap-3 pt-4 border-t"
                style={{ borderColor: 'var(--hh-border)' }}
              >
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-lg cursor-pointer"
                  style={{
                    backgroundColor: 'var(--hh-bg)',
                    borderColor: 'var(--hh-border)',
                    color: 'var(--hh-text)',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg cursor-pointer shadow-lg"
                >
                  Sync Across Devices
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
