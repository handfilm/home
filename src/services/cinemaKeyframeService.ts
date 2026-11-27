import handFilmPoster from '../assets/images/hand_film_cinematic_poster_1788025510409.jpg';
import b2bLeatherImg from '../assets/images/arutemika_b2b_leather_1788023629277.jpg';
import d2cVaultImg from '../assets/images/d2c_shop_vault_1788023609155.jpg';
import rawxEditorialImg from '../assets/images/rawxos_editorial_hero_1788023645113.jpg';
import studioProjectsImg from '../assets/images/handfilm_studio_projects_1795465511068.jpg';
import adCampaignsImg from '../assets/images/handfilm_ad_campaigns_1795465510343.jpg';
import brandAssetsImg from '../assets/images/handfilm_brand_assets_1795465510908.jpg';
import socialTrendsImg from '../assets/images/handfilm_social_trends_1795465511816.jpg';
import tutorialsImg from '../assets/images/handfilm_tutorials_1795465512209.jpg';
import arutemikaEditorialImg from '../assets/images/cinema_arutemika_editorial_1795743036758.jpg';
import rawxSteelMacroImg from '../assets/images/cinema_rawx_steel_macro_1795743038948.jpg';
import culinaryMacroImg from '../assets/images/cinema_culinary_macro_1795743041147.jpg';
import textileLoomMacroImg from '../assets/images/cinema_textile_loom_macro_1795743042247.jpg';
import { safeStorage } from '../utils/safeStorage';

export type CinemaRenderMode =
  | 'bts-rig'
  | 'aural-scope'
  | 'editorial-desk'
  | 'high-fashion'
  | 'vault-drop'
  | 'botanical-beauty'
  | 'athletic-ramp'
  | 'steel-leather-macro'
  | 'garment-editorial'
  | 'fiber-loom-macro'
  | 'culinary-macro'
  | 'neural-ui';

export interface PortalCinemaPreset {
  portalId: string;
  renderMode: CinemaRenderMode;
  hudTag: string;
  lensSpec: string;
  fpsSpec: string;
  shotDirective: string;
  primaryHex: string;
  secondaryHex: string;
  stillUrl: string;
}

export interface HydratedKeyframeDirective {
  portalId: string;
  hudTag: string;
  lensSpec: string;
  shotDirective: string;
  primaryHex: string;
  secondaryHex: string;
  hydratedAt: number;
  source: 'gemini';
}

const KEYFRAME_CACHE_KEY = 'hh_cinema_keyframes_v1';

export const PORTAL_CINEMA_PRESETS: Record<string, PortalCinemaPreset> = {
  // COMMERCE
  d2c: {
    portalId: 'd2c',
    renderMode: 'vault-drop',
    hudTag: 'D2C VAULT // RIM SPOTLIGHT',
    lensSpec: '50MM T1.4 ANAMORPHIC',
    fpsSpec: '60FPS -> 24FPS RAMP',
    shotDirective: 'Warm specular pedestal sweep across limited-run leather and heavyweight drops.',
    primaryHex: '#e11d48',
    secondaryHex: '#f59e0b',
    stillUrl: d2cVaultImg,
  },
  arutemika: {
    portalId: 'arutemika',
    renderMode: 'high-fashion',
    hudTag: 'ARUTEMIKA // EDITORIAL 85MM',
    lensSpec: '85MM LEICA SUMMILUX',
    fpsSpec: '48FPS DOLLY GLIDE',
    shotDirective: 'Chiaroscuro rim-lit couture portrait, sculpted waist and hip-line tailoring in silk drape.',
    primaryHex: '#f59e0b',
    secondaryHex: '#e11d48',
    stillUrl: arutemikaEditorialImg,
  },

  // CONTENT
  articles: {
    portalId: 'articles',
    renderMode: 'editorial-desk',
    hudTag: 'LIVE SET // EDITORIAL ARCHIVE',
    lensSpec: '65MM MEDIUM FORMAT',
    fpsSpec: '24FPS FILM GATE',
    shotDirective: 'Hasselblad contact sheet light-table sweep with crisp optical focus pulls.',
    primaryHex: '#f59e0b',
    secondaryHex: '#e11d48',
    stillUrl: rawxEditorialImg,
  },
  studio: {
    portalId: 'studio',
    renderMode: 'bts-rig',
    hudTag: 'LIVE SET // 24FPS BTS RIG',
    lensSpec: '50MM ANAMORPHIC • ALEXA LF',
    fpsSpec: '120FPS -> 24FPS RAMP',
    shotDirective: 'Behind-the-scenes cinema dolly rig sweep through volumetric key-light studio haze.',
    primaryHex: '#e11d48',
    secondaryHex: '#f59e0b',
    stillUrl: handFilmPoster,
  },
  aural: {
    portalId: 'aural',
    renderMode: 'aural-scope',
    hudTag: 'LIVE SET // 96KHZ AURAL',
    lensSpec: 'STEREO PHASE OSCILLOSCOPE',
    fpsSpec: '60FPS REALTIME DSP',
    shotDirective: 'Dual-harmonic acoustic waveform modulation and spatial studio reverb metering.',
    primaryHex: '#10b981',
    secondaryHex: '#f59e0b',
    stillUrl: socialTrendsImg,
  },

  // MANUFACTURING (7 VERTICALS)
  textile: {
    portalId: 'textile',
    renderMode: 'fiber-loom-macro',
    hudTag: 'LOOM MACRO // 300 GSM',
    lensSpec: '100MM MACRO • F/2.8',
    fpsSpec: '120FPS FIBER RAMP',
    shotDirective: 'Interlaced warp and weft cotton yarn tension with backlit golden lint motes.',
    primaryHex: '#f59e0b',
    secondaryHex: '#94a3b8',
    stillUrl: textileLoomMacroImg,
  },
  rmg: {
    portalId: 'rmg',
    renderMode: 'garment-editorial',
    hudTag: 'RMG STUDIO // TAILORED FIT',
    lensSpec: '85MM ANAMORPHIC PRIME',
    fpsSpec: '60FPS DOLLY RAMP',
    shotDirective: 'Heavyweight 300 GSM garment silhouette with poised curve drape under rim light.',
    primaryHex: '#e11d48',
    secondaryHex: '#f59e0b',
    stillUrl: arutemikaEditorialImg,
  },
  leather: {
    portalId: 'leather',
    renderMode: 'steel-leather-macro',
    hudTag: '100MM MACRO // FULL-GRAIN HIDE',
    lensSpec: '100MM LAOWA PROBE MACRO',
    fpsSpec: '120FPS -> 24FPS WHIP',
    shotDirective: 'Vegetable-tanned buffalo hide saddle stitching with warm edge-burnishing sparks.',
    primaryHex: '#f59e0b',
    secondaryHex: '#e11d48',
    stillUrl: rawxSteelMacroImg,
  },
  jacket: {
    portalId: 'jacket',
    renderMode: 'garment-editorial',
    hudTag: 'OUTERWEAR // STUDIO RIM',
    lensSpec: '75MM ANAMORPHIC T2',
    fpsSpec: '48FPS SLOW DOLLY',
    shotDirective: 'Architectural distressed leather jacket collar and structured shoulder contour.',
    primaryHex: '#f59e0b',
    secondaryHex: '#e11d48',
    stillUrl: b2bLeatherImg,
  },
  jute: {
    portalId: 'jute',
    renderMode: 'fiber-loom-macro',
    hudTag: 'GOLDEN JUTE // LOOM RAMP',
    lensSpec: '90MM MACRO TELEPHOTO',
    fpsSpec: '120FPS DUST MOTES',
    shotDirective: 'Golden Bangladesh natural jute weave tension illuminated by low-angle studio sun.',
    primaryHex: '#f59e0b',
    secondaryHex: '#d97706',
    stillUrl: textileLoomMacroImg,
  },
  lingerie: {
    portalId: 'lingerie',
    renderMode: 'garment-editorial',
    hudTag: 'INTIMATES // SATIN EDITORIAL',
    lensSpec: '85MM BEAUTY SOFT-KEY',
    fpsSpec: '60FPS SILK MOTION',
    shotDirective: 'Sculptural curve contours, fine satin-lace macro weave, and soft chiaroscuro rim light.',
    primaryHex: '#e11d48',
    secondaryHex: '#f59e0b',
    stillUrl: arutemikaEditorialImg,
  },
  bracelets: {
    portalId: 'bracelets',
    renderMode: 'steel-leather-macro',
    hudTag: '316L MACRO // CLASP SNAP',
    lensSpec: '100MM MACRO • 316L/516SS',
    fpsSpec: '120FPS -> 24FPS IMPACT',
    shotDirective: 'Brushed 316L stainless steel clasp locking onto hand-stitched full-grain leather hide.',
    primaryHex: '#f59e0b',
    secondaryHex: '#e11d48',
    stillUrl: rawxSteelMacroImg,
  },

  // LIFESTYLE
  bloom: {
    portalId: 'bloom',
    renderMode: 'botanical-beauty',
    hudTag: 'BLOOM // GOLDEN-HOUR BEAUTY',
    lensSpec: '50MM T1.2 DREAM BOKEH',
    fpsSpec: '48FPS PETAL DRIFT',
    shotDirective: 'Warm golden-hour botanical portrait framing with soft translucent floral motion.',
    primaryHex: '#f59e0b',
    secondaryHex: '#10b981',
    stillUrl: arutemikaEditorialImg,
  },
  gym: {
    portalId: 'gym',
    renderMode: 'athletic-ramp',
    hudTag: 'GYM // 120FPS KINETIC RAMP',
    lensSpec: '35MM SHUTTER 90°',
    fpsSpec: '120FPS -> 24FPS BURST',
    shotDirective: 'High-contrast crimson rim athletic silhouette with rapid kinetic speed-ramp trails.',
    primaryHex: '#e11d48',
    secondaryHex: '#f59e0b',
    stillUrl: adCampaignsImg,
  },

  // FOOD
  agro: {
    portalId: 'agro',
    renderMode: 'culinary-macro',
    hudTag: 'AGRO // HARVEST MACRO',
    lensSpec: '100MM MACRO GOLDEN HOUR',
    fpsSpec: '96FPS DEW MOTION',
    shotDirective: 'Traceable organic harvest rows bathed in golden specular sunlight and mist.',
    primaryHex: '#f59e0b',
    secondaryHex: '#10b981',
    stillUrl: culinaryMacroImg,
  },
  food: {
    portalId: 'food',
    renderMode: 'culinary-macro',
    hudTag: 'CULINARY // SIZZLE MACRO',
    lensSpec: '85MM MACRO T2.0',
    fpsSpec: '120FPS STEAM RAMP',
    shotDirective: 'Sizzling golden specular highlights, aromatic rising steam plumes, hyper-shallow DOF.',
    primaryHex: '#f59e0b',
    secondaryHex: '#e11d48',
    stillUrl: culinaryMacroImg,
  },

  // APPS
  bloomapp: {
    portalId: 'bloomapp',
    renderMode: 'neural-ui',
    hudTag: 'BLOOM APP // LIVE DISPATCH',
    lensSpec: 'GLASS UI TELEMETRY',
    fpsSpec: '60FPS SPRING PHYSICS',
    shotDirective: 'Live floral order routing nodes with botanical emerald glassmorphic telemetry.',
    primaryHex: '#10b981',
    secondaryHex: '#f59e0b',
    stillUrl: brandAssetsImg,
  },
  apps: {
    portalId: 'apps',
    renderMode: 'neural-ui',
    hudTag: 'APPS CORE // GAPCUT & AI',
    lensSpec: 'NODE GRAPH ENGINE',
    fpsSpec: '60FPS WEBGL MESH',
    shotDirective: 'Live multi-screen workflow linking GapCut, GapShot, BumBit, and GapToon engines.',
    primaryHex: '#e11d48',
    secondaryHex: '#f59e0b',
    stillUrl: studioProjectsImg,
  },
  note: {
    portalId: 'note',
    renderMode: 'neural-ui',
    hudTag: 'NOTE // ENCRYPTED GRAPH',
    lensSpec: 'LOCAL-FIRST SYNC',
    fpsSpec: '60FPS KEYSTROKE',
    shotDirective: 'Encrypted markdown blocks streaming across zero-latency workspace vaults.',
    primaryHex: '#f59e0b',
    secondaryHex: '#94a3b8',
    stillUrl: tutorialsImg,
  },
  picseed: {
    portalId: 'picseed',
    renderMode: 'neural-ui',
    hudTag: 'PICSEED // HOLOGRAPHIC LENS',
    lensSpec: 'OPTICAL CHROMA BLUR',
    fpsSpec: '60FPS SHADER PASS',
    shotDirective: 'Holographic aperture transitions and automated CDN visual frame indexing.',
    primaryHex: '#e11d48',
    secondaryHex: '#f59e0b',
    stillUrl: brandAssetsImg,
  },
  hub: {
    portalId: 'hub',
    renderMode: 'neural-ui',
    hudTag: 'HUB // CONTROL SPINE',
    lensSpec: '24-NODE ROUTER',
    fpsSpec: '60FPS TELEMETRY',
    shotDirective: 'Central packet pulse synchronizing all 24 HANDS & HEAD enterprise divisions.',
    primaryHex: '#10b981',
    secondaryHex: '#f59e0b',
    stillUrl: studioProjectsImg,
  },
  deeper: {
    portalId: 'deeper',
    renderMode: 'neural-ui',
    hudTag: 'DEEPER // NEURAL WAVE',
    lensSpec: 'R&D TENSOR FIELD',
    fpsSpec: '60FPS WAVE SHADER',
    shotDirective: 'Experimental frontier neural grid wave synthesis and deep knowledge indexing.',
    primaryHex: '#e11d48',
    secondaryHex: '#f59e0b',
    stillUrl: studioProjectsImg,
  },
  hiya: {
    portalId: 'hiya',
    renderMode: 'neural-ui',
    hudTag: 'HIYA // PEER SIGNAL MESH',
    lensSpec: 'SUB-12MS DISPATCH',
    fpsSpec: '60FPS PULSE WAVE',
    shotDirective: 'Low-latency signal arcs linking creative teams and Dhaka production units.',
    primaryHex: '#f59e0b',
    secondaryHex: '#e11d48',
    stillUrl: socialTrendsImg,
  },
  me: {
    portalId: 'me',
    renderMode: 'neural-ui',
    hudTag: 'ME // FOUNDER ENCLAVE',
    lensSpec: 'SSO IDENTITY CORE',
    fpsSpec: '60FPS KEY RING',
    shotDirective: 'Rakib Himon founder profile enclave with encrypted single sign-on telemetry.',
    primaryHex: '#f59e0b',
    secondaryHex: '#e11d48',
    stillUrl: rawxEditorialImg,
  },
};

export function getPortalCinemaPreset(portalId: string): PortalCinemaPreset {
  const key = portalId.toLowerCase();
  return (
    PORTAL_CINEMA_PRESETS[key] ?? {
      portalId: key,
      renderMode: 'bts-rig',
      hudTag: 'LIVE SET // 24FPS',
      lensSpec: '50MM ANAMORPHIC',
      fpsSpec: '24FPS CINEMA',
      shotDirective: 'Dynamic cinema viewport calibrated to HANDS & HEAD Master OS.',
      primaryHex: '#e11d48',
      secondaryHex: '#f59e0b',
      stillUrl: handFilmPoster,
    }
  );
}

export function loadCachedKeyframes(): Record<string, HydratedKeyframeDirective> {
  try {
    const raw = safeStorage.getItem(KEYFRAME_CACHE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, HydratedKeyframeDirective>;
    }
  } catch {
    // ignore corrupted cache
  }
  return {};
}

export function saveCachedKeyframe(directive: HydratedKeyframeDirective): void {
  const existing = loadCachedKeyframes();
  existing[directive.portalId] = directive;
  safeStorage.setItem(KEYFRAME_CACHE_KEY, JSON.stringify(existing));
}

export function hasClientGeminiEnvHint(): boolean {
  const envRecord = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
  return Boolean(envRecord?.VITE_GEMINI_API_KEY && envRecord.VITE_GEMINI_API_KEY.trim().length > 0);
}

let cachedServerAvailability: boolean | null = null;

export async function checkGeminiHydrationAvailable(): Promise<boolean> {
  if (cachedServerAvailability !== null) {
    return cachedServerAvailability || hasClientGeminiEnvHint();
  }
  try {
    const response = await fetch('/api/cinema/status', { method: 'GET' });
    if (response.ok) {
      const data = (await response.json()) as { available?: boolean };
      cachedServerAvailability = Boolean(data.available);
      return cachedServerAvailability || hasClientGeminiEnvHint();
    }
  } catch {
    // offline or static host fallback
  }
  cachedServerAvailability = false;
  return hasClientGeminiEnvHint();
}

export async function hydratePortalKeyframe(
  portalId: string,
  categoryLabel: string,
  portalTitle: string
): Promise<HydratedKeyframeDirective | null> {
  const existing = loadCachedKeyframes()[portalId];
  if (existing) {
    return existing;
  }

  const preset = getPortalCinemaPreset(portalId);

  try {
    const response = await fetch('/api/cinema/hydrate-keyframe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        portalId,
        categoryLabel,
        portalTitle,
        shotStyle: preset.renderMode,
        baseDirective: preset.shotDirective,
      }),
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as {
      hydrated?: boolean;
      directive?: {
        hudTag?: string;
        lensSpec?: string;
        shotDirective?: string;
        primaryHex?: string;
        secondaryHex?: string;
      };
    };

    if (!payload.hydrated || !payload.directive) {
      return null;
    }

    const hydrated: HydratedKeyframeDirective = {
      portalId,
      hudTag: payload.directive.hudTag || preset.hudTag,
      lensSpec: payload.directive.lensSpec || preset.lensSpec,
      shotDirective: payload.directive.shotDirective || preset.shotDirective,
      primaryHex: payload.directive.primaryHex || preset.primaryHex,
      secondaryHex: payload.directive.secondaryHex || preset.secondaryHex,
      hydratedAt: Date.now(),
      source: 'gemini',
    };

    saveCachedKeyframe(hydrated);
    return hydrated;
  } catch {
    return null;
  }
}

export const HERO_BACKDROP_ASSETS = {
  handfilm: handFilmPoster,
  rawx: rawxSteelMacroImg,
  arutemika: arutemikaEditorialImg,
  b2b: textileLoomMacroImg,
  apps: studioProjectsImg,
  leather: b2bLeatherImg,
  d2c: d2cVaultImg,
};
// END OF FILE: src/services/cinemaKeyframeService.ts
