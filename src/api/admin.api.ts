import { client } from "./client";

export type AdminStatistics = {
  users: {
    total: number;
    students: number;
    staff: number;
    admins: number;
  };
  reservations: {
    total: number;
    today: number;
  };
  complaints: {
    total: number;
    pending: number;
    resolved: number;
  };
  meals: {
    total: number;
  };
  recent_activity: {
    id: number;
    user_name: string;
    user_image: string | null;
    meal_name: string;
    served_at: string;
    created_at: string;
  }[];
};

export const adminApi = {
  getStatistics: async () => {
    const { data } = await client.get<AdminStatistics>("/admin/statistics");
    return data;
  },
};
