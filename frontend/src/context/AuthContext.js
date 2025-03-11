import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, logoutUser, getProfile, refreshToken } from '../api/authService';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        console.log('Fetching user profile...');
        const profile = await getProfile(); // ✅ Load user profile from API
        setUser(profile);
        setIsAuthenticated(true);
        setIsAdmin(profile.role === 'admin');
      } catch (error) {
        console.error('Failed to load user profile:', error);
        setIsAuthenticated(false);

        // ✅ Auto-refresh token if expired
        const storedRefreshToken = localStorage.getItem('refreshToken');
        if (storedRefreshToken) {
          try {
            console.log('Refreshing token...');
            const token = await refreshToken(); // ✅ Use existing refreshToken function

            // ✅ Load user after refreshing token
            if (token) {
              await loadUser(); // ✅ Reload profile after refreshing token
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            logout(); // ✅ Logout if refresh fails
          }
        }
      }
    };

    loadUser();
  }, []);

  // ✅ Login Function
  const login = async (username, password) => {
    try {
      console.log('Submitting login request...');
      const { token, refreshToken, user } = await loginUser({ username, password });

      setUser({
        token,
        username: user.username,
        role: user.role,
        phone: user.phone,
        credits: user.credits,
      });

      // ✅ Store tokens
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('role', user.role);

      setIsAuthenticated(true);
      setIsAdmin(user.role === 'admin');

      console.log('Login successful!');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // ✅ Logout Function
  const logout = async () => {
    try {
      console.log('Sending logout request...');
      await logoutUser();

      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('role');

      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);

      console.log('Logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Hook to Access Auth Context
export const useAuth = () => useContext(AuthContext);

// ✅ Proper Default Export
export default AuthContext;
