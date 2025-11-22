import { ChangeDetector } from '../processors/ChangeDetector';

// Mock the fs module to avoid file system operations
const mockFs = {
  readFileSync: () => '{}',
  writeFileSync: () => {},
  existsSync: () => true,
  mkdirSync: () => {},
  readdirSync: () => []
};

// Simple test function
function expect(actual: any, expected: any, message: string) {
  if (actual !== expected) {
    throw new Error(`Assertion failed: ${message}. Expected ${expected}, got ${actual}`);
  }
}

// Test ChangeDetector checksum logic
function testChecksumLogic() {
  console.log('Testing ChangeDetector checksum logic...');
  
  const changeDetector = new ChangeDetector();
  
  // Test identical content produces same checksum
  const content1 = 'This is test content';
  const content2 = 'This is test content';
  const checksum1 = changeDetector.computeChecksum(content1);
  const checksum2 = changeDetector.computeChecksum(content2);
  
  expect(checksum1, checksum2, 'Identical content should produce identical checksums');
  console.log('✓ Identical content produces identical checksums');
  
  // Test different content produces different checksums
  const content3 = 'This is different test content';
  const checksum3 = changeDetector.computeChecksum(content3);
  
  if (checksum1 === checksum3) {
    throw new Error('Different content should produce different checksums');
  }
  console.log('✓ Different content produces different checksums');
  
  console.log('All ChangeDetector checksum tests passed!');
}

// Test major change detection
function testMajorChangeDetection() {
  console.log('Testing major change detection...');
  
  const changeDetector = new ChangeDetector();
  
  // Test content length difference detection
  const oldModule = {
    source_body: 'A'.repeat(100),
    workflows: [{}, {}, {}] // 3 steps
  };
  
  const newModule = {
    source_body: 'A'.repeat(120), // 20% increase
    workflows: [{}, {}, {}] // 3 steps
  };
  
  // This should not be detected as major change (20% < 25%)
  const isMajorChange1 = changeDetector['detectMajorChange'](oldModule as any, newModule as any);
  expect(isMajorChange1, false, 'Small content change should not be major');
  console.log('✓ Small content change correctly not detected as major');
  
  // Test large content length difference detection
  const newModule2 = {
    source_body: 'A'.repeat(200), // 100% increase (major change)
    workflows: [{}, {}, {}] // 3 steps
  };
  
  // This should be detected as major change (100% > 15%)
  const isMajorChange2 = changeDetector['detectMajorChange'](oldModule as any, newModule2 as any);
  expect(isMajorChange2, true, 'Large content change should be major');
  console.log('✓ Large content change correctly detected as major');
  
  // Test workflow count change detection
  const newModule3 = {
    source_body: 'A'.repeat(100), // Same content
    workflows: [{}, {}, {}, {}] // 4 steps (changed from 3)
  };
  
  // This should be detected as major change (workflow count changed)
  const isMajorChange3 = changeDetector['detectMajorChange'](oldModule as any, newModule3 as any);
  expect(isMajorChange3, true, 'Workflow count change should be major');
  console.log('✓ Workflow count change correctly detected as major');
  
  console.log('All major change detection tests passed!');
}

// Run tests
try {
  testChecksumLogic();
  testMajorChangeDetection();
  console.log('All ChangeDetector tests passed successfully!');
} catch (error: any) {
  console.error('Test failed:', error.message);
  process.exit(1);
}