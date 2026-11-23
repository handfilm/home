import React, { useState, useEffect, useRef, useMemo } from 'react';
import { TICKER_ITEMS } from '../data/initialData';
import { LightboxItem } from './LightboxModal';
import {
  AllSlidersData,
  ColorGrade,
  DropMetadata,
  RawxCollectionCategory,
  RawxDropKey,
} from '../types';
import {
  getStoredSlidersData,
  saveSlidersData,
  resetSlidersData,
} from '../data/sliderDefaults';
import {
  RAWX_COLLECTION_FILTERS,
  RAWX_DROP_ORDER,
  getMergedDropMetadata,
  getSavedLookbookIds,
  saveSavedLookbookIds,
  getSlidesForDropKey,
} from '../data/rawxDrops';
import { copyRawxDropShareLink } from '../services/deepLinkService';
import { trackEvent } from '../services/analytics';
import DynamicPhotoManagerModal from './DynamicPhotoManagerModal';
import RawxProductDrawer from './rawx/RawxProductDrawer';
import { Language, TRANSLATIONS, TranslationDictionary } from '../i18n/translations';
import {
  Play,
  Pause,
  Camera,
  Maximize2,
  Minimize2,
  Bookmark,
  BookmarkCheck,
  Search,
  X,
  Share2,
  ExternalLink,
  ShoppingBag,
  Sparkles,
  Check,
  Tv,
  ChevronDown,
} from 'lucide-react';

interface RawxShowcaseProps {
  onOpenLightbox: (items: LightboxItem[], startIndex: number) => void;
  speed: number;
  currentGrade?: ColorGrade;
  targetDropId?: string | null;
  onBackToEcosystem?: () => void;
  isActiveTab?: boolean;
  language?: Language;
  t?: TranslationDictionary;
}

interface DropBlockHeaderProps {
  dropMeta: DropMetadata;
  engineSpec: string;
  counterLabel: string;
  editSectionKey: string;
  isSaved: boolean;
  copiedDropId: string | null;
  onInspect: (dropKey: RawxDropKey, frameIndex?: number) => void;
  onCopyLink: (dropId: string) => void;
  onToggleSave: (dropId: string) => void;
  onEditSection: (sectionKey: string) => void;
  t: TranslationDictionary;
}

function DropBlockHeader({
  dropMeta,
  engineSpec,
  counterLabel,
  editSectionKey,
  isSaved,
  copiedDropId,
  onInspect,
  onCopyLink,
  onToggleSave,
  onEditSection,
  t,
}: DropBlockHeaderProps) {
  const [isDetailsPinned, setIsDetailsPinned] = useState(false);

  const storyboardRemixUrl = `https://storyboard.handsandhead.com/?tool=mood-pad&drop=${encodeURIComponent(
    dropMeta.dropId
  )}&lut=${encodeURIComponent(dropMeta.lutPreset)}`;

  return (
    <div
      className="group/drop rounded-2xl border p-4 sm:p-5 transition-all duration-300 ease-out hh-theme-transition"
      style={{
        backgroundColor: 'var(--hh-surface)',
        borderColor: 'var(--hh-border)',
        boxShadow: 'var(--hh-card-shadow)',
      }}
    >
      {/* Minimalist Resting Header: Badge + Bold Title + Price + Quick Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 min-w-0">
          <span
            className="px-2.5 py-1 rounded-md border font-space-mono text-[10px] font-bold uppercase tracking-wider shrink-0"
            style={{
              backgroundColor: 'var(--hh-bg)',
              borderColor: 'var(--hh-accent)',
              color: 'var(--hh-accent)',
            }}
          >
            {dropMeta.dropCode} · {dropMeta.collection}
          </span>

          <h2
            className="font-bebas text-2xl sm:text-3xl tracking-wide leading-none truncate"
            style={{ color: 'var(--hh-text)' }}
          >
            {dropMeta.title}
          </h2>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span
            className="font-bebas text-2xl tabular-nums leading-none"
            style={{ color: 'var(--hh-text)' }}
          >
            {dropMeta.priceDisplay}
          </span>

          <button
            type="button"
            onClick={() => onEditSection(editSectionKey)}
            className="px-2.5 py-1 rounded border text-[10px] font-space-mono uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
            style={{
              backgroundColor: 'var(--hh-bg)',
              borderColor: 'var(--hh-border)',
              color: 'var(--hh-accent)',
            }}
          >
            <Camera className="w-3 h-3" />
            <span className="hidden sm:inline">{t.rawx.editSection}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsDetailsPinned((prev) => !prev)}
            aria-expanded={isDetailsPinned}
            aria-label="Toggle drop details"
            className="px-2.5 py-1 rounded border text-[10px] font-space-mono uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
            style={{
              backgroundColor: isDetailsPinned ? 'var(--hh-accent)' : 'var(--hh-bg)',
              borderColor: 'var(--hh-border)',
              color: isDetailsPinned ? 'var(--hh-accent-ink)' : 'var(--hh-muted)',
            }}
          >
            <span className="tabular-nums">{counterLabel}</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${isDetailsPinned ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Hover / Tap Smooth Reveal Glassmorphic Specs & Actions */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          isDetailsPinned
            ? 'max-h-72 opacity-100 mt-3.5 pt-3.5 border-t'
            : 'max-h-0 opacity-0 group-hover/drop:max-h-72 group-hover/drop:opacity-100 group-hover/drop:mt-3.5 group-hover/drop:pt-3.5 group-hover/drop:border-t'
        }`}
        style={{ borderColor: 'var(--hh-border)' }}
      >
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-space-mono uppercase tracking-wider">
            <span
              className="px-2 py-0.5 rounded border"
              style={{
                backgroundColor: 'var(--hh-bg)',
                borderColor: 'var(--hh-border)',
                color: 'var(--hh-text)',
              }}
            >
              {dropMeta.materialSpec}
            </span>
            <span style={{ color: 'var(--hh-muted)' }}>{engineSpec}</span>
            <span className="text-emerald-500 font-semibold">{dropMeta.preorderWindow}</span>
          </div>

          <p className="font-inter text-xs leading-relaxed max-w-3xl" style={{ color: 'var(--hh-muted)' }}>
            {dropMeta.storyCaption}
            {dropMeta.banglaTagline ? (
              <span lang="bn" className="bangla-text ml-2" style={{ color: 'var(--hh-accent)' }}>
                · {dropMeta.banglaTagline}
              </span>
            ) : null}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onInspect(dropMeta.sectionKey, 0)}
              className="px-3 py-1.5 rounded font-space-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
              style={{
                backgroundColor: 'var(--hh-accent)',
                color: 'var(--hh-accent-ink)',
              }}
            >
              <ShoppingBag className="w-3 h-3" />
              <span>{t.rawx.inspectPreorder}</span>
            </button>

            <button
              type="button"
              onClick={() => onCopyLink(dropMeta.dropId)}
              className="px-2.5 py-1.5 rounded border text-[10px] font-space-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
              style={{
                backgroundColor: 'var(--hh-bg)',
                borderColor: 'var(--hh-border)',
                color: 'var(--hh-text)',
              }}
            >
              {copiedDropId === dropMeta.dropId ? (
                <>
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span className="text-emerald-500">#{dropMeta.dropId}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3 h-3" style={{ color: 'var(--hh-accent)' }} />
                  <span>{t.rawx.copyDropLink}</span>
                </>
              )}
            </button>

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
              className="px-2.5 py-1.5 rounded border text-[10px] font-space-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors"
              style={{
                backgroundColor: 'var(--hh-bg)',
                borderColor: 'var(--hh-border)',
                color: 'var(--hh-text)',
              }}
            >
              <Sparkles className="w-3 h-3" style={{ color: 'var(--hh-accent)' }} />
              <span>{t.rawx.remixStoryboard}</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>

            <button
              type="button"
              onClick={() => onToggleSave(dropMeta.dropId)}
              aria-label={isSaved ? 'Remove from Saved Lookbook' : 'Save to Lookbook'}
              className="px-2.5 py-1.5 rounded border text-[10px] font-space-mono uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
              style={{
                backgroundColor: isSaved ? 'var(--hh-surface-2)' : 'var(--hh-bg)',
                borderColor: isSaved ? 'var(--hh-accent)' : 'var(--hh-border)',
                color: isSaved ? 'var(--hh-accent)' : 'var(--hh-text)',
              }}
            >
              {isSaved ? <BookmarkCheck className="w-3 h-3" /> : <Bookmark className="w-3 h-3" />}
              <span>{isSaved ? t.rawx.saved : t.rawx.save}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RawxShowcase({
  onOpenLightbox,
  speed,
  currentGrade = 'off',
  targetDropId = null,
  onBackToEcosystem,
  isActiveTab = true,
  language = 'en',
  t = TRANSLATIONS.en,
}: RawxShowcaseProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Dynamic Sliders Media State with localStorage persistence
  const [slidersData, setSlidersData] = useState<AllSlidersData>(() => getStoredSlidersData());

  // Dynamic Photo Manager Modal State
  const [isPhotoManagerOpen, setIsPhotoManagerOpen] = useState(false);
  const [photoManagerTargetSection, setPhotoManagerTargetSection] = useState<string>('s1');

  // Product Spec & Pre-Order Slide-Over Drawer State
  const [drawerDropKey, setDrawerDropKey] = useState<RawxDropKey | null>(null);
  const [drawerFrameIdx, setDrawerFrameIdx] = useState<number>(0);

  // Saved Lookbook Wishlist State
  const [savedDropIds, setSavedDropIds] = useState<string[]>(() => getSavedLookbookIds());
  const [isSavedTrayOpen, setIsSavedTrayOpen] = useState(false);

  // Collection Filter & Search State
  const [selectedCollection, setSelectedCollection] = useState<'ALL' | RawxCollectionCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedDropId, setCopiedDropId] = useState<string | null>(null);

  // Cinema Theater Mode State
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  // Master Global Autoplay State
  const [isAutoplayActive, setIsAutoplayActive] = useState(true);

  // Active section tracking for Jump-Bar
  const [activeSectionId, setActiveSectionId] = useState<string>('sec-01');

  // §01 Hero State
  const [s1Idx, setS1Idx] = useState(0);
  const [s1Progress, setS1Progress] = useState(0);

  // §02 Matrix States (4 Columns)
  const [s2aIdx, setS2aIdx] = useState(0);
  const [s2bIdx, setS2bIdx] = useState(0);
  const [s2cIdx, setS2cIdx] = useState(0);
  const [s2dIdx, setS2dIdx] = useState(0);

  // §03 Ultra Wide 32:9 State
  const [s3Idx, setS3Idx] = useState(0);
  const [s3Progress, setS3Progress] = useState(0);

  // §04 Asymmetric Split States
  const [s4aIdx, setS4aIdx] = useState(0);
  const [s4bIdx, setS4bIdx] = useState(0);

  // §05 Triptych States (3 Columns)
  const [s5aIdx, setS5aIdx] = useState(0);
  const [s5bIdx, setS5bIdx] = useState(0);
  const [s5cIdx, setS5cIdx] = useState(0);

  // §06 Crossfade State
  const [s6Idx, setS6Idx] = useState(0);
  const [s6Progress, setS6Progress] = useState(0);

  // §07 Portrait Grid
  const [s7aIdx, setS7aIdx] = useState(0);
  const [s7bIdx, setS7bIdx] = useState(0);
  const [s7cIdx, setS7cIdx] = useState(0);
  const [s7dIdx, setS7dIdx] = useState(0);

  // §08 Dual Landscape
  const [s8aIdx, setS8aIdx] = useState(0);
  const [s8bIdx, setS8bIdx] = useState(0);

  // §09 Standard Hero
  const [s9Idx, setS9Idx] = useState(0);

  // §10 Footer Banner
  const [s10Idx, setS10Idx] = useState(0);

  // §11 Before / After Drag
  const [baPosition, setBaPosition] = useState(50);
  const [baFilterIndex, setBaFilterIndex] = useState(0);
  const baBoxRef = useRef<HTMLDivElement | null>(null);
  const isBaDragging = useRef(false);

  // §12 Video slide
  const [s12Idx, setS12Idx] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // §A (S13) Zoom-Burst State
  const [zbIdx, setZbIdx] = useState(0);
  const [zbProgress, setZbProgress] = useState(0);

  // §B (S14) Stagger Reveal Grid State
  const [staggerSetIdx, setStaggerSetIdx] = useState(0);
  const [staggerRevealed, setStaggerRevealed] = useState(true);
  const [staggerProgress, setStaggerProgress] = useState(0);

  // §C (S15) Countdown Ring State
  const [cdIdx, setCdIdx] = useState(0);
  const [cdProgress, setCdProgress] = useState(0);

  // §D (S16) Split Panel Dual Axis
  const [spLeftIdx, setSpLeftIdx] = useState(0);
  const [spRightIdx, setSpRightIdx] = useState(0);

  // §E (S17) Inertia Filmstrip Drag State
  const [inertiaOffset, setInertiaOffset] = useState(0);
  const [focusedInertiaIndex, setFocusedInertiaIndex] = useState(0);
  const inertiaContainerRef = useRef<HTMLDivElement | null>(null);
  const isInertiaDragging = useRef(false);
  const inertiaStartX = useRef(0);
  const inertiaVelocity = useRef(0);
  const inertiaRaf = useRef<number | null>(null);

  // §F (S18) Wipe Transition State
  const [wipeIdx, setWipeIdx] = useState(0);
  const [wipeDir, setWipeDir] = useState<'wipe-r' | 'wipe-l' | 'wipe-u' | 'wipe-d'>('wipe-r');
  const [wipeProgress, setWipeProgress] = useState(0);

  // §G (S19) Hide & Steel Hardware Archive State
  const [sGIdx, setSGIdx] = useState(0);
  const [sGProgress, setSGProgress] = useState(0);

  // BA Filter choices
  const BA_FILTERS = [
    { name: 'Teal & Steel', filter: 'saturate(.75) hue-rotate(10deg) contrast(1.15) brightness(.92)' },
    { name: 'Amber Sunset', filter: 'saturate(1.2) sepia(.35) contrast(1.08) brightness(1.02)' },
    { name: 'Noir Contrast', filter: 'grayscale(.95) contrast(1.3) brightness(.9)' },
    { name: 'Bleach Bypass', filter: 'saturate(.5) contrast(1.4) brightness(1.08)' },
  ];

  // Merged Drop Metadata for all 19 Drops
  const mergedDrops = useMemo(() => getMergedDropMetadata(slidersData), [slidersData]);

  // Visible Drop Keys matching active Collection Filter & Live Search
  const visibleDropKeys = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return RAWX_DROP_ORDER.filter((key) => {
      const meta = mergedDrops[key];
      if (selectedCollection !== 'ALL' && meta.collection !== selectedCollection) {
        return false;
      }
      if (!q) return true;
      return (
        meta.title.toLowerCase().includes(q) ||
        meta.dropCode.toLowerCase().includes(q) ||
        meta.dropId.toLowerCase().includes(q) ||
        meta.materialSpec.toLowerCase().includes(q) ||
        meta.collection.toLowerCase().includes(q) ||
        meta.storyCaption.toLowerCase().includes(q)
      );
    });
  }, [mergedDrops, selectedCollection, searchQuery]);

  const visibleDropSet = useMemo(() => new Set(visibleDropKeys), [visibleDropKeys]);

  // Collection Counts
  const collectionCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: RAWX_DROP_ORDER.length };
    RAWX_DROP_ORDER.forEach((key) => {
      const col = mergedDrops[key].collection;
      counts[col] = (counts[col] || 0) + 1;
    });
    return counts;
  }, [mergedDrops]);

  // Save changes handler
  const handleUpdateSlidersData = (updated: AllSlidersData) => {
    setSlidersData(updated);
    saveSlidersData(updated);
  };

  const handleResetDefaults = () => {
    const def = resetSlidersData();
    setSlidersData(def);
  };

  // Open modal targeting specific section
  const openPhotoManagerFor = (sectionKey: string) => {
    setPhotoManagerTargetSection(sectionKey);
    setIsPhotoManagerOpen(true);
  };

  // Inspect Drop Drawer handler
  const handleInspectDrop = (dropKey: RawxDropKey, frameIndex = 0) => {
    setDrawerDropKey(dropKey);
    setDrawerFrameIdx(frameIndex);
    trackEvent('RAWX_INSPECT_DROP', {
      dropId: mergedDrops[dropKey].dropId,
      dropCode: mergedDrops[dropKey].dropCode,
      frameIndex,
    });
  };

  // Copy direct drop share link (#rawx-s01..#rawx-s19)
  const handleCopyDropLink = async (dropId: string) => {
    const ok = await copyRawxDropShareLink(dropId);
    if (ok) {
      setCopiedDropId(dropId);
      setTimeout(() => setCopiedDropId((prev) => (prev === dropId ? null : prev)), 2000);
    }
    trackEvent('RAWX_COPY_DROP_LINK', { dropId });
  };

  // Toggle Saved Lookbook item
  const handleToggleSaveDrop = (dropId: string) => {
    setSavedDropIds((prev) => {
      const exists = prev.includes(dropId);
      const next = exists ? prev.filter((id) => id !== dropId) : [...prev, dropId];
      saveSavedLookbookIds(next);
      trackEvent('RAWX_TOGGLE_SAVED_LOOKBOOK', { dropId, saved: !exists, count: next.length });
      return next;
    });
  };

  // Cinema Theater Mode Toggle (uses fullscreen when permitted + sleek cinema layout)
  const handleToggleTheaterMode = async () => {
    const nextState = !isTheaterMode;
    setIsTheaterMode(nextState);
    trackEvent('RAWX_THEATER_MODE', { enabled: nextState });
    try {
      if (nextState && rootRef.current && typeof rootRef.current.requestFullscreen === 'function') {
        if (!document.fullscreenElement) {
          await rootRef.current.requestFullscreen();
        }
      } else if (!nextState && document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch {
      // Inline theater mode remains active even when iframe blocks native fullscreen
    }
  };

  // Sync theater state if user presses ESC out of native fullscreen
  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement && isTheaterMode) {
        setIsTheaterMode(false);
      }
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, [isTheaterMode]);

  // Deep-link scroll to target #rawx-s01..#rawx-s19 when activated
  useEffect(() => {
    if (!isActiveTab || !targetDropId) return;
    const matchKey = RAWX_DROP_ORDER.find(
      (k) => mergedDrops[k].dropId.toLowerCase() === targetDropId.toLowerCase()
    );
    if (!matchKey) return;

    const targetMeta = mergedDrops[matchKey];
    setSelectedCollection('ALL');
    setSearchQuery('');
    setActiveSectionId(targetMeta.domId);

    const timer = setTimeout(() => {
      const el = document.getElementById(targetMeta.domId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 120);
    return () => clearTimeout(timer);
  }, [isActiveTab, targetDropId, mergedDrops]);

  // Autoplay intervals (paused automatically when RAWx tab is hidden)
  useEffect(() => {
    if (!isAutoplayActive || !isActiveTab) return;

    const stepFactor = Math.max(0.5, Math.min(2, 7 / Math.max(2, speed)));

    // §01 Hero Auto
    const intS1 = setInterval(() => {
      setS1Progress((prev) => {
        if (prev >= 100) {
          setS1Idx((c) => (c + 1) % slidersData.s1.length);
          return 0;
        }
        return prev + 1 * stepFactor;
      });
    }, 50);

    // §03 Ultra Wide
    const intS3 = setInterval(() => {
      setS3Progress((prev) => {
        if (prev >= 100) {
          setS3Idx((c) => (c + 1) % slidersData.s3.length);
          return 0;
        }
        return prev + 1.25 * stepFactor;
      });
    }, 50);

    // §06 Crossfade
    const intS6 = setInterval(() => {
      setS6Progress((prev) => {
        if (prev >= 100) {
          setS6Idx((c) => (c + 1) % slidersData.s6.length);
          return 0;
        }
        return prev + 1.4 * stepFactor;
      });
    }, 50);

    // §13 (A) Zoom-Burst
    const intZb = setInterval(() => {
      setZbProgress((prev) => {
        if (prev >= 100) {
          setZbIdx((c) => (c + 1) % slidersData.sA.length);
          return 0;
        }
        return prev + 1.1 * stepFactor;
      });
    }, 50);

    // §14 (B) Stagger Grid
    const intStagger = setInterval(() => {
      setStaggerProgress((prev) => {
        if (prev >= 100) {
          setStaggerRevealed(false);
          setTimeout(() => {
            setStaggerSetIdx((c) => (c + 1) % 2);
            setStaggerRevealed(true);
          }, 150);
          return 0;
        }
        return prev + 1 * stepFactor;
      });
    }, 50);

    // §15 (C) Countdown Ring
    const intCd = setInterval(() => {
      setCdProgress((prev) => {
        if (prev >= 100) {
          setCdIdx((c) => (c + 1) % slidersData.sC.length);
          return 0;
        }
        return prev + 1 * stepFactor;
      });
    }, 50);

    // §18 (F) Wipe Transition
    const intWipe = setInterval(() => {
      setWipeProgress((prev) => {
        if (prev >= 100) {
          const dirs: ('wipe-r' | 'wipe-l' | 'wipe-u' | 'wipe-d')[] = [
            'wipe-r',
            'wipe-l',
            'wipe-u',
            'wipe-d',
          ];
          setWipeDir(dirs[Math.floor(Math.random() * dirs.length)]);
          setWipeIdx((c) => (c + 1) % slidersData.sF.length);
          return 0;
        }
        return prev + 1 * stepFactor;
      });
    }, 50);

    // §19 (G) RAWx Forge Hide & 316L Steel
    const sGLen = slidersData.sG?.length || 1;
    const intSG = setInterval(() => {
      setSGProgress((prev) => {
        if (prev >= 100) {
          setSGIdx((c) => (c + 1) % sGLen);
          return 0;
        }
        return prev + 1.15 * stepFactor;
      });
    }, 50);

    return () => {
      clearInterval(intS1);
      clearInterval(intS3);
      clearInterval(intS6);
      clearInterval(intZb);
      clearInterval(intStagger);
      clearInterval(intCd);
      clearInterval(intWipe);
      clearInterval(intSG);
    };
  }, [
    isAutoplayActive,
    isActiveTab,
    speed,
    slidersData.s1.length,
    slidersData.s3.length,
    slidersData.s6.length,
    slidersData.sA.length,
    slidersData.sC.length,
    slidersData.sF.length,
    slidersData.sG?.length,
  ]);

  // Video sync observer
  useEffect(() => {
    videoRefs.current.forEach((vid, i) => {
      if (vid) {
        if (i === s12Idx && isActiveTab) {
          vid.play().catch(() => {});
        } else {
          vid.pause();
        }
      }
    });
  }, [s12Idx, isActiveTab]);

  // Before / After mouse drag
  const handleBaMove = (clientX: number) => {
    if (!baBoxRef.current || !isBaDragging.current) return;
    const rect = baBoxRef.current.getBoundingClientRect();
    const pct = Math.max(2, Math.min(98, ((clientX - rect.left) / rect.width) * 100));
    setBaPosition(pct);
  };

  // Inertia Filmstrip Drag Physics
  const handleInertiaMouseDown = (clientX: number) => {
    isInertiaDragging.current = true;
    inertiaStartX.current = clientX;
    inertiaVelocity.current = 0;
    if (inertiaRaf.current) cancelAnimationFrame(inertiaRaf.current);
  };

  const handleInertiaMouseMove = (clientX: number) => {
    if (!isInertiaDragging.current || !inertiaContainerRef.current) return;
    const delta = inertiaStartX.current - clientX;
    inertiaVelocity.current = delta * 0.4;
    inertiaStartX.current = clientX;

    setInertiaOffset((prev) => {
      const maxScroll = inertiaContainerRef.current!.scrollWidth - inertiaContainerRef.current!.clientWidth;
      const next = Math.max(0, Math.min(maxScroll, prev + delta));
      const frameWidth = 240;
      setFocusedInertiaIndex(Math.min(slidersData.sE.length - 1, Math.round(next / frameWidth)));
      return next;
    });
  };

  const handleInertiaMouseUp = () => {
    isInertiaDragging.current = false;
    const applyMomentum = () => {
      if (Math.abs(inertiaVelocity.current) > 0.4 && inertiaContainerRef.current) {
        inertiaVelocity.current *= 0.88;
        setInertiaOffset((prev) => {
          const maxScroll = inertiaContainerRef.current!.scrollWidth - inertiaContainerRef.current!.clientWidth;
          const next = Math.max(0, Math.min(maxScroll, prev + inertiaVelocity.current));
          setFocusedInertiaIndex(Math.min(slidersData.sE.length - 1, Math.round(next / 240)));
          return next;
        });
        inertiaRaf.current = requestAnimationFrame(applyMomentum);
      }
    };
    inertiaRaf.current = requestAnimationFrame(applyMomentum);
  };

  const scrollToDropSection = (dropKey: RawxDropKey) => {
    const meta = mergedDrops[dropKey];
    if (!visibleDropSet.has(dropKey)) {
      setSelectedCollection('ALL');
      setSearchQuery('');
    }
    setActiveSectionId(meta.domId);
    setTimeout(() => {
      const el = document.getElementById(meta.domId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 30);
  };

  // Convert all current dynamic slides for lightbox catalogue
  const allCurrentLightboxItems: LightboxItem[] = useMemo(() => {
    const list: LightboxItem[] = [];
    slidersData.s1.forEach((s) => list.push({ url: s.url, title: s.title, tag: s.tag }));
    slidersData.s3.forEach((s) => list.push({ url: s.url, title: s.title, tag: s.tag }));
    slidersData.sA.forEach((s) => list.push({ url: s.url, title: s.title, tag: s.tag }));
    slidersData.sC.forEach((s) => list.push({ url: s.url, title: s.title, tag: s.tag }));
    slidersData.sF.forEach((s) => list.push({ url: s.url, title: s.title, tag: s.tag }));
    (slidersData.sG || []).forEach((s) => list.push({ url: s.url, title: s.title, tag: s.tag }));
    return list;
  }, [slidersData]);

  const savedDropList = useMemo(() => {
    return RAWX_DROP_ORDER.filter((key) => savedDropIds.includes(mergedDrops[key].dropId)).map(
      (key) => mergedDrops[key]
    );
  }, [savedDropIds, mergedDrops]);

  const sGSlides = slidersData.sG || [];
  const activeDrawerMeta = drawerDropKey ? mergedDrops[drawerDropKey] : null;
  const activeDrawerSlides = drawerDropKey ? getSlidesForDropKey(slidersData, drawerDropKey) : [];

  return (
    <div
      ref={rootRef}
      className={`w-full font-mono pb-32 space-y-12 overflow-y-auto hh-theme-transition ${
        language === 'bn' ? 'bangla-text' : ''
      } ${isTheaterMode ? 'fixed inset-0 z-[130] mt-0 pt-4' : 'mt-[65px]'}`}
      style={{
        backgroundColor: 'var(--hh-bg)',
        color: 'var(--hh-text)',
      }}
    >
      {/* Ticker Tape */}
      <div
        className="w-full overflow-hidden h-8 border-y flex items-center"
        style={{
          backgroundColor: 'var(--hh-surface)',
          borderColor: 'var(--hh-border)',
        }}
      >
        <div className="flex gap-0 whitespace-nowrap animate-tape text-[9px] tracking-[0.25em] uppercase">
          {TICKER_ITEMS.map((item, idx) => (
            <span
              key={idx}
              className={`px-8 border-r ${item.hot ? 'font-bold' : ''}`}
              style={{
                borderColor: 'var(--hh-border)',
                color: item.hot ? 'var(--hh-accent)' : 'var(--hh-muted)',
              }}
            >
              {item.text}
            </span>
          ))}
        </div>
      </div>

      {/* A. RAWx Brand Command Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-2">
        <div
          className="rounded-2xl border p-5 sm:p-7 flex flex-col xl:flex-row xl:items-center justify-between gap-6 hh-theme-transition"
          style={{
            backgroundColor: 'var(--hh-surface)',
            borderColor: 'var(--hh-border)',
            boxShadow: 'var(--hh-card-shadow)',
          }}
        >
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5 text-[10px] font-space-mono uppercase tracking-[0.2em]">
              <span
                className="px-2.5 py-0.5 rounded border font-bold"
                style={{
                  backgroundColor: 'var(--hh-bg)',
                  borderColor: 'var(--hh-accent)',
                  color: 'var(--hh-accent)',
                }}
              >
                {t.rawx.studioBadge}
              </span>
              <span style={{ color: 'var(--hh-accent)' }}>19 Interactive Sliders</span>
              <span style={{ color: 'var(--hh-border)' }}>·</span>
              <span style={{ color: 'var(--hh-muted)' }}>{t.rawx.hoverHint}</span>
            </div>

            <h1
              className="font-bebas text-3xl sm:text-5xl tracking-wide leading-none"
              style={{ color: 'var(--hh-text)' }}
            >
              <span className="normal-case" style={{ color: 'var(--hh-accent)' }}>
                RAWx
              </span>{' '}
              — {t.rawx.heroTitle.replace(/^RAWx\s*—\s*/i, '')}
            </h1>

            <p className="font-inter text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--hh-muted)' }}>
              {t.rawx.heroSubtitle}
            </p>
          </div>

          {/* Right Global Command Controls */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {onBackToEcosystem && (
              <a
                href="#apps"
                onClick={(e) => {
                  e.preventDefault();
                  onBackToEcosystem();
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-[11px] font-space-mono tracking-wider uppercase transition-all cursor-pointer font-bold whitespace-nowrap"
                style={{
                  backgroundColor: 'var(--hh-bg)',
                  borderColor: 'var(--hh-border)',
                  color: 'var(--hh-text)',
                }}
              >
                <span>{t.rawx.backToApps}</span>
              </a>
            )}

            <button
              type="button"
              onClick={() => setIsSavedTrayOpen((prev) => !prev)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-[11px] font-space-mono tracking-wider uppercase cursor-pointer transition-all whitespace-nowrap font-semibold"
              style={{
                backgroundColor: isSavedTrayOpen || savedDropIds.length > 0 ? 'var(--hh-surface-2)' : 'var(--hh-bg)',
                borderColor: isSavedTrayOpen || savedDropIds.length > 0 ? 'var(--hh-accent)' : 'var(--hh-border)',
                color: isSavedTrayOpen || savedDropIds.length > 0 ? 'var(--hh-accent)' : 'var(--hh-text)',
              }}
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>
                {t.rawx.savedLookbook} ({savedDropIds.length})
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsAutoplayActive((prev) => !prev)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-[11px] font-space-mono tracking-wider transition-all cursor-pointer whitespace-nowrap font-semibold"
              style={{
                backgroundColor: 'var(--hh-bg)',
                borderColor: isAutoplayActive ? '#10b981' : 'var(--hh-accent)',
                color: isAutoplayActive ? '#10b981' : 'var(--hh-accent)',
              }}
            >
              {isAutoplayActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isAutoplayActive ? t.rawx.autoplayOn : t.rawx.autoplayPaused}</span>
            </button>

            <button
              type="button"
              onClick={handleToggleTheaterMode}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-[11px] font-space-mono tracking-wider uppercase cursor-pointer transition-all whitespace-nowrap"
              style={{
                backgroundColor: isTheaterMode ? 'var(--hh-accent)' : 'var(--hh-bg)',
                borderColor: isTheaterMode ? 'var(--hh-accent)' : 'var(--hh-border)',
                color: isTheaterMode ? 'var(--hh-accent-ink)' : 'var(--hh-text)',
              }}
            >
              {isTheaterMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Tv className="w-3.5 h-3.5" style={{ color: 'var(--hh-accent)' }} />}
              <span>{isTheaterMode ? t.rawx.theaterExit : t.rawx.theaterEnter}</span>
            </button>

            <button
              type="button"
              onClick={() => openPhotoManagerFor('s1')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-space-mono font-bold text-[11px] tracking-wider uppercase transition-all cursor-pointer shadow-md whitespace-nowrap"
              style={{
                backgroundColor: 'var(--hh-accent)',
                color: 'var(--hh-accent-ink)',
              }}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{t.rawx.customizePhotos}</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenLightbox(allCurrentLightboxItems, 0)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-[11px] font-space-mono uppercase cursor-pointer whitespace-nowrap"
              style={{
                backgroundColor: 'var(--hh-bg)',
                borderColor: 'var(--hh-border)',
                color: 'var(--hh-text)',
              }}
            >
              <Maximize2 className="w-3.5 h-3.5" style={{ color: 'var(--hh-accent)' }} />
              <span className="hidden sm:inline">{t.rawx.lightbox}</span>
            </button>
          </div>
        </div>

        {/* Saved Lookbook Expandable Strip */}
        {isSavedTrayOpen && (
          <div
            className="mt-3 p-4 rounded-xl border space-y-3"
            style={{
              backgroundColor: 'var(--hh-surface)',
              borderColor: 'var(--hh-accent)',
            }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-[11px] font-space-mono uppercase tracking-[0.18em] font-bold"
                style={{ color: 'var(--hh-accent)' }}
              >
                {t.rawx.savedLookbook} · <span className="normal-case">RAWx</span> ({savedDropList.length})
              </span>
              <button
                type="button"
                onClick={() => setIsSavedTrayOpen(false)}
                className="text-xs cursor-pointer"
                style={{ color: 'var(--hh-muted)' }}
              >
                {t.actions.close}
              </button>
            </div>
            {savedDropList.length === 0 ? (
              <p className="text-xs font-inter" style={{ color: 'var(--hh-muted)' }}>
                No drops bookmarked yet. Click &quot;{t.rawx.save}&quot; on any drop card.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {savedDropList.map((item) => (
                  <div
                    key={item.dropId}
                    className="p-3 rounded-lg border flex items-center justify-between gap-2"
                    style={{
                      backgroundColor: 'var(--hh-bg)',
                      borderColor: 'var(--hh-border)',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleInspectDrop(item.sectionKey, 0)}
                      className="text-left min-w-0 cursor-pointer group"
                    >
                      <span className="text-[9px] font-space-mono uppercase block" style={{ color: 'var(--hh-accent)' }}>
                        {item.dropCode} · {item.priceDisplay}
                      </span>
                      <span className="text-xs font-inter truncate block" style={{ color: 'var(--hh-text)' }}>
                        {item.title}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleSaveDrop(item.dropId)}
                      aria-label={`Remove ${item.title} from saved lookbook`}
                      className="p-1 hover:text-red-500 cursor-pointer shrink-0"
                      style={{ color: 'var(--hh-muted)' }}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Sticky Collection Filter Strip & S01-S19 Quick Jump Bar */}
      <div
        className={`sticky ${
          isTheaterMode ? 'top-0' : 'top-[60px]'
        } z-40 backdrop-blur-md border-y px-4 sm:px-8 py-3 shadow-xl hh-theme-transition`}
        style={{
          backgroundColor: 'var(--hh-header-bg)',
          borderColor: 'var(--hh-border)',
        }}
      >
        <div className="max-w-7xl mx-auto space-y-2.5">
          {/* Collection Filter Pills + Search */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {RAWX_COLLECTION_FILTERS.map((cat) => {
                const count = collectionCounts[cat] || 0;
                const active = selectedCollection === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCollection(cat)}
                    className="flex-shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-space-mono tracking-wider uppercase cursor-pointer transition-all whitespace-nowrap border"
                    style={{
                      backgroundColor: active ? 'var(--hh-accent)' : 'var(--hh-surface)',
                      borderColor: active ? 'var(--hh-accent)' : 'var(--hh-border)',
                      color: active ? 'var(--hh-accent-ink)' : 'var(--hh-text)',
                      fontWeight: active ? 700 : 500,
                    }}
                  >
                    {cat === 'ALL' ? `${t.rawx.allDrops} (${count})` : `${cat} (${count})`}
                  </button>
                );
              })}
            </div>

            {/* Live Search Bar */}
            <div className="relative w-full lg:w-80 shrink-0">
              <Search
                className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: 'var(--hh-accent)' }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.rawx.searchPlaceholder}
                className="w-full border rounded-lg pl-8 pr-8 py-1.5 text-xs font-space-mono focus:outline-none"
                style={{
                  backgroundColor: 'var(--hh-surface)',
                  borderColor: 'var(--hh-border)',
                  color: 'var(--hh-text)',
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear drop search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer"
                  style={{ color: 'var(--hh-muted)' }}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* S01-S19 Quick-Jump Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
            <span
              className="text-[9px] tracking-widest uppercase flex-shrink-0 mr-1 hidden lg:inline"
              style={{ color: 'var(--hh-muted)' }}
            >
              DROPS:
            </span>
            {RAWX_DROP_ORDER.map((dropKey) => {
              const meta = mergedDrops[dropKey];
              const isVisible = visibleDropSet.has(dropKey);
              const isActive = activeSectionId === meta.domId;
              return (
                <button
                  key={meta.dropId}
                  type="button"
                  title={`${meta.dropCode}: ${meta.title}`}
                  onClick={() => scrollToDropSection(dropKey)}
                  className="flex-shrink-0 px-2.5 py-1 rounded text-[9px] font-space-mono tracking-wider uppercase transition-all cursor-pointer tabular-nums border"
                  style={{
                    backgroundColor: isActive ? 'var(--hh-accent)' : 'var(--hh-surface)',
                    borderColor: isActive ? 'var(--hh-accent)' : 'var(--hh-border)',
                    color: isActive ? 'var(--hh-accent-ink)' : isVisible ? 'var(--hh-text)' : 'var(--hh-muted)',
                    opacity: isActive || isVisible ? 1 : 0.45,
                    fontWeight: isActive ? 700 : 500,
                  }}
                >
                  {meta.dropId.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Empty Search / Filter Fallback */}
      {visibleDropKeys.length === 0 && (
        <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
          <p className="font-bebas text-3xl tracking-wide" style={{ color: 'var(--hh-text)' }}>
            No <span className="normal-case">RAWx</span> Drops Matched &quot;{searchQuery}&quot;
          </p>
          <p className="font-inter text-xs" style={{ color: 'var(--hh-muted)' }}>
            Try clearing your filter or searching by material (e.g. Cowhide, 316L, 320 GSM, Goodyear).
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCollection('ALL');
              setSearchQuery('');
            }}
            className="px-5 py-2.5 rounded-lg text-xs font-space-mono font-bold uppercase tracking-wider cursor-pointer"
            style={{
              backgroundColor: 'var(--hh-accent)',
              color: 'var(--hh-accent-ink)',
            }}
          >
            Show All 19 Drops
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════════
           §01 · MASTER HERO · 21:9 CINEMATIC
      ════════════════════════════════════════════ */}
      {visibleDropSet.has('s1') && (
        <section id="sec-01" className="space-y-3 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-36">
          <DropBlockHeader
            dropMeta={mergedDrops.s1}
            engineSpec="01 · MASTER HERO · 21:9 CINEMATIC"
            counterLabel={`SEQ ${String(s1Idx + 1).padStart(3, '0')} / ${String(slidersData.s1.length).padStart(3, '0')}`}
            editSectionKey="s1"
            isSaved={savedDropIds.includes('s01')}
            copiedDropId={copiedDropId}
            onInspect={handleInspectDrop}
            onCopyLink={handleCopyDropLink}
            onToggleSave={handleToggleSaveDrop}
            onEditSection={openPhotoManagerFor}
            t={t}
          />

          <div className="relative aspect-[21/9] bg-[#111111] overflow-hidden rounded shadow-2xl group">
            <div
              className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.77,0,0.18,1)]"
              style={{ transform: `translateX(-${s1Idx * 100}%)` }}
            >
              {slidersData.s1.map((slide, idx) => (
                <div
                  key={idx}
                  onClick={() => handleInspectDrop('s1', idx)}
                  className="flex-shrink-0 w-full h-full relative bg-cover bg-center cursor-pointer group/slide"
                  style={{ backgroundImage: `url('${slide.url}')` }}
                >
                  <div className="rx-grad-b" />
                  <div className="rx-vignette" />
                  <div className="rx-scanlines" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 z-10">
                    <span className="text-[8px] tracking-[0.3em] uppercase text-[#c8b89a] block mb-1">
                      [ {slide.tag || 'Master OS'} ]
                    </span>
                    <h3 className="serif-display italic text-2xl sm:text-4xl md:text-5xl text-white font-normal leading-tight">
                      {slide.title || 'Cinematic Grading'}
                    </h3>
                    <span className="text-[10px] text-[#888888] tracking-widest uppercase mt-2 block">
                      {slide.sub || 'System Architecture'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
              {slidersData.s1.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setS1Idx(idx)}
                  aria-label={`Slide ${idx + 1}`}
                  className={`h-1 rounded-sm transition-all cursor-pointer ${
                    idx === s1Idx ? 'w-6 bg-[#c8b89a]' : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>

            <div className="absolute bottom-0 right-0 z-20 flex border-t border-l border-[#1c1c1c]">
              <button
                type="button"
                onClick={() => setS1Idx((curr) => (curr - 1 + slidersData.s1.length) % slidersData.s1.length)}
                className="px-4 py-2.5 bg-[#050505]/75 hover:bg-[#c8b89a]/20 text-[#888888] hover:text-[#c8b89a] text-[10px] tracking-wider transition-colors cursor-pointer"
              >
                ← PREV
              </button>
              <button
                type="button"
                onClick={() => setS1Idx((curr) => (curr + 1) % slidersData.s1.length)}
                className="px-4 py-2.5 bg-[#050505]/75 hover:bg-[#c8b89a]/20 text-[#888888] hover:text-[#c8b89a] text-[10px] tracking-wider transition-colors cursor-pointer border-l border-[#1c1c1c]"
              >
                NEXT →
              </button>
            </div>

            <div
              className="absolute bottom-0 left-0 h-[2px] bg-[#c8b89a] z-30 transition-all duration-75"
              style={{ width: `${s1Progress}%` }}
            />
          </div>

          <div className="flex gap-1 h-14 overflow-x-auto bg-[#0a0a0a] p-1 border border-[#1c1c1c] rounded scrollbar-none">
            {slidersData.s1.map((slide, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setS1Idx(idx)}
                className={`flex-shrink-0 w-24 h-full bg-cover bg-center transition-all cursor-pointer relative ${
                  idx === s1Idx ? 'opacity-100 ring-2 ring-[#c8b89a]' : 'opacity-40 hover:opacity-80'
                }`}
                style={{ backgroundImage: `url('${slide.url}')` }}
              />
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
           §02 · SQUARE MATRIX · 4-COL VERTICAL
      ════════════════════════════════════════════ */}
      {visibleDropSet.has('s2a') && (
        <section id="sec-02" className="space-y-3 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-36">
          <DropBlockHeader
            dropMeta={mergedDrops.s2a}
            engineSpec="02 · SQUARE MATRIX · 1:1 · VERTICAL SLIDE"
            counterLabel="4-COLUMN MATRIX"
            editSectionKey="s2a"
            isSaved={savedDropIds.includes('s02')}
            copiedDropId={copiedDropId}
            onInspect={handleInspectDrop}
            onCopyLink={handleCopyDropLink}
            onToggleSave={handleToggleSaveDrop}
            onEditSection={openPhotoManagerFor}
            t={t}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {/* Column A */}
            <div className="relative aspect-square bg-[#111] overflow-hidden rounded group">
              <div
                className="flex flex-col h-full transition-transform duration-500"
                style={{ transform: `translateY(-${s2aIdx * 100}%)` }}
              >
                {slidersData.s2a.map((slide, i) => (
                  <div
                    key={i}
                    onClick={() => handleInspectDrop('s2a', i)}
                    className="flex-shrink-0 w-full h-full bg-cover bg-center relative cursor-pointer"
                    style={{ backgroundImage: `url('${slide.url}')` }}
                  >
                    <div className="rx-grad-b" />
                    <div className="absolute bottom-4 left-4 z-10">
                      <span className="text-[8px] text-[#c8b89a] block uppercase">[ {slide.tag || `Core 0${i + 1}`} ]</span>
                      <p className="serif-display italic text-sm text-white">{slide.title}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute bottom-0 right-0 z-20 flex bg-[#050505]/80 border-t border-l border-[#1c1c1c]">
                <button
                  type="button"
                  onClick={() => setS2aIdx((c) => (c - 1 + slidersData.s2a.length) % slidersData.s2a.length)}
                  className="p-2 text-xs hover:text-[#c8b89a] cursor-pointer"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => setS2aIdx((c) => (c + 1) % slidersData.s2a.length)}
                  className="p-2 text-xs hover:text-[#c8b89a] border-l border-[#1c1c1c] cursor-pointer"
                >
                  ↓
                </button>
              </div>
            </div>

            {/* Column B */}
            <div className="relative aspect-square bg-[#111] overflow-hidden rounded group">
              <div
                className="flex flex-col h-full transition-transform duration-500"
                style={{ transform: `translateY(-${s2bIdx * 100}%)` }}
              >
                {slidersData.s2b.map((slide, i) => (
                  <div
                    key={i}
                    onClick={() => handleInspectDrop('s2a', slidersData.s2a.length + i)}
                    className="flex-shrink-0 w-full h-full bg-cover bg-center relative cursor-pointer"
                    style={{ backgroundImage: `url('${slide.url}')` }}
                  >
                    <div className="rx-grad-b" />
                    <div className="absolute bottom-4 left-4 z-10">
                      <span className="text-[8px] text-[#c8b89a] block uppercase">[ {slide.tag || `FX 0${i + 1}`} ]</span>
                      <p className="serif-display italic text-sm text-white">{slide.title}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute bottom-0 right-0 z-20 flex bg-[#050505]/80 border-t border-l border-[#1c1c1c]">
                <button
                  type="button"
                  onClick={() => setS2bIdx((c) => (c - 1 + slidersData.s2b.length) % slidersData.s2b.length)}
                  className="p-2 text-xs hover:text-[#c8b89a] cursor-pointer"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => setS2bIdx((c) => (c + 1) % slidersData.s2b.length)}
                  className="p-2 text-xs hover:text-[#c8b89a] border-l border-[#1c1c1c] cursor-pointer"
                >
                  ↓
                </button>
              </div>
            </div>

            {/* Column C */}
            <div className="relative aspect-square bg-[#111] overflow-hidden rounded group">
              <div
                className="flex flex-col h-full transition-transform duration-500"
                style={{ transform: `translateY(-${s2cIdx * 100}%)` }}
              >
                {slidersData.s2c.map((slide, i) => (
                  <div
                    key={i}
                    onClick={() =>
                      handleInspectDrop('s2a', slidersData.s2a.length + slidersData.s2b.length + i)
                    }
                    className="flex-shrink-0 w-full h-full bg-cover bg-center relative cursor-pointer"
                    style={{ backgroundImage: `url('${slide.url}')` }}
                  >
                    <div className="rx-grad-b" />
                    <div className="absolute bottom-4 left-4 z-10">
                      <span className="text-[8px] text-[#c8b89a] block uppercase">[ {slide.tag || `Tone 0${i + 1}`} ]</span>
                      <p className="serif-display italic text-sm text-white">{slide.title}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute bottom-0 right-0 z-20 flex bg-[#050505]/80 border-t border-l border-[#1c1c1c]">
                <button
                  type="button"
                  onClick={() => setS2cIdx((c) => (c - 1 + slidersData.s2c.length) % slidersData.s2c.length)}
                  className="p-2 text-xs hover:text-[#c8b89a] cursor-pointer"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => setS2cIdx((c) => (c + 1) % slidersData.s2c.length)}
                  className="p-2 text-xs hover:text-[#c8b89a] border-l border-[#1c1c1c] cursor-pointer"
                >
                  ↓
                </button>
              </div>
            </div>

            {/* Column D */}
            <div className="relative aspect-square bg-[#111] overflow-hidden rounded group">
              <div
                className="flex flex-col h-full transition-transform duration-500"
                style={{ transform: `translateY(-${s2dIdx * 100}%)` }}
              >
                {slidersData.s2d.map((slide, i) => (
                  <div
                    key={i}
                    onClick={() =>
                      handleInspectDrop(
                        's2a',
                        slidersData.s2a.length + slidersData.s2b.length + slidersData.s2c.length + i
                      )
                    }
                    className="flex-shrink-0 w-full h-full bg-cover bg-center relative cursor-pointer"
                    style={{ backgroundImage: `url('${slide.url}')` }}
                  >
                    <div className="rx-grad-b" />
                    <div className="absolute bottom-4 left-4 z-10">
                      <span className="text-[8px] text-[#c8b89a] block uppercase">[ {slide.tag || `Drop 0${i + 1}`} ]</span>
                      <p className="serif-display italic text-sm text-white">{slide.title}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute bottom-0 right-0 z-20 flex bg-[#050505]/80 border-t border-l border-[#1c1c1c]">
                <button
                  type="button"
                  onClick={() => setS2dIdx((c) => (c - 1 + slidersData.s2d.length) % slidersData.s2d.length)}
                  className="p-2 text-xs hover:text-[#c8b89a] cursor-pointer"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => setS2dIdx((c) => (c + 1) % slidersData.s2d.length)}
                  className="p-2 text-xs hover:text-[#c8b89a] border-l border-[#1c1c1c] cursor-pointer"
                >
                  ↓
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
           §03 · ULTRA WIDE CINEMATIC 32:9 · AUTO
      ════════════════════════════════════════════ */}
      {visibleDropSet.has('s3') && (
        <section id="sec-03" className="space-y-3 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-36">
          <DropBlockHeader
            dropMeta={mergedDrops.s3}
            engineSpec="03 · ULTRA WIDE CINEMATIC · 32:9 · AUTO BROADCAST"
            counterLabel={`AUTO · ${String(s3Idx + 1).padStart(2, '0')} / ${String(slidersData.s3.length).padStart(2, '0')}`}
            editSectionKey="s3"
            isSaved={savedDropIds.includes('s03')}
            copiedDropId={copiedDropId}
            onInspect={handleInspectDrop}
            onCopyLink={handleCopyDropLink}
            onToggleSave={handleToggleSaveDrop}
            onEditSection={openPhotoManagerFor}
            t={t}
          />

          <div className="relative aspect-[32/9] sm:aspect-[32/9] bg-[#111111] overflow-hidden rounded shadow-2xl">
            <div
              className="flex h-full transition-transform duration-700"
              style={{ transform: `translateX(-${s3Idx * 100}%)` }}
            >
              {slidersData.s3.map((slide, idx) => (
                <div
                  key={idx}
                  onClick={() => handleInspectDrop('s3', idx)}
                  className="flex-shrink-0 w-full h-full bg-cover bg-center relative cursor-pointer"
                  style={{ backgroundImage: `url('${slide.url}')` }}
                >
                  <div className="rx-grad-l" />
                  <div className="rx-scanlines" />
                  <div className="absolute bottom-4 sm:bottom-6 left-6 z-10 max-w-lg">
                    <span className="text-[8px] text-[#c8b89a] block uppercase mb-1">[ {slide.tag} ]</span>
                    <h3 className="serif-display italic text-xl sm:text-3xl text-white font-normal">{slide.title}</h3>
                    <span className="text-[9px] text-[#888888] uppercase block mt-1">{slide.sub}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute top-0 left-0 h-[2px] bg-[#c8b89a] z-30" style={{ width: `${s3Progress}%` }} />

            <div className="absolute bottom-4 left-6 z-20 flex gap-1.5">
              {slidersData.s3.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setS3Idx(idx)}
                  aria-label={`Panorama ${idx + 1}`}
                  className={`h-1 rounded-sm transition-all cursor-pointer ${
                    idx === s3Idx ? 'w-5 bg-[#c8b89a]' : 'w-1.5 bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
           §04 · ASYMMETRIC SPLIT · DUAL FORMAT
      ════════════════════════════════════════════ */}
      {visibleDropSet.has('s4a') && (
        <section id="sec-04" className="space-y-3 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-36">
          <DropBlockHeader
            dropMeta={mergedDrops.s4a}
            engineSpec="04 · ASYMMETRIC SPLIT · DUAL FORMAT"
            counterLabel={`0${s4aIdx + 1} / 0${slidersData.s4a.length}`}
            editSectionKey="s4a"
            isSaved={savedDropIds.includes('s04')}
            copiedDropId={copiedDropId}
            onInspect={handleInspectDrop}
            onCopyLink={handleCopyDropLink}
            onToggleSave={handleToggleSaveDrop}
            onEditSection={openPhotoManagerFor}
            t={t}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {/* Left */}
            <div className="md:col-span-2 relative aspect-[16/10] sm:aspect-square bg-[#111] overflow-hidden rounded">
              <div
                className="flex h-full transition-transform duration-500"
                style={{ transform: `translateX(-${s4aIdx * 100}%)` }}
              >
                {slidersData.s4a.map((slide, i) => (
                  <div
                    key={i}
                    onClick={() => handleInspectDrop('s4a', i)}
                    className="flex-shrink-0 w-full h-full bg-cover bg-center relative cursor-pointer"
                    style={{ backgroundImage: `url('${slide.url}')` }}
                  >
                    <div className="rx-grad-b" />
                    <div className="absolute bottom-6 left-6 z-10">
                      <span className="text-[8px] text-[#c8b89a] block uppercase">[ {slide.tag} ]</span>
                      <h3 className="serif-display italic text-2xl text-white">{slide.title}</h3>
                      <span className="text-[9px] text-[#888888] block mt-1">{slide.sub}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="absolute bottom-0 right-0 z-20 flex bg-[#050505]/80 border-t border-l border-[#1c1c1c]">
                <button
                  type="button"
                  onClick={() => setS4aIdx((c) => (c - 1 + slidersData.s4a.length) % slidersData.s4a.length)}
                  className="px-3 py-2 text-xs hover:text-[#c8b89a] cursor-pointer"
                >
                  ← PREV
                </button>
                <button
                  type="button"
                  onClick={() => setS4aIdx((c) => (c + 1) % slidersData.s4a.length)}
                  className="px-3 py-2 text-xs hover:text-[#c8b89a] border-l border-[#1c1c1c] cursor-pointer"
                >
                  NEXT →
                </button>
              </div>
              <span className="absolute bottom-2 left-4 z-20 text-[9px] text-[#c8b89a] font-mono">
                0{s4aIdx + 1} / 0{slidersData.s4a.length}
              </span>
            </div>

            {/* Right */}
            <div className="relative aspect-square bg-[#111] overflow-hidden rounded">
              <div
                className="flex flex-col h-full transition-transform duration-500"
                style={{ transform: `translateY(-${s4bIdx * 100}%)` }}
              >
                {slidersData.s4b.map((slide, i) => (
                  <div
                    key={i}
                    onClick={() => handleInspectDrop('s4a', slidersData.s4a.length + i)}
                    className="flex-shrink-0 w-full h-full bg-cover bg-center relative cursor-pointer"
                    style={{ backgroundImage: `url('${slide.url}')` }}
                  >
                    <div className="rx-grad-b" />
                    <div className="absolute bottom-4 left-4 z-10">
                      <span className="text-[8px] text-[#c8b89a] block uppercase">[ {slide.tag} ]</span>
                      <p className="serif-display italic text-base text-white">{slide.title}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute bottom-0 right-0 z-20 flex bg-[#050505]/80 border-t border-l border-[#1c1c1c]">
                <button
                  type="button"
                  onClick={() => setS4bIdx((c) => (c - 1 + slidersData.s4b.length) % slidersData.s4b.length)}
                  className="p-2 text-xs hover:text-[#c8b89a] cursor-pointer"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => setS4bIdx((c) => (c + 1) % slidersData.s4b.length)}
                  className="p-2 text-xs hover:text-[#c8b89a] border-l border-[#1c1c1c] cursor-pointer"
                >
                  ↓
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
           §05 · PORTRAIT TRIPTYCH · 9:16 VERTICAL
      ════════════════════════════════════════════ */}
      {visibleDropSet.has('s5a') && (
        <section id="sec-05" className="space-y-3 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-36">
          <DropBlockHeader
            dropMeta={mergedDrops.s5a}
            engineSpec="05 · PORTRAIT TRIPTYCH · 9:16 · VERTICAL SLIDER"
            counterLabel="3-COL TRIPTYCH"
            editSectionKey="s5a"
            isSaved={savedDropIds.includes('s05')}
            copiedDropId={copiedDropId}
            onInspect={handleInspectDrop}
            onCopyLink={handleCopyDropLink}
            onToggleSave={handleToggleSaveDrop}
            onEditSection={openPhotoManagerFor}
            t={t}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Column 1 */}
            <div className="relative aspect-[9/16] bg-[#111] overflow-hidden rounded">
              <div
                className="flex flex-col h-full transition-transform duration-500"
                style={{ transform: `translateY(-${s5aIdx * 100}%)` }}
              >
                {slidersData.s5a.map((slide, i) => (
                  <div
                    key={i}
                    onClick={() => handleInspectDrop('s5a', i)}
                    className="flex-shrink-0 w-full h-full bg-cover bg-center relative cursor-pointer"
                    style={{ backgroundImage: `url('${slide.url}')` }}
                  >
                    <div className="rx-grad-b" />
                    <div className="absolute bottom-6 left-6 z-10">
                      <span className="text-[8px] text-[#c8b89a] block uppercase">[ {slide.tag} ]</span>
                      <p className="serif-display italic text-lg text-white">{slide.title}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute bottom-0 right-0 z-20 flex bg-[#050505]/80 border-t border-l border-[#1c1c1c]">
                <button
                  type="button"
                  onClick={() => setS5aIdx((c) => (c - 1 + slidersData.s5a.length) % slidersData.s5a.length)}
                  className="p-2 text-xs hover:text-[#c8b89a] cursor-pointer"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => setS5aIdx((c) => (c + 1) % slidersData.s5a.length)}
                  className="p-2 text-xs hover:text-[#c8b89a] border-l border-[#1c1c1c] cursor-pointer"
                >
                  ↓
                </button>
              </div>
            </div>

            {/* Column 2 */}
            <div className="relative aspect-[9/16] bg-[#111] overflow-hidden rounded">
              <div
                className="flex flex-col h-full transition-transform duration-500"
                style={{ transform: `translateY(-${s5bIdx * 100}%)` }}
              >
                {slidersData.s5b.map((slide, i) => (
                  <div
                    key={i}
                    onClick={() => handleInspectDrop('s5a', slidersData.s5a.length + i)}
                    className="flex-shrink-0 w-full h-full bg-cover bg-center relative cursor-pointer"
                    style={{ backgroundImage: `url('${slide.url}')` }}
                  >
                    <div className="rx-grad-b" />
                    <div className="absolute bottom-6 left-6 z-10">
                      <span className="text-[8px] text-[#c8b89a] block uppercase">[ {slide.tag} ]</span>
                      <p className="serif-display italic text-lg text-white">{slide.title}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute bottom-0 right-0 z-20 flex bg-[#050505]/80 border-t border-l border-[#1c1c1c]">
                <button
                  type="button"
                  onClick={() => setS5bIdx((c) => (c - 1 + slidersData.s5b.length) % slidersData.s5b.length)}
                  className="p-2 text-xs hover:text-[#c8b89a] cursor-pointer"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => setS5bIdx((c) => (c + 1) % slidersData.s5b.length)}
                  className="p-2 text-xs hover:text-[#c8b89a] border-l border-[#1c1c1c] cursor-pointer"
                >
                  ↓
                </button>
              </div>
            </div>

            {/* Column 3 */}
            <div className="relative aspect-[9/16] bg-[#111] overflow-hidden rounded">
              <div
                className="flex flex-col h-full transition-transform duration-500"
                style={{ transform: `translateY(-${s5cIdx * 100}%)` }}
              >
                {slidersData.s5c.map((slide, i) => (
                  <div
                    key={i}
                    onClick={() =>
                      handleInspectDrop('s5a', slidersData.s5a.length + slidersData.s5b.length + i)
                    }
                    className="flex-shrink-0 w-full h-full bg-cover bg-center relative cursor-pointer"
                    style={{ backgroundImage: `url('${slide.url}')` }}
                  >
                    <div className="rx-grad-b" />
                    <div className="absolute bottom-6 left-6 z-10">
                      <span className="text-[8px] text-[#c8b89a] block uppercase">[ {slide.tag} ]</span>
                      <p className="serif-display italic text-lg text-white">{slide.title}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute bottom-0 right-0 z-20 flex bg-[#050505]/80 border-t border-l border-[#1c1c1c]">
                <button
                  type="button"
                  onClick={() => setS5cIdx((c) => (c - 1 + slidersData.s5c.length) % slidersData.s5c.length)}
                  className="p-2 text-xs hover:text-[#c8b89a] cursor-pointer"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => setS5cIdx((c) => (c + 1) % slidersData.s5c.length)}
                  className="p-2 text-xs hover:text-[#c8b89a] border-l border-[#1c1c1c] cursor-pointer"
                >
                  ↓
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
           §06 · CROSSFADE HERO · 21:9 · AUTO
      ════════════════════════════════════════════ */}
      {visibleDropSet.has('s6') && (
        <section id="sec-06" className="space-y-3 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-36">
          <DropBlockHeader
            dropMeta={mergedDrops.s6}
            engineSpec="06 · AUTO BROADCAST · 21:9 · CROSSFADE"
            counterLabel={`LIVE · ${String(s6Idx + 1).padStart(2, '0')} / ${String(slidersData.s6.length).padStart(2, '0')}`}
            editSectionKey="s6"
            isSaved={savedDropIds.includes('s06')}
            copiedDropId={copiedDropId}
            onInspect={handleInspectDrop}
            onCopyLink={handleCopyDropLink}
            onToggleSave={handleToggleSaveDrop}
            onEditSection={openPhotoManagerFor}
            t={t}
          />

          <div className="relative aspect-[21/9] bg-[#111111] overflow-hidden rounded shadow-2xl">
            {slidersData.s6.map((slide, idx) => (
              <div
                key={idx}
                onClick={() => handleInspectDrop('s6', idx)}
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 cursor-pointer ${
                  idx === s6Idx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
                style={{ backgroundImage: `url('${slide.url}')` }}
              />
            ))}

            <div className="rx-grad-b z-20 pointer-events-none" />
            <div className="rx-scanlines z-20 pointer-events-none" />

            <div className="absolute bottom-6 left-6 z-30 pointer-events-none">
              <span className="text-[8px] tracking-[0.25em] text-[#c8b89a] uppercase block">
                [ {slidersData.s6[s6Idx]?.tag || 'Stream'} ]
              </span>
              <h3 className="serif-display italic text-2xl sm:text-4xl text-white">
                {slidersData.s6[s6Idx]?.title || 'Live Broadcast'}
              </h3>
            </div>

            <div className="absolute bottom-0 left-0 h-[2px] bg-[#c8b89a] z-30" style={{ width: `${s6Progress}%` }} />
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
           §07 · PORTRAIT GRID · 4:5 · HORIZONTAL
      ════════════════════════════════════════════ */}
      {visibleDropSet.has('s7a') && (
        <section id="sec-07" className="space-y-3 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-36">
          <DropBlockHeader
            dropMeta={mergedDrops.s7a}
            engineSpec="07 · PORTRAIT GRID · 4:5 · HORIZONTAL SWIPE"
            counterLabel="4:5 PORTRAIT MATRIX"
            editSectionKey="s7a"
            isSaved={savedDropIds.includes('s07')}
            copiedDropId={copiedDropId}
            onInspect={handleInspectDrop}
            onCopyLink={handleCopyDropLink}
            onToggleSave={handleToggleSaveDrop}
            onEditSection={openPhotoManagerFor}
            t={t}
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { data: slidersData.s7a, idx: s7aIdx, setIdx: setS7aIdx, offset: 0 },
              { data: slidersData.s7b, idx: s7bIdx, setIdx: setS7bIdx, offset: slidersData.s7a.length },
              {
                data: slidersData.s7c,
                idx: s7cIdx,
                setIdx: setS7cIdx,
                offset: slidersData.s7a.length + slidersData.s7b.length,
              },
              {
                data: slidersData.s7d,
                idx: s7dIdx,
                setIdx: setS7dIdx,
                offset: slidersData.s7a.length + slidersData.s7b.length + slidersData.s7c.length,
              },
            ].map((col, cIdx) => (
              <div key={cIdx} className="relative aspect-[4/5] bg-[#111] overflow-hidden rounded">
                <div
                  className="flex h-full transition-transform duration-500"
                  style={{ transform: `translateX(-${col.idx * 100}%)` }}
                >
                  {col.data.map((slide, sIdx) => (
                    <div
                      key={sIdx}
                      onClick={() => handleInspectDrop('s7a', col.offset + sIdx)}
                      className="flex-shrink-0 w-full h-full bg-cover bg-center relative cursor-pointer"
                      style={{ backgroundImage: `url('${slide.url}')` }}
                    >
                      <div className="rx-grad-b" />
                      <div className="absolute bottom-3 left-3 z-10">
                        <span className="text-[8px] text-[#c8b89a] block uppercase">{slide.tag}</span>
                        <p className="serif-display italic text-sm text-white">{slide.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-0 right-0 z-20 flex bg-[#050505]/80 border-t border-l border-[#1c1c1c]">
                  <button
                    type="button"
                    onClick={() => col.setIdx((c) => (c - 1 + col.data.length) % col.data.length)}
                    className="p-2 text-xs hover:text-[#c8b89a] cursor-pointer"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => col.setIdx((c) => (c + 1) % col.data.length)}
                    className="p-2 text-xs hover:text-[#c8b89a] border-l border-[#1c1c1c] cursor-pointer"
                  >
                    →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
           §08 · DUAL LANDSCAPE · 16:9 VERTICAL
      ════════════════════════════════════════════ */}
      {visibleDropSet.has('s8a') && (
        <section id="sec-08" className="space-y-3 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-36">
          <DropBlockHeader
            dropMeta={mergedDrops.s8a}
            engineSpec="08 · DUAL LANDSCAPE · 16:9 · VERTICAL SLIDE"
            counterLabel="DUAL 16:9 DECK"
            editSectionKey="s8a"
            isSaved={savedDropIds.includes('s08')}
            copiedDropId={copiedDropId}
            onInspect={handleInspectDrop}
            onCopyLink={handleCopyDropLink}
            onToggleSave={handleToggleSaveDrop}
            onEditSection={openPhotoManagerFor}
            t={t}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {/* Left 16:9 */}
            <div className="relative aspect-video bg-[#111] overflow-hidden rounded">
              <div
                className="flex flex-col h-full transition-transform duration-500"
                style={{ transform: `translateY(-${s8aIdx * 100}%)` }}
              >
                {slidersData.s8a.map((slide, i) => (
                  <div
                    key={i}
                    onClick={() => handleInspectDrop('s8a', i)}
                    className="flex-shrink-0 w-full h-full bg-cover bg-center relative cursor-pointer"
                    style={{ backgroundImage: `url('${slide.url}')` }}
                  >
                    <div className="rx-grad-b" />
                    <div className="absolute bottom-6 left-6 z-10">
                      <span className="text-[8px] text-[#c8b89a] block uppercase">[ {slide.tag} ]</span>
                      <h3 className="serif-display italic text-2xl text-white">{slide.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute bottom-0 right-0 z-20 flex bg-[#050505]/80 border-t border-l border-[#1c1c1c]">
                <button
                  type="button"
                  onClick={() => setS8aIdx((c) => (c - 1 + slidersData.s8a.length) % slidersData.s8a.length)}
                  className="p-2 text-xs hover:text-[#c8b89a] cursor-pointer"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => setS8aIdx((c) => (c + 1) % slidersData.s8a.length)}
                  className="p-2 text-xs hover:text-[#c8b89a] border-l border-[#1c1c1c] cursor-pointer"
                >
                  ↓
                </button>
              </div>
            </div>

            {/* Right 16:9 */}
            <div className="relative aspect-video bg-[#111] overflow-hidden rounded">
              <div
                className="flex flex-col h-full transition-transform duration-500"
                style={{ transform: `translateY(-${s8bIdx * 100}%)` }}
              >
                {slidersData.s8b.map((slide, i) => (
                  <div
                    key={i}
                    onClick={() => handleInspectDrop('s8a', slidersData.s8a.length + i)}
                    className="flex-shrink-0 w-full h-full bg-cover bg-center relative cursor-pointer"
                    style={{ backgroundImage: `url('${slide.url}')` }}
                  >
                    <div className="rx-grad-b" />
                    <div className="absolute bottom-6 left-6 z-10">
                      <span className="text-[8px] text-[#c8b89a] block uppercase">[ {slide.tag} ]</span>
                      <h3 className="serif-display italic text-2xl text-white">{slide.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute bottom-0 right-0 z-20 flex bg-[#050505]/80 border-t border-l border-[#1c1c1c]">
                <button
                  type="button"
                  onClick={() => setS8bIdx((c) => (c - 1 + slidersData.s8b.length) % slidersData.s8b.length)}
                  className="p-2 text-xs hover:text-[#c8b89a] cursor-pointer"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => setS8bIdx((c) => (c + 1) % slidersData.s8b.length)}
                  className="p-2 text-xs hover:text-[#c8b89a] border-l border-[#1c1c1c] cursor-pointer"
                >
                  ↓
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
           §09 · STANDARD HERO · 16:9
      ════════════════════════════════════════════ */}
      {visibleDropSet.has('s9') && (
        <section id="sec-09" className="space-y-3 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-36">
          <DropBlockHeader
            dropMeta={mergedDrops.s9}
            engineSpec="09 · STANDARD HERO · 16:9 EDITORIAL"
            counterLabel={`0${s9Idx + 1} / 0${slidersData.s9.length}`}
            editSectionKey="s9"
            isSaved={savedDropIds.includes('s09')}
            copiedDropId={copiedDropId}
            onInspect={handleInspectDrop}
            onCopyLink={handleCopyDropLink}
            onToggleSave={handleToggleSaveDrop}
            onEditSection={openPhotoManagerFor}
            t={t}
          />

          <div className="relative aspect-video bg-[#111111] overflow-hidden rounded shadow-2xl">
            <div
              className="flex h-full transition-transform duration-700"
              style={{ transform: `translateX(-${s9Idx * 100}%)` }}
            >
              {slidersData.s9.map((slide, i) => (
                <div
                  key={i}
                  onClick={() => handleInspectDrop('s9', i)}
                  className="flex-shrink-0 w-full h-full bg-cover bg-center relative cursor-pointer"
                  style={{ backgroundImage: `url('${slide.url}')` }}
                >
                  <div className="rx-grad-b" />
                  <div className="rx-vignette" />
                  <div className="absolute bottom-8 left-8 z-10">
                    <span className="text-[8px] text-[#c8b89a] block uppercase">[ {slide.tag} ]</span>
                    <h3 className="serif-display italic text-3xl sm:text-5xl text-white font-normal">{slide.title}</h3>
                    <span className="text-[10px] text-[#888888] uppercase block mt-1">{slide.sub}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {slidersData.s9.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setS9Idx(i)}
                  aria-label={`Hero slide ${i + 1}`}
                  className={`h-1.5 rounded-sm transition-all cursor-pointer ${
                    i === s9Idx ? 'w-8 bg-[#c8b89a]' : 'w-2 bg-white/20'
                  }`}
                />
              ))}
            </div>

            <div className="absolute bottom-0 right-0 z-20 flex bg-[#050505]/80 border-t border-l border-[#1c1c1c]">
              <button
                type="button"
                onClick={() => setS9Idx((c) => (c - 1 + slidersData.s9.length) % slidersData.s9.length)}
                className="px-4 py-2.5 text-xs hover:text-[#c8b89a] cursor-pointer"
              >
                ← PREV
              </button>
              <button
                type="button"
                onClick={() => setS9Idx((c) => (c + 1) % slidersData.s9.length)}
                className="px-4 py-2.5 text-xs hover:text-[#c8b89a] border-l border-[#1c1c1c] cursor-pointer"
              >
                NEXT →
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
           §10 · FOOTER BANNER · 8:1
      ════════════════════════════════════════════ */}
      {visibleDropSet.has('s10') && (
        <section id="sec-10" className="space-y-3 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-36">
          <DropBlockHeader
            dropMeta={mergedDrops.s10}
            engineSpec="10 · FOOTER BANNER · 8:1 ULTRA WIDE SLICE"
            counterLabel={`0${s10Idx + 1} / 0${slidersData.s10.length}`}
            editSectionKey="s10"
            isSaved={savedDropIds.includes('s10')}
            copiedDropId={copiedDropId}
            onInspect={handleInspectDrop}
            onCopyLink={handleCopyDropLink}
            onToggleSave={handleToggleSaveDrop}
            onEditSection={openPhotoManagerFor}
            t={t}
          />

          <div className="relative aspect-[8/1] sm:aspect-[8/1] bg-[#111111] overflow-hidden rounded shadow-xl">
            <div
              className="flex h-full transition-transform duration-500"
              style={{ transform: `translateX(-${s10Idx * 100}%)` }}
            >
              {slidersData.s10.map((slide, i) => (
                <div
                  key={i}
                  onClick={() => handleInspectDrop('s10', i)}
                  className="flex-shrink-0 w-full h-full bg-cover bg-center relative cursor-pointer"
                  style={{ backgroundImage: `url('${slide.url}')` }}
                >
                  <div className="rx-grad-b" />
                </div>
              ))}
            </div>

            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none px-4 text-center">
              <span className="font-mono text-[9px] sm:text-[11px] tracking-[0.35em] uppercase text-[#c8b89a]/85 font-bold">
                <span className="normal-case">RAWx</span> Architectural Stripe · 460 GSM Capsule
              </span>
            </div>

            <div className="absolute bottom-0 right-0 z-20 flex bg-[#050505]/80 border-t border-l border-[#1c1c1c]">
              <button
                type="button"
                onClick={() => setS10Idx((c) => (c - 1 + slidersData.s10.length) % slidersData.s10.length)}
                className="px-3 py-1 text-xs hover:text-[#c8b89a] cursor-pointer"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => setS10Idx((c) => (c + 1) % slidersData.s10.length)}
                className="px-3 py-1 text-xs hover:text-[#c8b89a] border-l border-[#1c1c1c] cursor-pointer"
              >
                →
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
           §11 · BEFORE / AFTER GRADE COMPARISON
      ════════════════════════════════════════════ */}
      {visibleDropSet.has('s11') && (
        <section id="sec-11" className="space-y-3 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-36">
          <DropBlockHeader
            dropMeta={mergedDrops.s11}
            engineSpec="11 · BEFORE / AFTER · GRADE COMPARISON DRAG"
            counterLabel={BA_FILTERS[baFilterIndex].name.toUpperCase()}
            editSectionKey="s11"
            isSaved={savedDropIds.includes('s11')}
            copiedDropId={copiedDropId}
            onInspect={handleInspectDrop}
            onCopyLink={handleCopyDropLink}
            onToggleSave={handleToggleSaveDrop}
            onEditSection={openPhotoManagerFor}
            t={t}
          />

          {/* Preset filter selector */}
          <div className="flex items-center justify-end gap-1">
            <span className="text-[9px] text-[#888888] mr-1">ACTIVE LUT:</span>
            {BA_FILTERS.map((f, fIdx) => (
              <button
                key={fIdx}
                type="button"
                onClick={() => setBaFilterIndex(fIdx)}
                className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase transition-all cursor-pointer ${
                  baFilterIndex === fIdx
                    ? 'bg-[#c8b89a] text-black font-bold'
                    : 'bg-white/5 text-white/60 hover:text-white'
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>

          <div
            ref={baBoxRef}
            onMouseDown={() => (isBaDragging.current = true)}
            onMouseUp={() => (isBaDragging.current = false)}
            onMouseLeave={() => (isBaDragging.current = false)}
            onMouseMove={(e) => handleBaMove(e.clientX)}
            onTouchStart={() => (isBaDragging.current = true)}
            onTouchEnd={() => (isBaDragging.current = false)}
            onTouchMove={(e) => handleBaMove(e.touches[0].clientX)}
            className="relative aspect-[21/9] bg-[#111111] overflow-hidden rounded cursor-ew-resize select-none shadow-2xl"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${slidersData.s11.beforeUrl}')` }}
            />

            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-300"
              style={{
                backgroundImage: `url('${slidersData.s11.afterUrl}')`,
                filter: BA_FILTERS[baFilterIndex].filter,
                clipPath: `inset(0 ${100 - baPosition}% 0 0)`,
              }}
            />

            <div
              className="absolute top-0 bottom-0 w-[2px] bg-[#c8b89a] z-20 pointer-events-none -translate-x-1/2"
              style={{ left: `${baPosition}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#050505]/90 border border-[#c8b89a] flex items-center justify-center text-[8px] text-[#c8b89a] tracking-tighter shadow-xl">
                ← →
              </div>
            </div>

            <div className="absolute top-4 left-4 z-10 bg-[#050505]/75 border border-[#1c1c1c] px-3 py-1 text-[8px] text-[#c8b89a] tracking-widest uppercase">
              [ {slidersData.s11.beforeLabel || 'RAW'} ]
            </div>
            <div className="absolute top-4 right-4 z-10 bg-[#050505]/75 border border-[#1c1c1c] px-3 py-1 text-[8px] text-[#c8b89a] tracking-widest uppercase">
              [ {slidersData.s11.afterLabel || 'GRADED'} · {BA_FILTERS[baFilterIndex].name} ]
            </div>

            <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
              <span className="text-[8px] text-[#c8b89a] block uppercase">[ {slidersData.s11.tag} ]</span>
              <h3 className="serif-display italic text-xl sm:text-2xl text-white">{slidersData.s11.title}</h3>
              <span className="text-[9px] text-[#888888] uppercase block mt-0.5">{slidersData.s11.sub}</span>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
           §12 · VIDEO SLIDE · 21:9 · MUTED AUTOPLAY
      ════════════════════════════════════════════ */}
      {visibleDropSet.has('s12') && (
        <section id="sec-12" className="space-y-3 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-36">
          <DropBlockHeader
            dropMeta={mergedDrops.s12}
            engineSpec="12 · VIDEO SLIDE · 21:9 · MUTED AUTOPLAY"
            counterLabel={`VIDEO ${String(s12Idx + 1).padStart(3, '0')} / ${String(slidersData.s12.length).padStart(3, '0')}`}
            editSectionKey="s12"
            isSaved={savedDropIds.includes('s12')}
            copiedDropId={copiedDropId}
            onInspect={handleInspectDrop}
            onCopyLink={handleCopyDropLink}
            onToggleSave={handleToggleSaveDrop}
            onEditSection={openPhotoManagerFor}
            t={t}
          />

          <div className="relative aspect-[21/9] bg-[#111111] overflow-hidden rounded shadow-2xl">
            <div
              className="flex h-full transition-transform duration-700"
              style={{ transform: `translateX(-${s12Idx * 100}%)` }}
            >
              {slidersData.s12.map((slide, i) => (
                <div
                  key={i}
                  onClick={() => handleInspectDrop('s12', i)}
                  className="flex-shrink-0 w-full h-full relative overflow-hidden bg-cover bg-center cursor-pointer"
                  style={{ backgroundImage: `url('${slide.url}')` }}
                >
                  {slide.videoUrl ? (
                    <video
                      ref={(el) => {
                        videoRefs.current[i] = el;
                      }}
                      src={slide.videoUrl}
                      poster={slide.url}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : null}

                  <div className="rx-grad-b z-10" />
                  <div className="rx-scanlines z-10" />

                  <div className="absolute bottom-6 left-6 z-20">
                    <span className="text-[8px] text-[#c8b89a] block uppercase">[ {slide.tag} ]</span>
                    <h3 className="serif-display italic text-2xl sm:text-3xl text-white">{slide.title}</h3>
                    <span className="text-[9px] text-[#888888] block mt-1">{slide.sub}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute bottom-0 right-0 z-20 flex bg-[#050505]/80 border-t border-l border-[#1c1c1c]">
              <button
                type="button"
                onClick={() => setS12Idx((c) => (c - 1 + slidersData.s12.length) % slidersData.s12.length)}
                className="px-4 py-2.5 text-xs hover:text-[#c8b89a] cursor-pointer"
              >
                ← PREV
              </button>
              <button
                type="button"
                onClick={() => setS12Idx((c) => (c + 1) % slidersData.s12.length)}
                className="px-4 py-2.5 text-xs hover:text-[#c8b89a] border-l border-[#1c1c1c] cursor-pointer"
              >
                NEXT →
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
           §13 (A) · ZOOM-BURST · 21:9 SCALE POP
      ════════════════════════════════════════════ */}
      {visibleDropSet.has('sA') && (
        <section id="sec-a" className="space-y-3 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-36">
          <DropBlockHeader
            dropMeta={mergedDrops.sA}
            engineSpec="13 · ZOOM-BURST · 21:9 · SCALE POP TRANSITION"
            counterLabel={`AUTO · ${String(zbIdx + 1).padStart(2, '0')} / ${String(slidersData.sA.length).padStart(2, '0')}`}
            editSectionKey="sA"
            isSaved={savedDropIds.includes('s13')}
            copiedDropId={copiedDropId}
            onInspect={handleInspectDrop}
            onCopyLink={handleCopyDropLink}
            onToggleSave={handleToggleSaveDrop}
            onEditSection={openPhotoManagerFor}
            t={t}
          />

          <div className="relative aspect-[21/9] bg-[#111111] overflow-hidden rounded shadow-2xl">
            {slidersData.sA.map((slide, idx) => (
              <div
                key={idx}
                onClick={() => handleInspectDrop('sA', idx)}
                className={`absolute inset-0 bg-cover bg-center cursor-pointer transition-opacity duration-500 ${
                  idx === zbIdx ? 'zb-enter opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
                style={{ backgroundImage: `url('${slide.url}')` }}
              />
            ))}

            <div className="rx-grad-b z-10 pointer-events-none" />
            <div className="rx-scanlines z-10 pointer-events-none" />

            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 z-20 pointer-events-none">
              <span className="text-[8px] tracking-[0.4em] text-[#888888] uppercase block mb-1">
                SEQ 0{zbIdx + 1} / 0{slidersData.sA.length}
              </span>
              <h3 className="serif-display italic text-2xl sm:text-5xl text-white leading-tight">
                {slidersData.sA[zbIdx]?.title}
              </h3>
              <span className="text-[9px] tracking-widest text-[#888888] uppercase block mt-2">
                {slidersData.sA[zbIdx]?.sub}
              </span>
            </div>

            <div className="absolute top-1/2 right-10 -translate-y-1/2 z-10 text-8xl sm:text-9xl font-bold text-[#c8b89a]/5 pointer-events-none">
              0{zbIdx + 1}
            </div>

            <div className="absolute bottom-0 left-0 h-[2px] bg-[#c8b89a] z-30" style={{ width: `${zbProgress}%` }} />

            <div className="absolute bottom-0 right-0 z-20 flex bg-[#050505]/80 border-t border-l border-[#1c1c1c]">
              <button
                type="button"
                onClick={() => setZbIdx((c) => (c - 1 + slidersData.sA.length) % slidersData.sA.length)}
                className="px-3 py-2 text-xs hover:text-[#c8b89a] cursor-pointer"
              >
                ← PREV
              </button>
              <button
                type="button"
                onClick={() => setZbIdx((c) => (c + 1) % slidersData.sA.length)}
                className="px-3 py-2 text-xs hover:text-[#c8b89a] border-l border-[#1c1c1c] cursor-pointer"
              >
                NEXT →
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
           §14 (B) · STAGGER REVEAL GRID 3×2
      ════════════════════════════════════════════ */}
      {visibleDropSet.has('sB') && (
        <section id="sec-b" className="space-y-3 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-36">
          <DropBlockHeader
            dropMeta={mergedDrops.sB}
            engineSpec="14 · STAGGER REVEAL GRID · 3×2 · CASCADE SEQUENCE"
            counterLabel={`SET ${String(staggerSetIdx + 1).padStart(2, '0')} / 02`}
            editSectionKey="sB"
            isSaved={savedDropIds.includes('s14')}
            copiedDropId={copiedDropId}
            onInspect={handleInspectDrop}
            onCopyLink={handleCopyDropLink}
            onToggleSave={handleToggleSaveDrop}
            onEditSection={openPhotoManagerFor}
            t={t}
          />

          <div className="relative aspect-[16/7] bg-[#111111] overflow-hidden rounded shadow-2xl">
            <div className="grid grid-cols-2 sm:grid-cols-3 grid-rows-2 gap-0.5 h-full">
              {slidersData.sB.cells.map((cell, i) => (
                <div
                  key={i}
                  onClick={() => handleInspectDrop('sB', i)}
                  className="relative overflow-hidden bg-[#161512] group cursor-pointer"
                >
                  <div
                    className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ${
                      staggerRevealed ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
                    }`}
                    style={{
                      backgroundImage: `url('${cell.sets[staggerSetIdx] || cell.sets[0]}')`,
                      transitionDelay: `${i * 90}ms`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3 z-10">
                    <span className="text-[8px] tracking-widest uppercase text-[#c8b89a] font-bold">
                      {cell.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute top-0 left-0 h-[2px] bg-[#c8b89a] z-30" style={{ width: `${staggerProgress}%` }} />
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
           §15 (C) · COUNTDOWN RING TIMER AUTO · 16:9
      ════════════════════════════════════════════ */}
      {visibleDropSet.has('sC') && (
        <section id="sec-c" className="space-y-3 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-36">
          <DropBlockHeader
            dropMeta={mergedDrops.sC}
            engineSpec="15 · COUNTDOWN RING · 16:9 · SVG TIMER AUTO"
            counterLabel={`${String(cdIdx + 1).padStart(2, '0')} / ${String(slidersData.sC.length).padStart(2, '0')}`}
            editSectionKey="sC"
            isSaved={savedDropIds.includes('s15')}
            copiedDropId={copiedDropId}
            onInspect={handleInspectDrop}
            onCopyLink={handleCopyDropLink}
            onToggleSave={handleToggleSaveDrop}
            onEditSection={openPhotoManagerFor}
            t={t}
          />

          <div className="relative aspect-video bg-[#111111] overflow-hidden rounded shadow-2xl">
            <div
              className="flex h-full transition-transform duration-700"
              style={{ transform: `translateX(-${cdIdx * 100}%)` }}
            >
              {slidersData.sC.map((slide, i) => (
                <div
                  key={i}
                  onClick={() => handleInspectDrop('sC', i)}
                  className="flex-shrink-0 w-full h-full bg-cover bg-center relative cursor-pointer"
                  style={{ backgroundImage: `url('${slide.url}')` }}
                >
                  <div className="rx-grad-b" />
                  <div className="rx-scanlines" />
                  <div className="absolute bottom-8 left-8 z-10">
                    <span className="text-[8px] text-[#c8b89a] block uppercase">[ {slide.tag} ]</span>
                    <h3 className="serif-display italic text-2xl sm:text-4xl text-white">{slide.title}</h3>
                    <span className="text-[9px] text-[#888888] block mt-1">{slide.sub}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute top-5 right-5 z-20 w-14 h-14 flex items-center justify-center bg-black/75 rounded-full border border-[#f3efe6]/15 shadow-xl pointer-events-none">
              <svg className="w-12 h-12 -rotate-90">
                <circle cx="24" cy="24" r="20" stroke="rgba(200,184,154,0.15)" strokeWidth="2.5" fill="none" />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="#c8b89a"
                  strokeWidth="2.5"
                  fill="none"
                  strokeDasharray={125.6}
                  strokeDashoffset={Math.max(0, 125.6 - (cdProgress / 100) * 125.6)}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute font-mono text-sm text-[#c8b89a] font-bold">
                {Math.max(1, Math.ceil((1 - cdProgress / 100) * 5))}
              </span>
            </div>

            <div className="absolute bottom-0 right-0 z-20 flex bg-[#050505]/80 border-t border-l border-[#1c1c1c]">
              <button
                type="button"
                onClick={() => setCdIdx((c) => (c - 1 + slidersData.sC.length) % slidersData.sC.length)}
                className="px-3 py-2 text-xs hover:text-[#c8b89a] cursor-pointer"
              >
                ← PREV
              </button>
              <button
                type="button"
                onClick={() => setCdIdx((c) => (c + 1) % slidersData.sC.length)}
                className="px-3 py-2 text-xs hover:text-[#c8b89a] border-l border-[#1c1c1c] cursor-pointer"
              >
                NEXT →
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
           §16 (D) · SPLIT-PANEL DUAL-AXIS
      ════════════════════════════════════════════ */}
      {visibleDropSet.has('sD') && (
        <section id="sec-d" className="space-y-3 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-36">
          <DropBlockHeader
            dropMeta={mergedDrops.sD}
            engineSpec="16 · SPLIT-PANEL · DUAL AXIS · OPPOSED MOTION"
            counterLabel={`L: 0${spLeftIdx + 1} · R: 0${spRightIdx + 1}`}
            editSectionKey="sD"
            isSaved={savedDropIds.includes('s16')}
            copiedDropId={copiedDropId}
            onInspect={handleInspectDrop}
            onCopyLink={handleCopyDropLink}
            onToggleSave={handleToggleSaveDrop}
            onEditSection={openPhotoManagerFor}
            t={t}
          />

          <div className="relative aspect-[16/9] bg-[#111111] overflow-hidden rounded shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0.5 h-full">
              {/* Left */}
              <div className="relative overflow-hidden bg-[#161512]">
                <div
                  className="flex h-full transition-transform duration-700"
                  style={{ transform: `translateX(-${spLeftIdx * 100}%)` }}
                >
                  {slidersData.sD.left.map((slide, i) => (
                    <div
                      key={i}
                      onClick={() => handleInspectDrop('sD', i)}
                      className="flex-shrink-0 w-full h-full bg-cover bg-center relative cursor-pointer"
                      style={{ backgroundImage: `url('${slide.url}')` }}
                    >
                      <div className="rx-grad-b" />
                      <div className="absolute bottom-4 left-4 z-10">
                        <span className="text-[8px] text-[#c8b89a] block uppercase">[ {slide.title} ]</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-0 right-0 z-20 flex bg-[#050505]/80 border-t border-l border-[#1c1c1c]">
                  <button
                    type="button"
                    onClick={() => {
                      const nextL = (spLeftIdx - 1 + slidersData.sD.left.length) % slidersData.sD.left.length;
                      setSpLeftIdx(nextL);
                      setSpRightIdx((nextL + 1) % slidersData.sD.right.length);
                    }}
                    className="px-3 py-1.5 text-xs hover:text-[#c8b89a] cursor-pointer"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const nextL = (spLeftIdx + 1) % slidersData.sD.left.length;
                      setSpLeftIdx(nextL);
                      setSpRightIdx((nextL + 1) % slidersData.sD.right.length);
                    }}
                    className="px-3 py-1.5 text-xs hover:text-[#c8b89a] border-l border-[#1c1c1c] cursor-pointer"
                  >
                    →
                  </button>
                </div>
              </div>

              {/* Right */}
              <div className="relative overflow-hidden bg-[#161512]">
                <div
                  className="flex flex-col h-full transition-transform duration-700"
                  style={{ transform: `translateY(-${spRightIdx * 100}%)` }}
                >
                  {slidersData.sD.right.map((slide, i) => (
                    <div
                      key={i}
                      onClick={() => handleInspectDrop('sD', slidersData.sD.left.length + i)}
                      className="flex-shrink-0 w-full h-full bg-cover bg-center relative cursor-pointer"
                      style={{ backgroundImage: `url('${slide.url}')` }}
                    >
                      <div className="rx-grad-b" />
                      <div className="absolute bottom-4 left-4 z-10">
                        <span className="text-[8px] text-[#c8b89a] block uppercase">[ {slide.title} ]</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-0 right-0 z-20 flex bg-[#050505]/80 border-t border-l border-[#1c1c1c]">
                  <button
                    type="button"
                    onClick={() => setSpRightIdx((c) => (c - 1 + slidersData.sD.right.length) % slidersData.sD.right.length)}
                    className="p-2 text-xs hover:text-[#c8b89a] cursor-pointer"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => setSpRightIdx((c) => (c + 1) % slidersData.sD.right.length)}
                    className="p-2 text-xs hover:text-[#c8b89a] border-l border-[#1c1c1c] cursor-pointer"
                  >
                    ↓
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
           §17 (E) · INERTIA FILMSTRIP · MOMENTUM DRAG
      ════════════════════════════════════════════ */}
      {visibleDropSet.has('sE') && (
        <section id="sec-e" className="space-y-3 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-36">
          <DropBlockHeader
            dropMeta={mergedDrops.sE}
            engineSpec="17 · INERTIA FILMSTRIP · MOMENTUM DRAG · FOCUS EXPAND"
            counterLabel="DRAG HORIZONTALLY TO SCRUB"
            editSectionKey="sE"
            isSaved={savedDropIds.includes('s17')}
            copiedDropId={copiedDropId}
            onInspect={handleInspectDrop}
            onCopyLink={handleCopyDropLink}
            onToggleSave={handleToggleSaveDrop}
            onEditSection={openPhotoManagerFor}
            t={t}
          />

          <div
            ref={inertiaContainerRef}
            onMouseDown={(e) => handleInertiaMouseDown(e.clientX)}
            onMouseMove={(e) => handleInertiaMouseMove(e.clientX)}
            onMouseUp={handleInertiaMouseUp}
            onTouchStart={(e) => handleInertiaMouseDown(e.touches[0].clientX)}
            onTouchMove={(e) => handleInertiaMouseMove(e.touches[0].clientX)}
            onTouchEnd={handleInertiaMouseUp}
            className="relative aspect-[21/6] bg-[#111111] overflow-hidden rounded cursor-grab active:cursor-grabbing select-none shadow-2xl"
          >
            <div
              className="flex gap-1 h-full will-change-transform transition-transform duration-75 ease-out"
              style={{ transform: `translateX(-${inertiaOffset}px)` }}
            >
              {slidersData.sE.map((frame, idx) => (
                <div
                  key={idx}
                  onClick={() => handleInspectDrop('sE', idx)}
                  className={`flex-shrink-0 h-full bg-cover bg-center relative transition-all duration-300 cursor-pointer ${
                    focusedInertiaIndex === idx ? 'w-[36%] brightness-100 ring-2 ring-[#c8b89a]' : 'w-[18%] brightness-60'
                  }`}
                  style={{ backgroundImage: `url('${frame.url}')` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end p-3">
                    <span className="text-[8px] tracking-widest text-[#c8b89a] uppercase font-bold truncate">
                      {frame.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="absolute bottom-0 left-0 h-[2px] bg-[#c8b89a] z-20 pointer-events-none"
              style={{
                width: `${Math.min(
                  100,
                  Math.max(5, (focusedInertiaIndex / Math.max(1, slidersData.sE.length - 1)) * 100)
                )}%`,
              }}
            />
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
           §18 (F) · WIPE TRANSITION · 21:9
      ════════════════════════════════════════════ */}
      {visibleDropSet.has('sF') && (
        <section id="sec-f" className="space-y-3 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-36">
          <DropBlockHeader
            dropMeta={mergedDrops.sF}
            engineSpec="18 · WIPE-TRANSITION · 21:9 · DIRECTIONAL REVEAL"
            counterLabel={`${String(wipeIdx + 1).padStart(2, '0')} / ${String(slidersData.sF.length).padStart(2, '0')}`}
            editSectionKey="sF"
            isSaved={savedDropIds.includes('s18')}
            copiedDropId={copiedDropId}
            onInspect={handleInspectDrop}
            onCopyLink={handleCopyDropLink}
            onToggleSave={handleToggleSaveDrop}
            onEditSection={openPhotoManagerFor}
            t={t}
          />

          <div className="relative aspect-[21/9] bg-[#111111] overflow-hidden rounded shadow-2xl">
            {slidersData.sF.map((slide, idx) => (
              <div
                key={idx}
                onClick={() => handleInspectDrop('sF', idx)}
                className={`absolute inset-0 bg-cover bg-center cursor-pointer ${
                  idx === wipeIdx ? `z-10 ${wipeDir}` : 'opacity-0 z-0 pointer-events-none'
                }`}
                style={{ backgroundImage: `url('${slide.url}')` }}
              />
            ))}

            <div className="rx-grad-b z-10 pointer-events-none" />
            <div className="rx-scanlines z-10 pointer-events-none" />

            <div className="absolute bottom-6 left-6 z-20 pointer-events-none">
              <span className="text-[8px] text-[#c8b89a] block uppercase mb-1">
                [ {slidersData.sF[wipeIdx]?.tag || 'Wipe'} ]
              </span>
              <h3 className="serif-display italic text-2xl sm:text-4xl text-white">
                {slidersData.sF[wipeIdx]?.title}
              </h3>
              <span className="text-[9px] text-[#888888] uppercase block mt-1">
                {slidersData.sF[wipeIdx]?.sub}
              </span>
            </div>

            <div className="absolute bottom-0 right-0 z-20 flex bg-[#050505]/80 border-t border-l border-[#1c1c1c]">
              <button
                type="button"
                onClick={() => {
                  setWipeDir('wipe-l');
                  setWipeIdx((c) => (c - 1 + slidersData.sF.length) % slidersData.sF.length);
                }}
                className="px-3 py-2 text-[10px] hover:text-[#c8b89a] cursor-pointer"
              >
                ← PREV
              </button>
              <button
                type="button"
                onClick={() => {
                  setWipeDir('wipe-r');
                  setWipeIdx((c) => (c + 1) % slidersData.sF.length);
                }}
                className="px-3 py-2 text-[10px] hover:text-[#c8b89a] border-l border-[#1c1c1c] cursor-pointer"
              >
                NEXT →
              </button>
            </div>

            <div className="absolute bottom-0 left-0 h-[2px] bg-[#c8b89a] z-30" style={{ width: `${wipeProgress}%` }} />
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
           §19 (G) · RAWx FORGE · 316L BRACELET & HIDE ARCHIVE
      ════════════════════════════════════════════ */}
      {visibleDropSet.has('sG') && sGSlides.length > 0 && (
        <section id="sec-g" className="space-y-3 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-36">
          <DropBlockHeader
            dropMeta={mergedDrops.sG}
            engineSpec="19 · HARDWARE ARCHIVE · 16:9 · PRECISION DECK"
            counterLabel={`FORGE ${String(sGIdx + 1).padStart(2, '0')} / ${String(sGSlides.length).padStart(2, '0')}`}
            editSectionKey="sG"
            isSaved={savedDropIds.includes('s19')}
            copiedDropId={copiedDropId}
            onInspect={handleInspectDrop}
            onCopyLink={handleCopyDropLink}
            onToggleSave={handleToggleSaveDrop}
            onEditSection={openPhotoManagerFor}
            t={t}
          />

          <div className="relative aspect-[16/9] bg-[#111111] overflow-hidden rounded shadow-2xl border border-[#C8A96A]/20">
            <div
              className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.77,0,0.18,1)]"
              style={{ transform: `translateX(-${sGIdx * 100}%)` }}
            >
              {sGSlides.map((slide, idx) => (
                <div
                  key={slide.id || idx}
                  onClick={() => handleInspectDrop('sG', idx)}
                  className="flex-shrink-0 w-full h-full bg-cover bg-center relative cursor-pointer"
                  style={{ backgroundImage: `url('${slide.url}')` }}
                >
                  <div className="rx-grad-b" />
                  <div className="rx-vignette" />
                  <div className="rx-scanlines" />
                  <div className="absolute bottom-8 left-8 z-10 max-w-xl">
                    <span className="text-[8px] text-[#C8A96A] block uppercase tracking-[0.28em]">
                      [ {slide.tag || '316L & Bridle Hide'} ]
                    </span>
                    <h3 className="serif-display italic text-2xl sm:text-4xl text-white mt-1">
                      {slide.title}
                    </h3>
                    <span className="text-[10px] text-[#f4f0e8]/70 uppercase block mt-1.5">
                      {slide.sub}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {sGSlides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSGIdx(idx)}
                  aria-label={`Forge slide ${idx + 1}`}
                  className={`h-1.5 rounded-sm transition-all cursor-pointer ${
                    idx === sGIdx ? 'w-8 bg-[#e11d48]' : 'w-2 bg-white/25 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>

            <div className="absolute bottom-0 right-0 z-20 flex bg-[#050505]/85 border-t border-l border-[#1c1c1c]">
              <button
                type="button"
                onClick={() => setSGIdx((c) => (c - 1 + sGSlides.length) % sGSlides.length)}
                className="px-4 py-2.5 text-xs hover:text-[#C8A96A] cursor-pointer"
              >
                ← PREV
              </button>
              <button
                type="button"
                onClick={() => setSGIdx((c) => (c + 1) % sGSlides.length)}
                className="px-4 py-2.5 text-xs hover:text-[#C8A96A] border-l border-[#1c1c1c] cursor-pointer"
              >
                NEXT →
              </button>
            </div>

            <div
              className="absolute bottom-0 left-0 h-[2px] bg-[#e11d48] z-30"
              style={{ width: `${sGProgress}%` }}
            />
          </div>
        </section>
      )}

      {/* Semantic Ecosystem Subdomain Index Footer */}
      <footer
        className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 border-t flex flex-wrap items-center justify-between gap-4 text-[10px] tracking-[0.18em] uppercase"
        style={{
          borderColor: 'var(--hh-border)',
          color: 'var(--hh-muted)',
        }}
      >
        <span>
          HANDS &amp; HEAD · <span className="normal-case font-bold" style={{ color: 'var(--hh-accent)' }}>RAWx</span> BRAND &amp; 19-DROP LOOKBOOK ENGINE
        </span>
        <nav aria-label="Hands and Head Ecosystem Links" className="flex flex-wrap items-center gap-4">
          <a href="#home" className="hover:underline transition-colors" style={{ color: 'var(--hh-text)' }}>
            Home Hub
          </a>
          <a href="#handfilm" className="hover:underline transition-colors" style={{ color: 'var(--hh-text)' }}>
            HandFilm Studio
          </a>
          <a href="#apps" className="hover:underline transition-colors" style={{ color: 'var(--hh-text)' }}>
            24 Ecosystem Apps
          </a>
          <a
            href="https://storyboard.handsandhead.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline transition-colors"
            style={{ color: 'var(--hh-accent)' }}
          >
            storyboard.handsandhead.com ↗
          </a>
          <a
            href="https://b2b.handsandhead.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline transition-colors"
            style={{ color: 'var(--hh-accent)' }}
          >
            b2b.handsandhead.com ↗
          </a>
        </nav>
      </footer>

      {/* RAWx Product Spec & Pre-Order Slide-Over Drawer */}
      <RawxProductDrawer
        isOpen={drawerDropKey !== null}
        onClose={() => setDrawerDropKey(null)}
        dropMeta={activeDrawerMeta}
        slides={activeDrawerSlides}
        initialSlideIndex={drawerFrameIdx}
        activeGrade={currentGrade}
        isSaved={activeDrawerMeta ? savedDropIds.includes(activeDrawerMeta.dropId) : false}
        onToggleSave={handleToggleSaveDrop}
        onOpenLightbox={onOpenLightbox}
        onCopyDropLink={handleCopyDropLink}
      />

      {/* Dynamic Photo & Drop Studio Manager Modal */}
      <DynamicPhotoManagerModal
        isOpen={isPhotoManagerOpen}
        onClose={() => setIsPhotoManagerOpen(false)}
        slidersData={slidersData}
        onUpdateSlidersData={handleUpdateSlidersData}
        onResetToDefaults={handleResetDefaults}
        defaultSectionKey={photoManagerTargetSection}
      />
    </div>
  );
}
