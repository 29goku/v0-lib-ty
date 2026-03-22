# Quick Start: German States

## The Basics (Copy & Paste Ready)

### Import
```typescript
import { GERMAN_STATES, getStateByCode } from "@/lib/states"
```

### Get a State
```typescript
const berlin = getStateByCode("be")
console.log(berlin)
// {
//   code: "be",
//   slug: "berlin",
//   nameDE: "Berlin",
//   nameEN: "Berlin",
//   description: "Die Hauptstadt der Bundesrepublik Deutschland",
//   emoji: "🏛️"
// }
```

### List All States
```typescript
GERMAN_STATES.forEach(state => {
  console.log(`${state.emoji} ${state.nameDE} (${state.code})`)
})
// 🏰 Baden-Württemberg (bw)
// 🍺 Bayern (by)
// 🏛️ Berlin (be)
// ...
```

### Quick Functions
```typescript
getAllStateCodes()              // ["bw", "by", "be", ...]
getAllStateSlugs()              // ["baden-wuerttemberg", "bayern", "berlin", ...]
getStateName("by", "de")        // "Bayern"
getStateName("by", "en")        // "Bavaria"
getStateBySlug("berlin")        // Same state object as getStateByCode("be")
createStateCodeMap()            // { bw: State, by: State, ... }
```

## State Codes (All 16)

| Code | German | English |
|------|--------|---------|
| bw | Baden-Württemberg | Baden-Württemberg |
| by | Bayern | Bavaria |
| be | Berlin | Berlin |
| bb | Brandenburg | Brandenburg |
| hb | Bremen | Bremen |
| hh | Hamburg | Hamburg |
| he | Hessen | Hesse |
| mv | Mecklenburg-Vorpommern | Mecklenburg-Western Pomerania |
| ni | Niedersachsen | Lower Saxony |
| nw | Nordrhein-Westfalen | North Rhine-Westphalia |
| rp | Rheinland-Pfalz | Rhineland-Palatinate |
| sl | Saarland | Saarland |
| sn | Sachsen | Saxony |
| st | Sachsen-Anhalt | Saxony-Anhalt |
| sh | Schleswig-Holstein | Schleswig-Holstein |
| th | Thüringen | Thuringia |

## Use in React Component

```tsx
import { GERMAN_STATES } from "@/lib/states"

export function StateSelector() {
  return (
    <select>
      <option value="">Select a state...</option>
      {GERMAN_STATES.map(state => (
        <option key={state.code} value={state.code}>
          {state.emoji} {state.nameDE}
        </option>
      ))}
    </select>
  )
}
```

## Use in Route Handler

```tsx
// app/test/[state]/page.tsx
import { getStateByCode } from "@/lib/states"

export default function TestPage({ params }: { params: { state: string } }) {
  const state = getStateByCode(params.state)

  if (!state) {
    return <div>Invalid state: {params.state}</div>
  }

  return (
    <div>
      <h1>{state.emoji} {state.nameDE} Test</h1>
      <p>{state.description}</p>
    </div>
  )
}
```

## URL Routes

All these work:
- `/test/bw` → Baden-Württemberg
- `/test/by` → Bayern
- `/test/be` → Berlin
- `/test/bb` → Brandenburg
- `/test/hb` → Bremen
- `/test/hh` → Hamburg
- `/test/he` → Hessen
- `/test/mv` → Mecklenburg-Vorpommern
- `/test/ni` → Niedersachsen
- `/test/nw` → Nordrhein-Westfalen
- `/test/rp` → Rheinland-Pfalz
- `/test/sl` → Saarland
- `/test/sn` → Sachsen
- `/test/st` → Sachsen-Anhalt
- `/test/sh` → Schleswig-Holstein
- `/test/th` → Thüringen

## Important Notes

1. **Code vs Slug**:
   - Code: `"be"` (used in URLs and store)
   - Slug: `"berlin"` (used in JSON data keys)

2. **State Questions**:
   - Each state has 3 state-specific questions in `/public/data/state-questions.json`
   - Keys use slug format: `"baden-wuerttemberg"`, `"bayern"`, etc.

3. **Loading State Questions**:
   ```typescript
   const state = getStateByCode("be")
   const key = state.slug  // "berlin"
   // Then load from state-questions.json[key]
   ```

## More Info

- Full reference: See `STATES_REFERENCE.md`
- Implementation details: See `STATES_IMPLEMENTATION_SUMMARY.md`
- Architecture: See `CLAUDE.md` → "German States Data" section
