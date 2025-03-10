import { createContext, useContext, useEffect, useState } from "react";
import { getProfile } from "../api/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const userData = await getProfile(token);
          setUser(userData);
        } catch (error) {
          console.error("Failed to load user profile:", error);
          logout(); // Clear token on failure
        }
      }
    };

    fetchUser();
  }, [token]);

  // ✅ Login
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    setToken(token);
    setUser(userData);
  };

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
