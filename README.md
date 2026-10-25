# 3R-AI: Sort, Learn, Reuse

A game-and-guide that teaches middle and high school students the **rule behind each waste decision**, so they can sort items they've never checked.

- **Check an item:** type anything (200+ student and household items). Get the bin, the rule to remember, a sourced EPA WARM comparison where one exists, a craft idea, and an "avoid it next time" tip.
- **Sort Rush:** a conveyor-belt sorting game with animated bins, streaks, badges and a planet that greens as you learn rules.
- **Quiz:** 12 items, saved anonymously, with a retake so the app can show real before/after results.
- **Problem & Methodology:** the problem, evidence, limits and sources.

No AI and no API keys. Recommendations come from a hand-written rules engine and item library (`src/lib/rules.ts`, `src/lib/itemLibrary.ts`). Emissions figures come only from EPA WARM (`src/lib/materialData.ts`); where no sourced figure exists the app says so.

## Run locally

```
npm install
cp .env.example .env.local   # fill in the six Firebase values (optional)
npm run dev
npm test
```

Firebase (Auth + Firestore) is only used to save the anonymous quiz results and optional sign-in progress. Without it, everything else works.

## Environment variables

`NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`
