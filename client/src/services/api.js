import axios from "axios";

const api = axios.create({
<<<<<<< HEAD
  baseURL:   "https://devcollab-developer-collabaration-hub.onrender.com/",
=======
  baseURL:   "http://localhost:5000/api" || "https://dev-collab-developer-collabaration.vercel.app/api",
>>>>>>> 99a1cb1 (improved code)
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
