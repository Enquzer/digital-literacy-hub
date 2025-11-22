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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VectorDB = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class VectorDB {
    constructor() {
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
    async generateEmbeddings(text) {
        // Check if we have an API key for OpenAI
        const openaiKey = process.env.OPENAI_API_KEY;
        if (openaiKey) {
            // In a real implementation, this would call the OpenAI API
            // For now, we'll use the placeholder implementation
            return this.generatePlaceholderEmbeddings(text);
        }
        else {
            // Use placeholder implementation
            return this.generatePlaceholderEmbeddings(text);
        }
    }
    /**
     * Generate placeholder embeddings for demonstration
     */
    generatePlaceholderEmbeddings(text) {
        // Placeholder implementation - in reality, this would use an actual embedding model
        // For demonstration, we'll create a simple hash-based vector
        const vector = [];
        const hash = this.simpleHash(text);
        // Create a 128-dimensional vector (simplified)
        for (let i = 0; i < 128; i++) {
            vector.push((hash >> (i % 32)) & 1);
        }
        return vector;
    }
    /**
     * Store embeddings in the database
     */
    async storeEmbeddings(id, vector, metadata) {
        this.embeddings.set(id, { vector, metadata });
        console.log(`Stored embeddings for ${id}`);
        await this.saveEmbeddings();
    }
    /**
     * Store bilingual embeddings in the database
     */
    async storeBilingualEmbeddings(id, enVector, amVector, enMetadata, amMetadata) {
        this.embeddings.set(`${id}_en`, { vector: enVector, metadata: enMetadata });
        this.embeddings.set(`${id}_am`, { vector: amVector, metadata: amMetadata });
        console.log(`Stored bilingual embeddings for ${id}`);
        await this.saveEmbeddings();
    }
    /**
     * Retrieve embeddings from the database
     */
    async getEmbeddings(id) {
        return this.embeddings.get(id);
    }
    /**
     * Find similar vectors using cosine similarity
     */
    async findSimilar(queryVector, topK = 5, filter) {
        const similarities = [];
        for (const [id, { vector, metadata }] of this.embeddings.entries()) {
            // Apply filters if provided
            if (filter) {
                if (filter.language && metadata.language !== filter.language) {
                    continue;
                }
                // Note: category filter would require additional metadata
            }
            const similarity = this.cosineSimilarity(queryVector, vector);
            similarities.push({ id, similarity, metadata });
        }
        // Sort by similarity (highest first)
        similarities.sort((a, b) => b.similarity - a.similarity);
        // Return top K results
        return similarities.slice(0, topK);
    }
    /**
     * Generate embeddings for both original_text and translated_text
     */
    async generateBilingualEmbeddings(moduleId, originalText, translatedText, metadata) {
        try {
            // Generate embeddings for original text
            const originalVector = await this.generateEmbeddings(originalText);
            const originalMetadata = Object.assign(Object.assign({}, metadata), { language: 'original' });
            // Generate embeddings for translated text
            const translatedVector = await this.generateEmbeddings(translatedText);
            const translatedMetadata = Object.assign(Object.assign({}, metadata), { language: 'translated' });
            // Store both embeddings
            await this.storeBilingualEmbeddings(moduleId, originalVector, translatedVector, originalMetadata, translatedMetadata);
            console.log(`Generated and stored bilingual embeddings for module ${moduleId}`);
        }
        catch (error) {
            console.error(`Error generating bilingual embeddings for module ${moduleId}:`, error);
        }
    }
    /**
     * Re-generate embeddings for given module id(s)
     */
    async reindexModules(moduleIds) {
        console.log(`Reindexing modules: ${moduleIds.join(', ')}`);
        // In a real implementation, this would re-generate embeddings for the specified modules
        // For now, we'll just log the operation
        for (const id of moduleIds) {
            console.log(`Reindexed module: ${id}`);
        }
    }
    /**
     * Save embeddings to disk
     */
    async saveEmbeddings() {
        try {
            const filePath = path.join(this.vectorsDir, 'embeddings.json');
            const data = JSON.stringify(Array.from(this.embeddings.entries()), null, 2);
            fs.writeFileSync(filePath, data);
            console.log(`Saved embeddings to ${filePath}`);
        }
        catch (error) {
            console.error('Error saving embeddings:', error);
        }
    }
    /**
     * Load embeddings from disk
     */
    async loadEmbeddings() {
        try {
            const filePath = path.join(this.vectorsDir, 'embeddings.json');
            if (fs.existsSync(filePath)) {
                const data = fs.readFileSync(filePath, 'utf-8');
                const entries = JSON.parse(data);
                this.embeddings = new Map(entries);
                console.log(`Loaded ${this.embeddings.size} embeddings from ${filePath}`);
            }
        }
        catch (error) {
            console.error('Error loading embeddings:', error);
        }
    }
    /**
     * Simple hash function for demonstration
     */
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }
    /**
     * Calculate cosine similarity between two vectors
     */
    cosineSimilarity(vecA, vecB) {
        if (vecA.length !== vecB.length) {
            throw new Error('Vectors must have the same length');
        }
        let dotProduct = 0;
        let magnitudeA = 0;
        let magnitudeB = 0;
        for (let i = 0; i < vecA.length; i++) {
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
    }
    /**
     * Get database statistics
     */
    getStats() {
        return {
            totalVectors: this.embeddings.size
        };
    }
}
exports.VectorDB = VectorDB;
