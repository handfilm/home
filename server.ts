import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

interface TaskItem {
  id: string;
  title: string;
  description?: string;
  sectionId: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "todo" | "in_progress" | "done";
  dueDate?: string;
  tags?: string[];
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  deviceOrigin: string;
}

interface SectionItem {
  id: string;
  category: string;
  title: string;
  sub: string;
  desc: string;
  url: string;
  dest: string;
  cta: string;
  tex: string;
  accent: string;
  isCustom?: boolean;
}

interface SyncPayload {
  roomId: string;
  deviceId: string;
  deviceName: string;
  tasks: TaskItem[];
  sections: SectionItem[];
  timestamp: string;
  action?: string;
}

// In-memory room store for seamless cross-device synchronization
const rooms = new Map<string, {
  tasks: TaskItem[];
  sections: SectionItem[];
  devices: Map<string, { name: string; lastSeen: number }>;
  lastUpdated: number;
}>();

// SSE Client listeners mapped by roomId
const sseClients = new Map<string, Set<express.Response>>();

// Default initial sections
const defaultSections: SectionItem[] = [
  {
    id: "d2c",
    category: "01 / COMMERCE",
    title: "D2C SHOP",
    sub: "Hands & Head Consumer Commerce",
    desc: "Direct-to-consumer products, drops, catalogue and WhatsApp-first ordering.",
    url: "shop.handsandhead.com",
    dest: "https://shop.handsandhead.com/",
    cta: "ENTER SHOP",
    tex: "tex-d2c",
    accent: "#b14a26",
  },
  {
    id: "b2b",
    category: "02 / B2B",
    title: "ARUTEMIKA",
    sub: "B2B, Corporate & Wholesale Commerce",
    desc: "A dedicated environment for corporate and wholesale buyers — sourcing, bulk catalogue and account ordering.",
    url: "arutemika.handsandhead.com",
    dest: "https://arutemika.handsandhead.com/",
    cta: "ENTER B2B",
    tex: "tex-b2b",
    accent: "#4a6670",
  },
  {
    id: "articles",
    category: "03 / EDITORIAL",
    title: "ARTICLES",
    sub: "Ideas, Research & Stories",
    desc: "Long-form thinking on business, technology, design, AI and culture from the H&H studio.",
    url: "articles.handsandhead.com",
    dest: "https://articles.handsandhead.com/",
    cta: "READ ARTICLES",
    tex: "tex-art",
    accent: "#c79a3d",
  }
];

// Default initial tasks
const defaultTasks: TaskItem[] = [
  {
    id: "task-1",
    title: "Review WhatsApp checkout integration for D2C Shop",
    description: "Verify mobile payment flow and instant message order confirmations.",
    sectionId: "d2c",
    priority: "high",
    status: "in_progress",
    dueDate: "2026-09-02",
    tags: ["E-Commerce", "Checkout", "Mobile"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deviceOrigin: "Master Terminal",
  },
  {
    id: "task-2",
    title: "Arutemika wholesale catalogue sync with ERP",
    description: "Batch import high-volume SKUs and client-specific pricing tier matrix.",
    sectionId: "b2b",
    priority: "urgent",
    status: "todo",
    dueDate: "2026-09-05",
    tags: ["Wholesale", "Catalog", "API"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deviceOrigin: "Master Terminal",
  },
  {
    id: "task-3",
    title: "Publish editorial essay on Industrial Realism & AI",
    description: "Format typography, pull quotes, and Hasselblad 8K medium format plates.",
    sectionId: "articles",
    priority: "medium",
    status: "done",
    dueDate: "2026-08-30",
    tags: ["Editorial", "Design", "Publishing"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deviceOrigin: "Master Terminal",
  },
  {
    id: "task-4",
    title: "Configure multi-device sync for mobile field team",
    description: "Scan QR code on tablets and smartphones to enable real-time bidirectional task sync.",
    sectionId: "d2c",
    priority: "high",
    status: "in_progress",
    dueDate: "2026-08-31",
    tags: ["Cross-Device", "Sync", "Ops"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deviceOrigin: "Master Terminal",
  }
];

function getOrCreateRoom(roomId: string) {
  const normalized = (roomId || "MAIN-ROOM").toUpperCase().trim();
  if (!rooms.has(normalized)) {
    rooms.set(normalized, {
      tasks: [...defaultTasks],
      sections: [...defaultSections],
      devices: new Map(),
      lastUpdated: Date.now(),
    });
  }
  return { roomId: normalized, room: rooms.get(normalized)! };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "5mb" }));

  // API: Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", uptime: process.uptime(), timestamp: new Date().toISOString() });
  });

  // API: Get room sync state
  app.get("/api/sync/room/:roomId", (req, res) => {
    const { roomId, room } = getOrCreateRoom(req.params.roomId);
    const deviceId = req.query.deviceId as string;
    const deviceName = req.query.deviceName as string;

    if (deviceId && deviceName) {
      room.devices.set(deviceId, { name: deviceName, lastSeen: Date.now() });
    }

    // Clean up devices inactive for > 2 minutes
    const now = Date.now();
    for (const [id, dev] of room.devices.entries()) {
      if (now - dev.lastSeen > 120000) {
        room.devices.delete(id);
      }
    }

    const connectedDevices = Array.from(room.devices.entries()).map(([id, dev]) => ({
      id,
      name: dev.name,
      lastSeen: dev.lastSeen,
    }));

    res.json({
      success: true,
      roomId,
      tasks: room.tasks,
      sections: room.sections,
      connectedDevices,
      deviceCount: room.devices.size,
      lastUpdated: room.lastUpdated,
    });
  });

  // API: Update room state & broadcast via SSE to all devices in the room
  app.post("/api/sync/room/:roomId", (req, res) => {
    const { roomId, room } = getOrCreateRoom(req.params.roomId);
    const payload: SyncPayload = req.body;

    if (payload.deviceId && payload.deviceName) {
      room.devices.set(payload.deviceId, { name: payload.deviceName, lastSeen: Date.now() });
    }

    if (Array.isArray(payload.tasks)) {
      room.tasks = payload.tasks;
    }

    if (Array.isArray(payload.sections)) {
      room.sections = payload.sections;
    }

    room.lastUpdated = Date.now();

    const connectedDevices = Array.from(room.devices.entries()).map(([id, dev]) => ({
      id,
      name: dev.name,
      lastSeen: dev.lastSeen,
    }));

    // Broadcast to SSE clients for this room
    const clients = sseClients.get(roomId);
    if (clients && clients.size > 0) {
      const data = JSON.stringify({
        type: "SYNC_UPDATE",
        roomId,
        tasks: room.tasks,
        sections: room.sections,
        sourceDevice: payload.deviceName || "Peer Device",
        connectedDevices,
        deviceCount: room.devices.size,
        timestamp: new Date().toISOString(),
        action: payload.action || "UPDATE",
      });

      for (const client of clients) {
        client.write(`data: ${data}\n\n`);
      }
    }

    res.json({
      success: true,
      roomId,
      tasksCount: room.tasks.length,
      sectionsCount: room.sections.length,
      deviceCount: room.devices.size,
      lastUpdated: room.lastUpdated,
    });
  });

  // API: SSE Live stream endpoint for instantaneous multi-device sync
  app.get("/api/sync/stream/:roomId", (req, res) => {
    const { roomId, room } = getOrCreateRoom(req.params.roomId);
    const deviceId = (req.query.deviceId as string) || `dev-${Date.now()}`;
    const deviceName = (req.query.deviceName as string) || "Unknown Device";

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    if (!sseClients.has(roomId)) {
      sseClients.set(roomId, new Set());
    }
    const clientSet = sseClients.get(roomId)!;
    clientSet.add(res);

    room.devices.set(deviceId, { name: deviceName, lastSeen: Date.now() });

    // Send initial snapshot
    const initialData = JSON.stringify({
      type: "INIT",
      roomId,
      tasks: room.tasks,
      sections: room.sections,
      connectedDevices: Array.from(room.devices.entries()).map(([id, dev]) => ({
        id,
        name: dev.name,
        lastSeen: dev.lastSeen,
      })),
      deviceCount: room.devices.size,
      timestamp: new Date().toISOString(),
    });
    res.write(`data: ${initialData}\n\n`);

    // Keepalive ping every 15 seconds
    const pingInterval = setInterval(() => {
      res.write(`: ping\n\n`);
      if (room.devices.has(deviceId)) {
        room.devices.set(deviceId, { name: deviceName, lastSeen: Date.now() });
      }
    }, 15000);

    req.on("close", () => {
      clearInterval(pingInterval);
      clientSet.delete(res);
      room.devices.delete(deviceId);

      // Broadcast device disconnection
      const remainingData = JSON.stringify({
        type: "DEVICE_LEFT",
        roomId,
        connectedDevices: Array.from(room.devices.entries()).map(([id, dev]) => ({
          id,
          name: dev.name,
          lastSeen: dev.lastSeen,
        })),
        deviceCount: room.devices.size,
      });
      for (const client of clientSet) {
        client.write(`data: ${remainingData}\n\n`);
      }
    });
  });

  // Vite development middleware vs production static files
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Master OS Server running on port ${PORT}`);
  });
}

startServer();
