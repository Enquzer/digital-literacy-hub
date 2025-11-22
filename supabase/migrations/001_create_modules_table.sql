-- Create modules table
CREATE TABLE IF NOT EXISTS modules (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    source_url TEXT,
    language TEXT NOT NULL CHECK (language IN ('en', 'am')),
    version TEXT NOT NULL DEFAULT '1.0',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on slug
CREATE INDEX IF NOT EXISTS idx_modules_slug ON modules(slug);

-- Create index on language
CREATE INDEX IF NOT EXISTS idx_modules_language ON modules(language);

-- Create index on status
CREATE INDEX IF NOT EXISTS idx_modules_status ON modules(status);

-- Create index on created_at
CREATE INDEX IF NOT EXISTS idx_modules_created_at ON modules(created_at);