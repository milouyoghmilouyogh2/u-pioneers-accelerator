import { createClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/dal";
import { UsersManager } from "./users-manager";

export default async function AdminUsersPage() {
  await requireAdmin();
  const supabase = await createClient();
  const admin = getAdminClient();

  const { data: authUsers } = await admin.auth.admin.listUsers();
  const users = authUsers?.users ?? [];

  // Get profiles for role info
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, role");

  const profileMap = new Map(profiles?.map((p) => [p.id, p.role]) ?? []);

  const enrichedUsers = users.map((u) => ({
    id: u.id,
    email: u.email ?? "—",
    full_name: u.user_metadata?.full_name ?? u.email?.split("@")[0] ?? "—",
    role: profileMap.get(u.id) ?? "student",
    created_at: u.created_at,
  }));

  return <UsersManager users={enrichedUsers} />;
}
