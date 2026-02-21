"use client";

import { useEffect, useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Circle, Loader2, CheckCircle2, AlertCircle, Trash2, GripVertical, ChevronDown, ChevronRight } from "lucide-react";
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
import { subscribeTasks, toggleTaskComplete, deleteTask, reorderTasks, seedTasksIfEmpty } from "@/lib/tasks-db";
import type { TaskItem } from "@/data/mock";

const statusConfig = {
  queued: { icon: Circle, color: "text-zinc-400", badge: "outline" as const, label: "Queued" },
  "in-progress": { icon: Loader2, color: "text-blue-500", badge: "default" as const, label: "In Progress" },
  completed: { icon: CheckCircle2, color: "text-emerald-500", badge: "success" as const, label: "Done" },
  blocked: { icon: AlertCircle, color: "text-red-500", badge: "error" as const, label: "Blocked" },
};

const priorityBadge = {
  low: "outline" as const,
  medium: "outline" as const,
  high: "warning" as const,
  critical: "error" as const,
};

function SortableTask({ task, onToggle, onDelete }: {
  task: TaskItem;
  onToggle: (id: string, status: TaskItem["status"]) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const config = statusConfig[task.status];
  const Icon = config.icon;

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-150 group ${
        isDragging ? "opacity-50 bg-accent" : "hover:bg-accent/50"
      }`}
    >
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-muted-foreground shrink-0 touch-none">
        <GripVertical className="h-3.5 w-3.5" />
      </button>
      <button onClick={() => onToggle(task.id, task.status)} className="shrink-0">
        <Icon className={`h-4 w-4 ${config.color} ${task.status === "in-progress" ? "animate-spin" : ""} hover:scale-110 transition-transform`} />
      </button>
      <div className="flex-1 min-w-0">
        <p className={`text-sm truncate ${task.status === "completed" ? "line-through text-muted-foreground" : "text-foreground"}`}>
          {task.title}
        </p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <Badge variant={priorityBadge[task.priority]}>{task.priority}</Badge>
        <Badge variant={config.badge}>{config.label}</Badge>
        <button onClick={() => onDelete(task.id)} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export function TaskPipeline({ limit = 8 }: { limit?: number }) {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [seeded, setSeeded] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    const unsub = subscribeTasks((incoming) => {
      if (!seeded) { seedTasksIfEmpty(incoming.length); setSeeded(true); }
      setTasks(incoming);
    });
    return unsub;
  }, [seeded]);

  const active = tasks.filter((t) => t.status !== "completed").slice(0, limit);
  const completed = tasks.filter((t) => t.status === "completed");

  const handleDragEnd = (event: DragEndEvent) => {
    const { active: dragActive, over } = event;
    if (!over || dragActive.id === over.id) return;
    const oldIndex = active.findIndex((t) => t.id === dragActive.id);
    const newIndex = active.findIndex((t) => t.id === over.id);
    const reordered = arrayMove(active, oldIndex, newIndex);
    setTasks([...reordered, ...completed]);
    reorderTasks(reordered.map((t) => t.id));
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <CardTitle>Task Pipeline</CardTitle>
        <span className="text-xs text-muted-foreground">{active.length} active</span>
      </div>

      {/* Active tasks */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={active.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-1">
            {active.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No active tasks 🎉</p>
            )}
            {active.map((task) => (
              <SortableTask key={task.id} task={task} onToggle={toggleTaskComplete} onDelete={deleteTask} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Completed section */}
      {completed.length > 0 && (
        <div className="mt-4 pt-3 border-t border-border">
          <button
            onClick={() => setShowCompleted((p) => !p)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {showCompleted ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            {completed.length} completed
          </button>
          {showCompleted && (
            <div className="mt-2 space-y-1 opacity-60">
              {completed.map((task) => (
                <div key={task.id} className="flex items-center gap-3 rounded-lg px-3 py-2 group">
                  <GripVertical className="h-3.5 w-3.5 text-muted-foreground/20" />
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <p className="text-sm line-through text-muted-foreground flex-1 truncate">{task.title}</p>
                  <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
