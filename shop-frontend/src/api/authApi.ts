import http from "./http";

export const authApi = {
  login: (data: { username: string; password: string }) =>
    http.post("/auth/login", data),
  register: (data: {
    username: string;
    password: string;
    phone?: string;
    email?: string;
  }) => http.post("/auth/register", data),
  forgotRequestOtp: (data: { identifier: string }) =>
    http.post("/auth/forgot/request-otp", data),
  forgotVerifyOtp: (data: {
    identifier: string;
    code: string;
    newPassword: string;
  }) => http.post("/auth/forgot/verify-otp", data),
};
