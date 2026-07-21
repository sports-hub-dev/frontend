import axiosInstance from "./axiosInstance";

export const contactApi = {
  submitMessage: (payload) => axiosInstance.post("/contact", payload),
  getAllMessages: (params) => axiosInstance.get("/contact", { params }),
  markAsRead: (id) => axiosInstance.patch(`/contact/${id}/read`),
  deleteMessage: (id) => axiosInstance.delete(`/contact/${id}`),
};