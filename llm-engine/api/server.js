"use strict";
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
var express = require("express");
var cors = require("cors");
var path = require("path");
var reindexRouter = require("./reindex.js");
var database_js_1 = require("./database.js");
var Scheduler_js_1 = require("../Scheduler.js");
var QuizGenerator_js_1 = require("../QuizGenerator.js");
var fs = require("fs");
// Get appropriate database pool (placeholder - will be provided by database.ts)
var getPool = function () {
    // This is just a placeholder - the real implementation is in database.ts
    return {
        execute: function (query_1) {
            var args_1 = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args_1[_i - 1] = arguments[_i];
            }
            return __awaiter(void 0, __spreadArray([query_1], args_1, true), void 0, function (query, params) {
                if (params === void 0) { params = []; }
                return __generator(this, function (_a) {
                    // Return mock data for now
                    return [2 /*return*/, [[], []]];
                });
            });
        }
    };
};
// Override the database functions to use SQLite
function getModulesSQLite() {
    return __awaiter(this, arguments, void 0, function (limit, offset) {
        var pool, rows, error_1;
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
                    return [2 /*return*/, rows];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error in getModulesSQLite:', error_1);
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Store the original getModules function
var originalGetModules = database_js_1.getModules;
// Override the getModules function to use SQLite
// This is a temporary fix until we can properly compile the database.ts file
function overrideGetModules() {
    // @ts-ignore
    global.getModules = getModulesSQLite;
}
var app = express();
var PORT = process.env.PORT || 3001;
// Create scheduler instance
var scheduler = new Scheduler_js_1.Scheduler();
// Configure CORS to allow credentials
app.use(cors({
    origin: ['http://localhost:8080', 'http://localhost:8081'],
    credentials: true
}));
app.use(express.json());
// Add LLM module routes to match frontend expectations BEFORE mounting reindex router
app.get('/llm/modules', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var modules, transformedModules, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log('Fetching all LLM modules');
                return [4 /*yield*/, (0, database_js_1.getModules)()];
            case 1:
                modules = _a.sent();
                console.log("Found ".concat(modules.length, " modules"));
                transformedModules = modules.map(function (module) { return ({
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
                }); });
                res.json({
                    success: true,
                    data: transformedModules
                });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error('Error fetching LLM modules:', error_2);
                res.status(500).json({
                    success: false,
                    error: 'Failed to fetch modules'
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get('/llm/module/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var module_1, transformedModule, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log("Fetching LLM module with ID: ".concat(req.params.id));
                return [4 /*yield*/, (0, database_js_1.getModuleById)(req.params.id)];
            case 1:
                module_1 = _a.sent();
                if (!module_1) {
                    return [2 /*return*/, res.status(404).json({
                            success: false,
                            error: 'Module not found'
                        })];
                }
                transformedModule = {
                    id: module_1.id,
                    module: module_1.module || module_1.title,
                    category: module_1.category || 'General',
                    topic: module_1.topic || module_1.title,
                    sector: module_1.sector || 'Business',
                    steps: module_1.steps || [],
                    requirements: module_1.requirements || [],
                    validation: module_1.validation || [],
                    language: module_1.language || 'en',
                    lastUpdated: module_1.lastUpdated || module_1.updated_at || new Date().toISOString(),
                    source: module_1.source || module_1.source_url,
                    version: module_1.version || '1.0',
                    title: module_1.title,
                    source_url: module_1.source_url,
                    updated_at: module_1.updated_at,
                    source_body: module_1.source_body,
                    content: module_1.source_body || module_1.content,
                    workflows: module_1.workflows || [],
                    tags: module_1.tags || [],
                    sector_tags: module_1.sector_tags || [],
                    required_documents: module_1.required_documents || module_1.requirements || [],
                    common_errors: module_1.common_errors || [],
                    faqs: module_1.faqs || [],
                    examples: module_1.examples || [],
                    screenshots: module_1.screenshots || []
                };
                res.json({
                    success: true,
                    data: transformedModule
                });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error('Error fetching LLM module:', error_3);
                res.status(500).json({
                    success: false,
                    error: 'Failed to fetch module'
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get('/llm/search', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, query, lang_1, sector_1, results, filteredResults, transformedModules, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query, query = _a.query, lang_1 = _a.lang, sector_1 = _a.sector;
                console.log("Searching LLM modules with query: ".concat(query));
                if (!query || typeof query !== 'string') {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            error: 'Query parameter is required'
                        })];
                }
                return [4 /*yield*/, (0, database_js_1.searchModules)(query)];
            case 1:
                results = _b.sent();
                filteredResults = results;
                if (lang_1 && typeof lang_1 === 'string') {
                    filteredResults = filteredResults.filter(function (module) {
                        return module.language === lang_1;
                    });
                }
                if (sector_1 && typeof sector_1 === 'string') {
                    filteredResults = filteredResults.filter(function (module) {
                        return module.sector && module.sector.toLowerCase().includes(sector_1.toLowerCase());
                    });
                }
                transformedModules = filteredResults.map(function (module) { return ({
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
                }); });
                res.json({
                    success: true,
                    data: transformedModules
                });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _b.sent();
                console.error('Error searching LLM modules:', error_4);
                res.status(500).json({
                    success: false,
                    error: 'Failed to search modules'
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Serve static files from the processed directory
app.use('/processed', express.static(path.join(__dirname, '..', 'processed')));
// Mount reindex router AFTER LLM routes
app.use('/llm', reindexRouter.default);
// API Routes
app.get('/api/health', function (req, res) {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
// Authentication routes
app.post('/auth/signup', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, full_name, existingUser, userId, user, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, email = _a.email, password = _a.password, full_name = _a.full_name;
                return [4 /*yield*/, (0, database_js_1.getUserByEmail)(email)];
            case 1:
                existingUser = _b.sent();
                if (existingUser) {
                    return [2 /*return*/, res.status(400).json({ error: 'User already exists' })];
                }
                return [4 /*yield*/, (0, database_js_1.createUser)(email, full_name)];
            case 2:
                userId = _b.sent();
                // Check if user creation was successful
                if (!userId) {
                    return [2 /*return*/, res.status(500).json({ error: 'Failed to create user' })];
                }
                // Assign default role
                return [4 /*yield*/, (0, database_js_1.assignUserRole)(userId, 'trainee')];
            case 3:
                // Assign default role
                _b.sent();
                user = {
                    id: userId,
                    email: email,
                    full_name: full_name,
                    roles: ['trainee']
                };
                res.json({ user: user });
                return [3 /*break*/, 5];
            case 4:
                error_5 = _b.sent();
                console.error('Error signing up:', error_5);
                res.status(500).json({ error: 'Failed to create account' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
app.post('/auth/signin', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, roles, roleNames, userData, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, email = _a.email, password = _a.password;
                return [4 /*yield*/, (0, database_js_1.getUserByEmail)(email)];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(401).json({ error: 'Invalid credentials' })];
                }
                return [4 /*yield*/, (0, database_js_1.getUserRoles)(user.id)];
            case 2:
                roles = _b.sent();
                roleNames = roles.map(function (role) { return role.role; });
                userData = {
                    id: user.id,
                    email: user.email,
                    full_name: user.full_name,
                    roles: roleNames
                };
                res.json({ user: userData });
                return [3 /*break*/, 4];
            case 3:
                error_6 = _b.sent();
                console.error('Error signing in:', error_6);
                res.status(500).json({ error: 'Failed to sign in' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.post('/auth/signout', function (req, res) {
    // In a real application, you would clear the session
    res.json({ message: 'Signed out successfully' });
});
app.get('/auth/current', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        user = {
            id: 'admin-user-id',
            email: 'admin@gmail.com',
            full_name: 'System Administrator',
            roles: ['super_admin']
        };
        res.json({ user: user });
        return [2 /*return*/];
    });
}); });
// Module routes
app.get('/api/modules', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var modules, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, database_js_1.getModules)()];
            case 1:
                modules = _a.sent();
                res.json(modules);
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                console.error('Error fetching modules:', error_7);
                res.status(500).json({ error: 'Failed to fetch modules' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get('/api/modules/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var module_2, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, database_js_1.getModuleById)(req.params.id)];
            case 1:
                module_2 = _a.sent();
                if (!module_2) {
                    return [2 /*return*/, res.status(404).json({ error: 'Module not found' })];
                }
                res.json(module_2);
                return [3 /*break*/, 3];
            case 2:
                error_8 = _a.sent();
                console.error('Error fetching module:', error_8);
                res.status(500).json({ error: 'Failed to fetch module' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get('/api/search', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var q, results, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                q = req.query.q;
                if (!q || typeof q !== 'string') {
                    return [2 /*return*/, res.status(400).json({ error: 'Query parameter "q" is required' })];
                }
                return [4 /*yield*/, (0, database_js_1.searchModules)(q)];
            case 1:
                results = _a.sent();
                res.json(results);
                return [3 /*break*/, 3];
            case 2:
                error_9 = _a.sent();
                console.error('Error searching modules:', error_9);
                res.status(500).json({ error: 'Failed to search modules' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Learning progress routes
app.get('/api/progress/:userId/:moduleId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, moduleId, progress, error_10;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.params, userId = _a.userId, moduleId = _a.moduleId;
                return [4 /*yield*/, (0, database_js_1.getLearningProgressByUserAndModule)(userId, moduleId)];
            case 1:
                progress = _b.sent();
                res.json(progress);
                return [3 /*break*/, 3];
            case 2:
                error_10 = _b.sent();
                console.error('Error fetching learning progress:', error_10);
                res.status(500).json({ error: 'Failed to fetch learning progress' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get('/api/progress/:userId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, progress, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.params.userId;
                return [4 /*yield*/, (0, database_js_1.getLearningProgressByUser)(userId)];
            case 1:
                progress = _a.sent();
                res.json(progress);
                return [3 /*break*/, 3];
            case 2:
                error_11 = _a.sent();
                console.error('Error fetching user progress:', error_11);
                res.status(500).json({ error: 'Failed to fetch user progress' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post('/api/progress', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, moduleId, progressData, result, error_12;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, userId = _a.userId, moduleId = _a.moduleId, progressData = _a.progressData;
                if (!userId || !moduleId || !progressData) {
                    return [2 /*return*/, res.status(400).json({ error: 'User ID, Module ID, and Progress Data are required' })];
                }
                return [4 /*yield*/, (0, database_js_1.createOrUpdateLearningProgress)(userId, moduleId, progressData)];
            case 1:
                result = _b.sent();
                res.json(result);
                return [3 /*break*/, 3];
            case 2:
                error_12 = _b.sent();
                console.error('Error updating learning progress:', error_12);
                res.status(500).json({ error: 'Failed to update learning progress' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Quiz routes
app.post('/api/quiz/generate', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var moduleId, quizGenerator, quiz, error_13;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                moduleId = req.body.moduleId;
                if (!moduleId) {
                    return [2 /*return*/, res.status(400).json({ error: 'Module ID is required' })];
                }
                quizGenerator = new QuizGenerator_js_1.QuizGenerator();
                return [4 /*yield*/, QuizGenerator_js_1.QuizGenerator.generateQuiz(moduleId)];
            case 1:
                quiz = _a.sent();
                res.json(quiz);
                return [3 /*break*/, 3];
            case 2:
                error_13 = _a.sent();
                console.error('Error generating quiz:', error_13);
                res.status(500).json({ error: 'Failed to generate quiz' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Start server
app.listen(PORT, function () { return __awaiter(void 0, void 0, void 0, function () {
    var success, error_14, processedDir, files, jsonFiles, allModules, _i, jsonFiles_1, file, filePath, rawData, modules;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("LLM Engine API server running on port ".concat(PORT));
                // Initialize SQLite database
                console.log('Initializing SQLite database...');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, database_js_1.initSQLite)()];
            case 2:
                success = _a.sent();
                console.log('SQLite database initialization completed');
                if (success) {
                    console.log('Using SQLite database for all operations');
                }
                else {
                    console.log('Using mock database for all operations');
                }
                return [3 /*break*/, 4];
            case 3:
                error_14 = _a.sent();
                console.error('SQLite database initialization failed:', error_14);
                return [3 /*break*/, 4];
            case 4:
                // Load processed modules into database
                console.log('Loading processed modules into database...');
                try {
                    processedDir = path.join(__dirname, '..', 'processed');
                    if (fs.existsSync(processedDir)) {
                        files = fs.readdirSync(processedDir);
                        jsonFiles = files.filter(function (file) { return file.endsWith('-processed.json'); });
                        allModules = [];
                        for (_i = 0, jsonFiles_1 = jsonFiles; _i < jsonFiles_1.length; _i++) {
                            file = jsonFiles_1[_i];
                            filePath = path.join(processedDir, file);
                            console.log("Loading modules from ".concat(file, "..."));
                            try {
                                rawData = fs.readFileSync(filePath, 'utf-8');
                                modules = JSON.parse(rawData);
                                // Add modules to the collection
                                allModules.push.apply(allModules, modules);
                                console.log("Loaded ".concat(modules.length, " modules from ").concat(file));
                            }
                            catch (fileError) {
                                console.error("Error reading file ".concat(file, ":"), fileError);
                            }
                        }
                        // Populate database with all modules
                        (0, database_js_1.populateMockModules)(allModules);
                        console.log("Successfully loaded ".concat(allModules.length, " modules into database"));
                    }
                    else {
                        console.log('No processed modules directory found');
                    }
                }
                catch (error) {
                    console.error('Error loading processed modules:', error);
                }
                // Initialize scrapers
                console.log('Initializing scrapers...');
                // Start scheduler
                console.log('Starting scheduler...');
                return [2 /*return*/];
        }
    });
}); });
