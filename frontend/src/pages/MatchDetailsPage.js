import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/pages/MatchDetailsPage.css"; // Ensure you have the CSS file for styling

const MatchDetails = () => {
    const { matchId } = useParams();
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatchDetails = async () => {
            try {
                const response = await axios.get(`/api/match/${matchId}`);
                setMatch(response.data);
            } catch (error) {
                console.error("❌ Error fetching match details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMatchDetails();
    }, [matchId]);

    if (loading) {
        return <div className="loading">Loading match details...</div>;
    }

    if (!match) {
        return <div className="error">Failed to load match details.</div>;
    }

    return (
        <div className="match-details">
            <h1>Match Details</h1>
            <h2>{match.home_team} vs {match.away_team}</h2>

            <p><strong>🏆 League:</strong> {match.league}</p>
            <p><strong>🏟 Venue:</strong> {match.venue}</p>
            <p><strong>📅 Scheduled:</strong> {new Date(match.scheduled).toLocaleString()}</p>
            <p><strong>📌 Status:</strong> {match.status}</p>
            <p><strong>🎲 Toss Winner:</strong> {match.toss_winner} ({match.toss_decision})</p>
            <p><strong>🏅 Match Winner:</strong> {match.match_winner}</p>

            <h3>📊 Scores:</h3>
            <p><strong>{match.home_team}:</strong> {match.home_score}</p>
            <p><strong>{match.away_team}:</strong> {match.away_score}</p>

            <h3>🎙 Live Commentary:</h3>
            <div className="commentary-section">
                {match.commentary.length > 0 ? (
                    <ul>
                        {match.commentary.map((event, index) => (
                            <li key={index}>
                                <strong>Over {event.over}.{event.ball}:</strong>{" "}
                                {event.batsman} vs {event.bowler} →{" "}
                                <span className="runs">{event.runs} runs</span> |{" "}
                                <span className="description">{event.description}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No commentary available.</p>
                )}
            </div>
        </div>
    );
};

export default MatchDetails;
