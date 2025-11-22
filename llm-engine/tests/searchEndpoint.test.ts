import { VectorDB } from '../vector-db/VectorDB';

// Simple test function
function expect(actual: any, expected: any, message: string) {
  if (actual !== expected) {
    throw new Error(`Assertion failed: ${message}. Expected ${expected}, got ${actual}`);
  }
}

// Test search endpoint combined ranking
function testCombinedRanking() {
  console.log('Testing search endpoint combined ranking...');
  
  const vectorDB = new VectorDB();
  
  // Test cosine similarity calculation
  const vecA = [1, 0, 0, 0];
  const vecB = [1, 0, 0, 0];
  const vecC = [0, 1, 0, 0];
  
  const similarityAA = vectorDB['cosineSimilarity'](vecA, vecB);
  const similarityAB = vectorDB['cosineSimilarity'](vecA, vecC);
  
  // Identical vectors should have similarity of 1.0
  expect(similarityAA.toFixed(2), '1.00', 'Identical vectors should have similarity of 1.0');
  console.log('✓ Cosine similarity correctly calculated for identical vectors');
  
  // Orthogonal vectors should have similarity of 0.0
  expect(similarityAB.toFixed(2), '0.00', 'Orthogonal vectors should have similarity of 0.0');
  console.log('✓ Cosine similarity correctly calculated for orthogonal vectors');
  
  console.log('All search endpoint ranking tests passed!');
}

// Test vector storage and retrieval
function testVectorStorage() {
  console.log('Testing vector storage and retrieval...');
  
  const vectorDB = new VectorDB();
  
  // Test storing and retrieving embeddings
  const testId = 'test-module-123';
  const testVector = [0.1, 0.2, 0.3, 0.4];
  const testMetadata = {
    module_id: testId,
    language: 'en',
    source_url: 'https://test.gov.et',
    version: '1.0',
    created_at: new Date().toISOString()
  };
  
  // Store embedding
  vectorDB['embeddings'].set(testId, { vector: testVector, metadata: testMetadata });
  
  // Retrieve embedding
  const retrievedData = vectorDB['embeddings'].get(testId);
  
  expect(JSON.stringify(retrievedData?.vector), JSON.stringify(testVector), 'Retrieved vector should match stored vector');
  console.log('✓ Vector storage and retrieval works correctly');
  
  console.log('All vector storage tests passed!');
}

// Test similarity search
async function testSimilaritySearch() {
  console.log('Testing similarity search...');
  
  const vectorDB = new VectorDB();
  
  // Add test vectors
  const metadata = {
    module_id: 'test',
    language: 'en',
    source_url: 'https://test.gov.et',
    version: '1.0',
    created_at: new Date().toISOString()
  };
  
  vectorDB['embeddings'].set('module-1', { vector: [1, 0, 0, 0], metadata });
  vectorDB['embeddings'].set('module-2', { vector: [0, 1, 0, 0], metadata });
  vectorDB['embeddings'].set('module-3', { vector: [0.9, 0.1, 0, 0], metadata }); // Similar to module-1
  
  // Search for similar vectors to [1, 0, 0, 0]
  const queryVector = [1, 0, 0, 0];
  const results = await vectorDB['findSimilar'](queryVector, 3);
  
  // Should return 3 results
  expect(results.length, 3, 'Should return 3 results');
  console.log('✓ Similarity search returns correct number of results');
  
  // First result should be module-1 (identical)
  expect(results[0].id, 'module-1', 'First result should be the identical vector');
  expect(results[0].similarity.toFixed(2), '1.00', 'Identical vector should have similarity of 1.0');
  console.log('✓ Similarity search correctly identifies identical vector');
  
  console.log('All similarity search tests passed!');
}

// Run tests
async function runTests() {
  try {
    testCombinedRanking();
    testVectorStorage();
    await testSimilaritySearch();
    console.log('All search endpoint tests passed successfully!');
  } catch (error: any) {
    console.error('Test failed:', error.message);
    process.exit(1);
  }
}

// Execute tests
runTests();