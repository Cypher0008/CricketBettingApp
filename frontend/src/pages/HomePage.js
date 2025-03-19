import { useEffect, useState } from 'react';
import { getLiveMatches, getMatchesByDate, debugCheckOdds } from '../api/apiService';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/HomePage.css';

const HomePage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('live');
  const [league, setLeague] = useState('');
  const [date, setDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let data = [];
        
        if (activeTab === 'live') {
          data = await getLiveMatches();
        } else {
          const dateToFetch = activeTab === 'recent'
                ? new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString('en-CA')
                : new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleDateString('en-CA');

          data = await getMatchesByDate(dateToFetch);
        }

        // If no matches were found, try the debug endpoint
        if (data.length === 0) {
          console.log('No matches found, checking debug endpoint...');
          const debugData = await debugCheckOdds();
          
          if (debugData.success && debugData.oddsCount > 0) {
            console.log('Found odds data in debug endpoint, but API returned no matches');
            setError(`Found ${debugData.oddsCount} odds entries in database, but couldn't convert them to matches. Check server logs.`);
          } else {
            setError(debugData.message || 'No matches or odds data available');
          }
        }

        // Filter by league and date if selected
        if (league && data.length > 0) {
          data = data.filter((match) => match.league === league);
        }
        if (date && data.length > 0) {
          data = data.filter((match) => match.scheduled.startsWith(date));
        }

        setMatches(data);
      } catch (error) {
        console.error('Failed to fetch matches:', error);
        setError('Failed to fetch matches. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [activeTab, league, date]);

  return (
    <div className="home-container">
      <h2>🏏 Cricket Matches with Betting Odds</h2>

      {/* ✅ Search + Filter */}
      <div className="filter-bar">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="Select Date"
        />
        <select value={league} onChange={(e) => setLeague(e.target.value)}>
          <option value="">Select League</option>
          <option value="T20 Krushnamai Premier League 2025">T20 Krushnamai Premier League 2025</option>
          <option value="T10 European Cricket League 2025">T10 European Cricket League 2025</option>
        </select>
      </div>

      {/* ✅ Tab Switcher */}
      <div className="tab-container">
        <button
          className={`tab ${activeTab === 'live' ? 'active' : ''}`}
          onClick={() => setActiveTab('live')}
        >
          Live Matches
        </button>
        <button
          className={`tab ${activeTab === 'recent' ? 'active' : ''}`}
          onClick={() => setActiveTab('recent')}
        >
          Recent Matches
        </button>
        <button
          className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Matches
        </button>
      </div>

      {/* Loading state */}
      {loading && <div className="loading-indicator">Loading matches...</div>}
      
      {/* Error state */}
      {error && <div className="error-message">{error}</div>}

      {/* ✅ Match List */}
      <div className="match-list">
        {!loading && !error && matches.length > 0 ? (
          matches.map((match) => (
            <div key={match.id} className="match-card">
              <h3>{match.league || 'Cricket League'} - {match.home_team} vs {match.away_team}</h3>
              <p>📍 Venue: {match.venue || 'TBD'}</p>
              <p>📅 Date: {new Date(match.scheduled).toLocaleString()}</p>
              <p>🔥 Status: {match.status}</p>
              
              {/* ✅ Display Odds */}
              <div className="odds-display">
                <p>📊 Odds: {match.home_team}: <strong>{match.home_odds}</strong> | {match.away_team}: <strong>{match.away_odds}</strong></p>
                <p>🏢 Bookmaker: {match.bookmaker || 'Unknown'}</p>
              </div>

              {/* ✅ Score and Winner Only if Completed */}
              {match.status === 'closed' && (
                <>
                  <p>🏆 Winner: {match.match_winner}</p>
                  <p>📊 Score: {match.home_score} - {match.away_score}</p>
                </>
              )}

              {/* ✅ Buttons */}
              <div className="button-group">
                <button onClick={() => navigate(`/match/${match.id}`)}>
                  Match Details
                </button>
                {match.status === 'not_started' && (
                  <button onClick={() => {
                    const matchIdParts = match.id.split('_');
                    const dateString = matchIdParts[1];
                    const formattedMatchId = `match_${dateString}_${match.home_team.replace(/ /g, '')}_${match.away_team.replace(/ /g, '')}`;
                    
                    console.log('Original match ID:', match.id);
                    console.log('Bookmaker:', match.bookmaker);
                    
                    // Pass both matchId and bookmaker in the URL
                    const encodedMatchId = encodeURIComponent(encodeURIComponent(formattedMatchId));
                    const encodedBookmaker = encodeURIComponent(match.bookmaker);
                    navigate(`/betting/${encodedMatchId}?bookmaker=${encodedBookmaker}`);
                  }}>
                    Bet Now
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          !loading && !error && <p>No matches with available odds</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
