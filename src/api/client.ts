import axios, { AxiosError } from "axios";
import { authStore } from "../store/authStore";

export const client = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    Accept: "application/json",
  },
});

client.interceptors.request.use((config) => {
  const token = authStore.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log("Request:", config.method?.toUpperCase(), config.url);
  console.log("Payload:", config.data);

  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error("Axios error:", error);

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Response data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error message:", error.message);
    }

    return Promise.reject(error);
  }
);