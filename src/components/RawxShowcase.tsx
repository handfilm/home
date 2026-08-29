import React, { useState, useEffect, useRef } from 'react';
import { TICKER_ITEMS } from '../data/initialData';
import { LightboxItem } from './LightboxModal';
import { Play, Pause, ChevronLeft, ChevronRight, ArrowUp, ArrowDown } from 'lucide-react';

interface RawxShowcaseProps {
  onOpenLightbox: (items: LightboxItem[], startIndex: number) => void;
  speed: number;
}

export default function RawxShowcase({ onOpenLightbox, speed }: RawxShowcaseProps) {
  // §01 Hero State
  const [s1Idx, setS1Idx] = useState(0);
  const [s1Progress, setS1Progress] = useState(0);

  // §02 Matrix States
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

  // §05 Triptych States
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
  const baBoxRef = useRef<HTMLDivElement | null>(null);
  const isBaDragging = useRef(false);

  // §12 Video slide
  const [s12Idx, setS12Idx] = useState(0);

  // §A Zoom-Burst State
  const [zbIdx, setZbIdx] = useState(0);
  const [zbProgress, setZbProgress] = useState(0);

  // §B Stagger Reveal Grid State
  const [staggerSetIdx, setStaggerSetIdx] = useState(0);
  const [staggerRevealed, setStaggerRevealed] = useState(true);

  // §C Countdown Ring State
  const [cdIdx, setCdIdx] = useState(0);
  const [cdProgress, setCdProgress] = useState(0);

  // §D Split Panel Dual Axis
  const [spLeftIdx, setSpLeftIdx] = useState(0);
  const [spRightIdx, setSpRightIdx] = useState(0);

  // §E Inertia Filmstrip
  const [focusedInertiaIndex, setFocusedInertiaIndex] = useState(0);

  // §F Wipe Transition State
  const [wipeIdx, setWipeIdx] = useState(0);
  const [wipeDir, setWipeDir] = useState<'wipe-r' | 'wipe-l' | 'wipe-u' | 'wipe-d'>('wipe-r');
  const [wipeProgress, setWipeProgress] = useState(0);

  // S1 Slides Data
  const s1Slides = [
    {
      url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx_wallpaper_4.jpg?v=1779844302',
      tag: 'Master OS',
      title: 'Cinematic Grading Redefined',
      sub: 'System Architecture v3.0 · 8K Pipeline',
    },
    {
      url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/Picsart_26-05-25_06-16-40-096.jpg?v=1779844301',
      tag: 'Industrial Realism',
      title: 'RAWx Drop 01',
      sub: 'Film Emulation Engine · Grain Synthesis',
    },
    {
      url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/Picsart_26-05-24_01-54-03-799.jpg?v=1779844300',
      tag: 'Brutalist',
      title: 'System Architecture',
      sub: 'RAW Processing · Hasselblad Quality',
    },
    {
      url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/Picsart_26-05-25_06-14-45-314.jpg?v=1779844300',
      tag: 'Visuals',
      title: 'Hasselblad Quality',
      sub: 'Medium Format Profiles · Detail Preservation',
    },
    {
      url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/Picsart_26-05-24_01-59-49-961.jpg?v=1779844300',
      tag: 'Workflow',
      title: 'AI Automation Engine',
      sub: 'Batch Processing · One-Click Pipeline',
    },
    {
      url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/Picsart_26-05-25_06-21-00-005.jpg?v=1779844299',
      tag: 'Techno',
      title: 'Raw Aesthetic',
      sub: 'Industrial Color Science · Tonal Mapping',
    },
    {
      url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/Picsart_26-05-24_01-50-20-630.jpg?v=1779844299',
      tag: 'Color',
      title: '8K Resolution Textures',
      sub: 'Ultra High Definition · Texture Packs',
    },
    {
      url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/Picsart_26-05-24_02-11-50-131.jpg?v=1779844299',
      tag: 'Final',
      title: 'The Complete Pipeline',
      sub: 'End-to-End · Master Distribution Pack',
    },
  ];

  // Auto progression for §01
  useEffect(() => {
    const interval = setInterval(() => {
      setS1Progress((prev) => {
        if (prev >= 100) {
          setS1Idx((curr) => (curr + 1) % s1Slides.length);
          return 0;
        }
        return prev + 1;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [s1Slides.length]);

  // Auto progression for §03 Ultra Wide
  useEffect(() => {
    const interval = setInterval(() => {
      setS3Progress((prev) => {
        if (prev >= 100) {
          setS3Idx((curr) => (curr + 1) % 6);
          return 0;
        }
        return prev + 1.25;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Auto progression for §06 Crossfade
  useEffect(() => {
    const interval = setInterval(() => {
      setS6Progress((prev) => {
        if (prev >= 100) {
          setS6Idx((curr) => (curr + 1) % 4);
          return 0;
        }
        return prev + 1.4;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Auto progression for §A Zoom Burst
  useEffect(() => {
    const interval = setInterval(() => {
      setZbProgress((prev) => {
        if (prev >= 100) {
          setZbIdx((curr) => (curr + 1) % 6);
          return 0;
        }
        return prev + 1.1;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Auto progression for §C Countdown Ring
  useEffect(() => {
    const interval = setInterval(() => {
      setCdProgress((prev) => {
        if (prev >= 100) {
          setCdIdx((curr) => (curr + 1) % 4);
          return 0;
        }
        return prev + 1;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Auto progression for §F Wipe Transition
  useEffect(() => {
    const interval = setInterval(() => {
      setWipeProgress((prev) => {
        if (prev >= 100) {
          const dirs: ('wipe-r' | 'wipe-l' | 'wipe-u' | 'wipe-d')[] = ['wipe-r', 'wipe-l', 'wipe-u', 'wipe-d'];
          const next = (wipeIdx + 1) % 5;
          setWipeDir(dirs[next % dirs.length]);
          setWipeIdx(next);
          return 0;
        }
        return prev + 1;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [wipeIdx]);

  // Handle Before/After mouse / touch dragging
  const handleBaMove = (clientX: number) => {
    if (!baBoxRef.current || !isBaDragging.current) return;
    const rect = baBoxRef.current.getBoundingClientRect();
    const pct = Math.max(2, Math.min(98, ((clientX - rect.left) / rect.width) * 100));
    setBaPosition(pct);
  };

  const zbSlides = [
    {
      url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Rani_01_4.png?v=1779849787',
      tag: 'RAWx Drop 01',
      title: 'The Unfiltered Truth',
      sub: 'Brutalist · Raw · Permanent',
    },
    {
      url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Kareena-18-01_3.png?v=1779849788',
      tag: 'Kareena Series',
      title: 'Sovereign Presence',
      sub: 'Medium Format · Teal Grade',
    },
    {
      url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Mehzabina_01_3.png?v=1779849789',
      tag: 'Mehzabina 01',
      title: 'Tension Without Resolution',
      sub: 'Film Emulation · Grain · Halation',
    },
    {
      url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Hypnotic-Pendulum-18-01_7.jpg?v=1779859511',
      tag: 'Hypnotic Series',
      title: 'Industrial Realism',
      sub: 'Pendulum · Amber Pulse',
    },
    {
      url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-LAXMI-_3.jpg?v=1779859509',
      tag: 'Laxmi Series',
      title: 'Controlled Exposure',
      sub: 'Bleach Bypass · Silver Tone',
    },
    {
      url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/Alia-01_1.jpg?v=1779859520',
      tag: 'Alia 01',
      title: 'Form Meets Force',
      sub: 'Cross-Process · Vivid · Cinematic',
    },
  ];

  const wipeSlides = [
    { url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Rani_01_4.png?v=1779849787', tag: 'Wipe 01', title: 'Edge Precision' },
    { url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Mehzabina_01_3.png?v=1779849789', tag: 'Wipe 02', title: 'Motion Architecture' },
    { url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Kareena-18-01_3.png?v=1779849788', tag: 'Wipe 03', title: 'Vertical Force' },
    { url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/Alia-01_1.jpg?v=1779859520', tag: 'Wipe 04', title: 'Lateral Cut' },
    { url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Hypnotic-Pendulum-18-01_7.jpg?v=1779859511', tag: 'Wipe 05', title: 'Sovereign Reveal' },
  ];

  const allSlidesList: LightboxItem[] = [
    ...s1Slides,
    ...zbSlides,
    ...wipeSlides,
  ];

  return (
    <div className="w-full mt-[65px] bg-[#050505] text-[#f4f0e8] font-mono pb-24 space-y-16">
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

      {/* ═══════════════════════════════════════════
           §01 · MASTER HERO · 21:9 CINEMATIC
      ════════════════════════════════════════════ */}
      <div className="space-y-3 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-[9px] tracking-[0.3em] uppercase text-[#888888] flex items-center justify-between border-b border-[#1c1c1c] pb-2">
          <span>01 · MASTER HERO · 21:9 CINEMATIC</span>
          <span className="text-[#c8b89a]">SEQ {String(s1Idx + 1).padStart(3, '0')} / 008</span>
        </div>

        <div className="relative aspect-[21/9] sm:aspect-[21/9] bg-[#111111] overflow-hidden rounded shadow-2xl group">
          {/* Main Track */}
          <div
            className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.77,0,0.18,1)]"
            style={{ transform: `translateX(-${s1Idx * 100}%)` }}
          >
            {s1Slides.map((slide, idx) => (
              <div
                key={idx}
                onClick={() => onOpenLightbox(s1Slides, idx)}
                className="flex-shrink-0 w-full h-full relative bg-cover bg-center cursor-zoom-in"
                style={{ backgroundImage: `url('${slide.url}')` }}
              >
                <div className="rx-grad-b" />
                <div className="rx-vignette" />
                <div className="rx-scanlines" />

                {/* Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 z-10">
                  <span className="text-[8px] tracking-[0.3em] uppercase text-[#c8b89a] block mb-1">
                    [ {slide.tag} ]
                  </span>
                  <h2 className="serif-display italic text-2xl sm:text-4xl md:text-5xl text-white font-normal leading-tight">
                    {slide.title}
                  </h2>
                  <span className="text-[10px] text-[#888888] tracking-widest uppercase mt-2 block">
                    {slide.sub}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
            {s1Slides.map((_, idx) => (
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
              onClick={() => setS1Idx((curr) => (curr - 1 + s1Slides.length) % s1Slides.length)}
              className="px-4 py-2.5 bg-[#050505]/75 hover:bg-[#c8b89a]/20 text-[#888888] hover:text-[#c8b89a] text-[10px] tracking-wider transition-colors cursor-pointer"
            >
              ← PREV
            </button>
            <button
              onClick={() => setS1Idx((curr) => (curr + 1) % s1Slides.length)}
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
        <div className="flex gap-1 h-14 overflow-x-auto bg-[#0a0a0a] p-1 border border-[#1c1c1c] rounded">
          {s1Slides.map((slide, idx) => (
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
      </div>

      {/* ═══════════════════════════════════════════
           §02 · SQUARE MATRIX · 4-COL VERTICAL
      ════════════════════════════════════════════ */}
      <div className="space-y-3 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-[9px] tracking-[0.3em] uppercase text-[#888888] border-b border-[#1c1c1c] pb-2">
          02 · SQUARE MATRIX · 1:1 · VERTICAL SLIDE
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {/* Column A */}
          <div className="relative aspect-square bg-[#111] overflow-hidden rounded group">
            <div
              className="flex flex-col h-full transition-transform duration-500"
              style={{ transform: `translateY(-${s2aIdx * 100}%)` }}
            >
              {['RAWx-Rani-wet-tee_9.jpg', 'RAWx-Rani-wet-tee_8.jpg', 'RAWx-Rani-wet-tee_7.jpg'].map((img, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-full h-full bg-cover bg-center relative"
                  style={{
                    backgroundImage: `url('https://cdn.shopify.com/s/files/1/0678/5957/8923/files/${img}?v=1779849777')`,
                  }}
                >
                  <div className="rx-grad-b" />
                  <div className="absolute bottom-4 left-4 z-10">
                    <span className="text-[8px] text-[#c8b89a] block uppercase">[ Core 0{i + 1} ]</span>
                    <p className="serif-display italic text-sm text-white">Module Alpha</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute bottom-0 right-0 z-20 flex bg-[#050505]/80 border-t border-l border-[#1c1c1c]">
              <button onClick={() => setS2aIdx((c) => (c - 1 + 3) % 3)} className="p-2 text-xs hover:text-[#c8b89a]">
                ↑
              </button>
              <button onClick={() => setS2aIdx((c) => (c + 1) % 3)} className="p-2 text-xs hover:text-[#c8b89a] border-l border-[#1c1c1c]">
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
              {['RAWx-Mehzabina_01_3.png', 'RAWx-Mehzabina_01_2.png', 'RAWx-Mehzabina_01_1.png'].map((img, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-full h-full bg-cover bg-center relative"
                  style={{
                    backgroundImage: `url('https://cdn.shopify.com/s/files/1/0678/5957/8923/files/${img}?v=1779849788')`,
                  }}
                >
                  <div className="rx-grad-b" />
                  <div className="absolute bottom-4 left-4 z-10">
                    <span className="text-[8px] text-[#c8b89a] block uppercase">[ FX 0{i + 1} ]</span>
                    <p className="serif-display italic text-sm text-white">Halation Glow</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute bottom-0 right-0 z-20 flex bg-[#050505]/80 border-t border-l border-[#1c1c1c]">
              <button onClick={() => setS2bIdx((c) => (c - 1 + 3) % 3)} className="p-2 text-xs hover:text-[#c8b89a]">
                ↑
              </button>
              <button onClick={() => setS2bIdx((c) => (c + 1) % 3)} className="p-2 text-xs hover:text-[#c8b89a] border-l border-[#1c1c1c]">
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
              {['RAWx-Kareena-18-01_3.png', 'RAWx-Kareena-18-01_2.jpg', 'RAWx-Kareena-18-01_1.jpg'].map((img, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-full h-full bg-cover bg-center relative"
                  style={{
                    backgroundImage: `url('https://cdn.shopify.com/s/files/1/0678/5957/8923/files/${img}?v=1779849788')`,
                  }}
                >
                  <div className="rx-grad-b" />
                  <div className="absolute bottom-4 left-4 z-10">
                    <span className="text-[8px] text-[#c8b89a] block uppercase">[ Tone 0{i + 1} ]</span>
                    <p className="serif-display italic text-sm text-white">Teal &amp; Steel</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute bottom-0 right-0 z-20 flex bg-[#050505]/80 border-t border-l border-[#1c1c1c]">
              <button onClick={() => setS2cIdx((c) => (c - 1 + 3) % 3)} className="p-2 text-xs hover:text-[#c8b89a]">
                ↑
              </button>
              <button onClick={() => setS2cIdx((c) => (c + 1) % 3)} className="p-2 text-xs hover:text-[#c8b89a] border-l border-[#1c1c1c]">
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
              {['RAWx-Rani-180_-01_1.jpg', 'RAWx-Rani-180_-01_3.jpg', 'RAWx-Rani-180_-01_4.jpg'].map((img, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-full h-full bg-cover bg-center relative"
                  style={{
                    backgroundImage: `url('https://cdn.shopify.com/s/files/1/0678/5957/8923/files/${img}?v=1779849776')`,
                  }}
                >
                  <div className="rx-grad-b" />
                  <div className="absolute bottom-4 left-4 z-10">
                    <span className="text-[8px] text-[#c8b89a] block uppercase">[ Drop 0{i + 1} ]</span>
                    <p className="serif-display italic text-sm text-white">Urban Grit</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute bottom-0 right-0 z-20 flex bg-[#050505]/80 border-t border-l border-[#1c1c1c]">
              <button onClick={() => setS2dIdx((c) => (c - 1 + 3) % 3)} className="p-2 text-xs hover:text-[#c8b89a]">
                ↑
              </button>
              <button onClick={() => setS2dIdx((c) => (c + 1) % 3)} className="p-2 text-xs hover:text-[#c8b89a] border-l border-[#1c1c1c]">
                ↓
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
           §11 · BEFORE / AFTER GRADE COMPARISON
      ════════════════════════════════════════════ */}
      <div className="space-y-3 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-[9px] tracking-[0.3em] uppercase text-[#888888] border-b border-[#1c1c1c] pb-2">
          11 · BEFORE / AFTER · GRADE COMPARISON DRAG
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
            style={{
              backgroundImage: `url('https://cdn.shopify.com/s/files/1/0678/5957/8923/files/1778967907457.png?v=1779850502')`,
            }}
          />

          {/* After Layer (Graded) with clip-path */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://cdn.shopify.com/s/files/1/0678/5957/8923/files/1778967907457.png?v=1779850502')`,
              filter: 'saturate(.75) hue-rotate(10deg) contrast(1.15) brightness(.92)',
              clipPath: `inset(0 ${100 - baPosition}% 0 0)`,
            }}
          />

          {/* Dividing Drag Handle */}
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-[#c8b89a] z-20 pointer-events-none -translate-x-1/2"
            style={{ left: `${baPosition}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#050505]/90 border border-[#c8b89a] flex items-center justify-center text-[8px] text-[#c8b89a] tracking-tighter">
              ← →
            </div>
          </div>

          <div className="absolute top-4 left-4 z-10 bg-[#050505]/75 border border-[#1c1c1c] px-3 py-1 text-[8px] text-[#c8b89a] tracking-widest uppercase">
            [ RAW ]
          </div>
          <div className="absolute top-4 right-4 z-10 bg-[#050505]/75 border border-[#1c1c1c] px-3 py-1 text-[8px] text-[#c8b89a] tracking-widest uppercase">
            [ GRADED ]
          </div>

          <div className="absolute bottom-4 left-4 z-10">
            <span className="text-[8px] text-[#c8b89a] block uppercase">[ Grade Comparison ]</span>
            <h3 className="serif-display italic text-xl sm:text-2xl text-white">Drag to Reveal LUT Transformation</h3>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
           §A · ZOOM-BURST · 21:9 SCALE POP
      ════════════════════════════════════════════ */}
      <div className="space-y-3 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-[9px] tracking-[0.3em] uppercase text-[#888888] border-b border-[#1c1c1c] pb-2">
          A · ZOOM-BURST · 21:9 · SCALE POP TRANSITION
        </div>

        <div className="relative aspect-[21/9] bg-[#111111] overflow-hidden rounded shadow-2xl">
          {zbSlides.map((slide, idx) => (
            <div
              key={idx}
              onClick={() => onOpenLightbox(zbSlides, idx)}
              className={`absolute inset-0 bg-cover bg-center cursor-zoom-in transition-opacity duration-500 ${
                idx === zbIdx ? 'zb-enter opacity-100 z-10' : 'opacity-0 z-0'
              }`}
              style={{ backgroundImage: `url('${slide.url}')` }}
            />
          ))}

          <div className="rx-grad-b z-10" />
          <div className="rx-scanlines z-10" />

          {/* Info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 z-20">
            <span className="text-[8px] tracking-[0.4em] text-[#888888] uppercase block mb-1">
              SEQ 0{zbIdx + 1} / 06
            </span>
            <h2 className="serif-display italic text-2xl sm:text-5xl text-white leading-tight">
              {zbSlides[zbIdx]?.title}
            </h2>
            <span className="text-[9px] tracking-widest text-[#888888] uppercase block mt-2">
              {zbSlides[zbIdx]?.sub}
            </span>
          </div>

          <div className="absolute top-1/2 right-10 -translate-y-1/2 z-10 text-8xl sm:text-9xl font-bold text-[#c8b89a]/5 pointer-events-none">
            0{zbIdx + 1}
          </div>

          <div className="absolute bottom-0 left-0 h-[2px] bg-[#c8b89a] z-30" style={{ width: `${zbProgress}%` }} />
        </div>
      </div>

      {/* ═══════════════════════════════════════════
           §C · COUNTDOWN RING TIMER AUTO · 16:9
      ════════════════════════════════════════════ */}
      <div className="space-y-3 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-[9px] tracking-[0.3em] uppercase text-[#888888] border-b border-[#1c1c1c] pb-2">
          C · COUNTDOWN RING · 16:9 · SVG TIMER AUTO
        </div>

        <div className="relative aspect-video bg-[#111111] overflow-hidden rounded shadow-2xl">
          <div
            className="flex h-full transition-transform duration-700"
            style={{ transform: `translateX(-${cdIdx * 100}%)` }}
          >
            {[
              { title: 'Controlled Chaos', sub: 'ISO 800 · f/1.4 · 1/500s', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Laxmi_-18-04_1.jpg?v=1779859505' },
              { title: 'Sovereign Grain', sub: 'Kodak 400 Emulation · Teal Pull', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Laxmi_-18-04_2.jpg?v=1779859508' },
              { title: 'Amber Burn', sub: 'Fuji 800Z · Warm Latitude', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Laxmi-18-05_1.jpg?v=1779859508' },
              { title: 'Deep Noir Archive', sub: 'Ilford HP5 · Push +2 · 35mm', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Laxmi-18-07_1.jpg?v=1779859507' },
            ].map((slide, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-full h-full bg-cover bg-center relative"
                style={{ backgroundImage: `url('${slide.url}')` }}
              >
                <div className="rx-grad-b" />
                <div className="rx-scanlines" />
                <div className="absolute bottom-6 left-6 z-10">
                  <span className="text-[8px] text-[#c8b89a] block uppercase">[ Chapter 0{i + 1} ]</span>
                  <h3 className="serif-display italic text-2xl text-white">{slide.title}</h3>
                  <span className="text-[9px] text-[#888888] block mt-1">{slide.sub}</span>
                </div>
              </div>
            ))}
          </div>

          {/* SVG Countdown Ring */}
          <div className="absolute top-4 right-4 z-20 w-12 h-12 flex items-center justify-center bg-black/60 rounded-full border border-[#f3efe6]/10">
            <svg className="w-10 h-10 -rotate-90">
              <circle cx="20" cy="20" r="16" stroke="rgba(200,184,154,0.15)" strokeWidth="2" fill="none" />
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke="#c8b89a"
                strokeWidth="2"
                fill="none"
                strokeDasharray={100}
                strokeDashoffset={Math.max(0, 100 - cdProgress)}
              />
            </svg>
            <span className="absolute font-mono text-xs text-[#c8b89a] font-bold">
              {Math.max(1, Math.ceil((1 - cdProgress / 100) * 5))}
            </span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
           §F · WIPE TRANSITION · 21:9
      ════════════════════════════════════════════ */}
      <div className="space-y-3 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-[9px] tracking-[0.3em] uppercase text-[#888888] border-b border-[#1c1c1c] pb-2">
          F · WIPE-TRANSITION · 21:9 · DIRECTIONAL REVEAL
        </div>

        <div className="relative aspect-[21/9] bg-[#111111] overflow-hidden rounded shadow-2xl">
          {wipeSlides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 bg-cover bg-center ${
                idx === wipeIdx ? `z-10 ${wipeDir}` : 'opacity-0 z-0'
              }`}
              style={{ backgroundImage: `url('${slide.url}')` }}
            />
          ))}

          <div className="rx-grad-b z-10" />
          <div className="rx-scanlines z-10" />

          <div className="absolute bottom-6 left-6 z-20">
            <span className="text-[8px] text-[#c8b89a] block uppercase">[ {wipeSlides[wipeIdx]?.tag} ]</span>
            <h3 className="serif-display italic text-2xl sm:text-4xl text-white">
              {wipeSlides[wipeIdx]?.title}
            </h3>
          </div>

          <div className="absolute bottom-0 right-0 z-20 flex bg-[#050505]/80 border-t border-l border-[#1c1c1c]">
            <button
              onClick={() => {
                setWipeDir('wipe-l');
                setWipeIdx((c) => (c - 1 + 5) % 5);
              }}
              className="px-3 py-2 text-[10px] hover:text-[#c8b89a]"
            >
              ← PREV
            </button>
            <button
              onClick={() => {
                setWipeDir('wipe-r');
                setWipeIdx((c) => (c + 1) % 5);
              }}
              className="px-3 py-2 text-[10px] hover:text-[#c8b89a] border-l border-[#1c1c1c]"
            >
              NEXT →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
