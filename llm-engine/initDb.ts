// Use the JavaScript version directly
const { initSQLite } = require('./api/database');

async function initDatabase() {
  console.log('Initializing database...');
  try {
    // Initialize SQLite database
    const isConnected = await initSQLite();
    console.log('Database connection:', isConnected ? 'Successful' : 'Using mock implementation');
    
    if (isConnected) {
      console.log('SQLite database is ready for use');
    } else {
      console.log('Using mock database for development');
    }
    
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
}

initDatabase();