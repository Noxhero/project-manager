import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchTasksByProject } from "../app/slices/tasksSlice";

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useAppDispatch();
  const { byProject, loading, error } = useAppSelector((s) => s.tasks);
  const tasks = projectId ? byProject[projectId] ?? [] : [];

  useEffect(() => {
    if (projectId) {
      dispatch(fetchTasksByProject(projectId));
    }
  }, [dispatch, projectId]);

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50">Détail du projet</h1>
          <p className="mt-1 text-sm text-slate-400">ID: {projectId}</p>
        </div>
        <Link to={`/projects/${projectId}/kanban`}>
          <Button>Voir le Kanban</Button>
        </Link>
      </header>

      <section>
        <Card>
          <div className="text-sm font-medium text-slate-50">Tâches du projet</div>
          <div className="mt-1 text-xs text-slate-400">Ajout, édition, statut, priorité (à venir)</div>
          <div className="mt-4 space-y-2">
            {loading && <div className="text-sm text-slate-400">Chargement...</div>}
            {error && <div className="text-sm text-red-400">{error}</div>}
            {!loading && !error && tasks.length === 0 && (
              <div className="text-sm text-slate-400">Aucune tâche pour ce projet.</div>
            )}
            {!loading &&
              !error &&
              tasks.map((t) => (
                <div key={t._id} className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="text-sm font-medium text-slate-50">{t.title}</div>
                  <div className="mt-1 text-xs text-slate-400">
                    Statut: {t.status} • Priorité: {t.priority}
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </section>

      <section>
        <Card>
          <div className="text-sm font-medium text-slate-50">Connexions sémantiques</div>
          <div className="mt-1 text-xs text-slate-400">Visualisation React Flow (prochaine étape)</div>
          <div className="mt-4 h-64 rounded-2xl border border-dashed border-white/15 bg-black/20" />
        </Card>
      </section>
    </div>
  );
}
