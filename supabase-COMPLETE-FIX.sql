-- ============================================
-- U-Pioneers COMPLETE DATABASE FIX
-- Copied from working account (dbpcambrlezewabgwvcv)
-- Run this in owner's Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. FUNCTIONS
-- ============================================

-- is_admin: check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$function$;

-- handle_new_user: auto-create profile + startup on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
begin
  insert into public.profiles (id, full_name, university, major, whatsapp)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'university', ''),
    coalesce(new.raw_user_meta_data->>'major', ''),
    coalesce(new.raw_user_meta_data->>'whatsapp', '')
  );

  insert into public.startups (owner_id, project_title)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'project_title', ''), 'مشروعي الريادي')
  );

  return new;
end;
$function$;

-- set_updated_at: auto-update timestamp
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;

-- guard_profile_role: prevent non-admins from changing roles
CREATE OR REPLACE FUNCTION public.guard_profile_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    new.role := old.role;
  end if;
  return new;
end;
$function$;

-- guard_startup_fields: prevent non-admins from changing progress
CREATE OR REPLACE FUNCTION public.guard_startup_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
begin
  if current_setting('app.bypass_startup_guard', true) is distinct from 'on'
     and not public.is_admin() then
    new.current_step := old.current_step;
    new.progress_percentage := old.progress_percentage;
    new.is_premium := old.is_premium;
  end if;
  return new;
end;
$function$;

-- submit_weapon_answer: save answer + advance progress
CREATE OR REPLACE FUNCTION public.submit_weapon_answer(p_weapon_number integer, p_answer text)
RETURNS startups
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
declare
  v_startup public.startups;
  v_answered_count int;
begin
  select * into v_startup from public.startups where owner_id = auth.uid();
  if not found then
    raise exception 'no startup found for current user';
  end if;

  if p_weapon_number > v_startup.current_step then
    raise exception 'weapon % is locked', p_weapon_number;
  end if;

  insert into public.startup_answers (startup_id, weapon_number, answer)
  values (v_startup.id, p_weapon_number, p_answer)
  on conflict (startup_id, weapon_number)
  do update set answer = excluded.answer, updated_at = now();

  select count(*) into v_answered_count
  from public.startup_answers where startup_id = v_startup.id;

  perform set_config('app.bypass_startup_guard', 'on', true);

  update public.startups
  set
    current_step = case
      when p_weapon_number = current_step and current_step <= 16 then current_step + 1
      else current_step
    end,
    progress_percentage = least(100, round((v_answered_count::numeric / 16) * 100))
  where id = v_startup.id
  returning * into v_startup;

  return v_startup;
end;
$function$;

-- review_payment_request: admin approve/reject payments
CREATE OR REPLACE FUNCTION public.review_payment_request(p_request_id uuid, p_approve boolean, p_note text DEFAULT NULL::text)
RETURNS payment_requests
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
declare
  v_request public.payment_requests;
begin
  if not public.is_admin() then
    raise exception 'admin only';
  end if;

  select * into v_request from public.payment_requests where id = p_request_id;
  if not found then
    raise exception 'payment request not found';
  end if;

  update public.payment_requests
  set status = case when p_approve then 'approved' else 'rejected' end,
      admin_note = p_note,
      reviewed_by = auth.uid(),
      reviewed_at = now()
  where id = p_request_id
  returning * into v_request;

  if p_approve then
    perform set_config('app.bypass_startup_guard', 'on', true);
    update public.startups set is_premium = true where id = v_request.startup_id;
  end if;

  return v_request;
end;
$function$;

-- ============================================
-- 2. TRIGGERS
-- ============================================

-- Auto-create profile + startup on new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at on profiles
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-update updated_at on startups
DROP TRIGGER IF EXISTS set_startups_updated_at ON public.startups;
CREATE TRIGGER set_startups_updated_at
  BEFORE UPDATE ON public.startups
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-update updated_at on startup_answers
DROP TRIGGER IF EXISTS set_answers_updated_at ON public.startup_answers;
CREATE TRIGGER set_answers_updated_at
  BEFORE UPDATE ON public.startup_answers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Guard: prevent non-admins from changing role
DROP TRIGGER IF EXISTS guard_profiles_role ON public.profiles;
CREATE TRIGGER guard_profiles_role
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.guard_profile_role();

-- Guard: prevent non-admins from changing startup progress
DROP TRIGGER IF EXISTS guard_startups_fields ON public.startups;
CREATE TRIGGER guard_startups_fields
  BEFORE UPDATE ON public.startups
  FOR EACH ROW EXECUTE FUNCTION public.guard_startup_fields();

-- ============================================
-- 3. RLS POLICIES (drop old ones first)
-- ============================================

-- Drop ALL existing policies
DO $$ DECLARE r RECORD; BEGIN
  FOR r IN SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', r.policyname, r.tablename);
  END LOOP;
END $$;

-- PROFILES
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING ((id = auth.uid()) OR is_admin());
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING ((id = auth.uid()) OR is_admin());

-- STARTUPS
CREATE POLICY "startups_select" ON public.startups FOR SELECT USING ((owner_id = auth.uid()) OR is_admin());
CREATE POLICY "startups_insert" ON public.startups FOR INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY "startups_update" ON public.startups FOR UPDATE USING ((owner_id = auth.uid()) OR is_admin());

-- STARTUP_ANSWERS
CREATE POLICY "startup_answers_select" ON public.startup_answers FOR SELECT USING (is_admin() OR (EXISTS (SELECT 1 FROM startups s WHERE s.id = startup_answers.startup_id AND s.owner_id = auth.uid())));
CREATE POLICY "startup_answers_insert" ON public.startup_answers FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM startups s WHERE s.id = startup_answers.startup_id AND s.owner_id = auth.uid()));
CREATE POLICY "startup_answers_update" ON public.startup_answers FOR UPDATE USING (is_admin() OR (EXISTS (SELECT 1 FROM startups s WHERE s.id = startup_answers.startup_id AND s.owner_id = auth.uid())));

-- PAYMENT_REQUESTS
CREATE POLICY "payment_requests_select" ON public.payment_requests FOR SELECT USING (is_admin() OR (EXISTS (SELECT 1 FROM startups s WHERE s.id = payment_requests.startup_id AND s.owner_id = auth.uid())));
CREATE POLICY "payment_requests_insert" ON public.payment_requests FOR INSERT WITH CHECK ((status = 'pending') AND (EXISTS (SELECT 1 FROM startups s WHERE s.id = payment_requests.startup_id AND s.owner_id = auth.uid())));
CREATE POLICY "payment_requests_admin_update" ON public.payment_requests FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());

-- SUPPORT_TICKETS
CREATE POLICY "support_tickets_select" ON public.support_tickets FOR SELECT USING (is_admin() OR (user_id = auth.uid()));
CREATE POLICY "support_tickets_insert" ON public.support_tickets FOR INSERT WITH CHECK (true);
CREATE POLICY "support_tickets_admin_update" ON public.support_tickets FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());

-- WEAPONS
CREATE POLICY "weapons_select" ON public.weapons FOR SELECT USING (true);
CREATE POLICY "weapons_admin_write" ON public.weapons FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- SETTINGS
CREATE POLICY "settings_select" ON public.settings FOR SELECT USING (true);
CREATE POLICY "settings_admin_write" ON public.settings FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- ============================================
-- 4. UNIQUE INDEX for startup_answers
-- ============================================
CREATE UNIQUE INDEX IF NOT EXISTS idx_startup_answers_startup_weapon
  ON public.startup_answers (startup_id, weapon_number);

-- ============================================
-- DONE! ✅
-- ============================================
