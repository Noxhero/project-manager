import { motion, useReducedMotion } from "framer-motion";
import { Suspense } from "react";
import { NavLink, Outlet } from "react-router-dom";

import { PageSkeleton } from "../ui/PageSkeleton";
import { Chatbot } from "../chatbot/Chatbot";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/tasks", label: "Tâches" },
  { to: "/calendar", label: "Calendrier" },
  { to: "/graph", label: "Graphes" },
  { to: "/search", label: "Recherche" },
  { to: "/settings", label: "Paramètres" }
];

export function AppLayout() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="min-h-dvh bg-slate-950">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 rounded-lg bg-slate-900 px-4 py-2 text-sm text-slate-50"
      >
        Aller au contenu
      </a>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[260px_1fr] md:px-6">
        <aside className="hidden md:block">
          <div className="sticky top-6 rounded-2xl border border-white/10 bg-slate-900/40 p-4 shadow-soft backdrop-blur">
            <div className="mb-4">
              <div className="text-sm font-medium text-slate-200">Project Manager</div>
              <div className="text-xs text-slate-400">Organise. Connecte. Avance.</div>
            </div>

            <nav aria-label="Navigation principale" className="space-y-1">
              {navItems.map((it) => (
                <NavLink
                  key={it.to}
                  to={it.to}
                  className={({ isActive }) =>
                    [
                      "block rounded-xl px-3 py-2 text-sm transition",
                      isActive
                        ? "bg-white/10 text-slate-50"
                        : "text-slate-300 hover:bg-white/5 hover:text-slate-50"
                    ].join(" ")
                  }
                >
                  {it.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        <main id="main" className="min-w-0">
          <Suspense fallback={<PageSkeleton />}> 
            <motion.div
              initial={reduceMotion ? undefined : { opacity: 0, y: 8 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </Suspense>
        </main>
      </div>

      <nav
        aria-label="Navigation mobile"
        className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-slate-950/80 backdrop-blur md:hidden"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-5 px-2 py-2">
          {navItems.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              className={({ isActive }) =>
                [
                  "rounded-xl px-2 py-2 text-center text-[11px] transition",
                  isActive ? "text-indigo-300" : "text-slate-300 hover:text-slate-50"
                ].join(" ")
              }
            >
              {it.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="h-16 md:hidden" />
      
      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}
