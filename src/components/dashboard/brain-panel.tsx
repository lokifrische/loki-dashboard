"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardTitle } from "@/components/ui/card";
import { FileText, Folder, ChevronRight, Brain } from "lucide-react";

interface FileEntry {
  name: string;
  path: string;
  type: "file" | "dir";
  depth: number;
  size?: number;
}

interface KeyFile {
  id: string;
  label: string;
  path: string;
  content: string;
  updatedAt: string;
}

interface Meta {
  fileCount: number;
  dirCount: number;
  updatedAt: string;
}

const KEY_FILE_IDS = ["soul", "memory", "agents", "identity", "user", "daily"];
const KEY_LABELS: Record<string, string> = {
  soul: "SOUL.md",
  memory: "MEMORY.md",
  agents: "AGENTS.md",
  identity: "IDENTITY.md",
  user: "USER.md",
  daily: "Daily Log",
};
const KEY_COLORS: Record<string, string> = {
  soul: "text-orange-400",
  memory: "text-purple-400",
  agents: "text-blue-400",
  identity: "text-green-400",
  user: "text-pink-400",
  daily: "text-yellow-400",
};

export function BrainPanel() {
  const [meta, setMeta] = useState<Meta | null>(null);
  const [selected, setSelected] = useState<string>("soul");
  const [keyFiles, setKeyFiles] = useState<Record<string, KeyFile>>({});
  const [tree, setTree] = useState<FileEntry[]>([]);
  const [loadingFile, setLoadingFile] = useState(false);

  // Meta + tree
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "workspace_brain", "meta"), (snap) => {
      if (snap.exists()) setMeta(snap.data() as Meta);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "workspace_brain", "file_tree"), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setTree((data.entries as FileEntry[]) || []);
      }
    });
    return unsub;
  }, []);

  // Load selected key file
  useEffect(() => {
    if (!KEY_FILE_IDS.includes(selected)) return;
    if (keyFiles[selected]) return;
    setLoadingFile(true);
    getDoc(doc(db, "workspace_brain", `file_${selected}`)).then((snap) => {
      if (snap.exists()) {
        setKeyFiles((p) => ({ ...p, [selected]: snap.data() as KeyFile }));
      }
      setLoadingFile(false);
    });
  }, [selected, keyFiles]);

  const currentFile = keyFiles[selected];
  const updatedAt = meta?.updatedAt
    ? new Date(meta.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : null;

  // Tree: only show top-level (depth 0) dirs + files
  const topLevel = tree.filter((e) => e.depth === 0);

  return (
    <Card className="flex flex-col h-full min-h-[420px]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" />
          <CardTitle>Brain</CardTitle>
        </div>
        {meta && (
          <span className="text-[10px] text-muted-foreground">
            {meta.fileCount} files · synced {updatedAt}
          </span>
        )}
      </div>

      <div className="flex gap-3 flex-1 min-h-0">
        {/* Sidebar: key files + tree */}
        <div className="w-36 shrink-0 flex flex-col gap-0.5 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1 px-1">Core Files</p>
          {KEY_FILE_IDS.map((id) => (
            <button
              key={id}
              onClick={() => setSelected(id)}
              className={`flex items-center gap-1.5 rounded px-2 py-1 text-xs text-left transition-colors w-full
                ${selected === id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
            >
              <FileText className={`h-3 w-3 shrink-0 ${KEY_COLORS[id]}`} />
              <span className="truncate">{KEY_LABELS[id]}</span>
            </button>
          ))}

          {topLevel.length > 0 && (
            <>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mt-3 mb-1 px-1">Workspace</p>
              {topLevel.map((e) => (
                <div
                  key={e.path}
                  className="flex items-center gap-1.5 rounded px-2 py-1 text-xs text-muted-foreground"
                >
                  {e.type === "dir" ? (
                    <Folder className="h-3 w-3 shrink-0 text-yellow-500/70" />
                  ) : (
                    <FileText className="h-3 w-3 shrink-0" />
                  )}
                  <span className="truncate">{e.name}</span>
                  {e.type === "dir" && <ChevronRight className="h-3 w-3 ml-auto shrink-0 opacity-40" />}
                </div>
              ))}
            </>
          )}
        </div>

        {/* File viewer */}
        <div className="flex-1 rounded-md bg-muted/30 border border-border overflow-hidden flex flex-col min-w-0">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/20">
            <FileText className={`h-3 w-3 shrink-0 ${KEY_COLORS[selected] || ""}`} />
            <span className="text-xs font-medium text-foreground">{KEY_LABELS[selected] || selected}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            {loadingFile ? (
              <p className="text-xs text-muted-foreground animate-pulse">Loading...</p>
            ) : currentFile ? (
              <pre className="text-[11px] text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed">
                {currentFile.content}
              </pre>
            ) : (
              <p className="text-xs text-muted-foreground">No content — run sync-brain.js</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
