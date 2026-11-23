export type Language = 'en' | 'bn' | 'hi' | 'zh' | 'ja' | 'es' | 'de' | 'nl';

export interface LanguageOption {
  code: Language;
  shortLabel: string;
  nativeLabel: string;
  englishName: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', shortLabel: 'EN', nativeLabel: 'English', englishName: 'English' },
  { code: 'bn', shortLabel: 'BN', nativeLabel: 'বাংলা', englishName: 'Bangla' },
  { code: 'hi', shortLabel: 'HI', nativeLabel: 'हिन्दी', englishName: 'Hindi' },
  { code: 'zh', shortLabel: 'ZH', nativeLabel: '中文', englishName: 'Chinese' },
  { code: 'ja', shortLabel: 'JA', nativeLabel: '日本語', englishName: 'Japanese' },
  { code: 'es', shortLabel: 'ES', nativeLabel: 'Español', englishName: 'Spanish' },
  { code: 'de', shortLabel: 'DE', nativeLabel: 'Deutsch', englishName: 'German' },
  { code: 'nl', shortLabel: 'NL', nativeLabel: 'Nederlands', englishName: 'Dutch' },
];

export const SUPPORTED_LANGUAGES: Language[] = LANGUAGE_OPTIONS.map((l) => l.code);

export function isSupportedLanguage(val: string | null | undefined): val is Language {
  return Boolean(val && SUPPORTED_LANGUAGES.includes(val as Language));
}

export interface LocalizedSectionItem {
  title: string;
  category: string;
  sub: string;
  desc: string;
  cta: string;
  status: string;
}

export interface TranslationDictionary {
  brand: {
    name: string;
    tagline: string;
    subline: string;
  };
  theme: {
    switchToLight: string;
    switchToDark: string;
    lightLabel: string;
    darkLabel: string;
    selectLanguage: string;
  };
  nav: {
    home: string;
    handfilm: string;
    rawx: string;
    apps: string;
    sliders: string;
    stage: string;
    ecosystem: string;
    sliders16: string;
    tasks: string;
    index: string;
    map: string;
    speed: string;
    grade: string;
    sound: string;
    soundOn: string;
    soundOff: string;
    installApp: string;
    addSite: string;
    searchOrJump: string;
    commandPalette: string;
  };
  actions: {
    enter: string;
    view: string;
    explore: string;
    read: string;
    stream: string;
    copyLink: string;
    linkCopied: string;
    share: string;
    close: string;
    back: string;
    continueLast: string;
    dismiss: string;
    filterBySection: string;
    clearFilter: string;
  };
  home: {
    eyebrow: string;
    headline: string;
    motto: string;
    subtitle: string;
    exploreAppsBtn: string;
    slidersBtn: string;
    whatsappBtn: string;
    routingTitle: string;
    pillarsEyebrow: string;
    pillarsTitle: string;
    pillarsSub: string;
    openWingCta: string;
    openStoryboardCta: string;
    openAppsCta: string;
    directoryEyebrow: string;
    directoryTitle: string;
    dispatchEyebrow: string;
    dispatchTitle: string;
    dispatchSubtitle: string;
    dispatchBtn: string;
    liveNodesLabel: string;
    syncMeshLabel: string;
    ecosystemStageLabel: string;
    visualEngineLabel: string;
    activeTasksLabel: string;
    masterClockLabel: string;
    pillarCards: {
      storyboardBadge: string;
      storyboardTitle: string;
      storyboardSummary: string;
      b2bBadge: string;
      b2bTitle: string;
      b2bSummary: string;
      appsBadge: string;
      appsTitle: string;
      appsSummary: string;
    };
  };
  handfilm: {
    studioLabel: string;
    heroHeadlinePrefix: string;
    heroHeadlineAccent: string;
    heroSubline: string;
    tryOnline: string;
    downloadBtn: string;
    modelsEyebrow: string;
    modelsTitle: string;
    modelsSub: string;
    filterAll: string;
    filterEditor: string;
    filterAi: string;
    filterCommerce: string;
    launchStoryboard: string;
    workflowEyebrow: string;
    workflowTitle: string;
    discoverEyebrow: string;
    discoverTitle: string;
    pricingEyebrow: string;
    pricingTitle: string;
    stickySlogan: string;
    tapHint: string;
    subnav: {
      products: string;
      features: string;
      models: string;
      integrations: string;
      solutions: string;
      discover: string;
      pricing: string;
    };
  };
  rawx: {
    studioBadge: string;
    heroTitle: string;
    heroSubtitle: string;
    backToApps: string;
    savedLookbook: string;
    autoplayOn: string;
    autoplayPaused: string;
    theaterEnter: string;
    theaterExit: string;
    customizePhotos: string;
    lightbox: string;
    allDrops: string;
    searchPlaceholder: string;
    inspectPreorder: string;
    copyDropLink: string;
    remixStoryboard: string;
    save: string;
    saved: string;
    editSection: string;
    hoverHint: string;
  };
  sections: {
    [key: string]: LocalizedSectionItem;
  };
  ticker: {
    prefix: string;
    live: string;
    pause: string;
    resume: string;
  };
  command: {
    placeholder: string;
    noResults: string;
    jumpTo: string;
    actions: string;
    quickSwitch: string;
    shortcuts: string;
    escToClose: string;
  };
  newsletter: {
    badge: string;
    title: string;
    subtitle: string;
    placeholder: string;
    submit: string;
    success: string;
    note: string;
  };
  returning: {
    welcomeBack: string;
    continueTo: string;
    explored: string;
    allExplored: string;
  };
  map: {
    title: string;
    subtitle: string;
    listView: string;
    mapView: string;
    clusters: {
      commerce: string;
      media: string;
      engines: string;
    };
    nodeVisited: string;
    nodeUnvisited: string;
    clickToJump: string;
  };
  liveEmbed: {
    interactiveMode: string;
    viewMode: string;
    fullscreen: string;
    exitFullscreen: string;
    fallbackMessage: string;
    retry: string;
    openDirect: string;
  };
}

const EN_SECTIONS: Record<string, LocalizedSectionItem> = {
  d2c: {
    title: 'D2C SHOP',
    category: '01 / COMMERCE',
    sub: 'Hands & Head Consumer Commerce',
    desc: 'Direct-to-consumer products, drops, catalogue and WhatsApp-first ordering.',
    cta: 'ENTER SHOP',
    status: 'NEW DROP · VAULT LEATHER SERIES · LIVE',
  },
  arutemika: {
    title: 'ARUTEMIKA',
    category: '02 / COMMERCE',
    sub: 'B2B / Corporate / Wholesale Commerce',
    desc: 'A dedicated environment for corporate and wholesale buyers — sourcing, bulk catalogue and account ordering.',
    cta: 'ENTER B2B',
    status: 'ACCEPTING BULK ORDERS · ENTERPRISE CATALOGUE',
  },
  articles: {
    title: 'ARTICLES',
    category: '03 / CONTENT',
    sub: 'Ideas, Research & Editorial Dispatches',
    desc: 'Long-form essays on industrial systems, technology, design, AI, and culture from the H&H studio.',
    cta: 'READ ARTICLES',
    status: 'LATEST ESSAY · INDUSTRIAL REALISM & AI ARCHITECTURE',
  },
  studio: {
    title: 'STUDIO',
    category: '04 / CONTENT',
    sub: 'Handfilm & Storyboard WebGL2 Cinema Engine',
    desc: 'Browser-based WebGL2 AI Video Platform, NLE Editor, Player, and Cloudflare Video Host for creative direction.',
    cta: 'ENTER STUDIO',
    status: 'HANDFILM & STORYBOARD · WEBGL2 CINEMA ENGINE ACTIVE',
  },
  aural: {
    title: 'AURAL',
    category: '05 / CONTENT',
    sub: 'Sound, Audio & Music Division',
    desc: 'Acoustic research, ambient procedural soundscapes, and audio production across the H&H ecosystem.',
    cta: 'LISTEN',
    status: 'ACOUSTIC LAB · ATMOSPHERIC FREQUENCIES LIVE',
  },
  textile: {
    title: 'TEXTILE',
    category: '06 / MANUFACTURING',
    sub: 'Fabric, Mills & Material Sourcing',
    desc: 'Woven and knit textile sourcing, mill partnerships and fabric development for the H&H manufacturing ecosystem.',
    cta: 'ENTER TEXTILE',
    status: 'MILL PARTNERSHIPS · KNIT & WOVEN SOURCING ACTIVE',
  },
  rmg: {
    title: 'RMG',
    category: '07 / MANUFACTURING',
    sub: 'Ready-Made Garments Manufacturing',
    desc: 'Garment production, factory sourcing and export-ready manufacturing under the H&H industrial arm.',
    cta: 'ENTER RMG',
    status: 'EXPORT PRODUCTION · FACTORY NETWORK EXPANSION',
  },
  leather: {
    title: 'LEATHER',
    category: '08 / MANUFACTURING',
    sub: 'Leather Goods & Tannery Sourcing',
    desc: 'Leather sourcing, tannery partnerships and finished leather-goods production.',
    cta: 'ENTER LEATHER',
    status: 'TANNERY AUDIT · FULL GRAIN HIDE PROCUREMENT',
  },
  jacket: {
    title: 'JACKET',
    category: '09 / MANUFACTURING',
    sub: 'Outerwear & Jacket Manufacturing',
    desc: 'Specialized outerwear and jacket production line within the H&H garment network.',
    cta: 'ENTER JACKET',
    status: 'OUTERWEAR LINE · TECHNICAL BAFFLE PRODUCTION',
  },
  jute: {
    title: 'JUTE',
    category: '10 / MANUFACTURING',
    sub: 'Jute & Natural Fibre Sourcing',
    desc: 'Eco-friendly jute processing, natural fiber woven goods and sustainable industrial packaging.',
    cta: 'ENTER JUTE',
    status: 'NATURAL FIBRE · ZERO CARBON PACKAGING ACTIVE',
  },
  lingerie: {
    title: 'LINGERIE',
    category: '11 / MANUFACTURING',
    sub: 'Intimate Apparel Manufacturing',
    desc: 'Fine lingerie, intimate apparel engineering, seamless fabrication and precision assembly.',
    cta: 'ENTER LINGERIE',
    status: 'SEAMLESS LINE · MICROFIBRE ATELIER LIVE',
  },
  bracelets: {
    title: 'BRACELETS',
    category: '12 / MANUFACTURING',
    sub: '316L/516SS Precision Hardware & Handcrafted Accessories',
    desc: 'Architectural stainless-steel 316L/516SS hardware, woven cord bracelets, and bespoke metal accessory fabrication.',
    cta: 'ENTER BRACELETS',
    status: 'HARDWARE WING · 316L/516SS & HAND-WOVEN CORDS',
  },
  bloom: {
    title: 'BLOOM',
    category: '13 / LIFESTYLE',
    sub: 'Floral & Botanical Division',
    desc: 'The floral and botanical arm of Hands & Head — sourcing, sculptural arrangement, and botanical development.',
    cta: 'ENTER BLOOM',
    status: 'BOTANICAL LAB · SEASONAL FLORAL ARRANGEMENTS',
  },
  gym: {
    title: 'GYM',
    category: '14 / LIFESTYLE',
    sub: 'Fitness, Performance Gear & Wellness',
    desc: 'Athletic performance equipment, wellness protocols, and technical training apparel development.',
    cta: 'ENTER GYM',
    status: 'PERFORMANCE LAB · WELLNESS PROTOCOLS LIVE',
  },
  agro: {
    title: 'AGRO',
    category: '15 / FOOD',
    sub: 'Agriculture & Agro-Processing',
    desc: 'Direct agricultural sourcing, farm-to-factory supply chains, and agro-processing operations under H&H.',
    cta: 'ENTER AGRO',
    status: 'ORGANIC HARVEST · AGRO-PROCESSING FACILITY LIVE',
  },
  food: {
    title: 'FOOD',
    category: '16 / FOOD',
    sub: 'Food Production & Distribution',
    desc: 'Packaged food product development, quality-certified processing, and cold/dry distribution.',
    cta: 'ENTER FOOD',
    status: 'DISTRIBUTION NETWORK · QUALITY ASSURANCE CERTIFIED',
  },
  bloomapp: {
    title: 'BLOOM APP',
    category: '17 / APPS',
    sub: 'Botanical Ordering & Dispatch App',
    desc: 'Digital concierge and rapid floral delivery application for seasonal and bespoke arrangements.',
    cta: 'OPEN APP',
    status: 'BOTANICAL CONCIERGE · RAPID DISPATCH ONLINE',
  },
  apps: {
    title: 'APPS',
    category: '18 / APPS',
    sub: 'H&H Software & Utility Cloud',
    desc: 'Internal web applications, operational software suites, APIs, and cross-team productivity tools.',
    cta: 'VIEW APPS',
    status: 'UTILITY CLOUD · V4.2 CORE ENGINES RUNNING',
  },
  note: {
    title: 'NOTE',
    category: '19 / APPS',
    sub: 'Notes & Encrypted Writing Workspace',
    desc: 'Markdown editor, structured team knowledge repository, and fast local-first writing environment.',
    cta: 'OPEN NOTE',
    status: 'TEXT EDITOR · ENCRYPTED LOCAL PERSISTENCE',
  },
  picseed: {
    title: 'PICSEED',
    category: '20 / APPS',
    sub: 'Image CDN & Visual Tooling Pipeline',
    desc: 'Automated media processing, image optimization, and high-fidelity visual asset generation pipelines.',
    cta: 'OPEN PICSEED',
    status: 'ASSET PIPELINE · HIGH FIDELITY RENDER ONLINE',
  },
  hub: {
    title: 'HUB',
    category: '21 / APPS',
    sub: 'Central Ecosystem Control Spine',
    desc: 'Unified command panel, real-time operational telemetry, and cross-portal routing backbone.',
    cta: 'ENTER HUB',
    status: 'CONTROL SPINE · TELEMETRY STACK ONLINE',
  },
  deeper: {
    title: 'DEEPER',
    category: '22 / APPS',
    sub: 'R&D & Frontier Exploration Lab',
    desc: 'In-depth systems research, experimental WebGL interfaces, and next-generation concept incubation.',
    cta: 'GO DEEPER',
    status: 'RESEARCH LAB · FRONTIER COGNITION EXPERIMENTS',
  },
  hiya: {
    title: 'HIYA',
    category: '23 / APPS',
    sub: 'Low-Latency Messaging & Team Mesh',
    desc: 'Peer-to-peer fast messaging, operational dispatches, and real-time status signals across units.',
    cta: 'SAY HIYA',
    status: 'MESSAGING MESH · LOW LATENCY SIGNALS LIVE',
  },
  me: {
    title: 'ME',
    category: '24 / APPS',
    sub: 'Founder Profile, Identity & SSO Enclave',
    desc: 'Personal profile, single sign-on identity verification, workspace settings, and secure key management.',
    cta: 'ENTER ME',
    status: 'USER IDENTITY · SSO ENCLAVE SECURED',
  },
};

function buildLocalizedSections(
  ctaWord: string,
  categoryLabels: {
    commerce: string;
    content: string;
    manuf: string;
    lifestyle: string;
    food: string;
    apps: string;
  },
  overrides: Partial<Record<string, Partial<LocalizedSectionItem>>> = {}
): Record<string, LocalizedSectionItem> {
  const result: Record<string, LocalizedSectionItem> = {};
  Object.entries(EN_SECTIONS).forEach(([id, base]) => {
    const custom = overrides[id] || {};
    let category = base.category;
    if (base.category.includes('COMMERCE')) category = `${base.category.split('/')[0]}/ ${categoryLabels.commerce}`;
    else if (base.category.includes('CONTENT')) category = `${base.category.split('/')[0]}/ ${categoryLabels.content}`;
    else if (base.category.includes('MANUFACTURING')) category = `${base.category.split('/')[0]}/ ${categoryLabels.manuf}`;
    else if (base.category.includes('LIFESTYLE')) category = `${base.category.split('/')[0]}/ ${categoryLabels.lifestyle}`;
    else if (base.category.includes('FOOD')) category = `${base.category.split('/')[0]}/ ${categoryLabels.food}`;
    else if (base.category.includes('APPS')) category = `${base.category.split('/')[0]}/ ${categoryLabels.apps}`;

    result[id] = {
      title: custom.title || base.title,
      category: custom.category || category,
      sub: custom.sub || base.sub,
      desc: custom.desc || base.desc,
      cta: custom.cta || `${ctaWord} ${custom.title || base.title}`,
      status: custom.status || base.status,
    };
  });
  return result;
}

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en: {
    brand: {
      name: 'HANDS & HEAD',
      tagline: 'MASTER OS',
      subline: 'Unified Digital Workspace & Ecosystem',
    },
    theme: {
      switchToLight: 'Switch to Light Mode',
      switchToDark: 'Switch to Dark Mode',
      lightLabel: 'Light',
      darkLabel: 'Dark',
      selectLanguage: 'Select Language',
    },
    nav: {
      home: 'HOME',
      handfilm: 'HANDFILM',
      rawx: 'RAWx',
      apps: 'APPS',
      sliders: 'Sliders',
      stage: 'Stage',
      ecosystem: 'Ecosystem',
      sliders16: '16 Sliders',
      tasks: 'Tasks',
      index: 'Index',
      map: 'Map',
      speed: 'Speed',
      grade: 'Grade',
      sound: 'Ambient',
      soundOn: 'Audio On',
      soundOff: 'Audio Off',
      installApp: 'Install App',
      addSite: '+ Add Website',
      searchOrJump: 'Quick Jump (⌘K)',
      commandPalette: 'Command Palette',
    },
    actions: {
      enter: 'ENTER PORTAL',
      view: 'VIEW',
      explore: 'EXPLORE',
      read: 'READ ARTICLES',
      stream: 'ENTER FILM',
      copyLink: 'Copy Link',
      linkCopied: 'Link Copied!',
      share: 'Share',
      close: 'Close',
      back: 'Back',
      continueLast: 'Resume Session',
      dismiss: 'Dismiss',
      filterBySection: 'Filter by Section',
      clearFilter: 'Clear Filter',
    },
    home: {
      eyebrow: 'HANDS & HEAD ENTERPRISE OS',
      headline: 'HANDS & HEAD',
      motto: 'One Core, Many Worlds.',
      subtitle: 'WebGL2 Cinema Engine, Direct-from-Source Industrial B2B Wings, and 24 Ecosystem Apps on one zero-latency operating core.',
      exploreAppsBtn: 'Explore 24 Apps',
      slidersBtn: 'RAWx 19 Studios',
      whatsappBtn: 'WhatsApp Hub',
      routingTitle: 'OS ROUTING MATRIX',
      pillarsEyebrow: 'CORE ARCHITECTURE',
      pillarsTitle: 'Three Enterprise Operating Pillars',
      pillarsSub: 'Hover any visual card to expand specifications & launch actions',
      openWingCta: 'Open Wing →',
      openStoryboardCta: 'Launch in Storyboard ↗',
      openAppsCta: 'Open Wing →',
      directoryEyebrow: 'ECOSYSTEM TOPOLOGY',
      directoryTitle: 'All Active Hands & Head Portals',
      dispatchEyebrow: 'DIRECT ENTERPRISE DISPATCH · [Via Main Hub]',
      dispatchTitle: 'Need B2B Sourcing, Handfilm Production, or Custom OS Integration?',
      dispatchSubtitle: 'Connect directly with the HANDS & HEAD executive operations desk on WhatsApp.',
      dispatchBtn: 'Message on WhatsApp [Via Main Hub]',
      liveNodesLabel: 'ACTIVE NODES',
      syncMeshLabel: 'SYNC MESH',
      ecosystemStageLabel: 'ECOSYSTEM STAGE',
      visualEngineLabel: 'RAWx VISUAL ENGINE',
      activeTasksLabel: 'ACTIVE TASKS',
      masterClockLabel: 'MASTER CLOCK (UTC)',
      pillarCards: {
        storyboardBadge: '01 // WEBGL2 CINEMA',
        storyboardTitle: 'HandFilm Storyboard',
        storyboardSummary: 'Browser-native WebGL2 AI Video Studio, NLE timeline editor, and Cloudflare edge host.',
        b2bBadge: '02 // B2B INDUSTRIAL',
        b2bTitle: 'Dhaka B2B Wings',
        b2bSummary: 'Direct-from-source RMG, 300 GSM heavyweight cotton, distressed leather, and 316L hardware.',
        appsBadge: '03 // OS MATRIX',
        appsTitle: '24 Ecosystem Apps',
        appsSummary: 'Zero-latency stage engine uniting D2C retail, botanical concierge, acoustic labs, and cloud tools.',
      },
    },
    handfilm: {
      studioLabel: 'HANDFILM STUDIO',
      heroHeadlinePrefix: 'AI Video Studio for ',
      heroHeadlineAccent: 'Everyone',
      heroSubline: 'Launch Easy, Beast, CapCut, or AD Studio straight into WebGL2 Storyboard.',
      tryOnline: 'Try Online Free',
      downloadBtn: 'Desktop / Android',
      modelsEyebrow: 'AI & NLE ARCHITECTURE',
      modelsTitle: 'Pick Your Engine. Launch in a Click.',
      modelsSub: 'Hover or tap any studio card to inspect pipeline specs and launch Storyboard.',
      filterAll: 'All Models (6)',
      filterEditor: 'NLE Modes',
      filterAi: 'Vision & Reframe',
      filterCommerce: 'AD Studio',
      launchStoryboard: 'Launch in Storyboard ↗',
      workflowEyebrow: 'THREE-STAGE PIPELINE',
      workflowTitle: 'Idea to Master Cut in Minutes',
      discoverEyebrow: 'TEMPLATES & TUTORIALS',
      discoverTitle: 'Ready Storyboard Blueprints',
      pricingEyebrow: 'EDITIONS',
      pricingTitle: 'Start Free. Scale to Pro Studio.',
      stickySlogan: 'Edit smarter, create faster',
      tapHint: 'Hover to reveal',
      subnav: {
        products: 'Products',
        features: 'Features',
        models: 'AI Models',
        integrations: 'Integrations',
        solutions: 'Solutions',
        discover: 'Discover',
        pricing: 'Pricing',
      },
    },
    rawx: {
      studioBadge: 'POD & JIT PRE-ORDER STUDIO',
      heroTitle: 'HIDE, STEEL & HEAVYWEIGHT',
      heroSubtitle: 'Small-batch 320 GSM combed cotton, full-grain cowhide, 316L steel hardware & 19 interactive slider engines.',
      backToApps: '← Apps',
      savedLookbook: 'Saved Lookbook',
      autoplayOn: 'AUTOPLAY',
      autoplayPaused: 'PAUSED',
      theaterEnter: 'Theater Mode',
      theaterExit: 'Exit Theater',
      customizePhotos: 'Customize Photos',
      lightbox: 'Cinema Lightbox',
      allDrops: 'ALL DROPS',
      searchPlaceholder: 'Filter drop, code, or material...',
      inspectPreorder: 'Inspect & Pre-Order',
      copyDropLink: 'Copy Drop Link',
      remixStoryboard: 'Launch in Storyboard ↗',
      save: 'Save',
      saved: 'Saved',
      editSection: 'Edit Photos',
      hoverHint: 'Hover drop header to reveal actions',
    },
    sections: EN_SECTIONS,
    ticker: {
      prefix: 'ECOSYSTEM STATUS',
      live: 'LIVE',
      pause: 'PAUSE',
      resume: 'RESUME',
    },
    command: {
      placeholder: 'Type a portal name, shortcode (e.g. b2b, shop), or command...',
      noResults: 'No ecosystem matching portals found',
      jumpTo: 'Direct Portals',
      actions: 'Workspace Actions',
      quickSwitch: 'Switch Language / Mode',
      shortcuts: 'Shortcuts',
      escToClose: 'Press ESC to exit',
    },
    newsletter: {
      badge: 'H&H DISPATCH',
      title: 'Ecosystem Intelligence & Releases',
      subtitle: 'Periodic briefing on hardware drops, cinema releases, and technical architecture.',
      placeholder: 'Enter corporate or personal email...',
      submit: 'SUBSCRIBE',
      success: 'Registered. Welcome to the Hands & Head Dispatch.',
      note: 'Zero spam. Encrypted delivery across our global studio network.',
    },
    returning: {
      welcomeBack: 'Welcome back to Master OS.',
      continueTo: 'Continue to',
      explored: 'Explored',
      allExplored: 'All portals explored',
    },
    map: {
      title: 'ECOSYSTEM ARCHITECTURE MAP',
      subtitle: 'Interactive relational network of all active portals and engines',
      listView: 'List Index',
      mapView: 'Relational Map',
      clusters: {
        commerce: 'Commerce & Drops',
        media: 'Editorial & Cinema',
        engines: 'OS Engines & Tools',
      },
      nodeVisited: 'Visited in session',
      nodeUnvisited: 'Unexplored portal',
      clickToJump: 'Click node to jump directly',
    },
    liveEmbed: {
      interactiveMode: 'Interactive Mode',
      viewMode: 'View Mode',
      fullscreen: 'Expand View',
      exitFullscreen: 'Minimize View',
      fallbackMessage: 'Direct live stream preview active.',
      retry: 'Reload Frame',
      openDirect: 'Open in New Window',
    },
  },
  bn: {
    brand: {
      name: 'হ্যান্ডস অ্যান্ড হেড',
      tagline: 'মাস্টার ওএস',
      subline: 'সমন্বিত ডিজিটাল ওয়ার্কস্পেস ও ইকোসিস্টেম',
    },
    theme: {
      switchToLight: 'লাইট মোডে যান',
      switchToDark: 'ডার্ক মোডে যান',
      lightLabel: 'লাইট',
      darkLabel: 'ডার্ক',
      selectLanguage: 'ভাষা নির্বাচন করুন',
    },
    nav: {
      home: 'হোম',
      handfilm: 'হ্যান্ডফিল্ম',
      rawx: 'RAWx',
      apps: 'অ্যাপস',
      sliders: 'স্লাইডার্স',
      stage: 'স্টেজ',
      ecosystem: 'ইকোসিস্টেম',
      sliders16: '১৯ স্লাইডার',
      tasks: 'টাস্কস',
      index: 'ইনডেক্স',
      map: 'ম্যাপ',
      speed: 'গতি',
      grade: 'গ্রেড',
      sound: 'শব্দ স্তর',
      soundOn: 'অডিও চালু',
      soundOff: 'অডিও বন্ধ',
      installApp: 'অ্যাপ ইনস্টল',
      addSite: '+ সাইট যোগ',
      searchOrJump: 'কমান্ড প্যালেট (⌘K)',
      commandPalette: 'কমান্ড প্যালেট',
    },
    actions: {
      enter: 'প্রবেশ করুন',
      view: 'দেখুন',
      explore: 'অন্বেষণ',
      read: 'প্রবন্ধ পড়ুন',
      stream: 'ফিল্ম দেখুন',
      copyLink: 'লিঙ্ক কপি',
      linkCopied: 'লিঙ্ক কপি হয়েছে!',
      share: 'শেয়ার',
      close: 'বন্ধ করুন',
      back: 'পেছনে',
      continueLast: 'সেশন পুনরায় শুরু',
      dismiss: 'বাতিল',
      filterBySection: 'বিভাগ অনুযায়ী ফিল্টার',
      clearFilter: 'ফিল্টার সরান',
    },
    home: {
      eyebrow: 'হ্যান্ডস অ্যান্ড হেড এন্টারপ্রাইজ ওএস',
      headline: 'হ্যান্ডস অ্যান্ড হেড',
      motto: 'এক কেন্দ্র, বহু জগৎ।',
      subtitle: 'ওয়েবজিএল২ সিনেমা ইঞ্জিন, ঢাকা বি২বি ইন্ডাস্ট্রিয়াল উইংস এবং ২৪টি ইকোসিস্টেম অ্যাপ এক প্ল্যাটফর্মে।',
      exploreAppsBtn: '২৪ অ্যাপস দেখুন',
      slidersBtn: 'RAWx ১৯ স্টুডিও',
      whatsappBtn: 'হোয়াটসঅ্যাপ হাব',
      routingTitle: 'ওএস রাউটিং ম্যাট্রিক্স',
      pillarsEyebrow: 'মূল স্থাপত্য',
      pillarsTitle: 'তিনটি এন্টারপ্রাইজ অপারেটিং স্তম্ভ',
      pillarsSub: 'বিস্তারিত দেখতে কার্ডের ওপর মাউস রাখুন বা ট্যাপ করুন',
      openWingCta: 'উইং খুলুন →',
      openStoryboardCta: 'স্টোরিবোর্ডে চালু করুন ↗',
      openAppsCta: 'উইং খুলুন →',
      directoryEyebrow: 'ইকোসিস্টেম টপোলজি',
      directoryTitle: 'সকল সক্রিয় পোর্টালসমূহ',
      dispatchEyebrow: 'সরাসরি এন্টারপ্রাইজ ডেস্ক · [মেইন হাব]',
      dispatchTitle: 'বি২বি সোর্সিং, হ্যান্ডফিল্ম বা কাস্টম ইন্টিগ্রেশন প্রয়োজন?',
      dispatchSubtitle: 'হোয়াটসঅ্যাপে সরাসরি হ্যান্ডস অ্যান্ড হেড অপারেশনস ডেস্কে যোগাযোগ করুন।',
      dispatchBtn: 'হোয়াটসঅ্যাপে বার্তা পাঠান',
      liveNodesLabel: 'সক্রিয় নোড',
      syncMeshLabel: 'সিঙ্ক মেশ',
      ecosystemStageLabel: 'ইকোসিস্টেম স্টেজ',
      visualEngineLabel: 'RAWx ভিজ্যুয়াল ইঞ্জিন',
      activeTasksLabel: 'সক্রিয় টাস্ক',
      masterClockLabel: 'মাস্টার ক্লক (ইউটিসি)',
      pillarCards: {
        storyboardBadge: '০১ // ওয়েবজিএল২ সিনেমা',
        storyboardTitle: 'হ্যান্ডফিল্ম স্টোরিবোর্ড',
        storyboardSummary: 'ব্রাউজার-ভিত্তিক ওয়েবজিএল২ এআই ভিডিও স্টুডিও, এনএলই এডিটর ও ক্লাউডফ্লেয়ার হোস্ট।',
        b2bBadge: '০২ // বি২বি ইন্ডাস্ট্রিয়াল',
        b2bTitle: 'ঢাকা বি২বি উইংস',
        b2bSummary: 'সরাসরি ফ্যাক্টরি থেকে ৩০০ জিএসএম কটন, ডিস্ট্রেসড লেদার ও ৩১৬এল হার্ডওয়্যার।',
        appsBadge: '০৩ // ওএস ম্যাট্রিক্স',
        appsTitle: '২৪ ইকোসিস্টেম অ্যাপস',
        appsSummary: 'ডি২সি শপ, অ্যাকোস্টিক ল্যাব, প্রবন্ধ ও অভ্যন্তরীণ ক্লাউড অ্যাপের দ্রুতগতির স্টেজ।',
      },
    },
    handfilm: {
      studioLabel: 'হ্যান্ডফিল্ম স্টুডিও',
      heroHeadlinePrefix: 'সবার জন্য এআই ভিডিও ও ফটো ',
      heroHeadlineAccent: 'এডিটর',
      heroSubline: 'সহজ, বিস্ট, ক্যাপকাট বা অ্যাড স্টুডিও সরাসরি স্টোরিবোর্ডে চালু করুন।',
      tryOnline: 'অনলাইনে বিনামূল্যে চালু করুন',
      downloadBtn: 'ডেস্কটপ ও অ্যান্ড্রয়েড',
      modelsEyebrow: 'এআই ও এডিটিং ইঞ্জিন',
      modelsTitle: 'সঠিক মডেল বেছে নিন। এক ক্লিকে চালু করুন।',
      modelsSub: 'বিস্তারিত তথ্য ও স্টোরিবোর্ড লঞ্চ করতে কার্ডের ওপর হোভার করুন।',
      filterAll: 'সকল মডেল (৬)',
      filterEditor: 'এনএলই মোড',
      filterAi: 'ভিশন ও রিফ্রেম',
      filterCommerce: 'অ্যাড স্টুডিও',
      launchStoryboard: 'স্টোরিবোর্ডে চালু করুন ↗',
      workflowEyebrow: 'তিন ধাপের পাইপলাইন',
      workflowTitle: 'আইডিয়া থেকে মাস্টার কাট মাত্র কয়েক মিনিটে',
      discoverEyebrow: 'টেমপ্লেট ও টিউটোরিয়াল',
      discoverTitle: 'প্রস্তুত স্টোরিবোর্ড ব্লুপ্রিন্ট',
      pricingEyebrow: 'সংস্করণসমূহ',
      pricingTitle: 'বিনামূল্যে শুরু করুন। প্রো স্টুডিওতে আপগ্রেড করুন।',
      stickySlogan: 'দ্রুত ও স্মার্টভাবে এডিট করুন',
      tapHint: 'বিস্তারিত দেখতে হোভার করুন',
      subnav: {
        products: 'পণ্য',
        features: 'বৈশিষ্ট্য',
        models: 'এআই মডেল',
        integrations: 'ইন্টিগ্রেশন',
        solutions: 'সমাধান',
        discover: 'আবিষ্কার',
        pricing: 'মূল্য',
      },
    },
    rawx: {
      studioBadge: 'পিওডি ও জেআইটি প্রি-অর্ডার স্টুডিও',
      heroTitle: 'চামড়া, স্টিল ও হেভিওয়েট অ্যাপারেল',
      heroSubtitle: '৩২০ জিএসএম কটন, ফুল-গ্রেইন লেদার, ৩১৬এল স্টিল হার্ডওয়্যার ও ১৯টি ইন্টারঅ্যাক্টিভ স্লাইডার ইঞ্জিন।',
      backToApps: '← অ্যাপস',
      savedLookbook: 'সংরক্ষিত লুকবুক',
      autoplayOn: 'অটোপ্লে চালু',
      autoplayPaused: 'বিরতি',
      theaterEnter: 'থিয়েটার মোড',
      theaterExit: 'থিয়েটার বন্ধ',
      customizePhotos: 'ছবি কাস্টমাইজ',
      lightbox: 'সিনেমা লাইটবক্স',
      allDrops: 'সকল ড্রপস',
      searchPlaceholder: 'ড্রপের নাম, কোড বা উপাদান খুঁজুন...',
      inspectPreorder: 'পরিদর্শন ও প্রি-অর্ডার',
      copyDropLink: 'ড্রপ লিঙ্ক কপি',
      remixStoryboard: 'স্টোরিবোর্ডে চালু করুন ↗',
      save: 'সংরক্ষণ',
      saved: 'সংরক্ষিত',
      editSection: 'ছবি সম্পাদনা',
      hoverHint: 'অ্যাকশন দেখতে মাউস রাখুন',
    },
    sections: buildLocalizedSections(
      'প্রবেশ',
      { commerce: 'কমার্স', content: 'মিডিয়া', manuf: 'ম্যানুফ্যাকচারিং', lifestyle: 'লাইফস্টাইল', food: 'কৃষি ও খাদ্য', apps: 'অ্যাপস' },
      {
        d2c: { title: 'ডি২সি শপ', sub: 'হ্যান্ডস অ্যান্ড হেড কনজিউমার কমার্স', desc: 'প্রিমিয়াম চামড়াজাত পণ্য, ড্রপস ও সরাসরি হোয়াটসঅ্যাপ অর্ডার।', cta: 'শপে যান', status: 'নতুন ড্রপ · ভল্ট লেদার সিরিজ · লাইভ' },
        arutemika: { title: 'আরুতেমিকা', sub: 'বি২বি ও কর্পোরেট পাইকারি কমার্স', desc: 'কর্পোরেট ও পাইকারি ক্রেতাদের জন্য বাল্ক ক্যাটালগ ও অর্ডার।', cta: 'বি২বি-তে যান', status: 'বাল্ক অর্ডার চালু · এন্টারপ্রাইজ ক্যাটালগ' },
        articles: { title: 'প্রবন্ধ', sub: 'গবেষণা, নকশা ও প্রযুক্তি', desc: 'শিল্প নকশা ও কৃত্রিম বুদ্ধিমত্তা নিয়ে গভীর বিশ্লেষণ।', cta: 'প্রবন্ধ পড়ুন', status: 'নতুন প্রবন্ধ · এআই আর্কিটেকচার' },
        studio: { title: 'স্টুডিও', sub: 'হ্যান্ডফিল্ম ও স্টোরিবোর্ড সিনেমা ইঞ্জিন', desc: 'ওয়েবজিএল২ এআই ভিডিও প্ল্যাটফর্ম ও এনএলই এডিটর।', cta: 'স্টুডিওতে যান', status: 'হ্যান্ডফিল্ম · ওয়েবজিএল২ সক্রিয়' },
        aural: { title: 'অরাল', sub: 'শব্দ ও অডিও ইঞ্জিনিয়ারিং', desc: 'অ্যাকোস্টিক রিসার্চ ও পরিবেষ্টিত সাউন্ডস্কেপ।', cta: 'শুনুন', status: 'সাউন্ড ল্যাব · ফ্রিকোয়েন্সি লাইভ' },
        leather: { title: 'লেদার', sub: 'চামড়াজাত পণ্য ও ট্যানারি সোর্সিং', desc: 'ট্যানারি পার্টনারশিপ ও চামড়াজাত পণ্যের উৎপাদন।', cta: 'লেদারে যান', status: 'ট্যানারি অডিট ও প্রকিউরমেন্ট' },
        bracelets: { title: 'ব্রেসলেটস', sub: '৩১৬এল/৫১৬এসএস হার্ডওয়্যার ও কারুকাজ', desc: 'স্টেইনলেস স্টিল ৩১৬এল হার্ডওয়্যার ও হাতে বোনা কর্ড।', cta: 'ব্রেসলেটসে যান', status: 'হার্ডওয়্যার উইং · ৩১৬এল লাইভ' },
      }
    ),
    ticker: {
      prefix: 'ইকোসিস্টেম স্ট্যাটাস',
      live: 'লাইভ',
      pause: 'থামুন',
      resume: 'চালান',
    },
    command: {
      placeholder: 'পোর্টালের নাম, শর্টকোড (যেমন b2b, shop) বা কমান্ড লিখুন...',
      noResults: 'কোনো মিল পাওয়া যায়নি',
      jumpTo: 'সরাসরি পোর্টাল',
      actions: 'ওয়ার্কস্পেস অ্যাকশন',
      quickSwitch: 'ভাষা ও মোড পরিবর্তন',
      shortcuts: 'শর্টকাট',
      escToClose: 'বন্ধ করতে ESC চাপুন',
    },
    newsletter: {
      badge: 'এইচঅ্যান্ডএইচ ডিসপ্যাচ',
      title: 'ইকোসিস্টেম ইন্টেলিজেন্স ও রিলিজ',
      subtitle: 'নতুন হার্ডওয়্যার ড্রপ, সিনেমা রিলিজ এবং প্রযুক্তি ব্রিফিং।',
      placeholder: 'আপনার ইমেইল ঠিকানা লিখুন...',
      submit: 'সাবস্ক্রাইব',
      success: 'নিবন্ধিত হয়েছে। হ্যান্ডস অ্যান্ড হেড ডিসপ্যাচে স্বাগতম।',
      note: 'কোনো স্প্যাম নয়। আমাদের স্টুডিও থেকে এনক্রিপ্ট করা বার্তা।',
    },
    returning: {
      welcomeBack: 'মাস্টার ওএসে পুনরায় স্বাগতম।',
      continueTo: 'ফিরে যান:',
      explored: 'দেখা হয়েছে',
      allExplored: 'সকল পোর্টাল দেখা হয়েছে',
    },
    map: {
      title: 'ইকোসিস্টেম আর্কিটেকচার ম্যাপ',
      subtitle: 'সকল সক্রিয় পোর্টাল এবং ইঞ্জিনের সম্পর্কযুক্ত ভিজ্যুয়াল ম্যাপ',
      listView: 'তালিকা ভিউ',
      mapView: 'রিলেশনাল ম্যাপ',
      clusters: {
        commerce: 'কমার্স ও ড্রপস',
        media: 'সম্পাদকীয় ও সিনেমা',
        engines: 'ওএস ইঞ্জিন ও টুলস',
      },
      nodeVisited: 'ইতিমধ্যে দেখা হয়েছে',
      nodeUnvisited: 'অদেখা পোর্টাল',
      clickToJump: 'সরাসরি যেতে নোডে ক্লিক করুন',
    },
    liveEmbed: {
      interactiveMode: 'ইন্টারেক্টিভ মোড',
      viewMode: 'ভিউ মোড',
      fullscreen: 'বড় ভিউ',
      exitFullscreen: 'সাধারণ ভিউ',
      fallbackMessage: 'সরাসরি লাইভ স্ট্রিম প্রিভিউ সক্রিয়।',
      retry: 'রিলোড করুন',
      openDirect: 'নতুন উইন্ডোতে খুলুন',
    },
  },
  hi: {
    brand: {
      name: 'हैंड्स एंड हेड',
      tagline: 'मास्टर ओएस',
      subline: 'एकीकृत डिजिटल वर्कस्पेस और इकोसिस्टम',
    },
    theme: {
      switchToLight: 'लाइट मोड पर स्विच करें',
      switchToDark: 'डार्क मोड पर स्विच करें',
      lightLabel: 'लाइट',
      darkLabel: 'डार्क',
      selectLanguage: 'भाषा चुनें',
    },
    nav: {
      home: 'होम',
      handfilm: 'हैंडफिल्म',
      rawx: 'RAWx',
      apps: 'ऐप्स',
      sliders: 'स्लाइडर्स',
      stage: 'स्टेज',
      ecosystem: 'इकोसिस्टम',
      sliders16: '19 स्लाइडर्स',
      tasks: 'कार्य',
      index: 'सूची',
      map: 'मैप',
      speed: 'गति',
      grade: 'ग्रेड',
      sound: 'ध्वनि',
      soundOn: 'ऑडियो चालू',
      soundOff: 'ऑडियो बंद',
      installApp: 'ऐप इंस्टॉल',
      addSite: '+ साइट जोड़ें',
      searchOrJump: 'त्वरित खोज (⌘K)',
      commandPalette: 'कमांड पैलेट',
    },
    actions: {
      enter: 'प्रवेश करें',
      view: 'देखें',
      explore: 'एक्सप्लोर करें',
      read: 'लेख पढ़ें',
      stream: 'फिल्म देखें',
      copyLink: 'लिंक कॉपी',
      linkCopied: 'लिंक कॉपी हुआ!',
      share: 'साझा करें',
      close: 'बंद करें',
      back: 'वापस',
      continueLast: 'सत्र फिर शुरू करें',
      dismiss: 'हटाएं',
      filterBySection: 'विभाग द्वारा फ़िल्टर',
      clearFilter: 'फ़िल्टर हटाएं',
    },
    home: {
      eyebrow: 'हैंड्स एंड हेड एंटरप्राइज ओएस',
      headline: 'HANDS & HEAD',
      motto: 'एक कोर, अनेक संसार।',
      subtitle: 'WebGL2 सिनेमा इंजन, डायरेक्ट B2B इंडस्ट्रियल विंग्स और 24 इकोसिस्टम ऐप्स एक कोर पर।',
      exploreAppsBtn: '24 ऐप्स देखें',
      slidersBtn: 'RAWx 19 स्टूडियो',
      whatsappBtn: 'व्हाट्सएप हब',
      routingTitle: 'ओएस रूटिंग मैट्रिक्स',
      pillarsEyebrow: 'मुख्य वास्तुकला',
      pillarsTitle: 'तीन प्रमुख एंटरप्राइज स्तंभ',
      pillarsSub: 'विवरण और त्वरित लॉन्च देखने के लिए कार्ड पर होवर करें',
      openWingCta: 'विंग खोलें →',
      openStoryboardCta: 'स्टोरीबोर्ड में खोलें ↗',
      openAppsCta: 'विंग खोलें →',
      directoryEyebrow: 'इकोसिस्टम टोपोलॉजी',
      directoryTitle: 'सभी सक्रिय पोर्टल्स',
      dispatchEyebrow: 'डायरेक्ट एंटरप्राइज डिस्पैच · [मेन हब]',
      dispatchTitle: 'B2B सोर्सिंग, हैंडफिल्म प्रोडक्शन या कस्टम ओएस चाहिए?',
      dispatchSubtitle: 'सीधे WhatsApp पर HANDS & HEAD ऑपरेशंस डेस्क से जुड़ें।',
      dispatchBtn: 'व्हाट्सएप पर संदेश भेजें',
      liveNodesLabel: 'सक्रिय नोड्स',
      syncMeshLabel: 'सिंक मेश',
      ecosystemStageLabel: 'इकोसिस्टम स्टेज',
      visualEngineLabel: 'RAWx विजुअल इंजन',
      activeTasksLabel: 'सक्रिय कार्य',
      masterClockLabel: 'मास्टर क्लॉक (UTC)',
      pillarCards: {
        storyboardBadge: '01 // WEBGL2 सिनेमा',
        storyboardTitle: 'हैंडफिल्म स्टोरीबोर्ड',
        storyboardSummary: 'ब्राउज़र-आधारित WebGL2 AI वीडियो स्टूडियो, NLE एडिटर और क्लाउडफ्लेयर होस्ट।',
        b2bBadge: '02 // B2B इंडस्ट्रियल',
        b2bTitle: 'ढाका B2B विंग्स',
        b2bSummary: 'सीधे फैक्ट्री से 300 GSM कॉटन, डिस्ट्रेस्ड लेदर और 316L स्टेनलेस स्टील हार्डवेयर।',
        appsBadge: '03 // ओएस मैट्रिक्स',
        appsTitle: '24 इकोसिस्टम ऐप्स',
        appsSummary: 'D2C कॉमर्स, बॉटैनिकल कंसीयज, साउंड लैब्स और क्लाउड टूल्स के लिए त्वरित स्टेज।',
      },
    },
    handfilm: {
      studioLabel: 'हैंडफिल्म स्टूडियो',
      heroHeadlinePrefix: 'सभी के लिए AI वीडियो ',
      heroHeadlineAccent: 'स्टूडियो',
      heroSubline: 'Easy, Beast, CapCut या AD Studio को सीधे WebGL2 स्टोरीबोर्ड में खोलें।',
      tryOnline: 'ऑनलाइन मुफ़्त चलाएं',
      downloadBtn: 'डेस्कटॉप / एंड्रॉइड',
      modelsEyebrow: 'AI और एडिटिंग आर्किटेक्चर',
      modelsTitle: 'सही इंजन चुनें। एक क्लिक में लॉन्च करें।',
      modelsSub: 'स्पेसिफिकेशन देखने और लॉन्च करने के लिए किसी भी कार्ड पर होवर करें।',
      filterAll: 'सभी मॉडल (6)',
      filterEditor: 'NLE मोड्स',
      filterAi: 'विज़न और रिफ्रेम',
      filterCommerce: 'AD स्टूडियो',
      launchStoryboard: 'स्टोरीबोर्ड में खोलें ↗',
      workflowEyebrow: 'तीन चरण पाइपलाइन',
      workflowTitle: 'मिनटों में आइडिया से मास्टर कट',
      discoverEyebrow: 'टेम्पलेट्स और ट्यूटोरियल',
      discoverTitle: 'तैयार स्टोरीबोर्ड ब्लूप्रिंट',
      pricingEyebrow: 'संस्करण',
      pricingTitle: 'मुफ़्त शुरू करें। प्रो स्टूडियो तक बढ़ें।',
      stickySlogan: 'तेज़ और स्मार्ट एडिटिंग करें',
      tapHint: 'देखने के लिए होवर करें',
      subnav: {
        products: 'उत्पाद',
        features: 'विशेषताएं',
        models: 'AI मॉडल',
        integrations: 'इंटीग्रेशन',
        solutions: 'समाधान',
        discover: 'खोजें',
        pricing: 'कीमतें',
      },
    },
    rawx: {
      studioBadge: 'प्री-ऑर्डर और कस्टम स्टूडियो',
      heroTitle: 'लेदर, स्टील और हेवीवेट',
      heroSubtitle: '320 GSM कॉम्ब्ड कॉटन, फुल-ग्रेन लेदर, 316L स्टील हार्डवेयर और 19 इंटरएक्टिव स्लाइडर।',
      backToApps: '← ऐप्स',
      savedLookbook: 'सहेजी गई लुकबुक',
      autoplayOn: 'ऑटोप्ले',
      autoplayPaused: 'रुका हुआ',
      theaterEnter: 'थिएटर मोड',
      theaterExit: 'थिएटर बंद',
      customizePhotos: 'फ़ोटो कस्टमाइज़ करें',
      lightbox: 'सिनेमा लाइटबॉक्स',
      allDrops: 'सभी ड्रॉप्स',
      searchPlaceholder: 'ड्रॉप नाम, कोड या सामग्री खोजें...',
      inspectPreorder: 'देखें और प्री-ऑर्डर',
      copyDropLink: 'ड्रॉप लिंक कॉपी',
      remixStoryboard: 'स्टोरीबोर्ड में खोलें ↗',
      save: 'सहेजें',
      saved: 'सहेजा गया',
      editSection: 'फ़ोटो बदलें',
      hoverHint: 'विकल्पों के लिए होवर करें',
    },
    sections: buildLocalizedSections(
      'खोलें',
      { commerce: 'कॉमर्स', content: 'मीडिया', manuf: 'मैन्युफैक्चरिंग', lifestyle: 'लाइफस्टाइल', food: 'कृषि और खाद्य', apps: 'ऐप्स' },
      {
        d2c: { title: 'D2C शॉप', sub: 'उपभोक्ता कॉमर्स', desc: 'प्रीमियम लेदर उत्पाद, ड्रॉप्स और व्हाट्सएप ऑर्डरिंग।', cta: 'शॉप खोलें' },
        arutemika: { title: 'अरुतेमिका', sub: 'B2B और होलसेल कॉमर्स', desc: 'कॉर्पोरेट खरीदारों के लिए थोक कैटलॉग।', cta: 'B2B खोलें' },
        studio: { title: 'स्टूडियो', sub: 'हैंडफिल्म WebGL2 सिनेमा इंजन', desc: 'ब्राउज़र-आधारित AI वीडियो प्लेटफॉर्म।', cta: 'स्टूडियो खोलें' },
      }
    ),
    ticker: { prefix: 'इकोसिस्टम स्थिति', live: 'लाइव', pause: 'रोकें', resume: 'चलाएं' },
    command: {
      placeholder: 'पोर्टल नाम, शॉर्टकोड (जैसे b2b, shop) या कमांड टाइप करें...',
      noResults: 'कोई मिलान पोर्टल नहीं मिला',
      jumpTo: 'सीधे पोर्टल',
      actions: 'वर्कस्पेस क्रियाएं',
      quickSwitch: 'भाषा / मोड बदलें',
      shortcuts: 'शॉर्टकट',
      escToClose: 'बंद करने के लिए ESC दबाएं',
    },
    newsletter: {
      badge: 'H&H डिस्पैच',
      title: 'इकोसिस्टम अपडेट्स और रिलीज़',
      subtitle: 'हार्डवेयर ड्रॉप्स, सिनेमा रिलीज़ और तकनीकी जानकारी।',
      placeholder: 'अपना ईमेल दर्ज करें...',
      submit: 'सदस्य बनें',
      success: 'पंजीकृत! HANDS & HEAD डिस्पैच में स्वागत है।',
      note: 'कोई स्पैम नहीं। एन्क्रिप्टेड डिलीवरी।',
    },
    returning: { welcomeBack: 'मास्टर ओएस में पुनः स्वागत है।', continueTo: 'जारी रखें:', explored: 'देखा गया', allExplored: 'सभी पोर्टल देखे गए' },
    map: {
      title: 'इकोसिस्टम आर्किटेक्चर मैप',
      subtitle: 'सभी सक्रिय पोर्टल्स और इंजनों का इंटरैक्टिव नेटवर्क',
      listView: 'सूची दृश्य',
      mapView: 'रिलेशनल मैप',
      clusters: { commerce: 'कॉमर्स और ड्रॉप्स', media: 'संपादकीय और सिनेमा', engines: 'ओएस इंजन और टूल्स' },
      nodeVisited: 'सत्र में देखा गया',
      nodeUnvisited: 'अन्वेषित नहीं',
      clickToJump: 'सीधे जाने के लिए नोड क्लिक करें',
    },
    liveEmbed: {
      interactiveMode: 'इंटरैक्टिव मोड',
      viewMode: 'व्यू मोड',
      fullscreen: 'बड़ा करें',
      exitFullscreen: 'सामान्य करें',
      fallbackMessage: 'लाइव स्ट्रीम प्रीव्यू सक्रिय।',
      retry: 'रीलोड करें',
      openDirect: 'नई विंडो में खोलें',
    },
  },
  zh: {
    brand: {
      name: 'HANDS & HEAD',
      tagline: 'MASTER OS',
      subline: '统一数字工作空间与生态系统',
    },
    theme: {
      switchToLight: '切换到浅色模式',
      switchToDark: '切换到深色模式',
      lightLabel: '浅色',
      darkLabel: '深色',
      selectLanguage: '选择语言',
    },
    nav: {
      home: '首页',
      handfilm: 'HANDFILM',
      rawx: 'RAWx',
      apps: '应用',
      sliders: '滑块',
      stage: '舞台',
      ecosystem: '生态',
      sliders16: '19 滑块',
      tasks: '任务',
      index: '索引',
      map: '地图',
      speed: '速度',
      grade: '调色',
      sound: '环境音',
      soundOn: '音频开启',
      soundOff: '音频关闭',
      installApp: '安装应用',
      addSite: '+ 添加站点',
      searchOrJump: '快速跳转 (⌘K)',
      commandPalette: '命令面板',
    },
    actions: {
      enter: '进入门户',
      view: '查看',
      explore: '探索',
      read: '阅读文章',
      stream: '进入影院',
      copyLink: '复制链接',
      linkCopied: '已复制链接!',
      share: '分享',
      close: '关闭',
      back: '返回',
      continueLast: '继续会话',
      dismiss: '忽略',
      filterBySection: '按模块筛选',
      clearFilter: '清除筛选',
    },
    home: {
      eyebrow: 'HANDS & HEAD 企业操作系统',
      headline: 'HANDS & HEAD',
      motto: '一核多界，万物互联。',
      subtitle: '集 WebGL2 AI 影视引擎、源头 B2B 工业制造矩阵与 24 个生态应用模块于一体的零延迟核心。',
      exploreAppsBtn: '探索 24 个应用',
      slidersBtn: 'RAWx 19 引擎',
      whatsappBtn: 'WhatsApp 专线',
      routingTitle: 'OS 路由矩阵',
      pillarsEyebrow: '核心架构',
      pillarsTitle: '三大企业级运行支柱',
      pillarsSub: '悬停卡片即可展开详细规格与一键直达操作',
      openWingCta: '打开板块 →',
      openStoryboardCta: '在 Storyboard 中启动 ↗',
      openAppsCta: '打开板块 →',
      directoryEyebrow: '生态拓扑',
      directoryTitle: '所有活跃门户网站',
      dispatchEyebrow: '企业直连调度 · [主枢纽]',
      dispatchTitle: '需要 B2B 采购、Handfilm 制作或系统集成？',
      dispatchSubtitle: '通过 WhatsApp 直接联系 HANDS & HEAD 执行运营团队。',
      dispatchBtn: '发送 WhatsApp 消息',
      liveNodesLabel: '活跃节点',
      syncMeshLabel: '同步网络',
      ecosystemStageLabel: '生态舞台',
      visualEngineLabel: 'RAWx 视觉引擎',
      activeTasksLabel: '活跃任务',
      masterClockLabel: '主时钟 (UTC)',
      pillarCards: {
        storyboardBadge: '01 // WEBGL2 影视',
        storyboardTitle: 'HandFilm 故事板',
        storyboardSummary: '浏览器原生 WebGL2 AI 视频工作站、非线性剪辑与 Cloudflare 边缘托管。',
        b2bBadge: '02 // B2B 工业制造',
        b2bTitle: '达卡 B2B 制造中心',
        b2bSummary: '源头直供 300 GSM 重磅纯棉、做旧头层牛皮及 316L 手术级精钢五金。',
        appsBadge: '03 // OS 应用矩阵',
        appsTitle: '24 生态应用矩阵',
        appsSummary: '零延迟水平舞台引擎，连接 D2C 零售、花艺服务、声学实验室与云端工具。',
      },
    },
    handfilm: {
      studioLabel: 'HANDFILM 工作室',
      heroHeadlinePrefix: '面向所有人的 AI 视频',
      heroHeadlineAccent: '创作引擎',
      heroSubline: '一键启动 Easy、Beast、CapCut 或 AD Studio 进入 WebGL2 故事板。',
      tryOnline: '免费在线试用',
      downloadBtn: '桌面端 / 安卓版',
      modelsEyebrow: 'AI 与剪辑核心架构',
      modelsTitle: '选择理想模型，一键直达工作区。',
      modelsSub: '悬停或轻触任意卡片以查看参数并启动 Storyboard。',
      filterAll: '全部模型 (6)',
      filterEditor: '剪辑模式',
      filterAi: '视觉与重构',
      filterCommerce: '广告工作室',
      launchStoryboard: '在 Storyboard 中启动 ↗',
      workflowEyebrow: '三步极速流程',
      workflowTitle: '数分钟内从灵感到成片',
      discoverEyebrow: '模板与教程',
      discoverTitle: '即用型故事板蓝图',
      pricingEyebrow: '版本方案',
      pricingTitle: '浏览器免费起步，随时升级专业工作站。',
      stickySlogan: '更智能地剪辑，更高效地创作',
      tapHint: '悬停展开详情',
      subnav: {
        products: '产品矩阵',
        features: '核心特性',
        models: 'AI 模型',
        integrations: '生态集成',
        solutions: '行业方案',
        discover: '发现模板',
        pricing: '定价方案',
      },
    },
    rawx: {
      studioBadge: '按需定制与限量预售',
      heroTitle: '皮革、精钢与重磅服饰',
      heroSubtitle: '小批量 320 GSM 精梳棉、头层牛皮、316L 精钢五金与 19 组实时滑块引擎。',
      backToApps: '← 返回应用',
      savedLookbook: '已收藏画册',
      autoplayOn: '自动播放',
      autoplayPaused: '已暂停',
      theaterEnter: '影院模式',
      theaterExit: '退出影院',
      customizePhotos: '自定义图片',
      lightbox: '全景灯箱',
      allDrops: '全部系列',
      searchPlaceholder: '搜索系列名称、编号或材质...',
      inspectPreorder: '查看详情与预订',
      copyDropLink: '复制系列链接',
      remixStoryboard: '在 Storyboard 中启动 ↗',
      save: '收藏',
      saved: '已收藏',
      editSection: '编辑图片',
      hoverHint: '悬停查看详情',
    },
    sections: buildLocalizedSections(
      '进入',
      { commerce: '商业', content: '内容媒体', manuf: '工业制造', lifestyle: '生活方式', food: '农业食品', apps: '软件应用' },
      {
        d2c: { title: 'D2C 商店', sub: '直面消费者精品零售', desc: '小批量皮革、重磅卫衣及 WhatsApp 快捷下单。', cta: '进入商店' },
        arutemika: { title: 'ARUTEMIKA', sub: 'B2B 与企业级批发采购', desc: '企业采购目录、大宗定制及账户管理。', cta: '进入 B2B' },
        studio: { title: 'STUDIO 影棚', sub: 'Handfilm WebGL2 AI 视频平台', desc: '浏览器原生 AI 视频剪辑与 Cloudflare 流媒体。', cta: '进入影棚' },
      }
    ),
    ticker: { prefix: '系统状态', live: '实时', pause: '暂停', resume: '恢复' },
    command: {
      placeholder: '输入门户名称、简码（如 b2b, shop）或指令...',
      noResults: '未找到匹配的生态门户',
      jumpTo: '直达门户',
      actions: '工作区操作',
      quickSwitch: '切换语言与模式',
      shortcuts: '快捷键',
      escToClose: '按 ESC 退出',
    },
    newsletter: {
      badge: 'H&H 通讯简报',
      title: '生态动态与新品发布',
      subtitle: '获取硬件发售、影视更新与系统架构简报。',
      placeholder: '输入企业或个人邮箱...',
      submit: '立即订阅',
      success: '已注册，欢迎加入 Hands & Head 通讯网络。',
      note: '绝无垃圾邮件，全球工作室网络加密投递。',
    },
    returning: { welcomeBack: '欢迎回到 Master OS。', continueTo: '继续访问:', explored: '已探索', allExplored: '已探索全部门户' },
    map: {
      title: '生态系统架构图谱',
      subtitle: '所有活跃门户与核心引擎的实时关系网络',
      listView: '列表视图',
      mapView: '关系图谱',
      clusters: { commerce: '商业与发售', media: '内容与影视', engines: 'OS 引擎与工具' },
      nodeVisited: '本次会话已访问',
      nodeUnvisited: '未探索门户',
      clickToJump: '点击节点直接跳转',
    },
    liveEmbed: {
      interactiveMode: '交互模式',
      viewMode: '浏览模式',
      fullscreen: '全屏展开',
      exitFullscreen: '退出全屏',
      fallbackMessage: '实时预览流已激活。',
      retry: '重新加载',
      openDirect: '在新窗口打开',
    },
  },
  ja: {
    brand: {
      name: 'HANDS & HEAD',
      tagline: 'MASTER OS',
      subline: '統合デジタルワークスペース＆エコシステム',
    },
    theme: {
      switchToLight: 'ライトモードへ切替',
      switchToDark: 'ダークモードへ切替',
      lightLabel: 'ライト',
      darkLabel: 'ダーク',
      selectLanguage: '言語を選択',
    },
    nav: {
      home: 'ホーム',
      handfilm: 'HANDFILM',
      rawx: 'RAWx',
      apps: 'アプリ',
      sliders: 'スライダー',
      stage: 'ステージ',
      ecosystem: 'エコシステム',
      sliders16: '19 スライダー',
      tasks: 'タスク',
      index: '目次',
      map: 'マップ',
      speed: '速度',
      grade: 'カラー',
      sound: '環境音',
      soundOn: '音声オン',
      soundOff: '音声オフ',
      installApp: 'アプリ導入',
      addSite: '+ サイト追加',
      searchOrJump: 'クイック移動 (⌘K)',
      commandPalette: 'コマンドパレット',
    },
    actions: {
      enter: 'ポータルへ',
      view: '表示',
      explore: '探索する',
      read: '記事を読む',
      stream: 'スタジオへ',
      copyLink: 'リンクコピー',
      linkCopied: 'コピー完了!',
      share: '共有',
      close: '閉じる',
      back: '戻る',
      continueLast: '前回を再開',
      dismiss: '閉じる',
      filterBySection: 'セクション別',
      clearFilter: '絞り込み解除',
    },
    home: {
      eyebrow: 'HANDS & HEAD エンタープライズ OS',
      headline: 'HANDS & HEAD',
      motto: '一つの核、広がる世界。',
      subtitle: 'WebGL2 シネマエンジン、直営 B2B 製造ライン、24 モジュールをゼロ遅延の統合コアで運用。',
      exploreAppsBtn: '24 アプリを見る',
      slidersBtn: 'RAWx 19 スタジオ',
      whatsappBtn: 'WhatsApp ハブ',
      routingTitle: 'OS ルーティングマトリクス',
      pillarsEyebrow: 'コアアーキテクチャ',
      pillarsTitle: '3つの基幹オペレーション柱',
      pillarsSub: 'カードにカーソルを合わせると詳細とアクションが表示されます',
      openWingCta: 'ウィングを開く →',
      openStoryboardCta: 'Storyboard で起動 ↗',
      openAppsCta: 'ウィングを開く →',
      directoryEyebrow: 'エコシステム構成',
      directoryTitle: '全アクティブポータル一覧',
      dispatchEyebrow: 'ダイレクトエンタープライズ窓口 · [Main Hub]',
      dispatchTitle: 'B2B 調達・Handfilm 制作・OS 連携のご相談はこちら',
      dispatchSubtitle: 'WhatsApp 経由で HANDS & HEAD 統括デスクへ直接接続します。',
      dispatchBtn: 'WhatsApp で連絡',
      liveNodesLabel: '稼働ノード',
      syncMeshLabel: '同期メッシュ',
      ecosystemStageLabel: 'ステージ',
      visualEngineLabel: 'RAWx エンジン',
      activeTasksLabel: '進行タスク',
      masterClockLabel: '基準時刻 (UTC)',
      pillarCards: {
        storyboardBadge: '01 // WEBGL2 シネマ',
        storyboardTitle: 'HandFilm ストーリーボード',
        storyboardSummary: 'ブラウザ完結型の WebGL2 AI 映像スタジオ、NLE エディタ＆Cloudflare 配信基盤。',
        b2bBadge: '02 // B2B 製造拠点',
        b2bTitle: 'ダッカ B2B 製造ライン',
        b2bSummary: '300 GSM ヘビーウェイトコットン、本革ジャケット、316L ステンレス金具を直接生産。',
        appsBadge: '03 // OS マトリクス',
        appsTitle: '24 エコシステムアプリ',
        appsSummary: 'D2C ストア、ボタニカル事業、音響ラボ、業務クラウドを結ぶ超高速ステージ。',
      },
    },
    handfilm: {
      studioLabel: 'HANDFILM スタジオ',
      heroHeadlinePrefix: 'すべての人のための AI 動画',
      heroHeadlineAccent: 'スタジオ',
      heroSubline: 'Easy・Beast・CapCut・AD Studio をワンクリックで Storyboard へ起動。',
      tryOnline: '無料でオンライン開始',
      downloadBtn: 'デスクトップ / Android',
      modelsEyebrow: 'AI ＆ 編集アーキテクチャ',
      modelsTitle: '最適なエンジンを選び、ワンクリックで起動。',
      modelsSub: 'カードにホバーして仕様確認と Storyboard 起動を行えます。',
      filterAll: 'すべて (6)',
      filterEditor: 'NLE モード',
      filterAi: 'ビジョン＆リフレーム',
      filterCommerce: 'AD スタジオ',
      launchStoryboard: 'Storyboard で起動 ↗',
      workflowEyebrow: '3ステップ工程',
      workflowTitle: 'アイデアから数分でマスター編集',
      discoverEyebrow: 'テンプレート＆解説',
      discoverTitle: '即戦力ストーリーボード集',
      pricingEyebrow: 'エディション',
      pricingTitle: 'ブラウザで無料開始。プロ環境へ拡張。',
      stickySlogan: 'スマートに編集、高速に制作',
      tapHint: 'ホバーで詳細表示',
      subnav: {
        products: 'プロダクト',
        features: '機能',
        models: 'AI モデル',
        integrations: '連携',
        solutions: 'ソリューション',
        discover: 'テンプレート',
        pricing: '料金プラン',
      },
    },
    rawx: {
      studioBadge: '受注生産＆予約スタジオ',
      heroTitle: '本革・316L鋼・重厚アパレル',
      heroSubtitle: '320 GSM コットン、フルグレインレザー、316L 金具と19種類の対話型スライダー。',
      backToApps: '← アプリ一覧',
      savedLookbook: '保存済みルックブック',
      autoplayOn: '自動再生',
      autoplayPaused: '一時停止',
      theaterEnter: 'シアターモード',
      theaterExit: 'シアター終了',
      customizePhotos: '写真カスタマイズ',
      lightbox: 'シネマライトボックス',
      allDrops: '全ドロップ',
      searchPlaceholder: 'ドロップ名・素材で絞り込み...',
      inspectPreorder: '詳細確認・予約',
      copyDropLink: 'リンクをコピー',
      remixStoryboard: 'Storyboard で起動 ↗',
      save: '保存',
      saved: '保存済み',
      editSection: '写真編集',
      hoverHint: 'ホバーして操作を表示',
    },
    sections: buildLocalizedSections(
      '開く',
      { commerce: 'コマース', content: 'メディア', manuf: '製造拠点', lifestyle: 'ライフスタイル', food: '農産・食品', apps: 'アプリ群' },
      {
        d2c: { title: 'D2C ショップ', sub: '直販コンシューマーストア', desc: '限定レザー製品・ドロップの WhatsApp 優先注文。', cta: 'ショップへ' },
        arutemika: { title: 'ARUTEMIKA', sub: 'B2B 法人卸売ポータル', desc: '法人・卸売バイヤー向け大口調達カタログ。', cta: 'B2B へ' },
        studio: { title: 'STUDIO', sub: 'Handfilm WebGL2 シネマエンジン', desc: 'ブラウザ内蔵 AI ビデオ編集＆Cloudflare 配信。', cta: 'スタジオへ' },
      }
    ),
    ticker: { prefix: 'システム稼働状況', live: '稼働中', pause: '一時停止', resume: '再開' },
    command: {
      placeholder: 'ポータル名、コード (b2b, shop 等)、コマンドを検索...',
      noResults: '一致するポータルが見つかりません',
      jumpTo: 'ポータルへ移動',
      actions: 'ワークスペース操作',
      quickSwitch: '言語・テーマ切替',
      shortcuts: 'ショートカット',
      escToClose: 'ESC で閉じる',
    },
    newsletter: {
      badge: 'H&H ディスパッチ',
      title: '最新リリース＆技術情報',
      subtitle: '新作ドロップ、映像公開、システムアップデートの定期配信。',
      placeholder: 'メールアドレスを入力...',
      submit: '登録する',
      success: '登録完了。Hands & Head ネットワークへようこそ。',
      note: 'スパムなし。暗号化配信。',
    },
    returning: { welcomeBack: 'Master OS へおかえりなさい。', continueTo: '前回の続き:', explored: '閲覧済み', allExplored: '全ポータル閲覧済み' },
    map: {
      title: 'エコシステム構成マップ',
      subtitle: '稼働中の全ポータルとエンジンを結ぶインタラクティブ図',
      listView: 'リスト表示',
      mapView: '相関マップ',
      clusters: { commerce: 'コマース＆ドロップ', media: 'メディア＆シネマ', engines: 'OS エンジン' },
      nodeVisited: '閲覧済み',
      nodeUnvisited: '未閲覧ポータル',
      clickToJump: 'クリックで直接移動',
    },
    liveEmbed: {
      interactiveMode: '対話モード',
      viewMode: '閲覧モード',
      fullscreen: '拡大表示',
      exitFullscreen: '標準表示',
      fallbackMessage: 'ライブプレビュー稼働中。',
      retry: '再読込',
      openDirect: '別ウィンドウで開く',
    },
  },
  es: {
    brand: {
      name: 'HANDS & HEAD',
      tagline: 'MASTER OS',
      subline: 'Espacio Digital Unificado y Ecosistema',
    },
    theme: {
      switchToLight: 'Cambiar a modo claro',
      switchToDark: 'Cambiar a modo oscuro',
      lightLabel: 'Claro',
      darkLabel: 'Oscuro',
      selectLanguage: 'Seleccionar idioma',
    },
    nav: {
      home: 'INICIO',
      handfilm: 'HANDFILM',
      rawx: 'RAWx',
      apps: 'APPS',
      sliders: 'Sliders',
      stage: 'Escenario',
      ecosystem: 'Ecosistema',
      sliders16: '19 Sliders',
      tasks: 'Tareas',
      index: 'Índice',
      map: 'Mapa',
      speed: 'Velocidad',
      grade: 'Color',
      sound: 'Ambiente',
      soundOn: 'Audio Activo',
      soundOff: 'Audio Silenciado',
      installApp: 'Instalar App',
      addSite: '+ Añadir Sitio',
      searchOrJump: 'Salto Rápido (⌘K)',
      commandPalette: 'Paleta de Comandos',
    },
    actions: {
      enter: 'ENTRAR AL PORTAL',
      view: 'VER',
      explore: 'EXPLORAR',
      read: 'LEER ARTÍCULOS',
      stream: 'VER CINE',
      copyLink: 'Copiar Enlace',
      linkCopied: '¡Enlace Copiado!',
      share: 'Compartir',
      close: 'Cerrar',
      back: 'Volver',
      continueLast: 'Reanudar Sesión',
      dismiss: 'Descartar',
      filterBySection: 'Filtrar por Sección',
      clearFilter: 'Limpiar Filtro',
    },
    home: {
      eyebrow: 'HANDS & HEAD ENTERPRISE OS',
      headline: 'HANDS & HEAD',
      motto: 'Un Núcleo, Muchos Mundos.',
      subtitle: 'Motor de Cine WebGL2, Divisiones Industriales B2B y 24 Apps del Ecosistema sobre un solo núcleo.',
      exploreAppsBtn: 'Explorar 24 Apps',
      slidersBtn: 'RAWx 19 Estudios',
      whatsappBtn: 'Centro WhatsApp',
      routingTitle: 'MATRIZ DE ENRUTAMIENTO',
      pillarsEyebrow: 'ARQUITECTURA CENTRAL',
      pillarsTitle: 'Tres Pilares Operativos Empresariales',
      pillarsSub: 'Pasa el cursor sobre cualquier tarjeta para ver especificaciones y acciones',
      openWingCta: 'Abrir División →',
      openStoryboardCta: 'Abrir en Storyboard ↗',
      openAppsCta: 'Abrir División →',
      directoryEyebrow: 'TOPOLOGÍA DEL ECOSISTEMA',
      directoryTitle: 'Todos los Portales Activos',
      dispatchEyebrow: 'DESPACHO DIRECTO · [Via Main Hub]',
      dispatchTitle: '¿Necesitas abastecimiento B2B, producción Handfilm o integración OS?',
      dispatchSubtitle: 'Conecta directamente con operaciones ejecutivas de HANDS & HEAD en WhatsApp.',
      dispatchBtn: 'Mensaje en WhatsApp',
      liveNodesLabel: 'NODOS ACTIVOS',
      syncMeshLabel: 'RED SYNC',
      ecosystemStageLabel: 'ESCENARIO ECOSISTEMA',
      visualEngineLabel: 'MOTOR VISUAL RAWx',
      activeTasksLabel: 'TAREAS ACTIVAS',
      masterClockLabel: 'RELOJ MAESTRO (UTC)',
      pillarCards: {
        storyboardBadge: '01 // CINE WEBGL2',
        storyboardTitle: 'HandFilm Storyboard',
        storyboardSummary: 'Estudio de video IA en WebGL2 desde el navegador, editor NLE y host en Cloudflare.',
        b2bBadge: '02 // B2B INDUSTRIAL',
        b2bTitle: 'Divisiones B2B Dhaka',
        b2bSummary: 'Producción directa de RMG, algodón de 300 GSM, cuero genuino y herrajes de acero 316L.',
        appsBadge: '03 // MATRIZ OS',
        appsTitle: '24 Apps Ecosistema',
        appsSummary: 'Escenario de latencia cero conectando comercio D2C, laboratorios de audio y apps en la nube.',
      },
    },
    handfilm: {
      studioLabel: 'ESTUDIO HANDFILM',
      heroHeadlinePrefix: 'Editor IA de Foto y Video para ',
      heroHeadlineAccent: 'Todos',
      heroSubline: 'Lanza Modo Fácil, Bestia, CapCut o AD Studio directo en Storyboard.',
      tryOnline: 'Probar Gratis Online',
      downloadBtn: 'Escritorio / Android',
      modelsEyebrow: 'ARQUITECTURA IA Y EDICIÓN',
      modelsTitle: 'Elige el Motor Ideal. Lanza en un Clic.',
      modelsSub: 'Pasa el cursor o toca cualquier tarjeta para ver detalles y abrir Storyboard.',
      filterAll: 'Todos (6)',
      filterEditor: 'Modos NLE',
      filterAi: 'Visión y Encuadre',
      filterCommerce: 'AD Studio',
      launchStoryboard: 'Abrir en Storyboard ↗',
      workflowEyebrow: 'FLUJO EN TRES PASOS',
      workflowTitle: 'De la Idea al Corte Maestro en Minutos',
      discoverEyebrow: 'PLANTILLAS Y GUÍAS',
      discoverTitle: 'Planos Listos para Storyboard',
      pricingEyebrow: 'EDICIONES',
      pricingTitle: 'Empieza Gratis en la Web. Escala a Pro.',
      stickySlogan: 'Edita más inteligente, crea rápido',
      tapHint: 'Pasa el cursor',
      subnav: {
        products: 'Productos',
        features: 'Funciones',
        models: 'Modelos IA',
        integrations: 'Integraciones',
        solutions: 'Soluciones',
        discover: 'Descubrir',
        pricing: 'Precios',
      },
    },
    rawx: {
      studioBadge: 'ESTUDIO POD Y PRE-ORDEN JIT',
      heroTitle: 'CUERO, ACERO Y ALTO GRAMAJE',
      heroSubtitle: 'Algodón peinado de 320 GSM, cuero plena flor, acero 316L y 19 motores slider.',
      backToApps: '← Apps',
      savedLookbook: 'Lookbook Guardado',
      autoplayOn: 'AUTOPLAY',
      autoplayPaused: 'PAUSADO',
      theaterEnter: 'Modo Cine',
      theaterExit: 'Salir Cine',
      customizePhotos: 'Personalizar Fotos',
      lightbox: 'Lightbox Cine',
      allDrops: 'TODOS LOS DROPS',
      searchPlaceholder: 'Filtrar por drop, código o material...',
      inspectPreorder: 'Inspeccionar y Reservar',
      copyDropLink: 'Copiar Enlace',
      remixStoryboard: 'Abrir en Storyboard ↗',
      save: 'Guardar',
      saved: 'Guardado',
      editSection: 'Editar Fotos',
      hoverHint: 'Pasa el cursor para opciones',
    },
    sections: buildLocalizedSections(
      'ABRIR',
      { commerce: 'COMERCIO', content: 'CONTENIDO', manuf: 'MANUFACTURA', lifestyle: 'ESTILO DE VIDA', food: 'AGRO Y ALIMENTOS', apps: 'APPS' },
      {
        d2c: { title: 'TIENDA D2C', sub: 'Comercio Directo al Consumidor', desc: 'Lanzamientos limitados de cuero, ropa y pedidos por WhatsApp.', cta: 'IR A LA TIENDA' },
        arutemika: { title: 'ARUTEMIKA', sub: 'Comercio B2B y Mayorista', desc: 'Catálogo corporativo y abastecimiento al por mayor.', cta: 'ENTRAR B2B' },
        studio: { title: 'STUDIO', sub: 'Motor WebGL2 Handfilm y Storyboard', desc: 'Plataforma de video IA y editor NLE en navegador.', cta: 'ENTRAR STUDIO' },
      }
    ),
    ticker: { prefix: 'ESTADO ECOSISTEMA', live: 'EN VIVO', pause: 'PAUSA', resume: 'REANUDAR' },
    command: {
      placeholder: 'Escribe un portal, código (b2b, shop) o comando...',
      noResults: 'No se encontraron portales',
      jumpTo: 'Portales Directos',
      actions: 'Acciones del Sistema',
      quickSwitch: 'Cambiar Idioma / Modo',
      shortcuts: 'Atajos',
      escToClose: 'Pulsa ESC para salir',
    },
    newsletter: {
      badge: 'BOLETÍN H&H',
      title: 'Inteligencia del Ecosistema',
      subtitle: 'Informes periódicos sobre drops, estrenos y arquitectura.',
      placeholder: 'Ingresa tu correo...',
      submit: 'SUSCRIBIRSE',
      success: 'Registrado. Bienvenido al despacho de Hands & Head.',
      note: 'Sin spam. Entrega cifrada en toda nuestra red.',
    },
    returning: { welcomeBack: 'Bienvenido de nuevo a Master OS.', continueTo: 'Continuar a', explored: 'Explorado', allExplored: 'Todos explorados' },
    map: {
      title: 'MAPA DE ARQUITECTURA',
      subtitle: 'Red relacional interactiva de portales y motores activos',
      listView: 'Vista Lista',
      mapView: 'Mapa Relacional',
      clusters: { commerce: 'Comercio y Drops', media: 'Editorial y Cine', engines: 'Motores OS' },
      nodeVisited: 'Visitado en sesión',
      nodeUnvisited: 'Portal sin explorar',
      clickToJump: 'Haz clic para saltar directo',
    },
    liveEmbed: {
      interactiveMode: 'Modo Interactivo',
      viewMode: 'Modo Vista',
      fullscreen: 'Expandir',
      exitFullscreen: 'Minimizar',
      fallbackMessage: 'Vista previa en vivo activa.',
      retry: 'Recargar',
      openDirect: 'Abrir en nueva ventana',
    },
  },
  de: {
    brand: {
      name: 'HANDS & HEAD',
      tagline: 'MASTER OS',
      subline: 'Einheitlicher Digitaler Arbeitsbereich & Ökosystem',
    },
    theme: {
      switchToLight: 'Zum hellen Modus wechseln',
      switchToDark: 'Zum dunklen Modus wechseln',
      lightLabel: 'Hell',
      darkLabel: 'Dunkel',
      selectLanguage: 'Sprache wählen',
    },
    nav: {
      home: 'HOME',
      handfilm: 'HANDFILM',
      rawx: 'RAWx',
      apps: 'APPS',
      sliders: 'Slider',
      stage: 'Bühne',
      ecosystem: 'Ökosystem',
      sliders16: '19 Slider',
      tasks: 'Aufgaben',
      index: 'Index',
      map: 'Karte',
      speed: 'Tempo',
      grade: 'Farblook',
      sound: 'Klang',
      soundOn: 'Audio An',
      soundOff: 'Audio Aus',
      installApp: 'App Installieren',
      addSite: '+ Seite',
      searchOrJump: 'Schnellsprung (⌘K)',
      commandPalette: 'Befehlspalette',
    },
    actions: {
      enter: 'PORTAL ÖFFNEN',
      view: 'ANSEHEN',
      explore: 'ERKUNDEN',
      read: 'ARTIKEL LESEN',
      stream: 'STUDIO STARTEN',
      copyLink: 'Link kopieren',
      linkCopied: 'Kopiert!',
      share: 'Teilen',
      close: 'Schließen',
      back: 'Zurück',
      continueLast: 'Sitzung fortsetzen',
      dismiss: 'Ausblenden',
      filterBySection: 'Nach Bereich filtern',
      clearFilter: 'Filter löschen',
    },
    home: {
      eyebrow: 'HANDS & HEAD ENTERPRISE OS',
      headline: 'HANDS & HEAD',
      motto: 'Ein Kern, Viele Welten.',
      subtitle: 'WebGL2 Cinema Engine, direkte B2B-Produktionsflügel und 24 Ökosystem-Apps auf einem Null-Latenz-Kern.',
      exploreAppsBtn: '24 Apps erkunden',
      slidersBtn: 'RAWx 19 Studios',
      whatsappBtn: 'WhatsApp Hub',
      routingTitle: 'OS ROUTING MATRIX',
      pillarsEyebrow: 'KERNARCHITEKTUR',
      pillarsTitle: 'Drei Enterprise-Betriebssäulen',
      pillarsSub: 'Bewegen Sie den Mauszeiger über eine Karte für Spezifikationen & Aktionen',
      openWingCta: 'Bereich öffnen →',
      openStoryboardCta: 'In Storyboard starten ↗',
      openAppsCta: 'Bereich öffnen →',
      directoryEyebrow: 'ÖKOSYSTEM-TOPOLOGIE',
      directoryTitle: 'Alle aktiven Portale',
      dispatchEyebrow: 'DIREKTER ENTERPRISE-VERSAND · [Main Hub]',
      dispatchTitle: 'B2B-Sourcing, Handfilm-Produktion oder OS-Integration benötigt?',
      dispatchSubtitle: 'Direktverbindung zum HANDS & HEAD Executive-Desk über WhatsApp.',
      dispatchBtn: 'Nachricht per WhatsApp',
      liveNodesLabel: 'AKTIVE KNOTEN',
      syncMeshLabel: 'SYNC-MESH',
      ecosystemStageLabel: 'ÖKOSYSTEM-BÜHNE',
      visualEngineLabel: 'RAWx VISUAL ENGINE',
      activeTasksLabel: 'AKTIVE AUFGABEN',
      masterClockLabel: 'MASTER-UHR (UTC)',
      pillarCards: {
        storyboardBadge: '01 // WEBGL2 KINO',
        storyboardTitle: 'HandFilm Storyboard',
        storyboardSummary: 'Browser-natives WebGL2 KI-Videostudio, NLE-Editor und Cloudflare Video-Hosting.',
        b2bBadge: '02 // B2B INDUSTRIE',
        b2bTitle: 'Dhaka B2B-Werke',
        b2bSummary: 'Direktfertigung von RMG, 300 GSM Baumwolle, Echtleder und 316L Edelstahl-Hardware.',
        appsBadge: '03 // OS MATRIX',
        appsTitle: '24 Ökosystem-Apps',
        appsSummary: 'Ultraschnelle Bühnen-Engine für D2C-Handel, Botanik-Concierge, Audio-Labore und Cloud-Tools.',
      },
    },
    handfilm: {
      studioLabel: 'HANDFILM STUDIO',
      heroHeadlinePrefix: 'KI-Foto- & Video-Editor für ',
      heroHeadlineAccent: 'Alle',
      heroSubline: 'Starte Easy, Beast, CapCut oder AD Studio direkt in WebGL2 Storyboard.',
      tryOnline: 'Kostenlos Online testen',
      downloadBtn: 'Desktop / Android',
      modelsEyebrow: 'KI- & SCHNITT-ARCHITEKTUR',
      modelsTitle: 'Modell wählen. Mit einem Klick starten.',
      modelsSub: 'Karte berühren oder hovern für Pipeline-Details und Storyboard-Start.',
      filterAll: 'Alle Modelle (6)',
      filterEditor: 'NLE-Modi',
      filterAi: 'Vision & Reframe',
      filterCommerce: 'AD Studio',
      launchStoryboard: 'In Storyboard starten ↗',
      workflowEyebrow: 'DREI-SCHRITT-PIPELINE',
      workflowTitle: 'Von der Idee zum Master-Schnitt',
      discoverEyebrow: 'VORLAGEN & TUTORIALS',
      discoverTitle: 'Sofort bereite Storyboard-Blueprints',
      pricingEyebrow: 'EDITIONEN',
      pricingTitle: 'Kostenlos im Browser starten. Auf Pro skalieren.',
      stickySlogan: 'Smarter schneiden, schneller gestalten',
      tapHint: 'Hovern für Details',
      subnav: {
        products: 'Produkte',
        features: 'Funktionen',
        models: 'KI-Modelle',
        integrations: 'Integrationen',
        solutions: 'Lösungen',
        discover: 'Entdecken',
        pricing: 'Preise',
      },
    },
    rawx: {
      studioBadge: 'POD & JIT VORBESTELLUNG',
      heroTitle: 'LEDER, STAHL & HEAVYWEIGHT',
      heroSubtitle: 'Kleinserien aus 320 GSM Baumwolle, Vollrindleder, 316L Stahl & 19 interaktive Slider.',
      backToApps: '← Apps',
      savedLookbook: 'Lookbook',
      autoplayOn: 'AUTOPLAY',
      autoplayPaused: 'PAUSIERT',
      theaterEnter: 'Kinomodus',
      theaterExit: 'Kino beenden',
      customizePhotos: 'Fotos anpassen',
      lightbox: 'Leuchtkasten',
      allDrops: 'ALLE DROPS',
      searchPlaceholder: 'Nach Name, Code oder Material filtern...',
      inspectPreorder: 'Prüfen & Vorbestellen',
      copyDropLink: 'Drop-Link kopieren',
      remixStoryboard: 'In Storyboard starten ↗',
      save: 'Merken',
      saved: 'Gemerkt',
      editSection: 'Fotos ändern',
      hoverHint: 'Hovern für Aktionen',
    },
    sections: buildLocalizedSections(
      'ÖFFNEN',
      { commerce: 'HANDEL', content: 'MEDIEN', manuf: 'FERTIGUNG', lifestyle: 'LIFESTYLE', food: 'AGRAR & FOOD', apps: 'APPS' },
      {
        d2c: { title: 'D2C SHOP', sub: 'Direktvertrieb für Endkunden', desc: 'Limitierte Leder-Drops, Streetwear & WhatsApp-Direktbestellung.', cta: 'ZUM SHOP' },
        arutemika: { title: 'ARUTEMIKA', sub: 'B2B & Großhandel', desc: 'Großhandelskatalog und direkte Fabrikbeschaffung.', cta: 'B2B ÖFFNEN' },
        studio: { title: 'STUDIO', sub: 'Handfilm WebGL2 Kino-Engine', desc: 'Browser-basierte KI-Videoproduktion & Cloudflare Hosting.', cta: 'STUDIO ÖFFNEN' },
      }
    ),
    ticker: { prefix: 'SYSTEMSTATUS', live: 'LIVE', pause: 'PAUSE', resume: 'WEITER' },
    command: {
      placeholder: 'Portalnamen, Kürzel (z. B. b2b, shop) oder Befehl eingeben...',
      noResults: 'Keine passenden Portale gefunden',
      jumpTo: 'Direktportale',
      actions: 'Arbeitsbereich-Aktionen',
      quickSwitch: 'Sprache / Modus wechseln',
      shortcuts: 'Tastaturkürzel',
      escToClose: 'ESC zum Schließen',
    },
    newsletter: {
      badge: 'H&H DISPATCH',
      title: 'Ökosystem-Briefing & Releases',
      subtitle: 'Regelmäßige Updates zu Hardware-Drops, Film-Releases und Architektur.',
      placeholder: 'E-Mail-Adresse eingeben...',
      submit: 'ABONNIEREN',
      success: 'Registriert. Willkommen beim Hands & Head Dispatch.',
      note: 'Kein Spam. Verschlüsselte Zustellung im gesamten Netzwerk.',
    },
    returning: { welcomeBack: 'Willkommen zurück bei Master OS.', continueTo: 'Weiter zu', explored: 'Erkundet', allExplored: 'Alle erkundet' },
    map: {
      title: 'ÖKOSYSTEM-ARCHITEKTURKARTE',
      subtitle: 'Interaktives Beziehungsnetzwerk aller aktiven Portale und Engines',
      listView: 'Listenansicht',
      mapView: 'Beziehungskarte',
      clusters: { commerce: 'Handel & Drops', media: 'Redaktion & Kino', engines: 'OS Engines' },
      nodeVisited: 'In Sitzung besucht',
      nodeUnvisited: 'Noch unentdeckt',
      clickToJump: 'Klicken zum direkten Sprung',
    },
    liveEmbed: {
      interactiveMode: 'Interaktiver Modus',
      viewMode: 'Ansichtsmodus',
      fullscreen: 'Vollbild',
      exitFullscreen: 'Verkleinern',
      fallbackMessage: 'Live-Stream-Vorschau aktiv.',
      retry: 'Neu laden',
      openDirect: 'In neuem Fenster öffnen',
    },
  },
  nl: {
    brand: {
      name: 'HANDS & HEAD',
      tagline: 'MASTER OS',
      subline: 'Geünificeerde Digitale Werkruimte & Ecosysteem',
    },
    theme: {
      switchToLight: 'Schakel naar lichte modus',
      switchToDark: 'Schakel naar donkere modus',
      lightLabel: 'Licht',
      darkLabel: 'Donker',
      selectLanguage: 'Kies taal',
    },
    nav: {
      home: 'HOME',
      handfilm: 'HANDFILM',
      rawx: 'RAWx',
      apps: 'APPS',
      sliders: 'Sliders',
      stage: 'Podium',
      ecosystem: 'Ecosysteem',
      sliders16: '19 Sliders',
      tasks: 'Taken',
      index: 'Index',
      map: 'Kaart',
      speed: 'Snelheid',
      grade: 'Kleur',
      sound: 'Geluid',
      soundOn: 'Audio Aan',
      soundOff: 'Audio Uit',
      installApp: 'App Installeren',
      addSite: '+ Website',
      searchOrJump: 'Snel Springen (⌘K)',
      commandPalette: 'Opdrachtenpalet',
    },
    actions: {
      enter: 'OPEN PORTAAL',
      view: 'BEKIJK',
      explore: 'VERKEN',
      read: 'LEES ARTIKELEN',
      stream: 'OPEN FILM',
      copyLink: 'Link kopiëren',
      linkCopied: 'Gekopieerd!',
      share: 'Delen',
      close: 'Sluiten',
      back: 'Terug',
      continueLast: 'Sessie hervatten',
      dismiss: 'Sluiten',
      filterBySection: 'Filter op sectie',
      clearFilter: 'Filter wissen',
    },
    home: {
      eyebrow: 'HANDS & HEAD ENTERPRISE OS',
      headline: 'HANDS & HEAD',
      motto: 'Eén Kern, Vele Werelden.',
      subtitle: 'WebGL2 Cinema Engine, directe industriële B2B-divisies en 24 ecosysteem-apps op één snelle kern.',
      exploreAppsBtn: 'Verken 24 Apps',
      slidersBtn: 'RAWx 19 Studio’s',
      whatsappBtn: 'WhatsApp Hub',
      routingTitle: 'OS ROUTING MATRIX',
      pillarsEyebrow: 'KERNARCHITECTUUR',
      pillarsTitle: 'Drie Enterprise Pijlers',
      pillarsSub: 'Beweeg over een kaart om specificaties & acties te tonen',
      openWingCta: 'Open Divisie →',
      openStoryboardCta: 'Start in Storyboard ↗',
      openAppsCta: 'Open Divisie →',
      directoryEyebrow: 'ECOSYSTEEM TOPOLOGIE',
      directoryTitle: 'Alle actieve portalen',
      dispatchEyebrow: 'DIRECT ENTERPRISE CONTACT · [Main Hub]',
      dispatchTitle: 'B2B-inkoop, Handfilm-productie of OS-integratie nodig?',
      dispatchSubtitle: 'Maak rechtstreeks verbinding met het operationele team van HANDS & HEAD via WhatsApp.',
      dispatchBtn: 'Bericht op WhatsApp',
      liveNodesLabel: 'ACTIEVE KNOPEN',
      syncMeshLabel: 'SYNC NETWERK',
      ecosystemStageLabel: 'ECOSYSTEEM PODIUM',
      visualEngineLabel: 'RAWx VISUELE ENGINE',
      activeTasksLabel: 'ACTIEVE TAKEN',
      masterClockLabel: 'MASTER KLOK (UTC)',
      pillarCards: {
        storyboardBadge: '01 // WEBGL2 CINEMA',
        storyboardTitle: 'HandFilm Storyboard',
        storyboardSummary: 'Browser-native WebGL2 AI-videostudio, NLE-editor en Cloudflare-videohosting.',
        b2bBadge: '02 // B2B INDUSTRIE',
        b2bTitle: 'Dhaka B2B Divisies',
        b2bSummary: 'Directe productie van RMG, 300 GSM katoen, echt leer en 316L roestvrijstalen hardware.',
        appsBadge: '03 // OS MATRIX',
        appsTitle: '24 Ecosysteem Apps',
        appsSummary: 'Zero-latency podiumengine die D2C-retail, botanische concierge, audiolabs en cloudapps verbindt.',
      },
    },
    handfilm: {
      studioLabel: 'HANDFILM STUDIO',
      heroHeadlinePrefix: 'AI Foto- & Video-editor voor ',
      heroHeadlineAccent: 'Iedereen',
      heroSubline: 'Start Easy, Beast, CapCut of AD Studio rechtstreeks in WebGL2 Storyboard.',
      tryOnline: 'Gratis Online Proberen',
      downloadBtn: 'Desktop / Android',
      modelsEyebrow: 'AI & MONTAGE ARCHITECTUUR',
      modelsTitle: 'Kies de juiste engine. Start met één klik.',
      modelsSub: 'Hover of tik op een kaart om specificaties te bekijken en Storyboard te openen.',
      filterAll: 'Alle Modellen (6)',
      filterEditor: 'NLE Modi',
      filterAi: 'Visie & Reframe',
      filterCommerce: 'AD Studio',
      launchStoryboard: 'Start in Storyboard ↗',
      workflowEyebrow: 'DRIE-STAPPEN PIJPLIJN',
      workflowTitle: 'Van idee naar eindmontage in minuten',
      discoverEyebrow: 'SJABLONEN & TUTORIALS',
      discoverTitle: 'Direct bruikbare Storyboard-blauwdrukken',
      pricingEyebrow: 'EDITIES',
      pricingTitle: 'Begin gratis in de browser. Schaal op naar Pro.',
      stickySlogan: 'Monteer slimmer, creëer sneller',
      tapHint: 'Hover voor details',
      subnav: {
        products: 'Producten',
        features: 'Functies',
        models: 'AI Modellen',
        integrations: 'Integraties',
        solutions: 'Oplossingen',
        discover: 'Ontdekken',
        pricing: 'Prijzen',
      },
    },
    rawx: {
      studioBadge: 'POD & JIT PRE-ORDER STUDIO',
      heroTitle: 'LEER, STAAL & HEAVYWEIGHT',
      heroSubtitle: 'Kleine oplages 320 GSM katoen, volnerfleer, 316L staal & 19 interactieve slider-engines.',
      backToApps: '← Apps',
      savedLookbook: 'Opgeslagen Lookbook',
      autoplayOn: 'AUTOPLAY',
      autoplayPaused: 'GEPAUZEERD',
      theaterEnter: 'Theatermodus',
      theaterExit: 'Sluit Theater',
      customizePhotos: 'Foto’s Aanpassen',
      lightbox: 'Cinema Lightbox',
      allDrops: 'ALLE DROPS',
      searchPlaceholder: 'Filter op naam, code of materiaal...',
      inspectPreorder: 'Inspecteer & Reserveer',
      copyDropLink: 'Kopieer Drop-link',
      remixStoryboard: 'Start in Storyboard ↗',
      save: 'Bewaar',
      saved: 'Bewaard',
      editSection: 'Bewerk Foto’s',
      hoverHint: 'Hover voor acties',
    },
    sections: buildLocalizedSections(
      'OPEN',
      { commerce: 'HANDEL', content: 'MEDIA', manuf: 'PRODUCTIE', lifestyle: 'LIFESTYLE', food: 'AGRO & VOEDING', apps: 'APPS' },
      {
        d2c: { title: 'D2C WINKEL', sub: 'Directe Consumentenhandel', desc: 'Luxe leerproducten, drops en snelle WhatsApp-bestellingen.', cta: 'NAAR WINKEL' },
        arutemika: { title: 'ARUTEMIKA', sub: 'B2B & Groothandel', desc: 'Zakelijke inkoopcatalogus en bulkbestellingen.', cta: 'OPEN B2B' },
        studio: { title: 'STUDIO', sub: 'Handfilm WebGL2 Cinema Engine', desc: 'AI-videoplatform en NLE-editor in de browser.', cta: 'OPEN STUDIO' },
      }
    ),
    ticker: { prefix: 'ECOSYSTEEM STATUS', live: 'LIVE', pause: 'PAUZE', resume: 'HERVAT' },
    command: {
      placeholder: 'Typ een portaalnaam, code (bijv. b2b, shop) of opdracht...',
      noResults: 'Geen overeenkomende portalen gevonden',
      jumpTo: 'Directe Portalen',
      actions: 'Werkruimte Acties',
      quickSwitch: 'Taal / Modus wisselen',
      shortcuts: 'Sneltoetsen',
      escToClose: 'Druk op ESC om te sluiten',
    },
    newsletter: {
      badge: 'H&H DISPATCH',
      title: 'Ecosysteem Updates & Releases',
      subtitle: 'Periodieke briefings over hardware-drops, films en techniek.',
      placeholder: 'Vul je e-mailadres in...',
      submit: 'ABONNEREN',
      success: 'Geregistreerd. Welkom bij Hands & Head Dispatch.',
      note: 'Geen spam. Versleutelde verzending binnen ons netwerk.',
    },
    returning: { welcomeBack: 'Welkom terug bij Master OS.', continueTo: 'Ga door naar', explored: 'Verkend', allExplored: 'Alles verkend' },
    map: {
      title: 'ECOSYSTEEM ARCHITECTUURKAART',
      subtitle: 'Interactief relatienetwerk van alle actieve portalen en engines',
      listView: 'Lijstweergave',
      mapView: 'Relatiekaart',
      clusters: { commerce: 'Handel & Drops', media: 'Redactie & Cinema', engines: 'OS Engines' },
      nodeVisited: 'Bezocht in sessie',
      nodeUnvisited: 'Onverkend portaal',
      clickToJump: 'Klik op een knoop om direct te springen',
    },
    liveEmbed: {
      interactiveMode: 'Interactieve Modus',
      viewMode: 'Weergavemodus',
      fullscreen: 'Vergroten',
      exitFullscreen: 'Verkleinen',
      fallbackMessage: 'Live stream voorbeeld actief.',
      retry: 'Opnieuw laden',
      openDirect: 'Openen in nieuw venster',
    },
  },
};
// END OF FILE: src/i18n/translations.ts
