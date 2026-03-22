# Image Fix Action Plan

## Problem Identified

State-specific questions have image references but many are broken or missing:
- ✅ **9 states** have working images (Bayern, MV, NW, RP, Saarland, Sachsen, Sachsen-Anhalt, SH, Thüringen)
- ❌ **7 states** have missing or broken images (BW, Berlin, Brandenburg, Bremen, Hamburg, Hessen, Niedersachsen)

## Current Image Issues

| State | Code | Image Status | Issue |
|-------|------|--------------|-------|
| Baden-Württemberg | bw | ❌ | Filename typo: `baden-wurttemberg` (one 't') |
| Bayern | by | ✅ | Working |
| Berlin | be | ✅ | Working (generic) |
| Brandenburg | bb | ❌ | Missing: `coatofarms.jpg` |
| Bremen | hb | ❌ | Missing: `coatarms.jpg` |
| Hamburg | hh | ❌ | Missing: `hamburg.jpg` |
| Hessen | he | ⚠️ | No image reference at all |
| Mecklenburg-Vorpommern | mv | ✅ | Working |
| Niedersachsen | ni | ❌ | Wrong image (points to Sachsen-Anhalt!) |
| Nordrhein-Westfalen | nw | ✅ | Working |
| Rheinland-Pfalz | rp | ✅ | Working |
| Saarland | sl | ✅ | Working |
| Sachsen | sn | ✅ | Working |
| Sachsen-Anhalt | st | ✅ | Working |
| Schleswig-Holstein | sh | ✅ | Working |
| Thüringen | th | ✅ | Working |

## Quick Fix Strategy (30 minutes)

### Step 1: Correct Wrong References in JSON
Fix the data to point to correct images or use `null`:

```json
{
  "baden-wuerttemberg": { "image": null },  // No file exists
  "brandenburg": { "image": null },          // No file exists
  "bremen": { "image": null },               // No file exists
  "hamburg": { "image": null },              // No file exists
  "hessen": { "image": null },               // No reference
  "niedersachsen": { "image": null }         // Wrong file (points to Sachsen-Anhalt)
}
```

### Step 2: Update UI to Handle Missing Images
SwipeCard.tsx should:
- Check if image exists
- Show placeholder if `image: null`
- Only render img tag if image URL is provided

### Step 3: Visual Feedback
- Show "Bild nicht verfügbar" (Image not available) message
- Use consistent styling
- Don't break the layout

## Long-term Image Solution

Need to source coat-of-arms images for:
1. Baden-Württemberg
2. Brandenburg
3. Bremen
4. Hamburg
5. Hessen

### Where to Get Images
- **Wikimedia Commons** — Public domain coat-of-arms
- **Wikipedia** — State articles have official images
- **Official government sites** — Some states publish their official seals
- **Design/Generate** — Create simple representations

### Naming Convention
```
/public/images/{state-slug}-coat-of-arms.png

Examples:
- /images/baden-wuerttemberg-coat-of-arms.png
- /images/brandenburg-coat-of-arms.png
- /images/bremen-coat-of-arms.png
- /images/hamburg-coat-of-arms.png
- /images/hessen-coat-of-arms.png
```

## Implementation Steps

### Option A: Quick Fix (Recommended - 30 min)
1. Update `public/data/state-questions.json`
2. Set all broken image references to `null`
3. Update `components/SwipeCard.tsx` to handle `null` images
4. Test all 16 states

### Option B: Complete Fix (2-4 hours)
1. Download/create missing images from Wikimedia Commons
2. Add to `/public/images/`
3. Update JSON with correct file paths
4. Verify all images load correctly
5. Test all 16 states

## Code Changes Needed

### In state-questions.json
```bash
# Find and replace broken paths
- Search: "coatofarms.jpg" → Replace with: null
- Search: "coatarms.jpg" → Replace with: null
- Search: "hamburg.jpg" → Replace with: null
- Search: "baden-wurttemberg-coat-of-arms.jpg" → Replace with: null
```

### In components/SwipeCard.tsx
```typescript
// Add image error handling
{question.image && (
  <img
    src={question.image}
    alt={question.question}
    onError={(e) => {
      // Fallback if image fails to load
      e.currentTarget.style.display = 'none';
    }}
  />
)}

// Show message if no image
{!question.image && (
  <div className="text-gray-400 text-sm p-4">
    📷 Bild nicht verfügbar
  </div>
)}
```

## Current Status

| Metric | Count |
|--------|-------|
| Total States | 16 |
| States with working images | 9 |
| States with broken images | 5 |
| States with missing image refs | 1 |
| States with no image | 1 |

## Priority

🔴 **HIGH** - Missing images affect user experience
- Questions with missing images show broken image icons
- Need immediate fix to prevent bad UX
- Can use `null` as quick solution, add real images later

## Recommendation

**Do the Quick Fix TODAY:**
1. Update JSON to set broken references to `null`
2. Update SwipeCard UI to handle null gracefully
3. Show "Image unavailable" message instead of broken icon
4. This takes 30 minutes and fixes the problem immediately

**Plan to add real images LATER:**
1. Gradually collect/create missing images
2. Add to project over time
3. Update JSON as images become available
4. Users won't be blocked by missing images

---

## Summary

The state questions data exists and is complete, but images are partially broken.

**Quick Fix**: Set broken image references to `null` → Done in 30 min
**Complete Fix**: Add real images for missing states → Done in 2-4 hours

User experience is blocked by broken images right now. Recommend Quick Fix immediately.
