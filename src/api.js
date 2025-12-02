import axios from "axios";

// Prefer environment variable, fallback to local backend during dev
const BASE_URL = import.meta?.env?.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "69420", // Skip Ngrok browser warning page (harmless locally)
  },
});

// Request interceptor to attach Authorization header when token exists
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      // localStorage may throw in some edge environments; ignore silently
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
