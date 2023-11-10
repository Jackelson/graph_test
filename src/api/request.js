import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost",
});

instance.interceptors.request.use(
  (config) => {
    if (store.getters.token || storage.getItem("token")) {
      // 设置token请求头
      config.headers["token"] = getToken() || storage.getItem("token");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
instance.interceptors.response.use(
  (config) => {
    if (store.getters.token || storage.getItem("token")) {
      // 设置token请求头
      config.headers["token"] = getToken() || storage.getItem("token");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default instance;
