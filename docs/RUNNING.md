# Running the LLM Engine

## Prerequisites

- Node.js 16+
- npm or yarn
- Supabase CLI (for database migrations)
- PostgreSQL (if using pgvector)

## Installation

1. Navigate to the LLM Engine directory:
   ```bash
   cd llm-engine
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment example file:
   ```bash
   cp .env.example .env
   ```

4. Configure environment variables in `.env`:
   ```bash
   # LLM Engine Configuration
   OPENAI_API_KEY=your_openai_api_key
   TRANSLATION_API_KEY=your_translation_api_key
   VECTOR_DB_DRIVER=local
   SUPABASE_URL=https://your-supabase-url.supabase.co
   SUPABASE_KEY=your_supabase_service_key
   CRON_DEFAULT="0 2 * * *"
   EMBEDDING_MODEL=text-embedding-3-small
   ```

## Database Setup

### Supabase Migration

1. Ensure you have the Supabase CLI installed:
   ```bash
   npm install -g supabase
   ```

2. Navigate to the project root:
   ```bash
   cd ..
   ```

3. Apply database migrations:
   ```bash
   ./scripts/db_migrate.sh
   ```

   Or on Windows:
   ```cmd
   scripts\db_migrate.bat
   ```

### Manual Database Setup

If you prefer to set up the database manually, run the SQL scripts in the `supabase/migrations/` directory in order:
1. `001_create_modules_table.sql`
2. `002_create_module_versions_table.sql`
3. `003_create_quizzes_table.sql`
4. `004_create_progress_table.sql`
5. `005_create_scraper_logs_table.sql`

## Running the Application

### Development Mode

1. Start the LLM Engine API server:
   ```bash
   cd llm-engine
   npm run dev
   ```

2. The API will be available at `http://localhost:3001`

### Production Mode

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the server:
   ```bash
   npm run serve
   ```

## Running the Full Pipeline

### Manual Execution

To run the complete pipeline manually:

1. Run all scrapers:
   ```bash
   npm run update
   ```

2. This will:
   - Scrape content from all government sources
   - Process the raw data
   - Generate knowledge modules
   - Create training data
   - Generate embeddings

### Automated Execution

The scheduler is configured to run automatically:
- **Daily incremental scrape**: Default at 2 AM (`0 2 * * *`)
- **Weekly full rescan**: Sundays at 3 AM (`0 3 * * 0`)

To customize the schedule, modify the `CRON_DEFAULT` environment variable.

## Testing

### Unit Tests

Run unit tests:
```bash
npm test
```

### Sample Data Generation

Generate sample processed modules:
```bash
npm run demo
```

This creates 3 sample modules in `llm-engine/cache/processed/sample-modules/`:
1. e-Tax module (Amharic original + English translation)
2. Customs module (English)
3. e-Gov digital skill module

## API Endpoints

Once the server is running, the following endpoints are available:

- **Search**: `GET /llm/search`
- **List Modules**: `GET /llm/modules`
- **Get Module**: `GET /llm/module/:id`
- **Generate Quiz**: `POST /llm/generate/quiz`
- **Generate Assets**: `POST /llm/generate/module`
- **Reindex**: `POST /llm/reindex`
- **Admin Update**: `POST /admin/update`
- **Admin Stats**: `GET /admin/stats`
- **Scraper Logs**: `GET /admin/logs`

## Directory Structure

```
llm-engine/
├── api/                # API endpoints
├── cache/              # Raw and processed data
│   ├── raw/            # Raw scraped content
│   │   └── files/      # PDF and other files
│   └── processed/      # Processed modules
│       └── sample-modules/ # Sample data
├── processors/         # Data processing logic
├── scrapers/           # Content extraction modules
├── schemas/            # Data type definitions
├── training-data/      # LLM training datasets
├── vector-db/          # Vector database implementation
├── versions/           # Module version history
├── vectors/            # Stored embeddings
└── admin-panel/        # Administrative interface
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   - Change the PORT in `.env` or kill the process using the port

2. **Database connection failed**
   - Verify Supabase credentials in `.env`
   - Ensure the Supabase instance is accessible

3. **API key missing**
   - Set `OPENAI_API_KEY` in `.env` for embeddings and translation

4. **Permission denied**
   - Ensure the application has write permissions to the cache directories

### Logs

Check logs for detailed error information:
- Console output during development
- Log files in `llm-engine/logs/` (if configured)
- Database logs in `scraper_logs` table

### Debugging

To enable debug logging, set the DEBUG environment variable:
```bash
DEBUG=llm-engine:* npm run dev
```

## Performance Considerations

### Memory Usage
- The LLM Engine is optimized for moderate memory usage
- Large embedding operations may require additional memory
- Consider increasing Node.js heap size for large datasets:
  ```bash
  NODE_OPTIONS="--max-old-space-size=4096" npm run dev
  ```

### Processing Time
- Initial full scrape may take 10-30 minutes depending on network
- Incremental updates typically complete in 5-10 minutes
- Embedding generation is the most time-consuming step

### Caching
- Processed modules are cached in `llm-engine/processed/`
- Embeddings are cached in `llm-engine/vectors/`
- Clear cache directories to force regeneration

## Security

### API Keys
- Never commit `.env` files to version control
- Use environment variables in production
- Rotate API keys regularly

### Data Privacy
- Raw content is stored locally only
- No personal data is collected or stored
- Processed modules contain only public government information

### Rate Limiting
- All scrapers implement respectful rate limiting
- Default: 1 request per second, max 10 per minute per domain
- Adjust in scraper implementations if needed