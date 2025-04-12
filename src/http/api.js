import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/",
  headers: {
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("x-token-appointment");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => response?.data,
  (error) => {
    if (error?.response?.status === 401 && window.location.pathname !== "/") {
      localStorage.removeItem("x-token-appointment");
      window.location.replace("/");
      return;
    }
    throw Error(
      error?.response?.data?.data ||
        "Something went wrong, Please try after sometime."
    );
  }
);

export default API;
