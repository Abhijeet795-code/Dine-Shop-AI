import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api/v1";

const api = axios.create({
  baseURL: BACKEND_URL,
});

// Attach JWT token automatically if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const apiError = (err) =>
  err?.response?.data?.message || err?.message || "Something went wrong";

export default api;