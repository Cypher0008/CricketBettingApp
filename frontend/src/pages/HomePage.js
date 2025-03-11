import { useEffect, useState } from 'react';
import { getLiveMatches, getMatchesByDate } from '../api/apiService';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/HomePage.css';

const HomePage = () => {
  const [matches, setMatches] = useState([]);
  const [activeTab, setActiveTab] = useState('live');
  const [league, setLeague] = useState('');
  const [date, setDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        let data;
        if (activeTab === 'live') {
          data = await getLiveMatches(); // ✅ Load live matches
        } else {
          const dateToFetch = activeTab === 'recent'
                ? new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString('en-CA') // ✅ Fixed timezone issue
                : new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleDateString('en-CA');

          data = await getMatchesByDate(dateToFetch);
        }

        // ✅ Filter by league and date if selected
        if (league) {
          data = data.filter((match) => match.league === league);
        }
        if (date) {
          data = data.filter((match) => match.scheduled.startsWith(date));
        }

        setMatches(data);
      } catch (error) {
        console.error('Failed to fetch matches:', error);
      }
    };

    fetchMatches();
  }, [activeTab, league, date]);

  return (
    <div className="home-container">
      <h2>🏏 Live Matches</h2>

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

      {/* ✅ Match List */}
      <div className="match-list">
        {matches.length > 0 ? (
          matches.map((match) => (
            <div key={match.id} className="match-card">
              <h3>{match.league} - {match.home_team} vs {match.away_team}</h3>
              <p>📍 Venue: {match.venue || 'TBD'}</p>
              <p>📅 Date: {new Date(match.scheduled).toLocaleString()}</p>
              <p>🔥 Status: {match.status}</p>

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
                  <button onClick={() => navigate(`/betting/${match.id}`)}>
                    Bet Now
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No matches available</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
