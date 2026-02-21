"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { memoryTopics, quickStats } from "@/data/mock";
import { formatRelativeTime } from "@/lib/utils";
import { BookOpen, FileText, TrendingUp } from "lucide-react";

export function KnowledgeCard() {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <CardTitle className="mb-0">Knowledge Growth</CardTitle>
        <div className="flex items-center gap-1.5">
          <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
          <span className="text-xs text-emerald-500 font-medium">{quickStats.topicsDocumented} topics</span>
        </div>
      </div>
      <div className="space-y-1">
        {memoryTopics.map((topic, i) => (
          <div
            key={topic.file}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-accent/50 transition-colors duration-150 animate-slide-in"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="h-7 w-7 rounded-md bg-violet-500/10 flex items-center justify-center shrink-0">
              {topic.entries > 10 ? (
                <BookOpen className="h-3.5 w-3.5 text-violet-500" />
              ) : (
                <FileText className="h-3.5 w-3.5 text-violet-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{topic.name}</p>
              <p className="text-xs text-muted-foreground">{topic.entries} entries</p>
            </div>
            <span className="text-[10px] text-muted-foreground shrink-0">
              {formatRelativeTime(new Date(topic.lastUpdated))}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
