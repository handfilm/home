export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  sectionId: string;
  priority: Priority;
  status: TaskStatus;
  dueDate?: string;
  tags?: string[];
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  deviceOrigin: string;
}

export interface SectionItem {
  id: string;
  category: string;
  title: string;
  sub: string;
  desc: string;
  url: string;
  dest: string;
  cta: string;
  tex: string;
  accent: string;
  imageUrl?: string;
  isCustom?: boolean;
}

export interface ConnectedDevice {
  id: string;
  name: string;
  lastSeen: number;
  isCurrent?: boolean;
}

export interface SyncState {
  roomId: string;
  isConnected: boolean;
  isSyncing: boolean;
  lastSyncedAt: string | null;
  connectedDevices: ConnectedDevice[];
  deviceCount: number;
  syncLatencyMs?: number;
  offlineChangesCount: number;
}

export type ColorGrade = 'off' | 'teal' | 'amber' | 'noir' | 'bleach';

export interface GradeOption {
  id: ColorGrade;
  label: string;
  name: string;
  cls: string;
}

export type EasingType = 'ease' | 'snap' | 'brutal' | 'elastic';

export interface EasingOption {
  id: EasingType;
  label: string;
  css: string;
}

export type ActiveTab = 'ecosystem' | 'rawx-showcase' | 'tasks-hub';
