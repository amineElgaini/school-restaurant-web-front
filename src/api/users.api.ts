import { client } from "./client";
import type {
  CreateUserPayload,
  Role,
  UpdateUserPayload,
  UserEditData,
  UserListItem,
} from "../types/user";

export const getUsersApi = async (): Promise<UserListItem[]> => {
  const response = await client.get("/admin/users");
  return response.data;
};

export const getUserEditDataApi = async (
  userId: number,
): Promise<UserEditData> => {
  const response = await client.get(`/admin/users/${userId}`);
  return response.data;
};

export const createUserApi = async (payload: CreateUserPayload) => {
  const response = await client.post("/admin/users", payload);
  return response.data;
};

export const updateUserApi = async (
  userId: number,
  payload: UpdateUserPayload,
) => {
  const response = await client.put(`/admin/users/${userId}`, payload);
  return response.data;
};

export const deleteUserApi = async (userId: number) => {
  const response = await client.delete(`/admin/users/${userId}`);
  return response.data;
};

export const getAssignablePermissionsByRoleApi = async (roleId: number) => {
  const response = await client.get(
    `/admin/roles/${roleId}/assignable-permissions`,
  );
  return response.data;
};

export const getRolesApi = async (): Promise<Role[]> => {
  const response = await client.get("/admin/roles");
  return response.data;
};
