export type Role = {
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

export type LoginResponse = {
  token: string;
  token_type: string;
  user: User;
};

export type MeResponse = User;