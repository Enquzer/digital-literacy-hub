import { BaseScraper } from './BaseScraper';
import { KnowledgeModule } from '../schemas/knowledgeModule.schema';
export declare class ETaxScraper extends BaseScraper {
    constructor();
    scrape(): Promise<KnowledgeModule[]>;
    private scrapeVATFiling;
    private scrapeIncomeTax;
}
//# sourceMappingURL=ETaxScraper.d.ts.map