import type { User } from "../../types";
export interface AuthSliceState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}
export declare const login: import("@reduxjs/toolkit").AsyncThunk<string, {
    email: string;
    password: string;
}, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const register: import("@reduxjs/toolkit").AsyncThunk<string, {
    email: string;
    password: string;
}, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const fetchMe: import("@reduxjs/toolkit").AsyncThunk<null, void, import("@reduxjs/toolkit").AsyncThunkConfig>;
export declare const logout: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"auth/logout">;
declare const _default: import("redux").Reducer<AuthSliceState>;
export default _default;
