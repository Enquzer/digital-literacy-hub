// Create a minimal test to check if functions are exported
import fs from 'fs';
import path from 'path';

// Read the database file
const databaseFilePath = path.join(__dirname, 'api', 'database.ts');
const content = fs.readFileSync(databaseFilePath, 'utf-8');

// Check if the functions are defined in the file
const hasGetLearningProgressByUserAndModule = content.includes('export async function getLearningProgressByUserAndModule');
const hasGetLearningProgressByUser = content.includes('export async function getLearningProgressByUser');

console.log('File analysis:');
console.log('- getLearningProgressByUserAndModule function defined:', hasGetLearningProgressByUserAndModule);
console.log('- getLearningProgressByUser function defined:', hasGetLearningProgressByUser);

// Check if there are any syntax errors before these functions
const lines = content.split('\n');
let foundError = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  // Look for syntax errors or missing closing braces before our functions
  if (i < 550 && line.includes('}')) {
    // Check if this is the closing brace of getUserCertificates
    if (line.trim() === '}' && i > 540 && i < 550) {
      console.log('Found closing brace for getUserCertificates at line', i + 1);
    }
  }
  
  // Check for obvious syntax errors
  if (line.includes('function') && line.includes('{') && !line.includes('(')) {
    console.log('Potential syntax error at line', i + 1, ':', line);
    foundError = true;
  }
}

if (!foundError) {
  console.log('No obvious syntax errors found before the new functions');
}