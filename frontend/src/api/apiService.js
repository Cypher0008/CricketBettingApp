import axios from "axios";

const API_URL = "/api";

// ✅ Fetch All Matches (Live + Completed)
export const fetchMatches = async () => {
  const { data } = await axios.get(`${API_URL}/matches/all`);
  return data.matches;
};

// ✅ Fetch Only Live Matches
export const fetchLiveMatches = async () => {
  const { data } = await axios.get(`${API_URL}/matches/live`);
  return data;
};

// ✅ Fetch Match Details by ID
export const fetchMatchDetails = async (matchId) => {
  const { data } = await axios.get(`${API_URL}/match/${matchId}`);
  return data;
};

// ✅ Place a Bet (User)
export const placeBet = async (betData, token) => {
  const { data } = await axios.post(`${API_URL}/bet/place`, betData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

// ✅ Get User Bets
export const getUserBets = async (username, token) => {
  const { data } = await axios.get(`${API_URL}/bet/${username}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

// ✅ Cancel Bet (Admin)
export const cancelBet = async (betId, token) => {
  const { data } = await axios.delete(`${API_URL}/bet/${betId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

// ✅ Update Bet Status (Admin)
export const updateBetStatus = async (betId, status, token) => {
  const { data } = await axios.put(
    `${API_URL}/bet/update/${betId}`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

// ✅ Admin - Get All Bets
export const getAllBets = async (token) => {
  const { data } = await axios.get(`${API_URL}/admin/bets`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

// ✅ Admin - Get All Users
export const getAllUsers = async (token) => {
  const { data } = await axios.get(`${API_URL}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

// ✅ Admin - Update Match Result
export const updateMatchResult = async (matchId, winner, token) => {
  const { data } = await axios.post(
    `${API_URL}/admin/update-result`,
    { matchId, winner },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

// ✅ User - Request Credits
export const requestCredits = async (amount, token) => {
  const { data } = await axios.post(
    `${API_URL}/user/request-credits`,
    { amount },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

// ✅ Admin - Get All Credit Requests
export const getCreditRequests = async (token) => {
  const { data } = await axios.get(`${API_URL}/admin/credit-requests`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

// ✅ Admin - Approve/Reject Credit Request
export const updateCreditRequest = async (id, status, reason, token) => {
  const { data } = await axios.post(
    `${API_URL}/admin/credit-requests/${id}`,
    { status, reason },
    { headers: { Authorization: `Bearer ${token}`) },
  );
  return data;
};

