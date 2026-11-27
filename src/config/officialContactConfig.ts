import { DEFAULT_RAWX_DROPS } from '../data/rawxDrops';

export const OFFICIAL_PUBLIC_EMAIL = 'sales@handsandhead.com' as const;
export const OFFICIAL_ADMIN_EMAIL = 'himon@handsandhead.com' as const;
export const OFFICIAL_WHATSAPP_DISPLAY = '+8801974518600' as const;
export const OFFICIAL_WHATSAPP_DIGITS = '8801974518600' as const;
export const OFFICIAL_WHATSAPP_BASE_URL = `https://wa.me/${OFFICIAL_WHATSAPP_DIGITS}` as const;

export const OFFICIAL_SITE_ORIGIN = 'https://handsandhead.com' as const;
export const OFFICIAL_API_ORIGIN = 'https://api.handsandhead.com' as const;
export const OFFICIAL_SEO_FEED_URL = `${OFFICIAL_API_ORIGIN}/api/seo/feed` as const;
export const OFFICIAL_LLMS_TXT_URL = `${OFFICIAL_API_ORIGIN}/llms.txt` as const;
export const OFFICIAL_SITEMAP_VIDEO_URL = `${OFFICIAL_API_ORIGIN}/sitemap-video.xml` as const;

export const OFFICIAL_MAILTO_SALES = `mailto:${OFFICIAL_PUBLIC_EMAIL}` as const;
export const OFFICIAL_MAILTO_ADMIN = `mailto:${OFFICIAL_ADMIN_EMAIL}` as const;

export type OfficialContactModuleKey =
  | 'rawx'
  | 'gaptoon'
  | 'gapcut'
  | 'gapshot'
  | 'bumbit'
  | 'deliver'
  | 'b2b'
  | 'general';

export interface OfficialModulePreset {
  readonly key: OfficialContactModuleKey;
  readonly label: string;
  readonly brand: string;
  readonly defaultMessage: string;
}

export const OFFICIAL_MODULE_WHATSAPP_PRESETS: Readonly<
  Record<OfficialContactModuleKey, OfficialModulePreset>
> = {
  rawx: {
    key: 'rawx',
    label: 'RAWx Order',
    brand: 'RAWx',
    defaultMessage:
      'Hello HANDS & HEAD — [RAWx Order] Inquiry for Hide, 316L Steel & Heavyweight Apparel via handsandhead.com',
  },
  gaptoon: {
    key: 'gaptoon',
    label: 'GapToon Pro',
    brand: 'GapToon',
    defaultMessage:
      'Hello HANDS & HEAD — [GapToon Pro] Stylized Render Studio & Pro Licensing Inquiry via handsandhead.com',
  },
  gapcut: {
    key: 'gapcut',
    label: 'GapCut Studio',
    brand: 'GapCut',
    defaultMessage:
      'Hello HANDS & HEAD — [GapCut Studio] HANDFILM & NLE Speed-Cut Production Inquiry via handsandhead.com',
  },
  gapshot: {
    key: 'gapshot',
    label: 'GapShot Studio',
    brand: 'GapShot',
    defaultMessage:
      'Hello HANDS & HEAD — [GapShot Studio] Visual Frame-Seed & Cinema Pipeline Inquiry via handsandhead.com',
  },
  bumbit: {
    key: 'bumbit',
    label: 'BumBit Audio',
    brand: 'BumBit',
    defaultMessage:
      'Hello HANDS & HEAD — [BumBit Audio] Beat-Sync DSP & Spatial Mastering Inquiry via handsandhead.com',
  },
  deliver: {
    key: 'deliver',
    label: 'Deliver Dispatch',
    brand: 'Deliver',
    defaultMessage:
      'Hello HANDS & HEAD — [Deliver Dispatch] Fulfillment, Courier & Export Logistics Inquiry via handsandhead.com',
  },
  b2b: {
    key: 'b2b',
    label: 'B2B Export',
    brand: 'HANDS & HEAD B2B',
    defaultMessage:
      'Hello HANDS & HEAD — [B2B Export] Direct-from-Source Dhaka Manufacturing & Hardware RFQ via handsandhead.com',
  },
  general: {
    key: 'general',
    label: 'General Support',
    brand: 'HANDS & HEAD',
    defaultMessage:
      'Hello HANDS & HEAD — [General Support] Enterprise & Ecosystem Inquiry via handsandhead.com',
  },
} as const;

export interface OfficialBrandDescriptor {
  readonly id: string;
  readonly name: string;
  readonly url: string;
  readonly category: string;
  readonly description: string;
  readonly contactModule: OfficialContactModuleKey;
}

export const OFFICIAL_ECOSYSTEM_BRANDS: readonly OfficialBrandDescriptor[] = [
  {
    id: 'rawx',
    name: 'RAWx',
    url: 'https://rawx.handsandhead.com/',
    category: 'Apparel, Hide & 316L/516SS Hardware',
    description:
      'Full-grain distressed leather, surgical-grade 316L/516SS stainless steel hardware, 320 GSM heavyweight streetwear, and 19-drop lookbook engine.',
    contactModule: 'rawx',
  },
  {
    id: 'handfilm',
    name: 'HANDFILM',
    url: 'https://storyboard.handsandhead.com/',
    category: 'WebGL2 AI Video & Storyboard Studio',
    description:
      'Browser-native WebGL2 GPU shader cinema platform, non-linear editor (NLE), and Cloudflare edge video studio.',
    contactModule: 'gapcut',
  },
  {
    id: 'gapcut',
    name: 'GapCut',
    url: 'https://storyboard.handsandhead.com/?mode=capcut',
    category: 'Video Editing & NLE Speed-Cut Engine',
    description:
      'Rapid magnetic timeline, transient beat-sync, and Smart-Eye auto-cut video production engine by HANDS & HEAD.',
    contactModule: 'gapcut',
  },
  {
    id: 'gapshot',
    name: 'GapShot',
    url: 'https://picseed.handsandhead.com/',
    category: 'Visual Frame-Seed & Storyboard Imaging',
    description:
      'High-velocity frame curation, cinema reference capture, and visual shot-design pipeline by HANDS & HEAD.',
    contactModule: 'gapshot',
  },
  {
    id: 'bumbit',
    name: 'BumBit',
    url: 'https://aural.handsandhead.com/',
    category: 'Audio DSP & Beat-Sync Mastering',
    description:
      'Procedural sound design, transient beat-sync audio engine, and -14 LUFS mastering suite by HANDS & HEAD.',
    contactModule: 'bumbit',
  },
  {
    id: 'gaptoon',
    name: 'GapToon',
    url: 'https://apps.handsandhead.com/',
    category: 'Stylized Animation & Visual Render Suite',
    description:
      'Stylized motion rendering, illustrated cinema frames, and creator animation tooling by HANDS & HEAD.',
    contactModule: 'gaptoon',
  },
  {
    id: 'deliver',
    name: 'Deliver',
    url: 'https://b2b.handsandhead.com/',
    category: 'Direct-from-Source Fulfillment & Export Logistics',
    description:
      'Unified Dhaka JIT dispatch, D2C parcel fulfillment, and B2B export logistics coordination by HANDS & HEAD.',
    contactModule: 'deliver',
  },
  {
    id: 'arutemika',
    name: 'Arutemika',
    url: 'https://arutemika.handsandhead.com/',
    category: 'High-Fashion Editorial & B2B Wholesale',
    description:
      'Corporate wholesale procurement, bespoke leather craft, and direct-from-source Dhaka apparel manufacturing.',
    contactModule: 'b2b',
  },
] as const;

export const OFFICIAL_CONTACT_CONFIG = {
  brandName: 'HANDS & HEAD',
  legalName: 'HANDS & HEAD Enterprise Collective',
  slogan: 'One Core, Many Worlds.',
  founderName: 'Rakib Himon',
  founderFullName: 'Shaikh Rakibuzzaman Himon',
  headquarters: 'Dhaka, Bangladesh',
  siteOrigin: OFFICIAL_SITE_ORIGIN,
  apiOrigin: OFFICIAL_API_ORIGIN,
  seoFeedUrl: OFFICIAL_SEO_FEED_URL,
  llmsTxtUrl: OFFICIAL_LLMS_TXT_URL,
  sitemapVideoUrl: OFFICIAL_SITEMAP_VIDEO_URL,
  publicEmail: OFFICIAL_PUBLIC_EMAIL,
  adminEmail: OFFICIAL_ADMIN_EMAIL,
  whatsappDisplay: OFFICIAL_WHATSAPP_DISPLAY,
  whatsappDigits: OFFICIAL_WHATSAPP_DIGITS,
  whatsappBaseUrl: OFFICIAL_WHATSAPP_BASE_URL,
  mailtoSales: OFFICIAL_MAILTO_SALES,
  mailtoAdmin: OFFICIAL_MAILTO_ADMIN,
  modules: OFFICIAL_MODULE_WHATSAPP_PRESETS,
  brands: OFFICIAL_ECOSYSTEM_BRANDS,
} as const;

/**
 * Builds the official universal WhatsApp URL (`https://wa.me/8801974518600?text=...`)
 * with context-aware pre-filled message parameters for any HANDS & HEAD module.
 */
export function buildOfficialWhatsAppUrl(
  moduleKey: OfficialContactModuleKey = 'general',
  customDetail?: string
): string {
  const preset = OFFICIAL_MODULE_WHATSAPP_PRESETS[moduleKey] ?? OFFICIAL_MODULE_WHATSAPP_PRESETS.general;
  const trimmedDetail = customDetail ? customDetail.trim() : '';
  const payload = trimmedDetail
    ? `[${preset.label}] ${trimmedDetail}`
    : preset.defaultMessage;
  return `${OFFICIAL_WHATSAPP_BASE_URL}?text=${encodeURIComponent(payload)}`;
}

/**
 * Builds an official mailto URL targeting either public sales or executive admin.
 */
export function buildOfficialMailtoUrl(
  options: {
    subject?: string;
    body?: string;
    executive?: boolean;
  } = {}
): string {
  const recipient = options.executive ? OFFICIAL_ADMIN_EMAIL : OFFICIAL_PUBLIC_EMAIL;
  const params = new URLSearchParams();
  if (options.subject && options.subject.trim()) {
    params.set('subject', options.subject.trim());
  }
  if (options.body && options.body.trim()) {
    params.set('body', options.body.trim());
  }
  const query = params.toString();
  return query ? `mailto:${recipient}?${query}` : `mailto:${recipient}`;
}

export type JsonLdNode = Record<string, unknown>;

/**
 * Canonical Schema.org Organization node wired with official contact points
 * and all core HANDS & HEAD modules (RAWx, GapCut, GapShot, BumBit, GapToon, Deliver).
 */
export function buildOfficialOrganizationSchema(): JsonLdNode {
  return {
    '@type': 'Organization',
    '@id': `${OFFICIAL_SITE_ORIGIN}/#organization`,
    name: 'HANDS & HEAD',
    alternateName: ['Hands & Head', 'H&H', 'HANDS & HEAD Master OS'],
    legalName: 'HANDS & HEAD Enterprise Collective',
    url: `${OFFICIAL_SITE_ORIGIN}/`,
    slogan: 'One Core, Many Worlds.',
    email: OFFICIAL_PUBLIC_EMAIL,
    telephone: OFFICIAL_WHATSAPP_DISPLAY,
    logo: {
      '@type': 'ImageObject',
      url: `${OFFICIAL_SITE_ORIGIN}/favicon.svg`,
    },
    image: `${OFFICIAL_SITE_ORIGIN}/og-image.jpg`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Dhaka',
      addressCountry: 'BD',
    },
    founder: {
      '@type': 'Person',
      '@id': `${OFFICIAL_SITE_ORIGIN}/#founder`,
      name: 'Rakib Himon',
      alternateName: 'Shaikh Rakibuzzaman Himon',
      email: OFFICIAL_ADMIN_EMAIL,
      url: 'https://rakib.handsandhead.com/',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: OFFICIAL_PUBLIC_EMAIL,
        telephone: OFFICIAL_WHATSAPP_DISPLAY,
        url: buildOfficialWhatsAppUrl('general'),
        availableLanguage: ['English', 'Bengali'],
        areaServed: 'Worldwide',
      },
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: OFFICIAL_PUBLIC_EMAIL,
        telephone: OFFICIAL_WHATSAPP_DISPLAY,
        url: buildOfficialWhatsAppUrl('rawx'),
        availableLanguage: ['English', 'Bengali'],
        areaServed: 'Worldwide',
      },
      {
        '@type': 'ContactPoint',
        contactType: 'executive',
        name: 'Rakib Himon — Executive & Admin Desk',
        email: OFFICIAL_ADMIN_EMAIL,
        telephone: OFFICIAL_WHATSAPP_DISPLAY,
        url: buildOfficialWhatsAppUrl('b2b'),
        availableLanguage: ['English', 'Bengali'],
        areaServed: 'Worldwide',
      },
    ],
    owns: OFFICIAL_ECOSYSTEM_BRANDS.map((brand) => ({
      '@type': 'Brand',
      '@id': `${OFFICIAL_SITE_ORIGIN}/#brand-${brand.id}`,
      name: brand.name,
      url: brand.url,
      description: brand.description,
    })),
    subOrganization: OFFICIAL_ECOSYSTEM_BRANDS.map((brand) => ({
      '@type': 'Organization',
      name: brand.name,
      url: brand.url,
      email: OFFICIAL_PUBLIC_EMAIL,
      telephone: OFFICIAL_WHATSAPP_DISPLAY,
      description: brand.description,
    })),
    sameAs: [
      'https://handsandhead.com/',
      'https://b2b.handsandhead.com/',
      'https://storyboard.handsandhead.com/',
      'https://d2c.handsandhead.com/',
      'https://arutemika.handsandhead.com/',
      'https://rawx.handsandhead.com/',
      'https://articles.handsandhead.com/',
      'https://rakib.handsandhead.com/',
      OFFICIAL_WHATSAPP_BASE_URL,
      'https://github.com/handsandhead',
      'https://instagram.com/handsandhead',
    ],
  };
}

function parseNumericPrice(priceDisplay: string): string {
  const cleaned = priceDisplay.replace(/[^0-9.]/g, '');
  return cleaned || '0';
}

/**
 * Static fallback JSON-LD showcase entities (`VideoObject` & `Product`)
 * used whenever `https://api.handsandhead.com/api/seo/feed` is unavailable or offline.
 */
export function buildFallbackSeoShowcaseNodes(): readonly JsonLdNode[] {
  const fallbackVideos: JsonLdNode[] = [
    {
      '@type': 'VideoObject',
      '@id': `${OFFICIAL_SITE_ORIGIN}/#video-handfilm-gapcut`,
      name: 'HANDFILM Studio & GapCut — WebGL2 Cinema Engine Reel',
      description:
        'Flagship behind-the-scenes cinema reel showcasing HANDFILM Studio, GapCut magnetic NLE, GapShot frame-seed workflows, BumBit beat-sync audio, and GapToon stylized rendering.',
      thumbnailUrl: `${OFFICIAL_SITE_ORIGIN}/og-image.jpg`,
      uploadDate: '2026-01-15T00:00:00Z',
      contentUrl: 'https://storyboard.handsandhead.com/',
      embedUrl: 'https://storyboard.handsandhead.com/',
      publisher: { '@id': `${OFFICIAL_SITE_ORIGIN}/#organization` },
    },
    {
      '@type': 'VideoObject',
      '@id': `${OFFICIAL_SITE_ORIGIN}/#video-rawx-hide-steel`,
      name: 'RAWx — Hide, 316L Steel & Heavyweight Apparel Macro Reel',
      description:
        'Ultra-macro speed-ramp lookbook showcasing RAWx full-grain vegetable-tanned leather, 316L/516SS surgical stainless steel clasps, and 320 GSM Dhaka combed cotton capsules.',
      thumbnailUrl: `${OFFICIAL_SITE_ORIGIN}/og-image.jpg`,
      uploadDate: '2026-01-20T00:00:00Z',
      contentUrl: 'https://rawx.handsandhead.com/',
      embedUrl: `${OFFICIAL_SITE_ORIGIN}/#rawx`,
      publisher: { '@id': `${OFFICIAL_SITE_ORIGIN}/#organization` },
    },
    {
      '@type': 'VideoObject',
      '@id': `${OFFICIAL_SITE_ORIGIN}/#video-arutemika-b2b`,
      name: 'Arutemika & HANDS & HEAD B2B — 7 Industrial Manufacturing Wings',
      description:
        'Direct-from-source Dhaka export reel across Textile, RMG (120 pcs/style MOQ), Leather, Jacket, Jute, Lingerie, Bracelets, and Deliver fulfillment logistics.',
      thumbnailUrl: `${OFFICIAL_SITE_ORIGIN}/og-image.jpg`,
      uploadDate: '2026-02-01T00:00:00Z',
      contentUrl: 'https://b2b.handsandhead.com/',
      embedUrl: 'https://arutemika.handsandhead.com/',
      publisher: { '@id': `${OFFICIAL_SITE_ORIGIN}/#organization` },
    },
  ];

  const featuredDrops = Object.values(DEFAULT_RAWX_DROPS).slice(0, 6);
  const fallbackProducts: JsonLdNode[] = featuredDrops.map((drop) => ({
    '@type': 'Product',
    '@id': `${OFFICIAL_SITE_ORIGIN}/#rawx-product-${drop.dropId}`,
    sku: `RAWX-${drop.dropId.toUpperCase()}`,
    name: `RAWx ${drop.title}`,
    category: drop.collection,
    material: drop.materialSpec,
    description: drop.storyCaption,
    image: `${OFFICIAL_SITE_ORIGIN}/og-image.jpg`,
    brand: {
      '@type': 'Brand',
      name: 'RAWx',
      url: 'https://rawx.handsandhead.com/',
    },
    manufacturer: {
      '@id': `${OFFICIAL_SITE_ORIGIN}/#organization`,
    },
    offers: {
      '@type': 'Offer',
      url: `${OFFICIAL_SITE_ORIGIN}/#rawx-${drop.dropId}`,
      priceCurrency: 'USD',
      price: parseNumericPrice(drop.priceDisplay),
      availability: 'https://schema.org/PreOrder',
      seller: {
        '@id': `${OFFICIAL_SITE_ORIGIN}/#organization`,
      },
    },
  }));

  return [...fallbackVideos, ...fallbackProducts];
}
// END OF FILE: src/config/officialContactConfig.ts
