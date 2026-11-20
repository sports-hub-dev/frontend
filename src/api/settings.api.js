import axiosInstance from "./axiosInstance";

export const settingsApi = {
  getShippingFee: (params) => axiosInstance.get("/settings/shipping-fee", { params }),

  // Admin
  getAllSettings: () => axiosInstance.get("/settings"),
  updateSetting: (payload) => axiosInstance.post("/settings", payload),
};
