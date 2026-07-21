import axiosInstance from "./axiosInstance";

export const feedbackApi = {
  submitFeedback: (payload) => axiosInstance.post("/feedback", payload),

  // Admin
  getAllFeedback: (params) => axiosInstance.get("/feedback", { params }),
  deleteFeedback: (id) => axiosInstance.delete(`/feedback/${id}`),
};
