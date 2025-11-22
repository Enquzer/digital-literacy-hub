// LLM Engine Main Entry Point

// Export scrapers
export { BaseScraper } from './scrapers/BaseScraper';
export { ETaxScraper } from './scrapers/ETaxScraper';
export { CustomsScraper } from './scrapers/CustomsScraper';
export { MorScraper } from './scrapers/MorScraper';
export { CustomsCommissionScraper } from './scrapers/CustomsCommissionScraper';
export { NbeScraper } from './scrapers/NbeScraper';
export { TradeScraper } from './scrapers/TradeScraper';
export { OpenDataScraper } from './scrapers/OpenDataScraper';

// Export processors
export { DataProcessor } from './processors/DataProcessor';
export { TrainingDataPackager } from './processors/TrainingDataPackager';
export { ChangeDetector } from './processors/ChangeDetector';
export { Scheduler } from './processors/Scheduler';

// Export vector database
export { VectorDB } from './vector-db/VectorDB';

// Export schemas
export type { KnowledgeModule } from './schemas/knowledgeModule.schema';
export type { Step } from './schemas/knowledgeModule.schema';
export type { Workflow } from './schemas/knowledgeModule.schema';
export type { FAQ } from './schemas/knowledgeModule.schema';
export type { Example } from './schemas/knowledgeModule.schema';
export type { GeneratedAssets } from './schemas/knowledgeModule.schema';

// Export API server application
import express from 'express';
export const serverApp: express.Application = require('./api/server').app || require('./api/server');

console.log('LLM Engine initialized');