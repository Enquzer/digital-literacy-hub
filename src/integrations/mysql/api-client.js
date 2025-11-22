// API client for MySQL database operations
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User operations
export async function getUserById(userId) {
  try {
    const response = await apiClient.get(`/api/users/${userId}`);
    // Handle wrapped responses
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
}

// Course operations
export async function getAllCourses() {
  try {
    const response = await apiClient.get('/api/courses');
    // Handle wrapped responses
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching all courses:', error);
    throw error;
  }
}

export async function getCourseById(courseId) {
  try {
    const response = await apiClient.get(`/api/courses/${courseId}`);
    // Handle wrapped responses
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching course by ID:', error);
    throw error;
  }
}

export async function getCoursesByPlatform(platform) {
  try {
    const response = await apiClient.get(`/api/courses/platform/${platform}`);
    // Handle wrapped responses
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching courses by platform:', error);
    throw error;
  }
}

export async function searchCourses(searchTerm) {
  try {
    // For search, we'll fetch all courses and filter on the client side
    // In a real implementation, you might want to implement server-side search
    const response = await apiClient.get('/api/courses');
    // Handle wrapped responses
    let courses = response.data;
    if (response.data && response.data.data) {
      courses = response.data.data;
    }
    return courses.filter(course => 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error('Error searching courses:', error);
    throw error;
  }
}

export async function getModulesByCourseId(courseId) {
  try {
    const response = await apiClient.get(`/api/courses/${courseId}/modules`);
    // Handle wrapped responses
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching modules by course ID:', error);
    throw error;
  }
}

// Progress operations
export async function updateUserProgress(progressData) {
  try {
    const response = await apiClient.post('/api/progress', progressData);
    // Handle wrapped responses
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data;
  } catch (error) {
    console.error('Error updating user progress:', error);
    throw error;
  }
}

export async function getUserProgress(userId, moduleId) {
  try {
    const response = await apiClient.get(`/api/progress/${userId}/${moduleId}`);
    // Handle wrapped responses
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching user progress:', error);
    throw error;
  }
}

// Stats operations
export async function getUserStats(userId) {
  try {
    const response = await apiClient.get(`/api/stats/${userId}`);
    // Handle wrapped responses
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error;
  }
}

// Admin operations
export async function getAdminStats() {
  try {
    const response = await apiClient.get('/admin/stats');
    // Extract the data from the response
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data || {};
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    throw error;
  }
}

// Session operations
export async function getUserSessions(userId) {
  try {
    const response = await apiClient.get(`/api/sessions/${userId}`);
    // Extract the data array from the response
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data || [];
  } catch (error) {
    console.error('Error fetching user sessions:', error);
    throw error;
  }
}

export async function registerForSession(sessionId, userId) {
  try {
    const response = await apiClient.post(`/api/sessions/${sessionId}/register`, {
      userId
    });
    // Extract the data from the response
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data || {};
  } catch (error) {
    console.error('Error registering for session:', error);
    throw error;
  }
}