-- ============================================
-- U-Pioneers FULL RESET
-- DELETE ALL OLD QUERIES, PASTE ONLY THIS ONE
-- ============================================

-- Drop everything first
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

-- Now create everything fresh

-- PROFILES
CREATE TABLE public.profiles (
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
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name)
    VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', ''));
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- STARTUPS
CREATE TABLE public.startups (
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
CREATE POLICY "Users can view own startups" ON public.startups FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can create own startups" ON public.startups FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own startups" ON public.startups FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete own startups" ON public.startups FOR DELETE USING (auth.uid() = owner_id);

-- STARTUP ANSWERS
CREATE TABLE public.startup_answers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    startup_id UUID REFERENCES public.startups(id) ON DELETE CASCADE NOT NULL,
    weapon_number INTEGER NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.startup_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own startup answers" ON public.startup_answers FOR SELECT USING (EXISTS (SELECT 1 FROM public.startups WHERE startups.id = startup_answers.startup_id AND startups.owner_id = auth.uid()));
CREATE POLICY "Users can create own startup answers" ON public.startup_answers FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.startups WHERE startups.id = startup_answers.startup_id AND startups.owner_id = auth.uid()));
CREATE POLICY "Users can update own startup answers" ON public.startup_answers FOR UPDATE USING (EXISTS (SELECT 1 FROM public.startups WHERE startups.id = startup_answers.startup_id AND startups.owner_id = auth.uid()));

-- WEAPONS
CREATE TABLE public.weapons (
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

-- SUPPORT TICKETS
CREATE TABLE public.support_tickets (
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
CREATE POLICY "Users can view own tickets" ON public.support_tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create tickets" ON public.support_tickets FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- PAYMENT REQUESTS
CREATE TABLE public.payment_requests (
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
CREATE POLICY "Users can view own payment requests" ON public.payment_requests FOR SELECT USING (EXISTS (SELECT 1 FROM public.startups WHERE startups.id = payment_requests.startup_id AND startups.owner_id = auth.uid()));
CREATE POLICY "Users can create own payment requests" ON public.payment_requests FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.startups WHERE startups.id = payment_requests.startup_id AND startups.owner_id = auth.uid()));

-- SETTINGS
CREATE TABLE public.settings (
    key TEXT NOT NULL PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view settings" ON public.settings FOR SELECT USING (true);

-- LEADERBOARD VIEW
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT p.id, p.full_name, p.university, s.project_title, s.current_step, s.progress_percentage, s.is_premium
FROM public.profiles p JOIN public.startups s ON p.id = s.owner_id;

-- STORAGE
INSERT INTO storage.buckets (id, name, public) VALUES ('receipts', 'receipts', false) ON CONFLICT (id) DO NOTHING;

-- INDEXES
CREATE INDEX idx_startups_owner_id ON public.startups(owner_id);
CREATE INDEX idx_startup_answers_startup_id ON public.startup_answers(startup_id);
CREATE INDEX idx_support_tickets_user_id ON public.support_tickets(user_id);
CREATE INDEX idx_payment_requests_startup_id ON public.payment_requests(startup_id);

-- GRANTS
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;

-- WEAPONS DATA
INSERT INTO public.weapons (number, title, summary, knowledge, task_prompt, placeholder, updated_at) VALUES
(1, 'فكرة المشروع والقيمة المبتكرة', 'بذرة الابتكار وتحديد القيمة الاقتصادية الأولية للمشروع.', 'السلاح الأول يركز على تبلور الفكرة وتحديد المشكلة الحقيقية التي تحلها في السوق الجزائري.', 'اكتب فكرة مشروعك الناشئ في سطر واحد بوضوح، مع تحديد المشكلة الأساسية التي يعالجها منتجك.', 'مثال: منصة رقمية تربط الفلاحين الجزائريين مباشرة بالمستهلك لتقليل الهدر وزيادة الأرباح.', now()) ON CONFLICT (number) DO NOTHING;

INSERT INTO public.weapons (number, title, summary, knowledge, task_prompt, placeholder, updated_at) VALUES
(2, 'تحديد ودراسة العميل المستهدف', 'تحديد الفئة الدقيقة التي ستقبل على شراء منتجك.', 'الزبون هو شريان الحياة لأي مؤسسة اقتصادية. في هذا السلاح، نقوم بتفكيك شرائح السوق لتحديد زبونك المثالي.', 'من هو زبونك الأول والأساسي في السوق الجزائري؟ حدد شريحته واحتياجاته بوضوح.', 'مثال: أصحاب المطاعم ومحلات الأغذية الطازجة في ولاية الجزائر العاصمة.', now()) ON CONFLICT (number) DO NOTHING;

INSERT INTO public.weapons (number, title, summary, knowledge, task_prompt, placeholder, updated_at) VALUES
(3, 'دراسة السوق وتقدير حجم الطلب', 'التحقق من جاذبية وحجم السوق المتاح للمشروع.', 'يجب تقدير حجم السوق الكلي المتاح (TAM) والسوق القابل للخدمة (SAM).', 'قدر عدد الزبائن المحتملين وحجم الطلب المتوقع على منتجك في الجزائر سنوياً.', 'مثال: نصل لحوالي 1500 مطعم في العاصمة كمرحلة أولى.', now()) ON CONFLICT (number) DO NOTHING;

INSERT INTO public.weapons (number, title, summary, knowledge, task_prompt, placeholder, updated_at) VALUES
(4, 'تحليل المنافسين والميزة التنافسية', 'لماذا سيختارك العميل ويترك الخيارات الأخرى المتاحة؟', 'المنافسة أمر صحي. يجب تحليل البدائل المتاحة لزبونك وإثبات ميزتك التنافسية الحصينة.', 'اذكر أهم منافسين اثنين لك في الجزائر، وما هي الميزة الاستثنائية التي تميزك عنهما؟', 'مثال: المنافس الأول (الوكلاء التقليديون)، المنافس الثاني (سوق الجملة).', now()) ON CONFLICT (number) DO NOTHING;

INSERT INTO public.weapons (number, title, summary, knowledge, task_prompt, placeholder, updated_at) VALUES
(5, 'مخطط نموذج العمل التجاري BMC', 'الخريطة الشاملة لكيفية صنع وتقديم واكتساب القيمة.', 'مخطط نموذج العمل التجاري يربط بين مصادر التكلفة والإيرادات والأنشطة والشركاء الأساسيين.', 'كيف سيجني مشروعك الأرباح؟ حدد قنوات الإيرادات الأساسية لديك بالتفصيل.', 'مثال: اشتراك شهري للشركات + عمولة 5% على الصفقات المكتملة.', now()) ON CONFLICT (number) DO NOTHING;

INSERT INTO public.weapons (number, title, summary, knowledge, task_prompt, placeholder, updated_at) VALUES
(6, 'بناء الهوية البصرية والرسالة التجارية', 'رسم شخصية العلامة التجارية وزرع الثقة في الزبائن.', 'الهوية البصرية هي الوعد والرسالة التي يقرأها العميل بمجرد التفاعل معك.', 'ما هي الألوان الأساسية لعلامتك التجارية؟ وما هي الرسالة العاطفية التي يوصلها شعارك؟', 'مثال: نعتمد الأزرق الداكن للأمان، والبرتقالي للحيوية.', now()) ON CONFLICT (number) DO NOTHING;

INSERT INTO public.weapons (number, title, summary, knowledge, task_prompt, placeholder, updated_at) VALUES
(7, 'تحديد القيمة المقترحة الفريدة UVP', 'الجملة السحرية التي تلخص المشكلة والحل والميزة التنافسية.', 'القيمة المقترحة الفريدة هي إجابتك الحاسمة على سؤال العميل: لماذا أشتري منك أنت؟', 'اكتب القيمة المقترحة الفريدة (UVP) لمشروعك في جملة تسويقية واحدة.', 'مثال: نحن نضمن للمطاعم تزويداً يومياً بالخضروات الطازجة بنصف سعر السوق.', now()) ON CONFLICT (number) DO NOTHING;

INSERT INTO public.weapons (number, title, summary, knowledge, task_prompt, placeholder, updated_at) VALUES
(8, 'بناء النموذج الأولي المبسط MVP', 'تصميم أصغر نسخة وظيفية من منتجك لاختبارها ميدانياً.', 'النموذج الأولي هو السلاح الأقوى لرواد الأعمال. ابدأ بنسخة مبسطة ومصغرة.', 'كيف ستبدو النسخة الأولى التجريبية من منتجك (MVP)؟', 'مثال: صفحة هبوط بسيطة على الويب تحتوي على نموذج طلب.', now()) ON CONFLICT (number) DO NOTHING;

INSERT INTO public.weapons (number, title, summary, knowledge, task_prompt, placeholder, updated_at) VALUES
(9, 'التحقق الميداني وتجربة المستخدم', 'جمع آراء الزبائن الحقيقيين بعد تفاعلهم مع النموذج الأولي.', 'بعد إطلاق النموذج الأولي، اجمع تعليقات أول 5 إلى 10 عملاء حقيقيين وحللها.', 'ما هي التغذية الراجعة التي حصلت عليها من أول دفعة من الزبائن؟', 'مثال: أثنى 4 زبائن على سرعة الطلب، لكنهم اشتكوا من عدم توفر الدفع الإلكتروني.', now()) ON CONFLICT (number) DO NOTHING;

INSERT INTO public.weapons (number, title, summary, knowledge, task_prompt, placeholder, updated_at) VALUES
(10, 'خطة التسويق وجذب الزبائن الجدد', 'تحديد قنوات الوصول وصياغة العروض الفيروسية والمقنعة.', 'التسويق هو المحرك الأساسي للمبيعات. يجب صياغة استراتيجية ممتازة للوصول للزبائن.', 'ما هي القناة التسويقية الأساسية للوصول لزبائنك؟', 'مثال: سنركز على التسويق عبر مجموعات فيسبوك المتخصصة.', now()) ON CONFLICT (number) DO NOTHING;

INSERT INTO public.weapons (number, title, summary, knowledge, task_prompt, placeholder, updated_at) VALUES
(11, 'هيكل التكاليف التأسيسية والتشغيلية', 'معرفة وحساب أين ستنفق كل دينار جزائري في مشروعك.', 'المالية هي عصب استدامة الشركات الناشئة. يجب تصنيف التكاليف التأسيسية والتشغيلية.', 'ما هي التكاليف الأساسية لبدء مشروعك والتشغيل لأول 3 أشهر؟', 'مثال: أجهزة وتطوير منصة (200,000 دج)، تسويق (50,000 دج).', now()) ON CONFLICT (number) DO NOTHING;

INSERT INTO public.weapons (number, title, summary, knowledge, task_prompt, placeholder, updated_at) VALUES
(12, 'تنويع مصادر الإيرادات وتطوير المبيعات', 'تأمين تدفقات نقدية متعددة لضمان بقاء ونمو المؤسسة.', 'الاعتماد على مصدر دخل واحد قد يكون مخاطرة. صمم مصادر ثانوية ومبتكرة للإيرادات.', 'حدد مصدرين مختلفين ومكملين للإيرادات سيحققهما مشروعك.', 'مثال: 1. مبيعات مباشرة. 2. باقة إعلانات مدفوعة للموردين.', now()) ON CONFLICT (number) DO NOTHING;

INSERT INTO public.weapons (number, title, summary, knowledge, task_prompt, placeholder, updated_at) VALUES
(13, 'تشكيل الفريق الأساسي وتوزيع الأدوار', 'تجميع الكفاءات وتقاسم المهام لتحويل الفكرة إلى واقع.', 'المستثمرون يستثمرون في الفريق أولاً. فريق متكامل هو القوة الحقيقية.', 'اذكر أعضاء فريقك الأساسيين والمسؤولية الكبرى لكل منهم.', 'مثال: عضو 1 (ريادي)، عضو 2 (تقني)، عضو 3 (تسويق).', now()) ON CONFLICT (number) DO NOTHING;

INSERT INTO public.weapons (number, title, summary, knowledge, task_prompt, placeholder, updated_at) VALUES
(14, 'الجوانب القانونية والقرار الوزاري 1275', 'الحصول على وسم مؤسسة ناشئة وتسجيل براءة الاختراع.', 'القرار الوزاري 1275 يوفر إطاراً استثنائياً للمؤسسات الناشئة الجامعية.', 'ما هي خطتك للحصول على وسم مؤسسة ناشئة؟', 'مثال: سنقدم طلب الوسم عبر بوابة startup.dz.', now()) ON CONFLICT (number) DO NOTHING;

INSERT INTO public.weapons (number, title, summary, knowledge, task_prompt, placeholder, updated_at) VALUES
(15, 'استراتيجية التوسع والنمو السريع', 'كيف سينتقل مشروعك من ولايتك إلى القطر الوطني ثم الدولي؟', 'المؤسسات الناشئة تمتاز بقابلية التوسع السريع. كيف تخطط للتوسع الجغرافي.', 'صف خطة توسع مشروعك خلال أول سنتين.', 'مثال: نبدأ بالجزائر العاصمة والبليدة، ثم نتوسع لوهران وقسنطينة.', now()) ON CONFLICT (number) DO NOTHING;

INSERT INTO public.weapons (number, title, summary, knowledge, task_prompt, placeholder, updated_at) VALUES
(16, 'العرض التقديمي النهائي Pitch Deck', 'صياغة العرض الساحر لإقناع لجنة مناقشة التخرج والمستثمرين.', 'العرض التقديمي هو فرصتك الذهبية لتلخيص رحلتك في 5 إلى 7 دقائق.', 'اكتب الشعار الختامي الذي ستنهي به عرضك أمام لجنة التحكيم.', 'مثال: من الفكرة إلى التنفيذ، واليوم نحن هنا لنقود التحول الرقمي.', now()) ON CONFLICT (number) DO NOTHING;

-- DONE ✅
