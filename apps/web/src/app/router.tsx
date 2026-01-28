import React from "react";
import { createBrowserRouter } from "react-router-dom";

import { RequireAuth } from "../components/layout/RequireAuth";
import { AppLayout } from "../components/layout/AppLayout";

const DashboardPage = React.lazy(() => import("../pages/DashboardPage"));
const LoginPage = React.lazy(() => import("../pages/LoginPage"));
const NewProjectPage = React.lazy(() => import("../pages/NewProjectPage"));
const ProjectDetailPage = React.lazy(() => import("../pages/ProjectDetailPage"));
const KanbanPage = React.lazy(() => import("../pages/KanbanPage"));
const CalendarPage = React.lazy(() => import("../pages/CalendarPage"));
const SearchPage = React.lazy(() => import("../pages/SearchPage"));
const SettingsPage = React.lazy(() => import("../pages/SettingsPage"));

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    path: "/",
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "projects/new", element: <NewProjectPage /> },
      { path: "projects/:projectId", element: <ProjectDetailPage /> },
      { path: "projects/:projectId/kanban", element: <KanbanPage /> },
      { path: "tasks", element: <KanbanPage /> },
      { path: "calendar", element: <CalendarPage /> },
      { path: "search", element: <SearchPage /> },
      { path: "settings", element: <SettingsPage /> }
    ]
  }
]);
