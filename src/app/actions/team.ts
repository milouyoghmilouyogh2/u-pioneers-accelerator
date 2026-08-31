"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/dal";

export async function getTeamMembers() {
  const supabase = await createClient();
  const { data: members } = await supabase
    .from("team_members")
    .select("*")
    .order("sort_order", { ascending: true });

  if (!members) return [];

  // Get links for each member
  const { data: allLinks } = await supabase
    .from("team_member_links")
    .select("*")
    .order("sort_order", { ascending: true });

  return members.map((m) => ({
    ...m,
    links: allLinks?.filter((l) => l.team_member_id === m.id) || [],
  }));
}

export async function addTeamMember(formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") || "").trim();
  const role = String(formData.get("role") || "").trim();
  const description = String(formData.get("description") || "").trim();

  if (!name || !role) {
    return { error: "الاسم والدور مطلوبان" };
  }

  const supabase = await createClient();

  // Get max sort order
  const { data: maxOrder } = await supabase
    .from("team_members")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();

  const { data: member, error } = await supabase
    .from("team_members")
    .insert({
      name,
      role,
      description: description || null,
      sort_order: (maxOrder?.sort_order || 0) + 1,
    })
    .select()
    .single();

  if (error) return { error: error.message };
  revalidatePath("/admin/settings");
  revalidatePath("/aboutus");
  return { success: true, member };
}

export async function updateTeamMember(memberId: string, formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") || "").trim();
  const role = String(formData.get("role") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const image_url = String(formData.get("image_url") || "").trim() || null;

  if (!name || !role) {
    return { error: "الاسم والدور مطلوبان" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("team_members")
    .update({
      name,
      role,
      description: description || null,
      image_url,
      updated_at: new Date().toISOString(),
    })
    .eq("id", memberId);

  if (error) return { error: error.message };
  revalidatePath("/admin/settings");
  revalidatePath("/aboutus");
  return { success: true };
}

export async function deleteTeamMember(memberId: string) {
  await requireAdmin();

  const supabase = await createClient();
  const { error } = await supabase
    .from("team_members")
    .delete()
    .eq("id", memberId);

  if (error) return { error: error.message };
  revalidatePath("/admin/settings");
  revalidatePath("/aboutus");
  return { success: true };
}

export async function addTeamMemberLink(memberId: string, platform: string, url: string) {
  await requireAdmin();

  if (!platform || !url) {
    return { error: "المنصة والرابط مطلوبان" };
  }

  const supabase = await createClient();

  // Get max sort order for this member
  const { data: maxOrder } = await supabase
    .from("team_member_links")
    .select("sort_order")
    .eq("team_member_id", memberId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();

  const { data: newLink, error } = await supabase
    .from("team_member_links")
    .insert({
      team_member_id: memberId,
      platform,
      url,
      sort_order: (maxOrder?.sort_order || 0) + 1,
    })
    .select()
    .single();

  if (error) return { error: error.message };
  revalidatePath("/admin/settings");
  revalidatePath("/aboutus");
  return { success: true, link: newLink };
}

export async function updateTeamMemberLink(linkId: string, platform: string, url: string) {
  await requireAdmin();

  const supabase = await createClient();
  const { error } = await supabase
    .from("team_member_links")
    .update({ platform, url })
    .eq("id", linkId);

  if (error) return { error: error.message };
  revalidatePath("/admin/settings");
  revalidatePath("/aboutus");
  return { success: true };
}

export async function deleteTeamMemberLink(linkId: string) {
  await requireAdmin();

  const supabase = await createClient();
  const { error } = await supabase
    .from("team_member_links")
    .delete()
    .eq("id", linkId);

  if (error) return { error: error.message };
  revalidatePath("/admin/settings");
  revalidatePath("/aboutus");
  return { success: true };
}
