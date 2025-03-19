import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/pages/BettingPage.css';
import BetConfirmationModal from '../components/BetConfirmationModal';

const BettingPage = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const preferredBookmaker = searchParams.get('bookmaker');
  
  console.log('BettingPage mounted');
  console.log('Raw matchId from params:', matchId);

  const [matchDetails, setMatchDetails] = useState(null);
  const [betType, setBetType] = useState('winner');
  const [predictionValue, setPredictionValue] = useState('');
  const [team, setTeam] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [potentialWinnings, setPotentialWinnings] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [userCredits, setUserCredits] = useState(0);

  // Fetch both match details and user profile
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const decodedMatchId = decodeURIComponent(decodeURIComponent(matchId));
        
        // Fetch match details with preferred bookmaker
        const matchResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/betting/${encodeURIComponent(decodedMatchId)}`,
          { params: { bookmaker: preferredBookmaker } }
        );
        
        // If the response indicates a different bookmaker was used, update the URL
        if (matchResponse.data.bookmaker !== preferredBookmaker) {
          const newUrl = `/betting/${encodeURIComponent(matchId)}?bookmaker=${encodeURIComponent(matchResponse.data.bookmaker)}`;
          navigate(newUrl, { replace: true });
        }
        
        setMatchDetails(matchResponse.data);
        setUserCredits(matchResponse.data.userCredits);
        console.log('User credits loaded:', matchResponse.data.userCredits);
        
        setLoading(false);
      } catch (error) {
        console.error('Error in fetchData:', error);
        setError(error.response?.data?.error || 'Failed to load data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [matchId, preferredBookmaker]);

  // Calculate potential winnings whenever team or amount changes
  useEffect(() => {
    if (!matchDetails || !team || !amount) {
      setPotentialWinnings(0);
      return;
    }

    const odds = team === matchDetails.home_team 
      ? matchDetails.home_odds 
      : matchDetails.away_odds;
    
    const winnings = parseFloat(amount) * parseFloat(odds);
    setPotentialWinnings(winnings.toFixed(2));
  }, [team, amount, matchDetails]);

  // Handle opening the confirmation modal
  const handleOpenConfirmation = () => {
    if (!validateBet()) return;
    setShowConfirmation(true);
  };

  // Validate the bet inputs
  const validateBet = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid bet amount');
      return false;
    }
    
    if (parseFloat(amount) > userCredits) {
      alert('Insufficient credits for this bet');
      return false;
    }
    
    if (!team) {
      alert('Please select a team');
      return false;
    }
    
    if ((betType === 'runs' || betType === 'wickets') && !predictionValue) {
      alert(`Please enter a prediction for ${betType}`);
      return false;
    }
    
    return true;
  };

  // Handle placing the bet after confirmation
  const handlePlaceBet = async () => {
    try {
      if (!amount || !team) {
        alert('Please select a team and enter an amount');
        return;
      }

      if (parseFloat(amount) > userCredits) {
        alert('Insufficient credits');
        return;
      }

      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/bet/place`,
        {
          matchId: decodeURIComponent(decodeURIComponent(matchId)),
          team,
          amount: parseFloat(amount),
          betType: 'winner'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local user credits after successful bet
      setUserCredits(prev => prev - parseFloat(amount));
      alert('Bet placed successfully!');
      navigate('/'); // Redirect to home page
    } catch (error) {
      console.error('Error placing bet:', error);
      alert(error.response?.data?.error || 'Failed to place bet');
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading match details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!matchDetails) {
    return <div className="error-message">Match not found</div>;
  }

  return (
    <div className="betting-page">
      {/* Match Details */}
      <div className="match-header">
        <h2>🏏 {matchDetails.home_team} vs {matchDetails.away_team}</h2>
        <p className="match-date">📅 {new Date(matchDetails.scheduled).toLocaleString()}</p>
        <p className="match-venue">📍 {matchDetails.venue || 'TBD'}</p>
      </div>
      
      {/* User Credits */}
      <div className="user-credits">
        <p>💰 Your Credits: <strong>{userCredits}</strong></p>
      </div>
      
      {/* Bookmaker Info */}
      <div className="bookmaker-info">
        <p>📊 Odds provided by: <strong>DraftKings</strong></p>
        <p>⏰ Last updated: <strong>{new Date().toLocaleString()}</strong></p>
      </div>

      {/* Current Odds */}
      <div className="odds-container">
        <h3>Select Team to Bet On:</h3>
        <div className="team-odds-boxes">
          <div
            className={`odds-box ${team === matchDetails.home_team ? 'selected' : ''}`}
            onClick={() => setTeam(matchDetails.home_team)}
          >
            <span className="team-name">{matchDetails.home_team}</span>
            <span className="odds-value">{matchDetails.home_odds?.toFixed(2)}</span>
          </div>
          <div
            className={`odds-box ${team === matchDetails.away_team ? 'selected' : ''}`}
            onClick={() => setTeam(matchDetails.away_team)}
          >
            <span className="team-name">{matchDetails.away_team}</span>
            <span className="odds-value">{matchDetails.away_odds?.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Bet Type */}
      <div className="bet-type-section">
        <h3>💰 Bet Type:</h3>
        <div className="bet-type-options">
          <label className={`bet-type-option ${betType === 'winner' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="betType"
              value="winner"
              checked={betType === 'winner'}
              onChange={(e) => setBetType(e.target.value)}
            />
            Match Winner
          </label>
          <label className={`bet-type-option ${betType === 'runs' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="betType"
              value="runs"
              checked={betType === 'runs'}
              onChange={(e) => setBetType(e.target.value)}
            />
            Total Runs
          </label>
          <label className={`bet-type-option ${betType === 'wickets' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="betType"
              value="wickets"
              checked={betType === 'wickets'}
              onChange={(e) => setBetType(e.target.value)}
            />
            Total Wickets
          </label>
        </div>
      </div>

      {/* Prediction Value */}
      {betType !== 'winner' && (
        <div className="prediction-input">
          <h3>🔹 {betType === 'runs' ? 'Predict Total Runs:' : 'Predict Total Wickets:'}</h3>
          <input
            type="number"
            value={predictionValue}
            onChange={(e) => setPredictionValue(e.target.value)}
            placeholder={betType === 'runs' ? 'Enter runs' : 'Enter wickets'}
            min="0"
          />
        </div>
      )}

      {/* Amount */}
      <div className="bet-amount-section">
        <h3>💵 Bet Amount:</h3>
        <input
          type="number"
          value={amount}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            if (value <= userCredits) {
              setAmount(e.target.value);
            } else {
              alert('Amount cannot exceed available credits');
            }
          }}
          placeholder="Enter amount"
          min="1"
          max={userCredits}
        />
      </div>

      {/* Potential Winnings */}
      {potentialWinnings > 0 && (
        <div className="potential-winnings">
          <h3>🏆 Potential Winnings:</h3>
          <p className="winnings-amount">{potentialWinnings}</p>
        </div>
      )}

      {/* Place Bet Button */}
      <button 
        className="place-bet-button"
        onClick={handlePlaceBet}
        disabled={!amount || !team || parseFloat(amount) > userCredits}
      >
        Place Bet
      </button>

      {/* Bet Confirmation Modal */}
      {showConfirmation && (
        <BetConfirmationModal
          matchDetails={matchDetails}
          betDetails={{
            team,
            amount,
            betType,
            predictionValue,
            potentialWinnings
          }}
          onConfirm={handlePlaceBet}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </div>
  );
};

export default BettingPage;
