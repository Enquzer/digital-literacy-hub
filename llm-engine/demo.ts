/**
 * Demo script to show the Digital Literacy Hub LLM Knowledge Base Builder in action
 */

import { ETaxScraper } from './scrapers/ETaxScraper';
import { CustomsScraper } from './scrapers/CustomsScraper';
import { DataProcessor } from './processors/DataProcessor';
import { TrainingDataPackager } from './processors/TrainingDataPackager';
import { ChangeDetector } from './processors/ChangeDetector';
import { VectorDB } from './vector-db/VectorDB';

async function runDemo() {
  console.log('='.repeat(60));
  console.log('Digital Literacy Hub LLM Knowledge Base Builder - DEMO');
  console.log('='.repeat(60));
  
  try {
    // Step 1: Scrape government data sources
    console.log('\n1. Scraping Government Data Sources...');
    console.log('-'.repeat(40));
    
    const eTaxScraper = new ETaxScraper();
    const eTaxModules = await eTaxScraper.scrape();
    console.log(`✓ Scraped ${eTaxModules.length} e-Tax modules`);
    
    const customsScraper = new CustomsScraper();
    const customsModules = await customsScraper.scrape();
    console.log(`✓ Scraped ${customsModules.length} Customs modules`);
    
    // Step 2: Detect changes
    console.log('\n2. Detecting Content Changes...');
    console.log('-'.repeat(40));
    
    const changeDetector = new ChangeDetector();
    const changes = await changeDetector.detectChanges();
    console.log(`✓ Detected ${changes.added} new modules`);
    console.log(`✓ Detected ${changes.updated} updated modules`);
    console.log(`✓ Detected ${changes.removed} removed modules`);
    
    // Step 3: Process data
    console.log('\n3. Processing Data...');
    console.log('-'.repeat(40));
    
    const processor = new DataProcessor();
    await processor.processAllModules();
    console.log('✓ Processed all modules into training-ready format');
    
    // Step 4: Package training data
    console.log('\n4. Packaging Training Data...');
    console.log('-'.repeat(40));
    
    const packager = new TrainingDataPackager();
    await packager.packageAllModules();
    console.log('✓ Packaged data for LLM training');
    
    // Step 5: Demonstrate vector database
    console.log('\n5. Vector Database Demo...');
    console.log('-'.repeat(40));
    
    const vectorDB = new VectorDB();
    const sampleText = "How to file VAT returns in Ethiopia";
    const vector = await vectorDB.generateEmbeddings(sampleText);
    await vectorDB.storeEmbeddings("sample-vat-query", vector, {
      module_id: "sample",
      language: "en",
      source_url: "",
      version: "1.0",
      created_at: new Date().toISOString()
    });
    
    const similar = await vectorDB.findSimilar(vector, 3);
    console.log(`✓ Generated embeddings for: "${sampleText}"`);
    console.log(`✓ Found ${similar.length} similar items in vector database`);
    
    // Step 6: Show file structure
    console.log('\n6. Generated Files...');
    console.log('-'.repeat(40));
    
    console.log('✓ cache/module-etax.json - Raw scraped e-Tax data');
    console.log('✓ cache/module-customs.json - Raw scraped Customs data');
    console.log('✓ processed/module-etax-processed.json - Processed e-Tax data');
    console.log('✓ processed/module-customs-processed.json - Processed Customs data');
    console.log('✓ training-data/qa-training-data.json - Q&A format for fine-tuning');
    console.log('✓ training-data/instruction-training-data.json - Instruction format');
    console.log('✓ training-data/embedding-training-data.json - Embedding format');
    console.log('✓ history/checksums.json - Change detection metadata');
    
    console.log('\n' + '='.repeat(60));
    console.log('DEMO COMPLETED SUCCESSFULLY!');
    console.log('The LLM Knowledge Base Builder is ready for production use.');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('Error during demo:', error);
  }
}

// Run the demo
runDemo();