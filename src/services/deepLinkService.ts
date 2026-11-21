import { ActiveTab } from '../types';

// Deep Linking and URL Synchronization Service for 3-Tab Shell & 24 Ecosystem Portals

export interface ResolvedRoute {
  tab: ActiveTab;
  portalId: string | null;
}

const PORTAL_ALIASES: Record<string, string> = {
  b2b: 'arutemika',
  arutemika: 'arutemika',
  shop: 'd2c',
  d2c: 'd2c',
  articles: 'articles',
  art: 'articles',
  editorial: 'articles',
  handfilm: 'studio',
  film: 'studio',
};

export function getInitialRouteFromUrl(validSectionIds: string[] = []): ResolvedRoute {
  if (typeof window === 'undefined') {
    return { tab: 'home', portalId: null };
  }

  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase().trim();
  const params = new URLSearchParams(window.location.search);
  const tabParam = (params.get('tab') || params.get('view') || '').toLowerCase().trim();
  const portalParam = (params.get('portal') || params.get('sec') || '').toLowerCase().trim();

  // 1. Explicit hash routing (#home, #apps, #sliders, #tasks, or #<portalId>)
  if (hash) {
    if (hash === 'home' || hash === 'hub-home' || hash === 'overview') {
      return { tab: 'home', portalId: null };
    }
    if (hash === 'apps' || hash === 'stage' || hash === 'ecosystem' || hash === 'sections') {
      return { tab: 'ecosystem', portalId: portalParam ? (PORTAL_ALIASES[portalParam] || portalParam) : null };
    }
    if (hash === 'sliders' || hash === 'rawx' || hash === 'showcase') {
      return { tab: 'rawx-showcase', portalId: null };
    }
    if (hash === 'tasks' || hash === 'tasks-hub' || hash === 'sync') {
      return { tab: 'tasks-hub', portalId: null };
    }

    const mappedPortal = PORTAL_ALIASES[hash] || hash;
    if (validSectionIds.length === 0 || validSectionIds.includes(mappedPortal)) {
      return { tab: 'ecosystem', portalId: mappedPortal };
    }
  }

  // 2. Explicit query parameter routing (?tab=apps, ?view=sliders, ?portal=bloom)
  if (portalParam) {
    const mappedPortal = PORTAL_ALIASES[portalParam] || portalParam;
    return { tab: 'ecosystem', portalId: mappedPortal };
  }

  if (tabParam) {
    if (tabParam === 'home') return { tab: 'home', portalId: null };
    if (tabParam === 'apps' || tabParam === 'stage' || tabParam === 'sections' || tabParam === 'ecosystem') {
      return { tab: 'ecosystem', portalId: null };
    }
    if (tabParam === 'sliders' || tabParam === 'showcase' || tabParam === 'rawx') {
      return { tab: 'rawx-showcase', portalId: null };
    }
    if (tabParam === 'tasks' || tabParam === 'tasks-hub') {
      return { tab: 'tasks-hub', portalId: null };
    }
  }

  // 3. Default first screen: HOME
  return { tab: 'home', portalId: null };
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
  } else if (tab === 'ecosystem') {
    targetHash = portalId ? `#${portalId}` : '#apps';
  } else if (tab === 'rawx-showcase') {
    targetHash = '#sliders';
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

export async function copyPortalShareLink(portalId: string): Promise<boolean> {
  const shareUrl = `${window.location.origin}${window.location.pathname}#${portalId}`;

  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(shareUrl);
      return true;
    } catch {
      // fallback
    }
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = shareUrl;
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
