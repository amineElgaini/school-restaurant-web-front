import { client } from "./client";
import type { Meal, MealType } from "../types/meal";

export const getMealsApi = async (): Promise<Meal[]> => {
  const response = await client.get("/meals");
  return response.data;
};

export const createMealApi = async (payload: FormData) => {
  // Do NOT set Content-Type manually — axios sets it with the correct boundary automatically
  const response = await client.post("/meals", payload);
  return response.data;
};

export const updateMealApi = async (mealId: number, payload: FormData) => {
  // Laravel requires POST with _method=PUT for multipart FormData (method spoofing)
  // Do NOT set Content-Type manually — axios sets it with the correct boundary automatically
  payload.append("_method", "PUT");
  const response = await client.post(`/meals/${mealId}`, payload);
  return response.data;
};

export const deleteMealApi = async (mealId: number) => {
  const response = await client.delete(`/meals/${mealId}`);
  return response.data;
};

export const getMealTypesApi = async (): Promise<MealType[]> => {
  const response = await client.get("/meal-types");
  return response.data;
};