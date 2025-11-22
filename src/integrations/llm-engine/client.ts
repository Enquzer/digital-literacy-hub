import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Platform mapping
const platformMapping: Record<string, string> = {
  'E-Tax System': 'e_tax',
  'Customs & e-SW': 'customs',
  'Customs & e-SW System': 'customs',
  'Ethiopian Customs Commission': 'customs',
  'Ethiopian Customs & e-Single Window': 'customs',
  'Customs': 'customs',
  'e-Tax': 'e_tax'
};

// Course interface matching our LLM Knowledge Base structure
export interface LLMCourse {
  id: string;
  module: string;
  category: string;
  topic: string;
  sector: string;
  steps: Array<{
    en: string;
    am: string;
  }>;
  requirements: string[];
  validation: string[];
  language: 'en' | 'am';
  lastUpdated: string;
  source: string;
  version: string;
}

// Quiz question interface for multiple choice questions
export interface QuizQuestion {
  id: string;
  question_text: string;
  options: string[]; // Multiple choice options
  correct_answer_index: number; // Index of the correct answer in options array
  points: number;
  order_index: number;
  explanation?: string;
}

// Quiz interface
interface Quiz {
  id: string;
  module_id: string;
  title: string;
  questions: Array<{
    id: number;
    question: string;
    options: string[];
    correct_answer: number;
    explanation: string;
    difficulty: string;
    category: string;
  }>;
  created_at: string;
  version: string;
}

// API response interfaces
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Quiz evaluation result
export interface QuizEvaluation {
  score: number;
  passed: boolean;
  feedback: string;
  detailed_feedback: Array<{
    question_id: string;
    score: number;
    feedback: string;
  }>;
}

// Transform LLM course to frontend course format
export const transformLLMCourseToFrontend = (llmCourse: any) => {
  console.log('Transforming LLM course:', llmCourse);
  
  // Ensure we have required fields
  if (!llmCourse || !llmCourse.id) {
    console.warn('Invalid LLM course data:', llmCourse);
    return null;
  }
  
  const transformed = {
    id: llmCourse.id,
    title: llmCourse.topic || llmCourse.title || 'Untitled Course',
    description: llmCourse.description || `Learn about ${llmCourse.topic || llmCourse.title} in the ${llmCourse.module} system`,
    platform: platformMapping[llmCourse.module] || 'e_tax',
    thumbnail_url: llmCourse.thumbnail_url || null,
    duration_hours: llmCourse.duration_hours || Math.ceil((llmCourse.steps?.length || 0) * 0.5), // Estimate 30 mins per step
    content: llmCourse.source_body || llmCourse.content,
    steps: llmCourse.steps || [],
    requirements: llmCourse.requirements || [],
    validation: llmCourse.validation || [],
    sector: llmCourse.sector,
    language: llmCourse.language,
    source_url: llmCourse.source || llmCourse.source_url,
    last_updated: llmCourse.lastUpdated || llmCourse.updated_at,
    workflows: llmCourse.workflows || [],
    tags: llmCourse.tags || [],
    sector_tags: llmCourse.sector_tags || [],
    required_documents: llmCourse.required_documents || llmCourse.requirements || [],
    common_errors: llmCourse.common_errors || [],
    faqs: llmCourse.faqs || [],
    examples: llmCourse.examples || [],
    screenshots: llmCourse.screenshots || []
  };
  
  console.log('Transformed course:', transformed);
  return transformed;
};

// API functions
export const fetchLLMCourses = async (): Promise<any[]> => {
  try {
    const response: any = await apiClient.get('/llm/modules');
    const transformed = response.data.data.map(transformLLMCourseToFrontend);
    // Filter out any null values
    return transformed.filter(course => course !== null);
  } catch (error) {
    console.error('Error fetching courses from LLM Engine:', error);
    return [];
  }
};

export const searchLLMCourses = async (query: string, language?: string, sector?: string): Promise<any[]> => {
  try {
    const params: any = { query };
    if (language) params.lang = language;
    if (sector) params.sector = sector;
    
    const response: any = await apiClient.get('/llm/search', { params });
    const transformed = response.data.data.map(transformLLMCourseToFrontend);
    // Filter out any null values
    return transformed.filter(course => course !== null);
  } catch (error) {
    console.error('Error searching courses in LLM Engine:', error);
    return [];
  }
};

export const fetchLLMCoursesByPlatform = async (platform: string): Promise<any[]> => {
  try {
    // Map frontend platform to LLM module names
    const moduleMap: Record<string, string> = {
      e_tax: 'E-Tax System',
      customs: 'Customs & e-SW',
      e_sw: 'Customs & e-SW',
    };
    
    const moduleName = moduleMap[platform];
    if (!moduleName) return [];
    
    const response: any = await apiClient.get('/llm/modules');
    
    // Filter on client side since our API doesn't have module filtering yet
    const filtered = response.data.data.filter((course: any) => 
      course.module === moduleName || 
      course.module.includes(moduleName) ||
      moduleName.includes(course.module)
    );
    const transformed = filtered.map(transformLLMCourseToFrontend);
    // Filter out any null values
    return transformed.filter(course => course !== null);
  } catch (error) {
    console.error('Error fetching courses by platform from LLM Engine:', error);
    return [];
  }
};

export const fetchLLMCourseById = async (id: string): Promise<any | null> => {
  try {
    console.log(`Fetching course by ID: ${id}`);
    const response: any = await apiClient.get(`/llm/module/${id}`);
    console.log('API response:', response);
    if (response.data && response.data.data) {
      return transformLLMCourseToFrontend(response.data.data);
    }
    return null;
  } catch (error: any) {
    console.error('Error fetching course by ID from LLM Engine:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response,
      code: error.code
    });
    return null;
  }
};

// Generate quiz questions based on course content (multiple choice)
export const generateQuizQuestions = async (courseId: string, numQuestions: number = 5): Promise<QuizQuestion[] | null> => {
  try {
    console.log(`Generating quiz for course ID: ${courseId} with ${numQuestions} questions`);
    
    // Call the LLM engine to generate a quiz
    const response: { data: APIResponse<Quiz> } = await apiClient.post('/llm/generate/quiz', {
      module_id: courseId
    });
    
    if (response.data && response.data.success && response.data.data) {
      const quizData = response.data.data;
      
      // Transform the quiz questions to match our frontend interface
      const transformedQuestions: QuizQuestion[] = quizData.questions.map((question: any, index: number) => ({
        id: `q-${quizData.id}-${index + 1}`,
        question_text: question.question,
        options: question.options,
        correct_answer_index: question.correct_answer,
        points: 1, // All questions worth 1 point for now
        order_index: index + 1,
        explanation: question.explanation
      }));
      
      return transformedQuestions;
    }
    
    return null;
  } catch (error: any) {
    console.error('Error generating quiz questions:', error);
    
    // Fallback to sample questions if LLM generation fails
    const course = await fetchLLMCourseById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }
    
    // Sample multiple choice questions
    const sampleQuestions: QuizQuestion[] = [
      {
        id: `q-${Date.now()}-1`,
        question_text: `What is the main topic of the ${course.title} course?`,
        options: [
          course.topic || "Core concepts",
          "Advanced techniques",
          "Basic introduction",
          "Historical overview"
        ],
        correct_answer_index: 0,
        points: 1,
        order_index: 1
      },
      {
        id: `q-${Date.now()}-2`,
        question_text: `Which sector is the ${course.title} course primarily designed for?`,
        options: [
          course.sector || "General business",
          "Healthcare",
          "Education",
          "Technology"
        ],
        correct_answer_index: 0,
        points: 1,
        order_index: 2
      }
    ];
    
    return sampleQuestions;
  }
};

// Evaluate user answers for multiple choice quiz
export const evaluateQuizAnswers = async (
  courseId: string, 
  questions: QuizQuestion[], 
  userAnswers: Record<string, string>
): Promise<QuizEvaluation | null> => {
  try {
    console.log('Evaluating quiz answers', { courseId, questions, userAnswers });
    
    // Calculate score for multiple choice quiz
    let totalPoints = 0;
    let earnedPoints = 0;
    const detailedFeedback = [];
    
    for (const question of questions) {
      totalPoints += question.points;
      
      const userAnswerIndex = parseInt(userAnswers[question.id]);
      const isCorrect = userAnswerIndex === question.correct_answer_index;
      
      if (!isNaN(userAnswerIndex)) {
        const questionScore = isCorrect ? question.points : 0;
        earnedPoints += questionScore;
        
        detailedFeedback.push({
          question_id: question.id,
          score: questionScore,
          feedback: isCorrect ? "Correct!" : `Incorrect. The correct answer is: ${question.options[question.correct_answer_index]}`
        });
      } else {
        detailedFeedback.push({
          question_id: question.id,
          score: 0,
          feedback: "No answer provided"
        });
      }
    }
    
    const percentageScore = Math.round((earnedPoints / totalPoints) * 100);
    const passed = percentageScore >= 90; // As requested
    
    const evaluation: QuizEvaluation = {
      score: percentageScore,
      passed,
      feedback: passed ? "Congratulations! You passed the assessment." : "You need to score at least 90% to pass.",
      detailed_feedback: detailedFeedback
    };
    
    return evaluation;
  } catch (error) {
    console.error('Error evaluating quiz answers:', error);
    return null;
  }
};