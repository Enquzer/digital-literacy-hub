import { KnowledgeModule, Step } from '../schemas/knowledgeModule.schema';
export declare abstract class BaseScraper {
    protected baseUrl: string;
    protected moduleName: string;
    protected outputDir: string;
    constructor(baseUrl: string, moduleName: string);
    abstract scrape(): Promise<KnowledgeModule[]>;
    protected fetchHtml(url: string): Promise<string>;
    protected fetchJson(url: string): Promise<any>;
    protected saveToJson(data: KnowledgeModule[], filename: string): void;
    protected sanitizeText(text: string): string;
    /**
     * Create bilingual steps (placeholder implementation with sample Amharic)
     */
    protected createBilingualSteps(steps: string[]): Promise<Step[]>;
}
//# sourceMappingURL=BaseScraper.d.ts.map