// Local Visitor State and Exploration Tracking Service
const VISITOR_STATE_KEY = 'hh_master_visitor_state';

export interface VisitorState {
  lastVisitedPortalId: string | null;
  lastVisitedAt: number | null;
  visitedPortals: string[];
  visitCount: number;
  newsletterSubscribed: boolean;
}

const DEFAULT_VISITOR_STATE: VisitorState = {
  lastVisitedPortalId: null,
  lastVisitedAt: null,
  visitedPortals: [],
  visitCount: 0,
  newsletterSubscribed: false,
};

export function getStoredVisitorState(): VisitorState {
  try {
    const raw = localStorage.getItem(VISITOR_STATE_KEY);
    if (!raw) return DEFAULT_VISITOR_STATE;
    return { ...DEFAULT_VISITOR_STATE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_VISITOR_STATE;
  }
}

export function recordPortalVisit(portalId: string): VisitorState {
  const current = getStoredVisitorState();
  const visitedSet = new Set(current.visitedPortals);
  visitedSet.add(portalId);

  const updated: VisitorState = {
    ...current,
    lastVisitedPortalId: portalId,
    lastVisitedAt: Date.now(),
    visitedPortals: Array.from(visitedSet),
    visitCount: current.visitCount + 1,
  };

  try {
    localStorage.setItem(VISITOR_STATE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('[VisitorState] Failed to persist', err);
  }

  return updated;
}

export function markNewsletterSubscribed(): void {
  const current = getStoredVisitorState();
  const updated: VisitorState = {
    ...current,
    newsletterSubscribed: true,
  };
  try {
    localStorage.setItem(VISITOR_STATE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('[VisitorState] Failed to update newsletter state', err);
  }
}
