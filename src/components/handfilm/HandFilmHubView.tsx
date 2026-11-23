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
        icon: <Zap className="w-4 h-4 text-[#e11d48]" />,
      },
      {
        id: 'prod-beast',
        title: 'Beast Mode',
        subtitle: 'Full multi-track NLE & WebGL2 GPU color grading suite',
        tag: '?mode=beast',
        href: buildStoryboardUrl('mode=beast'),
        icon: <Layers className="w-4 h-4 text-[#C8A96A]" />,
      },
      {
        id: 'prod-capcut',
        title: 'CapCut Mode',
        subtitle: 'Rapid magnetic timeline & automated beat-sync workflow',
        tag: '?mode=capcut',
        href: buildStoryboardUrl('mode=capcut'),
        icon: <Sparkles className="w-4 h-4 text-[#e11d48]" />,
      },
      {
        id: 'prod-ad-studio',
        title: 'AD Studio',
        subtitle: 'F-Commerce & B2B high-converting product video generator',
        tag: '?tool=ad-studio',
        href: buildStoryboardUrl('tool=ad-studio'),
        icon: <ShoppingBag className="w-4 h-4 text-[#C8A96A]" />,
      },
      {
        id: 'prod-100shots',
        title: '100-Shot Cinema Reel',
        subtitle: 'Instant 100-shot sequence assembly from raw clips & stills',
        tag: '?tool=100shots',
        href: buildStoryboardUrl('tool=100shots'),
        icon: <Clapperboard className="w-4 h-4 text-white" />,
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
        icon: <Eye className="w-4 h-4 text-[#e11d48]" />,
      },
      {
        id: 'feat-bangla-type',
        title: 'Bangla Kinetic Typography',
        subtitle: 'Zero-broken-ligature motion titles & animated callouts',
        banglaSample: 'গতিশীল বাংলা টাইপোগ্রাফি',
        tag: '?tool=bangla-type',
        href: buildStoryboardUrl('tool=bangla-type'),
        icon: <Wand2 className="w-4 h-4 text-[#C8A96A]" />,
      },
      {
        id: 'feat-mood-pad',
        title: '2D Mood-Pad Color Grade',
        subtitle: 'XY tactile cinematic LUT interpolation in WebGL2',
        tag: '?tool=mood-pad',
        href: buildStoryboardUrl('tool=mood-pad'),
        icon: <Sliders className="w-4 h-4 text-[#e11d48]" />,
      },
      {
        id: 'feat-audio-master',
        title: 'Audio Stem & -14 LUFS Master',
        subtitle: 'Vocal isolation, ducking, and broadcast loudness normalization',
        tag: '?tool=audio-master',
        href: buildStoryboardUrl('tool=audio-master'),
        icon: <Volume2 className="w-4 h-4 text-[#C8A96A]" />,
      },
      {
        id: 'feat-reframe',
        title: 'Reels 9:16 Auto-Reframe',
        subtitle: 'Subject-locked vertical framing from 16:9 cinema masters',
        tag: '?tool=reframe-9-16',
        href: buildStoryboardUrl('tool=reframe-9-16'),
        icon: <Ratio className="w-4 h-4 text-white" />,
      },
      {
        id: 'feat-decoder',
        title: 'Universal Multi-Format Decoder',
        subtitle: 'Direct .MOV / .MKV / .AVI hardware ingest without transcoding',
        tag: '?tool=universal-decoder',
        href: buildStoryboardUrl('tool=universal-decoder'),
        icon: <Cpu className="w-4 h-4 text-[#C8A96A]" />,
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
        icon: <Eye className="w-4 h-4 text-[#e11d48]" />,
      },
      {
        id: 'mod-beat-sync',
        title: 'Auto Beat-Sync Engine',
        subtitle: 'Transient onset quantization across 100+ rapid cuts',
        tag: '?model=beat-sync',
        href: buildStoryboardUrl('model=beat-sync'),
        icon: <Zap className="w-4 h-4 text-[#C8A96A]" />,
      },
      {
        id: 'mod-bangla-sub',
        title: 'Bangla-EN Karaoke Subtitles',
        subtitle: 'Bilingual word-level sync with crisp Bengali ligatures',
        banglaSample: 'বাংলা + English সাবটাইটেল',
        tag: '?model=bangla-en-subtitles',
        href: buildStoryboardUrl('model=bangla-en-subtitles'),
        icon: <Globe className="w-4 h-4 text-[#e11d48]" />,
      },
      {
        id: 'mod-mask',
        title: 'Background & Mask Isolation',
        subtitle: 'Real-time product & subject cutout over custom plates',
        tag: '?model=mask-isolation',
        href: buildStoryboardUrl('model=mask-isolation'),
        icon: <Layers className="w-4 h-4 text-[#C8A96A]" />,
      },
      {
        id: 'mod-omni',
        title: '1→5 Omnichannel Resize',
        subtitle: 'Simultaneous 9:16, 4:5, 1:1, 16:9 & 2.39:1 master exports',
        tag: '?model=omnichannel-resize',
        href: buildStoryboardUrl('model=omnichannel-resize'),
        icon: <Maximize2 className="w-4 h-4 text-white" />,
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
        icon: <Youtube className="w-4 h-4 text-[#e11d48]" />,
      },
      {
        id: 'int-r2',
        title: 'Cloudflare R2 Zero-Server Media',
        subtitle: 'Zero-egress edge asset streaming & project state snapshots',
        tag: '?integration=cloudflare-r2',
        href: buildStoryboardUrl('integration=cloudflare-r2'),
        icon: <Cloud className="w-4 h-4 text-[#C8A96A]" />,
      },
      {
        id: 'int-b2b',
        title: 'B2B Product Catalog',
        subtitle: 'Pull garment, leather & 316L SKUs from b2b.handsandhead.com',
        tag: 'b2b.handsandhead.com',
        href: B2B_CATALOG_URL,
        icon: <Package className="w-4 h-4 text-[#C8A96A]" />,
      },
      {
        id: 'int-safezones',
        title: 'Shorts / Reels / TikTok Safe-Zones',
        subtitle: 'Live HUD overlays protecting UI chrome margins',
        tag: '?integration=safe-zones',
        href: buildStoryboardUrl('integration=safe-zones'),
        icon: <Smartphone className="w-4 h-4 text-white" />,
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
        icon: <ShoppingBag className="w-4 h-4 text-[#e11d48]" />,
      },
      {
        id: 'sol-rmg',
        title: 'Garments & Leather Export Houses',
        subtitle: 'Factory floor lookbooks, 300 GSM swatch reels & buyer pitch decks',
        tag: '?solution=rmg-leather-export',
        href: buildStoryboardUrl('solution=rmg-leather-export'),
        icon: <Building2 className="w-4 h-4 text-[#C8A96A]" />,
      },
      {
        id: 'sol-creators',
        title: 'Short-Form Content Creators',
        subtitle: 'Beat-locked kinetic cuts, karaoke subtitles & 9:16 exports',
        tag: '?solution=short-form-creators',
        href: buildStoryboardUrl('solution=short-form-creators'),
        icon: <Film className="w-4 h-4 text-[#e11d48]" />,
      },
      {
        id: 'sol-agencies',
        title: 'Agencies & Media Teams',
        subtitle: 'Multi-track Beast NLE timelines with shared R2 asset vaults',
        tag: '?solution=agencies',
        href: buildStoryboardUrl('solution=agencies'),
        icon: <Users className="w-4 h-4 text-white" />,
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
    imageUrl: adCampaignsImg,
    fallbackGradient: 'from-[#280b12] via-[#120b0d] to-[#09090b]',
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
    imageUrl: studioProjectsImg,
    fallbackGradient: 'from-[#181410] via-[#0e0f12] to-[#09090b]',
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
    imageUrl: brandAssetsImg,
    fallbackGradient: 'from-[#19191c] via-[#101012] to-[#09090b]',
    href: buildStoryboardUrl('tool=ad-studio&workflow=brand-assets'),
    queryTag: '?workflow=brand-assets',
  },
  {
    id: 'social-trends',
    title: 'Social Trends',
    kicker: 'CAPCUT RAPID',
    duration: '00:12 BEAT-SYNC',
    ratio: '9:16',
    description: 'Magnetic timeline beat-snapping, Smart-Eye framing, and kinetic bilingual hooks.',
    imageUrl: socialTrendsImg,
    fallbackGradient: 'from-[#250b14] via-[#140d10] to-[#09090b]',
    href: buildStoryboardUrl('mode=capcut&workflow=social-trends'),
    queryTag: '?mode=capcut',
  },
  {
    id: 'tutorials',
    title: 'Tutorials',
    kicker: 'EASY MODE',
    banglaTag: 'বাংলা টিউটোরিয়াল',
    duration: '01:05 GUIDE',
    ratio: '9:16',
    description: '1-click guided walkthroughs from raw .MOV/.MKV footage to finished cinema export.',
    imageUrl: tutorialsImg,
    fallbackGradient: 'from-[#1c1610] via-[#11100e] to-[#09090b]',
    href: buildStoryboardUrl('mode=easy&workflow=tutorials'),
    queryTag: '?mode=easy',
  },
];

const MODEL_SHOWCASE_ITEMS: ModelShowcaseItem[] = [
  {
    id: 'easy-cockpit',
    name: 'Easy Cockpit',
    kicker: '01 / GUIDED WORKFLOW',
    filterGroup: 'editor',
    badge: '1-Click Creator',
    latency: '0.4s Boot',
    description:
      'Streamlined single-track cockpit for fast trims, automated Bangla-EN captions, and instant social aspect ratio presets.',
    highlights: ['Auto Silence Trim', 'Instant Caption Styling', 'One-Tap 9:16 Export'],
    query: '?mode=easy',
    href: buildStoryboardUrl('mode=easy'),
    accentHex: '#e11d48',
  },
  {
    id: 'beast-nle',
    name: 'Beast NLE',
    kicker: '02 / PRO MULTI-TRACK',
    filterGroup: 'editor',
    badge: 'WebGL2 Cinema',
    latency: '60 FPS GPU',
    description:
      'Full non-linear multi-track timeline with custom GLSL shader nodes, 2D Mood-Pad grading, and -14 LUFS broadcast mastering.',
    highlights: ['Unlimited Video/Audio Tracks', '2D Mood-Pad Grading', '.MOV / .MKV / .AVI Native'],
    query: '?mode=beast',
    href: buildStoryboardUrl('mode=beast'),
    accentHex: '#C8A96A',
  },
  {
    id: 'capcut-rapid',
    name: 'CapCut Rapid',
    kicker: '03 / MAGNETIC TIMELINE',
    filterGroup: 'editor',
    badge: 'Beat-Sync Engine',
    latency: '12ms Snap',
    description:
      'Magnetic ripple timeline engineered for high-velocity short-form edits, transient beat markers, and viral velocity curves.',
    highlights: ['Auto Beat-Sync Markers', 'Speed-Ramp Keyframes', 'Safe-Zone Overlays'],
    query: '?mode=capcut',
    href: buildStoryboardUrl('mode=capcut'),
    accentHex: '#e11d48',
  },
  {
    id: 'smart-eye-vision',
    name: 'Smart-Eye Vision',
    kicker: '04 / COMPUTER VISION',
    filterGroup: 'ai',
    badge: 'AI Auto Cut',
    latency: 'Real-Time',
    description:
      'Intelligent vision tracker that identifies speakers, leather/garment product focal points, and dead air to cut automatically.',
    highlights: ['Subject Focal Lock', 'Dead-Air Auto Removal', 'Mask & Cutout Isolation'],
    query: '?tool=smart-eye',
    href: buildStoryboardUrl('tool=smart-eye'),
    accentHex: '#C8A96A',
  },
  {
    id: 'ad-studio-gen',
    name: 'AD Studio Generator',
    kicker: '05 / COMMERCE VIDEO',
    filterGroup: 'commerce',
    badge: 'F-Commerce & B2B',
    latency: '1→5 Formats',
    description:
      'Turns raw product photos or B2B catalog SKUs into high-converting vertical video ads with kinetic Bangla & English callouts.',
    highlights: ['SKU-to-Video Assembly', 'Bangla Kinetic Titles', 'WhatsApp & Shop CTAs'],
    query: '?tool=ad-studio',
    href: buildStoryboardUrl('tool=ad-studio'),
    accentHex: '#e11d48',
  },
  {
    id: 'reels-reframe',
    name: 'Reels 9:16 Reframe',
    kicker: '06 / OMNICHANNEL RESIZE',
    filterGroup: 'ai',
    badge: '1→5 Aspect Matrix',
    latency: 'Batch GPU',
    description:
      'Reframes horizontal 16:9 cinema timelines into 9:16 Reels, Shorts, TikTok, 4:5 Feed, and 1:1 square masters in one pass.',
    highlights: ['Optical Pan Tracking', 'Platform Safe-Zones', 'Simultaneous Batch Export'],
    query: '?tool=reframe-9-16',
    href: buildStoryboardUrl('tool=reframe-9-16'),
    accentHex: '#C8A96A',
  },
];

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    number: '01',
    title: 'Start With Your Idea',
    subtitle: 'Drop .MOV / .MKV / .AVI clips, a B2B product SKU, or a 100-Shot prompt',
    description:
      'Ingest raw camera footage directly in the browser with our universal decoder—or launch AD Studio with a product SKU to auto-build your hook, storyboard beats, and bilingual script.',
    banglaCaption: 'সহজ বাংলা ও ইংরেজি স্ক্রিপ্ট দিয়ে শুরু করুন',
    storyboardQuery: 'tool=100shots',
    ctaLabel: 'Open Idea & 100-Shot Planner ↗',
    previewHeader: 'INGEST & STORYBOARD SEED',
    previewSpecs: ['Universal .MOV/.MKV/.AVI', 'B2B SKU Bridge', 'Bangla-EN Hook Generator'],
  },
  {
    number: '02',
    title: 'Shape It on the Timeline',
    subtitle: 'Switch seamlessly between Easy, CapCut Rapid, and Beast NLE modes',
    description:
      'Snap cuts to audio transients with Auto Beat-Sync, strip pauses via Smart-Eye Auto Cut, and layer crisp Bangla kinetic typography with intact conjunct ligatures.',
    banglaCaption: 'বিট-সিঙ্ক টাইমলাইনে নিখুঁত এডিটিং',
    storyboardQuery: 'mode=capcut',
    ctaLabel: 'Open Timeline in Storyboard ↗',
    previewHeader: 'MAGNETIC BEAT-SYNC & SMART-EYE NLE',
    previewSpecs: ['Smart-Eye Auto Cut', 'Magnetic Beat Snapping', 'Bangla Kinetic Titles'],
  },
  {
    number: '03',
    title: 'Add the Final Touches',
    subtitle: '2D Mood-Pad WebGL2 grade, -14 LUFS master & 1→5 Omnichannel Export',
    description:
      'Dial cinema color with the tactile 2D Mood-Pad, lock audio loudness to -14 LUFS, verify Shorts/Reels safe-zones, and publish directly to YouTube Studio or Cloudflare R2.',
    banglaCaption: 'কালার গ্রেড এবং -১৪ LUFS মাস্টারিং',
    storyboardQuery: 'mode=beast&tool=mood-pad',
    ctaLabel: 'Open Color & Master Suite ↗',
    previewHeader: 'WEBGL2 MOOD-PAD & OMNICHANNEL MASTER',
    previewSpecs: ['2D Mood-Pad LUTs', '-14 LUFS Audio Master', 'YouTube OAuth & R2 Export'],
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

export default function HandFilmHubView({ onSetCursorLabel }: HandFilmHubViewProps) {
  const [openMenu, setOpenMenu] = useState<MegaMenuKey | null>(null);
  const [activeModelFilter, setActiveModelFilter] = useState<'all' | 'editor' | 'ai' | 'commerce'>('all');
  const [selectedModelId, setSelectedModelId] = useState<string>('easy-cockpit');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [moodPadPos, setMoodPadPos] = useState<{ x: number; y: number }>({ x: 64, y: 34 });
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false);
  const [hoveredVerticalId, setHoveredVerticalId] = useState<string | null>(null);

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

  // Close mega-menu or download modal on Escape / outside click
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

  return (
    <div
      className="relative min-h-screen w-full bg-[#09090b] text-[#f3efe6] pt-[58px] sm:pt-[62px] pb-36 font-inter selection:bg-[#e11d48] selection:text-white"
      onMouseEnter={() => onSetCursorLabel?.('HANDFILM STUDIO →')}
    >
      {/* Subtle architectural background vignette & crimson aura */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-75"
        style={{
          background:
            'radial-gradient(ellipse 70% 42% at 50% 0%, rgba(225, 29, 72, 0.13), transparent 72%), radial-gradient(ellipse 45% 35% at 85% 20%, rgba(200, 169, 106, 0.08), transparent 70%)',
        }}
      />

      {/* ════════════════════════════════════════════════════════════════════════
          A. STICKY SUB-NAVIGATION BAR WITH HOVER / CLICK MEGA-MENUS
      ════════════════════════════════════════════════════════════════════════ */}
      <div
        ref={navContainerRef}
        onMouseLeave={handleScheduleCloseMenu}
        className="sticky top-[57px] sm:top-[61px] z-40 border-b border-white/10 bg-[#09090b]/92 backdrop-blur-xl"
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between gap-4 py-2.5">
            {/* Left Brand Mark */}
            <div className="flex items-center gap-3 min-w-0 shrink-0">
              <a
                href={buildStoryboardUrl('')}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackStoryboardLaunch('subnav_brand', buildStoryboardUrl(''))}
                className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#e11d48]/15 border border-[#e11d48]/45 text-white hover:bg-[#e11d48] transition-colors whitespace-nowrap shrink-0"
              >
                <Film className="w-3.5 h-3.5 text-[#e11d48] group-hover:text-white" />
                <span className="font-space-mono text-[11px] font-bold tracking-[0.14em] uppercase">
                  HANDFILM STUDIO
                </span>
              </a>
              <span className="hidden 2xl:inline font-space-mono text-[11px] text-zinc-400 whitespace-nowrap">
                Powered by WebGL2 Cinema Engine
              </span>
            </div>

            {/* Center Interactive Dropdown Triggers */}
            <nav
              aria-label="HandFilm Product Showcase Navigation"
              className="hidden lg:flex items-center gap-1"
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
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      isOpen
                        ? 'bg-white/10 text-white'
                        : 'text-zinc-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{group.label}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-150 ${
                        isOpen ? 'rotate-180 text-[#e11d48]' : 'text-zinc-500'
                      }`}
                    />
                  </button>
                );
              })}

              <button
                type="button"
                onMouseEnter={() => setOpenMenu(null)}
                onClick={() => scrollToSection('handfilm-discover')}
                className="px-3 py-1.5 rounded-md text-[13px] font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                Discover
              </button>

              <button
                type="button"
                onMouseEnter={() => setOpenMenu(null)}
                onClick={() => scrollToSection('handfilm-pricing')}
                className="px-3 py-1.5 rounded-md text-[13px] font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                Pricing
              </button>
            </nav>

            {/* Right Action CTAs */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setOpenMenu(null);
                  setIsDownloadModalOpen(true);
                  trackEvent('HANDFILM_OPEN_DOWNLOAD_MODAL', { source: 'subnav' });
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md border border-white/15 bg-zinc-900/90 hover:border-white/35 text-xs font-medium text-zinc-100 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Download className="w-3.5 h-3.5 text-[#C8A96A]" />
                <span>Download</span>
              </button>

              <a
                href={buildStoryboardUrl('')}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackStoryboardLaunch('subnav_try_online', buildStoryboardUrl(''))}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-[#e11d48] hover:bg-[#f43f5e] text-xs font-semibold text-white transition-colors whitespace-nowrap shrink-0 shadow-[0_0_20px_rgba(225,29,72,0.3)]"
              >
                <span>Try online</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Mobile/Tablet Compact Sub-Nav Strip */}
          <div className="flex lg:hidden items-center gap-1.5 overflow-x-auto pb-2.5 no-scrollbar">
            {MEGA_MENU_GROUPS.map((group) => {
              const isOpen = openMenu === group.key;
              return (
                <button
                  key={group.key}
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenMenu(isOpen ? null : group.key)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer border ${
                    isOpen
                      ? 'bg-[#e11d48] border-[#e11d48] text-white'
                      : 'bg-zinc-900 border-white/10 text-zinc-300'
                  }`}
                >
                  <span>{group.label}</span>
                  <ChevronDown className={`w-3 h-3 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => scrollToSection('handfilm-discover')}
              className="px-2.5 py-1 rounded text-xs font-medium bg-zinc-900 border border-white/10 text-zinc-300 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Discover
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('handfilm-pricing')}
              className="px-2.5 py-1 rounded text-xs font-medium bg-zinc-900 border border-white/10 text-zinc-300 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Pricing
            </button>
          </div>
        </div>

        {/* Mega-Menu Dropdown Panel */}
        {activeMenuGroup && (
          <div
            onMouseEnter={clearHoverTimer}
            className="absolute left-0 right-0 top-full z-50 border-b border-white/12 bg-[#0d0d10]/98 backdrop-blur-2xl shadow-2xl"
          >
            <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 py-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Editorial Context */}
                <div className="lg:col-span-4 space-y-2 border-b lg:border-b-0 lg:border-r border-white/10 pb-4 lg:pb-0 lg:pr-6">
                  <div className="font-space-mono text-[11px] uppercase tracking-[0.16em] text-[#e11d48]">
                    {activeMenuGroup.label}
                  </div>
                  <h3 className="font-bebas text-2xl sm:text-3xl tracking-wide text-white leading-none">
                    {activeMenuGroup.headline}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
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
                      className="inline-flex items-center gap-1.5 text-xs font-space-mono text-[#C8A96A] hover:text-white transition-colors"
                    >
                      <span>Open storyboard.handsandhead.com</span>
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
                      className="group flex flex-col justify-between gap-2.5 p-3.5 rounded-lg bg-[#131317] hover:bg-[#19191f] border border-white/10 hover:border-[#e11d48]/70 transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-8 h-8 rounded-md bg-[#09090b] border border-white/10 flex items-center justify-center shrink-0">
                            {item.icon}
                          </span>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-white group-hover:text-[#e11d48] transition-colors truncate">
                              {item.title}
                            </div>
                            <div className="font-space-mono text-[10px] text-zinc-500 truncate">
                              {item.tag}
                            </div>
                          </div>
                        </div>
                        <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>

                      <p className="text-xs text-zinc-400 leading-relaxed">{item.subtitle}</p>

                      {item.banglaSample && (
                        <div
                          lang="bn"
                          className="bangla-text text-xs text-[#C8A96A] pt-1 border-t border-white/5"
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
      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        {/* ════════════════════════════════════════════════════════════════════════
            B. HERO SHOWCASE & 5 VERTICAL 9:16 SHOWCASE CARDS
        ════════════════════════════════════════════════════════════════════════ */}
        <section aria-labelledby="handfilm-hero-title" className="pt-10 sm:pt-14 pb-12 border-b border-white/10">
          <div className="max-w-4xl mx-auto text-center space-y-5">
            <div className="inline-flex items-center gap-2.5 font-space-mono text-[11px] uppercase tracking-[0.2em] text-[#C8A96A]">
              <span>HANDFILM STUDIO</span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span className="text-zinc-400">STORYBOARD.HANDSANDHEAD.COM</span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span className="text-[#e11d48]">WEBGL2 NLE</span>
            </div>

            <h1
              id="handfilm-hero-title"
              className="font-bebas tracking-[0.02em] text-white leading-[0.94]"
              style={{
                fontSize: 'clamp(2.85rem, 6vw, 5.25rem)',
                textWrap: 'balance',
              }}
            >
              AI-Powered Photo &amp; Video Editor for{' '}
              <span className="font-cormorant italic font-semibold text-[#e11d48] tracking-normal">
                Everyone
              </span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed">
              Launch Easy Mode, Beast Mode, CapCut Mode, or AD Studio straight into Storyboard with zero latency.
            </p>

            {/* Hero Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <a
                href={buildStoryboardUrl('')}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackStoryboardLaunch('hero_try_online', buildStoryboardUrl(''))}
                onMouseEnter={() => onSetCursorLabel?.('LAUNCH STORYBOARD ↗')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md bg-[#e11d48] hover:bg-[#f43f5e] text-sm font-semibold text-white transition-colors shadow-[0_0_32px_rgba(225,29,72,0.35)] whitespace-nowrap shrink-0"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Try online for free</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() => {
                  setIsDownloadModalOpen(true);
                  trackEvent('HANDFILM_OPEN_DOWNLOAD_MODAL', { source: 'hero' });
                }}
                onMouseEnter={() => onSetCursorLabel?.('GET DESKTOP / APK')}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-white/15 hover:border-white/35 text-sm font-medium text-zinc-100 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Download className="w-4 h-4 text-[#C8A96A]" />
                <span>Download Desktop / Android</span>
              </button>
            </div>

            {/* Quiet Capability Metadata Strip (Zero-Pill Unboxed Format) */}
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 pt-2 font-space-mono text-[11px] text-zinc-400">
              <span>Zero-Install Browser NLE</span>
              <span aria-hidden="true" className="text-zinc-700">·</span>
              <span>.MOV / .MKV / .AVI Native</span>
              <span aria-hidden="true" className="text-zinc-700">·</span>
              <span lang="bn" className="bangla-text text-zinc-300">
                বাংলা কাইনেটিক টাইপোগ্রাফি ও সাবটাইটেল
              </span>
              <span aria-hidden="true" className="text-zinc-700">·</span>
              <span>-14 LUFS Master</span>
            </div>
          </div>

          {/* 5 Vertical 9:16 Showcase Cards Strip */}
          <div className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {VERTICAL_SHOWCASE_CARDS.map((card) => {
              const isHovered = hoveredVerticalId === card.id;
              return (
                <a
                  key={card.id}
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => {
                    setHoveredVerticalId(card.id);
                    onSetCursorLabel?.(`OPEN ${card.title.toUpperCase()} ↗`);
                  }}
                  onMouseLeave={() => setHoveredVerticalId(null)}
                  onClick={() => trackStoryboardLaunch(`vertical_card_${card.id}`, card.href)}
                  className={`group relative aspect-[9/16] rounded-xl overflow-hidden border border-white/12 hover:border-[#e11d48]/80 bg-gradient-to-b ${card.fallbackGradient} flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-xl`}
                >
                  {/* Fallback Texture & Icon Underlay */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center justify-center opacity-20"
                  >
                    <Film className="w-12 h-12 text-white/30" />
                  </div>

                  {/* Generated 9:16 Poster Asset */}
                  <img
                    src={card.imageUrl}
                    alt={`${card.title} workflow preview in HandFilm Studio`}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-95 group-hover:scale-[1.04] transition-all duration-300"
                  />

                  {/* Measured Contrast Scrim */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/45 to-[#09090b]/35"
                  />

                  {/* Top Metadata Bar */}
                  <div className="relative z-10 p-4 flex items-center justify-between gap-2 font-space-mono text-[10px] tracking-wider">
                    <span className="text-[#C8A96A] font-bold uppercase">{card.kicker}</span>
                    <span className="text-zinc-300 tabular-nums">{card.ratio} · {card.duration}</span>
                  </div>

                  {/* Center Hover Play Affordance */}
                  <div className="relative z-10 flex items-center justify-center">
                    <span
                      className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all duration-200 ${
                        isHovered
                          ? 'bg-[#e11d48] border-[#e11d48] text-white scale-110 shadow-[0_0_24px_rgba(225,29,72,0.55)]'
                          : 'bg-[#09090b]/70 border-white/25 text-white/90'
                      }`}
                    >
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </span>
                  </div>

                  {/* Bottom Title & Action Copy */}
                  <div className="relative z-10 p-4 space-y-1.5">
                    {card.banglaTag && (
                      <div lang="bn" className="bangla-text text-xs text-[#C8A96A]">
                        {card.banglaTag}
                      </div>
                    )}
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="font-bebas text-2xl tracking-wide text-white leading-none">
                        {card.title}
                      </h2>
                      <ArrowUpRight className="w-4 h-4 text-zinc-300 group-hover:text-[#e11d48] transition-colors shrink-0" />
                    </div>
                    <p className="text-xs text-zinc-300/90 leading-snug line-clamp-2">
                      {card.description}
                    </p>
                    <div className="pt-1 font-space-mono text-[10px] text-zinc-400 group-hover:text-white transition-colors">
                      {card.queryTag}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════════
            C. INTERACTIVE "FIND THE RIGHT MODEL. SWITCH IN A CLICK." GRID
        ════════════════════════════════════════════════════════════════════════ */}
        <section aria-labelledby="handfilm-models-heading" className="py-14 border-b border-white/10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div className="space-y-2 max-w-2xl">
              <div className="font-space-mono text-[11px] uppercase tracking-[0.2em] text-[#e11d48]">
                CORE AI &amp; EDITING ARCHITECTURE
              </div>
              <h2
                id="handfilm-models-heading"
                className="font-bebas text-4xl sm:text-5xl tracking-wide text-white leading-none"
                style={{ textWrap: 'balance' }}
              >
                Find the Right Model. Switch in a Click.
              </h2>
              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                Select any specialized HandFilm engine below and launch directly into Storyboard with its workspace pre-armed.
              </p>
            </div>

            {/* Interactive Segmented Filter Control */}
            <div
              role="tablist"
              aria-label="Filter HandFilm Models"
              className="inline-flex items-center gap-1 p-1 rounded-lg bg-[#131317] border border-white/10 self-start lg:self-auto"
            >
              {(
                [
                  { id: 'all', label: 'All Models (6)' },
                  { id: 'editor', label: 'NLE Modes' },
                  { id: 'ai', label: 'Vision & Reframe' },
                  { id: 'commerce', label: 'AD Studio' },
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
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-[#e11d48] text-white'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6-Card Model Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredModels.map((model) => {
              const isSelected = selectedModelId === model.id;
              return (
                <article
                  key={model.id}
                  onClick={() => setSelectedModelId(model.id)}
                  className={`group rounded-xl border p-6 flex flex-col justify-between gap-6 transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-[#141419] border-[#e11d48]/80 shadow-[0_12px_36px_rgba(225,29,72,0.12)]'
                      : 'bg-[#101014] border-white/10 hover:border-white/25'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header Metadata */}
                    <div className="flex items-center justify-between gap-2 font-space-mono text-[11px]">
                      <span style={{ color: model.accentHex }} className="font-bold">
                        {model.kicker}
                      </span>
                      <span className="text-zinc-400 tabular-nums">
                        {model.badge} · {model.latency}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-2">
                      <h3 className="font-bebas text-3xl tracking-wide text-white leading-none">
                        {model.name}
                      </h3>
                      <p className="text-sm text-zinc-400 leading-relaxed">{model.description}</p>
                    </div>

                    {/* Concrete Spec List */}
                    <ul className="space-y-1.5 pt-2 border-t border-white/5">
                      {model.highlights.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-xs text-zinc-300">
                          <Check className="w-3.5 h-3.5 text-[#e11d48] shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Card Footer CTA */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                    <span className="font-space-mono text-[11px] text-zinc-500">
                      {model.query}
                    </span>

                    <a
                      href={model.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.stopPropagation();
                        trackStoryboardLaunch(`model_grid_${model.id}`, model.href);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#e11d48] hover:bg-[#f43f5e] text-xs font-semibold text-white transition-colors whitespace-nowrap shrink-0"
                    >
                      <span>Launch in Storyboard</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
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
        <section aria-labelledby="handfilm-workflow-heading" className="py-14 border-b border-white/10">
          <div className="space-y-2 mb-8">
            <div className="font-space-mono text-[11px] uppercase tracking-[0.2em] text-[#C8A96A]">
              THREE-STAGE PIPELINE
            </div>
            <h2
              id="handfilm-workflow-heading"
              className="font-bebas text-4xl sm:text-5xl tracking-wide text-white leading-none"
            >
              From Raw Idea to Master Cut in Minutes
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
                    className={`text-left p-5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col gap-2 ${
                      isActive
                        ? 'bg-[#141419] border-[#e11d48] shadow-[0_8px_28px_rgba(225,29,72,0.14)]'
                        : 'bg-[#101014] border-white/10 hover:border-white/25'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 font-space-mono text-[11px]">
                      <span className={isActive ? 'text-[#e11d48] font-bold' : 'text-zinc-500'}>
                        STEP {step.number}
                      </span>
                      <span className="text-zinc-500">?{step.storyboardQuery}</span>
                    </div>

                    <h3 className="font-bebas text-2xl sm:text-3xl tracking-wide text-white leading-none">
                      {step.number} {step.title}
                    </h3>

                    <p className="text-xs sm:text-sm font-medium text-[#C8A96A]">
                      {step.subtitle}
                    </p>

                    <p className="text-xs text-zinc-400 leading-relaxed">{step.description}</p>

                    <div lang="bn" className="bangla-text text-xs text-zinc-300 pt-1">
                      {step.banglaCaption}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Interactive Live Studio Mockup Card */}
            <div className="lg:col-span-7 bg-[#111116] border border-white/12 rounded-xl p-5 sm:p-6 flex flex-col justify-between gap-6">
              {/* Mockup Chrome Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5 font-space-mono text-[11px]">
                  <Terminal className="w-4 h-4 text-[#e11d48]" />
                  <span className="text-white font-bold">{activeStep.previewHeader}</span>
                </div>
                <div className="flex items-center gap-2 font-space-mono text-[10px] text-zinc-400">
                  {activeStep.previewSpecs.map((spec, sIdx) => (
                    <React.Fragment key={spec}>
                      {sIdx > 0 && <span aria-hidden="true">·</span>}
                      <span>{spec}</span>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Dynamic Mockup Canvas per Active Step */}
              <div className="flex-1 flex flex-col justify-between gap-5">
                {activeStepIndex === 0 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-4 rounded-lg bg-[#09090b] border border-white/10 space-y-1.5">
                        <div className="font-space-mono text-[10px] text-[#e11d48]">01. SOURCE INGEST</div>
                        <div className="text-sm font-semibold text-white">RAW_JACKET_4K.MOV</div>
                        <div className="font-space-mono text-[11px] text-zinc-400 tabular-nums">
                          3840×2160 · 60fps · Decoded in Browser
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-[#09090b] border border-white/10 space-y-1.5">
                        <div className="font-space-mono text-[10px] text-[#C8A96A]">02. SKU BRIEF</div>
                        <div className="text-sm font-semibold text-white">300 GSM Heavyweight</div>
                        <div className="font-space-mono text-[11px] text-zinc-400">
                          Synced from b2b.handsandhead.com
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-[#09090b] border border-white/10 space-y-1.5">
                        <div className="font-space-mono text-[10px] text-white">03. 100-SHOT PLAN</div>
                        <div className="text-sm font-semibold text-white">15s Reel Blueprint</div>
                        <div className="font-space-mono text-[11px] text-zinc-400 tabular-nums">
                          18 Beat Cuts · 9:16 Safe-Zone
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-[#09090b] border border-white/10 space-y-2">
                      <div className="flex items-center justify-between font-space-mono text-[11px] text-zinc-400">
                        <span>GENERATED BILINGUAL HOOK</span>
                        <span>BANGLA + EN READY</span>
                      </div>
                      <p className="text-sm text-white font-medium">
                        &ldquo;Direct-from-source Dhaka Distressed Leather — engineered for 10-year wear.&rdquo;
                      </p>
                      <p lang="bn" className="bangla-text text-sm text-[#C8A96A]">
                        &ldquo;সরাসরি ঢাকা ফ্যাক্টরি থেকে প্রিমিয়াম লেদার ও ৩০০ জিএসএম স্ট্রিটওয়্যার — এখন আপনার ব্র্যান্ডের জন্য।&rdquo;
                      </p>
                    </div>
                  </div>
                )}

                {activeStepIndex === 1 && (
                  <div className="space-y-4">
                    {/* Multi-Track NLE Timeline Preview */}
                    <div className="p-4 rounded-lg bg-[#09090b] border border-white/10 space-y-3">
                      <div className="flex items-center justify-between font-space-mono text-[10px] text-zinc-400 tabular-nums">
                        <span>TIMELINE · 00:00:00:00 → 00:00:15:00</span>
                        <span className="text-[#e11d48]">BEAT-SYNC LOCKED (128 BPM)</span>
                      </div>

                      {/* Track V2: Kinetic Typography */}
                      <div className="space-y-1">
                        <div className="font-space-mono text-[10px] text-zinc-500">V2 · KINETIC TITLES</div>
                        <div className="grid grid-cols-12 gap-1.5 h-8">
                          <div className="col-span-4 rounded bg-[#C8A96A]/20 border border-[#C8A96A]/50 px-2 flex items-center text-[11px] text-[#f3efe6] truncate">
                            <span lang="bn" className="bangla-text">প্রিমিয়াম কালেকশন</span>
                          </div>
                          <div className="col-span-5 rounded bg-[#e11d48]/20 border border-[#e11d48]/50 px-2 flex items-center text-[11px] text-white font-space-mono truncate">
                            SMART-EYE ZOOM 1.15x
                          </div>
                          <div className="col-span-3 rounded bg-white/10 border border-white/20 px-2 flex items-center text-[11px] text-zinc-200 font-space-mono truncate">
                            CTA SLATE
                          </div>
                        </div>
                      </div>

                      {/* Track V1: Video Cuts */}
                      <div className="space-y-1">
                        <div className="font-space-mono text-[10px] text-zinc-500">V1 · BEAST VIDEO TRACK</div>
                        <div className="grid grid-cols-12 gap-1 h-10">
                          <div className="col-span-3 rounded bg-zinc-800 border border-white/15 px-2 flex items-center font-space-mono text-[10px] text-zinc-200 truncate">
                            SHOT 01
                          </div>
                          <div className="col-span-2 rounded bg-zinc-800 border border-[#e11d48]/50 px-2 flex items-center font-space-mono text-[10px] text-zinc-200 truncate">
                            SHOT 02
                          </div>
                          <div className="col-span-4 rounded bg-zinc-800 border border-white/15 px-2 flex items-center font-space-mono text-[10px] text-zinc-200 truncate">
                            SHOT 03 (CUT)
                          </div>
                          <div className="col-span-3 rounded bg-zinc-800 border border-[#C8A96A]/50 px-2 flex items-center font-space-mono text-[10px] text-zinc-200 truncate">
                            HERO PACK
                          </div>
                        </div>
                      </div>

                      {/* Track A1: Beat Waveform */}
                      <div className="space-y-1">
                        <div className="font-space-mono text-[10px] text-zinc-500">A1 · BEAT STEMS (-14 LUFS)</div>
                        <div className="h-8 rounded bg-[#141418] border border-white/10 px-2 flex items-center gap-1 overflow-hidden">
                          {[38, 72, 52, 90, 44, 66, 85, 48, 78, 95, 40, 62, 88, 54, 74, 82, 46, 68, 92, 50, 64, 76, 42, 84].map(
                            (heightPct, idx) => (
                              <span
                                key={idx}
                                className={`flex-1 rounded-sm ${idx % 4 === 3 ? 'bg-[#e11d48]' : 'bg-[#C8A96A]/65'}`}
                                style={{ height: `${Math.round(heightPct * 0.24)}px` }}
                              />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeStepIndex === 2 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Interactive 2D Mood-Pad */}
                    <div className="p-4 rounded-lg bg-[#09090b] border border-white/10 space-y-3">
                      <div className="flex items-center justify-between font-space-mono text-[10px] text-zinc-400">
                        <span>INTERACTIVE 2D MOOD-PAD</span>
                        <span className="text-[#C8A96A] tabular-nums">
                          X:{moodPadPos.x} · Y:{moodPadPos.y}
                        </span>
                      </div>
                      <div
                        role="slider"
                        aria-label="2D Mood-Pad Color Grade Controller"
                        aria-valuenow={moodPadPos.x}
                        tabIndex={0}
                        onClick={handleMoodPadInteract}
                        className="relative h-36 rounded-lg border border-white/15 cursor-crosshair overflow-hidden"
                        style={{
                          background:
                            'radial-gradient(circle at 20% 20%, rgba(225,29,72,0.45), transparent 55%), radial-gradient(circle at 80% 25%, rgba(200,169,106,0.45), transparent 55%), radial-gradient(circle at 50% 90%, rgba(30,64,175,0.4), transparent 60%), #121216',
                        }}
                      >
                        <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none">
                          {Array.from({ length: 16 }).map((_, cellIdx) => (
                            <div key={cellIdx} className="border border-white/[0.04]" />
                          ))}
                        </div>
                        <span
                          className="absolute w-4 h-4 -ml-2 -mt-2 rounded-full bg-white border-2 border-[#e11d48] shadow-[0_0_16px_rgba(225,29,72,0.8)] pointer-events-none transition-all duration-100"
                          style={{ left: `${moodPadPos.x}%`, top: `${moodPadPos.y}%` }}
                        />
                      </div>
                      <div className="font-space-mono text-[10px] text-zinc-500">
                        Click anywhere on the pad to shift WebGL2 LUT warmth &amp; crimson contrast.
                      </div>
                    </div>

                    {/* 1->5 Omnichannel Export Matrix */}
                    <div className="p-4 rounded-lg bg-[#09090b] border border-white/10 space-y-3 flex flex-col justify-between">
                      <div className="flex items-center justify-between font-space-mono text-[10px] text-zinc-400">
                        <span>1→5 OMNICHANNEL OUTPUT</span>
                        <span className="text-emerald-400">-14.0 LUFS LOCKED</span>
                      </div>

                      <div className="space-y-2 font-space-mono text-[11px]">
                        {[
                          { ratio: '9:16', target: 'Reels / Shorts / TikTok', status: 'Safe-Zone Verified' },
                          { ratio: '16:9', target: 'YouTube Creator Studio', status: 'OAuth Upload Ready' },
                          { ratio: '4:5', target: 'F-Commerce Feed Ad', status: 'Auto-Reframed' },
                          { ratio: '1:1', target: 'Catalog Square Card', status: 'R2 Edge Cached' },
                        ].map((out) => (
                          <div
                            key={out.ratio}
                            className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded bg-[#141418] border border-white/5"
                          >
                            <span className="text-white font-bold tabular-nums">{out.ratio}</span>
                            <span className="text-zinc-300 truncate flex-1">{out.target}</span>
                            <span className="text-[#C8A96A] text-[10px] shrink-0">{out.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Mockup Footer Action */}
                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <div className="font-space-mono text-xs text-zinc-400">
                    Connects on-demand to{' '}
                    <span className="text-zinc-200">
                      storyboard.handsandhead.com/?{activeStep.storyboardQuery}
                    </span>
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
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#e11d48] hover:bg-[#f43f5e] text-xs font-semibold text-white transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>{activeStep.ctaLabel}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════════
            DISCOVER SECTION (TEMPLATES & TUTORIALS ANCHOR)
        ════════════════════════════════════════════════════════════════════════ */}
        <section id="handfilm-discover" aria-labelledby="handfilm-discover-heading" className="py-14 border-b border-white/10 scroll-mt-32">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div className="space-y-1.5">
              <div className="font-space-mono text-[11px] uppercase tracking-[0.2em] text-[#e11d48]">
                DISCOVER · TEMPLATES &amp; TUTORIALS
              </div>
              <h2
                id="handfilm-discover-heading"
                className="font-bebas text-4xl sm:text-5xl tracking-wide text-white leading-none"
              >
                Ready-to-Edit Storyboard Blueprints
              </h2>
            </div>
            <a
              href={buildStoryboardUrl('tool=100shots')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackStoryboardLaunch('discover_all', buildStoryboardUrl('tool=100shots'))}
              className="inline-flex items-center gap-1.5 font-space-mono text-xs text-[#C8A96A] hover:text-white transition-colors whitespace-nowrap"
            >
              <span>Browse Full Template Vault</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                id: 'disc-100shots',
                kicker: 'TEMPLATE · 100-SHOT REEL',
                title: 'Factory-to-Runway 100-Shot Sequence',
                desc: 'Rapidly sequence stitching, tannery grain, and final lookbook frames synced to a 128 BPM industrial score.',
                bangla: 'গার্মেন্টস ও লেদার প্রোডাকশন রিল টেমপ্লেট',
                href: buildStoryboardUrl('tool=100shots'),
              },
              {
                id: 'disc-bangla-kinetic',
                kicker: 'TUTORIAL · KINETIC TYPE',
                title: 'Bangla-EN Karaoke & Price Callouts',
                desc: 'Step-by-step preset pairing zero-broken-ligature Bangla titles with crisp F-Commerce price & WhatsApp overlays.',
                bangla: 'নিখুঁত বাংলা টাইপোগ্রাফি ও সাবটাইটেল গাইড',
                href: buildStoryboardUrl('tool=bangla-type'),
              },
              {
                id: 'disc-youtube-pipeline',
                kicker: 'WORKFLOW · CLOUDFLARE R2 + YOUTUBE',
                title: 'One-Click Dual Master Publish',
                desc: 'Archive your 4K master in Cloudflare R2 while pushing timestamped chapters directly to YouTube Creator Studio.',
                bangla: 'ইউটিউব ও ক্লাউডফ্লেয়ার আর২ ডাইরেক্ট পাবলিশ',
                href: buildStoryboardUrl('integration=youtube-studio'),
              },
            ].map((item) => (
              <a
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackStoryboardLaunch(item.id, item.href)}
                className="group p-6 rounded-xl bg-[#101014] hover:bg-[#15151b] border border-white/10 hover:border-[#e11d48]/70 transition-all flex flex-col justify-between gap-4"
              >
                <div className="space-y-2.5">
                  <div className="font-space-mono text-[10.5px] text-[#C8A96A]">{item.kicker}</div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#e11d48] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
                </div>
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <span lang="bn" className="bangla-text text-xs text-zinc-300">
                    {item.bangla}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-white shrink-0" />
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════════
            PRICING SECTION (FREE WEB STUDIO / DESKTOP PRO / ENTERPRISE SUITE)
        ════════════════════════════════════════════════════════════════════════ */}
        <section id="handfilm-pricing" aria-labelledby="handfilm-pricing-heading" className="py-14 scroll-mt-32">
          <div className="space-y-1.5 mb-8">
            <div className="font-space-mono text-[11px] uppercase tracking-[0.2em] text-[#C8A96A]">
              TRANSPARENT EDITIONS
            </div>
            <h2
              id="handfilm-pricing-heading"
              className="font-bebas text-4xl sm:text-5xl tracking-wide text-white leading-none"
            >
              Start Free in the Browser. Scale to Workstation &amp; Studio.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Tier 1: Free Web Studio */}
            <div className="rounded-xl bg-[#101014] border border-white/10 p-6 flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between font-space-mono text-[11px] text-zinc-400">
                  <span>WEB STUDIO</span>
                  <span>BROWSER WEBGL2</span>
                </div>
                <div>
                  <h3 className="font-bebas text-3xl text-white">Free Web Studio</h3>
                  <div className="mt-1 font-space-mono text-2xl font-bold text-white tabular-nums">
                    $0 <span className="text-xs font-normal text-zinc-400">/ forever in browser</span>
                  </div>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Full access to Easy Mode, CapCut Rapid, Smart-Eye framing, and 1080p/4K WebGL2 exports directly inside storyboard.handsandhead.com.
                </p>
                <ul className="space-y-2 text-xs text-zinc-300 pt-2 border-t border-white/10">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#e11d48]" />
                    <span>Zero install · Instant browser boot</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#e11d48]" />
                    <span>Bangla-EN subtitles &amp; kinetic titles</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#e11d48]" />
                    <span>Reels 9:16 Safe-Zone preview</span>
                  </li>
                </ul>
              </div>
              <a
                href={buildStoryboardUrl('mode=easy')}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackStoryboardLaunch('pricing_free_web', buildStoryboardUrl('mode=easy'))}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-colors"
              >
                <span>Try online for free</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Tier 2: Desktop Pro */}
            <div className="rounded-xl bg-[#14141a] border border-[#e11d48]/70 p-6 flex flex-col justify-between gap-6 shadow-[0_12px_40px_rgba(225,29,72,0.12)]">
              <div className="space-y-4">
                <div className="flex items-center justify-between font-space-mono text-[11px]">
                  <span className="text-[#e11d48] font-bold">DESKTOP &amp; MOBILE PRO</span>
                  <span className="text-zinc-400">TAURI / ELECTRON / APK</span>
                </div>
                <div>
                  <h3 className="font-bebas text-3xl text-white">Desktop Pro</h3>
                  <div className="mt-1 font-space-mono text-2xl font-bold text-white tabular-nums">
                    $19 <span className="text-xs font-normal text-zinc-400">/ month · creator suite</span>
                  </div>
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  Unlocks Beast Mode multi-track hardware FFmpeg encoding, 1→5 batch omnichannel exports, and offline Tauri/Electron workstation builds.
                </p>
                <ul className="space-y-2 text-xs text-zinc-200 pt-2 border-t border-white/10">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#e11d48]" />
                    <span>Windows .exe (25MB Tauri &amp; Electron) + Android .apk</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#e11d48]" />
                    <span>Unlimited 4K Beast NLE tracks &amp; 2D Mood-Pad LUTs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#e11d48]" />
                    <span>YouTube Creator Studio OAuth direct publish</span>
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsDownloadModalOpen(true);
                  trackEvent('HANDFILM_OPEN_DOWNLOAD_MODAL', { source: 'pricing_pro' });
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-[#e11d48] hover:bg-[#f43f5e] text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Desktop / Android</span>
              </button>
            </div>

            {/* Tier 3: Enterprise Suite */}
            <div className="rounded-xl bg-[#101014] border border-white/10 p-6 flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between font-space-mono text-[11px]">
                  <span className="text-[#C8A96A] font-bold">ENTERPRISE SUITE</span>
                  <span className="text-zinc-400">B2B &amp; AGENCIES</span>
                </div>
                <div>
                  <h3 className="font-bebas text-3xl text-white">Enterprise Suite</h3>
                  <div className="mt-1 font-space-mono text-2xl font-bold text-white tabular-nums">
                    Custom <span className="text-xs font-normal text-zinc-400">/ team &amp; R2 vault</span>
                  </div>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Built for RMG &amp; Leather export houses, multi-brand D2C teams, and creative agencies needing dedicated Cloudflare R2 storage &amp; B2B SKU sync.
                </p>
                <ul className="space-y-2 text-xs text-zinc-300 pt-2 border-t border-white/10">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#C8A96A]" />
                    <span>Direct b2b.handsandhead.com catalog ingestion</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#C8A96A]" />
                    <span>Zero-egress Cloudflare R2 team asset vaults</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#C8A96A]" />
                    <span>Custom AD Studio brand kits &amp; Bangla fonts</span>
                  </li>
                </ul>
              </div>
              <a
                href={buildStoryboardUrl('solution=agencies')}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackStoryboardLaunch('pricing_enterprise', buildStoryboardUrl('solution=agencies'))}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-[#C8A96A] hover:bg-[#dfc286] text-xs font-bold text-[#09090b] transition-colors"
              >
                <span>Launch Enterprise Workspace</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          FLOATING BOTTOM PILL BAR (GLASSMORPHIC STICKY BAR)
      ════════════════════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-14 sm:bottom-16 left-1/2 -translate-x-1/2 z-30 w-[calc(100%-1.5rem)] max-w-xl pointer-events-auto">
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-full bg-[#111116]/85 backdrop-blur-xl border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.65)]">
          <div className="flex items-center gap-2.5 min-w-0 pl-1">
            <span className="font-space-mono text-[11px] font-bold tracking-wider text-white shrink-0">
              HANDFILM
            </span>
            <span aria-hidden="true" className="text-zinc-600 hidden sm:inline">—</span>
            <span className="text-xs text-zinc-300 truncate hidden sm:inline">
              Edit smarter, create faster
            </span>
          </div>

          <a
            href={buildStoryboardUrl('')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackStoryboardLaunch('floating_bottom_pill', buildStoryboardUrl(''))}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#e11d48] hover:bg-[#f43f5e] text-xs font-semibold text-white transition-colors whitespace-nowrap shrink-0"
          >
            <span>Try online for free</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          MULTI-PLATFORM DOWNLOAD MODAL (WINDOWS .EXE TAURI/ELECTRON & ANDROID .APK)
      ════════════════════════════════════════════════════════════════════════ */}
      {isDownloadModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="handfilm-download-modal-title"
          onClick={() => setIsDownloadModalOpen(false)}
          className="fixed inset-0 z-[130] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0e0e12] border border-white/15 shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 p-6 border-b border-white/10">
              <div className="space-y-1">
                <div className="font-space-mono text-[11px] uppercase tracking-[0.18em] text-[#e11d48]">
                  MULTI-PLATFORM INSTALLERS
                </div>
                <h2
                  id="handfilm-download-modal-title"
                  className="font-bebas text-3xl sm:text-4xl tracking-wide text-white leading-none"
                >
                  Download HandFilm Studio
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400">
                  Choose between lightweight Windows Tauri (25 MB), full offline Electron Workstation, or Android Studio APK.
                </p>
              </div>

              <button
                type="button"
                aria-label="Close download modal"
                onClick={() => setIsDownloadModalOpen(false)}
                className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Platform Cards Grid */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {DOWNLOAD_ARTIFACTS.map((artifact) => (
                <div
                  key={artifact.id}
                  className={`rounded-xl border p-5 flex flex-col justify-between gap-5 ${
                    artifact.recommended
                      ? 'bg-[#15151c] border-[#e11d48]/75'
                      : 'bg-[#111116] border-white/10'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 font-space-mono text-[10.5px]">
                      <span className="inline-flex items-center gap-1.5 text-zinc-200 font-bold uppercase">
                        {artifact.platform === 'windows' ? (
                          <Monitor className="w-3.5 h-3.5 text-[#C8A96A]" />
                        ) : (
                          <Smartphone className="w-3.5 h-3.5 text-[#e11d48]" />
                        )}
                        <span>{artifact.platform === 'windows' ? 'Windows .exe' : 'Android .apk'}</span>
                      </span>
                      <span className="text-[#C8A96A] font-bold tabular-nums">{artifact.size}</span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white leading-snug">{artifact.name}</h3>
                      <div className="font-space-mono text-[10px] text-zinc-400 mt-1">
                        {artifact.architecture}
                      </div>
                    </div>

                    <div className="font-space-mono text-[10.5px] text-zinc-300 flex items-center gap-1.5">
                      <HardDrive className="w-3 h-3 text-zinc-500 shrink-0" />
                      <span>{artifact.engine}</span>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed">{artifact.description}</p>

                    <ul className="space-y-1.5 pt-2 border-t border-white/10">
                      {artifact.features.map((feat) => (
                        <li key={feat} className="flex items-center gap-2 text-xs text-zinc-300">
                          <Check className="w-3 h-3 text-[#e11d48] shrink-0" />
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
                    className={`w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                      artifact.recommended
                        ? 'bg-[#e11d48] hover:bg-[#f43f5e] text-white'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100'
                    }`}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{artifact.ctaLabel}</span>
                  </a>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-white/10 bg-[#09090b]/80 flex flex-wrap items-center justify-between gap-3">
              <div className="font-space-mono text-[11px] text-zinc-400">
                Prefer zero-install? All WebGL2 editing modes run natively in your browser.
              </div>
              <a
                href={buildStoryboardUrl('')}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackStoryboardLaunch('download_modal_web_fallback', buildStoryboardUrl(''))}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C8A96A] hover:text-white transition-colors"
              >
                <span>Launch Web Studio Instead</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// END OF FILE: src/components/handfilm/HandFilmHubView.tsx
