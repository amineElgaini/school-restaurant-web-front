import { client } from "./client";
import type { Meal, MealType } from "../types/meal";

export const getMealsApi = async (): Promise<Meal[]> => {
  const response = await client.get("/meals");
  return response.data;
};

export const createMealApi = async (payload: FormData) => {
  const response = await client.post("/meals", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
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