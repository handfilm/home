// PWA Registration and Installation Event Manager
import { trackEvent } from './analytics';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let installPromptListeners: ((canInstall: boolean) => void)[] = [];

export function initPwa(): void {
  if (typeof window === 'undefined') return;

  // 1. Register Service Worker
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          // eslint-disable-next-line no-console
          console.log('⚡ [H&H PWA] Service Worker registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('⚡ [H&H PWA] Service Worker registration failed:', err);
        });
    });
  }

  // 2. Listen for BeforeInstallPromptEvent
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    trackEvent('MASTER_INSTALL_PROMPT_SHOWN');
    notifyInstallPromptListeners(true);
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    trackEvent('MASTER_INSTALL_ACCEPTED');
    notifyInstallPromptListeners(false);
  });
}

export function subscribeToInstallPrompt(callback: (canInstall: boolean) => void): () => void {
  installPromptListeners.push(callback);
  callback(deferredPrompt !== null);

  return () => {
    installPromptListeners = installPromptListeners.filter((cb) => cb !== callback);
  };
}

function notifyInstallPromptListeners(canInstall: boolean) {
  installPromptListeners.forEach((cb) => {
    try {
      cb(canInstall);
    } catch {
      // ignore
    }
  });
}

export async function promptPwaInstall(): Promise<boolean> {
  if (!deferredPrompt) return false;

  try {
    await deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === 'accepted') {
      trackEvent('MASTER_INSTALL_ACCEPTED');
      deferredPrompt = null;
      notifyInstallPromptListeners(false);
      return true;
    }
    return false;
  } catch (err) {
    console.warn('[PWA Install Prompt Error]', err);
    return false;
  }
}
