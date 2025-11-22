// Database configuration for MySQL
// Now using API calls instead of direct database connections

// Export mock objects to maintain compatibility with existing code
const pool = {
  execute: async (query, params) => {
    console.warn('Direct database calls are deprecated. Please use the API client instead.');
    // Return mock data based on the query
    if (query.includes('SELECT * FROM courses')) {
      return [[
        { id: 'course-1', title: 'Test Course 1', description: 'Test course 1 description' },
        { id: 'course-2', title: 'Test Course 2', description: 'Test course 2 description' }
      ]];
    } else if (query.includes('SELECT * FROM modules')) {
      return [[
        { id: 'module-1', title: 'Test Module 1', description: 'Test module 1 description' },
        { id: 'module-2', title: 'Test Module 2', description: 'Test module 2 description' }
      ]];
    } else if (query.includes('SELECT * FROM profiles')) {
      return [[
        { id: 'user-1', email: 'test@example.com', full_name: 'Test User' }
      ]];
    } else if (query.includes('SELECT * FROM user_roles')) {
      return [[
        { role: 'trainee' }
      ]];
    }
    return [[]];
  }
};

// Test the connection
async function testConnection() {
  // This would test the API connection instead
  console.log('API connection test would be implemented here');
}

module.exports = {
  pool,
  testConnection
};