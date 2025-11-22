"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.ETaxScraper = void 0;
var BaseScraper_1 = require("./BaseScraper");
var ETaxScraper = /** @class */ (function (_super) {
    __extends(ETaxScraper, _super);
    function ETaxScraper() {
        return _super.call(this, 'https://etax.mor.gov.et', 'etax') || this;
    }
    ETaxScraper.prototype.scrape = function () {
        return __awaiter(this, void 0, void 0, function () {
            var modules;
            return __generator(this, function (_a) {
                // Placeholder implementation - in a real scraper, this would fetch actual data
                console.log('Scraping e-Tax data...');
                modules = [
                    {
                        id: 'etax-vat-filing-1',
                        slug: 'vat-filing',
                        title: 'VAT Filing Process',
                        source_url: 'https://etax.mor.gov.et/vat-filing',
                        language: 'en',
                        version: '1.0',
                        source_body: 'This module explains the VAT filing process for Ethiopian businesses.',
                        original_text: 'This module explains the VAT filing process for Ethiopian businesses.',
                        translated_text: 'ይህ ሞድዩል ለኢትዮጵያ ንግዶች የቫት መግለጫ ሂደትን ይብራራል።',
                        category: 'Taxation',
                        workflows: [
                            {
                                step: 1,
                                description: {
                                    en: 'Register for e-Tax account at etrax.mor.gov.et',
                                    am: 'etrax.mor.gov.et ላይ ለኢ-ትክስ መለያ ይመዝግቡ'
                                }
                            },
                            {
                                step: 2,
                                description: {
                                    en: 'Gather required documents: Business license, TIN, financial statements',
                                    am: 'ያስፈላጊ ሰነዶችን ያሰኩ: የቢዝነስ ፈቃድ, የትክስ መለያ ቁጥር, የሂኑድ መግለጫዎች'
                                }
                            },
                            {
                                step: 3,
                                description: {
                                    en: 'Login to e-Tax portal',
                                    am: 'ወደ የኢ-ትክስ ፖርታል ይግቡ'
                                }
                            },
                            {
                                step: 4,
                                description: {
                                    en: 'Navigate to VAT filing section',
                                    am: 'ወደ የቫት መግለጫ ክፍል ይሂዱ'
                                }
                            },
                            {
                                step: 5,
                                description: {
                                    en: 'Enter sales and purchase data',
                                    am: 'የሽያጭ እና የግዢ ውሂብ ያስገቡ'
                                }
                            },
                            {
                                step: 6,
                                description: {
                                    en: 'Calculate VAT payable',
                                    am: 'የሚከፈል ቫት ያስሉ'
                                }
                            },
                            {
                                step: 7,
                                description: {
                                    en: 'Submit VAT return',
                                    am: 'የቫት መግለጫ ያስገቡ'
                                }
                            },
                            {
                                step: 8,
                                description: {
                                    en: 'Make payment through digital channels',
                                    am: 'በዲጂታል ጣቢያዎች ክፍያ ያድርጉ'
                                }
                            }
                        ],
                        faqs: [
                            {
                                question: {
                                    en: 'What is the deadline for VAT filing?',
                                    am: 'የቫት መግለጫ ለማስገባት የሚያስፈልግ ጊዜ መቼ ነው?'
                                },
                                answer: {
                                    en: 'VAT returns must be filed monthly by the 10th of the following month.',
                                    am: 'የቫት መግለጫዎች በየወሩ በሚቀጥለው ወር በ10 ላይ መገናኘት አለባቸው።'
                                }
                            }
                        ],
                        examples: [
                            {
                                title: {
                                    en: 'Sample VAT Calculation',
                                    am: 'የቫት ምሳሌ ማስሊያ'
                                },
                                description: {
                                    en: 'For a business with $10,000 sales and $4,000 purchases, VAT payable would be $600 (15% of net sales).',
                                    am: 'ለ $10,000 የሽያጭ እና $4,000 የግዢ ያለው ንግድ በተመለሰ ሽያጭ ላይ 15% የሚሆነው የሚከፈል ቫት $600 ነው።'
                                }
                            }
                        ],
                        required_documents: [
                            'Business license',
                            'Tax Identification Number (TIN)',
                            'Financial statements'
                        ],
                        updated_at: new Date().toISOString()
                    },
                    {
                        id: 'etax-income-tax-1',
                        slug: 'income-tax',
                        title: 'Income Tax Filing Process',
                        source_url: 'https://etax.mor.gov.et/income-tax',
                        language: 'en',
                        version: '1.0',
                        source_body: 'This module explains the income tax filing process for Ethiopian businesses.',
                        original_text: 'This module explains the income tax filing process for Ethiopian businesses.',
                        translated_text: 'ይህ ሞድዩል ለኢትዮጵያ ንግዶች የገቢ ግብ መግለጫ ሂደትን ይብራራል።',
                        category: 'Taxation',
                        workflows: [
                            {
                                step: 1,
                                description: {
                                    en: 'Prepare income and expense documentation',
                                    am: 'የገቢና የወጭ ሰነዶችን ያዘጋጁ'
                                }
                            },
                            {
                                step: 2,
                                description: {
                                    en: 'Access income tax filing section',
                                    am: 'ወደ የገቢ ግብ መግለጫ ክፍል ይድረሱ'
                                }
                            },
                            {
                                step: 3,
                                description: {
                                    en: 'Enter business income details',
                                    am: 'የቢዝነስ ገቢ ዝርዝሮችን ያስገቡ'
                                }
                            },
                            {
                                step: 4,
                                description: {
                                    en: 'Report allowable deductions',
                                    am: 'የተፈቀዱ መቅነሻዎችን ያመዝግቡ'
                                }
                            },
                            {
                                step: 5,
                                description: {
                                    en: 'Calculate tax liability',
                                    am: 'የትክስ ኃላፊነት ያስሉ'
                                }
                            },
                            {
                                step: 6,
                                description: {
                                    en: 'Submit return and make payment',
                                    am: 'መግለጫውን ያስገቡ እና ክፍያ ያድርጉ'
                                }
                            }
                        ],
                        faqs: [
                            {
                                question: {
                                    en: 'What is the corporate income tax rate?',
                                    am: 'የኮርፖሬት ገቢ ግብ መጠን ስንት ነው?'
                                },
                                answer: {
                                    en: 'The standard corporate income tax rate in Ethiopia is 30%.',
                                    am: 'በኢትዮጵያ ውስጥ የመደበኛው የኮርፖሬት ገቢ ግብ መጠን 30% ነው።'
                                }
                            }
                        ],
                        examples: [],
                        required_documents: [
                            'Business license',
                            'Tax Identification Number (TIN)',
                            'Income and expense records'
                        ],
                        updated_at: new Date().toISOString()
                    }
                ];
                // Save to cache
                this.saveToJson(modules, 'module-etax.json');
                return [2 /*return*/, modules];
            });
        });
    };
    return ETaxScraper;
}(BaseScraper_1.BaseScraper));
exports.ETaxScraper = ETaxScraper;
