import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { Task } from "../../types";

export function TaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task._id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/10 transition"
    >
      <div className="text-sm font-medium text-slate-50">{task.title}</div>
      <div className="mt-1 text-xs text-slate-400">{task.priority}</div>
    </div>
  );
}
