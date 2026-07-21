import axiosInstance from "./axiosInstance";

export const vendorsApi = {
  // Public — populates the DSP/vendor selector on the vendor registration page
  getActiveVendors: () => axiosInstance.get("/vendors/active"),

  // Admin
  getAllVendors: (params) => axiosInstance.get("/vendors", { params }),
  getVendorById: (id) => axiosInstance.get(`/vendors/${id}`),
  createVendor: (payload) => axiosInstance.post("/vendors", payload),
  updateVendor: (id, payload) => axiosInstance.patch(`/vendors/${id}`, payload),
  toggleVendorStatus: (id) => axiosInstance.patch(`/vendors/${id}/toggle-status`),
  getVendorProducts: (id, params) => axiosInstance.get(`/vendors/${id}/products`, { params }),
  getVendorUsers: (id, params) => axiosInstance.get(`/vendors/${id}/users`, { params }),
};
