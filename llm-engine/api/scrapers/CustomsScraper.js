"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomsScraper = void 0;
const BaseScraper_1 = require("./BaseScraper");
class CustomsScraper extends BaseScraper_1.BaseScraper {
    constructor() {
        super('https://www.ecc.gov.et', 'customs');
    }
    async scrape() {
        const modules = [];
        try {
            // Example: Scrape import declaration workflow
            const importModule = await this.scrapeImportDeclaration();
            if (importModule)
                modules.push(importModule);
            // Example: Scrape export declaration workflow
            const exportModule = await this.scrapeExportDeclaration();
            if (exportModule)
                modules.push(exportModule);
            // Save to JSON
            this.saveToJson(modules, 'module-customs.json');
            return modules;
        }
        catch (error) {
            console.error('Error scraping Customs data:', error);
            return [];
        }
    }
    async scrapeImportDeclaration() {
        try {
            // Create bilingual steps
            const steps = [
                "Obtain import license/permit",
                "Register on e-SW system",
                "Prepare commercial invoice",
                "Classify goods using HS codes",
                "Calculate applicable duties and taxes",
                "Submit import declaration",
                "Upload required documents",
                "Pay duties and taxes",
                "Clear goods through customs"
            ];
            const bilingualSteps = await this.createBilingualSteps(steps);
            return {
                module: "Customs & e-SW",
                category: "Customs",
                topic: "Import Declaration Workflow",
                sector: "Import/Export",
                steps: bilingualSteps,
                requirements: [
                    "Valid import license",
                    "Commercial invoice",
                    "Packing list",
                    "Bill of lading or airway bill",
                    "Certificate of origin (if applicable)",
                    "Import permit for regulated goods",
                    "Insurance certificate (if applicable)"
                ],
                validation: [
                    "Verify HS code classification",
                    "Check duty calculation accuracy",
                    "Validate document completeness",
                    "Confirm payment processing"
                ],
                lastUpdated: new Date().toISOString(),
                source: "https://www.ecc.gov.et/import-declaration",
                version: "1.0",
                language: "en"
            };
        }
        catch (error) {
            console.error('Error scraping import declaration data:', error);
            return null;
        }
    }
    async scrapeExportDeclaration() {
        try {
            // Create bilingual steps
            const steps = [
                "Obtain export license/permit",
                "Register on e-SW system",
                "Prepare commercial invoice",
                "Classify goods using HS codes",
                "Submit export declaration",
                "Upload required documents",
                "Obtain shipping instructions",
                "Clear goods through customs"
            ];
            const bilingualSteps = await this.createBilingualSteps(steps);
            return {
                module: "Customs & e-SW",
                category: "Customs",
                topic: "Export Declaration Workflow",
                sector: "Import/Export",
                steps: bilingualSteps,
                requirements: [
                    "Valid export license",
                    "Commercial invoice",
                    "Packing list",
                    "Certificate of origin",
                    "Export permit for regulated goods",
                    "Phytosanitary certificate (for agricultural products)"
                ],
                validation: [
                    "Verify HS code classification",
                    "Check document completeness",
                    "Validate export permit",
                    "Confirm customs clearance"
                ],
                lastUpdated: new Date().toISOString(),
                source: "https://www.ecc.gov.et/export-declaration",
                version: "1.0",
                language: "en"
            };
        }
        catch (error) {
            console.error('Error scraping export declaration data:', error);
            return null;
        }
    }
}
exports.CustomsScraper = CustomsScraper;
