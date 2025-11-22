@echo off
REM Run complete LLM Engine pipeline
REM This script runs scraping, processing, and embedding generation for all sources

echo Starting complete LLM Engine pipeline...

REM Check if we're in the right directory
if not exist "llm-engine" (
    echo Error: llm-engine directory not found. Please run this script from the project root.
    exit /b 1
)

REM Navigate to llm-engine directory
cd llm-engine

REM Run all scrapers (safe mode: limit pages)
echo Running all scrapers...
npm run update

REM Check if scraping was successful
if %errorlevel% equ 0 (
    echo Scraping completed successfully!
) else (
    echo Scraping failed!
    exit /b 1
)

REM Process the scraped data
echo Processing scraped data...
npm run process

REM Check if processing was successful
if %errorlevel% equ 0 (
    echo Data processing completed successfully!
) else (
    echo Data processing failed!
    exit /b 1
)

REM Generate embeddings
echo Generating embeddings...
npm run embed

REM Check if embedding generation was successful
if %errorlevel% equ 0 (
    echo Embedding generation completed successfully!
) else (
    echo Embedding generation failed!
    exit /b 1
)

REM Write modules to DB (Supabase)
echo Writing modules to database...
npm run db:sync

REM Check if database sync was successful
if %errorlevel% equ 0 (
    echo Database sync completed successfully!
) else (
    echo Database sync failed!
    exit /b 1
)

echo Complete LLM Engine pipeline finished successfully!
echo Generated modules are available in the processed/ directory

REM Navigate back to project root
cd ..