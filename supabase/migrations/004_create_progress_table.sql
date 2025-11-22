-- Create progress table
CREATE TABLE IF NOT EXISTS progress (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    module_id TEXT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    lesson_id TEXT,
    progress_pct INTEGER NOT NULL DEFAULT 0 CHECK (progress_pct >= 0 AND progress_pct <= 100),
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON progress(user_id);

-- Create index on module_id
CREATE INDEX IF NOT EXISTS idx_progress_module_id ON progress(module_id);

-- Create unique constraint on user_id and module_id
CREATE UNIQUE INDEX IF NOT EXISTS idx_progress_user_module ON progress(user_id, module_id);

-- Create index on last_accessed
CREATE INDEX IF NOT EXISTS idx_progress_last_accessed ON progress(last_accessed);