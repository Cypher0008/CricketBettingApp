const cron = require('node-cron');
const { fetchOddsFromSheet } = require('./googleSheetsService');
const Odds = require('../models/Odds');
const Match = require('../models/Match');

// Helper function to normalize match status
function normalizeStatus(status) {
  status = status.toLowerCase();
  if (status === 'pending' || status === 'scheduled') {
    return 'not_started';
  }
  if (status === 'completed' || status === 'finished') {
    return 'closed';
  }
  return status;
}

const initOddsCronJob = (broadcastCallback) => {
  // Run every 15 seconds
  cron.schedule('*/15 * * * * *', async () => {
    try {
      console.log('🔄 Fetching latest odds...');
      const latestOdds = await fetchOddsFromSheet();
      const updatedOdds = [];

      // Update database and broadcast changes
      for (const odds of latestOdds) {
        try {
          // Find existing odds record
          const existingOdds = await Odds.findOne({
            matchId: odds.matchId,
            bookmaker: odds.bookmaker
          });

          if (existingOdds) {
            // Check if odds have changed
            if (existingOdds.homeOdds !== odds.homeOdds || 
                existingOdds.awayOdds !== odds.awayOdds) {
              const updatedOdd = await Odds.findOneAndUpdate(
                { matchId: odds.matchId, bookmaker: odds.bookmaker },
                { ...odds, lastUpdated: new Date() },
                { new: true }
              );
              updatedOdds.push(updatedOdd);
              console.log(`📊 Updated odds for match: ${odds.matchId}`);
            }
          } else {
            const newOdd = await Odds.create({
              ...odds,
              lastUpdated: new Date()
            });
            updatedOdds.push(newOdd);
            console.log(`📊 Created new odds for match: ${odds.matchId}`);
          }

          // Check if we need to create a match entry
          const matchExists = await Match.findOne({ matchId: odds.matchId });
          if (!matchExists) {
            await Match.create({
              matchId: odds.matchId,
              team1: odds.homeTeam,
              team2: odds.awayTeam,
              scheduled: new Date(odds.commence),
              status: normalizeStatus(odds.status || "not_started")
            });
            console.log(`✅ Created new match entry for ${odds.homeTeam} vs ${odds.awayTeam}`);
          }
        } catch (error) {
          console.error(`❌ Error processing odds for match ${odds.matchId}:`, error);
        }
      }

      // Only broadcast if there were actual updates
      if (updatedOdds.length > 0) {
        console.log(`✅ Updated odds for ${updatedOdds.length} matches`);
        if (broadcastCallback) {
          broadcastCallback(updatedOdds);
          console.log('🔄 Broadcasted odds updates to connected clients');
        }
      } else {
        console.log('ℹ️ No odds updates needed');
      }
      
    } catch (error) {
      console.error('❌ Error in cron job:', error);
    }
  });

  console.log('✅ Initialized WebSocket odds update service');
};

module.exports = { initOddsCronJob }; 