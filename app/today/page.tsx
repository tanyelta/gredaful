import { CheckCircle2, Clock3 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { DeleteEntryButton } from "@/components/delete-entry-button";
import { EntryForm } from "@/components/entry-form";
import { FavoriteButton } from "@/components/favorite-button";
import { GlassCard } from "@/components/glass-card";
import { formatDateLabel } from "@/lib/dates";
import { getTodayRitual } from "@/lib/app-data";

type TodayPageProps = {
  searchParams: Promise<{
    saved?: string;
    error?: string;
  }>;
};

export default async function TodayPage({ searchParams }: TodayPageProps) {
  const params = await searchParams;
  const { today, profile, eveningDate, eveningEntries, ownEntry } = await getTodayRitual();

  return (
    <AppShell title="Heute" subtitle={formatDateLabel(today)}>
      {params.saved ? (
        <div className="rounded-full bg-emerald-50/80 px-4 py-3 text-sm font-semibold text-emerald-800 shadow-sm">
          Euer Moment wurde bewahrt.
        </div>
      ) : null}
      {params.error ? (
        <div className="rounded-full bg-red-50/80 px-4 py-3 text-sm font-semibold text-red-800 shadow-sm">
          Bitte fülle Highlight und Blessing aus.
        </div>
      ) : null}

      <GlassCard>
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-800/50">Dein Ritual</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-stone-950">
              {ownEntry ? "Heute bearbeiten" : "Heute festhalten"}
            </h2>
          </div>
          {ownEntry ? <CheckCircle2 className="text-emerald-600" /> : <Clock3 className="text-amber-700" />}
        </div>
        <EntryForm entryDate={today} highlight={ownEntry?.highlight} blessing={ownEntry?.blessing} />
      </GlassCard>

      <GlassCard className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-800/50">Gemeinsam</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-stone-950">Euer Abendblick</h2>
          {eveningDate ? (
            <p className="mt-1 text-sm text-stone-600">{formatDateLabel(eveningDate)}</p>
          ) : null}
        </div>
        <div className="grid gap-3">
          {eveningEntries.map((entry) => {
            const canFavorite = entry.user_id === profile.id;

            return (
              <article key={entry.id} className="rounded-3xl bg-white/48 p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-stone-950">
                    {entry.profiles?.display_name ?? "Ein Herz"}
                  </p>
                  {canFavorite ? (
                    <div className="flex items-center gap-2">
                      <FavoriteButton entryId={entry.id} isFavorite={entry.is_favorite} />
                      <DeleteEntryButton entryId={entry.id} />
                    </div>
                  ) : null}
                </div>
                <div className="space-y-3 text-sm leading-6 text-stone-700">
                  <p>
                    <span className="font-semibold text-stone-950">Highlight:</span> {entry.highlight}
                  </p>
                  <p>
                    <span className="font-semibold text-stone-950">Blessing:</span> {entry.blessing}
                  </p>
                </div>
              </article>
            );
          })}
          {eveningEntries.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-amber-200/80 bg-white/35 p-4 text-sm leading-6 text-stone-600">
              Sobald einer von euch heute speichert, erscheint der Eintrag hier direkt im gemeinsamen Abendblick.
            </div>
          ) : null}
        </div>
      </GlassCard>
    </AppShell>
  );
}
