import axios from "axios";

const instance = axios.create({
  baseURL: "",
});

instance.interceptors.request.use(
  (config) => {
    console.log(config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
instance.interceptors.response.use(
  (config) => {
    return Promise.resolve(config.data);
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default instance;
