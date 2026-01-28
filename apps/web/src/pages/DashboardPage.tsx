import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { ProgressRing } from "../components/ui/ProgressRing";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchProjects } from "../app/slices/projectsSlice";
import { fetchTasksByProject } from "../app/slices/tasksSlice";
import { ProjectGraph } from "../components/graph/ProjectGraph";
import { saveOfflineData, getOfflineData, setupSyncListeners } from "../utils/offlineStorage";
import type { Task } from "../types";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { items: projects, loading: projectsLoading, error: projectsError } = useAppSelector((s) => s.projects);
  const { byProject: tasksByProject, loading: tasksLoading } = useAppSelector((s) => s.tasks);
  
  const tasks = useMemo(() => {
    return Object.values(tasksByProject).flat();
  }, [tasksByProject]);

  useEffect(() => {
    dispatch(fetchProjects());
    // Fetch tasks for each project when projects are loaded
    if (projects.length > 0) {
      projects.forEach(project => {
        dispatch(fetchTasksByProject(project._id));
      });
    }
    
    // Setup offline functionality
    setupSyncListeners();
    
    // Save data for offline access
    if (projects.length > 0) {
      saveOfflineData('PROJECTS', projects);
    }
    if (Object.keys(tasksByProject).length > 0) {
      saveOfflineData('TASKS', tasksByProject);
    }
  }, [dispatch, projects.length]);

  const stats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t: Task) => t.status === "DONE").length;
    const todoTasks = tasks.filter((t: Task) => t.status === "TODO").length;
    const doingTasks = tasks.filter((t: Task) => t.status === "DOING").length;
    const avgProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    return {
      totalProjects: projects.length,
      totalTasks,
      completedTasks,
      todoTasks,
      doingTasks,
      avgProgress: avgProgress.toFixed(1)
    };
  }, [projects, tasks]);

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

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="flex items-center justify-between p-6">
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-400">Projets actifs</div>
              <div className="mt-2 text-3xl font-semibold text-slate-50">{stats.totalProjects}</div>
              <div className="mt-1 text-sm text-slate-400">Créés par vous</div>
            </div>
            <ProgressRing progress={Math.min(stats.totalProjects * 20, 100)} size={60} strokeWidth={4} />
          </Card>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="flex items-center justify-between p-6">
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-400">Progression moyenne</div>
              <div className="mt-2 text-3xl font-semibold text-slate-50">{stats.avgProgress}%</div>
              <div className="mt-1 text-sm text-slate-400">{stats.completedTasks}/{stats.totalTasks} tâches</div>
            </div>
            <ProgressRing progress={parseFloat(stats.avgProgress)} size={60} strokeWidth={4} />
          </Card>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="flex items-center justify-between p-6">
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-400">Tâches en cours</div>
              <div className="mt-2 text-3xl font-semibold text-slate-50">{stats.doingTasks}</div>
              <div className="mt-1 text-sm text-slate-400">+ {stats.todoTasks} à faire</div>
            </div>
            <div className="flex gap-1">
              <Badge variant="warning">{stats.doingTasks}</Badge>
              <Badge variant="default">{stats.todoTasks}</Badge>
            </div>
          </Card>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="flex items-center justify-between p-6">
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-400">Connexions sémantiques</div>
              <div className="mt-2 text-3xl font-semibold text-slate-50">0</div>
              <div className="mt-1 text-sm text-slate-400">Graphe Neo4j</div>
            </div>
            <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center">
              <span className="text-xl">🔗</span>
            </div>
          </Card>
        </motion.div>
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
            {projectsLoading && (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner />
              </div>
            )}
            {projectsError && <div className="text-sm text-red-400">{projectsError}</div>}
            {!projectsLoading && !projectsError && projects.length === 0 && (
              <div className="text-sm text-slate-400">Aucun projet pour le moment.</div>
            )}
            {!projectsLoading &&
              !projectsError &&
              projects.map((p, index) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/projects/${p._id}`}>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-all hover:shadow-lg hover:shadow-white/5">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-slate-50">{p.name}</div>
                          <div className="mt-1 text-xs text-slate-400 line-clamp-2">{p.description}</div>
                        </div>
                        <div className="ml-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-xs font-medium text-blue-400">
                          {tasks.filter((t: Task) => t.projectId === p._id).length}
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-xs text-slate-400">
                          {p.deadline ? `Deadline: ${new Date(p.deadline).toLocaleDateString()}` : "Pas de deadline"}
                        </div>
                        {p.tags.length > 0 && (
                          <div className="flex gap-1">
                            {p.tags.slice(0, 2).map(tag => (
                              <Badge key={tag} variant="default" size="sm">
                                {tag}
                              </Badge>
                            ))}
                            {p.tags.length > 2 && (
                              <Badge variant="default" size="sm">
                                +{p.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
          </div>
        </Card>

        <Card>
          <div className="text-sm font-medium text-slate-50">Graphe des connexions</div>
          <div className="mt-1 text-xs text-slate-400">Visualisation React Flow (prochaine étape)</div>
          <div className="mt-4 h-64 rounded-2xl border border-dashed border-white/15 bg-black/20">
            <ProjectGraph />
          </div>
        </Card>
      </section>
    </div>
  );
}
