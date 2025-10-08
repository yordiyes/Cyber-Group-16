import axios from "axios";

// Use VITE_ prefix for environment variables
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Debug: check base URL
console.log("API Base URL:", import.meta.env.VITE_API_BASE_URL);

// Set auth header from localStorage at import time
const token = localStorage.getItem("token");
if (token) {
  apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Optional: interceptor to always use latest token
apiClient.interceptors.request.use((config) => {
  const latestToken = localStorage.getItem("token");
  if (latestToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${latestToken}`;
  }
  return config;
});

export default apiClient;
