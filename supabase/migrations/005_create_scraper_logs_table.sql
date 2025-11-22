-- Create scraper_logs table
CREATE TABLE IF NOT EXISTS scraper_logs (
    id TEXT PRIMARY KEY,
    source_url TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'warning')),
    message TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on source_url
CREATE INDEX IF NOT EXISTS idx_scraper_logs_source_url ON scraper_logs(source_url);

-- Create index on status
CREATE INDEX IF NOT EXISTS idx_scraper_logs_status ON scraper_logs(status);

-- Create index on timestamp
CREATE INDEX IF NOT EXISTS idx_scraper_logs_timestamp ON scraper_logs(timestamp);