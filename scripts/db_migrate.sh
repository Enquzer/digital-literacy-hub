#!/bin/bash

# Database migration script
# This script applies all migration files to the Supabase database

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null
then
    echo "Supabase CLI could not be found. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

# Check if we're in the right directory
if [ ! -d "supabase" ]; then
    echo "Error: supabase directory not found. Please run this script from the project root."
    exit 1
fi

echo "Starting database migration..."

# Link to Supabase project (if not already linked)
# Uncomment the line below and replace with your project ID if needed
# supabase link --project-ref your-project-id

# Apply migrations
echo "Applying migrations..."
supabase migration up

# Check if migrations were successful
if [ $? -eq 0 ]; then
    echo "Database migration completed successfully!"
else
    echo "Database migration failed!"
    exit 1
fi

# Apply seed data if it exists
if [ -f "supabase/seed.sql" ]; then
    echo "Applying seed data..."
    supabase db reset
fi

echo "All migrations applied successfully!"