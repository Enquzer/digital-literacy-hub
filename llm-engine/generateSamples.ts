import * as fs from 'fs';
import * as path from 'path';
import { KnowledgeModule } from './schemas/knowledgeModule.schema';

// Create sample modules directory
const sampleDir = path.join(__dirname, 'cache', 'processed', 'sample-modules');
if (!fs.existsSync(sampleDir)) {
  fs.mkdirSync(sampleDir, { recursive: true });
}

// Create sample e-Tax module (Amharic original + English translation)
const etaxModule: KnowledgeModule = {
  id: "tax-etax-registration-12345",
  slug: "etax-registration",
  title: "e-Tax Registration Process",
  source_url: "https://etax.mor.gov.et/registration",
  language: "am",
  original_text: "etrax.mor.gov.et ላይ ለኢ-ትክስ መለያ ይመዝግቡ. በ'አዲስ ተጠቃሚ ምዝገባ' ላይ ይጫኑ.",
  translated_text: "Register for e-Tax account at etrax.mor.gov.et. Click on 'New User Registration'.",
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

// Create sample Customs module (English)
const customsModule: KnowledgeModule = {
  id: "customs-import-declaration-12346",
  slug: "customs-import-declaration",
  title: "Customs Import Declaration",
  source_url: "https://ecc.gov.et/import-declaration",
  language: "en",
  original_text: "Obtain import license/permit. Register on e-SW system.",
  translated_text: "የማስመጣች ፈቃድ/ፍቃድ ያግኙ. በኢ-ኤስዬ ስርዓት ላይ ይመዝግቡ.",
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

// Create sample e-Gov digital skill module
const digitalSkillsModule: KnowledgeModule = {
  id: "egov-digital-skills-12347",
  slug: "egov-digital-skills",
  title: "e-Government Digital Skills",
  source_url: "https://egov.gov.et/digital-skills",
  language: "en",
  original_text: "Create government service account. Verify your identity.",
  translated_text: "የመንግስት አገልግሎት መለያ ይፍጠሩ. እርስዎን ያረጋግጡ.",
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

// Save modules to sample directory
const etaxPath = path.join(sampleDir, 'module_etax_v1.0.json');
fs.writeFileSync(etaxPath, JSON.stringify(etaxModule, null, 2));

const customsPath = path.join(sampleDir, 'module_customs_v1.0.json');
fs.writeFileSync(customsPath, JSON.stringify(customsModule, null, 2));

const digitalSkillsPath = path.join(sampleDir, 'module_digital_skills_v1.0.json');
fs.writeFileSync(digitalSkillsPath, JSON.stringify(digitalSkillsModule, null, 2));

console.log('Sample modules created successfully in', sampleDir);