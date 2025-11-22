import axios = require('axios');
import * as fs from 'fs';
import * as path from 'path';
import { franc } from 'franc';
import { KnowledgeModule, Step } from '../schemas/knowledgeModule.schema';

export abstract class BaseScraper {
  protected baseUrl: string;
  protected moduleName: string;
  protected outputDir: string;
  protected rawCacheDir: string;
  protected rawFilesDir: string;

  constructor(baseUrl: string, moduleName: string) {
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

  abstract scrape(): Promise<KnowledgeModule[]>;

  protected async fetchHtml(url: string): Promise<string> {
    try {
      const response = await axios.get(url);
      return response.data as string;
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      throw error;
    }
  }

  protected async fetchJson(url: string): Promise<any> {
    try {
      const response = await axios.get(url);
      return response.data as any;
    } catch (error) {
      console.error(`Error fetching JSON from ${url}:`, error);
      throw error;
    }
  }

  protected saveToJson(data: KnowledgeModule[], filename: string): void {
    const filePath = path.join(this.outputDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Saved ${data.length} modules to ${filePath}`);
  }

  /**
   * Save raw artifact to cache
   */
  protected saveRawArtifact(sourceUrl: string, contentType: string, rawText: string): void {
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
  protected detectLanguage(text: string): 'am' | 'en' {
    const lang = franc(text, { minLength: 3 });
    return lang === 'amh' ? 'am' : 'en';
  }

  protected sanitizeText(text: string): string {
    return text
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\u00A0/g, ' '); // Replace non-breaking spaces
  }

  /**
   * Create bilingual steps (placeholder implementation with sample Amharic)
   */
  protected async createBilingualSteps(steps: string[]): Promise<Step[]> {
    // Sample Amharic translations for demonstration
    const amharicTranslations: { [key: string]: string } = {
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
    
    const bilingualSteps: Step[] = [];
    
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