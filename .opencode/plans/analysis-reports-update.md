# Codebase Analysis Report Update Plan

## Context
Comprehensive analysis of the image-asset-manager codebase completed. 5 existing reports need corrections and 5 new facet reports need to be created. All source files have been read and analyzed.

## Verified Facts

### Image Counts (verified by counting every `img()` call in imageData.ts lines 152-299)
- Voorwoord: 1
- Inleiding: 3
- Hoofdstuk 1: 35
- Hoofdstuk 2: 14
- Hoofdstuk 3: 12
- Hoofdstuk 4: 7
- Hoofdstuk 5: 44
- Hoofdstuk 6: 11
- Epiloog: 3
- **Total: 130 images** (reports incorrectly say 141)

### Digital File Counts (verified from digiFilesData.ts)
- expo-spice-quiest: 16
- repros-b: 38
- readytex-ingi-sten: 5
- wvdbk-jpeg-a: 38
- tiff-expo-spice-quiest: 16
- **Total: 113 files** (matches reports)

### Translation System Counts (verified from archiveTextNl.ts)
- Exact translations: ~42 entries (reports say 38)
- Replacement pairs: ~86 pairs (reports say 76)

### Key Finding: ErrorBoundary
- ErrorBoundary component exists in `src/components/ErrorBoundary.tsx`
- It is **NOT imported or used anywhere** in the running application
- Reports 03 and 05 incorrectly state it's used in Providers.tsx

### Key Finding: @radix-ui/react-focus-scope
- Imported in Layout.tsx but **NOT listed in package.json dependencies**
- Resolves as transitive dependency through @radix-ui/themes — fragile

## Files to Update (5)

### 01-project-architecture.md
Changes:
1. Remove `@radix-ui/react-focus-scope` from direct dependency, note it as transitive
2. Add note about `.serena/` directory
3. Add note about `for-reference-only-do-not-use-this-code/` directory
4. Add migration history section (Vite → Next.js, from git log)
5. Add `src/routeSearch.ts` and `src/assets/` to file structure
6. Fix total image count references (130, not 141)
7. Add `src/routeSearch.ts` to dependency graph

### 02-data-model.md
Changes:
1. **FIX CRITICAL: Image counts** — Hoofdstuk 1: 35 (not 34), Hoofdstuk 5: 44 (not 56), Total: 130 (not 141)
2. Fix pie chart data
3. Fix percentage calculations
4. Fix exact translation count: ~42 (not 38)
5. Fix replacement pairs count: ~86 (not 76)
6. Add note: `src` and `preview` currently point to the same path (no separate canonical asset)

### 03-state-management.md
Changes:
1. **FIX: Remove claim that ErrorBoundary is used in Providers.tsx** — it's not used anywhere
2. Add observation: `imageNotesMapAtom` has no validation layer unlike `imageStatusMapAtom`
3. Fix image count references (130, not 141)
4. Note `activeVersionAtom` reset via `onOpenAutoFocus` callback

### 04-routing-url-state.md
Changes:
1. Add `not-found.tsx` page route documentation
2. Add `/book` → `/` redirect from next.config.ts
3. Document route guard pattern in `[chapterId]/page.tsx` and `[collectionId]/page.tsx`
4. Add mermaid diagram for route resolution flow with validation

### 05-component-architecture.md
Changes:
1. **FIX: Remove claim that ErrorBoundary is used in Providers.tsx**
2. Note `DigiFileCard` is a **local component** defined inside `DigiFilesView.tsx`, not a separate file
3. Add `useDocumentTitle` hook usage across views
4. Add `not-found.tsx` to component hierarchy
5. Fix lightbox scope count (130 images, not 141)

## Files to Create (5)

### 06-styling-css-architecture.md
Content plan:
- Design tokens (CSS custom properties) — 50+ variables organized by category
- Layout system (app-layout, sidebar, header, page-content)
- Responsive breakpoints: 480px, 768px, 1024px, 1200px
- Component CSS patterns (cards, grids, lightbox)
- Mermaid diagrams: CSS layer structure, responsive breakpoint flow, design token categories
- Custom scrollbar styling, selection color
- Radix UI theme integration (CSS variable overrides for Dialog overlay)

### 07-hooks-utility-patterns.md
Content plan:
- 5 hooks: useSurfaceSearchState, useSyncedImageId, useLightboxOpener, useDocumentTitle, useImageStatuses
- 4 utility modules: predicates.ts, imageHelpers.ts, typeGuards.ts, statusConfig.ts
- routeSearch.ts as bridge between hooks and URL
- Mermaid diagrams: hook dependency graph, predicate composition flow, type guard decision tree
- Pattern analysis: factory functions, composition over inheritance, read-only data flow

### 08-accessibility-ux.md
Content plan:
- Skip link implementation ("Naar hoofdinhoud")
- Focus management: trap (FocusScope in mobile sidebar), restore (lightbox close, mobile sidebar close)
- ARIA attributes inventory: labels, roles, pressed states, hidden elements
- Keyboard navigation: lightbox arrow keys, sidebar toggle, tab order
- Semantic HTML: nav elements, headings hierarchy, main content landmark
- `useDocumentTitle` for per-route page titles
- Mermaid diagrams: focus flow, keyboard navigation map, ARIA coverage matrix

### 09-lightbox-system.md
Content plan:
- Dialog architecture (full-viewport Radix Dialog)
- Navigation: wrap-around modulo, filtered scope, text-input guard
- Version switching (regular/optimized/print) with SegmentedControl
- Metadata panel layout and data binding
- Status editing via Jotai factory atoms
- Notes persistence
- Focus management: openAutoFocus reset, closeAutoFocus restore
- Mermaid diagrams: component anatomy, navigation flow, state machine, focus lifecycle

### 10-observations-recommendations.md
Content plan:
- ErrorBoundary is defined but never used — wire it into Providers.tsx
- `@radix-ui/react-focus-scope` missing from package.json
- `imageNotesMapAtom` lacks validation (unlike status map)
- README still references Vite — needs update
- `src` and `preview` paths are identical — no separate canonical asset
- Tailwind v4 `@import "tailwindcss"` + custom CSS coexistence strategy
- Potential for Next.js Image component optimization
- DigiFileCard defined locally vs ImageCard as separate file — consistency
- `useDeferredValue` performance pattern analysis
- Mermaid diagrams: issue severity matrix, recommendation priority flow
