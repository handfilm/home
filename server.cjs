var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var rooms = /* @__PURE__ */ new Map();
var sseClients = /* @__PURE__ */ new Map();
var defaultSections = [
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
    accent: "#b14a26"
  },
  {
    id: "b2b",
    category: "02 / B2B",
    title: "ARUTEMIKA",
    sub: "B2B, Corporate & Wholesale Commerce",
    desc: "A dedicated environment for corporate and wholesale buyers \u2014 sourcing, bulk catalogue and account ordering.",
    url: "arutemika.handsandhead.com",
    dest: "https://arutemika.handsandhead.com/",
    cta: "ENTER B2B",
    tex: "tex-b2b",
    accent: "#4a6670"
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
    accent: "#c79a3d"
  }
];
var defaultTasks = [
  {
    id: "task-1",
    title: "Review WhatsApp checkout integration for D2C Shop",
    description: "Verify mobile payment flow and instant message order confirmations.",
    sectionId: "d2c",
    priority: "high",
    status: "in_progress",
    dueDate: "2026-09-02",
    tags: ["E-Commerce", "Checkout", "Mobile"],
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    deviceOrigin: "Master Terminal"
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
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    deviceOrigin: "Master Terminal"
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
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    deviceOrigin: "Master Terminal"
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
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    deviceOrigin: "Master Terminal"
  }
];
function getOrCreateRoom(roomId) {
  const normalized = (roomId || "MAIN-ROOM").toUpperCase().trim();
  if (!rooms.has(normalized)) {
    rooms.set(normalized, {
      tasks: [...defaultTasks],
      sections: [...defaultSections],
      devices: /* @__PURE__ */ new Map(),
      lastUpdated: Date.now()
    });
  }
  return { roomId: normalized, room: rooms.get(normalized) };
}
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json({ limit: "5mb" }));
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", uptime: process.uptime(), timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app.get("/api/sync/room/:roomId", (req, res) => {
    const { roomId, room } = getOrCreateRoom(req.params.roomId);
    const deviceId = req.query.deviceId;
    const deviceName = req.query.deviceName;
    if (deviceId && deviceName) {
      room.devices.set(deviceId, { name: deviceName, lastSeen: Date.now() });
    }
    const now = Date.now();
    for (const [id, dev] of room.devices.entries()) {
      if (now - dev.lastSeen > 12e4) {
        room.devices.delete(id);
      }
    }
    const connectedDevices = Array.from(room.devices.entries()).map(([id, dev]) => ({
      id,
      name: dev.name,
      lastSeen: dev.lastSeen
    }));
    res.json({
      success: true,
      roomId,
      tasks: room.tasks,
      sections: room.sections,
      connectedDevices,
      deviceCount: room.devices.size,
      lastUpdated: room.lastUpdated
    });
  });
  app.post("/api/sync/room/:roomId", (req, res) => {
    const { roomId, room } = getOrCreateRoom(req.params.roomId);
    const payload = req.body;
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
      lastSeen: dev.lastSeen
    }));
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
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        action: payload.action || "UPDATE"
      });
      for (const client of clients) {
        client.write(`data: ${data}

`);
      }
    }
    res.json({
      success: true,
      roomId,
      tasksCount: room.tasks.length,
      sectionsCount: room.sections.length,
      deviceCount: room.devices.size,
      lastUpdated: room.lastUpdated
    });
  });
  app.get("/api/sync/stream/:roomId", (req, res) => {
    const { roomId, room } = getOrCreateRoom(req.params.roomId);
    const deviceId = req.query.deviceId || `dev-${Date.now()}`;
    const deviceName = req.query.deviceName || "Unknown Device";
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    if (!sseClients.has(roomId)) {
      sseClients.set(roomId, /* @__PURE__ */ new Set());
    }
    const clientSet = sseClients.get(roomId);
    clientSet.add(res);
    room.devices.set(deviceId, { name: deviceName, lastSeen: Date.now() });
    const initialData = JSON.stringify({
      type: "INIT",
      roomId,
      tasks: room.tasks,
      sections: room.sections,
      connectedDevices: Array.from(room.devices.entries()).map(([id, dev]) => ({
        id,
        name: dev.name,
        lastSeen: dev.lastSeen
      })),
      deviceCount: room.devices.size,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    res.write(`data: ${initialData}

`);
    const pingInterval = setInterval(() => {
      res.write(`: ping

`);
      if (room.devices.has(deviceId)) {
        room.devices.set(deviceId, { name: deviceName, lastSeen: Date.now() });
      }
    }, 15e3);
    req.on("close", () => {
      clearInterval(pingInterval);
      clientSet.delete(res);
      room.devices.delete(deviceId);
      const remainingData = JSON.stringify({
        type: "DEVICE_LEFT",
        roomId,
        connectedDevices: Array.from(room.devices.entries()).map(([id, dev]) => ({
          id,
          name: dev.name,
          lastSeen: dev.lastSeen
        })),
        deviceCount: room.devices.size
      });
      for (const client of clientSet) {
        client.write(`data: ${remainingData}

`);
      }
    });
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Master OS Server running on port ${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
