import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// set auth header from localStorage (applies at import time)
const token = localStorage.getItem("token");
if (token) {
  apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// optional: an interceptor that always reads the latest token from localStorage
apiClient.interceptors.request.use((config) => {
  const latestToken = localStorage.getItem("token");
  if (latestToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${latestToken}`;
  }
  return config;
});

export default apiClient;
