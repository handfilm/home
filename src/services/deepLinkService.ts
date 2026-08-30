// Deep Linking and URL Synchronization Service

export function getInitialPortalFromUrl(defaultPortalId: string): string {
  if (typeof window === 'undefined') return defaultPortalId;

  // 1. Check Hash: e.g. #b2b or #shop
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  if (hash) {
    if (hash === 'b2b' || hash === 'arutemika') return 'b2b';
    if (hash === 'shop' || hash === 'd2c') return 'd2c';
    if (hash === 'articles' || hash === 'art' || hash === 'editorial') return 'articles';
    if (hash === 'handfilm' || hash === 'film') return 'handfilm';
    return hash;
  }

  // 2. Check Query param: ?portal=b2b
  const params = new URLSearchParams(window.location.search);
  const portalParam = params.get('portal') || params.get('view') || params.get('sec');
  if (portalParam) {
    if (portalParam === 'b2b' || portalParam === 'arutemika') return 'b2b';
    if (portalParam === 'shop' || portalParam === 'd2c') return 'd2c';
    if (portalParam === 'articles') return 'articles';
    if (portalParam === 'handfilm' || portalParam === 'film') return 'handfilm';
    return portalParam;
  }

  return defaultPortalId;
}

export function updateUrlForPortal(portalId: string, portalTitle: string): void {
  if (typeof window === 'undefined') return;

  const targetHash = `#${portalId}`;
  if (window.location.hash !== targetHash) {
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${targetHash}`);
  }

  // Update dynamic document title
  document.title = `HANDS & HEAD — ${portalTitle}`;

  // Update theme-color meta tag if present
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    const accentColors: Record<string, string> = {
      d2c: '#b14a26',
      b2b: '#4a6670',
      articles: '#c79a3d',
      handfilm: '#e05d26',
    };
    metaThemeColor.setAttribute('content', accentColors[portalId] || '#0e0d0b');
  }
}

export async function copyPortalShareLink(portalId: string): Promise<boolean> {
  const shareUrl = `${window.location.origin}${window.location.pathname}#${portalId}`;

  // If navigator.clipboard is supported
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(shareUrl);
      return true;
    } catch {
      // fallback
    }
  }

  // Fallback copy using textarea
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
