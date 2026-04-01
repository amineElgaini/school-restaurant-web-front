import { client } from "./client";
import type { MenuMeal } from "../types/reservation";

export const getMenuMealsByDateApi = async (date: string): Promise<MenuMeal[]> => {
  const response = await client.get("/menu-meals", {
    params: { date },
  });

  return response.data;
};