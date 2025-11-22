export interface KnowledgeModule {
  id?: string;
  slug?: string;
  title?: string;
  source_url?: string;
  source_body?: string;
  language: 'en' | 'am';
  original_text?: string;
  translated_text?: string;
  category: string;
  tags?: string[];
  sector_tags?: string[];
  workflows?: Workflow[];
  required_documents?: string[];
  common_errors?: string[];
  faqs?: FAQ[];
  examples?: Example[];
  screenshots?: string[];
  generated_assets?: GeneratedAssets;
  updated_at?: string;
  version?: string;
  legal_source?: boolean;
  // Legacy fields for backward compatibility
  module?: string;
  topic?: string;
  sector?: string;
  steps?: Step[];
  requirements?: string[];
  validation?: string[];
  lastUpdated?: string;
  source?: string;
}

export interface Step {
  en: string;
  am: string;
}

export interface Workflow {
  step: number;
  description: {
    en: string;
    am: string;
  };
}

export interface FAQ {
  question: {
    en: string;
    am: string;
  };
  answer: {
    en: string;
    am: string;
  };
}

export interface Example {
  title: {
    en: string;
    am: string;
  };
  description: {
    en: string;
    am: string;
  };
}

export interface GeneratedAssets {
  quiz?: any;
  video_script?: any;
  checklist_pdf?: string;
}

export interface ModuleMetadata {
  id: string;
  title: string;
  description: string;
  category: string;
  lastUpdated: Date;
  version: string;
  sourceUrl: string;
}