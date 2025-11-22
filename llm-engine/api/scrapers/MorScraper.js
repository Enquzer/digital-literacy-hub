"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MorScraper = void 0;
const BaseScraper_1 = require("./BaseScraper");
class MorScraper extends BaseScraper_1.BaseScraper {
    constructor() {
        super('https://portal.mor.gov.et', 'mor');
    }
    async scrape() {
        const modules = [];
        try {
            // Scrape eTax portal information
            const eTaxModule = await this.scrapeETaxPortal();
            if (eTaxModule)
                modules.push(eTaxModule);
            // Scrape general MoR information
            const generalModule = await this.scrapeGeneralInfo();
            if (generalModule)
                modules.push(generalModule);
            // Save to JSON
            this.saveToJson(modules, 'module-mor.json');
            return modules;
        }
        catch (error) {
            console.error('Error scraping Ministry of Revenues data:', error);
            return [];
        }
    }
    async scrapeETaxPortal() {
        try {
            // In a real implementation, we would scrape the actual government website
            // For now, we'll return a sample structure
            const steps = [
                "Visit etax.mor.gov.et",
                "Click on 'New User Registration'",
                "Fill in personal/business details",
                "Verify email and mobile number",
                "Set password and security questions",
                "Complete registration process"
            ];
            const bilingualSteps = await this.createBilingualSteps(steps);
            const content = `
      The e-Tax portal is the online platform provided by the Ministry of Revenues 
      for taxpayers to file their tax returns, make payments, and manage their tax affairs.
      
      Key features include:
      - Online tax registration
      - VAT filing and payment
      - Income tax filing and payment
      - Taxpayer dashboard
      - Document management
      `;
            // Save raw artifact
            this.saveRawArtifact('https://etax.mor.gov.et', 'text/html', content);
            return {
                module: "Ministry of Revenues",
                category: "Tax",
                topic: "e-Tax Portal Registration",
                sector: "Government Services",
                steps: bilingualSteps,
                requirements: [
                    "Valid identification document",
                    "Active email address",
                    "Mobile phone number",
                    "Business registration certificate (for businesses)"
                ],
                validation: [
                    "Email verification",
                    "Mobile number verification",
                    "Document authenticity check"
                ],
                lastUpdated: new Date().toISOString(),
                source: "https://etax.mor.gov.et",
                version: "1.0",
                language: "en"
            };
        }
        catch (error) {
            console.error('Error scraping e-Tax portal data:', error);
            return null;
        }
    }
    async scrapeGeneralInfo() {
        try {
            // In a real implementation, we would scrape the actual government website
            // For now, we'll return a sample structure
            const steps = [
                "Visit mor.gov.et",
                "Navigate to the Services section",
                "Select the required service",
                "Follow the application process",
                "Submit required documents",
                "Track application status"
            ];
            const bilingualSteps = await this.createBilingualSteps(steps);
            const content = `
      The Ministry of Revenues (MoR) is responsible for tax administration, 
      customs operations, and revenue collection in Ethiopia.
      
      Main services include:
      - Tax policy development
      - Taxpayer education
      - Revenue collection
      - Customs administration
      - Audit and compliance
      `;
            // Save raw artifact
            this.saveRawArtifact('https://mor.gov.et', 'text/html', content);
            return {
                module: "Ministry of Revenues",
                category: "Government",
                topic: "General Services",
                sector: "Public Administration",
                steps: bilingualSteps,
                requirements: [
                    "Valid identification document",
                    "Required service-specific documents",
                    "Application fee (if applicable)"
                ],
                validation: [
                    "Document verification",
                    "Eligibility check",
                    "Compliance verification"
                ],
                lastUpdated: new Date().toISOString(),
                source: "https://mor.gov.et",
                version: "1.0",
                language: "en"
            };
        }
        catch (error) {
            console.error('Error scraping general MoR data:', error);
            return null;
        }
    }
}
exports.MorScraper = MorScraper;
