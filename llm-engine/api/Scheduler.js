"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scheduler = void 0;
const cron_1 = require("cron");
const ETaxScraper_1 = require("./scrapers/ETaxScraper");
const CustomsScraper_1 = require("./scrapers/CustomsScraper");
const MorScraper_1 = require("./scrapers/MorScraper");
const CustomsCommissionScraper_1 = require("./scrapers/CustomsCommissionScraper");
const NbeScraper_1 = require("./scrapers/NbeScraper");
const TradeScraper_1 = require("./scrapers/TradeScraper");
const OpenDataScraper_1 = require("./scrapers/OpenDataScraper");
const DataProcessor_1 = require("./processors/DataProcessor");
const database_1 = require("./api/database");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class Scheduler {
    constructor() {
        this.jobs = [];
        this.isRunning = false;
        // Initialize scrapers
        this.initializeScrapers();
    }
    initializeScrapers() {
        console.log('Initializing scrapers...');
    }
    // Schedule periodic scraping jobs
    startScheduledJobs() {
        if (this.isRunning) {
            console.log('Scheduler is already running');
            return;
        }
        this.isRunning = true;
        console.log('Starting scheduled scraping jobs...');
        // Schedule ETax scraping every 6 hours
        const etaxJob = new cron_1.CronJob('0 0 */6 * * *', async () => {
            console.log('Running ETax scraping job...');
            await this.runScraperJob('etax', async () => {
                const scraper = new ETaxScraper_1.ETaxScraper();
                return await scraper.scrape();
            });
        });
        // Schedule Customs scraping every 6 hours
        const customsJob = new cron_1.CronJob('0 0 */6 * * *', async () => {
            console.log('Running Customs scraping job...');
            await this.runScraperJob('customs', async () => {
                const scraper = new CustomsScraper_1.CustomsScraper();
                return await scraper.scrape();
            });
        });
        // Schedule MOR scraping every 12 hours
        const morJob = new cron_1.CronJob('0 0 */12 * * *', async () => {
            console.log('Running MOR scraping job...');
            await this.runScraperJob('mor', async () => {
                const scraper = new MorScraper_1.MorScraper();
                return await scraper.scrape();
            });
        });
        // Schedule Customs Commission scraping every 12 hours
        const customsCommissionJob = new cron_1.CronJob('0 0 */12 * * *', async () => {
            console.log('Running Customs Commission scraping job...');
            await this.runScraperJob('customs-commission', async () => {
                const scraper = new CustomsCommissionScraper_1.CustomsCommissionScraper();
                return await scraper.scrape();
            });
        });
        // Schedule NBE scraping every 24 hours
        const nbeJob = new cron_1.CronJob('0 0 0 * * *', async () => {
            console.log('Running NBE scraping job...');
            await this.runScraperJob('nbe', async () => {
                const scraper = new NbeScraper_1.NbeScraper();
                return await scraper.scrape();
            });
        });
        // Schedule Trade scraping every 24 hours
        const tradeJob = new cron_1.CronJob('0 0 0 * * *', async () => {
            console.log('Running Trade scraping job...');
            await this.runScraperJob('trade', async () => {
                const scraper = new TradeScraper_1.TradeScraper();
                return await scraper.scrape();
            });
        });
        // Schedule Open Data scraping every 24 hours
        const openDataJob = new cron_1.CronJob('0 0 0 * * *', async () => {
            console.log('Running Open Data scraping job...');
            await this.runScraperJob('open-data', async () => {
                const scraper = new OpenDataScraper_1.OpenDataScraper();
                return await scraper.scrape();
            });
        });
        // Schedule full processing job every 6 hours
        const processingJob = new cron_1.CronJob('0 30 */6 * * *', async () => {
            console.log('Running data processing job...');
            await this.runProcessingJob();
        });
        // Start all jobs
        etaxJob.start();
        customsJob.start();
        morJob.start();
        customsCommissionJob.start();
        nbeJob.start();
        tradeJob.start();
        openDataJob.start();
        processingJob.start();
        this.jobs = [
            etaxJob,
            customsJob,
            morJob,
            customsCommissionJob,
            nbeJob,
            tradeJob,
            openDataJob,
            processingJob
        ];
        console.log('All scheduled jobs started successfully');
    }
    // Run a single scraper job
    async runScraperJob(name, scraperFunction) {
        try {
            console.log(`Starting ${name} scraping job...`);
            // Run the scraper
            const data = await scraperFunction();
            if (data && data.length > 0) {
                // Save to cache
                const cacheDir = path.join(__dirname, 'cache');
                if (!fs.existsSync(cacheDir)) {
                    fs.mkdirSync(cacheDir, { recursive: true });
                }
                const filePath = path.join(cacheDir, `module-${name}.json`);
                fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
                console.log(`Saved ${data.length} modules to ${filePath}`);
                // Log success
                this.logScrapingResult(name, 'success', `Successfully scraped ${data.length} modules`);
            }
            else {
                console.log(`No data returned from ${name} scraper`);
                this.logScrapingResult(name, 'warning', 'No data returned from scraper');
            }
        }
        catch (error) {
            console.error(`Error in ${name} scraping job:`, error);
            this.logScrapingResult(name, 'error', `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    // Run the data processing job
    async runProcessingJob() {
        try {
            console.log('Starting data processing job...');
            // Process data
            const processor = new DataProcessor_1.DataProcessor();
            await processor.processAllModules();
            // Generate training data
            try {
                const { TrainingDataPackager } = await Promise.resolve().then(() => __importStar(require('./processors/TrainingDataPackager')));
                const packager = new TrainingDataPackager();
                await packager.packageAllModules();
            }
            catch (importError) {
                console.error('Error importing TrainingDataPackager:', importError);
            }
            // Save processed modules to database
            const processedDir = path.join(__dirname, 'processed');
            if (fs.existsSync(processedDir)) {
                const files = fs.readdirSync(processedDir);
                const jsonFiles = files.filter(file => file.endsWith('-processed.json'));
                let savedModules = 0;
                for (const file of jsonFiles) {
                    const filePath = path.join(processedDir, file);
                    const rawData = fs.readFileSync(filePath, 'utf-8');
                    const modules = JSON.parse(rawData);
                    // Save each module to database
                    for (const module of modules) {
                        try {
                            await (0, database_1.saveModule)(module);
                            savedModules++;
                        }
                        catch (saveError) {
                            console.error(`Error saving module ${module.id}:`, saveError);
                        }
                    }
                }
                console.log(`Data processing job completed. Saved ${savedModules} modules to database.`);
                this.logScrapingResult('processing', 'success', `Successfully processed and saved ${savedModules} modules`);
            }
            else {
                console.log('No processed directory found');
                this.logScrapingResult('processing', 'warning', 'No processed directory found');
            }
        }
        catch (error) {
            console.error('Error in data processing job:', error);
            this.logScrapingResult('processing', 'error', `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    // Log scraping results
    logScrapingResult(source, status, message) {
        const logEntry = {
            id: `${source}-${Date.now()}`,
            source_url: this.getSourceUrl(source),
            status,
            message,
            timestamp: new Date().toISOString()
        };
        // In a real implementation, we would save this to a database
        // For now, we'll just log it
        console.log('Scraping log entry:', logEntry);
    }
    // Get source URL for logging
    getSourceUrl(source) {
        const urls = {
            'etax': 'https://etrax.mor.gov.et',
            'customs': 'https://customs.gov.et',
            'mor': 'https://mor.gov.et',
            'customs-commission': 'https://ecc.gov.et',
            'nbe': 'https://nbe.gov.et',
            'trade': 'https://trade.gov.et',
            'open-data': 'https://opendata.gov.et',
            'processing': 'internal-processing'
        };
        return urls[source] || 'unknown';
    }
    // Stop all scheduled jobs
    stopScheduledJobs() {
        console.log('Stopping scheduled jobs...');
        this.jobs.forEach(job => job.stop());
        this.jobs = [];
        this.isRunning = false;
        console.log('All scheduled jobs stopped');
    }
    // Run all scrapers immediately (for manual updates)
    async runAllScrapers() {
        console.log('Running all scrapers immediately...');
        const scrapers = [
            { name: 'etax', scraper: new ETaxScraper_1.ETaxScraper() },
            { name: 'customs', scraper: new CustomsScraper_1.CustomsScraper() },
            { name: 'mor', scraper: new MorScraper_1.MorScraper() },
            { name: 'customs-commission', scraper: new CustomsCommissionScraper_1.CustomsCommissionScraper() },
            { name: 'nbe', scraper: new NbeScraper_1.NbeScraper() },
            { name: 'trade', scraper: new TradeScraper_1.TradeScraper() },
            { name: 'open-data', scraper: new OpenDataScraper_1.OpenDataScraper() }
        ];
        const results = [];
        for (const { name, scraper } of scrapers) {
            try {
                console.log(`Running ${name} scraper...`);
                const data = await scraper.scrape();
                results.push({ name, data, success: true });
                // Save to cache
                if (data && data.length > 0) {
                    const cacheDir = path.join(__dirname, 'cache');
                    if (!fs.existsSync(cacheDir)) {
                        fs.mkdirSync(cacheDir, { recursive: true });
                    }
                    const filePath = path.join(cacheDir, `module-${name}.json`);
                    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
                    console.log(`Saved ${data.length} modules to ${filePath}`);
                }
            }
            catch (error) {
                console.error(`Error running ${name} scraper:`, error);
                results.push({ name, data: [], success: false, error });
            }
        }
        // Process all data
        await this.runProcessingJob();
        return results;
    }
}
exports.Scheduler = Scheduler;
