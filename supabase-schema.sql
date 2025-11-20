-- Couple Calendar App - Database Schema
-- Execute this SQL in your Supabase SQL Editor

-- ============================================
-- TABLES
-- ============================================

-- Table: couples
CREATE TABLE IF NOT EXISTS couples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_code VARCHAR(6) UNIQUE NOT NULL,
  anniversary_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: user_profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  couple_id UUID REFERENCES couples(id) ON DELETE SET NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: events
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID REFERENCES couples(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TIME,
  event_type VARCHAR(20) DEFAULT 'date' CHECK (event_type IN ('date', 'anniversary', 'todo')),
  color VARCHAR(7) DEFAULT '#FF6B9D',
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_events_couple_date ON events(couple_id, event_date DESC);
CREATE INDEX IF NOT EXISTS idx_user_profiles_couple ON user_profiles(couple_id);
CREATE INDEX IF NOT EXISTS idx_couples_code ON couples(couple_code);

-- ============================================
-- TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_couples_updated_at ON couples;
CREATE TRIGGER update_couples_updated_at
  BEFORE UPDATE ON couples
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE couples ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES - user_profiles
-- ============================================

-- Users can view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can view profiles in their couple
DROP POLICY IF EXISTS "Users can view profiles in their couple" ON user_profiles;
CREATE POLICY "Users can view profiles in their couple"
  ON user_profiles FOR SELECT
  USING (
    couple_id IN (
      SELECT couple_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- ============================================
-- RLS POLICIES - couples
-- ============================================

-- Users can view their couple
DROP POLICY IF EXISTS "Users can view their couple" ON couples;
CREATE POLICY "Users can view their couple"
  ON couples FOR SELECT
  USING (
    id IN (
      SELECT couple_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- Users can update their couple
DROP POLICY IF EXISTS "Users can update their couple" ON couples;
CREATE POLICY "Users can update their couple"
  ON couples FOR UPDATE
  USING (
    id IN (
      SELECT couple_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- Anyone can insert couples (for creating new couples)
DROP POLICY IF EXISTS "Anyone can create couples" ON couples;
CREATE POLICY "Anyone can create couples"
  ON couples FOR INSERT
  WITH CHECK (true);

-- Users can delete their couple (when leaving)
DROP POLICY IF EXISTS "Users can delete their couple" ON couples;
CREATE POLICY "Users can delete their couple"
  ON couples FOR DELETE
  USING (
    id IN (
      SELECT couple_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- ============================================
-- RLS POLICIES - events
-- ============================================

-- Users can view events from their couple
DROP POLICY IF EXISTS "Users can view their couple events" ON events;
CREATE POLICY "Users can view their couple events"
  ON events FOR SELECT
  USING (
    couple_id IN (
      SELECT couple_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- Users can insert events for their couple
DROP POLICY IF EXISTS "Users can insert events for their couple" ON events;
CREATE POLICY "Users can insert events for their couple"
  ON events FOR INSERT
  WITH CHECK (
    couple_id IN (
      SELECT couple_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- Users can update events from their couple
DROP POLICY IF EXISTS "Users can update events of their couple" ON events;
CREATE POLICY "Users can update events of their couple"
  ON events FOR UPDATE
  USING (
    couple_id IN (
      SELECT couple_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- Users can delete events from their couple
DROP POLICY IF EXISTS "Users can delete events of their couple" ON events;
CREATE POLICY "Users can delete events of their couple"
  ON events FOR DELETE
  USING (
    couple_id IN (
      SELECT couple_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to generate a unique 6-character couple code
CREATE OR REPLACE FUNCTION generate_couple_code()
RETURNS VARCHAR(6) AS $$
DECLARE
  characters TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- Excludes ambiguous chars
  result VARCHAR(6) := '';
  i INTEGER;
  code_exists BOOLEAN;
BEGIN
  LOOP
    result := '';
    FOR i IN 1..6 LOOP
      result := result || substr(characters, floor(random() * length(characters) + 1)::integer, 1);
    END LOOP;

    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM couples WHERE couple_code = result) INTO code_exists;

    IF NOT code_exists THEN
      EXIT;
    END IF;
  END LOOP;

  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Uncomment to insert sample data for testing
-- INSERT INTO couples (couple_code, anniversary_date)
-- VALUES (generate_couple_code(), '2024-01-14');
