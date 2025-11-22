// Course service for MySQL database operations
import { getCourseById as apiGetCourseById, getModulesByCourseId as apiGetModulesByCourseId } from "@/integrations/mysql/api-client";

/**
 * Gets a course by ID
 */
export async function getCourseById(courseId: string) {
  try {
    return await apiGetCourseById(courseId);
  } catch (error) {
    console.error('Error fetching course by ID:', error);
    throw error;
  }
}

/**
 * Gets all modules for a course
 */
export async function getModulesByCourseId(courseId: string) {
  try {
    return await apiGetModulesByCourseId(courseId);
  } catch (error) {
    console.error('Error fetching modules by course ID:', error);
    throw error;
  }
}