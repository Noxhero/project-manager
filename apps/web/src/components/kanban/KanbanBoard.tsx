import { useEffect, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import toast from "react-hot-toast";

import { Card } from "../ui/Card";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { updateTask, createTask } from "../../app/slices/tasksSlice";
import { TaskCard } from "./TaskCard.js";
import type { Task } from "../../types";

const COLUMNS = ["TODO", "DOING", "DONE"] as const;
type Column = (typeof COLUMNS)[number];

export function KanbanBoard({ projectId }: { projectId: string }) {
  const dispatch = useAppDispatch();
  const { byProject, loading, error } = useAppSelector((s) => s.tasks);
  const tasks = byProject[projectId] ?? [];

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showNewTask, setShowNewTask] = useState<Column | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }
    })
  );

  const columns: Record<Column, Task[]> = {
    TODO: tasks.filter((t) => t.status === "TODO"),
    DOING: tasks.filter((t) => t.status === "DOING"),
    DONE: tasks.filter((t) => t.status === "DONE")
  };

  const handleDragStart = (e: DragStartEvent) => {
    const { active } = e;
    const task = tasks.find((t) => t._id === active.id);
    setActiveTask(task ?? null);
  };

  const handleDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as Column;

    if (!COLUMNS.includes(newStatus)) return;

    const task = tasks.find((t) => t._id === taskId);
    if (!task || task.status === newStatus) return;

    try {
      await dispatch(updateTask({ id: taskId, status: newStatus })).unwrap();
      toast.success("Tâche déplacée");
    } catch {
      toast.error("Erreur lors du déplacement");
    } finally {
      setActiveTask(null);
    }
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {COLUMNS.map((col) => (
          <Card key={col}>
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-medium text-slate-50">
                {col === "TODO" ? "To Do" : col === "DOING" ? "In Progress" : "Done"}
              </div>
              <button
                className="text-xs text-slate-400 hover:text-slate-200"
                onClick={() => setShowNewTask(col)}
              >
                +
              </button>
            </div>
            <SortableContext items={columns[col].map((t) => t._id)}>
              <div className="space-y-2">
                {loading && <div className="text-sm text-slate-400">Chargement...</div>}
                {error && <div className="text-sm text-red-400">{error}</div>}
                {!loading &&
                  !error &&
                  columns[col].map((task) => (
                    <TaskCard key={task._id} task={task} />
                  ))}
              </div>
            </SortableContext>
            {showNewTask === col && (
              <NewTaskForm
                projectId={projectId}
                status={col}
                onCancel={() => setShowNewTask(null)}
                onCreated={() => setShowNewTask(null)}
              />
            )}
          </Card>
        ))}
      </div>
      <DragOverlay>{activeTask ? <TaskCard task={activeTask} /> : null}</DragOverlay>
    </DndContext>
  );
}

// Simple inline task creation form
function NewTaskForm({
  projectId,
  status,
  onCancel,
  onCreated
}: {
  projectId: string;
  status: "TODO" | "DOING" | "DONE";
  onCancel: () => void;
  onCreated: () => void;
}) {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await dispatch(
        createTask({
          projectId,
          title: title.trim(),
          description: "",
          status,
          priority: "MEDIUM"
        })
      ).unwrap();
      onCreated();
    } catch {
      toast.error("Erreur création");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onCreate} className="mt-2 space-y-2">
      <input
        className="w-full rounded-lg border border-white/10 bg-slate-950/40 px-2 py-1 text-sm text-slate-50"
        placeholder="Titre de la tâche"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded bg-blue-600 px-2 py-1 text-xs text-white disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "..." : "Ajouter"}
        </button>
        <button
          type="button"
          className="rounded border border-white/10 px-2 py-1 text-xs text-slate-400"
          onClick={onCancel}
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
