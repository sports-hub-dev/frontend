import axiosInstance from "./axiosInstance";

export const bundlesApi = {
  getBundles: (params) => axiosInstance.get("/bundles", { params }),
  getBundleById: (id) => axiosInstance.get(`/bundles/${id}`),
  createBundle: (formData) => axiosInstance.post("/bundles", formData, { headers: { "Content-Type": "multipart/form-data" } }),
  updateBundle: (id, formData) => axiosInstance.patch(`/bundles/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } }),
  deleteBundle: (id) => axiosInstance.delete(`/bundles/${id}`),
};