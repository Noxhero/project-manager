import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { createProject } from "../app/slices/projectsSlice";
import { createTask } from "../app/slices/tasksSlice";
import { AIProjectAssistant } from "../utils/aiProjectSuggestions";
import type { Task } from "../types";

export default function NewProjectPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector((s) => s.projects);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [objectives, setObjectives] = useState("");
  const [tags, setTags] = useState("");
  const [deadline, setDeadline] = useState("");
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [aiTasks, setAiTasks] = useState<any[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<Set<number>>(new Set());
  const [isCreatingTasks, setIsCreatingTasks] = useState(false);

  const generateAISuggestions = () => {
    const objectivesArray = objectives.split("\n").filter(o => o.trim());
    const tagsArray = tags.split(",").map(t => t.trim()).filter(t => t);
    
    const suggestions = AIProjectAssistant.generateTaskSuggestions(
      name,
      description,
      objectivesArray,
      tagsArray
    );
    
    setAiTasks(suggestions);
    setShowAISuggestions(true);
    toast.success("Suggestions IA générées !");
  };
  
  const toggleTaskSelection = (index: number) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedTasks(newSelected);
  };
  
  const createSelectedTasks = async (projectId: string) => {
    setIsCreatingTasks(true);
    const tasksToCreate = Array.from(selectedTasks).map(index => aiTasks[index]);
    
    try {
      for (const task of tasksToCreate) {
        await dispatch(createTask({
          title: task.title,
          description: task.description,
          priority: task.priority,
          status: "TODO",
          dueAt: undefined,
          projectId
        })).unwrap();
      }
      
      toast.success(`${tasksToCreate.length} tâches créées avec succès !`);
      setSelectedTasks(new Set());
      setShowAISuggestions(false);
    } catch (error) {
      toast.error("Erreur lors de la création des tâches");
    } finally {
      setIsCreatingTasks(false);
    }
  };

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const objectivesArray = objectives.split("\n").filter(o => o.trim());
      const tagsArray = tags.split(",").map(t => t.trim()).filter(t => t);
      
      const project = await dispatch(createProject({ 
        name, 
        description, 
        objectives: objectivesArray, 
        tags: tagsArray,
        deadline: deadline || undefined
      })).unwrap();
      
      toast.success("Projet créé !");
      
      // If there are selected AI tasks, create them
      if (selectedTasks.size > 0) {
        await createSelectedTasks(project._id);
      }
      
      navigate(`/projects/${project._id}`);
    } catch {
      toast.error("Erreur lors de la création.");
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">Nouveau projet</h1>
        <p className="mt-1 text-sm text-slate-400">Décris ton projet, ses objectifs et tags.</p>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <form className="space-y-5" onSubmit={onCreate}>
            <div>
              <label className="text-sm font-medium text-slate-50">Nom du projet</label>
              <input
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-50 focus:border-blue-500/50 focus:outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Mon projet awesome"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-50">Description</label>
              <textarea
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-50 focus:border-blue-500/50 focus:outline-none"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Décris ton projet en quelques mots..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-50">Objectifs</label>
              <textarea
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-50 focus:border-blue-500/50 focus:outline-none"
                rows={3}
                value={objectives}
                onChange={(e) => setObjectives(e.target.value)}
                placeholder="Un objectif par ligne..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-50">Tags</label>
              <input
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-50 focus:border-blue-500/50 focus:outline-none"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="web, design, mobile (séparés par des virgules)"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-50">Deadline (optionnel)</label>
              <input
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-50 focus:border-blue-500/50 focus:outline-none"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Création..." : "Créer le projet"}
              </Button>
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={generateAISuggestions}
                  disabled={!name || !description}
                >
                  🤖 IA Help
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </motion.div>
      
      {/* AI Suggestions Modal */}
      {showAISuggestions && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowAISuggestions(false)}
        >
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-50">Suggestions IA</h3>
                <p className="text-sm text-slate-400 mt-1">
                  {aiTasks.length} tâches suggérées pour votre projet
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={() => setShowAISuggestions(false)}
                className="h-8 w-8 p-0"
              >
                ✕
              </Button>
            </div>
            
            <div className="space-y-3 mb-6">
              {aiTasks.map((task, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`border rounded-xl p-4 cursor-pointer transition-all ${
                    selectedTasks.has(index)
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                  onClick={() => toggleTaskSelection(index)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedTasks.has(index)}
                          onChange={() => {}}
                          className="rounded border-white/20 bg-slate-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900"
                        />
                        <div className="text-sm font-medium text-slate-50">
                          {task.title}
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-slate-400 line-clamp-2">
                        {task.description}
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant={
                          task.priority === 'HIGH' ? 'danger' : 
                          task.priority === 'MEDIUM' ? 'warning' : 'default'
                        } size="sm">
                          {task.priority}
                        </Badge>
                        <Badge variant="primary" size="sm">
                          {task.category}
                        </Badge>
                        {task.estimatedHours && (
                          <span className="text-xs text-slate-500">
                            ~{task.estimatedHours}h
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <div className="text-sm text-slate-400">
                {selectedTasks.size} tâche{selectedTasks.size > 1 ? 's' : ''} sélectionnée{selectedTasks.size > 1 ? 's' : ''}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSelectedTasks(new Set());
                    toast.success("Sélection effacée");
                  }}
                  disabled={selectedTasks.size === 0}
                >
                  Effacer
                </Button>
                <Button
                  onClick={() => {
                    // Create project first, then tasks
                    const projectForm = document.querySelector('form');
                    if (projectForm) {
                      projectForm.dispatchEvent(new Event('submit', { cancelable: true }));
                    }
                  }}
                  disabled={selectedTasks.size === 0 || isCreatingTasks}
                >
                  {isCreatingTasks ? 'Création...' : 'Créer avec tâches'}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
