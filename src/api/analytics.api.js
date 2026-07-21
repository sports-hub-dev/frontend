import axiosInstance from "./axiosInstance";

export const analyticsApi = {
  getDateRangeAnalytics: (params) => axiosInstance.get("/analytics/date-range", { params }),
  getRevenueByPeriod: (params) => axiosInstance.get("/analytics/revenue", { params }),
  getLowStockProducts: (params) => axiosInstance.get("/analytics/low-stock", { params }),
  getOrderStatusBreakdown: () => axiosInstance.get("/analytics/order-status"),
  getPromoCodeUsage: () => axiosInstance.get("/analytics/promo-usage"),
  getCustomerAnalytics: (params) => axiosInstance.get("/analytics/customers", { params }),
  getProductAnalytics: (productId) => axiosInstance.get(`/analytics/products/${productId}`),
};
