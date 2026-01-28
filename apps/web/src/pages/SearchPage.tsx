import { Card } from "../components/ui/Card";

export default function SearchPage() {
  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">Recherche</h1>
        <p className="mt-1 text-sm text-slate-400">Recherche globale + sémantique (prochaine étape).</p>
      </header>

      <Card>
        <label className="text-sm text-slate-200">Rechercher</label>
        <input
          className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-50"
          placeholder="Projet, tâche, tag..."
        />
      </Card>
    </div>
  );
}
