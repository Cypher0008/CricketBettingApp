const express = require("express");
const { fetchMatches, fetchMatchDetails, fetchLiveMatches} = require("../services/sportsRadarService");

const Match = require("../models/Match");
const Bet = require("../models/Bet");
const User = require("../models/User");

const router = express.Router();


// ✅ Route to Fetch Only Live Matches
router.get("/matches/live", async (req, res) => {
    try {
        console.log(`🟡 [ROUTE HIT] Fetching live matches`);
        const matches = await fetchLiveMatches();
        console.log("✅ [ROUTE SUCCESS] Live matches data sent.");
        res.json(matches);
    } catch (error) {
        console.error("❌ [ROUTE ERROR] Failed to fetch live matches:", error.message);
        res.status(500).json({ error: "Failed to retrieve live matches." });
    }
});


router.get("/matches/:date", async (req, res) => {
    try {
        const { date } = req.params;
        console.log(`🟡 [ROUTE HIT] Fetching matches for date: ${date}`);

        const matches = await fetchMatches(date);
        console.log("✅ [ROUTE SUCCESS] Sending data to frontend.");
        res.json(matches);
    } catch (error) {
        console.error("❌ [ROUTE ERROR] Failed to fetch matches:", error.message);
        res.status(500).json({ error: "Failed to retrieve matches." });
    }
});

router.get("/match/:matchId", async (req, res) => {
    try {
        const { matchId } = req.params;
        console.log(`🟡 [ROUTE HIT] Fetching match details for: ${matchId}`);

        const matchDetails = await fetchMatchDetails(matchId);
        console.log("✅ [ROUTE SUCCESS] Match details sent.");
        res.json(matchDetails);
    } catch (error) {
        console.error("❌ [ROUTE ERROR] Failed to fetch match details:", error.message);
        res.status(500).json({ error: "Failed to retrieve match details." });
    }
});
// ✅ Save Match to Database (Admin)
router.post("/matches/save", async (req, res) => {
    try {
        const { matchId, team1, team2, scheduled, status } = req.body;

        // ✅ Validate scheduled field
        if (!scheduled || isNaN(Date.parse(scheduled))) {
            return res.status(400).json({ error: "Invalid or missing scheduled date" });
        }

        const existingMatch = await Match.findOne({ matchId });
        if (existingMatch) return res.status(400).json({ error: "Match already exists in DB" });

        const match = new Match({
            matchId,
            team1,
            team2,
            scheduled: new Date(scheduled), // ✅ Convert to Date object
            status
        });
        await match.save();

        res.json({ message: "Match saved successfully", match });
    } catch (error) {
        console.error("❌ [ROUTE ERROR] Failed to save match:", error.message);
        res.status(500).json({ error: "Failed to save match" });
    }
});


// ✅ Fetch All Matches (Past & Live)
router.get("/matches/all", async (req, res) => {
    try {
        const matches = await Match.find();
        res.json({ matches });
    } catch (error) {
        console.error("❌ [ROUTE ERROR] Failed to fetch matches:", error.message);
        res.status(500).json({ error: "Failed to retrieve matches." });
    }
});

// ✅ Fetch All Bets on a Match
router.get("/matches/:matchId/bets", async (req, res) => {
    try {
        const { matchId } = req.params;
        const bets = await Bet.find({ matchId });
        res.json(bets);
    } catch (error) {
        console.error("❌ [ROUTE ERROR] Failed to fetch bets:", error.message);
        res.status(500).json({ error: "Failed to retrieve bets." });
    }
});

// ✅ Update Match Result & Settle Bets (Admin)
router.post("/matches/update-result", async (req, res) => {
    try {
        const { matchId, winner } = req.body;

        const match = await Match.findOne({ matchId });
        if (!match) return res.status(404).json({ error: "Match not found" });

        match.status = "completed";
        match.winner = winner;
        await match.save();

        // ✅ Settle Bets
        const bets = await Bet.find({ matchId });
        for (const bet of bets) {
            if (bet.team === winner) {
                const user = await User.findOne({ username: bet.username });
                user.credits += bet.amount * 2; // Winning amount
                await user.save();
                bet.status = "won";
            } else {
                bet.status = "lost";
            }
            await bet.save();
        }

        res.json({ message: "Match result updated. Bets settled.", betsUpdated: bets.length });
    } catch (error) {
        console.error("❌ [ROUTE ERROR] Failed to update match result:", error.message);
        res.status(500).json({ error: "Failed to update match result." });
    }
});


module.exports = router;