import reduxStore from "../redux/store";
import axios from "axios";
import authSlice from "../redux/slices/authSlice";

const { dispatch } = reduxStore;

var HOST = null;
if (process.env.NODE_ENV === "development") {
  HOST = "127.0.0.1";
} else {
  HOST = "127.0.0.1";
}

const instance = axios.create({
  baseURL: `http://${HOST}:8010/v1`,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 60000
});

instance.interceptors.request.use(
  (config) => {
    if (
      config.url !== "/login" &&
      config.url !== "/register" &&
      config.url !== "/register-by-email" &&
      config.url !== "/forgot-password" &&
      config.url !== "/campuses" &&
      !config.url.includes("/verify-accounts")
    ) {
      if (config.url === "/auth/refresh-token") {
        console.log("Refresh token:::");
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          config.headers["Authorization"] = "Bearer " + refreshToken;
        }
      } else {
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
          config.headers["Authorization"] = "Bearer " + accessToken;
        }
      }
    }
    return config;
  },
  (error) => {
    return error;
  }
);

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (error) => {
    const originalConfig = error.config;
    if (
      originalConfig.url !== "/login" &&
      originalConfig.url !== "/register" &&
      originalConfig.url !== "/register-by-email" &&
      originalConfig.url !== "/forgot-password" &&
      originalConfig.url !== "/campuses" &&
      !originalConfig.url.includes("/verify-accounts") &&
      error.response
    ) {
      if (error.response.status === 401 && error.response.data?.error_type === "ACCESS_TOKEN_FAILED") {
        console.log("Retrying...");
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          const res = await instance.get("/auth/refresh-token");
          if (res?.status === 200) {
            console.log("Refresh Token SUCCESS:::");
            localStorage.setItem("access_token", res.data.access_token);
            return instance(originalConfig);
          }
        }
      } else if (error.response.data?.error_type === "REFRESH_TOKEN_FAILED") {
        console.log("Refresh Token EXPIRED:::");
        dispatch(authSlice.actions.logout());
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
