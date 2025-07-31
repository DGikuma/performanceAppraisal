import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

type User = {
  id: number;
  name: string;
  email: string;
  role: "employee" | "supervisor" | "admin";
  department?: string;
};

type RegisterData = {
  name: string;
  email: string;
  password: string;
  department: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to apply token to storage and axios
const applyToken = (token: string) => {
  localStorage.setItem("token", token);
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(localStorage.getItem("token"));
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check auth status on load
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        applyToken(storedToken);
        try {
          const response = await axios.get("http://localhost:5000/api/auth/me");
          setUser(response.data.user);
          setTokenState(storedToken);
        } catch (err) {
          console.error("Auth check failed:", err);
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["Authorization"];
          setUser(null);
          setTokenState(null);
        }
      } else {
        setTokenState(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        throw new Error(data?.error || "Login failed");
      }

      setUser(data.user);
      applyToken(data.token);
      setTokenState(data.token);
      console.log("Logged in user:", data.user);
    } catch (err: any) {
      console.error("Login error:", err.message || err);
      throw err;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      // Check content-type before parsing
      const contentType = res.headers.get("content-type");
      let data = null;

      if (contentType && contentType.includes("application/json")) {
        data = await res.json(); 
      }

      if (!res.ok) {
        throw new Error(data?.error || "Registration failed");
      }

      return data;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    setTokenState(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

const appraisal = {
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
