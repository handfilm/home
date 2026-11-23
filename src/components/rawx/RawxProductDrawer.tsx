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
      className="fixed inset-0 z-[145] bg-black/80 backdrop-blur-md flex justify-end"
      onClick={onClose}
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl h-full bg-[#09090b] border-l border-[#f4f0e8]/15 text-[#f4f0e8] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Top Drawer Command Bar */}
        <div className="px-5 sm:px-6 py-4 bg-[#111114] border-b border-[#f4f0e8]/10 flex items-center justify-between gap-3 shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[10px] font-space-mono uppercase tracking-[0.18em] text-[#C8A96A]">
              <span className="font-bold text-[#e11d48]">RAWx</span>
              <span className="text-[#f4f0e8]/30">·</span>
              <span>{dropMeta.dropCode}</span>
              <span className="text-[#f4f0e8]/30">·</span>
              <span className="truncate text-[#f4f0e8]/65">{dropMeta.collection}</span>
            </div>
            <h2 className="font-bebas text-2xl sm:text-3xl tracking-wide text-white truncate mt-0.5">
              {dropMeta.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopy}
              title="Copy direct drop link"
              className="px-2.5 py-1.5 rounded bg-[#18181b] border border-[#f4f0e8]/15 hover:border-[#C8A96A]/60 text-[10px] font-space-mono uppercase tracking-wider text-[#f4f0e8]/80 hover:text-[#C8A96A] flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              {copiedJustNow ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Share Drop</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close drop drawer"
              className="p-2 rounded bg-[#18181b] border border-[#f4f0e8]/15 hover:border-[#e11d48] text-[#f4f0e8]/70 hover:text-white cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 pb-24">
          {/* Active Visual Plate + Grade Overlay Info */}
          <div className="space-y-3">
            <div className="relative aspect-[16/10] bg-[#121216] rounded-lg overflow-hidden border border-[#f4f0e8]/12 group">
              {activeSlide?.url ? (
                <img
                  src={activeSlide.url}
                  alt={activeSlide.title || dropMeta.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs font-space-mono text-[#f4f0e8]/40">
                  RAWx Studio Preview Unavailable
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent pointer-events-none" />

              {/* Top LUT / Grade Metadata Badges */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                <span className="px-2.5 py-1 rounded bg-black/75 border border-[#C8A96A]/40 text-[9px] font-space-mono uppercase tracking-wider text-[#C8A96A]">
                  LUT: {dropMeta.lutPreset}
                </span>
                <span className="px-2.5 py-1 rounded bg-black/75 border border-[#f4f0e8]/15 text-[9px] font-space-mono uppercase tracking-wider text-[#f4f0e8]/80">
                  OS Grade: {activeGradeObj.name}
                </span>
              </div>

              {/* Bottom Frame Info & Lightbox Expand */}
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[9px] font-space-mono uppercase tracking-widest text-[#C8A96A] block">
                    {activeSlide?.tag || dropMeta.dropCode} · Frame {String(selectedFrameIdx + 1).padStart(2, '0')} /{' '}
                    {String(Math.max(1, slides.length)).padStart(2, '0')}
                  </span>
                  <p className="font-cormorant italic text-xl text-white truncate">
                    {activeSlide?.title || dropMeta.title}
                  </p>
                  {activeSlide?.sub && (
                    <span className="text-[10px] font-space-mono text-[#f4f0e8]/65 block truncate">
                      {activeSlide.sub}
                    </span>
                  )}
                </div>

                {slides.length > 0 && (
                  <button
                    type="button"
                    onClick={() => onOpenLightbox(lightboxItems, selectedFrameIdx)}
                    className="px-2.5 py-1.5 rounded bg-black/80 hover:bg-[#C8A96A] border border-[#f4f0e8]/25 hover:border-[#C8A96A] text-[10px] font-space-mono uppercase tracking-wider text-white hover:text-black flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
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
                    className={`relative w-20 h-14 rounded overflow-hidden border-2 shrink-0 cursor-pointer transition-all bg-[#141418] ${
                      idx === selectedFrameIdx
                        ? 'border-[#C8A96A] ring-2 ring-[#C8A96A]/25 opacity-100'
                        : 'border-transparent opacity-55 hover:opacity-95'
                    }`}
                  >
                    <img
                      src={slide.url}
                      alt={slide.title || `Frame ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-0.5 right-1 text-[8px] font-space-mono bg-black/75 px-1 rounded text-[#C8A96A] tabular-nums">
                      0{idx + 1}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pricing, POD/JIT Window & Editorial Story */}
          <div className="p-4 rounded-lg bg-[#111115] border border-[#f4f0e8]/10 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-space-mono uppercase tracking-[0.2em] text-[#C8A96A] block">
                  {dropMeta.materialSpec}
                </span>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="font-bebas text-3xl text-white tabular-nums tracking-wide">
                    {dropMeta.priceDisplay}
                  </span>
                  <span className="text-[10px] font-space-mono uppercase tracking-wider text-emerald-400">
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
                className="px-3 py-1.5 rounded bg-[#18181d] border border-[#e11d48]/45 hover:bg-[#e11d48] text-[10px] font-space-mono uppercase tracking-wider text-[#fda4af] hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Remix Look in Storyboard</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <p className="font-inter text-xs sm:text-sm text-[#f4f0e8]/80 leading-relaxed">
              {dropMeta.storyCaption}
            </p>

            {dropMeta.banglaTagline && (
              <p
                lang="bn"
                className="bangla-text text-xs text-[#C8A96A]/90 pt-1 border-t border-[#f4f0e8]/10"
              >
                {dropMeta.banglaTagline}
              </p>
            )}
          </div>

          {/* Technical Material & Craftsmanship Breakdown */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-[10px] font-space-mono uppercase tracking-[0.2em] text-[#f4f0e8]/60">
              <Layers className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span>Technical Material &amp; Craftsmanship Breakdown</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded bg-[#111115] border border-[#f4f0e8]/10">
                <span className="text-[9px] font-space-mono uppercase tracking-widest text-[#f4f0e8]/45 block">
                  Material Grade
                </span>
                <span className="text-xs font-inter text-[#f4f0e8]/90 mt-1 block">
                  {dropMeta.craftsmanshipSpecs.materialGrade}
                </span>
              </div>

              <div className="p-3 rounded bg-[#111115] border border-[#f4f0e8]/10">
                <span className="text-[9px] font-space-mono uppercase tracking-widest text-[#f4f0e8]/45 block">
                  Hardware &amp; Trim
                </span>
                <span className="text-xs font-inter text-[#f4f0e8]/90 mt-1 block">
                  {dropMeta.craftsmanshipSpecs.hardwareOrTrim}
                </span>
              </div>

              <div className="p-3 rounded bg-[#111115] border border-[#f4f0e8]/10">
                <span className="text-[9px] font-space-mono uppercase tracking-widest text-[#f4f0e8]/45 block">
                  Weight / Gauge
                </span>
                <span className="text-xs font-inter text-[#f4f0e8]/90 mt-1 block">
                  {dropMeta.craftsmanshipSpecs.weightOrGauge}
                </span>
              </div>

              <div className="p-3 rounded bg-[#111115] border border-[#f4f0e8]/10">
                <span className="text-[9px] font-space-mono uppercase tracking-widest text-[#f4f0e8]/45 block">
                  Construction
                </span>
                <span className="text-xs font-inter text-[#f4f0e8]/90 mt-1 block">
                  {dropMeta.craftsmanshipSpecs.construction}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Size/Fit Selector & POD/JIT Quantity Stepper */}
          <div className="p-4 rounded-lg bg-[#111115] border border-[#f4f0e8]/12 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <span className="text-[10px] font-space-mono uppercase tracking-[0.18em] text-[#f4f0e8]/65 block">
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
                      className={`px-3 py-1.5 rounded text-xs font-space-mono uppercase tracking-wider cursor-pointer transition-all tabular-nums ${
                        selectedSize === size
                          ? 'bg-[#C8A96A] text-black font-bold shadow'
                          : 'bg-[#18181d] text-[#f4f0e8]/75 border border-[#f4f0e8]/15 hover:border-[#f4f0e8]/40'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-space-mono uppercase tracking-[0.18em] text-[#f4f0e8]/65 block">
                  JIT Batch Qty
                </span>
                <div className="inline-flex items-center rounded bg-[#18181d] border border-[#f4f0e8]/15">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="p-2 text-[#f4f0e8]/75 hover:text-white cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-space-mono font-bold text-white tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(25, q + 1))}
                    aria-label="Increase quantity"
                    className="p-2 text-[#f4f0e8]/75 hover:text-white cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-space-mono text-[#f4f0e8]/55 pt-2 border-t border-[#f4f0e8]/10">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>
                Small-batch Print-on-Demand &amp; Just-In-Time craft in Dhaka. Serialized QC before dispatch.
              </span>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Pre-Order & Wishlist Action Bar */}
        <div className="px-5 sm:px-6 py-4 bg-[#111114] border-t border-[#f4f0e8]/12 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
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
            className="flex-1 py-3 px-4 rounded bg-[#e11d48] hover:bg-[#be123c] text-white font-space-mono text-xs font-bold uppercase tracking-[0.14em] flex items-center justify-center gap-2 transition-colors shadow-[0_0_24px_rgba(225,29,72,0.35)]"
          >
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span>Reserve Pre-Order via WhatsApp Concierge</span>
          </a>

          <button
            type="button"
            onClick={() => onToggleSave(dropMeta.dropId)}
            className={`py-3 px-4 rounded font-space-mono text-xs uppercase tracking-wider border flex items-center justify-center gap-2 cursor-pointer transition-all ${
              isSaved
                ? 'bg-[#C8A96A]/15 border-[#C8A96A] text-[#C8A96A] font-bold'
                : 'bg-[#18181d] border-[#f4f0e8]/20 text-[#f4f0e8]/85 hover:border-[#C8A96A]/60 hover:text-[#C8A96A]'
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-4 h-4" />
                <span>Saved in Lookbook</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4" />
                <span>Add to Saved Lookbook</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </div>
  );
}
// END OF FILE: src/components/rawx/RawxProductDrawer.tsx
