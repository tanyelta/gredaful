import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { GlassCard } from "@/components/glass-card";
import { SetupForm } from "@/components/setup-form";
import { getProfile, requireUser } from "@/lib/app-data";

export default async function SetupPage() {
  const user = await requireUser();
  const profile = await getProfile(user.id);

  if (profile?.couple_id) {
    redirect("/today");
  }

  return (
    <AppShell title="Einrichten" subtitle="Erstellt euren privaten Paarraum oder tretet mit eurem gemeinsamen Code bei.">
      <GlassCard>
        <SetupForm />
      </GlassCard>
    </AppShell>
  );
}
