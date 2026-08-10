import axiosInstance from "./axiosInstance";

export const paymentsApi = {
  // createApsOrder: (payload) => axiosInstance.post("/payments/aps/create-order", payload),
  createStripeOrder: (payload) => axiosInstance.post("/payments/stripe/create-order", payload),
  getPaymentStatus: (orderId) => axiosInstance.get(`/payments/status/${orderId}`),
  createPaymobOrder: (payload) => axiosInstance.post("/payments/paymob/create-order", payload),
};

