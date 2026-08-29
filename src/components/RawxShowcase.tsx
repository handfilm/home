import React, { useState, useEffect, useRef, useMemo } from 'react';
import { TICKER_ITEMS } from '../data/initialData';
import { LightboxItem } from './LightboxModal';
import { AllSlidersData, SlideData, ColorGrade } from '../types';
import {
  getStoredSlidersData,
  saveSlidersData,
  resetSlidersData,
} from '../data/sliderDefaults';
import DynamicPhotoManagerModal from './DynamicPhotoManagerModal';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Camera,
  Layers,
  Sparkles,
  Sliders,
  Maximize2,
  RefreshCw,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';

interface RawxShowcaseProps {
  onOpenLightbox: (items: LightboxItem[], startIndex: number) => void;
  speed: number;
}

export default function RawxShowcase({ onOpenLightbox, speed }: RawxShowcaseProps) {
  // Dynamic Sliders Media State with localStorage persistence
  const [slidersData, setSlidersData] = useState<AllSlidersData>(() => getStoredSlidersData());

  // Dynamic Photo Manager Modal State
  const [isPhotoManagerOpen, setIsPhotoManagerOpen] = useState(false);
  const [photoManagerTargetSection, setPhotoManagerTargetSection] = useState<string>('s1');

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
  const [s12Progress, setS12Progress] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // §A Zoom-Burst State
  const [zbIdx, setZbIdx] = useState(0);
  const [zbProgress, setZbProgress] = useState(0);

  // §B Stagger Reveal Grid State
  const [staggerSetIdx, setStaggerSetIdx] = useState(0);
  const [staggerRevealed, setStaggerRevealed] = useState(true);
  const [staggerProgress, setStaggerProgress] = useState(0);

  // §C Countdown Ring State
  const [cdIdx, setCdIdx] = useState(0);
  const [cdProgress, setCdProgress] = useState(0);

  // §D Split Panel Dual Axis
  const [spLeftIdx, setSpLeftIdx] = useState(0);
  const [spRightIdx, setSpRightIdx] = useState(0);

  // §E Inertia Filmstrip Drag State
  const [inertiaOffset, setInertiaOffset] = useState(0);
  const [focusedInertiaIndex, setFocusedInertiaIndex] = useState(0);
  const inertiaContainerRef = useRef<HTMLDivElement | null>(null);
  const isInertiaDragging = useRef(false);
  const inertiaStartX = useRef(0);
  const inertiaVelocity = useRef(0);
  const inertiaRaf = useRef<number | null>(null);

  // §F Wipe Transition State
  const [wipeIdx, setWipeIdx] = useState(0);
  const [wipeDir, setWipeDir] = useState<'wipe-r' | 'wipe-l' | 'wipe-u' | 'wipe-d'>('wipe-r');
  const [wipeProgress, setWipeProgress] = useState(0);

  // BA Filter choices
  const BA_FILTERS = [
    { name: 'Teal & Steel', filter: 'saturate(.75) hue-rotate(10deg) contrast(1.15) brightness(.92)' },
    { name: 'Amber Sunset', filter: 'saturate(1.2) sepia(.35) contrast(1.08) brightness(1.02)' },
    { name: 'Noir Contrast', filter: 'grayscale(.95) contrast(1.3) brightness(.9)' },
    { name: 'Bleach Bypass', filter: 'saturate(.5) contrast(1.4) brightness(1.08)' },
  ];

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

  // Autoplay intervals
  useEffect(() => {
    if (!isAutoplayActive) return;

    // §01 Hero Auto (5s)
    const intS1 = setInterval(() => {
      setS1Progress((prev) => {
        if (prev >= 100) {
          setS1Idx((c) => (c + 1) % slidersData.s1.length);
          return 0;
        }
        return prev + 1;
      });
    }, 50);

    // §03 Ultra Wide (4s)
    const intS3 = setInterval(() => {
      setS3Progress((prev) => {
        if (prev >= 100) {
          setS3Idx((c) => (c + 1) % slidersData.s3.length);
          return 0;
        }
        return prev + 1.25;
      });
    }, 50);

    // §06 Crossfade (3.5s)
    const intS6 = setInterval(() => {
      setS6Progress((prev) => {
        if (prev >= 100) {
          setS6Idx((c) => (c + 1) % slidersData.s6.length);
          return 0;
        }
        return prev + 1.4;
      });
    }, 50);

    // §A Zoom-Burst (4.5s)
    const intZb = setInterval(() => {
      setZbProgress((prev) => {
        if (prev >= 100) {
          setZbIdx((c) => (c + 1) % slidersData.sA.length);
          return 0;
        }
        return prev + 1.1;
      });
    }, 50);

    // §B Stagger Grid (5s)
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
        return prev + 1;
      });
    }, 50);

    // §C Countdown Ring (5s)
    const intCd = setInterval(() => {
      setCdProgress((prev) => {
        if (prev >= 100) {
          setCdIdx((c) => (c + 1) % slidersData.sC.length);
          return 0;
        }
        return prev + 1;
      });
    }, 50);

    // §F Wipe Transition (5s)
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
        return prev + 1;
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
    };
  }, [
    isAutoplayActive,
    slidersData.s1.length,
    slidersData.s3.length,
    slidersData.s6.length,
    slidersData.sA.length,
    slidersData.sC.length,
    slidersData.sF.length,
  ]);

  // Video sync observer
  useEffect(() => {
    videoRefs.current.forEach((vid, i) => {
      if (vid) {
        if (i === s12Idx) {
          vid.play().catch(() => {});
        } else {
          vid.pause();
        }
      }
    });
  }, [s12Idx]);

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

  // Dynamic jump navigation list
  const SLIDER_NAV_ITEMS = [
    { id: 'sec-01', label: '§01 MASTER HERO', key: 's1' },
    { id: 'sec-02', label: '§02 MATRIX 4-COL', key: 's2a' },
    { id: 'sec-03', label: '§03 ULTRA WIDE 32:9', key: 's3' },
    { id: 'sec-04', label: '§04 ASYMMETRIC', key: 's4a' },
    { id: 'sec-05', label: '§05 TRIPTYCH 9:16', key: 's5a' },
    { id: 'sec-06', label: '§06 CROSSFADE 21:9', key: 's6' },
    { id: 'sec-07', label: '§07 PORTRAIT 4:5', key: 's7a' },
    { id: 'sec-08', label: '§08 DUAL 16:9', key: 's8a' },
    { id: 'sec-09', label: '§09 HERO 16:9', key: 's9' },
    { id: 'sec-10', label: '§10 BANNER 8:1', key: 's10' },
    { id: 'sec-11', label: '§11 BEFORE/AFTER', key: 's11' },
    { id: 'sec-12', label: '§12 VIDEO LOOP', key: 's12' },
    { id: 'sec-a', label: '§A ZOOM-BURST', key: 'sA' },
    { id: 'sec-b', label: '§B STAGGER GRID', key: 'sB' },
    { id: 'sec-c', label: '§C COUNTDOWN', key: 'sC' },
    { id: 'sec-d', label: '§D SPLIT-PANEL', key: 'sD' },
    { id: 'sec-e', label: '§E INERTIA STRIP', key: 'sE' },
    { id: 'sec-f', label: '§F WIPE CUT', key: 'sF' },
  ];

  const scrollToSection = (secId: string) => {
    setActiveSectionId(secId);
    const el = document.getElementById(secId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Convert all current dynamic slides for lightbox catalogue
  const allCurrentLightboxItems: LightboxItem[] = useMemo(() => {
    const list: LightboxItem[] = [];
    slidersData.s1.forEach((s) => list.push({ url: s.url, title: s.title, tag: s.tag }));
    slidersData.s3.forEach((s) => list.push({ url: s.url, title: s.title, tag: s.tag }));
    slidersData.sA.forEach((s) => list.push({ url: s.url, title: s.title, tag: s.tag }));
    slidersData.sC.forEach((s) => list.push({ url: s.url, title: s.title, tag: s.tag }));
    slidersData.sF.forEach((s) => list.push({ url: s.url, title: s.title, tag: s.tag }));
    return list;
  }, [slidersData]);

  return (
    <div className="w-full mt-[65px] bg-[#050505] text-[#f4f0e8] font-mono pb-32 space-y-16">
      {/* Ticker Tape */}
      <div className="w-full overflow-hidden h-8 bg-[#050505] border-y border-[#1c1c1c] flex items-center">
        <div className="flex gap-0 whitespace-nowrap animate-tape text-[9px] tracking-[0.25em] uppercase">
          {TICKER_ITEMS.map((item, idx) => (
            <span
              key={idx}
              className={`px-8 border-r border-[#1c1c1c] ${
                item.hot ? 'text-[#c8b89a] font-bold' : 'text-[#888888]'
              }`}
            >
              {item.text}
            </span>
          ))}
        </div>
      </div>

      {/* Dynamic Master Control Toolbar & Quick Jump Bar */}
      <div className="sticky top-[65px] z-40 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#1c1c1c] px-4 sm:px-8 py-2.5 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Left Actions: Photo Studio, Autoplay, Lightbox Trigger */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => openPhotoManagerFor('s1')}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded bg-[#c8b89a] text-black font-bold text-xs tracking-wider uppercase hover:bg-white transition-all cursor-pointer shadow-md"
            >
              <Camera className="w-4 h-4" />
              <span>Customize Photos &amp; Content</span>
            </button>

            <button
              onClick={() => setIsAutoplayActive((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs tracking-wider transition-all cursor-pointer font-mono ${
                isAutoplayActive
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/50'
                  : 'bg-amber-950/40 border-amber-500/30 text-amber-300 hover:bg-amber-900/50'
              }`}
            >
              {isAutoplayActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isAutoplayActive ? 'AUTOPLAY: ACTIVE' : 'AUTOPLAY: PAUSED'}</span>
            </button>

            <button
              onClick={() => onOpenLightbox(allCurrentLightboxItems, 0)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#161512] border border-[#f3efe6]/15 hover:border-[#f3efe6]/40 text-xs text-[#c8b89a] cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cinema Lightbox</span>
            </button>
          </div>

          {/* Right: Quick Jump Nav Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
            <span className="text-[9px] text-[#888888] tracking-widest uppercase flex-shrink-0 mr-1 hidden lg:inline">
              JUMP:
            </span>
            {SLIDER_NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`flex-shrink-0 px-2 py-1 rounded text-[9px] font-mono tracking-wider uppercase transition-all cursor-pointer ${
                  activeSectionId === item.id
                    ? 'bg-[#c8b89a] text-black font-bold'
                    : 'bg-[#141310] text-[#888888] hover:text-[#f3efe6] hover:bg-[#1f1e1a] border border-[#1c1c1c]'
                }`}
              >
                {item.label.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
           §01 · MASTER HERO · 21:9 CINEMATIC
      ════════════════════════════════════════════ */}
      <section id="sec-01" className="space-y-3 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-28">
        <div className="text-[9px] tracking-[0.3em] uppercase text-[#888888] flex items-center justify-between border-b border-[#1c1c1c] pb-2">
          <div className="flex items-center gap-2">
            <span>01 · MASTER HERO · 21:9 CINEMATIC</span>
            <button
              onClick={() => openPhotoManagerFor('s1')}
              className="text-[9px] text-[#c8b89a] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Camera className="w-3 h-3" /> Edit Section Photos
            </button>
          </div>
          <span className="text-[#c8b89a]">
            SEQ {String(s1Idx + 1).padStart(3, '0')} / {String(slidersData.s1.length).padStart(3, '0')}
          </span>
        </div>

        <div className="relative aspect-[21/9] bg-[#111111] overflow-hidden rounded shadow-2xl group">
          {/* Main Track */}
          <div
            className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.77,0,0.18,1)]"
            style={{ transform: `translateX(-${s1Idx * 100}%)` }}
          >
            {slidersData.s1.map((slide, idx) => (
              <div
                key={idx}
                onClick={() => onOpenLightbox(slidersData.s1, idx)}
                className="flex-shrink-0 w-full h-full relative bg-cover bg-center cursor-zoom-in group/slide"
                style={{ backgroundImage: `url('${slide.url}')` }}
              >
                <div className="rx-grad-b" />
                <div className="rx-vignette" />
                <div className="rx-scanlines" />

                {/* Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 z-10">
                  <span className="text-[8px] tracking-[0.3em] uppercase text-[#c8b89a] block mb-1">
                    [ {slide.tag || 'Master OS'} ]
                  </span>
                  <h2 className="serif-display italic text-2xl sm:text-4xl md:text-5xl text-white font-normal leading-tight">
                    {slide.title || 'Cinematic Grading'}
                  </h2>
                  <span className="text-[10px] text-[#888888] tracking-widest uppercase mt-2 block">
                    {slide.sub || 'System Architecture'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
            {slidersData.s1.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setS1Idx(idx)}
                className={`h-1 rounded-sm transition-all cursor-pointer ${
                  idx === s1Idx ? 'w-6 bg-[#c8b89a]' : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>

          {/* Prev/Next Buttons */}
          <div className="absolute bottom-0 right-0 z-20 flex border-t border-l border-[#1c1c1c]">
            <button
              onClick={() => setS1Idx((curr) => (curr - 1 + slidersData.s1.length) % slidersData.s1.length)}
              className="px-4 py-2.5 bg-[#050505]/75 hover:bg-[#c8b89a]/20 text-[#888888] hover:text-[#c8b89a] text-[10px] tracking-wider transition-colors cursor-pointer"
            >
              ← PREV
            </button>
            <button
              onClick={() => setS1Idx((curr) => (curr + 1) % slidersData.s1.length)}
              className="px-4 py-2.5 bg-[#050505]/75 hover:bg-[#c8b89a]/20 text-[#888888] hover:text-[#c8b89a] text-[10px] tracking-wider transition-colors cursor-pointer border-l border-[#1c1c1c]"
            >
              NEXT →
            </button>
          </div>

          {/* Progress Bar */}
          <div
            className="absolute bottom-0 left-0 h-[2px] bg-[#c8b89a] z-30 transition-all duration-75"
            style={{ width: `${s1Progress}%` }}
          />
        </div>

        {/* Filmstrip scrub bar */}
        <div className="flex gap-1 h-14 overflow-x-auto bg-[#0a0a0a] p-1 border border-[#1c1c1c] rounded scrollbar-none">
          {slidersData.s1.map((slide, idx) => (
            <button
              key={idx}
              onClick={() => setS1Idx(idx)}
              className={`flex-shrink-0 w-24 h-full bg-cover bg-center transition-all cursor-pointer relative ${
                idx === s1Idx ? 'opacity-100 ring-2 ring-[#c8b89a]' : 'opacity-40 hover:opacity-80'
              }`}
              style={{ backgroundImage: `url('${slide.url}')` }}
            />
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
           §02 · SQUARE MATRIX · 4-COL VERTICAL
      ════════════════════════════════════════════ */}
      <section id="sec-02" className="space-y-3 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-28">
        <div className="text-[9px] tracking-[0.3em] uppercase text-[#888888] flex items-center justify-between border-b border-[#1c1c1c] pb-2">
          <span>02 · SQUARE MATRIX · 1:1 · VERTICAL SLIDE</span>
          <button
            onClick={() => openPhotoManagerFor('s2a')}
            className="text-[9px] text-[#c8b89a] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Camera className="w-3 h-3" /> Edit Columns Photos
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {/* Column A (Core 01-03) */}
          <div className="relative aspect-square bg-[#111] overflow-hidden rounded group">
            <div
              className="flex flex-col h-full transition-transform duration-500"
              style={{ transform: `translateY(-${s2aIdx * 100}%)` }}
            >
              {slidersData.s2a.map((slide, i) => (
                <div
                  key={i}
                  onClick={() => onOpenLightbox(slidersData.s2a, i)}
                  className="flex-shrink-0 w-full h-full bg-cover bg-center relative cursor-zoom-in"
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
                onClick={() => setS2aIdx((c) => (c - 1 + slidersData.s2a.length) % slidersData.s2a.length)}
                className="p-2 text-xs hover:text-[#c8b89a]"
              >
                ↑
              </button>
              <button
                onClick={() => setS2aIdx((c) => (c + 1) % slidersData.s2a.length)}
                className="p-2 text-xs hover:text-[#c8b89a] border-l border-[#1c1c1c]"
              >
                ↓
              </button>
            </div>
          </div>

          {/* Column B (FX 01-03) */}
          <div className="relative aspect-square bg-[#111] overflow-hidden rounded group">
            <div
              className="flex flex-col h-full transition-transform duration-500"
              style={{ transform: `translateY(-${s2bIdx * 100}%)` }}
            >
              {slidersData.s2b.map((slide, i) => (
                <div
                  key={i}
                  onClick={() => onOpenLightbox(slidersData.s2b, i)}
                  className="flex-shrink-0 w-full h-full bg-cover bg-center relative cursor-zoom-in"
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
                onClick={() => setS2bIdx((c) => (c - 1 + slidersData.s2b.length) % slidersData.s2b.length)}
                className="p-2 text-xs hover:text-[#c8b89a]"
              >
                ↑
              </button>
              <button
                onClick={() => setS2bIdx((c) => (c + 1) % slidersData.s2b.length)}
                className="p-2 text-xs hover:text-[#c8b89a] border-l border-[#1c1c1c]"
              >
                ↓
              </button>
            </div>
          </div>

          {/* Column C (Tone 01-03) */}
          <div className="relative aspect-square bg-[#111] overflow-hidden rounded group">
            <div
              className="flex flex-col h-full transition-transform duration-500"
              style={{ transform: `translateY(-${s2cIdx * 100}%)` }}
            >
              {slidersData.s2c.map((slide, i) => (
                <div
                  key={i}
                  onClick={() => onOpenLightbox(slidersData.s2c, i)}
                  className="flex-shrink-0 w-full h-full bg-cover bg-center relative cursor-zoom-in"
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
                onClick={() => setS2cIdx((c) => (c - 1 + slidersData.s2c.length) % slidersData.s2c.length)}
                className="p-2 text-xs hover:text-[#c8b89a]"
              >
                ↑
              </button>
              <button
                onClick={() => setS2cIdx((c) => (c + 1) % slidersData.s2c.length)}
                className="p-2 text-xs hover:text-[#c8b89a] border-l border-[#1c1c1c]"
              >
                ↓
              </button>
            </div>
          </div>

          {/* Column D (Drop 01-03) */}
          <div className="relative aspect-square bg-[#111] overflow-hidden rounded group">
            <div
              className="flex flex-col h-full transition-transform duration-500"
              style={{ transform: `translateY(-${s2dIdx * 100}%)` }}
            >
              {slidersData.s2d.map((slide, i) => (
                <div
                  key={i}
                  onClick={() => onOpenLightbox(slidersData.s2d, i)}
                  className="flex-shrink-0 w-full h-full bg-cover bg-center relative cursor-zoom-in"
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
                onClick={() => setS2dIdx((c) => (c - 1 + slidersData.s2d.length) % slidersData.s2d.length)}
                className="p-2 text-xs hover:text-[#c8b89a]"
              >
                ↑
              </button>
              <button
                onClick={() => setS2dIdx((c) => (c + 1) % slidersData.s2d.length)}
                className="p-2 text-xs hover:text-[#c8b89a] border-l border-[#1c1c1c]"
              >
                ↓
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
           §03 · ULTRA WIDE CINEMATIC 32:9 · AUTO
      ════════════════════════════════════════════ */}
      <section id="sec-03" className="space-y-3 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-28">
        <div className="text-[9px] tracking-[0.3em] uppercase text-[#888888] flex items-center justify-between border-b border-[#1c1c1c] pb-2">
          <div className="flex items-center gap-2">
            <span>03 · ULTRA WIDE CINEMATIC · 32:9 · AUTO BROADCAST</span>
            <button
              onClick={() => openPhotoManagerFor('s3')}
              className="text-[9px] text-[#c8b89a] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Camera className="w-3 h-3" /> Edit Photos
            </button>
          </div>
          <span className="text-[#c8b89a]">
            AUTO · {String(s3Idx + 1).padStart(2, '0')} / {String(slidersData.s3.length).padStart(2, '0')}
          </span>
        </div>

        <div className="relative aspect-[32/9] sm:aspect-[32/9] bg-[#111111] overflow-hidden rounded shadow-2xl">
          <div
            className="flex h-full transition-transform duration-700"
            style={{ transform: `translateX(-${s3Idx * 100}%)` }}
          >
            {slidersData.s3.map((slide, idx) => (
              <div
                key={idx}
                onClick={() => onOpenLightbox(slidersData.s3, idx)}
                className="flex-shrink-0 w-full h-full bg-cover bg-center relative cursor-zoom-in"
                style={{ backgroundImage: `url('${slide.url}')` }}
              >
                <div className="rx-grad-l" />
                <div className="rx-scanlines" />
                <div className="absolute bottom-4 sm:bottom-6 left-6 z-10 max-w-lg">
                  <span className="text-[8px] text-[#c8b89a] block uppercase mb-1">[ {slide.tag} ]</span>
                  <h2 className="serif-display italic text-xl sm:text-3xl text-white font-normal">{slide.title}</h2>
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
                onClick={() => setS3Idx(idx)}
                className={`h-1 rounded-sm transition-all cursor-pointer ${
                  idx === s3Idx ? 'w-5 bg-[#c8b89a]' : 'w-1.5 bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
           §04 · ASYMMETRIC SPLIT · DUAL FORMAT
      ════════════════════════════════════════════ */}
      <section id="sec-04" className="space-y-3 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-28">
        <div className="text-[9px] tracking-[0.3em] uppercase text-[#888888] flex items-center justify-between border-b border-[#1c1c1c] pb-2">
          <span>04 · ASYMMETRIC SPLIT · DUAL FORMAT</span>
          <button
            onClick={() => openPhotoManagerFor('s4a')}
            className="text-[9px] text-[#c8b89a] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Camera className="w-3 h-3" /> Edit Split Photos
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {/* Left: 2 Columns Wide (6 Slides) */}
          <div className="md:col-span-2 relative aspect-[16/10] sm:aspect-square bg-[#111] overflow-hidden rounded">
            <div
              className="flex h-full transition-transform duration-500"
              style={{ transform: `translateX(-${s4aIdx * 100}%)` }}
            >
              {slidersData.s4a.map((slide, i) => (
                <div
                  key={i}
                  onClick={() => onOpenLightbox(slidersData.s4a, i)}
                  className="flex-shrink-0 w-full h-full bg-cover bg-center relative cursor-zoom-in"
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
                onClick={() => setS4aIdx((c) => (c - 1 + slidersData.s4a.length) % slidersData.s4a.length)}
                className="px-3 py-2 text-xs hover:text-[#c8b89a]"
              >
                ← PREV
              </button>
              <button
                onClick={() => setS4aIdx((c) => (c + 1) % slidersData.s4a.length)}
                className="px-3 py-2 text-xs hover:text-[#c8b89a] border-l border-[#1c1c1c]"
              >
                NEXT →
              </button>
            </div>
            <span className="absolute bottom-2 left-4 z-20 text-[9px] text-[#c8b89a] font-mono">
              0{s4aIdx + 1} / 0{slidersData.s4a.length}
            </span>
          </div>

          {/* Right: 1 Column (3 Slides Vertical) */}
          <div className="relative aspect-square bg-[#111] overflow-hidden rounded">
            <div
              className="flex flex-col h-full transition-transform duration-500"
              style={{ transform: `translateY(-${s4bIdx * 100}%)` }}
            >
              {slidersData.s4b.map((slide, i) => (
                <div
                  key={i}
                  onClick={() => onOpenLightbox(slidersData.s4b, i)}
                  className="flex-shrink-0 w-full h-full bg-cover bg-center relative cursor-zoom-in"
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
                onClick={() => setS4bIdx((c) => (c - 1 + slidersData.s4b.length) % slidersData.s4b.length)}
                className="p-2 text-xs hover:text-[#c8b89a]"
              >
                ↑
              </button>
              <button
                onClick={() => setS4bIdx((c) => (c + 1) % slidersData.s4b.length)}
                className="p-2 text-xs hover:text-[#c8b89a] border-l border-[#1c1c1c]"
              >
                ↓
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
           §05 · PORTRAIT TRIPTYCH · 9:16 VERTICAL
      ════════════════════════════════════════════ */}
      <section id="sec-05" className="space-y-3 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-28">
        <div className="text-[9px] tracking-[0.3em] uppercase text-[#888888] flex items-center justify-between border-b border-[#1c1c1c] pb-2">
          <span>05 · PORTRAIT TRIPTYCH · 9:16 · VERTICAL SLIDER</span>
          <button
            onClick={() => openPhotoManagerFor('s5a')}
            className="text-[9px] text-[#c8b89a] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Camera className="w-3 h-3" /> Edit Triptych Photos
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Triptych Column 1 */}
          <div className="relative aspect-[9/16] bg-[#111] overflow-hidden rounded">
            <div
              className="flex flex-col h-full transition-transform duration-500"
              style={{ transform: `translateY(-${s5aIdx * 100}%)` }}
            >
              {slidersData.s5a.map((slide, i) => (
                <div
                  key={i}
                  onClick={() => onOpenLightbox(slidersData.s5a, i)}
                  className="flex-shrink-0 w-full h-full bg-cover bg-center relative cursor-zoom-in"
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
              <button onClick={() => setS5aIdx((c) => (c - 1 + 3) % 3)} className="p-2 text-xs hover:text-[#c8b89a]">
                ↑
              </button>
              <button onClick={() => setS5aIdx((c) => (c + 1) % 3)} className="p-2 text-xs hover:text-[#c8b89a] border-l border-[#1c1c1c]">
                ↓
              </button>
            </div>
          </div>

          {/* Triptych Column 2 */}
          <div className="relative aspect-[9/16] bg-[#111] overflow-hidden rounded">
            <div
              className="flex flex-col h-full transition-transform duration-500"
              style={{ transform: `translateY(-${s5bIdx * 100}%)` }}
            >
              {slidersData.s5b.map((slide, i) => (
                <div
                  key={i}
                  onClick={() => onOpenLightbox(slidersData.s5b, i)}
                  className="flex-shrink-0 w-full h-full bg-cover bg-center relative cursor-zoom-in"
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
              <button onClick={() => setS5bIdx((c) => (c - 1 + 3) % 3)} className="p-2 text-xs hover:text-[#c8b89a]">
                ↑
              </button>
              <button onClick={() => setS5bIdx((c) => (c + 1) % 3)} className="p-2 text-xs hover:text-[#c8b89a] border-l border-[#1c1c1c]">
                ↓
              </button>
            </div>
          </div>

          {/* Triptych Column 3 */}
          <div className="relative aspect-[9/16] bg-[#111] overflow-hidden rounded">
            <div
              className="flex flex-col h-full transition-transform duration-500"
              style={{ transform: `translateY(-${s5cIdx * 100}%)` }}
            >
              {slidersData.s5c.map((slide, i) => (
                <div
                  key={i}
                  onClick={() => onOpenLightbox(slidersData.s5c, i)}
                  className="flex-shrink-0 w-full h-full bg-cover bg-center relative cursor-zoom-in"
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
              <button onClick={() => setS5cIdx((c) => (c - 1 + 3) % 3)} className="p-2 text-xs hover:text-[#c8b89a]">
                ↑
              </button>
              <button onClick={() => setS5cIdx((c) => (c + 1) % 3)} className="p-2 text-xs hover:text-[#c8b89a] border-l border-[#1c1c1c]">
                ↓
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
           §06 · CROSSFADE HERO · 21:9 · AUTO
      ════════════════════════════════════════════ */}
      <section id="sec-06" className="space-y-3 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-28">
        <div className="text-[9px] tracking-[0.3em] uppercase text-[#888888] flex items-center justify-between border-b border-[#1c1c1c] pb-2">
          <div className="flex items-center gap-2">
            <span>06 · AUTO BROADCAST · 21:9 · CROSSFADE</span>
            <button
              onClick={() => openPhotoManagerFor('s6')}
              className="text-[9px] text-[#c8b89a] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Camera className="w-3 h-3" /> Edit Crossfade Photos
            </button>
          </div>
          <span className="text-[#c8b89a]">
            LIVE · {String(s6Idx + 1).padStart(2, '0')} / {String(slidersData.s6.length).padStart(2, '0')}
          </span>
        </div>

        <div className="relative aspect-[21/9] bg-[#111111] overflow-hidden rounded shadow-2xl">
          {slidersData.s6.map((slide, idx) => (
            <div
              key={idx}
              onClick={() => onOpenLightbox(slidersData.s6, idx)}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 cursor-zoom-in ${
                idx === s6Idx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
              style={{ backgroundImage: `url('${slide.url}')` }}
            />
          ))}

          <div className="rx-grad-b z-20 pointer-events-none" />
          <div className="rx-scanlines z-20 pointer-events-none" />

          <div className="absolute bottom-6 left-6 z-30">
            <span className="text-[8px] tracking-[0.25em] text-[#c8b89a] uppercase block">
              [ {slidersData.s6[s6Idx]?.tag || 'Stream'} ]
            </span>
            <h2 className="serif-display italic text-2xl sm:text-4xl text-white">
              {slidersData.s6[s6Idx]?.title || 'Live Broadcast'}
            </h2>
          </div>

          <div className="absolute bottom-0 left-0 h-[2px] bg-[#c8b89a] z-30" style={{ width: `${s6Progress}%` }} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
           §07 · PORTRAIT GRID · 4:5 · HORIZONTAL
      ════════════════════════════════════════════ */}
      <section id="sec-07" className="space-y-3 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-28">
        <div className="text-[9px] tracking-[0.3em] uppercase text-[#888888] flex items-center justify-between border-b border-[#1c1c1c] pb-2">
          <span>07 · PORTRAIT GRID · 4:5 · HORIZONTAL SWIPE</span>
          <button
            onClick={() => openPhotoManagerFor('s7a')}
            className="text-[9px] text-[#c8b89a] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Camera className="w-3 h-3" /> Edit 4:5 Grid Photos
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { data: slidersData.s7a, idx: s7aIdx, setIdx: setS7aIdx },
            { data: slidersData.s7b, idx: s7bIdx, setIdx: setS7bIdx },
            { data: slidersData.s7c, idx: s7cIdx, setIdx: setS7cIdx },
            { data: slidersData.s7d, idx: s7dIdx, setIdx: setS7dIdx },
          ].map((col, cIdx) => (
            <div key={cIdx} className="relative aspect-[4/5] bg-[#111] overflow-hidden rounded">
              <div
                className="flex h-full transition-transform duration-500"
                style={{ transform: `translateX(-${col.idx * 100}%)` }}
              >
                {col.data.map((slide, sIdx) => (
                  <div
                    key={sIdx}
                    onClick={() => onOpenLightbox(col.data, sIdx)}
                    className="flex-shrink-0 w-full h-full bg-cover bg-center relative cursor-zoom-in"
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
                  onClick={() => col.setIdx((c) => (c - 1 + col.data.length) % col.data.length)}
                  className="p-2 text-xs hover:text-[#c8b89a]"
                >
                  ←
                </button>
                <button
                  onClick={() => col.setIdx((c) => (c + 1) % col.data.length)}
                  className="p-2 text-xs hover:text-[#c8b89a] border-l border-[#1c1c1c]"
                >
                  →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
           §08 · DUAL LANDSCAPE · 16:9 VERTICAL
      ════════════════════════════════════════════ */}
      <section id="sec-08" className="space-y-3 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-28">
        <div className="text-[9px] tracking-[0.3em] uppercase text-[#888888] flex items-center justify-between border-b border-[#1c1c1c] pb-2">
          <span>08 · DUAL LANDSCAPE · 16:9 · VERTICAL SLIDE</span>
          <button
            onClick={() => openPhotoManagerFor('s8a')}
            className="text-[9px] text-[#c8b89a] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Camera className="w-3 h-3" /> Edit Landscape Photos
          </button>
        </div>

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
                  onClick={() => onOpenLightbox(slidersData.s8a, i)}
                  className="flex-shrink-0 w-full h-full bg-cover bg-center relative cursor-zoom-in"
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
                onClick={() => setS8aIdx((c) => (c - 1 + slidersData.s8a.length) % slidersData.s8a.length)}
                className="p-2 text-xs hover:text-[#c8b89a]"
              >
                ↑
              </button>
              <button
                onClick={() => setS8aIdx((c) => (c + 1) % slidersData.s8a.length)}
                className="p-2 text-xs hover:text-[#c8b89a] border-l border-[#1c1c1c]"
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
                  onClick={() => onOpenLightbox(slidersData.s8b, i)}
                  className="flex-shrink-0 w-full h-full bg-cover bg-center relative cursor-zoom-in"
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
                onClick={() => setS8bIdx((c) => (c - 1 + slidersData.s8b.length) % slidersData.s8b.length)}
                className="p-2 text-xs hover:text-[#c8b89a]"
              >
                ↑
              </button>
              <button
                onClick={() => setS8bIdx((c) => (c + 1) % slidersData.s8b.length)}
                className="p-2 text-xs hover:text-[#c8b89a] border-l border-[#1c1c1c]"
              >
                ↓
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
           §09 · STANDARD HERO · 16:9
      ════════════════════════════════════════════ */}
      <section id="sec-09" className="space-y-3 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-28">
        <div className="text-[9px] tracking-[0.3em] uppercase text-[#888888] flex items-center justify-between border-b border-[#1c1c1c] pb-2">
          <span>09 · STANDARD HERO · 16:9 EDITORIAL</span>
          <button
            onClick={() => openPhotoManagerFor('s9')}
            className="text-[9px] text-[#c8b89a] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Camera className="w-3 h-3" /> Edit Hero Photos
          </button>
        </div>

        <div className="relative aspect-video bg-[#111111] overflow-hidden rounded shadow-2xl">
          <div
            className="flex h-full transition-transform duration-700"
            style={{ transform: `translateX(-${s9Idx * 100}%)` }}
          >
            {slidersData.s9.map((slide, i) => (
              <div
                key={i}
                onClick={() => onOpenLightbox(slidersData.s9, i)}
                className="flex-shrink-0 w-full h-full bg-cover bg-center relative cursor-zoom-in"
                style={{ backgroundImage: `url('${slide.url}')` }}
              >
                <div className="rx-grad-b" />
                <div className="rx-vignette" />
                <div className="absolute bottom-8 left-8 z-10">
                  <span className="text-[8px] text-[#c8b89a] block uppercase">[ {slide.tag} ]</span>
                  <h2 className="serif-display italic text-3xl sm:text-5xl text-white font-normal">{slide.title}</h2>
                  <span className="text-[10px] text-[#888888] uppercase block mt-1">{slide.sub}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slidersData.s9.map((_, i) => (
              <button
                key={i}
                onClick={() => setS9Idx(i)}
                className={`h-1.5 rounded-sm transition-all cursor-pointer ${
                  i === s9Idx ? 'w-8 bg-[#c8b89a]' : 'w-2 bg-white/20'
                }`}
              />
            ))}
          </div>

          <div className="absolute bottom-0 right-0 z-20 flex bg-[#050505]/80 border-t border-l border-[#1c1c1c]">
            <button
              onClick={() => setS9Idx((c) => (c - 1 + slidersData.s9.length) % slidersData.s9.length)}
              className="px-4 py-2.5 text-xs hover:text-[#c8b89a]"
            >
              ← PREV
            </button>
            <button
              onClick={() => setS9Idx((c) => (c + 1) % slidersData.s9.length)}
              className="px-4 py-2.5 text-xs hover:text-[#c8b89a] border-l border-[#1c1c1c]"
            >
              NEXT →
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
           §10 · FOOTER BANNER · 8:1
      ════════════════════════════════════════════ */}
      <section id="sec-10" className="space-y-3 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-28">
        <div className="text-[9px] tracking-[0.3em] uppercase text-[#888888] flex items-center justify-between border-b border-[#1c1c1c] pb-2">
          <span>10 · FOOTER BANNER · 8:1 ULTRA WIDE SLICE</span>
          <button
            onClick={() => openPhotoManagerFor('s10')}
            className="text-[9px] text-[#c8b89a] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Camera className="w-3 h-3" /> Edit Banner Photo
          </button>
        </div>

        <div className="relative aspect-[8/1] sm:aspect-[8/1] bg-[#111111] overflow-hidden rounded shadow-xl">
          <div
            className="flex h-full transition-transform duration-500"
            style={{ transform: `translateX(-${s10Idx * 100}%)` }}
          >
            {slidersData.s10.map((slide, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-full h-full bg-cover bg-center relative"
                style={{ backgroundImage: `url('${slide.url}')` }}
              >
                <div className="rx-grad-b" />
              </div>
            ))}
          </div>

          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none px-4 text-center">
            <span className="font-mono text-[9px] sm:text-[11px] tracking-[0.35em] uppercase text-[#c8b89a]/80 font-bold">
              RAWx Master OS · Cinematic Grading System · Drop 01
            </span>
          </div>

          <div className="absolute bottom-0 right-0 z-20 flex bg-[#050505]/80 border-t border-l border-[#1c1c1c]">
            <button
              onClick={() => setS10Idx((c) => (c - 1 + slidersData.s10.length) % slidersData.s10.length)}
              className="px-3 py-1 text-xs hover:text-[#c8b89a]"
            >
              ←
            </button>
            <button
              onClick={() => setS10Idx((c) => (c + 1) % slidersData.s10.length)}
              className="px-3 py-1 text-xs hover:text-[#c8b89a] border-l border-[#1c1c1c]"
            >
              →
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
           §11 · BEFORE / AFTER GRADE COMPARISON
      ════════════════════════════════════════════ */}
      <section id="sec-11" className="space-y-3 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-28">
        <div className="text-[9px] tracking-[0.3em] uppercase text-[#888888] flex items-center justify-between border-b border-[#1c1c1c] pb-2">
          <div className="flex items-center gap-2">
            <span>11 · BEFORE / AFTER · GRADE COMPARISON DRAG</span>
            <button
              onClick={() => openPhotoManagerFor('s11')}
              className="text-[9px] text-[#c8b89a] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Camera className="w-3 h-3" /> Edit Before/After Photos
            </button>
          </div>

          {/* Preset filter selector */}
          <div className="flex items-center gap-1">
            <span className="text-[8px] text-[#888888] mr-1 hidden sm:inline">LUT:</span>
            {BA_FILTERS.map((f, fIdx) => (
              <button
                key={fIdx}
                onClick={() => setBaFilterIndex(fIdx)}
                className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase transition-all cursor-pointer ${
                  baFilterIndex === fIdx ? 'bg-[#c8b89a] text-black font-bold' : 'bg-white/5 text-white/60 hover:text-white'
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>
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
          {/* Before Layer (RAW) */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${slidersData.s11.beforeUrl}')` }}
          />

          {/* After Layer (Graded) with clip-path */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-300"
            style={{
              backgroundImage: `url('${slidersData.s11.afterUrl}')`,
              filter: BA_FILTERS[baFilterIndex].filter,
              clipPath: `inset(0 ${100 - baPosition}% 0 0)`,
            }}
          />

          {/* Dividing Drag Handle */}
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

          <div className="absolute bottom-4 left-4 z-10">
            <span className="text-[8px] text-[#c8b89a] block uppercase">[ {slidersData.s11.tag} ]</span>
            <h3 className="serif-display italic text-xl sm:text-2xl text-white">{slidersData.s11.title}</h3>
            <span className="text-[9px] text-[#888888] uppercase block mt-0.5">{slidersData.s11.sub}</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
           §12 · VIDEO SLIDE · 21:9 · MUTED AUTOPLAY
      ════════════════════════════════════════════ */}
      <section id="sec-12" className="space-y-3 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-28">
        <div className="text-[9px] tracking-[0.3em] uppercase text-[#888888] flex items-center justify-between border-b border-[#1c1c1c] pb-2">
          <div className="flex items-center gap-2">
            <span>12 · VIDEO SLIDE · 21:9 · MUTED AUTOPLAY</span>
            <button
              onClick={() => openPhotoManagerFor('s12')}
              className="text-[9px] text-[#c8b89a] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Camera className="w-3 h-3" /> Edit Video Slides
            </button>
          </div>
          <span className="text-[#c8b89a]">
            VIDEO {String(s12Idx + 1).padStart(3, '0')} / {String(slidersData.s12.length).padStart(3, '0')}
          </span>
        </div>

        <div className="relative aspect-[21/9] bg-[#111111] overflow-hidden rounded shadow-2xl">
          <div
            className="flex h-full transition-transform duration-700"
            style={{ transform: `translateX(-${s12Idx * 100}%)` }}
          >
            {slidersData.s12.map((slide, i) => (
              <div key={i} className="flex-shrink-0 w-full h-full relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url('${slide.url}')` }}>
                {slide.videoUrl ? (
                  <video
                    ref={(el) => (videoRefs.current[i] = el)}
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
              onClick={() => setS12Idx((c) => (c - 1 + slidersData.s12.length) % slidersData.s12.length)}
              className="px-4 py-2.5 text-xs hover:text-[#c8b89a]"
            >
              ← PREV
            </button>
            <button
              onClick={() => setS12Idx((c) => (c + 1) % slidersData.s12.length)}
              className="px-4 py-2.5 text-xs hover:text-[#c8b89a] border-l border-[#1c1c1c]"
            >
              NEXT →
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
           §A · ZOOM-BURST · 21:9 SCALE POP
      ════════════════════════════════════════════ */}
      <section id="sec-a" className="space-y-3 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-28">
        <div className="text-[9px] tracking-[0.3em] uppercase text-[#888888] flex items-center justify-between border-b border-[#1c1c1c] pb-2">
          <div className="flex items-center gap-2">
            <span>A · ZOOM-BURST · 21:9 · SCALE POP TRANSITION</span>
            <button
              onClick={() => openPhotoManagerFor('sA')}
              className="text-[9px] text-[#c8b89a] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Camera className="w-3 h-3" /> Edit Zoom-Burst Photos
            </button>
          </div>
          <span className="text-[#c8b89a]">
            AUTO · {String(zbIdx + 1).padStart(2, '0')} / {String(slidersData.sA.length).padStart(2, '0')}
          </span>
        </div>

        <div className="relative aspect-[21/9] bg-[#111111] overflow-hidden rounded shadow-2xl">
          {slidersData.sA.map((slide, idx) => (
            <div
              key={idx}
              onClick={() => onOpenLightbox(slidersData.sA, idx)}
              className={`absolute inset-0 bg-cover bg-center cursor-zoom-in transition-opacity duration-500 ${
                idx === zbIdx ? 'zb-enter opacity-100 z-10' : 'opacity-0 z-0'
              }`}
              style={{ backgroundImage: `url('${slide.url}')` }}
            />
          ))}

          <div className="rx-grad-b z-10 pointer-events-none" />
          <div className="rx-scanlines z-10 pointer-events-none" />

          {/* Info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 z-20 pointer-events-none">
            <span className="text-[8px] tracking-[0.4em] text-[#888888] uppercase block mb-1">
              SEQ 0{zbIdx + 1} / 0{slidersData.sA.length}
            </span>
            <h2 className="serif-display italic text-2xl sm:text-5xl text-white leading-tight">
              {slidersData.sA[zbIdx]?.title}
            </h2>
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
              onClick={() => setZbIdx((c) => (c - 1 + slidersData.sA.length) % slidersData.sA.length)}
              className="px-3 py-2 text-xs hover:text-[#c8b89a]"
            >
              ← PREV
            </button>
            <button
              onClick={() => setZbIdx((c) => (c + 1) % slidersData.sA.length)}
              className="px-3 py-2 text-xs hover:text-[#c8b89a] border-l border-[#1c1c1c]"
            >
              NEXT →
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
           §B · STAGGER REVEAL GRID 3×2
      ════════════════════════════════════════════ */}
      <section id="sec-b" className="space-y-3 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-28">
        <div className="text-[9px] tracking-[0.3em] uppercase text-[#888888] flex items-center justify-between border-b border-[#1c1c1c] pb-2">
          <div className="flex items-center gap-2">
            <span>B · STAGGER REVEAL GRID · 3×2 · CASCADE SEQUENCE</span>
            <button
              onClick={() => openPhotoManagerFor('sB')}
              className="text-[9px] text-[#c8b89a] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Camera className="w-3 h-3" /> Edit Grid Photos
            </button>
          </div>
          <span className="text-[#c8b89a]">SET {String(staggerSetIdx + 1).padStart(2, '0')} / 02</span>
        </div>

        <div className="relative aspect-[16/7] bg-[#111111] overflow-hidden rounded shadow-2xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 grid-rows-2 gap-0.5 h-full">
            {slidersData.sB.cells.map((cell, i) => (
              <div key={i} className="relative overflow-hidden bg-[#161512] group">
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

      {/* ═══════════════════════════════════════════
           §C · COUNTDOWN RING TIMER AUTO · 16:9
      ════════════════════════════════════════════ */}
      <section id="sec-c" className="space-y-3 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-28">
        <div className="text-[9px] tracking-[0.3em] uppercase text-[#888888] flex items-center justify-between border-b border-[#1c1c1c] pb-2">
          <div className="flex items-center gap-2">
            <span>C · COUNTDOWN RING · 16:9 · SVG TIMER AUTO</span>
            <button
              onClick={() => openPhotoManagerFor('sC')}
              className="text-[9px] text-[#c8b89a] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Camera className="w-3 h-3" /> Edit Countdown Photos
            </button>
          </div>
          <span className="text-[#c8b89a]">
            {String(cdIdx + 1).padStart(2, '0')} / {String(slidersData.sC.length).padStart(2, '0')}
          </span>
        </div>

        <div className="relative aspect-video bg-[#111111] overflow-hidden rounded shadow-2xl">
          <div
            className="flex h-full transition-transform duration-700"
            style={{ transform: `translateX(-${cdIdx * 100}%)` }}
          >
            {slidersData.sC.map((slide, i) => (
              <div
                key={i}
                onClick={() => onOpenLightbox(slidersData.sC, i)}
                className="flex-shrink-0 w-full h-full bg-cover bg-center relative cursor-zoom-in"
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

          {/* SVG Countdown Ring */}
          <div className="absolute top-5 right-5 z-20 w-14 h-14 flex items-center justify-center bg-black/75 rounded-full border border-[#f3efe6]/15 shadow-xl">
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
              onClick={() => setCdIdx((c) => (c - 1 + slidersData.sC.length) % slidersData.sC.length)}
              className="px-3 py-2 text-xs hover:text-[#c8b89a]"
            >
              ← PREV
            </button>
            <button
              onClick={() => setCdIdx((c) => (c + 1) % slidersData.sC.length)}
              className="px-3 py-2 text-xs hover:text-[#c8b89a] border-l border-[#1c1c1c]"
            >
              NEXT →
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
           §D · SPLIT-PANEL DUAL-AXIS
      ════════════════════════════════════════════ */}
      <section id="sec-d" className="space-y-3 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-28">
        <div className="text-[9px] tracking-[0.3em] uppercase text-[#888888] flex items-center justify-between border-b border-[#1c1c1c] pb-2">
          <div className="flex items-center gap-2">
            <span>D · SPLIT-PANEL · DUAL AXIS · OPPOSED MOTION</span>
            <button
              onClick={() => openPhotoManagerFor('sD')}
              className="text-[9px] text-[#c8b89a] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Camera className="w-3 h-3" /> Edit Split Photos
            </button>
          </div>
          <span className="text-[#c8b89a]">L: 0{spLeftIdx + 1} · R: 0{spRightIdx + 1}</span>
        </div>

        <div className="relative aspect-[16/9] bg-[#111111] overflow-hidden rounded shadow-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0.5 h-full">
            {/* Left: Horizontal Track */}
            <div className="relative overflow-hidden bg-[#161512]">
              <div
                className="flex h-full transition-transform duration-700"
                style={{ transform: `translateX(-${spLeftIdx * 100}%)` }}
              >
                {slidersData.sD.left.map((slide, i) => (
                  <div
                    key={i}
                    onClick={() => onOpenLightbox(slidersData.sD.left, i)}
                    className="flex-shrink-0 w-full h-full bg-cover bg-center relative cursor-zoom-in"
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
                  onClick={() => {
                    const nextL = (spLeftIdx - 1 + slidersData.sD.left.length) % slidersData.sD.left.length;
                    setSpLeftIdx(nextL);
                    setSpRightIdx((nextL + 1) % slidersData.sD.right.length);
                  }}
                  className="px-3 py-1.5 text-xs hover:text-[#c8b89a]"
                >
                  ←
                </button>
                <button
                  onClick={() => {
                    const nextL = (spLeftIdx + 1) % slidersData.sD.left.length;
                    setSpLeftIdx(nextL);
                    setSpRightIdx((nextL + 1) % slidersData.sD.right.length);
                  }}
                  className="px-3 py-1.5 text-xs hover:text-[#c8b89a] border-l border-[#1c1c1c]"
                >
                  →
                </button>
              </div>
            </div>

            {/* Right: Vertical Track in opposed motion */}
            <div className="relative overflow-hidden bg-[#161512]">
              <div
                className="flex flex-col h-full transition-transform duration-700"
                style={{ transform: `translateY(-${spRightIdx * 100}%)` }}
              >
                {slidersData.sD.right.map((slide, i) => (
                  <div
                    key={i}
                    onClick={() => onOpenLightbox(slidersData.sD.right, i)}
                    className="flex-shrink-0 w-full h-full bg-cover bg-center relative cursor-zoom-in"
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
                  onClick={() => setSpRightIdx((c) => (c - 1 + slidersData.sD.right.length) % slidersData.sD.right.length)}
                  className="p-2 text-xs hover:text-[#c8b89a]"
                >
                  ↑
                </button>
                <button
                  onClick={() => setSpRightIdx((c) => (c + 1) % slidersData.sD.right.length)}
                  className="p-2 text-xs hover:text-[#c8b89a] border-l border-[#1c1c1c]"
                >
                  ↓
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
           §E · INERTIA FILMSTRIP · MOMENTUM DRAG
      ════════════════════════════════════════════ */}
      <section id="sec-e" className="space-y-3 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-28">
        <div className="text-[9px] tracking-[0.3em] uppercase text-[#888888] flex items-center justify-between border-b border-[#1c1c1c] pb-2">
          <div className="flex items-center gap-2">
            <span>E · INERTIA FILMSTRIP · MOMENTUM DRAG · FOCUS EXPAND</span>
            <button
              onClick={() => openPhotoManagerFor('sE')}
              className="text-[9px] text-[#c8b89a] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Camera className="w-3 h-3" /> Edit Filmstrip Frames
            </button>
          </div>
          <span className="text-[#c8b89a]">DRAG HORIZONTALLY TO SCRUB</span>
        </div>

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
                onClick={() => onOpenLightbox(slidersData.sE, idx)}
                className={`flex-shrink-0 h-full bg-cover bg-center relative transition-all duration-300 ${
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

      {/* ═══════════════════════════════════════════
           §F · WIPE TRANSITION · 21:9
      ════════════════════════════════════════════ */}
      <section id="sec-f" className="space-y-3 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-28">
        <div className="text-[9px] tracking-[0.3em] uppercase text-[#888888] flex items-center justify-between border-b border-[#1c1c1c] pb-2">
          <div className="flex items-center gap-2">
            <span>F · WIPE-TRANSITION · 21:9 · DIRECTIONAL REVEAL</span>
            <button
              onClick={() => openPhotoManagerFor('sF')}
              className="text-[9px] text-[#c8b89a] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Camera className="w-3 h-3" /> Edit Wipe Photos
            </button>
          </div>
          <span className="text-[#c8b89a]">
            {String(wipeIdx + 1).padStart(2, '0')} / {String(slidersData.sF.length).padStart(2, '0')}
          </span>
        </div>

        <div className="relative aspect-[21/9] bg-[#111111] overflow-hidden rounded shadow-2xl">
          {slidersData.sF.map((slide, idx) => (
            <div
              key={idx}
              onClick={() => onOpenLightbox(slidersData.sF, idx)}
              className={`absolute inset-0 bg-cover bg-center cursor-zoom-in ${
                idx === wipeIdx ? `z-10 ${wipeDir}` : 'opacity-0 z-0'
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
              onClick={() => {
                setWipeDir('wipe-l');
                setWipeIdx((c) => (c - 1 + slidersData.sF.length) % slidersData.sF.length);
              }}
              className="px-3 py-2 text-[10px] hover:text-[#c8b89a]"
            >
              ← PREV
            </button>
            <button
              onClick={() => {
                setWipeDir('wipe-r');
                setWipeIdx((c) => (c + 1) % slidersData.sF.length);
              }}
              className="px-3 py-2 text-[10px] hover:text-[#c8b89a] border-l border-[#1c1c1c]"
            >
              NEXT →
            </button>
          </div>

          <div className="absolute bottom-0 left-0 h-[2px] bg-[#c8b89a] z-30" style={{ width: `${wipeProgress}%` }} />
        </div>
      </section>

      {/* Dynamic Photo Manager Modal */}
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
