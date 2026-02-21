"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Command } from "lucide-react";
import { useEffect, useState } from "react";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-30 h-14 border-b border-border bg-card/80 backdrop-blur-lg flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-sm font-medium text-foreground md:hidden">Loki</h1>
      </div>
      <div className="flex items-center gap-2">
        {/* Command palette hint */}
        <button
          className="hidden md:flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors duration-150"
          onClick={() => {
            const event = new KeyboardEvent("keydown", { key: "k", metaKey: true });
            document.dispatchEvent(event);
          }}
        >
          <Command className="h-3 w-3" />
          <span>Search...</span>
          <kbd className="ml-4 rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono">⌘K</kbd>
        </button>

        {/* Theme toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-150"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        )}

        {/* Status dot */}
        <div className="flex items-center gap-2 ml-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse-dot" />
          <span className="text-xs text-muted-foreground hidden sm:inline">Active</span>
        </div>
      </div>
    </header>
  );
}
