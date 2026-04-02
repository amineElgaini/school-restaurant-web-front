import { client } from "./client";
import type { Complaint } from "../types/complaint";


export const getComplaintsApi = async (): Promise<Complaint[]> => {
  const response = await client.get("/admin/complaints");
  return response.data;
};