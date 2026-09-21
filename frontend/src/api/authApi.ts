const API_URL = import.meta.env.VITE_API_URL;

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    role?: "customer" | "provider";
    phone?: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthUser {
    _id: string;
    name: string;
    email: string;
    role: "customer" | "provider";
    phone?: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    token: string;
    user: AuthUser;
}

export const registerUser = async ( userData: RegisterData ): Promise<AuthResponse> => {
    const response = await fetch(
        `${API_URL}/auth/user/register`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Registration failed"
        );
    }

    return data;
};

export const loginUser = async (loginData: LoginData): Promise<AuthResponse> => {
    const response = await fetch(
        `${API_URL}/auth/user/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
        data.message || "Login failed"
        );
    }

    return data;
};

export const getCurrentUser = async (
    token: string
  ): Promise<AuthUser> => {
    const response = await fetch(
      `${API_URL}/auth/user/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(
        data.message || "Failed to fetch current user"
      );
    }
  
    return data.user;
};