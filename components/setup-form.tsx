"use client";

import { useActionState, useState } from "react";
import { setupCouple, type ActionState } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";

const initialState: ActionState = {};

export function SetupForm() {
  const [mode, setMode] = useState<"create" | "join">("create");
  const [state, formAction] = useActionState(setupCouple, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="mode" value={mode} />
      <div className="grid grid-cols-2 rounded-full bg-white/45 p-1">
        {(["create", "join"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setMode(item)}
            className={`min-h-11 rounded-full text-sm font-semibold transition ${
              mode === item ? "bg-white text-amber-900 shadow-sm" : "text-stone-600"
            }`}
          >
            {item === "create" ? "Starten" : "Beitreten"}
          </button>
        ))}
      </div>
      <label className="flex flex-col gap-2 text-sm font-medium text-stone-800">
        Dein Name
        <input
          required
          name="profileName"
          placeholder="z. B. Tan"
          className="min-h-14 rounded-2xl border border-white/70 bg-white/60 px-4 text-base outline-none backdrop-blur-xl transition placeholder:text-stone-400 focus:border-amber-300 focus:ring-4 focus:ring-amber-200/40"
        />
      </label>
      {mode === "create" ? (
        <label className="flex flex-col gap-2 text-sm font-medium text-stone-800">
          Name eures Rituals
          <input
            name="coupleName"
            defaultValue="Unser Abendritual"
            className="min-h-14 rounded-2xl border border-white/70 bg-white/60 px-4 text-base outline-none backdrop-blur-xl transition focus:border-amber-300 focus:ring-4 focus:ring-amber-200/40"
          />
        </label>
      ) : null}
      <label className="flex flex-col gap-2 text-sm font-medium text-stone-800">
        Gemeinsamer Code
        <input
          name="inviteCode"
          placeholder="gredaful"
          className="min-h-14 rounded-2xl border border-white/70 bg-white/60 px-4 text-base lowercase outline-none backdrop-blur-xl transition placeholder:text-stone-400 focus:border-amber-300 focus:ring-4 focus:ring-amber-200/40"
        />
      </label>
      <p className="text-xs leading-5 text-stone-600">
        Erstellt eine Person den Paarraum, kann die andere mit demselben Code beitreten.
      </p>
      <SubmitButton pendingLabel="Richte ein ...">
        {mode === "create" ? "Paarraum erstellen" : "Paarraum beitreten"}
      </SubmitButton>
      {state.error ? <p className="text-sm font-medium text-red-700">{state.error}</p> : null}
    </form>
  );
}
