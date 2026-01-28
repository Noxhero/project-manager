import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const project = await dispatch(createProject({ name, description, objectives: [], tags: [] })).unwrap();
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

      <Card>
        <form className="space-y-5" onSubmit={onCreate}>
          <div>
            <label className="text-sm font-medium text-slate-50">Nom du projet</label>
            <input
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-50"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-50">Description</label>
            <textarea
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-50"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Button type="submit" disabled={loading}>
              {loading ? "Création…" : "Créer le projet"}
            </Button>
            <Button type="button" variant="ghost">
              IA Help
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
