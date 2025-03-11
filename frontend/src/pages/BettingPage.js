import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const BettingPage = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();

  // State
  const [matchDetails, setMatchDetails] = useState(null);
  const [betAmount, setBetAmount] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [odds, setOdds] = useState({ homeTeam: 1.5, awayTeam: 2.0 }); // Default Odds

  // ✅ Fetch Match Details on Load
  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const res = await axios.get(`/api/match/${matchId}`);
        setMatchDetails(res.data);
      } catch (error) {
        console.error("Failed to load match details:", error);
        toast.error("Failed to load match details");
      }
    };

    fetchMatchDetails();
  }, [matchId]);

  // ✅ Handle Bet Submission
  const handleBetSubmit = async () => {
    if (!betAmount || !selectedTeam) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await axios.post('/api/bet/place', {
        matchId,
        team: selectedTeam,
        amount: betAmount
      });
      toast.success("Bet placed successfully!");
      navigate('/profile'); // ✅ Redirect to Profile
    } catch (error) {
      console.error("Bet submission failed:", error);
      toast.error("Failed to place bet");
    }
  };

  if (!matchDetails) return <div>Loading match details...</div>;

  return (
    <div className="betting-container">
      <h2>Betting on {matchDetails.home_team} vs {matchDetails.away_team}</h2>

      {/* ✅ Match Info */}
      <div className="match-info">
        <p>📅 Date: {new Date(matchDetails.start_date).toLocaleString()}</p>
        <p>📍 Venue: {matchDetails.venue || 'Unknown'}</p>
        <p>🔥 Status: {matchDetails.status}</p>
      </div>

      {/* ✅ Select Team */}
      <div className="bet-section">
        <label>Choose a Team:</label>
        <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)}>
          <option value="">Select Team</option>
          <option value={matchDetails.home_team}>{matchDetails.home_team} (Odds: {odds.homeTeam})</option>
          <option value={matchDetails.away_team}>{matchDetails.away_team} (Odds: {odds.awayTeam})</option>
        </select>
      </div>

      {/* ✅ Bet Amount */}
      <div className="bet-section">
        <label>Enter Bet Amount:</label>
        <input
          type="number"
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
          placeholder="Enter amount"
        />
      </div>

      {/* ✅ Confirm Bet Button */}
      <button className="confirm-bet-btn" onClick={handleBetSubmit}>
        Confirm Bet
      </button>
    </div>
  );
};

export default BettingPage;
