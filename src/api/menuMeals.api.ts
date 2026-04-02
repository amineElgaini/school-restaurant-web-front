import type { CreateMenuMealPayload } from "../types/menuMeal";
import { client } from "./client";

export const getMenuMealsByDateApi = async (date: string) => {
  const response = await client.get("/menu-meals", {
    params: { date },
  });
  return response.data;
};

export const createMenuMealApi = async (payload: CreateMenuMealPayload) => {
  const response = await client.post("/menu-meals", payload);
  return response.data;
};

export const deleteMenuMealApi = async (menuMealId: number) => {
  const response = await client.delete(`/menu-meals/${menuMealId}`);
  return response.data;
};