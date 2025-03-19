const { google } = require('googleapis');
const sheets = google.sheets('v4');

// Configure Google Sheets API credentials
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const SPREADSHEET_ID = '1kQ2Lv7EQsUVaGaAkuB57K6nWlRm5EATrZMfE2LUz_pI';
const SHEET_NAME = 'Sheet1'; // Update this if your sheet has a different name

// Initialize auth client
async function getAuthClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json', // You'll need to create this service account key file
    scopes: SCOPES,
  });
  return auth.getClient();
}

// Fetch odds data from Google Sheets
async function fetchOddsFromSheet() {
  try {
    console.log('🔄 Fetching odds data from Google Sheets...');
    
    // Check if credentials file exists
    const fs = require('fs');
    if (!fs.existsSync('./credentials.json')) {
      console.error('❌ credentials.json file not found!');
      throw new Error('Google API credentials file not found');
    }
    
    const authClient = await getAuthClient();
    
    console.log(`📊 Attempting to fetch data from spreadsheet ID: ${SPREADSHEET_ID}`);
    
    const response = await sheets.spreadsheets.values.get({
      auth: authClient,
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:Z`, // Fetch all columns
    });
    
    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      console.error('❌ No data found in the spreadsheet');
      throw new Error('No data found in the spreadsheet');
    }
    
    console.log(`✅ Successfully fetched ${rows.length} rows from Google Sheets`);
    console.log(`📋 Headers: ${rows[0].join(', ')}`);
    
    // Parse the header row to find column indexes based on your actual sheet structure
    const headers = rows[0];
    const eventNameIndex = headers.indexOf('event_name');
    const commenceIndex = headers.indexOf('commence');
    const statusIndex = headers.indexOf('status');
    const bookmakerIndex = headers.indexOf('bookmaker');
    const odd1Index = headers.indexOf('odd_1');
    const odd2Index = headers.indexOf('odd_2');
    
    // Check if required columns exist
    if (eventNameIndex === -1 || commenceIndex === -1 || 
        statusIndex === -1 || bookmakerIndex === -1 || 
        odd1Index === -1 || odd2Index === -1) {
      console.error('❌ Required columns missing in spreadsheet');
      console.error(`Required columns: event_name, commence, status, bookmaker, odd_1, odd_2`);
      console.error(`Found columns: ${headers.join(', ')}`);
      throw new Error('Required columns missing in spreadsheet');
    }
    
    // Transform sheet data into structured odds data
    const oddsData = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length > 0 && row[eventNameIndex]) {
        // Parse the event name to extract teams
        const eventName = row[eventNameIndex];
        let homeTeam, awayTeam;
        
        if (eventName.includes('_')) {
          // Format: "Team1_Team2"
          [homeTeam, awayTeam] = eventName.split('_');
        } else if (eventName.includes(' vs ')) {
          // Format: "Team1 vs Team2"
          [homeTeam, awayTeam] = eventName.split(' vs ');
        } else if (eventName.includes('vs.')) {
          // Format: "Team1 vs. Team2"
          [homeTeam, awayTeam] = eventName.split('vs.');
        } else {
          // Try to split by the last space before "vs"
          const parts = eventName.split(/(?=_)/);
          if (parts.length >= 2) {
            homeTeam = parts[0].trim();
            awayTeam = parts.slice(1).join('').trim();
          } else {
            // If all else fails, use the event name as is
            homeTeam = eventName;
            awayTeam = "Unknown Opponent";
          }
        }
        
        // Generate a unique match ID if none exists
        const matchId = `match_${row[commenceIndex]}_${homeTeam.replace(/\s+/g, '')}_${awayTeam.replace(/\s+/g, '')}`;
        
        oddsData.push({
          matchId: matchId,
          homeTeam: homeTeam.trim(),
          awayTeam: awayTeam.trim(),
          homeOdds: parseFloat(row[odd1Index]) || 1.0,
          awayOdds: parseFloat(row[odd2Index]) || 1.0,
          bookmaker: row[bookmakerIndex],
          commence: row[commenceIndex],
          status: row[statusIndex],
          lastUpdated: new Date()
        });
      }
    }
    
    console.log(`✅ Successfully processed odds for ${oddsData.length} matches`);
    if (oddsData.length > 0) {
      console.log(`📊 Sample match: ${oddsData[0].homeTeam} vs ${oddsData[0].awayTeam}, Odds: ${oddsData[0].homeOdds}-${oddsData[0].awayOdds}`);
    }
    
    return oddsData;
  } catch (error) {
    console.error('❌ Error fetching odds from Google Sheets:', error);
    console.error('Error details:', error.stack);
    // Return empty array instead of throwing to prevent cron job from crashing
    return [];
  }
}

module.exports = { fetchOddsFromSheet }; 