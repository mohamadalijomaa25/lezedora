import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  },
});

// Set default Authorization once on startup (most reliable)
const token = localStorage.getItem("token");
if (token) {
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete api.defaults.headers.common.Authorization;
    localStorage.removeItem("token");
  }
}

export default api;
