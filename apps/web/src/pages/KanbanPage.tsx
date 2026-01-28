import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { KanbanBoard } from "../components/kanban/KanbanBoard";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchTasksByProject } from "../app/slices/tasksSlice";

export default function KanbanPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((s) => s.tasks);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchTasksByProject(projectId));
    }
  }, [dispatch, projectId]);

  if (!projectId) return null;

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">Kanban</h1>
        <p className="mt-1 text-sm text-slate-400">Glisse-dépose les tâches entre colonnes</p>
      </header>

      {loading ? (
        <div className="text-sm text-slate-400">Chargement...</div>
      ) : (
        <KanbanBoard projectId={projectId} />
      )}
    </div>
  );
}
