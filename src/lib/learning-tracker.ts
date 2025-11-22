import { updateUserProgress as apiUpdateUserProgress, getUserProgress as apiGetUserProgress, getUserStats as apiGetUserStats } from "@/integrations/mysql/api-client";
import { generateUUID } from "@/utils/uuid";

export interface ProgressUpdate {
  userId: string;
  moduleId: string;
  progressData: {
    status: string;
    progress_percentage: number;
    time_spent_seconds: number;
    quiz_score: any;
  };
}

/**
 * Updates user progress for a specific module
 */
export const updateUserProgress = async (update: ProgressUpdate) => {
  try {
    return await apiUpdateUserProgress(update);
  } catch (error) {
    console.error('Error updating user progress:', error);
    throw error;
  }
};

/**
 * Checks if a course is completed and generates a certificate if needed
 */
export const checkCourseCompletion = async (userId: string, courseId: string) => {
  try {
    // This function would need to be implemented on the server side
    // For now, we'll leave it as a placeholder
    console.log('Course completion check would be implemented on server side');
  } catch (error) {
    console.error('Error checking course completion:', error);
  }
};

/**
 * Gets user progress for a specific course/module
 */
export const getUserCourseProgress = async (userId: string, moduleId: string) => {
  try {
    return await apiGetUserProgress(userId, moduleId);
  } catch (error) {
    console.error('Error fetching user course progress:', error);
    throw error;
  }
};

/**
 * Gets overall progress statistics for a user
 */
export const getUserProgressStats = async (userId: string) => {
  try {
    return await apiGetUserStats(userId);
  } catch (error) {
    console.error('Error fetching user progress stats:', error);
    throw error;
  }
};

/**
 * Updates learning streak for a user
 */
export const updateLearningStreak = async (userId: string) => {
  try {
    // This function would need to be implemented on the server side
    // For now, we'll leave it as a placeholder
    console.log('Learning streak update would be implemented on server side');
    return null;
  } catch (error) {
    console.error('Error updating learning streak:', error);
    throw error;
  }
};