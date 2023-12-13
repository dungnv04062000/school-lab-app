import axios from "axios";
import reduxStore from "../redux/store";
import authSlice from "../redux/slices/authSlice";

var HOST = null;
if (process.env.NODE_ENV === "development") {
  HOST = "localhost";
} else {
  HOST = "ec2-54-179-147-207.ap-southeast-1.compute.amazonaws.com";
}

const instance = axios.create({
  // baseURL: "http://ec2-54-179-147-207.ap-southeast-1.compute.amazonaws.com:8080/v1",
  baseURL: `http://${HOST}:8080/v1`,
  headers: {
    "Content-Type": "multipart/form-data"
  },
  timeout: 60000
});

instance.interceptors.request.use(
  (config) => {
    if (config.url === "/auth/refresh-token") {
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
    if (error.response) {
      if (error.response.status === 401 && error.response.data?.error_type === "ACCESS_TOKEN_FAILED") {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          const res = await instance.get("/auth/refresh-token");
          if (res?.status === 200) {
            localStorage.setItem("access_token", res.data.access_token);
            return instance(originalConfig);
          }
        }
      } else if (error.response.data?.error_type === "REFRESH_TOKEN_FAILED") {
        reduxStore.dispatch(authSlice.actions.logout());
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
