import axiosInstance from "./axiosInstance";

export const authApi = {
  register: (payload) => axiosInstance.post("/auth/register", payload),
  registerVendorUser: (payload) => axiosInstance.post("/auth/register/vendor", payload),
  login: (payload) => axiosInstance.post("/auth/login", payload),
  logout: () => axiosInstance.post("/auth/logout"),
  refreshToken: () => axiosInstance.post("/auth/refresh-token"),
  forgotPassword: (payload) => axiosInstance.post("/auth/forgot-password", payload),
  resetPassword: (token, payload) => axiosInstance.post(`/auth/reset-password/${token}`, payload),
  getMe: () => axiosInstance.get("/auth/me"),
  updateProfile: (payload) => axiosInstance.patch("/auth/me", payload),
  addAddress: (payload) => axiosInstance.post("/auth/me/addresses", payload),
  updateAddress: (addressId, payload) => axiosInstance.patch(`/auth/me/addresses/${addressId}`, payload),
  deleteAddress: (addressId) => axiosInstance.delete(`/auth/me/addresses/${addressId}`),
};
