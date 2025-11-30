import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

const http = axios.create({
  baseURL,
});

// interceptor: tự gắn token nếu có
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default http;
