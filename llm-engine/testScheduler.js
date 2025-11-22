// Test the Scheduler implementation
const { Scheduler } = require('./Scheduler');

function testScheduler() {
  console.log('Testing Scheduler implementation...');
  
  const scheduler = new Scheduler();
  
  console.log('Scheduler created successfully');
  
  // Test starting scheduled jobs
  console.log('Starting scheduled jobs...');
  scheduler.startScheduledJobs();
  
  // Wait a moment to see if jobs start
  setTimeout(() => {
    console.log('Stopping scheduled jobs...');
    scheduler.stopScheduledJobs();
    console.log('Scheduler test completed');
  }, 15000); // Wait 15 seconds to see multiple job executions
}

testScheduler();