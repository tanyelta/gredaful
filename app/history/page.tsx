import { AppShell } from "@/components/app-shell";
import { FavoriteButton } from "@/components/favorite-button";
import { GlassCard } from "@/components/glass-card";
import { formatDateLabel } from "@/lib/dates";
import { getHistoryEntries } from "@/lib/app-data";

export default async function HistoryPage() {
  const { profile, entries } = await getHistoryEntries();
  const grouped = entries.reduce<Record<string, typeof entries>>((acc, entry) => {
    acc[entry.entry_date] = acc[entry.entry_date] ?? [];
    acc[entry.entry_date].push(entry);
    return acc;
  }, {});

  return (
    <AppShell title="Historie" subtitle="Blättert durch eure bewahrten Abende und kleinen Dankbarkeiten.">
      {Object.entries(grouped).map(([date, dayEntries]) => (
        <GlassCard key={date} className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-800/50">Rückblick</p>
            <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-stone-950">
              {formatDateLabel(date)}
            </h2>
          </div>
          <div className="space-y-3">
            {dayEntries.map((entry) => (
              <article key={entry.id} className="rounded-3xl bg-white/48 p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-stone-950">
                    {entry.profiles?.display_name ?? "Ein Herz"}
                  </p>
                  {entry.user_id === profile.id ? (
                    <FavoriteButton entryId={entry.id} isFavorite={entry.is_favorite} />
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
            ))}
          </div>
        </GlassCard>
      ))}
      {entries.length === 0 ? (
        <GlassCard>
          <p className="text-sm leading-6 text-stone-700">
            Noch keine Einträge. Euer erster bewahrter Abend erscheint nach dem Speichern hier.
          </p>
        </GlassCard>
      ) : null}
    </AppShell>
  );
}
