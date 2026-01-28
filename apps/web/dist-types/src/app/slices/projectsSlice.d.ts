import type { Project } from "../../types";
export interface ProjectsSliceState {
    items: Project[];
    loading: boolean;
    error: string | null;
}
export declare const fetchProjects: import("@reduxjs/toolkit").AsyncThunk<Project[], void, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const createProject: import("@reduxjs/toolkit").AsyncThunk<Project, Omit<Project, "createdAt" | "updatedAt" | "_id" | "createdBy">, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const updateProject: import("@reduxjs/toolkit").AsyncThunk<Project, Partial<Project> & {
    id: string;
}, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const deleteProject: import("@reduxjs/toolkit").AsyncThunk<string, string, import("@reduxjs/toolkit").AsyncThunkConfig>;
declare const _default: import("redux").Reducer<ProjectsSliceState>;
export default _default;
