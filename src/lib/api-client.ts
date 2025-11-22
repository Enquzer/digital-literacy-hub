// API client to replace direct database calls
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

// User operations
export async function getUserById(userId: string) {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

// Course operations
export async function getCourseById(courseId: string) {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/courses/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching course:', error);
    return null;
  }
}

export async function getCourses(isPublished: boolean = true) {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/courses`, {
      params: { isPublished }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
}

// Module operations
export async function getModulesByCourseId(courseId: string) {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/courses/${courseId}/modules`);
    return response.data;
  } catch (error) {
    console.error('Error fetching modules:', error);
    return [];
  }
}

// Quiz operations
export async function getQuizByModuleId(moduleId: string) {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/modules/${moduleId}/quiz`);
    return response.data;
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return null;
  }
}

export async function createQuiz(quizData: any) {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/quizzes`, quizData);
    return response.data;
  } catch (error) {
    console.error('Error creating quiz:', error);
    return null;
  }
}

export async function getQuizQuestions(quizId: string) {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/quizzes/${quizId}/questions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    return [];
  }
}

export async function createQuizQuestion(questionData: any) {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/questions`, questionData);
    return response.data;
  } catch (error) {
    console.error('Error creating quiz question:', error);
    return null;
  }
}

// Progress operations
export async function getUserProgress(userId: string, moduleId: string) {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/progress/${userId}/${moduleId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return null;
  }
}

export async function updateUserProgress(progressData: any) {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/progress`, progressData);
    return response.data;
  } catch (error) {
    console.error('Error updating user progress:', error);
    return null;
  }
}

// Session operations
export async function getTrainingSessions() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/sessions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching training sessions:', error);
    return [];
  }
}

export async function registerForSession(sessionId: string, userId: string) {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/sessions/${sessionId}/register`, { userId });
    return response.data;
  } catch (error) {
    console.error('Error registering for session:', error);
    return null;
  }
}

// Support ticket operations
export async function getSupportTickets() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/tickets`);
    return response.data;
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    return [];
  }
}

export async function updateTicketStatus(ticketId: string, status: string) {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/tickets/${ticketId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating ticket status:', error);
    return null;
  }
}

export async function assignTicket(ticketId: string, adminId: string) {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/tickets/${ticketId}/assign`, { adminId });
    return response.data;
  } catch (error) {
    console.error('Error assigning ticket:', error);
    return null;
  }
}

// Analytics operations
export async function getCourseAnalytics() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/analytics/courses`);
    return response.data;
  } catch (error) {
    console.error('Error fetching course analytics:', error);
    return [];
  }
}

export async function getLanguageStats() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/analytics/languages`);
    return response.data;
  } catch (error) {
    console.error('Error fetching language stats:', error);
    return [];
  }
}

// Module operations
export async function getModules() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/modules`);
    return response.data;
  } catch (error) {
    console.error('Error fetching modules:', error);
    return [];
  }
}

export async function deleteModule(moduleId: string) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/modules/${moduleId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting module:', error);
    return null;
  }
}