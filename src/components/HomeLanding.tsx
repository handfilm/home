import React, { useState, useEffect, useMemo } from 'react';
import { ActiveTab, SectionItem, SyncState } from '../types';
import { PORTAL_CATEGORIES } from '../data/initialData';
import { TranslationDictionary } from '../i18n/translations';
import { trackEvent } from '../services/analytics';
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
  t: TranslationDictionary;
}

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

export default function HomeLanding({
  sections,
  syncState,
  tasksCount,
  onNavigateTab,
  onJumpToSection,
  onOpenSyncModal,
  onOpenCommandPalette,
  onSetCursorLabel,
  t,
}: HomeLandingProps) {
  const [clockUtc, setClockUtc] = useState<string>(() => new Date().toISOString().slice(11, 19));

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

  return (
    <div
      className="relative min-h-screen w-full bg-[#0A0B0D] text-[#f3efe6] pt-[65px] pb-28 selection:bg-[#E50914] selection:text-white"
      onMouseEnter={() => onSetCursorLabel('EXPLORE →')}
    >
      {/* Subtle Architectural Grid Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.045]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(243,239,230,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(243,239,230,0.6) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      {/* Crimson & Gold Ambient Top Rim */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[65px] left-0 right-0 h-[440px] z-0"
        style={{
          background:
            'radial-gradient(ellipse 68% 50% at 22% 0%, rgba(229, 9, 20, 0.14), transparent 70%), radial-gradient(ellipse 55% 45% at 82% 10%, rgba(200, 169, 106, 0.12), transparent 70%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1380px] px-4 sm:px-8 lg:px-12">
        {/* ════════════════════════════════════════════════════════════════
            1. EXECUTIVE HERO — TECH-FIRST ENTERPRISE OVERVIEW
        ════════════════════════════════════════════════════════════════ */}
        <section
          aria-labelledby="hh-hero-heading"
          className="pt-10 sm:pt-14 lg:pt-16 pb-10 sm:pb-12 border-b border-[#f3efe6]/10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Left Dominant Focal Copy */}
            <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] tracking-[0.22em] uppercase text-[#C8A96A]">
                  <span className="font-semibold">HANDS &amp; HEAD ENTERPRISE OS</span>
                  <span aria-hidden="true" className="text-[#f3efe6]/25">·</span>
                  <span className="text-[#f3efe6]/60">HANDSANDHEAD.COM</span>
                  <span aria-hidden="true" className="text-[#f3efe6]/25">·</span>
                  <span className="text-[#f3efe6]/60 tabular-nums">{sections.length} ACTIVE MODULES</span>
                </div>

                <h1
                  id="hh-hero-heading"
                  className="font-bold tracking-tight text-[#f3efe6] leading-[0.94] max-w-3xl"
                  style={{
                    fontSize: 'clamp(2.65rem, 5.6vw, 4.85rem)',
                    textWrap: 'balance',
                  }}
                >
                  HANDS &amp; HEAD
                  <span className="block serif-display italic font-normal text-[#C8A96A] mt-2.5 text-[0.52em] leading-[1.12] tracking-[0.01em]">
                    One Core, Many Worlds.
                  </span>
                </h1>

                <p className="text-[15px] sm:text-[16px] text-[#f3efe6]/76 max-w-2xl leading-[1.65]">
                  Unified WebGL2 Cinema Engine, Direct-from-Source Industrial B2B Wings, and a 24-Module Ecosystem engineered to run on one zero-latency enterprise operating core.
                </p>
              </div>

              {/* Primary Action Row */}
              <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs tracking-wider uppercase">
                <a
                  href="#apps"
                  onClick={(e) => handleTabLinkClick(e, 'ecosystem')}
                  onMouseEnter={() => onSetCursorLabel('OPEN 24 APPS →')}
                  className="inline-flex items-center gap-2.5 px-5 py-3 bg-[#E50914] hover:bg-[#ff1f2b] text-white font-bold rounded transition-colors duration-150 whitespace-nowrap shrink-0 shadow-[0_0_28px_rgba(229,9,20,0.28)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E50914]"
                >
                  <Layers className="w-4 h-4" />
                  <span>Explore {sections.length} Ecosystem Apps</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#sliders"
                  onClick={(e) => handleTabLinkClick(e, 'rawx-showcase')}
                  onMouseEnter={() => onSetCursorLabel('OPEN 16 SLIDERS →')}
                  className="inline-flex items-center gap-2 px-4 py-3 bg-[#14161A] hover:bg-[#1c1f25] text-[#C8A96A] border border-[#C8A96A]/35 hover:border-[#C8A96A] font-semibold rounded transition-colors duration-150 whitespace-nowrap shrink-0"
                >
                  <Sliders className="w-4 h-4" />
                  <span>16 Sliders Engine</span>
                </a>

                <a
                  href={whatsappMainHubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('HOME_WHATSAPP_CTA', { source: 'hero_via_main_hub' })}
                  onMouseEnter={() => onSetCursorLabel('WHATSAPP HUB ↗')}
                  className="inline-flex items-center gap-2 px-4 py-3 bg-[#14161A] hover:bg-[#1c1f25] text-[#f3efe6] border border-[#f3efe6]/15 hover:border-emerald-400/60 font-semibold rounded transition-colors duration-150 whitespace-nowrap shrink-0"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp Concierge</span>
                  <span className="text-[10px] text-[#C8A96A] font-normal">[Via Main Hub]</span>
                </a>
              </div>
            </div>

            {/* Right Architectural Summary Plate */}
            <div className="lg:col-span-4 bg-[#14161A] border border-[#f3efe6]/10 rounded-lg p-5 sm:p-6 flex flex-col justify-between gap-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#f3efe6]/10 pb-3 font-mono text-[11px] tracking-[0.16em] uppercase">
                  <span className="text-[#C8A96A] font-semibold">OS ROUTING MATRIX</span>
                  <span className="text-[#f3efe6]/45 tabular-nums">3 SHELLS · {sections.length} NODES</span>
                </div>

                <dl className="space-y-3 font-mono text-xs">
                  <div className="flex items-baseline justify-between gap-4 border-b border-[#f3efe6]/5 pb-2.5">
                    <dt className="text-[#f3efe6]/50 uppercase tracking-wider text-[10.5px]">Cinema &amp; WebGL2</dt>
                    <dd className="text-right">
                      <a
                        href="https://storyboard.handsandhead.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#f3efe6] hover:text-[#E50914] transition-colors inline-flex items-center gap-1"
                      >
                        <span>storyboard.handsandhead.com</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </dd>
                  </div>

                  <div className="flex items-baseline justify-between gap-4 border-b border-[#f3efe6]/5 pb-2.5">
                    <dt className="text-[#f3efe6]/50 uppercase tracking-wider text-[10.5px]">B2B Industrial</dt>
                    <dd className="text-right">
                      <a
                        href="https://b2b.handsandhead.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#f3efe6] hover:text-[#C8A96A] transition-colors inline-flex items-center gap-1"
                      >
                        <span>b2b.handsandhead.com</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </dd>
                  </div>

                  <div className="flex items-baseline justify-between gap-4 border-b border-[#f3efe6]/5 pb-2.5">
                    <dt className="text-[#f3efe6]/50 uppercase tracking-wider text-[10.5px]">Consumer D2C</dt>
                    <dd className="text-right">
                      <a
                        href="https://d2c.handsandhead.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#f3efe6] hover:text-[#C8A96A] transition-colors inline-flex items-center gap-1"
                      >
                        <span>d2c.handsandhead.com</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </dd>
                  </div>

                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-[#f3efe6]/50 uppercase tracking-wider text-[10.5px]">Sync Mesh Room</dt>
                    <dd className="text-right text-emerald-400 font-semibold tabular-nums">
                      {syncState.roomId} ({syncState.deviceCount} {syncState.deviceCount === 1 ? 'DEV' : 'DEVS'})
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#f3efe6]/10 font-mono text-[10.5px]">
                <button
                  type="button"
                  onClick={onOpenCommandPalette}
                  className="inline-flex items-center gap-1.5 text-[#f3efe6]/70 hover:text-[#f3efe6] transition-colors cursor-pointer"
                >
                  <Terminal className="w-3.5 h-3.5 text-[#C8A96A]" />
                  <span>Command Palette (⌘K)</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenSyncModal}
                  className="inline-flex items-center gap-1.5 text-[#C8A96A] hover:text-white transition-colors cursor-pointer"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Pair Device</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            2. LIVE SYSTEM TELEMETRY STRIP (MATCHING OS STATUS BAR)
        ════════════════════════════════════════════════════════════════ */}
        <section
          aria-label="Live System Telemetry"
          className="my-6 bg-[#14161A]/95 border border-[#f3efe6]/10 rounded-lg px-4 sm:px-6 py-3 font-mono text-[11px] tracking-wider"
        >
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
            <button
              type="button"
              onClick={onOpenSyncModal}
              className="flex items-center gap-2.5 text-left hover:text-white transition-colors cursor-pointer group"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span
                  className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    syncState.isConnected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    syncState.isConnected ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
              </span>
              <div className="min-w-0">
                <div className="text-[9.5px] uppercase text-[#f3efe6]/45">SYNC MESH</div>
                <div className="text-[#f3efe6] font-semibold truncate tabular-nums">
                  {syncState.isConnected ? 'ONLINE' : 'LOCAL'} · {syncState.roomId}
                </div>
              </div>
            </button>

            <a
              href="#apps"
              onClick={(e) => handleTabLinkClick(e, 'ecosystem')}
              className="block hover:text-white transition-colors"
            >
              <div className="text-[9.5px] uppercase text-[#f3efe6]/45">ECOSYSTEM STAGE</div>
              <div className="text-[#f3efe6] font-semibold tabular-nums">
                {sections.length} PORTALS · 6 WINGS
              </div>
            </a>

            <a
              href="#sliders"
              onClick={(e) => handleTabLinkClick(e, 'rawx-showcase')}
              className="block hover:text-[#C8A96A] transition-colors"
            >
              <div className="text-[9.5px] uppercase text-[#f3efe6]/45">VISUAL ENGINE</div>
              <div className="text-[#C8A96A] font-semibold tabular-nums">16 ULTRA SLIDERS</div>
            </a>

            <a
              href="#tasks"
              onClick={(e) => handleTabLinkClick(e, 'tasks-hub')}
              className="block hover:text-white transition-colors"
            >
              <div className="text-[9.5px] uppercase text-[#f3efe6]/45">ACTIVE TASKS</div>
              <div className="text-[#f3efe6] font-semibold tabular-nums flex items-center gap-1.5">
                <CheckSquare className="w-3 h-3 text-emerald-400" />
                <span>
                  {tasksCount.pending} OPEN / {tasksCount.total} TOTAL
                </span>
              </div>
            </a>

            <div className="col-span-2 md:col-span-1 md:text-right border-t md:border-t-0 border-[#f3efe6]/10 pt-2 md:pt-0">
              <div className="text-[9.5px] uppercase text-[#f3efe6]/45">MASTER CLOCK (UTC)</div>
              <div className="text-[#f3efe6] font-semibold tabular-nums">{clockUtc} UTC</div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            3. THREE CORE ENTERPRISE PILLARS (GLASS / OBSIDIAN CARDS)
        ════════════════════════════════════════════════════════════════ */}
        <section aria-labelledby="hh-pillars-heading" className="py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#C8A96A] mb-1.5">
                CORE ARCHITECTURE
              </p>
              <h2
                id="hh-pillars-heading"
                className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f3efe6]"
              >
                Three Enterprise Operating Pillars
              </h2>
            </div>
            <p className="font-mono text-[11px] text-[#f3efe6]/50 uppercase tracking-wider">
              Direct Subdomain Links &amp; Zero-Latency OS Triggers
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* PILLAR 01 — HANDFILM & STORYBOARD */}
            <article
              onMouseEnter={() => onSetCursorLabel('STORYBOARD ↗')}
              className="group relative bg-[#14161A]/90 backdrop-blur-md border border-[#f3efe6]/12 hover:border-[#E50914]/80 hover:-translate-y-0.5 rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-200 shadow-lg hover:shadow-[0_14px_40px_rgba(229,9,20,0.14)]"
            >
              {/* Card Media Header */}
              <div className="relative h-44 w-full overflow-hidden bg-[#0e1014]">
                <img
                  src={handFilmPoster}
                  alt="Handfilm and Storyboard WebGL2 AI Video Platform preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-65 group-hover:opacity-85 group-hover:scale-[1.04] transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#14161A] via-[#14161A]/45 to-transparent" />
                <div className="absolute top-4 left-5 right-5 flex items-center justify-between font-mono text-[11px] tracking-[0.16em]">
                  <span className="text-[#E50914] font-bold">01 // HANDFILM &amp; STORYBOARD</span>
                  <Film className="w-4 h-4 text-[#f3efe6]/70 group-hover:text-[#E50914] transition-colors" />
                </div>
                <div className="absolute bottom-3 left-5 font-mono text-[11px] text-[#f3efe6]/75">
                  storyboard.handsandhead.com
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-5">
                <div className="space-y-3">
                  <h3 className="text-xl font-bold tracking-tight text-[#f3efe6]">
                    <a
                      href="https://storyboard.handsandhead.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackEvent('HOME_PILLAR_CLICK', { pillar: 'storyboard' })}
                      className="hover:text-[#E50914] transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>HANDFILM &amp; STORYBOARD</span>
                      <ArrowUpRight className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  </h3>
                  <p className="text-sm text-[#f3efe6]/72 leading-relaxed">
                    Browser-based WebGL2 AI Video Platform, NLE Editor, Player &amp; Cloudflare Video Host engineered for zero-install cinema pipelines.
                  </p>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] text-[#f3efe6]/50 pt-1">
                    <span>WebGL2 AI Video</span>
                    <span aria-hidden="true">·</span>
                    <span>NLE Editor &amp; Player</span>
                    <span aria-hidden="true">·</span>
                    <span>Cloudflare Host</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#f3efe6]/10 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] uppercase tracking-wider">
                  <a
                    href="https://storyboard.handsandhead.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('HOME_PILLAR_CTA', { pillar: 'storyboard' })}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#E50914] hover:bg-[#ff1f2b] text-white font-bold rounded transition-colors whitespace-nowrap"
                  >
                    <span>Open Storyboard</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="#sliders"
                    onClick={(e) => handleTabLinkClick(e, 'rawx-showcase')}
                    className="inline-flex items-center gap-1 text-[#C8A96A] hover:text-white transition-colors whitespace-nowrap py-1.5"
                  >
                    <span>16 Sliders Engine</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </article>

            {/* PILLAR 02 — B2B & INDUSTRIAL WINGS */}
            <article
              onMouseEnter={() => onSetCursorLabel('B2B WINGS ↗')}
              className="group relative bg-[#14161A]/90 backdrop-blur-md border border-[#f3efe6]/12 hover:border-[#C8A96A]/80 hover:-translate-y-0.5 rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-200 shadow-lg hover:shadow-[0_14px_40px_rgba(200,169,106,0.14)]"
            >
              {/* Card Media Header */}
              <div className="relative h-44 w-full overflow-hidden bg-[#0e1014]">
                <img
                  src={b2bLeatherImg}
                  alt="Hands and Head B2B Industrial Manufacturing, Leather and Hardware Wings"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-65 group-hover:opacity-85 group-hover:scale-[1.04] transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#14161A] via-[#14161A]/45 to-transparent" />
                <div className="absolute top-4 left-5 right-5 flex items-center justify-between font-mono text-[11px] tracking-[0.16em]">
                  <span className="text-[#C8A96A] font-bold">02 // B2B &amp; INDUSTRIAL WINGS</span>
                  <Factory className="w-4 h-4 text-[#f3efe6]/70 group-hover:text-[#C8A96A] transition-colors" />
                </div>
                <div className="absolute bottom-3 left-5 font-mono text-[11px] text-[#f3efe6]/75">
                  b2b.handsandhead.com
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-5">
                <div className="space-y-3">
                  <h3 className="text-xl font-bold tracking-tight text-[#f3efe6]">
                    <a
                      href="https://b2b.handsandhead.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackEvent('HOME_PILLAR_CLICK', { pillar: 'b2b' })}
                      className="hover:text-[#C8A96A] transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>B2B &amp; INDUSTRIAL WINGS</span>
                      <ArrowUpRight className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  </h3>
                  <p className="text-sm text-[#f3efe6]/72 leading-relaxed">
                    Direct-from-source RMG, Heavyweight Streetwear, Genuine Leather, Custom Jackets &amp; 316L/516SS Hardware Wings with export-grade factory execution.
                  </p>

                  {/* Quick Wing Jump Row */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-1 font-mono text-[11px]">
                    {b2bWingModules.map((mod) => (
                      <a
                        key={mod.id}
                        href={`#${mod.id}`}
                        onClick={(e) => handleSectionLinkClick(e, mod.id)}
                        className="text-[#f3efe6]/65 hover:text-[#C8A96A] underline decoration-[#f3efe6]/20 hover:decoration-[#C8A96A] underline-offset-4 transition-colors"
                      >
                        {mod.title}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#f3efe6]/10 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] uppercase tracking-wider">
                  <a
                    href="https://b2b.handsandhead.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('HOME_PILLAR_CTA', { pillar: 'b2b' })}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#C8A96A] hover:bg-[#dfc286] text-[#0A0B0D] font-bold rounded transition-colors whitespace-nowrap"
                  >
                    <span>Enter B2B Hub</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={buildWhatsAppUrl('B2B Manufacturing & Hardware RFQ')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#f3efe6]/70 hover:text-emerald-400 transition-colors whitespace-nowrap py-1.5"
                  >
                    <span>RFQ WhatsApp</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </article>

            {/* PILLAR 03 — ECOSYSTEM APPS (24 MODULES) */}
            <article
              onMouseEnter={() => onSetCursorLabel('24 APPS →')}
              className="group relative bg-[#14161A]/90 backdrop-blur-md border border-[#f3efe6]/12 hover:border-[#f3efe6]/55 hover:-translate-y-0.5 rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-200 shadow-lg hover:shadow-[0_14px_40px_rgba(243,239,230,0.08)]"
            >
              {/* Card Media Header */}
              <div className="relative h-44 w-full overflow-hidden bg-[#0e1014]">
                <img
                  src={rawxEditorialImg}
                  alt="Hands and Head 24 Ecosystem Modules and Stage Slider Engine"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-65 group-hover:opacity-85 group-hover:scale-[1.04] transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#14161A] via-[#14161A]/45 to-transparent" />
                <div className="absolute top-4 left-5 right-5 flex items-center justify-between font-mono text-[11px] tracking-[0.16em]">
                  <span className="text-[#f3efe6] font-bold">03 // ECOSYSTEM APPS</span>
                  <Compass className="w-4 h-4 text-[#C8A96A]" />
                </div>
                <div className="absolute bottom-3 left-5 font-mono text-[11px] text-[#C8A96A] tabular-nums">
                  {sections.length} Modules · Ultra-Fast Stage Engine
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-5">
                <div className="space-y-3">
                  <h3 className="text-xl font-bold tracking-tight text-[#f3efe6]">
                    <a
                      href="#apps"
                      onClick={(e) => handleTabLinkClick(e, 'ecosystem')}
                      className="hover:text-[#C8A96A] transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>ECOSYSTEM APPS ({sections.length})</span>
                      <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </h3>
                  <p className="text-sm text-[#f3efe6]/72 leading-relaxed">
                    Zero-latency 24-section horizontal OS Stage connecting D2C commerce, botanical concierge, acoustic labs, editorial dispatches, and internal cloud apps.
                  </p>

                  {/* Direct Module Quick-Launch Triggers (BLOOM, AURAL, D2C, etc.) */}
                  <div className="space-y-1.5 pt-1">
                    <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#f3efe6]/45">
                      Direct Stage Jump
                    </div>
                    <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                      {quickAppModules.map((mod) => (
                        <a
                          key={mod.id}
                          href={`#${mod.id}`}
                          onClick={(e) => handleSectionLinkClick(e, mod.id)}
                          className="px-2.5 py-1 bg-[#0A0B0D] hover:bg-[#1e2128] border border-[#f3efe6]/12 hover:border-[#C8A96A]/60 text-[#f3efe6]/85 hover:text-white rounded transition-colors whitespace-nowrap"
                        >
                          {mod.title}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#f3efe6]/10 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] uppercase tracking-wider">
                  <a
                    href="#apps"
                    onClick={(e) => handleTabLinkClick(e, 'ecosystem')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#f3efe6] hover:bg-white text-[#0A0B0D] font-bold rounded transition-colors whitespace-nowrap"
                  >
                    <span>Open Apps Stage</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="#tasks"
                    onClick={(e) => handleTabLinkClick(e, 'tasks-hub')}
                    className="inline-flex items-center gap-1 text-[#f3efe6]/70 hover:text-emerald-400 transition-colors whitespace-nowrap py-1.5"
                  >
                    <span>Task Sync ({tasksCount.pending})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            4. SEMANTIC SUBDOMAIN DIRECTORY (SEO CRAWLABILITY + FAST JUMP)
        ════════════════════════════════════════════════════════════════ */}
        <section
          aria-labelledby="hh-directory-heading"
          className="py-8 border-t border-[#f3efe6]/10"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#f3efe6]/50 mb-1">
                ECOSYSTEM TOPOLOGY
              </p>
              <h2
                id="hh-directory-heading"
                className="text-xl sm:text-2xl font-bold tracking-tight text-[#f3efe6]"
              >
                All {sections.length} Active Hands &amp; Head Portals
              </h2>
            </div>
            <div className="flex items-center gap-4 font-mono text-[11px]">
              <a
                href="https://storyboard.handsandhead.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E50914] hover:underline inline-flex items-center gap-1 whitespace-nowrap"
              >
                <span>storyboard.handsandhead.com</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
              <a
                href="https://b2b.handsandhead.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C8A96A] hover:underline inline-flex items-center gap-1 whitespace-nowrap"
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
                  className="bg-[#14161A]/80 border border-[#f3efe6]/10 rounded-lg p-4 sm:p-5 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between border-b border-[#f3efe6]/10 pb-2 font-mono text-[10.5px] uppercase tracking-[0.18em]">
                    <span className="text-[#C8A96A] font-semibold">{group.label}</span>
                    <span className="text-[#f3efe6]/40 tabular-nums">{groupSections.length}</span>
                  </div>

                  <ul className="divide-y divide-[#f3efe6]/5">
                    {groupSections.map((sec) => {
                      const localized = t.sections[sec.id];
                      return (
                        <li key={sec.id} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <a
                              href={`#${sec.id}`}
                              onClick={(e) => handleSectionLinkClick(e, sec.id)}
                              className="block text-xs font-semibold text-[#f3efe6] hover:text-[#C8A96A] transition-colors truncate"
                            >
                              {localized?.title || sec.title}
                            </a>
                            <span className="block text-[11px] text-[#f3efe6]/45 truncate">
                              {localized?.sub || sec.sub}
                            </span>
                          </div>
                          <a
                            href={sec.dest}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Visit ${sec.title} at ${sec.url}`}
                            className="font-mono text-[10px] text-[#f3efe6]/50 hover:text-white inline-flex items-center gap-1 shrink-0 transition-colors"
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
          className="mt-4 bg-[#14161A] border border-[#f3efe6]/12 rounded-xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div className="space-y-1.5 max-w-2xl">
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#C8A96A]">
              DIRECT ENTERPRISE DISPATCH · [Via Main Hub]
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#f3efe6] tracking-tight">
              Need B2B Sourcing, Handfilm Production, or Custom OS Integration?
            </h2>
            <p className="text-sm text-[#f3efe6]/68 leading-relaxed">
              Connect directly with the HANDS &amp; HEAD executive operations desk on WhatsApp with automatic Main Hub routing attribution.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0 font-mono text-xs uppercase tracking-wider">
            <a
              href={whatsappMainHubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('HOME_WHATSAPP_CTA', { source: 'footer_via_main_hub' })}
              className="inline-flex items-center gap-2.5 px-5 py-3 bg-[#E50914] hover:bg-[#ff1f2b] text-white font-bold rounded transition-colors whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Message on WhatsApp [Via Main Hub]</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
