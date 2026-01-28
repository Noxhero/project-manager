import type { Task } from "../../types";
export interface TasksSliceState {
    byProject: Record<string, Task[]>;
    loading: boolean;
    error: string | null;
}
export declare const fetchTasksByProject: import("@reduxjs/toolkit").AsyncThunk<{
    projectId: string;
    tasks: Task[];
}, string, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const createTask: import("@reduxjs/toolkit").AsyncThunk<Task, Omit<Task, "createdAt" | "updatedAt" | "_id" | "createdBy">, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const updateTask: import("@reduxjs/toolkit").AsyncThunk<Task, Partial<Task> & {
    id: string;
}, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const deleteTask: import("@reduxjs/toolkit").AsyncThunk<string, string, import("@reduxjs/toolkit").AsyncThunkConfig>;
declare const _default: import("redux").Reducer<TasksSliceState>;
export default _default;
