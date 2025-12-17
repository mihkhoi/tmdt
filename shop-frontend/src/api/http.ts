import axios, { AxiosError } from "axios";

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

// interceptor: xử lý 401 - token hết hạn
http.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      const errorData = error.response.data as any;
      const errorMessage =
        errorData?.message || errorData?.error || "Phiên đăng nhập đã hết hạn";

      // Xóa token cũ
      localStorage.removeItem("token");

      // Chỉ redirect nếu không phải đang ở trang login
      if (window.location.pathname !== "/login") {
        // Lưu thông báo vào sessionStorage để hiển thị sau khi redirect
        sessionStorage.setItem("authError", errorMessage);
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default http;
