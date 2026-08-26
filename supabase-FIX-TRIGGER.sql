-- Run this in owner's Supabase SQL Editor
-- This fixes the trigger to save all sign-up data to profiles + create startup

-- Drop old trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create new function that saves ALL fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    new_startup_id UUID;
BEGIN
    -- Create profile with all fields from sign-up
    INSERT INTO public.profiles (id, full_name, university, major, whatsapp)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', ''),
        COALESCE(new.raw_user_meta_data->>'university', ''),
        COALESCE(new.raw_user_meta_data->>'major', ''),
        COALESCE(new.raw_user_meta_data->>'whatsapp', '')
    );

    -- Create startup if project_title was provided
    IF new.raw_user_meta_data->>'project_title' IS NOT NULL
       AND new.raw_user_meta_data->>'project_title' != '' THEN
        INSERT INTO public.startups (owner_id, project_title)
        VALUES (new.id, new.raw_user_meta_data->>'project_title');
    END IF;

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
