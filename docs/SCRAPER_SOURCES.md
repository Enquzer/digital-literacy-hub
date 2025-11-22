# Scraper Sources

## Government Portals

### Ministry of Revenues
- **Main Portal**: https://mor.gov.et
- **e-Tax System**: https://etax.mor.gov.et
- **Portal**: https://portal.mor.gov.et

### Ethiopian Customs Commission
- **Main Portal**: https://ecc.gov.et
- **e-Single Window**: https://singlewindow.gov.et
- **eTrade Portal**: https://ectradeportal.customs.gov.et

### National Bank of Ethiopia
- **Main Portal**: https://nbe.gov.et

### Ministry of Trade
- **eTrade Portal**: https://etrade.gov.et
- **Main Portal**: https://moft.gov.et

### Ethiopian Open Data Portal
- **Main Portal**: https://data.gov.et

## Scraping Guidelines

### Rate Limiting
All scrapers respect robots.txt and implement appropriate delays:
- Minimum 1 second between requests
- Maximum 10 requests per minute per domain
- Exponential backoff on errors

### Content Storage
Raw artifacts are stored in:
- **JSON Format**: `llm-engine/cache/raw/YYYYMMDD_HHMMSS_source.json`
- **PDF Files**: `llm-engine/cache/raw/files/`

Each raw artifact includes:
```json
{
  "id": "unique_identifier",
  "source_url": "https://example.gov.et/page",
  "timestamp": "2023-01-15T10:30:00Z",
  "content_type": "text/html",
  "raw_text": "Extracted content...",
  "language_hint": "en"
}
```

### Supported Content Types
- HTML pages
- PDF documents
- JSON APIs
- XML feeds

## Scraper Implementation

### BaseScraper
All scrapers extend the BaseScraper class which provides:
- Common utility methods
- Language detection
- Raw artifact storage
- Error handling

### Custom Scrapers
Each government portal has a dedicated scraper:
- `ETaxScraper.ts` - e-Tax system
- `CustomsScraper.ts` - Customs procedures
- `MorScraper.ts` - Ministry of Revenues
- `CustomsCommissionScraper.ts` - Ethiopian Customs Commission
- `NbeScraper.ts` - National Bank of Ethiopia
- `TradeScraper.ts` - Ministry of Trade
- `OpenDataScraper.ts` - Ethiopian Open Data Portal

## Data Processing

### Language Detection
Using the `franc` library to detect content language:
- English content marked as `en`
- Amharic content marked as `am`

### Text Cleaning
Raw content is processed to:
- Remove HTML tags
- Normalize whitespace
- Strip headers and footers
- Extract main content

### Bilingual Content
For Amharic content:
- Original text preserved
- English translation generated
- Both stored in module

For English content:
- Original text preserved
- Amharic "translation" generated (in real implementation)
- Both stored in module

## Change Detection

### Checksum Calculation
MD5 checksums are computed for:
- Module title
- Source body
- Workflows
- Required documents

### Versioning
When changes are detected:
- Previous version saved to `versions/` directory
- New version generated
- Major changes (>15% content difference or workflow changes) flagged for review

## Error Handling

### Common Errors
- **403 Forbidden**: Respect robots.txt, implement longer delays
- **404 Not Found**: Skip page, log for review
- **500 Server Error**: Retry with exponential backoff
- **Timeout**: Increase timeout, retry

### Logging
All scraper activity is logged to:
- Console output
- `scraper_logs` database table
- File logs (if configured)

## Future Enhancements

### Additional Sources
Planned additions:
- Ethiopian Revenue and Customs Authority
- Ethiopian Investment Commission
- Ethiopian Standards Authority
- Addis Ababa City Administration

### Improved Processing
- OCR for scanned documents
- Better translation quality
- Enhanced semantic analysis
- Multimedia content extraction