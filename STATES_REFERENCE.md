# German States Reference Guide

Complete reference for all 16 German federal states (Bundesländer) used in the application.

## State Codes & URLs

All state questions and test modes use these standardized codes in the following format:
- `/test/{code}` - Take the test for a specific state
- `/fragenkatalog/{code}` - View question catalog for a state (official website)

| Code | State (German) | State (English) | Data Key | Test URL |
|------|---|---|---|---|
| `bw` | Baden-Württemberg | Baden-Württemberg | `baden-wuerttemberg` | `/test/bw` |
| `by` | Bayern | Bavaria | `bayern` | `/test/by` |
| `be` | Berlin | Berlin | `berlin` | `/test/be` |
| `bb` | Brandenburg | Brandenburg | `brandenburg` | `/test/bb` |
| `hb` | Bremen | Bremen | `bremen` | `/test/hb` |
| `hh` | Hamburg | Hamburg | `hamburg` | `/test/hh` |
| `he` | Hessen | Hesse | `hessen` | `/test/he` |
| `mv` | Mecklenburg-Vorpommern | Mecklenburg-Western Pomerania | `mecklenburg-vorpommern` | `/test/mv` |
| `ni` | Niedersachsen | Lower Saxony | `niedersachsen` | `/test/ni` |
| `nw` | Nordrhein-Westfalen | North Rhine-Westphalia | `nordrhein-westfalen` | `/test/nw` |
| `rp` | Rheinland-Pfalz | Rhineland-Palatinate | `rheinland-pfalz` | `/test/rp` |
| `sl` | Saarland | Saarland | `saarland` | `/test/sl` |
| `sn` | Sachsen | Saxony | `sachsen` | `/test/sn` |
| `st` | Sachsen-Anhalt | Saxony-Anhalt | `sachsen-anhalt` | `/test/st` |
| `sh` | Schleswig-Holstein | Schleswig-Holstein | `schleswig-holstein` | `/test/sh` |
| `th` | Thüringen | Thuringia | `thueringen` | `/test/th` |

## Implementation

### Using States in Code

```typescript
import { GERMAN_STATES, getStateByCode, getAllStateCodes } from "@/lib/states"

// Get a specific state
const berlin = getStateByCode("be")
console.log(berlin.nameDE) // "Berlin"

// Get state name in specific language
import { getStateName } from "@/lib/states"
const name = getStateName("by", "en") // "Bavaria"

// List all state codes
import { getAllStateCodes } from "@/lib/states"
const codes = getAllStateCodes() // ["bw", "by", "be", ...]

// Create lookup maps
import { createStateCodeMap, createStateSlugMap } from "@/lib/states"
const codeMap = createStateCodeMap() // { bw: State, by: State, ... }
const slugMap = createStateSlugMap() // { "baden-wuerttemberg": State, ... }
```

### Data Loading

State-specific questions are loaded from `/public/data/state-questions.json`:

```json
{
  "baden-wuerttemberg": [ /* 3 questions */ ],
  "bayern": [ /* 3 questions */ ],
  ...
}
```

The keys use **slugs with hyphens** (e.g., `"baden-wuerttemberg"`), not codes.

### Store Integration

```typescript
// In Zustand store (lib/store.ts)
selectedState: string | null  // Stores state code (e.g., "be")
stateQuestions: Question[]    // 3 state-specific questions loaded for the selected state
```

### Route Handling

```typescript
// Dynamic state route (e.g., app/test/[state]/page.tsx)
export default function TestPage({ params }: { params: { state: string } }) {
  const stateCode = params.state  // e.g., "be"
  const state = getStateByCode(stateCode)
  // Load state-specific questions
}
```

## Official Reference

Source: [https://www.lebenindeutschland.eu/](https://www.lebenindeutschland.eu/)

The official German government citizenship test website lists all 16 states with the same codes and provides test simulations for each state.

## Notes

1. **State Questions**: Each state has exactly **3 state-specific questions** that change based on the selected Bundesland
2. **Slugs vs. Codes**:
   - Codes (2 chars): `be`, `by`, `bw` — used in URLs and state store
   - Slugs (full name with hyphens): `berlin`, `bayern`, `baden-wuerttemberg` — used as keys in JSON data
3. **Data Consistency**: Always keep codes, slugs, and data keys in sync when adding/modifying states
4. **Internationalization**: All state names and descriptions are available in German and English
