import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useAppSelector } from "../app/hooks";
import { fetchProjects } from "../app/slices/projectsSlice";
import { fetchTasksByProject } from "../app/slices/tasksSlice";
import type { Project, Task } from "../types";

interface SearchResult {
  type: 'project' | 'task';
  item: Project | Task;
  score: number;
  project?: Project;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const { items: projects } = useAppSelector((s) => s.projects);
  const { byProject } = useAppSelector((s) => s.tasks);
  
  // Combine all tasks from all projects
  const allTasks = useMemo(() => {
    return Object.values(byProject).flat();
  }, [byProject]);
  
  // Load data on mount
  useEffect(() => {
    // This would be dispatched by a parent component or on app load
  }, []);
  
  // Search functionality
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase();
    const results: SearchResult[] = [];
    
    // Search projects
    projects.forEach(project => {
      let score = 0;
      
      // Name match (highest weight)
      if (project.name.toLowerCase().includes(searchTerm)) {
        score += project.name.toLowerCase() === searchTerm ? 100 : 50;
      }
      
      // Description match
      if (project.description.toLowerCase().includes(searchTerm)) {
        score += 30;
      }
      
      // Tags match
      project.tags.forEach(tag => {
        if (tag.toLowerCase().includes(searchTerm)) {
          score += 20;
        }
      });
      
      // Objectives match
      project.objectives.forEach(objective => {
        if (objective.toLowerCase().includes(searchTerm)) {
          score += 15;
        }
      });
      
      if (score > 0) {
        results.push({ type: 'project', item: project, score });
      }
    });
    
    // Search tasks
    allTasks.forEach(task => {
      let score = 0;
      const project = projects.find(p => p._id === task.projectId);
      
      // Title match (highest weight)
      if (task.title.toLowerCase().includes(searchTerm)) {
        score += task.title.toLowerCase() === searchTerm ? 80 : 40;
      }
      
      // Description match
      if (task.description.toLowerCase().includes(searchTerm)) {
        score += 25;
      }
      
      // Priority match
      if (task.priority.toLowerCase().includes(searchTerm)) {
        score += 15;
      }
      
      // Status match
      if (task.status.toLowerCase().includes(searchTerm)) {
        score += 10;
      }
      
      if (score > 0) {
        results.push({ type: 'task', item: task, score, project });
      }
    });
    
    // Sort by score (descending)
    return results.sort((a, b) => b.score - a.score);
  }, [query, projects, allTasks]);
  
  useEffect(() => {
    setResults(searchResults);
  }, [searchResults]);
  
  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case "TODO": return "bg-slate-500/20 text-slate-400";
      case "DOING": return "bg-blue-500/20 text-blue-400";
      case "DONE": return "bg-green-500/20 text-green-400";
    }
  };
  
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case "LOW": return "bg-gray-500/20 text-gray-400";
      case "MEDIUM": return "bg-yellow-500/20 text-yellow-400";
      case "HIGH": return "bg-red-500/20 text-red-400";
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">Recherche</h1>
        <p className="mt-1 text-sm text-slate-400">Recherchez des projets, tâches et tags</p>
      </header>

      <Card>
        <label className="text-sm font-medium text-slate-50">Rechercher</label>
        <div className="mt-2 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-50 focus:border-blue-500/50 focus:outline-none pl-10"
            placeholder="Projet, tâche, tag..."
            autoFocus
          />
          <div className="absolute left-3 top-2.5 text-slate-400">
            🔍
          </div>
        </div>
        
        {query && (
          <div className="mt-2 text-xs text-slate-400">
            {results.length} résultat{results.length !== 1 ? 's' : ''} trouvé{results.length !== 1 ? 's' : ''}
          </div>
        )}
      </Card>

      {results.length > 0 && (
        <div className="space-y-4">
          <div className="text-sm font-medium text-slate-50">Résultats</div>
          
          {results.map((result, index) => (
            <motion.div
              key={`${result.type}-${(result.item as any)._id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-4 hover:bg-white/5 transition-all cursor-pointer">
                {result.type === 'project' ? (
                  <Link to={`/projects/${(result.item as Project)._id}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-blue-400">📋</span>
                          <div className="text-sm font-medium text-slate-50">
                            {(result.item as Project).name}
                          </div>
                        </div>
                        <div className="mt-1 text-xs text-slate-400 line-clamp-2">
                          {(result.item as Project).description}
                        </div>
                        {(result.item as Project).tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {(result.item as Project).tags.slice(0, 3).map(tag => (
                              <span key={tag} className="rounded-full bg-white/10 px-2 py-1 text-xs text-slate-300">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="ml-3 text-xs text-slate-500">
                        Score: {result.score}
                      </div>
                    </div>
                  </Link>
                ) : (
                  <Link to={`/projects/${(result.item as Task).projectId}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-green-400">📝</span>
                          <div className="text-sm font-medium text-slate-50">
                            {(result.item as Task).title}
                          </div>
                        </div>
                        {(result.item as Task).description && (
                          <div className="mt-1 text-xs text-slate-400 line-clamp-2">
                            {(result.item as Task).description}
                          </div>
                        )}
                        <div className="mt-2 flex items-center gap-2">
                          <span className={`rounded-full px-2 py-1 text-xs ${getStatusColor((result.item as Task).status)}`}>
                            {(result.item as Task).status}
                          </span>
                          <span className={`rounded-full px-2 py-1 text-xs ${getPriorityColor((result.item as Task).priority)}`}>
                            {(result.item as Task).priority}
                          </span>
                          {result.project && (
                            <span className="text-xs text-slate-400">
                              dans {result.project.name}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="ml-3 text-xs text-slate-500">
                        Score: {result.score}
                      </div>
                    </div>
                  </Link>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}
      
      {query && results.length === 0 && (
        <Card className="text-center py-8">
          <div className="text-slate-400">
            <div className="text-2xl mb-2">🔍</div>
            <div className="text-sm">Aucun résultat trouvé</div>
            <div className="text-xs mt-1">Essayez avec d'autres mots-clés</div>
          </div>
        </Card>
      )}
      
      {!query && (
        <Card className="text-center py-8">
          <div className="text-slate-400">
            <div className="text-2xl mb-2">🔍</div>
            <div className="text-sm">Commencez à taper pour rechercher</div>
            <div className="text-xs mt-1">Projets, tâches, tags, objectifs...</div>
          </div>
        </Card>
      )}
    </div>
  );
}
