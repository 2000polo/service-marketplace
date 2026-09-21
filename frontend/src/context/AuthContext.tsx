import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  getCurrentUser,
  loginUser,
  type AuthUser,
} from "@/api/authApi";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
}

export const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined
  );

interface AuthProviderProps {
  children: ReactNode;
}

const getStoredAuth = () => {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (!token || !storedUser) {
    return {
      token: null,
      user: null,
    };
  }

  try {
    return {
      token,
      user: JSON.parse(storedUser) as AuthUser,
    };
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return {
      token: null,
      user: null,
    };
  }
};

export const AuthProvider = ({
  children,
}: AuthProviderProps) => {
  const [auth, setAuth] = useState(getStoredAuth);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const user = await getCurrentUser(storedToken);

        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );

        setAuth({
          token: storedToken,
          user,
        });
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setAuth({
          token: null,
          user: null,
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (
    email: string,
    password: string
  ) => {
    const data = await loginUser({
      email,
      password,
    });

    localStorage.setItem(
      "token",
      data.token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );

    setAuth({
      token: data.token,
      user: data.user,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setAuth({
      token: null,
      user: null,
    });
  };

  const value: AuthContextValue = {
    user: auth.user,
    token: auth.token,
    isAuthenticated:
      !!auth.user && !!auth.token,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};