export type Language = 'en' | 'bn';

export interface TranslationDictionary {
  brand: {
    name: string;
    tagline: string;
    subline: string;
  };
  nav: {
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
  sections: {
    [key: string]: {
      title: string;
      category: string;
      sub: string;
      desc: string;
      cta: string;
      status: string;
    };
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

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en: {
    brand: {
      name: 'HANDS & HEAD',
      tagline: 'MASTER OS',
      subline: 'Unified Digital Workspace & Ecosystem',
    },
    nav: {
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
    sections: {
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
        category: '03 / MEDIA / CONTENT',
        sub: 'Ideas, Research & Stories',
        desc: 'Long-form thinking on business, technology, design, AI and culture from the H&H studio.',
        cta: 'READ ARTICLES',
        status: 'LATEST ESSAY · INDUSTRIAL REALISM & AI ARCHITECTURE',
      },
      studio: {
        title: 'STUDIO',
        category: '04 / MEDIA / CONTENT',
        sub: 'Creative & Design Studio',
        desc: 'Creative direction, visual brand identity, campaigns and graphic design systems.',
        cta: 'ENTER STUDIO',
        status: 'STUDIO DESK · BRAND SYSTEM EXPANSION ACTIVE',
      },
      aural: {
        title: 'AURAL',
        category: '05 / MEDIA / CONTENT',
        sub: 'Sound, Audio & Music Division',
        desc: 'Acoustic research, ambient procedural soundscapes and audio production for the ecosystem.',
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
        category: '12 / CRAFT / LIFESTYLE',
        sub: 'Handcrafted Accessories',
        desc: "Bracelet and small-accessory craftsmanship — a hands-on, detail-driven atelier.",
        cta: 'ENTER BRACELETS',
        status: 'STUDIO ATELIER · HAND-WOVEN CORDS & HARDWARE',
      },
      bloom: {
        title: 'BLOOM',
        category: '13 / CRAFT / LIFESTYLE',
        sub: 'Floral & Botanical Division',
        desc: 'The floral and botanical arm of Hands & Head — sourcing, arrangement and botanical product development.',
        cta: 'ENTER BLOOM',
        status: 'BOTANICAL LAB · SEASONAL FLORAL ARRANGEMENTS',
      },
      gym: {
        title: 'GYM',
        category: '14 / CRAFT / LIFESTYLE',
        sub: 'Fitness & Wellness',
        desc: 'Athletic performance gear, wellness protocols and training apparel development.',
        cta: 'ENTER GYM',
        status: 'PERFORMANCE LAB · WELLNESS PROTOCOLS LIVE',
      },
      agro: {
        title: 'AGRO',
        category: '15 / AGRICULTURE / FOOD',
        sub: 'Agriculture & Agro-Processing',
        desc: 'Agricultural sourcing and agro-processing operations under the H&H group.',
        cta: 'ENTER AGRO',
        status: 'ORGANIC HARVEST · AGRO-PROCESSING FACILITY LIVE',
      },
      food: {
        title: 'FOOD',
        category: '16 / AGRICULTURE / FOOD',
        sub: 'Food Production & Distribution',
        desc: 'Food product development, processing and distribution within the H&H ecosystem.',
        cta: 'ENTER FOOD',
        status: 'DISTRIBUTION NETWORK · QUALITY ASSURANCE CERTIFIED',
      },
      bloomapp: {
        title: 'BLOOM APP',
        category: '17 / TOOLS / APPS',
        sub: 'Botanical Ordering App',
        desc: 'Digital concierge and immediate floral delivery application for seasonal arrangements.',
        cta: 'OPEN APP',
        status: 'BOTANICAL CONCIERGE · RAPID DISPATCH ONLINE',
      },
      apps: {
        title: 'APPS',
        category: '18 / TOOLS / APPS',
        sub: 'H&H Software & Utilities',
        desc: 'Internal web tools, operational software, APIs and utility suites.',
        cta: 'VIEW APPS',
        status: 'UTILITY CLOUD · V4.2 CORE ENGINES RUNNING',
      },
      note: {
        title: 'NOTE',
        category: '19 / TOOLS / APPS',
        sub: 'Notes & Internal Writing Tool',
        desc: 'Markdown editor, thoughts repository and structured team notes workspace.',
        cta: 'OPEN NOTE',
        status: 'TEXT EDITOR · ENCRYPTED LOCAL PERSISTENCE',
      },
      picseed: {
        title: 'PICSEED',
        category: '20 / TOOLS / APPS',
        sub: 'Image & Visual Tooling',
        desc: 'Asset processing, automated image CDN and high-fidelity visual generation pipelines.',
        cta: 'OPEN PICSEED',
        status: 'ASSET PIPELINE · HIGH FIDELITY RENDER ONLINE',
      },
      hub: {
        title: 'HUB',
        category: '21 / TOOLS / APPS',
        sub: 'Central Ecosystem Hub',
        desc: 'Unified control panel, telemetry metrics and cross-portal navigation backbone.',
        cta: 'ENTER HUB',
        status: 'CONTROL SPINE · TELEMETRY STACK ONLINE',
      },
      deeper: {
        title: 'DEEPER',
        category: '22 / TOOLS / APPS',
        sub: 'Research & Exploration',
        desc: 'In-depth laboratory research, experimental interfaces and frontier concept incubation.',
        cta: 'GO DEEPER',
        status: 'RESEARCH LAB · FRONTIER COGNITION EXPERIMENTS',
      },
      hiya: {
        title: 'HIYA',
        category: '23 / TOOLS / APPS',
        sub: 'Messaging & Communication',
        desc: 'Peer-to-peer fast messaging, team collaboration and real-time status signals.',
        cta: 'SAY HIYA',
        status: 'MESSAGING MESH · LOW LATENCY SIGNALS LIVE',
      },
      me: {
        title: 'ME',
        category: '24 / TOOLS / APPS',
        sub: 'Personal Profile & Identity',
        desc: 'Single sign-on identity, profile verification, settings and secure key management.',
        cta: 'ENTER ME',
        status: 'USER IDENTITY · SSO ENCLAVE SECURED',
      },
    },
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
    nav: {
      stage: 'স্টেজ',
      ecosystem: 'ইকোসিস্টেম',
      sliders16: '১৬ স্লাইডার',
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
      read: 'প্রবন্ধ পড়ুন',
      stream: 'ফিল্ম দেখুন',
      copyLink: 'লিঙ্ক কপি',
      linkCopied: 'লিঙ্ক কপি হয়েছে!',
      share: 'শেয়ার',
      close: 'বন্ধ করুন',
      back: 'পেছনে',
      continueLast: 'সেশন পুনরায় শুরু',
      dismiss: 'বাতিল',
      filterBySection: 'বিভাগ অনুযায়ী ফিল্টার',
      clearFilter: 'ফিল্টার সরান',
    },
    sections: {
      d2c: {
        title: 'ডি২সি শপ',
        category: '০১ / কমার্স',
        sub: 'হ্যান্ডস অ্যান্ড হেড কনজিউমার কমার্স',
        desc: 'প্রিমিয়াম চামড়াজাত পণ্য, ড্রপস, ক্যাটালগ ও সরাসরি হোয়াটসঅ্যাপে দ্রুত অর্ডার।',
        cta: 'শপে প্রবেশ করুন',
        status: 'নতুন ড্রপ · ভল্ট লেদার সিরিজ · লাইভ',
      },
      arutemika: {
        title: 'আরুতেমিকা',
        category: '০২ / কমার্স',
        sub: 'বি২বি, কর্পোরেট ও পাইকারি কমার্স',
        desc: 'কর্পোরেট এবং পাইকারি ক্রেতাদের জন্য বাল্ক ক্যাটালগ ও অর্ডার ম্যানেজমেন্ট।',
        cta: 'বি২বি তে যান',
        status: 'বাল্ক অর্ডার গ্রহণ চলমান · এন্টারপ্রাইজ ক্যাটালগ',
      },
      articles: {
        title: 'প্রবন্ধ ও নিবন্ধ',
        category: '০৩ / মিডিয়া / কনটেন্ট',
        sub: 'গবেষণা, নকশা ও প্রযুক্তি',
        desc: 'ব্যবসা, প্রযুক্তি, শিল্প নকশা এবং কৃত্রিম বুদ্ধিমত্তা নিয়ে গভীর বিশ্লেষণ ও প্রবন্ধ।',
        cta: 'প্রবন্ধ পড়ুন',
        status: 'নতুন প্রবন্ধ · ইন্ডাস্ট্রিয়াল রিয়ালিজম ও এআই সিস্টেমস',
      },
      studio: {
        title: 'স্টুডিও',
        category: '০৪ / মিডিয়া / কনটেন্ট',
        sub: 'ক্রিয়েটিভ ও ডিজাইন স্টুডিও',
        desc: 'ব্র্যান্ড আইডেন্টিটি, ভিজ্যুয়াল ক্যাম্পেইন এবং গ্রাফিক সিস্টেমের সৃজনশীল প্ল্যাটফর্ম।',
        cta: 'স্টুডিওতে যান',
        status: 'স্টুডিও ডেস্ক · ব্র্যান্ড সিস্টেম কার্যক্রম চালু',
      },
      aural: {
        title: 'অরাল',
        category: '০৫ / মিডিয়া / কনটেন্ট',
        sub: 'শব্দ ও অডিও ইঞ্জিনিয়ারিং',
        desc: 'অ্যাকোস্টিক রিসার্চ, পরিবেষ্টিত সাউন্ডস্কেপ এবং কৃত্রিম সঙ্গীত প্রযোজনা।',
        cta: 'অডিও শুনুন',
        status: 'সাউন্ড ল্যাব · অ্যাম্বিয়েন্ট ফ্রিকোয়েন্সি লাইভ',
      },
      textile: {
        title: 'টেক্সটাইল',
        category: '০৬ / ম্যানুফ্যাকচারিং',
        sub: 'ফ্যাব্রিক, মিল ও ম্যাটেরিয়াল সোর্সিং',
        desc: 'বোনা এবং নিট টেক্সটাইল সোর্সিং, মিল পার্টনারশিপ এবং এইচঅ্যান্ডএইচ ম্যানুফ্যাকচারিং ইকোসিস্টেমের ফ্যাব্রিক ডেভেলপমেন্ট।',
        cta: 'টেক্সটাইলে প্রবেশ করুন',
        status: 'মিল পার্টনারশিপ · নিট ও ওভেন ফ্যাব্রিক সোর্সিং চলমান',
      },
      rmg: {
        title: 'আরএমজি',
        category: '০৭ / ম্যানুফ্যাকচারিং',
        sub: 'তৈরি পোশাক উৎপাদন ও রপ্তানি',
        desc: 'পোশাক উৎপাদন, ফ্যাক্টরি সোর্সিং এবং এইচঅ্যান্ডএইচ শিল্প ইউনিটের অধীনে রপ্তানিমুখী উৎপাদন ব্যবস্থাপনা।',
        cta: 'আরএমজিতে যান',
        status: 'রপ্তানিমুখী পোশাক উৎপাদন ও ফ্যাক্টরি নেটওয়ার্ক',
      },
      leather: {
        title: 'লেদার',
        category: '০৮ / ম্যানুফ্যাকচারিং',
        sub: 'চামড়াজাত পণ্য ও ট্যানারি সোর্সিং',
        desc: 'চামড়া সোর্সিং, ট্যানারি পার্টনারশিপ এবং ফিনিশড চামড়াজাত পণ্যের প্রিমিয়াম উৎপাদন।',
        cta: 'লেদারে প্রবেশ করুন',
        status: 'ট্যানারি অডিট ও ফুল গ্রেইন চামড়া সংগ্রহ',
      },
      jacket: {
        title: 'জ্যাকেট',
        category: '০৯ / ম্যানুফ্যাকচারিং',
        sub: 'আউটারওয়্যার ও জ্যাকেট উৎপাদন',
        desc: 'এইচঅ্যান্ডএইচ গার্মেন্টস নেটওয়ার্কের অধীনে বিশেষায়িত আউটারওয়্যার এবং জ্যাকেট উৎপাদন লাইন।',
        cta: 'জ্যাকেট লাইনে যান',
        status: 'আউটারওয়্যার লাইন · টেকনিক্যাল জ্যাকেট উৎপাদন চলমান',
      },
      jute: {
        title: 'পাট ও প্রাকৃতিক ফাইবার',
        category: '১০ / ম্যানুফ্যাকচারিং',
        sub: 'পরিবেশবান্ধব পাট প্রক্রিয়াজাতকরণ',
        desc: 'টেকসই প্রাকৃতিক ফাইবার ও বায়োডিগ্রেডেবল প্যাকেজিং সমাধান।',
        cta: 'পাটের ইউনিটে যান',
        status: 'ন্যাচারাল ফাইবার · জিরো কার্বন প্যাকেজিং একটিভ',
      },
      lingerie: {
        title: 'ল্যানজারি',
        category: '১১ / ম্যানুফ্যাকচারিং',
        sub: 'অন্তর্বাস ও ফাইন অ্যাপারেল নির্মাণ',
        desc: 'সিমলেস ফেব্রیکیشن ও নিখুঁত সুইং প্রযুক্তির অন্তর্বাস উৎপাদন।',
        cta: 'ল্যানজারিতে প্রবেশ করুন',
        status: 'সিমলেস লাইন · মাইক্রোফাইবার অ্যাটেলিয়ার লাইভ',
      },
      bracelets: {
        title: 'ব্রেসলেটস',
        category: '১২ / ক্রাফট / লাইফস্টাইল',
        sub: 'হস্তনির্মিত এক্সেসরিজ ও কারুকাজ',
        desc: 'ব্রেসলেট এবং ছোট এক্সেসরিজ কারুশিল্প — এইচঅ্যান্ডএইচ-এর একটি সুক্ষ্ম শিল্পায়ন।',
        cta: 'ব্রেসলেটসে যান',
        status: 'স্টুডিও অ্যাটেলিয়ার · হাতে বোনা কর্ড ও মেটালিক হার্ডওয়্যার',
      },
      bloom: {
        title: 'ব্লুম',
        category: '১৩ / ক্রাফট / লাইফস্টাইল',
        sub: 'ফ্লোরাল ও বোটানিক্যাল ডিভিশন',
        desc: 'হ্যান্ডস অ্যান্ড হেডের ফ্লোরাল ও বোটানিক্যাল শাখা — সোর্সিং ও নান্দনিক বিন্যাস।',
        cta: 'ব্লুমে প্রবেশ করুন',
        status: 'বোটানিক্যাল ল্যাব · সিজনাল ফ্লোরাল কালেকশন',
      },
      gym: {
        title: 'জিম',
        category: '১৪ / ক্রাফট / লাইফস্টাইল',
        sub: 'ফিটনেস ও ওয়েলনেস গিয়ার',
        desc: 'অ্যাথলেটিক পোশাক, ওয়ার্কআউট প্রটোকল এবং সক্রিয় জীবনধারার অনুষঙ্গ।',
        cta: 'জিমে প্রবেশ করুন',
        status: 'পারফরম্যান্স ল্যাব · ওয়েলনেস প্রটোকল চলমান',
      },
      agro: {
        title: 'এগ্রো',
        category: '১৫ / কৃষি ও খাদ্য',
        sub: 'কৃষি সোর্সিং ও কৃষি প্রক্রিয়াজাতকরণ',
        desc: 'এইচঅ্যান্ডএইচ গ্রুপের অধীনে টেকসই কৃষি সোর্সিং এবং কৃষি প্রক্রিয়াজাতকরণ অপারেশন।',
        cta: 'এগ্রোতে প্রবেশ করুন',
        status: 'অর্গানিক ফসল সংগ্রহ ও খাদ্য প্রক্রিয়াজাতকরণ',
      },
      food: {
        title: 'ফুড',
        category: '১৬ / কৃষি ও খাদ্য',
        sub: 'খাদ্য উৎপাদন ও সরবরাহ',
        desc: 'এইচঅ্যান্ডএইচ ইকোসিস্টেমের মধ্যে খাদ্য পণ্য উন্নয়ন ও মানসম্মত সরবরাহ।',
        cta: 'ফুড ইউনিটে যান',
        status: 'সাপ্লাই ডিস্ট্রিবিউশন নেটওয়ার্ক ও ফুড কোয়ালিটি সার্টিফাইড',
      },
      bloomapp: {
        title: 'ব্লুম অ্যাপ',
        category: '১৭ / টুলস ও অ্যাপস',
        sub: 'বোটানিক্যাল অর্ডারিং অ্যাপ',
        desc: 'ডিজিটাল কনসিয়ার্জ এবং তাৎক্ষণিক ফুল ডেলিভারি অ্যাপ্লিকেশন।',
        cta: 'অ্যাপ খুলুন',
        status: 'বোটানিক্যাল কনসিয়ার্জ · দ্রুত ডেলিভারি অনলাইন',
      },
      apps: {
        title: 'অ্যাপস',
        category: '১৮ / টুলস ও অ্যাপস',
        sub: 'সফটওয়্যার ও ইউটিলিটি স্যুট',
        desc: 'এইচঅ্যান্ডএইচ অভ্যন্তরীণ ওয়েব টুলস, অপারেশনাল ইঞ্জিন এবং ক্লাউড এপিআই।',
        cta: 'অ্যাপস দেখুন',
        status: 'ইউটিলিটি ক্লাউড · কোর ইঞ্জিন কার্যকর',
      },
      note: {
        title: 'নোট',
        category: '১৯ / টুলস ও অ্যাপস',
        sub: 'নোট ও অভ্যন্তরীণ লেখার টুল',
        desc: 'এনক্রিপ্টেড টিম নোটপ্যাড, চিন্তা সংরক্ষণ এবং মার্কডাউন এডিটর।',
        cta: 'নোট খুলুন',
        status: 'টেক্সট এডিটর · লোকাল পারসিস্টেন্স সক্রিয়',
      },
      picseed: {
        title: 'পিকসীড',
        category: '২০ / টুলস ও অ্যাপস',
        sub: 'ইমেজ ও ভিজ্যুয়াল টুলিং',
        desc: 'অ্যাসেট প্রসেসিং ও উচ্চ-মানের ভিজ্যুয়াল জেনারেশন পাইপলাইন।',
        cta: 'পিকসীড খুলুন',
        status: 'অ্যাসেট পাইপলাইন · হাই ফিডেলিটি রেন্ডার লাইভ',
      },
      hub: {
        title: 'হাব',
        category: '২১ / টুলস ও অ্যাপস',
        sub: 'সেন্ট্রাল ইকোসিস্টেম হাব',
        desc: 'টেলিমেট্রি মনিটর, সেন্ট্রাল সুইচবোর্ড এবং সমস্ত পোর্টালের নিয়ন্ত্রণ কেন্দ্র।',
        cta: 'হাবে যান',
        status: 'কন্ট্রোল স্পাইন · টেলিমেট্রি সক্রিয়',
      },
      deeper: {
        title: 'ডিপার',
        category: '২২ / টুলস ও অ্যাপস',
        sub: 'গবেষণা ও উদ্ভাবন কেন্দ্র',
        desc: 'গভীর পরীক্ষাগার গবেষণা ও নতুন ইন্টারফেসের উদ্ভাবনমূলক প্ল্যাটফর্ম।',
        cta: 'গভীরে যান',
        status: 'রিসার্চ ল্যাব · এক্সপেরিমেন্টাল ইন্টারফেস',
      },
      hiya: {
        title: 'হায়া',
        category: '২৩ / টুলস ও অ্যাপস',
        sub: 'মেসেজিং ও রিয়েলটাইম যোগাযোগ',
        desc: 'পিয়ার-টু-পিয়ার দ্রুত বার্তা এবং নিরাপদ টিম কলাবরেশন মেস।',
        cta: 'হাই বলুন',
        status: 'মেসেজিং মেশ · লো লেটেন্সি সিগন্যাল লাইভ',
      },
      me: {
        title: 'মি',
        category: '২৪ / টুলস ও অ্যাপস',
        sub: 'ব্যক্তিগত প্রোফাইল ও নিরাপত্তা',
        desc: 'একক সাইন-অন পরিচয়, প্রোফাইল যাচাইকরণ এবং এনক্রিপ্ট করা চাবি ব্যবস্থাপনা।',
        cta: 'প্রোফাইলে যান',
        status: 'ইউজার আইডেন্টিটি · এসএসও এনক্লেভ সুরক্ষিত',
      },
    },
    ticker: {
      prefix: 'ইকোসিস্টেম স্ট্যাটাস',
      live: 'লাইভ',
      pause: 'থামুন',
      resume: 'চালান',
    },
    command: {
      placeholder: 'পোর্টাল নাম, শর্টকোড (যেমন b2b, shop) বা কমান্ড টাইপ করুন...',
      noResults: 'কোনো মিল পাওয়া যায়নি',
      jumpTo: 'সরাসরি পোর্টাল',
      actions: 'ওয়ার্কস্পেস অ্যাকশন',
      quickSwitch: 'ভাষা ও মোড পরিবর্তন',
      shortcuts: 'শর্টকাট',
      escToClose: 'বের হতে ESC চাপুন',
    },
    newsletter: {
      badge: 'এইচঅ্যান্ডএইচ ডিসপ্যাচ',
      title: 'ইকোসিস্টেম ইন্টেলিজেন্স ও রিলিজ',
      subtitle: 'নতুন হার্ডওয়্যার ড্রপ, সিনেমা রিলিজ এবং প্রযুক্তি স্থাপত্যের ব্রিফিং।',
      placeholder: 'আপনার ইমেইল ঠিকানা লিখুন...',
      submit: 'সাবস্ক্রাইব',
      success: 'নিবন্ধিত হয়েছে। হ্যান্ডস অ্যান্ড হেড ডিসপ্যাচে স্বাগতম।',
      note: 'কোনো স্প্যাম নয়। আমাদের স্টুডিও থেকে এনক্রিপ্ট করা বার্তা।',
    },
    returning: {
      welcomeBack: 'মাস্টার ওএসে পুনরায় স্বাগতম।',
      continueTo: 'ফিরে যান:',
      explored: 'দেখা হয়েছে',
      allExplored: 'সকল পোর্টাল দেখা হয়েছে',
    },
    map: {
      title: 'ইকোসিস্টেম আর্কিটেকচার ম্যাপ',
      subtitle: 'সকল সক্রিয় পোর্টাল এবং ইঞ্জিনের সম্পর্কযুক্ত ভিজ্যুয়াল ম্যাপ',
      listView: 'তালিকা ভিউ',
      mapView: 'রিলেশনাল ম্যাপ',
      clusters: {
        commerce: 'কমার্স ও ড্রপস',
        media: 'সম্পাদকীয় ও সিনেমা',
        engines: 'ওএস ইঞ্জিন ও টুলস',
      },
      nodeVisited: 'ইতিমধ্যে দেখা হয়েছে',
      nodeUnvisited: 'অদেখা পোর্টাল',
      clickToJump: 'সরাসরি যেতে নোডে ক্লিক করুন',
    },
    liveEmbed: {
      interactiveMode: 'ইন্টারেক্টিভ মোড',
      viewMode: 'ভিউ মোড',
      fullscreen: 'বড় ভিউ',
      exitFullscreen: 'সাধারণ ভিউ',
      fallbackMessage: 'সরাসরি লাইভ স্ট্রিম প্রিভিউ সক্রিয়।',
      retry: 'রিলোড করুন',
      openDirect: 'নতুন উইন্ডোতে খুলুন',
    },
  },
};
