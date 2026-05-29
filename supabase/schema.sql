-- ==========================================
-- ZENHABIT SUPABASE SCHEMA
-- Run this script in your Supabase SQL Editor
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  theme_preference TEXT DEFAULT 'system',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile."
  ON public.profiles FOR SELECT
  USING ( auth.uid() = id );

CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );

-- Auto-create profile on signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. HABITS TABLE
CREATE TABLE public.habits (
  id TEXT PRIMARY KEY, -- We use string IDs from local state (e.g., 'habit-123')
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  goal_type TEXT NOT NULL, -- 'build' or 'break'
  icon TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own habits."
  ON public.habits FOR SELECT
  USING ( auth.uid() = user_id );

CREATE POLICY "Users can insert own habits."
  ON public.habits FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can update own habits."
  ON public.habits FOR UPDATE
  USING ( auth.uid() = user_id );

CREATE POLICY "Users can delete own habits."
  ON public.habits FOR DELETE
  USING ( auth.uid() = user_id );

-- 3. HABIT COMPLETIONS TABLE
CREATE TABLE public.habit_completions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  habit_id TEXT REFERENCES public.habits ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  completion_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(habit_id, user_id, completion_date) -- Prevent duplicate check-ins for the same day
);

-- Enable RLS
ALTER TABLE public.habit_completions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own completions."
  ON public.habit_completions FOR SELECT
  USING ( auth.uid() = user_id );

CREATE POLICY "Users can insert own completions."
  ON public.habit_completions FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can delete own completions."
  ON public.habit_completions FOR DELETE
  USING ( auth.uid() = user_id );

-- Setup Realtime
alter publication supabase_realtime add table public.habits;
alter publication supabase_realtime add table public.habit_completions;
