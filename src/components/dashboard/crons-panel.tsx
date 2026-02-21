"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle2, AlertCircle, Timer } from "lucide-react";

interface CronJob {
  id: string;
  name: string;
  schedule: string;
  nextRun: string;
  lastRun: string;
  lastStatus: "ok" | "error" | "pending";
  enabled: boolean;
  syncedAt: string;
}

function timeUntil(isoStr: string): string {
  if (!isoStr) return "—";
  const diff = new Date(isoStr).getTime() - Date.now();
  if (diff < 0) return "soon";
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ${m % 60}m`;
  return `${Math.floor(h / 24)}d`;
}

function timeAgo(isoStr: string): string {
  if (!isoStr) return "never";
  const diff = Date.now() - new Date(isoStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const STATUS_ICON = {
  ok: <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />,
  error: <AlertCircle className="h-3.5 w-3.5 text-red-400" />,
  pending: <Timer className="h-3.5 w-3.5 text-yellow-400" />,
};

export function CronsPanel() {
  const [jobs, setJobs] = useState<CronJob[]>([]);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    return onSnapshot(collection(db, "dashboard_crons"), (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as CronJob));
      setJobs(data.sort((a, b) => a.name.localeCompare(b.name)));
    });
  }, []);

  // Tick every minute for live countdowns
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(t);
  }, [now]);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <CardTitle>Cron Jobs</CardTitle>
        </div>
        <span className="text-[10px] text-muted-foreground">{jobs.filter((j) => j.enabled).length} active</span>
      </div>

      {jobs.length === 0 ? (
        <p className="text-sm text-muted-foreground">No cron jobs synced yet.</p>
      ) : (
        <div className="space-y-2">
          {jobs.map((job) => (
            <div
              key={job.id}
              className={`rounded-lg border p-3 transition-colors ${
                job.enabled ? "border-border bg-card" : "border-border/40 bg-muted/20 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 min-w-0">
                  {STATUS_ICON[job.lastStatus] || STATUS_ICON.pending}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground leading-tight truncate">{job.name}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{job.schedule}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[11px] text-muted-foreground">next in</p>
                  <p className="text-xs font-medium text-foreground">{timeUntil(job.nextRun)}</p>
                </div>
              </div>
              {job.lastRun && (
                <p className="text-[10px] text-muted-foreground mt-1.5 pl-5">
                  Last run: {timeAgo(job.lastRun)} · {job.lastStatus}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
