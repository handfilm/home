import React, { useState } from 'react';
import { SectionItem } from '../types';
import { PORTAL_CATEGORIES } from '../data/initialData';
import { ExternalLink, Layers, ArrowRight, Sparkles, Network, List, CheckCircle2 } from 'lucide-react';
import { TranslationDictionary } from '../i18n/translations';
import EcosystemMapView from './EcosystemMapView';
import NewsletterSignup from './NewsletterSignup';
import { trackEvent } from '../services/analytics';
import {
  OFFICIAL_MAILTO_SALES,
  OFFICIAL_PUBLIC_EMAIL,
  OFFICIAL_WHATSAPP_DISPLAY,
  buildOfficialWhatsAppUrl,
} from '../config/officialContactConfig';

interface IndexOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  sections: SectionItem[];
  onSelectSection: (index: number) => void;
  onOpenSectionManager: () => void;
  onOpenSliders?: () => void;
  visitedPortals: string[];
  t: TranslationDictionary;
}

export default function IndexOverlay({
  isOpen,
  onClose,
  sections,
  onSelectSection,
  onOpenSectionManager,
  onOpenSliders,
  visitedPortals,
  t,
}: IndexOverlayProps) {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  if (!isOpen) return null;

  const handleToggleView = (mode: 'list' | 'map') => {
    setViewMode(mode);
    trackEvent('MASTER_INDEX_MAP_TOGGLE', { mode });
  };

  return (
    <div
      id="indexOverlay"
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[110] backdrop-blur-lg flex items-center justify-center p-4 sm:p-6 transition-all duration-500 overflow-y-auto hh-theme-transition"
      style={{
        backgroundColor: 'var(--hh-header-bg)',
        color: 'var(--hh-text)',
      }}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 sm:top-8 right-6 sm:right-10 font-mono text-[11px] tracking-[0.14em] uppercase flex items-center gap-2 hover:opacity-75 transition-opacity cursor-pointer z-20"
        style={{ color: 'var(--hh-text)' }}
      >
        <span>{t.actions.close}</span>
        <span>✕</span>
      </button>

      {/* Index Content Container */}
      <div className="w-full max-w-4xl space-y-6 my-auto pt-12 sm:pt-4">
        {/* Header bar with View Switcher */}
        <div
          className="flex flex-wrap items-center justify-between border-b pb-4 gap-3"
          style={{ borderColor: 'var(--hh-border)' }}
        >
          <div>
            <div className="font-mono text-[11px] sm:text-[12px] tracking-[0.2em] uppercase" style={{ color: 'var(--hh-muted)' }}>
              {t.brand.name} · {t.brand.tagline}
            </div>
            <h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight" style={{ color: 'var(--hh-text)' }}>
              {viewMode === 'list' ? 'MASTER INDEX — ALL ECOSYSTEM SECTIONS' : t.map.title}
            </h2>
          </div>

          <div className="flex items-center gap-3 font-mono">
            {/* List / Map View Switcher */}
            <div
              className="flex items-center p-0.5 rounded-lg border text-xs"
              style={{
                backgroundColor: 'var(--hh-surface)',
                borderColor: 'var(--hh-border)',
              }}
            >
              <button
                onClick={() => handleToggleView('list')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-bold tracking-wider uppercase transition-colors cursor-pointer"
                style={{
                  backgroundColor: viewMode === 'list' ? 'var(--hh-accent)' : 'transparent',
                  color: viewMode === 'list' ? 'var(--hh-accent-ink)' : 'var(--hh-muted)',
                }}
              >
                <List className="w-3.5 h-3.5" />
                <span>{t.map.listView}</span>
              </button>

              <button
                onClick={() => handleToggleView('map')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-bold tracking-wider uppercase transition-colors cursor-pointer"
                style={{
                  backgroundColor: viewMode === 'map' ? 'var(--hh-accent)' : 'transparent',
                  color: viewMode === 'map' ? 'var(--hh-accent-ink)' : 'var(--hh-muted)',
                }}
              >
                <Network className="w-3.5 h-3.5" />
                <span>{t.map.mapView}</span>
              </button>
            </div>

            <button
              onClick={onOpenSectionManager}
              className="text-[11px] font-mono text-emerald-500 hover:underline uppercase cursor-pointer hidden sm:inline"
            >
              {t.nav.addSite}
            </button>
          </div>
        </div>

        {/* View Mode 1: Relational SVG Map View */}
        {viewMode === 'map' ? (
          <EcosystemMapView
            sections={sections}
            onSelectSection={(idx) => {
              onSelectSection(idx);
              onClose();
            }}
            onOpenSliders={() => {
              if (onOpenSliders) {
                onOpenSliders();
                onClose();
              }
            }}
            visitedPortals={visitedPortals}
            t={t}
          />
        ) : (
          /* View Mode 2: Structured List Index */
          <div className="space-y-4">
            {/* Featured RAWx 19 Sliders Engine Banner */}
            {onOpenSliders && (
              <div
                onClick={() => {
                  onOpenSliders();
                  onClose();
                }}
                className="p-4 sm:p-5 rounded-xl border cursor-pointer group transition-all duration-300 shadow-lg flex items-center justify-between"
                style={{
                  backgroundColor: 'var(--hh-surface)',
                  borderColor: 'var(--hh-accent)',
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-lg border flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{
                      backgroundColor: 'var(--hh-bg)',
                      borderColor: 'var(--hh-border)',
                      color: 'var(--hh-accent)',
                    }}
                  >
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono tracking-widest uppercase font-bold" style={{ color: 'var(--hh-accent)' }}>
                        FEATURED ENGINE
                      </span>
                      <span
                        className="text-[9px] px-1.5 py-0.2 rounded font-bold uppercase"
                        style={{
                          backgroundColor: 'var(--hh-accent)',
                          color: 'var(--hh-accent-ink)',
                        }}
                      >
                        19 Drops
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight transition-colors" style={{ color: 'var(--hh-text)' }}>
                      <span className="normal-case">RAWx</span> Master OS · Ultra Slider System v3.0
                    </h3>
                    <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--hh-muted)' }}>
                      21:9 Hero · Matrix · 32:9 Ultra · Zoom-Burst · Inertia · Countdown · Wipes
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold group-hover:translate-x-1 transition-transform" style={{ color: 'var(--hh-accent)' }}>
                  <span>EXPLORE</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            )}

            <div className="space-y-6 font-mono">
              {PORTAL_CATEGORIES.map((catGroup) => {
                const groupSections = sections.filter((s) => catGroup.sectionIds.includes(s.id));
                if (groupSections.length === 0) return null;

                return (
                  <div key={catGroup.key} className="space-y-2">
                    <div
                      className="text-[10px] sm:text-[11px] font-mono tracking-[0.22em] uppercase px-2 pb-1 border-b"
                      style={{
                        color: 'var(--hh-muted)',
                        borderColor: 'var(--hh-border)',
                      }}
                    >
                      {catGroup.label}
                    </div>

                    <div className="space-y-1">
                      {groupSections.map((sec) => {
                        const globalIdx = sections.findIndex((s) => s.id === sec.id);
                        const isVisited = visitedPortals.includes(sec.id);
                        return (
                          <div
                            key={sec.id}
                            onClick={() => {
                              onSelectSection(globalIdx >= 0 ? globalIdx : 0);
                              onClose();
                            }}
                            className="group flex items-center justify-between py-2.5 sm:py-3 px-2 hover:px-3 rounded-lg cursor-pointer transition-all duration-200 border border-transparent hover:border-[var(--hh-border)]"
                          >
                            <div className="flex items-center gap-3 sm:gap-5">
                              <span className="font-mono text-xs sm:text-sm transition-colors w-6 flex-shrink-0 tabular-nums" style={{ color: 'var(--hh-muted)' }}>
                                {String(globalIdx + 1).padStart(2, '0')}
                              </span>
                              {sec.imageUrl && (
                                <div
                                  className="w-10 h-7 rounded bg-cover bg-center border transition-all flex-shrink-0"
                                  style={{
                                    backgroundImage: `url('${sec.imageUrl}')`,
                                    borderColor: 'var(--hh-border)',
                                  }}
                                />
                              )}
                              <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                  <span
                                    className="text-base sm:text-xl font-bold uppercase tracking-tight group-hover:translate-x-1.5 transition-transform duration-200"
                                    style={{ color: 'var(--hh-text)' }}
                                  >
                                    {sec.title}
                                  </span>
                                  {isVisited && (
                                    <span className="text-[8.5px] text-emerald-500 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/25 flex items-center gap-1">
                                      <CheckCircle2 className="w-2.5 h-2.5" />
                                      <span className="hidden sm:inline">VISITED</span>
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] sm:text-[11px] truncate max-w-md hidden sm:block" style={{ color: 'var(--hh-muted)' }}>
                                  {sec.sub}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 font-mono text-[10.5px]" style={{ color: 'var(--hh-muted)' }}>
                              <span className="hidden md:inline-block">{sec.url}</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-all" style={{ color: 'var(--hh-text)' }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Newsletter Signup Section */}
        <NewsletterSignup t={t} />

        {/* Footer info */}
        <div
          className="pt-3 border-t flex flex-wrap items-center justify-between font-mono text-[10.5px] uppercase"
          style={{
            borderColor: 'var(--hh-border)',
            color: 'var(--hh-muted)',
          }}
        >
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>Hands &amp; Head Digital Platform · Master OS v3.2</span>
            <span aria-hidden="true">·</span>
            <a href={OFFICIAL_MAILTO_SALES} className="hover:underline normal-case">
              {OFFICIAL_PUBLIC_EMAIL}
            </a>
            <span aria-hidden="true">·</span>
            <a
              href={buildOfficialWhatsAppUrl('general')}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              WA {OFFICIAL_WHATSAPP_DISPLAY}
            </a>
          </span>
          <span>Press ESC or click outside to close</span>
        </div>
      </div>
    </div>
  );
}
// END OF FILE: src/components/IndexOverlay.tsx
