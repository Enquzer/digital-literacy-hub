import * as sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { generateUUID } from '../utils/uuid';

// SQLite configuration
const sqliteConfig = {
  filename: './db/e_learning_platform.db',
  driver: sqlite3.Database
};

// Database connection
let db: any = null;
let useMockDatabase = false;

// Mock database implementation (fallback)
const mockData: any = {
  profiles: [
    {
      id: 'admin-user-id',
      full_name: 'System Administrator',
      email: 'admin@gmail.com',
      created_at: new Date().toISOString()
    }
  ],
  user_roles: [
    {
      id: 'admin-role-id',
      user_id: 'admin-user-id',
      role: 'super_admin'
    }
  ],
  courses: [],
  modules: [],
  training_sessions: [],
  session_registrations: [],
  session_attendance: [],
  module_versions: [],
  learning_progress: [
    {
      id: 'progress-1',
      user_id: 'admin-user-id',
      module_id: 'customs-e-single-window-system-1763631000020',
      status: 'completed',
      progress_percentage: 100,
      time_spent_seconds: 3600,
      last_accessed: new Date().toISOString(),
      completed_at: new Date().toISOString(),
      quiz_score: 95.00
    },
    {
      id: 'progress-2',
      user_id: 'admin-user-id',
      module_id: 'trade-etrade-portal-1763631000020',
      status: 'in_progress',
      progress_percentage: 50,
      time_spent_seconds: 1800,
      last_accessed: new Date().toISOString(),
      completed_at: null,
      quiz_score: null
    }
  ],
  certificates: []
};

// Initialize SQLite database
export async function initSQLite() {
  try {
    console.log('Attempting to initialize SQLite database...');
    
    // Ensure the db directory exists
    const fs = require('fs');
    const path = require('path');
    const dbDir = path.dirname(sqliteConfig.filename);
    
    if (!fs.existsSync(dbDir)) {
      console.log(`Creating database directory: ${dbDir}`);
      fs.mkdirSync(dbDir, { recursive: true });
    }
    
    db = await open(sqliteConfig);
    console.log('SQLite database connection successful');
    
    // Create tables if they don't exist
    await createTables();
    
    useMockDatabase = false;
    console.log('SQLite database initialized successfully');
    return true;
  } catch (error) {
    console.error('SQLite database connection failed:', error);
    // Implement fallback strategy for development
    if (process.env.NODE_ENV !== 'production') {
      console.log('Using mock database implementation for development');
      useMockDatabase = true;
      // Add a default admin user to mock data if it doesn't exist
      if (!mockData.profiles.find((p: any) => p.email === 'admin@gmail.com')) {
        const adminUserId = 'admin-user-id';
        mockData.profiles.push({
          id: adminUserId,
          full_name: 'System Administrator',
          email: 'admin@gmail.com',
          created_at: new Date().toISOString()
        });
        mockData.user_roles.push({
          id: 'admin-role-id',
          user_id: adminUserId,
          role: 'super_admin'
        });
      }
      return false;
    }
    return false;
  }
}

// Create tables
async function createTables() {
  if (!db) return;
  
  // Create profiles table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Create user_roles table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS user_roles (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      role TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
    )
  `);
  
  // Create courses table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS courses (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      platform TEXT,
      is_published BOOLEAN DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Create modules table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS modules (
      id TEXT PRIMARY KEY,
      slug TEXT,
      title TEXT NOT NULL,
      source_url TEXT,
      language TEXT,
      version TEXT,
      status TEXT DEFAULT 'published',
      metadata TEXT,
      source_body TEXT,
      content TEXT,
      module TEXT,
      category TEXT,
      topic TEXT,
      sector TEXT,
      steps TEXT,
      requirements TEXT,
      validation TEXT,
      workflows TEXT,
      tags TEXT,
      sector_tags TEXT,
      required_documents TEXT,
      common_errors TEXT,
      faqs TEXT,
      examples TEXT,
      screenshots TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Create learning_progress table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS learning_progress (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      module_id TEXT NOT NULL,
      status TEXT DEFAULT 'not_started',
      progress_percentage INTEGER DEFAULT 0,
      time_spent_seconds INTEGER DEFAULT 0,
      last_accessed TEXT DEFAULT CURRENT_TIMESTAMP,
      completed_at TEXT NULL,
      quiz_score REAL NULL,
      UNIQUE(user_id, module_id),
      FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE,
      FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
    )
  `);
  
  // Create module_versions table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS module_versions (
      id TEXT PRIMARY KEY,
      module_id TEXT NOT NULL,
      version TEXT NOT NULL,
      content TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
    )
  `);
  
  console.log('Database tables created or already exist');
}

// Mock database pool implementation
const mockPool = {
  execute: async (query: string, params: any[] = []) => {
    console.log('Executing mock query:', query, 'with params:', params);
    // Simple mock implementation based on query type
    console.log('Query debug - raw query:', JSON.stringify(query));
    console.log('Query debug - normalized query:', JSON.stringify(query.replace(/\s+/g, ' ').trim()));
    
    // Check for learning progress queries with exact matching
    // Handle SELECT query for specific user and module progress
    if (query.replace(/\s+/g, ' ').trim() === 'SELECT * FROM learning_progress WHERE user_id = ? AND module_id = ?') {
      const userId = params[0];
      const moduleId = params[1];
      console.log('Searching for progress with userId:', userId, 'moduleId:', moduleId);
      console.log('Available progress records:', mockData.learning_progress);
      const progress = mockData.learning_progress.find((p: any) => p.user_id === userId && p.module_id === moduleId);
      // Return in the format expected by the application: [[row1, row2, ...], ...]
      console.log('Found learning progress:', progress);
      return progress ? [[progress], []] : [[], []];
    } else if (query.replace(/\s+/g, ' ').trim() === 'SELECT id FROM learning_progress WHERE user_id = ? AND module_id = ?') {
      const userId = params[0];
      const moduleId = params[1];
      const progress = mockData.learning_progress.find((p: any) => p.user_id === userId && p.module_id === moduleId);
      // Return in the format expected by the application: [[row1, row2, ...], ...]
      console.log('Found learning progress:', progress);
      return progress ? [[progress], []] : [[], []];
    } else if (query.replace(/\s+/g, ' ').trim() === 'INSERT INTO learning_progress (id, user_id, module_id, status, progress_percentage, time_spent_seconds, quiz_score, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)') {
      // Extract parameters for learning progress
      const progressId = params[0];
      const userId = params[1];
      const moduleId = params[2];
      const status = params[3];
      const progressPercentage = params[4];
      const timeSpentSeconds = params[5];
      const quizScore = params[6];
      const completedAt = params[7]; // New parameter for completed_at
      
      const newProgress = {
        id: progressId,
        user_id: userId,
        module_id: moduleId,
        status: status,
        progress_percentage: progressPercentage,
        time_spent_seconds: timeSpentSeconds,
        quiz_score: quizScore,
        last_accessed: new Date().toISOString(),
        completed_at: completedAt || (status === 'completed' ? new Date().toISOString() : null)
      };
      mockData.learning_progress.push(newProgress);
      console.log('Created new learning progress:', newProgress);
      return [{ affectedRows: 1 }, []];
    } else if (query.includes('SELECT * FROM learning_progress') && query.includes('user_id = ? AND module_id = ?')) {
      const userId = params[0];
      const moduleId = params[1];
      const progress = mockData.learning_progress.find((p: any) => p.user_id === userId && p.module_id === moduleId);
      // Return in the format expected by the application: [[row1, row2, ...], ...]
      console.log('Found learning progress:', progress);
      return progress ? [[progress], []] : [[], []];
    }
    
    // User queries
    else if (query.includes('SELECT * FROM profiles WHERE id = ?')) {
      const userId = params[0];
      const user = mockData.profiles.find((p: any) => p.id === userId);
      console.log('Found user by ID:', user);
      // Return in the format expected by the application: [[row1, row2, ...], ...]
      return user ? [[user], []] : [[], []];
    } else if (query.includes('SELECT * FROM profiles WHERE email = ?')) {
      const email = params[0];
      const user = mockData.profiles.find((p: any) => p.email === email);
      console.log('Found user by email:', user);
      // Return in the format expected by the application: [[row1, row2, ...], ...]
      return user ? [[user], []] : [[], []];
    } else if (query.includes('INSERT INTO profiles')) {
      const [userId, fullName, email] = params;
      const newUser = { id: userId, full_name: fullName, email, created_at: new Date().toISOString() };
      mockData.profiles.push(newUser);
      console.log('Created new user:', newUser);
      return [{ affectedRows: 1 }, []];
    } 
    
    // User roles queries
    else if (query.includes('SELECT role FROM user_roles WHERE user_id = ?')) {
      const userId = params[0];
      const roles = mockData.user_roles.filter((r: any) => r.user_id === userId);
      console.log('Found roles for user:', userId, roles);
      // Return in the format expected by the application: [rows, ...]
      return [roles, []];
    } else if (query.includes('INSERT INTO user_roles')) {
      const [roleId, userId, role] = params;
      mockData.user_roles.push({ id: roleId, user_id: userId, role });
      return [{ affectedRows: 1 }, []];
    } 
    
    // Courses queries
    else if (query.includes('SELECT * FROM courses')) {
      return [mockData.courses, []];
    } else if (query.includes('INSERT INTO courses')) {
      // Simplified insert - in a real implementation we would add the course
      return [{ affectedRows: 1 }, []];
    }
    
    // Training sessions queries
    else if (query.includes('SELECT * FROM training_sessions')) {
      return [mockData.training_sessions, []];
    } else if (query.includes('SELECT ts.*, c.title as course_title, p.full_name as trainer_name FROM training_sessions ts WHERE ts.id = ?')) {
      const sessionId = params[0];
      const session = mockData.training_sessions.find((s: any) => s.id === sessionId);
      // Return in the format expected by the application: [[row1, row2, ...], ...]
      return session ? [[session], []] : [[], []];
    } 
    
    // Modules queries
    else if (query.includes('SELECT id FROM modules WHERE id = ?')) {
      const moduleId = params[0];
      const module = mockData.modules.find((m: any) => m.id === moduleId);
      // Return in the format expected by the application: [[row1, row2, ...], ...]
      return module ? [[{ id: module.id }], []] : [[], []];
    } else if (query.includes('UPDATE modules')) {
      // Simplified update - in a real implementation we would update the module
      return [{ affectedRows: 1 }, []];
    } else if (query.includes('INSERT INTO modules')) {
      // Simplified insert - in a real implementation we would add the module
      return [{ affectedRows: 1 }, []];
    } else if (query.includes('INSERT INTO module_versions')) {
      // Simplified insert - in a real implementation we would add the module version
      return [{ affectedRows: 1 }, []];
    } else if (query.includes('SELECT * FROM modules ORDER BY created_at DESC LIMIT ? OFFSET ?')) {
      // Simplified pagination - return all modules
      return [mockData.modules, []];
    } else if (query.includes('SELECT * FROM modules WHERE id = ?')) {
      const moduleId = params[0];
      const module = mockData.modules.find((m: any) => m.id === moduleId);
      // Return in the format expected by the application: [[row1, row2, ...], ...]
      return module ? [[module], []] : [[], []];
    } else if (query.includes('SELECT * FROM modules WHERE title LIKE ? OR slug LIKE ?')) {
      const searchTerm1 = params[0].replace(/%/g, '');
      const searchTerm2 = params[1].replace(/%/g, '');
      const filteredModules = mockData.modules.filter((m: any) => 
        m.title.includes(searchTerm1) || m.slug.includes(searchTerm2)
      );
      return [filteredModules, []];
    } 
    
    // Learning progress queries (more specific patterns)
    else if (query.includes('SELECT * FROM learning_progress WHERE user_id = ? AND module_id = ?')) {
      const userId = params[0], moduleId = params[1];
      const progress = mockData.learning_progress.find((p: any) => p.user_id === userId && p.module_id === moduleId);
      // Return in the format expected by the application: [[row1, row2, ...], ...]
      return progress ? [[progress], []] : [[], []];
    } else if (query.includes('SELECT lp.*, m.title as module_title FROM learning_progress lp LEFT JOIN modules m ON lp.module_id = m.id WHERE lp.user_id = ?')) {
      const userId = params[0];
      const progress = mockData.learning_progress.filter((p: any) => p.user_id === userId);
      // Return in the format expected by the application: [rows, ...]
      return [progress, []];
    } 
    
    // Certificates queries
    else if (query.includes('SELECT c.id, c.module_id, c.issued_at, c.expires_at, m.title as course_name, p.full_name as user_name FROM certificates c LEFT JOIN modules m ON c.module_id = m.id LEFT JOIN profiles p ON c.user_id = p.id WHERE c.user_id = ?')) {
      const userId = params[0];
      const certificates = mockData.certificates.filter((c: any) => c.user_id === userId);
      // Return in the format expected by the application: [rows, ...]
      return [certificates, []];
    }
    
    // Default empty result
    console.log('No matching mock query handler found');
    return [[], []];
  },
  getConnection: async () => {
    return {
      release: () => {}
    };
  }
};

// Get appropriate database pool
const getPool = () => {
  console.log('Using database pool. Mock database:', useMockDatabase ? 'YES' : 'NO');
  return useMockDatabase ? mockPool : {
    execute: async (query: string, params: any[] = []) => {
      if (!db) {
        throw new Error('Database not initialized');
      }
      
      console.log('Executing SQLite query:', query, 'with params:', params);
      
      try {
        // Handle different types of queries
        if (query.trim().toUpperCase().startsWith('SELECT')) {
          const result = await db.all(query, params);
          console.log('Query result:', result);
          return [result, []];
        } else if (query.trim().toUpperCase().startsWith('INSERT') || 
                   query.trim().toUpperCase().startsWith('UPDATE') || 
                   query.trim().toUpperCase().startsWith('DELETE')) {
          const result = await db.run(query, params);
          console.log('Query result:', result);
          return [result, []];
        } else {
          // For other queries like CREATE TABLE
          const result = await db.exec(query);
          console.log('Query executed');
          return [result, []];
        }
      } catch (error) {
        console.error('SQLite query error:', error);
        throw error;
      }
    }
  };
};

// Test database connection
export async function testMySQLConnection() {
  return await initSQLite();
}

// Database operations
export async function getUserById(userId: string) {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(
      'SELECT * FROM profiles WHERE id = ?',
      [userId]
    );
    const result = rows as any[];
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Error in getUserById:', error);
    // Return null instead of throwing error to allow graceful degradation
    return null;
  }
}

export async function getUserByEmail(email: string) {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(
      'SELECT * FROM profiles WHERE email = ?',
      [email]
    );
    const result = rows as any[];
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Error in getUserByEmail:', error);
    // Return null instead of throwing error to allow graceful degradation
    return null;
  }
}

export async function createUser(email: string, fullName: string) {
  try {
    const pool = getPool();
    const userId = generateUUID();
    await pool.execute(
      'INSERT INTO profiles (id, full_name, email) VALUES (?, ?, ?)',
      [userId, fullName, email]
    );
    return userId;
  } catch (error) {
    console.error('Error in createUser:', error);
    // Return null instead of throwing error to allow graceful degradation
    return null;
  }
}

export async function getUserRoles(userId: string) {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(
      'SELECT role FROM user_roles WHERE user_id = ?',
      [userId]
    );
    return rows as any[];
  } catch (error) {
    console.error('Error in getUserRoles:', error);
    // Return empty array instead of throwing error to allow graceful degradation
    return [];
  }
}

export async function assignUserRole(userId: string, role: string) {
  try {
    const pool = getPool();
    const roleId = generateUUID();
    await pool.execute(
      'INSERT INTO user_roles (id, user_id, role) VALUES (?, ?, ?)',
      [roleId, userId, role]
    );
    return true;
  } catch (error) {
    console.error('Error in assignUserRole:', error);
    // Return false instead of throwing error to allow graceful degradation
    return false;
  }
}

export async function getCourses(isPublished: boolean = true) {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(
      'SELECT * FROM courses WHERE is_published = ? ORDER BY created_at DESC',
      [isPublished ? 1 : 0]
    );
    return rows as any[];
  } catch (error) {
    console.error('Error in getCourses:', error);
    // Return empty array instead of throwing error to allow graceful degradation
    return [];
  }
}

export async function getTrainingSessions() {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(
      `SELECT ts.*, c.title as course_title, p.full_name as trainer_name 
       FROM training_sessions ts 
       LEFT JOIN courses c ON ts.course_id = c.id 
       LEFT JOIN profiles p ON ts.trainer_id = p.id 
       ORDER BY ts.scheduled_for DESC`
    );
    return rows as any[];
  } catch (error) {
    console.error('Error in getTrainingSessions:', error);
    // Return empty array instead of throwing error to allow graceful degradation
    return [];
  }
}

export async function getUserSessions(userId: string) {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(
      `SELECT ts.*, c.title as course_title, p.full_name as trainer_name 
       FROM session_registrations sr
       JOIN training_sessions ts ON sr.session_id = ts.id
       LEFT JOIN courses c ON ts.course_id = c.id 
       LEFT JOIN profiles p ON ts.trainer_id = p.id 
       WHERE sr.user_id = ?
       ORDER BY ts.scheduled_for DESC`,
      [userId]
    );
    return rows as any[];
  } catch (error) {
    console.error('Error in getUserSessions:', error);
    // Return empty array instead of throwing error to allow graceful degradation
    return [];
  }
}

export async function registerForSession(sessionId: string, userId: string) {
  try {
    const pool = getPool();
    const registrationId = generateUUID();
    await pool.execute(
      'INSERT INTO session_registrations (id, session_id, user_id) VALUES (?, ?, ?)',
      [registrationId, sessionId, userId]
    );
    return { success: true };
  } catch (error) {
    console.error('Error in registerForSession:', error);
    // Return error object instead of throwing error to allow graceful degradation
    return { success: false, error: 'Failed to register for session' };
  }
}

export async function getSessionById(sessionId: string) {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(
      `SELECT ts.*, c.title as course_title, p.full_name as trainer_name 
       FROM training_sessions ts 
       LEFT JOIN courses c ON ts.course_id = c.id 
       LEFT JOIN profiles p ON ts.trainer_id = p.id 
       WHERE ts.id = ?`,
      [sessionId]
    );
    const result = rows as any[];
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Error in getSessionById:', error);
    // Return null instead of throwing error to allow graceful degradation
    return null;
  }
}

export async function saveModule(module: any) {
  try {
    const pool = getPool();
    
    // Convert arrays and objects to JSON strings for SQLite storage
    const moduleData = {
      ...module,
      metadata: module.metadata ? JSON.stringify(module.metadata) : null,
      steps: module.steps ? JSON.stringify(module.steps) : null,
      requirements: module.requirements ? JSON.stringify(module.requirements) : null,
      validation: module.validation ? JSON.stringify(module.validation) : null,
      workflows: module.workflows ? JSON.stringify(module.workflows) : null,
      tags: module.tags ? JSON.stringify(module.tags) : null,
      sector_tags: module.sector_tags ? JSON.stringify(module.sector_tags) : null,
      required_documents: module.required_documents ? JSON.stringify(module.required_documents) : null,
      common_errors: module.common_errors ? JSON.stringify(module.common_errors) : null,
      faqs: module.faqs ? JSON.stringify(module.faqs) : null,
      examples: module.examples ? JSON.stringify(module.examples) : null,
      screenshots: module.screenshots ? JSON.stringify(module.screenshots) : null,
      content: module.content ? JSON.stringify(module.content) : null,
      source_body: module.source_body ? JSON.stringify(module.source_body) : null
    };
    
    // Check if module already exists
    const [existing] = await pool.execute(
      'SELECT id FROM modules WHERE id = ?',
      [module.id]
    );
    
    const existingRows = existing as any[];
    
    if (existingRows.length > 0) {
      // Update existing module
      await pool.execute(
        `UPDATE modules SET 
         slug = ?, title = ?, source_url = ?, language = ?, version = ?, 
         status = ?, metadata = ?, updated_at = CURRENT_TIMESTAMP,
         module = ?, category = ?, topic = ?, sector = ?, steps = ?,
         requirements = ?, validation = ?, workflows = ?, tags = ?,
         sector_tags = ?, required_documents = ?, common_errors = ?,
         faqs = ?, examples = ?, screenshots = ?, content = ?, source_body = ?
         WHERE id = ?`,
        [
          moduleData.slug, 
          moduleData.title, 
          moduleData.source_url, 
          moduleData.language, 
          moduleData.version || '1.0', 
          moduleData.status || 'published', 
          moduleData.metadata,
          moduleData.module,
          moduleData.category,
          moduleData.topic,
          moduleData.sector,
          moduleData.steps,
          moduleData.requirements,
          moduleData.validation,
          moduleData.workflows,
          moduleData.tags,
          moduleData.sector_tags,
          moduleData.required_documents,
          moduleData.common_errors,
          moduleData.faqs,
          moduleData.examples,
          moduleData.screenshots,
          moduleData.content,
          moduleData.source_body,
          module.id
        ]
      );
    } else {
      // Insert new module
      await pool.execute(
        `INSERT INTO modules (id, slug, title, source_url, language, version, status, metadata,
         module, category, topic, sector, steps, requirements, validation, workflows, tags,
         sector_tags, required_documents, common_errors, faqs, examples, screenshots, content, source_body)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          moduleData.id,
          moduleData.slug,
          moduleData.title,
          moduleData.source_url,
          moduleData.language,
          moduleData.version || '1.0',
          moduleData.status || 'published',
          moduleData.metadata,
          moduleData.module,
          moduleData.category,
          moduleData.topic,
          moduleData.sector,
          moduleData.steps,
          moduleData.requirements,
          moduleData.validation,
          moduleData.workflows,
          moduleData.tags,
          moduleData.sector_tags,
          moduleData.required_documents,
          moduleData.common_errors,
          moduleData.faqs,
          moduleData.examples,
          moduleData.screenshots,
          moduleData.content,
          moduleData.source_body
        ]
      );
    }

    return { success: true };
  } catch (error) {
    console.error('Error in saveModule:', error);
    throw error;
  }
}

export async function getModules(limit: number = 10, offset: number = 0) {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(
      'SELECT * FROM modules ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    
    // Parse JSON fields back to objects
    const modules = (rows as any[]).map(row => ({
      ...row,
      metadata: row.metadata ? JSON.parse(row.metadata) : null,
      steps: row.steps ? JSON.parse(row.steps) : null,
      requirements: row.requirements ? JSON.parse(row.requirements) : null,
      validation: row.validation ? JSON.parse(row.validation) : null,
      workflows: row.workflows ? JSON.parse(row.workflows) : null,
      tags: row.tags ? JSON.parse(row.tags) : null,
      sector_tags: row.sector_tags ? JSON.parse(row.sector_tags) : null,
      required_documents: row.required_documents ? JSON.parse(row.required_documents) : null,
      common_errors: row.common_errors ? JSON.parse(row.common_errors) : null,
      faqs: row.faqs ? JSON.parse(row.faqs) : null,
      examples: row.examples ? JSON.parse(row.examples) : null,
      screenshots: row.screenshots ? JSON.parse(row.screenshots) : null,
      content: row.content ? JSON.parse(row.content) : null,
      source_body: row.source_body ? JSON.parse(row.source_body) : null
    }));
    
    return modules;
  } catch (error) {
    console.error('Error in getModules:', error);
    // Return empty array instead of throwing error to allow graceful degradation
    return [];
  }
}

export async function getModuleById(id: string) {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(
      'SELECT * FROM modules WHERE id = ?',
      [id]
    );
    const result = rows as any[];
    
    if (result.length > 0) {
      const row = result[0];
      // Parse JSON fields back to objects
      return {
        ...row,
        metadata: row.metadata ? JSON.parse(row.metadata) : null,
        steps: row.steps ? JSON.parse(row.steps) : null,
        requirements: row.requirements ? JSON.parse(row.requirements) : null,
        validation: row.validation ? JSON.parse(row.validation) : null,
        workflows: row.workflows ? JSON.parse(row.workflows) : null,
        tags: row.tags ? JSON.parse(row.tags) : null,
        sector_tags: row.sector_tags ? JSON.parse(row.sector_tags) : null,
        required_documents: row.required_documents ? JSON.parse(row.required_documents) : null,
        common_errors: row.common_errors ? JSON.parse(row.common_errors) : null,
        faqs: row.faqs ? JSON.parse(row.faqs) : null,
        examples: row.examples ? JSON.parse(row.examples) : null,
        screenshots: row.screenshots ? JSON.parse(row.screenshots) : null,
        content: row.content ? JSON.parse(row.content) : null,
        source_body: row.source_body ? JSON.parse(row.source_body) : null
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error in getModuleById:', error);
    // Return null instead of throwing error to allow graceful degradation
    return null;
  }
}

export async function searchModules(query: string, limit: number = 10) {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(
      `SELECT * FROM modules 
       WHERE title LIKE ? OR slug LIKE ? 
       ORDER BY created_at DESC LIMIT ?`,
      [`%${query}%`, `%${query}%`, limit]
    );
    
    // Parse JSON fields back to objects
    const modules = (rows as any[]).map(row => ({
      ...row,
      metadata: row.metadata ? JSON.parse(row.metadata) : null,
      steps: row.steps ? JSON.parse(row.steps) : null,
      requirements: row.requirements ? JSON.parse(row.requirements) : null,
      validation: row.validation ? JSON.parse(row.validation) : null,
      workflows: row.workflows ? JSON.parse(row.workflows) : null,
      tags: row.tags ? JSON.parse(row.tags) : null,
      sector_tags: row.sector_tags ? JSON.parse(row.sector_tags) : null,
      required_documents: row.required_documents ? JSON.parse(row.required_documents) : null,
      common_errors: row.common_errors ? JSON.parse(row.common_errors) : null,
      faqs: row.faqs ? JSON.parse(row.faqs) : null,
      examples: row.examples ? JSON.parse(row.examples) : null,
      screenshots: row.screenshots ? JSON.parse(row.screenshots) : null,
      content: row.content ? JSON.parse(row.content) : null,
      source_body: row.source_body ? JSON.parse(row.source_body) : null
    }));
    
    return modules;
  } catch (error) {
    console.error('Error in searchModules:', error);
    // Return empty array instead of throwing error to allow graceful degradation
    return [];
  }
}

export async function getUserCertificates(userId: string) {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(
      `SELECT c.id, c.module_id, c.issued_at, c.expires_at, m.title as course_name, p.full_name as user_name 
       FROM certificates c 
       LEFT JOIN modules m ON c.module_id = m.id 
       LEFT JOIN profiles p ON c.user_id = p.id 
       WHERE c.user_id = ?`,
      [userId]
    );
    return rows as any[];
  } catch (error) {
    console.error('Error in getUserCertificates:', error);
    // Return empty array instead of throwing error to allow graceful degradation
    return [];
  }
}

export async function getLearningProgressByUserAndModule(userId: string, moduleId: string) {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(
      'SELECT * FROM learning_progress WHERE user_id = ? AND module_id = ?',
      [userId, moduleId]
    );
    const result = rows as any[];
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Error in getLearningProgressByUserAndModule:', error);
    // Return null instead of throwing error to allow graceful degradation
    return null;
  }
}

export async function getLearningProgressByUser(userId: string) {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(
      `SELECT lp.*, m.title as module_title 
       FROM learning_progress lp 
       LEFT JOIN modules m ON lp.module_id = m.id 
       WHERE lp.user_id = ?`,
      [userId]
    );
    return rows as any[];
  } catch (error) {
    console.error('Error in getLearningProgressByUser:', error);
    // Return empty array instead of throwing error to allow graceful degradation
    return [];
  }
}

export async function createOrUpdateLearningProgress(userId: string, moduleId: string, progressData: any) {
  try {
    const pool = getPool();
    
    // Check if progress record already exists
    const [existing] = await pool.execute(
      'SELECT id FROM learning_progress WHERE user_id = ? AND module_id = ?',
      [userId, moduleId]
    );
    
    const existingRows = existing as any[];
    
    if (existingRows.length > 0) {
      // Update existing progress record
      const updates: string[] = [];
      const values: any[] = [];
      
      if (progressData.status) {
        updates.push('status = ?');
        values.push(progressData.status);
      }
      
      if (progressData.progress_percentage !== undefined) {
        updates.push('progress_percentage = ?');
        values.push(progressData.progress_percentage);
      }
      
      if (progressData.time_spent_seconds !== undefined) {
        updates.push('time_spent_seconds = ?');
        values.push(progressData.time_spent_seconds);
      }
      
      if (progressData.quiz_score !== undefined) {
        updates.push('quiz_score = ?');
        values.push(progressData.quiz_score);
      }
      
      // Always update last_accessed
      updates.push('last_accessed = CURRENT_TIMESTAMP');
      
      // If status is completed, set completed_at
      if (progressData.status === 'completed') {
        updates.push('completed_at = CURRENT_TIMESTAMP');
      }
      
      values.push(userId, moduleId);
      
      await pool.execute(
        `UPDATE learning_progress 
         SET ${updates.join(', ')}
         WHERE user_id = ? AND module_id = ?`,
        values
      );
      
      return { success: true, created: false };
    } else {
      // Create new progress record
      const progressId = generateUUID();
      const status = progressData.status || 'not_started';
      const progressPercentage = progressData.progress_percentage || 0;
      const timeSpentSeconds = progressData.time_spent_seconds || 0;
      const quizScore = progressData.quiz_score || null;
      const completedAt = status === 'completed' ? new Date().toISOString() : null;
      
      await pool.execute(
        `INSERT INTO learning_progress 
         (id, user_id, module_id, status, progress_percentage, time_spent_seconds, quiz_score, completed_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [progressId, userId, moduleId, status, progressPercentage, timeSpentSeconds, quizScore, completedAt]
      );
      
      return { success: true, created: true };
    }
  } catch (error) {
    console.error('Error in createOrUpdateLearningProgress:', error);
    throw error;
  }
}

// Add a function to manually populate modules for development
export function populateMockModules(modules: any[]) {
  // Clear existing modules
  mockData.modules = [];
  
  // Add new modules
  mockData.modules.push(...modules);
  
  console.log(`Populated mock database with ${modules.length} modules`);
  
  // Also populate SQLite database if it's available
  if (!useMockDatabase && db) {
    modules.forEach(async (module) => {
      try {
        await saveModule(module);
      } catch (error) {
        console.error('Error saving module to SQLite:', error);
      }
    });
  }
}

