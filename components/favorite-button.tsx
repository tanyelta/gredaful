import { Heart } from "lucide-react";
import { toggleFavorite } from "@/app/actions";

type FavoriteButtonProps = {
  entryId: string;
  isFavorite: boolean;
};

export function FavoriteButton({ entryId, isFavorite }: FavoriteButtonProps) {
  return (
    <form action={toggleFavorite}>
      <input type="hidden" name="entryId" value={entryId} />
      <input type="hidden" name="isFavorite" value={String(isFavorite)} />
      <button
        type="submit"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/55 text-amber-800 shadow-sm transition hover:bg-white/80"
        aria-label={isFavorite ? "Aus Lieblingsmomenten entfernen" : "Als Lieblingsmoment markieren"}
      >
        <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
      </button>
    </form>
  );
}
