import React, { useState, useEffect, useMemo } from 'react';
import { ColorGrade, DropMetadata, RawxSizingType, SlideData } from '../../types';
import { GRADES } from '../../data/initialData';
import { LightboxItem } from '../LightboxModal';
import { trackEvent } from '../../services/analytics';
import {
  X,
  Maximize2,
  ExternalLink,
  Share2,
  Bookmark,
  BookmarkCheck,
  MessageCircle,
  ShieldCheck,
  Minus,
  Plus,
  Layers,
  Sparkles,
  Check,
} from 'lucide-react';

interface RawxProductDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  dropMeta: DropMetadata | null;
  slides: SlideData[];
  initialSlideIndex?: number;
  activeGrade: ColorGrade;
  isSaved: boolean;
  onToggleSave: (dropId: string) => void;
  onOpenLightbox: (items: LightboxItem[], startIndex: number) => void;
  onCopyDropLink: (dropId: string) => void;
}

const SIZE_OPTIONS: Record<RawxSizingType, readonly string[]> = {
  apparel: ['S', 'M', 'L', 'XL'],
  wrist: ['18 cm', '19.5 cm', '21 cm'],
  footwear: ['EU 41', 'EU 42', 'EU 43', 'EU 44'],
};

const WHATSAPP_NUMBER = import.meta.env?.VITE_WHATSAPP_NUMBER || '';

function buildRawxWhatsAppUrl(params: {
  dropMeta: DropMetadata;
  size: string;
  quantity: number;
  shareUrl: string;
}): string {
  const { dropMeta, size, quantity, shareUrl } = params;
  const lines = [
    `Hello HANDS & HEAD / RAWx Concierge — Pre-Order Request`,
    `Drop: ${dropMeta.dropCode} (${dropMeta.title})`,
    `Material: ${dropMeta.materialSpec}`,
    `Size / Fit: ${size}`,
    `Quantity: ${quantity}`,
    `Price Est.: ${dropMeta.priceDisplay} each (${dropMeta.preorderWindow})`,
    `Drop Link: ${shareUrl}`,
  ];
  const encoded = encodeURIComponent(lines.join('\n'));
  if (WHATSAPP_NUMBER.trim()) {
    const cleanNum = WHATSAPP_NUMBER.replace(/[^\d]/g, '');
    return `https://wa.me/${cleanNum}?text=${encoded}`;
  }
  return `https://wa.me/?text=${encoded}`;
}

export default function RawxProductDrawer({
  isOpen,
  onClose,
  dropMeta,
  slides,
  initialSlideIndex = 0,
  activeGrade,
  isSaved,
  onToggleSave,
  onOpenLightbox,
  onCopyDropLink,
}: RawxProductDrawerProps) {
  const [selectedFrameIdx, setSelectedFrameIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [copiedJustNow, setCopiedJustNow] = useState(false);

  const sizingChoices = useMemo(() => {
    if (!dropMeta) return SIZE_OPTIONS.apparel;
    return SIZE_OPTIONS[dropMeta.sizingType] || SIZE_OPTIONS.apparel;
  }, [dropMeta]);

  useEffect(() => {
    if (isOpen && dropMeta) {
      const safeIdx = Math.max(0, Math.min(slides.length - 1, initialSlideIndex));
      setSelectedFrameIdx(safeIdx);
      const defaultSizes = SIZE_OPTIONS[dropMeta.sizingType] || SIZE_OPTIONS.apparel;
      setSelectedSize(defaultSizes[Math.min(1, defaultSizes.length - 1)]);
      setQuantity(1);
      setCopiedJustNow(false);
    }
  }, [isOpen, dropMeta, slides.length, initialSlideIndex]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !dropMeta) return null;

  const activeSlide = slides[selectedFrameIdx] || slides[0];
  const activeGradeObj = GRADES.find((g) => g.id === activeGrade) || GRADES[0];
  const storyboardRemixUrl = `https://storyboard.handsandhead.com/?tool=mood-pad&drop=${encodeURIComponent(
    dropMeta.dropId
  )}&lut=${encodeURIComponent(dropMeta.lutPreset)}`;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://handsandhead.com';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const shareUrl = `${origin}${pathname}#rawx-${dropMeta.dropId}`;

  const whatsappUrl = buildRawxWhatsAppUrl({
    dropMeta,
    size: selectedSize,
    quantity,
    shareUrl,
  });

  const lightboxItems: LightboxItem[] = slides.map((s) => ({
    url: s.url,
    title: s.title || dropMeta.title,
    tag: s.tag || dropMeta.dropCode,
  }));

  const handleCopy = () => {
    onCopyDropLink(dropMeta.dropId);
    setCopiedJustNow(true);
    setTimeout(() => setCopiedJustNow(false), 1800);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${dropMeta.title} Product & Lookbook Drawer`}
      className="fixed inset-0 z-[145] bg-black/70 backdrop-blur-md flex justify-end"
      onClick={onClose}
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl h-full border-l flex flex-col shadow-2xl overflow-hidden hh-theme-transition"
        style={{
          backgroundColor: 'var(--hh-bg)',
          borderColor: 'var(--hh-border)',
          color: 'var(--hh-text)',
        }}
      >
        {/* Top Drawer Command Bar */}
        <div
          className="px-5 sm:px-6 py-4 border-b flex items-center justify-between gap-3 shrink-0"
          style={{
            backgroundColor: 'var(--hh-surface)',
            borderColor: 'var(--hh-border)',
          }}
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[10px] font-space-mono uppercase tracking-[0.18em]">
              <span className="font-bold normal-case" style={{ color: 'var(--hh-accent)' }}>
                RAWx
              </span>
              <span style={{ color: 'var(--hh-border)' }}>·</span>
              <span style={{ color: 'var(--hh-accent)' }}>{dropMeta.dropCode}</span>
              <span style={{ color: 'var(--hh-border)' }}>·</span>
              <span className="truncate" style={{ color: 'var(--hh-muted)' }}>
                {dropMeta.collection}
              </span>
            </div>
            <h2
              className="font-bebas text-2xl sm:text-3xl tracking-wide truncate mt-0.5"
              style={{ color: 'var(--hh-text)' }}
            >
              {dropMeta.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopy}
              title="Copy direct drop link"
              className="px-2.5 py-1.5 rounded border text-[10px] font-space-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
              style={{
                backgroundColor: 'var(--hh-bg)',
                borderColor: 'var(--hh-border)',
                color: 'var(--hh-text)',
              }}
            >
              {copiedJustNow ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500">Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" style={{ color: 'var(--hh-accent)' }} />
                  <span className="hidden sm:inline">Share Drop</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close drop drawer"
              className="p-2 rounded border cursor-pointer transition-colors"
              style={{
                backgroundColor: 'var(--hh-bg)',
                borderColor: 'var(--hh-border)',
                color: 'var(--hh-text)',
              }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 pb-24">
          {/* Active Visual Plate + Grade Overlay Info */}
          <div className="space-y-3">
            <div
              className="relative aspect-[16/10] rounded-lg overflow-hidden border group"
              style={{
                backgroundColor: 'var(--hh-surface)',
                borderColor: 'var(--hh-border)',
              }}
            >
              {activeSlide?.url ? (
                <img
                  src={activeSlide.url}
                  alt={activeSlide.title || dropMeta.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-xs font-space-mono"
                  style={{ color: 'var(--hh-muted)' }}
                >
                  RAWx Studio Preview Unavailable
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent pointer-events-none" />

              {/* Top LUT / Grade Metadata Badges */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                <span className="px-2.5 py-1 rounded bg-black/75 border border-white/20 text-[9px] font-space-mono uppercase tracking-wider text-amber-400">
                  LUT: {dropMeta.lutPreset}
                </span>
                <span className="px-2.5 py-1 rounded bg-black/75 border border-white/20 text-[9px] font-space-mono uppercase tracking-wider text-zinc-200">
                  OS Grade: {activeGradeObj.name}
                </span>
              </div>

              {/* Bottom Frame Info & Lightbox Expand */}
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[9px] font-space-mono uppercase tracking-widest text-amber-400 block">
                    {activeSlide?.tag || dropMeta.dropCode} · Frame {String(selectedFrameIdx + 1).padStart(2, '0')} /{' '}
                    {String(Math.max(1, slides.length)).padStart(2, '0')}
                  </span>
                  <p className="font-cormorant italic text-xl text-white truncate">
                    {activeSlide?.title || dropMeta.title}
                  </p>
                  {activeSlide?.sub && (
                    <span className="text-[10px] font-space-mono text-zinc-300 block truncate">
                      {activeSlide.sub}
                    </span>
                  )}
                </div>

                {slides.length > 0 && (
                  <button
                    type="button"
                    onClick={() => onOpenLightbox(lightboxItems, selectedFrameIdx)}
                    className="px-2.5 py-1.5 rounded bg-black/80 hover:bg-amber-600 border border-white/25 text-[10px] font-space-mono uppercase tracking-wider text-white flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>Lightbox</span>
                  </button>
                )}
              </div>
            </div>

            {/* High-Resolution Frame Strip */}
            {slides.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {slides.map((slide, idx) => (
                  <button
                    key={slide.id || `${dropMeta.dropId}-frame-${idx}`}
                    type="button"
                    onClick={() => setSelectedFrameIdx(idx)}
                    className="relative w-20 h-14 rounded overflow-hidden border-2 shrink-0 cursor-pointer transition-all"
                    style={{
                      backgroundColor: 'var(--hh-surface)',
                      borderColor: idx === selectedFrameIdx ? 'var(--hh-accent)' : 'transparent',
                      opacity: idx === selectedFrameIdx ? 1 : 0.6,
                    }}
                  >
                    <img
                      src={slide.url}
                      alt={slide.title || `Frame ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-0.5 right-1 text-[8px] font-space-mono bg-black/75 px-1 rounded text-amber-300 tabular-nums">
                      0{idx + 1}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pricing, POD/JIT Window & Editorial Story */}
          <div
            className="p-4 rounded-lg border space-y-3"
            style={{
              backgroundColor: 'var(--hh-surface)',
              borderColor: 'var(--hh-border)',
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span
                  className="text-[10px] font-space-mono uppercase tracking-[0.2em] block font-semibold"
                  style={{ color: 'var(--hh-accent)' }}
                >
                  {dropMeta.materialSpec}
                </span>
                <div className="flex items-baseline gap-3 mt-1">
                  <span
                    className="font-bebas text-3xl tabular-nums tracking-wide"
                    style={{ color: 'var(--hh-text)' }}
                  >
                    {dropMeta.priceDisplay}
                  </span>
                  <span className="text-[10px] font-space-mono uppercase tracking-wider text-emerald-500 font-semibold">
                    {dropMeta.preorderWindow}
                  </span>
                </div>
              </div>

              <a
                href={storyboardRemixUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent('RAWX_STORYBOARD_REMIX', {
                    dropId: dropMeta.dropId,
                    lutPreset: dropMeta.lutPreset,
                  })
                }
                className="px-3 py-1.5 rounded border text-[10px] font-space-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                style={{
                  backgroundColor: 'var(--hh-bg)',
                  borderColor: 'var(--hh-accent)',
                  color: 'var(--hh-accent)',
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Launch in Storyboard ↗</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <p className="font-inter text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--hh-text)' }}>
              {dropMeta.storyCaption}
            </p>

            {dropMeta.banglaTagline && (
              <p
                lang="bn"
                className="bangla-text text-xs pt-2 border-t"
                style={{ color: 'var(--hh-accent)', borderColor: 'var(--hh-border)' }}
              >
                {dropMeta.banglaTagline}
              </p>
            )}
          </div>

          {/* Technical Material & Craftsmanship Breakdown */}
          <div className="space-y-2.5">
            <div
              className="flex items-center gap-2 text-[10px] font-space-mono uppercase tracking-[0.2em]"
              style={{ color: 'var(--hh-muted)' }}
            >
              <Layers className="w-3.5 h-3.5" style={{ color: 'var(--hh-accent)' }} />
              <span>Technical Material &amp; Craftsmanship Breakdown</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { label: 'Material Grade', val: dropMeta.craftsmanshipSpecs.materialGrade },
                { label: 'Hardware & Trim', val: dropMeta.craftsmanshipSpecs.hardwareOrTrim },
                { label: 'Weight / Gauge', val: dropMeta.craftsmanshipSpecs.weightOrGauge },
                { label: 'Construction', val: dropMeta.craftsmanshipSpecs.construction },
              ].map((spec) => (
                <div
                  key={spec.label}
                  className="p-3 rounded border"
                  style={{
                    backgroundColor: 'var(--hh-surface)',
                    borderColor: 'var(--hh-border)',
                  }}
                >
                  <span
                    className="text-[9px] font-space-mono uppercase tracking-widest block"
                    style={{ color: 'var(--hh-muted)' }}
                  >
                    {spec.label}
                  </span>
                  <span className="text-xs font-inter mt-1 block" style={{ color: 'var(--hh-text)' }}>
                    {spec.val}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Size/Fit Selector & POD/JIT Quantity Stepper */}
          <div
            className="p-4 rounded-lg border space-y-4"
            style={{
              backgroundColor: 'var(--hh-surface)',
              borderColor: 'var(--hh-border)',
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <span
                  className="text-[10px] font-space-mono uppercase tracking-[0.18em] block"
                  style={{ color: 'var(--hh-muted)' }}
                >
                  {dropMeta.sizingType === 'wrist'
                    ? 'Bracelet Wrist Fit'
                    : dropMeta.sizingType === 'footwear'
                    ? 'Goodyear Boot Sizing'
                    : 'Apparel Size'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {sizingChoices.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className="px-3 py-1.5 rounded text-xs font-space-mono uppercase tracking-wider cursor-pointer transition-all tabular-nums border"
                      style={{
                        backgroundColor: selectedSize === size ? 'var(--hh-accent)' : 'var(--hh-bg)',
                        borderColor: selectedSize === size ? 'var(--hh-accent)' : 'var(--hh-border)',
                        color: selectedSize === size ? 'var(--hh-accent-ink)' : 'var(--hh-text)',
                        fontWeight: selectedSize === size ? 700 : 500,
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span
                  className="text-[10px] font-space-mono uppercase tracking-[0.18em] block"
                  style={{ color: 'var(--hh-muted)' }}
                >
                  JIT Batch Qty
                </span>
                <div
                  className="inline-flex items-center rounded border"
                  style={{
                    backgroundColor: 'var(--hh-bg)',
                    borderColor: 'var(--hh-border)',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="p-2 cursor-pointer"
                    style={{ color: 'var(--hh-muted)' }}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-space-mono font-bold tabular-nums" style={{ color: 'var(--hh-text)' }}>
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(25, q + 1))}
                    aria-label="Increase quantity"
                    className="p-2 cursor-pointer"
                    style={{ color: 'var(--hh-muted)' }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div
              className="flex items-center gap-2 text-[10px] font-space-mono pt-2 border-t"
              style={{ color: 'var(--hh-muted)', borderColor: 'var(--hh-border)' }}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>
                Small-batch Print-on-Demand &amp; Just-In-Time craft in Dhaka. Serialized QC before dispatch.
              </span>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Pre-Order & Wishlist Action Bar */}
        <div
          className="px-5 sm:px-6 py-4 border-t flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0"
          style={{
            backgroundColor: 'var(--hh-surface)',
            borderColor: 'var(--hh-border)',
          }}
        >
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackEvent('RAWX_WHATSAPP_PREORDER', {
                dropId: dropMeta.dropId,
                dropCode: dropMeta.dropCode,
                size: selectedSize,
                quantity,
              })
            }
            className="flex-1 py-3 px-4 rounded font-space-mono text-xs font-bold uppercase tracking-[0.14em] flex items-center justify-center gap-2 transition-colors"
            style={{
              backgroundColor: 'var(--hh-accent)',
              color: 'var(--hh-accent-ink)',
            }}
          >
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span>Reserve Pre-Order via WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={() => onToggleSave(dropMeta.dropId)}
            className="py-3 px-4 rounded font-space-mono text-xs uppercase tracking-wider border flex items-center justify-center gap-2 cursor-pointer transition-all"
            style={{
              backgroundColor: isSaved ? 'var(--hh-surface-2)' : 'var(--hh-bg)',
              borderColor: isSaved ? 'var(--hh-accent)' : 'var(--hh-border)',
              color: isSaved ? 'var(--hh-accent)' : 'var(--hh-text)',
            }}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-4 h-4" />
                <span>Saved in Lookbook</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4" />
                <span>Save Drop</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </div>
  );
}
// END OF FILE: src/components/rawx/RawxProductDrawer.tsx
