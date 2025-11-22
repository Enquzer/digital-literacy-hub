-- Create module_versions table
CREATE TABLE IF NOT EXISTS module_versions (
    id SERIAL PRIMARY KEY,
    module_id TEXT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    version TEXT NOT NULL,
    path_to_json TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on module_id
CREATE INDEX IF NOT EXISTS idx_module_versions_module_id ON module_versions(module_id);

-- Create index on version
CREATE INDEX IF NOT EXISTS idx_module_versions_version ON module_versions(version);

-- Create unique constraint on module_id and version
CREATE UNIQUE INDEX IF NOT EXISTS idx_module_versions_unique ON module_versions(module_id, version);