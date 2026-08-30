// Centralized Telemetry & Analytics Event Bus for Hands & Head Master OS

export type MasterEventType =
  | 'MASTER_SECTION_VIEW'
  | 'MASTER_SECTION_HOVER'
  | 'MASTER_SECTION_CLICK'
  | 'MASTER_NAVIGATION'
  | 'MASTER_COMMAND_PALETTE_OPEN'
  | 'MASTER_COMMAND_EXECUTE'
  | 'MASTER_LANGUAGE_TOGGLE'
  | 'MASTER_SOUND_TOGGLE'
  | 'MASTER_SHARE_CLICK'
  | 'MASTER_INDEX_MAP_TOGGLE'
  | 'MASTER_INSTALL_PROMPT_SHOWN'
  | 'MASTER_INSTALL_ACCEPTED'
  | 'MASTER_NEWSLETTER_SIGNUP'
  | 'MASTER_COLOR_GRADE_CHANGE'
  | 'MASTER_DEVICE_SYNC_CONNECTED';

export interface TelemetryPayload {
  [key: string]: string | number | boolean | null | undefined | object;
}

declare global {
  interface Window {
    __H_H_TELEMETRY__?: (event: MasterEventType, payload?: TelemetryPayload) => void;
    dataLayer?: unknown[];
  }
}

export function trackEvent(event: MasterEventType, payload: TelemetryPayload = {}) {
  const timestamp = new Date().toISOString();
  const enhancedPayload = {
    ...payload,
    timestamp,
    url: window.location.href,
    hash: window.location.hash,
  };

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log(`📡 [H&H Telemetry] ${event}`, enhancedPayload);
  }

  // Forward to custom handler if registered
  if (typeof window.__H_H_TELEMETRY__ === 'function') {
    try {
      window.__H_H_TELEMETRY__(event, enhancedPayload);
    } catch (err) {
      console.warn('[Telemetry Error]', err);
    }
  }

  // Forward to standard dataLayer (GTM / GA4) if present
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event,
      ...enhancedPayload,
    });
  }
}
