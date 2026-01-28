export interface User {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  objectives: string[];
  deadline?: string;
  tags: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  projectId: string;
  title: string;
  description: string;
  status: "TODO" | "DOING" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface GraphLink {
  type: "DEPENDS_ON" | "SIMILAR_TO" | "SHARES_RESOURCES_WITH";
  toProjectId: string;
}
