"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { requireProfile, requireUser, getProfile } from "@/lib/app-data";
import { getAuthUser } from "@/lib/auth-users";
import { FALLBACK_TIME_ZONE, getTodayISO } from "@/lib/dates";

export type ActionState = {
  message?: string;
  error?: string;
};

function readText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function signInWithPassword(_: ActionState, formData: FormData): Promise<ActionState> {
  const { isConfigured } = getSupabaseConfig();
  const username = readText(formData, "username").toLowerCase();
  const password = readText(formData, "password");
  const authUser = getAuthUser(username);

  if (!isConfigured) {
    return { error: "Supabase ist noch nicht konfiguriert. Bitte Env-Variablen setzen." };
  }

  if (!authUser || !password) {
    return { error: "Bitte gib Benutzername und Passwort ein." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: authUser.email,
    password,
  });

  if (error) {
    return { error: "Benutzername oder Passwort ist falsch." };
  }

  const { error: setupError } = await supabase.rpc("ensure_gredaful_profile", {
    profile_name: authUser.displayName,
  });

  if (setupError) {
    return { error: setupError.message };
  }

  revalidatePath("/", "layout");
  redirect("/today");
}

export async function setupCouple(_: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const supabase = await createClient();
  const mode = readText(formData, "mode");
  const profileName = readText(formData, "profileName");
  const inviteCode = readText(formData, "inviteCode").toLowerCase();
  const coupleName = readText(formData, "coupleName") || "Unser Abendritual";

  if (!profileName) {
    return { error: "Bitte gib deinen Namen ein." };
  }

  const existingProfile = await getProfile(user.id);
  if (existingProfile?.couple_id) {
    redirect("/today");
  }

  const { error } =
    mode === "join"
      ? await supabase.rpc("join_couple_by_code", {
          code: inviteCode,
          profile_name: profileName,
        })
      : await supabase.rpc("create_couple_for_current_user", {
          couple_name: coupleName,
          profile_name: profileName,
          code: inviteCode || "gredaful",
        });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/today");
}

export async function saveDailyEntry(formData: FormData) {
  const { user, profile } = await requireProfile();
  const supabase = await createClient();
  const highlight = readText(formData, "highlight");
  const blessing = readText(formData, "blessing");
  const cookieStore = await cookies();
  const timeZone = readText(formData, "timeZone") || cookieStore.get("gredaful-time-zone")?.value || FALLBACK_TIME_ZONE;
  const entryDate = readText(formData, "entryDate") || getTodayISO(timeZone);

  if (!highlight || !blessing) {
    redirect("/today?error=missing-entry");
  }

  await supabase.from("daily_entries").upsert(
    {
      couple_id: profile.couple_id,
      user_id: user.id,
      entry_date: entryDate,
      highlight,
      blessing,
    },
    { onConflict: "user_id,entry_date" },
  );

  revalidatePath("/today");
  revalidatePath("/history");
  redirect("/today?saved=1");
}

export async function toggleFavorite(formData: FormData) {
  const { user } = await requireProfile();
  const supabase = await createClient();
  const entryId = readText(formData, "entryId");
  const isFavorite = readText(formData, "isFavorite") === "true";

  if (entryId) {
    await supabase
      .from("daily_entries")
      .update({ is_favorite: !isFavorite })
      .eq("id", entryId)
      .eq("user_id", user.id);
  }

  revalidatePath("/today");
  revalidatePath("/history");
  revalidatePath("/memories");
}

export async function deleteEntry(formData: FormData) {
  const { user } = await requireProfile();
  const supabase = await createClient();
  const entryId = readText(formData, "entryId");

  if (entryId) {
    await supabase.from("daily_entries").delete().eq("id", entryId).eq("user_id", user.id);
  }

  revalidatePath("/today");
  revalidatePath("/history");
  revalidatePath("/memories");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
