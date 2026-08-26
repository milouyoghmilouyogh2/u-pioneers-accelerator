-- Auto-create profile + startup when user's email is confirmed
-- This replaces the admin.createUser() bypass in signUpAction

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, university, major, whatsapp, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'university', ''),
    COALESCE(NEW.raw_user_meta_data->>'major', ''),
    COALESCE(NEW.raw_user_meta_data->>'whatsapp', ''),
    'student'
  );
  INSERT INTO public.startups (owner_id, project_title)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'project_title', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fire on user creation (which happens at signUp, not at confirmation)
-- The profile/startup will be created with the metadata from signUp
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
