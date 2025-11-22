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
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizGenerator = void 0;
var fs = require("fs");
var path = require("path");
var QuizGenerator = /** @class */ (function () {
    function QuizGenerator() {
    }
    /**
     * Generate a comprehensive quiz for a module with quality control
     */
    QuizGenerator.generateQuiz = function (module) {
        return __awaiter(this, void 0, void 0, function () {
            var moduleId, quizId, questions, formattedQuestions, validatedQuestions;
            return __generator(this, function (_a) {
                moduleId = module.id;
                quizId = "quiz_".concat(moduleId, "_").concat(Date.now());
                questions = [];
                // 1. Knowledge-based questions (easy)
                questions.push.apply(questions, this.generateKnowledgeQuestions(module));
                // 2. Comprehension questions (medium)
                questions.push.apply(questions, this.generateComprehensionQuestions(module));
                // 3. Application questions (hard)
                questions.push.apply(questions, this.generateApplicationQuestions(module));
                // 4. Validation/error identification questions (medium)
                questions.push.apply(questions, this.generateValidationQuestions(module));
                // 5. Requirement questions (easy-medium)
                questions.push.apply(questions, this.generateRequirementQuestions(module));
                formattedQuestions = questions.map(function (q, index) { return (__assign(__assign({}, q), { id: index + 1 })); });
                validatedQuestions = this.qualityControl(formattedQuestions);
                return [2 /*return*/, {
                        id: quizId,
                        module_id: moduleId,
                        title: "Quiz: ".concat(module.title),
                        questions: validatedQuestions,
                        created_at: new Date().toISOString(),
                        version: '1.0'
                    }];
            });
        });
    };
    /**
     * Generate knowledge-based questions (facts from the module)
     */
    QuizGenerator.generateKnowledgeQuestions = function (module) {
        var questions = [];
        // Question about module category
        questions.push({
            id: 0, // Will be reassigned later
            question: "What category does the \"".concat(module.title, "\" module belong to?"),
            options: [
                module.category,
                this.generateDistractor(module.category),
                this.generateDistractor(module.category),
                "None of the above"
            ],
            correct_answer: 0,
            explanation: "The ".concat(module.title, " module is categorized under ").concat(module.category, "."),
            difficulty: 'easy',
            category: 'knowledge'
        });
        // Question about module topic
        if (module.topic) {
            questions.push({
                id: 0, // Will be reassigned later
                question: "What is the main topic of the \"".concat(module.title, "\" module?"),
                options: [
                    module.topic,
                    this.generateDistractor(module.topic),
                    this.generateDistractor(module.topic),
                    "General information"
                ],
                correct_answer: 0,
                explanation: "The main topic of this module is ".concat(module.topic, "."),
                difficulty: 'easy',
                category: 'knowledge'
            });
        }
        // Question about module sector
        if (module.sector) {
            questions.push({
                id: 0, // Will be reassigned later
                question: "Which sector is the \"".concat(module.title, "\" module primarily designed for?"),
                options: [
                    module.sector,
                    this.generateDistractor(module.sector),
                    this.generateDistractor(module.sector),
                    "All sectors"
                ],
                correct_answer: 0,
                explanation: "This module is primarily designed for the ".concat(module.sector, " sector."),
                difficulty: 'easy',
                category: 'knowledge'
            });
        }
        return questions;
    };
    /**
     * Generate comprehension questions (understanding of processes)
     */
    QuizGenerator.generateComprehensionQuestions = function (module) {
        var _a, _b, _c, _d;
        var questions = [];
        // Questions about steps in the process
        if (module.steps && module.steps.length > 0) {
            // Question about the first step
            var firstStep = ((_a = module.steps[0]) === null || _a === void 0 ? void 0 : _a.en) || module.steps[0];
            questions.push({
                id: 0, // Will be reassigned later
                question: "What is the first step in the ".concat(module.title, " process?"),
                options: [
                    firstStep,
                    ((_b = module.steps[1]) === null || _b === void 0 ? void 0 : _b.en) || module.steps[1] || this.generateDistractor(firstStep),
                    this.generateDistractor(firstStep),
                    "Review documentation"
                ],
                correct_answer: 0,
                explanation: "The first step in this process is: ".concat(firstStep),
                difficulty: 'medium',
                category: 'comprehension'
            });
            // Question about a middle step (if there are enough steps)
            if (module.steps.length > 2) {
                var middleIndex = Math.floor(module.steps.length / 2);
                var middleStep = ((_c = module.steps[middleIndex]) === null || _c === void 0 ? void 0 : _c.en) || module.steps[middleIndex];
                questions.push({
                    id: 0, // Will be reassigned later
                    question: "Which step comes after preparing initial documentation in the ".concat(module.title, " process?"),
                    options: [
                        middleStep,
                        ((_d = module.steps[middleIndex - 1]) === null || _d === void 0 ? void 0 : _d.en) || module.steps[middleIndex - 1] || this.generateDistractor(middleStep),
                        this.generateDistractor(middleStep),
                        "Final submission"
                    ],
                    correct_answer: 0,
                    explanation: "After preparing initial documentation, the next step is: ".concat(middleStep),
                    difficulty: 'medium',
                    category: 'comprehension'
                });
            }
        }
        return questions;
    };
    /**
     * Generate application questions (scenario-based)
     */
    QuizGenerator.generateApplicationQuestions = function (module) {
        var _a;
        var questions = [];
        // Scenario-based question
        if (module.steps && module.steps.length > 0) {
            var firstStep = ((_a = module.steps[0]) === null || _a === void 0 ? void 0 : _a.en) || module.steps[0];
            questions.push({
                id: 0, // Will be reassigned later
                question: "If you were starting the ".concat(module.title, " process today, what would be your first action?"),
                options: [
                    "Begin by ".concat(firstStep.toLowerCase()),
                    "Review all requirements first",
                    "Contact support for guidance",
                    "Schedule a consultation"
                ],
                correct_answer: 0,
                explanation: "The correct first action is to ".concat(firstStep.toLowerCase(), ", as this is the initial step in the process."),
                difficulty: 'hard',
                category: 'application'
            });
        }
        // Problem-solving question
        if (module.validation && module.validation.length > 0) {
            var validationStep = module.validation[0];
            questions.push({
                id: 0, // Will be reassigned later
                question: "During the ".concat(module.title, " process, you notice an error in your calculations. What should you do first?"),
                options: [
                    validationStep,
                    "Resubmit the entire form",
                    "Ignore the error and continue",
                    "Contact technical support"
                ],
                correct_answer: 0,
                explanation: "The first step should be to ".concat(validationStep.toLowerCase(), " to identify and correct the issue."),
                difficulty: 'hard',
                category: 'application'
            });
        }
        return questions;
    };
    /**
     * Generate validation/error identification questions
     */
    QuizGenerator.generateValidationQuestions = function (module) {
        var questions = [];
        if (module.validation && module.validation.length > 0) {
            var validationStep = module.validation[0];
            questions.push({
                id: 0, // Will be reassigned later
                question: "Which of the following is a key validation step in the ".concat(module.title, " process?"),
                options: [
                    validationStep,
                    this.generateDistractor(validationStep),
                    this.generateDistractor(validationStep),
                    "Submit without review"
                ],
                correct_answer: 0,
                explanation: "An important validation step is to ".concat(validationStep.toLowerCase(), " to ensure accuracy."),
                difficulty: 'medium',
                category: 'validation'
            });
        }
        return questions;
    };
    /**
     * Generate requirement-based questions
     */
    QuizGenerator.generateRequirementQuestions = function (module) {
        var questions = [];
        if (module.requirements && module.requirements.length > 0) {
            var requirement = module.requirements[0];
            questions.push({
                id: 0, // Will be reassigned later
                question: "Which of the following is a required document for the ".concat(module.title, " process?"),
                options: [
                    requirement,
                    this.generateDistractor(requirement),
                    this.generateDistractor(requirement),
                    "No documents required"
                ],
                correct_answer: 0,
                explanation: "".concat(requirement, " is one of the required documents for this process."),
                difficulty: 'easy',
                category: 'requirements'
            });
        }
        return questions;
    };
    /**
     * Generate a distractor (incorrect answer option) based on the correct answer
     */
    QuizGenerator.generateDistractor = function (correctAnswer) {
        var distractors = [
            "Financial documentation",
            "Business license",
            "Tax identification number",
            "Government approval",
            "Digital certificate",
            "Processing fee",
            "Submission form",
            "Verification code"
        ];
        // Filter out distractors that are too similar to the correct answer
        var filteredDistractors = distractors.filter(function (d) {
            return !correctAnswer.toLowerCase().includes(d.toLowerCase()) &&
                !d.toLowerCase().includes(correctAnswer.toLowerCase());
        });
        // Return a random distractor or a generic one if none found
        return filteredDistractors.length > 0
            ? filteredDistractors[Math.floor(Math.random() * filteredDistractors.length)]
            : "Administrative approval";
    };
    /**
     * Quality control for generated questions
     */
    QuizGenerator.qualityControl = function (questions) {
        var _this = this;
        // Remove duplicate questions
        var uniqueQuestions = questions.filter(function (question, index, self) {
            return index === self.findIndex(function (q) { return q.question === question.question; });
        });
        // Ensure each question has 4 options
        var validatedQuestions = uniqueQuestions.map(function (question) {
            if (question.options.length < 4) {
                // Add more options if needed
                while (question.options.length < 4) {
                    question.options.push(_this.generateDistractor(question.options[0]));
                }
            }
            else if (question.options.length > 4) {
                // Trim options if too many
                question.options = question.options.slice(0, 4);
            }
            // Ensure correct_answer index is valid
            if (question.correct_answer < 0 || question.correct_answer >= question.options.length) {
                question.correct_answer = 0;
            }
            return question;
        });
        // Limit to 10 questions maximum
        return validatedQuestions.slice(0, 10);
    };
    /**
     * Save quiz to file for persistence
     */
    QuizGenerator.saveQuiz = function (quiz) {
        return __awaiter(this, void 0, void 0, function () {
            var quizzesDir, filePath;
            return __generator(this, function (_a) {
                try {
                    quizzesDir = path.join(__dirname, 'quizzes');
                    if (!fs.existsSync(quizzesDir)) {
                        fs.mkdirSync(quizzesDir, { recursive: true });
                    }
                    filePath = path.join(quizzesDir, "".concat(quiz.id, ".json"));
                    fs.writeFileSync(filePath, JSON.stringify(quiz, null, 2));
                    console.log("Quiz saved to ".concat(filePath));
                }
                catch (error) {
                    console.error('Error saving quiz:', error);
                    throw error;
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Load quiz from file
     */
    QuizGenerator.loadQuiz = function (quizId) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, rawData;
            return __generator(this, function (_a) {
                try {
                    filePath = path.join(__dirname, 'quizzes', "".concat(quizId, ".json"));
                    if (!fs.existsSync(filePath)) {
                        return [2 /*return*/, null];
                    }
                    rawData = fs.readFileSync(filePath, 'utf-8');
                    return [2 /*return*/, JSON.parse(rawData)];
                }
                catch (error) {
                    console.error('Error loading quiz:', error);
                    return [2 /*return*/, null];
                }
                return [2 /*return*/];
            });
        });
    };
    return QuizGenerator;
}());
exports.QuizGenerator = QuizGenerator;
