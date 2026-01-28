import { Card } from "../components/ui/Card";

export default function SettingsPage() {
  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">Paramètres</h1>
        <p className="mt-1 text-sm text-slate-400">Thème, notifications, export/import (prochaine étape).</p>
      </header>

      <Card>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
            <div>
              <div className="text-sm font-medium text-slate-50">Thème</div>
              <div className="text-xs text-slate-400">Clair / sombre (à venir)</div>
            </div>
            <button className="rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-200">
              Sombre
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
