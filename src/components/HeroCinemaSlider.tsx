import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Film,
  Factory,
  Layers,
  MessageCircle,
  Pause,
  Play,
  Sliders,
  Sparkles,
  Terminal,
  Smartphone,
} from 'lucide-react';
import { ActiveTab } from '../types';
import { HERO_BACKDROP_ASSETS } from '../services/cinemaKeyframeService';
import { trackEvent } from '../services/analytics';
import { buildOfficialWhatsAppUrl } from '../config/officialContactConfig';

export interface HeroCinemaSliderProps {
  isActiveTab: boolean;
  modulesCount: number;
  syncRoomId: string;
  whatsappHubUrl: string;
  onNavigateTab: (tab: ActiveTab) => void;
  onJumpToSection: (sectionId: string) => void;
  onOpenCommandPalette: () => void;
  onOpenSyncModal: () => void;
  onSetCursorLabel: (label: string) => void;
}

type HeroSlideId = 'handfilm' | 'rawx' | 'arutemika' | 'b2b' | 'ecosystem';

interface HeroSlideConfig {
  id: HeroSlideId;
  indexLabel: string;
  kicker: string;
  title: string;
  subtitle: string;
  telemetry: string;
  fpsLabel: string;
  accentHex: string;
  secondaryHex: string;
  backdropUrl: string;
  backdropAlt: string;
  domainLabel: string;
}

const SLIDE_DURATION_MS = 7500;

const HERO_SLIDES: HeroSlideConfig[] = [
  {
    id: 'handfilm',
    indexLabel: '01',
    kicker: '01 // HANDFILM STUDIO',
    title: 'HANDFILM CINEMA ENGINE',
    subtitle:
      'Browser-native WebGL2 AI Video Studio, Storyboard NLE, and Cloudflare Edge Cinema Host built for dramatic BTS production and 120FPS speed-ramp workflows.',
    telemetry: 'ARRI ALEXA MINI LF • 50MM ANAMORPHIC • 24FPS • SPEED RAMP 120FPS→24FPS',
    fpsLabel: 'LIVE SET // 24FPS',
    accentHex: '#e11d48',
    secondaryHex: '#f59e0b',
    backdropUrl: HERO_BACKDROP_ASSETS.handfilm,
    backdropAlt: 'HANDFILM Studio anamorphic behind-the-scenes cinema production rig',
    domainLabel: 'storyboard.handsandhead.com',
  },
  {
    id: 'rawx',
    indexLabel: '02',
    kicker: '02 // RAWx — HIDE & STEEL',
    title: 'RAWx — HIDE & STEEL',
    subtitle:
      'Ultra-macro craftsmanship pairing full-grain vegetable-tanned buffalo hide with brushed 316L & 516SS surgical steel clasps and hand-burnished molten edges.',
    telemetry: '100MM LAOWA PROBE MACRO • 316L / 516SS STEEL • 120FPS→24FPS WHIP PAN',
    fpsLabel: 'MACRO // 120FPS',
    accentHex: '#f59e0b',
    secondaryHex: '#e11d48',
    backdropUrl: HERO_BACKDROP_ASSETS.rawx,
    backdropAlt: 'RAWx brushed 316L steel clasp locking onto full-grain buffalo leather',
    domainLabel: 'rawx.handsandhead.com',
  },
  {
    id: 'arutemika',
    indexLabel: '03',
    kicker: '03 // ARUTEMIKA & HIGH-FASHION EDITORIAL',
    title: 'ARUTEMIKA COUTURE',
    subtitle:
      'Chiaroscuro rim-lit editorial fashion, sculptural curves and hip-line tailoring, flowing silk-and-leather drape physics, and bespoke corporate wholesale.',
    telemetry: 'LEICA 85MM SUMMILUX • CHIAROSCURO RIM KEY • 48FPS SMOOTH DOLLY RAMP',
    fpsLabel: 'EDITORIAL // 48FPS',
    accentHex: '#f59e0b',
    secondaryHex: '#e11d48',
    backdropUrl: HERO_BACKDROP_ASSETS.arutemika,
    backdropAlt: 'Arutemika high-fashion chiaroscuro studio editorial silhouette',
    domainLabel: 'arutemika.handsandhead.com',
  },
  {
    id: 'b2b',
    indexLabel: '04',
    kicker: '04 // B2B INDUSTRIAL & EXPORT WINGS (7 VERTICALS)',
    title: '7 INDUSTRIAL WINGS',
    subtitle:
      'Direct-from-source Dhaka export manufacturing spanning Textile, RMG, Leather, Jacket, Jute, Lingerie, and Bracelets with 120 pcs/style MOQ and 240–300 GSM precision.',
    telemetry: 'DHAKA EXPORT LINE • 120 PCS MOQ • 240–300 GSM • 7 ACTIVE VERTICALS',
    fpsLabel: 'B2B CORE // 7 WINGS',
    accentHex: '#f59e0b',
    secondaryHex: '#e11d48',
    backdropUrl: HERO_BACKDROP_ASSETS.b2b,
    backdropAlt: 'HANDS & HEAD B2B textile and jute precision manufacturing loom',
    domainLabel: 'b2b.handsandhead.com',
  },
  {
    id: 'ecosystem',
    indexLabel: '05',
    kicker: '05 // 24 ECOSYSTEM APPS & AI WORKFLOW CORE',
    title: '24 APPS & AI WORKFLOW CORE',
    subtitle:
      'Unified browser software core orchestrating GapCut, GapShot, BumBit, GapToon, Hiya, PicSeed, and Deeper across all 24 HANDS & HEAD venture portals.',
    telemetry: '24 LIVE NODES • GAPCUT • GAPSHOT • BUMBIT • GAPTOON • HIYA • PICSEED • DEEPER',
    fpsLabel: 'MESH // 60FPS SYNC',
    accentHex: '#e11d48',
    secondaryHex: '#f59e0b',
    backdropUrl: HERO_BACKDROP_ASSETS.apps,
    backdropAlt: 'HANDS & HEAD 24 Ecosystem Apps and AI Workflow Core node graph',
    domainLabel: 'apps.handsandhead.com',
  },
];

const B2B_VERTICALS = [
  { id: 'textile', label: 'TEXTILE' },
  { id: 'rmg', label: 'RMG' },
  { id: 'leather', label: 'LEATHER' },
  { id: 'jacket', label: 'JACKET' },
  { id: 'jute', label: 'JUTE' },
  { id: 'lingerie', label: 'LINGERIE' },
  { id: 'bracelets', label: 'BRACELETS' },
] as const;

const AI_WORKFLOW_NODES = [
  { id: 'studio', label: 'GapCut', sub: 'NLE Speed Cut', x: 0.17, y: 0.34, color: '#e11d48' },
  { id: 'picseed', label: 'GapShot', sub: 'Frame Seed', x: 0.36, y: 0.22, color: '#f59e0b' },
  { id: 'aural', label: 'BumBit', sub: 'Beat Sync DSP', x: 0.54, y: 0.36, color: '#10b981' },
  { id: 'apps', label: 'GapToon', sub: 'Stylized Render', x: 0.72, y: 0.24, color: '#f59e0b' },
  { id: 'hiya', label: 'Hiya', sub: 'Team Mesh', x: 0.28, y: 0.64, color: '#e11d48' },
  { id: 'picseed', label: 'PicSeed', sub: 'Image CDN', x: 0.51, y: 0.68, color: '#f59e0b' },
  { id: 'deeper', label: 'Deeper', sub: 'R&D Core', x: 0.76, y: 0.61, color: '#10b981' },
] as const;

function formatTimecode(elapsedSec: number): string {
  const totalFrames = Math.floor(elapsedSec * 24);
  const frames = totalFrames % 24;
  const totalSec = Math.floor(totalFrames / 24);
  const sec = totalSec % 60;
  const min = Math.floor(totalSec / 60) % 60;
  return `01:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}:${String(frames).padStart(2, '0')}`;
}

export default function HeroCinemaSlider({
  isActiveTab,
  modulesCount,
  syncRoomId,
  whatsappHubUrl,
  onNavigateTab,
  onJumpToSection,
  onOpenCommandPalette,
  onOpenSyncModal,
  onSetCursorLabel,
}: HeroCinemaSliderProps) {
  // HANDFILM is ALWAYS Slide #1 (index 0) by default
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [timecode, setTimecode] = useState<string>('01:00:00:00');
  const [hoveredAppNode, setHoveredAppNode] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const pointerStartXRef = useRef<number | null>(null);
  const pointerStartYRef = useRef<number | null>(null);
  const wheelLockRef = useRef<boolean>(false);
  const elapsedRef = useRef<number>(0);

  const activeSlide = HERO_SLIDES[activeIndex] ?? HERO_SLIDES[0];

  const goToSlide = useCallback((nextIdx: number) => {
    const total = HERO_SLIDES.length;
    const wrapped = ((nextIdx % total) + total) % total;
    setActiveIndex(wrapped);
    setProgress(0);
    trackEvent('HERO_CINEMA_SLIDE_CHANGE', { slideId: HERO_SLIDES[wrapped].id, index: wrapped });
  }, []);

  const nextSlide = useCallback(() => {
    goToSlide(activeIndex + 1);
  }, [activeIndex, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(activeIndex - 1);
  }, [activeIndex, goToSlide]);

  // Auto-advance timer with hover-pause & manual pause
  useEffect(() => {
    if (!isActiveTab || isPaused || isHovered) return;

    let rafId = 0;
    let lastTs = performance.now();

    const step = (now: number) => {
      const dt = now - lastTs;
      lastTs = now;
      setProgress((prev) => {
        const next = prev + (dt / SLIDE_DURATION_MS) * 100;
        if (next >= 100) {
          setActiveIndex((idx) => (idx + 1) % HERO_SLIDES.length);
          return 0;
        }
        return next;
      });
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [isActiveTab, isPaused, isHovered]);

  // Keyboard navigation (← / →) when Home tab is active
  useEffect(() => {
    if (!isActiveTab) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActiveTab, nextSlide, prevSlide]);

  // Horizontal trackpad/wheel swipe navigation (never hijacks vertical page scroll)
  const handleWheel = (e: React.WheelEvent<HTMLElement>) => {
    if (wheelLockRef.current) return;
    if (Math.abs(e.deltaX) > 28 && Math.abs(e.deltaX) > Math.abs(e.deltaY) * 1.4) {
      wheelLockRef.current = true;
      if (e.deltaX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      window.setTimeout(() => {
        wheelLockRef.current = false;
      }, 480);
    }
  };

  // Mouse drag & touch swipe support
  const handlePointerDown = (e: React.PointerEvent<HTMLElement>) => {
    const target = e.target as HTMLElement | null;
    if (target?.closest('a, button')) return;
    pointerStartXRef.current = e.clientX;
    pointerStartYRef.current = e.clientY;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLElement>) => {
    if (pointerStartXRef.current === null || pointerStartYRef.current === null) return;
    const dx = pointerStartXRef.current - e.clientX;
    const dy = pointerStartYRef.current - e.clientY;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    pointerStartXRef.current = null;
    pointerStartYRef.current = null;
  };

  // 60FPS Context-Directed HTML5 Cinema Canvas Engine for all 5 Slides
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isActiveTab) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let rafId = 0;
    let width = 0;
    let height = 0;
    let frameCounter = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(320, Math.floor(rect.width));
      height = Math.max(240, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const sparks = Array.from({ length: 42 }, (_, i) => ({
      x: (i * 0.0238) % 1,
      y: 0.25 + ((i * 0.173) % 0.55),
      vx: 0.002 + (i % 5) * 0.0012,
      vy: -0.001 - (i % 4) * 0.0008,
      size: 1 + (i % 3) * 0.85,
      phase: i * 0.41,
    }));

    const drawFrame = (ts: number) => {
      const t = prefersReducedMotion ? 1.5 : ts * 0.001;
      elapsedRef.current = t;
      frameCounter += 1;

      if (frameCounter % 4 === 0 && !prefersReducedMotion) {
        setTimecode(formatTimecode(t));
      }

      ctx.clearRect(0, 0, width, height);
      const slideId = HERO_SLIDES[activeIndex]?.id ?? 'handfilm';

      // Speed-ramp velocity curve (120fps slow-mo dip -> crisp whip surge)
      const speedRamp = 0.45 + 0.55 * Math.pow(0.5 + 0.5 * Math.sin(t * 1.15), 2.2);

      if (slideId === 'handfilm') {
        // SLIDE 1: BTS Camera Rig Movement + Volumetric Key Lights + Anamorphic Flares
        const rigX = width * (0.64 + Math.sin(t * 0.65) * 0.09);
        const rigY = height * (0.44 + Math.cos(t * 0.48) * 0.05);

        // Volumetric key light cone sweeping across studio haze
        const beamAngle = -0.35 + Math.sin(t * 0.42) * 0.18;
        ctx.save();
        ctx.translate(width * 0.86, height * 0.06);
        ctx.rotate(beamAngle);
        const coneGrad = ctx.createLinearGradient(0, 0, -width * 0.72, height * 0.85);
        coneGrad.addColorStop(0, 'rgba(245, 158, 11, 0.30)');
        coneGrad.addColorStop(0.45, 'rgba(225, 29, 72, 0.14)');
        coneGrad.addColorStop(1, 'rgba(9, 9, 11, 0)');
        ctx.fillStyle = coneGrad;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-width * 0.78, height * 0.62);
        ctx.lineTo(-width * 0.46, height * 1.05);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Anamorphic horizontal crimson/amber lens streak
        const flareY = rigY - height * 0.04;
        const flareGrad = ctx.createLinearGradient(0, flareY, width, flareY);
        flareGrad.addColorStop(0, 'rgba(225, 29, 72, 0)');
        flareGrad.addColorStop(0.35, 'rgba(225, 29, 72, 0.24)');
        flareGrad.addColorStop(0.62, 'rgba(245, 158, 11, 0.48)');
        flareGrad.addColorStop(0.78, 'rgba(225, 29, 72, 0.18)');
        flareGrad.addColorStop(1, 'rgba(225, 29, 72, 0)');
        ctx.fillStyle = flareGrad;
        ctx.fillRect(0, flareY - 1.5, width, 3);

        // Cinema camera rig matte-box + dolly track blueprint overlay on right viewport
        ctx.save();
        ctx.strokeStyle = 'rgba(244, 244, 245, 0.24)';
        ctx.lineWidth = 1.25;
        // Dolly rail perspective lines
        ctx.beginPath();
        ctx.moveTo(width * 0.48, height * 0.86);
        ctx.lineTo(width * 0.96, height * 0.62);
        ctx.moveTo(width * 0.56, height * 0.94);
        ctx.lineTo(width * 1.0, height * 0.70);
        ctx.stroke();

        // Moving cinema lens ring + anamorphic aperture
        const lensR = Math.min(width, height) * 0.13;
        ctx.beginPath();
        ctx.arc(rigX, rigY, lensR, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(rigX, rigY, lensR * 0.74, t * 0.7, t * 0.7 + Math.PI * 1.35);
        ctx.strokeStyle = 'rgba(225, 29, 72, 0.78)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Crosshair focus reticle
        ctx.strokeStyle = 'rgba(244, 244, 245, 0.45)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(rigX - 18, rigY);
        ctx.lineTo(rigX + 18, rigY);
        ctx.moveTo(rigX, rigY - 18);
        ctx.lineTo(rigX, rigY + 18);
        ctx.stroke();
        ctx.restore();

        // 2.39:1 Anamorphic film gate brackets
        const m = 22;
        ctx.strokeStyle = 'rgba(244, 244, 245, 0.22)';
        ctx.lineWidth = 1.2;
        const corner = 20;
        const corners = [
          [m, m, 1, 1],
          [width - m, m, -1, 1],
          [m, height - m, 1, -1],
          [width - m, height - m, -1, -1],
        ];
        corners.forEach(([cx, cy, dx, dy]) => {
          ctx.beginPath();
          ctx.moveTo(cx, cy + dy * corner);
          ctx.lineTo(cx, cy);
          ctx.lineTo(cx + dx * corner, cy);
          ctx.stroke();
        });
      } else if (slideId === 'rawx') {
        // SLIDE 2: Ultra-Macro Whip-Pan Leather Stitching + Brushed 316L Specular Sweep + Molten Sparks
        const sweepX = ((t * 0.34 * speedRamp) % 1.4 - 0.2) * width;
        const steelGrad = ctx.createLinearGradient(sweepX - 140, 0, sweepX + 140, height);
        steelGrad.addColorStop(0, 'rgba(245, 158, 11, 0)');
        steelGrad.addColorStop(0.5, 'rgba(255, 224, 150, 0.24)');
        steelGrad.addColorStop(1, 'rgba(225, 29, 72, 0)');
        ctx.fillStyle = steelGrad;
        ctx.fillRect(0, 0, width, height);

        // Diagonal saddle-stitch macro rhythm track
        ctx.save();
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.42)';
        ctx.lineWidth = 2;
        const stitchOffset = (t * 44 * speedRamp) % 28;
        for (let i = -2; i < 24; i++) {
          const sx = width * 0.46 + i * 24 - stitchOffset;
          const sy = height * 0.72 - i * 11 + stitchOffset * 0.45;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx + 13, sy - 5);
          ctx.stroke();
        }
        ctx.restore();

        // Molten edge-burnishing sparks
        sparks.forEach((sp) => {
          const px = ((sp.x + t * sp.vx * (1.2 + speedRamp * 2.5)) % 1) * width;
          const py = ((sp.y + Math.sin(t * 2 + sp.phase) * 0.08 + 1) % 1) * height;
          const alpha = 0.25 + 0.65 * Math.abs(Math.sin(t * 3.2 + sp.phase));
          ctx.fillStyle = sp.phase % 2 > 1 ? `rgba(245, 158, 11, ${alpha})` : `rgba(225, 29, 72, ${alpha})`;
          ctx.beginPath();
          ctx.arc(px, py, sp.size, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (slideId === 'arutemika') {
        // SLIDE 3: Chiaroscuro Rim-Lit Editorial Portrait & Sculptural Silk/Leather Drape Physics
        const rimX = width * (0.72 + Math.sin(t * 0.45) * 0.05);
        const rimY = height * 0.44;
        const rimGrad = ctx.createRadialGradient(rimX, rimY, 12, rimX, rimY, Math.max(width, height) * 0.48);
        rimGrad.addColorStop(0, 'rgba(245, 158, 11, 0.34)');
        rimGrad.addColorStop(0.42, 'rgba(225, 29, 72, 0.14)');
        rimGrad.addColorStop(1, 'rgba(9, 9, 11, 0)');
        ctx.fillStyle = rimGrad;
        ctx.fillRect(0, 0, width, height);

        // Flowing sculptural silk & hip-line contour ribbons
        ctx.save();
        for (let layer = 0; layer < 5; layer++) {
          ctx.beginPath();
          const baseX = width * (0.58 + layer * 0.065);
          for (let y = 0; y <= height; y += 16) {
            const normY = y / height;
            const curve =
              Math.sin(normY * 4.2 - t * (0.9 + layer * 0.12)) * (26 + layer * 6) +
              Math.cos(normY * 2.4 + t * 0.5) * 18;
            const x = baseX + curve;
            if (y === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.strokeStyle =
            layer % 2 === 0
              ? `rgba(245, 158, 11, ${0.14 + layer * 0.04})`
              : `rgba(244, 244, 245, ${0.09 + layer * 0.025})`;
          ctx.lineWidth = 1.4;
          ctx.stroke();
        }
        ctx.restore();
      } else if (slideId === 'b2b') {
        // SLIDE 4: High-Speed Architectural Warp/Weft Loom & 7-Vertical Laser Telemetry Grid
        const gridStep = 44;
        const shift = (t * 36 * speedRamp) % gridStep;
        ctx.save();
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.14)';
        ctx.lineWidth = 1;
        for (let x = -gridStep + shift; x < width + gridStep; x += gridStep) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += gridStep) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Laser stitch scan bar sweeping horizontally
        const scanX = ((t * 0.28) % 1) * width;
        const scanGrad = ctx.createLinearGradient(scanX - 90, 0, scanX + 12, 0);
        scanGrad.addColorStop(0, 'rgba(225, 29, 72, 0)');
        scanGrad.addColorStop(0.92, 'rgba(225, 29, 72, 0.34)');
        scanGrad.addColorStop(1, 'rgba(245, 158, 11, 0.85)');
        ctx.fillStyle = scanGrad;
        ctx.fillRect(scanX - 90, 0, 102, height);
        ctx.restore();
      } else {
        // SLIDE 5: 24 Ecosystem Apps Interactive Node Graph (GapCut, GapShot, BumBit, GapToon, Hiya, PicSeed, Deeper)
        ctx.save();
        const nodes = AI_WORKFLOW_NODES.map((n) => ({
          ...n,
          px: width * (0.42 + n.x * 0.54),
          py: height * (0.12 + n.y * 0.74),
        }));

        // Connect adjacent nodes with pulsing signal lines
        for (let i = 0; i < nodes.length; i++) {
          const a = nodes[i];
          const b = nodes[(i + 1) % nodes.length];
          const c = nodes[(i + 3) % nodes.length];
          [b, c].forEach((targetNode, edgeIdx) => {
            ctx.beginPath();
            ctx.moveTo(a.px, a.py);
            ctx.lineTo(targetNode.px, targetNode.py);
            ctx.strokeStyle =
              i === hoveredAppNode
                ? 'rgba(245, 158, 11, 0.55)'
                : 'rgba(244, 244, 245, 0.14)';
            ctx.lineWidth = i === hoveredAppNode ? 1.8 : 1;
            ctx.stroke();

            // Traveling signal packet
            const p = (t * (0.42 + edgeIdx * 0.18) + i * 0.19) % 1;
            const sx = a.px + (targetNode.px - a.px) * p;
            const sy = a.py + (targetNode.py - a.py) * p;
            ctx.fillStyle = a.color;
            ctx.beginPath();
            ctx.arc(sx, sy, 2.4, 0, Math.PI * 2);
            ctx.fill();
          });
        }

        // Render glowing rings around each AI app node
        nodes.forEach((n, idx) => {
          const isFocus = idx === hoveredAppNode;
          const pulse = isFocus ? 14 + Math.sin(t * 4) * 3 : 8;
          ctx.beginPath();
          ctx.arc(n.px, n.py, pulse, 0, Math.PI * 2);
          ctx.strokeStyle = isFocus ? n.color : 'rgba(244, 244, 245, 0.28)';
          ctx.lineWidth = isFocus ? 2 : 1;
          ctx.stroke();

          ctx.fillStyle = n.color;
          ctx.beginPath();
          ctx.arc(n.px, n.py, isFocus ? 4.5 : 3, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
      }

      if (!prefersReducedMotion) {
        rafId = requestAnimationFrame(drawFrame);
      }
    };

    rafId = requestAnimationFrame(drawFrame);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, [activeIndex, isActiveTab, hoveredAppNode]);

  return (
    <section
      ref={containerRef}
      aria-label="HANDS & HEAD Flagship Hero Cinema Deck"
      onMouseEnter={() => {
        setIsHovered(true);
        onSetCursorLabel('DRAG OR CLICK SLIDES ↔');
      }}
      onMouseLeave={() => setIsHovered(false)}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-white/15 bg-[#09090b] text-[#f4f4f5] shadow-2xl select-none touch-pan-y"
      style={{
        minHeight: 'clamp(500px, 68vh, 720px)',
      }}
    >
      {/* Crossfading Full-Bleed Photographic Cinema Backdrops */}
      {HERO_SLIDES.map((slide, idx) => {
        const isCurrent = idx === activeIndex;
        return (
          <div
            key={slide.id}
            aria-hidden={!isCurrent}
            className="absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              opacity: isCurrent ? 1 : 0,
              transform: isCurrent ? 'scale(1.02)' : 'scale(1.08)',
              pointerEvents: 'none',
            }}
          >
            <img
              src={slide.backdropUrl}
              alt={slide.backdropAlt}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center opacity-70"
            />
          </div>
        );
      })}

      {/* Measured High-Contrast Cinema Scrim */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(95deg, rgba(9,9,11,0.94) 0%, rgba(9,9,11,0.78) 44%, rgba(9,9,11,0.42) 76%, rgba(9,9,11,0.68) 100%), linear-gradient(180deg, rgba(9,9,11,0.58) 0%, rgba(9,9,11,0.12) 45%, rgba(9,9,11,0.92) 100%)',
        }}
      />

      {/* 60FPS Live Procedural Anamorphic Cinema Canvas Layer */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 w-full h-full z-10"
      />

      {/* Subtle Cinema Scanline Texture */}
      <div aria-hidden="true" className="rx-scanlines opacity-25 z-10" />

      {/* FOREGROUND 12-COLUMN FULL-BLEED CINEMA HUD & CONTENT */}
      <div className="relative z-20 flex flex-col justify-between h-full min-h-[500px] sm:min-h-[580px] lg:min-h-[640px] p-5 sm:p-8 lg:p-10 xl:p-12">
        {/* TOP TELEMETRY STRIP */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/12 pb-3.5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-space-mono text-[11px] sm:text-xs tracking-[0.14em] uppercase">
            <span className="font-bold text-[#e11d48]">{activeSlide.fpsLabel}</span>
            <span aria-hidden="true" className="text-white/25">
              /
            </span>
            <span className="text-zinc-200/90 truncate max-w-[78vw] sm:max-w-none">
              {activeSlide.telemetry}
            </span>
          </div>

          <div className="flex items-center gap-3 font-space-mono text-[11px] tabular-nums text-zinc-300">
            <span className="hidden sm:inline text-[#f59e0b] font-bold">{timecode}</span>
            <span className="hidden md:inline text-white/30">·</span>
            <span className="hidden md:inline text-zinc-300">{activeSlide.domainLabel}</span>
            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              aria-label={isPaused ? 'Resume cinema reel' : 'Pause cinema reel'}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              <span className="text-[10px] font-bold">{isPaused ? 'PLAY' : 'PAUSE'}</span>
            </button>
          </div>
        </div>

        {/* MAIN 12-COLUMN SPLIT: LEFT EDITORIAL COPY & CTAS / RIGHT CONTEXT STAGE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-end my-auto py-6 sm:py-8">
          <div className="lg:col-span-7 xl:col-span-7 space-y-4 sm:space-y-5">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-space-mono text-xs sm:text-[13px] tracking-[0.18em] uppercase text-[#f59e0b] font-bold">
              <span>{activeSlide.kicker}</span>
              <span aria-hidden="true" className="text-white/30">
                ·
              </span>
              <span className="text-zinc-300 tabular-nums">{modulesCount} ACTIVE PORTALS</span>
            </div>

            <h1
              className="font-bebas uppercase tracking-[0.03em] leading-[0.9] text-white"
              style={{
                fontSize: 'clamp(3.15rem, 6.8vw, 6.25rem)',
                textWrap: 'balance',
              }}
            >
              {activeSlide.title}
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-zinc-200 max-w-2xl leading-relaxed font-medium">
              {activeSlide.subtitle}
            </p>

            {/* Slide-Specific Direct CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2 font-space-mono text-xs sm:text-[13px] tracking-wider uppercase">
              {activeSlide.id === 'handfilm' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      trackEvent('HERO_CTA_CLICK', { slide: 'handfilm', action: 'enter_handfilm_os' });
                      onNavigateTab('handfilm');
                    }}
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#e11d48] hover:bg-[#f43f5e] text-white font-bold transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-[#e11d48]/30 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Film className="w-4 h-4" />
                    <span>ENTER HANDFILM OS →</span>
                  </button>
                  <a
                    href="https://storyboard.handsandhead.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('HERO_CTA_CLICK', { slide: 'handfilm', action: 'launch_storyboard' })}
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap shrink-0"
                  >
                    <span>LAUNCH STORYBOARD</span>
                    <ArrowUpRight className="w-4 h-4 text-[#f59e0b]" />
                  </a>
                  <a
                    href={
                      whatsappHubUrl && whatsappHubUrl.includes('8801974518600')
                        ? buildOfficialWhatsAppUrl('gapcut', 'HANDFILM & GapCut Studio Inquiry via https://handsandhead.com')
                        : buildOfficialWhatsAppUrl('gapcut')
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('HERO_CTA_CLICK', { slide: 'handfilm', action: 'whatsapp_hub' })}
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-black/50 hover:bg-black/75 border border-white/15 text-zinc-100 font-bold transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap shrink-0"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>WHATSAPP HUB</span>
                  </a>
                </>
              )}

              {activeSlide.id === 'rawx' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      trackEvent('HERO_CTA_CLICK', { slide: 'rawx', action: 'open_rawx_lab' });
                      onNavigateTab('rawx-showcase');
                    }}
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#f59e0b] hover:bg-[#fbbf24] text-[#09090b] font-bold transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-[#f59e0b]/25 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Sliders className="w-4 h-4" />
                    <span>OPEN RAWx LAB →</span>
                  </button>
                  <a
                    href="https://rawx.handsandhead.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap shrink-0"
                  >
                    <span>RAWx.HANDSANDHEAD.COM</span>
                    <ArrowUpRight className="w-4 h-4 text-[#f59e0b]" />
                  </a>
                  <a
                    href={buildOfficialWhatsAppUrl('rawx', 'RAWx Hide & 316L Steel Drop Inquiry via https://handsandhead.com')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-black/50 hover:bg-black/75 border border-white/15 text-zinc-100 font-bold transition-all duration-200 whitespace-nowrap shrink-0"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>WHATSAPP HUB</span>
                  </a>
                </>
              )}

              {activeSlide.id === 'arutemika' && (
                <>
                  <a
                    href="https://arutemika.handsandhead.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('HERO_CTA_CLICK', { slide: 'arutemika', action: 'enter_arutemika' })}
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#f59e0b] hover:bg-[#fbbf24] text-[#09090b] font-bold transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap shrink-0"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>ENTER ARUTEMIKA</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                  <a
                    href="https://d2c.handsandhead.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold transition-all duration-200 whitespace-nowrap shrink-0"
                  >
                    <span>D2C SHOP VAULT</span>
                    <ArrowUpRight className="w-4 h-4 text-[#e11d48]" />
                  </a>
                  <button
                    type="button"
                    onClick={() => onJumpToSection('arutemika')}
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-black/50 hover:bg-black/75 border border-white/15 text-zinc-100 font-bold transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span>INSPECT PORTAL →</span>
                  </button>
                </>
              )}

              {activeSlide.id === 'b2b' && (
                <>
                  <a
                    href="https://b2b.handsandhead.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('HERO_CTA_CLICK', { slide: 'b2b', action: 'open_b2b' })}
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#e11d48] hover:bg-[#f43f5e] text-white font-bold transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap shrink-0"
                  >
                    <Factory className="w-4 h-4" />
                    <span>LAUNCH B2B WINGS</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => onJumpToSection('rmg')}
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span>EXPLORE 7 VERTICALS</span>
                    <ArrowRight className="w-4 h-4 text-[#f59e0b]" />
                  </button>
                  <a
                    href={buildOfficialWhatsAppUrl('b2b', 'B2B Export & 7-Vertical Manufacturing RFQ via https://handsandhead.com')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-black/50 hover:bg-black/75 border border-white/15 text-zinc-100 font-bold transition-all duration-200 whitespace-nowrap shrink-0"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>B2B RFQ DESK</span>
                  </a>
                </>
              )}

              {activeSlide.id === 'ecosystem' && (
                <>
                  <button
                    type="button"
                    onClick={() => onNavigateTab('ecosystem')}
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#e11d48] hover:bg-[#f43f5e] text-white font-bold transition-all duration-200 hover:-translate-y-0.5 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Layers className="w-4 h-4" />
                    <span>EXPLORE 24 PORTALS →</span>
                  </button>
                  <button
                    type="button"
                    onClick={onOpenCommandPalette}
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Terminal className="w-4 h-4 text-[#f59e0b]" />
                    <span>⌘K QUICK JUMP</span>
                  </button>
                  <button
                    type="button"
                    onClick={onOpenSyncModal}
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-black/50 hover:bg-black/75 border border-white/15 text-zinc-100 font-bold transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span>SYNC · {syncRoomId}</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* RIGHT CONTEXT INTERACTIVE PANEL (ADAPTS PER SLIDE — ZERO EMPTY SPACE) */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-end">
            {activeSlide.id === 'b2b' ? (
              <div className="rounded-2xl border border-white/15 bg-black/60 backdrop-blur-xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between font-space-mono text-[11px] uppercase tracking-wider text-zinc-300 border-b border-white/10 pb-2">
                  <span className="text-[#f59e0b] font-bold">7 EXPORT VERTICALS</span>
                  <span>DHAKA DIRECT</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2">
                  {B2B_VERTICALS.map((vert) => (
                    <button
                      key={vert.id}
                      type="button"
                      onClick={() => onJumpToSection(vert.id)}
                      className="flex items-center justify-between gap-1.5 px-3 py-2.5 rounded-xl border border-white/12 bg-white/5 hover:bg-[#f59e0b]/20 hover:border-[#f59e0b]/60 text-left font-space-mono text-[11px] font-bold text-white transition-all cursor-pointer"
                    >
                      <span className="truncate">{vert.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#f59e0b] shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            ) : activeSlide.id === 'ecosystem' ? (
              <div className="rounded-2xl border border-white/15 bg-black/60 backdrop-blur-xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between font-space-mono text-[11px] uppercase tracking-wider text-zinc-300 border-b border-white/10 pb-2">
                  <span className="text-[#e11d48] font-bold">AI WORKFLOW NODES</span>
                  <span>LIVE GRAPH</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2">
                  {AI_WORKFLOW_NODES.map((node, idx) => (
                    <button
                      key={`${node.label}-${idx}`}
                      type="button"
                      onMouseEnter={() => setHoveredAppNode(idx)}
                      onFocus={() => setHoveredAppNode(idx)}
                      onClick={() => onJumpToSection(node.id)}
                      className={`px-3 py-2 rounded-xl border text-left transition-all cursor-pointer ${
                        hoveredAppNode === idx
                          ? 'bg-white/15 border-[#f59e0b] text-white'
                          : 'bg-white/5 border-white/10 text-zinc-200 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-xs font-extrabold tracking-tight">{node.label}</div>
                      <div className="font-space-mono text-[10px] text-zinc-400 truncate">{node.sub}</div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/15 bg-black/55 backdrop-blur-xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between font-space-mono text-[11px] uppercase tracking-wider border-b border-white/10 pb-2">
                  <span className="text-[#f59e0b] font-bold">DIRECT ECOSYSTEM ROUTING</span>
                  <span className="text-zinc-400 tabular-nums">HANDSANDHEAD.COM</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    {
                      title: 'HANDFILM',
                      url: 'storyboard.handsandhead.com',
                      href: 'https://storyboard.handsandhead.com/',
                      accent: '#e11d48',
                    },
                    {
                      title: 'RAWx LAB',
                      url: 'rawx.handsandhead.com',
                      href: 'https://rawx.handsandhead.com/',
                      accent: '#f59e0b',
                    },
                    {
                      title: 'ARUTEMIKA',
                      url: 'arutemika.handsandhead.com',
                      href: 'https://arutemika.handsandhead.com/',
                      accent: '#f59e0b',
                    },
                    {
                      title: 'B2B WINGS',
                      url: 'b2b.handsandhead.com',
                      href: 'https://b2b.handsandhead.com/',
                      accent: '#e11d48',
                    },
                  ].map((item) => (
                    <a
                      key={item.url}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/12 hover:border-white/25 transition-all"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-extrabold text-white tracking-tight">{item.title}</div>
                        <div className="font-space-mono text-[10px] text-zinc-400 truncate">{item.url}</div>
                      </div>
                      <ArrowUpRight
                        className="w-3.5 h-3.5 shrink-0 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                        style={{ color: item.accent }}
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM SLIDER CONTROLS: CLICKABLE 01-05 PROGRESS BARS + PREV/NEXT ARROWS */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-3 border-t border-white/12">
          <div
            role="tablist"
            aria-label="Hero Cinema Slides"
            className="grid grid-cols-5 gap-2 sm:gap-3 flex-1"
          >
            {HERO_SLIDES.map((slide, idx) => {
              const isCurrent = idx === activeIndex;
              const isPast = idx < activeIndex;
              const fillWidth = isCurrent ? `${Math.min(100, progress)}%` : isPast ? '100%' : '0%';

              return (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={isCurrent}
                  onClick={() => goToSlide(idx)}
                  className="group/bar text-left py-1.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f59e0b] rounded-md"
                >
                  <div className="flex items-center justify-between gap-1 font-space-mono text-[10px] sm:text-[11px] uppercase mb-1.5">
                    <span
                      className={`font-bold tabular-nums transition-colors ${
                        isCurrent ? 'text-[#f59e0b]' : 'text-zinc-400 group-hover/bar:text-white'
                      }`}
                    >
                      {slide.indexLabel}
                    </span>
                    <span
                      className={`hidden md:inline truncate transition-colors ${
                        isCurrent ? 'text-white font-bold' : 'text-zinc-400 group-hover/bar:text-zinc-200'
                      }`}
                    >
                      {slide.id === 'handfilm'
                        ? 'HANDFILM'
                        : slide.id === 'rawx'
                        ? 'RAWx'
                        : slide.id === 'arutemika'
                        ? 'ARUTEMIKA'
                        : slide.id === 'b2b'
                        ? 'B2B 7W'
                        : '24 APPS'}
                    </span>
                  </div>
                  <div className="h-[3px] w-full rounded-full bg-white/15 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-[width] duration-100 ease-linear"
                      style={{
                        width: fillWidth,
                        backgroundColor: isCurrent ? slide.accentHex : 'rgba(245, 158, 11, 0.75)',
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
            <span className="font-space-mono text-[10px] text-zinc-400 sm:hidden">
              SWIPE OR TAP 01–05
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous Hero Slide"
                className="w-10 h-10 rounded-xl border border-white/15 bg-black/50 hover:bg-white/15 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next Hero Slide"
                className="w-10 h-10 rounded-xl border border-white/15 bg-black/50 hover:bg-white/15 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
// END OF FILE: src/components/HeroCinemaSlider.tsx
