export interface KnowledgeModule {
    module: string;
    category: string;
    topic: string;
    sector: string;
    steps: Step[];
    requirements: string[];
    validation: string[];
    lastUpdated: string;
    source: string;
    version: string;
    language: 'en' | 'am';
    translations?: Translations;
}
export interface Step {
    en: string;
    am: string;
}
export interface Translations {
    title: string;
    description: string;
    steps: string[];
    requirements: string[];
    validation: string[];
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
//# sourceMappingURL=knowledgeModule.schema.d.ts.map