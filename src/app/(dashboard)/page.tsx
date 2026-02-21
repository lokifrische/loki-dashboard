"use client";

import { StatusCard } from "@/components/dashboard/status-card";
import { QuickStats } from "@/components/dashboard/quick-stats";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { TaskPipeline } from "@/components/dashboard/task-pipeline";
import { SystemHealth } from "@/components/dashboard/system-health";
import { KnowledgeCard } from "@/components/dashboard/knowledge-card";

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Status + Quick Stats */}
      <div className="space-y-4">
        <StatusCard />
        <QuickStats />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ActivityChart />
        <TaskPipeline />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentActivity />
        <div className="space-y-4">
          <KnowledgeCard />
          <SystemHealth />
        </div>
      </div>
    </div>
  );
}
