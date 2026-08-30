-- Team members table for About Us page
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team member social links
CREATE TABLE IF NOT EXISTS team_member_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_member_id UUID NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_member_links ENABLE ROW LEVEL SECURITY;

-- Anyone can read active team members
CREATE POLICY "Anyone can read active team members" ON team_members
  FOR SELECT USING (is_active = true);

-- Admins can manage team members
CREATE POLICY "Admins can manage team members" ON team_members
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Anyone can read team member links
CREATE POLICY "Anyone can read team member links" ON team_member_links
  FOR SELECT USING (true);

-- Admins can manage team member links
CREATE POLICY "Admins can manage team member links" ON team_member_links
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Insert default founder
INSERT INTO team_members (name, role, description, sort_order) VALUES
  ('هيثم مواقي', 'المؤسس والمدير التنفيذي', 'رائد أعمال جزائري، خريج جامعة أم البواقي. بدأ رحلته الريادية مع طلاب لتحويل أفكارهم إلى مشاريع حقيقية متوافقة مع القرار الوزاري 1275.', 1);

-- Insert default links for founder
INSERT INTO team_member_links (team_member_id, platform, url, sort_order)
SELECT id, 'linkedin', '#', 1 FROM team_members WHERE name = 'هيثم مواقي';
INSERT INTO team_member_links (team_member_id, platform, url, sort_order)
SELECT id, 'facebook', '#', 2 FROM team_members WHERE name = 'هيثم مواقي';
INSERT INTO team_member_links (team_member_id, platform, url, sort_order)
SELECT id, 'whatsapp', '#', 3 FROM team_members WHERE name = 'هيثم مواقي';
INSERT INTO team_member_links (team_member_id, platform, url, sort_order)
SELECT id, 'email', '#', 4 FROM team_members WHERE name = 'هيثم مواقي';
