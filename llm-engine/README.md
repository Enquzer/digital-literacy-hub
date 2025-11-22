# Digital Literacy Hub LLM Knowledge Base Builder

This is an automated system for building and maintaining a structured, accurate, verifiable knowledge base for the Digital Literacy Hub e-learning system, designed for Ethiopian SMEs to learn how to use official government e-services.

## System Architecture

```
llm-engine/
├── scrapers/           # Web scraping modules for government data sources
├── processors/         # Data processing and transformation modules
├── schemas/            # Data schemas and type definitions
├── vector-db/          # Vector database integration for embeddings
├── api/                # REST API endpoints for LMS consumption
├── admin-panel/        # Administrative interface for manual updates
├── cache/              # Temporary storage for raw scraped data
├── processed/          # Processed data ready for training
├── training-data/      # Packaged training data for LLMs
├── history/            # Change history and snapshots
├── logs/               # System logs
└── dist/              # Compiled TypeScript output
```

## Key Components

### 1. Scrapers
- **ETaxScraper.ts**: Extracts data from Ethiopian Ministry of Revenues e-Tax systems
- **CustomsScraper.ts**: Extracts data from Ethiopian Customs Commission and e-SW systems
- **BaseScraper.ts**: Abstract base class for all scrapers

### 2. Processors
- **DataProcessor.ts**: Transforms raw scraped data into structured knowledge modules
- **TrainingDataPackager.ts**: Packages data into various formats for LLM training
- **ChangeDetector.ts**: Tracks changes in knowledge base content
- **Scheduler.ts**: Manages automatic updates (daily/weekly/monthly)

### 3. Vector Database
- **VectorDB.ts**: Handles embeddings generation and storage for semantic search

### 4. API Server
- **server.ts**: REST API endpoints for LMS integration

### 5. Admin Panel
- **admin.html**: Web interface for manual content management

## Data Structure

Each knowledge module follows this structure:

```json
{
  "module": "E-Tax System",
  "category": "Tax",
  "topic": "VAT Filing",
  "sector": "Manufacturing",
  "steps": [
    {
      "en": "Register for e-Tax account at etrax.mor.gov.et",
      "am": "etrax.mor.gov.et ላይ ለኢ-ትክስ መለያ ይመዝግቡ"
    },
    {
      "en": "Gather required documents",
      "am": "ያስፈላጊ ሰነዶችን ያሰኩ"
    }
  ],
  "requirements": ["Requirement 1", "Requirement 2", "..."],
  "validation": ["Validation 1", "Validation 2", "..."],
  "lastUpdated": "2025-11-17T10:30:00Z",
  "source": "https://etrax.mor.gov.et/vat-filing",
  "version": "1.0",
  "language": "en"
}
```

## Government Data Sources

The system automatically collects data from:

1. **Ethiopian Open Data Portal** - https://data.gov.et
2. **Ministry of Revenues e-Tax** - https://etrax.mor.gov.et
3. **Ethiopian Customs Commission & e-SW** - https://www.ecc.gov.et
4. **ESS Statistics Portal** - https://ess.gov.et
5. **Ethiopian Agriculture Data Hub** - https://data.moa.gov.et
6. **Ethiopia Climate Data Hub** - https://ethiogreendata.com

## Usage

### Initial Setup
```bash
cd llm-engine
npm install
```

### Update Knowledge Base
```bash
npm run update
```

### Start API Server
```bash
npm run serve
```

### Development
```bash
npm run dev
```

## API Endpoints

- `GET /modules` - Retrieve all knowledge modules
- `GET /modules/:id` - Retrieve a specific module
- `GET /search?q=query&language=en&sector=Manufacturing` - Search modules by keyword with language and sector filtering
- `GET /search/semantic` - Semantic search using vector embeddings
- `GET /modules/sector/:sector` - Filter modules by sector
- `GET /modules/language/:language` - Filter modules by language
- `POST /admin/update` - Trigger knowledge base update
- `GET /llm/context` - Get context for LLM prompting

## Training Data Formats

The system generates multiple formats for LLM training:

1. **Q&A Format** - Question-answer pairs for fine-tuning
2. **Instruction Format** - Instruction-following examples
3. **Embedding Format** - Text chunks for embedding training

## Automatic Updates

The system supports scheduled updates:
- Daily updates at 2:00 AM
- Weekly updates on Sundays at 3:00 AM
- Monthly updates on the 1st at 4:00 AM

## Admin Interface

The admin panel allows human trainers to:
- View all knowledge modules
- Approve/reject content changes
- Manually add new workflows
- Monitor system status