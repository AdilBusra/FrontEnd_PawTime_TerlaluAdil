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

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network Error - Backend not running or unreachable
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.error('❌ Backend tidak terhubung!');
      console.error('🔧 Pastikan backend sudah running di:', BASE_URL);
      console.error('💡 Jalankan backend dulu: cd backend && npm start');
      
      // Enhance error message for user
      error.userMessage = `Backend tidak terhubung!\n\nPastikan backend sudah running di ${BASE_URL}\n\nCara fix:\n1. Buka terminal baru\n2. cd ke folder backend\n3. Jalankan: npm start\n4. Refresh halaman ini`;
    }
    
    // 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401) {
      console.warn('⚠️ Token tidak valid atau expired');
      // Optional: Auto-logout
      // localStorage.removeItem('token');
      // localStorage.removeItem('user');
      // window.location.href = '/auth';
    }
    
    // 404 Not Found - Endpoint tidak ada
    if (error.response?.status === 404) {
      console.error('❌ Endpoint tidak ditemukan:', error.config?.url);
    }
    
    // 500 Server Error - Backend error
    if (error.response?.status >= 500) {
      console.error('❌ Server error:', error.response?.data?.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
