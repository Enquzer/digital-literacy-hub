import { CronJob } from 'cron';
import { ETaxScraper } from '../scrapers/ETaxScraper';
import { CustomsScraper } from '../scrapers/CustomsScraper';
import { MorScraper } from '../scrapers/MorScraper';
import { CustomsCommissionScraper } from '../scrapers/CustomsCommissionScraper';
import { NbeScraper } from '../scrapers/NbeScraper';
import { TradeScraper } from '../scrapers/TradeScraper';
import { OpenDataScraper } from '../scrapers/OpenDataScraper';
import { DataProcessor } from './DataProcessor';
import { TrainingDataPackager } from './TrainingDataPackager';
import { VectorDB } from '../vector-db/VectorDB';

export class Scheduler {
  private jobs: CronJob[] = [];
  private defaultCron: string;

  constructor() {
    // Get cron schedule from environment variable or use default
    this.defaultCron = process.env.CRON_DEFAULT || '0 2 * * *'; // Default: daily at 2 AM
  }

  /**
   * Start all scheduled jobs
   */
  start(): void {
    console.log('Starting LLM Engine Scheduler...');
    
    // Daily incremental scrape job
    const dailyJob = new CronJob(
      this.defaultCron,
      () => this.runIncrementalScrape(),
      null,
      true
    );
    
    // Weekly full rescan job (Sundays at 3 AM)
    const weeklyJob = new CronJob(
      '0 3 * * 0', // Sundays at 3 AM
      () => this.runFullRescan(),
      null,
      true
    );
    
    this.jobs.push(dailyJob, weeklyJob);
    
    console.log(`Scheduler started with ${this.jobs.length} jobs`);
    console.log(`Daily job schedule: ${this.defaultCron}`);
    console.log('Weekly job schedule: Sundays at 3 AM');
  }

  /**
   * Stop all scheduled jobs
   */
  stop(): void {
    this.jobs.forEach(job => job.stop());
    this.jobs = [];
    console.log('Scheduler stopped');
  }

  /**
   * Run incremental scrape (daily)
   */
  private async runIncrementalScrape(): Promise<void> {
    console.log('Running incremental scrape...');
    
    try {
      // Run scrapers for all sources
      const scrapers = [
        new ETaxScraper(),
        new CustomsScraper(),
        new MorScraper(),
        new CustomsCommissionScraper(),
        new NbeScraper(),
        new TradeScraper(),
        new OpenDataScraper()
      ];
      
      for (const scraper of scrapers) {
        try {
          await scraper.scrape();
        } catch (error) {
          console.error(`Error scraping ${scraper.constructor.name}:`, error);
        }
      }
      
      // Process the scraped data
      const processor = new DataProcessor();
      await processor.processAllModules();
      
      // Package training data
      const packager = new TrainingDataPackager();
      await packager.packageAllModules();
      
      // Generate embeddings
      const vectorDB = new VectorDB();
      // In a real implementation, we would generate embeddings for all processed modules
      
      console.log('Incremental scrape completed successfully');
    } catch (error) {
      console.error('Error during incremental scrape:', error);
    }
  }

  /**
   * Run full rescan (weekly)
   */
  private async runFullRescan(): Promise<void> {
    console.log('Running full rescan...');
    
    try {
      // Run scrapers for all sources
      const scrapers = [
        new ETaxScraper(),
        new CustomsScraper(),
        new MorScraper(),
        new CustomsCommissionScraper(),
        new NbeScraper(),
        new TradeScraper(),
        new OpenDataScraper()
      ];
      
      for (const scraper of scrapers) {
        try {
          await scraper.scrape();
        } catch (error) {
          console.error(`Error scraping ${scraper.constructor.name}:`, error);
        }
      }
      
      // Process the scraped data
      const processor = new DataProcessor();
      await processor.processAllModules();
      
      // Package training data
      const packager = new TrainingDataPackager();
      await packager.packageAllModules();
      
      // Generate embeddings
      const vectorDB = new VectorDB();
      // In a real implementation, we would generate embeddings for all processed modules
      
      console.log('Full rescan completed successfully');
    } catch (error) {
      console.error('Error during full rescan:', error);
    }
  }

  /**
   * Run manual scrape for a specific source
   */
  async runManualScrape(source: string): Promise<void> {
    console.log(`Running manual scrape for ${source}...`);
    
    try {
      let scraper;
      
      switch (source.toLowerCase()) {
        case 'etax':
          scraper = new ETaxScraper();
          break;
        case 'customs':
          scraper = new CustomsScraper();
          break;
        case 'mor':
          scraper = new MorScraper();
          break;
        case 'customs-commission':
          scraper = new CustomsCommissionScraper();
          break;
        case 'nbe':
          scraper = new NbeScraper();
          break;
        case 'trade':
          scraper = new TradeScraper();
          break;
        case 'open-data':
          scraper = new OpenDataScraper();
          break;
        default:
          throw new Error(`Unknown scraper source: ${source}`);
      }
      
      await scraper.scrape();
      
      // Process the scraped data
      const processor = new DataProcessor();
      await processor.processAllModules();
      
      console.log(`Manual scrape for ${source} completed successfully`);
    } catch (error) {
      console.error(`Error during manual scrape for ${source}:`, error);
      throw error;
    }
  }
}