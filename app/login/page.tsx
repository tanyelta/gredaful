import { GlassCard } from "@/components/glass-card";
import { GoldenBackground } from "@/components/golden-background";
import { LoginForm } from "@/components/login-form";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export default async function LoginPage() {
  const { isConfigured } = getSupabaseConfig();
  const supabase = await createClient();
  await supabase.auth.signOut();

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-10">
      <GoldenBackground />
      <div className="mb-8 px-2">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.32em] text-amber-800/55">GREDAFUL</p>
        <h1 className="text-5xl font-semibold tracking-[-0.06em] text-stone-950">
          Ein neuer Tag zum festhalten, <span className="gold-text">Ömrüm.</span>
        </h1>
        <p className="mt-4 text-base leading-7 text-stone-700/75">
          Hayatım, das ist unser privater Ort, an dem wir jeden Abend unsere Momente festhalten. Dies wird
          unsere Bibliothek, auf die wir in Zukunft zurückblicken. Seni çok seviyorum güzel kadınım ♥️
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
