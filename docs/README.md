# Digital Literacy Hub - LLM Engine

## Overview

The LLM Engine is a standalone module that powers the knowledge base for the Digital Literacy Hub platform. It provides automated content extraction, processing, and semantic search capabilities for government e-services training.

## Architecture

### Core Components

1. **Scrapers** (`llm-engine/scrapers/`)
   - Extract content from government portals (e-Tax, Customs, etc.)
   - Store raw artifacts in JSON format
   - Respect robots.txt and rate limits

2. **Processors** (`llm-engine/processors/`)
   - Clean and structure scraped data
   - Generate bilingual content (English/Amharic)
   - Create training data for LLMs

3. **Vector Database** (`llm-engine/vector-db/`)
   - Store embeddings for semantic search
   - Support both pgvector and local storage
   - Generate embeddings for both original and translated text

4. **API Layer** (`llm-engine/api/`)
   - RESTful endpoints for search and module access
   - Admin controls for scraper management
   - Integration with main application backend

5. **Scheduler** (`llm-engine/processors/Scheduler.ts`)
   - Automated jobs for content updates
   - Configurable cron schedules
   - Change detection and versioning

## Key Features

- **Multilingual Support**: Automatic language detection and translation
- **Semantic Search**: Combined keyword and vector similarity search
- **Content Versioning**: Track changes and maintain history
- **Auto-Generated Assets**: Quizzes, video scripts, checklists
- **Admin Dashboard**: Monitor scrapers and manage content
- **Change Detection**: Automatic detection of content updates

## Technology Stack

- **Runtime**: Node.js with TypeScript
- **Web Scraping**: Cheerio, Axios
- **Data Processing**: Custom processors with language detection
- **Vector Storage**: Custom VectorDB with pgvector support
- **Scheduling**: Node-cron
- **API**: Express.js
- **Database**: Supabase (PostgreSQL)

## Directory Structure

```
llm-engine/
├── scrapers/           # Content extraction modules
├── processors/         # Data cleaning and structuring
├── vector-db/          # Embedding storage and search
├── api/                # REST API endpoints
├── schemas/            # Data type definitions
├── cache/              # Raw and processed data storage
├── processed/          # Final knowledge modules
├── training-data/      # LLM training datasets
├── versions/           # Module version history
├── vectors/            # Stored embeddings
└── admin-panel/        # Administrative interface
```

## Configuration

The LLM Engine is configured through environment variables:

- `OPENAI_API_KEY`: OpenAI API key for embeddings and translation
- `TRANSLATION_API_KEY`: Alternative translation service key
- `VECTOR_DB_DRIVER`: Vector storage driver (pgvector|local)
- `SUPABASE_URL`: Supabase instance URL
- `SUPABASE_KEY`: Supabase service key
- `CRON_DEFAULT`: Default cron schedule for scrapers
- `EMBEDDING_MODEL`: Model for generating embeddings

## Getting Started

See [RUNNING.md](RUNNING.md) for detailed instructions on setting up and running the LLM Engine.