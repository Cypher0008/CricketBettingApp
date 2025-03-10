const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
    matchId: { type: String, required: true, unique: true },
    team1: { type: String, required: true },
    team2: { type: String, required: true },
    scheduled: { type: Date, required: true }, // ✅ Add scheduled field
    status: {
        type: String,
        enum: ["scheduled", "in_progress", "completed"],
        required: true
    },
    winner: { type: String }
});

const Match = mongoose.model("Match", matchSchema);

module.exports = Match;

