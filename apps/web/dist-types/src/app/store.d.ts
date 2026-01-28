export declare const store: import("@reduxjs/toolkit").EnhancedStore<{
    auth: import("./slices/authSlice").AuthSliceState;
    projects: import("./slices/projectsSlice").ProjectsSliceState;
    tasks: import("./slices/tasksSlice").TasksSliceState;
}, import("redux").UnknownAction, import("@reduxjs/toolkit").Tuple<[import("redux").StoreEnhancer<{
    dispatch: import("redux-thunk").ThunkDispatch<{
        auth: import("./slices/authSlice").AuthSliceState;
        projects: import("./slices/projectsSlice").ProjectsSliceState;
        tasks: import("./slices/tasksSlice").TasksSliceState;
    }, undefined, import("redux").UnknownAction>;
}>, import("redux").StoreEnhancer]>>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
