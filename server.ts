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
  imageUrl?: string;
  isCustom?: boolean;
  displayOrder?: number;
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

// Full 24-module production ecosystem dataset (synchronized with live handsandhead.com)
const defaultSections: SectionItem[] = [
  {
    id: "d2c",
    category: "01 / COMMERCE",
    title: "D2C SHOP",
    sub: "Hands & Head Consumer Commerce",
    desc: "Direct-to-consumer products, drops, catalogue and WhatsApp-first ordering.",
    url: "d2c.handsandhead.com",
    dest: "https://d2c.handsandhead.com/",
    cta: "ENTER SHOP",
    tex: "tex-commerce",
    accent: "#b14a26",
    displayOrder: 1,
  },
  {
    id: "arutemika",
    category: "02 / COMMERCE",
    title: "ARUTEMIKA",
    sub: "B2B / Corporate / Wholesale Commerce",
    desc: "Dedicated corporate and wholesale procurement environment — sourcing, bulk catalogue, and account ordering.",
    url: "arutemika.handsandhead.com",
    dest: "https://arutemika.handsandhead.com/",
    cta: "ENTER B2B",
    tex: "tex-commerce",
    accent: "#8a5a3a",
    displayOrder: 2,
  },
  {
    id: "articles",
    category: "03 / CONTENT",
    title: "ARTICLES",
    sub: "Ideas, Research & Editorial Dispatches",
    desc: "Long-form essays on industrial systems, technology, design, AI, and culture from the H&H studio.",
    url: "articles.handsandhead.com",
    dest: "https://articles.handsandhead.com/",
    cta: "READ ARTICLES",
    tex: "tex-media",
    accent: "#c79a3d",
    displayOrder: 3,
  },
  {
    id: "studio",
    category: "04 / CONTENT",
    title: "STUDIO",
    sub: "Handfilm & Storyboard WebGL2 Cinema Engine",
    desc: "Browser-based WebGL2 AI Video Platform, NLE Editor, Player, and Cloudflare Video Host for creative direction.",
    url: "storyboard.handsandhead.com",
    dest: "https://storyboard.handsandhead.com/",
    cta: "ENTER STUDIO",
    tex: "tex-film",
    accent: "#E50914",
    displayOrder: 4,
  },
  {
    id: "aural",
    category: "05 / CONTENT",
    title: "AURAL",
    sub: "Sound, Audio & Music Division",
    desc: "Acoustic research, ambient procedural soundscapes, and audio production across the H&H ecosystem.",
    url: "aural.handsandhead.com",
    dest: "https://aural.handsandhead.com/",
    cta: "LISTEN",
    tex: "tex-media",
    accent: "#3f7a72",
    displayOrder: 5,
  },
  {
    id: "textile",
    category: "06 / MANUFACTURING",
    title: "TEXTILE",
    sub: "Fabric, Mills & Material Sourcing",
    desc: "Woven and knit textile sourcing, mill partnerships, and custom fabric development for the H&H B2B wings.",
    url: "b2b.handsandhead.com/#textile",
    dest: "https://b2b.handsandhead.com/#textile",
    cta: "ENTER TEXTILE",
    tex: "tex-manuf",
    accent: "#3a4a5c",
    displayOrder: 6,
  },
  {
    id: "rmg",
    category: "07 / MANUFACTURING",
    title: "RMG",
    sub: "Ready-Made Garments & Heavyweight Streetwear",
    desc: "Direct-from-source garment production, heavyweight streetwear, factory sourcing, and export-ready manufacturing.",
    url: "b2b.handsandhead.com/#rmg",
    dest: "https://b2b.handsandhead.com/#rmg",
    cta: "ENTER RMG",
    tex: "tex-manuf",
    accent: "#4a5562",
    displayOrder: 7,
  },
  {
    id: "leather",
    category: "08 / MANUFACTURING",
    title: "LEATHER",
    sub: "Genuine Leather Goods & Tannery Sourcing",
    desc: "Full-grain hide procurement, audited tannery partnerships, and finished leather-goods production.",
    url: "b2b.handsandhead.com/#leather",
    dest: "https://b2b.handsandhead.com/#leather",
    cta: "ENTER LEATHER",
    tex: "tex-manuf",
    accent: "#7a3b28",
    displayOrder: 8,
  },
  {
    id: "jacket",
    category: "09 / MANUFACTURING",
    title: "JACKET",
    sub: "Custom Outerwear & Jacket Manufacturing",
    desc: "Specialized technical outerwear, leather jackets, and structured coat production within the H&H network.",
    url: "jacket.handsandhead.com",
    dest: "https://jacket.handsandhead.com/",
    cta: "ENTER JACKET",
    tex: "tex-manuf",
    accent: "#35424a",
    displayOrder: 9,
  },
  {
    id: "jute",
    category: "10 / MANUFACTURING",
    title: "JUTE",
    sub: "Jute & Natural Fibre Sourcing",
    desc: "Eco-friendly jute processing, natural fiber woven goods, and sustainable industrial packaging.",
    url: "b2b.handsandhead.com/#jute",
    dest: "https://b2b.handsandhead.com/#jute",
    cta: "ENTER JUTE",
    tex: "tex-jute",
    accent: "#6b5a3c",
    displayOrder: 10,
  },
  {
    id: "lingerie",
    category: "11 / MANUFACTURING",
    title: "LINGERIE",
    sub: "Intimate Apparel Manufacturing",
    desc: "Fine lingerie, intimate apparel engineering, seamless fabrication, and precision assembly.",
    url: "b2b.handsandhead.com/#lingerie",
    dest: "https://b2b.handsandhead.com/#lingerie",
    cta: "ENTER LINGERIE",
    tex: "tex-lingerie",
    accent: "#6a4a55",
    displayOrder: 11,
  },
  {
    id: "bracelets",
    category: "12 / MANUFACTURING",
    title: "BRACELETS",
    sub: "316L/516SS Precision Hardware & Handcrafted Accessories",
    desc: "Architectural stainless-steel 316L/516SS hardware, woven cord bracelets, and bespoke metal accessory fabrication.",
    url: "rawx.handsandhead.com",
    dest: "https://rawx.handsandhead.com/",
    cta: "ENTER BRACELETS",
    tex: "tex-craft",
    accent: "#9c7a4a",
    displayOrder: 12,
  },
  {
    id: "bloom",
    category: "13 / LIFESTYLE",
    title: "BLOOM",
    sub: "Floral & Botanical Division",
    desc: "The floral and botanical arm of Hands & Head — sourcing, sculptural arrangement, and botanical development.",
    url: "bloom.handsandhead.com",
    dest: "https://bloom.handsandhead.com/",
    cta: "ENTER BLOOM",
    tex: "tex-craft",
    accent: "#5c7a5c",
    displayOrder: 13,
  },
  {
    id: "gym",
    category: "14 / LIFESTYLE",
    title: "GYM",
    sub: "Fitness, Performance Gear & Wellness",
    desc: "Athletic performance equipment, wellness protocols, and technical training apparel development.",
    url: "gym.handsandhead.com",
    dest: "https://gym.handsandhead.com/",
    cta: "ENTER GYM",
    tex: "tex-gym",
    accent: "#a4463f",
    displayOrder: 14,
  },
  {
    id: "agro",
    category: "15 / FOOD",
    title: "AGRO",
    sub: "Agriculture & Agro-Processing",
    desc: "Direct agricultural sourcing, farm-to-factory supply chains, and agro-processing operations under H&H.",
    url: "agro.handsandhead.com",
    dest: "https://agro.handsandhead.com/",
    cta: "ENTER AGRO",
    tex: "tex-agro-cat",
    accent: "#6f8c4e",
    displayOrder: 15,
  },
  {
    id: "food",
    category: "16 / FOOD",
    title: "FOOD",
    sub: "Food Production & Distribution",
    desc: "Packaged food product development, quality-certified processing, and cold/dry distribution.",
    url: "food.handsandhead.com",
    dest: "https://food.handsandhead.com/",
    cta: "ENTER FOOD",
    tex: "tex-agro-cat",
    accent: "#b5793a",
    displayOrder: 16,
  },
  {
    id: "bloomapp",
    category: "17 / APPS",
    title: "BLOOM APP",
    sub: "Botanical Ordering & Dispatch App",
    desc: "Digital concierge and rapid floral delivery application for seasonal and bespoke arrangements.",
    url: "bloomapp.handsandhead.com",
    dest: "https://bloomapp.handsandhead.com/",
    cta: "OPEN APP",
    tex: "tex-bloomapp",
    accent: "#5c9a6f",
    displayOrder: 17,
  },
  {
    id: "apps",
    category: "18 / APPS",
    title: "APPS",
    sub: "H&H Software & Utility Cloud",
    desc: "Internal web applications, operational software suites, APIs, and cross-team productivity tools.",
    url: "apps.handsandhead.com",
    dest: "https://apps.handsandhead.com/",
    cta: "VIEW APPS",
    tex: "tex-apps",
    accent: "#6b7f8f",
    displayOrder: 18,
  },
  {
    id: "note",
    category: "19 / APPS",
    title: "NOTE",
    sub: "Notes & Encrypted Writing Workspace",
    desc: "Markdown editor, structured team knowledge repository, and fast local-first writing environment.",
    url: "note.handsandhead.com",
    dest: "https://note.handsandhead.com/",
    cta: "OPEN NOTE",
    tex: "tex-tools",
    accent: "#b0a888",
    displayOrder: 19,
  },
  {
    id: "picseed",
    category: "20 / APPS",
    title: "PICSEED",
    sub: "Image CDN & Visual Tooling Pipeline",
    desc: "Automated media processing, image optimization, and high-fidelity visual asset generation pipelines.",
    url: "picseed.handsandhead.com",
    dest: "https://picseed.handsandhead.com/",
    cta: "OPEN PICSEED",
    tex: "tex-tools",
    accent: "#9a5c8a",
    displayOrder: 20,
  },
  {
    id: "hub",
    category: "21 / APPS",
    title: "HUB",
    sub: "Central Ecosystem Control Spine",
    desc: "Unified command panel, real-time operational telemetry, and cross-portal routing backbone.",
    url: "hub.handsandhead.com",
    dest: "https://hub.handsandhead.com/",
    cta: "ENTER HUB",
    tex: "tex-tools",
    accent: "#3f8a8f",
    displayOrder: 21,
  },
  {
    id: "deeper",
    category: "22 / APPS",
    title: "DEEPER",
    sub: "R&D & Frontier Exploration Lab",
    desc: "In-depth systems research, experimental WebGL interfaces, and next-generation concept incubation.",
    url: "deeper.handsandhead.com",
    dest: "https://deeper.handsandhead.com/",
    cta: "GO DEEPER",
    tex: "tex-tools",
    accent: "#5a5a9c",
    displayOrder: 22,
  },
  {
    id: "hiya",
    category: "23 / APPS",
    title: "HIYA",
    sub: "Low-Latency Messaging & Team Mesh",
    desc: "Peer-to-peer fast messaging, operational dispatches, and real-time status signals across units.",
    url: "hiya.handsandhead.com",
    dest: "https://hiya.handsandhead.com/",
    cta: "SAY HIYA",
    tex: "tex-tools",
    accent: "#c26a5a",
    displayOrder: 23,
  },
  {
    id: "me",
    category: "24 / APPS",
    title: "ME",
    sub: "Founder Profile, Identity & SSO Enclave",
    desc: "Personal profile, single sign-on identity verification, workspace settings, and secure key management.",
    url: "rakib.handsandhead.com",
    dest: "https://rakib.handsandhead.com/",
    cta: "ENTER ME",
    tex: "tex-tools",
    accent: "#8f8f7a",
    displayOrder: 24,
  },
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
    sectionId: "arutemika",
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
  },
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

    if (Array.isArray(payload.sections) && payload.sections.length > 0) {
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
