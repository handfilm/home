import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { SectionItem } from '../types';
import { TranslationDictionary } from '../i18n/translations';
import {
  CinemaRenderMode,
  HydratedKeyframeDirective,
  getPortalCinemaPreset,
  loadCachedKeyframes,
  hydratePortalKeyframe,
} from '../services/cinemaKeyframeService';

export interface DynamicPortalCardProps {
  categoryKey: string;
  categoryLabel: string;
  groupSections: SectionItem[];
  t: TranslationDictionary;
  geminiAvailable: boolean;
  onJumpToSection: (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => void;
  onSetCursorLabel: (label: string) => void;
}

function drawPortalCinemaCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  t: number,
  mode: CinemaRenderMode,
  primaryHex: string,
  secondaryHex: string
): void {
  ctx.clearRect(0, 0, width, height);

  // Dynamic speed-ramp wave (slow-motion luxury poise -> crisp kinetic ramp)
  const ramp = 0.4 + 0.6 * Math.pow(0.5 + 0.5 * Math.sin(t * 1.4), 2);

  if (mode === 'bts-rig') {
    // Behind-The-Scenes anamorphic camera rig sweep + studio haze cones + lens flares
    const beamX = width * (0.76 + Math.sin(t * 0.7) * 0.12);
    const beamGrad = ctx.createRadialGradient(beamX, height * 0.14, 4, beamX, height * 0.4, width * 0.78);
    beamGrad.addColorStop(0, `${secondaryHex}55`);
    beamGrad.addColorStop(0.45, `${primaryHex}24`);
    beamGrad.addColorStop(1, 'rgba(9,9,11,0)');
    ctx.fillStyle = beamGrad;
    ctx.fillRect(0, 0, width, height);

    // Anamorphic flare streak
    const flareY = height * (0.48 + Math.sin(t * 0.9) * 0.08);
    const flare = ctx.createLinearGradient(0, flareY, width, flareY);
    flare.addColorStop(0, 'rgba(225,29,72,0)');
    flare.addColorStop(0.42, `${primaryHex}55`);
    flare.addColorStop(0.58, `${secondaryHex}88`);
    flare.addColorStop(1, 'rgba(245,158,11,0)');
    ctx.fillStyle = flare;
    ctx.fillRect(0, flareY - 1.5, width, 3);

    // Gimbal camera lens ring
    const cx = width * (0.55 + Math.cos(t * 0.6) * 0.12);
    const cy = height * 0.5;
    const r = Math.min(width, height) * 0.24;
    ctx.strokeStyle = 'rgba(244,244,245,0.32)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = primaryHex;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.72, t * 0.9, t * 0.9 + Math.PI * 1.15);
    ctx.stroke();
  } else if (mode === 'aural-scope') {
    // Live Dual-Channel Audio Waveform Oscilloscope
    const midY = height * 0.52;
    for (let ch = 0; ch < 2; ch++) {
      ctx.beginPath();
      for (let x = 0; x <= width; x += 4) {
        const nx = x / width;
        const env = Math.sin(nx * Math.PI);
        const wave =
          Math.sin(nx * 18 + t * (4.2 + ch * 1.4)) * 22 * env +
          Math.sin(nx * 36 - t * 6.5) * 9 * env;
        const y = midY + wave * (ch === 0 ? 1 : 0.65);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = ch === 0 ? primaryHex : `${secondaryHex}aa`;
      ctx.lineWidth = ch === 0 ? 2 : 1.2;
      ctx.stroke();
    }

    // Frequency meter ticks
    const bars = 24;
    const barW = width / bars;
    for (let i = 0; i < bars; i++) {
      const h = (10 + Math.abs(Math.sin(t * 3.1 + i * 0.55)) * (height * 0.24)) * (0.4 + 0.6 * Math.sin((i / bars) * Math.PI));
      ctx.fillStyle = i % 3 === 0 ? `${primaryHex}55` : `${secondaryHex}35`;
      ctx.fillRect(i * barW + 3, height - h - 10, Math.max(2, barW - 6), h);
    }
  } else if (mode === 'editorial-desk') {
    // Contact-sheet grid & optical scanline sweep
    ctx.strokeStyle = 'rgba(244,244,245,0.12)';
    ctx.lineWidth = 1;
    const cols = 4;
    const cellW = width / cols;
    for (let i = 1; i < cols; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellW, 12);
      ctx.lineTo(i * cellW, height - 12);
      ctx.stroke();
    }
    const scanY = ((t * 32) % height);
    const scanGrad = ctx.createLinearGradient(0, scanY - 24, 0, scanY + 4);
    scanGrad.addColorStop(0, 'rgba(245,158,11,0)');
    scanGrad.addColorStop(1, `${secondaryHex}66`);
    ctx.fillStyle = scanGrad;
    ctx.fillRect(0, scanY - 24, width, 28);
  } else if (mode === 'high-fashion' || mode === 'garment-editorial') {
    // Dramatic chiaroscuro rim-lit studio portrait & sculptural curve/hip-line fashion contours
    const rimX = width * (0.68 + Math.sin(t * 0.55) * 0.08);
    const rimGrad = ctx.createRadialGradient(rimX, height * 0.42, 8, rimX, height * 0.46, width * 0.65);
    rimGrad.addColorStop(0, `${primaryHex}48`);
    rimGrad.addColorStop(0.55, `${secondaryHex}18`);
    rimGrad.addColorStop(1, 'rgba(9,9,11,0)');
    ctx.fillStyle = rimGrad;
    ctx.fillRect(0, 0, width, height);

    // Sculptural flowing couture & silhouette drape ribbons
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      const baseX = width * (0.28 + i * 0.14);
      for (let y = 0; y <= height; y += 8) {
        const ny = y / height;
        const contour =
          Math.sin(ny * 4.4 - t * (0.85 + i * 0.12)) * (16 + i * 3) +
          Math.cos(ny * 2.2 + t * 0.4) * 10;
        const x = baseX + contour;
        if (y === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = i % 2 === 0 ? `${primaryHex}66` : 'rgba(244,244,245,0.20)';
      ctx.lineWidth = i === 2 ? 1.8 : 1.1;
      ctx.stroke();
    }
  } else if (mode === 'vault-drop') {
    // Pedestal rim spotlight sweeping across D2C drop vault
    const sx = ((t * 0.25) % 1.4 - 0.2) * width;
    const g = ctx.createLinearGradient(sx - 80, 0, sx + 80, height);
    g.addColorStop(0, 'rgba(225,29,72,0)');
    g.addColorStop(0.5, `${secondaryHex}38`);
    g.addColorStop(1, 'rgba(225,29,72,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = `${primaryHex}55`;
    ctx.lineWidth = 1.2;
    ctx.strokeRect(18, 18, width - 36, height - 36);
  } else if (mode === 'botanical-beauty') {
    // Warm golden-hour rim light & translucent drifting petals/bokeh
    const sunGrad = ctx.createRadialGradient(width * 0.8, height * 0.22, 6, width * 0.72, height * 0.35, width * 0.72);
    sunGrad.addColorStop(0, 'rgba(245,158,11,0.42)');
    sunGrad.addColorStop(0.55, 'rgba(16,185,129,0.14)');
    sunGrad.addColorStop(1, 'rgba(9,9,11,0)');
    ctx.fillStyle = sunGrad;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < 16; i++) {
      const px = ((i * 0.071 + t * (0.04 + (i % 3) * 0.015)) % 1) * width;
      const py = ((i * 0.13 + Math.sin(t + i) * 0.08 + 1) % 1) * height;
      const r = 4 + (i % 4) * 3.5;
      ctx.fillStyle = i % 2 === 0 ? 'rgba(245,158,11,0.22)' : 'rgba(244,244,245,0.14)';
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (mode === 'athletic-ramp') {
    // High-contrast kinetic speed-ramp shutter arcs
    const speed = 1.2 + ramp * 2.4;
    for (let i = 0; i < 8; i++) {
      const y = height * (0.16 + i * 0.1);
      const streakX = ((t * 140 * speed + i * 67) % (width + 180)) - 180;
      const streakGrad = ctx.createLinearGradient(streakX, y, streakX + 150, y);
      streakGrad.addColorStop(0, 'rgba(225,29,72,0)');
      streakGrad.addColorStop(0.7, `${primaryHex}88`);
      streakGrad.addColorStop(1, `${secondaryHex}cc`);
      ctx.fillStyle = streakGrad;
      ctx.fillRect(streakX, y, 150, i % 2 === 0 ? 2.5 : 1.5);
    }
  } else if (mode === 'steel-leather-macro') {
    // 100mm Macro 316L steel specular sweep + leather stitch track + burnishing sparks
    const sweep = ((t * 0.35 * ramp) % 1.4 - 0.2) * width;
    const metal = ctx.createLinearGradient(sweep - 70, 0, sweep + 70, height);
    metal.addColorStop(0, 'rgba(255,255,255,0)');
    metal.addColorStop(0.5, 'rgba(255,232,180,0.34)');
    metal.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = metal;
    ctx.fillRect(0, 0, width, height);

    // Saddle stitch rhythm
    ctx.strokeStyle = `${primaryHex}aa`;
    ctx.lineWidth = 2;
    const shift = (t * 28 * ramp) % 20;
    for (let i = -1; i < 16; i++) {
      const x = i * 24 - shift;
      const y = height * 0.68 - i * 4;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 11, y - 2);
      ctx.stroke();
    }

    // Molten sparks
    for (let i = 0; i < 18; i++) {
      const sx = ((i * 0.063 + t * 0.14 * ramp) % 1) * width;
      const sy = ((0.3 + i * 0.047 + Math.sin(t * 3 + i) * 0.09) % 1) * height;
      ctx.fillStyle = i % 2 === 0 ? '#f59e0b' : '#e11d48';
      ctx.beginPath();
      ctx.arc(sx, sy, 1.4 + (i % 2), 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (mode === 'fiber-loom-macro') {
    // Warp & Weft interlaced loom threads + drifting golden dust motes
    const step = 18;
    const offset = (t * 24 * ramp) % step;
    ctx.strokeStyle = 'rgba(245,158,11,0.22)';
    ctx.lineWidth = 1;
    for (let x = offset; x < width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(244,244,245,0.14)';
    for (let y = 0; y < height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y + Math.sin(t * 2 + y * 0.08) * 1.5);
      ctx.lineTo(width, y + Math.sin(t * 2 + y * 0.08) * 1.5);
      ctx.stroke();
    }
    for (let i = 0; i < 16; i++) {
      const mx = ((i * 0.09 + t * 0.04) % 1) * width;
      const my = ((i * 0.14 + Math.cos(t * 1.3 + i) * 0.06 + 1) % 1) * height;
      ctx.fillStyle = 'rgba(245,158,11,0.58)';
      ctx.beginPath();
      ctx.arc(mx, my, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (mode === 'culinary-macro') {
    // Sizzling golden specular highlights + rising aromatic steam wisps
    const glow = ctx.createRadialGradient(width * 0.5, height * 0.72, 10, width * 0.5, height * 0.65, width * 0.6);
    glow.addColorStop(0, 'rgba(245,158,11,0.34)');
    glow.addColorStop(0.6, 'rgba(225,29,72,0.10)');
    glow.addColorStop(1, 'rgba(9,9,11,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    // Rising translucent steam curves
    for (let s = 0; s < 5; s++) {
      ctx.beginPath();
      const baseX = width * (0.32 + s * 0.09);
      for (let y = height; y >= 0; y -= 10) {
        const progressY = 1 - y / height;
        const sway = Math.sin(progressY * 6 - t * (1.8 + s * 0.25) + s) * (10 + progressY * 14);
        const x = baseX + sway;
        if (y === height) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(255, 240, 210, ${0.14 + (s % 2) * 0.08})`;
      ctx.lineWidth = 2.2;
      ctx.stroke();
    }

    // Sizzle specular particles
    for (let i = 0; i < 14; i++) {
      const px = width * (0.2 + ((i * 0.055 + Math.sin(t + i) * 0.04 + 1) % 0.6));
      const py = height * (0.85 - ((t * 0.28 + i * 0.11) % 0.65));
      ctx.fillStyle = 'rgba(251,191,36,0.55)';
      ctx.beginPath();
      ctx.arc(px, py, 1.3 + (i % 2) * 0.8, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    // neural-ui: Interactive telemetry nodes, holographic chromatic aperture, neural grid waves
    const pts = [
      [0.18, 0.34],
      [0.42, 0.24],
      [0.68, 0.32],
      [0.84, 0.56],
      [0.54, 0.68],
      [0.24, 0.66],
    ].map(([rx, ry], i) => ({
      x: width * rx + Math.sin(t * 1.1 + i) * 6,
      y: height * ry + Math.cos(t * 0.9 + i) * 5,
    }));

    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      const b = pts[(i + 1) % pts.length];
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = 'rgba(244,244,245,0.18)';
      ctx.lineWidth = 1;
      ctx.stroke();

      const p = (t * 0.55 + i * 0.17) % 1;
      ctx.fillStyle = i % 2 === 0 ? primaryHex : secondaryHex;
      ctx.beginPath();
      ctx.arc(a.x + (b.x - a.x) * p, a.y + (b.y - a.y) * p, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    pts.forEach((pt, idx) => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 6 + Math.sin(t * 2.5 + idx) * 2, 0, Math.PI * 2);
      ctx.strokeStyle = idx % 2 === 0 ? `${primaryHex}88` : `${secondaryHex}88`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    });
  }
}

export default function DynamicPortalCard({
  categoryKey,
  categoryLabel,
  groupSections,
  t,
  geminiAvailable,
  onJumpToSection,
  onSetCursorLabel,
}: DynamicPortalCardProps) {
  const defaultPortalId = groupSections[0]?.id ?? 'studio';
  const [activePortalId, setActivePortalId] = useState<string>(defaultPortalId);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [hydratedMap, setHydratedMap] = useState<Record<string, HydratedKeyframeDirective>>(() =>
    loadCachedKeyframes()
  );
  const [isHydrating, setIsHydrating] = useState<boolean>(false);

  const cardRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeSection = useMemo(
    () => groupSections.find((s) => s.id === activePortalId) ?? groupSections[0],
    [groupSections, activePortalId]
  );

  const basePreset = useMemo(
    () => getPortalCinemaPreset(activeSection?.id ?? defaultPortalId),
    [activeSection?.id, defaultPortalId]
  );

  const activeHydrated = activeSection ? hydratedMap[activeSection.id] : undefined;

  const effectiveHudTag = activeHydrated?.hudTag ?? basePreset.hudTag;
  const effectiveLensSpec = activeHydrated?.lensSpec ?? basePreset.lensSpec;
  const effectiveDirective = activeHydrated?.shotDirective ?? basePreset.shotDirective;
  const effectivePrimaryHex = activeHydrated?.primaryHex ?? basePreset.primaryHex;
  const effectiveSecondaryHex = activeHydrated?.secondaryHex ?? basePreset.secondaryHex;

  // Pause off-screen canvases for peak 60fps mobile & desktop efficiency
  useEffect(() => {
    const el = cardRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Optional silent Gemini AI Keyframe hydration when server/env key is present
  useEffect(() => {
    if (!geminiAvailable || !activeSection || activeHydrated) return;
    let cancelled = false;
    void hydratePortalKeyframe(activeSection.id, categoryLabel, activeSection.title).then((res) => {
      if (!cancelled && res) {
        setHydratedMap((prev) => ({ ...prev, [res.portalId]: res }));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [geminiAvailable, activeSection, activeHydrated, categoryLabel]);

  // 1-Click Manual Gemini AI Keyframe Hydration trigger
  const handleManualHydrate = async () => {
    if (!activeSection || isHydrating) return;
    setIsHydrating(true);
    const res = await hydratePortalKeyframe(activeSection.id, categoryLabel, activeSection.title);
    if (res) {
      setHydratedMap((prev) => ({ ...prev, [res.portalId]: res }));
    }
    setIsHydrating(false);
  };

  // Live 60FPS HTML5 Canvas Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isVisible) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let rafId = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(180, Math.floor(rect.width));
      height = Math.max(140, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const loop = (ts: number) => {
      const elapsed = prefersReducedMotion ? 1.2 : ts * 0.001;
      drawPortalCinemaCanvas(
        ctx,
        width,
        height,
        elapsed,
        basePreset.renderMode,
        effectivePrimaryHex,
        effectiveSecondaryHex
      );
      if (!prefersReducedMotion) {
        rafId = requestAnimationFrame(loop);
      }
    };

    rafId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, [isVisible, basePreset.renderMode, effectivePrimaryHex, effectiveSecondaryHex]);

  return (
    <div
      ref={cardRef}
      data-category-card={categoryKey}
      className="rounded-2xl border overflow-hidden flex flex-col justify-between h-full hh-theme-transition group/card"
      style={{
        backgroundColor: 'var(--hh-surface)',
        borderColor: 'var(--hh-border)',
        boxShadow: 'var(--hh-card-shadow)',
      }}
    >
      {/* UPPER SECTION: CATEGORY HEADER + INTERACTIVE PORTAL DIRECTORY LINKS */}
      <div className="p-4 sm:p-5 flex flex-col gap-3">
        <div
          className="flex items-center justify-between gap-2 border-b pb-2.5 font-space-mono text-[11px] uppercase tracking-[0.18em]"
          style={{ borderColor: 'var(--hh-border)' }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-bold truncate" style={{ color: 'var(--hh-accent-2)' }}>
              {categoryLabel}
            </span>
            <span aria-hidden="true" style={{ color: 'var(--hh-border)' }}>
              ·
            </span>
            <span className="tabular-nums font-bold" style={{ color: 'var(--hh-muted)' }}>
              {String(groupSections.length).padStart(2, '0')}
            </span>
          </div>

          {geminiAvailable && (
            <button
              type="button"
              onClick={() => void handleManualHydrate()}
              disabled={isHydrating}
              title="Hydrate AI cinema keyframe directive"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[9.5px] font-bold tracking-wider transition-colors cursor-pointer shrink-0"
              style={{
                borderColor: activeHydrated ? '#f59e0b' : 'var(--hh-border)',
                color: activeHydrated ? '#f59e0b' : 'var(--hh-muted)',
                backgroundColor: 'var(--hh-bg)',
              }}
            >
              <Sparkles className="w-3 h-3" />
              <span>{isHydrating ? 'SYNC...' : activeHydrated ? 'AI FRAME' : 'AI GRADE'}</span>
            </button>
          )}
        </div>

        <ul className="divide-y" style={{ borderColor: 'var(--hh-border)' }}>
          {groupSections.map((sec) => {
            const localized = t.sections[sec.id];
            const title = localized?.title || sec.title;
            const isActiveRow = sec.id === activeSection?.id;

            return (
              <li
                key={sec.id}
                onMouseEnter={() => {
                  setActivePortalId(sec.id);
                  onSetCursorLabel(`${title} ↗`);
                }}
                onFocus={() => setActivePortalId(sec.id)}
                className="group/row relative py-2 first:pt-0.5 last:pb-0.5 flex items-center justify-between gap-2.5 rounded-lg px-1.5 -mx-1.5 transition-colors duration-150"
                style={{
                  borderColor: 'var(--hh-border)',
                  backgroundColor: isActiveRow ? 'rgba(245, 158, 11, 0.08)' : 'transparent',
                }}
              >
                <a
                  href={`#${sec.id}`}
                  onClick={(e) => onJumpToSection(e, sec.id)}
                  className="flex items-center gap-2 min-w-0 hover:opacity-95"
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0 transition-transform duration-200"
                    style={{
                      backgroundColor: isActiveRow ? '#f59e0b' : sec.accent,
                      transform: isActiveRow ? 'scale(1.3)' : 'scale(1)',
                    }}
                  />
                  <span
                    className="text-sm font-extrabold tracking-tight truncate"
                    style={{ color: isActiveRow ? 'var(--hh-text)' : 'var(--hh-text)' }}
                  >
                    {title}
                  </span>
                </a>

                <a
                  href={sec.dest}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${title} at ${sec.url}`}
                  className="font-space-mono text-[10.5px] inline-flex items-center gap-1 shrink-0 transition-colors hover:underline"
                  style={{ color: isActiveRow ? 'var(--hh-accent-2)' : 'var(--hh-muted)' }}
                >
                  <span className="truncate max-w-[165px]">{sec.url}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 shrink-0" style={{ color: sec.accent }} />
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      {/* LOWER STAGE: LIVE 60FPS CONTEXT-DIRECTED CINEMA VIEWPORT (ZERO EMPTY BLACK BOXES) */}
      <div className="relative flex-1 min-h-[205px] w-full overflow-hidden border-t bg-[#09090b]" style={{ borderColor: 'var(--hh-border)' }}>
        {/* Crossfading Context Still */}
        <img
          key={basePreset.stillUrl}
          src={basePreset.stillUrl}
          alt={`${activeSection?.title ?? categoryLabel} cinema preview`}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-70 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:scale-[1.06]"
        />

        {/* Measured Cinema Contrast Scrim */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(9,9,11,0.45) 0%, rgba(9,9,11,0.22) 38%, rgba(9,9,11,0.92) 100%)',
          }}
        />

        {/* 60FPS Context-Directed HTML5 Canvas Overlay */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 w-full h-full z-10"
        />

        {/* Live Telemetry HUD Overlay */}
        <div className="relative z-20 flex flex-col justify-between h-full min-h-[205px] p-4 text-white">
          <div className="flex items-center justify-between gap-2 font-space-mono text-[10px] tracking-[0.14em] uppercase">
            <span className="px-2 py-0.5 rounded bg-black/65 backdrop-blur-md border border-white/15 font-bold text-[#f59e0b] truncate">
              {effectiveHudTag}
            </span>
            <span className="text-zinc-300/90 tabular-nums shrink-0 hidden sm:inline">
              {basePreset.fpsSpec}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-bebas text-2xl tracking-wider uppercase leading-none text-white">
                {t.sections[activeSection?.id ?? '']?.title || activeSection?.title || categoryLabel}
              </span>
              <span className="font-space-mono text-[10px] text-zinc-300 truncate">
                {effectiveLensSpec}
              </span>
            </div>
            <p className="text-xs text-zinc-200/90 leading-snug line-clamp-2 font-medium">
              {effectiveDirective}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
// END OF FILE: src/components/DynamicPortalCard.tsx
