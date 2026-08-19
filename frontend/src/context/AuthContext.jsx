import { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/api";

const AuthContext = createContext(null);

// Backend is wired up (see /auth/login, /auth/register) - mock auth no longer needed.
const MOCK_AUTH = false;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser(JSON.parse(localStorage.getItem("user") || "null"));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    if (MOCK_AUTH) {
      // TEMP: accept a fixed test login, no backend needed
      if (credentials.email === "test@shop.com" && credentials.password === "test1234") {
        const fakeUser = { id: 1, email: "test@shop.com", role: "OWNER", name: "Test Owner" };
        localStorage.setItem("token", "fake-token");
        localStorage.setItem("user", JSON.stringify(fakeUser));
        setUser(fakeUser);
        return { user: fakeUser };
      }
      throw new Error("Invalid credentials (use test@shop.com / test1234)");
    }

    const res = await api.post("/auth/login", credentials);
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data;
  };

  const register = async (details) => {
    if (MOCK_AUTH) {
      // TEMP: any registration succeeds instantly, no backend needed
      const fakeUser = { id: 1, email: details.email, role: "OWNER", name: details.shopName };
      localStorage.setItem("token", "fake-token");
      localStorage.setItem("user", JSON.stringify(fakeUser));
      setUser(fakeUser);
      return { user: fakeUser };
    }

    const res = await api.post("/auth/register", details);
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);