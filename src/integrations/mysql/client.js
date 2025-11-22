// MySQL client for the e-learning platform
// Now uses API calls instead of direct database connections
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3002';

// User operations
async function getUserById(userId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

async function getUserByEmail(email) {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/users/email/${email}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;
  }
}

async function createUser(userData) {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/users`, userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

// User role operations
async function assignUserRole(userId, role) {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/users/${userId}/roles`, { role });
    return response.data;
  } catch (error) {
    console.error('Error assigning user role:', error);
    return false;
  }
}

async function getUserRoles(userId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/users/${userId}/roles`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user roles:', error);
    return [];
  }
}

// Course operations
async function getCourses(isPublished = true) {
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

async function getCourseById(courseId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/courses/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching course:', error);
    return null;
  }
}

// Module operations
async function getModulesByCourseId(courseId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/courses/${courseId}/modules`);
    return response.data;
  } catch (error) {
    console.error('Error fetching modules:', error);
    return [];
  }
}

// User progress operations
async function getUserProgress(userId, moduleId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/progress/${userId}/${moduleId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return null;
  }
}

async function updateUserProgress(progressData) {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/progress`, progressData);
    return response.data;
  } catch (error) {
    console.error('Error updating user progress:', error);
    return false;
  }
}

// Export all functions
module.exports = {
  // User operations
  getUserById,
  getUserByEmail,
  createUser,
  
  // Role operations
  assignUserRole,
  getUserRoles,
  
  // Course operations
  getCourses,
  getCourseById,
  
  // Module operations
  getModulesByCourseId,
  
  // Progress operations
  getUserProgress,
  updateUserProgress
};