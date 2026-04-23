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
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("email", payload.email);
  formData.append("password", payload.password);
  formData.append("role_id", String(payload.role_id));
  
  if (payload.image) {
    formData.append("image", payload.image);
  }

  payload.direct_permission_slugs.forEach((slug) => {
    formData.append("direct_permission_slugs[]", slug);
  });

  const response = await client.post("/admin/users", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateUserApi = async (
  userId: number,
  payload: UpdateUserPayload,
) => {
  const formData = new FormData();
  formData.append("_method", "PUT");
  formData.append("name", payload.name);
  formData.append("email", payload.email);
  formData.append("role_id", String(payload.role_id));
  
  if (payload.image) {
    formData.append("image", payload.image);
  }

  payload.direct_permission_slugs.forEach((slug) => {
    formData.append("direct_permission_slugs[]", slug);
  });

  const response = await client.post(`/admin/users/${userId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
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
