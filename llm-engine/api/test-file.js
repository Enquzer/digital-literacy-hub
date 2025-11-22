const fs = require('fs');
const path = require('path');

try {
  const processedDir = path.join(__dirname, '..', 'processed');
  console.log('Processed directory:', processedDir);
  
  const files = fs.readdirSync(processedDir);
  console.log('Files found:', files);
  
  const jsonFiles = files.filter(file => file.endsWith('-processed.json'));
  console.log('JSON files found:', jsonFiles);
  
  if (jsonFiles.length > 0) {
    const filePath = path.join(processedDir, jsonFiles[0]);
    console.log('Reading file:', filePath);
    
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const modules = JSON.parse(rawData);
    console.log('Modules found:', modules.length);
  }
} catch (error) {
  console.error('Error:', error);
}