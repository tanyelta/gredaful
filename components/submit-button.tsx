"use client";

import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
};

export function SubmitButton({ children, pendingLabel = "Speichern ...", className }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={
        className ??
        "min-h-12 rounded-full bg-stone-950 px-5 text-sm font-semibold text-white shadow-lg shadow-amber-900/10 transition hover:-translate-y-0.5 hover:bg-stone-800 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
      }
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
