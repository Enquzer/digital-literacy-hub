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
exports.Scheduler = void 0;
var cron_1 = require("cron");
var ETaxScraper_1 = require("./scrapers/ETaxScraper");
var CustomsScraper_1 = require("./scrapers/CustomsScraper");
var MorScraper_1 = require("./scrapers/MorScraper");
var CustomsCommissionScraper_1 = require("./scrapers/CustomsCommissionScraper");
var NbeScraper_1 = require("./scrapers/NbeScraper");
var TradeScraper_1 = require("./scrapers/TradeScraper");
var OpenDataScraper_1 = require("./scrapers/OpenDataScraper");
var DataProcessor_1 = require("./processors/DataProcessor");
var database_1 = require("./api/database");
var fs = require("fs");
var path = require("path");
var Scheduler = /** @class */ (function () {
    function Scheduler() {
        this.jobs = [];
        this.isRunning = false;
        // Initialize scrapers
        this.initializeScrapers();
    }
    Scheduler.prototype.initializeScrapers = function () {
        console.log('Initializing scrapers...');
    };
    // Schedule periodic scraping jobs
    Scheduler.prototype.startScheduledJobs = function () {
        var _this = this;
        if (this.isRunning) {
            console.log('Scheduler is already running');
            return;
        }
        this.isRunning = true;
        console.log('Starting scheduled scraping jobs...');
        // Schedule ETax scraping every 6 hours
        var etaxJob = new cron_1.CronJob('0 0 */6 * * *', function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Running ETax scraping job...');
                        return [4 /*yield*/, this.runScraperJob('etax', function () { return __awaiter(_this, void 0, void 0, function () {
                                var scraper;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            scraper = new ETaxScraper_1.ETaxScraper();
                                            return [4 /*yield*/, scraper.scrape()];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // Schedule Customs scraping every 6 hours
        var customsJob = new cron_1.CronJob('0 0 */6 * * *', function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Running Customs scraping job...');
                        return [4 /*yield*/, this.runScraperJob('customs', function () { return __awaiter(_this, void 0, void 0, function () {
                                var scraper;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            scraper = new CustomsScraper_1.CustomsScraper();
                                            return [4 /*yield*/, scraper.scrape()];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // Schedule MOR scraping every 12 hours
        var morJob = new cron_1.CronJob('0 0 */12 * * *', function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Running MOR scraping job...');
                        return [4 /*yield*/, this.runScraperJob('mor', function () { return __awaiter(_this, void 0, void 0, function () {
                                var scraper;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            scraper = new MorScraper_1.MorScraper();
                                            return [4 /*yield*/, scraper.scrape()];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // Schedule Customs Commission scraping every 12 hours
        var customsCommissionJob = new cron_1.CronJob('0 0 */12 * * *', function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Running Customs Commission scraping job...');
                        return [4 /*yield*/, this.runScraperJob('customs-commission', function () { return __awaiter(_this, void 0, void 0, function () {
                                var scraper;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            scraper = new CustomsCommissionScraper_1.CustomsCommissionScraper();
                                            return [4 /*yield*/, scraper.scrape()];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // Schedule NBE scraping every 24 hours
        var nbeJob = new cron_1.CronJob('0 0 0 * * *', function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Running NBE scraping job...');
                        return [4 /*yield*/, this.runScraperJob('nbe', function () { return __awaiter(_this, void 0, void 0, function () {
                                var scraper;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            scraper = new NbeScraper_1.NbeScraper();
                                            return [4 /*yield*/, scraper.scrape()];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // Schedule Trade scraping every 24 hours
        var tradeJob = new cron_1.CronJob('0 0 0 * * *', function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Running Trade scraping job...');
                        return [4 /*yield*/, this.runScraperJob('trade', function () { return __awaiter(_this, void 0, void 0, function () {
                                var scraper;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            scraper = new TradeScraper_1.TradeScraper();
                                            return [4 /*yield*/, scraper.scrape()];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // Schedule Open Data scraping every 24 hours
        var openDataJob = new cron_1.CronJob('0 0 0 * * *', function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Running Open Data scraping job...');
                        return [4 /*yield*/, this.runScraperJob('open-data', function () { return __awaiter(_this, void 0, void 0, function () {
                                var scraper;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            scraper = new OpenDataScraper_1.OpenDataScraper();
                                            return [4 /*yield*/, scraper.scrape()];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // Schedule full processing job every 6 hours
        var processingJob = new cron_1.CronJob('0 30 */6 * * *', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Running data processing job...');
                        return [4 /*yield*/, this.runProcessingJob()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // Start all jobs
        etaxJob.start();
        customsJob.start();
        morJob.start();
        customsCommissionJob.start();
        nbeJob.start();
        tradeJob.start();
        openDataJob.start();
        processingJob.start();
        this.jobs = [
            etaxJob,
            customsJob,
            morJob,
            customsCommissionJob,
            nbeJob,
            tradeJob,
            openDataJob,
            processingJob
        ];
        console.log('All scheduled jobs started successfully');
    };
    // Run a single scraper job
    Scheduler.prototype.runScraperJob = function (name, scraperFunction) {
        return __awaiter(this, void 0, void 0, function () {
            var data, cacheDir, filePath, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log("Starting ".concat(name, " scraping job..."));
                        return [4 /*yield*/, scraperFunction()];
                    case 1:
                        data = _a.sent();
                        if (data && data.length > 0) {
                            cacheDir = path.join(__dirname, 'cache');
                            if (!fs.existsSync(cacheDir)) {
                                fs.mkdirSync(cacheDir, { recursive: true });
                            }
                            filePath = path.join(cacheDir, "module-".concat(name, ".json"));
                            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
                            console.log("Saved ".concat(data.length, " modules to ").concat(filePath));
                            // Log success
                            this.logScrapingResult(name, 'success', "Successfully scraped ".concat(data.length, " modules"));
                        }
                        else {
                            console.log("No data returned from ".concat(name, " scraper"));
                            this.logScrapingResult(name, 'warning', 'No data returned from scraper');
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Error in ".concat(name, " scraping job:"), error_1);
                        this.logScrapingResult(name, 'error', "Error: ".concat(error_1 instanceof Error ? error_1.message : 'Unknown error'));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Run the data processing job
    Scheduler.prototype.runProcessingJob = function () {
        return __awaiter(this, void 0, void 0, function () {
            var processor, TrainingDataPackager, packager, importError_1, processedDir, files, jsonFiles, savedModules, _i, jsonFiles_1, file, filePath, rawData, modules, _a, modules_1, module_1, saveError_1, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 17, , 18]);
                        console.log('Starting data processing job...');
                        processor = new DataProcessor_1.DataProcessor();
                        return [4 /*yield*/, processor.processAllModules()];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, Promise.resolve().then(function () { return require('./processors/TrainingDataPackager'); })];
                    case 3:
                        TrainingDataPackager = (_b.sent()).TrainingDataPackager;
                        packager = new TrainingDataPackager();
                        return [4 /*yield*/, packager.packageAllModules()];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        importError_1 = _b.sent();
                        console.error('Error importing TrainingDataPackager:', importError_1);
                        return [3 /*break*/, 6];
                    case 6:
                        processedDir = path.join(__dirname, 'processed');
                        if (!fs.existsSync(processedDir)) return [3 /*break*/, 15];
                        files = fs.readdirSync(processedDir);
                        jsonFiles = files.filter(function (file) { return file.endsWith('-processed.json'); });
                        savedModules = 0;
                        _i = 0, jsonFiles_1 = jsonFiles;
                        _b.label = 7;
                    case 7:
                        if (!(_i < jsonFiles_1.length)) return [3 /*break*/, 14];
                        file = jsonFiles_1[_i];
                        filePath = path.join(processedDir, file);
                        rawData = fs.readFileSync(filePath, 'utf-8');
                        modules = JSON.parse(rawData);
                        _a = 0, modules_1 = modules;
                        _b.label = 8;
                    case 8:
                        if (!(_a < modules_1.length)) return [3 /*break*/, 13];
                        module_1 = modules_1[_a];
                        _b.label = 9;
                    case 9:
                        _b.trys.push([9, 11, , 12]);
                        return [4 /*yield*/, (0, database_1.saveModule)(module_1)];
                    case 10:
                        _b.sent();
                        savedModules++;
                        return [3 /*break*/, 12];
                    case 11:
                        saveError_1 = _b.sent();
                        console.error("Error saving module ".concat(module_1.id, ":"), saveError_1);
                        return [3 /*break*/, 12];
                    case 12:
                        _a++;
                        return [3 /*break*/, 8];
                    case 13:
                        _i++;
                        return [3 /*break*/, 7];
                    case 14:
                        console.log("Data processing job completed. Saved ".concat(savedModules, " modules to database."));
                        this.logScrapingResult('processing', 'success', "Successfully processed and saved ".concat(savedModules, " modules"));
                        return [3 /*break*/, 16];
                    case 15:
                        console.log('No processed directory found');
                        this.logScrapingResult('processing', 'warning', 'No processed directory found');
                        _b.label = 16;
                    case 16: return [3 /*break*/, 18];
                    case 17:
                        error_2 = _b.sent();
                        console.error('Error in data processing job:', error_2);
                        this.logScrapingResult('processing', 'error', "Error: ".concat(error_2 instanceof Error ? error_2.message : 'Unknown error'));
                        return [3 /*break*/, 18];
                    case 18: return [2 /*return*/];
                }
            });
        });
    };
    // Log scraping results
    Scheduler.prototype.logScrapingResult = function (source, status, message) {
        var logEntry = {
            id: "".concat(source, "-").concat(Date.now()),
            source_url: this.getSourceUrl(source),
            status: status,
            message: message,
            timestamp: new Date().toISOString()
        };
        // In a real implementation, we would save this to a database
        // For now, we'll just log it
        console.log('Scraping log entry:', logEntry);
    };
    // Get source URL for logging
    Scheduler.prototype.getSourceUrl = function (source) {
        var urls = {
            'etax': 'https://etrax.mor.gov.et',
            'customs': 'https://customs.gov.et',
            'mor': 'https://mor.gov.et',
            'customs-commission': 'https://ecc.gov.et',
            'nbe': 'https://nbe.gov.et',
            'trade': 'https://trade.gov.et',
            'open-data': 'https://opendata.gov.et',
            'processing': 'internal-processing'
        };
        return urls[source] || 'unknown';
    };
    // Stop all scheduled jobs
    Scheduler.prototype.stopScheduledJobs = function () {
        console.log('Stopping scheduled jobs...');
        this.jobs.forEach(function (job) { return job.stop(); });
        this.jobs = [];
        this.isRunning = false;
        console.log('All scheduled jobs stopped');
    };
    // Run all scrapers immediately (for manual updates)
    Scheduler.prototype.runAllScrapers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var scrapers, results, _i, scrapers_1, _a, name_1, scraper, data, cacheDir, filePath, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log('Running all scrapers immediately...');
                        scrapers = [
                            { name: 'etax', scraper: new ETaxScraper_1.ETaxScraper() },
                            { name: 'customs', scraper: new CustomsScraper_1.CustomsScraper() },
                            { name: 'mor', scraper: new MorScraper_1.MorScraper() },
                            { name: 'customs-commission', scraper: new CustomsCommissionScraper_1.CustomsCommissionScraper() },
                            { name: 'nbe', scraper: new NbeScraper_1.NbeScraper() },
                            { name: 'trade', scraper: new TradeScraper_1.TradeScraper() },
                            { name: 'open-data', scraper: new OpenDataScraper_1.OpenDataScraper() }
                        ];
                        results = [];
                        _i = 0, scrapers_1 = scrapers;
                        _b.label = 1;
                    case 1:
                        if (!(_i < scrapers_1.length)) return [3 /*break*/, 6];
                        _a = scrapers_1[_i], name_1 = _a.name, scraper = _a.scraper;
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        console.log("Running ".concat(name_1, " scraper..."));
                        return [4 /*yield*/, scraper.scrape()];
                    case 3:
                        data = _b.sent();
                        results.push({ name: name_1, data: data, success: true });
                        // Save to cache
                        if (data && data.length > 0) {
                            cacheDir = path.join(__dirname, 'cache');
                            if (!fs.existsSync(cacheDir)) {
                                fs.mkdirSync(cacheDir, { recursive: true });
                            }
                            filePath = path.join(cacheDir, "module-".concat(name_1, ".json"));
                            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
                            console.log("Saved ".concat(data.length, " modules to ").concat(filePath));
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_3 = _b.sent();
                        console.error("Error running ".concat(name_1, " scraper:"), error_3);
                        results.push({ name: name_1, data: [], success: false, error: error_3 });
                        return [3 /*break*/, 5];
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6: 
                    // Process all data
                    return [4 /*yield*/, this.runProcessingJob()];
                    case 7:
                        // Process all data
                        _b.sent();
                        return [2 /*return*/, results];
                }
            });
        });
    };
    return Scheduler;
}());
exports.Scheduler = Scheduler;
