import React, { useState, useEffect } from 'react';
import { SectionItem } from '../types';
import { TranslationDictionary } from '../i18n/translations';
import { ArrowRight, X, Sparkles } from 'lucide-react';
import { getStoredVisitorState } from '../services/visitorState';

interface ReturningVisitorBannerProps {
  sections: SectionItem[];
  onSelectSection: (index: number) => void;
  t: TranslationDictionary;
}

export default function ReturningVisitorBanner({
  sections,
  onSelectSection,
  t,
}: ReturningVisitorBannerProps) {
  const [targetPortal, setTargetPortal] = useState<{ index: number; section: SectionItem } | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const state = getStoredVisitorState();
    if (state.lastVisitedPortalId && state.visitCount > 1) {
      const idx = sections.findIndex((s) => s.id === state.lastVisitedPortalId);
      if (idx !== -1 && sections[idx]) {
        setTargetPortal({ index: idx, section: sections[idx] });
        // Reveal with slight delay
        const showTimer = setTimeout(() => setIsVisible(true), 1200);
        // Auto dismiss after 8 seconds
        const hideTimer = setTimeout(() => setIsVisible(false), 9500);

        return () => {
          clearTimeout(showTimer);
          clearTimeout(hideTimer);
        };
      }
    }
  }, [sections]);

  if (!targetPortal || !isVisible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-22 left-4 sm:left-8 z-40 max-w-sm font-mono animate-slideUp pointer-events-auto"
    >
      <div
        className="p-3.5 rounded-xl backdrop-blur-md border shadow-2xl flex items-center justify-between gap-3 text-xs hh-theme-transition"
        style={{
          backgroundColor: 'var(--hh-glass-bg)',
          borderColor: 'var(--hh-border)',
          color: 'var(--hh-text)',
        }}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: targetPortal.section.accent || 'var(--hh-accent)' }}
          />
          <div className="truncate">
            <div className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--hh-accent)' }}>
              {t.returning.welcomeBack}
            </div>
            <div className="font-semibold truncate" style={{ color: 'var(--hh-text)' }}>
              {t.returning.continueTo} <span className="underline">{targetPortal.section.title}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => {
              onSelectSection(targetPortal.index);
              setIsVisible(false);
            }}
            className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded transition-all cursor-pointer flex items-center gap-1"
            style={{
              backgroundColor: 'var(--hh-accent)',
              color: 'var(--hh-accent-ink)',
            }}
          >
            <span>JUMP</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <button
            onClick={() => setIsVisible(false)}
            className="p-1 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
            style={{ color: 'var(--hh-text)' }}
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
