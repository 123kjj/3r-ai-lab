# 3R AI

**Before you throw it away, ask why.**

3R AI uses AI image analysis to help people decide whether an everyday item
should be **reduced**, **reused**, or **recycled** — because recycling rules
vary by location and most people just don't know.

Built with Next.js (App Router), React, TypeScript, Tailwind CSS, and Firebase.
Works out of the box in **demo mode** with zero API keys.

---

## 1. Installation

```bash
npm install
```

Requires Node.js 18.17 or later.

---

## 2. Environment variables

Copy the example file:

```bash
cp .env.example .env.local
```

Every variable is optional. With none of them set, the app runs fully in
**demo mode**:
- Sign-in is disabled; a "Demo mode" badge shows in the nav.
- Scanning uses realistic mock results (`src/lib/mockData.ts`).
- Impact stats and actions live only in local component state for the
  session — they reset on reload.

| Variable | Used for |
|---|---|
| `NEXT_PUBLIC_FIREBASE_*` | Firebase Authentication + Firestore |
| `GEMINI_API_KEY` | Real AI vision analysis + reuse idea generation (Google Gemini) |
| `LOCAL_RULES_API_KEY` | Optional: a local recycling-rules API you wire up yourself |

---

## 3. Firebase setup (optional — enables sign-in & saved progress)

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com).
2. **Authentication** → Sign-in method → enable **Google**.
3. **Firestore Database** → create a database (start in production mode, then
   add rules like the ones below).
4. Project settings → General → "Your apps" → add a Web app → copy the
   config values into `.env.local` as `NEXT_PUBLIC_FIREBASE_*`.

Suggested Firestore security rules (users can only read/write their own data):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      match /actions/{actionId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

Data model:

```
users/{userId}
  displayName, email, createdAt,
  totalActions, reusedCount, recycledCount, reducedCount, challengeDay

users/{userId}/actions/{actionId}
  itemName, category, action, createdAt, explanation
```

Uploaded photos are **not** stored — they're analyzed and discarded.

---

## 4. AI API setup (optional — enables real photo identification)

Without this, `/api/analyze` and `/api/reuse-ideas` automatically return
realistic mock data (see `src/lib/ai.ts` — `mockAnalyzeItem` vs
`realAnalyzeItem` are clearly separated).

1. Get a free API key from [aistudio.google.com/apikey](https://aistudio.google.com/apikey).
2. Add it as `GEMINI_API_KEY` in `.env.local`.
3. That's it — the API routes detect the key automatically and switch from
   mock to real analysis (using `gemini-1.5-flash` with vision), no other
   code changes needed.

Want a different vision provider? `realAnalyzeItem` in `src/lib/ai.ts` is the
only place that needs to change.

---

## 5. Running locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 6. Deploying to Vercel

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. Add the same environment variables from `.env.local` in the Vercel
   project settings (Settings → Environment Variables).
4. Deploy. No other configuration needed — this is a standard Next.js app.

---

## Project structure

```
src/
  app/
    page.tsx            Home
    scan/page.tsx        Scan → upload → analyze → result
    impact/page.tsx      My Impact dashboard
    learn/page.tsx        Learn the 3Rs
    api/analyze/route.ts       Real/mock AI vision dispatch
    api/reuse-ideas/route.ts   Real/mock reuse idea generation
  components/            Reusable UI (Nav, Button, cards, etc.)
  context/               AuthContext, ImpactContext
  lib/                   types, mockData, ai.ts, firebase.ts, utils
  hooks/                 useCountUp
```

## Demo mode details

Demo mode is designed to make the whole product demoable with no setup:
- Analysis cycles through 5 realistic mock items (bottle, cardboard box,
  glass jar, t-shirt, aluminum can) plus an occasional "uncertain" result
  to show that flow too.
- "I Took Action" updates local impact stats and unlocks achievements
  immediately, even signed out.
- Signing in (once Firebase is configured) switches to real Firestore-backed
  persistence automatically — no separate demo/production code paths to
  maintain in the UI.
