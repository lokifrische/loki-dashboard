"use client";

import { useEffect, useState } from "react";
import { Loader2, Zap } from "lucide-react";
import { subscribeTasks } from "@/lib/tasks-db";
import type { TaskItem } from "@/data/mock";

const priorityColor: Record<string, string> = {
  critical: "bg-red-500/10 border-red-500/30 text-red-400",
  high: "bg-orange-500/10 border-orange-500/30 text-orange-400",
  medium: "bg-blue-500/10 border-blue-500/30 text-blue-400",
  low: "bg-zinc-500/10 border-zinc-500/30 text-zinc-400",
};

export function ActiveWork() {
  const [active, setActive] = useState<TaskItem[]>([]);

  useEffect(() => {
    return subscribeTasks((tasks) => {
      setActive(tasks.filter((t) => t.status === "in-progress"));
    });
  }, []);

  if (active.length === 0) return null;

  return (
    <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3">
      <div className="flex items-center gap-2 mb-2">
        <Loader2 className="h-3.5 w-3.5 text-blue-400 animate-spin" />
        <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide">Loki is currently working on</span>
      </div>
      <div className="space-y-1.5">
        {active.map((task) => (
          <div key={task.id} className="flex items-center gap-3">
            <Zap className="h-3 w-3 text-blue-400 shrink-0" />
            <span className="text-sm font-medium text-foreground flex-1 truncate">{task.title}</span>
            <span className={`text-[10px] font-medium rounded-full px-2 py-0.5 border ${priorityColor[task.priority]}`}>
              {task.priority}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
