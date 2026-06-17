import { Trash2 } from "lucide-react";
import { deleteEntry } from "@/app/actions";

type DeleteEntryButtonProps = {
  entryId: string;
};

export function DeleteEntryButton({ entryId }: DeleteEntryButtonProps) {
  return (
    <form action={deleteEntry}>
      <input type="hidden" name="entryId" value={entryId} />
      <button
        type="submit"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/55 text-stone-500 shadow-sm transition hover:bg-red-50 hover:text-red-700"
        aria-label="Eintrag löschen"
      >
        <Trash2 size={17} />
      </button>
    </form>
  );
}
