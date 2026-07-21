import axiosInstance from "./axiosInstance";

export const settingsApi = {
  getShippingFee: () => axiosInstance.get("/settings/shipping-fee"),

  // Admin
  getAllSettings: () => axiosInstance.get("/settings"),
  updateSetting: (payload) => axiosInstance.post("/settings", payload),
};
