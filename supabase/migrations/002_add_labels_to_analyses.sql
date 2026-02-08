-- Add labels column to analyses table
ALTER TABLE analyses
ADD COLUMN IF NOT EXISTS labels JSONB DEFAULT '[]'::jsonb;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_analyses_labels ON analyses USING GIN (labels);
