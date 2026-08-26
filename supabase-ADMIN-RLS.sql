-- ============================================
-- ADMIN RLS POLICIES
-- Run this to let admins see all data
-- ============================================

-- Helper: check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- PROFILES: Admin can see all, users see their own
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

-- STARTUPS: Admin can see all, users see their own
DROP POLICY IF EXISTS "Users can view own startups" ON public.startups;
CREATE POLICY "Users can view own startups" ON public.startups
  FOR SELECT USING (auth.uid() = owner_id OR public.is_admin());

-- STARTUP_ANSWERS: Admin can see all
DROP POLICY IF EXISTS "Users can view own startup answers" ON public.startup_answers;
CREATE POLICY "Users can view own startup answers" ON public.startup_answers
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.startups WHERE startups.id = startup_answers.startup_id AND (startups.owner_id = auth.uid() OR public.is_admin()))
  );

-- PAYMENT_REQUESTS: Admin can see all
DROP POLICY IF EXISTS "Users can view own payment requests" ON public.payment_requests;
CREATE POLICY "Users can view own payment requests" ON public.payment_requests
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.startups WHERE startups.id = payment_requests.startup_id AND (startups.owner_id = auth.uid() OR public.is_admin()))
  );

-- SUPPORT_TICKETS: Admin can see all
DROP POLICY IF EXISTS "Users can view own tickets" ON public.support_tickets;
CREATE POLICY "Users can view own tickets" ON public.support_tickets
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

-- Admin can also UPDATE tickets (reply, close)
DROP POLICY IF EXISTS "Users can create tickets" ON public.support_tickets;
CREATE POLICY "Users can create tickets" ON public.support_tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admin can update tickets" ON public.support_tickets
  FOR UPDATE USING (public.is_admin());
