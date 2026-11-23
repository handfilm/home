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
      className={`relative min-h-screen w-full pt-[118px] md:pt-[70px] pb-28 hh-theme-transition ${
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
            1. EXECUTIVE HERO — DYNAMIC ENTERPRISE OS
        ════════════════════════════════════════════════════════════════ */}
        <section
          aria-labelledby="hh-hero-heading"
          className="pt-10 sm:pt-14 lg:pt-16 pb-10 sm:pb-12 border-b hh-stagger-1"
          style={{ borderColor: 'var(--hh-border)' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Left Dominant Focal Copy */}
            <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div
                  className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] tracking-[0.22em] uppercase"
                  style={{ color: 'var(--hh-accent-2)' }}
                >
                  <span className="inline-flex items-center gap-2 font-semibold">
                    <span className="relative flex h-2 w-2">
                      <span
                        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                        style={{ backgroundColor: 'var(--hh-accent)' }}
                      />
                      <span
                        className="relative inline-flex rounded-full h-2 w-2"
                        style={{ backgroundColor: 'var(--hh-accent)' }}
                      />
                    </span>
                    {t.home.eyebrow}
                  </span>
                  <span aria-hidden="true" style={{ color: 'var(--hh-border)' }}>·</span>
                  <span style={{ color: 'var(--hh-muted)' }}>HANDSANDHEAD.COM</span>
                  <span aria-hidden="true" style={{ color: 'var(--hh-border)' }}>·</span>
                  <span className="tabular-nums font-semibold" style={{ color: 'var(--hh-text)' }}>
                    {animatedModulesCount} {t.home.liveNodesLabel}
                  </span>
                </div>

                <h1
                  id="hh-hero-heading"
                  className="font-bold tracking-tight leading-[0.94] max-w-3xl"
                  style={{
                    fontSize: 'clamp(2.65rem, 5.6vw, 4.85rem)',
                    textWrap: 'balance',
                    color: 'var(--hh-text)',
                  }}
                >
                  {t.home.headline}
                  <span
                    className="block serif-display italic font-normal mt-2.5 text-[0.52em] leading-[1.12] tracking-[0.01em]"
                    style={{ color: 'var(--hh-accent-2)' }}
                  >
                    {t.home.motto}
                  </span>
                </h1>

                <p
                  className="text-[15px] sm:text-[16px] max-w-2xl leading-[1.65]"
                  style={{ color: 'var(--hh-muted)' }}
                >
                  {t.home.subtitle}
                </p>
              </div>

              {/* Primary Action Row */}
              <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs tracking-wider uppercase">
                <a
                  href="#apps"
                  onClick={(e) => handleTabLinkClick(e, 'ecosystem')}
                  onMouseEnter={() => onSetCursorLabel('OPEN 24 APPS →')}
                  className="inline-flex items-center gap-2.5 px-5 py-3 font-bold rounded-xl transition-all duration-200 whitespace-nowrap shrink-0 hover:scale-[1.02]"
                  style={{
                    backgroundColor: 'var(--hh-accent)',
                    color: 'var(--hh-accent-ink)',
                    boxShadow: isDark ? '0 8px 28px rgba(225, 29, 72, 0.32)' : '0 8px 24px rgba(190, 18, 60, 0.22)',
                  }}
                >
                  <Layers className="w-4 h-4" />
                  <span>{t.home.exploreAppsBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#sliders"
                  onClick={(e) => handleTabLinkClick(e, 'rawx-showcase')}
                  onMouseEnter={() => onSetCursorLabel('OPEN RAWx →')}
                  className="inline-flex items-center gap-2 px-4 py-3 font-semibold rounded-xl border transition-all duration-200 whitespace-nowrap shrink-0 hover:scale-[1.02]"
                  style={{
                    backgroundColor: 'var(--hh-surface)',
                    borderColor: 'var(--hh-accent-2)',
                    color: 'var(--hh-accent-2)',
                  }}
                >
                  <Sliders className="w-4 h-4" />
                  <span>{t.home.slidersBtn}</span>
                </a>

                <a
                  href={whatsappMainHubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('HOME_WHATSAPP_CTA', { source: 'hero_via_main_hub' })}
                  onMouseEnter={() => onSetCursorLabel('WHATSAPP HUB ↗')}
                  className="inline-flex items-center gap-2 px-4 py-3 border font-semibold rounded-xl transition-all duration-200 whitespace-nowrap shrink-0"
                  style={{
                    backgroundColor: 'var(--hh-surface)',
                    borderColor: 'var(--hh-border)',
                    color: 'var(--hh-text)',
                  }}
                >
                  <MessageCircle className="w-4 h-4 text-emerald-500" />
                  <span>{t.home.whatsappBtn}</span>
                  <span className="text-[10px] font-normal" style={{ color: 'var(--hh-muted)' }}>
                    [Via Main Hub]
                  </span>
                </a>
              </div>
            </div>

            {/* Right Architectural Routing Matrix */}
            <div
              className="lg:col-span-4 rounded-2xl p-5 sm:p-6 flex flex-col justify-between gap-5 border hh-theme-transition"
              style={{
                backgroundColor: 'var(--hh-surface)',
                borderColor: 'var(--hh-border)',
                boxShadow: 'var(--hh-card-shadow)',
              }}
            >
              <div className="space-y-4">
                <div
                  className="flex items-center justify-between border-b pb-3 font-mono text-[11px] tracking-[0.16em] uppercase"
                  style={{ borderColor: 'var(--hh-border)' }}
                >
                  <span className="font-semibold flex items-center gap-2" style={{ color: 'var(--hh-accent-2)' }}>
                    <Activity className="w-3.5 h-3.5" style={{ color: 'var(--hh-accent)' }} />
                    {t.home.routingTitle}
                  </span>
                  <span className="tabular-nums" style={{ color: 'var(--hh-muted)' }}>
                    4 TABS · {animatedModulesCount} NODES
                  </span>
                </div>

                <dl className="space-y-3 font-mono text-xs">
                  <div
                    className="flex items-baseline justify-between gap-4 border-b pb-2.5"
                    style={{ borderColor: 'var(--hh-border)' }}
                  >
                    <dt className="uppercase tracking-wider text-[10.5px]" style={{ color: 'var(--hh-muted)' }}>
                      Cinema &amp; WebGL2
                    </dt>
                    <dd className="text-right">
                      <a
                        href="https://storyboard.handsandhead.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors inline-flex items-center gap-1 hover:underline"
                        style={{ color: 'var(--hh-text)' }}
                      >
                        <span>storyboard.handsandhead.com</span>
                        <ArrowUpRight className="w-3 h-3" style={{ color: 'var(--hh-accent)' }} />
                      </a>
                    </dd>
                  </div>

                  <div
                    className="flex items-baseline justify-between gap-4 border-b pb-2.5"
                    style={{ borderColor: 'var(--hh-border)' }}
                  >
                    <dt className="uppercase tracking-wider text-[10.5px]" style={{ color: 'var(--hh-muted)' }}>
                      B2B Industrial
                    </dt>
                    <dd className="text-right">
                      <a
                        href="https://b2b.handsandhead.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors inline-flex items-center gap-1 hover:underline"
                        style={{ color: 'var(--hh-text)' }}
                      >
                        <span>b2b.handsandhead.com</span>
                        <ArrowUpRight className="w-3 h-3" style={{ color: 'var(--hh-accent-2)' }} />
                      </a>
                    </dd>
                  </div>

                  <div
                    className="flex items-baseline justify-between gap-4 border-b pb-2.5"
                    style={{ borderColor: 'var(--hh-border)' }}
                  >
                    <dt className="uppercase tracking-wider text-[10.5px]" style={{ color: 'var(--hh-muted)' }}>
                      Consumer D2C
                    </dt>
                    <dd className="text-right">
                      <a
                        href="https://d2c.handsandhead.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors inline-flex items-center gap-1 hover:underline"
                        style={{ color: 'var(--hh-text)' }}
                      >
                        <span>d2c.handsandhead.com</span>
                        <ArrowUpRight className="w-3 h-3" style={{ color: 'var(--hh-accent-2)' }} />
                      </a>
                    </dd>
                  </div>

                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="uppercase tracking-wider text-[10.5px]" style={{ color: 'var(--hh-muted)' }}>
                      Sync Mesh Room
                    </dt>
                    <dd className="text-right text-emerald-500 font-semibold tabular-nums">
                      {syncState.roomId} ({animatedDeviceCount} {animatedDeviceCount === 1 ? 'DEV' : 'DEVS'})
                    </dd>
                  </div>
                </dl>
              </div>

              <div
                className="flex items-center justify-between gap-2 pt-3 border-t font-mono text-[10.5px]"
                style={{ borderColor: 'var(--hh-border)' }}
              >
                <button
                  type="button"
                  onClick={onOpenCommandPalette}
                  className="inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  style={{ color: 'var(--hh-muted)' }}
                >
                  <Terminal className="w-3.5 h-3.5" style={{ color: 'var(--hh-accent-2)' }} />
                  <span>Command Palette (⌘K)</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenSyncModal}
                  className="inline-flex items-center gap-1.5 font-semibold transition-colors cursor-pointer"
                  style={{ color: 'var(--hh-accent)' }}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Pair Device</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            2. LIVE SYSTEM TELEMETRY STRIP (ANIMATED NODE COUNTERS)
        ════════════════════════════════════════════════════════════════ */}
        <section
          aria-label="Live System Telemetry"
          className="my-6 rounded-2xl px-4 sm:px-6 py-3.5 font-mono text-[11px] tracking-wider border hh-stagger-2 hh-theme-transition"
          style={{
            backgroundColor: 'var(--hh-surface)',
            borderColor: 'var(--hh-border)',
          }}
        >
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
            <button
              type="button"
              onClick={onOpenSyncModal}
              className="flex items-center gap-2.5 text-left transition-colors cursor-pointer group"
            >
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span
                  className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    syncState.isConnected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400 animate-pulse'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    syncState.isConnected ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
              </span>
              <div className="min-w-0">
                <div className="text-[9.5px] uppercase" style={{ color: 'var(--hh-muted)' }}>
                  {t.home.syncMeshLabel}
                </div>
                <div className="font-semibold truncate tabular-nums" style={{ color: 'var(--hh-text)' }}>
                  {syncState.isConnected ? 'ONLINE' : 'LOCAL'} · {syncState.roomId}
                </div>
              </div>
            </button>

            <a
              href="#apps"
              onClick={(e) => handleTabLinkClick(e, 'ecosystem')}
              className="block transition-opacity hover:opacity-80"
            >
              <div className="text-[9.5px] uppercase" style={{ color: 'var(--hh-muted)' }}>
                {t.home.ecosystemStageLabel}
              </div>
              <div className="font-semibold tabular-nums" style={{ color: 'var(--hh-text)' }}>
                {animatedModulesCount} PORTALS · 6 WINGS
              </div>
            </a>

            <a
              href="#sliders"
              onClick={(e) => handleTabLinkClick(e, 'rawx-showcase')}
              className="block transition-opacity hover:opacity-80"
            >
              <div className="text-[9.5px] uppercase" style={{ color: 'var(--hh-muted)' }}>
                {t.home.visualEngineLabel}
              </div>
              <div className="font-semibold tabular-nums" style={{ color: 'var(--hh-accent-2)' }}>
                {animatedSliderCount} RAWx DROPS
              </div>
            </a>

            <a
              href="#tasks"
              onClick={(e) => handleTabLinkClick(e, 'tasks-hub')}
              className="block transition-opacity hover:opacity-80"
            >
              <div className="text-[9.5px] uppercase" style={{ color: 'var(--hh-muted)' }}>
                {t.home.activeTasksLabel}
              </div>
              <div className="font-semibold tabular-nums flex items-center gap-1.5" style={{ color: 'var(--hh-text)' }}>
                <CheckSquare className="w-3 h-3 text-emerald-500" />
                <span>
                  {tasksCount.pending} OPEN / {tasksCount.total} TOTAL
                </span>
              </div>
            </a>

            <div
              className="col-span-2 md:col-span-1 md:text-right border-t md:border-t-0 pt-2 md:pt-0"
              style={{ borderColor: 'var(--hh-border)' }}
            >
              <div className="text-[9.5px] uppercase" style={{ color: 'var(--hh-muted)' }}>
                {t.home.masterClockLabel}
              </div>
              <div className="font-semibold tabular-nums" style={{ color: 'var(--hh-text)' }}>
                {clockUtc} UTC
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            3. CAPCUT-STYLE MINIMALIST + 3D TILT + HOVER-REVEAL PILLAR CARDS
        ════════════════════════════════════════════════════════════════ */}
        <section aria-labelledby="hh-pillars-heading" className="py-6 sm:py-8 hh-stagger-3">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
            <div>
              <p
                className="font-mono text-[11px] uppercase tracking-[0.2em] mb-1.5"
                style={{ color: 'var(--hh-accent-2)' }}
              >
                {t.home.pillarsEyebrow}
              </p>
              <h2
                id="hh-pillars-heading"
                className="text-2xl sm:text-3xl font-bold tracking-tight"
                style={{ color: 'var(--hh-text)' }}
              >
                {t.home.pillarsTitle}
              </h2>
            </div>
            <p
              className="font-mono text-[11px] uppercase tracking-wider"
              style={{ color: 'var(--hh-muted)' }}
            >
              {t.home.pillarsSub}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* PILLAR 01 — HANDFILM & STORYBOARD */}
            <article
              onMouseEnter={() => onSetCursorLabel('STORYBOARD ↗')}
              onMouseMove={(e) => handlePillarMouseMove('storyboard', e)}
              onMouseLeave={() => handlePillarMouseLeave('storyboard')}
              onClick={() => toggleTouchExpand('storyboard')}
              className="group relative min-h-[380px] sm:min-h-[420px] rounded-2xl overflow-hidden border transition-all duration-300 ease-out cursor-pointer"
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
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/40 transition-opacity duration-300 group-hover:opacity-95"
              />

              {/* Minimalist Resting Header: Badge + Live Dot */}
              <div className="relative z-10 p-6 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/15 font-mono text-[10px] font-bold uppercase tracking-wider text-white">
                  <span className="w-2 h-2 rounded-full bg-[#e11d48] animate-pulse" />
                  {t.home.pillarCards.storyboardBadge}
                </span>
                <Film className="w-4 h-4 text-white/80 group-hover:text-[#e11d48] transition-colors" />
              </div>

              {/* Minimalist Resting Title (fades/slides cleanly as Hover Drawer reveals) */}
              <div
                className={`absolute bottom-0 left-0 right-0 z-10 p-6 transition-all duration-300 ease-out ${
                  expandedPillar === 'storyboard'
                    ? 'opacity-0 translate-y-4 pointer-events-none'
                    : 'group-hover:opacity-0 group-hover:translate-y-4'
                }`}
              >
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  {t.home.pillarCards.storyboardTitle}
                </h3>
              </div>

              {/* Hover-Reveal Glassmorphic Detail Drawer */}
              <div
                onClick={(e) => e.stopPropagation()}
                className={`absolute inset-x-3 bottom-3 z-20 rounded-xl p-5 backdrop-blur-xl border border-white/20 bg-black/75 text-white transition-all duration-300 ease-out space-y-3.5 ${
                  expandedPillar === 'storyboard'
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 translate-y-8 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-lg font-bold tracking-tight text-white">
                    {t.home.pillarCards.storyboardTitle}
                  </h3>
                  <span className="font-mono text-[10px] text-[#f59e0b]">storyboard.handsandhead.com</span>
                </div>

                <p className="text-xs text-zinc-200 leading-relaxed line-clamp-2">
                  {t.home.pillarCards.storyboardSummary}
                </p>

                <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-white/10 text-zinc-200">WebGL2 NLE</span>
                  <span className="px-2 py-0.5 rounded bg-white/10 text-zinc-200">Cloudflare Host</span>
                  <span className="px-2 py-0.5 rounded bg-white/10 text-zinc-200">Easy &amp; Beast</span>
                </div>

                <div className="pt-2 border-t border-white/15 flex items-center justify-between gap-2">
                  <a
                    href="https://storyboard.handsandhead.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('HOME_PILLAR_CTA', { pillar: 'storyboard' })}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors"
                    style={{ backgroundColor: 'var(--hh-accent)', color: 'var(--hh-accent-ink)' }}
                  >
                    <span>{t.home.openStoryboardCta}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => onNavigateTab('handfilm')}
                    className="text-[11px] font-mono text-zinc-300 hover:text-white cursor-pointer"
                  >
                    HandFilm Hub →
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
              className="group relative min-h-[380px] sm:min-h-[420px] rounded-2xl overflow-hidden border transition-all duration-300 ease-out cursor-pointer"
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
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/40 transition-opacity duration-300 group-hover:opacity-95"
              />

              <div className="relative z-10 p-6 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/15 font-mono text-[10px] font-bold uppercase tracking-wider text-white">
                  <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-pulse" />
                  {t.home.pillarCards.b2bBadge}
                </span>
                <Factory className="w-4 h-4 text-white/80 group-hover:text-[#f59e0b] transition-colors" />
              </div>

              <div
                className={`absolute bottom-0 left-0 right-0 z-10 p-6 transition-all duration-300 ease-out ${
                  expandedPillar === 'b2b'
                    ? 'opacity-0 translate-y-4 pointer-events-none'
                    : 'group-hover:opacity-0 group-hover:translate-y-4'
                }`}
              >
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  {t.home.pillarCards.b2bTitle}
                </h3>
              </div>

              <div
                onClick={(e) => e.stopPropagation()}
                className={`absolute inset-x-3 bottom-3 z-20 rounded-xl p-5 backdrop-blur-xl border border-white/20 bg-black/75 text-white transition-all duration-300 ease-out space-y-3.5 ${
                  expandedPillar === 'b2b'
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 translate-y-8 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-lg font-bold tracking-tight text-white">
                    {t.home.pillarCards.b2bTitle}
                  </h3>
                  <span className="font-mono text-[10px] text-[#f59e0b]">b2b.handsandhead.com</span>
                </div>

                <p className="text-xs text-zinc-200 leading-relaxed line-clamp-2">
                  {t.home.pillarCards.b2bSummary}
                </p>

                <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                  {b2bWingModules.map((mod) => (
                    <a
                      key={mod.id}
                      href={`#${mod.id}`}
                      onClick={(e) => handleSectionLinkClick(e, mod.id)}
                      className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-zinc-200 transition-colors"
                    >
                      {t.sections[mod.id]?.title || mod.title}
                    </a>
                  ))}
                </div>

                <div className="pt-2 border-t border-white/15 flex items-center justify-between gap-2">
                  <a
                    href="https://b2b.handsandhead.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('HOME_PILLAR_CTA', { pillar: 'b2b' })}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#f59e0b] hover:bg-[#fbbf24] text-black text-xs font-bold transition-colors"
                  >
                    <span>{t.home.openWingCta}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={buildWhatsAppUrl('B2B Manufacturing & Hardware RFQ')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300"
                  >
                    RFQ WhatsApp ↗
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
              className="group relative min-h-[380px] sm:min-h-[420px] rounded-2xl overflow-hidden border transition-all duration-300 ease-out cursor-pointer"
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
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/40 transition-opacity duration-300 group-hover:opacity-95"
              />

              <div className="relative z-10 p-6 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/15 font-mono text-[10px] font-bold uppercase tracking-wider text-white">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {t.home.pillarCards.appsBadge}
                </span>
                <Compass className="w-4 h-4 text-white/80 group-hover:text-emerald-400 transition-colors" />
              </div>

              <div
                className={`absolute bottom-0 left-0 right-0 z-10 p-6 transition-all duration-300 ease-out ${
                  expandedPillar === 'apps'
                    ? 'opacity-0 translate-y-4 pointer-events-none'
                    : 'group-hover:opacity-0 group-hover:translate-y-4'
                }`}
              >
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  {t.home.pillarCards.appsTitle}
                </h3>
              </div>

              <div
                onClick={(e) => e.stopPropagation()}
                className={`absolute inset-x-3 bottom-3 z-20 rounded-xl p-5 backdrop-blur-xl border border-white/20 bg-black/75 text-white transition-all duration-300 ease-out space-y-3.5 ${
                  expandedPillar === 'apps'
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 translate-y-8 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-lg font-bold tracking-tight text-white">
                    {t.home.pillarCards.appsTitle}
                  </h3>
                  <span className="font-mono text-[10px] text-emerald-400 tabular-nums">
                    {sections.length} PORTALS
                  </span>
                </div>

                <p className="text-xs text-zinc-200 leading-relaxed line-clamp-2">
                  {t.home.pillarCards.appsSummary}
                </p>

                <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                  {quickAppModules.map((mod) => (
                    <a
                      key={mod.id}
                      href={`#${mod.id}`}
                      onClick={(e) => handleSectionLinkClick(e, mod.id)}
                      className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-zinc-200 transition-colors"
                    >
                      {t.sections[mod.id]?.title || mod.title}
                    </a>
                  ))}
                </div>

                <div className="pt-2 border-t border-white/15 flex items-center justify-between gap-2">
                  <a
                    href="#apps"
                    onClick={(e) => handleTabLinkClick(e, 'ecosystem')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white text-black hover:bg-zinc-200 text-xs font-bold transition-colors"
                  >
                    <span>{t.home.openAppsCta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => onNavigateTab('rawx-showcase')}
                    className="text-[11px] font-mono text-[#f59e0b] hover:text-white cursor-pointer"
                  >
                    RAWx (19) →
                  </button>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            4. SEMANTIC SUBDOMAIN DIRECTORY (SEO + LIGHT/DARK BALANCED GRID)
        ════════════════════════════════════════════════════════════════ */}
        <section
          aria-labelledby="hh-directory-heading"
          className="py-8 border-t hh-stagger-4"
          style={{ borderColor: 'var(--hh-border)' }}
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
            <div>
              <p
                className="font-mono text-[11px] uppercase tracking-[0.2em] mb-1"
                style={{ color: 'var(--hh-muted)' }}
              >
                {t.home.directoryEyebrow}
              </p>
              <h2
                id="hh-directory-heading"
                className="text-xl sm:text-2xl font-bold tracking-tight"
                style={{ color: 'var(--hh-text)' }}
              >
                {t.home.directoryTitle} ({sections.length})
              </h2>
            </div>
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
                    className="flex items-center justify-between border-b pb-2 font-mono text-[10.5px] uppercase tracking-[0.18em]"
                    style={{ borderColor: 'var(--hh-border)' }}
                  >
                    <span className="font-semibold" style={{ color: 'var(--hh-accent-2)' }}>
                      {group.label}
                    </span>
                    <span className="tabular-nums" style={{ color: 'var(--hh-muted)' }}>
                      {groupSections.length}
                    </span>
                  </div>

                  <ul className="divide-y" style={{ borderColor: 'var(--hh-border)' }}>
                    {groupSections.map((sec) => {
                      const localized = t.sections[sec.id];
                      return (
                        <li
                          key={sec.id}
                          className="py-2 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
                          style={{ borderColor: 'var(--hh-border)' }}
                        >
                          <div className="min-w-0">
                            <a
                              href={`#${sec.id}`}
                              onClick={(e) => handleSectionLinkClick(e, sec.id)}
                              className="block text-xs font-semibold transition-colors truncate hover:underline"
                              style={{ color: 'var(--hh-text)' }}
                            >
                              {localized?.title || sec.title}
                            </a>
                            <span className="block text-[11px] truncate" style={{ color: 'var(--hh-muted)' }}>
                              {localized?.sub || sec.sub}
                            </span>
                          </div>
                          <a
                            href={sec.dest}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Visit ${sec.title} at ${sec.url}`}
                            className="font-mono text-[10px] inline-flex items-center gap-1 shrink-0 transition-colors hover:opacity-80"
                            style={{ color: 'var(--hh-muted)' }}
                          >
                            <span className="hidden xl:inline">{sec.url}</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
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
            5. ENTERPRISE WHATSAPP ATTRIBUTION BAR ([Via Main Hub])
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
          <div className="space-y-1.5 max-w-2xl">
            <div
              className="font-mono text-[11px] uppercase tracking-[0.2em] font-semibold"
              style={{ color: 'var(--hh-accent-2)' }}
            >
              {t.home.dispatchEyebrow}
            </div>
            <h2
              className="text-xl sm:text-2xl font-bold tracking-tight"
              style={{ color: 'var(--hh-text)' }}
            >
              {t.home.dispatchTitle}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--hh-muted)' }}>
              {t.home.dispatchSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0 font-mono text-xs uppercase tracking-wider">
            <a
              href={whatsappMainHubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('HOME_WHATSAPP_CTA', { source: 'footer_via_main_hub' })}
              className="inline-flex items-center gap-2.5 px-5 py-3 font-bold rounded-xl transition-all hover:scale-[1.02] whitespace-nowrap"
              style={{
                backgroundColor: 'var(--hh-accent)',
                color: 'var(--hh-accent-ink)',
              }}
            >
              <MessageCircle className="w-4 h-4" />
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
