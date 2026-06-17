"use client";

import { useActionState } from "react";
import { signInWithPassword, type ActionState } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";

const initialState: ActionState = {};

export function LoginForm() {
  const [state, formAction] = useActionState(signInWithPassword, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-2 text-sm font-medium text-stone-800">
        Benutzer
        <input
          required
          name="username"
          type="text"
          autoComplete="username"
          placeholder="tanyel oder eda"
          className="min-h-14 rounded-2xl border border-white/70 bg-white/60 px-4 text-base outline-none backdrop-blur-xl transition placeholder:text-stone-400 focus:border-amber-300 focus:ring-4 focus:ring-amber-200/40"
        />
      </label>
      <label className="flex flex-col gap-2 text-sm font-medium text-stone-800">
        Passwort
        <input
          required
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Passwort"
          className="min-h-14 rounded-2xl border border-white/70 bg-white/60 px-4 text-base outline-none backdrop-blur-xl transition placeholder:text-stone-400 focus:border-amber-300 focus:ring-4 focus:ring-amber-200/40"
        />
      </label>
      <SubmitButton pendingLabel="Melde an ...">Einloggen</SubmitButton>
      {state.error ? <p className="text-sm font-medium text-red-700">{state.error}</p> : null}
    </form>
  );
}
