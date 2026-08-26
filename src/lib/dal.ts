import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const getUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export const requireUser = cache(async () => {
  const user = await getUser();
  if (!user) redirect("/login");
  return user;
});

export const getProfile = cache(async () => {
  const user = await requireUser();
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  if (!data) redirect("/login");
  return data;
});

export const requireAdmin = cache(async () => {
  const profile = await getProfile();
  if (profile.role !== "admin") redirect("/dashboard");
  return profile;
});

export const getStartup = cache(async () => {
  const user = await requireUser();
  const supabase = await createClient();
  const { data } = await supabase
    .from("startups")
    .select("*")
    .eq("owner_id", user.id)
    .single();
  if (!data) redirect("/login");
  return data;
});

export const getAnswers = cache(async (startupId: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("startup_answers")
    .select("weapon_number, answer")
    .eq("startup_id", startupId);
  return data ?? [];
});

export const getWeapons = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("weapons")
    .select("*")
    .order("number", { ascending: true });
  if (error) console.error("getWeapons failed:", error.message);
  return data ?? [];
});

export const getSetting = cache(async (key: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("settings")
    .select("value")
    .eq("key", key)
    .single();
  if (error) console.error(`getSetting(${key}) failed:`, error.message);
  return data?.value ?? null;
});
