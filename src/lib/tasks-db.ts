import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
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

// Subscribe to tasks (real-time)
export function subscribeTasks(callback: (tasks: TaskItem[]) => void) {
  const q = query(collection(db, COLLECTION), orderBy("order", "asc"));
  return onSnapshot(q, (snap) => {
    const tasks = snap.docs.map((d) => ({ ...d.data(), id: d.id } as TaskItem));
    callback(tasks);
  });
}

// Mark task complete (toggle)
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
  const q = query(collection(db, COLLECTION), orderBy("order", "desc"));
  const snap = await import("firebase/firestore").then(({ getDocs }) => getDocs(q));
  const maxOrder = snap.empty ? 0 : (snap.docs[0].data().order ?? 0) + 1;

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

// Reorder tasks after drag-and-drop
export async function reorderTasks(orderedIds: string[]) {
  const batch = writeBatch(db);
  orderedIds.forEach((id, i) => {
    batch.update(doc(db, COLLECTION, id), { order: i, updatedAt: serverTimestamp() });
  });
  await batch.commit();
}
