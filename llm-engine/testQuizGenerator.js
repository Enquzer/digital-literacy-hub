// Test the QuizGenerator implementation
const fs = require('fs');
const path = require('path');

// Simple test module data
const testModule = {
  id: "test-module-001",
  title: "VAT Filing Process",
  category: "Tax",
  topic: "VAT Filing",
  sector: "Manufacturing",
  steps: [
    { en: "Register for e-Tax account at etrax.mor.gov.et" },
    { en: "Gather required documents: Business license, TIN, financial statements" },
    { en: "Login to e-Tax portal" },
    { en: "Navigate to VAT filing section" },
    { en: "Enter sales and purchase data" }
  ],
  requirements: [
    "Valid TIN (Tax Identification Number)",
    "Business registration certificate",
    "Bank account for digital payments"
  ],
  validation: [
    "Verify TIN against business registration",
    "Check calculation accuracy"
  ]
};

async function testQuizGenerator() {
  console.log('Testing QuizGenerator implementation...');
  
  try {
    // Dynamically import the QuizGenerator
    const { QuizGenerator } = await import('./QuizGenerator.js');
    
    console.log('QuizGenerator imported successfully');
    
    // Generate a quiz
    console.log('Generating quiz...');
    const quiz = await QuizGenerator.generateQuiz(testModule);
    
    console.log('Quiz generated successfully:');
    console.log(JSON.stringify(quiz, null, 2));
    
    // Save the quiz
    console.log('Saving quiz...');
    await QuizGenerator.saveQuiz(quiz);
    
    console.log('Quiz saved successfully');
    
    // Load the quiz
    console.log('Loading quiz...');
    const loadedQuiz = await QuizGenerator.loadQuiz(quiz.id);
    
    if (loadedQuiz) {
      console.log('Quiz loaded successfully:');
      console.log(`Quiz ID: ${loadedQuiz.id}`);
      console.log(`Module ID: ${loadedQuiz.module_id}`);
      console.log(`Title: ${loadedQuiz.title}`);
      console.log(`Number of questions: ${loadedQuiz.questions.length}`);
      
      // Display first question as example
      if (loadedQuiz.questions.length > 0) {
        const firstQuestion = loadedQuiz.questions[0];
        console.log('\nFirst question:');
        console.log(`Question: ${firstQuestion.question}`);
        console.log(`Options: ${firstQuestion.options.join(', ')}`);
        console.log(`Correct answer index: ${firstQuestion.correct_answer}`);
        console.log(`Explanation: ${firstQuestion.explanation}`);
        console.log(`Difficulty: ${firstQuestion.difficulty}`);
        console.log(`Category: ${firstQuestion.category}`);
      }
    } else {
      console.log('Failed to load quiz');
    }
    
    console.log('\nQuizGenerator test completed successfully!');
  } catch (error) {
    console.error('Error testing QuizGenerator:', error);
  }
}

testQuizGenerator();