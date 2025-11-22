@echo off
REM Database migration script for Windows
REM This script applies all migration files to the Supabase database

REM Check if Supabase CLI is installed
where supabase >nul 2>&1
if %errorlevel% neq 0 (
    echo Supabase CLI could not be found. Please install it first:
    echo npm install -g supabase
    exit /b 1
)

REM Check if we're in the right directory
if not exist "supabase" (
    echo Error: supabase directory not found. Please run this script from the project root.
    exit /b 1
)

echo Starting database migration...

REM Link to Supabase project (if not already linked)
REM Uncomment the line below and replace with your project ID if needed
REM supabase link --project-ref your-project-id

REM Apply migrations
echo Applying migrations...
supabase migration up

REM Check if migrations were successful
if %errorlevel% equ 0 (
    echo Database migration completed successfully!
) else (
    echo Database migration failed!
    exit /b 1
)

REM Apply seed data if it exists
if exist "supabase\seed.sql" (
    echo Applying seed data...
    supabase db reset
)

echo All migrations applied successfully!