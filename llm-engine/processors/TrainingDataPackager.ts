import * as fs from 'fs';
import * as path from 'path';
import { KnowledgeModule } from '../schemas/knowledgeModule.schema';

export class TrainingDataPackager {
  private processedDir: string;
  private trainingDataDir: string;

  constructor() {
    this.processedDir = path.join(__dirname, '..', 'processed');
    this.trainingDataDir = path.join(__dirname, '..', 'training-data');
    
    // Create training data directory if it doesn't exist
    if (!fs.existsSync(this.trainingDataDir)) {
      fs.mkdirSync(this.trainingDataDir, { recursive: true });
    }
  }

  /**
   * Package all processed modules into training data formats
   */
  async packageAllModules(): Promise<void> {
    try {
      const files = fs.readdirSync(this.processedDir);
      const jsonFiles = files.filter(file => file.endsWith('-processed.json'));
      
      // Arrays to hold all training data
      const qaPairs: any[] = [];
      const instructionExamples: any[] = [];
      const embeddingTexts: any[] = [];
      
      for (const file of jsonFiles) {
        const filePath = path.join(this.processedDir, file);
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const modules: KnowledgeModule[] = JSON.parse(rawData);
        
        for (const module of modules) {
          const qa = this.generateQAPairs(module);
          const instructions = this.generateInstructionExamples(module);
          const embeddings = this.generateEmbeddingText(module);
          
          qaPairs.push(...qa);
          instructionExamples.push(...instructions);
          embeddingTexts.push(...embeddings);
        }
      }
      
      // Save training data
      this.saveTrainingData('qa-pairs.json', qaPairs);
      this.saveTrainingData('instruction-examples.json', instructionExamples);
      this.saveTrainingData('embedding-texts.json', embeddingTexts);
      
      console.log(`Packaged training data from ${jsonFiles.length} files`);
      console.log(`Generated ${qaPairs.length} QA pairs`);
      console.log(`Generated ${instructionExamples.length} instruction examples`);
      console.log(`Generated ${embeddingTexts.length} embedding texts`);
    } catch (error) {
      console.error('Error packaging training data:', error);
    }
  }

  /**
   * Generate QA pairs from module
   */
  private generateQAPairs(module: KnowledgeModule): any[] {
    const qaPairs: any[] = [];
    
    // Generate QA pairs from FAQs
    if (module.faqs && module.faqs.length > 0) {
      for (const faq of module.faqs) {
        qaPairs.push({
          question: faq.question.en,
          answer: faq.answer.en,
          language: 'en',
          module_id: module.id,
          category: module.category
        });
        
        qaPairs.push({
          question: faq.question.am,
          answer: faq.answer.am,
          language: 'am',
          module_id: module.id,
          category: module.category
        });
      }
    }
    
    // Generate QA pairs from workflows
    if (module.workflows && module.workflows.length > 0) {
      for (const workflow of module.workflows) {
        qaPairs.push({
          question: `What is step ${workflow.step} in the ${module.title} process?`,
          answer: workflow.description.en,
          language: 'en',
          module_id: module.id,
          category: module.category
        });
        
        qaPairs.push({
          question: `${module.title} በሂደቱ ውስጥ ደረጃ ${workflow.step} ምንድን ነው?`,
          answer: workflow.description.am,
          language: 'am',
          module_id: module.id,
          category: module.category
        });
      }
    }
    
    // Generate QA pairs from examples
    if (module.examples && module.examples.length > 0) {
      for (const example of module.examples) {
        qaPairs.push({
          question: `Can you provide an example of ${module.title}?`,
          answer: `${example.title.en}: ${example.description.en}`,
          language: 'en',
          module_id: module.id,
          category: module.category
        });
        
        qaPairs.push({
          question: `እርስዎ ${module.title} ምሳሌ ማቅረብ ይችላሉ?`,
          answer: `${example.title.am}: ${example.description.am}`,
          language: 'am',
          module_id: module.id,
          category: module.category
        });
      }
    }
    
    return qaPairs;
  }

  /**
   * Generate instruction tuning examples from module
   */
  private generateInstructionExamples(module: KnowledgeModule): any[] {
    const examples: any[] = [];
    
    // Generate instruction examples for summarization
    if (module.source_body) {
      examples.push({
        instruction: "Summarize the following government service process:",
        input: module.source_body.substring(0, 500), // Limit input size
        output: `This module explains the ${module.title} process in the ${module.category} category.`,
        language: 'en',
        module_id: module.id
      });
      
      examples.push({
        instruction: "የሚከተለውን የመንግስት አገልግሎት ሂደት ያጠቃልሉ:",
        input: module.source_body.substring(0, 500),
        output: `ይህ ሞድዩል በ${module.category} ምድብ ውስጥ የ${module.title} ሂደትን ይብራራል።`,
        language: 'am',
        module_id: module.id
      });
    }
    
    // Generate instruction examples for step-by-step guidance
    if (module.workflows && module.workflows.length > 0) {
      const steps = module.workflows.map(w => w.description.en).join('\n');
      examples.push({
        instruction: "Provide step-by-step guidance for the following process:",
        input: module.title || '',
        output: steps,
        language: 'en',
        module_id: module.id
      });
      
      const stepsAm = module.workflows.map(w => w.description.am).join('\n');
      examples.push({
        instruction: "ለሚከተለው ሂደት ደረጃ በደረጃ መመሪያ ያቅርቡ:",
        input: module.title || '',
        output: stepsAm,
        language: 'am',
        module_id: module.id
      });
    }
    
    return examples;
  }

  /**
   * Generate embedding-ready text from module
   */
  private generateEmbeddingText(module: KnowledgeModule): any[] {
    const texts: any[] = [];
    
    // Add original text for embedding
    if (module.original_text) {
      texts.push({
        text: module.original_text,
        language: module.language,
        module_id: module.id,
        category: module.category,
        source_url: module.source_url
      });
    }
    
    // Add translated text for embedding
    if (module.translated_text && module.translated_text !== module.original_text) {
      texts.push({
        text: module.translated_text,
        language: module.language === 'en' ? 'am' : 'en',
        module_id: module.id,
        category: module.category,
        source_url: module.source_url
      });
    }
    
    // Add title for embedding
    if (module.title) {
      texts.push({
        text: module.title,
        language: module.language,
        module_id: module.id,
        category: module.category,
        source_url: module.source_url
      });
    }
    
    // Add workflow descriptions for embedding
    if (module.workflows) {
      for (const workflow of module.workflows) {
        texts.push({
          text: workflow.description.en,
          language: 'en',
          module_id: module.id,
          category: module.category,
          source_url: module.source_url
        });
        
        texts.push({
          text: workflow.description.am,
          language: 'am',
          module_id: module.id,
          category: module.category,
          source_url: module.source_url
        });
      }
    }
    
    return texts;
  }

  /**
   * Save training data to file
   */
  private saveTrainingData(filename: string, data: any[]): void {
    const filePath = path.join(this.trainingDataDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Saved ${data.length} items to ${filePath}`);
  }
}