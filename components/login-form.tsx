"use client";

import { useActionState } from "react";
import { signInWithEmail, type ActionState } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";

const initialState: ActionState = {};

export function LoginForm() {
  const [state, formAction] = useActionState(signInWithEmail, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-2 text-sm font-medium text-stone-800">
        E-Mail-Adresse
        <input
          required
          name="email"
          type="email"
          autoComplete="email"
          placeholder="ihr@beispiel.de"
          className="min-h-14 rounded-2xl border border-white/70 bg-white/60 px-4 text-base outline-none backdrop-blur-xl transition placeholder:text-stone-400 focus:border-amber-300 focus:ring-4 focus:ring-amber-200/40"
        />
      </label>
      <SubmitButton pendingLabel="Sende Link ...">Login-Link senden</SubmitButton>
      {state.error ? <p className="text-sm font-medium text-red-700">{state.error}</p> : null}
      {state.message ? <p className="text-sm font-medium text-emerald-700">{state.message}</p> : null}
    </form>
  );
}
