import axiosInstance from "./axiosInstance";

export const paymentsApi = {
  createApsOrder: (payload) => axiosInstance.post("/payments/aps/create-order", payload),
  getPaymentStatus: (orderId) => axiosInstance.get(`/payments/status/${orderId}`),
};