import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import { tasks as mockTasks, type TaskItem } from "@/data/mock";

const COLLECTION = "dashboard_tasks";

// Seed Firestore with mock tasks if empty
export async function seedTasksIfEmpty(existingCount: number) {
  if (existingCount > 0) return;
  const batch = writeBatch(db);
  mockTasks.forEach((task, i) => {
    const ref = doc(collection(db, COLLECTION));
    batch.set(ref, { ...task, order: i, updatedAt: serverTimestamp() });
  });
  await batch.commit();
}

// Subscribe to tasks — no orderBy so no index needed; sort in JS
export function subscribeTasks(callback: (tasks: TaskItem[]) => void) {
  const q = query(collection(db, COLLECTION));
  return onSnapshot(
    q,
    (snap) => {
      const tasks = snap.docs
        .map((d) => ({ ...d.data(), id: d.id } as TaskItem))
        .sort((a, b) => ((a as TaskItem & { order?: number }).order ?? 999) - ((b as TaskItem & { order?: number }).order ?? 999));
      callback(tasks);
    },
    (err) => console.error("Firestore error:", err)
  );
}

// Toggle task complete
export async function toggleTaskComplete(id: string, currentStatus: TaskItem["status"]) {
  const ref = doc(db, COLLECTION, id);
  const newStatus = currentStatus === "completed" ? "queued" : "completed";
  await updateDoc(ref, { status: newStatus, updatedAt: serverTimestamp() });
}

// Delete task
export async function deleteTask(id: string) {
  await deleteDoc(doc(db, COLLECTION, id));
}

// Add task
export async function addTask(title: string, priority: TaskItem["priority"] = "medium") {
  const snap = await getDocs(query(collection(db, COLLECTION)));
  const maxOrder = snap.empty
    ? 0
    : Math.max(...snap.docs.map((d) => (d.data().order ?? 0) as number)) + 1;

  await addDoc(collection(db, COLLECTION), {
    title,
    status: "queued",
    priority,
    tags: [],
    createdAt: new Date().toISOString(),
    order: maxOrder,
    updatedAt: serverTimestamp(),
  });
}

// Reorder after drag-and-drop
export async function reorderTasks(orderedIds: string[]) {
  const batch = writeBatch(db);
  orderedIds.forEach((id, i) => {
    batch.update(doc(db, COLLECTION, id), { order: i, updatedAt: serverTimestamp() });
  });
  await batch.commit();
}
