import React, { useEffect, useState } from 'react';
import { fetchLiveMatches } from '../api/apiService';
import MatchCard from '../components/MatchCard';
import '../styles/pages/HomePage.css';

const HomePage = () => {
  const [matches, setMatches] = useState([]);
  const [searchDate, setSearchDate] = useState('');

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const data = await fetchLiveMatches();
      setMatches(data);
    } catch (error) {
      console.error('Failed to fetch matches:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const data = await fetchLiveMatches(searchDate);
      setMatches(data);
    } catch (error) {
      console.error('Failed to search matches:', error);
    }
  };

  return (
    <div className="home-page">
      <h1>🏏 Live Cricket Matches</h1>
      <input
        type="date"
        value={searchDate}
        onChange={(e) => setSearchDate(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      <div className="match-list">
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
