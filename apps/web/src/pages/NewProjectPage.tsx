import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export default function NewProjectPage() {
  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">Créer un projet</h1>
        <p className="mt-1 text-sm text-slate-400">Nom, description, objectifs, deadline, tags.</p>
      </header>

      <Card>
        <form className="space-y-4">
          <div>
            <label className="text-sm text-slate-200">Nom</label>
            <input
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-50"
              placeholder="Ex: Lancer mon SaaS"
            />
          </div>
          <div>
            <label className="text-sm text-slate-200">Description</label>
            <textarea
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-50"
              rows={4}
              placeholder="Contexte, scope, contraintes..."
            />
          </div>
          <div className="flex gap-3">
            <Button type="button">Aide IA</Button>
            <Button type="submit" variant="ghost">
              Enregistrer
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
