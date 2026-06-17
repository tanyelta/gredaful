import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTodayISO } from "@/lib/dates";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function getProfile(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, couple_id, display_name")
    .eq("id", userId)
    .maybeSingle();

  return data;
}

export async function requireProfile() {
  const user = await requireUser();
  const profile = await getProfile(user.id);

  if (!profile?.couple_id) {
    redirect("/setup");
  }

  return { user, profile: { ...profile, couple_id: profile.couple_id } };
}

export async function getTodayRitual() {
  const { profile } = await requireProfile();
  const supabase = await createClient();
  const today = getTodayISO();

  const { data: entries } = await supabase
    .from("daily_entries")
    .select("*, profiles(display_name)")
    .eq("couple_id", profile.couple_id)
    .eq("entry_date", today)
    .order("created_at", { ascending: true });

  return {
    today,
    profile,
    entries: entries ?? [],
    ownEntry: entries?.find((entry) => entry.user_id === profile.id) ?? null,
  };
}

export async function getHistoryEntries() {
  const { profile } = await requireProfile();
  const supabase = await createClient();

  const { data } = await supabase
    .from("daily_entries")
    .select("*, profiles(display_name)")
    .eq("couple_id", profile.couple_id)
    .order("entry_date", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(80);

  return { profile, entries: data ?? [] };
}

export async function getFavoriteEntries() {
  const { profile } = await requireProfile();
  const supabase = await createClient();

  const { data } = await supabase
    .from("daily_entries")
    .select("*, profiles(display_name)")
    .eq("couple_id", profile.couple_id)
    .eq("is_favorite", true)
    .order("entry_date", { ascending: false })
    .limit(40);

  return { profile, entries: data ?? [] };
}

export async function getMemoryData() {
  const { profile } = await requireProfile();
  const supabase = await createClient();

  const [{ data: favorites }, { data: recent }] = await Promise.all([
    supabase
      .from("daily_entries")
      .select("*, profiles(display_name)")
      .eq("couple_id", profile.couple_id)
      .eq("is_favorite", true)
      .order("entry_date", { ascending: false })
      .limit(40),
    supabase
      .from("daily_entries")
      .select("*, profiles(display_name)")
      .eq("couple_id", profile.couple_id)
      .order("entry_date", { ascending: false })
      .limit(80),
  ]);

  const source = favorites?.length ? favorites : recent ?? [];
  const memory = source.length ? source[Math.floor(Math.random() * source.length)] : null;

  return {
    profile,
    favorites: favorites ?? [],
    memory,
  };
}
