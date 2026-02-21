"use client";

import { Card } from "@/components/ui/card";
import { activities } from "@/data/mock";
import { formatRelativeTime, formatTime } from "@/lib/utils";
import { Code2, ListTodo, Brain, Search, Server, Rocket } from "lucide-react";

const typeIcons: Record<string, typeof Code2> = {
  code: Code2, task: ListTodo, memory: Brain, research: Search, system: Server, deploy: Rocket,
};
const typeColors: Record<string, string> = {
  code: "bg-blue-500", task: "bg-emerald-500", memory: "bg-violet-500",
  research: "bg-amber-500", system: "bg-zinc-500", deploy: "bg-cyan-500",
};

export default function ActivityPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Activity Feed</h1>
        <p className="text-sm text-muted-foreground mt-1">Timeline of everything Loki has been doing</p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border" />

        <div className="space-y-1">
          {activities.map((item, i) => {
            const Icon = typeIcons[item.type] || Code2;
            const dotColor = typeColors[item.type] || "bg-zinc-500";
            const date = new Date(item.timestamp);

            return (
              <div
                key={item.id}
                className="relative flex items-start gap-4 pl-10 py-3 animate-fade-in"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* Dot */}
                <div className={`absolute left-[15px] top-[18px] h-2.5 w-2.5 rounded-full ${dotColor} ring-4 ring-background`} />

                <Card className="flex-1 hover:border-primary/20 transition-colors duration-150">
                  <div className="flex items-start gap-3">
                    <div className={`h-8 w-8 rounded-lg ${dotColor}/10 flex items-center justify-center shrink-0`}>
                      <Icon className={`h-4 w-4 ${dotColor.replace("bg-", "text-")}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">{item.title}</p>
                        <span className="text-[10px] text-muted-foreground shrink-0 ml-2">
                          {formatRelativeTime(date)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                      <p className="text-[10px] text-muted-foreground mt-1 font-mono">{formatTime(date)}</p>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
