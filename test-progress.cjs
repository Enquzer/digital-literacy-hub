const axios = require('axios');

async function testProgress() {
  try {
    // Test getting progress
    console.log('Testing GET progress...');
    const getResponse = await axios.get('http://localhost:3001/api/progress/admin-user-id/customs-e-single-window-system-1763631000020');
    console.log('GET Response:', getResponse.data);
    
    // Test updating progress
    console.log('Testing POST progress...');
    const postResponse = await axios.post('http://localhost:3001/api/progress', {
      userId: 'admin-user-id',
      moduleId: 'customs-e-single-window-system-1763631000020',
      progressData: {
        status: 'in_progress',
        progress_percentage: 75,
        time_spent_seconds: 2700,
        quiz_score: 85
      }
    });
    console.log('POST Response:', postResponse.data);
    
    // Test getting progress again
    console.log('Testing GET progress after update...');
    const getResponse2 = await axios.get('http://localhost:3001/api/progress/admin-user-id/customs-e-single-window-system-1763631000020');
    console.log('GET Response after update:', getResponse2.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testProgress();