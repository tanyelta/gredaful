"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { requireProfile, requireUser, getProfile } from "@/lib/app-data";
import { getTodayISO } from "@/lib/dates";

export type ActionState = {
  message?: string;
  error?: string;
};

function readText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function signInWithEmail(_: ActionState, formData: FormData): Promise<ActionState> {
  const { isConfigured } = getSupabaseConfig();
  const email = readText(formData, "email");

  if (!isConfigured) {
    return { error: "Supabase ist noch nicht konfiguriert. Bitte Env-Variablen setzen." };
  }

  if (!email) {
    return { error: "Bitte gib deine E-Mail-Adresse ein." };
  }

  const headerStore = await headers();
  const origin = headerStore.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { message: "Login-Link versendet. Öffne ihn auf diesem Gerät." };
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
  const entryDate = readText(formData, "entryDate") || getTodayISO();

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

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
