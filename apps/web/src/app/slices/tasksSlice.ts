import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../lib/api";
import type { Task } from "../../types";

export interface TasksSliceState {
  byProject: Record<string, Task[]>;
  loading: boolean;
  error: string | null;
}

const initialState: TasksSliceState = {
  byProject: {},
  loading: false,
  error: null
};

export const fetchTasksByProject = createAsyncThunk(
  "tasks/fetchByProject",
  async (projectId: string) => {
    const res = await api.get<{ tasks: Task[] }>(`/tasks/by-project/${projectId}`);
    return { projectId, tasks: res.data.tasks };
  }
);

export const createTask = createAsyncThunk(
  "tasks/create",
  async (payload: Omit<Task, "_id" | "createdBy" | "createdAt" | "updatedAt">) => {
    const res = await api.post<{ task: Task }>("/tasks", payload);
    return res.data.task;
  }
);

export const updateTask = createAsyncThunk(
  "tasks/update",
  async ({ id, ...payload }: Partial<Task> & { id: string }) => {
    const res = await api.patch<{ task: Task }>(`/tasks/${id}`, payload);
    return res.data.task;
  }
);

export const deleteTask = createAsyncThunk("tasks/delete", async (id: string) => {
  await api.delete(`/tasks/${id}`);
  return id;
});

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksByProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasksByProject.fulfilled, (state, action) => {
        state.loading = false;
        state.byProject[action.payload.projectId] = action.payload.tasks;
      })
      .addCase(fetchTasksByProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch tasks";
      })
      .addCase(createTask.fulfilled, (state, action) => {
        const projectId = action.payload.projectId;
        if (!state.byProject[projectId]) state.byProject[projectId] = [];
        state.byProject[projectId].push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        for (const tasks of Object.values(state.byProject)) {
          const idx = tasks.findIndex((t: Task) => t._id === action.payload._id);
          if (idx !== -1) tasks[idx] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        for (const projectId of Object.keys(state.byProject)) {
          state.byProject[projectId] = state.byProject[projectId].filter((t: Task) => t._id !== action.payload);
        }
      });
  }
});

export default tasksSlice.reducer;
