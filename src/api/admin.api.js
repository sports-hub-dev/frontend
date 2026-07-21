import axiosInstance from "./axiosInstance";

export const adminApi = {
  getAllUsers: (params) => axiosInstance.get("/admin/users", { params }),
  getPendingVendorUsers: (params) => axiosInstance.get("/admin/users/pending-vendor", { params }),
  getUserById: (id) => axiosInstance.get(`/admin/users/${id}`),
  approveVendorUser: (id) => axiosInstance.patch(`/admin/users/${id}/approve-vendor`),
  rejectVendorUser: (id, payload) => axiosInstance.post(`/admin/users/${id}/reject-vendor`, payload),
  toggleUserStatus: (id) => axiosInstance.patch(`/admin/users/${id}/toggle-status`),
};
