"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { tasks } from "@/data/mock";
import { Circle, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";

const statusConfig = {
  queued: { icon: Circle, color: "text-zinc-400", badge: "outline" as const },
  "in-progress": { icon: Loader2, color: "text-blue-500", badge: "default" as const },
  completed: { icon: CheckCircle2, color: "text-emerald-500", badge: "success" as const },
  blocked: { icon: AlertCircle, color: "text-red-500", badge: "error" as const },
};

type StatusFilter = "all" | "queued" | "in-progress" | "completed" | "blocked";

export default function TasksPage() {
  const [filter, setFilter] = useState<StatusFilter>("all");

  const filtered = filter === "all" ? tasks : tasks.filter((t) => t.status === filter);
  const counts = {
    all: tasks.length,
    queued: tasks.filter((t) => t.status === "queued").length,
    "in-progress": tasks.filter((t) => t.status === "in-progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    blocked: tasks.filter((t) => t.status === "blocked").length,
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Task Pipeline</h1>
        <p className="text-sm text-muted-foreground mt-1">All tasks queued, in progress, and completed</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-1 flex-wrap">
        {(["all", "in-progress", "queued", "completed", "blocked"] as StatusFilter[]).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-150 ${
              filter === s
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            }`}
          >
            {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1).replace("-", " ")}
            <span className="ml-1.5 text-muted-foreground">{counts[s]}</span>
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="space-y-2">
        {filtered.map((task, i) => {
          const config = statusConfig[task.status];
          const Icon = config.icon;
          return (
            <Card
              key={task.id}
              className="flex items-center gap-4 hover:border-primary/20 transition-colors duration-150 animate-fade-in"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <Icon
                className={`h-4 w-4 shrink-0 ${config.color} ${
                  task.status === "in-progress" ? "animate-spin" : ""
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{task.title}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {task.tags.map((tag) => (
                    <span key={tag} className="text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant={config.badge}>
                  {task.status.replace("-", " ")}
                </Badge>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
