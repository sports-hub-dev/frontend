import axiosInstance from "./axiosInstance";

export const productsApi = {
  // Public
  getProducts: (params) => axiosInstance.get("/products", { params }),
  getProductById: (id) => axiosInstance.get(`/products/${id}`),

  // Admin
  adminGetProducts: (params) => axiosInstance.get("/products/admin/all", { params }),
  getInventoryLogs: (params) => axiosInstance.get("/products/admin/inventory-logs", { params }),
  createProduct: (formData) =>
    axiosInstance.post("/products", formData, { headers: { "Content-Type": "multipart/form-data" } }),
  updateProduct: (id, formData) =>
    axiosInstance.patch(`/products/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } }),
  deleteProduct: (id) => axiosInstance.delete(`/products/${id}`),
  restoreProduct: (id) => axiosInstance.patch(`/products/${id}/restore`),
  uploadAdditionalImages: (id, formData) =>
    axiosInstance.post(`/products/${id}/images`, formData, { headers: { "Content-Type": "multipart/form-data" } }),
  updateStock: (id, payload) => axiosInstance.patch(`/products/${id}/stock`, payload),
};
