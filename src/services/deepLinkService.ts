import { ActiveTab } from '../types';

// Deep Linking and URL Synchronization Service for 3-Tab Shell & 24 Ecosystem Portals

export interface ResolvedRoute {
  tab: ActiveTab;
  portalId: string | null;
  rawxDropId: string | null;
}

const PORTAL_ALIASES: Record<string, string> = {
  b2b: 'arutemika',
  arutemika: 'arutemika',
  shop: 'd2c',
  d2c: 'd2c',
  articles: 'articles',
  art: 'articles',
  editorial: 'articles',
  film: 'studio',
};

const RAWX_DROP_HASH_RE = /^rawx-(s(?:0[1-9]|1[0-9]))$/;

export function getInitialRouteFromUrl(validSectionIds: string[] = []): ResolvedRoute {
  if (typeof window === 'undefined') {
    return { tab: 'home', portalId: null, rawxDropId: null };
  }

  const pathname = window.location.pathname.replace(/\/+$/, '').toLowerCase();
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase().trim();
  const params = new URLSearchParams(window.location.search);
  const tabParam = (params.get('tab') || params.get('view') || '').toLowerCase().trim();
  const portalParam = (params.get('portal') || params.get('sec') || '').toLowerCase().trim();

  // 1. Explicit hash routing (#home, #handfilm, #rawx, #rawx-s01..#rawx-s19, #apps, #sliders legacy, #tasks, or #<portalId>)
  if (hash) {
    if (hash === 'home' || hash === 'hub-home' || hash === 'overview') {
      return { tab: 'home', portalId: null, rawxDropId: null };
    }
    if (hash === 'handfilm' || hash === 'handfilm-studio') {
      return { tab: 'handfilm', portalId: null, rawxDropId: null };
    }
    const rawxDropMatch = hash.match(RAWX_DROP_HASH_RE);
    if (rawxDropMatch) {
      return { tab: 'rawx-showcase', portalId: null, rawxDropId: rawxDropMatch[1] };
    }
    if (hash === 'rawx' || hash === 'sliders' || hash === 'showcase') {
      return { tab: 'rawx-showcase', portalId: null, rawxDropId: null };
    }
    if (hash === 'apps' || hash === 'stage' || hash === 'ecosystem' || hash === 'sections') {
      return {
        tab: 'ecosystem',
        portalId: portalParam ? PORTAL_ALIASES[portalParam] || portalParam : null,
        rawxDropId: null,
      };
    }
    if (hash === 'tasks' || hash === 'tasks-hub' || hash === 'sync') {
      return { tab: 'tasks-hub', portalId: null, rawxDropId: null };
    }

    const mappedPortal = PORTAL_ALIASES[hash] || hash;
    if (validSectionIds.length === 0 || validSectionIds.includes(mappedPortal)) {
      return { tab: 'ecosystem', portalId: mappedPortal, rawxDropId: null };
    }
  }

  // 2. Explicit query parameter routing (?tab=handfilm, ?tab=rawx, ?tab=apps, ?view=sliders, ?portal=bloom)
  if (portalParam) {
    const mappedPortal = PORTAL_ALIASES[portalParam] || portalParam;
    return { tab: 'ecosystem', portalId: mappedPortal, rawxDropId: null };
  }

  if (tabParam) {
    if (tabParam === 'home') return { tab: 'home', portalId: null, rawxDropId: null };
    if (tabParam === 'handfilm' || tabParam === 'handfilm-studio') {
      return { tab: 'handfilm', portalId: null, rawxDropId: null };
    }
    if (tabParam === 'rawx' || tabParam === 'sliders' || tabParam === 'showcase') {
      return { tab: 'rawx-showcase', portalId: null, rawxDropId: null };
    }
    if (tabParam === 'apps' || tabParam === 'stage' || tabParam === 'sections' || tabParam === 'ecosystem') {
      return { tab: 'ecosystem', portalId: null, rawxDropId: null };
    }
    if (tabParam === 'tasks' || tabParam === 'tasks-hub') {
      return { tab: 'tasks-hub', portalId: null, rawxDropId: null };
    }
  }

  // 3. Direct pathname routing (/handfilm, /rawx, /sliders)
  if (pathname === '/handfilm') {
    return { tab: 'handfilm', portalId: null, rawxDropId: null };
  }
  if (pathname === '/rawx' || pathname === '/sliders') {
    return { tab: 'rawx-showcase', portalId: null, rawxDropId: null };
  }

  // 4. Default first screen: HOME
  return { tab: 'home', portalId: null, rawxDropId: null };
}

export function getInitialPortalFromUrl(defaultPortalId: string): string {
  const route = getInitialRouteFromUrl();
  return route.portalId || defaultPortalId;
}

export function updateUrlForTab(tab: ActiveTab, portalId?: string): void {
  if (typeof window === 'undefined') return;

  let targetHash = '#home';

  if (tab === 'home') {
    targetHash = '#home';
  } else if (tab === 'handfilm') {
    targetHash = '#handfilm';
  } else if (tab === 'ecosystem') {
    targetHash = portalId ? `#${portalId}` : '#apps';
  } else if (tab === 'rawx-showcase') {
    const currentHash = window.location.hash.replace(/^#\/?/, '').toLowerCase().trim();
    targetHash = RAWX_DROP_HASH_RE.test(currentHash) ? `#${currentHash}` : '#rawx';
  } else if (tab === 'tasks-hub') {
    targetHash = '#tasks';
  }

  if (window.location.hash !== targetHash) {
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${targetHash}`);
  }
}

export function updateUrlForPortal(portalId: string): void {
  updateUrlForTab('ecosystem', portalId);
}

async function copyTextToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // fallback below
    }
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch {
    return false;
  }
}

export async function copyPortalShareLink(portalId: string): Promise<boolean> {
  const shareUrl = `${window.location.origin}${window.location.pathname}#${portalId}`;
  return copyTextToClipboard(shareUrl);
}

export async function copyRawxDropShareLink(dropId: string): Promise<boolean> {
  const normalized = dropId.toLowerCase();
  const hash = normalized.startsWith('rawx-') ? `#${normalized}` : `#rawx-${normalized}`;
  const shareUrl = `${window.location.origin}${window.location.pathname}${hash}`;
  if (typeof window !== 'undefined' && window.location.hash !== hash) {
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${hash}`);
  }
  return copyTextToClipboard(shareUrl);
}
