export type MealType = {
  id: number;
  name: string;
  slug: string;
};

export type Meal = {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
  meal_type_id: number;
  meal_type?: MealType;
};

export type MenuMeal = {
  id: number;
  meal_id: number;
  served_at: string;
  meal: Meal;
};

export type Reservation = {
  id: number;
  user_id: number;
  menu_meal_id: number;
  menu_meal: MenuMeal;
};

export type ComplaintPayload = {
  subject: string;
  description: string;
};

