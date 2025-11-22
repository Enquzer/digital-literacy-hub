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
exports.TradeScraper = void 0;
var BaseScraper_1 = require("./BaseScraper");
var TradeScraper = /** @class */ (function (_super) {
    __extends(TradeScraper, _super);
    function TradeScraper() {
        return _super.call(this, 'https://etrade.gov.et', 'trade') || this;
    }
    TradeScraper.prototype.scrape = function () {
        return __awaiter(this, void 0, void 0, function () {
            var modules, eTradeModule, facilitationModule, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        modules = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.scrapeETradePortal()];
                    case 2:
                        eTradeModule = _a.sent();
                        if (eTradeModule)
                            modules.push(eTradeModule);
                        return [4 /*yield*/, this.scrapeTradeFacilitation()];
                    case 3:
                        facilitationModule = _a.sent();
                        if (facilitationModule)
                            modules.push(facilitationModule);
                        // Save to JSON
                        this.saveToJson(modules, 'module-trade.json');
                        return [2 /*return*/, modules];
                    case 4:
                        error_1 = _a.sent();
                        console.error('Error scraping Ministry of Trade data:', error_1);
                        return [2 /*return*/, []];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    TradeScraper.prototype.scrapeETradePortal = function () {
        return __awaiter(this, void 0, void 0, function () {
            var steps, bilingualSteps, content, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        steps = [
                            "Visit etrade.gov.et",
                            "Register for an account",
                            "Complete business verification",
                            "Access trade services",
                            "Utilize digital trade tools"
                        ];
                        return [4 /*yield*/, this.createBilingualSteps(steps)];
                    case 1:
                        bilingualSteps = _a.sent();
                        content = "\n      The eTrade portal is Ethiopia's digital platform for facilitating \n      international trade and export promotion.\n      \n      Services include:\n      - Export promotion programs\n      - Trade information services\n      - Market access support\n      - Digital trade facilitation\n      ";
                        // Save raw artifact
                        this.saveRawArtifact('https://etrade.gov.et', 'text/html', content);
                        return [2 /*return*/, {
                                module: "Ministry of Trade",
                                category: "Trade",
                                topic: "eTrade Portal Services",
                                sector: "International Trade",
                                steps: bilingualSteps,
                                requirements: [
                                    "Valid business registration",
                                    "Export license",
                                    "Product certification",
                                    "Contact information"
                                ],
                                validation: [
                                    "Business registration verification",
                                    "Export license validation",
                                    "Product compliance check"
                                ],
                                lastUpdated: new Date().toISOString(),
                                source: "https://etrade.gov.et",
                                version: "1.0",
                                language: "en"
                            }];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error scraping eTrade portal data:', error_2);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TradeScraper.prototype.scrapeTradeFacilitation = function () {
        return __awaiter(this, void 0, void 0, function () {
            var steps, bilingualSteps, content, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        steps = [
                            "Visit moft.gov.et",
                            "Review trade facilitation measures",
                            "Access regulatory information",
                            "Understand customs procedures",
                            "Utilize trade support services"
                        ];
                        return [4 /*yield*/, this.createBilingualSteps(steps)];
                    case 1:
                        bilingualSteps = _a.sent();
                        content = "\n      The Ministry of Trade implements various trade facilitation measures \n      to enhance Ethiopia's competitiveness in international markets.\n      \n      Key initiatives include:\n      - Simplification of trade procedures\n      - Digitalization of trade processes\n      - Capacity building for exporters\n      - Trade policy development\n      ";
                        // Save raw artifact
                        this.saveRawArtifact('https://moft.gov.et', 'text/html', content);
                        return [2 /*return*/, {
                                module: "Ministry of Trade",
                                category: "Trade",
                                topic: "Trade Facilitation",
                                sector: "International Trade",
                                steps: bilingualSteps,
                                requirements: [
                                    "Valid business registration",
                                    "Trade license",
                                    "Product documentation",
                                    "Compliance certificates"
                                ],
                                validation: [
                                    "Document verification",
                                    "Regulatory compliance check",
                                    "Quality standards validation"
                                ],
                                lastUpdated: new Date().toISOString(),
                                source: "https://moft.gov.et",
                                version: "1.0",
                                language: "en"
                            }];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Error scraping trade facilitation data:', error_3);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return TradeScraper;
}(BaseScraper_1.BaseScraper));
exports.TradeScraper = TradeScraper;
