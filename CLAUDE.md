# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Summary

**lebeninde.com** — A modern, interactive learning platform for German citizenship test preparation ("Leben in Deutschland Test"). The app uses a gamified swipe-card interface with multilingual support (German & English), progress tracking, and test simulation modes. Built with Next.js 15, TypeScript, React 19, and styled with Tailwind CSS.

---

## Development Commands

### Core Commands
- `npm run dev` — Start local development server (port 3000)
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npm run lint` — Run ESLint

### Notes
- No dedicated test runner configured; if needed, coordinate with project owner
- No format script configured; rely on Prettier via editor integrations

---

## Tech Stack & Architecture

### Frontend Framework
- **Next.js 15** with App Router (`/app` directory)
- **React 19** with TypeScript
- **Tailwind CSS** for styling (config at `tailwind.config.ts`)
- Components use a mix of server and client components (watch `"use client"` markers)

### State Management & Storage
- **Zustand** for global state (`lib/store.ts`) with persistence middleware
- State persists across sessions via `zustand/middleware`
- Core state shape: `AppState` with `questions`, `userProgress`, `language`, `testMode`, etc.

### UI Components
- **Radix UI** primitives (select, dialog, tabs, alert-dialog, dropdown-menu, etc.)
- **shadcn/ui** component library (pre-built form components, cards, buttons)
- Tailwind CSS with custom animations (`tailwindcss-animate`)
- Icons via **Lucide React**

### Key Libraries
- **react-hook-form** + **Zod** — Form validation
- **date-fns** — Date manipulation
- **framer-motion** — Animations (imported but may not be actively used)
- **embla-carousel** — Carousel functionality
- **recharts** — Charts/graphs
- **sonner** — Toast notifications
- **next-themes** — Dark mode theming (configured but may need activation)
- **Vercel Analytics & Speed Insights** — Production monitoring

### Multilingual Support
- `lib/i18n.ts` — Translation strings (German & English)
- `lib/translation-service.ts` — Translation utilities
- Language state managed via Zustand store
- Components access translations via `getTranslation(language)`

---

## Project Structure

```
app/
  layout.tsx          # Root layout with metadata, fonts, analytics
  page.tsx            # Homepage (hero, features, stats, CTAs)
  practice/page.tsx   # Practice mode with swipe cards
  test/page.tsx       # Timed test simulation
  review/page.tsx     # Review completed questions
  settings/page.tsx   # User settings (language, theme, stats)

components/
  ui/                 # Radix UI + shadcn/ui components
  SwipeCard.tsx       # Core flashcard swipe component
  MultiSelect.tsx     # Custom dropdown/filter component
  ChatWidget.tsx      # Chat widget integration
  LanguageSelector.tsx # Language switcher
  Badge.tsx           # User achievement/badge display
  ProgressBar.tsx     # Progress visualization

lib/
  store.ts            # Zustand store (state, actions, persistence)
  i18n.ts             # Translation strings (~310 q&a pairs)
  translation-service.ts # Helper functions for translations
  persistence.ts      # Storage utilities
  swipe-card-utils.ts # Swipe card logic helpers
  swipe-card-constants.ts # Card animation config
  category-emojis.ts  # Category-to-emoji mapping
  states.ts           # German states data (16 Bundesländer with metadata)

public/
  data/
    test.json         # Mock/sample question data
    questions.json    # General 310 citizenship test questions
    state-questions.json # 3 state-specific questions per Bundesland (16 keys)
  (assets: images, fonts, etc.)

styles/
  globals.css         # Global Tailwind directives

types/
  nodemailer.d.ts     # Email notification types
```

---

## Key Architectural Patterns

### 1. Global State with Zustand Persistence
The store at `lib/store.ts` persists to localStorage automatically:
- User progress (XP, streaks, completed questions, badges)
- Answered questions and correctness
- Language preference
- Selected categories/states

### 2. Question & Answer Flow
- **Question Interface**: `{ id, category, question, options[], answerIndex, explanation }`
- **User Progress Interface**: Tracks XP, streaks, flagged/completed questions, badges
- Questions load dynamically; test mode activates timed 33-question subset

### 3. Multilingual Patterns
- All UI text lives in `lib/i18n.ts` indexed by language code (`"de"` or `"en"`)
- Components call `getTranslation(language)` to get all strings for current language
- Language switching updates Zustand store, triggering re-renders

### 4. Component Reusability
- `SwipeCard` is the core card-swiping component used across practice/test modes
- `MultiSelect` is a custom dropdown filter (recent additions)
- Radix UI & shadcn/ui components are used as building blocks

### 5. SEO & Metadata
- Extensive structured data (JSON-LD) in `app/layout.tsx` and `app/page.tsx`
- Open Graph & Twitter Card metadata for social sharing
- Alternate language links for hreflang
- Canonical URLs for SEO

### 6. Hydration Safety
- Pages check `mounted` state before rendering (prevents hydration mismatches)
- Dynamic imports for heavy components via `next/dynamic`

---

## German States Data

All 16 German federal states (Bundesländer) are comprehensively mapped in `lib/states.ts`:

```typescript
import { GERMAN_STATES, getStateByCode, getAllStateCodes } from "@/lib/states"

// All states have: code, slug, nameDE, nameEN, description, emoji
const berlin = getStateByCode("be")  // { code: "be", slug: "berlin", nameDE: "Berlin", ... }

// Utility functions available:
getStateName("by", "en")           // "Bavaria"
getAllStateCodes()                 // ["bw", "by", "be", "bb", ...]
createStateCodeMap()               // Map for fast lookups by code
```

Each state has exactly **3 state-specific questions** in `/public/data/state-questions.json` (keyed by slug: `"baden-wuerttemberg"`, `"bayern"`, etc.). See `STATES_REFERENCE.md` for complete code/slug mapping.

---

## Common Development Tasks

### Adding a New Translation
1. Open `lib/i18n.ts`
2. Add the key-value pair to both `DE` and `EN` translation objects
3. Reference in component: `const t = getTranslation(language); t.yourKey`

### Adding a New Question Category
1. Add category name to `lib/category-emojis.ts`
2. Questions automatically inherit emoji if category is in the map
3. Filter questions by category via `selectedCategory` store state

### Modifying Swipe Card Behavior
- Card animations & thresholds live in `lib/swipe-card-constants.ts`
- Card logic (swipe detection, answer validation) in `components/SwipeCard.tsx`
- Utility functions for positioning/velocity in `lib/swipe-card-utils.ts`

### Testing a New Page
1. Create `app/yourpage/page.tsx`
2. Add route to navigation (e.g., in top nav component or footer)
3. Ensure page uses `"use client"` if it needs Zustand store or hooks

### Enabling Dark Mode
- Next-themes is installed but may not be fully wired; check if `ThemeProvider` wraps app in layout
- Tailwind config supports dark mode via class strategy

---

## Recent Changes

The project has several recent commits focused on:
- Implementing **MultiSelect** dropdown component (Oct 12)
- Refactoring **SwipeCard** with improved animations (Oct 12)
- UI polish and styling updates
- Store improvements for tracking incorrect answers

---

## Important Notes for Future Work

1. **Hydration**: Always check for `mounted` state before rendering client-side data to avoid hydration mismatches in Next.js.

2. **Performance**: Vercel Analytics and Speed Insights are active on production. Monitor these metrics when making UI changes.

3. **Data Source**: Questions appear to be embedded in `lib/i18n.ts`. For scalability, consider moving to a database or JSON API.

4. **Multilingual Consistency**: Always update both `DE` and `EN` translation objects together when adding UI text.

5. **Component Naming**: UI components in `components/ui/` follow shadcn/ui naming conventions; custom components live at `components/`.

6. **Dependencies**: Mix of "latest" and pinned versions in package.json. Test updates carefully, especially for major framework updates (React, Next.js, Radix UI).

---

## Useful References

- **SEO Guide**: See `SEO_OPTIMIZATION_GUIDE.md` for meta tag strategy and structured data approach
- **Tailwind Config**: `tailwind.config.ts` includes custom animations and component config
- **Next.js Config**: `next.config.mjs` minimal setup; may need updates for image optimization or API routes
