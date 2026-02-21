"use client";

import { SystemHealth } from "@/components/dashboard/system-health";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Server, Wifi, Shield, Terminal } from "lucide-react";

export default function SystemPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-lg font-semibold text-foreground">System Health</h1>
        <p className="text-sm text-muted-foreground mt-1">VPS stats, services, and infrastructure status</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SystemHealth />

        <div className="space-y-4">
          {/* Server Info */}
          <Card>
            <CardTitle className="mb-4">Server Info</CardTitle>
            <div className="space-y-3">
              {[
                { icon: Server, label: "Host", value: "openclaw-nick" },
                { icon: Terminal, label: "OS", value: "Linux 6.8.0-100 (x64)" },
                { icon: Wifi, label: "Node.js", value: "v22.22.0" },
                { icon: Shield, label: "Shell", value: "bash" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                  </div>
                  <span className="text-xs font-mono text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Services */}
          <Card>
            <CardTitle className="mb-4">Services</CardTitle>
            <div className="space-y-2">
              {[
                { name: "OpenClaw Gateway", status: "running" },
                { name: "Browser (Chromium)", status: "running" },
                { name: "Next.js Dev Server", status: "stopped" },
                { name: "Cron Scheduler", status: "running" },
              ].map((svc) => (
                <div key={svc.name} className="flex items-center justify-between py-1">
                  <span className="text-sm text-foreground">{svc.name}</span>
                  <Badge variant={svc.status === "running" ? "success" : "outline"}>
                    {svc.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
