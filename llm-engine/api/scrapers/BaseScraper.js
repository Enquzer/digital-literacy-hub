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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseScraper = void 0;
const axios_1 = __importDefault(require("axios"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const franc_1 = require("franc");
class BaseScraper {
    constructor(baseUrl, moduleName) {
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
    async fetchHtml(url) {
        try {
            const response = await axios_1.default.get(url);
            return response.data;
        }
        catch (error) {
            console.error(`Error fetching ${url}:`, error);
            throw error;
        }
    }
    async fetchJson(url) {
        try {
            const response = await axios_1.default.get(url);
            return response.data;
        }
        catch (error) {
            console.error(`Error fetching JSON from ${url}:`, error);
            throw error;
        }
    }
    saveToJson(data, filename) {
        const filePath = path.join(this.outputDir, filename);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log(`Saved ${data.length} modules to ${filePath}`);
    }
    /**
     * Save raw artifact to cache
     */
    saveRawArtifact(sourceUrl, contentType, rawText) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `raw_${timestamp}_${this.moduleName}.json`;
        const filePath = path.join(this.rawCacheDir, filename);
        const artifact = {
            id: `${this.moduleName}_${timestamp}`,
            source_url: sourceUrl,
            timestamp: new Date().toISOString(),
            content_type: contentType,
            raw_text: rawText,
            language_hint: this.detectLanguage(rawText)
        };
        fs.writeFileSync(filePath, JSON.stringify(artifact, null, 2));
        console.log(`Saved raw artifact to ${filePath}`);
    }
    /**
     * Detect language of text
     */
    detectLanguage(text) {
        const lang = (0, franc_1.franc)(text, { minLength: 3 });
        return lang === 'amh' ? 'am' : 'en';
    }
    sanitizeText(text) {
        return text
            .replace(/\s+/g, ' ')
            .trim()
            .replace(/\u00A0/g, ' '); // Replace non-breaking spaces
    }
    /**
     * Create bilingual steps (placeholder implementation with sample Amharic)
     */
    async createBilingualSteps(steps) {
        // Sample Amharic translations for demonstration
        const amharicTranslations = {
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
        const bilingualSteps = [];
        for (const step of steps) {
            const sanitizedStep = this.sanitizeText(step);
            const amharicTranslation = amharicTranslations[sanitizedStep] || sanitizedStep;
            bilingualSteps.push({
                en: sanitizedStep,
                am: amharicTranslation
            });
        }
        return bilingualSteps;
    }
}
exports.BaseScraper = BaseScraper;
