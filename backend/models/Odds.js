const mongoose = require('mongoose');

const oddsSchema = new mongoose.Schema({
  matchId: {
    type: String,
    required: true
  },
  homeTeam: {
    type: String,
    required: true
  },
  awayTeam: {
    type: String,
    required: true
  },
  homeOdds: {
    type: Number,
    required: true
  },
  awayOdds: {
    type: Number,
    required: true
  },
  bookmaker: {
    type: String,
    required: true
  },
  commence: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'not_started'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index for matchId and bookmaker
oddsSchema.index({ matchId: 1, bookmaker: 1 }, { unique: true });

const Odds = mongoose.model('Odds', oddsSchema);

module.exports = Odds;