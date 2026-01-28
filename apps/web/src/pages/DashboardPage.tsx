import { useEffect } from "react";
import { Link } from "react-router-dom";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchProjects } from "../app/slices/projectsSlice";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { items: projects, loading, error } = useAppSelector((s) => s.projects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">
            Vue d’ensemble de tes projets, tâches et connexions.
          </p>
        </div>
        <Link to="/projects/new">
          <Button>Créer un projet</Button>
        </Link>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card>
          <div className="text-xs uppercase tracking-wide text-slate-400">Progression moyenne</div>
          <div className="mt-2 text-3xl font-semibold text-slate-50">—</div>
          <div className="mt-1 text-sm text-slate-400">Calculée à partir des tâches.</div>
        </Card>
        <Card>
          <div className="text-xs uppercase tracking-wide text-slate-400">Tâches restantes</div>
          <div className="mt-2 text-3xl font-semibold text-slate-50">—</div>
          <div className="mt-1 text-sm text-slate-400">À faire + en cours.</div>
        </Card>
        <Card>
          <div className="text-xs uppercase tracking-wide text-slate-400">Connexions sémantiques</div>
          <div className="mt-2 text-3xl font-semibold text-slate-50">—</div>
          <div className="mt-1 text-sm text-slate-400">Graphe Neo4j.</div>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-slate-50">Projets</div>
              <div className="text-xs text-slate-400">Tri, tags, deadlines (à venir)</div>
            </div>
            <Button variant="ghost">Trier</Button>
          </div>
          <div className="mt-4 space-y-3">
            {loading && <div className="text-sm text-slate-400">Chargement...</div>}
            {error && <div className="text-sm text-red-400">{error}</div>}
            {!loading && !error && projects.length === 0 && (
              <div className="text-sm text-slate-400">Aucun projet pour le moment.</div>
            )}
            {!loading &&
              !error &&
              projects.map((p) => (
                <Link key={p._id} to={`/projects/${p._id}`}>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition">
                    <div className="text-sm font-medium text-slate-50">{p.name}</div>
                    <div className="mt-1 text-xs text-slate-400">
                      Deadline: {p.deadline ? new Date(p.deadline).toLocaleDateString() : "—"} • Tags: {p.tags.join(", ") || "—"}
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </Card>

        <Card>
          <div className="text-sm font-medium text-slate-50">Graphe des connexions</div>
          <div className="mt-1 text-xs text-slate-400">Visualisation React Flow (prochaine étape)</div>
          <div className="mt-4 h-64 rounded-2xl border border-dashed border-white/15 bg-black/20" />
        </Card>
      </section>
    </div>
  );
}
