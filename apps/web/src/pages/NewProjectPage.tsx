import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { createProject } from "../app/slices/projectsSlice";

export default function NewProjectPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector((s) => s.projects);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [objectives, setObjectives] = useState("");
  const [tags, setTags] = useState("");
  const [deadline, setDeadline] = useState("");

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
              <Button type="button" variant="ghost">
                🤖 IA Help
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
