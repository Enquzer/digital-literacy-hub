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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainingDataPackager = void 0;
var fs = require("fs");
var path = require("path");
var TrainingDataPackager = /** @class */ (function () {
    function TrainingDataPackager() {
        this.processedDir = path.join(__dirname, '..', 'processed');
        this.trainingDataDir = path.join(__dirname, '..', 'training-data');
        // Create training data directory if it doesn't exist
        if (!fs.existsSync(this.trainingDataDir)) {
            fs.mkdirSync(this.trainingDataDir, { recursive: true });
        }
    }
    /**
     * Package all processed modules into training data formats
     */
    TrainingDataPackager.prototype.packageAllModules = function () {
        return __awaiter(this, void 0, void 0, function () {
            var files, jsonFiles, qaPairs, instructionExamples, embeddingTexts, _i, jsonFiles_1, file, filePath, rawData, modules, _a, modules_1, module_1, qa, instructions, embeddings;
            return __generator(this, function (_b) {
                try {
                    files = fs.readdirSync(this.processedDir);
                    jsonFiles = files.filter(function (file) { return file.endsWith('-processed.json'); });
                    qaPairs = [];
                    instructionExamples = [];
                    embeddingTexts = [];
                    for (_i = 0, jsonFiles_1 = jsonFiles; _i < jsonFiles_1.length; _i++) {
                        file = jsonFiles_1[_i];
                        filePath = path.join(this.processedDir, file);
                        rawData = fs.readFileSync(filePath, 'utf-8');
                        modules = JSON.parse(rawData);
                        for (_a = 0, modules_1 = modules; _a < modules_1.length; _a++) {
                            module_1 = modules_1[_a];
                            qa = this.generateQAPairs(module_1);
                            instructions = this.generateInstructionExamples(module_1);
                            embeddings = this.generateEmbeddingText(module_1);
                            qaPairs.push.apply(qaPairs, qa);
                            instructionExamples.push.apply(instructionExamples, instructions);
                            embeddingTexts.push.apply(embeddingTexts, embeddings);
                        }
                    }
                    // Save training data
                    this.saveTrainingData('qa-pairs.json', qaPairs);
                    this.saveTrainingData('instruction-examples.json', instructionExamples);
                    this.saveTrainingData('embedding-texts.json', embeddingTexts);
                    console.log("Packaged training data from ".concat(jsonFiles.length, " files"));
                    console.log("Generated ".concat(qaPairs.length, " QA pairs"));
                    console.log("Generated ".concat(instructionExamples.length, " instruction examples"));
                    console.log("Generated ".concat(embeddingTexts.length, " embedding texts"));
                }
                catch (error) {
                    console.error('Error packaging training data:', error);
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Generate QA pairs from module
     */
    TrainingDataPackager.prototype.generateQAPairs = function (module) {
        var qaPairs = [];
        // Generate QA pairs from FAQs
        if (module.faqs && module.faqs.length > 0) {
            for (var _i = 0, _a = module.faqs; _i < _a.length; _i++) {
                var faq = _a[_i];
                qaPairs.push({
                    question: faq.question.en,
                    answer: faq.answer.en,
                    language: 'en',
                    module_id: module.id,
                    category: module.category
                });
                qaPairs.push({
                    question: faq.question.am,
                    answer: faq.answer.am,
                    language: 'am',
                    module_id: module.id,
                    category: module.category
                });
            }
        }
        // Generate QA pairs from workflows
        if (module.workflows && module.workflows.length > 0) {
            for (var _b = 0, _c = module.workflows; _b < _c.length; _b++) {
                var workflow = _c[_b];
                qaPairs.push({
                    question: "What is step ".concat(workflow.step, " in the ").concat(module.title, " process?"),
                    answer: workflow.description.en,
                    language: 'en',
                    module_id: module.id,
                    category: module.category
                });
                qaPairs.push({
                    question: "".concat(module.title, " \u1260\u1202\u12F0\u1271 \u12CD\u1235\u1325 \u12F0\u1228\u1303 ").concat(workflow.step, " \u121D\u1295\u12F5\u1295 \u1290\u12CD?"),
                    answer: workflow.description.am,
                    language: 'am',
                    module_id: module.id,
                    category: module.category
                });
            }
        }
        // Generate QA pairs from examples
        if (module.examples && module.examples.length > 0) {
            for (var _d = 0, _e = module.examples; _d < _e.length; _d++) {
                var example = _e[_d];
                qaPairs.push({
                    question: "Can you provide an example of ".concat(module.title, "?"),
                    answer: "".concat(example.title.en, ": ").concat(example.description.en),
                    language: 'en',
                    module_id: module.id,
                    category: module.category
                });
                qaPairs.push({
                    question: "\u12A5\u122D\u1235\u12CE ".concat(module.title, " \u121D\u1233\u120C \u121B\u1245\u1228\u1265 \u12ED\u127D\u120B\u1209?"),
                    answer: "".concat(example.title.am, ": ").concat(example.description.am),
                    language: 'am',
                    module_id: module.id,
                    category: module.category
                });
            }
        }
        return qaPairs;
    };
    /**
     * Generate instruction tuning examples from module
     */
    TrainingDataPackager.prototype.generateInstructionExamples = function (module) {
        var examples = [];
        // Generate instruction examples for summarization
        if (module.source_body) {
            examples.push({
                instruction: "Summarize the following government service process:",
                input: module.source_body.substring(0, 500), // Limit input size
                output: "This module explains the ".concat(module.title, " process in the ").concat(module.category, " category."),
                language: 'en',
                module_id: module.id
            });
            examples.push({
                instruction: "የሚከተለውን የመንግስት አገልግሎት ሂደት ያጠቃልሉ:",
                input: module.source_body.substring(0, 500),
                output: "\u12ED\u1205 \u121E\u12F5\u12E9\u120D \u1260".concat(module.category, " \u121D\u12F5\u1265 \u12CD\u1235\u1325 \u12E8").concat(module.title, " \u1202\u12F0\u1275\u1295 \u12ED\u1265\u122B\u122B\u120D\u1362"),
                language: 'am',
                module_id: module.id
            });
        }
        // Generate instruction examples for step-by-step guidance
        if (module.workflows && module.workflows.length > 0) {
            var steps = module.workflows.map(function (w) { return w.description.en; }).join('\n');
            examples.push({
                instruction: "Provide step-by-step guidance for the following process:",
                input: module.title || '',
                output: steps,
                language: 'en',
                module_id: module.id
            });
            var stepsAm = module.workflows.map(function (w) { return w.description.am; }).join('\n');
            examples.push({
                instruction: "ለሚከተለው ሂደት ደረጃ በደረጃ መመሪያ ያቅርቡ:",
                input: module.title || '',
                output: stepsAm,
                language: 'am',
                module_id: module.id
            });
        }
        return examples;
    };
    /**
     * Generate embedding-ready text from module
     */
    TrainingDataPackager.prototype.generateEmbeddingText = function (module) {
        var texts = [];
        // Add original text for embedding
        if (module.original_text) {
            texts.push({
                text: module.original_text,
                language: module.language,
                module_id: module.id,
                category: module.category,
                source_url: module.source_url
            });
        }
        // Add translated text for embedding
        if (module.translated_text && module.translated_text !== module.original_text) {
            texts.push({
                text: module.translated_text,
                language: module.language === 'en' ? 'am' : 'en',
                module_id: module.id,
                category: module.category,
                source_url: module.source_url
            });
        }
        // Add title for embedding
        if (module.title) {
            texts.push({
                text: module.title,
                language: module.language,
                module_id: module.id,
                category: module.category,
                source_url: module.source_url
            });
        }
        // Add workflow descriptions for embedding
        if (module.workflows) {
            for (var _i = 0, _a = module.workflows; _i < _a.length; _i++) {
                var workflow = _a[_i];
                texts.push({
                    text: workflow.description.en,
                    language: 'en',
                    module_id: module.id,
                    category: module.category,
                    source_url: module.source_url
                });
                texts.push({
                    text: workflow.description.am,
                    language: 'am',
                    module_id: module.id,
                    category: module.category,
                    source_url: module.source_url
                });
            }
        }
        return texts;
    };
    /**
     * Save training data to file
     */
    TrainingDataPackager.prototype.saveTrainingData = function (filename, data) {
        var filePath = path.join(this.trainingDataDir, filename);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log("Saved ".concat(data.length, " items to ").concat(filePath));
    };
    return TrainingDataPackager;
}());
exports.TrainingDataPackager = TrainingDataPackager;
