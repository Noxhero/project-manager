import { Card } from "../components/ui/Card";

export default function CalendarPage() {
  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">Calendrier</h1>
        <p className="mt-1 text-sm text-slate-400">React Big Calendar (prochaine étape).</p>
      </header>

      <Card>
        <div className="h-80 rounded-2xl border border-dashed border-white/15 bg-black/20" />
      </Card>
    </div>
  );
}
