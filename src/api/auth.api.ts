import { client } from "./client";
import type { LoginResponse, MeResponse } from "../types/user";

export const loginApi = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await client.post("/login", { email, password });
  return response.data;
};

export const logoutApi = async (): Promise<{ message: string }> => {
  const response = await client.post("/logout");
  return response.data;
};

export const meApi = async (): Promise<MeResponse> => {
  const response = await client.get("/me");
  return response.data;
};