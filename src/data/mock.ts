// Mock data representing real Loki activity
// Structured for easy API integration later

export type LokiStatus = "active" | "idle" | "processing";

export interface TaskItem {
  id: string;
  title: string;
  status: "queued" | "in-progress" | "completed" | "blocked";
  priority: "low" | "medium" | "high" | "critical";
  createdAt: string;
  completedAt?: string;
  tags: string[];
}

export interface ActivityItem {
  id: string;
  type: "task" | "research" | "memory" | "system" | "deploy" | "code";
  title: string;
  description: string;
  timestamp: string;
  icon?: string;
}

export interface MemoryTopic {
  name: string;
  file: string;
  lastUpdated: string;
  entries: number;
}

export interface SystemHealth {
  cpu: number;
  ram: { used: number; total: number };
  disk: { used: number; total: number };
  uptime: string;
  browserStatus: "running" | "stopped" | "error";
  cronJobs: { name: string; schedule: string; lastRun: string; status: "ok" | "error" }[];
}

export interface QuickStats {
  tasksCompletedToday: number;
  memoryFilesCreated: number;
  subAgentsSpawned: number;
  uptimeHours: number;
  totalTasksCompleted: number;
  topicsDocumented: number;
}

// --- Mock Data ---

export const lokiStatus: {
  status: LokiStatus;
  currentTask: string;
  currentTaskStarted: string;
  model: string;
  channel: string;
} = {
  status: "active",
  currentTask: "Building Loki Dashboard — Phase 2 deployment",
  currentTaskStarted: "2026-02-21T00:41:00Z",
  model: "claude-sonnet-4-5",
  channel: "webchat",
};

export const tasks: TaskItem[] = [
  {
    id: "t-001",
    title: "Build Loki Dashboard",
    status: "in-progress",
    priority: "critical",
    createdAt: "2026-02-21T00:30:00Z",
    tags: ["project", "ui", "phase-2"],
  },
  {
    id: "t-002",
    title: "Deploy to Vercel",
    status: "queued",
    priority: "high",
    createdAt: "2026-02-21T00:30:00Z",
    tags: ["deploy"],
  },
  {
    id: "t-003",
    title: "Push to GitHub (lokifrische/loki-dashboard)",
    status: "queued",
    priority: "high",
    createdAt: "2026-02-21T00:30:00Z",
    tags: ["git"],
  },
  {
    id: "t-004",
    title: "Set up project structure & design system",
    status: "completed",
    priority: "high",
    createdAt: "2026-02-20T23:00:00Z",
    completedAt: "2026-02-21T00:20:00Z",
    tags: ["project", "foundation"],
  },
  {
    id: "t-005",
    title: "Read SOUL.md, IDENTITY.md, USER.md",
    status: "completed",
    priority: "medium",
    createdAt: "2026-02-20T22:30:00Z",
    completedAt: "2026-02-20T22:32:00Z",
    tags: ["memory", "init"],
  },
  {
    id: "t-006",
    title: "Research Linear/Vercel UI patterns",
    status: "completed",
    priority: "medium",
    createdAt: "2026-02-20T22:35:00Z",
    completedAt: "2026-02-20T23:00:00Z",
    tags: ["research", "ui"],
  },
  {
    id: "t-007",
    title: "Document coding workflow in memory",
    status: "completed",
    priority: "medium",
    createdAt: "2026-02-20T23:10:00Z",
    completedAt: "2026-02-20T23:20:00Z",
    tags: ["memory", "documentation"],
  },
  {
    id: "t-008",
    title: "Connect live OpenClaw API",
    status: "queued",
    priority: "medium",
    createdAt: "2026-02-21T00:30:00Z",
    tags: ["api", "integration"],
  },
  {
    id: "t-009",
    title: "Set up monitoring & alerts",
    status: "queued",
    priority: "low",
    createdAt: "2026-02-21T00:30:00Z",
    tags: ["ops"],
  },
];

export const activities: ActivityItem[] = [
  {
    id: "a-001",
    type: "code",
    title: "Building Loki Dashboard",
    description: "Creating Next.js project with TypeScript, Tailwind, shadcn/ui",
    timestamp: "2026-02-21T00:41:00Z",
  },
  {
    id: "a-002",
    type: "task",
    title: "Phase 2 initiated",
    description: "Started building first project — Loki Dashboard proof of concept",
    timestamp: "2026-02-21T00:30:00Z",
  },
  {
    id: "a-003",
    type: "memory",
    title: "Saved UI design spec",
    description: "Documented design system standards in memory/topics/ui-design-spec.md",
    timestamp: "2026-02-21T00:20:00Z",
  },
  {
    id: "a-004",
    type: "research",
    title: "Analyzed Linear & Vercel UI",
    description: "Studied component patterns, animations, dark mode implementations",
    timestamp: "2026-02-20T23:00:00Z",
  },
  {
    id: "a-005",
    type: "memory",
    title: "Created coding workflow doc",
    description: "7-phase coding process documented in memory/topics/coding-workflow.md",
    timestamp: "2026-02-20T23:20:00Z",
  },
  {
    id: "a-006",
    type: "system",
    title: "Session started",
    description: "Initialized on webchat channel, model: claude-sonnet-4-5",
    timestamp: "2026-02-20T22:30:00Z",
  },
  {
    id: "a-007",
    type: "memory",
    title: "Read identity files",
    description: "Loaded SOUL.md, IDENTITY.md, USER.md — established context",
    timestamp: "2026-02-20T22:32:00Z",
  },
  {
    id: "a-008",
    type: "deploy",
    title: "VPS environment verified",
    description: "Confirmed Node.js, npm, git, gh CLI available on openclaw-nick",
    timestamp: "2026-02-20T22:35:00Z",
  },
];

export const memoryTopics: MemoryTopic[] = [
  { name: "UI Design Spec", file: "ui-design-spec.md", lastUpdated: "2026-02-21T00:20:00Z", entries: 12 },
  { name: "Coding Workflow", file: "coding-workflow.md", lastUpdated: "2026-02-20T23:20:00Z", entries: 7 },
  { name: "Nick's Preferences", file: "nick-preferences.md", lastUpdated: "2026-02-20T23:00:00Z", entries: 15 },
  { name: "Project Ideas", file: "project-ideas.md", lastUpdated: "2026-02-20T22:50:00Z", entries: 5 },
  { name: "Tool Patterns", file: "tool-patterns.md", lastUpdated: "2026-02-20T22:45:00Z", entries: 8 },
];

export const systemHealth: SystemHealth = {
  cpu: 23,
  ram: { used: 1.2, total: 4.0 },
  disk: { used: 12.4, total: 80 },
  uptime: "3d 14h 22m",
  browserStatus: "running",
  cronJobs: [
    { name: "heartbeat-check", schedule: "*/5 * * * *", lastRun: "2026-02-21T00:40:00Z", status: "ok" },
    { name: "memory-backup", schedule: "0 */6 * * *", lastRun: "2026-02-21T00:00:00Z", status: "ok" },
    { name: "log-rotation", schedule: "0 0 * * *", lastRun: "2026-02-21T00:00:00Z", status: "ok" },
  ],
};

export const quickStats: QuickStats = {
  tasksCompletedToday: 4,
  memoryFilesCreated: 5,
  subAgentsSpawned: 2,
  uptimeHours: 86,
  totalTasksCompleted: 12,
  topicsDocumented: 5,
};

// Activity chart data (last 7 days)
export const activityChartData = [
  { day: "Mon", tasks: 3, memory: 2, research: 1 },
  { day: "Tue", tasks: 5, memory: 3, research: 2 },
  { day: "Wed", tasks: 2, memory: 1, research: 4 },
  { day: "Thu", tasks: 7, memory: 4, research: 1 },
  { day: "Fri", tasks: 4, memory: 2, research: 3 },
  { day: "Sat", tasks: 6, memory: 5, research: 2 },
  { day: "Sun", tasks: 4, memory: 3, research: 1 },
];
