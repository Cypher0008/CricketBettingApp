const cron = require('node-cron');
const { fetchOddsFromSheet } = require('./googleSheetsService');
const Odds = require('../models/Odds');
const Match = require('../models/Match');

// Function to update odds in the database
async function updateOddsInDatabase(oddsData) {
  try {
    console.log('🔄 Updating odds in database...');
    
    if (!oddsData || oddsData.length === 0) {
      console.log('⚠️ No odds data to update');
      return;
    }
    
    // For each odds entry from the sheet
    for (const odds of oddsData) {
      // Use upsert to update if exists or create if not
      await Odds.findOneAndUpdate(
        { matchId: odds.matchId, bookmaker: odds.bookmaker },
        odds,
        { upsert: true, new: true }
      );
      
      // Check if we need to create a match entry if it doesn't exist
      const matchExists = await Match.findOne({ matchId: odds.matchId });
      if (!matchExists) {
        const newMatch = new Match({
          matchId: odds.matchId,
          team1: odds.homeTeam,
          team2: odds.awayTeam,
          scheduled: new Date(), // You might want to get this from the sheet too
          status: "scheduled"
        });
        await newMatch.save();
        console.log(`✅ Created new match entry for ${odds.homeTeam} vs ${odds.awayTeam}`);
      }
    }
    
    console.log(`✅ Odds updated successfully for ${oddsData.length} matches`);
  } catch (error) {
    console.error('❌ Error updating odds in database:', error.message);
    console.error('Error stack:', error.stack);
  }
}

// Initialize cron job to fetch odds every minute
function initOddsCronJob() {
  console.log('🕒 Initializing odds cron job...');
  
  // Run immediately on startup
  (async () => {
    try {
      console.log('⏰ Running initial odds update...');
      const oddsData = await fetchOddsFromSheet();
      await updateOddsInDatabase(oddsData);
    } catch (error) {
      console.error('❌ Initial odds update failed:', error.message);
    }
  })();
  
  // Schedule to run every minute
  cron.schedule('* * * * *', async () => {
    try {
      console.log('⏰ Running scheduled odds update...');
      const oddsData = await fetchOddsFromSheet();
      await updateOddsInDatabase(oddsData);
    } catch (error) {
      console.error('❌ Cron job failed:', error.message);
    }
  });
  
  console.log('✅ Odds cron job initialized');
}

module.exports = { initOddsCronJob }; 