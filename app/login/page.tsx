import { redirect } from "next/navigation";
import { GlassCard } from "@/components/glass-card";
import { GoldenBackground } from "@/components/golden-background";
import { LoginForm } from "@/components/login-form";
import { getCurrentUser } from "@/lib/app-data";
import { getSupabaseConfig } from "@/lib/supabase/config";

export default async function LoginPage() {
  const user = await getCurrentUser();
  const { isConfigured } = getSupabaseConfig();

  if (user) {
    redirect("/today");
  }

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-10">
      <GoldenBackground />
      <div className="mb-8 px-2">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.32em] text-amber-800/55">GREDAFUL</p>
        <h1 className="text-5xl font-semibold tracking-[-0.06em] text-stone-950">
          Euer Tag, <span className="gold-text">bewahrt.</span>
        </h1>
        <p className="mt-4 text-base leading-7 text-stone-700/75">
          Ein privater Ort für euer Abendritual: Highlight teilen, Blessing festhalten und dankbar zurückblicken.
        </p>
      </div>
      <GlassCard>
        {isConfigured ? (
          <LoginForm />
        ) : (
          <div className="space-y-3 text-sm leading-6 text-stone-700">
            <p className="font-semibold text-stone-950">Supabase ist noch nicht verbunden.</p>
            <p>
              Lege eine `.env.local` mit `NEXT_PUBLIC_SUPABASE_URL` und `NEXT_PUBLIC_SUPABASE_ANON_KEY` an,
              sobald dein Supabase-Projekt erstellt ist.
            </p>
          </div>
        )}
      </GlassCard>
    </main>
  );
}
