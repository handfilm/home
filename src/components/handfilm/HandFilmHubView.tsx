import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowUpRight,
  ChevronDown,
  Download,
  Film,
  Layers,
  Play,
  Sliders,
  Sparkles,
  Smartphone,
  Monitor,
  Cpu,
  Volume2,
  Maximize2,
  Eye,
  Zap,
  Globe,
  Check,
  X,
  HardDrive,
  Wand2,
  Youtube,
  Cloud,
  Package,
  Ratio,
  Building2,
  Clapperboard,
  ShoppingBag,
  Users,
  Terminal,
} from 'lucide-react';
import { trackEvent } from '../../services/analytics';
import { Language, TRANSLATIONS, TranslationDictionary } from '../../i18n/translations';
import { useTheme } from '../../context/ThemeContext';

import adCampaignsImg from '../../assets/images/handfilm_ad_campaigns_1795465510343.jpg';
import studioProjectsImg from '../../assets/images/handfilm_studio_projects_1795465511068.jpg';
import brandAssetsImg from '../../assets/images/handfilm_brand_assets_1795465510908.jpg';
import socialTrendsImg from '../../assets/images/handfilm_social_trends_1795465511816.jpg';
import tutorialsImg from '../../assets/images/handfilm_tutorials_1795465512209.jpg';

const STORYBOARD_BASE_URL = 'https://storyboard.handsandhead.com';
const B2B_CATALOG_URL = 'https://b2b.handsandhead.com/';

type MegaMenuKey = 'products' | 'features' | 'models' | 'integrations' | 'solutions';

interface MegaMenuItem {
  id: string;
  title: string;
  subtitle: string;
  banglaSample?: string;
  tag: string;
  href: string;
  icon: React.ReactNode;
}

interface MegaMenuGroup {
  key: MegaMenuKey;
  label: string;
  headline: string;
  summary: string;
  items: MegaMenuItem[];
}

interface VerticalShowcaseCard {
  id: string;
  title: string;
  kicker: string;
  banglaTag?: string;
  duration: string;
  ratio: string;
  description: string;
  chips: string[];
  imageUrl: string;
  fallbackGradient: string;
  href: string;
  queryTag: string;
}

interface ModelShowcaseItem {
  id: string;
  name: string;
  kicker: string;
  filterGroup: 'editor' | 'ai' | 'commerce';
  badge: string;
  latency: string;
  description: string;
  highlights: string[];
  query: string;
  href: string;
  gradientClass: string;
  accentHex: string;
}

interface WorkflowStep {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  banglaCaption: string;
  storyboardQuery: string;
  ctaLabel: string;
  previewHeader: string;
  previewSpecs: string[];
}

interface DownloadArtifact {
  id: string;
  platform: 'windows' | 'android';
  name: string;
  architecture: string;
  size: string;
  engine: string;
  description: string;
  features: string[];
  recommended?: boolean;
  actionUrl: string;
  ctaLabel: string;
}

export interface HandFilmHubViewProps {
  onSetCursorLabel?: (label: string) => void;
  language?: Language;
  t?: TranslationDictionary;
}

function buildStoryboardUrl(query: string): string {
  if (!query) return `${STORYBOARD_BASE_URL}/`;
  const clean = query.startsWith('?') ? query : `?${query}`;
  return `${STORYBOARD_BASE_URL}/${clean}`;
}

const MEGA_MENU_GROUPS: MegaMenuGroup[] = [
  {
    key: 'products',
    label: 'Products',
    headline: 'Five Production Surfaces. One WebGL2 Core.',
    summary: 'Launch straight into the exact Storyboard workspace calibrated for your edit.',
    items: [
      {
        id: 'prod-easy',
        title: 'Easy Mode',
        subtitle: '1-click guided creator editor for instant assembly',
        tag: '?mode=easy',
        href: buildStoryboardUrl('mode=easy'),
        icon: <Zap className="w-4 h-4 text-[#0284c7]" />,
      },
      {
        id: 'prod-beast',
        title: 'Beast Mode',
        subtitle: 'Full multi-track NLE & WebGL2 GPU color grading suite',
        tag: '?mode=beast',
        href: buildStoryboardUrl('mode=beast'),
        icon: <Layers className="w-4 h-4 text-[#8b5cf6]" />,
      },
      {
        id: 'prod-capcut',
        title: 'CapCut Mode',
        subtitle: 'Rapid magnetic timeline & automated beat-sync workflow',
        tag: '?mode=capcut',
        href: buildStoryboardUrl('mode=capcut'),
        icon: <Sparkles className="w-4 h-4 text-[#06b6d4]" />,
      },
      {
        id: 'prod-ad-studio',
        title: 'AD Studio',
        subtitle: 'F-Commerce & B2B high-converting product video generator',
        tag: '?tool=ad-studio',
        href: buildStoryboardUrl('tool=ad-studio'),
        icon: <ShoppingBag className="w-4 h-4 text-[#8b5cf6]" />,
      },
      {
        id: 'prod-100shots',
        title: '100-Shot Cinema Reel',
        subtitle: 'Instant 100-shot sequence assembly from raw clips & stills',
        tag: '?tool=100shots',
        href: buildStoryboardUrl('tool=100shots'),
        icon: <Clapperboard className="w-4 h-4 text-[#06b6d4]" />,
      },
    ],
  },
  {
    key: 'features',
    label: 'Features',
    headline: 'Hardware-Accelerated Browser Capabilities',
    summary: 'Zero-upload WebGL2 pipelines and native multi-codec timeline execution.',
    items: [
      {
        id: 'feat-smart-eye',
        title: 'Smart-Eye Auto Cut',
        subtitle: 'Silence removal, gaze framing, and scene boundary detection',
        tag: '?tool=smart-eye',
        href: buildStoryboardUrl('tool=smart-eye'),
        icon: <Eye className="w-4 h-4 text-[#06b6d4]" />,
      },
      {
        id: 'feat-bangla-type',
        title: 'Bangla Kinetic Typography',
        subtitle: 'Zero-broken-ligature motion titles & animated callouts',
        banglaSample: 'গতিশীল বাংলা টাইপোগ্রাফি',
        tag: '?tool=bangla-type',
        href: buildStoryboardUrl('tool=bangla-type'),
        icon: <Wand2 className="w-4 h-4 text-[#8b5cf6]" />,
      },
      {
        id: 'feat-mood-pad',
        title: '2D Mood-Pad Color Grade',
        subtitle: 'XY tactile cinematic LUT interpolation in WebGL2',
        tag: '?tool=mood-pad',
        href: buildStoryboardUrl('tool=mood-pad'),
        icon: <Sliders className="w-4 h-4 text-[#06b6d4]" />,
      },
      {
        id: 'feat-audio-master',
        title: 'Audio Stem & -14 LUFS Master',
        subtitle: 'Vocal isolation, ducking, and broadcast loudness normalization',
        tag: '?tool=audio-master',
        href: buildStoryboardUrl('tool=audio-master'),
        icon: <Volume2 className="w-4 h-4 text-[#8b5cf6]" />,
      },
      {
        id: 'feat-reframe',
        title: 'Reels 9:16 Auto-Reframe',
        subtitle: 'Subject-locked vertical framing from 16:9 cinema masters',
        tag: '?tool=reframe-9-16',
        href: buildStoryboardUrl('tool=reframe-9-16'),
        icon: <Ratio className="w-4 h-4 text-[#06b6d4]" />,
      },
      {
        id: 'feat-decoder',
        title: 'Universal Multi-Format Decoder',
        subtitle: 'Direct .MOV / .MKV / .AVI hardware ingest without transcoding',
        tag: '?tool=universal-decoder',
        href: buildStoryboardUrl('tool=universal-decoder'),
        icon: <Cpu className="w-4 h-4 text-[#8b5cf6]" />,
      },
    ],
  },
  {
    key: 'models',
    label: 'AI Models',
    headline: 'Specialized Vision, Audio & Subtitle Engines',
    summary: 'Composable neural passes tuned for South Asian & global creator production.',
    items: [
      {
        id: 'mod-smart-eye',
        title: 'Smart-Eye Vision Tracker',
        subtitle: 'Subject bounding lock & optical motion pan smoothing',
        tag: '?model=smart-eye-vision',
        href: buildStoryboardUrl('model=smart-eye-vision'),
        icon: <Eye className="w-4 h-4 text-[#06b6d4]" />,
      },
      {
        id: 'mod-beat-sync',
        title: 'Auto Beat-Sync Engine',
        subtitle: 'Transient onset quantization across 100+ rapid cuts',
        tag: '?model=beat-sync',
        href: buildStoryboardUrl('model=beat-sync'),
        icon: <Zap className="w-4 h-4 text-[#8b5cf6]" />,
      },
      {
        id: 'mod-bangla-sub',
        title: 'Bangla-EN Karaoke Subtitles',
        subtitle: 'Bilingual word-level sync with crisp Bengali ligatures',
        banglaSample: 'বাংলা + English সাবটাইটেল',
        tag: '?model=bangla-en-subtitles',
        href: buildStoryboardUrl('model=bangla-en-subtitles'),
        icon: <Globe className="w-4 h-4 text-[#06b6d4]" />,
      },
      {
        id: 'mod-mask',
        title: 'Background & Mask Isolation',
        subtitle: 'Real-time product & subject cutout over custom plates',
        tag: '?model=mask-isolation',
        href: buildStoryboardUrl('model=mask-isolation'),
        icon: <Layers className="w-4 h-4 text-[#8b5cf6]" />,
      },
      {
        id: 'mod-omni',
        title: '1→5 Omnichannel Resize',
        subtitle: 'Simultaneous 9:16, 4:5, 1:1, 16:9 & 2.39:1 master exports',
        tag: '?model=omnichannel-resize',
        href: buildStoryboardUrl('model=omnichannel-resize'),
        icon: <Maximize2 className="w-4 h-4 text-[#06b6d4]" />,
      },
    ],
  },
  {
    key: 'integrations',
    label: 'Integrations',
    headline: 'Direct Publishing & Edge Media Infrastructure',
    summary: 'Zero-middleman bridges to YouTube, Cloudflare R2, and HANDS & HEAD B2B.',
    items: [
      {
        id: 'int-youtube',
        title: 'YouTube Creator Studio',
        subtitle: 'OAuth 2.0 direct upload, chapters & metadata push',
        tag: '?integration=youtube-studio',
        href: buildStoryboardUrl('integration=youtube-studio'),
        icon: <Youtube className="w-4 h-4 text-[#06b6d4]" />,
      },
      {
        id: 'int-r2',
        title: 'Cloudflare R2 Zero-Server Media',
        subtitle: 'Zero-egress edge asset streaming & project state snapshots',
        tag: '?integration=cloudflare-r2',
        href: buildStoryboardUrl('integration=cloudflare-r2'),
        icon: <Cloud className="w-4 h-4 text-[#8b5cf6]" />,
      },
      {
        id: 'int-b2b',
        title: 'B2B Product Catalog',
        subtitle: 'Pull garment, leather & 316L SKUs from b2b.handsandhead.com',
        tag: 'b2b.handsandhead.com',
        href: B2B_CATALOG_URL,
        icon: <Package className="w-4 h-4 text-[#06b6d4]" />,
      },
      {
        id: 'int-safezones',
        title: 'Shorts / Reels / TikTok Safe-Zones',
        subtitle: 'Live HUD overlays protecting UI chrome margins',
        tag: '?integration=safe-zones',
        href: buildStoryboardUrl('integration=safe-zones'),
        icon: <Smartphone className="w-4 h-4 text-[#8b5cf6]" />,
      },
    ],
  },
  {
    key: 'solutions',
    label: 'Solutions',
    headline: 'Purpose-Built Workflows by Industry Wing',
    summary: 'Pre-configured presets tailored to Dhaka export houses, F-Commerce & studios.',
    items: [
      {
        id: 'sol-fcommerce',
        title: 'F-Commerce & D2C Brands',
        subtitle: 'High-CTR Bangla & English product reels built in under 3 minutes',
        banglaSample: 'এফ-কমার্স প্রোডাক্ট রিলস',
        tag: '?solution=f-commerce',
        href: buildStoryboardUrl('solution=f-commerce'),
        icon: <ShoppingBag className="w-4 h-4 text-[#06b6d4]" />,
      },
      {
        id: 'sol-rmg',
        title: 'Garments & Leather Export Houses',
        subtitle: 'Factory floor lookbooks, 300 GSM swatch reels & buyer pitch decks',
        tag: '?solution=rmg-leather-export',
        href: buildStoryboardUrl('solution=rmg-leather-export'),
        icon: <Building2 className="w-4 h-4 text-[#8b5cf6]" />,
      },
      {
        id: 'sol-creators',
        title: 'Short-Form Content Creators',
        subtitle: 'Beat-locked kinetic cuts, karaoke subtitles & 9:16 exports',
        tag: '?solution=short-form-creators',
        href: buildStoryboardUrl('solution=short-form-creators'),
        icon: <Film className="w-4 h-4 text-[#06b6d4]" />,
      },
      {
        id: 'sol-agencies',
        title: 'Agencies & Media Teams',
        subtitle: 'Multi-track Beast NLE timelines with shared R2 asset vaults',
        tag: '?solution=agencies',
        href: buildStoryboardUrl('solution=agencies'),
        icon: <Users className="w-4 h-4 text-[#8b5cf6]" />,
      },
    ],
  },
];

const VERTICAL_SHOWCASE_CARDS: VerticalShowcaseCard[] = [
  {
    id: 'ad-campaigns',
    title: 'Ad Campaigns',
    kicker: 'AD STUDIO',
    banglaTag: 'বিজ্ঞাপন ক্যাম্পেইন',
    duration: '00:15 REEL',
    ratio: '9:16',
    description: 'F-Commerce & D2C leather/apparel conversion cuts with instant price & CTA slates.',
    chips: ['9:16 Vertical', 'Price Slates', 'Bangla+EN'],
    imageUrl: adCampaignsImg,
    fallbackGradient: 'from-[#083344] via-[#0f172a] to-[#0a0c10]',
    href: buildStoryboardUrl('tool=ad-studio&workflow=ad-campaigns'),
    queryTag: '?tool=ad-studio',
  },
  {
    id: 'studio-projects',
    title: 'Studio Projects',
    kicker: 'BEAST NLE',
    duration: '02:40 FILM',
    ratio: '9:16',
    description: 'Multi-track timeline compositing, WebGL2 color LUTs, and -14 LUFS stem mastering.',
    chips: ['WebGL2 LUT', 'Multi-Track', '-14 LUFS'],
    imageUrl: studioProjectsImg,
    fallbackGradient: 'from-[#1e1b4b] via-[#0f172a] to-[#0a0c10]',
    href: buildStoryboardUrl('mode=beast&workflow=studio-projects'),
    queryTag: '?mode=beast',
  },
  {
    id: 'brand-assets',
    title: 'Brand Assets',
    kicker: 'B2B CATALOG',
    duration: '00:30 LOOKBOOK',
    ratio: '9:16',
    description: '300 GSM combed cotton & 316L stainless hardware showcase reels synced from B2B.',
    chips: ['300 GSM', '316L Steel', 'B2B Sync'],
    imageUrl: brandAssetsImg,
    fallbackGradient: 'from-[#0f172a] via-[#131720] to-[#0a0c10]',
    href: buildStoryboardUrl('tool=ad-studio&workflow=brand-assets'),
    queryTag: '?workflow=brand-assets',
  },
  {
    id: 'social-trends',
    title: 'Social Trends',
    kicker: 'CAPCUT RAPID',
    duration: '00:12 SYNC',
    ratio: '9:16',
    description: 'Magnetic timeline beat-snapping, Smart-Eye framing, and kinetic bilingual hooks.',
    chips: ['Beat-Sync', 'Smart-Eye', 'Auto-Reframe'],
    imageUrl: socialTrendsImg,
    fallbackGradient: 'from-[#164e63] via-[#131720] to-[#0a0c10]',
    href: buildStoryboardUrl('mode=capcut&workflow=social-trends'),
    queryTag: '?mode=capcut',
  },
  {
    id: 'tutorials',
    title: 'Creator Guides',
    kicker: 'EASY MODE',
    banglaTag: 'বাংলা টিউটোরিয়াল',
    duration: '01:05 GUIDE',
    ratio: '9:16',
    description: '1-click guided walkthroughs from raw .MOV/.MKV footage to finished cinema export.',
    chips: ['.MOV/.MKV', '1-Click', 'Zero Install'],
    imageUrl: tutorialsImg,
    fallbackGradient: 'from-[#312e81] via-[#131720] to-[#0a0c10]',
    href: buildStoryboardUrl('mode=easy&workflow=tutorials'),
    queryTag: '?mode=easy',
  },
];

const MODEL_SHOWCASE_ITEMS: ModelShowcaseItem[] = [
  {
    id: 'easy-cockpit',
    name: 'Easy Cockpit',
    kicker: '01 / GUIDED',
    filterGroup: 'editor',
    badge: '1-Click Creator',
    latency: '0.4s Boot',
    description: 'Streamlined single-track cockpit for fast trims, automated Bangla-EN captions, and instant social exports.',
    highlights: ['Auto Trim', 'Bangla Captions', '9:16 Preset'],
    query: '?mode=easy',
    href: buildStoryboardUrl('mode=easy'),
    gradientClass: 'from-cyan-500/25 via-sky-500/10 to-indigo-500/20',
    accentHex: '#06b6d4',
  },
  {
    id: 'beast-nle',
    name: 'Beast NLE',
    kicker: '02 / MULTI-TRACK',
    filterGroup: 'editor',
    badge: 'WebGL2 Cinema',
    latency: '60 FPS GPU',
    description: 'Full non-linear multi-track timeline with GLSL shaders, 2D Mood-Pad grading, and -14 LUFS mastering.',
    highlights: ['Multi-Track', '2D Mood-Pad', '.MOV/.MKV Native'],
    query: '?mode=beast',
    href: buildStoryboardUrl('mode=beast'),
    gradientClass: 'from-violet-500/25 via-indigo-500/10 to-cyan-500/20',
    accentHex: '#8b5cf6',
  },
  {
    id: 'capcut-rapid',
    name: 'CapCut Rapid',
    kicker: '03 / MAGNETIC',
    filterGroup: 'editor',
    badge: 'Beat-Sync',
    latency: '12ms Snap',
    description: 'Magnetic ripple timeline engineered for high-velocity short-form edits, transient markers, and velocity curves.',
    highlights: ['Beat Markers', 'Speed-Ramp', 'Safe-Zones'],
    query: '?mode=capcut',
    href: buildStoryboardUrl('mode=capcut'),
    gradientClass: 'from-sky-500/25 via-cyan-500/15 to-teal-500/20',
    accentHex: '#0284c7',
  },
  {
    id: 'smart-eye-vision',
    name: 'Smart-Eye Vision',
    kicker: '04 / VISION AI',
    filterGroup: 'ai',
    badge: 'AI Auto Cut',
    latency: 'Real-Time',
    description: 'Intelligent vision tracker that locks speakers, leather/garment focal points, and removes dead air automatically.',
    highlights: ['Subject Lock', 'Dead-Air Cut', 'Mask Cutout'],
    query: '?tool=smart-eye',
    href: buildStoryboardUrl('tool=smart-eye'),
    gradientClass: 'from-indigo-500/25 via-violet-500/15 to-cyan-500/20',
    accentHex: '#7c3aed',
  },
  {
    id: 'ad-studio-gen',
    name: 'AD Studio',
    kicker: '05 / COMMERCE',
    filterGroup: 'commerce',
    badge: 'F-Commerce & B2B',
    latency: '1→5 Formats',
    description: 'Turns raw product photos or B2B catalog SKUs into high-converting vertical ads with Bangla & English hooks.',
    highlights: ['SKU-to-Video', 'Bangla Titles', 'WhatsApp CTA'],
    query: '?tool=ad-studio',
    href: buildStoryboardUrl('tool=ad-studio'),
    gradientClass: 'from-cyan-500/25 via-emerald-500/10 to-sky-500/20',
    accentHex: '#06b6d4',
  },
  {
    id: 'reels-reframe',
    name: 'Reels Reframe',
    kicker: '06 / RESIZE AI',
    filterGroup: 'ai',
    badge: '1→5 Matrix',
    latency: 'Batch GPU',
    description: 'Reframes horizontal 16:9 cinema timelines into 9:16 Reels, Shorts, TikTok, 4:5 Feed, and 1:1 square masters.',
    highlights: ['Pan Tracking', 'Safe-Zones', 'Batch Export'],
    query: '?tool=reframe-9-16',
    href: buildStoryboardUrl('tool=reframe-9-16'),
    gradientClass: 'from-violet-500/25 via-fuchsia-500/10 to-sky-500/20',
    accentHex: '#8b5cf6',
  },
];

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    number: '01',
    title: 'Start With Your Idea',
    subtitle: 'Drop .MOV / .MKV / .AVI clips, a B2B SKU, or a 100-Shot prompt',
    description:
      'Ingest raw camera footage directly in the browser with our universal decoder—or launch AD Studio with a product SKU to auto-build your hook, storyboard beats, and bilingual script.',
    banglaCaption: 'সহজ বাংলা ও ইংরেজি স্ক্রিপ্ট দিয়ে শুরু করুন',
    storyboardQuery: 'tool=100shots',
    ctaLabel: 'Launch in Storyboard ↗',
    previewHeader: 'INGEST & STORYBOARD SEED',
    previewSpecs: ['Universal .MOV/.MKV/.AVI', 'B2B SKU Bridge', 'Bangla-EN Hook'],
  },
  {
    number: '02',
    title: 'Shape on Timeline',
    subtitle: 'Switch seamlessly between Easy, CapCut Rapid, and Beast NLE modes',
    description:
      'Snap cuts to audio transients with Auto Beat-Sync, strip pauses via Smart-Eye Auto Cut, and layer crisp Bangla kinetic typography with intact conjunct ligatures.',
    banglaCaption: 'বিট-সিঙ্ক টাইমলাইনে নিখুঁত এডিটিং',
    storyboardQuery: 'mode=capcut',
    ctaLabel: 'Launch in Storyboard ↗',
    previewHeader: 'MAGNETIC BEAT-SYNC & SMART-EYE NLE',
    previewSpecs: ['Smart-Eye Auto Cut', 'Magnetic Beat Snapping', 'Bangla Kinetic Titles'],
  },
  {
    number: '03',
    title: 'Final Color & Export',
    subtitle: '2D Mood-Pad WebGL2 grade, -14 LUFS master & 1→5 Omnichannel Export',
    description:
      'Dial cinema color with the tactile 2D Mood-Pad, lock audio loudness to -14 LUFS, verify Shorts/Reels safe-zones, and publish directly to YouTube Studio or Cloudflare R2.',
    banglaCaption: 'কালার গ্রেড এবং -১৪ LUFS মাস্টারিং',
    storyboardQuery: 'mode=beast&tool=mood-pad',
    ctaLabel: 'Launch in Storyboard ↗',
    previewHeader: 'WEBGL2 MOOD-PAD & OMNICHANNEL MASTER',
    previewSpecs: ['2D Mood-Pad LUTs', '-14 LUFS Audio Master', 'YouTube OAuth & R2'],
  },
];

const DOWNLOAD_ARTIFACTS: DownloadArtifact[] = [
  {
    id: 'win-tauri',
    platform: 'windows',
    name: 'HandFilm Desktop — Tauri Lightweight',
    architecture: 'Windows 10/11 (x64) · .exe Installer',
    size: '25 MB',
    engine: 'Rust + Native WebView2 + WebGL2',
    description:
      'Ultra-compact desktop binary with near-instant cold start, native local filesystem access, and hardware-accelerated WebGL2 cinema preview.',
    features: [
      '25 MB minimal footprint',
      'Direct local NVMe project cache',
      'Zero background bloatware',
    ],
    recommended: true,
    actionUrl: buildStoryboardUrl('download=windows-tauri'),
    ctaLabel: 'Get Windows Tauri (.exe) ↗',
  },
  {
    id: 'win-electron',
    platform: 'windows',
    name: 'HandFilm Desktop — Electron Classic',
    architecture: 'Windows 10/11 (x64) · .exe Bundle',
    size: '118 MB',
    engine: 'Bundled Chromium + Local FFmpeg Codecs',
    description:
      'Full standalone workstation build bundling dedicated FFmpeg ProRes/MKV/AVI codecs for offline multi-track Beast NLE rendering.',
    features: [
      'Bundled offline FFmpeg pipeline',
      'ProRes, .MKV & .AVI batch render',
      'Dual-monitor color grading out',
    ],
    actionUrl: buildStoryboardUrl('download=windows-electron'),
    ctaLabel: 'Get Windows Electron (.exe) ↗',
  },
  {
    id: 'android-apk',
    platform: 'android',
    name: 'HandFilm Mobile Studio',
    architecture: 'Android 10+ (ARM64-v8a) · .apk Package',
    size: '38 MB',
    engine: 'Mobile WebGL2 + Reels 9:16 Safe-Zone HUD',
    description:
      'Shoot, trim, apply 2D Mood-Pad LUTs, and publish 9:16 Reels or F-Commerce product cuts directly from your Android phone.',
    features: [
      '9:16 Reels & Shorts capture',
      'Bangla-EN auto karaoke captions',
      'Syncs projects with Storyboard Cloud',
    ],
    actionUrl: buildStoryboardUrl('download=android-apk'),
    ctaLabel: 'Get Android Studio (.apk) ↗',
  },
];

export default function HandFilmHubView({
  onSetCursorLabel,
  language = 'en',
  t = TRANSLATIONS.en,
}: HandFilmHubViewProps) {
  const { isDark } = useTheme();
  const [openMenu, setOpenMenu] = useState<MegaMenuKey | null>(null);
  const [activeModelFilter, setActiveModelFilter] = useState<'all' | 'editor' | 'ai' | 'commerce'>('all');
  const [selectedModelId, setSelectedModelId] = useState<string>('easy-cockpit');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [moodPadPos, setMoodPadPos] = useState<{ x: number; y: number }>({ x: 64, y: 34 });
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false);

  // Touch tap-to-reveal states for minimalist hover cards
  const [expandedVerticalId, setExpandedVerticalId] = useState<string | null>(null);
  const [expandedModelId, setExpandedModelId] = useState<string | null>(null);
  const [expandedDiscoverId, setExpandedDiscoverId] = useState<string | null>(null);

  const navContainerRef = useRef<HTMLDivElement | null>(null);
  const closeHoverTimerRef = useRef<number | null>(null);

  const activeMenuGroup = MEGA_MENU_GROUPS.find((g) => g.key === openMenu) || null;
  const activeStep = WORKFLOW_STEPS[activeStepIndex] || WORKFLOW_STEPS[0];

  const filteredModels =
    activeModelFilter === 'all'
      ? MODEL_SHOWCASE_ITEMS
      : MODEL_SHOWCASE_ITEMS.filter((m) => m.filterGroup === activeModelFilter);

  const clearHoverTimer = useCallback(() => {
    if (closeHoverTimerRef.current !== null) {
      window.clearTimeout(closeHoverTimerRef.current);
      closeHoverTimerRef.current = null;
    }
  }, []);

  const handleOpenHoverMenu = useCallback(
    (key: MegaMenuKey) => {
      clearHoverTimer();
      setOpenMenu(key);
    },
    [clearHoverTimer]
  );

  const handleScheduleCloseMenu = useCallback(() => {
    clearHoverTimer();
    closeHoverTimerRef.current = window.setTimeout(() => {
      setOpenMenu(null);
    }, 140);
  }, [clearHoverTimer]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenMenu(null);
        setIsDownloadModalOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (navContainerRef.current && !navContainerRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      clearHoverTimer();
    };
  }, [clearHoverTimer]);

  const scrollToSection = (sectionId: string) => {
    setOpenMenu(null);
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleMoodPadInteract = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = Math.max(5, Math.min(95, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
    const yPct = Math.max(5, Math.min(95, Math.round(((e.clientY - rect.top) / rect.height) * 100)));
    setMoodPadPos({ x: xPct, y: yPct });
  };

  const trackStoryboardLaunch = (source: string, targetUrl: string) => {
    trackEvent('HANDFILM_STORYBOARD_LAUNCH', { source, targetUrl });
  };

  const getSubnavLabel = (key: MegaMenuKey): string => {
    return t.handfilm.subnav[key];
  };

  return (
    <div
      className={`relative min-h-[100dvh] w-full pt-[128px] md:pt-[78px] pb-36 sm:pb-40 font-inter hh-theme-transition ${
        language === 'bn' ? 'bangla-text' : ''
      }`}
      style={{
        backgroundColor: 'var(--hh-bg)',
        color: 'var(--hh-text)',
      }}
      onMouseEnter={() => onSetCursorLabel?.('HANDFILM STUDIO →')}
    >
      {/* Airy CapCut-Inspired Ambient Aura */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 68% 44% at 50% 0%, rgba(6, 182, 212, 0.14), transparent 72%), radial-gradient(ellipse 46% 36% at 86% 18%, rgba(139, 92, 246, 0.12), transparent 70%)'
            : 'radial-gradient(ellipse 68% 44% at 50% 0%, rgba(2, 132, 199, 0.08), transparent 72%), radial-gradient(ellipse 46% 36% at 86% 18%, rgba(124, 58, 237, 0.07), transparent 70%)',
        }}
      />

      {/* ════════════════════════════════════════════════════════════════════════
          A. STICKY SUB-NAVIGATION BAR WITH HOVER / CLICK MEGA-MENUS
      ════════════════════════════════════════════════════════════════════════ */}
      <div
        ref={navContainerRef}
        onMouseLeave={handleScheduleCloseMenu}
        className="sticky top-[129px] md:top-[79px] z-40 border-b backdrop-blur-xl hh-theme-transition"
        style={{
          borderColor: 'var(--hh-border)',
          backgroundColor: 'var(--hh-header-bg)',
        }}
      >
        <div className="mx-auto w-full max-w-[1840px] px-4 sm:px-6 lg:px-10">
          {/* Desktop Single-Row Sub-Nav */}
          <div className="hidden lg:flex items-center justify-between gap-3 py-2">
            {/* Left Brand Mark */}
            <div className="flex items-center gap-2.5 min-w-0 shrink-0">
              <a
                href={buildStoryboardUrl('')}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackStoryboardLaunch('subnav_brand', buildStoryboardUrl(''))}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors whitespace-nowrap shrink-0"
                style={{
                  backgroundColor: 'var(--hh-surface)',
                  borderColor: 'var(--hh-accent)',
                  color: 'var(--hh-text)',
                }}
              >
                <Film className="w-3.5 h-3.5" style={{ color: 'var(--hh-accent)' }} />
                <span className="font-space-mono text-[11px] font-bold tracking-[0.12em] uppercase">
                  {t.handfilm.studioLabel}
                </span>
              </a>
              <span
                className="hidden xl:inline font-space-mono text-[11px] whitespace-nowrap"
                style={{ color: 'var(--hh-muted)' }}
              >
                WebGL2 Creator Engine
              </span>
            </div>

            {/* Center Interactive Dropdown Triggers */}
            <nav
              aria-label="HandFilm Product Showcase Navigation"
              className="flex items-center gap-0.5 xl:gap-1 min-w-0 overflow-x-auto no-scrollbar"
            >
              {MEGA_MENU_GROUPS.map((group) => {
                const isOpen = openMenu === group.key;
                return (
                  <button
                    key={group.key}
                    type="button"
                    aria-expanded={isOpen}
                    onMouseEnter={() => handleOpenHoverMenu(group.key)}
                    onClick={() => setOpenMenu(isOpen ? null : group.key)}
                    className="inline-flex items-center gap-1 px-2.5 xl:px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    style={{
                      backgroundColor: isOpen ? 'var(--hh-surface-2)' : 'transparent',
                      color: isOpen ? 'var(--hh-text)' : 'var(--hh-muted)',
                    }}
                  >
                    <span>{getSubnavLabel(group.key)}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-150 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      style={{ color: isOpen ? 'var(--hh-accent)' : 'var(--hh-muted)' }}
                    />
                  </button>
                );
              })}

              <button
                type="button"
                onMouseEnter={() => setOpenMenu(null)}
                onClick={() => scrollToSection('handfilm-discover')}
                className="px-2.5 xl:px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
                style={{ color: 'var(--hh-muted)' }}
              >
                {t.handfilm.subnav.discover}
              </button>

              <button
                type="button"
                onMouseEnter={() => setOpenMenu(null)}
                onClick={() => scrollToSection('handfilm-pricing')}
                className="px-2.5 xl:px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
                style={{ color: 'var(--hh-muted)' }}
              >
                {t.handfilm.subnav.pricing}
              </button>
            </nav>

            {/* Right Action CTAs */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setOpenMenu(null);
                  setIsDownloadModalOpen(true);
                  trackEvent('HANDFILM_OPEN_DOWNLOAD_MODAL', { source: 'subnav' });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
                style={{
                  backgroundColor: 'var(--hh-surface)',
                  borderColor: 'var(--hh-border)',
                  color: 'var(--hh-text)',
                }}
              >
                <Download className="w-3.5 h-3.5" style={{ color: 'var(--hh-accent-2)' }} />
                <span>{t.handfilm.downloadBtn}</span>
              </button>

              <a
                href={buildStoryboardUrl('')}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackStoryboardLaunch('subnav_try_online', buildStoryboardUrl(''))}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-transform hover:scale-[1.02] whitespace-nowrap shrink-0"
                style={{
                  backgroundColor: 'var(--hh-accent)',
                  color: 'var(--hh-accent-ink)',
                }}
              >
                <span>{t.handfilm.tryOnline}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Tablet/Mobile Horizontally Scrollable Unified Sub-Nav Strip */}
          <div className="flex lg:hidden items-center gap-2 overflow-x-auto py-2 no-scrollbar">
            <a
              href={buildStoryboardUrl('')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackStoryboardLaunch('subnav_brand', buildStoryboardUrl(''))}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-colors whitespace-nowrap shrink-0"
              style={{
                backgroundColor: 'var(--hh-surface)',
                borderColor: 'var(--hh-accent)',
                color: 'var(--hh-text)',
              }}
            >
              <Film className="w-3 h-3" style={{ color: 'var(--hh-accent)' }} />
              <span className="font-space-mono text-[10.5px] font-bold tracking-[0.1em] uppercase">
                {t.handfilm.studioLabel}
              </span>
            </a>

            <span
              className="font-space-mono text-[10.5px] whitespace-nowrap shrink-0 px-1"
              style={{ color: 'var(--hh-muted)' }}
            >
              WebGL2 Creator Engine
            </span>

            {MEGA_MENU_GROUPS.map((group) => {
              const isOpen = openMenu === group.key;
              return (
                <button
                  key={group.key}
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenMenu(isOpen ? null : group.key)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer border"
                  style={{
                    backgroundColor: isOpen ? 'var(--hh-accent)' : 'var(--hh-surface)',
                    borderColor: isOpen ? 'var(--hh-accent)' : 'var(--hh-border)',
                    color: isOpen ? 'var(--hh-accent-ink)' : 'var(--hh-text)',
                  }}
                >
                  <span>{getSubnavLabel(group.key)}</span>
                  <ChevronDown className={`w-3 h-3 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => scrollToSection('handfilm-discover')}
              className="px-2.5 py-1 rounded-lg text-xs font-medium border whitespace-nowrap shrink-0 cursor-pointer"
              style={{
                backgroundColor: 'var(--hh-surface)',
                borderColor: 'var(--hh-border)',
                color: 'var(--hh-text)',
              }}
            >
              {t.handfilm.subnav.discover}
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('handfilm-pricing')}
              className="px-2.5 py-1 rounded-lg text-xs font-medium border whitespace-nowrap shrink-0 cursor-pointer"
              style={{
                backgroundColor: 'var(--hh-surface)',
                borderColor: 'var(--hh-border)',
                color: 'var(--hh-text)',
              }}
            >
              {t.handfilm.subnav.pricing}
            </button>

            <button
              type="button"
              onClick={() => {
                setOpenMenu(null);
                setIsDownloadModalOpen(true);
                trackEvent('HANDFILM_OPEN_DOWNLOAD_MODAL', { source: 'subnav_mobile' });
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer"
              style={{
                backgroundColor: 'var(--hh-surface)',
                borderColor: 'var(--hh-border)',
                color: 'var(--hh-text)',
              }}
            >
              <Download className="w-3 h-3" style={{ color: 'var(--hh-accent-2)' }} />
              <span>{t.handfilm.downloadBtn}</span>
            </button>

            <a
              href={buildStoryboardUrl('')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackStoryboardLaunch('subnav_try_online_mobile', buildStoryboardUrl(''))}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0"
              style={{
                backgroundColor: 'var(--hh-accent)',
                color: 'var(--hh-accent-ink)',
              }}
            >
              <span>{t.handfilm.tryOnline}</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Mega-Menu Dropdown Panel */}
        {activeMenuGroup && (
          <div
            onMouseEnter={clearHoverTimer}
            className="absolute left-0 right-0 top-full z-50 border-b backdrop-blur-2xl shadow-2xl"
            style={{
              borderColor: 'var(--hh-border)',
              backgroundColor: 'var(--hh-glass-bg)',
            }}
          >
            <div className="mx-auto w-full max-w-[1840px] px-4 sm:px-6 lg:px-10 py-5">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Context */}
                <div
                  className="lg:col-span-4 space-y-2 border-b lg:border-b-0 lg:border-r pb-4 lg:pb-0 lg:pr-6"
                  style={{ borderColor: 'var(--hh-border)' }}
                >
                  <div
                    className="font-space-mono text-[11px] uppercase tracking-[0.16em] font-semibold"
                    style={{ color: 'var(--hh-accent)' }}
                  >
                    {getSubnavLabel(activeMenuGroup.key)}
                  </div>
                  <h3
                    className="font-bebas text-2xl sm:text-3xl tracking-wide leading-none"
                    style={{ color: 'var(--hh-text)' }}
                  >
                    {activeMenuGroup.headline}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--hh-muted)' }}>
                    {activeMenuGroup.summary}
                  </p>
                  <div className="pt-2">
                    <a
                      href={buildStoryboardUrl('')}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        trackStoryboardLaunch(`megamenu_${activeMenuGroup.key}_launch`, buildStoryboardUrl(''))
                      }
                      className="inline-flex items-center gap-1.5 text-xs font-space-mono font-semibold hover:underline"
                      style={{ color: 'var(--hh-accent)' }}
                    >
                      <span>storyboard.handsandhead.com</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Right Clickable Items Grid */}
                <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {activeMenuGroup.items.map((item) => (
                    <a
                      key={item.id}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        trackStoryboardLaunch(`megamenu_${item.id}`, item.href);
                        setOpenMenu(null);
                      }}
                      className="group flex flex-col justify-between gap-2.5 p-3.5 rounded-[16px] border transition-all hover:-translate-y-0.5"
                      style={{
                        backgroundColor: 'var(--hh-surface)',
                        borderColor: 'var(--hh-border)',
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className="w-8 h-8 rounded-lg border flex items-center justify-center shrink-0"
                            style={{
                              backgroundColor: 'var(--hh-bg)',
                              borderColor: 'var(--hh-border)',
                            }}
                          >
                            {item.icon}
                          </span>
                          <div className="min-w-0">
                            <div
                              className="text-sm font-semibold truncate"
                              style={{ color: 'var(--hh-text)' }}
                            >
                              {item.title}
                            </div>
                            <div
                              className="font-space-mono text-[10px] truncate"
                              style={{ color: 'var(--hh-muted)' }}
                            >
                              {item.tag}
                            </div>
                          </div>
                        </div>
                        <ArrowUpRight
                          className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          style={{ color: 'var(--hh-accent)' }}
                        />
                      </div>

                      <p className="text-xs leading-relaxed" style={{ color: 'var(--hh-muted)' }}>
                        {item.subtitle}
                      </p>

                      {item.banglaSample && (
                        <div
                          lang="bn"
                          className="bangla-text text-xs pt-1 border-t"
                          style={{ color: 'var(--hh-accent-2)', borderColor: 'var(--hh-border)' }}
                        >
                          {item.banglaSample}
                        </div>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 mx-auto w-full max-w-[1840px] px-4 sm:px-6 lg:px-10">
        {/* ════════════════════════════════════════════════════════════════════════
            B. HERO SHOWCASE & 5 ULTRA-RESPONSIVE VIEWPORT-PROPORTIONAL CARDS
        ════════════════════════════════════════════════════════════════════════ */}
        <section
          aria-labelledby="handfilm-hero-title"
          className="py-3 md:py-5 pb-6 md:pb-8 border-b"
          style={{ borderColor: 'var(--hh-border)' }}
        >
          <div className="max-w-4xl mx-auto text-center space-y-2 sm:space-y-2.5">
            <div className="inline-flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 font-space-mono text-[10.5px] uppercase tracking-[0.18em]">
              <span style={{ color: 'var(--hh-accent-2)' }} className="font-semibold">
                {t.handfilm.studioLabel}
              </span>
              <span aria-hidden="true" style={{ color: 'var(--hh-border)' }}>·</span>
              <span style={{ color: 'var(--hh-muted)' }}>STORYBOARD.HANDSANDHEAD.COM</span>
              <span aria-hidden="true" style={{ color: 'var(--hh-border)' }}>·</span>
              <span style={{ color: 'var(--hh-accent)' }} className="font-semibold">
                WEBGL2 NLE
              </span>
            </div>

            <h1
              id="handfilm-hero-title"
              className="font-bold tracking-tight leading-[1.04]"
              style={{
                fontSize: 'clamp(1.75rem, 3.2vw, 3.25rem)',
                textWrap: 'balance',
                color: 'var(--hh-text)',
              }}
            >
              {t.handfilm.heroHeadlinePrefix}{' '}
              <span
                className="font-cormorant italic font-semibold tracking-normal"
                style={{ color: 'var(--hh-accent)' }}
              >
                {t.handfilm.heroHeadlineAccent}
              </span>
            </h1>

            <p className="text-sm sm:text-[15px] max-w-2xl mx-auto leading-snug" style={{ color: 'var(--hh-muted)' }}>
              {t.handfilm.heroSubline}
            </p>

            {/* Hero Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 pt-1">
              <a
                href={buildStoryboardUrl('')}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackStoryboardLaunch('hero_try_online', buildStoryboardUrl(''))}
                onMouseEnter={() => onSetCursorLabel?.('LAUNCH STORYBOARD ↗')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all hover:scale-[1.02] whitespace-nowrap shrink-0"
                style={{
                  backgroundColor: 'var(--hh-accent)',
                  color: 'var(--hh-accent-ink)',
                  boxShadow: isDark
                    ? '0 10px 28px rgba(6, 182, 212, 0.26)'
                    : '0 10px 24px rgba(2, 132, 199, 0.20)',
                }}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{t.handfilm.tryOnline}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => {
                  setIsDownloadModalOpen(true);
                  trackEvent('HANDFILM_OPEN_DOWNLOAD_MODAL', { source: 'hero' });
                }}
                onMouseEnter={() => onSetCursorLabel?.('GET DESKTOP / APK')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
                style={{
                  backgroundColor: 'var(--hh-surface)',
                  borderColor: 'var(--hh-border)',
                  color: 'var(--hh-text)',
                }}
              >
                <Download className="w-3.5 h-3.5" style={{ color: 'var(--hh-accent-2)' }} />
                <span>{t.handfilm.downloadBtn}</span>
              </button>
            </div>

            <div
              className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 pt-0.5 font-space-mono text-[10.5px]"
              style={{ color: 'var(--hh-muted)' }}
            >
              <span>Zero-Install Browser NLE</span>
              <span aria-hidden="true">·</span>
              <span>.MOV / .MKV / .AVI Native</span>
              <span aria-hidden="true">·</span>
              <span lang="bn" className="bangla-text" style={{ color: 'var(--hh-accent-2)' }}>
                বাংলা কাইনেটিক টাইপোগ্রাফি ও সাবটাইটেল
              </span>
              <span aria-hidden="true">·</span>
              <span>{t.handfilm.tapHint}</span>
            </div>
          </div>

          {/* 5 Viewport-Proportional CapCut-Style Minimalist Hover-Reveal Cards */}
          <div className="mt-4 sm:mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 lg:gap-4">
            {VERTICAL_SHOWCASE_CARDS.map((card) => {
              const isExpanded = expandedVerticalId === card.id;
              return (
                <div
                  key={card.id}
                  onMouseEnter={() => onSetCursorLabel?.(`OPEN ${card.title.toUpperCase()} ↗`)}
                  onClick={() => setExpandedVerticalId(isExpanded ? null : card.id)}
                  className={`group relative h-[clamp(220px,36vh,360px)] rounded-[20px] overflow-hidden border bg-gradient-to-b ${card.fallbackGradient} transition-all duration-300 ease-out hover:-translate-y-1 cursor-pointer`}
                  style={{
                    borderColor: 'var(--hh-border)',
                    boxShadow: 'var(--hh-card-shadow)',
                  }}
                >
                  <img
                    src={card.imageUrl}
                    alt={`${card.title} workflow preview in HandFilm Studio`}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                  />

                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/35"
                  />

                  {/* Resting Minimal Badge Only */}
                  <div className="relative z-10 p-3 sm:p-3.5 flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/55 backdrop-blur-md border border-white/15 font-space-mono text-[10px] font-bold uppercase tracking-wider text-[#06b6d4]">
                      {card.kicker}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-black/45 backdrop-blur-md font-space-mono text-[9.5px] text-zinc-200 tabular-nums">
                      {card.ratio}
                    </span>
                  </div>

                  {/* Resting Minimal 2-Word Title Pinned Cleanly Inside Bottom Gradient */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 z-10 p-4 transition-all duration-300 ease-out ${
                      isExpanded
                        ? 'opacity-0 translate-y-4 pointer-events-none'
                        : 'group-hover:opacity-0 group-hover:translate-y-4'
                    }`}
                  >
                    <h2 className="text-lg xl:text-xl font-bold tracking-tight text-white leading-tight drop-shadow-sm">
                      {card.title}
                    </h2>
                  </div>

                  {/* Hover / Tap Glassmorphic Detail Reveal Drawer */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className={`absolute inset-x-2 bottom-2 z-20 rounded-xl p-3 backdrop-blur-2xl bg-black/82 border border-white/25 text-white transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] space-y-2 ${
                      isExpanded
                        ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                        : 'opacity-0 translate-y-6 scale-95 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 group-hover:pointer-events-auto'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm sm:text-base font-black text-white leading-tight truncate">
                        {card.title}
                      </span>
                      <span className="font-space-mono text-[10px] font-bold text-[#06b6d4] shrink-0">
                        {card.duration}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-100 leading-snug line-clamp-2 font-medium">
                      {card.description}
                    </p>

                    <a
                      href={card.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackStoryboardLaunch(`vertical_card_${card.id}`, card.href)}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-extrabold transition-transform hover:scale-[1.02]"
                      style={{
                        backgroundColor: 'var(--hh-accent)',
                        color: 'var(--hh-accent-ink)',
                      }}
                    >
                      <span>{t.handfilm.launchStoryboard}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════════
            C. INTERACTIVE MODEL GRID (CAPCUT MINIMALIST + HOVER-REVEAL BIG CARDS)
        ════════════════════════════════════════════════════════════════════════ */}
        <section
          aria-labelledby="handfilm-models-heading"
          className="py-14 border-b"
          style={{ borderColor: 'var(--hh-border)' }}
        >
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div className="space-y-2 max-w-2xl">
              <div
                className="font-space-mono text-[11px] uppercase tracking-[0.2em] font-semibold"
                style={{ color: 'var(--hh-accent)' }}
              >
                {t.handfilm.modelsEyebrow}
              </div>
              <h2
                id="handfilm-models-heading"
                className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight"
                style={{ textWrap: 'balance', color: 'var(--hh-text)' }}
              >
                {t.handfilm.modelsTitle}
              </h2>
              <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--hh-muted)' }}>
                {t.handfilm.modelsSub}
              </p>
            </div>

            {/* Segmented Filter Tabs */}
            <div
              role="tablist"
              aria-label="Filter HandFilm Models"
              className="inline-flex items-center gap-1 p-1.5 rounded-2xl border self-start lg:self-auto"
              style={{
                backgroundColor: 'var(--hh-surface)',
                borderColor: 'var(--hh-border)',
              }}
            >
              {(
                [
                  { id: 'all', label: t.handfilm.filterAll },
                  { id: 'editor', label: t.handfilm.filterEditor },
                  { id: 'ai', label: t.handfilm.filterAi },
                  { id: 'commerce', label: t.handfilm.filterCommerce },
                ] as const
              ).map((tab) => {
                const isActive = activeModelFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveModelFilter(tab.id)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    style={{
                      backgroundColor: isActive ? 'var(--hh-accent)' : 'transparent',
                      color: isActive ? 'var(--hh-accent-ink)' : 'var(--hh-muted)',
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6 Big Minimalist + Hover-Reveal Model Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModels.map((model) => {
              const isSelected = selectedModelId === model.id;
              const isExpanded = expandedModelId === model.id;
              return (
                <article
                  key={model.id}
                  onClick={() => {
                    setSelectedModelId(model.id);
                    setExpandedModelId(isExpanded ? null : model.id);
                  }}
                  className={`group relative min-h-[340px] rounded-[20px] overflow-hidden border bg-gradient-to-br ${model.gradientClass} transition-all duration-300 ease-out cursor-pointer flex flex-col justify-between p-6`}
                  style={{
                    backgroundColor: 'var(--hh-surface)',
                    borderColor: isSelected ? 'var(--hh-accent)' : 'var(--hh-border)',
                    boxShadow: 'var(--hh-card-shadow)',
                  }}
                >
                  {/* Abstract Airy Studio Visual Wave Backdrop */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-12 -top-12 w-48 h-48 rounded-full blur-3xl opacity-35 transition-transform duration-500 group-hover:scale-125"
                    style={{ backgroundColor: model.accentHex }}
                  />

                  {/* Resting Minimal Badge Only */}
                  <div className="relative z-10 flex items-center justify-between gap-2">
                    <span
                      className="px-3 py-1 rounded-full border font-space-mono text-[10px] font-bold uppercase tracking-wider"
                      style={{
                        backgroundColor: 'var(--hh-bg)',
                        borderColor: 'var(--hh-border)',
                        color: model.accentHex,
                      }}
                    >
                      {model.badge}
                    </span>
                    <span
                      className="font-space-mono text-[10.5px] tabular-nums"
                      style={{ color: 'var(--hh-muted)' }}
                    >
                      {model.latency}
                    </span>
                  </div>

                  {/* Resting Minimal Bold 2-3 Word Title */}
                  <div
                    className={`relative z-10 mt-auto pt-16 transition-all duration-300 ease-out ${
                      isExpanded
                        ? 'opacity-0 translate-y-4 pointer-events-none'
                        : 'group-hover:opacity-0 group-hover:translate-y-4'
                    }`}
                  >
                    <h3
                      className="text-3xl font-bold tracking-tight leading-none"
                      style={{ color: 'var(--hh-text)' }}
                    >
                      {model.name}
                    </h3>
                  </div>

                  {/* Smooth Hover-Reveal Glassmorphic Detail Panel */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className={`absolute inset-x-3 bottom-3 z-20 rounded-2xl p-5 backdrop-blur-xl border shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] space-y-3.5 ${
                      isExpanded
                        ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                        : 'opacity-0 translate-y-6 scale-95 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 group-hover:pointer-events-auto'
                    }`}
                    style={{
                      backgroundColor: 'var(--hh-glass-bg)',
                      borderColor: 'var(--hh-border)',
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-xl font-extrabold tracking-tight" style={{ color: 'var(--hh-text)' }}>
                        {model.name}
                      </h3>
                      <span
                        className="font-space-mono text-[11px] font-bold"
                        style={{ color: 'var(--hh-accent-2)' }}
                      >
                        {model.query}
                      </span>
                    </div>

                    <p className="text-sm font-medium leading-relaxed line-clamp-2" style={{ color: 'var(--hh-muted)' }}>
                      {model.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {model.highlights.map((item) => (
                        <span
                          key={item}
                          className="px-2.5 py-1 rounded-lg border font-space-mono text-[10.5px] font-semibold"
                          style={{
                            backgroundColor: 'var(--hh-bg)',
                            borderColor: 'var(--hh-border)',
                            color: 'var(--hh-text)',
                          }}
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    <a
                      href={model.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackStoryboardLaunch(`model_grid_${model.id}`, model.href)}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-extrabold transition-transform hover:scale-[1.02] shadow-lg"
                      style={{
                        backgroundColor: 'var(--hh-accent)',
                        color: 'var(--hh-accent-ink)',
                      }}
                    >
                      <span>{t.handfilm.launchStoryboard}</span>
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════════
            D. 3-STEP INTERACTIVE WORKFLOW & LIVE STUDIO PREVIEW
        ════════════════════════════════════════════════════════════════════════ */}
        <section
          aria-labelledby="handfilm-workflow-heading"
          className="py-14 border-b"
          style={{ borderColor: 'var(--hh-border)' }}
        >
          <div className="space-y-2 mb-8">
            <div
              className="font-space-mono text-[11px] uppercase tracking-[0.2em] font-semibold"
              style={{ color: 'var(--hh-accent-2)' }}
            >
              {t.handfilm.workflowEyebrow}
            </div>
            <h2
              id="handfilm-workflow-heading"
              className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight"
              style={{ color: 'var(--hh-text)' }}
            >
              {t.handfilm.workflowTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left 3 Interactive Step Selectors */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-3.5">
              {WORKFLOW_STEPS.map((step, idx) => {
                const isActive = idx === activeStepIndex;
                return (
                  <button
                    key={step.number}
                    type="button"
                    onClick={() => setActiveStepIndex(idx)}
                    className="text-left p-5 rounded-[20px] border transition-all duration-200 cursor-pointer flex flex-col gap-2"
                    style={{
                      backgroundColor: isActive ? 'var(--hh-surface-2)' : 'var(--hh-surface)',
                      borderColor: isActive ? 'var(--hh-accent)' : 'var(--hh-border)',
                      boxShadow: isActive ? 'var(--hh-card-shadow)' : 'none',
                    }}
                  >
                    <div className="flex items-center justify-between gap-2 font-space-mono text-[11px]">
                      <span
                        className="font-bold"
                        style={{ color: isActive ? 'var(--hh-accent)' : 'var(--hh-muted)' }}
                      >
                        STEP {step.number}
                      </span>
                      <span style={{ color: 'var(--hh-muted)' }}>?{step.storyboardQuery}</span>
                    </div>

                    <h3 className="text-xl font-bold tracking-tight" style={{ color: 'var(--hh-text)' }}>
                      {step.number} · {step.title}
                    </h3>

                    <p className="text-xs font-medium" style={{ color: 'var(--hh-accent-2)' }}>
                      {step.subtitle}
                    </p>

                    <div lang="bn" className="bangla-text text-xs pt-1" style={{ color: 'var(--hh-muted)' }}>
                      {step.banglaCaption}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Interactive Live Studio Canvas */}
            <div
              className="lg:col-span-7 border rounded-[20px] p-5 sm:p-6 flex flex-col justify-between gap-6"
              style={{
                backgroundColor: 'var(--hh-surface)',
                borderColor: 'var(--hh-border)',
                boxShadow: 'var(--hh-card-shadow)',
              }}
            >
              <div
                className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b"
                style={{ borderColor: 'var(--hh-border)' }}
              >
                <div className="flex items-center gap-2.5 font-space-mono text-[11px]">
                  <Terminal className="w-4 h-4" style={{ color: 'var(--hh-accent)' }} />
                  <span className="font-bold" style={{ color: 'var(--hh-text)' }}>
                    {activeStep.previewHeader}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-space-mono text-[10px]" style={{ color: 'var(--hh-muted)' }}>
                  {activeStep.previewSpecs.map((spec, sIdx) => (
                    <React.Fragment key={spec}>
                      {sIdx > 0 && <span aria-hidden="true">·</span>}
                      <span>{spec}</span>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between gap-5">
                {activeStepIndex === 0 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div
                        className="p-4 rounded-2xl border space-y-1.5"
                        style={{ backgroundColor: 'var(--hh-bg)', borderColor: 'var(--hh-border)' }}
                      >
                        <div className="font-space-mono text-[10px] font-bold" style={{ color: 'var(--hh-accent)' }}>
                          01. INGEST
                        </div>
                        <div className="text-sm font-semibold" style={{ color: 'var(--hh-text)' }}>
                          RAW_JACKET_4K.MOV
                        </div>
                        <div className="font-space-mono text-[11px] tabular-nums" style={{ color: 'var(--hh-muted)' }}>
                          3840×2160 · 60fps
                        </div>
                      </div>
                      <div
                        className="p-4 rounded-2xl border space-y-1.5"
                        style={{ backgroundColor: 'var(--hh-bg)', borderColor: 'var(--hh-border)' }}
                      >
                        <div className="font-space-mono text-[10px] font-bold" style={{ color: 'var(--hh-accent-2)' }}>
                          02. SKU BRIEF
                        </div>
                        <div className="text-sm font-semibold" style={{ color: 'var(--hh-text)' }}>
                          300 GSM Cotton
                        </div>
                        <div className="font-space-mono text-[11px]" style={{ color: 'var(--hh-muted)' }}>
                          b2b.handsandhead.com
                        </div>
                      </div>
                      <div
                        className="p-4 rounded-2xl border space-y-1.5"
                        style={{ backgroundColor: 'var(--hh-bg)', borderColor: 'var(--hh-border)' }}
                      >
                        <div className="font-space-mono text-[10px] font-bold" style={{ color: 'var(--hh-text)' }}>
                          03. 100-SHOT
                        </div>
                        <div className="text-sm font-semibold" style={{ color: 'var(--hh-text)' }}>
                          15s Reel Cut
                        </div>
                        <div className="font-space-mono text-[11px] tabular-nums" style={{ color: 'var(--hh-muted)' }}>
                          18 Cuts · 9:16
                        </div>
                      </div>
                    </div>

                    <div
                      className="p-4 rounded-2xl border space-y-2"
                      style={{ backgroundColor: 'var(--hh-bg)', borderColor: 'var(--hh-border)' }}
                    >
                      <div
                        className="flex items-center justify-between font-space-mono text-[11px]"
                        style={{ color: 'var(--hh-muted)' }}
                      >
                        <span>BILINGUAL HOOK</span>
                        <span>BANGLA + EN READY</span>
                      </div>
                      <p className="text-sm font-medium" style={{ color: 'var(--hh-text)' }}>
                        &ldquo;Direct-from-source Dhaka Distressed Leather — engineered for 10-year wear.&rdquo;
                      </p>
                      <p lang="bn" className="bangla-text text-sm" style={{ color: 'var(--hh-accent-2)' }}>
                        &ldquo;সরাসরি ঢাকা ফ্যাক্টরি থেকে প্রিমিয়াম লেদার ও ৩০০ জিএসএম স্ট্রিটওয়্যার।&rdquo;
                      </p>
                    </div>
                  </div>
                )}

                {activeStepIndex === 1 && (
                  <div
                    className="p-4 rounded-2xl border space-y-3"
                    style={{ backgroundColor: 'var(--hh-bg)', borderColor: 'var(--hh-border)' }}
                  >
                    <div className="flex items-center justify-between font-space-mono text-[10px] tabular-nums">
                      <span style={{ color: 'var(--hh-muted)' }}>TIMELINE · 00:00 → 00:15</span>
                      <span className="font-bold" style={{ color: 'var(--hh-accent)' }}>
                        128 BPM SYNC
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="font-space-mono text-[10px]" style={{ color: 'var(--hh-muted)' }}>
                        V2 · KINETIC TITLES
                      </div>
                      <div className="grid grid-cols-12 gap-1.5 h-8">
                        <div
                          className="col-span-4 rounded-lg border px-2 flex items-center text-[11px] truncate"
                          style={{
                            backgroundColor: 'var(--hh-surface-2)',
                            borderColor: 'var(--hh-accent-2)',
                            color: 'var(--hh-text)',
                          }}
                        >
                          <span lang="bn" className="bangla-text">প্রিমিয়াম কালেকশন</span>
                        </div>
                        <div
                          className="col-span-5 rounded-lg border px-2 flex items-center text-[11px] font-space-mono truncate"
                          style={{
                            backgroundColor: 'var(--hh-surface-2)',
                            borderColor: 'var(--hh-accent)',
                            color: 'var(--hh-text)',
                          }}
                        >
                          SMART-EYE 1.15x
                        </div>
                        <div
                          className="col-span-3 rounded-lg border px-2 flex items-center text-[11px] font-space-mono truncate"
                          style={{
                            backgroundColor: 'var(--hh-surface)',
                            borderColor: 'var(--hh-border)',
                            color: 'var(--hh-muted)',
                          }}
                        >
                          CTA SLATE
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="font-space-mono text-[10px]" style={{ color: 'var(--hh-muted)' }}>
                        A1 · BEAT STEMS (-14 LUFS)
                      </div>
                      <div
                        className="h-9 rounded-lg border px-2 flex items-center gap-1 overflow-hidden"
                        style={{ backgroundColor: 'var(--hh-surface)', borderColor: 'var(--hh-border)' }}
                      >
                        {[38, 72, 52, 90, 44, 66, 85, 48, 78, 95, 40, 62, 88, 54, 74, 82, 46, 68, 92, 50].map(
                          (heightPct, idx) => (
                            <span
                              key={idx}
                              className="flex-1 rounded-sm"
                              style={{
                                height: `${Math.round(heightPct * 0.24)}px`,
                                backgroundColor: idx % 4 === 3 ? 'var(--hh-accent)' : 'var(--hh-accent-2)',
                              }}
                            />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeStepIndex === 2 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Interactive 2D Mood-Pad */}
                    <div
                      className="p-4 rounded-2xl border space-y-3"
                      style={{ backgroundColor: 'var(--hh-bg)', borderColor: 'var(--hh-border)' }}
                    >
                      <div className="flex items-center justify-between font-space-mono text-[10px]">
                        <span style={{ color: 'var(--hh-muted)' }}>2D MOOD-PAD</span>
                        <span className="tabular-nums font-bold" style={{ color: 'var(--hh-accent)' }}>
                          X:{moodPadPos.x} · Y:{moodPadPos.y}
                        </span>
                      </div>
                      <div
                        role="slider"
                        aria-label="2D Mood-Pad Color Grade Controller"
                        aria-valuenow={moodPadPos.x}
                        tabIndex={0}
                        onClick={handleMoodPadInteract}
                        className="relative h-36 rounded-xl border border-white/15 cursor-crosshair overflow-hidden"
                        style={{
                          background:
                            'radial-gradient(circle at 20% 20%, rgba(6,182,212,0.5), transparent 55%), radial-gradient(circle at 80% 25%, rgba(139,92,246,0.5), transparent 55%), radial-gradient(circle at 50% 90%, rgba(14,165,233,0.4), transparent 60%), #0f172a',
                        }}
                      >
                        <span
                          className="absolute w-4 h-4 -ml-2 -mt-2 rounded-full bg-white border-2 border-[#06b6d4] shadow-lg pointer-events-none transition-all duration-100"
                          style={{ left: `${moodPadPos.x}%`, top: `${moodPadPos.y}%` }}
                        />
                      </div>
                    </div>

                    {/* 1->5 Export Matrix */}
                    <div
                      className="p-4 rounded-2xl border space-y-2.5 flex flex-col justify-between"
                      style={{ backgroundColor: 'var(--hh-bg)', borderColor: 'var(--hh-border)' }}
                    >
                      <div className="flex items-center justify-between font-space-mono text-[10px]">
                        <span style={{ color: 'var(--hh-muted)' }}>1→5 OUTPUT</span>
                        <span className="text-emerald-500 font-semibold">-14 LUFS</span>
                      </div>

                      <div className="space-y-1.5 font-space-mono text-[11px]">
                        {[
                          { ratio: '9:16', target: 'Reels / Shorts', status: 'Safe-Zone' },
                          { ratio: '16:9', target: 'YouTube Studio', status: 'OAuth Ready' },
                          { ratio: '4:5', target: 'F-Commerce Ad', status: 'Auto-Crop' },
                          { ratio: '1:1', target: 'Catalog Card', status: 'R2 Cached' },
                        ].map((out) => (
                          <div
                            key={out.ratio}
                            className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg border"
                            style={{ backgroundColor: 'var(--hh-surface)', borderColor: 'var(--hh-border)' }}
                          >
                            <span className="font-bold tabular-nums" style={{ color: 'var(--hh-text)' }}>
                              {out.ratio}
                            </span>
                            <span className="truncate flex-1" style={{ color: 'var(--hh-muted)' }}>
                              {out.target}
                            </span>
                            <span className="text-[10px] shrink-0 font-semibold" style={{ color: 'var(--hh-accent)' }}>
                              {out.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div
                  className="pt-4 border-t flex flex-wrap items-center justify-between gap-3"
                  style={{ borderColor: 'var(--hh-border)' }}
                >
                  <div className="font-space-mono text-xs" style={{ color: 'var(--hh-muted)' }}>
                    storyboard.handsandhead.com/?{activeStep.storyboardQuery}
                  </div>
                  <a
                    href={buildStoryboardUrl(activeStep.storyboardQuery)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackStoryboardLaunch(
                        `workflow_step_${activeStep.number}`,
                        buildStoryboardUrl(activeStep.storyboardQuery)
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-transform hover:scale-[1.02] whitespace-nowrap shrink-0"
                    style={{
                      backgroundColor: 'var(--hh-accent)',
                      color: 'var(--hh-accent-ink)',
                    }}
                  >
                    <span>{activeStep.ctaLabel}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════════
            DISCOVER SECTION (CAPCUT-STYLE MINIMALIST + HOVER-REVEAL BIG CARDS)
        ════════════════════════════════════════════════════════════════════════ */}
        <section
          id="handfilm-discover"
          aria-labelledby="handfilm-discover-heading"
          className="py-14 border-b scroll-mt-32"
          style={{ borderColor: 'var(--hh-border)' }}
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div className="space-y-1.5">
              <div
                className="font-space-mono text-[11px] uppercase tracking-[0.2em] font-semibold"
                style={{ color: 'var(--hh-accent)' }}
              >
                {t.handfilm.discoverEyebrow}
              </div>
              <h2
                id="handfilm-discover-heading"
                className="text-3xl sm:text-4xl font-bold tracking-tight"
                style={{ color: 'var(--hh-text)' }}
              >
                {t.handfilm.discoverTitle}
              </h2>
            </div>
            <a
              href={buildStoryboardUrl('tool=100shots')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackStoryboardLaunch('discover_all', buildStoryboardUrl('tool=100shots'))}
              className="inline-flex items-center gap-1.5 font-space-mono text-xs font-semibold hover:underline whitespace-nowrap"
              style={{ color: 'var(--hh-accent)' }}
            >
              <span>Template Vault</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                id: 'disc-100shots',
                badge: '100-SHOT REEL',
                title: 'Factory to Runway',
                desc: 'Sequence stitching, tannery grain, and lookbook cuts synced to a 128 BPM industrial score.',
                chips: ['128 BPM', 'Lookbook', 'Auto-Beat'],
                bangla: 'গার্মেন্টস ও লেদার প্রোডাকশন রিল',
                image: studioProjectsImg,
                href: buildStoryboardUrl('tool=100shots'),
              },
              {
                id: 'disc-bangla-kinetic',
                badge: 'KINETIC TYPE',
                title: 'Bangla Karaoke Hooks',
                desc: 'Pair intact-ligature Bangla kinetic titles with crisp F-Commerce price & WhatsApp callouts.',
                chips: ['Bangla Lock', 'F-Commerce', 'Subtitles'],
                bangla: 'নিখুঁত বাংলা টাইপোগ্রাফি গাইড',
                image: socialTrendsImg,
                href: buildStoryboardUrl('tool=bangla-type'),
              },
              {
                id: 'disc-youtube-pipeline',
                badge: 'EDGE PUBLISH',
                title: 'R2 + YouTube Master',
                desc: 'Archive your 4K master in Cloudflare R2 while pushing timestamped chapters to YouTube Studio.',
                chips: ['Cloudflare R2', 'YouTube OAuth', '4K HDR'],
                bangla: 'ইউটিউব ও আর২ ডাইরেক্ট পাবলিশ',
                image: brandAssetsImg,
                href: buildStoryboardUrl('integration=youtube-studio'),
              },
            ].map((item) => {
              const isExpanded = expandedDiscoverId === item.id;
              return (
                <article
                  key={item.id}
                  onClick={() => setExpandedDiscoverId(isExpanded ? null : item.id)}
                  className="group relative min-h-[340px] rounded-[20px] overflow-hidden border transition-all duration-300 ease-out cursor-pointer"
                  style={{
                    borderColor: 'var(--hh-border)',
                    boxShadow: 'var(--hh-card-shadow)',
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/40"
                  />

                  {/* Minimalist Pill Badge Only */}
                  <div className="relative z-10 p-5 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/15 font-space-mono text-[10px] font-bold uppercase tracking-wider text-[#06b6d4]">
                      {item.badge}
                    </span>
                  </div>

                  {/* Minimalist Title Only */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 z-10 p-6 transition-all duration-300 ease-out ${
                      isExpanded
                        ? 'opacity-0 translate-y-4 pointer-events-none'
                        : 'group-hover:opacity-0 group-hover:translate-y-4'
                    }`}
                  >
                    <h3 className="text-2xl font-bold text-white tracking-tight">{item.title}</h3>
                  </div>

                  {/* Hover / Tap Reveal Glassmorphic Panel */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className={`absolute inset-x-3 bottom-3 z-20 rounded-2xl p-5 backdrop-blur-xl bg-black/78 border border-white/20 text-white transition-all duration-300 ease-out space-y-2.5 ${
                      isExpanded
                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 translate-y-8 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto'
                    }`}
                  >
                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                    <p className="text-xs text-zinc-200 leading-relaxed line-clamp-2">{item.desc}</p>
                    <div lang="bn" className="bangla-text text-[11px] text-[#06b6d4]">
                      {item.bangla}
                    </div>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackStoryboardLaunch(item.id, item.href)}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold"
                      style={{
                        backgroundColor: 'var(--hh-accent)',
                        color: 'var(--hh-accent-ink)',
                      }}
                    >
                      <span>{t.handfilm.launchStoryboard}</span>
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════════
            PRICING SECTION
        ════════════════════════════════════════════════════════════════════════ */}
        <section id="handfilm-pricing" aria-labelledby="handfilm-pricing-heading" className="py-14 scroll-mt-32">
          <div className="space-y-1.5 mb-8">
            <div
              className="font-space-mono text-[11px] uppercase tracking-[0.2em] font-semibold"
              style={{ color: 'var(--hh-accent-2)' }}
            >
              {t.handfilm.pricingEyebrow}
            </div>
            <h2
              id="handfilm-pricing-heading"
              className="text-3xl sm:text-4xl font-bold tracking-tight"
              style={{ color: 'var(--hh-text)' }}
            >
              {t.handfilm.pricingTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Tier 1 */}
            <div
              className="rounded-[20px] border p-6 flex flex-col justify-between gap-6"
              style={{
                backgroundColor: 'var(--hh-surface)',
                borderColor: 'var(--hh-border)',
                boxShadow: 'var(--hh-card-shadow)',
              }}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between font-space-mono text-[11px]" style={{ color: 'var(--hh-muted)' }}>
                  <span>WEB STUDIO</span>
                  <span>BROWSER WEBGL2</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold" style={{ color: 'var(--hh-text)' }}>
                    Free Web Studio
                  </h3>
                  <div className="mt-1 font-space-mono text-2xl font-bold tabular-nums" style={{ color: 'var(--hh-text)' }}>
                    $0 <span className="text-xs font-normal" style={{ color: 'var(--hh-muted)' }}>/ browser forever</span>
                  </div>
                </div>
                <ul className="space-y-2 text-xs pt-2 border-t" style={{ borderColor: 'var(--hh-border)', color: 'var(--hh-text)' }}>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5" style={{ color: 'var(--hh-accent)' }} />
                    <span>Zero install · Instant WebGL2 boot</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5" style={{ color: 'var(--hh-accent)' }} />
                    <span>Bangla-EN subtitles &amp; kinetic titles</span>
                  </li>
                </ul>
              </div>
              <a
                href={buildStoryboardUrl('mode=easy')}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackStoryboardLaunch('pricing_free_web', buildStoryboardUrl('mode=easy'))}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-xs font-semibold transition-colors"
                style={{
                  backgroundColor: 'var(--hh-surface-2)',
                  borderColor: 'var(--hh-border)',
                  color: 'var(--hh-text)',
                }}
              >
                <span>{t.handfilm.tryOnline}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Tier 2 */}
            <div
              className="rounded-[20px] border-2 p-6 flex flex-col justify-between gap-6"
              style={{
                backgroundColor: 'var(--hh-surface)',
                borderColor: 'var(--hh-accent)',
                boxShadow: 'var(--hh-card-shadow)',
              }}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between font-space-mono text-[11px]">
                  <span className="font-bold" style={{ color: 'var(--hh-accent)' }}>
                    DESKTOP &amp; MOBILE PRO
                  </span>
                  <span style={{ color: 'var(--hh-muted)' }}>TAURI / APK</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold" style={{ color: 'var(--hh-text)' }}>
                    Desktop Pro
                  </h3>
                  <div className="mt-1 font-space-mono text-2xl font-bold tabular-nums" style={{ color: 'var(--hh-text)' }}>
                    $19 <span className="text-xs font-normal" style={{ color: 'var(--hh-muted)' }}>/ month</span>
                  </div>
                </div>
                <ul className="space-y-2 text-xs pt-2 border-t" style={{ borderColor: 'var(--hh-border)', color: 'var(--hh-text)' }}>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5" style={{ color: 'var(--hh-accent)' }} />
                    <span>Windows .exe (25MB Tauri) &amp; Android .apk</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5" style={{ color: 'var(--hh-accent)' }} />
                    <span>Unlimited 4K Beast NLE + 2D Mood-Pad LUTs</span>
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsDownloadModalOpen(true);
                  trackEvent('HANDFILM_OPEN_DOWNLOAD_MODAL', { source: 'pricing_pro' });
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold transition-transform hover:scale-[1.01] cursor-pointer"
                style={{
                  backgroundColor: 'var(--hh-accent)',
                  color: 'var(--hh-accent-ink)',
                }}
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t.handfilm.downloadBtn}</span>
              </button>
            </div>

            {/* Tier 3 */}
            <div
              className="rounded-[20px] border p-6 flex flex-col justify-between gap-6"
              style={{
                backgroundColor: 'var(--hh-surface)',
                borderColor: 'var(--hh-border)',
                boxShadow: 'var(--hh-card-shadow)',
              }}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between font-space-mono text-[11px]">
                  <span className="font-bold" style={{ color: 'var(--hh-accent-2)' }}>
                    ENTERPRISE SUITE
                  </span>
                  <span style={{ color: 'var(--hh-muted)' }}>B2B &amp; AGENCIES</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold" style={{ color: 'var(--hh-text)' }}>
                    Enterprise Suite
                  </h3>
                  <div className="mt-1 font-space-mono text-2xl font-bold tabular-nums" style={{ color: 'var(--hh-text)' }}>
                    Custom <span className="text-xs font-normal" style={{ color: 'var(--hh-muted)' }}>/ R2 vault</span>
                  </div>
                </div>
                <ul className="space-y-2 text-xs pt-2 border-t" style={{ borderColor: 'var(--hh-border)', color: 'var(--hh-text)' }}>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5" style={{ color: 'var(--hh-accent-2)' }} />
                    <span>Direct b2b.handsandhead.com SKU ingestion</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5" style={{ color: 'var(--hh-accent-2)' }} />
                    <span>Zero-egress Cloudflare R2 team vaults</span>
                  </li>
                </ul>
              </div>
              <a
                href={buildStoryboardUrl('solution=agencies')}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackStoryboardLaunch('pricing_enterprise', buildStoryboardUrl('solution=agencies'))}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-white transition-colors"
                style={{ backgroundColor: 'var(--hh-accent-2)' }}
              >
                <span>{t.handfilm.launchStoryboard}</span>
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* FLOATING BOTTOM PILL BAR */}
      <div className="fixed bottom-[4.75rem] sm:bottom-[5.25rem] left-1/2 -translate-x-1/2 z-40 w-[calc(100vw-1.5rem)] max-w-3xl pointer-events-auto">
        <div
          className="flex items-center justify-between gap-2.5 sm:gap-3 px-3 sm:px-4 py-2 rounded-2xl backdrop-blur-xl border shadow-2xl"
          style={{
            backgroundColor: 'var(--hh-glass-bg)',
            borderColor: 'var(--hh-border)',
          }}
        >
          <div className="flex items-center gap-2 min-w-0 pl-1">
            <span className="font-space-mono text-xs font-bold tracking-wider shrink-0" style={{ color: 'var(--hh-text)' }}>
              HANDFILM
            </span>
            <span aria-hidden="true" className="hidden sm:inline" style={{ color: 'var(--hh-muted)' }}>—</span>
            <span className="text-xs font-medium truncate hidden sm:inline" style={{ color: 'var(--hh-muted)' }}>
              {t.handfilm.stickySlogan}
            </span>
          </div>

          <a
            href={buildStoryboardUrl('')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackStoryboardLaunch('floating_bottom_pill', buildStoryboardUrl(''))}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-transform hover:scale-[1.02] whitespace-nowrap shrink-0"
            style={{
              backgroundColor: 'var(--hh-accent)',
              color: 'var(--hh-accent-ink)',
            }}
          >
            <span>{t.handfilm.tryOnline}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* MULTI-PLATFORM DOWNLOAD MODAL */}
      {isDownloadModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="handfilm-download-modal-title"
          onClick={() => setIsDownloadModalOpen(false)}
          className="fixed inset-0 z-[130] bg-black/65 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[20px] border shadow-2xl"
            style={{
              backgroundColor: 'var(--hh-surface)',
              borderColor: 'var(--hh-border)',
              color: 'var(--hh-text)',
            }}
          >
            <div
              className="flex items-start justify-between gap-4 p-6 border-b"
              style={{ borderColor: 'var(--hh-border)' }}
            >
              <div className="space-y-1">
                <div
                  className="font-space-mono text-[11px] uppercase tracking-[0.18em] font-semibold"
                  style={{ color: 'var(--hh-accent)' }}
                >
                  MULTI-PLATFORM INSTALLERS
                </div>
                <h2
                  id="handfilm-download-modal-title"
                  className="text-2xl sm:text-3xl font-bold tracking-tight"
                  style={{ color: 'var(--hh-text)' }}
                >
                  Download HandFilm Studio
                </h2>
                <p className="text-xs sm:text-sm" style={{ color: 'var(--hh-muted)' }}>
                  Choose lightweight Windows Tauri (25 MB), full offline Electron Workstation, or Android APK.
                </p>
              </div>

              <button
                type="button"
                aria-label="Close download modal"
                onClick={() => setIsDownloadModalOpen(false)}
                className="p-2 rounded-xl border transition-colors cursor-pointer shrink-0"
                style={{
                  backgroundColor: 'var(--hh-bg)',
                  borderColor: 'var(--hh-border)',
                  color: 'var(--hh-text)',
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {DOWNLOAD_ARTIFACTS.map((artifact) => (
                <div
                  key={artifact.id}
                  className="rounded-2xl border p-5 flex flex-col justify-between gap-5"
                  style={{
                    backgroundColor: 'var(--hh-bg)',
                    borderColor: artifact.recommended ? 'var(--hh-accent)' : 'var(--hh-border)',
                  }}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 font-space-mono text-[10.5px]">
                      <span className="inline-flex items-center gap-1.5 font-bold uppercase" style={{ color: 'var(--hh-text)' }}>
                        {artifact.platform === 'windows' ? (
                          <Monitor className="w-3.5 h-3.5" style={{ color: 'var(--hh-accent)' }} />
                        ) : (
                          <Smartphone className="w-3.5 h-3.5" style={{ color: 'var(--hh-accent-2)' }} />
                        )}
                        <span>{artifact.platform === 'windows' ? 'Windows .exe' : 'Android .apk'}</span>
                      </span>
                      <span className="font-bold tabular-nums" style={{ color: 'var(--hh-accent)' }}>
                        {artifact.size}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold leading-snug" style={{ color: 'var(--hh-text)' }}>
                        {artifact.name}
                      </h3>
                      <div className="font-space-mono text-[10px] mt-1" style={{ color: 'var(--hh-muted)' }}>
                        {artifact.architecture}
                      </div>
                    </div>

                    <div className="font-space-mono text-[10.5px] flex items-center gap-1.5" style={{ color: 'var(--hh-muted)' }}>
                      <HardDrive className="w-3 h-3 shrink-0" />
                      <span>{artifact.engine}</span>
                    </div>

                    <p className="text-xs leading-relaxed" style={{ color: 'var(--hh-muted)' }}>
                      {artifact.description}
                    </p>

                    <ul className="space-y-1.5 pt-2 border-t" style={{ borderColor: 'var(--hh-border)' }}>
                      {artifact.features.map((feat) => (
                        <li key={feat} className="flex items-center gap-2 text-xs" style={{ color: 'var(--hh-text)' }}>
                          <Check className="w-3 h-3 shrink-0" style={{ color: 'var(--hh-accent)' }} />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href={artifact.actionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackStoryboardLaunch(`download_${artifact.id}`, artifact.actionUrl)}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap"
                    style={{
                      backgroundColor: artifact.recommended ? 'var(--hh-accent)' : 'var(--hh-surface)',
                      color: artifact.recommended ? 'var(--hh-accent-ink)' : 'var(--hh-text)',
                    }}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{artifact.ctaLabel}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// END OF FILE: src/components/handfilm/HandFilmHubView.tsx
