import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000"
});

if (typeof localStorage !== "undefined") {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("pm_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}
