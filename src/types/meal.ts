export type MealType = {
  id: number;
  name: string;
  slug: string;
};

export type Meal = {
  id: number;
  name: string;
  meal_type_id: number;
  description: string | null;
  image: string | null;
  meal_type?: MealType;
};