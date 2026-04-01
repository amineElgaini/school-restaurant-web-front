import { client } from "./client";
import type { ComplaintPayload, Reservation } from "../types/reservation";

export const getMyReservationsApi = async (
  date: string,
): Promise<Reservation[]> => {
  const response = await client.get("me/reservations", {
    params: { date },
  });

  return response.data;
};

export const reserveMealApi = async (menuMealId: number) => {
  const response = await client.post("/student/reservations", {
    menu_meal_id: menuMealId,
  });
  return response.data;
};

export const removeReservationApi = async (reservationId: number) => {
  const response = await client.delete(
    `/student/reservations/${reservationId}`,
  );
  return response.data;
};

export const submitComplaintApi = async (payload: ComplaintPayload) => {
  const response = await client.post("/student/complaints", payload);
  return response.data;
};
