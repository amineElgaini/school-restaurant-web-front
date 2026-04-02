export type ReservationUser = {
  id: number;
  name: string;
  email: string;
  image: string | null;
};

export type ReservationMealType = {
  id: number;
  name: string;
  slug: string;
};

export type ReservationMeal = {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
  meal_type_id: number;
  meal_type?: ReservationMealType;
};

export type ReservationMenuMeal = {
  id: number;
  meal_id: number;
  served_at: string;
  meal: ReservationMeal;
};

export type UserReservationItem = {
  id: number;
  user_id: number;
  menu_meal_id: number;
  created_at: string;
  updated_at: string;
  menu_meal: ReservationMenuMeal;
};