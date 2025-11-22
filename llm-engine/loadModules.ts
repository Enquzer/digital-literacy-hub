import * as fs from 'fs';
import * as path from 'path';
import { populateMockModules } from './api/database';

async function loadProcessedModules() {
  console.log('Loading processed modules into mock database...');
  
  try {
    const processedDir = path.join(__dirname, 'processed');
    
    if (!fs.existsSync(processedDir)) {
      console.log('No processed modules directory found');
      return;
    }
    
    const files = fs.readdirSync(processedDir);
    const jsonFiles = files.filter(file => file.endsWith('-processed.json'));
    
    let allModules: any[] = [];
    
    for (const file of jsonFiles) {
      const filePath = path.join(processedDir, file);
      console.log(`Loading modules from ${file}...`);
      
      try {
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const modules = JSON.parse(rawData);
        
        // Add modules to the collection
        allModules.push(...modules);
        console.log(`Loaded ${modules.length} modules from ${file}`);
      } catch (fileError) {
        console.error(`Error reading file ${file}:`, fileError);
      }
    }
    
    // Populate mock database with all modules
    populateMockModules(allModules);
    console.log(`Successfully loaded ${allModules.length} modules into mock database`);
  } catch (error) {
    console.error('Error loading processed modules:', error);
  }
}

// Run the load modules function
loadProcessedModules().then(() => {
  console.log('Module loading completed');
  process.exit(0);
}).catch((error) => {
  console.error('Error in module loading:', error);
  process.exit(1);
});