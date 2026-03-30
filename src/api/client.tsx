import axios from "axios";
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

  return config;
});