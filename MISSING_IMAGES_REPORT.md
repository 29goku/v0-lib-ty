# Missing Images Report - State Questions

## Summary

The state-questions.json file references images for coat-of-arms and state-specific visuals, but many image files are **missing or have incorrect paths**.

## Images Status by State

### ✅ Have Some Images
- **Bayern** (bw): ✅ `/images/bayern-coat-of-arms.png` EXISTS
- **Mecklenburg-Vorpommern** (mv): ✅ `/images/mecklenburg-vorpommern-coat-of-arms.png` EXISTS
- **Nordrhein-Westfalen** (nw): ✅ `/images/nordrhein-westfalen-coat-of-arms.png` EXISTS
- **Rheinland-Pfalz** (rp): ✅ `/images/rheinland-pfalz-coat-of-arms.png` EXISTS
- **Saarland** (sl): ✅ `/images/saarland-coat-of-arms.png` EXISTS
- **Sachsen** (sn): ✅ `/images/sachsen-coat-of-arms.png` EXISTS
- **Sachsen-Anhalt** (st): ✅ `/images/sachsen-anhalt-coat-of-arms.png` EXISTS
- **Schleswig-Holstein** (sh): ✅ `/images/schleswig-holstein-coat-of-arms.png` EXISTS
- **Thüringen** (th): ✅ `/images/thuringia-coat-of-arms.png` EXISTS

### ❌ Missing Images

1. **Baden-Württemberg** (bw)
   - Referenced: `/images/baden-wurttemberg-coat-of-arms.jpg`
   - Status: ❌ MISSING (typo in filename: "wurttemberg" vs "württemberg")

2. **Berlin** (be)
   - Referenced: `/images/coat-of-arms.jpg`
   - Status: ✅ EXISTS (generic file)

3. **Brandenburg** (bb)
   - Referenced: `/images/coatofarms.jpg`
   - Status: ❌ MISSING

4. **Bremen** (hb)
   - Referenced: `/images/coatarms.jpg`
   - Status: ❌ MISSING

5. **Hamburg** (hh)
   - Referenced: `/images/hamburg.jpg`
   - Status: ❌ MISSING

6. **Hessen** (he)
   - Referenced: NONE
   - Status: ⚠️ NO IMAGES

7. **Niedersachsen** (ni)
   - Referenced: `/images/sachsen-anhalt-coat-of-arms.png`
   - Status: ❌ WRONG IMAGE (points to Sachsen-Anhalt!)

## Image Files Currently in /public/images/

```
✅ coat-of-arms.jpg                          (generic)
✅ map.jpg                                    (generic)
✅ bayern-coat-of-arms.png
✅ mecklenburg-vorpommern-coat-of-arms.png
✅ nordrhein-westfalen-coat-of-arms.png
✅ rheinland-pfalz-coat-of-arms.png
✅ saarland-coat-of-arms.png
✅ sachsen-coat-of-arms.png
✅ sachsen-anhalt-coat-of-arms.png
✅ schleswig-holstein-coat-of-arms.png
✅ thuringia-coat-of-arms.png
✅ rheinland-pfalz-map.png
✅ saarland-map.png
✅ thuringia-map.png
✅ sachsen-map.png
✅ schleswig-holstein-map.png
✅ germany-map-baden-wurttemberg.jpg
✅ east-german-flag.jpg
✅ east-german-coat-of-arms.jpg
✅ federal-president-duties.jpg
✅ german-ballot-examples.jpg
✅ willy-brandt-warsaw.jpg
✅ mitterrand-kohl-verdun.jpg
```

## Issues Found

### 1. Filename Inconsistencies
- **Baden-Württemberg**: Referenced as `baden-wurttemberg` (one 't'), but actual files may use different naming
- **Brandenburg**: Referenced as generic `coatofarms.jpg` (missing hyphens)
- **Bremen**: Referenced as generic `coatarms.jpg` (missing hyphens)
- **Hamburg**: Referenced as generic `hamburg.jpg`

### 2. Missing State Coat-of-Arms
Need to create or add images for:
- [ ] Baden-Württemberg coat-of-arms
- [ ] Brandenburg coat-of-arms
- [ ] Bremen coat-of-arms
- [ ] Hamburg coat-of-arms
- [ ] Hessen coat-of-arms

### 3. Wrong Image Reference
- **Niedersachsen** points to Sachsen-Anhalt coat-of-arms (wrong state!)

## Solution Options

### Option 1: Fix Data to Match Existing Images
Update `/public/data/state-questions.json` to reference only images that exist:
- Set all non-existent image references to `null`
- Display placeholder when image is null
- Gradually add missing images

### Option 2: Create Missing Images
Create placeholder images for missing states:
- Generate or design coat-of-arms images for missing states
- Use consistent naming: `/images/{state}-coat-of-arms.png`
- Add maps for each state as well

### Option 3: Use Wikipedia/Open Source Images
Find open-source coat-of-arms images from:
- Wikimedia Commons (public domain)
- State government websites
- Official seal databases

## Recommended Action

### Short-term (Quick Fix):
Update state-questions.json to set `image: null` for missing images, then handle gracefully in UI:
- Show text-only questions for now
- Add placeholder styling
- Show "Image coming soon" message

### Long-term (Complete Solution):
1. Create/download proper coat-of-arms images for all 16 states
2. Store with consistent naming: `/images/{state-slug}-coat-of-arms.{ext}`
3. Update JSON with correct paths
4. Add state maps as well

## Question Image Distribution

Questions with images per state:
- **Baden-Württemberg**: 1 image (coat-of-arms)
- **Bayern**: 1 image (coat-of-arms)
- **Berlin**: 1 image (coat-of-arms)
- **Brandenburg**: 1 image (coat-of-arms) - MISSING
- **Bremen**: 1 image (coat-of-arms) - MISSING
- **Hamburg**: 1 image (coat-of-arms) - MISSING
- **Hessen**: 0 images
- **Mecklenburg-Vorpommern**: 1 image (coat-of-arms)
- **Niedersachsen**: 1 image (WRONG - points to Sachsen-Anhalt)
- **Nordrhein-Westfalen**: 1 image (coat-of-arms)
- **Rheinland-Pfalz**: 1 image (coat-of-arms)
- **Saarland**: 1 image (coat-of-arms)
- **Sachsen**: 1 image (coat-of-arms)
- **Sachsen-Anhalt**: 1 image (coat-of-arms)
- **Schleswig-Holstein**: 1 image (coat-of-arms)
- **Thüringen**: 1 image (coat-of-arms)

**Total: 14/16 states have image references (Hessen missing, but 5 are broken)**

## Next Steps

Choose one approach:

1. **Quick Fix** (30 min) — Set broken image references to `null`
2. **Add Placeholder Images** (1 hour) — Create generic placeholder images
3. **Find Real Images** (2-4 hours) — Search Wikimedia Commons and add proper images
4. **Generate Custom Images** (4+ hours) — Commission or create custom images
