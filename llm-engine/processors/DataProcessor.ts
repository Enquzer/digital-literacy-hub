import * as fs from 'fs';
import * as path from 'path';
import { KnowledgeModule, Step, Workflow } from '../schemas/knowledgeModule.schema';

export class DataProcessor {
  private cacheDir: string;
  private processedDir: string;
  private rawDir: string;
  private processedSampleDir: string;

  constructor() {
    this.cacheDir = path.join(__dirname, '..', 'cache');
    this.rawDir = path.join(__dirname, '..', 'cache', 'raw');
    this.processedDir = path.join(__dirname, '..', 'processed');
    this.processedSampleDir = path.join(__dirname, '..', 'cache', 'processed', 'sample-modules');
    
    // Create directories if they don't exist
    [this.processedDir, this.processedSampleDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * Process all cached JSON files and convert them to training-ready format
   */
  async processAllModules(): Promise<void> {
    try {
      const files = fs.readdirSync(this.cacheDir);
      const jsonFiles = files.filter(file => file.endsWith('.json') && file.startsWith('module-'));
      
      for (const file of jsonFiles) {
        await this.processModuleFile(file);
      }
      
      console.log(`Processed ${jsonFiles.length} module files`);
    } catch (error) {
      console.error('Error processing modules:', error);
    }
  }

  /**
   * Process a single module file
   */
  private async processModuleFile(filename: string): Promise<void> {
    try {
      const filePath = path.join(this.cacheDir, filename);
      const rawData = fs.readFileSync(filePath, 'utf-8');
      const modules: KnowledgeModule[] = JSON.parse(rawData);
      
      // Process each module
      const processedModules = await Promise.all(modules.map(module => this.processModule(module)));
      
      // Save processed data
      const processedFilename = filename.replace('.json', '-processed.json');
      const processedPath = path.join(this.processedDir, processedFilename);
      fs.writeFileSync(processedPath, JSON.stringify(processedModules, null, 2));
      
      console.log(`Processed ${filename} -> ${processedFilename}`);
    } catch (error) {
      console.error(`Error processing ${filename}:`, error);
    }
  }

  /**
   * Process individual module data
   */
  private async processModule(module: KnowledgeModule): Promise<KnowledgeModule> {
    // Generate ID and slug if not present
    if (!module.id) {
      module.id = this.generateModuleId(module);
    }
    
    if (!module.slug) {
      module.slug = this.generateSlug(module);
    }
    
    // Set title from legacy module field if not present
    if (!module.title && module.module) {
      module.title = module.module;
    }
    
    // Set source_url from legacy source field if not present
    if (!module.source_url && module.source) {
      module.source_url = module.source;
    }
    
    // Set updated_at from legacy lastUpdated field if not present
    if (!module.updated_at && module.lastUpdated) {
      module.updated_at = module.lastUpdated;
    }
    
    // Set version if not present
    if (!module.version) {
      module.version = "1.0";
    }
    
    // Set source_body from steps and requirements if not present
    if (!module.source_body) {
      module.source_body = this.formatModuleContent(module);
    }
    
    // Detect language and process text
    await this.processTextContent(module);
    
    // Generate workflows from legacy steps if not present
    if (!module.workflows && module.steps) {
      module.workflows = this.convertStepsToWorkflows(module.steps);
    }
    
    // Set default empty arrays for optional fields
    module.tags = module.tags || [];
    module.sector_tags = module.sector_tags || [];
    module.required_documents = module.required_documents || (module.requirements || []);
    module.common_errors = module.common_errors || [];
    module.faqs = module.faqs || [];
    module.examples = module.examples || [];
    module.screenshots = module.screenshots || [];
    
    return module;
  }

  /**
   * Process text content for language detection and translation
   */
  private async processTextContent(module: KnowledgeModule): Promise<void> {
    // In a real implementation, this would use an actual translation API
    // For now, we'll just set the original_text and translated_text based on language
    
    if (module.language === 'am') {
      // For Amharic content, set original_text and generate English translation
      module.original_text = module.source_body;
      // In a real implementation, this would call a translation API
      module.translated_text = `English translation of: ${module.source_body?.substring(0, 100)}...`;
    } else {
      // For English content, set translated_text and generate Amharic "translation"
      module.translated_text = module.source_body;
      // In a real implementation, this would call a translation API
      module.original_text = `Amharic translation of: ${module.source_body?.substring(0, 100)}...`;
    }
  }

  /**
   * Convert legacy steps to workflow format
   */
  private convertStepsToWorkflows(steps: Step[]): Workflow[] {
    return steps.map((step, index) => ({
      step: index + 1,
      description: {
        en: step.en,
        am: step.am
      }
    }));
  }

  /**
   * Format module content for processing
   */
  private formatModuleContent(module: KnowledgeModule): string {
    let content = '';
    
    if (module.topic) {
      content += `# ${module.topic}\n\n`;
    }
    
    if (module.category) {
      content += `## Category: ${module.category}\n`;
    }
    
    if (module.sector) {
      content += `## Sector: ${module.sector}\n\n`;
    }
    
    if (module.steps && module.steps.length > 0) {
      content += `## Steps:\n`;
      module.steps.forEach((step: Step, index) => {
        content += `${index + 1}. ${step.en}\n`;
        if (step.am !== step.en) {
          content += `   (Amharic: ${step.am})\n`;
        }
      });
    }
    
    if (module.requirements && module.requirements.length > 0) {
      content += `\n## Requirements:\n`;
      module.requirements.forEach(req => {
        content += `- ${req}\n`;
      });
    }
    
    if (module.validation && module.validation.length > 0) {
      content += `\n## Validation:\n`;
      module.validation.forEach(val => {
        content += `- ${val}\n`;
      });
    }
    
    return content;
  }

  /**
   * Generate unique ID for module
   */
  private generateModuleId(module: KnowledgeModule): string {
    const title = module.title || module.topic || module.module || 'unknown';
    return `${module.category?.toLowerCase() || 'general'}-${title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
  }

  /**
   * Generate slug for module
   */
  private generateSlug(module: KnowledgeModule): string {
    const title = module.title || module.topic || module.module || 'unknown-module';
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  /**
   * Create sample processed modules
   */
  async createSampleModules(): Promise<void> {
    try {
      // Create sample e-Tax module (Amharic original + English translation)
      const etaxModule: KnowledgeModule = {
        id: "tax-etax-registration-12345",
        slug: "etax-registration",
        title: "e-Tax Registration Process",
        source_url: "https://etax.mor.gov.et/registration",
        language: "am",
        category: "Tax",
        tags: ["registration", "etax", "mor"],
        sector_tags: ["government-services"],
        workflows: [
          {
            step: 1,
            description: {
              en: "Visit etax.mor.gov.et",
              am: "etrax.mor.gov.et ላይ ይጎብኙ"
            }
          },
          {
            step: 2,
            description: {
              en: "Click on 'New User Registration'",
              am: "በ'አዲስ ተጠቃሚ ምዝገባ' ላይ ይጫኑ"
            }
          }
        ],
        required_documents: [
          "Valid identification document",
          "Business registration certificate"
        ],
        common_errors: [
          "Incorrect email format",
          "Missing document verification"
        ],
        faqs: [
          {
            question: {
              en: "What documents are required for registration?",
              am: "ለምዝገባ የሚያስፈልጉ ሰነዶች ምንድን ናቸው?"
            },
            answer: {
              en: "You need a valid ID and business registration certificate.",
              am: "እርስዎ ልክ የተሰጠ መለያ እና የቢዝነስ ምዝገባ ማረጋገጫ ያስፈልግዎታል።"
            }
          }
        ],
        examples: [
          {
            title: {
              en: "Successful Registration Example",
              am: "የተሳካ ምዝገባ ምሳሌ"
            },
            description: {
              en: "A business successfully registered for e-Tax services.",
              am: "ቢዝነስ ለኢ-ትክስ አገልግሎቶች በተሳካ ሁኔታ ተመዝግቧል።"
            }
          }
        ],
        updated_at: new Date().toISOString(),
        version: "1.0",
        legal_source: true
      };
      
      // Process the module
      const processedEtaxModule = await this.processModule(etaxModule);
      
      // Save to sample directory
      const etaxPath = path.join(this.processedSampleDir, 'module_etax_v1.0.json');
      fs.writeFileSync(etaxPath, JSON.stringify(processedEtaxModule, null, 2));
      
      // Create sample Customs module (English)
      const customsModule: KnowledgeModule = {
        id: "customs-import-declaration-12346",
        slug: "customs-import-declaration",
        title: "Customs Import Declaration",
        source_url: "https://ecc.gov.et/import-declaration",
        language: "en",
        category: "Customs",
        tags: ["import", "declaration", "customs"],
        sector_tags: ["import-export"],
        workflows: [
          {
            step: 1,
            description: {
              en: "Obtain import license/permit",
              am: "የማስመጣች ፈቃድ/ፍቃድ ያግኙ"
            }
          },
          {
            step: 2,
            description: {
              en: "Register on e-SW system",
              am: "በኢ-ኤስዬ ስርዓት ላይ ይመዝግቡ"
            }
          }
        ],
        required_documents: [
          "Commercial invoice",
          "Packing list",
          "Bill of lading"
        ],
        common_errors: [
          "Incomplete documentation",
          "Incorrect HS code classification"
        ],
        updated_at: new Date().toISOString(),
        version: "1.0",
        legal_source: true
      };
      
      // Process the module
      const processedCustomsModule = await this.processModule(customsModule);
      
      // Save to sample directory
      const customsPath = path.join(this.processedSampleDir, 'module_customs_v1.0.json');
      fs.writeFileSync(customsPath, JSON.stringify(processedCustomsModule, null, 2));
      
      // Create sample e-Gov digital skill module
      const digitalSkillsModule: KnowledgeModule = {
        id: "egov-digital-skills-12347",
        slug: "egov-digital-skills",
        title: "e-Government Digital Skills",
        source_url: "https://egov.gov.et/digital-skills",
        language: "en",
        category: "Digital Skills",
        tags: ["digital-literacy", "egov", "skills"],
        sector_tags: ["public-administration"],
        workflows: [
          {
            step: 1,
            description: {
              en: "Create government service account",
              am: "የመንግስት አገልግሎት መለያ ይፍጠሩ"
            }
          },
          {
            step: 2,
            description: {
              en: "Verify your identity",
              am: "እርስዎን ያረጋግጡ"
            }
          }
        ],
        required_documents: [
          "Valid ID",
          "Mobile phone number"
        ],
        examples: [
          {
            title: {
              en: "Account Registration",
              am: "የመለያ ምዝገባ"
            },
            description: {
              en: "Step-by-step guide to register for government services.",
              am: "ለመንግስት አገልግሎቶች መመዝገብ የሚያስችል ደረጃ በደረጃ መመሪያ።"
            }
          }
        ],
        updated_at: new Date().toISOString(),
        version: "1.0",
        legal_source: true
      };
      
      // Process the module
      const processedDigitalSkillsModule = await this.processModule(digitalSkillsModule);
      
      // Save to sample directory
      const digitalSkillsPath = path.join(this.processedSampleDir, 'module_digital_skills_v1.0.json');
      fs.writeFileSync(digitalSkillsPath, JSON.stringify(processedDigitalSkillsModule, null, 2));
      
      console.log('Sample modules created successfully');
    } catch (error) {
      console.error('Error creating sample modules:', error);
    }
  }

  /**
   * Detect changes in modules
   */
  detectChanges(): { added: number; updated: number; removed: number } {
    // In a real implementation, this would compare with previous versions
    // For now, we'll return placeholder values
    return {
      added: 0,
      updated: 0,
      removed: 0
    };
  }

  /**
   * Clean HTML/PDF text (strip headers/footers, normalize whitespace)
   */
  cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/\u00A0/g, ' ') // Replace non-breaking spaces
      .trim();
  }
}