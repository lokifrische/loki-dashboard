"use client";

import { Card } from "@/components/ui/card";
import { memoryTopics, quickStats } from "@/data/mock";
import { formatRelativeTime } from "@/lib/utils";
import { BookOpen, FileText, Brain, TrendingUp, FolderOpen } from "lucide-react";

const dailyLogs = [
  { date: "2026-02-21", entries: 8, highlights: ["Dashboard build started", "Phase 2 launched"] },
  { date: "2026-02-20", entries: 12, highlights: ["Identity established", "Design system created", "Coding workflow documented"] },
  { date: "2026-02-19", entries: 5, highlights: ["VPS setup", "Initial configuration"] },
];

export default function KnowledgePage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Knowledge Base</h1>
        <p className="text-sm text-muted-foreground mt-1">What Loki has learned, documented, and remembered</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-violet-500/10 flex items-center justify-center">
            <Brain className="h-4 w-4 text-violet-500" />
          </div>
          <div>
            <p className="text-xl font-semibold text-foreground">{quickStats.topicsDocumented}</p>
            <p className="text-xs text-muted-foreground">Topics</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <FileText className="h-4 w-4 text-blue-500" />
          </div>
          <div>
            <p className="text-xl font-semibold text-foreground">{quickStats.memoryFilesCreated}</p>
            <p className="text-xs text-muted-foreground">Files Created</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <div>
            <p className="text-xl font-semibold text-foreground">47</p>
            <p className="text-xs text-muted-foreground">Total Entries</p>
          </div>
        </Card>
      </div>

      {/* Topics */}
      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
          <FolderOpen className="h-4 w-4" /> Topics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {memoryTopics.map((topic, i) => (
            <Card
              key={topic.file}
              className="hover:border-primary/20 transition-colors duration-150 animate-fade-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                  <BookOpen className="h-4 w-4 text-violet-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{topic.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 font-mono">{topic.file}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-muted-foreground">{topic.entries} entries</span>
                    <span className="text-xs text-muted-foreground">Updated {formatRelativeTime(new Date(topic.lastUpdated))}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Daily Logs */}
      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
          <FileText className="h-4 w-4" /> Daily Logs
        </h2>
        <div className="space-y-2">
          {dailyLogs.map((log, i) => (
            <Card
              key={log.date}
              className="hover:border-primary/20 transition-colors duration-150 animate-fade-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium font-mono text-foreground">{log.date}</p>
                  <div className="mt-2 space-y-1">
                    {log.highlights.map((h) => (
                      <p key={h} className="text-xs text-muted-foreground flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-primary shrink-0" />
                        {h}
                      </p>
                    ))}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{log.entries} entries</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
