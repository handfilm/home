import React, { useState, useMemo } from 'react';
import { SectionItem } from '../types';
import { PORTAL_CATEGORIES } from '../data/initialData';
import { TranslationDictionary } from '../i18n/translations';
import { ArrowRight, CheckCircle2, Circle, Sparkles, Network, ExternalLink, Search, Filter } from 'lucide-react';

interface EcosystemMapViewProps {
  sections: SectionItem[];
  onSelectSection: (index: number) => void;
  onOpenSliders?: () => void;
  visitedPortals: string[];
  t: TranslationDictionary;
}

export interface GraphNode {
  id: string;
  label: string;
  categoryKey: string;
  categoryLabel: string;
  sub: string;
  desc: string;
  url: string;
  dest: string;
  x: number;
  y: number;
  r: number;
  accent: string;
  sectionIndex?: number;
  isCenter?: boolean;
  isCategoryHub?: boolean;
  isEngine?: boolean;
}

export interface GraphLink {
  from: string;
  to: string;
  accent: string;
  dash?: string;
  speed?: number;
}

export default function EcosystemMapView({
  sections,
  onSelectSection,
  onOpenSliders,
  visitedPortals,
  t,
}: EcosystemMapViewProps) {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Category Theme Colors and Center Anchors in 1000x640 Canvas
  const categoryConfig: Record<string, { label: string; color: string; cx: number; cy: number; angle: number }> = {
    commerce: { label: 'COMMERCE', color: '#b14a26', cx: 240, cy: 190, angle: -150 },
    media: { label: 'MEDIA / CONTENT', color: '#c79a3d', cx: 500, cy: 120, angle: -90 },
    manuf: { label: 'MANUFACTURING', color: '#52697a', cx: 770, cy: 190, angle: -30 },
    craft: { label: 'CRAFT / LIFESTYLE', color: '#5c7a5c', cx: 780, cy: 450, angle: 30 },
    agro: { label: 'AGRICULTURE / FOOD', color: '#6f8c4e', cx: 500, cy: 520, angle: 90 },
    tools: { label: 'TOOLS / APPS', color: '#3f8a8f', cx: 230, cy: 450, angle: 150 },
  };

  // Build the complete interactive Graph Model
  const { nodes, links } = useMemo(() => {
    const graphNodes: GraphNode[] = [];
    const graphLinks: GraphLink[] = [];

    // 1. Central Core Hub Node
    const centerNode: GraphNode = {
      id: 'core-hub',
      label: 'H&H MASTER OS',
      categoryKey: 'core',
      categoryLabel: 'CENTRAL CORE',
      sub: 'Unified Orchestration & Sync Backbone',
      desc: 'Central command spine synchronizing real-time telemetry, identity, state, and cross-portal routing.',
      url: 'handsandhead.com',
      dest: 'https://handsandhead.com/',
      x: 500,
      y: 320,
      r: 32,
      accent: '#c8b89a',
      isCenter: true,
    };
    graphNodes.push(centerNode);

    // 2. Category Hub Anchors and Portal Nodes
    PORTAL_CATEGORIES.forEach((cat) => {
      const config = categoryConfig[cat.key] || {
        label: cat.label,
        color: '#c8b89a',
        cx: 500,
        cy: 320,
        angle: 0,
      };

      const categoryHubId = `cat-${cat.key}`;
      const catHubNode: GraphNode = {
        id: categoryHubId,
        label: cat.label.split('/')[0].trim(),
        categoryKey: cat.key,
        categoryLabel: cat.label,
        sub: `${cat.sectionIds.length} Portals Connected`,
        desc: `Autonomous divisional cluster coordinating ${cat.label.toLowerCase()} lines and supply networks.`,
        url: `${cat.key}.handsandhead.com`,
        dest: '#',
        x: config.cx,
        y: config.cy,
        r: 22,
        accent: config.color,
        isCategoryHub: true,
      };
      graphNodes.push(catHubNode);

      // Connect Center Core to Category Hub
      graphLinks.push({
        from: 'core-hub',
        to: categoryHubId,
        accent: config.color,
        speed: 3.5,
      });

      // Find all sections belonging to this category
      const catSections = sections.filter((s) => cat.sectionIds.includes(s.id));
      const count = catSections.length;

      // Distribute portal nodes in an orbital ring/arc around category hub
      catSections.forEach((sec, idx) => {
        const globalIdx = sections.findIndex((s) => s.id === sec.id);
        const orbitRadius = count > 4 ? 90 : 75;
        // Spread angle based on category position relative to canvas
        const baseAngle = (config.angle * Math.PI) / 180;
        const spread = (Math.PI * 1.3) / Math.max(count - 1, 1);
        const currentAngle = count === 1 ? baseAngle : baseAngle - (Math.PI * 0.65) + idx * spread;

        // Calculate node coordinate with boundary clamping
        let nodeX = Math.round(config.cx + Math.cos(currentAngle) * orbitRadius);
        let nodeY = Math.round(config.cy + Math.sin(currentAngle) * orbitRadius);

        // Clamping to stay inside viewBox
        nodeX = Math.max(50, Math.min(950, nodeX));
        nodeY = Math.max(45, Math.min(590, nodeY));

        const localized = t.sections?.[sec.id];
        const portalNode: GraphNode = {
          id: sec.id,
          label: localized?.title || sec.title,
          categoryKey: cat.key,
          categoryLabel: cat.label,
          sub: localized?.sub || sec.sub,
          desc: localized?.desc || sec.desc,
          url: sec.url,
          dest: sec.dest,
          x: nodeX,
          y: nodeY,
          r: 14,
          accent: sec.accent || config.color,
          sectionIndex: globalIdx >= 0 ? globalIdx : 0,
        };
        graphNodes.push(portalNode);

        // Connect Category Hub to Portal Node
        graphLinks.push({
          from: categoryHubId,
          to: sec.id,
          accent: sec.accent || config.color,
          dash: '3,3',
          speed: 4 + idx * 0.4,
        });
      });
    });

    // 3. Specialized Featured Engine: RAWx 16 Sliders Engine Node
    const engineNode: GraphNode = {
      id: 'rawx-engine',
      label: 'RAWX 16 SLIDERS',
      categoryKey: 'engines',
      categoryLabel: 'CORE ENGINE',
      sub: 'Ultra Slider System & Color LUT Shaders',
      desc: 'High-speed hardware-accelerated presentation architecture supporting 16 cinematic layouts, 21:9 & 32:9 viewports.',
      url: 'rawx.handsandhead.com',
      dest: '#',
      x: 500,
      y: 230,
      r: 16,
      accent: '#f59e0b',
      isEngine: true,
    };
    graphNodes.push(engineNode);

    // Link engine to core hub and media
    graphLinks.push({
      from: 'core-hub',
      to: 'rawx-engine',
      accent: '#f59e0b',
      speed: 2.8,
    });
    graphLinks.push({
      from: 'cat-media',
      to: 'rawx-engine',
      accent: '#f59e0b',
      dash: '2,2',
      speed: 5.0,
    });

    // Cross-ecosystem inter-cluster relational links
    graphLinks.push({
      from: 'cat-commerce',
      to: 'cat-manuf',
      accent: '#7a8b99',
      dash: '4,4',
      speed: 6.0,
    });
    graphLinks.push({
      from: 'cat-craft',
      to: 'cat-agro',
      accent: '#6b8265',
      dash: '4,4',
      speed: 6.5,
    });
    graphLinks.push({
      from: 'cat-tools',
      to: 'cat-media',
      accent: '#7a7a99',
      dash: '4,4',
      speed: 7.0,
    });

    return { nodes: graphNodes, links: graphLinks };
  }, [sections, t]);

  // Active hovered node data
  const activeHoveredNode = useMemo(() => {
    if (!hoveredNodeId) return null;
    return nodes.find((n) => n.id === hoveredNodeId) || null;
  }, [hoveredNodeId, nodes]);

  // Filter / Search Match Calculation
  const isNodeMatched = (node: GraphNode) => {
    if (selectedCategory !== 'all') {
      if (node.isCenter) return true;
      if (node.categoryKey !== selectedCategory) return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      node.label.toLowerCase().includes(q) ||
      node.sub.toLowerCase().includes(q) ||
      node.url.toLowerCase().includes(q) ||
      node.categoryLabel.toLowerCase().includes(q)
    );
  };

  const handleNodeClick = (node: GraphNode) => {
    if (node.isEngine && onOpenSliders) {
      onOpenSliders();
    } else if (node.sectionIndex !== undefined && node.sectionIndex >= 0) {
      onSelectSection(node.sectionIndex);
    } else if (node.isCategoryHub) {
      setSelectedCategory((prev) => (prev === node.categoryKey ? 'all' : node.categoryKey));
    }
  };

  // Visited count metrics
  const visitedCount = sections.filter((s) => visitedPortals.includes(s.id)).length;
  const visitedPercent = Math.round((visitedCount / Math.max(sections.length, 1)) * 100);

  return (
    <div className="w-full space-y-4 font-mono select-none">
      {/* Control Bar: Filter Clusters + Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-[#f3efe6]/10 pb-3">
        {/* Category Clusters Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-bold tracking-wider uppercase transition-colors cursor-pointer whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-[#f3efe6] text-[#0e0d0b]'
                : 'bg-[#181613] text-[#f3efe6]/60 hover:text-[#f3efe6] border border-[#f3efe6]/15'
            }`}
          >
            ALL ({sections.length})
          </button>

          {PORTAL_CATEGORIES.map((cat) => {
            const conf = categoryConfig[cat.key];
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(isSelected ? 'all' : cat.key)}
                className={`px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-bold tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'text-[#0e0d0b] shadow-md'
                    : 'bg-[#181613] text-[#f3efe6]/60 hover:text-[#f3efe6] border border-[#f3efe6]/15'
                }`}
                style={{
                  backgroundColor: isSelected ? conf?.color || '#c8b89a' : undefined,
                  borderColor: isSelected ? conf?.color : undefined,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: conf?.color || '#c8b89a' }}
                />
                <span>{cat.label.split('/')[0].trim()}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input & Metrics */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 absolute left-2.5 text-[#f3efe6]/40 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find node..."
              className="bg-[#141310] border border-[#f3efe6]/15 rounded-md pl-8 pr-2.5 py-1 text-[11px] text-[#f3efe6] placeholder-[#f3efe6]/30 focus:outline-none focus:border-amber-400/70 w-32 sm:w-36 transition-all"
            />
          </div>

          <div className="text-[10px] text-[#f3efe6]/60 flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-emerald-400 font-bold">{visitedCount}</span>
            <span>/ {sections.length}</span>
            <span className="text-emerald-400/70">({visitedPercent}%)</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas Map Area */}
      <div className="relative w-full h-[460px] sm:h-[500px] bg-[#0c0b09] rounded-xl border border-[#f3efe6]/15 overflow-hidden flex items-center justify-center p-2 sm:p-4 shadow-inner">
        {/* Subtle grid and constellation background */}
        <div className="absolute inset-0 bg-[radial-gradient(#f3efe6_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,184,154,0.04),transparent_70%)] pointer-events-none" />

        {/* Scalable Vector Graphics Graph View */}
        <svg viewBox="0 0 1000 640" className="w-full h-full max-w-5xl">
          <defs>
            {/* Ambient Core Radial Glow Filter */}
            <filter id="coreGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Render Connecting SVG Links */}
          {links.map((link, idx) => {
            const source = nodes.find((n) => n.id === link.from);
            const target = nodes.find((n) => n.id === link.to);
            if (!source || !target) return null;

            const isSourceMatched = isNodeMatched(source);
            const isTargetMatched = isNodeMatched(target);
            const isLinkActive = isSourceMatched && isTargetMatched;
            const isHovered =
              hoveredNodeId === source.id ||
              hoveredNodeId === target.id ||
              (hoveredNodeId === 'core-hub' && (source.isCenter || target.isCenter));

            return (
              <g key={`link-${idx}`} opacity={isLinkActive ? 1 : 0.15} className="transition-opacity duration-300">
                {/* Static Connection Line */}
                <line
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={isHovered ? target.accent : link.accent}
                  strokeWidth={isHovered ? 2.5 : isLinkActive ? 1.2 : 0.8}
                  strokeOpacity={isHovered ? 0.9 : isLinkActive ? 0.35 : 0.1}
                  strokeDasharray={link.dash || 'none'}
                  className="transition-all duration-300"
                />

                {/* Flowing animated pulse particles */}
                {isLinkActive && (
                  <circle r={isHovered ? 3.5 : 2.2} fill={target.accent} opacity={isHovered ? 0.95 : 0.5}>
                    <animateMotion
                      path={`M ${source.x} ${source.y} L ${target.x} ${target.y}`}
                      dur={`${link.speed || 4}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
              </g>
            );
          })}

          {/* 2. Render Interactive Graph Nodes */}
          {nodes.map((node) => {
            const isMatched = isNodeMatched(node);
            const isHovered = hoveredNodeId === node.id;
            const isVisited = visitedPortals.includes(node.id);
            const isCore = node.isCenter;
            const isCatHub = node.isCategoryHub;

            const baseRadius = node.r;
            const hitRadius = Math.max(baseRadius * 1.8, 26);

            return (
              <g
                key={`node-${node.id}`}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => handleNodeClick(node)}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                opacity={isMatched ? 1 : 0.2}
                className="cursor-pointer transition-opacity duration-300"
              >
                {/* Large Transparent Hit Area for Touch/Click Ease */}
                <circle r={hitRadius} fill="transparent" />

                {/* Animated Pulsing Ping on Hover or Core */}
                {(isHovered || (isCore && isMatched)) && (
                  <circle
                    r={baseRadius + (isHovered ? 12 : 8)}
                    fill="none"
                    stroke={node.accent}
                    strokeWidth="1.2"
                    className="animate-ping opacity-50"
                  />
                )}

                {/* Node Outer Halo Container */}
                <circle
                  r={baseRadius}
                  fill={
                    isCore
                      ? 'rgba(200, 184, 154, 0.15)'
                      : isCatHub
                      ? 'rgba(26, 24, 20, 0.9)'
                      : 'rgba(18, 17, 14, 0.85)'
                  }
                  stroke={node.accent}
                  strokeWidth={isHovered ? 3 : isCore || isCatHub ? 2 : 1.5}
                  strokeOpacity={isHovered ? 1 : 0.8}
                  filter={isCore ? 'url(#coreGlow)' : undefined}
                  className="transition-all duration-200"
                />

                {/* Center Node Color Accent Dot */}
                <circle
                  r={isCore ? 14 : isCatHub ? 9 : 5}
                  fill={node.accent}
                  opacity={isHovered ? 1 : 0.85}
                  className="transition-opacity"
                />

                {/* Node Core Icon or Marker */}
                {node.isEngine && (
                  <g transform="translate(-5, -5)">
                    <Sparkles className="w-2.5 h-2.5 text-black" />
                  </g>
                )}

                {/* Node Text Label */}
                <text
                  y={baseRadius + 14}
                  textAnchor="middle"
                  fill={isHovered ? '#ffffff' : isMatched ? '#f3efe6' : 'rgba(243, 239, 230, 0.4)'}
                  fontSize={isCore ? '12px' : isCatHub ? '10.5px' : '9px'}
                  fontWeight={isHovered || isCore || isCatHub ? 'bold' : 'normal'}
                  letterSpacing={isCore ? '0.12em' : '0.08em'}
                  className="transition-colors pointer-events-none drop-shadow"
                >
                  {node.label}
                </text>

                {/* Visited Checkmark Badge */}
                {isVisited && !isCore && !isCatHub && (
                  <g transform={`translate(${baseRadius - 3}, ${-baseRadius + 3})`}>
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

        {/* Interactive Floating Details Card on Hover */}
        {activeHoveredNode && (
          <div className="absolute bottom-3 right-3 left-3 sm:left-auto sm:w-84 bg-[#141310]/95 backdrop-blur-md border border-[#f3efe6]/25 rounded-lg p-3.5 shadow-2xl transition-all z-20 font-mono">
            <div className="flex items-center justify-between gap-2">
              <span
                className="text-[9px] uppercase px-2 py-0.5 rounded font-bold text-[#0e0d0b]"
                style={{ backgroundColor: activeHoveredNode.accent }}
              >
                {activeHoveredNode.categoryLabel}
              </span>

              {visitedPortals.includes(activeHoveredNode.id) && (
                <span className="text-[9px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {t.map.nodeVisited}
                </span>
              )}
            </div>

            <h4 className="text-sm sm:text-base font-bold uppercase text-[#f3efe6] mt-2">
              {activeHoveredNode.label}
            </h4>

            <p className="text-[10px] text-amber-300/80 font-mono mt-0.5">
              {activeHoveredNode.sub}
            </p>

            <p className="text-[10.5px] text-[#f3efe6]/70 mt-1 leading-relaxed line-clamp-2">
              {activeHoveredNode.desc}
            </p>

            <div className="mt-2.5 pt-2 border-t border-[#f3efe6]/10 flex items-center justify-between text-[10px]">
              <span className="text-[#f3efe6]/40">{activeHoveredNode.url}</span>
              <button
                onClick={() => handleNodeClick(activeHoveredNode)}
                className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>{activeHoveredNode.isEngine ? 'OPEN ENGINE' : 'ENTER PORTAL'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
