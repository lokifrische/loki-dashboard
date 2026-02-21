"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { tasks } from "@/data/mock";
import { Circle, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const statusConfig = {
  queued: { icon: Circle, color: "text-zinc-400", badge: "outline" as const, label: "Queued" },
  "in-progress": { icon: Loader2, color: "text-blue-500", badge: "default" as const, label: "In Progress" },
  completed: { icon: CheckCircle2, color: "text-emerald-500", badge: "success" as const, label: "Done" },
  blocked: { icon: AlertCircle, color: "text-red-500", badge: "error" as const, label: "Blocked" },
};

const priorityBadge = {
  low: "outline" as const,
  medium: "outline" as const,
  high: "warning" as const,
  critical: "error" as const,
};

export function TaskPipeline({ limit = 5 }: { limit?: number }) {
  const sorted = [...tasks].sort((a, b) => {
    const order = { "in-progress": 0, queued: 1, blocked: 2, completed: 3 };
    return order[a.status] - order[b.status];
  });

  return (
    <Card>
      <CardTitle className="mb-4">Task Pipeline</CardTitle>
      <div className="space-y-1">
        {sorted.slice(0, limit).map((task, i) => {
          const config = statusConfig[task.status];
          const Icon = config.icon;
          return (
            <div
              key={task.id}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-accent/50 transition-colors duration-150 animate-slide-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <Icon
                className={`h-4 w-4 shrink-0 ${config.color} ${
                  task.status === "in-progress" ? "animate-spin" : ""
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">{task.title}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Badge variant={priorityBadge[task.priority]}>{task.priority}</Badge>
                <Badge variant={config.badge}>{config.label}</Badge>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
