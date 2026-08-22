import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

let getClerkToken;

export const setClerkTokenGetter = (tokenGetter) => {
  getClerkToken = tokenGetter;
};

axiosInstance.interceptors.request.use(async (config) => {
  const token = await getClerkToken?.();

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;
