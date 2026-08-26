-- ============================================
-- U-Pioneers CLEANUP SQL
-- Run this AFTER the full export to remove personal test data
-- Keeps: Schema, Weapons, Support Tickets structure
-- Removes: Profiles, Startups, Startup Answers, Payment Requests
-- ============================================

-- Remove personal data (order matters due to foreign keys)
DELETE FROM public.payment_requests;
DELETE FROM public.startup_answers;
DELETE FROM public.startups;
DELETE FROM public.profiles;

-- Clear auth users (test accounts)
-- WARNING: This deletes ALL users including test accounts
-- If you want to keep specific admin users, comment this out
DELETE FROM auth.identities;
DELETE FROM auth.sessions;
DELETE FROM auth.refresh_tokens;
DELETE FROM auth.mfa_amr_claims;
DELETE FROM auth.one_time_tokens;
DELETE FROM auth.flow_state;
DELETE FROM auth.users;

-- Reset settings to defaults (optional - keep if you want clean slate)
DELETE FROM public.settings;

-- Verify cleanup
SELECT
    (SELECT COUNT(*) FROM public.profiles) as profiles_count,
    (SELECT COUNT(*) FROM public.startups) as startups_count,
    (SELECT COUNT(*) FROM public.startup_answers) as answers_count,
    (SELECT COUNT(*) FROM public.payment_requests) as payments_count,
    (SELECT COUNT(*) FROM public.weapons) as weapons_count,
    (SELECT COUNT(*) FROM public.support_tickets) as tickets_count;

-- Expected result:
-- profiles: 0
-- startups: 0
-- answers: 0
-- payments: 0
-- weapons: 16 (preserved!)
-- tickets: 0 (structure preserved!)
