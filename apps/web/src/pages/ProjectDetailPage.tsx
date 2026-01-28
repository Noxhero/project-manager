import { Card } from "../components/ui/Card";

export default function ProjectDetailPage() {
  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">Projet</h1>
        <p className="mt-1 text-sm text-slate-400">Détail: objectifs, tâches, notes, fichiers, graphe.</p>
      </header>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <div className="text-sm font-medium text-slate-50">Tâches</div>
          <div className="mt-4 h-64 rounded-2xl border border-dashed border-white/15 bg-black/20" />
        </Card>
        <Card>
          <div className="text-sm font-medium text-slate-50">Connexions</div>
          <div className="mt-4 h-64 rounded-2xl border border-dashed border-white/15 bg-black/20" />
        </Card>
      </div>
    </div>
  );
}
