-- ============================================
-- U-Pioneers COMPLETE Supabase Export
-- Source: dbpcambrlezewabgwvcv
-- Date: 2026-08-24
-- ============================================
-- INSTRUCTIONS:
-- 1. Go to owner's Supabase Dashboard
-- 2. SQL Editor > New Query
-- 3. Paste this ENTIRE file
-- 4. Click "Run"
-- ============================================

-- ============================================
-- 1. PROFILES TABLE
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

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 2. STARTUPS TABLE
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

ALTER TABLE public.startups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own startups" ON public.startups
    FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can create own startups" ON public.startups
    FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own startups" ON public.startups
    FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete own startups" ON public.startups
    FOR DELETE USING (auth.uid() = owner_id);

-- ============================================
-- 3. STARTUP_ANSWERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.startup_answers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    startup_id UUID REFERENCES public.startups(id) ON DELETE CASCADE NOT NULL,
    weapon_number INTEGER NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.startup_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own startup answers" ON public.startup_answers
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.startups WHERE startups.id = startup_answers.startup_id AND startups.owner_id = auth.uid())
    );
CREATE POLICY "Users can create own startup answers" ON public.startup_answers
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.startups WHERE startups.id = startup_answers.startup_id AND startups.owner_id = auth.uid())
    );
CREATE POLICY "Users can update own startup answers" ON public.startup_answers
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.startups WHERE startups.id = startup_answers.startup_id AND startups.owner_id = auth.uid())
    );

-- ============================================
-- 4. WEAPONS TABLE (Content)
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

ALTER TABLE public.weapons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view weapons" ON public.weapons FOR SELECT USING (true);

-- ============================================
-- 5. SUPPORT_TICKETS TABLE
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

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tickets" ON public.support_tickets
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create tickets" ON public.support_tickets
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- ============================================
-- 6. PAYMENT_REQUESTS TABLE
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

ALTER TABLE public.payment_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payment requests" ON public.payment_requests
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.startups WHERE startups.id = payment_requests.startup_id AND startups.owner_id = auth.uid())
    );
CREATE POLICY "Users can create own payment requests" ON public.payment_requests
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.startups WHERE startups.id = payment_requests.startup_id AND startups.owner_id = auth.uid())
    );

-- ============================================
-- 7. SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.settings (
    key TEXT NOT NULL PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view settings" ON public.settings FOR SELECT USING (true);

-- ============================================
-- 8. LEADERBOARD VIEW
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
-- 9. STORAGE BUCKETS
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can upload own receipts" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'receipts' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can view own receipts" ON storage.objects
    FOR SELECT USING (bucket_id = 'receipts' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================
-- 10. INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_startups_owner_id ON public.startups(owner_id);
CREATE INDEX IF NOT EXISTS idx_startup_answers_startup_id ON public.startup_answers(startup_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON public.support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_requests_startup_id ON public.payment_requests(startup_id);

-- ============================================
-- 11. GRANTS
-- ============================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- ============================================
-- 12. WEAPONS SEED DATA (16 weapons)
-- ============================================
INSERT INTO public.weapons (number, title, summary, knowledge, task_prompt, placeholder, updated_at) VALUES
(1, 'فكرة المشروع والقيمة المبتكرة', 'بذرة الابتكار وتحديد القيمة الاقتصادية الأولية للمشروع.', 'السلاح الأول يركز على تبلور الفكرة وتحديد المشكلة الحقيقية التي تحلها في السوق الجزائري. يجب أن تكون فكرتك متوافقة مع شروط القرار الوزاري 1275 لتقديم قيمة ابتكارية فريدة ومجدية اقتصادياً.', 'اكتب فكرة مشروعك الناشئ في سطر واحد بوضوح، مع تحديد المشكلة الأساسية التي يعالجها منتجك.', 'مثال: منصة رقمية تربط الفلاحين الجزائريين مباشرة بالمستهلك لتقليل الهدر وزيادة الأرباح.', now())
ON CONFLICT (number) DO NOTHING;

INSERT INTO public.weapons (number, title, summary, knowledge, task_prompt, placeholder, updated_at) VALUES
(2, 'تحديد ودراسة العميل المستهدف', 'تحديد الفئة الدقيقة التي ستقبل على شراء منتجك.', 'الزبون هو شريان الحياة لأي مؤسسة اقتصادية. في هذا السلاح، نقوم بتفكيك شرائح السوق لتحديد زبونك المثالي والأول (Early Adopter) بدقة متناهية.', 'من هو زبونك الأول والأساسي في السوق الجزائري؟ حدد شريحته واحتياجاته بوضوح.', 'مثال: أصحاب المطاعم ومحلات الأغذية الطازجة في ولاية الجزائر العاصمة الذين يعانون من تذبذب التوريد.', now())
ON CONFLICT (number) DO NOTHING;

INSERT INTO public.weapons (number, title, summary, knowledge, task_prompt, placeholder, updated_at) VALUES
(3, 'دراسة السوق وتقدير حجم الطلب', 'التحقق من جاذبية وحجم السوق المتاح للمشروع.', 'يجب تقدير حجم السوق الكلي المتاح (TAM) والسوق القابل للخدمة (SAM). هل هناك ما يكفي من الزبائن لجعل مشروعك مربحاً وقابلاً للنمو؟', 'قدر عدد الزبائن المحتملين وحجم الطلب المتوقع على منتجك في الجزائر سنوياً.', 'مثال: نصل لحوالي 1500 مطعم في العاصمة كمرحلة أولى، مع حجم سوق إجمالي يقدر بـ 20 مليون دينار جزائري.', now())
ON CONFLICT (number) DO NOTHING;

INSERT INTO public.weapons (number, title, summary, knowledge, task_prompt, placeholder, updated_at) VALUES
(4, 'تحليل المنافسين والميزة التنافسية', 'لماذا سيختارك العميل ويترك الخيارات الأخرى المتاحة؟', 'المنافسة أمر صحي. يجب تحليل البدائل المتاحة لزبونك وإثبات ميزتك التنافسية الحصينة (Unfair Advantage) التي يصعب تقليدها.', 'اذكر أهم منافسين اثنين لك في الجزائر، وما هي الميزة الاستثنائية التي تميزك عنهما؟', 'مثال: المنافس الأول (الوكلاء التقليديون)، المنافس الثاني (سوق الجملة). ميزتنا هي التوصيل الفوري الذكي والأسعار المباشرة.', now())
ON CONFLICT (number) DO NOTHING;

INSERT INTO public.weapons (number, title, summary, knowledge, task_prompt, placeholder, updated_at) VALUES
(5, 'مخطط نموذج العمل التجاري BMC', 'الخريطة الشاملة لكيفية صنع وتقديم واكتساب القيمة.', 'مخطط نموذج العمل التجاري (Business Model Canvas) هو الأداة الأكثر شهرة لرواد الأعمال. يربط بين مصادر التكلفة والإيرادات والأنشطة والشركاء الأساسيين.', 'كيف سيجني مشروعك الأرباح؟ حدد قنوات الإيرادات الأساسية لديك بالتفصيل.', 'مثال: اشتراك شهري للشركات (B2S) + عمولة 5% على الصفقات المكتملة بين الفلاح والمطعم.', now())
ON CONFLICT (number) DO NOTHING;

INSERT INTO public.weapons (number, title, summary, knowledge, task_prompt, placeholder, updated_at) VALUES
(6, 'بناء الهوية البصرية والرسالة التجارية', 'رسم شخصية العلامة التجارية وزرع الثقة في الزبائن.', 'الهوية البصرية ليست مجرد ألوان وشعار، بل هي الوعد والرسالة التي يقرأها العميل بمجرد التفاعل معك. ألوان المسرعة (الأخضر والذهبي) تعكس الاستدامة والازدهار المالي، فماذا تعكس ألوانك؟', 'ما هي الألوان الأساسية لعلامتك التجارية؟ وما هي الرسالة العاطفية التي يوصلها شعارك؟', 'مثال: نعتمد الأزرق الداكن للأمان، والبرتقالي للحيوية. رسالتنا هي: التوريد الموثوق بنقرة زر واحدة.', now())
ON CONFLICT (number) DO NOTHING;

INSERT INTO public.weapons (number, title, summary, knowledge, task_prompt, placeholder, updated_at) VALUES
(7, 'تحديد القيمة المقترحة الفريدة UVP', 'الجملة السحرية التي تلخص المشكلة والحل والميزة التنافسية.', 'القيمة المقترحة الفريدة (Unique Value Proposition) هي إجابتك الحاسمة على سؤال العميل: لماذا أشتري منك أنت بالذات ولا أشتري من غيرك؟', 'اكتب القيمة المقترحة الفريدة (UVP) لمشروعك في جملة تسويقية واحدة جذابة ومقنعة.', 'مثال: نحن نضمن للمطاعم تزويداً يومياً بالخضروات الطازجة بنصف سعر السوق المعتاد مع توصيل مجاني.', now())
ON CONFLICT (number) DO NOTHING;

INSERT INTO public.weapons (number, title, summary, knowledge, task_prompt, placeholder, updated_at) VALUES
(8, 'بناء النموذج الأولي المبسط MVP', 'تصميم أصغر نسخة وظيفية من منتجك لاختبارها ميدانياً.', 'النموذج الأولي هو السلاح الأقوى لرواد الأعمال. لا تنتظر طويلاً حتى يكتمل المنتج بنسبة 100%، ابدأ بنسخة مبسطة ومصغرة لتفادي إهدار المال والوقت.', 'كيف ستبدو النسخة الأولى التجريبية من منتجك (MVP)؟ وما هي الميزة الوحيدة التي ستعمل بها؟', 'مثال: صفحة هبوط بسيطة على الويب تحتوي على نموذج طلب لصندوق تجريبي واختبار الجدية.', now())
ON CONFLICT (number) DO NOTHING;

INSERT INTO public.weapons (number, title, summary, knowledge, task_prompt, placeholder, updated_at) VALUES
(9, 'التحقق الميداني وتجربة المستخدم', 'جمع آراء الزبائن الحقيقيين بعد تفاعلهم مع النموذج الأولي.', 'بعد إطلاق النموذج الأولي، نذهب فوراً للشارع أو السوق. اجمع تعليقات أول 5 إلى 10 عملاء حقيقيين وحللها لتعديل منتجك وتحسين واجهته وتجربته.', 'ما هي التغذية الراجعة والتعليقات التي حصلت عليها من أول دفعة من الزبائن جربت منتجك؟', 'مثال: أثنى 4 زبائن على سرعة الطلب، لكنهم اشتكوا من عدم توفر خيار الدفع الإلكتروني، لذا سنركز على إضافة خيار دفع محلي.', now())
ON CONFLICT (number) DO NOTHING;

INSERT INTO public.weapons (number, title, summary, knowledge, task_prompt, placeholder, updated_at) VALUES
(10, 'خطة التسويق وجذب الزبائن الجدد', 'تحديد قنوات الوصول وصياغة العروض الفيروسية والمقنعة.', 'التسويق هو المحرك الأساسي للمبيعات. يجب صياغة استراتيجية ممتازة للوصول الرقمي والميداني للزبائن بأقل تكلفة ممكنة لاستحواذ العميل (CAC).', 'ما هي القناة التسويقية الأساسية للوصول لزبائنك؟ واكتب مسودة إعلان مبتكر لمشروعك.', 'مثال: سنركز على التسويق عبر مجموعات فيسبوك المتخصصة وزيارات مباشرة للمطاعم.', now())
ON CONFLICT (number) DO NOTHING;

INSERT INTO public.weapons (number, title, summary, knowledge, task_prompt, placeholder, updated_at) VALUES
(11, 'هيكل التكاليف التأسيسية والتشغيلية', 'معرفة وحساب أين ستنفق كل دينار جزائري في مشروعك.', 'المالية هي عصب استدامة الشركات الناشئة الجامعية (القرار 1275). يجب تصنيف التكاليف التأسيسية (CapEx) والتكاليف التشغيلية الشهرية (OpEx).', 'ما هي التكاليف الأساسية لبدء مشروعك والتشغيل لأول 3 أشهر؟ اذكر القيمة بالدينار الجزائري.', 'مثال: أجهزة وتطوير منصة (200,000 دج)، تسويق وإعلانات (50,000 دج)، لوجستيات وتوزيع (100,000 دج).', now())
ON CONFLICT (number) DO NOTHING;

INSERT INTO public.weapons (number, title, summary, knowledge, task_prompt, placeholder, updated_at) VALUES
(12, 'تنويع مصادر الإيرادات وتطوير المبيعات', 'تأمين تدفقات نقدية متعددة لضمان بقاء ونمو المؤسسة.', 'الاعتماد على مصدر دخل واحد قد يكون مخاطرة. رواد الأعمال الناجحون يصممون مصادر ثانوية ومبتكرة للإيرادات لتعزيز الأرباح الصافية.', 'حدد مصدرين مختلفين ومكملين للإيرادات سيحققهما مشروعك عند التوسع والاستقرار.', 'مثال: 1. مبيعات مباشرة بهامش ربح. 2. باقة إعلانات مدفوعة للموردين الكبار.', now())
ON CONFLICT (number) DO NOTHING;

INSERT INTO public.weapons (number, title, summary, knowledge, task_prompt, placeholder, updated_at) VALUES
(13, 'تشكيل الفريق الأساسي وتوزيع الأدوار', 'تجميع الكفاءات وتقاسم المهام لتحويل الفكرة إلى واقع.', 'المستثمرون ولجان التقييم الجامعية يستثمرون في الفريق أولاً. فريق متكامل يغطي الجوانب التقنية، التسويقية، والمالية هو القوة الحقيقية لأي شركة ناشئة.', 'اذكر أسماء أعضاء فريقك الأساسيين (أو التخصصات المطلوبة) والمسؤولية الكبرى لكل منهم.', 'مثال: عضو 1 (ريادي وإدارة عامة)، عضو 2 (مطور تقني)، عضو 3 (تسويق ومبيعات).', now())
ON CONFLICT (number) DO NOTHING;

INSERT INTO public.weapons (number, title, summary, knowledge, task_prompt, placeholder, updated_at) VALUES
(14, 'الجوانب القانونية والقرار الوزاري 1275', 'الحصول على وسم مؤسسة ناشئة وتسجيل براءة الاختراع.', 'القرار الوزاري 1275 في الجزائر يوفر إطاراً استثنائياً. نساعدك في التحضير لتقديم الملف للجنة الوطنية لمنح وسم مؤسسة ناشئة والاستفادة من الإعفاءات الضريبية.', 'ما هي خطتك للحصول على وسم مؤسسة ناشئة؟ وما هي الأصول الفكرية التي تريد حمايتها؟', 'مثال: سنقدم طلب الوسم عبر بوابة startup.dz بمجرد إنهاء النموذج الأولي، وسنسجل العلامة التجارية.', now())
ON CONFLICT (number) DO NOTHING;

INSERT INTO public.weapons (number, title, summary, knowledge, task_prompt, placeholder, updated_at) VALUES
(15, 'استراتيجية التوسع والنمو السريع', 'كيف سينتقل مشروعك من ولايتك إلى القطر الوطني ثم الدولي؟', 'المؤسسات الناشئة تمتاز بقابلية التوسع السريع (Scalability). كيف تخطط للتوسع الجغرافي وبناء شراكات استراتيجية لزيادة استحواذ العميل (CAC).', 'صف خطة توسع مشروعك في ولايات جزائرية أخرى أو دول مجاورة خلال أول سنتين.', 'مثال: نبدأ بالجزائر العاصمة والبليدة في السنة الأولى، ثم نتوسع لوهران وقسنطينة وسطيف في السنة الثانية.', now())
ON CONFLICT (number) DO NOTHING;

INSERT INTO public.weapons (number, title, summary, knowledge, task_prompt, placeholder, updated_at) VALUES
(16, 'العرض التقديمي النهائي Pitch Deck', 'صياغة العرض الساحر لإقناع لجنة مناقشة التخرج والمستثمرين.', 'السلاح الأخير والمحسم! العرض التقديمي هو فرصتك الذهبية لتلخيص رحلتك الطويلة عبر 15 سلاحاً في عرض مقنع من 5 إلى 7 دقائق أمام اللجنة الأكاديمية والمستثمرين.', 'اكتب الشعار الختامي القوي أو الجملة المؤثرة التي ستنهي بها عرضك أمام لجنة التحكيم الجامعية.', 'مثال: من الفكرة إلى التنفيذ، واليوم نحن هنا لنقود التحول الرقمي. شكراً لكم!', now())
ON CONFLICT (number) DO NOTHING;

-- ============================================
-- DONE!
-- After running this, update Vercel env vars:
-- NEXT_PUBLIC_SUPABASE_URL
-- NEXT_PUBLIC_SUPABASE_ANON_KEY
-- ============================================
