import React, { useState } from 'react';
import { SectionItem } from '../types';
import { Plus, Trash2, Globe, ExternalLink, Sparkles, Check } from 'lucide-react';

interface WebsiteSectionManagerProps {
  isOpen: boolean;
  onClose: () => void;
  sections: SectionItem[];
  onAddSection: (section: Omit<SectionItem, 'id'>) => void;
  onDeleteSection: (id: string) => void;
}

const COLOR_PRESETS = [
  { name: 'Rust Terra', hex: '#b14a26' },
  { name: 'Slate Teal', hex: '#4a6670' },
  { name: 'Gold Amber', hex: '#c79a3d' },
  { name: 'Royal Indigo', hex: '#4f46e5' },
  { name: 'Emerald Pine', hex: '#059669' },
  { name: 'Crimson Rose', hex: '#e11d48' },
  { name: 'Violet Neon', hex: '#9333ea' },
  { name: 'Graphite Carbon', hex: '#71717a' },
];

export default function WebsiteSectionManager({
  isOpen,
  onClose,
  sections,
  onAddSection,
  onDeleteSection,
}: WebsiteSectionManagerProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [sub, setSub] = useState('');
  const [desc, setDesc] = useState('');
  const [url, setUrl] = useState('');
  const [dest, setDest] = useState('');
  const [cta, setCta] = useState('');
  const [accent, setAccent] = useState('#4f46e5');
  const [tex, setTex] = useState('tex-custom');
  const [isLiveEmbed, setIsLiveEmbed] = useState(false);
  const [embedUrl, setEmbedUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dest.trim()) return;

    const finalDest = dest.startsWith('http') ? dest : `https://${dest}`;
    const finalEmbed = isLiveEmbed
      ? embedUrl.trim()
        ? embedUrl.startsWith('http')
          ? embedUrl
          : `https://${embedUrl}`
        : finalDest
      : undefined;

    onAddSection({
      title: title.trim(),
      category: category.trim() || `0${sections.length + 1} / ${isLiveEmbed ? 'LIVE PORTAL' : 'WEBSITE'}`,
      sub: sub.trim() || `${title.trim()} Online Portal`,
      desc: desc.trim() || `Explore the ${title.trim()} ecosystem section and digital tools.`,
      url: url.trim() || dest.replace(/^https?:\/\//, ''),
      dest: finalDest,
      cta: cta.trim() || `ENTER ${title.trim().toUpperCase()}`,
      accent,
      tex: isLiveEmbed ? 'tex-film' : tex,
      isCustom: true,
      sectionType: isLiveEmbed ? 'live-embed' : 'static',
      embedUrl: finalEmbed,
    });

    // Reset
    setTitle('');
    setCategory('');
    setSub('');
    setDesc('');
    setUrl('');
    setDest('');
    setCta('');
    setIsLiveEmbed(false);
    setEmbedUrl('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div
        className="border rounded-2xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto hh-theme-transition"
        style={{
          backgroundColor: 'var(--hh-surface)',
          borderColor: 'var(--hh-border)',
          color: 'var(--hh-text)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b pb-4"
          style={{ borderColor: 'var(--hh-border)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-500">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-[0.2em] text-indigo-500 uppercase">
                Modular Ecosystem Architecture
              </span>
              <h3 className="text-xl font-bold uppercase font-mono" style={{ color: 'var(--hh-text)' }}>
                Ecosystem Sections &amp; Websites
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="opacity-70 hover:opacity-100 font-mono text-sm cursor-pointer p-1"
            style={{ color: 'var(--hh-text)' }}
          >
            ✕
          </button>
        </div>

        {/* Existing Sections List */}
        <div className="space-y-3 font-mono text-xs">
          <span className="uppercase font-bold text-[10px] tracking-wider block" style={{ color: 'var(--hh-muted)' }}>
            Current Websites / Sections ({sections.length})
          </span>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {sections.map((sec) => (
              <div
                key={sec.id}
                className="flex items-center justify-between p-3 border rounded-lg"
                style={{
                  backgroundColor: 'var(--hh-bg)',
                  borderColor: 'var(--hh-border)',
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: sec.accent }}
                  />
                  <div>
                    <span className="font-bold block" style={{ color: 'var(--hh-text)' }}>{sec.title}</span>
                    <span className="text-[10px]" style={{ color: 'var(--hh-muted)' }}>{sec.url}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={sec.dest}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 hover:text-indigo-500 transition-colors"
                    title="Open website"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  {sec.isCustom && (
                    <button
                      onClick={() => onDeleteSection(sec.id)}
                      className="p-1.5 hover:text-red-500 transition-colors cursor-pointer"
                      title="Remove section"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add New Section Form */}
        <div
          className="p-5 border rounded-xl space-y-4 font-mono text-xs"
          style={{
            backgroundColor: 'var(--hh-bg)',
            borderColor: 'var(--hh-border)',
          }}
        >
          <div className="flex items-center gap-2 text-indigo-500 font-bold uppercase tracking-wider text-[11px]">
            <Plus className="w-4 h-4" />
            <span>Add New Website / Section</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block uppercase text-[10px] mb-1" style={{ color: 'var(--hh-muted)' }}>
                  Website Name *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., STUDIO LAB, BRAND PORTAL"
                  className="w-full border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 uppercase"
                  style={{
                    backgroundColor: 'var(--hh-surface)',
                    borderColor: 'var(--hh-border)',
                    color: 'var(--hh-text)',
                  }}
                />
              </div>

              <div>
                <label className="block uppercase text-[10px] mb-1" style={{ color: 'var(--hh-muted)' }}>
                  Category Tag
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., 04 / RESEARCH"
                  className="w-full border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 uppercase"
                  style={{
                    backgroundColor: 'var(--hh-surface)',
                    borderColor: 'var(--hh-border)',
                    color: 'var(--hh-text)',
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block uppercase text-[10px] mb-1" style={{ color: 'var(--hh-muted)' }}>
                  Website Destination URL *
                </label>
                <input
                  type="text"
                  required
                  value={dest}
                  onChange={(e) => setDest(e.target.value)}
                  placeholder="https://lab.handsandhead.com"
                  className="w-full border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                  style={{
                    backgroundColor: 'var(--hh-surface)',
                    borderColor: 'var(--hh-border)',
                    color: 'var(--hh-text)',
                  }}
                />
              </div>

              <div>
                <label className="block uppercase text-[10px] mb-1" style={{ color: 'var(--hh-muted)' }}>
                  Display URL Domain
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="lab.handsandhead.com"
                  className="w-full border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                  style={{
                    backgroundColor: 'var(--hh-surface)',
                    borderColor: 'var(--hh-border)',
                    color: 'var(--hh-text)',
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block uppercase text-[10px] mb-1" style={{ color: 'var(--hh-muted)' }}>
                Subtitle &amp; Mission
              </label>
              <input
                type="text"
                value={sub}
                onChange={(e) => setSub(e.target.value)}
                placeholder="e.g. Next-Generation Design & Experimental Prototypes"
                className="w-full border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                style={{
                  backgroundColor: 'var(--hh-surface)',
                  borderColor: 'var(--hh-border)',
                  color: 'var(--hh-text)',
                }}
              />
            </div>

            <div>
              <label className="block uppercase text-[10px] mb-1" style={{ color: 'var(--hh-muted)' }}>
                Description
              </label>
              <textarea
                rows={2}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Brief summary of what this website section represents..."
                className="w-full border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                style={{
                  backgroundColor: 'var(--hh-surface)',
                  borderColor: 'var(--hh-border)',
                  color: 'var(--hh-text)',
                }}
              />
            </div>

            {/* Live Embed Toggle Option */}
            <div
              className="p-3 border rounded-lg space-y-2"
              style={{
                backgroundColor: 'var(--hh-surface)',
                borderColor: 'var(--hh-border)',
              }}
            >
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isLiveEmbed}
                  onChange={(e) => setIsLiveEmbed(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-0 cursor-pointer"
                />
                <span className="text-[11px] font-bold uppercase" style={{ color: 'var(--hh-text)' }}>
                  Enable Live Animated Portal Stream (Embed Mode)
                </span>
              </label>
              {isLiveEmbed && (
                <div className="pl-6 pt-1">
                  <label className="block uppercase text-[9px] mb-1" style={{ color: 'var(--hh-muted)' }}>
                    Live Stream Embed URL (defaults to Destination URL)
                  </label>
                  <input
                    type="text"
                    value={embedUrl}
                    onChange={(e) => setEmbedUrl(e.target.value)}
                    placeholder="https://handfilm.myshopify.com/"
                    className="w-full border border-amber-500/40 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-amber-500"
                    style={{
                      backgroundColor: 'var(--hh-bg)',
                      color: 'var(--hh-text)',
                    }}
                  />
                  <p className="text-[9px] mt-1" style={{ color: 'var(--hh-muted)' }}>
                    Renders an ambient live interactive/animated stream as the section backdrop with automatic fallback.
                  </p>
                </div>
              )}
            </div>

            {/* Accent Color Picker */}
            <div>
              <label className="block uppercase text-[10px] mb-1.5" style={{ color: 'var(--hh-muted)' }}>
                Brand Accent Color
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {COLOR_PRESETS.map((col) => (
                  <button
                    type="button"
                    key={col.hex}
                    onClick={() => setAccent(col.hex)}
                    className="w-7 h-7 rounded-full border-2 transition-transform cursor-pointer flex items-center justify-center"
                    style={{
                      backgroundColor: col.hex,
                      borderColor: accent === col.hex ? 'var(--hh-text)' : 'transparent',
                      transform: accent === col.hex ? 'scale(1.15)' : 'scale(1)',
                    }}
                    title={col.name}
                  >
                    {accent === col.hex && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-lg cursor-pointer"
                style={{
                  backgroundColor: 'var(--hh-surface)',
                  borderColor: 'var(--hh-border)',
                  color: 'var(--hh-text)',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg cursor-pointer shadow-lg"
              >
                Add Website Section
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
