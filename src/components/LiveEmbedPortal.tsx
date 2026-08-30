import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Radio, ExternalLink, RefreshCw, Film, ShieldAlert, MonitorPlay, MousePointer, Maximize2, Minimize2 } from 'lucide-react';

interface LiveEmbedPortalProps {
  embedUrl: string;
  fallbackImage?: string;
  fallbackTexture?: string;
  isActive: boolean;
  isAdjacent?: boolean;
  title: string;
  accent: string;
  onOpenDirect?: () => void;
}

export default function LiveEmbedPortal({
  embedUrl,
  fallbackImage,
  fallbackTexture = 'tex-film',
  isActive,
  isAdjacent = false,
  title,
  accent,
  onOpenDirect,
}: LiveEmbedPortalProps) {
  const [loadState, setLoadState] = useState<'idle' | 'loading' | 'loaded' | 'fallback'>('idle');
  const [portalMode, setPortalMode] = useState<'live' | 'poster'>('live');
  const [isInteractive, setIsInteractive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const timerRef = useRef<number | null>(null);

  // Lazy loading: Only mount iframe if this slide is active or adjacent
  const shouldMountIframe = (isActive || isAdjacent) && portalMode === 'live';

  useEffect(() => {
    if (!shouldMountIframe) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setLoadState('idle');
      return;
    }

    setLoadState('loading');

    // Timeout safety for sites with strict X-Frame-Options or slow CSP responses
    timerRef.current = window.setTimeout(() => {
      setLoadState((prev) => (prev === 'loading' ? 'fallback' : prev));
    }, 4500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [shouldMountIframe, retryKey]);

  const handleIframeLoad = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setLoadState('loaded');
  };

  const handleIframeError = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setLoadState('fallback');
  };

  const handleReload = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoadState('loading');
    setRetryKey((k) => k + 1);
  };

  return (
    <div
      className={`absolute inset-0 overflow-hidden bg-[#0b0908] transition-all duration-500 ${
        isFullscreen ? 'fixed inset-0 z-[100]' : ''
      }`}
    >
      {/* 1. Underlying Texture / Base Layer */}
      <div className={`absolute inset-0 ${fallbackTexture} opacity-70`} />

      {/* 2. Fallback Poster Image Layer */}
      {fallbackImage && (
        <div
          className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-[cubic-bezier(.16,.84,.32,1)] ${
            loadState === 'loaded' && portalMode === 'live' ? 'opacity-30 scale-100' : 'opacity-85 scale-105 animate-live-drift'
          }`}
          style={{ backgroundImage: `url('${fallbackImage}')` }}
        />
      )}

      {/* 3. Live Iframe Stream Layer */}
      {shouldMountIframe && (
        <div
          className={`absolute ${
            isFullscreen ? 'inset-0 w-full h-full' : '-inset-[15%] w-[130%] h-[130%]'
          } transition-opacity duration-1000 ${
            isInteractive ? 'pointer-events-auto' : 'pointer-events-none'
          } ${loadState === 'loaded' ? 'opacity-85' : 'opacity-0'} ${
            isActive && !isFullscreen && !isInteractive ? 'animate-live-drift' : ''
          }`}
        >
          <iframe
            key={retryKey}
            src={embedUrl}
            title={`${title} Live Portal Stream`}
            loading="lazy"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            className="w-full h-full border-0 object-cover filter contrast-[1.04] brightness-[0.95]"
            tabIndex={isInteractive ? 0 : -1}
            aria-hidden={!isInteractive}
          />
        </div>
      )}

      {/* 4. Cinematic Lighting Vignettes & Scrim (reduced if interactive) */}
      {!isInteractive && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0d0b] via-[#0e0d0b]/60 to-[#0e0d0b]/30 pointer-events-none z-10" />
          <div className="absolute inset-0 bg-radial-to-c from-transparent via-[#0e0d0b]/30 to-[#0e0d0b]/80 pointer-events-none z-10" />
          <div className="rx-scanlines z-10 opacity-35" />
        </>
      )}

      {/* 5. Live Stream Telemetry HUD Badge (Top Right) */}
      <div className="absolute top-6 right-6 sm:right-28 z-20 flex items-center gap-2 font-mono text-[10px] sm:text-[11px] tracking-wider uppercase">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#161512]/90 border border-[#f3efe6]/15 backdrop-blur-md text-[#f3efe6]/80 shadow-md">
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                loadState === 'loaded'
                  ? 'bg-emerald-400'
                  : loadState === 'loading'
                  ? 'bg-amber-400'
                  : 'bg-rose-400'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                loadState === 'loaded'
                  ? 'bg-emerald-500'
                  : loadState === 'loading'
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
            />
          </span>

          <span className="font-semibold">
            {loadState === 'loaded' && portalMode === 'live'
              ? 'LIVE PORTAL ACTIVE'
              : loadState === 'loading'
              ? 'CONNECTING STREAM...'
              : 'LIVE FEED / STANDBY POSTER'}
          </span>

          <span className="text-[#f3efe6]/30">|</span>

          {/* Interactive Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsInteractive((prev) => !prev);
            }}
            title={isInteractive ? 'Switch to cinematic view mode' : 'Enable live scroll & click inside portal'}
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] font-bold cursor-pointer transition-colors ${
              isInteractive
                ? 'bg-emerald-500 text-black'
                : 'bg-[#f3efe6]/10 text-[#f3efe6]/70 hover:text-white'
            }`}
          >
            <MousePointer className="w-2.5 h-2.5" />
            <span>{isInteractive ? 'INTERACTIVE' : 'PREVIEW'}</span>
          </button>

          {/* Fullscreen Expansion */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFullscreen((prev) => !prev);
            }}
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Portal View'}
            className="p-1 hover:text-white transition-colors cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-3 h-3 text-amber-400" /> : <Maximize2 className="w-3 h-3" />}
          </button>

          {/* Refresh Frame */}
          <button
            onClick={handleReload}
            title="Refresh Live Stream"
            className="p-0.5 hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${loadState === 'loading' ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
