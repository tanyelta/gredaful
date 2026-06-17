# GREDAFUL

Private mobile-first Webapp für ein tägliches Abendritual: Highlight und Blessing festhalten, gemeinsam ansehen und später wiederentdecken.

## Stack

- Next.js App Router mit TypeScript
- Tailwind CSS im hellen Glassmorphism-Design
- Supabase Auth, Postgres und Row Level Security
- Vercel Deployment mit eigener Domain

## Lokal starten

```bash
npm install
cp .env.example .env.local
npm run dev
```

Danach `http://localhost:3000` öffnen.

## Supabase einrichten

1. Neues Supabase-Projekt erstellen.
2. SQL aus `supabase/schema.sql` im Supabase SQL Editor ausführen.
3. Unter Authentication die E-Mail-Provider-Einstellungen aktivieren.
4. Redirect URLs setzen:
   - `http://localhost:3000/auth/callback`
   - `https://deine-domain.de/auth/callback`
   - die Vercel Preview URLs, falls Preview-Deployments genutzt werden
5. Werte aus Project Settings > API in `.env.local` und später in Vercel eintragen:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Paarraum

Die erste Person loggt sich ein, erstellt den Paarraum und wählt einen gemeinsamen Code. Die zweite Person loggt sich mit eigener E-Mail ein und tritt mit demselben Code bei.

## Deployment und Domain

1. Projekt zu GitHub pushen.
2. In Vercel importieren.
3. Env-Variablen aus `.env.example` in Vercel setzen.
4. Domain in Vercel hinzufügen.
5. DNS beim Domain-Anbieter nach Vercel-Anleitung setzen.
6. In Supabase die finale Domain als Redirect URL ergänzen.

## Checks

```bash
npm run lint
npm run build
```
