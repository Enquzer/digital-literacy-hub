import { ETaxScraper } from './scrapers/ETaxScraper';
import { CustomsScraper } from './scrapers/CustomsScraper';
import { MorScraper } from './scrapers/MorScraper';
import { DataProcessor } from './processors/DataProcessor';
import { saveModule } from './api/database';
import * as fs from 'fs';
import * as path from 'path';

async function manualScrape() {
  console.log('Starting manual scraping process...');
  
  try {
    // Run ETax scraper
    console.log('Running ETax scraper...');
    const etaxScraper = new ETaxScraper();
    const etaxData = await etaxScraper.scrape();
    console.log(`ETax scraper returned ${etaxData.length} modules`);
    
    // Run Customs scraper
    console.log('Running Customs scraper...');
    const customsScraper = new CustomsScraper();
    const customsData = await customsScraper.scrape();
    console.log(`Customs scraper returned ${customsData.length} modules`);
    
    // Run MOR scraper
    console.log('Running MOR scraper...');
    const morScraper = new MorScraper();
    const morData = await morScraper.scrape();
    console.log(`MOR scraper returned ${morData.length} modules`);
    
    // Combine all data
    const allData = [...etaxData, ...customsData, ...morData];
    console.log(`Total modules scraped: ${allData.length}`);
    
    if (allData.length > 0) {
      // Save to cache
      const cacheDir = path.join(__dirname, 'cache');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filePath = path.join(cacheDir, `manual-scrape-${timestamp}.json`);
      fs.writeFileSync(filePath, JSON.stringify(allData, null, 2));
      console.log(`Saved data to ${filePath}`);
      
      // Save individual modules to cache/raw directory
      const rawDir = path.join(cacheDir, 'raw');
      if (!fs.existsSync(rawDir)) {
        fs.mkdirSync(rawDir, { recursive: true });
      }
      
      // Save each module as a separate file
      for (let i = 0; i < allData.length; i++) {
        const module = allData[i];
        const moduleFilePath = path.join(rawDir, `raw_${timestamp}-${i}.json`);
        fs.writeFileSync(moduleFilePath, JSON.stringify(module, null, 2));
      }
      
      // Process data using the existing processAllModules method
      console.log('Processing data...');
      const processor = new DataProcessor();
      await processor.processAllModules();
      
      console.log('Manual scraping process completed successfully');
    } else {
      console.log('No data was scraped');
    }
  } catch (error) {
    console.error('Error in manual scraping process:', error);
  }
}

// Run the manual scrape
manualScrape().then(() => {
  console.log('Manual scrape completed');
  process.exit(0);
}).catch((error) => {
  console.error('Error in manual scrape:', error);
  process.exit(1);
});