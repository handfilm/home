import { AllSlidersData, DropMetadata, RawxCollectionCategory, RawxDropKey, SlideData } from '../types';
import { safeStorage } from '../utils/safeStorage';

export const RAWX_COLLECTION_FILTERS: readonly ('ALL' | RawxCollectionCategory)[] = [
  'ALL',
  'STREETWEAR & HEAVY TEES',
  'HIDE & 316L STEEL',
  'OUTERWEAR & FOOTWEAR',
  'EDITORIAL & LUT LAB',
] as const;

export const DEFAULT_RAWX_DROPS: Record<RawxDropKey, DropMetadata> = {
  s1: {
    sectionKey: 's1',
    dropId: 's01',
    domId: 'sec-01',
    dropCode: 'DROP 01',
    collection: 'STREETWEAR & HEAVY TEES',
    title: 'Sovereign 320 GSM Heavyweight Capsule',
    materialSpec: '320 GSM Combed Heavyweight Cotton',
    priceDisplay: '$95',
    preorderWindow: 'Made-to-Order · 7–10 Days',
    storyCaption:
      'Architecturally boxy drop-shoulder silhouette cut from compact-spun 320 GSM Dhaka combed cotton and enzyme-washed for dry handfeel.',
    banglaTagline: '৩২০ জিএসএম ভারী কটন ও স্ট্রিটওয়্যার ক্যাপসুল',
    sizingType: 'apparel',
    craftsmanshipSpecs: {
      materialGrade: '100% Ring-Spun Combed Cotton · Double-Mercerized',
      hardwareOrTrim: '316L Brushed Neck Tag Rivets & Heavy Rib Collar',
      weightOrGauge: '320 GSM Single Jersey · 440 GSM Ribbing',
      construction: 'Twin-needle coverstitch · Pre-shrunk reactive dye',
    },
    lutPreset: 'rawx-sovereign-noir',
  },
  s2a: {
    sectionKey: 's2a',
    dropId: 's02',
    domId: 'sec-02',
    dropCode: 'DROP 02',
    collection: 'STREETWEAR & HEAVY TEES',
    title: 'Raw Grain & Wet-Tee 4-Axis Study',
    materialSpec: '280 GSM Heavyweight Combed Jersey',
    priceDisplay: '$82',
    preorderWindow: 'Made-to-Order · 7–10 Days',
    storyCaption:
      'Four-column kinetic garment study pairing high-contrast flash photography with mineral-washed heavyweight cotton tees.',
    sizingType: 'apparel',
    craftsmanshipSpecs: {
      materialGrade: 'Organic Long-Staple Combed Cotton',
      hardwareOrTrim: 'Woven Tyvek Care Spec Label',
      weightOrGauge: '280 GSM Compact Knit',
      construction: 'Drop-shoulder boxy block · Enzyme cold wash',
    },
    lutPreset: 'rawx-flash-wet',
  },
  s3: {
    sectionKey: 's3',
    dropId: 's03',
    domId: 'sec-03',
    dropCode: 'DROP 03',
    collection: 'OUTERWEAR & FOOTWEAR',
    title: 'Monolith Anamorphic Outerwear & Boots',
    materialSpec: 'Goodyear-Welted Leather & Waxed Canvas',
    priceDisplay: '$340',
    preorderWindow: 'Made-to-Order · 10–14 Days',
    storyCaption:
      'Panoramic 32:9 field showcase of structured storm coats and Goodyear-welted storm-welt service boots forged for multi-decade wear.',
    sizingType: 'footwear',
    craftsmanshipSpecs: {
      materialGrade: '2.2mm Oil-Tanned Full-Grain Cowhide & Dry-Waxed Duck',
      hardwareOrTrim: 'Solid Brass & 316L Matte Gunmetal Eyelets',
      weightOrGauge: '14 oz Halley Stevensons Waxed Shell',
      construction: '360° Goodyear Storm Welt · Vibram Commando Sole',
    },
    lutPreset: 'rawx-monolith-32x9',
  },
  s4a: {
    sectionKey: 's4a',
    dropId: 's04',
    domId: 'sec-04',
    dropCode: 'ARCHIVE VOL.1',
    collection: 'EDITORIAL & LUT LAB',
    title: 'Asymmetric Film Latitude Study',
    materialSpec: '35mm Kodak Latitude + Analog Grain',
    priceDisplay: '$65',
    preorderWindow: 'Instant Digital LUT + Print · JIT',
    storyCaption:
      'Dual-format asymmetric editorial pairing medium-format portraits with RAWx custom film emulation curves.',
    sizingType: 'apparel',
    craftsmanshipSpecs: {
      materialGrade: '64-Point 3D Cube LUT + 300 GSM Cotton Capsule',
      hardwareOrTrim: 'Serialized Archival Print Sleeve',
      weightOrGauge: '16-Bit Color Pipeline · 4K Scan Grain',
      construction: 'Hand-calibrated shadow roll-off & halation mask',
    },
    lutPreset: 'rawx-analog-split',
  },
  s5a: {
    sectionKey: 's5a',
    dropId: 's05',
    domId: 'sec-05',
    dropCode: 'DROP 05',
    collection: 'STREETWEAR & HEAVY TEES',
    title: '9:16 Triptych Silhouette Drop',
    materialSpec: '300 GSM Combed Heavyweight Cotton',
    priceDisplay: '$110',
    preorderWindow: 'Made-to-Order · 7–10 Days',
    storyCaption:
      'Three-panel vertical portrait study showcasing elongated raw-hem layering tees and distressed charcoal hoodies.',
    sizingType: 'apparel',
    craftsmanshipSpecs: {
      materialGrade: '300 GSM Combed French Terry & Heavy Jersey',
      hardwareOrTrim: 'Custom Matte Black Snap Placket',
      weightOrGauge: '300–420 GSM Multi-Layer Block',
      construction: 'Raw laser-cut hem · Double-lined hood',
    },
    lutPreset: 'rawx-bleach-pass',
  },
  s6: {
    sectionKey: 's6',
    dropId: 's06',
    domId: 'sec-06',
    dropCode: 'BROADCAST 06',
    collection: 'EDITORIAL & LUT LAB',
    title: 'Continuous Crossfade Lookbook Feed',
    materialSpec: '21:9 Cinema Master + Editorial Zine',
    priceDisplay: '$75',
    preorderWindow: 'Made-to-Order · 7–10 Days',
    storyCaption:
      'Real-time crossfade broadcast capturing RAWx seasonal tonal grades and archival campaign plates.',
    sizingType: 'apparel',
    craftsmanshipSpecs: {
      materialGrade: 'Archival Cotton Rag 310 GSM Print + Capsule Tee',
      hardwareOrTrim: 'Numbered Blind-Debossed Seal',
      weightOrGauge: '21:9 Cinema Aspect Calibration',
      construction: 'Pigment ink archival binding',
    },
    lutPreset: 'rawx-crossfade-stream',
  },
  s7a: {
    sectionKey: 's7a',
    dropId: 's07',
    domId: 'sec-07',
    dropCode: 'DROP 07',
    collection: 'OUTERWEAR & FOOTWEAR',
    title: 'Structured Atelier Coats & Combat Boots',
    materialSpec: 'Full-Grain Calfskin + 580 GSM Melton Wool',
    priceDisplay: '$420',
    preorderWindow: 'Made-to-Order · 10–14 Days',
    storyCaption:
      'Four-column 4:5 portrait grid detailing sculpted wool overcoats, distressed leather trench panels, and heavy lugged boots.',
    sizingType: 'apparel',
    craftsmanshipSpecs: {
      materialGrade: 'Italian-Milled 580 GSM Melton & Dhaka Calfskin',
      hardwareOrTrim: 'Riri M8 Solid Steel Two-Way Zippers',
      weightOrGauge: '580 GSM Wool / 1.4mm Full-Grain Hide',
      construction: 'Half-canvas chest · Cupro Bemberg full lining',
    },
    lutPreset: 'rawx-editorial-noir',
  },
  s8a: {
    sectionKey: 's8a',
    dropId: 's08',
    domId: 'sec-08',
    dropCode: 'ARCHIVE VOL.2',
    collection: 'EDITORIAL & LUT LAB',
    title: 'Hypnotic Pendulum Dual-Deck',
    materialSpec: 'Amber Pulse Grade + Capsule Print',
    priceDisplay: '$88',
    preorderWindow: 'Made-to-Order · 7–10 Days',
    storyCaption:
      'Synchronized dual 16:9 lookbook decks contrasting tungsten analog warmth against cold steel studio uplinks.',
    sizingType: 'apparel',
    craftsmanshipSpecs: {
      materialGrade: '300 GSM Heavyweight Jersey · Discharge Screenprint',
      hardwareOrTrim: 'Serialized Woven Pendulum Patch',
      weightOrGauge: '300 GSM Combed Cotton',
      construction: 'Water-based soft-hand multi-pass print',
    },
    lutPreset: 'rawx-amber-pulse',
  },
  s9: {
    sectionKey: 's9',
    dropId: 's09',
    domId: 'sec-09',
    dropCode: 'DROP 09',
    collection: 'OUTERWEAR & FOOTWEAR',
    title: 'Distressed Cowhide Rider & Welted Boot',
    materialSpec: 'Full-Grain Distressed Cowhide + Goodyear Welt',
    priceDisplay: '$480',
    preorderWindow: 'Made-to-Order · 12–15 Days',
    storyCaption:
      'Hand-waxed Dhaka distressed cowhide rider jacket engineered with articulated gussets and 316L steel hardware.',
    banglaTagline: 'হ্যান্ড-ওয়াক্সড ডিস্ট্রেসড লেদার জ্যাকেট ও বুট',
    sizingType: 'apparel',
    craftsmanshipSpecs: {
      materialGrade: '1.3–1.5mm Vegetable-Tanned Full-Grain Cowhide',
      hardwareOrTrim: '316L Surgical Steel Buckles & YKK Excella #8 Zips',
      weightOrGauge: '2.4 kg Jacket Weight · 1.5mm Hide',
      construction: 'Triple-stitched bonded nylon · Action-back pleats',
    },
    lutPreset: 'rawx-italian-serif',
  },
  s10: {
    sectionKey: 's10',
    dropId: 's10',
    domId: 'sec-10',
    dropCode: 'DROP 10',
    collection: 'EDITORIAL & LUT LAB',
    title: 'Ultra-Wide 8:1 Architectural Strip',
    materialSpec: 'Limited Collector Panoramic Poster + Hoodie',
    priceDisplay: '$135',
    preorderWindow: 'Made-to-Order · 7–10 Days',
    storyCaption:
      '8:1 panoramic campaign banner paired with our 460 GSM heavyweight loopback architectural hoodie.',
    sizingType: 'apparel',
    craftsmanshipSpecs: {
      materialGrade: '460 GSM Heavyweight Loopback French Terry',
      hardwareOrTrim: 'Custom Matte Steel Drawcord Aglets',
      weightOrGauge: '460 GSM Super-Heavy Fleece',
      construction: 'Flatlock seam armor · Dropped Raglan Sleeve',
    },
    lutPreset: 'rawx-panoramic-strip',
  },
  s11: {
    sectionKey: 's11',
    dropId: 's11',
    domId: 'sec-11',
    dropCode: 'LUT LAB 11',
    collection: 'EDITORIAL & LUT LAB',
    title: 'RAW-to-Grade Shader Calibration Suite',
    materialSpec: 'WebGL2 Real-Time Before/After Grade Lab',
    priceDisplay: '$49',
    preorderWindow: 'Instant Studio Pack · JIT',
    storyCaption:
      'Drag across the live shader divider to compare ungraded camera LOG against RAWx Teal & Steel, Amber Sunset, and Bleach Bypass LUTs.',
    sizingType: 'apparel',
    craftsmanshipSpecs: {
      materialGrade: '10-Bit LOG-to-Rec.709 WebGL2 GLSL Shaders',
      hardwareOrTrim: 'Includes 4 Master Grade Profiles',
      weightOrGauge: '65×65×65 3D LUT Precision',
      construction: 'Zero-clipping highlight roll-off · Halation pass',
    },
    lutPreset: 'rawx-teal-steel',
  },
  s12: {
    sectionKey: 's12',
    dropId: 's12',
    domId: 'sec-12',
    dropCode: 'REEL 12',
    collection: 'EDITORIAL & LUT LAB',
    title: 'Motion Campaign Cinema Loop',
    materialSpec: '21:9 Muted Autoplay Cinema Reel',
    priceDisplay: '$120',
    preorderWindow: 'Made-to-Order · 7–10 Days',
    storyCaption:
      'Continuous 21:9 motion editorial showcasing kinetic garment drape and live Storyboard video distribution.',
    sizingType: 'apparel',
    craftsmanshipSpecs: {
      materialGrade: '320 GSM Drape Jersey + Digital Cinema Master',
      hardwareOrTrim: 'QR-Linked Storyboard Project Token',
      weightOrGauge: '320 GSM Heavy Combed Cotton',
      construction: 'Reinforced shoulder tape · Split hem',
    },
    lutPreset: 'rawx-motion-loop',
  },
  sA: {
    sectionKey: 'sA',
    dropId: 's13',
    domId: 'sec-a',
    dropCode: 'DROP 13',
    collection: 'STREETWEAR & HEAVY TEES',
    title: 'Zoom-Burst Heavyweight Capsule',
    materialSpec: '320 GSM Combed Heavyweight Cotton',
    priceDisplay: '$98',
    preorderWindow: 'Made-to-Order · 7–10 Days',
    storyCaption:
      'High-impact scale-pop campaign featuring oversized heavyweight tees and industrial pigment-dyed crewnecks.',
    sizingType: 'apparel',
    craftsmanshipSpecs: {
      materialGrade: '320 GSM Pigment-Dyed Combed Cotton',
      hardwareOrTrim: 'Stamped 316L Hem Coin Tag',
      weightOrGauge: '320 GSM Jersey / 480 GSM Crewneck',
      construction: 'Garment-dyed patina · Reverse flatlock',
    },
    lutPreset: 'rawx-zoom-burst',
  },
  sB: {
    sectionKey: 'sB',
    dropId: 's14',
    domId: 'sec-b',
    dropCode: 'DROP 14',
    collection: 'STREETWEAR & HEAVY TEES',
    title: 'Cascade 3×2 Core Streetwear Grid',
    materialSpec: '290 GSM Heavyweight Knit & Enzyme Wash',
    priceDisplay: '$89',
    preorderWindow: 'Made-to-Order · 7–10 Days',
    storyCaption:
      'Six-frame cascading grid uniting core dark-neutral tees, graphic backs, and studio flash tests.',
    sizingType: 'apparel',
    craftsmanshipSpecs: {
      materialGrade: '290 GSM Open-End Dry Cotton',
      hardwareOrTrim: 'High-Density Silicone Back Crest',
      weightOrGauge: '290 GSM Heavyweight Jersey',
      construction: 'Tubular vintage body · High-set collar',
    },
    lutPreset: 'rawx-cascade-grid',
  },
  sC: {
    sectionKey: 'sC',
    dropId: 's15',
    domId: 'sec-c',
    dropCode: 'HIDE & STEEL 15',
    collection: 'HIDE & 316L STEEL',
    title: 'Veg-Tan Braided Hide & 316L Surgical Clasp',
    materialSpec: 'Full-Grain Veg-Tan Cowhide + 316L Surgical Steel',
    priceDisplay: '$115',
    preorderWindow: 'Made-to-Order · 7–10 Days',
    storyCaption:
      'Hand-plaited 8-strand vegetable-tanned bridle cowhide locked into a CNC-milled 316L surgical-grade stainless steel bayonet clasp.',
    banglaTagline: 'ভেজ-ট্যান লেদার ও ৩১৬এল সার্জিক্যাল স্টিল হার্ডওয়্যার',
    sizingType: 'wrist',
    craftsmanshipSpecs: {
      materialGrade: 'Full-Grain Vegetable-Tanned Bridle Cowhide',
      hardwareOrTrim: '316L Surgical Stainless Steel Magnetic Bayonet Clasp',
      weightOrGauge: '6.5mm 8-Strand Hand Braid · 48g Total Weight',
      construction: 'Hand-waxed edge burnish · Micro-pin locked clasp',
    },
    lutPreset: 'rawx-hide-steel',
  },
  sD: {
    sectionKey: 'sD',
    dropId: 's16',
    domId: 'sec-d',
    dropCode: 'HIDE & STEEL 16',
    collection: 'HIDE & 316L STEEL',
    title: 'Opposed-Axis Cuff & 516SS Buckle Series',
    materialSpec: 'Distressed Nappa Hide + 516SS Brushed Steel',
    priceDisplay: '$128',
    preorderWindow: 'Made-to-Order · 7–10 Days',
    storyCaption:
      'Dual-axis showcase pairing double-wrap distressed leather cuffs with CNC-chamfered 516SS stainless steel bar hardware.',
    sizingType: 'wrist',
    craftsmanshipSpecs: {
      materialGrade: 'Drum-Dyed Full-Grain Nappa & Oil-Pull Cowhide',
      hardwareOrTrim: '516SS Corrosion-Proof Brushed Steel Anchor Bar',
      weightOrGauge: '8mm Twin-Wrap Cord · 54g',
      construction: 'Hand-saddle stitched waxed linen thread',
    },
    lutPreset: 'rawx-opposed-steel',
  },
  sE: {
    sectionKey: 'sE',
    dropId: 's17',
    domId: 'sec-e',
    dropCode: 'ARCHIVE VOL.2',
    collection: 'EDITORIAL & LUT LAB',
    title: 'Inertia Filmstrip Contact Sheet',
    materialSpec: 'Momentum Scrubbable 35mm Contact Reel',
    priceDisplay: '$70',
    preorderWindow: 'Made-to-Order · 7–10 Days',
    storyCaption:
      'Physics-driven horizontal contact strip allowing tactile momentum scrubbing across seven unreleased campaign negatives.',
    sizingType: 'apparel',
    craftsmanshipSpecs: {
      materialGrade: '300 GSM Heavy Cotton Archival Print Tee',
      hardwareOrTrim: 'Woven Frame-Index Neck Spec',
      weightOrGauge: '300 GSM Combed Jersey',
      construction: 'Discharge + Puff Ink Dual Layer Print',
    },
    lutPreset: 'rawx-inertia-strip',
  },
  sF: {
    sectionKey: 'sF',
    dropId: 's18',
    domId: 'sec-f',
    dropCode: 'DROP 18',
    collection: 'OUTERWEAR & FOOTWEAR',
    title: 'Blade-Wipe Technical Trench & Boot Capsule',
    materialSpec: 'Goodyear-Welted Leather + 3-Layer Waxed Shell',
    priceDisplay: '$395',
    preorderWindow: 'Made-to-Order · 10–14 Days',
    storyCaption:
      'Directional wipe-cut campaign presenting storm-sealed trench outerwear and hand-lasted ankle boots.',
    sizingType: 'footwear',
    craftsmanshipSpecs: {
      materialGrade: '2.0mm Pull-Up Calfskin & Bonded Cotton Ripstop',
      hardwareOrTrim: '316L Matte Storm Snaps & Speed Hooks',
      weightOrGauge: '380 GSM Shell / 2.0mm Boot Upper',
      construction: 'Goodyear storm-welt · Taped internal seams',
    },
    lutPreset: 'rawx-blade-wipe',
  },
  sG: {
    sectionKey: 'sG',
    dropId: 's19',
    domId: 'sec-g',
    dropCode: 'HIDE & STEEL 19',
    collection: 'HIDE & 316L STEEL',
    title: 'RAWx Forge · 316L Bracelet & Hide Archive',
    materialSpec: 'Full-Grain Veg-Tan Cowhide + 316L Surgical Steel',
    priceDisplay: '$145',
    preorderWindow: 'Made-to-Order · 7–10 Days',
    storyCaption:
      'Flagship hardware & leather edition combining custom-milled 316L steel links, braided Dhaka cowhide, and hand-stamped serial plates.',
    banglaTagline: 'সার্জিক্যাল স্টিল ও ফুল-গ্রেইন লেদার কালেকশন',
    sizingType: 'wrist',
    craftsmanshipSpecs: {
      materialGrade: '3.0mm Bridle Cowhide + 316L Surgical Steel Links',
      hardwareOrTrim: 'Custom Milled 316L Locking Shackle & Serial Plate',
      weightOrGauge: '10mm Heavy Cuff · 68g Steel & Hide',
      construction: 'Hand-riveted solid steel pins · Beeswax edge seal',
    },
    lutPreset: 'rawx-forge-steel',
  },
};

const SAVED_LOOKBOOK_STORAGE_KEY = 'rawx_saved_lookbook_v1';

export function getSavedLookbookIds(): string[] {
  try {
    const raw = safeStorage.getItem(SAVED_LOOKBOOK_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((id): id is string => typeof id === 'string');
    }
    return [];
  } catch {
    return [];
  }
}

export function saveSavedLookbookIds(ids: string[]): void {
  try {
    safeStorage.setItem(SAVED_LOOKBOOK_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore storage quota failures
  }
}

export function getMergedDropMetadata(slidersData: AllSlidersData): Record<RawxDropKey, DropMetadata> {
  const custom = slidersData.dropMetadata || {};
  const merged = { ...DEFAULT_RAWX_DROPS };
  (Object.keys(DEFAULT_RAWX_DROPS) as RawxDropKey[]).forEach((key) => {
    if (custom[key]) {
      merged[key] = {
        ...DEFAULT_RAWX_DROPS[key],
        ...custom[key],
        craftsmanshipSpecs: {
          ...DEFAULT_RAWX_DROPS[key].craftsmanshipSpecs,
          ...(custom[key].craftsmanshipSpecs || {}),
        },
      };
    }
  });
  return merged;
}

export function getSlidesForDropKey(slidersData: AllSlidersData, key: RawxDropKey): SlideData[] {
  switch (key) {
    case 's1':
      return slidersData.s1;
    case 's2a':
      return [...slidersData.s2a, ...slidersData.s2b, ...slidersData.s2c, ...slidersData.s2d];
    case 's3':
      return slidersData.s3;
    case 's4a':
      return [...slidersData.s4a, ...slidersData.s4b];
    case 's5a':
      return [...slidersData.s5a, ...slidersData.s5b, ...slidersData.s5c];
    case 's6':
      return slidersData.s6;
    case 's7a':
      return [...slidersData.s7a, ...slidersData.s7b, ...slidersData.s7c, ...slidersData.s7d];
    case 's8a':
      return [...slidersData.s8a, ...slidersData.s8b];
    case 's9':
      return slidersData.s9;
    case 's10':
      return slidersData.s10;
    case 's11':
      return [
        {
          id: 's11-before',
          url: slidersData.s11.beforeUrl,
          tag: slidersData.s11.beforeLabel,
          title: `${slidersData.s11.title} (RAW)`,
          sub: slidersData.s11.sub,
        },
        {
          id: 's11-after',
          url: slidersData.s11.afterUrl,
          tag: slidersData.s11.afterLabel,
          title: `${slidersData.s11.title} (Graded)`,
          sub: slidersData.s11.sub,
        },
      ];
    case 's12':
      return slidersData.s12;
    case 'sA':
      return slidersData.sA;
    case 'sB':
      return slidersData.sB.cells.map((cell, idx) => ({
        id: `sB-${idx}`,
        url: cell.sets[0] || '',
        tag: 'Stagger Cascade',
        title: cell.title,
        sub: '3×2 Lookbook Sequence',
      }));
    case 'sC':
      return slidersData.sC;
    case 'sD':
      return [...slidersData.sD.left, ...slidersData.sD.right];
    case 'sE':
      return slidersData.sE;
    case 'sF':
      return slidersData.sF;
    case 'sG':
      return slidersData.sG || [];
  }
}

export const RAWX_DROP_ORDER: readonly RawxDropKey[] = [
  's1',
  's2a',
  's3',
  's4a',
  's5a',
  's6',
  's7a',
  's8a',
  's9',
  's10',
  's11',
  's12',
  'sA',
  'sB',
  'sC',
  'sD',
  'sE',
  'sF',
  'sG',
] as const;
// END OF FILE: src/data/rawxDrops.ts
