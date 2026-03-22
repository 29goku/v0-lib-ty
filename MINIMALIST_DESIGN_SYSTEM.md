# Minimalist Design System - Website Revamp Plan

**Goal**: Transform entire website to clean, minimalist aesthetic
**Status**: In Progress (SwipeCard complete)
**Target**: All pages follow minimalist principles

## Design Principles

### Color Palette
```
Background:  bg-black/dark-gray (keep existing dark mode)
Text:        text-white/text-gray-300 (high contrast, readable)
Borders:     border-gray-700/border-gray-800 (subtle, not prominent)
Accents:     Minimal use, green/red/blue only for status
Hover:       Subtle bg-gray-900/20 or opacity changes
```

### Spacing
```
Cards:       p-4 to p-6 (was p-4 md:p-6, keep consistent)
Gaps:        gap-2 to gap-3 (reduce visual noise)
Buttons:     p-2 to p-3 (compact, not spacious)
Sections:    space-y-3 to space-y-4 (breathing room)
```

### Typography
```
Headings:    font-semibold (was font-black)
Text:        font-normal/font-medium (reduce boldness)
Size:        text-sm/text-base (was text-lg/text-xl)
Line Height: leading-relaxed (readability)
```

### Borders & Shadows
```
❌ Remove:  Gradients, blur effects, drop shadows
✅ Add:      Single 1px borders (border-gray-700)
✅ Use:      Subtle opacity changes on hover
❌ Avoid:    scale transforms, fade animations
✅ Use:      Smooth opacity/color transitions
```

### Buttons
```
Primary:     border border-gray-700 bg-transparent hover:bg-gray-900/20
Secondary:   Similar but with text color change
Danger:      bg-red-500/20 border-red-500/50 text-red-200
Success:     bg-green-500/20 border-green-500/50 text-green-200
```

### Cards/Sections
```
Border:      border border-gray-700/border-gray-800
Background:  bg-white/5 or transparent
Padding:     p-4 md:p-6 (consistent)
Rounded:     rounded (not rounded-xl, rounded-lg)
Shadow:      none (removed entirely)
```

## Pages to Revamp

### 1. Homepage (`app/page.tsx`) - HIGH PRIORITY
**Current State**: Heavy gradients, emojis, animations
**Changes Needed**:
- Remove gradient background overlay
- Simplify hero section
- Remove animated bouncing emojis
- Replace gradients in feature cards
- Minimal button styling
- Clean typography

**Estimated Time**: 30-40 minutes

### 2. Practice Page (`app/practice/page.tsx`) - HIGH PRIORITY
**Current State**: Colorful filters, gradient sections
**Changes Needed**:
- Simplify filter UI (clean checkbox/radio buttons)
- Minimal spacing
- Remove excessive styling on progress bars
- Simplify category display
- Replace emojis with icons only when needed

**Estimated Time**: 30-40 minutes

### 3. Test Page (`app/test/page.tsx`) - HIGH PRIORITY
**Current State**: Heavy styling, gradients, emojis
**Changes Needed**:
- Simplify test configuration screen
- Minimal timer display
- Clean result display
- Remove gradient buttons
- Subtle state indicators

**Estimated Time**: 30-40 minutes

### 4. Review Page (`app/review/page.tsx`) - MEDIUM PRIORITY
**Current State**: Decorative emojis, heavy styling
**Changes Needed**:
- Remove background animations
- Simplify filter buttons
- Minimal question display
- Clean answer review sections

**Estimated Time**: 30-40 minutes

### 5. Settings Page (`app/settings/page.tsx`) - MEDIUM PRIORITY
**Current State**: Heavy styling, section dividers
**Changes Needed**:
- Simple form inputs
- Minimal badge display
- Clean stat sections
- Subtle section separators

**Estimated Time**: 25-30 minutes

### 6. Test State Page (`app/test/[state]/page.tsx`) - MEDIUM PRIORITY
**Current State**: Similar to test page
**Changes Needed**:
- Same principles as test page
- Minimal state display
- Clean result view

**Estimated Time**: 25-30 minutes

## Implementation Strategy

### Phase 1: Core Component Updates (Today)
1. ✅ SwipeCard - Done (d0d0970)
2. Homepage - START NEXT
3. Practice Page
4. Test Page

### Phase 2: Remaining Pages
5. Review Page
6. Settings Page
7. Test State Page

### Phase 3: Layout & Navigation
- Update layout.tsx if needed
- Simplify navigation styling
- Clean up global styles

## Specific Changes by Element Type

### Gradients
```tsx
// ❌ Before
bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400

// ✅ After
bg-transparent (or bg-white/5)
```

### Shadows
```tsx
// ❌ Before
shadow-2xl shadow-cyan-500/25

// ✅ After
(remove shadow entirely)
```

### Borders
```tsx
// ❌ Before
border-4 border-cyan-400/50

// ✅ After
border border-gray-700
```

### Colors
```tsx
// ❌ Before
text-cyan-300, text-purple-500, text-pink-400

// ✅ After
text-white, text-gray-300, text-gray-500
```

### Animations
```tsx
// ❌ Before
whileHover={{ scale: 1.02 }}
className="animate-pulse"

// ✅ After
whileHover={{ backgroundColor: "rgba(0,0,0,0.1)" }}
className="transition-colors" (no scale/pulse)
```

## Minimalist Component Library

### Button Styles
```tsx
// Primary (default)
className="border border-gray-700 bg-transparent hover:bg-gray-900/20 text-gray-300 hover:text-white"

// Secondary
className="border border-gray-800 bg-gray-900/30 hover:bg-gray-900/50 text-gray-400"

// Danger/Flag
className="border border-red-500/50 bg-red-500/20 hover:bg-red-500/30 text-red-200"

// Success
className="border border-green-500/50 bg-green-500/20 hover:bg-green-500/30 text-green-200"
```

### Card Styles
```tsx
className="border border-gray-700 bg-white/5 backdrop-blur-sm rounded"
```

### Input Styles
```tsx
className="bg-gray-900/30 border border-gray-700 rounded text-white"
```

### Section Divider
```tsx
className="border-t border-gray-800"
```

## Benefits

✅ **Improved Focus**: Less visual noise = better content focus
✅ **Faster Load**: No gradients/shadows = lighter CSS
✅ **Professional**: Clean, modern minimalist aesthetic
✅ **Accessible**: Higher contrast, simpler interactions
✅ **Mobile-Friendly**: Minimal animations = better performance
✅ **Brand-Consistent**: Aligns with modern design trends

## Timeline

| Phase | Pages | Duration | Status |
|-------|-------|----------|--------|
| 1 | SwipeCard | ✅ Done | Complete |
| 1 | Homepage | 🟡 Next | Ready |
| 1 | Practice | 🟡 Ready | Queued |
| 1 | Test | 🟡 Ready | Queued |
| 2 | Review | 🟡 Ready | Queued |
| 2 | Settings | 🟡 Ready | Queued |
| 2 | Test State | 🟡 Ready | Queued |
| 3 | Layout & Nav | 🟡 Ready | Queued |

**Total Estimated Time**: 3-4 hours
**Expected Completion**: This session or next session

## Quality Checklist

- [ ] No gradients (except subtle bg-white/5)
- [ ] No drop shadows
- [ ] No scale animations (hover only)
- [ ] Consistent border-gray-700 theme
- [ ] All text high-contrast
- [ ] Buttons have minimal styling
- [ ] Cards have subtle borders only
- [ ] Typography is clean and readable
- [ ] Spacing is consistent
- [ ] Icons replace emojis where needed
- [ ] All interactive elements have subtle hover states
- [ ] No animation bloat (smooth transitions only)

## Key Files to Update

1. `app/page.tsx` - Homepage
2. `app/practice/page.tsx` - Practice mode
3. `app/test/page.tsx` - Test mode
4. `app/review/page.tsx` - Review mode
5. `app/settings/page.tsx` - Settings
6. `app/test/[state]/page.tsx` - State tests
7. `app/layout.tsx` - Global layout (if needed)
8. `styles/globals.css` - Global styles (if needed)

## Current Status

✅ Design system documented
✅ SwipeCard as reference implementation
🟡 Ready to apply to remaining pages
🟡 Build passing

---

**Version**: 1.0
**Created**: 2026-03-22
**Last Updated**: 2026-03-22
**Status**: Ready for implementation
