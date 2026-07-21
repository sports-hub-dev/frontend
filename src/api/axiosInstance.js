import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send the httpOnly refreshToken cookie
  headers: { "Content-Type": "application/json" },
});

// ── These are wired up from app/store.js after the store is created, ────────
// avoiding a circular import between the axios instance and the Redux slices.
let getAccessToken = () => null;
let onRefreshSuccess = () => {};
let onRefreshFailure = () => {};

export const registerAuthHooks = ({ getToken, onRefreshed, onRefreshFailed }) => {
  getAccessToken = getToken;
  onRefreshSuccess = onRefreshed;
  onRefreshFailure = onRefreshFailed;
};

// ── Request interceptor: attach Authorization header ────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: silent refresh-and-retry on 401 ──────────────────
let isRefreshing = false;
let pendingQueue = [];

const processQueue = (error, token = null) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthRoute = originalRequest?.url?.includes("/auth/refresh-token") || originalRequest?.url?.includes("/auth/login");

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axiosInstance.post("/auth/refresh-token");
        const newToken = data?.data?.accessToken;
        onRefreshSuccess(newToken);
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        onRefreshFailure();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
