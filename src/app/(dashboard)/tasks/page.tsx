"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Circle, Loader2, CheckCircle2, AlertCircle, Trash2, GripVertical, Plus } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { subscribeTasks, toggleTaskComplete, deleteTask, reorderTasks, addTask, seedTasksIfEmpty } from "@/lib/tasks-db";
import type { TaskItem } from "@/data/mock";

const statusConfig = {
  queued: { icon: Circle, color: "text-zinc-400", badge: "outline" as const },
  "in-progress": { icon: Loader2, color: "text-blue-500", badge: "default" as const },
  completed: { icon: CheckCircle2, color: "text-emerald-500", badge: "success" as const },
  blocked: { icon: AlertCircle, color: "text-red-500", badge: "error" as const },
};

type StatusFilter = "all" | "queued" | "in-progress" | "completed" | "blocked";

function SortableTaskRow({ task, onToggle, onDelete }: {
  task: TaskItem;
  onToggle: (id: string, status: TaskItem["status"]) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const config = statusConfig[task.status];
  const Icon = config.icon;

  return (
    <Card
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-4 transition-colors duration-150 group ${
        isDragging ? "opacity-50 shadow-lg" : "hover:border-primary/20"
      }`}
    >
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-muted-foreground/30 hover:text-muted-foreground shrink-0 touch-none">
        <GripVertical className="h-4 w-4" />
      </button>

      <button onClick={() => onToggle(task.id, task.status)} className="shrink-0">
        <Icon
          className={`h-4 w-4 ${config.color} ${task.status === "in-progress" ? "animate-spin" : ""} hover:scale-110 transition-transform`}
        />
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : "text-foreground"}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {task.tags?.map((tag) => (
            <span key={tag} className="text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Badge variant={config.badge}>{task.status.replace("-", " ")}</Badge>
        <button
          onClick={() => onDelete(task.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500 p-1"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </Card>
  );
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [seeded, setSeeded] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<TaskItem["priority"]>("medium");
  const [adding, setAdding] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    const unsub = subscribeTasks((incoming) => {
      if (!seeded) {
        seedTasksIfEmpty(incoming.length);
        setSeeded(true);
      }
      setTasks(incoming);
    });
    return unsub;
  }, [seeded]);

  const filtered = filter === "all" ? tasks : tasks.filter((t) => t.status === filter);
  const counts = {
    all: tasks.length,
    queued: tasks.filter((t) => t.status === "queued").length,
    "in-progress": tasks.filter((t) => t.status === "in-progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    blocked: tasks.filter((t) => t.status === "blocked").length,
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // Only reorder within the filtered view — map back to full list order
    const oldIndex = filtered.findIndex((t) => t.id === active.id);
    const newIndex = filtered.findIndex((t) => t.id === over.id);
    const reordered = arrayMove(filtered, oldIndex, newIndex);
    // Optimistic: update full task list preserving non-filtered items
    const reorderedIds = reordered.map((t) => t.id);
    const filteredSet = new Set(reorderedIds);
    const others = tasks.filter((t) => !filteredSet.has(t.id));
    setTasks([...reordered, ...others]);
    reorderTasks(reordered.map((t) => t.id));
  };

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    setAdding(true);
    await addTask(newTitle.trim(), newPriority);
    setNewTitle("");
    setAdding(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Task Pipeline</h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time tasks — drag to reorder, click ○ to complete, hover to delete</p>
      </div>

      {/* Add task */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Add a task..."
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <select
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value as TaskItem["priority"])}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
        <button
          onClick={handleAdd}
          disabled={adding || !newTitle.trim()}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-1 flex-wrap">
        {(["all", "in-progress", "queued", "completed", "blocked"] as StatusFilter[]).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-150 ${
              filter === s
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            }`}
          >
            {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1).replace("-", " ")}
            <span className="ml-1.5 text-muted-foreground">{counts[s]}</span>
          </button>
        ))}
      </div>

      {/* Task list */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={filtered.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {filtered.map((task) => (
              <SortableTaskRow
                key={task.id}
                task={task}
                onToggle={toggleTaskComplete}
                onDelete={deleteTask}
              />
            ))}
            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No tasks here. Add one above.</p>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
