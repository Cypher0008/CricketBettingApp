import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL + '/api';

// ✅ Fetch Live Matches
export const getLiveMatches = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/matches/live`);
    return data;
  } catch (error) {
    throw error.response?.data?.error || "Failed to fetch live matches";
  }
};

// ✅ Fetch Match by Date
export const getMatchesByDate = async (date) => {
  try {
    const { data } = await axios.get(`${API_URL}/matches/${date}`);
    return data;
  } catch (error) {
    throw error.response?.data?.error || "Failed to fetch matches by date";
  }
};

// ✅ Fetch Match Details
export const getMatchDetails = async (matchId) => {
  try {
    const { data } = await axios.get(`${API_URL}/match/${matchId}`);
    return data;
  } catch (error) {
    throw error.response?.data?.error || "Failed to fetch match details";
  }
};

// ✅ Place a Bet
export const placeBet = async (betData) => {
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.post(`${API_URL}/bet/place`, betData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    throw error.response?.data?.error || "Failed to place bet";
  }
};

// ✅ Get All Bets (Admin)
export const getAllBets = async () => {
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.get(`${API_URL}/bet/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    throw error.response?.data?.error || "Failed to fetch bets";
  }
};

// ✅ Cancel a Bet (Admin)
export const cancelBet = async (betId) => {
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.delete(`${API_URL}/bet/${betId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    throw error.response?.data?.error || "Failed to cancel bet";
  }
};

// ✅ Update Bet (Admin)
export const updateBet = async (betId, status) => {
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.put(
      `${API_URL}/bet/update/${betId}`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  } catch (error) {
    throw error.response?.data?.error || "Failed to update bet";
  }
};

// ✅ Fetch Admin Data (Users)
export const getAllUsers = async () => {
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.get(`${API_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    throw error.response?.data?.error || "Failed to fetch users";
  }
};

// ✅ Fetch Credit Requests
export const getAllCreditRequests = async () => {
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.get(`${API_URL}/admin/credit-requests`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    throw error.response?.data?.error || "Failed to fetch credit requests";
  }
};

// ✅ Approve or Reject Credit Request
export const updateCreditRequest = async (id, status, reason) => {
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.post(
      `${API_URL}/admin/credit-requests/${id}`,
      { status, reason },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  } catch (error) {
    throw error.response?.data?.error || "Failed to update credit request";
  }
};

// ✅ Get User Bets
export const getUserBets = async (username) => {
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.get(`${API_URL}/bet/${username}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    throw error.response?.data?.error || "Failed to load user bets";
  }
};


// ✅ Update Match Result
export const updateMatchResult = async (matchId, winner) => {
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.post(
      `${API_URL}/admin/update-result`,
      { matchId, winner },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  } catch (error) {
    throw error.response?.data?.error || "Failed to update match result";
  }
};
