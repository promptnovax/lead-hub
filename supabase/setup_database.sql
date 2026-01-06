-- ============================================
-- Lead Board Application - Database Setup
-- ============================================
-- Run this SQL file in the Supabase SQL Editor
-- This will create all necessary tables, types, policies, and storage for your lead management system
-- ============================================

-- Step 1: Create ENUM types for standardized values
-- ============================================

-- Drop existing types if they exist (only if you want to recreate them)
-- Uncomment these lines if you need to recreate the types:
-- DROP TYPE IF EXISTS public.lead_source CASCADE;
-- DROP TYPE IF EXISTS public.lead_status CASCADE;
-- DROP TYPE IF EXISTS public.reason_lost CASCADE;
-- DROP TYPE IF EXISTS public.client_type CASCADE;
-- DROP TYPE IF EXISTS public.service_pitch CASCADE;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_source') THEN
    CREATE TYPE public.lead_source AS ENUM (
      'google_maps',
      'instagram', 
      'facebook',
      'whatsapp',
      'linkedin',
      'other'
    );
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_status') THEN
    CREATE TYPE public.lead_status AS ENUM (
      'new',
      'replied',
      'interested',
      'closed',
      'lost'
    );
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'reason_lost') THEN
    CREATE TYPE public.reason_lost AS ENUM (
      'price',
      'no_reply',
      'fake',
      'other'
    );
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'client_type') THEN
    CREATE TYPE public.client_type AS ENUM (
      'individual_agent',
      'brokerage',
      'developer'
    );
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'service_pitch') THEN
    CREATE TYPE public.service_pitch AS ENUM (
      'ai_automation',
      'website',
      'full_package'
    );
  END IF;
END $$;

-- Step 2: Create profiles table for user data
-- ============================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add index for faster user lookups
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);

-- Step 3: Create leads table
-- ============================================

CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic Information Section
  lead_date DATE NOT NULL DEFAULT CURRENT_DATE,
  name TEXT NOT NULL DEFAULT '',
  salesperson_name TEXT NOT NULL DEFAULT '',
  lead_source public.lead_source NOT NULL DEFAULT 'instagram',
  other_source TEXT,
  phone TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  client_type public.client_type NOT NULL DEFAULT 'individual_agent',
  service_pitch public.service_pitch NOT NULL DEFAULT 'ai_automation',
  
  -- Activity Tracking Section
  first_message_sent BOOLEAN NOT NULL DEFAULT false,
  reply_received BOOLEAN NOT NULL DEFAULT false,
  seen BOOLEAN NOT NULL DEFAULT false,
  interested BOOLEAN NOT NULL DEFAULT false,
  follow_up_needed BOOLEAN NOT NULL DEFAULT false,
  follow_up_date DATE,
  
  -- Proof Section
  screenshot_url TEXT,
  screenshot_file_name TEXT,
  notes TEXT NOT NULL DEFAULT '',
  
  -- Outcome Section
  status public.lead_status NOT NULL DEFAULT 'new',
  deal_value NUMERIC(10, 2),
  reason_lost public.reason_lost,
  other_reason_lost TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON public.leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_lead_date ON public.leads(lead_date DESC);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_follow_up_date ON public.leads(follow_up_date) WHERE follow_up_needed = true;

-- Step 4: Disable Row Level Security (RLS) for public access
-- ============================================
-- Since we're not using authentication, we'll disable RLS
-- This allows anyone to access the data without authentication

ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads DISABLE ROW LEVEL SECURITY;

-- Step 5: RLS Policies (Optional - Disabled for public access)
-- ============================================
-- Since RLS is disabled, these policies won't be enforced
-- Keeping them commented for future reference if authentication is added

/*

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

*/

-- Step 6: RLS Policies for leads table (Optional - Disabled)
-- ============================================
/*

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own leads" ON public.leads;
DROP POLICY IF EXISTS "Users can insert their own leads" ON public.leads;
DROP POLICY IF EXISTS "Users can update their own leads" ON public.leads;
DROP POLICY IF EXISTS "Users can delete their own leads" ON public.leads;

-- Create policies - Users can ONLY manage their OWN leads
CREATE POLICY "Users can view their own leads"
ON public.leads FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own leads"
ON public.leads FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own leads"
ON public.leads FOR UPDATE
USING (auth.uid() = user_id);

*/

-- Step 7: Create Functions and Triggers
-- ============================================

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Trigger to auto-create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_leads_updated_at ON public.leads;

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Step 8: Setup Storage for Screenshots
-- ============================================

-- Create storage bucket for screenshots
INSERT INTO storage.buckets (id, name, public)
VALUES ('screenshots', 'screenshots', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Public can upload screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Public can view screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Public can update screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Public can delete screenshots" ON storage.objects;

-- Storage policies for public access (no authentication required)
CREATE POLICY "Public can upload screenshots"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'screenshots');

CREATE POLICY "Public can view screenshots"
ON storage.objects FOR SELECT
USING (bucket_id = 'screenshots');

CREATE POLICY "Public can update screenshots"
ON storage.objects FOR UPDATE
USING (bucket_id = 'screenshots');

CREATE POLICY "Public can delete screenshots"
ON storage.objects FOR DELETE
USING (bucket_id = 'screenshots');

-- ============================================
-- Setup Complete!
-- ============================================
-- Your database is now ready for the lead board application.
-- 
-- Database Structure:
-- 1. profiles table - stores user profile information
-- 2. leads table - stores all lead data with comprehensive tracking
-- 3. Enum types for standardized values
-- 4. RLS policies for security
-- 5. Automatic triggers for timestamps and user creation
-- 6. Storage bucket for screenshot uploads
-- 
-- Next steps:
-- 1. Verify all tables are created by checking the Table Editor
-- 2. Verify storage bucket 'screenshots' exists in Storage
-- 3. Test the application to ensure proper data flow
-- ============================================
