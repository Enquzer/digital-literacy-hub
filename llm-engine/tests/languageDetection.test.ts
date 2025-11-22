import { franc } from 'franc';
import { BaseScraper } from '../scrapers/BaseScraper';

// Simple test function
function expect(actual: any, expected: any, message: string) {
  if (actual !== expected) {
    throw new Error(`Assertion failed: ${message}. Expected ${expected}, got ${actual}`);
  }
}

// Mock the fs module to avoid file system operations
const mockFs = {
  readFileSync: () => '{}',
  writeFileSync: () => {},
  existsSync: () => true,
  mkdirSync: () => {}
};

// Mock the path module
const mockPath = {
  join: (...paths: string[]) => paths.join('/'),
  resolve: (...paths: string[]) => paths.join('/')
};

// Test language detection
function testLanguageDetection() {
  console.log('Testing language detection...');
  
  // Test English text
  const englishText = 'This is a sample English text for testing language detection.';
  const detectedEnglish = franc(englishText, { minLength: 3 });
  expect(detectedEnglish, 'eng', 'English detection');
  console.log('✓ English detection works correctly');
  
  // Test Amharic text
  const amharicText = 'ይህ የቋንቋ መለያ ለመፈተሽ የተቀረጹ ናቸው።';
  const detectedAmharic = franc(amharicText, { minLength: 3 });
  expect(detectedAmharic, 'amh', 'Amharic detection');
  console.log('✓ Amharic detection works correctly');
  
  console.log('All language detection tests passed!');
}

// Test BaseScraper language detection method
function testBaseScraperLanguageDetection() {
  console.log('Testing BaseScraper language detection method...');
  
  // Create a mock scraper instance
  class MockScraper extends BaseScraper {
    constructor() {
      super('https://test.gov.et', 'test');
    }
    
    async scrape(): Promise<any[]> {
      return [];
    }
  }
  
  const scraper = new MockScraper();
  
  // Test English text
  const englishText = 'This is a sample English text for testing language detection.';
  const englishLanguage = scraper['detectLanguage'](englishText);
  expect(englishLanguage, 'en', 'BaseScraper English detection');
  console.log('✓ BaseScraper correctly detects English');
  
  // Test Amharic text
  const amharicText = 'ይህ የቋንቋ መለያ ለመፈተሽ የተቀረጹ ናቸው።';
  const amharicLanguage = scraper['detectLanguage'](amharicText);
  expect(amharicLanguage, 'am', 'BaseScraper Amharic detection');
  console.log('✓ BaseScraper correctly detects Amharic');
  
  console.log('All BaseScraper language detection tests passed!');
}

// Run tests
try {
  testLanguageDetection();
  testBaseScraperLanguageDetection();
  console.log('All tests passed successfully!');
} catch (error: any) {
  console.error('Test failed:', error.message);
  process.exit(1);
}