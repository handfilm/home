import { TaskItem, SectionItem, ConnectedDevice } from '../types';
import { safeStorage } from '../utils/safeStorage';

export function getDeviceId(): string {
  let id = safeStorage.getItem('rawx_device_id');
  if (!id) {
    id = 'dev_' + Math.random().toString(36).substring(2, 9);
    safeStorage.setItem('rawx_device_id', id);
  }
  return id;
}

export function getDeviceName(): string {
  let name = safeStorage.getItem('rawx_device_name');
  if (!name) {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    let type = 'Desktop Device';
    if (/iPhone/i.test(ua)) type = 'iPhone';
    else if (/iPad/i.test(ua)) type = 'iPad';
    else if (/Android/i.test(ua)) type = 'Android Device';
    else if (/Macintosh/i.test(ua)) type = 'Mac Terminal';
    else if (/Windows/i.test(ua)) type = 'Windows PC';
    else if (/Linux/i.test(ua)) type = 'Linux Workstation';

    name = `${type} (${Math.floor(100 + Math.random() * 900)})`;
    safeStorage.setItem('rawx_device_name', name);
  }
  return name;
}

export function getStoredRoomId(): string {
  try {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const queryRoom = params.get('sync');
      if (queryRoom) {
        const normalized = queryRoom.toUpperCase().trim();
        safeStorage.setItem('rawx_sync_room', normalized);
        return normalized;
      }
    }
  } catch {
    // ignore
  }

  const stored = safeStorage.getItem('rawx_sync_room');
  if (stored) return stored.toUpperCase().trim();

  const generated = 'SYNC-' + Math.floor(1000 + Math.random() * 9000);
  safeStorage.setItem('rawx_sync_room', generated);
  return generated;
}

export class MultiDeviceSyncEngine {
  private roomId: string;
  private deviceId: string;
  private deviceName: string;
  private eventSource: EventSource | null = null;
  private onDataCallback: ((tasks: TaskItem[], sections: SectionItem[], devices: ConnectedDevice[], source?: string) => void) | null = null;
  private onStatusCallback: ((isConnected: boolean, deviceCount: number) => void) | null = null;
  private retryTimeout: any = null;

  constructor(
    initialRoomId: string,
    onData: (tasks: TaskItem[], sections: SectionItem[], devices: ConnectedDevice[], source?: string) => void,
    onStatus: (isConnected: boolean, deviceCount: number) => void
  ) {
    this.roomId = initialRoomId.toUpperCase().trim();
    this.deviceId = getDeviceId();
    this.deviceName = getDeviceName();
    this.onDataCallback = onData;
    this.onStatusCallback = onStatus;
    this.connect();
  }

  public getRoomId(): string {
    return this.roomId;
  }

  public setRoomId(newRoomId: string) {
    const normalized = newRoomId.toUpperCase().trim();
    if (this.roomId === normalized) return;
    this.roomId = normalized;
    safeStorage.setItem('rawx_sync_room', normalized);
    this.disconnect();
    this.connect();
  }

  public connect() {
    this.disconnect();

    if (typeof window === 'undefined' || typeof EventSource === 'undefined') {
      return;
    }

    const streamUrl = `/api/sync/stream/${encodeURIComponent(this.roomId)}?deviceId=${encodeURIComponent(this.deviceId)}&deviceName=${encodeURIComponent(this.deviceName)}`;

    try {
      this.eventSource = new EventSource(streamUrl);

      this.eventSource.onopen = () => {
        if (this.onStatusCallback) {
          this.onStatusCallback(true, 1);
        }
      };

      this.eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.tasks && payload.sections && this.onDataCallback) {
            const devices: ConnectedDevice[] = (payload.connectedDevices || []).map((d: any) => ({
              id: d.id,
              name: d.name,
              lastSeen: d.lastSeen,
              isCurrent: d.id === this.deviceId,
            }));
            this.onDataCallback(payload.tasks, payload.sections, devices, payload.sourceDevice);
            if (this.onStatusCallback) {
              this.onStatusCallback(true, payload.deviceCount || devices.length || 1);
            }
          }
        } catch (err) {
          console.error('SSE Message parse error:', err);
        }
      };

      this.eventSource.onerror = () => {
        if (this.onStatusCallback) {
          this.onStatusCallback(false, 0);
        }
        this.eventSource?.close();
        this.eventSource = null;

        // Auto retry connecting after 5 seconds
        clearTimeout(this.retryTimeout);
        this.retryTimeout = setTimeout(() => {
          this.connect();
        }, 5000);
      };
    } catch (err) {
      console.warn('Failed to initialize SSE stream, falling back to polling:', err);
      this.fetchInitialState();
    }
  }

  public async fetchInitialState() {
    try {
      const res = await fetch(`/api/sync/room/${encodeURIComponent(this.roomId)}?deviceId=${encodeURIComponent(this.deviceId)}&deviceName=${encodeURIComponent(this.deviceName)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.tasks && data.sections && this.onDataCallback) {
          const devices = (data.connectedDevices || []).map((d: any) => ({
            id: d.id,
            name: d.name,
            lastSeen: d.lastSeen,
            isCurrent: d.id === this.deviceId,
          }));
          this.onDataCallback(data.tasks, data.sections, devices, 'Remote Server');
          if (this.onStatusCallback) {
            this.onStatusCallback(true, data.deviceCount || 1);
          }
        }
      }
    } catch (err) {
      // Non-fatal on static/standalone hosting
    }
  }

  public async broadcast(tasks: TaskItem[], sections: SectionItem[], actionDescription?: string) {
    // Save to local cache first
    safeStorage.setItem(`rawx_tasks_${this.roomId}`, JSON.stringify(tasks));
    safeStorage.setItem(`rawx_sections_${this.roomId}`, JSON.stringify(sections));

    try {
      const response = await fetch(`/api/sync/room/${encodeURIComponent(this.roomId)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: this.roomId,
          deviceId: this.deviceId,
          deviceName: this.deviceName,
          tasks,
          sections,
          timestamp: new Date().toISOString(),
          action: actionDescription || 'UPDATE',
        }),
      });
      return response.ok;
    } catch (err) {
      return false;
    }
  }

  public disconnect() {
    clearTimeout(this.retryTimeout);
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}

