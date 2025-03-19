const mongoose = require('mongoose');
const Match = require('../models/Match');
require('dotenv').config(); // Add this to load environment variables

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bettingDB';

async function cleanupDuplicates() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all matches
    const matches = await Match.find({}).sort({ scheduled: 1 });
    console.log(`Found ${matches.length} total matches`);
    
    // Create a map to store unique matches
    const uniqueMatches = new Map();
    
    // Identify duplicates with more specific key including date
    matches.forEach(match => {
      const scheduledDate = new Date(match.scheduled).toISOString().split('T')[0];
      const key = `${match.team1}_${match.team2}_${scheduledDate}`;
      console.log(`Processing match: ${key}`);
      
      if (!uniqueMatches.has(key)) {
        uniqueMatches.set(key, match._id);
      }
    });
    
    // Delete duplicates
    let deletedCount = 0;
    for (const match of matches) {
      const scheduledDate = new Date(match.scheduled).toISOString().split('T')[0];
      const key = `${match.team1}_${match.team2}_${scheduledDate}`;
      
      if (uniqueMatches.get(key) !== match._id) {
        await Match.deleteOne({ _id: match._id });
        console.log(`Deleted duplicate match: ${match.team1} vs ${match.team2} on ${scheduledDate}`);
        deletedCount++;
      }
    }
    
    // Also clean up any matches with invalid dates
    const invalidDates = await Match.find({
      scheduled: { 
        $exists: true,
        $type: "date",
        $eq: null
      }
    });
    
    for (const match of invalidDates) {
      await Match.deleteOne({ _id: match._id });
      console.log(`Deleted match with invalid date: ${match.team1} vs ${match.team2}`);
      deletedCount++;
    }

    console.log(`Cleanup completed. Deleted ${deletedCount} duplicate/invalid matches`);

    // Log remaining matches for verification
    const remainingMatches = await Match.find({}).sort({ scheduled: 1 });
    console.log('\nRemaining matches:');
    remainingMatches.forEach(match => {
      console.log(`${match.team1} vs ${match.team2} on ${new Date(match.scheduled).toLocaleDateString()}`);
    });

  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the cleanup if this file is executed directly
if (require.main === module) {
  cleanupDuplicates()
    .catch(console.error);
}

module.exports = cleanupDuplicates; 