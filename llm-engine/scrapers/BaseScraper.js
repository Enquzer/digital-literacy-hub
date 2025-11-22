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
exports.BaseScraper = void 0;
var axios = require("axios");
var fs = require("fs");
var path = require("path");
var franc_1 = require("franc");
var BaseScraper = /** @class */ (function () {
    function BaseScraper(baseUrl, moduleName) {
        this.baseUrl = baseUrl;
        this.moduleName = moduleName;
        this.outputDir = path.join(__dirname, '..', 'cache');
        this.rawCacheDir = path.join(__dirname, '..', 'cache', 'raw');
        this.rawFilesDir = path.join(__dirname, '..', 'cache', 'raw', 'files');
        // Create cache directories if they don't exist
        if (!fs.existsSync(this.rawCacheDir)) {
            fs.mkdirSync(this.rawCacheDir, { recursive: true });
        }
        if (!fs.existsSync(this.rawFilesDir)) {
            fs.mkdirSync(this.rawFilesDir, { recursive: true });
        }
    }
    BaseScraper.prototype.fetchHtml = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios.get(url)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Error fetching ".concat(url, ":"), error_1);
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    BaseScraper.prototype.fetchJson = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios.get(url)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 2:
                        error_2 = _a.sent();
                        console.error("Error fetching JSON from ".concat(url, ":"), error_2);
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    BaseScraper.prototype.saveToJson = function (data, filename) {
        var filePath = path.join(this.outputDir, filename);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log("Saved ".concat(data.length, " modules to ").concat(filePath));
    };
    /**
     * Save raw artifact to cache
     */
    BaseScraper.prototype.saveRawArtifact = function (sourceUrl, contentType, rawText) {
        var timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        var filename = "raw_".concat(timestamp, "_").concat(this.moduleName, ".json");
        var filePath = path.join(this.rawCacheDir, filename);
        var artifact = {
            id: "".concat(this.moduleName, "_").concat(timestamp),
            source_url: sourceUrl,
            timestamp: new Date().toISOString(),
            content_type: contentType,
            raw_text: rawText,
            language_hint: this.detectLanguage(rawText)
        };
        fs.writeFileSync(filePath, JSON.stringify(artifact, null, 2));
        console.log("Saved raw artifact to ".concat(filePath));
    };
    /**
     * Detect language of text
     */
    BaseScraper.prototype.detectLanguage = function (text) {
        var lang = (0, franc_1.franc)(text, { minLength: 3 });
        return lang === 'amh' ? 'am' : 'en';
    };
    BaseScraper.prototype.sanitizeText = function (text) {
        return text
            .replace(/\s+/g, ' ')
            .trim()
            .replace(/\u00A0/g, ' '); // Replace non-breaking spaces
    };
    /**
     * Create bilingual steps (placeholder implementation with sample Amharic)
     */
    BaseScraper.prototype.createBilingualSteps = function (steps) {
        return __awaiter(this, void 0, void 0, function () {
            var amharicTranslations, bilingualSteps, _i, steps_1, step, sanitizedStep, amharicTranslation;
            return __generator(this, function (_a) {
                amharicTranslations = {
                    "Register for e-Tax account at etrax.mor.gov.et": "etrax.mor.gov.et ላይ ለኢ-ትክስ መለያ ይመዝግቡ",
                    "Gather required documents: Business license, TIN, financial statements": "ያስፈላጊ ሰነዶችን ያሰኩ: የቢዝነስ ፈቃድ, የትክስ መለያ ቁጥር, የሂኑድ መግለጫዎች",
                    "Login to e-Tax portal": "ወደ የኢ-ትክስ ፖርታል ይግቡ",
                    "Navigate to VAT filing section": "ወደ የቫት መግለጫ ክፍል ይሂዱ",
                    "Enter sales and purchase data": "የሽያጭ እና የግዢ ውሂብ ያስገቡ",
                    "Calculate VAT payable": "የሚከፈል ቫት ያስሉ",
                    "Submit VAT return": "የቫት መግለጫ ያስገቡ",
                    "Make payment through digital channels": "በዲጂታል ጣቢያዎች ክፍያ ያድርጉ",
                    "Prepare income and expense documentation": "የገቢና የወጭ ሰነዶችን ያዘጋጁ",
                    "Access income tax filing section": "ወደ የገቢ ግብ መግለጫ ክፍል ይድረሱ",
                    "Enter business income details": "የቢዝነስ ገቢ ዝርዝሮችን ያስገቡ",
                    "Report allowable deductions": "የተፈቀዱ መቅነሻዎችን ያመዝግቡ",
                    "Calculate tax liability": "የትክስ ኃላፊነት ያስሉ",
                    "Submit return and make payment": "መግለጫውን ያስገቡ እና ክፍያ ያድርጉ",
                    "Obtain import license/permit": "የማስመጣች ፈቃድ/ፍቃድ ያግኙ",
                    "Register on e-SW system": "በኢ-ኤስዬ ስርዓት ላይ ይመዝግቡ",
                    "Prepare commercial invoice": "የንግድ ኢንቮይስ ያዘጋጁ",
                    "Classify goods using HS codes": "የኤችኤስ ኮዶችን በመጠቀም ምርቶችን ይመደቡ",
                    "Calculate applicable duties and taxes": "የሚተገበሩ ጉምራሾች እና ታክሶችን ያስሉ",
                    "Submit import declaration": "የማስመጣች መግለጫ ያስገቡ",
                    "Upload required documents": "ያስፈላጊ ሰነዶችን ይስቀሉ",
                    "Pay duties and taxes": "ጉምራሾች እና ታክሶች ይክፈሉ",
                    "Clear goods through customs": "ምርቶችን በየክስተቱ ያጽዱ",
                    "Obtain export license/permit": "የመላኪያ ፈቃድ/ፍቃድ ያግኙ",
                    "Submit export declaration": "የመላኪያ መግለጫ ያስገቡ",
                    "Obtain shipping instructions": "የመላኪያ መመሪያዎችን ያግኙ"
                };
                bilingualSteps = [];
                for (_i = 0, steps_1 = steps; _i < steps_1.length; _i++) {
                    step = steps_1[_i];
                    sanitizedStep = this.sanitizeText(step);
                    amharicTranslation = amharicTranslations[sanitizedStep] || sanitizedStep;
                    bilingualSteps.push({
                        en: sanitizedStep,
                        am: amharicTranslation
                    });
                }
                return [2 /*return*/, bilingualSteps];
            });
        });
    };
    return BaseScraper;
}());
exports.BaseScraper = BaseScraper;
