import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "../types/user";
import { authStore } from "../store/authStore";
import { loginApi, logoutApi, meApi } from "../api/auth.api";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = authStore.getToken();

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await meApi();
        setUser(currentUser);
      } catch {
        authStore.removeToken();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await loginApi(email, password);
      authStore.setToken(data.token);
      setUser(data.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch {
      // ignore API failure on logout
    } finally {
      authStore.removeToken();
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({
      user,
      isLoading,
      login,
      logout,
      setUser,
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}