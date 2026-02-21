"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { activities } from "@/data/mock";
import { formatRelativeTime } from "@/lib/utils";
import {
  Code2,
  ListTodo,
  Brain,
  Search,
  Server,
  Rocket,
} from "lucide-react";

const typeIcons: Record<string, typeof Code2> = {
  code: Code2,
  task: ListTodo,
  memory: Brain,
  research: Search,
  system: Server,
  deploy: Rocket,
};

const typeColors: Record<string, string> = {
  code: "text-blue-500 bg-blue-500/10",
  task: "text-emerald-500 bg-emerald-500/10",
  memory: "text-violet-500 bg-violet-500/10",
  research: "text-amber-500 bg-amber-500/10",
  system: "text-zinc-400 bg-zinc-400/10",
  deploy: "text-cyan-500 bg-cyan-500/10",
};

export function RecentActivity() {
  return (
    <Card>
      <CardTitle className="mb-4">Recent Activity</CardTitle>
      <div className="space-y-1">
        {activities.slice(0, 6).map((item, i) => {
          const Icon = typeIcons[item.type] || Code2;
          const colorClass = typeColors[item.type] || "text-zinc-400 bg-zinc-400/10";
          const [iconColor, iconBg] = colorClass.split(" ");

          return (
            <div
              key={item.id}
              className="flex items-start gap-3 rounded-lg px-3 py-2.5 hover:bg-accent/50 transition-colors duration-150 animate-slide-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className={`h-7 w-7 rounded-md ${iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground truncate">{item.description}</p>
              </div>
              <span className="text-[10px] text-muted-foreground shrink-0 mt-1">
                {formatRelativeTime(new Date(item.timestamp))}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
