import axios from "axios";

const API_URL = "/api/user";

// ✅ Register User
export const register = async (userData) => {
  const { data } = await axios.post(`${API_URL}/register`, userData);
  return data;
};

// ✅ Login User
export const login = async (userData) => {
  const { data } = await axios.post(`${API_URL}/login`, userData);

  // ✅ Store token in localStorage (if needed)
  if (data.token) {
    localStorage.setItem("token", data.token);
  }

  return data;
};

// ✅ Logout User
export const logout = async () => {
  await axios.post(`${API_URL}/logout`);
  localStorage.removeItem("token");
};

// ✅ Get User Profile
export const getProfile = async (token) => {
  const { data } = await axios.get(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

