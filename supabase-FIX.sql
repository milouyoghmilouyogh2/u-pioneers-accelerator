-- ============================================
-- STEP 1: DROP OLD TABLES (run this FIRST)
-- ============================================
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

DROP TABLE IF EXISTS public.payment_requests CASCADE;
DROP TABLE IF EXISTS public.startup_answers CASCADE;
DROP TABLE IF EXISTS public.startups CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.support_tickets CASCADE;
DROP TABLE IF EXISTS public.weapons CASCADE;
DROP TABLE IF EXISTS public.settings CASCADE;
DROP VIEW IF EXISTS public.leaderboard CASCADE;

DELETE FROM storage.buckets WHERE id = 'receipts';

-- ============================================
-- STEP 2: THEN PASTE THE CLEAN DELIVER FILE
-- ============================================
-- Now paste supabase-CLEAN-DELIVER.sql and run it
