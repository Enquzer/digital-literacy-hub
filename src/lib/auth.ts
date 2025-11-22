import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

// Add axios default configuration
axios.defaults.withCredentials = true;

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  roles: string[];
}

interface AuthResponse {
  user: AuthUser | null;
}

interface WrappedAuthResponse {
  success?: boolean;
  data?: {
    user: AuthUser | null;
  };
}

// Simple in-memory user storage for demo purposes
// In a real application, you would use proper authentication
const users: any = {};

// Store current user in localStorage for persistence
const setCurrentUser = (user: AuthUser | null) => {
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('currentUser');
  }
};

const getStoredUser = (): AuthUser | null => {
  try {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    return null;
  }
};

export const signUp = async (email: string, password: string, full_name: string) => {
  try {
    const response = await axios.post<AuthResponse | WrappedAuthResponse>(`${API_BASE_URL}/auth/signup`, {
      email,
      password,
      full_name
    });
    
    // Handle wrapped responses
    let userData: AuthResponse | WrappedAuthResponse = response.data;
    if ('data' in response.data && response.data.data && 'user' in response.data.data) {
      userData = response.data.data as AuthResponse;
    } else if ('user' in response.data) {
      userData = response.data as AuthResponse;
    }
    
    return { data: userData, error: null };
  } catch (error: any) {
    console.error('Sign up error:', error);
    return { data: null, error: { message: error.response?.data?.error || error.message || 'Failed to create account' } };
  }
};

export const createAdminUser = async () => {
  try {
    // This would be implemented on the server side
    console.log('Admin user creation would be implemented on server side');
    return { data: null, error: { message: "Not implemented" } };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
};

// New function to ensure admin user has super_admin role
export const ensureAdminHasFullAccess = async () => {
  try {
    // This would be implemented on the server side
    console.log('Admin role check would be implemented on server side');
    return { success: true };
  } catch (error: any) {
    console.error("Unexpected error in ensureAdminHasFullAccess:", error);
    return { error };
  }
};

// Function to forcefully fix admin user roles
export const fixAdminUserRoles = async () => {
  try {
    console.log("Fixing admin user roles would be implemented on server side");
    return { success: true };
  } catch (error: any) {
    console.error("Unexpected error in fixAdminUserRoles:", error);
    return { error };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    console.log('Attempting to sign in with:', { email });
    const response = await axios.post<AuthResponse | WrappedAuthResponse>(`${API_BASE_URL}/auth/signin`, {
      email,
      password
    });
    
    console.log('Sign in response:', response.data);
    
    // Handle wrapped responses
    let userData: AuthResponse | WrappedAuthResponse = response.data;
    if ('data' in response.data && response.data.data && 'user' in response.data.data) {
      userData = response.data.data as AuthResponse;
    } else if ('user' in response.data) {
      userData = response.data as AuthResponse;
    }
    
    // Store user in localStorage for persistence
    if ('user' in userData && userData.user) {
      setCurrentUser(userData.user);
    }
    
    return { data: userData, error: null };
  } catch (error: any) {
    console.error('Sign in error:', error);
    return { data: null, error: { message: error.response?.data?.error || error.message || 'Failed to sign in' } };
  }
};

export const signOut = async () => {
  try {
    await axios.post(`${API_BASE_URL}/auth/signout`);
    // Clear user from localStorage
    setCurrentUser(null);
    return { error: null };
  } catch (error: any) {
    // Still clear user even if API call fails
    setCurrentUser(null);
    return { error: { message: error.message } };
  }
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  // First check if we have a user stored in localStorage
  const storedUser = getStoredUser();
  if (storedUser) {
    return storedUser;
  }
  
  // If no stored user, try to fetch from API (for backward compatibility)
  try {
    const response = await axios.get<AuthResponse | WrappedAuthResponse>(`${API_BASE_URL}/auth/current`);
    
    // Handle wrapped responses
    let userData: AuthResponse | WrappedAuthResponse = response.data;
    if ('data' in response.data && response.data.data && 'user' in response.data.data) {
      userData = response.data.data as AuthResponse;
    } else if ('user' in response.data) {
      userData = response.data as AuthResponse;
    }
    
    const user = 'user' in userData ? userData.user : null;
    if (user) {
      setCurrentUser(user);
    }
    return user;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
};