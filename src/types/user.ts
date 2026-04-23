export type Role = {
  id: number;
  name: string;
  slug: string;
};

export type Permission = {
  id: number;
  name: string;
  slug: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  image: string | null;
  role: Role | null;
  permissions: string[];
};

export type UserListItem = {
  id: number;
  name: string;
  email: string;
  image: string | null;
  role: Role | null;
};

export type UserEditData = {
  user: UserListItem;
  roles: Role[];
  direct_permissions: string[];
  assignable_permissions: Permission[];
};

export type CreateUserPayload = {
  name: string;
  email: string;
  password: string;
  role_id: number | "";
  image?: File | null;
  direct_permission_slugs: string[];
};

export type UpdateUserPayload = {
  name: string;
  email: string;
  role_id: number | "";
  image?: File | null;
  direct_permission_slugs: string[];
};

export type LoginResponse = {
  token: string;
  token_type: string;
  user: User;
};

export type MeResponse = User;