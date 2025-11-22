"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ETaxScraper = void 0;
const BaseScraper_1 = require("./BaseScraper");
class ETaxScraper extends BaseScraper_1.BaseScraper {
    constructor() {
        super('https://etrax.mor.gov.et', 'e-tax');
    }
    async scrape() {
        const modules = [];
        try {
            // Example: Scrape VAT filing information
            const vatModule = await this.scrapeVATFiling();
            if (vatModule)
                modules.push(vatModule);
            // Example: Scrape income tax information
            const incomeTaxModule = await this.scrapeIncomeTax();
            if (incomeTaxModule)
                modules.push(incomeTaxModule);
            // Save to JSON
            this.saveToJson(modules, 'module-etax.json');
            return modules;
        }
        catch (error) {
            console.error('Error scraping e-Tax data:', error);
            return [];
        }
    }
    async scrapeVATFiling() {
        try {
            // In a real implementation, we would scrape the actual government website
            // For now, we'll return a sample structure
            // Create bilingual steps
            const steps = [
                "Register for e-Tax account at etrax.mor.gov.et",
                "Gather required documents: Business license, TIN, financial statements",
                "Login to e-Tax portal",
                "Navigate to VAT filing section",
                "Enter sales and purchase data",
                "Calculate VAT payable",
                "Submit VAT return",
                "Make payment through digital channels"
            ];
            const bilingualSteps = await this.createBilingualSteps(steps);
            return {
                module: "E-Tax System",
                category: "Tax",
                topic: "VAT Filing",
                sector: "Manufacturing",
                steps: bilingualSteps,
                requirements: [
                    "Valid TIN (Tax Identification Number)",
                    "Business registration certificate",
                    "Bank account for digital payments",
                    "Accounting records for the period"
                ],
                validation: [
                    "Verify TIN against business registration",
                    "Check calculation accuracy",
                    "Confirm digital payment receipt",
                    "Validate filing period"
                ],
                lastUpdated: new Date().toISOString(),
                source: "https://etrax.mor.gov.et/vat-filing",
                version: "1.0",
                language: "en"
            };
        }
        catch (error) {
            console.error('Error scraping VAT filing data:', error);
            return null;
        }
    }
    async scrapeIncomeTax() {
        try {
            // In a real implementation, we would scrape the actual government website
            // For now, we'll return a sample structure
            // Create bilingual steps
            const steps = [
                "Register for e-Tax account",
                "Prepare income and expense documentation",
                "Login to e-Tax portal",
                "Access income tax filing section",
                "Enter business income details",
                "Report allowable deductions",
                "Calculate tax liability",
                "Submit return and make payment"
            ];
            const bilingualSteps = await this.createBilingualSteps(steps);
            return {
                module: "E-Tax System",
                category: "Tax",
                topic: "Income Tax Filing",
                sector: "Manufacturing",
                steps: bilingualSteps,
                requirements: [
                    "TIN (Tax Identification Number)",
                    "Business registration",
                    "Financial statements",
                    "Expense documentation",
                    "Bank account for payments"
                ],
                validation: [
                    "Verify income against bank statements",
                    "Check expense deductions are allowable",
                    "Confirm tax calculation accuracy",
                    "Validate payment confirmation"
                ],
                lastUpdated: new Date().toISOString(),
                source: "https://etrax.mor.gov.et/income-tax",
                version: "1.0",
                language: "en"
            };
        }
        catch (error) {
            console.error('Error scraping income tax data:', error);
            return null;
        }
    }
}
exports.ETaxScraper = ETaxScraper;
