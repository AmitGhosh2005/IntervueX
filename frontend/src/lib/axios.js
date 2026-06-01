import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const setAuthToken = (token) => {
  axiosInstance.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${token}`;
  console.log(
    axiosInstance.defaults.headers.common["Authorization"]
  );
};

export default axiosInstance;