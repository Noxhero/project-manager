import { Card } from "../components/ui/Card";

export default function KanbanPage() {
  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">Tâches</h1>
        <p className="mt-1 text-sm text-slate-400">Kanban drag-and-drop (prochaine étape).</p>
      </header>

      <Card>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm font-medium text-slate-50">À faire</div>
            <div className="mt-3 h-40 rounded-xl border border-dashed border-white/15" />
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm font-medium text-slate-50">En cours</div>
            <div className="mt-3 h-40 rounded-xl border border-dashed border-white/15" />
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm font-medium text-slate-50">Terminé</div>
            <div className="mt-3 h-40 rounded-xl border border-dashed border-white/15" />
          </div>
        </div>
      </Card>
    </div>
  );
}
