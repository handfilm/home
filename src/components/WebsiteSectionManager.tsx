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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dest.trim()) return;

    onAddSection({
      title: title.trim(),
      category: category.trim() || `0${sections.length + 1} / WEBSITE`,
      sub: sub.trim() || `${title.trim()} Online Portal`,
      desc: desc.trim() || `Explore the ${title.trim()} ecosystem section and digital tools.`,
      url: url.trim() || dest.replace(/^https?:\/\//, ''),
      dest: dest.startsWith('http') ? dest : `https://${dest}`,
      cta: cta.trim() || `ENTER ${title.trim().toUpperCase()}`,
      accent,
      tex,
      isCustom: true,
    });

    // Reset
    setTitle('');
    setCategory('');
    setSub('');
    setDesc('');
    setUrl('');
    setDest('');
    setCta('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#141310] border border-[#f3efe6]/20 rounded-2xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#f3efe6]/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-[0.2em] text-indigo-400 uppercase">
                Modular Ecosystem Architecture
              </span>
              <h3 className="text-xl font-bold uppercase font-mono text-[#f3efe6]">
                Ecosystem Sections &amp; Websites
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#f3efe6]/60 hover:text-[#f3efe6] font-mono text-sm cursor-pointer p-1"
          >
            ✕
          </button>
        </div>

        {/* Existing Sections List */}
        <div className="space-y-3 font-mono text-xs">
          <span className="text-[#f3efe6]/70 uppercase font-bold text-[10px] tracking-wider block">
            Current Websites / Sections ({sections.length})
          </span>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {sections.map((sec) => (
              <div
                key={sec.id}
                className="flex items-center justify-between p-3 bg-[#1a1815] border border-[#f3efe6]/10 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: sec.accent }}
                  />
                  <div>
                    <span className="font-bold text-[#f3efe6] block">{sec.title}</span>
                    <span className="text-[10px] text-[#f3efe6]/50">{sec.url}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={sec.dest}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 hover:text-indigo-400 transition-colors"
                    title="Open website"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  {sec.isCustom && (
                    <button
                      onClick={() => onDeleteSection(sec.id)}
                      className="p-1.5 hover:text-red-400 transition-colors cursor-pointer"
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
        <div className="p-5 bg-[#1a1815] border border-[#f3efe6]/15 rounded-xl space-y-4 font-mono text-xs">
          <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-wider text-[11px]">
            <Plus className="w-4 h-4" />
            <span>Add New Website / Section</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#f3efe6]/60 uppercase text-[10px] mb-1">
                  Website Name *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., STUDIO LAB, BRAND PORTAL"
                  className="w-full bg-[#0e0d0b] border border-[#f3efe6]/15 rounded-lg px-3 py-2 text-xs text-[#f3efe6] focus:outline-none focus:border-indigo-400 uppercase"
                />
              </div>

              <div>
                <label className="block text-[#f3efe6]/60 uppercase text-[10px] mb-1">
                  Category Tag
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., 04 / RESEARCH"
                  className="w-full bg-[#0e0d0b] border border-[#f3efe6]/15 rounded-lg px-3 py-2 text-xs text-[#f3efe6] focus:outline-none focus:border-indigo-400 uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#f3efe6]/60 uppercase text-[10px] mb-1">
                  Website Destination URL *
                </label>
                <input
                  type="text"
                  required
                  value={dest}
                  onChange={(e) => setDest(e.target.value)}
                  placeholder="https://lab.handsandhead.com"
                  className="w-full bg-[#0e0d0b] border border-[#f3efe6]/15 rounded-lg px-3 py-2 text-xs text-[#f3efe6] focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-[#f3efe6]/60 uppercase text-[10px] mb-1">
                  Display URL Domain
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="lab.handsandhead.com"
                  className="w-full bg-[#0e0d0b] border border-[#f3efe6]/15 rounded-lg px-3 py-2 text-xs text-[#f3efe6] focus:outline-none focus:border-indigo-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#f3efe6]/60 uppercase text-[10px] mb-1">
                Subtitle &amp; Mission
              </label>
              <input
                type="text"
                value={sub}
                onChange={(e) => setSub(e.target.value)}
                placeholder="e.g. Next-Generation Design & Experimental Prototypes"
                className="w-full bg-[#0e0d0b] border border-[#f3efe6]/15 rounded-lg px-3 py-2 text-xs text-[#f3efe6] focus:outline-none focus:border-indigo-400"
              />
            </div>

            <div>
              <label className="block text-[#f3efe6]/60 uppercase text-[10px] mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Brief summary of what this website section represents..."
                className="w-full bg-[#0e0d0b] border border-[#f3efe6]/15 rounded-lg px-3 py-2 text-xs text-[#f3efe6] focus:outline-none focus:border-indigo-400"
              />
            </div>

            {/* Accent Color Picker */}
            <div>
              <label className="block text-[#f3efe6]/60 uppercase text-[10px] mb-1.5">
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
                      borderColor: accent === col.hex ? '#f3efe6' : 'transparent',
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
                className="px-4 py-2 bg-[#0e0d0b] hover:bg-[#1a1815] text-[#f3efe6]/80 rounded-lg cursor-pointer"
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
