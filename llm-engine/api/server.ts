import express = require('express');
import cors = require('cors');
import path = require('path');
import reindexRouter = require('./reindex.js');
import { 
  getUserByEmail, 
  createUser, 
  getUserRoles, 
  assignUserRole,
  getModules,
  getModuleById,
  searchModules,
  getLearningProgressByUserAndModule,
  getLearningProgressByUser,
  createOrUpdateLearningProgress,
  getTrainingSessions,
  getUserSessions,
  registerForSession,
  getSessionById,
  testMySQLConnection,
  populateMockModules,
  initSQLite
} from './database.js';
import { Scheduler } from '../Scheduler.js';
import { QuizGenerator } from '../QuizGenerator.js';
import * as fs from 'fs';
import * as sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Get appropriate database pool (placeholder - will be provided by database.ts)
const getPool = () => {
  // This is just a placeholder - the real implementation is in database.ts
  return {
    execute: async (query: string, params: any[] = []) => {
      // Return mock data for now
      return [[], []];
    }
  };
};

// Override the database functions to use SQLite
async function getModulesSQLite(limit: number = 10, offset: number = 0) {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(
      'SELECT * FROM modules ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    return rows as any[];
  } catch (error) {
    console.error('Error in getModulesSQLite:', error);
    return [];
  }
}

// Store the original getModules function
const originalGetModules = getModules;

// Override the getModules function to use SQLite
// This is a temporary fix until we can properly compile the database.ts file
function overrideGetModules() {
  // @ts-ignore
  global.getModules = getModulesSQLite;
}

const app: express.Application = express();
const PORT = process.env.PORT || 3001;

// Create scheduler instance
const scheduler = new Scheduler();

// Configure CORS to allow credentials
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:8081'],
  credentials: true
}));

app.use(express.json());

// Add LLM module routes to match frontend expectations BEFORE mounting reindex router
app.get('/llm/modules', async (req, res) => {
  try {
    console.log('Fetching all LLM modules');
    // Get all modules
    const modules = await getModules();
    console.log(`Found ${modules.length} modules`);
    
    // Transform modules to match LLM format expected by frontend
    const transformedModules = modules.map((module: any) => ({
      id: module.id,
      module: module.module || module.title,
      category: module.category || 'General',
      topic: module.topic || module.title,
      sector: module.sector || 'Business',
      steps: module.steps || [],
      requirements: module.requirements || [],
      validation: module.validation || [],
      language: module.language || 'en',
      lastUpdated: module.lastUpdated || module.updated_at || new Date().toISOString(),
      source: module.source || module.source_url,
      version: module.version || '1.0',
      title: module.title,
      source_url: module.source_url,
      updated_at: module.updated_at,
      source_body: module.source_body,
      content: module.source_body || module.content
    }));
    
    res.json({
      success: true,
      data: transformedModules
    });
  } catch (error) {
    console.error('Error fetching LLM modules:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch modules'
    });
  }
});

app.get('/llm/module/:id', async (req, res) => {
  try {
    console.log(`Fetching LLM module with ID: ${req.params.id}`);
    const module = await getModuleById(req.params.id);
    if (!module) {
      return res.status(404).json({
        success: false,
        error: 'Module not found'
      });
    }
    
    // Transform module to match LLM format expected by frontend
    const transformedModule = {
      id: module.id,
      module: module.module || module.title,
      category: module.category || 'General',
      topic: module.topic || module.title,
      sector: module.sector || 'Business',
      steps: module.steps || [],
      requirements: module.requirements || [],
      validation: module.validation || [],
      language: module.language || 'en',
      lastUpdated: module.lastUpdated || module.updated_at || new Date().toISOString(),
      source: module.source || module.source_url,
      version: module.version || '1.0',
      title: module.title,
      source_url: module.source_url,
      updated_at: module.updated_at,
      source_body: module.source_body,
      content: module.source_body || module.content,
      workflows: module.workflows || [],
      tags: module.tags || [],
      sector_tags: module.sector_tags || [],
      required_documents: module.required_documents || module.requirements || [],
      common_errors: module.common_errors || [],
      faqs: module.faqs || [],
      examples: module.examples || [],
      screenshots: module.screenshots || []
    };
    
    res.json({
      success: true,
      data: transformedModule
    });
  } catch (error) {
    console.error('Error fetching LLM module:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch module'
    });
  }
});

app.get('/llm/search', async (req, res) => {
  try {
    const { query, lang, sector } = req.query;
    console.log(`Searching LLM modules with query: ${query}`);
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Query parameter is required'
      });
    }
    
    // Search modules
    const results = await searchModules(query);
    
    // Filter by language and sector if provided
    let filteredResults = results;
    if (lang && typeof lang === 'string') {
      filteredResults = filteredResults.filter((module: any) => 
        module.language === lang
      );
    }
    
    if (sector && typeof sector === 'string') {
      filteredResults = filteredResults.filter((module: any) => 
        module.sector && module.sector.toLowerCase().includes(sector.toLowerCase())
      );
    }
    
    // Transform modules to match LLM format expected by frontend
    const transformedModules = filteredResults.map((module: any) => ({
      id: module.id,
      module: module.module || module.title,
      category: module.category || 'General',
      topic: module.topic || module.title,
      sector: module.sector || 'Business',
      steps: module.steps || [],
      requirements: module.requirements || [],
      validation: module.validation || [],
      language: module.language || 'en',
      lastUpdated: module.lastUpdated || module.updated_at || new Date().toISOString(),
      source: module.source || module.source_url,
      version: module.version || '1.0',
      title: module.title,
      source_url: module.source_url,
      updated_at: module.updated_at,
      source_body: module.source_body,
      content: module.source_body || module.content
    }));
    
    res.json({
      success: true,
      data: transformedModules
    });
  } catch (error) {
    console.error('Error searching LLM modules:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search modules'
    });
  }
});

// Serve static files from the processed directory
app.use('/processed', express.static(path.join(__dirname, '..', 'processed')));

// Mount reindex router AFTER LLM routes
app.use('/llm', reindexRouter.default);

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Authentication routes
app.post('/auth/signup', async (req, res) => {
  try {
    const { email, password, full_name } = req.body;
    
    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Create new user
    const userId = await createUser(email, full_name);
    
    // Check if user creation was successful
    if (!userId) {
      return res.status(500).json({ error: 'Failed to create user' });
    }
    
    // Assign default role
    await assignUserRole(userId, 'trainee');
    
    // Return user data
    const user = {
      id: userId,
      email,
      full_name,
      roles: ['trainee']
    };
    
    res.json({ user });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

app.post('/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // For demo purposes, we'll just check if the user exists
    // In a real application, you would verify the password
    const user = await getUserByEmail(email);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Get user roles
    const roles = await getUserRoles(user.id);
    const roleNames = roles.map((role: any) => role.role);
    
    // Return user data
    const userData = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      roles: roleNames
    };
    
    res.json({ user: userData });
  } catch (error) {
    console.error('Error signing in:', error);
    res.status(500).json({ error: 'Failed to sign in' });
  }
});

app.post('/auth/signout', (req, res) => {
  // In a real application, you would clear the session
  res.json({ message: 'Signed out successfully' });
});

app.get('/auth/current', async (req, res) => {
  // For demo purposes, return a default admin user
  const user = {
    id: 'admin-user-id',
    email: 'admin@gmail.com',
    full_name: 'System Administrator',
    roles: ['super_admin']
  };
  
  res.json({ user });
});

// Module routes
app.get('/api/modules', async (req, res) => {
  try {
    const modules = await getModules();
    res.json(modules);
  } catch (error) {
    console.error('Error fetching modules:', error);
    res.status(500).json({ error: 'Failed to fetch modules' });
  }
});

app.get('/api/modules/:id', async (req, res) => {
  try {
    const module = await getModuleById(req.params.id);
    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }
    res.json(module);
  } catch (error) {
    console.error('Error fetching module:', error);
    res.status(500).json({ error: 'Failed to fetch module' });
  }
});

app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }
    
    const results = await searchModules(q);
    res.json(results);
  } catch (error) {
    console.error('Error searching modules:', error);
    res.status(500).json({ error: 'Failed to search modules' });
  }
});

// Learning progress routes
app.get('/api/progress/:userId/:moduleId', async (req, res) => {
  try {
    const { userId, moduleId } = req.params;
    const progress = await getLearningProgressByUserAndModule(userId, moduleId);
    res.json(progress);
  } catch (error) {
    console.error('Error fetching learning progress:', error);
    res.status(500).json({ error: 'Failed to fetch learning progress' });
  }
});

app.get('/api/progress/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const progress = await getLearningProgressByUser(userId);
    res.json(progress);
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({ error: 'Failed to fetch user progress' });
  }
});

app.post('/api/progress', async (req, res) => {
  try {
    const { userId, moduleId, progressData } = req.body;
    if (!userId || !moduleId || !progressData) {
      return res.status(400).json({ error: 'User ID, Module ID, and Progress Data are required' });
    }
    
    const result = await createOrUpdateLearningProgress(userId, moduleId, progressData);
    res.json(result);
  } catch (error) {
    console.error('Error updating learning progress:', error);
    res.status(500).json({ error: 'Failed to update learning progress' });
  }
});

// Quiz routes
app.post('/api/quiz/generate', async (req, res) => {
  try {
    const { moduleId } = req.body;
    if (!moduleId) {
      return res.status(400).json({ error: 'Module ID is required' });
    }
    
    const quizGenerator = new QuizGenerator();
    // Fix the method call to use static method
    const quiz = await QuizGenerator.generateQuiz(moduleId);
    res.json(quiz);
  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).json({ error: 'Failed to generate quiz' });
  }
});

// Session routes
app.get('/api/sessions', async (req, res) => {
  try {
    const sessions = await getTrainingSessions();
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching training sessions:', error);
    res.status(500).json({ error: 'Failed to fetch training sessions' });
  }
});

app.get('/api/sessions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const sessions = await getUserSessions(userId);
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching user sessions:', error);
    res.status(500).json({ error: 'Failed to fetch user sessions' });
  }
});

app.post('/api/sessions/:sessionId/register', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const result = await registerForSession(sessionId, userId);
    res.json(result);
  } catch (error) {
    console.error('Error registering for session:', error);
    res.status(500).json({ error: 'Failed to register for session' });
  }
});

app.get('/api/session/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const session = await getSessionById(id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json(session);
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// Add quiz generation endpoint for LLM routes
app.post('/llm/generate/quiz', async (req, res) => {
  try {
    const { module_id } = req.body;
    if (!module_id) {
      return res.status(400).json({ 
        success: false, 
        error: 'Module ID is required' 
      });
    }
    
    // Get the module first
    const module = await getModuleById(module_id);
    if (!module) {
      return res.status(404).json({ 
        success: false, 
        error: 'Module not found' 
      });
    }
    
    // Generate quiz using QuizGenerator
    const quiz = await QuizGenerator.generateQuiz(module);
    
    res.json({
      success: true,
      data: quiz
    });
  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate quiz' 
    });
  }
});

// Start server
app.listen(PORT, async () => {
  console.log(`LLM Engine API server running on port ${PORT}`);
  
  // Initialize SQLite database
  console.log('Initializing SQLite database...');
  try {
    const success = await initSQLite();
    console.log('SQLite database initialization completed');
    
    if (success) {
      console.log('Using SQLite database for all operations');
    } else {
      console.log('Using mock database for all operations');
    }
  } catch (error) {
    console.error('SQLite database initialization failed:', error);
  }
  
  // Load processed modules into database
  console.log('Loading processed modules into database...');
  try {
    const processedDir = path.join(__dirname, '..', 'processed');
    
    if (fs.existsSync(processedDir)) {
      const files = fs.readdirSync(processedDir);
      const jsonFiles = files.filter(file => file.endsWith('-processed.json'));
      
      let allModules: any[] = [];
      
      for (const file of jsonFiles) {
        const filePath = path.join(processedDir, file);
        console.log(`Loading modules from ${file}...`);
        
        try {
          const rawData = fs.readFileSync(filePath, 'utf-8');
          const modules = JSON.parse(rawData);
          
          // Add modules to the collection
          allModules.push(...modules);
          console.log(`Loaded ${modules.length} modules from ${file}`);
        } catch (fileError) {
          console.error(`Error reading file ${file}:`, fileError);
        }
      }
      
      // Populate database with all modules
      populateMockModules(allModules);
      console.log(`Successfully loaded ${allModules.length} modules into database`);
    } else {
      console.log('No processed modules directory found');
    }
  } catch (error) {
    console.error('Error loading processed modules:', error);
  }
  
  // Initialize scrapers
  console.log('Initializing scrapers...');
  
  // Start scheduler
  console.log('Starting scheduler...');
  // scheduler.start(); // Uncomment to enable scheduler
});
