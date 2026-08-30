import React, { useState } from 'react';
import { SectionItem } from '../types';
import { TranslationDictionary } from '../i18n/translations';
import { ArrowRight, CheckCircle2, Circle, Sparkles, Smartphone, Layers } from 'lucide-react';

interface EcosystemMapViewProps {
  sections: SectionItem[];
  onSelectSection: (index: number) => void;
  onOpenSliders?: () => void;
  visitedPortals: string[];
  t: TranslationDictionary;
}

interface MapNode {
  id: string;
  label: string;
  category: 'commerce' | 'media' | 'engines' | 'hub';
  sub: string;
  x: number;
  y: number;
  accent: string;
  index?: number;
  isEngine?: boolean;
}

export default function EcosystemMapView({
  sections,
  onSelectSection,
  onOpenSliders,
  visitedPortals,
  t,
}: EcosystemMapViewProps) {
  const [hoveredNode, setHoveredNode] = useState<MapNode | null>(null);

  // Define static node positions (fixed radial constellation coordinates in 800x500 viewport)
  const nodes: MapNode[] = [
    {
      id: 'hub',
      label: 'MASTER OS HUB',
      category: 'hub',
      sub: 'Central Orchestration & Task Sync Mesh',
      x: 400,
      y: 250,
      accent: '#c8b89a',
    },
    // Commerce Cluster (Left)
    {
      id: 'd2c',
      label: sections.find((s) => s.id === 'd2c')?.title || 'D2C SHOP',
      category: 'commerce',
      sub: sections.find((s) => s.id === 'd2c')?.sub || 'Consumer Commerce & Drops',
      x: 180,
      y: 160,
      accent: '#b14a26',
      index: sections.findIndex((s) => s.id === 'd2c'),
    },
    {
      id: 'b2b',
      label: sections.find((s) => s.id === 'b2b')?.title || 'ARUTEMIKA B2B',
      category: 'commerce',
      sub: sections.find((s) => s.id === 'b2b')?.sub || 'Corporate & Wholesale Trade',
      x: 170,
      y: 340,
      accent: '#4a6670',
      index: sections.findIndex((s) => s.id === 'b2b'),
    },
    // Media & Culture Cluster (Right)
    {
      id: 'articles',
      label: sections.find((s) => s.id === 'articles')?.title || 'ARTICLES',
      category: 'media',
      sub: sections.find((s) => s.id === 'articles')?.sub || 'Research & Long-Form Essays',
      x: 620,
      y: 160,
      accent: '#c79a3d',
      index: sections.findIndex((s) => s.id === 'articles'),
    },
    {
      id: 'handfilm',
      label: sections.find((s) => s.id === 'handfilm')?.title || 'HAND FILM',
      category: 'media',
      sub: sections.find((s) => s.id === 'handfilm')?.sub || 'Cinematic Live Stream & Media Archive',
      x: 630,
      y: 340,
      accent: '#e05d26',
      index: sections.findIndex((s) => s.id === 'handfilm'),
    },
    // Engines Cluster (Top & Bottom)
    {
      id: 'rawx-sliders',
      label: 'RAWX 16 SLIDERS',
      category: 'engines',
      sub: 'Ultra Slider System & Color Grading Architecture',
      x: 400,
      y: 90,
      accent: '#f59e0b',
      isEngine: true,
    },
    {
      id: 'sync-mesh',
      label: 'MULTI-DEVICE SYNC',
      category: 'engines',
      sub: 'Encrypted Real-Time Room & Task State',
      x: 400,
      y: 410,
      accent: '#10b981',
      isEngine: true,
    },
  ];

  // Connections from hub to each peripheral node
  const links = [
    { from: 'hub', to: 'd2c' },
    { from: 'hub', to: 'b2b' },
    { from: 'hub', to: 'articles' },
    { from: 'hub', to: 'handfilm' },
    { from: 'hub', to: 'rawx-sliders' },
    { from: 'hub', to: 'sync-mesh' },
    { from: 'd2c', to: 'b2b' },
    { from: 'articles', to: 'handfilm' },
  ];

  const handleNodeClick = (node: MapNode) => {
    if (node.isEngine && onOpenSliders) {
      onOpenSliders();
    } else if (node.index !== undefined && node.index >= 0) {
      onSelectSection(node.index);
    }
  };

  return (
    <div className="w-full space-y-4 font-mono">
      {/* Map Header & Clusters Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-[10.5px] border-b border-[#f3efe6]/10 pb-3">
        <div className="flex items-center gap-4 text-[#f3efe6]/70">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#b14a26]" />
            <span>{t.map.clusters.commerce}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#c79a3d]" />
            <span>{t.map.clusters.media}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>{t.map.clusters.engines}</span>
          </span>
        </div>

        <div className="text-[10px] text-[#c8b89a]">{t.map.clickToJump}</div>
      </div>

      {/* SVG Canvas Map Area */}
      <div className="relative w-full h-[420px] bg-[#0c0b09] rounded-xl border border-[#f3efe6]/15 overflow-hidden flex items-center justify-center p-4">
        {/* Subtle grid lines background */}
        <div className="absolute inset-0 bg-[radial-gradient(#f3efe6_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

        <svg viewBox="0 0 800 500" className="w-full h-full max-w-3xl">
          {/* Animated Connecting Links */}
          {links.map((l, idx) => {
            const source = nodes.find((n) => n.id === l.from);
            const target = nodes.find((n) => n.id === l.to);
            if (!source || !target) return null;

            const isHovered = hoveredNode?.id === source.id || hoveredNode?.id === target.id;

            return (
              <g key={idx}>
                <line
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={isHovered ? target.accent : 'rgba(243, 239, 230, 0.15)'}
                  strokeWidth={isHovered ? 2 : 1}
                  strokeDasharray={l.from === 'hub' ? 'none' : '4,4'}
                  className="transition-all duration-300"
                />
                {/* Flow particles on active lines */}
                <circle r="2.5" fill={target.accent} opacity={isHovered ? 0.9 : 0.4}>
                  <animateMotion
                    path={`M ${source.x} ${source.y} L ${target.x} ${target.y}`}
                    dur={`${4 + idx * 0.5}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            );
          })}

          {/* Render Nodes */}
          {nodes.map((node) => {
            const isHovered = hoveredNode?.id === node.id;
            const isVisited = visitedPortals.includes(node.id);
            const isHub = node.id === 'hub';

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => handleNodeClick(node)}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-pointer group"
              >
                {/* Node Outer Halo */}
                <circle
                  r={isHub ? 32 : 24}
                  fill={isHub ? 'rgba(200, 184, 154, 0.1)' : 'rgba(20, 19, 16, 0.8)'}
                  stroke={node.accent}
                  strokeWidth={isHovered ? 2.5 : 1.5}
                  className="transition-all duration-300"
                />

                {/* Pulsing indicator for active/hovered node */}
                {isHovered && (
                  <circle
                    r={isHub ? 40 : 30}
                    fill="none"
                    stroke={node.accent}
                    strokeWidth="1"
                    className="animate-ping opacity-60"
                  />
                )}

                {/* Node Center Badge */}
                <circle r={isHub ? 12 : 8} fill={node.accent} opacity={0.9} />

                {/* Node Label Text */}
                <text
                  y={isHub ? 48 : 38}
                  textAnchor="middle"
                  fill={isHovered ? '#f3efe6' : 'rgba(243, 239, 230, 0.8)'}
                  fontSize={isHub ? '12px' : '10px'}
                  fontWeight={isHovered ? 'bold' : '500'}
                  letterSpacing="0.1em"
                  className="transition-colors"
                >
                  {node.label}
                </text>

                {/* Visited Mark */}
                {isVisited && !isHub && (
                  <g transform="translate(14, -14)">
                    <circle r="5" fill="#10b981" />
                    <text
                      y="2.5"
                      textAnchor="middle"
                      fill="#0e0d0b"
                      fontSize="6px"
                      fontWeight="bold"
                    >
                      ✓
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Floating Node Details Card */}
        {hoveredNode && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-[#161512]/95 backdrop-blur-md border border-[#f3efe6]/20 rounded-lg p-3.5 shadow-2xl transition-all pointer-events-none">
            <div className="flex items-center justify-between gap-2">
              <span
                className="text-[9px] uppercase px-1.5 py-0.2 rounded font-bold text-[#0e0d0b]"
                style={{ backgroundColor: hoveredNode.accent }}
              >
                {hoveredNode.category}
              </span>
              {visitedPortals.includes(hoveredNode.id) && (
                <span className="text-[9px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {t.map.nodeVisited}
                </span>
              )}
            </div>
            <h4 className="text-sm font-bold uppercase text-[#f3efe6] mt-1.5">
              {hoveredNode.label}
            </h4>
            <p className="text-[10px] text-[#f3efe6]/60 mt-0.5 leading-relaxed">
              {hoveredNode.sub}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
