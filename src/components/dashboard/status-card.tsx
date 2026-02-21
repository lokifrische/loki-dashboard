"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { lokiStatus } from "@/data/mock";
import { Zap, Radio } from "lucide-react";

export function StatusCard() {
  return (
    <Card className="relative overflow-hidden">
      {/* Subtle gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative flex items-start justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-medium text-foreground">Loki Status</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
                <span className="text-xs text-emerald-500 font-medium">Active</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <p className="text-xs text-muted-foreground">Currently working on</p>
              <p className="text-sm font-medium text-foreground mt-0.5">{lokiStatus.currentTask}</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline">{lokiStatus.model}</Badge>
              <Badge variant="outline">{lokiStatus.channel}</Badge>
            </div>
          </div>
        </div>

        <div className="shrink-0">
          <Radio className="h-4 w-4 text-primary animate-pulse" />
        </div>
      </div>
    </Card>
  );
}
