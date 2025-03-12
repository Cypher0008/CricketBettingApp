import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/pages/BettingPage.css';

const BettingPage = () => {
  const { matchId } = useParams();
  const [matchDetails, setMatchDetails] = useState(null);
  const [betType, setBetType] = useState('winner');
  const [predictionValue, setPredictionValue] = useState('');
  const [team, setTeam] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/match/${matchId}`);
        setMatchDetails(response.data);
      } catch (error) {
        console.error('Failed to fetch match details:', error);
      }
    };

    fetchMatchDetails();
  }, [matchId]);

  const handlePlaceBet = async () => {
    if (!amount) return alert('Enter bet amount');
    if (!team) return alert('Select a team');
    if ((betType === 'runs' || betType === 'wickets') && !predictionValue) return alert('Enter a prediction value');

    setLoading(true);

    const payload = {
      matchId,
      team,
      amount,
      betType,
      predictionValue: betType !== 'winner' ? predictionValue : undefined,
    };

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_API_URL}/api/bet/place`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Bet placed successfully');
    } catch (error) {
      console.error('Failed to place bet:', error);
      alert(error.response?.data?.error || 'Failed to place bet');
    } finally {
      setLoading(false);
    }
  };

  if (!matchDetails) return <div>Loading match details...</div>;

  return (
    <div className="betting-page">
      {/* Match Details */}
      <h2>🔥 Match: {matchDetails.home_team} vs {matchDetails.away_team} (Live)</h2>

      {/* Current Odds */}
      <div className="odds-container">
        <span className="odds-label">Team Names:</span>
        <div
          className={`odds-box ${team === matchDetails.home_team ? 'selected' : ''}`}
          onClick={() => setTeam(matchDetails.home_team)}
        >
          {matchDetails.home_team}: {matchDetails.home_odds}
        </div>
        <div
          className={`odds-box ${team === matchDetails.away_team ? 'selected' : ''}`}
          onClick={() => setTeam(matchDetails.away_team)}
        >
          {matchDetails.away_team}: {matchDetails.away_odds}
        </div>
      </div>

      {/* Bet Type */}
      <div className="bet-type-section">
        <label className="bet-type-label">💰 Bet Type:</label>
        <select value={betType} onChange={(e) => setBetType(e.target.value)}>
          <option value="winner">Winner</option>
          <option value="runs">Total Runs</option>
          <option value="wickets">Total Wickets</option>
        </select>
      </div>

      {/* Prediction Value */}
      {betType !== 'winner' && (
        <div className="prediction-input">
          <label>
            🔹 {betType === 'runs' ? 'Predict Total Runs:' : 'Predict Total Wickets:'}
          </label>
          <input
            type="number"
            value={predictionValue}
            onChange={(e) => setPredictionValue(e.target.value)}
            placeholder={betType === 'runs' ? 'Enter runs' : 'Enter wickets'}
          />
        </div>
      )}

      {/* Amount */}
      <div className="amount-section">
        <label>💰 Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter bet amount"
        />
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button
          onClick={handlePlaceBet}
          disabled={loading || !amount || !team}
          className="confirm-button"
        >
          ✅ Confirm Bet
        </button>
        <button
          onClick={() => window.history.back()}
          className="cancel-button"
        >
          ❌ Cancel
        </button>
      </div>
    </div>
  );
};

export default BettingPage;
