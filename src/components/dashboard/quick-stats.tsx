"use client";

import { Card } from "@/components/ui/card";
import { quickStats } from "@/data/mock";
import { CheckCircle2, FileText, GitBranch, Clock } from "lucide-react";
import { useEffect, useState } from "react";

const stats = [
  {
    label: "Tasks Today",
    value: quickStats.tasksCompletedToday,
    icon: CheckCircle2,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    label: "Memory Files",
    value: quickStats.memoryFilesCreated,
    icon: FileText,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    label: "Sub-agents",
    value: quickStats.subAgentsSpawned,
    icon: GitBranch,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    label: "Uptime",
    value: quickStats.uptimeHours,
    suffix: "h",
    icon: Clock,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 800;
    const steps = 20;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <span className="text-2xl font-semibold tracking-tight text-foreground animate-counter">
      {count}
      {suffix && <span className="text-lg text-muted-foreground ml-0.5">{suffix}</span>}
    </span>
  );
}

export function QuickStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <Card
          key={stat.label}
          className="group hover:border-primary/20 cursor-default"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="flex items-center gap-3">
            <div className={`h-9 w-9 rounded-lg ${stat.bgColor} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <div>
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
