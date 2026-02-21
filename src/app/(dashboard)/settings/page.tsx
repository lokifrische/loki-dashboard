"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const themes = [
    { id: "dark", label: "Dark", icon: Moon },
    { id: "light", label: "Light", icon: Sun },
    { id: "system", label: "System", icon: Monitor },
  ];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure Loki&apos;s dashboard appearance and behavior</p>
      </div>

      {/* Theme */}
      <Card>
        <CardTitle className="mb-4">Theme</CardTitle>
        {mounted && (
          <div className="grid grid-cols-3 gap-3">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`flex flex-col items-center gap-2 rounded-lg border p-4 transition-all duration-150 ${
                  theme === t.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/20 hover:bg-accent/50"
                }`}
              >
                <t.icon className={`h-5 w-5 ${theme === t.id ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`text-xs font-medium ${theme === t.id ? "text-primary" : "text-muted-foreground"}`}>
                  {t.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </Card>

      {/* Profile */}
      <Card>
        <CardTitle className="mb-4">Agent Profile</CardTitle>
        <div className="space-y-4">
          {[
            { label: "Name", value: "Loki" },
            { label: "Model", value: "claude-sonnet-4-5" },
            { label: "Channel", value: "webchat" },
            { label: "Host", value: "openclaw-nick" },
            { label: "Workspace", value: "/home/openclaw/.openclaw/workspace" },
          ].map((field) => (
            <div key={field.label} className="space-y-1.5">
              <label className="text-xs text-muted-foreground">{field.label}</label>
              <div className="rounded-md border border-border bg-muted/50 px-3 py-2 text-sm text-foreground font-mono">
                {field.value}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* API Integration */}
      <Card>
        <CardTitle className="mb-4">API Integration</CardTitle>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Connect to the live OpenClaw API to display real-time data instead of mock data.
          </p>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">API Endpoint</label>
            <input
              type="text"
              placeholder="https://api.openclaw.dev"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors placeholder:text-muted-foreground"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">API Key</label>
            <input
              type="password"
              placeholder="sk-..."
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors placeholder:text-muted-foreground"
            />
          </div>
          <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors duration-150">
            Connect
          </button>
        </div>
      </Card>
    </div>
  );
}
