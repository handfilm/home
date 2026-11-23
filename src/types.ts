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
  sectionType?: 'static' | 'live-embed';
  embedUrl?: string | null;
  embedFallback?: string;
  subtitle?: string;
  description?: string;
  destinationUrl?: string;
  texture?: string;
  displayOrder?: number;
  status?: string;
  featured?: boolean;
  eyebrow?: string;
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

export interface SlideData {
  id?: string;
  url: string;
  tag?: string;
  title?: string;
  sub?: string;
  videoUrl?: string;
}

export type RawxDropKey =
  | 's1'
  | 's2a'
  | 's3'
  | 's4a'
  | 's5a'
  | 's6'
  | 's7a'
  | 's8a'
  | 's9'
  | 's10'
  | 's11'
  | 's12'
  | 'sA'
  | 'sB'
  | 'sC'
  | 'sD'
  | 'sE'
  | 'sF'
  | 'sG';

export type RawxCollectionCategory =
  | 'STREETWEAR & HEAVY TEES'
  | 'HIDE & 316L STEEL'
  | 'OUTERWEAR & FOOTWEAR'
  | 'EDITORIAL & LUT LAB';

export type RawxSizingType = 'apparel' | 'wrist' | 'footwear';

export interface DropMetadata {
  sectionKey: RawxDropKey;
  dropId: string;
  domId: string;
  dropCode: string;
  collection: RawxCollectionCategory;
  title: string;
  materialSpec: string;
  priceDisplay: string;
  preorderWindow: string;
  storyCaption: string;
  banglaTagline?: string;
  sizingType: RawxSizingType;
  craftsmanshipSpecs: {
    materialGrade: string;
    hardwareOrTrim: string;
    weightOrGauge: string;
    construction: string;
  };
  lutPreset: string;
}

export interface AllSlidersData {
  s1: SlideData[];
  s2a: SlideData[];
  s2b: SlideData[];
  s2c: SlideData[];
  s2d: SlideData[];
  s3: SlideData[];
  s4a: SlideData[];
  s4b: SlideData[];
  s5a: SlideData[];
  s5b: SlideData[];
  s5c: SlideData[];
  s6: SlideData[];
  s7a: SlideData[];
  s7b: SlideData[];
  s7c: SlideData[];
  s7d: SlideData[];
  s8a: SlideData[];
  s8b: SlideData[];
  s9: SlideData[];
  s10: SlideData[];
  s11: {
    beforeUrl: string;
    afterUrl: string;
    beforeLabel: string;
    afterLabel: string;
    title: string;
    tag: string;
    sub: string;
    filterMode: string;
  };
  s12: SlideData[];
  sA: SlideData[];
  sB: {
    cells: { title: string; sets: string[] }[];
  };
  sC: SlideData[];
  sD: {
    left: SlideData[];
    right: SlideData[];
  };
  sE: SlideData[];
  sF: SlideData[];
  sG?: SlideData[];
  dropMetadata?: Record<string, DropMetadata>;
}

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

export type ActiveTab = 'home' | 'handfilm' | 'ecosystem' | 'rawx-showcase' | 'tasks-hub';
