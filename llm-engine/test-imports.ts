// Test direct evaluation
const fs = require('fs');
const path = require('path');

// Read the database file and evaluate it
const databaseFilePath = path.join(__dirname, 'api', 'database.ts');
console.log('Reading file:', databaseFilePath);

// Try to directly evaluate the functions
try {
  const databaseModule = require('./api/database');
  console.log('Module loaded successfully');
  console.log('Available exports:', Object.keys(databaseModule));
  
  // Check if our functions are available
  console.log('getLearningProgressByUserAndModule:', typeof databaseModule.getLearningProgressByUserAndModule);
  console.log('getLearningProgressByUser:', typeof databaseModule.getLearningProgressByUser);
  console.log('getUserCertificates:', typeof databaseModule.getUserCertificates);
} catch (error) {
  console.error('Error loading module:', error);
}

// Test specific imports
try {
  const { getLearningProgressByUserAndModule, getLearningProgressByUser, getUserCertificates } = require('./api/database');
  
  console.log('Direct import test:');
  console.log('- getLearningProgressByUserAndModule:', typeof getLearningProgressByUserAndModule);
  console.log('- getLearningProgressByUser:', typeof getLearningProgressByUser);
  console.log('- getUserCertificates:', typeof getUserCertificates);
} catch (error) {
  console.error('Error with direct imports:', error);
}