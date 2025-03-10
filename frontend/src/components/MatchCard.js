import React from 'react';
import { Link } from 'react-router-dom';

const MatchCard = ({ match }) => {
  return (
    <div className="match-card">
      <h3>
        🏏 {match.team1} vs {match.team2}
      </h3>
      <p>
        🏆 {match.league} | 📅 {new Date(match.scheduled).toLocaleDateString()}
      </p>
      <p>📊 Status: {match.status}</p>
      <Link to={`/match/${match.id}`}>View Details ➡</Link>
    </div>
  );
};

export default MatchCard;
