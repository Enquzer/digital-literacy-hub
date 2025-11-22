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
exports.DataProcessor = void 0;
var fs = require("fs");
var path = require("path");
var DataProcessor = /** @class */ (function () {
    function DataProcessor() {
        this.cacheDir = path.join(__dirname, '..', 'cache');
        this.rawDir = path.join(__dirname, '..', 'cache', 'raw');
        this.processedDir = path.join(__dirname, '..', 'processed');
        this.processedSampleDir = path.join(__dirname, '..', 'cache', 'processed', 'sample-modules');
        // Create directories if they don't exist
        [this.processedDir, this.processedSampleDir].forEach(function (dir) {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    }
    /**
     * Process all cached JSON files and convert them to training-ready format
     */
    DataProcessor.prototype.processAllModules = function () {
        return __awaiter(this, void 0, void 0, function () {
            var files, jsonFiles, _i, jsonFiles_1, file, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        files = fs.readdirSync(this.cacheDir);
                        jsonFiles = files.filter(function (file) { return file.endsWith('.json') && file.startsWith('module-'); });
                        _i = 0, jsonFiles_1 = jsonFiles;
                        _a.label = 1;
                    case 1:
                        if (!(_i < jsonFiles_1.length)) return [3 /*break*/, 4];
                        file = jsonFiles_1[_i];
                        return [4 /*yield*/, this.processModuleFile(file)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        console.log("Processed ".concat(jsonFiles.length, " module files"));
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        console.error('Error processing modules:', error_1);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Process a single module file
     */
    DataProcessor.prototype.processModuleFile = function (filename) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, rawData, modules, processedModules, processedFilename, processedPath, error_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        filePath = path.join(this.cacheDir, filename);
                        rawData = fs.readFileSync(filePath, 'utf-8');
                        modules = JSON.parse(rawData);
                        return [4 /*yield*/, Promise.all(modules.map(function (module) { return _this.processModule(module); }))];
                    case 1:
                        processedModules = _a.sent();
                        processedFilename = filename.replace('.json', '-processed.json');
                        processedPath = path.join(this.processedDir, processedFilename);
                        fs.writeFileSync(processedPath, JSON.stringify(processedModules, null, 2));
                        console.log("Processed ".concat(filename, " -> ").concat(processedFilename));
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.error("Error processing ".concat(filename, ":"), error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Process individual module data
     */
    DataProcessor.prototype.processModule = function (module) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Generate ID and slug if not present
                        if (!module.id) {
                            module.id = this.generateModuleId(module);
                        }
                        if (!module.slug) {
                            module.slug = this.generateSlug(module);
                        }
                        // Set title from legacy module field if not present
                        if (!module.title && module.module) {
                            module.title = module.module;
                        }
                        // Set source_url from legacy source field if not present
                        if (!module.source_url && module.source) {
                            module.source_url = module.source;
                        }
                        // Set updated_at from legacy lastUpdated field if not present
                        if (!module.updated_at && module.lastUpdated) {
                            module.updated_at = module.lastUpdated;
                        }
                        // Set version if not present
                        if (!module.version) {
                            module.version = "1.0";
                        }
                        // Set source_body from steps and requirements if not present
                        if (!module.source_body) {
                            module.source_body = this.formatModuleContent(module);
                        }
                        // Detect language and process text
                        return [4 /*yield*/, this.processTextContent(module)];
                    case 1:
                        // Detect language and process text
                        _a.sent();
                        // Generate workflows from legacy steps if not present
                        if (!module.workflows && module.steps) {
                            module.workflows = this.convertStepsToWorkflows(module.steps);
                        }
                        // Set default empty arrays for optional fields
                        module.tags = module.tags || [];
                        module.sector_tags = module.sector_tags || [];
                        module.required_documents = module.required_documents || (module.requirements || []);
                        module.common_errors = module.common_errors || [];
                        module.faqs = module.faqs || [];
                        module.examples = module.examples || [];
                        module.screenshots = module.screenshots || [];
                        return [2 /*return*/, module];
                }
            });
        });
    };
    /**
     * Process text content for language detection and translation
     */
    DataProcessor.prototype.processTextContent = function (module) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                // In a real implementation, this would use an actual translation API
                // For now, we'll just set the original_text and translated_text based on language
                if (module.language === 'am') {
                    // For Amharic content, set original_text and generate English translation
                    module.original_text = module.source_body;
                    // In a real implementation, this would call a translation API
                    module.translated_text = "English translation of: ".concat((_a = module.source_body) === null || _a === void 0 ? void 0 : _a.substring(0, 100), "...");
                }
                else {
                    // For English content, set translated_text and generate Amharic "translation"
                    module.translated_text = module.source_body;
                    // In a real implementation, this would call a translation API
                    module.original_text = "Amharic translation of: ".concat((_b = module.source_body) === null || _b === void 0 ? void 0 : _b.substring(0, 100), "...");
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Convert legacy steps to workflow format
     */
    DataProcessor.prototype.convertStepsToWorkflows = function (steps) {
        return steps.map(function (step, index) { return ({
            step: index + 1,
            description: {
                en: step.en,
                am: step.am
            }
        }); });
    };
    /**
     * Format module content for processing
     */
    DataProcessor.prototype.formatModuleContent = function (module) {
        var content = '';
        if (module.topic) {
            content += "# ".concat(module.topic, "\n\n");
        }
        if (module.category) {
            content += "## Category: ".concat(module.category, "\n");
        }
        if (module.sector) {
            content += "## Sector: ".concat(module.sector, "\n\n");
        }
        if (module.steps && module.steps.length > 0) {
            content += "## Steps:\n";
            module.steps.forEach(function (step, index) {
                content += "".concat(index + 1, ". ").concat(step.en, "\n");
                if (step.am !== step.en) {
                    content += "   (Amharic: ".concat(step.am, ")\n");
                }
            });
        }
        if (module.requirements && module.requirements.length > 0) {
            content += "\n## Requirements:\n";
            module.requirements.forEach(function (req) {
                content += "- ".concat(req, "\n");
            });
        }
        if (module.validation && module.validation.length > 0) {
            content += "\n## Validation:\n";
            module.validation.forEach(function (val) {
                content += "- ".concat(val, "\n");
            });
        }
        return content;
    };
    /**
     * Generate unique ID for module
     */
    DataProcessor.prototype.generateModuleId = function (module) {
        var _a;
        var title = module.title || module.topic || module.module || 'unknown';
        return "".concat(((_a = module.category) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || 'general', "-").concat(title.toLowerCase().replace(/\s+/g, '-'), "-").concat(Date.now());
    };
    /**
     * Generate slug for module
     */
    DataProcessor.prototype.generateSlug = function (module) {
        var title = module.title || module.topic || module.module || 'unknown-module';
        return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    };
    /**
     * Create sample processed modules
     */
    DataProcessor.prototype.createSampleModules = function () {
        return __awaiter(this, void 0, void 0, function () {
            var etaxModule, processedEtaxModule, etaxPath, customsModule, processedCustomsModule, customsPath, digitalSkillsModule, processedDigitalSkillsModule, digitalSkillsPath, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        etaxModule = {
                            id: "tax-etax-registration-12345",
                            slug: "etax-registration",
                            title: "e-Tax Registration Process",
                            source_url: "https://etax.mor.gov.et/registration",
                            language: "am",
                            category: "Tax",
                            tags: ["registration", "etax", "mor"],
                            sector_tags: ["government-services"],
                            workflows: [
                                {
                                    step: 1,
                                    description: {
                                        en: "Visit etax.mor.gov.et",
                                        am: "etrax.mor.gov.et ላይ ይጎብኙ"
                                    }
                                },
                                {
                                    step: 2,
                                    description: {
                                        en: "Click on 'New User Registration'",
                                        am: "በ'አዲስ ተጠቃሚ ምዝገባ' ላይ ይጫኑ"
                                    }
                                }
                            ],
                            required_documents: [
                                "Valid identification document",
                                "Business registration certificate"
                            ],
                            common_errors: [
                                "Incorrect email format",
                                "Missing document verification"
                            ],
                            faqs: [
                                {
                                    question: {
                                        en: "What documents are required for registration?",
                                        am: "ለምዝገባ የሚያስፈልጉ ሰነዶች ምንድን ናቸው?"
                                    },
                                    answer: {
                                        en: "You need a valid ID and business registration certificate.",
                                        am: "እርስዎ ልክ የተሰጠ መለያ እና የቢዝነስ ምዝገባ ማረጋገጫ ያስፈልግዎታል።"
                                    }
                                }
                            ],
                            examples: [
                                {
                                    title: {
                                        en: "Successful Registration Example",
                                        am: "የተሳካ ምዝገባ ምሳሌ"
                                    },
                                    description: {
                                        en: "A business successfully registered for e-Tax services.",
                                        am: "ቢዝነስ ለኢ-ትክስ አገልግሎቶች በተሳካ ሁኔታ ተመዝግቧል።"
                                    }
                                }
                            ],
                            updated_at: new Date().toISOString(),
                            version: "1.0",
                            legal_source: true
                        };
                        return [4 /*yield*/, this.processModule(etaxModule)];
                    case 1:
                        processedEtaxModule = _a.sent();
                        etaxPath = path.join(this.processedSampleDir, 'module_etax_v1.0.json');
                        fs.writeFileSync(etaxPath, JSON.stringify(processedEtaxModule, null, 2));
                        customsModule = {
                            id: "customs-import-declaration-12346",
                            slug: "customs-import-declaration",
                            title: "Customs Import Declaration",
                            source_url: "https://ecc.gov.et/import-declaration",
                            language: "en",
                            category: "Customs",
                            tags: ["import", "declaration", "customs"],
                            sector_tags: ["import-export"],
                            workflows: [
                                {
                                    step: 1,
                                    description: {
                                        en: "Obtain import license/permit",
                                        am: "የማስመጣች ፈቃድ/ፍቃድ ያግኙ"
                                    }
                                },
                                {
                                    step: 2,
                                    description: {
                                        en: "Register on e-SW system",
                                        am: "በኢ-ኤስዬ ስርዓት ላይ ይመዝግቡ"
                                    }
                                }
                            ],
                            required_documents: [
                                "Commercial invoice",
                                "Packing list",
                                "Bill of lading"
                            ],
                            common_errors: [
                                "Incomplete documentation",
                                "Incorrect HS code classification"
                            ],
                            updated_at: new Date().toISOString(),
                            version: "1.0",
                            legal_source: true
                        };
                        return [4 /*yield*/, this.processModule(customsModule)];
                    case 2:
                        processedCustomsModule = _a.sent();
                        customsPath = path.join(this.processedSampleDir, 'module_customs_v1.0.json');
                        fs.writeFileSync(customsPath, JSON.stringify(processedCustomsModule, null, 2));
                        digitalSkillsModule = {
                            id: "egov-digital-skills-12347",
                            slug: "egov-digital-skills",
                            title: "e-Government Digital Skills",
                            source_url: "https://egov.gov.et/digital-skills",
                            language: "en",
                            category: "Digital Skills",
                            tags: ["digital-literacy", "egov", "skills"],
                            sector_tags: ["public-administration"],
                            workflows: [
                                {
                                    step: 1,
                                    description: {
                                        en: "Create government service account",
                                        am: "የመንግስት አገልግሎት መለያ ይፍጠሩ"
                                    }
                                },
                                {
                                    step: 2,
                                    description: {
                                        en: "Verify your identity",
                                        am: "እርስዎን ያረጋግጡ"
                                    }
                                }
                            ],
                            required_documents: [
                                "Valid ID",
                                "Mobile phone number"
                            ],
                            examples: [
                                {
                                    title: {
                                        en: "Account Registration",
                                        am: "የመለያ ምዝገባ"
                                    },
                                    description: {
                                        en: "Step-by-step guide to register for government services.",
                                        am: "ለመንግስት አገልግሎቶች መመዝገብ የሚያስችል ደረጃ በደረጃ መመሪያ።"
                                    }
                                }
                            ],
                            updated_at: new Date().toISOString(),
                            version: "1.0",
                            legal_source: true
                        };
                        return [4 /*yield*/, this.processModule(digitalSkillsModule)];
                    case 3:
                        processedDigitalSkillsModule = _a.sent();
                        digitalSkillsPath = path.join(this.processedSampleDir, 'module_digital_skills_v1.0.json');
                        fs.writeFileSync(digitalSkillsPath, JSON.stringify(processedDigitalSkillsModule, null, 2));
                        console.log('Sample modules created successfully');
                        return [3 /*break*/, 5];
                    case 4:
                        error_3 = _a.sent();
                        console.error('Error creating sample modules:', error_3);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Detect changes in modules
     */
    DataProcessor.prototype.detectChanges = function () {
        // In a real implementation, this would compare with previous versions
        // For now, we'll return placeholder values
        return {
            added: 0,
            updated: 0,
            removed: 0
        };
    };
    /**
     * Clean HTML/PDF text (strip headers/footers, normalize whitespace)
     */
    DataProcessor.prototype.cleanText = function (text) {
        return text
            .replace(/\s+/g, ' ') // Normalize whitespace
            .replace(/\u00A0/g, ' ') // Replace non-breaking spaces
            .trim();
    };
    return DataProcessor;
}());
exports.DataProcessor = DataProcessor;
