import axiosInstance from "./axiosInstance";

export const promosApi = {
  validatePromoCode: (code) => axiosInstance.post("/promo-codes/validate", { code }),

  // Admin
  getAllPromoCodes: (params) => axiosInstance.get("/promo-codes", { params }),
  createPromoCode: (payload) => axiosInstance.post("/promo-codes", payload),
  updatePromoCode: (id, payload) => axiosInstance.patch(`/promo-codes/${id}`, payload),
  deletePromoCode: (id) => axiosInstance.delete(`/promo-codes/${id}`),
  togglePromoCode: (id) => axiosInstance.patch(`/promo-codes/${id}/toggle`),
};
