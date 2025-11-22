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
exports.VectorDB = void 0;
var fs = require("fs");
var path = require("path");
var VectorDB = /** @class */ (function () {
    function VectorDB() {
        this.embeddings = new Map();
        this.vectorsDir = path.join(__dirname, '..', 'vectors');
        // Create vectors directory if it doesn't exist
        if (!fs.existsSync(this.vectorsDir)) {
            fs.mkdirSync(this.vectorsDir, { recursive: true });
        }
        // Load existing embeddings if they exist
        this.loadEmbeddings();
    }
    /**
     * Generate embeddings for text content
     * In a real implementation, this would use OpenAI, HuggingFace, or a local model
     */
    VectorDB.prototype.generateEmbeddings = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            var openaiKey;
            return __generator(this, function (_a) {
                openaiKey = process.env.OPENAI_API_KEY;
                if (openaiKey) {
                    // In a real implementation, this would call the OpenAI API
                    // For now, we'll use the placeholder implementation
                    return [2 /*return*/, this.generatePlaceholderEmbeddings(text)];
                }
                else {
                    // Use placeholder implementation
                    return [2 /*return*/, this.generatePlaceholderEmbeddings(text)];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Generate placeholder embeddings for demonstration
     */
    VectorDB.prototype.generatePlaceholderEmbeddings = function (text) {
        // Placeholder implementation - in reality, this would use an actual embedding model
        // For demonstration, we'll create a simple hash-based vector
        var vector = [];
        var hash = this.simpleHash(text);
        // Create a 128-dimensional vector (simplified)
        for (var i = 0; i < 128; i++) {
            vector.push((hash >> (i % 32)) & 1);
        }
        return vector;
    };
    /**
     * Store embeddings in the database
     */
    VectorDB.prototype.storeEmbeddings = function (id, vector, metadata) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.embeddings.set(id, { vector: vector, metadata: metadata });
                        console.log("Stored embeddings for ".concat(id));
                        return [4 /*yield*/, this.saveEmbeddings()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Store bilingual embeddings in the database
     */
    VectorDB.prototype.storeBilingualEmbeddings = function (id, enVector, amVector, enMetadata, amMetadata) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.embeddings.set("".concat(id, "_en"), { vector: enVector, metadata: enMetadata });
                        this.embeddings.set("".concat(id, "_am"), { vector: amVector, metadata: amMetadata });
                        console.log("Stored bilingual embeddings for ".concat(id));
                        return [4 /*yield*/, this.saveEmbeddings()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Retrieve embeddings from the database
     */
    VectorDB.prototype.getEmbeddings = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.embeddings.get(id)];
            });
        });
    };
    /**
     * Find similar vectors using cosine similarity
     */
    VectorDB.prototype.findSimilar = function (queryVector_1) {
        return __awaiter(this, arguments, void 0, function (queryVector, topK, filter) {
            var similarities, entries, _i, entries_1, _a, id, _b, vector, metadata, similarity;
            if (topK === void 0) { topK = 5; }
            return __generator(this, function (_c) {
                similarities = [];
                entries = Array.from(this.embeddings.entries());
                for (_i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                    _a = entries_1[_i], id = _a[0], _b = _a[1], vector = _b.vector, metadata = _b.metadata;
                    // Apply filters if provided
                    if (filter) {
                        if (filter.language && metadata.language !== filter.language) {
                            continue;
                        }
                        // Note: category filter would require additional metadata
                    }
                    similarity = this.cosineSimilarity(queryVector, vector);
                    similarities.push({ id: id, similarity: similarity, metadata: metadata });
                }
                // Sort by similarity (highest first)
                similarities.sort(function (a, b) { return b.similarity - a.similarity; });
                // Return top K results
                return [2 /*return*/, similarities.slice(0, topK)];
            });
        });
    };
    /**
     * Generate embeddings for both original_text and translated_text
     */
    VectorDB.prototype.generateBilingualEmbeddings = function (moduleId, originalText, translatedText, metadata) {
        return __awaiter(this, void 0, void 0, function () {
            var originalVector, originalMetadata, translatedVector, translatedMetadata, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.generateEmbeddings(originalText)];
                    case 1:
                        originalVector = _a.sent();
                        originalMetadata = __assign(__assign({}, metadata), { language: 'original' });
                        return [4 /*yield*/, this.generateEmbeddings(translatedText)];
                    case 2:
                        translatedVector = _a.sent();
                        translatedMetadata = __assign(__assign({}, metadata), { language: 'translated' });
                        // Store both embeddings
                        return [4 /*yield*/, this.storeBilingualEmbeddings(moduleId, originalVector, translatedVector, originalMetadata, translatedMetadata)];
                    case 3:
                        // Store both embeddings
                        _a.sent();
                        console.log("Generated and stored bilingual embeddings for module ".concat(moduleId));
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        console.error("Error generating bilingual embeddings for module ".concat(moduleId, ":"), error_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Re-generate embeddings for given module id(s)
     */
    VectorDB.prototype.reindexModules = function (moduleIds) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, moduleIds_1, id;
            return __generator(this, function (_a) {
                console.log("Reindexing modules: ".concat(moduleIds.join(', ')));
                // In a real implementation, this would re-generate embeddings for the specified modules
                // For now, we'll just log the operation
                for (_i = 0, moduleIds_1 = moduleIds; _i < moduleIds_1.length; _i++) {
                    id = moduleIds_1[_i];
                    console.log("Reindexed module: ".concat(id));
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Save embeddings to disk
     */
    VectorDB.prototype.saveEmbeddings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, data;
            return __generator(this, function (_a) {
                try {
                    filePath = path.join(this.vectorsDir, 'embeddings.json');
                    data = JSON.stringify(Array.from(this.embeddings.entries()), null, 2);
                    fs.writeFileSync(filePath, data);
                    console.log("Saved embeddings to ".concat(filePath));
                }
                catch (error) {
                    console.error('Error saving embeddings:', error);
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Load embeddings from disk
     */
    VectorDB.prototype.loadEmbeddings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, data, entries;
            return __generator(this, function (_a) {
                try {
                    filePath = path.join(this.vectorsDir, 'embeddings.json');
                    if (fs.existsSync(filePath)) {
                        data = fs.readFileSync(filePath, 'utf-8');
                        entries = JSON.parse(data);
                        this.embeddings = new Map(entries);
                        console.log("Loaded ".concat(this.embeddings.size, " embeddings from ").concat(filePath));
                    }
                }
                catch (error) {
                    console.error('Error loading embeddings:', error);
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Compute cosine similarity between two vectors
     */
    VectorDB.prototype.cosineSimilarity = function (vecA, vecB) {
        var dotProduct = 0;
        var magnitudeA = 0;
        var magnitudeB = 0;
        for (var i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            magnitudeA += vecA[i] * vecA[i];
            magnitudeB += vecB[i] * vecB[i];
        }
        magnitudeA = Math.sqrt(magnitudeA);
        magnitudeB = Math.sqrt(magnitudeB);
        if (magnitudeA === 0 || magnitudeB === 0) {
            return 0;
        }
        return dotProduct / (magnitudeA * magnitudeB);
    };
    /**
     * Simple hash function for placeholder embeddings
     */
    VectorDB.prototype.simpleHash = function (str) {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            var char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash;
    };
    return VectorDB;
}());
exports.VectorDB = VectorDB;
