import { useEffect } from 'react';
import { ActiveTab, SectionItem } from '../types';

const SITE_ORIGIN = 'https://handsandhead.com';
const BRAND_NAME = 'HANDS & HEAD';

interface SeoConfig {
  title: string;
  description: string;
  canonical: string;
  themeColor: string;
}

interface SectionSeoOverride {
  title: string;
  description: string;
  themeColor?: string;
}

const SECTION_SEO_OVERRIDES: Record<string, SectionSeoOverride> = {
  d2c: {
    title: 'D2C Shop — Small-Batch Leather, 240–300 GSM Streetwear & 316L Hardware | HANDS & HEAD',
    description:
      'Direct-to-consumer vault by HANDS & HEAD. Small-batch genuine distressed leather goods, 240–300 GSM combed cotton heavyweight streetwear, and 316L/516SS stainless steel hardware drops.',
    themeColor: '#b14a26',
  },
  arutemika: {
    title: 'Arutemika — Direct-from-Source Dhaka Wholesale & Craft | HANDS & HEAD',
    description:
      'Arutemika by HANDS & HEAD — corporate, wholesale, and direct-from-source Dhaka apparel and leather production starting at 120 pcs/style MOQ.',
    themeColor: '#8a5a3a',
  },
  articles: {
    title: 'Articles & Editorial Journal — WebGL2 Systems & Dhaka Manufacturing | HANDS & HEAD',
    description:
      'Long-form technical essays, Dhaka manufacturing field notes, and WebGL2 engineering dispatches from Rakib Himon and the HANDS & HEAD collective.',
    themeColor: '#c79a3d',
  },
  studio: {
    title: 'HandFilm Studio & Storyboard — WebGL2 GPU Shaders AI Video Editor | HANDS & HEAD',
    description:
      'Browser-native WebGL2 GPU shader AI video editor, non-linear editor (NLE), cinema player, and Cloudflare Workers edge video host built by HANDS & HEAD.',
    themeColor: '#a97f3f',
  },
  aural: {
    title: 'Aural — Spatial Audio & Sonic Architecture | HANDS & HEAD',
    description:
      'Aural by HANDS & HEAD — browser-native ambient soundscapes, Web Audio engineering tools, and spatial acoustic design modules.',
    themeColor: '#0A0B0D',
  },
  textile: {
    title: 'Textile Sourcing — 240–300 GSM Combed Cotton & Mills | HANDS & HEAD B2B',
    description:
      'Direct-from-source Bangladesh textile sourcing: 240–300 GSM combed cotton, heavyweight French terry, custom knitted fleece, and technical fabrics starting at 120 pcs/style MOQ.',
    themeColor: '#0A0B0D',
  },
  rmg: {
    title: 'RMG & Heavyweight Streetwear Factory (120 pcs/style MOQ) | HANDS & HEAD B2B',
    description:
      'Direct-from-source Dhaka RMG manufacturing wing: 120 pcs/style MOQ, 240–300 GSM combed cotton heavyweight streetwear, hoodies, cut-and-sew essentials, and garment dyeing.',
    themeColor: '#0A0B0D',
  },
  leather: {
    title: 'Genuine Distressed Leather Manufacturing — Dhaka Tannery Wing | HANDS & HEAD B2B',
    description:
      'Audited Dhaka tannery sourcing and genuine distressed full-grain leather craftsmanship — jackets, bags, belts, and small leather goods with low MOQs.',
    themeColor: '#5c3a21',
  },
  jacket: {
    title: 'Custom Leather & Outerwear Jackets — Dhaka Factory Wing | HANDS & HEAD',
    description:
      'Bespoke distressed leather jackets, heavyweight bombers, waxed canvas workwear, and structured outerwear manufactured direct-from-source in Dhaka by HANDS & HEAD.',
    themeColor: '#3b2416',
  },
  jute: {
    title: 'Sustainable Jute & Natural Fiber Manufacturing — Bangladesh B2B | HANDS & HEAD',
    description:
      'Export-grade Bangladesh golden jute textiles, zero-carbon eco-packaging, and structural natural fiber goods manufactured direct-from-source by HANDS & HEAD.',
    themeColor: '#4a3d24',
  },
  lingerie: {
    title: 'Intimates & Lingerie Manufacturing — Dhaka Precision B2B | HANDS & HEAD',
    description:
      'Specialized intimates, technical loungewear, and precision-stitched lingerie production lines in Dhaka with strict export QC and private-label support.',
    themeColor: '#2d1822',
  },
  bracelets: {
    title: 'RAWx 316L & 516SS Stainless Steel Hardware & Bracelets | HANDS & HEAD',
    description:
      'RAWx hardware wing by HANDS & HEAD — surgical-grade 316L and 516SS stainless steel bracelets, custom clasps, and industrial metal accessories.',
    themeColor: '#1f2329',
  },
  bloom: {
    title: 'BLOOM — Botanical & Lifestyle World | HANDS & HEAD',
    description:
      'BLOOM by HANDS & HEAD — curated botanical design, slow-living rituals, and tactile lifestyle systems.',
    themeColor: '#18241d',
  },
  gym: {
    title: 'GYM — Strength, Conditioning & Athletic Systems | HANDS & HEAD',
    description:
      'GYM by HANDS & HEAD — performance training frameworks, athletic apparel engineering, and physical conditioning discipline.',
    themeColor: '#1a1414',
  },
  agro: {
    title: 'AGRO — Traceable Agricultural Systems | HANDS & HEAD',
    description:
      'AGRO by HANDS & HEAD — farm-to-system agricultural supply chain initiatives and sustainable crop ventures from Bangladesh.',
    themeColor: '#162116',
  },
  food: {
    title: 'FOOD — Culinary Craft & Provisioning | HANDS & HEAD',
    description:
      'FOOD by HANDS & HEAD — artisanal culinary concepts, direct-source provisions, and modern food brand incubation.',
    themeColor: '#211912',
  },
  bloomapp: {
    title: 'BLOOM App — Interactive Companion Application | HANDS & HEAD',
    description:
      'BLOOM App by HANDS & HEAD — lightweight web application for daily botanical tracking, mindful rituals, and lifestyle syncing.',
    themeColor: '#14211b',
  },
  apps: {
    title: 'Apps & Skyhara — Web Utilities & Micro-Software | HANDS & HEAD',
    description:
      'Directory of browser-native software, Skyhara utilities, and zero-bloat web applications engineered by HANDS & HEAD.',
    themeColor: '#0A0B0D',
  },
  note: {
    title: 'NOTE — Fast Distraction-Free Capture | HANDS & HEAD',
    description:
      'NOTE by HANDS & HEAD — instant local-first note-taking and structured thinking workspace designed for speed.',
    themeColor: '#0A0B0D',
  },
  picseed: {
    title: 'PICSEED — Visual Curation & Reference Engine | HANDS & HEAD',
    description:
      'PICSEED by HANDS & HEAD — high-velocity visual moodboard, frame curation, and image seed library for designers and filmmakers.',
    themeColor: '#0A0B0D',
  },
  hub: {
    title: 'HUB — Unified Operations & Portal Command | HANDS & HEAD',
    description:
      'HUB by HANDS & HEAD — central routing interface connecting commerce, manufacturing, media, and software modules.',
    themeColor: '#0A0B0D',
  },
  deeper: {
    title: 'DEEPER — Research & Deep-Dive Index | HANDS & HEAD',
    description:
      'DEEPER by HANDS & HEAD — archival research notes, systems exploration, and deep knowledge indexing.',
    themeColor: '#0A0B0D',
  },
  hiya: {
    title: 'HIYA — Creative & Cultural Project Space | HANDS & HEAD',
    description:
      'HIYA by HANDS & HEAD — dedicated creative expression, cultural storytelling, and visual archive portal.',
    themeColor: '#0A0B0D',
  },
  me: {
    title: 'Rakib Himon — Founder & Systems Architect | HANDS & HEAD',
    description:
      'Personal portal of Rakib Himon (Shaikh Rakibuzzaman Himon), Founder & Systems Architect of HANDS & HEAD, HandFilm Studio, RAWx, and Arutemika in Dhaka.',
    themeColor: '#0A0B0D',
  },
};

function upsertMeta(attrName: 'name' | 'property', key: string, content: string): void {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attrName}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, key);
    document.head.appendChild(el);
  }
  if (el.getAttribute('content') !== content) {
    el.setAttribute('content', content);
  }
}

function upsertCanonical(href: string): void {
  if (typeof document === 'undefined') return;
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  if (link.getAttribute('href') !== href) {
    link.setAttribute('href', href);
  }
}

interface SectionSummary {
  id: string;
  title: string;
  category: string;
  desc?: string;
  sub?: string;
  description?: string;
  subtitle?: string;
}

function buildSeoConfig(
  activeTab: ActiveTab,
  currentSection: SectionSummary | undefined,
  sectionsCount: number
): SeoConfig {
  if (activeTab === 'home') {
    return {
      title: `${BRAND_NAME} — One Core, Many Worlds. | WebGL2 Cinema, Dhaka B2B & ${sectionsCount}-Module OS`,
      description:
        'HANDS & HEAD ("One Core, Many Worlds.") founded by Rakib Himon in Dhaka. Home of HandFilm WebGL2 AI Video Studio, direct-from-source RMG/Leather/316L Hardware B2B wings, and a 24-module venture OS.',
      canonical: `${SITE_ORIGIN}/`,
      themeColor: '#0A0B0D',
    };
  }

  if (activeTab === 'handfilm') {
    return {
      title: `HandFilm Studio — AI-Powered Photo & Video Editor | ${BRAND_NAME}`,
      description:
        'HandFilm Studio by HANDS & HEAD — Launch Easy Mode, Beast Mode, CapCut Mode, or AD Studio straight into Storyboard WebGL2 AI Cinema Engine with zero latency.',
      canonical: `${SITE_ORIGIN}/#handfilm`,
      themeColor: '#09090b',
    };
  }

  if (activeTab === 'rawx-showcase') {
    return {
      title: `RAWx 16 Ultra Sliders — Interactive Web Architecture | ${BRAND_NAME}`,
      description:
        'Explore the RAWx 16 Ultra Sliders kinetic interface lab by HANDS & HEAD — high-velocity WebGL, typography, and motion systems engineered for instant responsiveness.',
      canonical: `${SITE_ORIGIN}/#sliders`,
      themeColor: '#050505',
    };
  }

  if (activeTab === 'tasks-hub') {
    return {
      title: `Multi-Device Task Sync Hub — Live Operations | ${BRAND_NAME}`,
      description:
        'Real-time encrypted multi-device task and sprint synchronization hub inside the HANDS & HEAD Master OS.',
      canonical: `${SITE_ORIGIN}/#tasks`,
      themeColor: '#0A0B0D',
    };
  }

  // activeTab === 'ecosystem' (APPS 24-module Stage Slider)
  if (currentSection) {
    const idKey = currentSection.id.toLowerCase();
    const override = SECTION_SEO_OVERRIDES[idKey];
    if (override) {
      return {
        title: override.title,
        description: override.description,
        canonical: `${SITE_ORIGIN}/#${currentSection.id}`,
        themeColor: override.themeColor || '#0A0B0D',
      };
    }

    const fallbackDesc =
      currentSection.description ||
      currentSection.desc ||
      currentSection.subtitle ||
      currentSection.sub ||
      `Explore ${currentSection.title} inside the ${sectionsCount}-module HANDS & HEAD ecosystem ("One Core, Many Worlds.").`;

    return {
      title: `${currentSection.title} — ${currentSection.category} Module | ${BRAND_NAME}`,
      description: fallbackDesc,
      canonical: `${SITE_ORIGIN}/#${currentSection.id}`,
      themeColor: '#0A0B0D',
    };
  }

  return {
    title: `24 Ecosystem Apps & Portals — Stage Engine | ${BRAND_NAME}`,
    description:
      'Navigate all 24 HANDS & HEAD portals across Commerce, Content, Manufacturing, Lifestyle, Food, and Apps inside the zero-latency Stage Slider OS.',
    canonical: `${SITE_ORIGIN}/#apps`,
    themeColor: '#0A0B0D',
  };
}

export interface UseSeoHeadParams {
  activeTab: ActiveTab;
  currentSection?: SectionItem;
  sectionsCount?: number;
}

export function useSeoHead({
  activeTab,
  currentSection,
  sectionsCount = 24,
}: UseSeoHeadParams): void {
  const sectionId = currentSection?.id;
  const sectionTitle = currentSection?.title;
  const sectionCategory = currentSection?.category;
  const sectionDesc = currentSection?.desc;
  const sectionSub = currentSection?.sub;
  const sectionDescription = currentSection?.description;
  const sectionSubtitle = currentSection?.subtitle;

  useEffect(() => {
    const config = buildSeoConfig(
      activeTab,
      sectionId
        ? {
            id: sectionId,
            title: sectionTitle || sectionId.toUpperCase(),
            category: sectionCategory || 'APPS',
            desc: sectionDesc,
            sub: sectionSub,
            description: sectionDescription,
            subtitle: sectionSubtitle,
          }
        : undefined,
      sectionsCount
    );

    if (document.title !== config.title) {
      document.title = config.title;
    }

    upsertCanonical(config.canonical);
    upsertMeta('name', 'title', config.title);
    upsertMeta('name', 'description', config.description);
    upsertMeta('name', 'theme-color', config.themeColor);

    upsertMeta('property', 'og:title', config.title);
    upsertMeta('property', 'og:description', config.description);
    upsertMeta('property', 'og:url', config.canonical);

    upsertMeta('name', 'twitter:title', config.title);
    upsertMeta('name', 'twitter:description', config.description);
    upsertMeta('name', 'twitter:url', config.canonical);
  }, [
    activeTab,
    sectionId,
    sectionTitle,
    sectionCategory,
    sectionDesc,
    sectionSub,
    sectionDescription,
    sectionSubtitle,
    sectionsCount,
  ]);
}
