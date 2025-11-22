-- Create quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
    id TEXT PRIMARY KEY,
    module_id TEXT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    questions JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on module_id
CREATE INDEX IF NOT EXISTS idx_quizzes_module_id ON quizzes(module_id);

-- Create index on created_at
CREATE INDEX IF NOT EXISTS idx_quizzes_created_at ON quizzes(created_at);