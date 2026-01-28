import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../lib/api";
import type { Project } from "../../types";

export interface ProjectsSliceState {
  items: Project[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectsSliceState = {
  items: [],
  loading: false,
  error: null
};

export const fetchProjects = createAsyncThunk("projects/fetch", async () => {
  const res = await api.get<{ projects: Project[] }>("/projects");
  return res.data.projects;
});

export const createProject = createAsyncThunk(
  "projects/create",
  async (payload: Omit<Project, "_id" | "createdBy" | "createdAt" | "updatedAt">) => {
    const res = await api.post<{ project: Project }>("/projects", payload);
    return res.data.project;
  }
);

export const updateProject = createAsyncThunk(
  "projects/update",
  async ({ id, ...payload }: Partial<Project> & { id: string }) => {
    const res = await api.patch<{ project: Project }>(`/projects/${id}`, payload);
    return res.data.project;
  }
);

export const deleteProject = createAsyncThunk(
  "projects/delete",
  async (id: string) => {
    await api.delete(`/projects/${id}`);
    return id;
  }
);

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch projects";
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.items = state.items.filter((p: Project) => p._id !== action.payload);
      });
  }
});

export default projectsSlice.reducer;
