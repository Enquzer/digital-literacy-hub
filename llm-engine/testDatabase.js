// Test database operations
const database = require('./api/database');

async function testDatabase() {
  console.log('Testing database operations with mock database...');
  
  // Test saving a sample module
  const sampleModule = {
    id: 'test-module-001',
    slug: 'test-module',
    title: 'Test Module',
    source_url: 'https://example.com/test',
    language: 'en',
    version: '1.0',
    status: 'published',
    metadata: {
      category: 'Test',
      tags: ['test', 'sample']
    },
    content: {
      title: 'Test Module',
      description: 'This is a test module',
      steps: [
        {
          en: 'Step 1: Do something',
          am: 'ደረጃ 1: አንድ ነገር ያድርጉ'
        }
      ]
    }
  };
  
  try {
    console.log('Saving test module...');
    await database.saveModule(sampleModule);
    console.log('Module saved successfully!');
    
    console.log('Retrieving modules...');
    const modules = await database.getModules();
    console.log(`Retrieved ${modules.length} modules`);
    
    if (modules.length > 0) {
      console.log('First module:', JSON.stringify(modules[0], null, 2));
    } else {
      console.log('No modules retrieved');
    }
  } catch (error) {
    console.error('Error testing module operations:', error);
  }
}

testDatabase().catch(console.error);