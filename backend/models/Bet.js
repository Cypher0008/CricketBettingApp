const mongoose = require("mongoose");

const betSchema = new mongoose.Schema({
    username: { type: String, required: true },
    matchId: { type: String, required: true },
    team: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "Won", "Lost"], default: "Pending" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Bet", betSchema);
