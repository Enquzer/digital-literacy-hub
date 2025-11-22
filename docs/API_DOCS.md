# LLM Engine API Documentation

## Base URL

```
http://localhost:3001
```

All endpoints are prefixed with `/llm` unless otherwise specified.

## Response Format

All API responses follow this standard format:

```json
{
  "success": true,
  "data": {},
  "metadata": {}
}
```

Or in case of errors:

```json
{
  "success": false,
  "error": "Error message"
}
```

## Search Endpoints

### Search Modules

```
GET /llm/search
```

Search for knowledge modules with combined keyword and semantic search.

**Query Parameters:**

| Parameter | Type   | Required | Description                         |
|-----------|--------|----------|-------------------------------------|
| query     | string | Yes      | Search query                        |
| lang      | string | No       | Language filter (en/am)             |
| sector    | string | No       | Sector filter                       |
| topic     | string | No       | Topic filter                        |
| limit     | number | No       | Maximum results (default: 10)       |

**Example Request:**

```
GET /llm/search?query=tax+filing&lang=en&sector=government-services&limit=5
```

**Example Response:**

```json
{
  "success": true,
  "data": [
    {
      "module_id": "tax-etax-registration-12345",
      "score": 0.95,
      "snippet": "Register for e-Tax account at etrax.mor.gov.et...",
      "metadata": {
        "title": "e-Tax Registration Process",
        "category": "Tax",
        "language": "en",
        "sector_tags": ["government-services"],
        "tags": ["registration", "etax", "mor"]
      }
    }
  ],
  "metadata": {
    "total": 1,
    "limit": 5,
    "query": "tax filing"
  }
}
```

### List Modules

```
GET /llm/modules
```

List all knowledge modules with pagination and filtering.

**Query Parameters:**

| Parameter | Type   | Required | Description                   |
|-----------|--------|----------|-------------------------------|
| page      | number | No       | Page number (default: 1)      |
| limit     | number | No       | Results per page (default: 10)|
| category  | string | No       | Category filter               |
| lang      | string | No       | Language filter (en/am)       |

**Example Request:**

```
GET /llm/modules?page=1&limit=10&category=Tax&lang=en
```

**Example Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "tax-etax-registration-12345",
      "slug": "etax-registration",
      "title": "e-Tax Registration Process",
      "source_url": "https://etax.mor.gov.et/registration",
      "language": "en",
      "category": "Tax",
      "version": "1.0",
      "status": "published",
      "updated_at": "2023-01-15T10:30:00Z"
    }
  ],
  "metadata": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

### Get Module

```
GET /llm/module/:id
```

Retrieve a complete knowledge module by ID.

**Path Parameters:**

| Parameter | Type   | Required | Description     |
|-----------|--------|----------|-----------------|
| id        | string | Yes      | Module ID       |

**Example Request:**

```
GET /llm/module/tax-etax-registration-12345
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "id": "tax-etax-registration-12345",
    "slug": "etax-registration",
    "title": "e-Tax Registration Process",
    "source_url": "https://etax.mor.gov.et/registration",
    "language": "en",
    "original_text": "Original English content...",
    "translated_text": "Amharic translation...",
    "category": "Tax",
    "tags": ["registration", "etax", "mor"],
    "sector_tags": ["government-services"],
    "workflows": [
      {
        "step": 1,
        "description": {
          "en": "Visit etax.mor.gov.et",
          "am": "etrax.mor.gov.et ላይ ይጎብኙ"
        }
      }
    ],
    "required_documents": [
      "Valid identification document",
      "Business registration certificate"
    ],
    "common_errors": [
      "Incorrect email format"
    ],
    "faqs": [
      {
        "question": {
          "en": "What documents are required?",
          "am": "የሚያስፈልጉ ሰነዶች ምንድን ናቸው?"
        },
        "answer": {
          "en": "You need a valid ID and business registration.",
          "am": "እርስዎ ልክ የተሰጠ መለያ እና የቢዝነስ ምዝገባ ያስፈልግዎታል።"
        }
      }
    ],
    "generated_assets": {
      "checklist_pdf": "checklist_tax-etax-registration-12345.pdf"
    },
    "updated_at": "2023-01-15T10:30:00Z",
    "version": "1.0",
    "legal_source": true
  }
}
```

## Generation Endpoints

### Generate Quiz

```
POST /llm/generate/quiz
```

Generate a multiple-choice quiz for a module.

**Request Body:**

```json
{
  "module_id": "tax-etax-registration-12345"
}
```

**Example Request:**

```
POST /llm/generate/quiz
Content-Type: application/json

{
  "module_id": "tax-etax-registration-12345"
}
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "id": "quiz_tax-etax-registration-12345",
    "module_id": "tax-etax-registration-12345",
    "questions": [
      {
        "id": 1,
        "question": "What is the first step in e-Tax registration?",
        "options": [
          "A. Visit etax.mor.gov.et",
          "B. Complete documentation",
          "C. Submit application",
          "D. Receive approval"
        ],
        "correct_answer": 0,
        "explanation": "The first step is to visit the e-Tax portal."
      }
    ]
  }
}
```

### Generate Module Assets

```
POST /llm/generate/module
```

Regenerate lesson, script, and checklist assets for a module.

**Request Body:**

```json
{
  "module_id": "tax-etax-registration-12345"
}
```

**Example Request:**

```
POST /llm/generate/module
Content-Type: application/json

{
  "module_id": "tax-etax-registration-12345"
}
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "module_id": "tax-etax-registration-12345",
    "generated_assets": {
      "quiz": { "generated": "2023-01-15T10:30:00Z" },
      "video_script": { "generated": "2023-01-15T10:30:00Z" },
      "checklist_pdf": "checklist_tax-etax-registration-12345.pdf"
    }
  },
  "message": "Module assets generated successfully"
}
```

## Admin Endpoints

### Reindex Modules

```
POST /llm/reindex
```

Re-generate embeddings for specified modules.

**Request Body:**

```json
{
  "moduleIds": ["tax-etax-registration-12345", "customs-import-67890"]
}
```

**Example Request:**

```
POST /llm/reindex
Content-Type: application/json

{
  "moduleIds": ["tax-etax-registration-12345", "customs-import-67890"]
}
```

**Example Response:**

```json
{
  "success": true,
  "message": "Successfully reindexed 2 modules",
  "data": {
    "reindexedModules": ["tax-etax-registration-12345", "customs-import-67890"]
  }
}
```

### Update Knowledge Base

```
POST /admin/update
```

Trigger a full knowledge base update including scraping, processing, and embedding generation.

**Example Request:**

```
POST /admin/update
```

**Example Response:**

```json
{
  "success": true,
  "message": "Knowledge base update completed successfully",
  "data": {
    "modulesUpdated": 15,
    "status": "completed"
  }
}
```

### Get Admin Statistics

```
GET /admin/stats
```

Retrieve statistics about the knowledge base.

**Example Request:**

```
GET /admin/stats
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "totalModules": 42,
    "modulesByCategory": {
      "Tax": 15,
      "Customs": 12,
      "Finance": 8,
      "Trade": 7
    },
    "modulesByLanguage": {
      "en": 25,
      "am": 17
    },
    "lastUpdated": "2023-01-15T10:30:00Z"
  }
}
```

### Get Scraper Logs

```
GET /admin/logs
```

Retrieve recent scraper activity logs.

**Example Request:**

```
GET /admin/logs
```

**Example Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "log-123",
      "source_url": "https://etax.mor.gov.et",
      "status": "success",
      "message": "Successfully scraped 2 modules",
      "timestamp": "2023-01-15T10:30:00Z"
    }
  ]
}
```