import axiosInstance from "./axiosInstance";

export const ordersApi = {
  createOrder: (payload) => axiosInstance.post("/orders", payload),
  trackOrder: (orderNumber) => axiosInstance.get(`/orders/track/${orderNumber}`),
  getMyOrders: (params) => axiosInstance.get("/orders/my-orders", { params }),
  getMyOrderById: (id) => axiosInstance.get(`/orders/my-orders/${id}`),

  // Admin
  getAllOrders: (params) => axiosInstance.get("/orders", { params }),
  getOrderById: (id) => axiosInstance.get(`/orders/${id}`),
  updateOrderStatus: (id, payload) => axiosInstance.patch(`/orders/${id}/status`, payload),
};
