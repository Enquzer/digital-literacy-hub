import { BaseScraper } from './BaseScraper';
import { KnowledgeModule } from '../schemas/knowledgeModule.schema';
export declare class CustomsScraper extends BaseScraper {
    constructor();
    scrape(): Promise<KnowledgeModule[]>;
    private scrapeImportDeclaration;
    private scrapeExportDeclaration;
}
//# sourceMappingURL=CustomsScraper.d.ts.map