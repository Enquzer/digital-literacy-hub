"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSQLite = initSQLite;
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
exports.populateMockModules = populateMockModules;
var sqlite3 = require("sqlite3");
var sqlite_1 = require("sqlite");
var uuid_1 = require("../utils/uuid");
// SQLite configuration
var sqliteConfig = {
    filename: './db/e_learning_platform.db',
    driver: sqlite3.Database
};
// Database connection
var db = null;
var useMockDatabase = false;
// Mock database implementation (fallback)
var mockData = {
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
function initSQLite() {
    return __awaiter(this, void 0, void 0, function () {
        var fs, path, dbDir, error_1, adminUserId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    console.log('Attempting to initialize SQLite database...');
                    fs = require('fs');
                    path = require('path');
                    dbDir = path.dirname(sqliteConfig.filename);
                    if (!fs.existsSync(dbDir)) {
                        console.log("Creating database directory: ".concat(dbDir));
                        fs.mkdirSync(dbDir, { recursive: true });
                    }
                    return [4 /*yield*/, (0, sqlite_1.open)(sqliteConfig)];
                case 1:
                    db = _a.sent();
                    console.log('SQLite database connection successful');
                    // Create tables if they don't exist
                    return [4 /*yield*/, createTables()];
                case 2:
                    // Create tables if they don't exist
                    _a.sent();
                    useMockDatabase = false;
                    console.log('SQLite database initialized successfully');
                    return [2 /*return*/, true];
                case 3:
                    error_1 = _a.sent();
                    console.error('SQLite database connection failed:', error_1);
                    // Implement fallback strategy for development
                    if (process.env.NODE_ENV !== 'production') {
                        console.log('Using mock database implementation for development');
                        useMockDatabase = true;
                        // Add a default admin user to mock data if it doesn't exist
                        if (!mockData.profiles.find(function (p) { return p.email === 'admin@gmail.com'; })) {
                            adminUserId = 'admin-user-id';
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
                        return [2 /*return*/, false];
                    }
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Create tables
function createTables() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!db)
                        return [2 /*return*/];
                    // Create profiles table
                    return [4 /*yield*/, db.exec("\n    CREATE TABLE IF NOT EXISTS profiles (\n      id TEXT PRIMARY KEY,\n      full_name TEXT NOT NULL,\n      email TEXT UNIQUE NOT NULL,\n      created_at TEXT DEFAULT CURRENT_TIMESTAMP\n    )\n  ")];
                case 1:
                    // Create profiles table
                    _a.sent();
                    // Create user_roles table
                    return [4 /*yield*/, db.exec("\n    CREATE TABLE IF NOT EXISTS user_roles (\n      id TEXT PRIMARY KEY,\n      user_id TEXT NOT NULL,\n      role TEXT NOT NULL,\n      FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE\n    )\n  ")];
                case 2:
                    // Create user_roles table
                    _a.sent();
                    // Create courses table
                    return [4 /*yield*/, db.exec("\n    CREATE TABLE IF NOT EXISTS courses (\n      id TEXT PRIMARY KEY,\n      title TEXT NOT NULL,\n      description TEXT,\n      platform TEXT,\n      is_published BOOLEAN DEFAULT 1,\n      created_at TEXT DEFAULT CURRENT_TIMESTAMP,\n      updated_at TEXT DEFAULT CURRENT_TIMESTAMP\n    )\n  ")];
                case 3:
                    // Create courses table
                    _a.sent();
                    // Create modules table
                    return [4 /*yield*/, db.exec("\n    CREATE TABLE IF NOT EXISTS modules (\n      id TEXT PRIMARY KEY,\n      slug TEXT,\n      title TEXT NOT NULL,\n      source_url TEXT,\n      language TEXT,\n      version TEXT,\n      status TEXT DEFAULT 'published',\n      metadata TEXT,\n      source_body TEXT,\n      content TEXT,\n      module TEXT,\n      category TEXT,\n      topic TEXT,\n      sector TEXT,\n      steps TEXT,\n      requirements TEXT,\n      validation TEXT,\n      workflows TEXT,\n      tags TEXT,\n      sector_tags TEXT,\n      required_documents TEXT,\n      common_errors TEXT,\n      faqs TEXT,\n      examples TEXT,\n      screenshots TEXT,\n      created_at TEXT DEFAULT CURRENT_TIMESTAMP,\n      updated_at TEXT DEFAULT CURRENT_TIMESTAMP\n    )\n  ")];
                case 4:
                    // Create modules table
                    _a.sent();
                    // Create learning_progress table
                    return [4 /*yield*/, db.exec("\n    CREATE TABLE IF NOT EXISTS learning_progress (\n      id TEXT PRIMARY KEY,\n      user_id TEXT NOT NULL,\n      module_id TEXT NOT NULL,\n      status TEXT DEFAULT 'not_started',\n      progress_percentage INTEGER DEFAULT 0,\n      time_spent_seconds INTEGER DEFAULT 0,\n      last_accessed TEXT DEFAULT CURRENT_TIMESTAMP,\n      completed_at TEXT NULL,\n      quiz_score REAL NULL,\n      UNIQUE(user_id, module_id),\n      FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE,\n      FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE\n    )\n  ")];
                case 5:
                    // Create learning_progress table
                    _a.sent();
                    // Create module_versions table
                    return [4 /*yield*/, db.exec("\n    CREATE TABLE IF NOT EXISTS module_versions (\n      id TEXT PRIMARY KEY,\n      module_id TEXT NOT NULL,\n      version TEXT NOT NULL,\n      content TEXT,\n      created_at TEXT DEFAULT CURRENT_TIMESTAMP,\n      FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE\n    )\n  ")];
                case 6:
                    // Create module_versions table
                    _a.sent();
                    console.log('Database tables created or already exist');
                    return [2 /*return*/];
            }
        });
    });
}
// Mock database pool implementation
var mockPool = {
    execute: function (query_1) {
        var args_1 = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args_1[_i - 1] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([query_1], args_1, true), void 0, function (query, params) {
            var userId_1, moduleId_1, progress, userId_2, moduleId_2, progress, progressId, userId, moduleId, status_1, progressPercentage, timeSpentSeconds, quizScore, completedAt, newProgress, userId_3, moduleId_3, progress, userId_4, user, email_1, user, userId, fullName, email, newUser, userId_5, roles, roleId, userId, role, sessionId_1, session, moduleId_4, module_1, moduleId_5, module_2, searchTerm1_1, searchTerm2_1, filteredModules, userId_6, moduleId_6, progress, userId_7, progress, userId_8, certificates;
            if (params === void 0) { params = []; }
            return __generator(this, function (_a) {
                console.log('Executing mock query:', query, 'with params:', params);
                // Simple mock implementation based on query type
                console.log('Query debug - raw query:', JSON.stringify(query));
                console.log('Query debug - normalized query:', JSON.stringify(query.replace(/\s+/g, ' ').trim()));
                // Check for learning progress queries with exact matching
                // Handle SELECT query for specific user and module progress
                if (query.replace(/\s+/g, ' ').trim() === 'SELECT * FROM learning_progress WHERE user_id = ? AND module_id = ?') {
                    userId_1 = params[0];
                    moduleId_1 = params[1];
                    console.log('Searching for progress with userId:', userId_1, 'moduleId:', moduleId_1);
                    console.log('Available progress records:', mockData.learning_progress);
                    progress = mockData.learning_progress.find(function (p) { return p.user_id === userId_1 && p.module_id === moduleId_1; });
                    // Return in the format expected by the application: [[row1, row2, ...], ...]
                    console.log('Found learning progress:', progress);
                    return [2 /*return*/, progress ? [[progress], []] : [[], []]];
                }
                else if (query.replace(/\s+/g, ' ').trim() === 'SELECT id FROM learning_progress WHERE user_id = ? AND module_id = ?') {
                    userId_2 = params[0];
                    moduleId_2 = params[1];
                    progress = mockData.learning_progress.find(function (p) { return p.user_id === userId_2 && p.module_id === moduleId_2; });
                    // Return in the format expected by the application: [[row1, row2, ...], ...]
                    console.log('Found learning progress:', progress);
                    return [2 /*return*/, progress ? [[progress], []] : [[], []]];
                }
                else if (query.replace(/\s+/g, ' ').trim() === 'INSERT INTO learning_progress (id, user_id, module_id, status, progress_percentage, time_spent_seconds, quiz_score, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)') {
                    progressId = params[0];
                    userId = params[1];
                    moduleId = params[2];
                    status_1 = params[3];
                    progressPercentage = params[4];
                    timeSpentSeconds = params[5];
                    quizScore = params[6];
                    completedAt = params[7];
                    newProgress = {
                        id: progressId,
                        user_id: userId,
                        module_id: moduleId,
                        status: status_1,
                        progress_percentage: progressPercentage,
                        time_spent_seconds: timeSpentSeconds,
                        quiz_score: quizScore,
                        last_accessed: new Date().toISOString(),
                        completed_at: completedAt || (status_1 === 'completed' ? new Date().toISOString() : null)
                    };
                    mockData.learning_progress.push(newProgress);
                    console.log('Created new learning progress:', newProgress);
                    return [2 /*return*/, [{ affectedRows: 1 }, []]];
                }
                else if (query.includes('SELECT * FROM learning_progress') && query.includes('user_id = ? AND module_id = ?')) {
                    userId_3 = params[0];
                    moduleId_3 = params[1];
                    progress = mockData.learning_progress.find(function (p) { return p.user_id === userId_3 && p.module_id === moduleId_3; });
                    // Return in the format expected by the application: [[row1, row2, ...], ...]
                    console.log('Found learning progress:', progress);
                    return [2 /*return*/, progress ? [[progress], []] : [[], []]];
                }
                // User queries
                else if (query.includes('SELECT * FROM profiles WHERE id = ?')) {
                    userId_4 = params[0];
                    user = mockData.profiles.find(function (p) { return p.id === userId_4; });
                    console.log('Found user by ID:', user);
                    // Return in the format expected by the application: [[row1, row2, ...], ...]
                    return [2 /*return*/, user ? [[user], []] : [[], []]];
                }
                else if (query.includes('SELECT * FROM profiles WHERE email = ?')) {
                    email_1 = params[0];
                    user = mockData.profiles.find(function (p) { return p.email === email_1; });
                    console.log('Found user by email:', user);
                    // Return in the format expected by the application: [[row1, row2, ...], ...]
                    return [2 /*return*/, user ? [[user], []] : [[], []]];
                }
                else if (query.includes('INSERT INTO profiles')) {
                    userId = params[0], fullName = params[1], email = params[2];
                    newUser = { id: userId, full_name: fullName, email: email, created_at: new Date().toISOString() };
                    mockData.profiles.push(newUser);
                    console.log('Created new user:', newUser);
                    return [2 /*return*/, [{ affectedRows: 1 }, []]];
                }
                // User roles queries
                else if (query.includes('SELECT role FROM user_roles WHERE user_id = ?')) {
                    userId_5 = params[0];
                    roles = mockData.user_roles.filter(function (r) { return r.user_id === userId_5; });
                    console.log('Found roles for user:', userId_5, roles);
                    // Return in the format expected by the application: [rows, ...]
                    return [2 /*return*/, [roles, []]];
                }
                else if (query.includes('INSERT INTO user_roles')) {
                    roleId = params[0], userId = params[1], role = params[2];
                    mockData.user_roles.push({ id: roleId, user_id: userId, role: role });
                    return [2 /*return*/, [{ affectedRows: 1 }, []]];
                }
                // Courses queries
                else if (query.includes('SELECT * FROM courses')) {
                    return [2 /*return*/, [mockData.courses, []]];
                }
                else if (query.includes('INSERT INTO courses')) {
                    // Simplified insert - in a real implementation we would add the course
                    return [2 /*return*/, [{ affectedRows: 1 }, []]];
                }
                // Training sessions queries
                else if (query.includes('SELECT * FROM training_sessions')) {
                    return [2 /*return*/, [mockData.training_sessions, []]];
                }
                else if (query.includes('SELECT ts.*, c.title as course_title, p.full_name as trainer_name FROM training_sessions ts WHERE ts.id = ?')) {
                    sessionId_1 = params[0];
                    session = mockData.training_sessions.find(function (s) { return s.id === sessionId_1; });
                    // Return in the format expected by the application: [[row1, row2, ...], ...]
                    return [2 /*return*/, session ? [[session], []] : [[], []]];
                }
                // Modules queries
                else if (query.includes('SELECT id FROM modules WHERE id = ?')) {
                    moduleId_4 = params[0];
                    module_1 = mockData.modules.find(function (m) { return m.id === moduleId_4; });
                    // Return in the format expected by the application: [[row1, row2, ...], ...]
                    return [2 /*return*/, module_1 ? [[{ id: module_1.id }], []] : [[], []]];
                }
                else if (query.includes('UPDATE modules')) {
                    // Simplified update - in a real implementation we would update the module
                    return [2 /*return*/, [{ affectedRows: 1 }, []]];
                }
                else if (query.includes('INSERT INTO modules')) {
                    // Simplified insert - in a real implementation we would add the module
                    return [2 /*return*/, [{ affectedRows: 1 }, []]];
                }
                else if (query.includes('INSERT INTO module_versions')) {
                    // Simplified insert - in a real implementation we would add the module version
                    return [2 /*return*/, [{ affectedRows: 1 }, []]];
                }
                else if (query.includes('SELECT * FROM modules ORDER BY created_at DESC LIMIT ? OFFSET ?')) {
                    // Simplified pagination - return all modules
                    return [2 /*return*/, [mockData.modules, []]];
                }
                else if (query.includes('SELECT * FROM modules WHERE id = ?')) {
                    moduleId_5 = params[0];
                    module_2 = mockData.modules.find(function (m) { return m.id === moduleId_5; });
                    // Return in the format expected by the application: [[row1, row2, ...], ...]
                    return [2 /*return*/, module_2 ? [[module_2], []] : [[], []]];
                }
                else if (query.includes('SELECT * FROM modules WHERE title LIKE ? OR slug LIKE ?')) {
                    searchTerm1_1 = params[0].replace(/%/g, '');
                    searchTerm2_1 = params[1].replace(/%/g, '');
                    filteredModules = mockData.modules.filter(function (m) {
                        return m.title.includes(searchTerm1_1) || m.slug.includes(searchTerm2_1);
                    });
                    return [2 /*return*/, [filteredModules, []]];
                }
                // Learning progress queries (more specific patterns)
                else if (query.includes('SELECT * FROM learning_progress WHERE user_id = ? AND module_id = ?')) {
                    userId_6 = params[0], moduleId_6 = params[1];
                    progress = mockData.learning_progress.find(function (p) { return p.user_id === userId_6 && p.module_id === moduleId_6; });
                    // Return in the format expected by the application: [[row1, row2, ...], ...]
                    return [2 /*return*/, progress ? [[progress], []] : [[], []]];
                }
                else if (query.includes('SELECT lp.*, m.title as module_title FROM learning_progress lp LEFT JOIN modules m ON lp.module_id = m.id WHERE lp.user_id = ?')) {
                    userId_7 = params[0];
                    progress = mockData.learning_progress.filter(function (p) { return p.user_id === userId_7; });
                    // Return in the format expected by the application: [rows, ...]
                    return [2 /*return*/, [progress, []]];
                }
                // Certificates queries
                else if (query.includes('SELECT c.id, c.module_id, c.issued_at, c.expires_at, m.title as course_name, p.full_name as user_name FROM certificates c LEFT JOIN modules m ON c.module_id = m.id LEFT JOIN profiles p ON c.user_id = p.id WHERE c.user_id = ?')) {
                    userId_8 = params[0];
                    certificates = mockData.certificates.filter(function (c) { return c.user_id === userId_8; });
                    // Return in the format expected by the application: [rows, ...]
                    return [2 /*return*/, [certificates, []]];
                }
                // Default empty result
                console.log('No matching mock query handler found');
                return [2 /*return*/, [[], []]];
            });
        });
    },
    getConnection: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, {
                    release: function () { }
                }];
        });
    }); }
};
// Get appropriate database pool
var getPool = function () {
    console.log('Using database pool. Mock database:', useMockDatabase ? 'YES' : 'NO');
    return useMockDatabase ? mockPool : {
        execute: function (query_1) {
            var args_1 = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args_1[_i - 1] = arguments[_i];
            }
            return __awaiter(void 0, __spreadArray([query_1], args_1, true), void 0, function (query, params) {
                var result, result, result, error_2;
                if (params === void 0) { params = []; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!db) {
                                throw new Error('Database not initialized');
                            }
                            console.log('Executing SQLite query:', query, 'with params:', params);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 8, , 9]);
                            if (!query.trim().toUpperCase().startsWith('SELECT')) return [3 /*break*/, 3];
                            return [4 /*yield*/, db.all(query, params)];
                        case 2:
                            result = _a.sent();
                            console.log('Query result:', result);
                            return [2 /*return*/, [result, []]];
                        case 3:
                            if (!(query.trim().toUpperCase().startsWith('INSERT') ||
                                query.trim().toUpperCase().startsWith('UPDATE') ||
                                query.trim().toUpperCase().startsWith('DELETE'))) return [3 /*break*/, 5];
                            return [4 /*yield*/, db.run(query, params)];
                        case 4:
                            result = _a.sent();
                            console.log('Query result:', result);
                            return [2 /*return*/, [result, []]];
                        case 5: return [4 /*yield*/, db.exec(query)];
                        case 6:
                            result = _a.sent();
                            console.log('Query executed');
                            return [2 /*return*/, [result, []]];
                        case 7: return [3 /*break*/, 9];
                        case 8:
                            error_2 = _a.sent();
                            console.error('SQLite query error:', error_2);
                            throw error_2;
                        case 9: return [2 /*return*/];
                    }
                });
            });
        }
    };
};
// Test database connection
function testMySQLConnection() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, initSQLite()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
// Database operations
function getUserById(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var pool, rows, result, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    pool = getPool();
                    return [4 /*yield*/, pool.execute('SELECT * FROM profiles WHERE id = ?', [userId])];
                case 1:
                    rows = (_a.sent())[0];
                    result = rows;
                    return [2 /*return*/, result.length > 0 ? result[0] : null];
                case 2:
                    error_3 = _a.sent();
                    console.error('Error in getUserById:', error_3);
                    // Return null instead of throwing error to allow graceful degradation
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function () {
        var pool, rows, result, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    pool = getPool();
                    return [4 /*yield*/, pool.execute('SELECT * FROM profiles WHERE email = ?', [email])];
                case 1:
                    rows = (_a.sent())[0];
                    result = rows;
                    return [2 /*return*/, result.length > 0 ? result[0] : null];
                case 2:
                    error_4 = _a.sent();
                    console.error('Error in getUserByEmail:', error_4);
                    // Return null instead of throwing error to allow graceful degradation
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function createUser(email, fullName) {
    return __awaiter(this, void 0, void 0, function () {
        var pool, userId, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    pool = getPool();
                    userId = (0, uuid_1.generateUUID)();
                    return [4 /*yield*/, pool.execute('INSERT INTO profiles (id, full_name, email) VALUES (?, ?, ?)', [userId, fullName, email])];
                case 1:
                    _a.sent();
                    return [2 /*return*/, userId];
                case 2:
                    error_5 = _a.sent();
                    console.error('Error in createUser:', error_5);
                    // Return null instead of throwing error to allow graceful degradation
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getUserRoles(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var pool, rows, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    pool = getPool();
                    return [4 /*yield*/, pool.execute('SELECT role FROM user_roles WHERE user_id = ?', [userId])];
                case 1:
                    rows = (_a.sent())[0];
                    return [2 /*return*/, rows];
                case 2:
                    error_6 = _a.sent();
                    console.error('Error in getUserRoles:', error_6);
                    // Return empty array instead of throwing error to allow graceful degradation
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function assignUserRole(userId, role) {
    return __awaiter(this, void 0, void 0, function () {
        var pool, roleId, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    pool = getPool();
                    roleId = (0, uuid_1.generateUUID)();
                    return [4 /*yield*/, pool.execute('INSERT INTO user_roles (id, user_id, role) VALUES (?, ?, ?)', [roleId, userId, role])];
                case 1:
                    _a.sent();
                    return [2 /*return*/, true];
                case 2:
                    error_7 = _a.sent();
                    console.error('Error in assignUserRole:', error_7);
                    // Return false instead of throwing error to allow graceful degradation
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getCourses() {
    return __awaiter(this, arguments, void 0, function (isPublished) {
        var pool, rows, error_8;
        if (isPublished === void 0) { isPublished = true; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    pool = getPool();
                    return [4 /*yield*/, pool.execute('SELECT * FROM courses WHERE is_published = ? ORDER BY created_at DESC', [isPublished ? 1 : 0])];
                case 1:
                    rows = (_a.sent())[0];
                    return [2 /*return*/, rows];
                case 2:
                    error_8 = _a.sent();
                    console.error('Error in getCourses:', error_8);
                    // Return empty array instead of throwing error to allow graceful degradation
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getTrainingSessions() {
    return __awaiter(this, void 0, void 0, function () {
        var pool, rows, error_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    pool = getPool();
                    return [4 /*yield*/, pool.execute("SELECT ts.*, c.title as course_title, p.full_name as trainer_name \n       FROM training_sessions ts \n       LEFT JOIN courses c ON ts.course_id = c.id \n       LEFT JOIN profiles p ON ts.trainer_id = p.id \n       ORDER BY ts.scheduled_for DESC")];
                case 1:
                    rows = (_a.sent())[0];
                    return [2 /*return*/, rows];
                case 2:
                    error_9 = _a.sent();
                    console.error('Error in getTrainingSessions:', error_9);
                    // Return empty array instead of throwing error to allow graceful degradation
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getUserSessions(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var pool, rows, error_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    pool = getPool();
                    return [4 /*yield*/, pool.execute("SELECT ts.*, c.title as course_title, p.full_name as trainer_name \n       FROM session_registrations sr\n       JOIN training_sessions ts ON sr.session_id = ts.id\n       LEFT JOIN courses c ON ts.course_id = c.id \n       LEFT JOIN profiles p ON ts.trainer_id = p.id \n       WHERE sr.user_id = ?\n       ORDER BY ts.scheduled_for DESC", [userId])];
                case 1:
                    rows = (_a.sent())[0];
                    return [2 /*return*/, rows];
                case 2:
                    error_10 = _a.sent();
                    console.error('Error in getUserSessions:', error_10);
                    // Return empty array instead of throwing error to allow graceful degradation
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function registerForSession(sessionId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var pool, registrationId, error_11;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    pool = getPool();
                    registrationId = (0, uuid_1.generateUUID)();
                    return [4 /*yield*/, pool.execute('INSERT INTO session_registrations (id, session_id, user_id) VALUES (?, ?, ?)', [registrationId, sessionId, userId])];
                case 1:
                    _a.sent();
                    return [2 /*return*/, { success: true }];
                case 2:
                    error_11 = _a.sent();
                    console.error('Error in registerForSession:', error_11);
                    // Return error object instead of throwing error to allow graceful degradation
                    return [2 /*return*/, { success: false, error: 'Failed to register for session' }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getSessionById(sessionId) {
    return __awaiter(this, void 0, void 0, function () {
        var pool, rows, result, error_12;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    pool = getPool();
                    return [4 /*yield*/, pool.execute("SELECT ts.*, c.title as course_title, p.full_name as trainer_name \n       FROM training_sessions ts \n       LEFT JOIN courses c ON ts.course_id = c.id \n       LEFT JOIN profiles p ON ts.trainer_id = p.id \n       WHERE ts.id = ?", [sessionId])];
                case 1:
                    rows = (_a.sent())[0];
                    result = rows;
                    return [2 /*return*/, result.length > 0 ? result[0] : null];
                case 2:
                    error_12 = _a.sent();
                    console.error('Error in getSessionById:', error_12);
                    // Return null instead of throwing error to allow graceful degradation
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function saveModule(module) {
    return __awaiter(this, void 0, void 0, function () {
        var pool, moduleData, existing, existingRows, error_13;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    pool = getPool();
                    moduleData = __assign(__assign({}, module), { metadata: module.metadata ? JSON.stringify(module.metadata) : null, steps: module.steps ? JSON.stringify(module.steps) : null, requirements: module.requirements ? JSON.stringify(module.requirements) : null, validation: module.validation ? JSON.stringify(module.validation) : null, workflows: module.workflows ? JSON.stringify(module.workflows) : null, tags: module.tags ? JSON.stringify(module.tags) : null, sector_tags: module.sector_tags ? JSON.stringify(module.sector_tags) : null, required_documents: module.required_documents ? JSON.stringify(module.required_documents) : null, common_errors: module.common_errors ? JSON.stringify(module.common_errors) : null, faqs: module.faqs ? JSON.stringify(module.faqs) : null, examples: module.examples ? JSON.stringify(module.examples) : null, screenshots: module.screenshots ? JSON.stringify(module.screenshots) : null, content: module.content ? JSON.stringify(module.content) : null, source_body: module.source_body ? JSON.stringify(module.source_body) : null });
                    return [4 /*yield*/, pool.execute('SELECT id FROM modules WHERE id = ?', [module.id])];
                case 1:
                    existing = (_a.sent())[0];
                    existingRows = existing;
                    if (!(existingRows.length > 0)) return [3 /*break*/, 3];
                    // Update existing module
                    return [4 /*yield*/, pool.execute("UPDATE modules SET \n         slug = ?, title = ?, source_url = ?, language = ?, version = ?, \n         status = ?, metadata = ?, updated_at = CURRENT_TIMESTAMP,\n         module = ?, category = ?, topic = ?, sector = ?, steps = ?,\n         requirements = ?, validation = ?, workflows = ?, tags = ?,\n         sector_tags = ?, required_documents = ?, common_errors = ?,\n         faqs = ?, examples = ?, screenshots = ?, content = ?, source_body = ?\n         WHERE id = ?", [
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
                        ])];
                case 2:
                    // Update existing module
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3: 
                // Insert new module
                return [4 /*yield*/, pool.execute("INSERT INTO modules (id, slug, title, source_url, language, version, status, metadata,\n         module, category, topic, sector, steps, requirements, validation, workflows, tags,\n         sector_tags, required_documents, common_errors, faqs, examples, screenshots, content, source_body)\n         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
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
                    ])];
                case 4:
                    // Insert new module
                    _a.sent();
                    _a.label = 5;
                case 5: return [2 /*return*/, { success: true }];
                case 6:
                    error_13 = _a.sent();
                    console.error('Error in saveModule:', error_13);
                    throw error_13;
                case 7: return [2 /*return*/];
            }
        });
    });
}
function getModules() {
    return __awaiter(this, arguments, void 0, function (limit, offset) {
        var pool, rows, modules, error_14;
        if (limit === void 0) { limit = 10; }
        if (offset === void 0) { offset = 0; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    pool = getPool();
                    return [4 /*yield*/, pool.execute('SELECT * FROM modules ORDER BY created_at DESC LIMIT ? OFFSET ?', [limit, offset])];
                case 1:
                    rows = (_a.sent())[0];
                    modules = rows.map(function (row) { return (__assign(__assign({}, row), { metadata: row.metadata ? JSON.parse(row.metadata) : null, steps: row.steps ? JSON.parse(row.steps) : null, requirements: row.requirements ? JSON.parse(row.requirements) : null, validation: row.validation ? JSON.parse(row.validation) : null, workflows: row.workflows ? JSON.parse(row.workflows) : null, tags: row.tags ? JSON.parse(row.tags) : null, sector_tags: row.sector_tags ? JSON.parse(row.sector_tags) : null, required_documents: row.required_documents ? JSON.parse(row.required_documents) : null, common_errors: row.common_errors ? JSON.parse(row.common_errors) : null, faqs: row.faqs ? JSON.parse(row.faqs) : null, examples: row.examples ? JSON.parse(row.examples) : null, screenshots: row.screenshots ? JSON.parse(row.screenshots) : null, content: row.content ? JSON.parse(row.content) : null, source_body: row.source_body ? JSON.parse(row.source_body) : null })); });
                    return [2 /*return*/, modules];
                case 2:
                    error_14 = _a.sent();
                    console.error('Error in getModules:', error_14);
                    // Return empty array instead of throwing error to allow graceful degradation
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getModuleById(id) {
    return __awaiter(this, void 0, void 0, function () {
        var pool, rows, result, row, error_15;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    pool = getPool();
                    return [4 /*yield*/, pool.execute('SELECT * FROM modules WHERE id = ?', [id])];
                case 1:
                    rows = (_a.sent())[0];
                    result = rows;
                    if (result.length > 0) {
                        row = result[0];
                        // Parse JSON fields back to objects
                        return [2 /*return*/, __assign(__assign({}, row), { metadata: row.metadata ? JSON.parse(row.metadata) : null, steps: row.steps ? JSON.parse(row.steps) : null, requirements: row.requirements ? JSON.parse(row.requirements) : null, validation: row.validation ? JSON.parse(row.validation) : null, workflows: row.workflows ? JSON.parse(row.workflows) : null, tags: row.tags ? JSON.parse(row.tags) : null, sector_tags: row.sector_tags ? JSON.parse(row.sector_tags) : null, required_documents: row.required_documents ? JSON.parse(row.required_documents) : null, common_errors: row.common_errors ? JSON.parse(row.common_errors) : null, faqs: row.faqs ? JSON.parse(row.faqs) : null, examples: row.examples ? JSON.parse(row.examples) : null, screenshots: row.screenshots ? JSON.parse(row.screenshots) : null, content: row.content ? JSON.parse(row.content) : null, source_body: row.source_body ? JSON.parse(row.source_body) : null })];
                    }
                    return [2 /*return*/, null];
                case 2:
                    error_15 = _a.sent();
                    console.error('Error in getModuleById:', error_15);
                    // Return null instead of throwing error to allow graceful degradation
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function searchModules(query_1) {
    return __awaiter(this, arguments, void 0, function (query, limit) {
        var pool, rows, modules, error_16;
        if (limit === void 0) { limit = 10; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    pool = getPool();
                    return [4 /*yield*/, pool.execute("SELECT * FROM modules \n       WHERE title LIKE ? OR slug LIKE ? \n       ORDER BY created_at DESC LIMIT ?", ["%".concat(query, "%"), "%".concat(query, "%"), limit])];
                case 1:
                    rows = (_a.sent())[0];
                    modules = rows.map(function (row) { return (__assign(__assign({}, row), { metadata: row.metadata ? JSON.parse(row.metadata) : null, steps: row.steps ? JSON.parse(row.steps) : null, requirements: row.requirements ? JSON.parse(row.requirements) : null, validation: row.validation ? JSON.parse(row.validation) : null, workflows: row.workflows ? JSON.parse(row.workflows) : null, tags: row.tags ? JSON.parse(row.tags) : null, sector_tags: row.sector_tags ? JSON.parse(row.sector_tags) : null, required_documents: row.required_documents ? JSON.parse(row.required_documents) : null, common_errors: row.common_errors ? JSON.parse(row.common_errors) : null, faqs: row.faqs ? JSON.parse(row.faqs) : null, examples: row.examples ? JSON.parse(row.examples) : null, screenshots: row.screenshots ? JSON.parse(row.screenshots) : null, content: row.content ? JSON.parse(row.content) : null, source_body: row.source_body ? JSON.parse(row.source_body) : null })); });
                    return [2 /*return*/, modules];
                case 2:
                    error_16 = _a.sent();
                    console.error('Error in searchModules:', error_16);
                    // Return empty array instead of throwing error to allow graceful degradation
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getUserCertificates(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var pool, rows, error_17;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    pool = getPool();
                    return [4 /*yield*/, pool.execute("SELECT c.id, c.module_id, c.issued_at, c.expires_at, m.title as course_name, p.full_name as user_name \n       FROM certificates c \n       LEFT JOIN modules m ON c.module_id = m.id \n       LEFT JOIN profiles p ON c.user_id = p.id \n       WHERE c.user_id = ?", [userId])];
                case 1:
                    rows = (_a.sent())[0];
                    return [2 /*return*/, rows];
                case 2:
                    error_17 = _a.sent();
                    console.error('Error in getUserCertificates:', error_17);
                    // Return empty array instead of throwing error to allow graceful degradation
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getLearningProgressByUserAndModule(userId, moduleId) {
    return __awaiter(this, void 0, void 0, function () {
        var pool, rows, result, error_18;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    pool = getPool();
                    return [4 /*yield*/, pool.execute('SELECT * FROM learning_progress WHERE user_id = ? AND module_id = ?', [userId, moduleId])];
                case 1:
                    rows = (_a.sent())[0];
                    result = rows;
                    return [2 /*return*/, result.length > 0 ? result[0] : null];
                case 2:
                    error_18 = _a.sent();
                    console.error('Error in getLearningProgressByUserAndModule:', error_18);
                    // Return null instead of throwing error to allow graceful degradation
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getLearningProgressByUser(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var pool, rows, error_19;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    pool = getPool();
                    return [4 /*yield*/, pool.execute("SELECT lp.*, m.title as module_title \n       FROM learning_progress lp \n       LEFT JOIN modules m ON lp.module_id = m.id \n       WHERE lp.user_id = ?", [userId])];
                case 1:
                    rows = (_a.sent())[0];
                    return [2 /*return*/, rows];
                case 2:
                    error_19 = _a.sent();
                    console.error('Error in getLearningProgressByUser:', error_19);
                    // Return empty array instead of throwing error to allow graceful degradation
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function createOrUpdateLearningProgress(userId, moduleId, progressData) {
    return __awaiter(this, void 0, void 0, function () {
        var pool, existing, existingRows, updates, values, progressId, status_2, progressPercentage, timeSpentSeconds, quizScore, completedAt, error_20;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    pool = getPool();
                    return [4 /*yield*/, pool.execute('SELECT id FROM learning_progress WHERE user_id = ? AND module_id = ?', [userId, moduleId])];
                case 1:
                    existing = (_a.sent())[0];
                    existingRows = existing;
                    if (!(existingRows.length > 0)) return [3 /*break*/, 3];
                    updates = [];
                    values = [];
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
                    return [4 /*yield*/, pool.execute("UPDATE learning_progress \n         SET ".concat(updates.join(', '), "\n         WHERE user_id = ? AND module_id = ?"), values)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, { success: true, created: false }];
                case 3:
                    progressId = (0, uuid_1.generateUUID)();
                    status_2 = progressData.status || 'not_started';
                    progressPercentage = progressData.progress_percentage || 0;
                    timeSpentSeconds = progressData.time_spent_seconds || 0;
                    quizScore = progressData.quiz_score || null;
                    completedAt = status_2 === 'completed' ? new Date().toISOString() : null;
                    return [4 /*yield*/, pool.execute("INSERT INTO learning_progress \n         (id, user_id, module_id, status, progress_percentage, time_spent_seconds, quiz_score, completed_at)\n         VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [progressId, userId, moduleId, status_2, progressPercentage, timeSpentSeconds, quizScore, completedAt])];
                case 4:
                    _a.sent();
                    return [2 /*return*/, { success: true, created: true }];
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_20 = _a.sent();
                    console.error('Error in createOrUpdateLearningProgress:', error_20);
                    throw error_20;
                case 7: return [2 /*return*/];
            }
        });
    });
}
// Add a function to manually populate modules for development
function populateMockModules(modules) {
    var _a;
    var _this = this;
    // Clear existing modules
    mockData.modules = [];
    // Add new modules
    (_a = mockData.modules).push.apply(_a, modules);
    console.log("Populated mock database with ".concat(modules.length, " modules"));
    // Also populate SQLite database if it's available
    if (!useMockDatabase && db) {
        modules.forEach(function (module) { return __awaiter(_this, void 0, void 0, function () {
            var error_21;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, saveModule(module)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_21 = _a.sent();
                        console.error('Error saving module to SQLite:', error_21);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    }
}
