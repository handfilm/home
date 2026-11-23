import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ActiveTab, SectionItem, SyncState } from '../types';
import { PORTAL_CATEGORIES } from '../data/initialData';
import { Language, TranslationDictionary } from '../i18n/translations';
import { trackEvent } from '../services/analytics';
import { useTheme } from '../context/ThemeContext';
import handFilmPoster from '../assets/images/hand_film_cinematic_poster_1788025510409.jpg';
import b2bLeatherImg from '../assets/images/arutemika_b2b_leather_1788023629277.jpg';
import rawxEditorialImg from '../assets/images/rawxos_editorial_hero_1788023645113.jpg';
import {
  ArrowUpRight,
  ArrowRight,
  Film,
  Factory,
  Layers,
  MessageCircle,
  Sliders,
  CheckSquare,
  Smartphone,
  Terminal,
  Compass,
  Activity,
} from 'lucide-react';

interface HomeLandingProps {
  sections: SectionItem[];
  syncState: SyncState;
  tasksCount: { total: number; pending: number; done: number };
  onNavigateTab: (tab: ActiveTab) => void;
  onJumpToSection: (sectionId: string) => void;
  onOpenSyncModal: () => void;
  onOpenCommandPalette: () => void;
  onSetCursorLabel: (label: string) => void;
  language?: Language;
  t: TranslationDictionary;
}

type PillarKey = 'storyboard' | 'b2b' | 'apps';

const WHATSAPP_NUMBER =
  (import.meta as unknown as { env?: Record<string, string | undefined> }).env?.VITE_WHATSAPP_NUMBER || '';

function buildWhatsAppUrl(contextLabel: string): string {
  const message = `Hello HANDS & HEAD — ${contextLabel} [Via Main Hub] (https://handsandhead.com)`;
  const encoded = encodeURIComponent(message);
  if (WHATSAPP_NUMBER.trim()) {
    const cleanNum = WHATSAPP_NUMBER.replace(/[^\d]/g, '');
    return `https://wa.me/${cleanNum}?text=${encoded}`;
  }
  return `https://wa.me/?text=${encoded}`;
}

function useAnimatedCounter(target: number, durationMs = 700): number {
  const [count, setCount] = useState<number>(target);
  const prevTargetRef = useRef<number>(0);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setCount(target);
      prevTargetRef.current = target;
      return;
    }

    const startVal = prevTargetRef.current === target ? 0 : prevTargetRef.current;
    const startTime = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      const nextVal = Math.round(startVal + (target - startVal) * eased);
      setCount(nextVal);
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        prevTargetRef.current = target;
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [target, durationMs]);

  return count;
}

export default function HomeLanding({
  sections,
  syncState,
  tasksCount,
  onNavigateTab,
  onJumpToSection,
  onOpenSyncModal,
  onOpenCommandPalette,
  onSetCursorLabel,
  language = 'en',
  t,
}: HomeLandingProps) {
  const { isDark } = useTheme();
  const [clockUtc, setClockUtc] = useState<string>(() => new Date().toISOString().slice(11, 19));
  const [expandedPillar, setExpandedPillar] = useState<PillarKey | null>(null);
  const [tiltState, setTiltState] = useState<Record<PillarKey, { rx: number; ry: number }>>({
    storyboard: { rx: 0, ry: 0 },
    b2b: { rx: 0, ry: 0 },
    apps: { rx: 0, ry: 0 },
  });

  const animatedModulesCount = useAnimatedCounter(sections.length, 760);
  const animatedSliderCount = useAnimatedCounter(19, 820);
  const animatedDeviceCount = useAnimatedCounter(Math.max(1, syncState.deviceCount), 640);

  useEffect(() => {
    const interval = setInterval(() => {
      setClockUtc(new Date().toISOString().slice(11, 19));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const quickAppModules = useMemo(() => {
    const targetIds = ['bloom', 'aural', 'd2c', 'articles', 'hub'];
    return targetIds
      .map((id) => sections.find((s) => s.id === id))
      .filter((s): s is SectionItem => Boolean(s));
  }, [sections]);

  const b2bWingModules = useMemo(() => {
    const targetIds = ['rmg', 'leather', 'jacket', 'bracelets'];
    return targetIds
      .map((id) => sections.find((s) => s.id === id))
      .filter((s): s is SectionItem => Boolean(s));
  }, [sections]);

  const whatsappMainHubUrl = useMemo(
    () => buildWhatsAppUrl('Enterprise & Ecosystem Inquiry'),
    []
  );

  const handleTabLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, tab: ActiveTab) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    trackEvent('HOME_NAV_TAB', { tab });
    onNavigateTab(tab);
  };

  const handleSectionLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    trackEvent('HOME_QUICK_JUMP_SECTION', { sectionId });
    onJumpToSection(sectionId);
  };

  const handlePillarMouseMove = (key: PillarKey, e: React.MouseEvent<HTMLElement>) => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    const ry = Number((relX * 8).toFixed(2));
    const rx = Number((-relY * 8).toFixed(2));

    setTiltState((prev) => ({
      ...prev,
      [key]: { rx, ry },
    }));
  };

  const handlePillarMouseLeave = (key: PillarKey) => {
    setTiltState((prev) => ({
      ...prev,
      [key]: { rx: 0, ry: 0 },
    }));
  };

  const toggleTouchExpand = (key: PillarKey) => {
    setExpandedPillar((prev) => (prev === key ? null : key));
  };

  const isBangla = language === 'bn';

  return (
    <div
      className={`relative min-h-screen w-full pt-[130px] md:pt-[80px] pb-32 hh-theme-transition ${
        isBangla ? 'bangla-text' : ''
      }`}
      style={{
        backgroundColor: 'var(--hh-bg)',
        color: 'var(--hh-text)',
      }}
      onMouseEnter={() => onSetCursorLabel('EXPLORE →')}
    >
      {/* Dynamic Animated Architectural Grid Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 hh-home-grid-motion"
        style={{
          backgroundImage:
            'linear-gradient(var(--hh-grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--hh-grid-line) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      {/* Crimson & Warm Gold Dual Ambient Top Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[65px] left-0 right-0 h-[480px] z-0"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 68% 52% at 22% 0%, rgba(225, 29, 72, 0.16), transparent 70%), radial-gradient(ellipse 55% 45% at 82% 12%, rgba(245, 158, 11, 0.12), transparent 70%)'
            : 'radial-gradient(ellipse 68% 52% at 22% 0%, rgba(190, 18, 60, 0.10), transparent 70%), radial-gradient(ellipse 55% 45% at 82% 12%, rgba(217, 119, 6, 0.10), transparent 70%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1380px] px-4 sm:px-8 lg:px-12">
        {/* ════════════════════════════════════════════════════════════════
            1. EXECUTIVE HERO — CINEMATIC SQUARE BALANCE & SUPER BOLD TAGLINE
        ════════════════════════════════════════════════════════════════ */}
        <section
          aria-labelledby="hh-hero-heading"
          className="pt-8 sm:pt-12 lg:pt-14 pb-10 sm:pb-12 border-b hh-stagger-1"
          style={{ borderColor: 'var(--hh-border)' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            {/* Left Dominant Focal Copy */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div
                  className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] tracking-[0.2em] uppercase"
                  style={{ color: 'var(--hh-accent-2)' }}
                >
                  <span className="inline-flex items-center gap-2 font-bold">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--hh-accent)' }} />
                    <span>{t.home.eyebrow}</span>
                  </span>
                  <span aria-hidden="true" style={{ color: 'var(--hh-border)' }}>·</span>
                  <span className="tabular-nums font-bold" style={{ color: 'var(--hh-text)' }}>
                    {animatedModulesCount} {t.home.liveNodesLabel}
                  </span>
                </div>

                <h1
                  id="hh-hero-heading"
                  className="font-black tracking-tight leading-[0.92] max-w-3xl"
                  style={{
                    fontSize: 'clamp(2.75rem, 5.8vw, 5.15rem)',
                    textWrap: 'balance',
                    color: 'var(--hh-text)',
                  }}
                >
                  {t.home.headline}
                  <span
                    className={`block mt-3 text-[0.58em] font-black leading-[1.04] tracking-tight ${
                      isBangla ? 'bangla-text' : ''
                    }`}
                    style={{
                      color: 'var(--hh-accent-2)',
                      ...(isBangla ? { letterSpacing: 0 } : undefined),
                    }}
                  >
                    {t.home.motto}
                  </span>
                </h1>

                <p
                  className="text-sm sm:text-base max-w-xl leading-relaxed line-clamp-2"
                  style={{ color: 'var(--hh-muted)' }}
                >
                  {t.home.subtitle}
                </p>
              </div>

              {/* Bigger, Cleaner Primary Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs sm:text-sm tracking-wider uppercase">
                <a
                  href="#apps"
                  onClick={(e) => handleTabLinkClick(e, 'ecosystem')}
                  onMouseEnter={() => onSetCursorLabel('OPEN 24 APPS →')}
                  className="inline-flex items-center gap-3 px-6 py-4 font-extrabold rounded-2xl transition-all duration-200 whitespace-nowrap shrink-0 hover:scale-[1.03] hover:-translate-y-0.5"
                  style={{
                    backgroundColor: 'var(--hh-accent)',
                    color: 'var(--hh-accent-ink)',
                    boxShadow: isDark ? '0 10px 30px rgba(225, 29, 72, 0.36)' : '0 10px 26px rgba(190, 18, 60, 0.24)',
                  }}
                >
                  <Layers className="w-5 h-5" />
                  <span>{t.home.exploreAppsBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#sliders"
                  onClick={(e) => handleTabLinkClick(e, 'rawx-showcase')}
                  onMouseEnter={() => onSetCursorLabel('OPEN RAWx →')}
                  className="inline-flex items-center gap-2.5 px-5 py-4 font-bold rounded-2xl border transition-all duration-200 whitespace-nowrap shrink-0 hover:scale-[1.03] hover:-translate-y-0.5 normal-case"
                  style={{
                    backgroundColor: 'var(--hh-surface)',
                    borderColor: 'var(--hh-accent-2)',
                    color: 'var(--hh-accent-2)',
                  }}
                >
                  <Sliders className="w-5 h-5" />
                  <span>{t.home.slidersBtn}</span>
                </a>

                <a
                  href={whatsappMainHubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('HOME_WHATSAPP_CTA', { source: 'hero_via_main_hub' })}
                  onMouseEnter={() => onSetCursorLabel('WHATSAPP HUB ↗')}
                  className="inline-flex items-center gap-2.5 px-5 py-4 border font-bold rounded-2xl transition-all duration-200 whitespace-nowrap shrink-0 hover:scale-[1.03] hover:-translate-y-0.5"
                  style={{
                    backgroundColor: 'var(--hh-surface)',
                    borderColor: 'var(--hh-border)',
                    color: 'var(--hh-text)',
                  }}
                >
                  <MessageCircle className="w-5 h-5 text-emerald-500" />
                  <span>{t.home.whatsappBtn}</span>
                </a>
              </div>
            </div>

            {/* Right Cinematic Square-Balanced Minimal URL Card */}
            <div
              className="lg:col-span-5 rounded-2xl p-5 sm:p-6 flex flex-col justify-between gap-4 border hh-theme-transition"
              style={{
                backgroundColor: 'var(--hh-surface)',
                borderColor: 'var(--hh-border)',
                boxShadow: 'var(--hh-card-shadow)',
              }}
            >
              <div className="flex items-center justify-between border-b pb-3 font-mono text-[11px] tracking-[0.16em] uppercase" style={{ borderColor: 'var(--hh-border)' }}>
                <span className="font-bold flex items-center gap-2" style={{ color: 'var(--hh-accent-2)' }}>
                  <Activity className="w-4 h-4" style={{ color: 'var(--hh-accent)' }} />
                  <span>HANDSANDHEAD.COM</span>
                </span>
                <span className="tabular-nums font-semibold" style={{ color: 'var(--hh-muted)' }}>
                  {animatedModulesCount} NODES
                </span>
              </div>

              {/* Minimal Icon + Right-Aligned URL Cards with Animated Hover Expansion */}
              <div className="grid grid-cols-1 gap-2.5">
                {[
                  {
                    href: 'https://storyboard.handsandhead.com/',
                    url: 'storyboard.handsandhead.com',
                    title: 'HANDFILM STUDIO',
                    icon: <Film className="w-5 h-5" style={{ color: 'var(--hh-accent)' }} />,
                    accent: 'var(--hh-accent)',
                  },
                  {
                    href: 'https://b2b.handsandhead.com/',
                    url: 'b2b.handsandhead.com',
                    title: 'B2B WINGS',
                    icon: <Factory className="w-5 h-5" style={{ color: 'var(--hh-accent-2)' }} />,
                    accent: 'var(--hh-accent-2)',
                  },
                  {
                    href: 'https://d2c.handsandhead.com/',
                    url: 'd2c.handsandhead.com',
                    title: 'D2C SHOP',
                    icon: <Compass className="w-5 h-5 text-emerald-500" />,
                    accent: '#10b981',
                  },
                  {
                    href: 'https://rawx.handsandhead.com/',
                    url: 'rawx.handsandhead.com',
                    title: 'RAWx LAB',
                    icon: <Sliders className="w-5 h-5" style={{ color: 'var(--hh-accent-2)' }} />,
                    accent: 'var(--hh-accent-2)',
                  },
                ].map((node) => (
                  <a
                    key={node.url}
                    href={node.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/url flex items-center justify-between gap-3 px-4 py-3 rounded-xl border transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:scale-[1.01]"
                    style={{
                      backgroundColor: 'var(--hh-bg)',
                      borderColor: 'var(--hh-border)',
                    }}
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <span className="transition-transform duration-200 group-hover/url:scale-110 shrink-0">
                        {node.icon}
                      </span>
                      <span className="text-sm font-extrabold tracking-tight truncate" style={{ color: 'var(--hh-text)' }}>
                        {node.title}
                      </span>
                    </span>
                    <span className="flex items-center gap-1.5 font-mono text-[11px] shrink-0 transition-colors" style={{ color: 'var(--hh-muted)' }}>
                      <span className="group-hover/url:underline">{node.url}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/url:translate-x-0.5 group-hover/url:-translate-y-0.5" style={{ color: node.accent }} />
                    </span>
                  </a>
                ))}
              </div>

              {/* Bigger Icon Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5 pt-1 font-mono text-xs uppercase tracking-wider">
                <button
                  type="button"
                  onClick={onOpenCommandPalette}
                  className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border font-bold transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                  style={{
                    backgroundColor: 'var(--hh-bg)',
                    borderColor: 'var(--hh-border)',
                    color: 'var(--hh-text)',
                  }}
                >
                  <Terminal className="w-4 h-4" style={{ color: 'var(--hh-accent-2)' }} />
                  <span>⌘K JUMP</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenSyncModal}
                  className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border font-bold transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                  style={{
                    backgroundColor: 'var(--hh-bg)',
                    borderColor: 'var(--hh-accent)',
                    color: 'var(--hh-accent)',
                  }}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>SYNC · {syncState.roomId}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            2. BALANCED ICON TELEMETRY TILES (LOW TEXT + ANIMATED HOVER CARDS)
        ════════════════════════════════════════════════════════════════ */}
        <section
          aria-label="Live System Telemetry"
          className="my-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 hh-stagger-2"
        >
          {[
            {
              key: 'sync',
              icon: <Smartphone className="w-5 h-5 text-emerald-500" />,
              value: syncState.isConnected ? 'ONLINE' : 'LOCAL',
              sub: syncState.roomId,
              hoverTitle: t.home.syncMeshLabel,
              hoverDesc: `${syncState.roomId} · ${animatedDeviceCount} ${
                animatedDeviceCount === 1 ? 'Device' : 'Devices'
              } paired`,
              onClick: onOpenSyncModal,
              accent: '#10b981',
            },
            {
              key: 'apps',
              icon: <Layers className="w-5 h-5" style={{ color: 'var(--hh-accent)' }} />,
              value: `${animatedModulesCount}`,
              sub: 'PORTALS',
              hoverTitle: t.home.ecosystemStageLabel,
              hoverDesc: `${animatedModulesCount} Portals across 6 operating divisions`,
              onClick: () => onNavigateTab('ecosystem'),
              accent: 'var(--hh-accent)',
            },
            {
              key: 'rawx',
              icon: <Sliders className="w-5 h-5" style={{ color: 'var(--hh-accent-2)' }} />,
              value: `${animatedSliderCount}`,
              sub: 'RAWx',
              hoverTitle: t.home.visualEngineLabel,
              hoverDesc: `${animatedSliderCount} Interactive Lookbook & LUT Engines`,
              onClick: () => onNavigateTab('rawx-showcase'),
              accent: 'var(--hh-accent-2)',
            },
            {
              key: 'tasks',
              icon: <CheckSquare className="w-5 h-5 text-emerald-500" />,
              value: `${tasksCount.pending}`,
              sub: 'TASKS',
              hoverTitle: t.home.activeTasksLabel,
              hoverDesc: `${tasksCount.pending} Open / ${tasksCount.total} Total Dispatches`,
              onClick: () => onNavigateTab('tasks-hub'),
              accent: '#10b981',
            },
            {
              key: 'clock',
              icon: <Activity className="w-5 h-5" style={{ color: 'var(--hh-accent)' }} />,
              value: clockUtc,
              sub: 'UTC',
              hoverTitle: t.home.masterClockLabel,
              hoverDesc: 'Synchronized Master OS Execution Clock',
              onClick: onOpenCommandPalette,
              accent: 'var(--hh-accent)',
            },
          ].map((tile) => (
            <button
              key={tile.key}
              type="button"
              onClick={tile.onClick}
              className="group/stat relative rounded-2xl border p-4 flex items-center justify-between gap-3 text-left transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 cursor-pointer hh-theme-transition"
              style={{
                backgroundColor: 'var(--hh-surface)',
                borderColor: 'var(--hh-border)',
              }}
            >
              <span className="w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 transition-transform duration-200 group-hover/stat:scale-110" style={{ backgroundColor: 'var(--hh-bg)', borderColor: 'var(--hh-border)' }}>
                {tile.icon}
              </span>
              <div className="text-right min-w-0">
                <div className="text-lg font-black tracking-tight tabular-nums leading-none" style={{ color: 'var(--hh-text)' }}>
                  {tile.value}
                </div>
                <div className="font-mono text-[10px] tracking-wider mt-1" style={{ color: 'var(--hh-muted)' }}>
                  {tile.sub}
                </div>
              </div>

              {/* Bigger-Text Animated Hover Card */}
              <div
                className="pointer-events-none absolute left-0 right-0 bottom-full mb-2.5 z-30 opacity-0 translate-y-2 scale-95 group-hover/stat:opacity-100 group-hover/stat:translate-y-0 group-hover/stat:scale-100 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] rounded-xl border p-3 backdrop-blur-2xl shadow-2xl"
                style={{
                  backgroundColor: 'var(--hh-glass-bg)',
                  borderColor: tile.accent,
                  color: 'var(--hh-text)',
                }}
              >
                <div className="text-xs font-extrabold tracking-wider mb-0.5" style={{ color: tile.accent }}>
                  {tile.hoverTitle}
                </div>
                <div className="text-xs font-medium leading-snug" style={{ color: 'var(--hh-text)' }}>
                  {tile.hoverDesc}
                </div>
              </div>
            </button>
          ))}
        </section>

        {/* ════════════════════════════════════════════════════════════════
            3. CINEMATIC SQUARE-BALANCED PILLAR CARDS (LOW REST TEXT + BIG HOVER CARDS)
        ════════════════════════════════════════════════════════════════ */}
        <section aria-labelledby="hh-pillars-heading" className="py-6 sm:py-8 hh-stagger-3">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
            <h2
              id="hh-pillars-heading"
              className="text-2xl sm:text-3xl font-black tracking-tight"
              style={{ color: 'var(--hh-text)' }}
            >
              {t.home.pillarsTitle}
            </h2>
            <span
              className="font-mono text-[11px] uppercase tracking-wider"
              style={{ color: 'var(--hh-muted)' }}
            >
              03 CORE FRAMES
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* PILLAR 01 — HANDFILM & STORYBOARD */}
            <article
              onMouseEnter={() => onSetCursorLabel('STORYBOARD ↗')}
              onMouseMove={(e) => handlePillarMouseMove('storyboard', e)}
              onMouseLeave={() => handlePillarMouseLeave('storyboard')}
              onClick={() => toggleTouchExpand('storyboard')}
              className="group relative aspect-square min-h-[340px] rounded-2xl overflow-hidden border transition-all duration-300 ease-out cursor-pointer"
              style={{
                borderColor: 'var(--hh-border)',
                boxShadow: 'var(--hh-card-shadow)',
                transform: `perspective(1000px) rotateX(${tiltState.storyboard.rx}deg) rotateY(${tiltState.storyboard.ry}deg)`,
              }}
            >
              <img
                src={handFilmPoster}
                alt="HandFilm and Storyboard WebGL2 AI Video Platform"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.07]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/35 transition-opacity duration-300 group-hover:opacity-95"
              />

              <div className="relative z-10 p-5 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/15 font-mono text-[10px] font-bold uppercase tracking-wider text-white">
                  <Film className="w-3.5 h-3.5 text-[#e11d48]" />
                  <span>{t.home.pillarCards.storyboardBadge}</span>
                </span>
                <span className="font-mono text-[10px] text-white/75">storyboard.handsandhead.com</span>
              </div>

              <div
                className={`absolute bottom-0 left-0 right-0 z-10 p-6 transition-all duration-300 ease-out ${
                  expandedPillar === 'storyboard'
                    ? 'opacity-0 translate-y-4 pointer-events-none'
                    : 'group-hover:opacity-0 group-hover:translate-y-4'
                }`}
              >
                <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                  {t.home.pillarCards.storyboardTitle}
                </h3>
              </div>

              {/* Super Animated Hover Card with Bigger Text & Bigger Buttons */}
              <div
                onClick={(e) => e.stopPropagation()}
                className={`absolute inset-x-3.5 bottom-3.5 z-20 rounded-2xl p-5 backdrop-blur-2xl border border-white/25 bg-black/82 text-white transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] space-y-4 ${
                  expandedPillar === 'storyboard'
                    ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                    : 'opacity-0 translate-y-6 scale-95 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 group-hover:pointer-events-auto'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xl font-black tracking-tight text-white">
                    {t.home.pillarCards.storyboardTitle}
                  </h3>
                  <span className="font-mono text-[10.5px] text-[#f59e0b]">storyboard.handsandhead.com</span>
                </div>

                <p className="text-sm text-zinc-100 leading-snug line-clamp-2 font-medium">
                  {t.home.pillarCards.storyboardSummary}
                </p>

                <div className="pt-2 border-t border-white/15 flex items-center justify-between gap-2.5">
                  <a
                    href="https://storyboard.handsandhead.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('HOME_PILLAR_CTA', { pillar: 'storyboard' })}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-extrabold transition-transform hover:scale-[1.03]"
                    style={{ backgroundColor: 'var(--hh-accent)', color: 'var(--hh-accent-ink)' }}
                  >
                    <span>{t.home.openStoryboardCta}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => onNavigateTab('handfilm')}
                    className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono font-bold text-white cursor-pointer transition-colors"
                  >
                    HUB →
                  </button>
                </div>
              </div>
            </article>

            {/* PILLAR 02 — B2B & INDUSTRIAL WINGS */}
            <article
              onMouseEnter={() => onSetCursorLabel('B2B WINGS ↗')}
              onMouseMove={(e) => handlePillarMouseMove('b2b', e)}
              onMouseLeave={() => handlePillarMouseLeave('b2b')}
              onClick={() => toggleTouchExpand('b2b')}
              className="group relative aspect-square min-h-[340px] rounded-2xl overflow-hidden border transition-all duration-300 ease-out cursor-pointer"
              style={{
                borderColor: 'var(--hh-border)',
                boxShadow: 'var(--hh-card-shadow)',
                transform: `perspective(1000px) rotateX(${tiltState.b2b.rx}deg) rotateY(${tiltState.b2b.ry}deg)`,
              }}
            >
              <img
                src={b2bLeatherImg}
                alt="Hands and Head B2B Industrial Manufacturing, Leather and 316L Wings"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.07]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/35 transition-opacity duration-300 group-hover:opacity-95"
              />

              <div className="relative z-10 p-5 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/15 font-mono text-[10px] font-bold uppercase tracking-wider text-white">
                  <Factory className="w-3.5 h-3.5 text-[#f59e0b]" />
                  <span>{t.home.pillarCards.b2bBadge}</span>
                </span>
                <span className="font-mono text-[10px] text-white/75">b2b.handsandhead.com</span>
              </div>

              <div
                className={`absolute bottom-0 left-0 right-0 z-10 p-6 transition-all duration-300 ease-out ${
                  expandedPillar === 'b2b'
                    ? 'opacity-0 translate-y-4 pointer-events-none'
                    : 'group-hover:opacity-0 group-hover:translate-y-4'
                }`}
              >
                <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                  {t.home.pillarCards.b2bTitle}
                </h3>
              </div>

              <div
                onClick={(e) => e.stopPropagation()}
                className={`absolute inset-x-3.5 bottom-3.5 z-20 rounded-2xl p-5 backdrop-blur-2xl border border-white/25 bg-black/82 text-white transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] space-y-4 ${
                  expandedPillar === 'b2b'
                    ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                    : 'opacity-0 translate-y-6 scale-95 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 group-hover:pointer-events-auto'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xl font-black tracking-tight text-white">
                    {t.home.pillarCards.b2bTitle}
                  </h3>
                  <span className="font-mono text-[10.5px] text-[#f59e0b]">b2b.handsandhead.com</span>
                </div>

                <p className="text-sm text-zinc-100 leading-snug line-clamp-2 font-medium">
                  {t.home.pillarCards.b2bSummary}
                </p>

                <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                  {b2bWingModules.map((mod) => (
                    <a
                      key={mod.id}
                      href={`#${mod.id}`}
                      onClick={(e) => handleSectionLinkClick(e, mod.id)}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-100 transition-colors font-semibold"
                    >
                      {t.sections[mod.id]?.title || mod.title}
                    </a>
                  ))}
                </div>

                <div className="pt-2 border-t border-white/15 flex items-center justify-between gap-2.5">
                  <a
                    href="https://b2b.handsandhead.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('HOME_PILLAR_CTA', { pillar: 'b2b' })}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#f59e0b] hover:bg-[#fbbf24] text-black text-sm font-extrabold transition-transform hover:scale-[1.03]"
                  >
                    <span>{t.home.openWingCta}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                  <a
                    href={buildWhatsAppUrl('B2B Manufacturing & Hardware RFQ')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-xs font-mono font-bold text-emerald-300 transition-colors"
                  >
                    RFQ ↗
                  </a>
                </div>
              </div>
            </article>

            {/* PILLAR 03 — ECOSYSTEM APPS (24 MODULES) */}
            <article
              onMouseEnter={() => onSetCursorLabel('24 APPS →')}
              onMouseMove={(e) => handlePillarMouseMove('apps', e)}
              onMouseLeave={() => handlePillarMouseLeave('apps')}
              onClick={() => toggleTouchExpand('apps')}
              className="group relative aspect-square min-h-[340px] rounded-2xl overflow-hidden border transition-all duration-300 ease-out cursor-pointer"
              style={{
                borderColor: 'var(--hh-border)',
                boxShadow: 'var(--hh-card-shadow)',
                transform: `perspective(1000px) rotateX(${tiltState.apps.rx}deg) rotateY(${tiltState.apps.ry}deg)`,
              }}
            >
              <img
                src={rawxEditorialImg}
                alt="Hands and Head 24 Ecosystem Modules and RAWx Storefront"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.07]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/35 transition-opacity duration-300 group-hover:opacity-95"
              />

              <div className="relative z-10 p-5 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/15 font-mono text-[10px] font-bold uppercase tracking-wider text-white">
                  <Compass className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t.home.pillarCards.appsBadge}</span>
                </span>
                <span className="font-mono text-[10px] text-white/75">apps.handsandhead.com</span>
              </div>

              <div
                className={`absolute bottom-0 left-0 right-0 z-10 p-6 transition-all duration-300 ease-out ${
                  expandedPillar === 'apps'
                    ? 'opacity-0 translate-y-4 pointer-events-none'
                    : 'group-hover:opacity-0 group-hover:translate-y-4'
                }`}
              >
                <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                  {t.home.pillarCards.appsTitle}
                </h3>
              </div>

              <div
                onClick={(e) => e.stopPropagation()}
                className={`absolute inset-x-3.5 bottom-3.5 z-20 rounded-2xl p-5 backdrop-blur-2xl border border-white/25 bg-black/82 text-white transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] space-y-4 ${
                  expandedPillar === 'apps'
                    ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                    : 'opacity-0 translate-y-6 scale-95 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 group-hover:pointer-events-auto'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xl font-black tracking-tight text-white">
                    {t.home.pillarCards.appsTitle}
                  </h3>
                  <span className="font-mono text-[10.5px] text-emerald-400 tabular-nums">
                    {sections.length} PORTALS
                  </span>
                </div>

                <p className="text-sm text-zinc-100 leading-snug line-clamp-2 font-medium">
                  {t.home.pillarCards.appsSummary}
                </p>

                <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                  {quickAppModules.map((mod) => (
                    <a
                      key={mod.id}
                      href={`#${mod.id}`}
                      onClick={(e) => handleSectionLinkClick(e, mod.id)}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-100 transition-colors font-semibold"
                    >
                      {t.sections[mod.id]?.title || mod.title}
                    </a>
                  ))}
                </div>

                <div className="pt-2 border-t border-white/15 flex items-center justify-between gap-2.5">
                  <a
                    href="#apps"
                    onClick={(e) => handleTabLinkClick(e, 'ecosystem')}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-black hover:bg-zinc-200 text-sm font-extrabold transition-transform hover:scale-[1.03]"
                  >
                    <span>{t.home.openAppsCta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => onNavigateTab('rawx-showcase')}
                    className="px-4 py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-xs font-mono font-bold text-[#f59e0b] cursor-pointer transition-colors"
                  >
                    RAWx 19 →
                  </button>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            4. LOW-TEXT BALANCED SUBDOMAIN DIRECTORY (RIGHT-SIDE URLS + HOVER CARDS)
        ════════════════════════════════════════════════════════════════ */}
        <section
          aria-labelledby="hh-directory-heading"
          className="py-8 border-t hh-stagger-4"
          style={{ borderColor: 'var(--hh-border)' }}
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
            <h2
              id="hh-directory-heading"
              className="text-xl sm:text-2xl font-black tracking-tight"
              style={{ color: 'var(--hh-text)' }}
            >
              {t.home.directoryTitle} ({sections.length})
            </h2>
            <div className="flex items-center gap-4 font-mono text-[11px]">
              <a
                href="https://storyboard.handsandhead.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline inline-flex items-center gap-1 whitespace-nowrap"
                style={{ color: 'var(--hh-accent)' }}
              >
                <span>storyboard.handsandhead.com</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
              <a
                href="https://b2b.handsandhead.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline inline-flex items-center gap-1 whitespace-nowrap"
                style={{ color: 'var(--hh-accent-2)' }}
              >
                <span>b2b.handsandhead.com</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PORTAL_CATEGORIES.map((group) => {
              const groupSections = sections.filter((s) => group.sectionIds.includes(s.id));
              if (groupSections.length === 0) return null;

              return (
                <div
                  key={group.key}
                  className="rounded-2xl p-4 sm:p-5 flex flex-col gap-3 border hh-theme-transition"
                  style={{
                    backgroundColor: 'var(--hh-surface)',
                    borderColor: 'var(--hh-border)',
                  }}
                >
                  <div
                    className="flex items-center justify-between border-b pb-2 font-mono text-[11px] uppercase tracking-[0.18em]"
                    style={{ borderColor: 'var(--hh-border)' }}
                  >
                    <span className="font-bold" style={{ color: 'var(--hh-accent-2)' }}>
                      {group.label}
                    </span>
                    <span className="tabular-nums font-bold" style={{ color: 'var(--hh-muted)' }}>
                      {groupSections.length}
                    </span>
                  </div>

                  <ul className="divide-y" style={{ borderColor: 'var(--hh-border)' }}>
                    {groupSections.map((sec) => {
                      const localized = t.sections[sec.id];
                      const title = localized?.title || sec.title;
                      const sub = localized?.sub || sec.sub;
                      return (
                        <li
                          key={sec.id}
                          className="group/row relative py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
                          style={{ borderColor: 'var(--hh-border)' }}
                        >
                          <a
                            href={`#${sec.id}`}
                            onClick={(e) => handleSectionLinkClick(e, sec.id)}
                            className="flex items-center gap-2.5 min-w-0 hover:opacity-90"
                          >
                            <span
                              className="w-2 h-2 rounded-full shrink-0 transition-transform duration-200 group-hover/row:scale-125"
                              style={{ backgroundColor: sec.accent }}
                            />
                            <span className="text-sm font-bold truncate" style={{ color: 'var(--hh-text)' }}>
                              {title}
                            </span>
                          </a>

                          <a
                            href={sec.dest}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Visit ${title} at ${sec.url}`}
                            className="font-mono text-[10.5px] inline-flex items-center gap-1 shrink-0 transition-colors hover:underline"
                            style={{ color: 'var(--hh-muted)' }}
                          >
                            <span className="truncate max-w-[165px]">{sec.url}</span>
                            <ArrowUpRight className="w-3.5 h-3.5 shrink-0" style={{ color: sec.accent }} />
                          </a>

                          {/* Bigger-Text Animated Hover Card for Portal Row */}
                          <div
                            className="pointer-events-none absolute left-0 right-0 bottom-full mb-2 z-30 opacity-0 translate-y-2 scale-95 group-hover/row:opacity-100 group-hover/row:translate-y-0 group-hover/row:scale-100 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] rounded-xl border p-3.5 backdrop-blur-2xl shadow-2xl"
                            style={{
                              backgroundColor: 'var(--hh-glass-bg)',
                              borderColor: sec.accent,
                              color: 'var(--hh-text)',
                            }}
                          >
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-sm font-black tracking-tight" style={{ color: 'var(--hh-text)' }}>
                                {title}
                              </span>
                              <span className="font-mono text-[10px] font-bold" style={{ color: sec.accent }}>
                                {sec.url}
                              </span>
                            </div>
                            <p className="text-xs leading-snug font-medium line-clamp-2" style={{ color: 'var(--hh-muted)' }}>
                              {sub}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            5. ENTERPRISE WHATSAPP HUB BAR (CLEAN & BIGGER CTA)
        ════════════════════════════════════════════════════════════════ */}
        <section
          aria-label="Direct Enterprise WhatsApp Hub"
          className="mt-4 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border hh-theme-transition"
          style={{
            backgroundColor: 'var(--hh-surface)',
            borderColor: 'var(--hh-border)',
            boxShadow: 'var(--hh-card-shadow)',
          }}
        >
          <div className="space-y-1.5 max-w-xl">
            <h2
              className="text-2xl sm:text-3xl font-black tracking-tight"
              style={{ color: 'var(--hh-text)' }}
            >
              {t.home.dispatchTitle}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--hh-muted)' }}>
              {t.home.dispatchSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0 font-mono text-sm uppercase tracking-wider">
            <a
              href={whatsappMainHubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('HOME_WHATSAPP_CTA', { source: 'footer_via_main_hub' })}
              className="inline-flex items-center gap-3 px-6 py-4 font-extrabold rounded-2xl transition-all hover:scale-[1.03] whitespace-nowrap"
              style={{
                backgroundColor: 'var(--hh-accent)',
                color: 'var(--hh-accent-ink)',
              }}
            >
              <MessageCircle className="w-5 h-5" />
              <span>{t.home.dispatchBtn}</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
// END OF FILE: src/components/HomeLanding.tsx
