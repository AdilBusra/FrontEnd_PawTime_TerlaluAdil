import axios from "axios";

const api = axios.create({
  baseURL: "https://predoubtful-nonincorporated-tonia.ngrok-free.dev",
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
