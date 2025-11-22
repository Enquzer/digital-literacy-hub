import * as fs from 'fs';
import * as path from 'path';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

interface Quiz {
  id: string;
  module_id: string;
  title: string;
  questions: QuizQuestion[];
  created_at: string;
  version: string;
}

export class QuizGenerator {
  /**
   * Generate a comprehensive quiz for a module with quality control
   */
  public static async generateQuiz(module: any): Promise<Quiz> {
    const moduleId = module.id;
    const quizId = `quiz_${moduleId}_${Date.now()}`;
    
    // Generate different types of questions
    const questions: QuizQuestion[] = [];
    
    // 1. Knowledge-based questions (easy)
    questions.push(...this.generateKnowledgeQuestions(module));
    
    // 2. Comprehension questions (medium)
    questions.push(...this.generateComprehensionQuestions(module));
    
    // 3. Application questions (hard)
    questions.push(...this.generateApplicationQuestions(module));
    
    // 4. Validation/error identification questions (medium)
    questions.push(...this.generateValidationQuestions(module));
    
    // 5. Requirement questions (easy-medium)
    questions.push(...this.generateRequirementQuestions(module));
    
    // Add IDs and ensure proper structure
    const formattedQuestions = questions.map((q, index) => ({
      ...q,
      id: index + 1
    }));
    
    // Quality control checks
    const validatedQuestions = this.qualityControl(formattedQuestions);
    
    return {
      id: quizId,
      module_id: moduleId,
      title: `Quiz: ${module.title}`,
      questions: validatedQuestions,
      created_at: new Date().toISOString(),
      version: '1.0'
    };
  }
  
  /**
   * Generate knowledge-based questions (facts from the module)
   */
  private static generateKnowledgeQuestions(module: any): QuizQuestion[] {
    const questions: QuizQuestion[] = [];
    
    // Question about module category
    questions.push({
      id: 0, // Will be reassigned later
      question: `What category does the "${module.title}" module belong to?`,
      options: [
        module.category,
        this.generateDistractor(module.category),
        this.generateDistractor(module.category),
        "None of the above"
      ],
      correct_answer: 0,
      explanation: `The ${module.title} module is categorized under ${module.category}.`,
      difficulty: 'easy',
      category: 'knowledge'
    });
    
    // Question about module topic
    if (module.topic) {
      questions.push({
        id: 0, // Will be reassigned later
        question: `What is the main topic of the "${module.title}" module?`,
        options: [
          module.topic,
          this.generateDistractor(module.topic),
          this.generateDistractor(module.topic),
          "General information"
        ],
        correct_answer: 0,
        explanation: `The main topic of this module is ${module.topic}.`,
        difficulty: 'easy',
        category: 'knowledge'
      });
    }
    
    // Question about module sector
    if (module.sector) {
      questions.push({
        id: 0, // Will be reassigned later
        question: `Which sector is the "${module.title}" module primarily designed for?`,
        options: [
          module.sector,
          this.generateDistractor(module.sector),
          this.generateDistractor(module.sector),
          "All sectors"
        ],
        correct_answer: 0,
        explanation: `This module is primarily designed for the ${module.sector} sector.`,
        difficulty: 'easy',
        category: 'knowledge'
      });
    }
    
    return questions;
  }
  
  /**
   * Generate comprehension questions (understanding of processes)
   */
  private static generateComprehensionQuestions(module: any): QuizQuestion[] {
    const questions: QuizQuestion[] = [];
    
    // Questions about steps in the process
    if (module.steps && module.steps.length > 0) {
      // Question about the first step
      const firstStep = module.steps[0]?.en || module.steps[0];
      questions.push({
        id: 0, // Will be reassigned later
        question: `What is the first step in the ${module.title} process?`,
        options: [
          firstStep,
          module.steps[1]?.en || module.steps[1] || this.generateDistractor(firstStep),
          this.generateDistractor(firstStep),
          "Review documentation"
        ],
        correct_answer: 0,
        explanation: `The first step in this process is: ${firstStep}`,
        difficulty: 'medium',
        category: 'comprehension'
      });
      
      // Question about a middle step (if there are enough steps)
      if (module.steps.length > 2) {
        const middleIndex = Math.floor(module.steps.length / 2);
        const middleStep = module.steps[middleIndex]?.en || module.steps[middleIndex];
        questions.push({
          id: 0, // Will be reassigned later
          question: `Which step comes after preparing initial documentation in the ${module.title} process?`,
          options: [
            middleStep,
            module.steps[middleIndex - 1]?.en || module.steps[middleIndex - 1] || this.generateDistractor(middleStep),
            this.generateDistractor(middleStep),
            "Final submission"
          ],
        correct_answer: 0,
        explanation: `After preparing initial documentation, the next step is: ${middleStep}`,
        difficulty: 'medium',
        category: 'comprehension'
      });
      }
    }
    
    return questions;
  }
  
  /**
   * Generate application questions (scenario-based)
   */
  private static generateApplicationQuestions(module: any): QuizQuestion[] {
    const questions: QuizQuestion[] = [];
    
    // Scenario-based question
    if (module.steps && module.steps.length > 0) {
      const firstStep = module.steps[0]?.en || module.steps[0];
      questions.push({
        id: 0, // Will be reassigned later
        question: `If you were starting the ${module.title} process today, what would be your first action?`,
        options: [
          `Begin by ${firstStep.toLowerCase()}`,
          "Review all requirements first",
          "Contact support for guidance",
          "Schedule a consultation"
        ],
        correct_answer: 0,
        explanation: `The correct first action is to ${firstStep.toLowerCase()}, as this is the initial step in the process.`,
        difficulty: 'hard',
        category: 'application'
      });
    }
    
    // Problem-solving question
    if (module.validation && module.validation.length > 0) {
      const validationStep = module.validation[0];
      questions.push({
        id: 0, // Will be reassigned later
        question: `During the ${module.title} process, you notice an error in your calculations. What should you do first?`,
        options: [
          validationStep,
          "Resubmit the entire form",
          "Ignore the error and continue",
          "Contact technical support"
        ],
        correct_answer: 0,
        explanation: `The first step should be to ${validationStep.toLowerCase()} to identify and correct the issue.`,
        difficulty: 'hard',
        category: 'application'
      });
    }
    
    return questions;
  }
  
  /**
   * Generate validation/error identification questions
   */
  private static generateValidationQuestions(module: any): QuizQuestion[] {
    const questions: QuizQuestion[] = [];
    
    if (module.validation && module.validation.length > 0) {
      const validationStep = module.validation[0];
      questions.push({
        id: 0, // Will be reassigned later
        question: `Which of the following is a key validation step in the ${module.title} process?`,
        options: [
          validationStep,
          this.generateDistractor(validationStep),
          this.generateDistractor(validationStep),
          "Submit without review"
        ],
        correct_answer: 0,
        explanation: `An important validation step is to ${validationStep.toLowerCase()} to ensure accuracy.`,
        difficulty: 'medium',
        category: 'validation'
      });
    }
    
    return questions;
  }
  
  /**
   * Generate requirement-based questions
   */
  private static generateRequirementQuestions(module: any): QuizQuestion[] {
    const questions: QuizQuestion[] = [];
    
    if (module.requirements && module.requirements.length > 0) {
      const requirement = module.requirements[0];
      questions.push({
        id: 0, // Will be reassigned later
        question: `Which of the following is a required document for the ${module.title} process?`,
        options: [
          requirement,
          this.generateDistractor(requirement),
          this.generateDistractor(requirement),
          "No documents required"
        ],
        correct_answer: 0,
        explanation: `${requirement} is one of the required documents for this process.`,
        difficulty: 'easy',
        category: 'requirements'
      });
    }
    
    return questions;
  }
  
  /**
   * Generate a distractor (incorrect answer option) based on the correct answer
   */
  private static generateDistractor(correctAnswer: string): string {
    const distractors = [
      "Financial documentation",
      "Business license",
      "Tax identification number",
      "Government approval",
      "Digital certificate",
      "Processing fee",
      "Submission form",
      "Verification code"
    ];
    
    // Filter out distractors that are too similar to the correct answer
    const filteredDistractors = distractors.filter(d => 
      !correctAnswer.toLowerCase().includes(d.toLowerCase()) && 
      !d.toLowerCase().includes(correctAnswer.toLowerCase())
    );
    
    // Return a random distractor or a generic one if none found
    return filteredDistractors.length > 0 
      ? filteredDistractors[Math.floor(Math.random() * filteredDistractors.length)]
      : "Administrative approval";
  }
  
  /**
   * Quality control for generated questions
   */
  private static qualityControl(questions: QuizQuestion[]): QuizQuestion[] {
    // Remove duplicate questions
    const uniqueQuestions = questions.filter((question, index, self) =>
      index === self.findIndex(q => q.question === question.question)
    );
    
    // Ensure each question has 4 options
    const validatedQuestions = uniqueQuestions.map(question => {
      if (question.options.length < 4) {
        // Add more options if needed
        while (question.options.length < 4) {
          question.options.push(this.generateDistractor(question.options[0]));
        }
      } else if (question.options.length > 4) {
        // Trim options if too many
        question.options = question.options.slice(0, 4);
      }
      
      // Ensure correct_answer index is valid
      if (question.correct_answer < 0 || question.correct_answer >= question.options.length) {
        question.correct_answer = 0;
      }
      
      return question;
    });
    
    // Limit to 10 questions maximum
    return validatedQuestions.slice(0, 10);
  }
  
  /**
   * Save quiz to file for persistence
   */
  public static async saveQuiz(quiz: Quiz): Promise<void> {
    try {
      const quizzesDir = path.join(__dirname, 'quizzes');
      if (!fs.existsSync(quizzesDir)) {
        fs.mkdirSync(quizzesDir, { recursive: true });
      }
      
      const filePath = path.join(quizzesDir, `${quiz.id}.json`);
      fs.writeFileSync(filePath, JSON.stringify(quiz, null, 2));
      console.log(`Quiz saved to ${filePath}`);
    } catch (error) {
      console.error('Error saving quiz:', error);
      throw error;
    }
  }
  
  /**
   * Load quiz from file
   */
  public static async loadQuiz(quizId: string): Promise<Quiz | null> {
    try {
      const filePath = path.join(__dirname, 'quizzes', `${quizId}.json`);
      if (!fs.existsSync(filePath)) {
        return null;
      }
      
      const rawData = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(rawData);
    } catch (error) {
      console.error('Error loading quiz:', error);
      return null;
    }
  }
}