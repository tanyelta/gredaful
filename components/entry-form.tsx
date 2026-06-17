import { saveDailyEntry } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { TimeZoneInput } from "@/components/time-zone-input";

type EntryFormProps = {
  entryDate: string;
  highlight?: string;
  blessing?: string;
};

export function EntryForm({ entryDate, highlight = "", blessing = "" }: EntryFormProps) {
  return (
    <form action={saveDailyEntry} className="flex flex-col gap-4">
      <input type="hidden" name="entryDate" value={entryDate} />
      <TimeZoneInput />
      <label className="flex flex-col gap-2 text-sm font-semibold text-stone-800">
        Mein Highlight
        <textarea
          required
          name="highlight"
          defaultValue={highlight}
          rows={4}
          maxLength={1200}
          placeholder="Was war heute der schönste Moment?"
          className="resize-none rounded-3xl border border-white/70 bg-white/60 px-4 py-4 text-base leading-7 outline-none backdrop-blur-xl transition placeholder:text-stone-400 focus:border-amber-300 focus:ring-4 focus:ring-amber-200/40"
        />
      </label>
      <label className="flex flex-col gap-2 text-sm font-semibold text-stone-800">
        Mein Blessing
        <textarea
          required
          name="blessing"
          defaultValue={blessing}
          rows={4}
          maxLength={1200}
          placeholder="Wofür bist du heute dankbar?"
          className="resize-none rounded-3xl border border-white/70 bg-white/60 px-4 py-4 text-base leading-7 outline-none backdrop-blur-xl transition placeholder:text-stone-400 focus:border-amber-300 focus:ring-4 focus:ring-amber-200/40"
        />
      </label>
      <SubmitButton pendingLabel="Bewahre Moment ...">
        {highlight || blessing ? "Eintrag aktualisieren" : "Moment bewahren"}
      </SubmitButton>
    </form>
  );
}
