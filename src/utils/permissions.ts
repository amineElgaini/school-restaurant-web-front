import type { User } from "../types/user";

export const hasRole = (user: User | null, roleSlug: string): boolean => {
  return user?.role?.slug === roleSlug;
};

export const hasPermission = (
  user: User | null,
  permissionSlug: string
): boolean => {
  return user?.permissions?.includes(permissionSlug) ?? false;
};