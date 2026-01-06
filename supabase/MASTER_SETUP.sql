-- ============================================
-- LeadHub - Master Database Setup
-- ============================================
-- This script sets up the entire database from scratch.
-- It resolves:
-- 1. Foreign Key violation (user_id is now optional)
-- 2. Unique constraints and conflict issues
-- 3. Storage bucket and public policies
-- ============================================

-- CLEANUP: Drop existing triggers and tables to ensure a fresh start
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_leads_updated_at ON public.leads;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TABLE IF EXISTS public.leads;
DROP TABLE IF EXISTS public.profiles;
DROP TYPE IF EXISTS public.lead_source CASCADE;
DROP TYPE IF EXISTS public.lead_status CASCADE;
DROP TYPE IF EXISTS public.reason_lost CASCADE;
DROP TYPE IF EXISTS public.client_type CASCADE;
DROP TYPE IF EXISTS public.service_pitch CASCADE;

-- 1. Types
CREATE TYPE public.lead_source AS ENUM ('google_maps', 'instagram', 'facebook', 'whatsapp', 'linkedin', 'other');
CREATE TYPE public.lead_status AS ENUM ('new', 'replied', 'interested', 'closed', 'lost');
CREATE TYPE public.reason_lost AS ENUM ('price', 'no_reply', 'fake', 'other');
CREATE TYPE public.client_type AS ENUM ('individual_agent', 'brokerage', 'developer');
CREATE TYPE public.service_pitch AS ENUM ('ai_automation', 'website', 'full_package');

-- 2. Tables
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Leads table (user_id is optional to avoid FK violations for non-auth users)
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID, -- References auth.users(id) but made optional
  
  -- Basic Info
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
  
  -- Activity Tracking
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
  
  -- Outcome
  status public.lead_status NOT NULL DEFAULT 'new',
  deal_value NUMERIC(10, 2),
  reason_lost public.reason_lost,
  other_reason_lost TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Security (Disabling RLS for now to ensure working state as requested)
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads DISABLE ROW LEVEL SECURITY;

-- 4. Triggers for Timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Storage for Screenshots
-- Ensure bucket exists (using insert if not exist handled by Supabase Dashboard usually, but here for completeness)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('screenshots', 'screenshots', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies (Public for testing as requested)
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public View" ON storage.objects;

CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'screenshots');
CREATE POLICY "Public View" ON storage.objects FOR SELECT USING (bucket_id = 'screenshots');

-- Success message
-- The database is now ready for LeadHub.
