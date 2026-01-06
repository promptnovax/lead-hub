-- Add salesperson_name column to leads table
-- Run this in Supabase SQL Editor

-- Add the column if it doesn't exist
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS salesperson_name TEXT NOT NULL DEFAULT '';

-- Update user_id to be optional with default value
ALTER TABLE public.leads 
ALTER COLUMN user_id DROP NOT NULL,
ALTER COLUMN user_id SET DEFAULT '00000000-0000-0000-0000-000000000000'::uuid;

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'leads'
ORDER BY ordinal_position;
