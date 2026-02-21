"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";

interface UsageData {
  session: { used: number; resetAt: string };
  weeklyAll: { used: number; resetAt: string };
  weeklySonnet: { used: number; resetAt: string };
  updatedAt?: string;
}

const DEFAULT: UsageData = {
  session: { used: 29, resetAt: "" },
  weeklyAll: { used: 73, resetAt: "Tue 10:00 PM" },
  weeklySonnet: { used: 4, resetAt: "Fri 3:00 PM" },
};

function UsageBar({ label, sub, pct }: { label: string; sub: string; pct: number }) {
  const color = pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-orange-400" : "bg-blue-500";
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <div>
          <p className="font-medium text-foreground">{label}</p>
          {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
        </div>
        <span className="text-sm text-muted-foreground shrink-0 ml-4">{pct}% used</span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  );
}

export function UsageCard() {
  const [usage, setUsage] = useState<UsageData>(DEFAULT);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(DEFAULT);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const ref = doc(db, "dashboard_meta", "claude_usage");
    return onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const d = snap.data() as UsageData;
        setUsage(d);
        setDraft(d);
      }
    });
  }, []);

  const save = async () => {
    setSaving(true);
    await setDoc(doc(db, "dashboard_meta", "claude_usage"), {
      ...draft,
      updatedAt: new Date().toISOString(),
    });
    setSaving(false);
    setEditing(false);
  };

  const lastUpdated = usage.updatedAt
    ? new Date(usage.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "not set";

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <CardTitle>Plan Usage</CardTitle>
        <button
          onClick={() => setEditing(!editing)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw className="h-3 w-3" />
          Update
        </button>
      </div>

      {editing ? (
        <div className="space-y-3">
          {[
            { key: "session", label: "Current session %" },
            { key: "weeklyAll", label: "Weekly all models %" },
            { key: "weeklySonnet", label: "Weekly Sonnet only %" },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center gap-3">
              <label className="text-xs text-muted-foreground w-40 shrink-0">{label}</label>
              <input
                type="number"
                min={0}
                max={100}
                value={draft[key as keyof Omit<UsageData, "updatedAt">].used}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, [key]: { ...p[key as keyof Omit<UsageData, "updatedAt">], used: Number(e.target.value) } }))
                }
                className="w-20 rounded border border-border bg-background px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
              <span className="text-xs text-muted-foreground">%</span>
              <input
                type="text"
                placeholder="Resets at..."
                value={draft[key as keyof Omit<UsageData, "updatedAt">].resetAt}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, [key]: { ...p[key as keyof Omit<UsageData, "updatedAt">], resetAt: e.target.value } }))
                }
                className="flex-1 rounded border border-border bg-background px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
          ))}
          <div className="flex gap-2 pt-1">
            <button
              onClick={save}
              disabled={saving}
              className="rounded bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="rounded px-4 py-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Current session</p>
            <UsageBar
              label="Session limit"
              sub={usage.session.resetAt ? `Resets in ${usage.session.resetAt}` : ""}
              pct={usage.session.used}
            />
          </div>
          <div className="border-t border-border pt-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Weekly limits</p>
            <div className="space-y-4">
              <UsageBar
                label="All models"
                sub={usage.weeklyAll.resetAt ? `Resets ${usage.weeklyAll.resetAt}` : ""}
                pct={usage.weeklyAll.used}
              />
              <UsageBar
                label="Sonnet only"
                sub={usage.weeklySonnet.resetAt ? `Resets ${usage.weeklySonnet.resetAt}` : ""}
                pct={usage.weeklySonnet.used}
              />
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground">Last updated: {lastUpdated}</p>
        </div>
      )}
    </Card>
  );
}
