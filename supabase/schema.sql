-- Restaurant SABORES DE PORTUGAL - Complete Database Schema
-- This SQL file creates all tables, indexes, policies, and functions needed for the restaurant reservation system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- CUSTOMERS & AUTHENTICATION
-- ============================================================================

-- Customers Table (unified profiles)
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  email_verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false,
  profile_photo_url TEXT,
  marketing_consent_email BOOLEAN DEFAULT false,
  marketing_consent_whatsapp BOOLEAN DEFAULT false,
  dietary_restrictions TEXT[],
  allergens TEXT[],
  preferred_table_type TEXT,
  customer_tags TEXT[],
  total_visits INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  no_show_count INTEGER DEFAULT 0,
  is_blacklisted BOOLEAN DEFAULT false,
  blacklist_reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_email UNIQUE(email),
  CONSTRAINT unique_phone UNIQUE(phone)
);

-- Customer Contact Methods (for linking multiple methods to one profile)
CREATE TABLE IF NOT EXISTS customer_contacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  contact_type TEXT NOT NULL CHECK (contact_type IN ('email', 'phone')),
  contact_value TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_contact UNIQUE(contact_type, contact_value)
);

-- OTP Verification Table
CREATE TABLE IF NOT EXISTS otp_verifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  contact_type TEXT NOT NULL CHECK (contact_type IN ('email', 'phone')),
  contact_value TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  attempts INTEGER DEFAULT 0,
  is_used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABLES & FLOOR PLANS
-- ============================================================================

-- Restaurant Tables (floor plan)
CREATE TABLE IF NOT EXISTS restaurant_tables (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  table_number TEXT NOT NULL UNIQUE,
  floor_level INTEGER DEFAULT 1,
  capacity_min INTEGER NOT NULL,
  capacity_max INTEGER NOT NULL,
  table_type TEXT CHECK (table_type IN ('Standard', 'Window', 'Outdoor', 'Private', 'Bar')),
  features TEXT[],
  position_x DECIMAL(10,2),
  position_y DECIMAL(10,2),
  width DECIMAL(10,2),
  height DECIMAL(10,2),
  rotation INTEGER DEFAULT 0,
  can_combine_with TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table Blocks (for maintenance/unavailability)
CREATE TABLE IF NOT EXISTS table_blocks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  table_id UUID REFERENCES restaurant_tables(id) ON DELETE CASCADE,
  start_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  end_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  reason TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Floor Plans (multiple layouts)
CREATE TABLE IF NOT EXISTS floor_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  background_image_url TEXT,
  floor_count INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT false,
  layout_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- RESERVATIONS
-- ============================================================================

-- Reservations Table
CREATE TABLE IF NOT EXISTS reservations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reservation_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id),

  -- Reservation details
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 120,
  guests_count INTEGER NOT NULL,

  -- Table assignment
  assigned_tables UUID[],

  -- Customer preferences
  occasion TEXT CHECK (occasion IN ('Birthday', 'Anniversary', 'Business', 'Date', 'Other')),
  special_requests TEXT,
  dietary_notes TEXT,

  -- Status and tracking
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'checked_in', 'completed', 'cancelled', 'no_show')),
  source TEXT DEFAULT 'web' CHECK (source IN ('web', 'phone', 'walk_in', 'google', 'third_party')),

  -- Verification
  is_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMP WITH TIME ZONE,
  verification_method TEXT CHECK (verification_method IN ('email', 'phone', 'both')),

  -- Payment
  requires_deposit BOOLEAN DEFAULT false,
  deposit_amount DECIMAL(10,2),
  deposit_status TEXT CHECK (deposit_status IN ('pending', 'paid', 'refunded')),
  deposit_transaction_id TEXT,

  -- Communication
  confirmation_sent BOOLEAN DEFAULT false,
  confirmation_sent_at TIMESTAMP WITH TIME ZONE,
  reminder_sent BOOLEAN DEFAULT false,
  reminder_sent_at TIMESTAMP WITH TIME ZONE,

  -- Admin notes
  admin_notes TEXT,
  cancellation_reason TEXT,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  checked_in_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  modified_by UUID REFERENCES auth.users(id)
);

-- Pre-ordered Menu Items
CREATE TABLE IF NOT EXISTS reservation_menu_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reservation_id UUID REFERENCES reservations(id) ON DELETE CASCADE,
  menu_item_id UUID,
  quantity INTEGER NOT NULL,
  price_at_time DECIMAL(10,2) NOT NULL,
  special_instructions TEXT,
  is_prepared BOOLEAN DEFAULT false
);

-- ============================================================================
-- MENU & GALLERY
-- ============================================================================

-- Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Starter', 'Main', 'Dessert', 'Drink', 'Special')),
  dietary_tags TEXT[],
  allergens TEXT[],
  image_url TEXT,
  preparation_time_minutes INTEGER,
  availability TEXT DEFAULT 'always' CHECK (availability IN ('always', 'lunch_only', 'dinner_only', 'weekends')),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  popularity_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gallery Images
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT CHECK (category IN ('Menu', 'Interior', 'Food', 'Team', 'Events')),
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  file_size INTEGER,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- COMMUNICATION
-- ============================================================================

-- Communication Log
CREATE TABLE IF NOT EXISTS communication_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reservation_id UUID REFERENCES reservations(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id),
  message_type TEXT NOT NULL CHECK (message_type IN ('otp', 'confirmation', 'reminder', 'modification', 'cancellation', 'marketing')),
  channel TEXT NOT NULL CHECK (channel IN ('whatsapp', 'email', 'sms')),
  recipient TEXT NOT NULL,
  subject TEXT,
  message_content TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'read', 'failed')),
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Message Templates
CREATE TABLE IF NOT EXISTS message_templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  template_type TEXT NOT NULL CHECK (template_type IN ('otp', 'confirmation', 'reminder', 'modification', 'cancellation', 'thank_you', 'marketing')),
  channel TEXT NOT NULL CHECK (channel IN ('whatsapp', 'email', 'sms')),
  language TEXT DEFAULT 'en',
  subject TEXT,
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- SETTINGS & ADMIN
-- ============================================================================

-- Restaurant Settings (key-value store)
CREATE TABLE IF NOT EXISTS restaurant_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin Users (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS admin_users (
  user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role TEXT DEFAULT 'staff' CHECK (role IN ('super_admin', 'manager', 'staff', 'view_only')),
  permissions JSONB,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Log
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  admin_user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  changes JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Waitlist
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  party_size INTEGER NOT NULL,
  requested_time TIME NOT NULL,
  estimated_wait_minutes INTEGER,
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'notified', 'seated', 'left')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notified_at TIMESTAMP WITH TIME ZONE,
  seated_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(reservation_date);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_customer ON reservations(customer_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_communication_log_reservation ON communication_log(reservation_id);
CREATE INDEX IF NOT EXISTS idx_otp_contact ON otp_verifications(contact_type, contact_value);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
CREATE INDEX IF NOT EXISTS idx_menu_items_active ON menu_items(is_active);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservation_menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE table_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE floor_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Public read access for menu items (active only)
CREATE POLICY "Public can view active menu items" ON menu_items
  FOR SELECT USING (is_active = true);

-- Public read access for gallery
CREATE POLICY "Public can view gallery" ON gallery_images
  FOR SELECT USING (true);

-- Public can view available tables (for selection)
CREATE POLICY "Public can view active tables" ON restaurant_tables
  FOR SELECT USING (is_active = true);

-- Anyone can create reservations
CREATE POLICY "Anyone can create reservations" ON reservations
  FOR INSERT WITH CHECK (true);

-- Customers can view their own reservations (simplified - production needs proper auth)
CREATE POLICY "Customers can view own reservations" ON reservations
  FOR SELECT USING (true);

-- Admin policies - full access for authenticated admin users
CREATE POLICY "Admins have full access to customers" ON customers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true)
  );

CREATE POLICY "Admins have full access to reservations" ON reservations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true)
  );

CREATE POLICY "Admins have full access to menu_items" ON menu_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true)
  );

CREATE POLICY "Admins have full access to gallery" ON gallery_images
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true)
  );

CREATE POLICY "Admins have full access to tables" ON restaurant_tables
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true)
  );

CREATE POLICY "Admins have full access to communication_log" ON communication_log
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true)
  );

CREATE POLICY "Admins have full access to templates" ON message_templates
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true)
  );

CREATE POLICY "Admins have full access to settings" ON restaurant_settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true)
  );

CREATE POLICY "Admins have full access to floor_plans" ON floor_plans
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true)
  );

CREATE POLICY "Admins have full access to waitlist" ON waitlist
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true)
  );

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function for auto-updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update triggers
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_restaurant_tables_updated_at BEFORE UPDATE ON restaurant_tables
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_floor_plans_updated_at BEFORE UPDATE ON floor_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_message_templates_updated_at BEFORE UPDATE ON message_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INITIAL DATA / SEED
-- ============================================================================

-- Insert default settings
INSERT INTO restaurant_settings (setting_key, setting_value) VALUES
  ('restaurant_name', '"SABORES DE PORTUGAL"'::jsonb),
  ('max_advance_booking_days', '60'::jsonb),
  ('min_advance_booking_hours', '2'::jsonb),
  ('default_reservation_duration', '120'::jsonb),
  ('buffer_time_minutes', '15'::jsonb),
  ('require_deposit_for_party_size', '6'::jsonb),
  ('deposit_amount_per_person', '20'::jsonb),
  ('otp_code_length', '6'::jsonb),
  ('otp_expiry_minutes', '5'::jsonb),
  ('otp_max_attempts', '3'::jsonb)
ON CONFLICT (setting_key) DO NOTHING;

-- Insert default message templates
INSERT INTO message_templates (name, template_type, channel, language, subject, content, is_active) VALUES
  ('OTP Email', 'otp', 'email', 'en', 'Your verification code', 'Hi {name}, your verification code is: {otp_code}. It expires in {expiry_minutes} minutes.', true),
  ('OTP WhatsApp', 'otp', 'whatsapp', 'en', NULL, 'Hi {name}! Your verification code is: {otp_code}. Valid for {expiry_minutes} minutes.', true),
  ('Confirmation Email', 'confirmation', 'email', 'en', 'Reservation Confirmed - {restaurant_name}', 'Hi {name}, your reservation is confirmed for {date} at {time} for {guests} guests. Table: {table}. Confirmation ID: {reservation_number}', true),
  ('Confirmation WhatsApp', 'confirmation', 'whatsapp', 'en', NULL, 'Hi {name}! Your table is reserved at {restaurant_name} on {date} at {time} for {guests} guests. Table: {table}. Confirmation: {reservation_number}. See you soon!', true),
  ('Reminder WhatsApp', 'reminder', 'whatsapp', 'en', NULL, 'Hi {name}! Reminder: Your reservation at {restaurant_name} is today at {time}. We look forward to seeing you!', true)
ON CONFLICT DO NOTHING;

COMMENT ON TABLE customers IS 'Stores customer profiles with contact information and preferences';
COMMENT ON TABLE reservations IS 'Main reservations table with all booking details';
COMMENT ON TABLE restaurant_tables IS 'Floor plan tables configuration with positions and properties';
COMMENT ON TABLE communication_log IS 'Tracks all communications sent to customers via WhatsApp, Email, or SMS';
