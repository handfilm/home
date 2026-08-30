import React, { useState } from 'react';
import { SectionItem } from '../types';
import { PORTAL_CATEGORIES } from '../data/initialData';
import { ExternalLink, Layers, ArrowRight, Sparkles, Network, List, CheckCircle2 } from 'lucide-react';
import { TranslationDictionary } from '../i18n/translations';
import EcosystemMapView from './EcosystemMapView';
import NewsletterSignup from './NewsletterSignup';
import { trackEvent } from '../services/analytics';

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
      className="fixed inset-0 z-[110] bg-[#0e0d0b]/98 backdrop-blur-lg flex items-center justify-center p-4 sm:p-6 transition-all duration-500 overflow-y-auto"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 sm:top-8 right-6 sm:right-10 text-[#f3efe6] font-mono text-[11px] tracking-[0.14em] uppercase flex items-center gap-2 hover:opacity-75 transition-opacity cursor-pointer z-20"
      >
        <span>{t.actions.close}</span>
        <span>✕</span>
      </button>

      {/* Index Content Container */}
      <div className="w-full max-w-4xl space-y-6 my-auto pt-12 sm:pt-4">
        {/* Header bar with View Switcher */}
        <div className="flex flex-wrap items-center justify-between border-b border-[#f3efe6]/15 pb-4 gap-3">
          <div>
            <div className="font-mono text-[11px] sm:text-[12px] text-[#f3efe6]/60 tracking-[0.2em] uppercase">
              {t.brand.name} · {t.brand.tagline}
            </div>
            <h2 className="text-lg sm:text-xl font-bold uppercase text-[#f3efe6] tracking-tight">
              {viewMode === 'list' ? 'MASTER INDEX — ALL ECOSYSTEM SECTIONS' : t.map.title}
            </h2>
          </div>

          <div className="flex items-center gap-3 font-mono">
            {/* List / Map View Switcher */}
            <div className="flex items-center p-0.5 rounded-lg bg-[#181613] border border-[#f3efe6]/15 text-xs">
              <button
                onClick={() => handleToggleView('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-bold tracking-wider uppercase transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-[#f3efe6] text-[#0e0d0b]'
                    : 'text-[#f3efe6]/60 hover:text-[#f3efe6]'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>{t.map.listView}</span>
              </button>

              <button
                onClick={() => handleToggleView('map')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-bold tracking-wider uppercase transition-colors cursor-pointer ${
                  viewMode === 'map'
                    ? 'bg-[#c8b89a] text-[#0e0d0b]'
                    : 'text-[#f3efe6]/60 hover:text-[#f3efe6]'
                }`}
              >
                <Network className="w-3.5 h-3.5" />
                <span>{t.map.mapView}</span>
              </button>
            </div>

            <button
              onClick={onOpenSectionManager}
              className="text-[11px] font-mono text-emerald-400 hover:underline uppercase cursor-pointer hidden sm:inline"
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
            {/* Featured RAWx 16 Sliders Engine Banner */}
            {onOpenSliders && (
              <div
                onClick={() => {
                  onOpenSliders();
                  onClose();
                }}
                className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-amber-950/40 via-[#161512] to-amber-950/20 border border-amber-500/40 hover:border-amber-400 cursor-pointer group transition-all duration-300 shadow-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono tracking-widest text-amber-400 uppercase font-bold">
                        FEATURED ENGINE
                      </span>
                      <span className="text-[9px] bg-amber-400 text-black px-1.5 py-0.2 rounded font-bold uppercase">
                        16 Types
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold uppercase text-[#f3efe6] tracking-tight group-hover:text-amber-300 transition-colors">
                      RAWx Master OS · Ultra Slider System v3.0
                    </h3>
                    <p className="text-xs text-[#f3efe6]/60 font-mono mt-0.5">
                      21:9 Hero · Matrix · 32:9 Ultra · Zoom-Burst · Inertia · Countdown · Wipes
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold group-hover:translate-x-1 transition-transform">
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
                    <div className="text-[10px] sm:text-[11px] font-mono tracking-[0.22em] text-[#f3efe6]/40 uppercase px-2 pb-1 border-b border-[#f3efe6]/10">
                      {catGroup.label}
                    </div>

                    <div className="space-y-1 divide-y divide-[#f3efe6]/5">
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
                            className="group flex items-center justify-between py-2.5 sm:py-3 px-2 hover:px-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-[#f3efe6]/5"
                          >
                            <div className="flex items-center gap-3 sm:gap-5">
                              <span className="font-mono text-xs sm:text-sm text-[#f3efe6]/40 group-hover:text-[#f3efe6] transition-colors w-6 flex-shrink-0">
                                {String(globalIdx + 1).padStart(2, '0')}
                              </span>
                              {sec.imageUrl && (
                                <div
                                  className="w-10 h-7 rounded bg-cover bg-center border border-[#f3efe6]/20 group-hover:border-[#f3efe6]/60 transition-all flex-shrink-0"
                                  style={{ backgroundImage: `url('${sec.imageUrl}')` }}
                                />
                              )}
                              <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                  <span
                                    className="text-base sm:text-xl font-bold uppercase tracking-tight text-[#f3efe6] group-hover:translate-x-1.5 transition-transform duration-200"
                                  >
                                    {sec.title}
                                  </span>
                                  {isVisited && (
                                    <span className="text-[8.5px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20 flex items-center gap-1">
                                      <CheckCircle2 className="w-2.5 h-2.5" />
                                      <span className="hidden sm:inline">VISITED</span>
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] sm:text-[11px] text-[#f3efe6]/50 truncate max-w-md hidden sm:block">
                                  {sec.sub}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 font-mono text-[10.5px] text-[#f3efe6]/50">
                              <span className="hidden md:inline-block">{sec.url}</span>
                              <ArrowRight className="w-3.5 h-3.5 text-[#f3efe6]/40 group-hover:text-[#f3efe6] group-hover:translate-x-1 transition-all" />
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
        <div className="pt-3 border-t border-[#f3efe6]/10 flex flex-wrap items-center justify-between font-mono text-[10.5px] text-[#f3efe6]/40 uppercase">
          <span>Hands &amp; Head Digital Platform · Master OS v3.2</span>
          <span>Press ESC or click outside to close</span>
        </div>
      </div>
    </div>
  );
}
