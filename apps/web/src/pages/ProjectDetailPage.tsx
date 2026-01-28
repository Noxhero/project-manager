import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchTasksByProject, createTask } from "../app/slices/tasksSlice";
import { fetchProjects } from "../app/slices/projectsSlice";
import { ProjectGraph } from "../components/graph/ProjectGraph";
import { saveOfflineData, getOfflineData } from "../utils/offlineStorage";
import type { Task } from "../types";

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { byProject, loading, error } = useAppSelector((s) => s.tasks);
  const { items: projects } = useAppSelector((s) => s.projects);
  const tasks = projectId ? byProject[projectId] ?? [] : [];
  
  const project = projects.find(p => p._id === projectId);
  
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "MEDIUM" as Task["priority"],
    dueAt: ""
  });
  
  // Load offline data if needed
  useEffect(() => {
    if (projects.length === 0) {
      const offlineProjects = getOfflineData('PROJECTS');
      if (offlineProjects) {
        // Dispatch offline projects to store
        // This would need a proper action to load offline data
      }
    }
  }, [projects.length]);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchTasksByProject(projectId));
    }
  }, [dispatch, projectId]);
  
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);
  
  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <Card className="text-center">
          <h2 className="text-lg font-medium text-slate-50">Projet non trouvé</h2>
          <p className="mt-2 text-sm text-slate-400">Ce projet n'existe pas ou vous n'y avez pas accès.</p>
          <Link to="/" className="mt-4 inline-block">
            <Button>Retour au dashboard</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) return;
    
    try {
      await dispatch(createTask({
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        status: "TODO",
        dueAt: newTask.dueAt || undefined,
        projectId
      })).unwrap();
      
      toast.success("Tâche créée !");
      setNewTask({ title: "", description: "", priority: "MEDIUM", dueAt: "" });
      setShowTaskForm(false);
    } catch {
      toast.error("Erreur lors de la création.");
    }
  };

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "TODO": return "bg-slate-500/20 text-slate-400";
      case "DOING": return "bg-blue-500/20 text-blue-400";
      case "DONE": return "bg-green-500/20 text-green-400";
    }
  };
  
  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "LOW": return "bg-gray-500/20 text-gray-400";
      case "MEDIUM": return "bg-yellow-500/20 text-yellow-400";
      case "HIGH": return "bg-red-500/20 text-red-400";
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50">{project.name}</h1>
          <p className="mt-1 text-sm text-slate-400">{project.description}</p>
          {project.deadline && (
            <p className="mt-2 text-xs text-slate-500">
              Deadline: {new Date(project.deadline).toLocaleDateString()}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowTaskForm(!showTaskForm)} variant="ghost">
            + Tâche
          </Button>
          <Link to={`/projects/${projectId}/kanban`}>
            <Button>Voir le Kanban</Button>
          </Link>
        </div>
      </motion.header>

      {showTaskForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <Card>
            <h3 className="text-lg font-medium text-slate-50 mb-4">Nouvelle tâche</h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-50">Titre</label>
                <input
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-50 focus:border-blue-500/50 focus:outline-none"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Nom de la tâche"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-50">Description</label>
                <textarea
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-50 focus:border-blue-500/50 focus:outline-none"
                  rows={3}
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Description de la tâche"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-50">Priorité</label>
                  <select
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-50 focus:border-blue-500/50 focus:outline-none"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task["priority"] })}
                  >
                    <option value="LOW">Basse</option>
                    <option value="MEDIUM">Moyenne</option>
                    <option value="HIGH">Haute</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-50">Deadline</label>
                  <input
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-50 focus:border-blue-500/50 focus:outline-none"
                    type="date"
                    value={newTask.dueAt}
                    onChange={(e) => setNewTask({ ...newTask, dueAt: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">Créer</Button>
                <Button type="button" variant="ghost" onClick={() => setShowTaskForm(false)}>
                  Annuler
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm font-medium text-slate-50">Tâches du projet</div>
                  <div className="text-xs text-slate-400">{tasks.length} tâche(s)</div>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs text-slate-400">
                    {tasks.filter(t => t.status === "DONE").length} / {tasks.length} terminées
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                {loading && <div className="text-sm text-slate-400">Chargement...</div>}
                {error && <div className="text-sm text-red-400">{error}</div>}
                {!loading && !error && tasks.length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-sm text-slate-400">Aucune tâche pour ce projet.</div>
                    <Button onClick={() => setShowTaskForm(true)} className="mt-2" variant="ghost">
                      + Ajouter une tâche
                    </Button>
                  </div>
                )}
                {!loading &&
                  !error &&
                  tasks.map((task, index) => (
                    <motion.div
                      key={task._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-slate-50">{task.title}</div>
                          {task.description && (
                            <div className="mt-1 text-xs text-slate-400 line-clamp-2">{task.description}</div>
                          )}
                          <div className="mt-2 flex items-center gap-2">
                            <span className={`rounded-full px-2 py-1 text-xs ${getStatusColor(task.status)}`}>
                              {task.status}
                            </span>
                            <span className={`rounded-full px-2 py-1 text-xs ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                            {task.dueAt && (
                              <span className="text-xs text-slate-400">
                                {new Date(task.dueAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <div className="text-sm font-medium text-slate-50 mb-4">Objectifs</div>
              {project.objectives.length > 0 ? (
                <ul className="space-y-2">
                  {project.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs text-slate-400">
                      <span className="text-blue-400 mt-0.5">•</span>
                      {objective}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-xs text-slate-500">Aucun objectif défini</div>
              )}
            </Card>
          </motion.div>

          {project.tags.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card>
                <div className="text-sm font-medium text-slate-50 mb-4">Tags</div>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card>
              <div className="text-sm font-medium text-slate-50 mb-2">Connexions sémantiques</div>
              <div className="text-xs text-slate-400 mb-4">Visualisation React Flow (prochaine étape)</div>
              <div className="h-64 rounded-2xl border border-dashed border-white/15 bg-black/20">
                <ProjectGraph projectId={projectId} />
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
