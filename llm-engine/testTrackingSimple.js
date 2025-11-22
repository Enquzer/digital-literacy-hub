// Simple test for Learner Tracking concept
console.log('Testing Learner Tracking concept...');

// Mock data structures
let mockLearningProgress = [];
let mockAssessmentResults = [];

// Mock UUID generator
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Learning Progress Functions
function createLearningProgress(progress) {
  const newProgress = {
    id: generateUUID(),
    ...progress,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  mockLearningProgress.push(newProgress);
  return newProgress;
}

function getLearningProgressByUser(userId) {
  return mockLearningProgress.filter(progress => progress.user_id === userId);
}

function updateLearningProgress(id, updates) {
  const index = mockLearningProgress.findIndex(progress => progress.id === id);
  if (index !== -1) {
    mockLearningProgress[index] = {
      ...mockLearningProgress[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    return mockLearningProgress[index];
  }
  return null;
}

// Assessment Results Functions
function createAssessmentResult(result) {
  const newResult = {
    id: generateUUID(),
    ...result,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  mockAssessmentResults.push(newResult);
  return newResult;
}

function getAssessmentResultsByUser(userId) {
  return mockAssessmentResults.filter(result => result.user_id === userId);
}

// Analytics Functions
function getUserProgressStats(userId) {
  const userProgress = getLearningProgressByUser(userId);
  
  const totalModules = userProgress.length;
  const completedModules = userProgress.filter(p => p.status === 'completed').length;
  const inProgressModules = userProgress.filter(p => p.status === 'in_progress').length;
  
  const totalTimeSpent = userProgress.reduce((total, progress) => total + (progress.time_spent_seconds || 0), 0);
  
  return {
    totalModules,
    completedModules,
    inProgressModules,
    completionRate: totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0,
    totalTimeSpent
  };
}

// Run the test
console.log('Creating learning progress...');
const progress1 = createLearningProgress({
  user_id: 'user-001',
  module_id: 'module-etax-001',
  status: 'in_progress',
  progress_percentage: 25,
  time_spent_seconds: 300
});

const progress2 = createLearningProgress({
  user_id: 'user-001',
  module_id: 'module-customs-001',
  status: 'completed',
  progress_percentage: 100,
  time_spent_seconds: 800
});

console.log('Created progress records:', progress1.id, progress2.id);

console.log('Fetching learning progress by user...');
const userProgress = getLearningProgressByUser('user-001');
console.log('User progress records:', userProgress.length);

console.log('Updating learning progress...');
const updatedProgress = updateLearningProgress(progress1.id, {
  status: 'completed',
  progress_percentage: 100,
  time_spent_seconds: 600
});
console.log('Updated progress:', updatedProgress.id);

console.log('Creating assessment results...');
const result1 = createAssessmentResult({
  user_id: 'user-001',
  module_id: 'module-etax-001',
  quiz_id: 'quiz-etax-001',
  score: 85,
  total_questions: 10,
  correct_answers: 8
});

const result2 = createAssessmentResult({
  user_id: 'user-001',
  module_id: 'module-customs-001',
  quiz_id: 'quiz-customs-001',
  score: 92,
  total_questions: 12,
  correct_answers: 11
});

console.log('Created assessment results:', result1.id, result2.id);

console.log('Fetching user progress stats...');
const userStats = getUserProgressStats('user-001');
console.log('User stats:', userStats);

console.log('Learner Tracking concept test completed successfully!');