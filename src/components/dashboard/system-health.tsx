"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { systemHealth } from "@/data/mock";
import { Cpu, HardDrive, MemoryStick, Clock, Globe, Cog } from "lucide-react";

export function SystemHealth() {
  const ramPercent = (systemHealth.ram.used / systemHealth.ram.total) * 100;
  const diskPercent = (systemHealth.disk.used / systemHealth.disk.total) * 100;

  return (
    <Card>
      <CardTitle className="mb-4">System Health</CardTitle>
      <div className="space-y-4">
        {/* CPU */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">CPU</span>
            </div>
            <span className="text-xs font-medium text-foreground">{systemHealth.cpu}%</span>
          </div>
          <Progress value={systemHealth.cpu} indicatorClassName={systemHealth.cpu > 80 ? "bg-red-500" : systemHealth.cpu > 50 ? "bg-amber-500" : "bg-emerald-500"} />
        </div>

        {/* RAM */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MemoryStick className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">RAM</span>
            </div>
            <span className="text-xs font-medium text-foreground">{systemHealth.ram.used}GB / {systemHealth.ram.total}GB</span>
          </div>
          <Progress value={ramPercent} indicatorClassName={ramPercent > 80 ? "bg-red-500" : ramPercent > 50 ? "bg-amber-500" : "bg-blue-500"} />
        </div>

        {/* Disk */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Disk</span>
            </div>
            <span className="text-xs font-medium text-foreground">{systemHealth.disk.used}GB / {systemHealth.disk.total}GB</span>
          </div>
          <Progress value={diskPercent} indicatorClassName="bg-violet-500" />
        </div>

        {/* Uptime & Browser */}
        <div className="flex items-center gap-4 pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Uptime:</span>
            <span className="text-xs font-medium text-foreground">{systemHealth.uptime}</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Browser:</span>
            <Badge variant={systemHealth.browserStatus === "running" ? "success" : "error"}>
              {systemHealth.browserStatus}
            </Badge>
          </div>
        </div>

        {/* Cron Jobs */}
        <div className="pt-2 border-t border-border space-y-1.5">
          <div className="flex items-center gap-2 mb-2">
            <Cog className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Cron Jobs</span>
          </div>
          {systemHealth.cronJobs.map((job) => (
            <div key={job.name} className="flex items-center justify-between text-xs">
              <span className="text-foreground font-mono">{job.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{job.schedule}</span>
                <Badge variant={job.status === "ok" ? "success" : "error"}>{job.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
