// Test the Learner Tracking implementation
const { createLearningProgress, getLearningProgressByUser, updateLearningProgress, createAssessmentResult, getUserProgressStats, getModuleAnalytics } = require('./api/database');

async function testLearnerTracking() {
  console.log('Testing Learner Tracking implementation...');
  
  try {
    // Test creating learning progress
    console.log('Creating learning progress...');
    const progress1 = await createLearningProgress({
      user_id: 'user-001',
      module_id: 'module-etax-001',
      status: 'in_progress',
      progress_percentage: 25,
      time_spent_seconds: 300
    });
    
    const progress2 = await createLearningProgress({
      user_id: 'user-001',
      module_id: 'module-customs-001',
      status: 'completed',
      progress_percentage: 100,
      time_spent_seconds: 800,
      completed_at: new Date().toISOString()
    });
    
    console.log('Created progress records:', progress1.id, progress2.id);
    
    // Test fetching learning progress by user
    console.log('Fetching learning progress by user...');
    const userProgress = await getLearningProgressByUser('user-001');
    console.log('User progress records:', userProgress.length);
    
    // Test updating learning progress
    console.log('Updating learning progress...');
    const updatedProgress = await updateLearningProgress(progress1.id, {
      status: 'completed',
      progress_percentage: 100,
      time_spent_seconds: 600,
      completed_at: new Date().toISOString()
    });
    console.log('Updated progress:', updatedProgress.id);
    
    // Test creating assessment results
    console.log('Creating assessment results...');
    const result1 = await createAssessmentResult({
      user_id: 'user-001',
      module_id: 'module-etax-001',
      quiz_id: 'quiz-etax-001',
      score: 85,
      total_questions: 10,
      correct_answers: 8
    });
    
    const result2 = await createAssessmentResult({
      user_id: 'user-001',
      module_id: 'module-customs-001',
      quiz_id: 'quiz-customs-001',
      score: 92,
      total_questions: 12,
      correct_answers: 11
    });
    
    console.log('Created assessment results:', result1.id, result2.id);
    
    // Test user progress stats
    console.log('Fetching user progress stats...');
    const userStats = await getUserProgressStats('user-001');
    console.log('User stats:', userStats);
    
    // Test module analytics
    console.log('Fetching module analytics...');
    const moduleAnalytics1 = await getModuleAnalytics('module-etax-001');
    const moduleAnalytics2 = await getModuleAnalytics('module-customs-001');
    console.log('Module etax analytics:', moduleAnalytics1);
    console.log('Module customs analytics:', moduleAnalytics2);
    
    console.log('Learner Tracking test completed successfully!');
  } catch (error) {
    console.error('Error in Learner Tracking test:', error);
  }
}

testLearnerTracking();