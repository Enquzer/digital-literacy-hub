import * as fs from 'fs';
import * as path from 'path';

// Vector metadata interface
interface VectorMetadata {
  module_id: string;
  language: string;
  source_url: string;
  version: string;
  created_at: string;
}

export class VectorDB {
  private embeddings: Map<string, { vector: number[], metadata: VectorMetadata }>;
  private vectorsDir: string;
  
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
  async generateEmbeddings(text: string): Promise<number[]> {
    // Check if we have an API key for OpenAI
    const openaiKey = process.env.OPENAI_API_KEY;
    
    if (openaiKey) {
      // In a real implementation, this would call the OpenAI API
      // For now, we'll use the placeholder implementation
      return this.generatePlaceholderEmbeddings(text);
    } else {
      // Use placeholder implementation
      return this.generatePlaceholderEmbeddings(text);
    }
  }
  
  /**
   * Generate placeholder embeddings for demonstration
   */
  private generatePlaceholderEmbeddings(text: string): number[] {
    // Placeholder implementation - in reality, this would use an actual embedding model
    // For demonstration, we'll create a simple hash-based vector
    const vector: number[] = [];
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
  async storeEmbeddings(id: string, vector: number[], metadata: VectorMetadata): Promise<void> {
    this.embeddings.set(id, { vector, metadata });
    console.log(`Stored embeddings for ${id}`);
    await this.saveEmbeddings();
  }
  
  /**
   * Store bilingual embeddings in the database
   */
  async storeBilingualEmbeddings(
    id: string, 
    enVector: number[], 
    amVector: number[], 
    enMetadata: VectorMetadata,
    amMetadata: VectorMetadata
  ): Promise<void> {
    this.embeddings.set(`${id}_en`, { vector: enVector, metadata: enMetadata });
    this.embeddings.set(`${id}_am`, { vector: amVector, metadata: amMetadata });
    console.log(`Stored bilingual embeddings for ${id}`);
    await this.saveEmbeddings();
  }
  
  /**
   * Retrieve embeddings from the database
   */
  async getEmbeddings(id: string): Promise<{ vector: number[], metadata: VectorMetadata } | undefined> {
    return this.embeddings.get(id);
  }
  
  /**
   * Find similar vectors using cosine similarity
   */
  async findSimilar(
    queryVector: number[], 
    topK: number = 5,
    filter?: { language?: string, category?: string }
  ): Promise<Array<{id: string, similarity: number, metadata: VectorMetadata}>> {
    const similarities: Array<{id: string, similarity: number, metadata: VectorMetadata}> = [];
    
    // Convert Map iterator to array to avoid downlevelIteration issues
    const entries = Array.from(this.embeddings.entries());
    
    for (const [id, { vector, metadata }] of entries) {
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
  async generateBilingualEmbeddings(
    moduleId: string,
    originalText: string,
    translatedText: string,
    metadata: Omit<VectorMetadata, 'language'>
  ): Promise<void> {
    try {
      // Generate embeddings for original text
      const originalVector = await this.generateEmbeddings(originalText);
      const originalMetadata: VectorMetadata = {
        ...metadata,
        language: 'original'
      };
      
      // Generate embeddings for translated text
      const translatedVector = await this.generateEmbeddings(translatedText);
      const translatedMetadata: VectorMetadata = {
        ...metadata,
        language: 'translated'
      };
      
      // Store both embeddings
      await this.storeBilingualEmbeddings(
        moduleId,
        originalVector,
        translatedVector,
        originalMetadata,
        translatedMetadata
      );
      
      console.log(`Generated and stored bilingual embeddings for module ${moduleId}`);
    } catch (error) {
      console.error(`Error generating bilingual embeddings for module ${moduleId}:`, error);
    }
  }
  
  /**
   * Re-generate embeddings for given module id(s)
   */
  async reindexModules(moduleIds: string[]): Promise<void> {
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
  private async saveEmbeddings(): Promise<void> {
    try {
      const filePath = path.join(this.vectorsDir, 'embeddings.json');
      const data = JSON.stringify(Array.from(this.embeddings.entries()), null, 2);
      fs.writeFileSync(filePath, data);
      console.log(`Saved embeddings to ${filePath}`);
    } catch (error) {
      console.error('Error saving embeddings:', error);
    }
  }
  
  /**
   * Load embeddings from disk
   */
  private async loadEmbeddings(): Promise<void> {
    try {
      const filePath = path.join(this.vectorsDir, 'embeddings.json');
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf-8');
        const entries = JSON.parse(data);
        this.embeddings = new Map(entries);
        console.log(`Loaded ${this.embeddings.size} embeddings from ${filePath}`);
      }
    } catch (error) {
      console.error('Error loading embeddings:', error);
    }
  }
  
  /**
   * Compute cosine similarity between two vectors
   */
  private cosineSimilarity(vecA: number[], vecB: number[]): number {
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
   * Simple hash function for placeholder embeddings
   */
  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }
}