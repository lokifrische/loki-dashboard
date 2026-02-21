"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Circle, Loader2, CheckCircle2, AlertCircle, Trash2, GripVertical, Plus, ChevronDown, ChevronRight } from "lucide-react";
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
        <Icon className={`h-4 w-4 ${config.color} ${task.status === "in-progress" ? "animate-spin" : ""} hover:scale-110 transition-transform`} />
      </button>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : "text-foreground"}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {task.tags?.map((tag) => (
            <span key={tag} className="text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5">{tag}</span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Badge variant={config.badge}>{task.status.replace("-", " ")}</Badge>
        <button onClick={() => onDelete(task.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500 p-1">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </Card>
  );
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [seeded, setSeeded] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<TaskItem["priority"]>("medium");
  const [adding, setAdding] = useState(false);
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

  const active = tasks.filter((t) => t.status !== "completed");
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
        <p className="text-sm text-muted-foreground mt-1">
          {active.length} active · {completed.length} completed — drag to reorder, click ○ to complete
        </p>
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

      {/* Active tasks */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={active.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {active.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No active tasks — you&apos;re clear 🎉</p>
            )}
            {active.map((task) => (
              <SortableTaskRow key={task.id} task={task} onToggle={toggleTaskComplete} onDelete={deleteTask} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Completed section */}
      {completed.length > 0 && (
        <div className="pt-2">
          <button
            onClick={() => setShowCompleted((p) => !p)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
          >
            {showCompleted ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            <span className="font-medium">{completed.length} Completed</span>
          </button>
          {showCompleted && (
            <div className="space-y-2 opacity-60">
              {completed.map((task) => (
                <Card key={task.id} className="flex items-center gap-4 group border-border/50">
                  <GripVertical className="h-4 w-4 text-muted-foreground/20" />
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm line-through text-muted-foreground truncate">{task.title}</p>
                    <div className="flex gap-2 mt-1">
                      {task.tags?.map((tag) => (
                        <span key={tag} className="text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleTaskComplete(task.id, task.status)}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Reopen
                    </button>
                    <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500 p-1">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
