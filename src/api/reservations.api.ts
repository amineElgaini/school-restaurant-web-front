import { client } from "./client";
import type { ReservationUser, UserReservationItem } from "../types/staffReservation";

export const getReservationUsersApi = async (
  date: string,
  name = ""
): Promise<ReservationUser[]> => {
  const response = await client.get("/reservations", {
    params: { date, name },
  });
  return response.data;
};

export const getUserReservationsByDateApi = async (
  userId: number,
  date: string
): Promise<{ user: any; reservations: UserReservationItem[] }> => {
  const response = await client.get("/reservations/details", {
    params: { user_id: userId, date },
  });
  return response.data;
};