import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { isAllowedAuthEmail } from "@/lib/auth-users";
import { FALLBACK_TIME_ZONE, getTodayISO } from "@/lib/dates";

export async function getUserTimeZone() {
  const cookieStore = await cookies();
  return cookieStore.get("gredaful-time-zone")?.value ?? FALLBACK_TIME_ZONE;
}

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

  if (!isAllowedAuthEmail(user.email)) {
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
  const today = getTodayISO(await getUserTimeZone());

  const { data: todayEntries } = await supabase
    .from("daily_entries")
    .select("*, profiles(display_name)")
    .eq("couple_id", profile.couple_id)
    .eq("entry_date", today)
    .order("created_at", { ascending: true });

  const { data: latestPreviousEntry } = await supabase
    .from("daily_entries")
    .select("entry_date")
    .eq("couple_id", profile.couple_id)
    .lt("entry_date", today)
    .order("entry_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  const lastEveningDate = latestPreviousEntry?.entry_date ?? null;
  const { data: lastEveningEntries } = lastEveningDate
    ? await supabase
        .from("daily_entries")
        .select("*, profiles(display_name)")
        .eq("couple_id", profile.couple_id)
        .eq("entry_date", lastEveningDate)
        .order("created_at", { ascending: true })
    : { data: [] };

  return {
    today,
    profile,
    lastEveningDate,
    lastEveningEntries: lastEveningEntries ?? [],
    todayEntries: todayEntries ?? [],
    ownEntry: todayEntries?.find((entry) => entry.user_id === profile.id) ?? null,
  };
}

export async function getHistoryEntries() {
  const { profile } = await requireProfile();
  const supabase = await createClient();

  const today = getTodayISO(await getUserTimeZone());
  const { data: latestPreviousEntry } = await supabase
    .from("daily_entries")
    .select("entry_date")
    .eq("couple_id", profile.couple_id)
    .lt("entry_date", today)
    .order("entry_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  let query = supabase
    .from("daily_entries")
    .select("*, profiles(display_name)")
    .eq("couple_id", profile.couple_id)
    .lt("entry_date", today)
    .order("entry_date", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(80);

  if (latestPreviousEntry?.entry_date) {
    query = query.neq("entry_date", latestPreviousEntry.entry_date);
  }

  const { data } = await query;

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
