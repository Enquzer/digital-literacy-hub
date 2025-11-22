"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.mysqlPool = void 0;
exports.testMySQLConnection = testMySQLConnection;
exports.getUserById = getUserById;
exports.getUserByEmail = getUserByEmail;
exports.createUser = createUser;
exports.getUserRoles = getUserRoles;
exports.assignUserRole = assignUserRole;
exports.getCourses = getCourses;
exports.getTrainingSessions = getTrainingSessions;
exports.getUserSessions = getUserSessions;
exports.registerForSession = registerForSession;
exports.getSessionById = getSessionById;
exports.saveModule = saveModule;
exports.getModules = getModules;
exports.getModuleById = getModuleById;
exports.searchModules = searchModules;
exports.getUserCertificates = getUserCertificates;
exports.getLearningProgressByUserAndModule = getLearningProgressByUserAndModule;
exports.getLearningProgressByUser = getLearningProgressByUser;
exports.createOrUpdateLearningProgress = createOrUpdateLearningProgress;
const mysql = __importStar(require("mysql2/promise"));
// @ts-ignore
const uuid_1 = require("../utils/uuid");
// MySQL configuration
const mysqlConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'your_password',
    database: process.env.DB_NAME || 'e_learning_platform',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};
// Mock database implementation
let useMockDatabase = false;
const mockData = {
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
// Create MySQL connection pool
exports.mysqlPool = mysql.createPool(mysqlConfig);
// Test MySQL connection
async function testMySQLConnection() {
    try {
        const connection = await exports.mysqlPool.getConnection();
        console.log('MySQL database connection successful');
        connection.release();
        useMockDatabase = false;
        return true;
    }
    catch (error) {
        console.error('MySQL database connection failed:', error);
        // Implement fallback strategy for development
        if (process.env.NODE_ENV !== 'production') {
            console.log('Using mock database implementation for development');
            useMockDatabase = true;
            // Add a default admin user to mock data if it doesn't exist
            if (!mockData.profiles.find((p) => p.email === 'admin@gmail.com')) {
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
// Mock database pool implementation
const mockPool = {
    execute: async (query, params = []) => {
        console.log('Executing mock query:', query, 'with params:', params);
        // Simple mock implementation based on query type
        if (query.includes('SELECT * FROM profiles WHERE id = ?')) {
            const userId = params[0];
            const user = mockData.profiles.find((p) => p.id === userId);
            console.log('Found user by ID:', user);
            // Return in the format expected by the application: [[row1, row2, ...], ...]
            return user ? [[user], []] : [[], []];
        }
        else if (query.includes('SELECT * FROM profiles WHERE email = ?')) {
            const email = params[0];
            const user = mockData.profiles.find((p) => p.email === email);
            console.log('Found user by email:', user);
            // Return in the format expected by the application: [[row1, row2, ...], ...]
            return user ? [[user], []] : [[], []];
        }
        else if (query.includes('INSERT INTO profiles')) {
            const [userId, fullName, email] = params;
            const newUser = { id: userId, full_name: fullName, email, created_at: new Date().toISOString() };
            mockData.profiles.push(newUser);
            console.log('Created new user:', newUser);
            return [{ affectedRows: 1 }, []];
        }
        else if (query.includes('SELECT role FROM user_roles WHERE user_id = ?')) {
            const userId = params[0];
            const roles = mockData.user_roles.filter((r) => r.user_id === userId);
            console.log('Found roles for user:', userId, roles);
            // Return in the format expected by the application: [rows, ...]
            return [roles, []];
        }
        else if (query.includes('INSERT INTO user_roles')) {
            const [roleId, userId, role] = params;
            mockData.user_roles.push({ id: roleId, user_id: userId, role });
            return [{ affectedRows: 1 }, []];
        }
        else if (query.includes('SELECT * FROM courses')) {
            if (params.length > 0 && params[0] === true) {
                // Filter by is_published
                const publishedCourses = mockData.courses.filter((c) => c.is_published);
                return [publishedCourses, []];
            }
            return [mockData.courses, []];
        }
        else if (query.includes('SELECT ts.*, c.title as course_title, p.full_name as trainer_name FROM training_sessions ts')) {
            if (query.includes('LEFT JOIN session_registrations sr') && params.length >= 2) {
                // getUserSessions query
                return [mockData.training_sessions, []];
            }
            else {
                // getTrainingSessions query
                return [mockData.training_sessions, []];
            }
        }
        else if (query.includes('SELECT id FROM session_registrations WHERE session_id = ? AND user_id = ?')) {
            const [sessionId, userId] = params;
            const registration = mockData.session_registrations.find((r) => r.session_id === sessionId && r.user_id === userId);
            // Return in the format expected by the application: [[row1, row2, ...], ...]
            return registration ? [[registration], []] : [[], []];
        }
        else if (query.includes('INSERT INTO session_registrations')) {
            const [registrationId, sessionId, userId] = params;
            mockData.session_registrations.push({ id: registrationId, session_id: sessionId, user_id: userId, registered_at: new Date().toISOString() });
            return [{ affectedRows: 1 }, []];
        }
        else if (query.includes('SELECT ts.*, c.title as course_title, p.full_name as trainer_name FROM training_sessions ts WHERE ts.id = ?')) {
            const sessionId = params[0];
            const session = mockData.training_sessions.find((s) => s.id === sessionId);
            // Return in the format expected by the application: [[row1, row2, ...], ...]
            return session ? [[session], []] : [[], []];
        }
        else if (query.includes('SELECT id FROM modules WHERE id = ?')) {
            const moduleId = params[0];
            const module = mockData.modules.find((m) => m.id === moduleId);
            // Return in the format expected by the application: [[row1, row2, ...], ...]
            return module ? [[{ id: module.id }], []] : [[], []];
        }
        else if (query.includes('UPDATE modules')) {
            // Simplified update - in a real implementation we would update the module
            return [{ affectedRows: 1 }, []];
        }
        else if (query.includes('INSERT INTO modules')) {
            // Simplified insert - in a real implementation we would add the module
            return [{ affectedRows: 1 }, []];
        }
        else if (query.includes('INSERT INTO module_versions')) {
            // Simplified insert - in a real implementation we would add the module version
            return [{ affectedRows: 1 }, []];
        }
        else if (query.includes('SELECT * FROM modules ORDER BY created_at DESC LIMIT ? OFFSET ?')) {
            // Simplified pagination - return all modules
            return [mockData.modules, []];
        }
        else if (query.includes('SELECT * FROM modules WHERE id = ?')) {
            const moduleId = params[0];
            const module = mockData.modules.find((m) => m.id === moduleId);
            // Return in the format expected by the application: [[row1, row2, ...], ...]
            return module ? [[module], []] : [[], []];
        }
        else if (query.includes('SELECT * FROM modules WHERE title LIKE ? OR slug LIKE ?')) {
            const searchTerm1 = params[0].replace(/%/g, '');
            const searchTerm2 = params[1].replace(/%/g, '');
            const filteredModules = mockData.modules.filter((m) => m.title.includes(searchTerm1) || m.slug.includes(searchTerm2));
            return [filteredModules, []];
        }
        else if (query.includes('SELECT * FROM learning_progress WHERE user_id = ? AND module_id = ?')) {
            const [userId, moduleId] = params;
            const progress = mockData.learning_progress.find((p) => p.user_id === userId && p.module_id === moduleId);
            // Return in the format expected by the application: [[row1, row2, ...], ...]
            return progress ? [[progress], []] : [[], []];
        }
        else if (query.includes('SELECT lp.*, m.title as module_title FROM learning_progress lp LEFT JOIN modules m ON lp.module_id = m.id WHERE lp.user_id = ?')) {
            const userId = params[0];
            const progress = mockData.learning_progress.filter((p) => p.user_id === userId);
            // Return in the format expected by the application: [rows, ...]
            return [progress, []];
        }
        else if (query.includes('SELECT c.id, c.module_id, c.issued_at, c.expires_at, m.title as course_name, p.full_name as user_name FROM certificates c LEFT JOIN modules m ON c.module_id = m.id LEFT JOIN profiles p ON c.user_id = p.id WHERE c.user_id = ?')) {
            const userId = params[0];
            const certificates = mockData.certificates.filter((c) => c.user_id === userId);
            // Return in the format expected by the application: [rows, ...]
            return [certificates, []];
        }
        // Default empty result
        console.log('No matching mock query handler found');
        return [[], []];
    },
    getConnection: async () => {
        return {
            release: () => { }
        };
    }
};
// Override mysqlPool with mockPool if using mock database
const getPool = () => {
    console.log('Using database pool. Mock database:', useMockDatabase ? 'YES' : 'NO');
    return useMockDatabase ? mockPool : exports.mysqlPool;
};
// Update all database operations to use the appropriate pool
async function getUserById(userId) {
    try {
        const pool = getPool();
        const [rows] = await pool.execute('SELECT * FROM profiles WHERE id = ?', [userId]);
        const result = rows;
        return result.length > 0 ? result[0] : null;
    }
    catch (error) {
        console.error('Error in getUserById:', error);
        // Return null instead of throwing error to allow graceful degradation
        return null;
    }
}
async function getUserByEmail(email) {
    try {
        const pool = getPool();
        const [rows] = await pool.execute('SELECT * FROM profiles WHERE email = ?', [email]);
        const result = rows;
        return result.length > 0 ? result[0] : null;
    }
    catch (error) {
        console.error('Error in getUserByEmail:', error);
        // Return null instead of throwing error to allow graceful degradation
        return null;
    }
}
async function createUser(email, fullName) {
    try {
        const pool = getPool();
        const userId = (0, uuid_1.generateUUID)();
        await pool.execute('INSERT INTO profiles (id, full_name, email) VALUES (?, ?, ?)', [userId, fullName, email]);
        return userId;
    }
    catch (error) {
        console.error('Error in createUser:', error);
        throw error;
    }
}
async function getUserRoles(userId) {
    try {
        const pool = getPool();
        const [rows] = await pool.execute('SELECT role FROM user_roles WHERE user_id = ?', [userId]);
        return rows;
    }
    catch (error) {
        console.error('Error in getUserRoles:', error);
        // Return empty array instead of throwing error to allow graceful degradation
        return [];
    }
}
async function assignUserRole(userId, role) {
    try {
        const pool = getPool();
        const roleId = (0, uuid_1.generateUUID)();
        await pool.execute('INSERT INTO user_roles (id, user_id, role) VALUES (?, ?, ?)', [roleId, userId, role]);
    }
    catch (error) {
        console.error('Error in assignUserRole:', error);
        throw error;
    }
}
async function getCourses(isPublished = true) {
    try {
        const pool = getPool();
        let query = 'SELECT * FROM courses';
        let params = [];
        if (isPublished) {
            query += ' WHERE is_published = ?';
            params = [isPublished];
        }
        const [rows] = await pool.execute(query, params);
        return rows;
    }
    catch (error) {
        console.error('Error in getCourses:', error);
        // Return empty array instead of throwing error to allow graceful degradation
        return [];
    }
}
// Session operations
async function getTrainingSessions() {
    try {
        const pool = getPool();
        const [rows] = await pool.execute(`SELECT ts.*, c.title as course_title, p.full_name as trainer_name
       FROM training_sessions ts
       LEFT JOIN courses c ON ts.course_id = c.id
       LEFT JOIN profiles p ON ts.trainer_id = p.id
       ORDER BY ts.start_time ASC`);
        return rows;
    }
    catch (error) {
        console.error('Error in getTrainingSessions:', error);
        // Return empty array instead of throwing error to allow graceful degradation
        return [];
    }
}
async function getUserSessions(userId) {
    try {
        const pool = getPool();
        const [rows] = await pool.execute(`SELECT ts.*, c.title as course_title, p.full_name as trainer_name,
       CASE WHEN sr.user_id IS NOT NULL THEN 1 ELSE 0 END as registered,
       CASE WHEN sa.user_id IS NOT NULL THEN 1 ELSE 0 END as attended
       FROM training_sessions ts
       LEFT JOIN courses c ON ts.course_id = c.id
       LEFT JOIN profiles p ON ts.trainer_id = p.id
       LEFT JOIN session_registrations sr ON ts.id = sr.session_id AND sr.user_id = ?
       LEFT JOIN session_attendance sa ON ts.id = sa.session_id AND sa.user_id = ?
       ORDER BY ts.start_time ASC`, [userId, userId]);
        return rows;
    }
    catch (error) {
        console.error('Error in getUserSessions:', error);
        // Return empty array instead of throwing error to allow graceful degradation
        return [];
    }
}
async function registerForSession(sessionId, userId) {
    try {
        const pool = getPool();
        // Check if already registered
        const [existing] = await pool.execute('SELECT id FROM session_registrations WHERE session_id = ? AND user_id = ?', [sessionId, userId]);
        if (existing.length > 0) {
            throw new Error('Already registered for this session');
        }
        // Register for session
        const registrationId = (0, uuid_1.generateUUID)();
        await pool.execute('INSERT INTO session_registrations (id, session_id, user_id, registered_at) VALUES (?, ?, ?, NOW())', [registrationId, sessionId, userId]);
        return registrationId;
    }
    catch (error) {
        console.error('Error in registerForSession:', error);
        throw error;
    }
}
async function getSessionById(sessionId) {
    try {
        const pool = getPool();
        const [rows] = await pool.execute(`SELECT ts.*, c.title as course_title, p.full_name as trainer_name
       FROM training_sessions ts
       LEFT JOIN courses c ON ts.course_id = c.id
       LEFT JOIN profiles p ON ts.trainer_id = p.id
       WHERE ts.id = ?`, [sessionId]);
        const result = rows;
        return result.length > 0 ? result[0] : null;
    }
    catch (error) {
        console.error('Error in getSessionById:', error);
        // Return null instead of throwing error to allow graceful degradation
        return null;
    }
}
// Module operations
async function saveModule(module) {
    try {
        const pool = getPool();
        // Check if module already exists
        const [existing] = await pool.execute('SELECT id FROM modules WHERE id = ?', [module.id]);
        const existingRows = existing;
        if (existingRows.length > 0) {
            // Update existing module
            await pool.execute(`UPDATE modules SET 
         slug = ?, title = ?, source_url = ?, language = ?, version = ?, 
         status = ?, metadata = ?, updated_at = NOW()
         WHERE id = ?`, [
                module.slug,
                module.title,
                module.source_url,
                module.language,
                module.version || '1.0',
                module.status || 'published',
                JSON.stringify(module.metadata || {}),
                module.id
            ]);
        }
        else {
            // Insert new module
            await pool.execute(`INSERT INTO modules (id, slug, title, source_url, language, version, status, metadata)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
                module.id,
                module.slug,
                module.title,
                module.source_url,
                module.language,
                module.version || '1.0',
                module.status || 'published',
                JSON.stringify(module.metadata || {})
            ]);
        }
        // Save module content as JSON in module_versions table
        const versionId = (0, uuid_1.generateUUID)();
        await pool.execute(`INSERT INTO module_versions (module_id, version, path_to_json, created_at)
       VALUES (?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE path_to_json = ?`, [module.id, module.version || '1.0', JSON.stringify(module), JSON.stringify(module)]);
        return module.id;
    }
    catch (error) {
        console.error('Error in saveModule:', error);
        throw error;
    }
}
async function getModules(limit = 10, offset = 0) {
    try {
        const pool = getPool();
        const [rows] = await pool.execute('SELECT * FROM modules ORDER BY created_at DESC LIMIT ? OFFSET ?', [limit, offset]);
        return rows;
    }
    catch (error) {
        console.error('Error in getModules:', error);
        // Return empty array instead of throwing error to allow graceful degradation
        return [];
    }
}
async function getModuleById(id) {
    try {
        const pool = getPool();
        const [rows] = await pool.execute('SELECT * FROM modules WHERE id = ?', [id]);
        const result = rows;
        return result.length > 0 ? result[0] : null;
    }
    catch (error) {
        console.error('Error in getModuleById:', error);
        // Return null instead of throwing error to allow graceful degradation
        return null;
    }
}
async function searchModules(query, limit = 10) {
    try {
        const pool = getPool();
        const [rows] = await pool.execute(`SELECT * FROM modules 
       WHERE title LIKE ? OR slug LIKE ? 
       ORDER BY created_at DESC LIMIT ?`, [`%${query}%`, `%${query}%`, limit]);
        return rows;
    }
    catch (error) {
        console.error('Error in searchModules:', error);
        // Return empty array instead of throwing error to allow graceful degradation
        return [];
    }
}
// Add certificate functions
async function getUserCertificates(userId) {
    try {
        const pool = getPool();
        const [rows] = await pool.execute(`SELECT c.id, c.module_id, c.issued_at, c.expires_at, 
              m.title as course_name, p.full_name as user_name
       FROM certificates c
       LEFT JOIN modules m ON c.module_id = m.id
       LEFT JOIN profiles p ON c.user_id = p.id
       WHERE c.user_id = ?
       ORDER BY c.issued_at DESC`, [userId]);
        return rows;
    }
    catch (error) {
        console.error('Error in getUserCertificates:', error);
        // Return empty array instead of throwing error to allow graceful degradation
        return [];
    }
}
// Add learning progress functions
async function getLearningProgressByUserAndModule(userId, moduleId) {
    try {
        const pool = getPool();
        const [rows] = await pool.execute(`SELECT * FROM learning_progress 
       WHERE user_id = ? AND module_id = ?`, [userId, moduleId]);
        const result = rows;
        return result.length > 0 ? result[0] : null;
    }
    catch (error) {
        console.error('Error in getLearningProgressByUserAndModule:', error);
        // Return null instead of throwing error to allow graceful degradation
        return null;
    }
}
async function getLearningProgressByUser(userId) {
    try {
        const pool = getPool();
        const [rows] = await pool.execute(`SELECT lp.*, m.title as module_title
       FROM learning_progress lp
       LEFT JOIN modules m ON lp.module_id = m.id
       WHERE lp.user_id = ?
       ORDER BY lp.last_accessed DESC`, [userId]);
        return rows;
    }
    catch (error) {
        console.error('Error in getLearningProgressByUser:', error);
        // Return empty array instead of throwing error to allow graceful degradation
        return [];
    }
}
// Add function to create or update learning progress
async function createOrUpdateLearningProgress(userId, moduleId, progressData) {
    try {
        const pool = getPool();
        // Check if progress record already exists
        const [existingRows] = await pool.execute(`SELECT id FROM learning_progress 
       WHERE user_id = ? AND module_id = ?`, [userId, moduleId]);
        const existing = existingRows;
        if (existing.length > 0) {
            // Update existing progress
            const updates = [];
            const values = [];
            // Build dynamic update query based on provided progressData
            if (progressData.status !== undefined) {
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
            updates.push('last_accessed = NOW()');
            // If status is completed, set completed_at
            if (progressData.status === 'completed') {
                updates.push('completed_at = NOW()');
            }
            values.push(userId, moduleId);
            await pool.execute(`UPDATE learning_progress 
         SET ${updates.join(', ')}
         WHERE user_id = ? AND module_id = ?`, values);
            return { success: true, created: false };
        }
        else {
            // Create new progress record
            const progressId = (0, uuid_1.generateUUID)();
            const status = progressData.status || 'not_started';
            const progressPercentage = progressData.progress_percentage || 0;
            const timeSpentSeconds = progressData.time_spent_seconds || 0;
            const quizScore = progressData.quiz_score || null;
            const completedAt = status === 'completed' ? 'NOW()' : null;
            await pool.execute(`INSERT INTO learning_progress 
         (id, user_id, module_id, status, progress_percentage, time_spent_seconds, quiz_score, completed_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ${completedAt ? completedAt : 'NULL'})`, [progressId, userId, moduleId, status, progressPercentage, timeSpentSeconds, quizScore]);
            return { success: true, created: true };
        }
    }
    catch (error) {
        console.error('Error in createOrUpdateLearningProgress:', error);
        throw error;
    }
}
// Add debug logging to see if functions are being loaded
console.log('Database module loaded, functions available:');
console.log('- getLearningProgressByUserAndModule:', typeof getLearningProgressByUserAndModule);
console.log('- getLearningProgressByUser:', typeof getLearningProgressByUser);
console.log('- createOrUpdateLearningProgress:', typeof createOrUpdateLearningProgress);
console.log('- getUserCertificates:', typeof getUserCertificates);
