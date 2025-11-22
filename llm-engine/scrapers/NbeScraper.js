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
exports.NbeScraper = void 0;
var BaseScraper_1 = require("./BaseScraper");
var NbeScraper = /** @class */ (function (_super) {
    __extends(NbeScraper, _super);
    function NbeScraper() {
        return _super.call(this, 'https://nbe.gov.et', 'nbe') || this;
    }
    NbeScraper.prototype.scrape = function () {
        return __awaiter(this, void 0, void 0, function () {
            var modules, forexModule, bankingModule, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        modules = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.scrapeForexInfo()];
                    case 2:
                        forexModule = _a.sent();
                        if (forexModule)
                            modules.push(forexModule);
                        return [4 /*yield*/, this.scrapeBankingServices()];
                    case 3:
                        bankingModule = _a.sent();
                        if (bankingModule)
                            modules.push(bankingModule);
                        // Save to JSON
                        this.saveToJson(modules, 'module-nbe.json');
                        return [2 /*return*/, modules];
                    case 4:
                        error_1 = _a.sent();
                        console.error('Error scraping National Bank of Ethiopia data:', error_1);
                        return [2 /*return*/, []];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    NbeScraper.prototype.scrapeForexInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var steps, bilingualSteps, content, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        steps = [
                            "Visit nbe.gov.et",
                            "Navigate to Exchange Rates section",
                            "Check daily exchange rates",
                            "Understand exchange rate mechanisms",
                            "Follow forex regulations"
                        ];
                        return [4 /*yield*/, this.createBilingualSteps(steps)];
                    case 1:
                        bilingualSteps = _a.sent();
                        content = "\n      The National Bank of Ethiopia (NBE) is the central bank responsible for \n      monetary policy, currency issuance, and foreign exchange regulation.\n      \n      Key forex services include:\n      - Daily exchange rate publication\n      - Forex market regulation\n      - Authorized dealer licensing\n      - Currency stability maintenance\n      ";
                        // Save raw artifact
                        this.saveRawArtifact('https://nbe.gov.et/exchange-rates', 'text/html', content);
                        return [2 /*return*/, {
                                module: "National Bank of Ethiopia",
                                category: "Finance",
                                topic: "Foreign Exchange Information",
                                sector: "Banking",
                                steps: bilingualSteps,
                                requirements: [
                                    "Valid identification document",
                                    "Purpose of forex transaction",
                                    "Required documentation for transaction type"
                                ],
                                validation: [
                                    "Transaction purpose verification",
                                    "Document authenticity check",
                                    "Regulatory compliance"
                                ],
                                lastUpdated: new Date().toISOString(),
                                source: "https://nbe.gov.et/exchange-rates",
                                version: "1.0",
                                language: "en"
                            }];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error scraping forex info data:', error_2);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    NbeScraper.prototype.scrapeBankingServices = function () {
        return __awaiter(this, void 0, void 0, function () {
            var steps, bilingualSteps, content, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        steps = [
                            "Visit nbe.gov.et",
                            "Navigate to Banking Supervision section",
                            "Review licensed financial institutions",
                            "Understand banking regulations",
                            "Access consumer protection information"
                        ];
                        return [4 /*yield*/, this.createBilingualSteps(steps)];
                    case 1:
                        bilingualSteps = _a.sent();
                        content = "\n      The NBE provides oversight and regulation of the banking sector in Ethiopia.\n      \n      Banking supervision includes:\n      - Licensing of financial institutions\n      - Regulatory compliance monitoring\n      - Consumer protection\n      - Financial stability maintenance\n      ";
                        // Save raw artifact
                        this.saveRawArtifact('https://nbe.gov.et/banking-supervision', 'text/html', content);
                        return [2 /*return*/, {
                                module: "National Bank of Ethiopia",
                                category: "Finance",
                                topic: "Banking Services",
                                sector: "Banking",
                                steps: bilingualSteps,
                                requirements: [
                                    "Valid business registration",
                                    "Financial statements",
                                    "Capital requirements documentation",
                                    "Management qualification documents"
                                ],
                                validation: [
                                    "Capital adequacy verification",
                                    "Management fitness assessment",
                                    "Compliance framework review"
                                ],
                                lastUpdated: new Date().toISOString(),
                                source: "https://nbe.gov.et/banking-supervision",
                                version: "1.0",
                                language: "en"
                            }];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Error scraping banking services data:', error_3);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return NbeScraper;
}(BaseScraper_1.BaseScraper));
exports.NbeScraper = NbeScraper;
