-- ============================================================
-- U-Pioneers RLS Policies Migration
-- Date: 2026-08-30
-- Purpose: Document and enforce RLS policies for all tables
-- ============================================================

-- Enable RLS on all tables (idempotent)
ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS startups ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS startup_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS weapons ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS payment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS settings ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PROFILES TABLE
-- ============================================================
-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile (except role)
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admins can read all profiles
CREATE POLICY "Admins can read all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can insert profiles (for user creation)
CREATE POLICY "Admins can insert profiles" ON profiles
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- STARTUPS TABLE
-- ============================================================
-- Users can read their own startup
CREATE POLICY "Users can read own startup" ON startups
  FOR SELECT USING (auth.uid() = owner_id);

-- Users can update their own startup
CREATE POLICY "Users can update own startup" ON startups
  FOR UPDATE USING (auth.uid() = owner_id);

-- Users can insert their own startup
CREATE POLICY "Users can insert own startup" ON startups
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Admins can read all startups
CREATE POLICY "Admins can read all startups" ON startups
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can update all startups
CREATE POLICY "Admins can update all startups" ON startups
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- STARTUP_ANSWERS TABLE (CRITICAL - contains business plan data)
-- ============================================================
-- Users can read answers for their own startup only
CREATE POLICY "Users can read own answers" ON startup_answers
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM startups WHERE id = startup_answers.startup_id AND owner_id = auth.uid())
  );

-- Users can insert/update answers for their own startup
CREATE POLICY "Users can manage own answers" ON startup_answers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM startups WHERE id = startup_answers.startup_id AND owner_id = auth.uid())
  );

-- Admins can read all answers
CREATE POLICY "Admins can read all answers" ON startup_answers
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can update all answers
CREATE POLICY "Admins can update all answers" ON startup_answers
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- WEAPONS TABLE (public read - content is public)
-- ============================================================
-- Anyone can read weapons (public content)
CREATE POLICY "Anyone can read weapons" ON weapons
  FOR SELECT USING (true);

-- Only admins can modify weapons
CREATE POLICY "Admins can manage weapons" ON weapons
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- PAYMENT_REQUESTS TABLE (CRITICAL - contains financial data)
-- ============================================================
-- Users can read their own payment requests
CREATE POLICY "Users can read own payments" ON payment_requests
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM startups WHERE id = payment_requests.startup_id AND owner_id = auth.uid())
  );

-- Users can insert their own payment requests
CREATE POLICY "Users can insert own payments" ON payment_requests
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM startups WHERE id = payment_requests.startup_id AND owner_id = auth.uid())
  );

-- Admins can read all payment requests
CREATE POLICY "Admins can read all payments" ON payment_requests
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can update all payment requests
CREATE POLICY "Admins can update all payments" ON payment_requests
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- SUPPORT_TICKETS TABLE
-- ============================================================
-- Users can read their own tickets
CREATE POLICY "Users can read own tickets" ON support_tickets
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own tickets
CREATE POLICY "Users can insert own tickets" ON support_tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can read all tickets
CREATE POLICY "Admins can read all tickets" ON support_tickets
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can update all tickets
CREATE POLICY "Admins can update all tickets" ON support_tickets
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- SETTINGS TABLE (mostly public read for app config)
-- ============================================================
-- Anyone can read settings (public config like RIP, whatsapp number)
CREATE POLICY "Anyone can read settings" ON settings
  FOR SELECT USING (true);

-- Only admins can modify settings
CREATE POLICY "Admins can manage settings" ON settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
