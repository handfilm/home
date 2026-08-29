import React, { useState, useRef } from 'react';
import { AllSlidersData, SlideData } from '../types';
import {
  X,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  Download,
  FileCode,
  Check,
  Sparkles,
  Plus,
  Trash2,
  Sliders,
  Eye,
  Layers,
} from 'lucide-react';

interface DynamicPhotoManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  slidersData: AllSlidersData;
  onUpdateSlidersData: (updated: AllSlidersData) => void;
  onResetToDefaults: () => void;
  defaultSectionKey?: string;
}

type SectionKey =
  | 's1'
  | 's2a'
  | 's2b'
  | 's2c'
  | 's2d'
  | 's3'
  | 's4a'
  | 's4b'
  | 's5a'
  | 's5b'
  | 's5c'
  | 's6'
  | 's7a'
  | 's7b'
  | 's7c'
  | 's7d'
  | 's8a'
  | 's8b'
  | 's9'
  | 's10'
  | 's11'
  | 's12'
  | 'sA'
  | 'sB'
  | 'sC'
  | 'sD'
  | 'sE'
  | 'sF';

const SECTION_OPTIONS: { key: SectionKey; label: string; ratio: string }[] = [
  { key: 's1', label: '§01 · Master Hero', ratio: '21:9' },
  { key: 's2a', label: '§02A · Core 01-03', ratio: '1:1' },
  { key: 's2b', label: '§02B · FX 01-03', ratio: '1:1' },
  { key: 's2c', label: '§02C · Tone 01-03', ratio: '1:1' },
  { key: 's2d', label: '§02D · Drop 01-03', ratio: '1:1' },
  { key: 's3', label: '§03 · Ultra Wide Cinema', ratio: '32:9' },
  { key: 's4a', label: '§04A · Asym Vol 1', ratio: '1:1' },
  { key: 's4b', label: '§04B · Asym Vol 2', ratio: '1:1' },
  { key: 's5a', label: '§05A · Triptych Grade', ratio: '9:16' },
  { key: 's5b', label: '§05B · Triptych Look', ratio: '9:16' },
  { key: 's5c', label: '§05C · Triptych FX', ratio: '9:16' },
  { key: 's6', label: '§06 · Crossfade Broadcast', ratio: '21:9' },
  { key: 's7a', label: '§07A · Portrait Grid A', ratio: '4:5' },
  { key: 's7b', label: '§07B · Portrait Grid B', ratio: '4:5' },
  { key: 's7c', label: '§07C · Portrait Grid C', ratio: '4:5' },
  { key: 's7d', label: '§07D · Portrait Grid D', ratio: '4:5' },
  { key: 's8a', label: '§08A · Dual Left', ratio: '16:9' },
  { key: 's8b', label: '§08B · Dual Right', ratio: '16:9' },
  { key: 's9', label: '§09 · Standard Hero', ratio: '16:9' },
  { key: 's10', label: '§10 · Footer Banner', ratio: '8:1' },
  { key: 's11', label: '§11 · Before / After', ratio: '21:9' },
  { key: 's12', label: '§12 · Video Slide', ratio: '21:9' },
  { key: 'sA', label: '§A · Zoom-Burst', ratio: '21:9' },
  { key: 'sB', label: '§B · Stagger Grid 3×2', ratio: '16:7' },
  { key: 'sC', label: '§C · Countdown Ring', ratio: '16:9' },
  { key: 'sD', label: '§D · Split Panel Dual-Axis', ratio: '16:9' },
  { key: 'sE', label: '§E · Inertia Filmstrip', ratio: '21:6' },
  { key: 'sF', label: '§F · Wipe Transition', ratio: '21:9' },
];

const CURATED_IMAGE_PRESETS = [
  {
    name: 'RAWx Editorial Hero',
    url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx_wallpaper_4.jpg?v=1779844302',
  },
  {
    name: 'Industrial Metal & Leather',
    url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/Picsart_26-05-25_06-16-40-096.jpg?v=1779844301',
  },
  {
    name: 'Sovereign Noir Portrait',
    url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Kareena-18-01_3.png?v=1779849788',
  },
  {
    name: 'Amber Pulse Film Grain',
    url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Hypnotic-Pendulum-18-01_7.jpg?v=1779859511',
  },
  {
    name: 'Bleach Bypass Silver',
    url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-LAXMI-_3.jpg?v=1779859509',
  },
  {
    name: 'Cinematic High Fashion',
    url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/Alia-01_1.jpg?v=1779859520',
  },
  {
    name: 'Urban Wet Texture',
    url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Rani-wet-tee_9.jpg?v=1779849777',
  },
  {
    name: 'Cyber Tokyo Atmosphere',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
  },
  {
    name: 'Architectural Monolith',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
  },
  {
    name: 'Studio Minimal Lighting',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=80',
  },
];

export default function DynamicPhotoManagerModal({
  isOpen,
  onClose,
  slidersData,
  onUpdateSlidersData,
  onResetToDefaults,
  defaultSectionKey = 's1',
}: DynamicPhotoManagerModalProps) {
  const [selectedSection, setSelectedSection] = useState<SectionKey>(
    (defaultSectionKey as SectionKey) || 's1'
  );
  const [selectedSlideIndex, setSelectedSlideIndex] = useState<number>(0);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const jsonFileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const currentSectionData = slidersData[selectedSection];

  const triggerToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 2500);
  };

  // Upload local image file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;

      applyImageUrl(dataUrl);
      triggerToast('Local Image Uploaded Successfully!');
    };
    reader.readAsDataURL(file);
  };

  // Helper to apply image URL to selected slide in selected section
  const applyImageUrl = (url: string) => {
    if (selectedSection === 's11') {
      const s11 = { ...slidersData.s11 };
      if (selectedSlideIndex === 0) s11.beforeUrl = url;
      else s11.afterUrl = url;
      onUpdateSlidersData({ ...slidersData, s11 });
      return;
    }

    if (selectedSection === 'sB') {
      const sB = { ...slidersData.sB };
      const cellIdx = Math.floor(selectedSlideIndex / 2);
      const setIdx = selectedSlideIndex % 2;
      if (sB.cells[cellIdx]) {
        sB.cells[cellIdx].sets[setIdx] = url;
        onUpdateSlidersData({ ...slidersData, sB });
      }
      return;
    }

    if (selectedSection === 'sD') {
      const sD = { ...slidersData.sD };
      if (selectedSlideIndex < sD.left.length) {
        sD.left[selectedSlideIndex].url = url;
      } else {
        const rightIdx = selectedSlideIndex - sD.left.length;
        if (sD.right[rightIdx]) sD.right[rightIdx].url = url;
      }
      onUpdateSlidersData({ ...slidersData, sD });
      return;
    }

    // Standard array sections
    const array = slidersData[selectedSection] as SlideData[];
    if (Array.isArray(array)) {
      const updated = array.map((item, idx) =>
        idx === selectedSlideIndex ? { ...item, url } : item
      );
      onUpdateSlidersData({ ...slidersData, [selectedSection]: updated });
    }
  };

  // Update text metadata (title, tag, sub)
  const handleUpdateSlideMeta = (field: 'title' | 'tag' | 'sub', value: string) => {
    if (selectedSection === 's11') {
      onUpdateSlidersData({
        ...slidersData,
        s11: { ...slidersData.s11, [field]: value },
      });
      return;
    }

    if (selectedSection === 'sD') {
      const sD = { ...slidersData.sD };
      if (selectedSlideIndex < sD.left.length) {
        sD.left[selectedSlideIndex][field] = value;
      } else {
        const rightIdx = selectedSlideIndex - sD.left.length;
        if (sD.right[rightIdx]) sD.right[rightIdx][field] = value;
      }
      onUpdateSlidersData({ ...slidersData, sD });
      return;
    }

    const array = slidersData[selectedSection] as SlideData[];
    if (Array.isArray(array)) {
      const updated = array.map((item, idx) =>
        idx === selectedSlideIndex ? { ...item, [field]: value } : item
      );
      onUpdateSlidersData({ ...slidersData, [selectedSection]: updated });
    }
  };

  // Add new slide
  const handleAddSlide = () => {
    const array = slidersData[selectedSection] as SlideData[];
    if (Array.isArray(array)) {
      const newSlide: SlideData = {
        id: `${selectedSection}-${Date.now()}`,
        url: CURATED_IMAGE_PRESETS[Math.floor(Math.random() * CURATED_IMAGE_PRESETS.length)].url,
        tag: 'Custom Frame',
        title: 'New Slide Frame',
        sub: 'Dynamic Master OS Pipeline',
      };
      const updated = [...array, newSlide];
      onUpdateSlidersData({ ...slidersData, [selectedSection]: updated });
      setSelectedSlideIndex(updated.length - 1);
      triggerToast('Added New Slide!');
    }
  };

  // Delete slide
  const handleDeleteSlide = (idxToDelete: number) => {
    const array = slidersData[selectedSection] as SlideData[];
    if (Array.isArray(array) && array.length > 1) {
      const updated = array.filter((_, idx) => idx !== idxToDelete);
      onUpdateSlidersData({ ...slidersData, [selectedSection]: updated });
      setSelectedSlideIndex(Math.max(0, idxToDelete - 1));
      triggerToast('Slide Removed.');
    }
  };

  // Export JSON configuration
  const handleExportConfig = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(slidersData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `rawx_slider_config_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerToast('Configuration exported as JSON!');
  };

  // Import JSON configuration
  const handleImportConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && typeof parsed === 'object') {
          onUpdateSlidersData(parsed);
          triggerToast('Imported custom slider configuration!');
        }
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  // Calculate current slide object
  const getSelectedSlideObj = (): { url: string; title: string; tag: string; sub: string } => {
    if (selectedSection === 's11') {
      return {
        url: selectedSlideIndex === 0 ? slidersData.s11.beforeUrl : slidersData.s11.afterUrl,
        title: slidersData.s11.title,
        tag: selectedSlideIndex === 0 ? slidersData.s11.beforeLabel : slidersData.s11.afterLabel,
        sub: slidersData.s11.sub,
      };
    }

    if (selectedSection === 'sB') {
      const cellIdx = Math.floor(selectedSlideIndex / 2);
      const setIdx = selectedSlideIndex % 2;
      const cell = slidersData.sB.cells[cellIdx];
      return {
        url: cell?.sets[setIdx] || '',
        title: `${cell?.title || 'Frame'} (Set ${setIdx + 1})`,
        tag: 'Stagger Grid',
        sub: 'Cascade Sequence',
      };
    }

    if (selectedSection === 'sD') {
      if (selectedSlideIndex < slidersData.sD.left.length) {
        const item = slidersData.sD.left[selectedSlideIndex];
        return {
          url: item?.url || '',
          title: item?.title || '',
          tag: item?.tag || 'Left Axis',
          sub: item?.sub || '',
        };
      } else {
        const rightIdx = selectedSlideIndex - slidersData.sD.left.length;
        const item = slidersData.sD.right[rightIdx];
        return {
          url: item?.url || '',
          title: item?.title || '',
          tag: item?.tag || 'Right Axis',
          sub: item?.sub || '',
        };
      }
    }

    const array = slidersData[selectedSection] as SlideData[];
    const item = array?.[selectedSlideIndex] || array?.[0] || { url: '', title: '', tag: '', sub: '' };
    return {
      url: item.url || '',
      title: item.title || '',
      tag: item.tag || '',
      sub: item.sub || '',
    };
  };

  const currentSlide = getSelectedSlideObj();

  // Get list of slides to display in the selector strip
  const getSlideList = (): { id: string; url: string; label: string }[] => {
    if (selectedSection === 's11') {
      return [
        { id: 'before', url: slidersData.s11.beforeUrl, label: 'RAW [ Before ]' },
        { id: 'after', url: slidersData.s11.afterUrl, label: 'GRADED [ After ]' },
      ];
    }

    if (selectedSection === 'sB') {
      const list: { id: string; url: string; label: string }[] = [];
      slidersData.sB.cells.forEach((c, cIdx) => {
        c.sets.forEach((url, sIdx) => {
          list.push({
            id: `sb-${cIdx}-${sIdx}`,
            url,
            label: `${c.title} (S${sIdx + 1})`,
          });
        });
      });
      return list;
    }

    if (selectedSection === 'sD') {
      const left = slidersData.sD.left.map((s, i) => ({
        id: `left-${i}`,
        url: s.url,
        label: `L: ${s.title || `0${i + 1}`}`,
      }));
      const right = slidersData.sD.right.map((s, i) => ({
        id: `right-${i}`,
        url: s.url,
        label: `R: ${s.title || `0${i + 1}`}`,
      }));
      return [...left, ...right];
    }

    const array = slidersData[selectedSection] as SlideData[];
    if (Array.isArray(array)) {
      return array.map((s, i) => ({
        id: s.id || `${selectedSection}-${i}`,
        url: s.url,
        label: s.title || `Slide 0${i + 1}`,
      }));
    }
    return [];
  };

  const slideList = getSlideList();

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[150] bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 select-none font-mono"
    >
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-[#0c0b09] border border-[#f3efe6]/15 rounded-lg shadow-2xl flex flex-col overflow-hidden text-[#f3efe6]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f3efe6]/10 bg-[#141310]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#c8b89a]/15 text-[#c8b89a] flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold tracking-wider uppercase text-white flex items-center gap-2">
                <span>DYNAMIC PHOTO &amp; MEDIA STUDIO</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#c8b89a]/20 text-[#c8b89a] font-normal">
                  MASTER OS
                </span>
              </h2>
              <p className="text-[10px] text-[#f3efe6]/50">
                Change photos, upload your own images, edit titles &amp; configure all 16 slider systems
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportConfig}
              title="Export all custom slider photos & content as JSON"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1a1916] border border-[#f3efe6]/10 text-[10px] text-[#f3efe6]/70 hover:text-white cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={() => jsonFileInputRef.current?.click()}
              title="Import JSON slider preset configuration"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1a1916] border border-[#f3efe6]/10 text-[10px] text-[#f3efe6]/70 hover:text-white cursor-pointer transition-colors"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Import JSON</span>
            </button>
            <input
              ref={jsonFileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportConfig}
              className="hidden"
            />

            <button
              onClick={() => {
                if (confirm('Reset all slider photos and texts to default Master OS state?')) {
                  onResetToDefaults();
                  triggerToast('Restored Default Photos.');
                }
              }}
              title="Reset to factory photography"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-950/40 border border-red-500/20 text-[10px] text-red-400 hover:text-red-300 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded bg-[#1f1e1a] hover:bg-[#2d2c26] text-[#f3efe6]/60 hover:text-white cursor-pointer transition-colors ml-2"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast alert */}
        {saveToast && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded bg-[#c8b89a] text-black font-bold text-xs tracking-wider flex items-center gap-2 shadow-xl animate-fade-in">
            <Check className="w-4 h-4 text-black" />
            <span>{saveToast}</span>
          </div>
        )}

        {/* Main Body: Section selector + Slide list + Editor */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Section Picker Pills */}
          <div>
            <label className="text-[10px] tracking-[0.2em] uppercase text-[#888888] block mb-2 font-semibold">
              1. CHOOSE SLIDER SECTION TO CUSTOMIZE:
            </label>
            <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
              {SECTION_OPTIONS.map((sec) => (
                <button
                  key={sec.key}
                  onClick={() => {
                    setSelectedSection(sec.key);
                    setSelectedSlideIndex(0);
                  }}
                  className={`flex-shrink-0 px-3 py-1.5 rounded text-[11px] font-mono tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                    selectedSection === sec.key
                      ? 'bg-[#c8b89a] text-black font-bold shadow-md scale-[1.02]'
                      : 'bg-[#181714] text-[#f3efe6]/60 hover:text-[#f3efe6] hover:bg-[#22211d] border border-[#f3efe6]/10'
                  }`}
                >
                  <span>{sec.label}</span>
                  <span
                    className={`text-[9px] px-1 rounded ${
                      selectedSection === sec.key ? 'bg-black/20 text-black' : 'bg-white/10 text-white/60'
                    }`}
                  >
                    {sec.ratio}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Slide Selector Carousel for this section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] tracking-[0.2em] uppercase text-[#888888] font-semibold">
                2. SELECT SLIDE / FRAME ({slideList.length} Slides Available):
              </label>

              {Array.isArray(slidersData[selectedSection]) && (
                <button
                  onClick={handleAddSlide}
                  className="flex items-center gap-1 text-[10px] text-[#c8b89a] hover:underline cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add New Slide</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {slideList.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setSelectedSlideIndex(idx)}
                  className={`relative aspect-[4/3] rounded overflow-hidden border-2 transition-all cursor-pointer group bg-[#161512] ${
                    selectedSlideIndex === idx
                      ? 'border-[#c8b89a] ring-2 ring-[#c8b89a]/30 shadow-lg scale-105'
                      : 'border-transparent opacity-60 hover:opacity-100 hover:border-white/30'
                  }`}
                >
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url('${slide.url}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-1.5">
                    <span className="text-[9px] font-mono text-white truncate">{slide.label}</span>
                  </div>
                  <span className="absolute top-1 left-1 text-[8px] bg-black/70 px-1 rounded text-[#c8b89a]">
                    0{idx + 1}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Slide Editor Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#141310] border border-[#f3efe6]/10 p-5 rounded-lg">
            {/* Left: Live Preview */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] tracking-widest uppercase text-[#c8b89a] flex items-center gap-1.5 font-bold">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Live Frame Preview</span>
                </span>
                <span className="text-[9px] text-[#f3efe6]/40">
                  Slide {selectedSlideIndex + 1} of {slideList.length}
                </span>
              </div>

              <div className="relative aspect-[16/10] rounded bg-[#050505] overflow-hidden border border-[#f3efe6]/15 shadow-inner group">
                <div
                  className="w-full h-full bg-cover bg-center transition-all duration-300"
                  style={{ backgroundImage: `url('${currentSlide.url}')` }}
                />
                <div className="rx-grad-b pointer-events-none" />
                <div className="rx-scanlines pointer-events-none" />

                <div className="absolute bottom-3 left-3 right-3 z-10">
                  {currentSlide.tag && (
                    <span className="text-[8px] tracking-[0.25em] text-[#c8b89a] uppercase block">
                      [ {currentSlide.tag} ]
                    </span>
                  )}
                  <h3 className="serif-display italic text-lg text-white font-normal truncate">
                    {currentSlide.title || 'Slide Title'}
                  </h3>
                  {currentSlide.sub && (
                    <p className="text-[9px] text-[#f3efe6]/60 uppercase tracking-wider truncate">
                      {currentSlide.sub}
                    </p>
                  )}
                </div>
              </div>

              {/* Upload Local File Button */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 px-4 rounded bg-[#1e1d19] hover:bg-[#2a2924] border border-[#f3efe6]/15 hover:border-[#c8b89a] text-xs text-[#c8b89a] flex items-center justify-center gap-2 cursor-pointer transition-all font-bold"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Local Photo from Device</span>
                </button>
              </div>
            </div>

            {/* Right: Inputs & Metadata */}
            <div className="lg:col-span-7 space-y-4">
              {/* Image URL Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] tracking-widest uppercase text-[#888888] font-bold block">
                  Image Source URL:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentSlide.url}
                    onChange={(e) => applyImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 bg-[#090807] border border-[#f3efe6]/15 rounded px-3 py-2 text-xs font-mono text-[#f3efe6] focus:border-[#c8b89a] focus:outline-none"
                  />
                  <button
                    onClick={() => triggerToast('Image URL Applied!')}
                    className="px-3 py-2 bg-[#c8b89a] text-black font-bold text-xs rounded hover:bg-white cursor-pointer transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Metadata Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] tracking-widest uppercase text-[#888888] block">
                    Tag / Category Label:
                  </label>
                  <input
                    type="text"
                    value={currentSlide.tag}
                    onChange={(e) => handleUpdateSlideMeta('tag', e.target.value)}
                    placeholder="e.g. Master OS, Drop 01"
                    className="w-full bg-[#090807] border border-[#f3efe6]/15 rounded px-3 py-1.5 text-xs font-mono text-[#f3efe6] focus:border-[#c8b89a] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] tracking-widest uppercase text-[#888888] block">
                    Slide Headline / Title:
                  </label>
                  <input
                    type="text"
                    value={currentSlide.title}
                    onChange={(e) => handleUpdateSlideMeta('title', e.target.value)}
                    placeholder="e.g. Cinematic Grading"
                    className="w-full bg-[#090807] border border-[#f3efe6]/15 rounded px-3 py-1.5 text-xs font-mono text-[#f3efe6] focus:border-[#c8b89a] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] tracking-widest uppercase text-[#888888] block">
                  Subtitle / Technical Spec Description:
                </label>
                <input
                  type="text"
                  value={currentSlide.sub}
                  onChange={(e) => handleUpdateSlideMeta('sub', e.target.value)}
                  placeholder="e.g. System Architecture v3.0 · 8K Pipeline"
                  className="w-full bg-[#090807] border border-[#f3efe6]/15 rounded px-3 py-1.5 text-xs font-mono text-[#f3efe6] focus:border-[#c8b89a] focus:outline-none"
                />
              </div>

              {/* Quick Preset Swatches */}
              <div className="space-y-2 pt-2 border-t border-[#f3efe6]/10">
                <label className="text-[9px] tracking-widest uppercase text-[#c8b89a] flex items-center gap-1 font-bold">
                  <Sparkles className="w-3 h-3" />
                  <span>One-Click Curated Presets:</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                  {CURATED_IMAGE_PRESETS.map((preset, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => {
                        applyImageUrl(preset.url);
                        triggerToast(`Applied "${preset.name}"`);
                      }}
                      className="text-left p-1 rounded bg-[#090807] border border-[#f3efe6]/10 hover:border-[#c8b89a] transition-all cursor-pointer group"
                    >
                      <div
                        className="w-full h-10 bg-cover bg-center rounded-sm mb-1"
                        style={{ backgroundImage: `url('${preset.url}')` }}
                      />
                      <span className="text-[8px] text-[#f3efe6]/70 group-hover:text-white truncate block">
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Delete slide action if array */}
              {Array.isArray(slidersData[selectedSection]) &&
                (slidersData[selectedSection] as SlideData[]).length > 1 && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => handleDeleteSlide(selectedSlideIndex)}
                      className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove This Slide from Section</span>
                    </button>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-[#f3efe6]/10 bg-[#141310] text-[11px]">
          <span className="text-[#888888] hidden sm:inline">
            Changes are saved in real-time to your browser's persistent storage.
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 rounded bg-[#c8b89a] text-black font-bold tracking-wider uppercase hover:bg-white transition-colors cursor-pointer"
          >
            Done &amp; Return to Sliders
          </button>
        </div>
      </div>
    </div>
  );
}
