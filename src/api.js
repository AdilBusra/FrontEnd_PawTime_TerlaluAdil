import axios from "axios";

// Ambil dari Vite environment yang sudah di-load
const BASE_URL = __API_URL__;

// 🔍 DEBUG: Log untuk memastikan environment variable ter-load
console.log("🔧 API Configuration:");
console.log("📍 BASE_URL:", BASE_URL);
console.log("🌍 VITE_API_URL from env:", import.meta.env.VITE_API_URL);
console.log("📦 All env vars:", import.meta.env);

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
