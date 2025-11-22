#!/bin/bash

# Run complete LLM Engine pipeline
# This script runs scraping, processing, and embedding generation for all sources

echo "Starting complete LLM Engine pipeline..."

# Check if we're in the right directory
if [ ! -d "llm-engine" ]; then
    echo "Error: llm-engine directory not found. Please run this script from the project root."
    exit 1
fi

# Navigate to llm-engine directory
cd llm-engine

# Run all scrapers (safe mode: limit pages)
echo "Running all scrapers..."
npm run update

# Check if scraping was successful
if [ $? -eq 0 ]; then
    echo "Scraping completed successfully!"
else
    echo "Scraping failed!"
    exit 1
fi

# Process the scraped data
echo "Processing scraped data..."
npm run process

# Check if processing was successful
if [ $? -eq 0 ]; then
    echo "Data processing completed successfully!"
else
    echo "Data processing failed!"
    exit 1
fi

# Generate embeddings
echo "Generating embeddings..."
npm run embed

# Check if embedding generation was successful
if [ $? -eq 0 ]; then
    echo "Embedding generation completed successfully!"
else
    echo "Embedding generation failed!"
    exit 1
fi

# Write modules to DB (Supabase)
echo "Writing modules to database..."
npm run db:sync

# Check if database sync was successful
if [ $? -eq 0 ]; then
    echo "Database sync completed successfully!"
else
    echo "Database sync failed!"
    exit 1
fi

echo "Complete LLM Engine pipeline finished successfully!"
echo "Generated modules are available in the processed/ directory"