-- ============================================
-- U-Pioneers Supabase Schema
-- Exported from: dbpcambrlezewabgwvcv
-- Date: 2026-08-24
-- ============================================

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL DEFAULT '',
    university TEXT NOT NULL DEFAULT '',
    major TEXT NOT NULL DEFAULT '',
    whatsapp TEXT NOT NULL DEFAULT '',
    role TEXT NOT NULL DEFAULT 'student',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name)
    VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', ''));
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- STARTUPS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.startups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    project_title TEXT NOT NULL,
    current_step INTEGER NOT NULL DEFAULT 1,
    progress_percentage INTEGER NOT NULL DEFAULT 0,
    is_premium BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.startups ENABLE ROW LEVEL SECURITY;

-- Startups policies
CREATE POLICY "Users can view own startups" ON public.startups
    FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can create own startups" ON public.startups
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own startups" ON public.startups
    FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own startups" ON public.startups
    FOR DELETE USING (auth.uid() = owner_id);

-- ============================================
-- STARTUP_ANSWERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.startup_answers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    startup_id UUID REFERENCES public.startups(id) ON DELETE CASCADE NOT NULL,
    weapon_number INTEGER NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.startup_answers ENABLE ROW LEVEL SECURITY;

-- Startup answers policies
CREATE POLICY "Users can view own startup answers" ON public.startup_answers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.startups
            WHERE startups.id = startup_answers.startup_id
            AND startups.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can create own startup answers" ON public.startup_answers
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.startups
            WHERE startups.id = startup_answers.startup_id
            AND startups.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own startup answers" ON public.startup_answers
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.startups
            WHERE startups.id = startup_answers.startup_id
            AND startups.owner_id = auth.uid()
        )
    );

-- ============================================
-- WEAPONS TABLE (Content/Knowledge)
-- ============================================
CREATE TABLE IF NOT EXISTS public.weapons (
    number INTEGER NOT NULL PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    knowledge TEXT NOT NULL,
    task_prompt TEXT NOT NULL,
    placeholder TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.weapons ENABLE ROW LEVEL SECURITY;

-- Weapons are public read
CREATE POLICY "Anyone can view weapons" ON public.weapons
    FOR SELECT USING (true);

-- ============================================
-- SUPPORT_TICKETS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    whatsapp TEXT,
    ticket_type TEXT NOT NULL DEFAULT 'general',
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    admin_reply TEXT,
    replied_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Support tickets policies
CREATE POLICY "Users can view own tickets" ON public.support_tickets
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create tickets" ON public.support_tickets
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- ============================================
-- PAYMENT_REQUESTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.payment_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    startup_id UUID REFERENCES public.startups(id) ON DELETE CASCADE NOT NULL,
    receipt_path TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    admin_note TEXT,
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_requests ENABLE ROW LEVEL SECURITY;

-- Payment requests policies
CREATE POLICY "Users can view own payment requests" ON public.payment_requests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.startups
            WHERE startups.id = payment_requests.startup_id
            AND startups.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can create own payment requests" ON public.payment_requests
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.startups
            WHERE startups.id = payment_requests.startup_id
            AND startups.owner_id = auth.uid()
        )
    );

-- ============================================
-- SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.settings (
    key TEXT NOT NULL PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Settings are public read
CREATE POLICY "Anyone can view settings" ON public.settings
    FOR SELECT USING (true);

-- ============================================
-- LEADERBOARD VIEW
-- ============================================
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT
    p.id,
    p.full_name,
    p.university,
    s.project_title,
    s.current_step,
    s.progress_percentage,
    s.is_premium
FROM public.profiles p
JOIN public.startups s ON p.id = s.owner_id;

-- ============================================
-- STORAGE BUCKETS
-- ============================================
-- Create storage bucket for receipts
INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for receipts
CREATE POLICY "Users can upload own receipts" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'receipts'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view own receipts" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'receipts'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- ============================================
-- SEED DATA (Optional - Weapons content)
-- ============================================
-- Note: You'll need to seed the weapons table separately
-- with the content from your existing database

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_startups_owner_id ON public.startups(owner_id);
CREATE INDEX IF NOT EXISTS idx_startup_answers_startup_id ON public.startup_answers(startup_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON public.support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_requests_startup_id ON public.payment_requests(startup_id);

-- ============================================
-- GRANTS
-- ============================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
