"use client";

import { StatusCard } from "@/components/dashboard/status-card";
import { QuickStats } from "@/components/dashboard/quick-stats";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { TaskPipeline } from "@/components/dashboard/task-pipeline";
import { ActiveWork } from "@/components/dashboard/active-work";
import { BrainPanel } from "@/components/dashboard/brain-panel";
import { CronsPanel } from "@/components/dashboard/crons-panel";
import { MeetingsPanel } from "@/components/dashboard/meetings-panel";
import { PeoplePanel } from "@/components/dashboard/people-panel";

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Active work banner — only shows when in-progress */}
      <ActiveWork />

      {/* Status + Quick Stats */}
      <div className="space-y-4">
        <StatusCard />
        <QuickStats />
      </div>

      {/* Tasks + Meetings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskPipeline />
        <MeetingsPanel />
      </div>

      {/* Activity + People */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ActivityChart />
        <PeoplePanel />
      </div>

      {/* Crons + Brain */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CronsPanel />
        <BrainPanel />
      </div>

      {/* Recent Activity full width */}
      <RecentActivity />
    </div>
  );
}
