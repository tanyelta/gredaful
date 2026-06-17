import { Shuffle, Star } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { DeleteEntryButton } from "@/components/delete-entry-button";
import { FavoriteButton } from "@/components/favorite-button";
import { GlassCard } from "@/components/glass-card";
import { formatDateLabel } from "@/lib/dates";
import { getMemoryData } from "@/lib/app-data";

export default async function MemoriesPage() {
  const { profile, favorites, memory } = await getMemoryData();

  return (
    <AppShell title="Momente" subtitle="Eure goldenen Erinnerungen, wenn ihr sie wieder braucht.">
      <GlassCard className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100/80 text-amber-800">
            <Shuffle size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-800/50">Erinnerung</p>
            <h2 className="text-xl font-semibold tracking-[-0.03em] text-stone-950">Ein schöner Blick zurück</h2>
          </div>
        </div>
        {memory ? (
          <article className="rounded-3xl bg-white/48 p-4 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-amber-900">{formatDateLabel(memory.entry_date)}</p>
            <div className="space-y-3 text-sm leading-6 text-stone-700">
              <p>
                <span className="font-semibold text-stone-950">{memory.profiles?.display_name ?? "Ein Herz"}:</span>{" "}
                {memory.highlight}
              </p>
              <p>{memory.blessing}</p>
            </div>
          </article>
        ) : (
          <p className="text-sm leading-6 text-stone-700">
            Sobald ihr erste Einträge speichert, erscheint hier eine zufällige Erinnerung.
          </p>
        )}
      </GlassCard>

      <GlassCard className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100/80 text-amber-800">
            <Star size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-800/50">Favoriten</p>
            <h2 className="text-xl font-semibold tracking-[-0.03em] text-stone-950">Lieblingsmomente</h2>
          </div>
        </div>
        <div className="space-y-3">
          {favorites.map((entry) => (
            <article key={entry.id} className="rounded-3xl bg-white/48 p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-stone-950">
                    {entry.profiles?.display_name ?? "Ein Herz"}
                  </p>
                  <p className="text-xs text-stone-500">{formatDateLabel(entry.entry_date)}</p>
                </div>
                {entry.user_id === profile.id ? (
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
          ))}
          {favorites.length === 0 ? (
            <p className="text-sm leading-6 text-stone-700">
              Markiere eigene Einträge mit dem Herz, damit sie hier gesammelt werden.
            </p>
          ) : null}
        </div>
      </GlassCard>
    </AppShell>
  );
}
