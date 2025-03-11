
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/pages/MatchDetailsPage.css';

const MatchDetailsPage = () => {
  const { matchId } = useParams();
  const [matchDetails, setMatchDetails] = useState(null);
  const [activeTab, setActiveTab] = useState('scorecard');

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/match/${matchId}`);
        if (response.ok) {
          const data = await response.json();
          setMatchDetails(data);
        } else {
          console.error('Failed to fetch match details');
        }
      } catch (error) {
        console.error('Error fetching match details:', error);
      }
    };

    fetchMatchDetails();
  }, [matchId]);

  if (!matchDetails) {
    return <div className="match-details-container">Loading match details...</div>;
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString();
  };

  const renderScorecard = (team, teamName) => (
    <div className="scorecard-section">
      <h3>{teamName} Batting</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Runs</th>
            <th>Balls Faced</th>
            <th>Fours</th>
            <th>Sixes</th>
            <th>Strike Rate</th>
            <th>Dismissal</th>
          </tr>
        </thead>
        <tbody>
          {team?.length > 0 ? (
            team.map((player, index) => (
              <tr key={index}>
                <td>{player.name || '-'}</td>
                <td>{player.runs || '-'}</td>
                <td>{player.balls_faced || '-'}</td>
                <td>{player.fours || '-'}</td>
                <td>{player.sixes || '-'}</td>
                <td>{player.strike_rate || '-'}</td>
                <td>{player.dismissal || '-'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No scorecard data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderCommentary = () => (
    <div className="commentary-section">
      {matchDetails.commentary?.length > 0 ? (
        matchDetails.commentary.map((comment, index) => (
          <div key={index} className="commentary-item">
            <strong>Over: {comment.over}, Ball: {comment.ball}</strong><br />
            Batsman: {comment.batsman} | Bowler: {comment.bowler} <br />
            Runs: {comment.runs} <br />
            {comment.description}
          </div>
        ))
      ) : (
        <p>No commentary available</p>
      )}
    </div>
  );

  return (
    <div className="match-details-container">
      <div className="match-info">
        <h2>{matchDetails.home_team || '-'} vs {matchDetails.away_team || '-'}</h2>
        <p>📅 <strong>Date:</strong> {formatDate(matchDetails.scheduled)}</p>
        <p>📍 <strong>Venue:</strong> {matchDetails.venue || '-'}</p>
        <p>🔥 <strong>Status:</strong> {matchDetails.status || '-'}</p>
        <p>🏆 <strong>Toss:</strong> {matchDetails.toss_winner ? `${matchDetails.toss_winner} chose to ${matchDetails.toss_decision}` : '-'}</p>
        <p>🥇 <strong>Winner:</strong> {matchDetails.match_winner || '-'}</p>
        <p>🏏 <strong>Score:</strong> {matchDetails.home_score || '-'} - {matchDetails.away_score || '-'}</p>

        <div className="tab-container">
          <button
            className={activeTab === 'scorecard' ? 'active' : ''}
            onClick={() => setActiveTab('scorecard')}
          >
            Scorecard
          </button>
          <button
            className={activeTab === 'commentary' ? 'active' : ''}
            onClick={() => setActiveTab('commentary')}
          >
            Commentary
          </button>
        </div>
      </div>

      {activeTab === 'scorecard' && (
        <>
          {renderScorecard(matchDetails.batting_scorecard?.home_team, matchDetails.home_team)}
          {renderScorecard(matchDetails.batting_scorecard?.away_team, matchDetails.away_team)}
        </>
      )}
      
      {activeTab === 'commentary' && renderCommentary()}
    </div>
  );
};

export default MatchDetailsPage;