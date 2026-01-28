import { useState, useMemo, useCallback } from "react";
import { Calendar, dateFnsLocalizer, View, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { fr } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { Card } from "../components/ui/Card";
import { useAppSelector } from "../app/hooks";
import type { Project, Task } from "../types";

const locales = { "fr": fr };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function CalendarPage() {
  const { items: projects } = useAppSelector((s) => s.projects);
  const { byProject } = useAppSelector((s) => s.tasks);
  
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(new Date());
  
  // Combine all tasks from all projects
  const allTasks = useMemo(() => {
    return Object.values(byProject).flat();
  }, [byProject]);
  
  // Create calendar events from projects and tasks
  const events = useMemo(() => {
    const projectEvents = projects
      .filter(p => p.deadline)
      .map(project => ({
        id: `project-${project._id}`,
        title: `📋 ${project.name}`,
        start: new Date(project.deadline!),
        end: new Date(project.deadline!),
        resource: { type: 'project', data: project },
        color: '#3b82f6'
      }));
    
    const taskEvents = allTasks
      .filter(t => t.dueAt)
      .map(task => {
        const project = projects.find(p => p._id === task.projectId);
        return {
          id: `task-${task._id}`,
          title: `📝 ${task.title}`,
          start: new Date(task.dueAt!),
          end: new Date(task.dueAt!),
          resource: { type: 'task', data: task, project },
          color: task.priority === 'HIGH' ? '#ef4444' : task.priority === 'MEDIUM' ? '#f59e0b' : '#10b981'
        };
      });
    
    return [...projectEvents, ...taskEvents];
  }, [projects, allTasks]);
  
  const { defaultDate, views } = useMemo(() => ({
    defaultDate: new Date(),
    views: [Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA],
  }), []);
  
  const eventStyleGetter = useCallback((event: any) => {
    const backgroundColor = event.color || '#3b82f6';
    const style = {
      backgroundColor,
      borderRadius: '6px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block'
    };
    return { style };
  }, []);
  
  const onSelectEvent = useCallback((event: any) => {
    const { type, data, project } = event.resource;
    if (type === 'project') {
      alert(`Projet: ${data.name}\n${data.description}`);
    } else {
      alert(`Tâche: ${data.title}\nProjet: ${project?.name}\nPriorité: ${data.priority}`);
    }
  }, []);

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">Calendrier</h1>
        <p className="mt-1 text-sm text-slate-400">Visualisez les deadlines et milestones de vos projets</p>
      </header>

      <Card className="p-4">
        <div style={{ height: '600px' }} className="bg-slate-900/50 rounded-lg">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            defaultDate={defaultDate}
            views={views}
            view={view}
            onView={setView}
            date={date}
            onNavigate={setDate}
            eventPropGetter={eventStyleGetter}
            onSelectEvent={onSelectEvent}
            messages={{
              next: "Suivant",
              previous: "Précédent",
              today: "Aujourd'hui",
              month: "Mois",
              week: "Semaine",
              day: "Jour",
              agenda: "Agenda",
              date: "Date",
              time: "Heure",
              event: "Événement",
              noEventsInRange: "Aucun événement dans cette période."
            }}
            className="custom-calendar"
          />
        </div>
        
        <div className="mt-4 flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-500"></div>
            <span className="text-slate-400">Deadlines de projets</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-500"></div>
            <span className="text-slate-400">Tâches haute priorité</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-yellow-500"></div>
            <span className="text-slate-400">Tâches moyenne priorité</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500"></div>
            <span className="text-slate-400">Tâches basse priorité</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
