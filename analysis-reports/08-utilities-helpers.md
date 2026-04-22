# Utilities & Helper Functions Report

## Executive Summary

The Image Asset Manager maintains a clean utility layer with **4 focused modules** totaling ~170 lines of code. These utilities provide type-safe predicates for filtering, single-source-of-truth configuration for status metadata, runtime type guards for URL validation, and pure helper functions for image-related computations. The design emphasizes functional programming patterns, immutability, and type safety.

---

## Utility Module Dependency Graph

```mermaid
graph TB
    subgraph "Data Types"
        T1[imageData.ts<br/>ImageStatus, ImageAsset]
    end

    subgraph "Utility Modules"
        U1[predicates.ts<br/>Filtering logic]
        U2[statusConfig.ts<br/>Status metadata]
        U3[typeGuards.ts<br/>Runtime validation]
        U4[imageHelpers.ts<br/>Image computations]
    end

    subgraph "Consumers"
        C1[ChapterView]
        C2[ImageCard]
        C3[ImageLightbox]
        C4[Sidebar]
        C5[OverviewDashboard]
        C6[routeSearch.ts]
        C7[derivedAtoms.ts]
        C8[atoms.ts]
    end

    T1 --> U1
    T1 --> U2
    T1 --> U3
    T1 --> U4
    U1 --> C1
    U2 --> C2
    U2 --> C3
    U2 --> C4
    U3 --> C3
    U3 --> C6
    U3 --> C8
    U4 --> C1
    U4 --> C2
    U4 --> C3
    U4 --> C5
    U4 --> C7
```

---

## Module Breakdown

### 1. predicates.ts — Functional Filtering

```mermaid
graph TB
    subgraph "Predicate Types"
        P1["Predicate<T> = (item: T) => boolean"]
    end

    subgraph "Combinator"
        C1["allOf(...preds)<br/>Returns: Predicate<T>"] --> C2["preds.every(p => p(item))"]
    end

    subgraph "Image Predicates"
        I1["matchesQuery(query)<br/>Returns: Predicate<ImageAsset>"] --> I2["Search filename, caption,<br/>section, description, alt"]
        I3["matchesStatus(status, statusMap)<br/>Returns: Predicate<ImageAsset>"] --> I4["Compare effective status"]
    end

    P1 --> C1
    P1 --> I1
    P1 --> I3
```

#### `allOf` Combinator

```typescript
export const allOf = <T>(...preds: Predicate<T>[]): Predicate<T> =>
  (item) => preds.every((p) => p(item));
```

The `allOf` combinator enables **composable filtering**:

```typescript
// In ChapterView
allChapterImages.filter(
  allOf(matchesQuery(deferredSearchQuery), matchesStatus(status, statusMap))
);
```

Both predicates must pass for an image to be included. This pattern is extensible — additional predicates can be added without modifying existing ones.

#### `matchesQuery`

| Aspect | Detail |
|--------|--------|
| **Fields searched** | `filename`, `caption`, `section`, `description`, `alt` |
| **Case handling** | Lowercase comparison |
| **Empty query** | Pass-through (returns `true`) |
| **Trimming** | Query is trimmed before comparison |

```typescript
export const matchesQuery = (query: string): Predicate<ImageAsset> => (img) => {
  if (!query) return true;
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    img.filename.toLowerCase().includes(q) ||
    img.caption.toLowerCase().includes(q) ||
    img.section.toLowerCase().includes(q) ||
    (img.description?.toLowerCase().includes(q) ?? false) ||
    (img.alt?.toLowerCase().includes(q) ?? false)
  );
};
```

The `?? false` fallback handles potentially undefined `description` and `alt` fields gracefully.

#### `matchesStatus`

```typescript
export const matchesStatus = (
  status: ImageStatus | null,
  statusMap: Readonly<Record<string, ImageStatus>>,
): Predicate<ImageAsset> => (img) => {
  if (!status) return true;
  const effective = statusMap[img.id] ?? "unset";
  return effective === status;
};
```

| Aspect | Detail |
|--------|--------|
| **Null status** | Pass-through (show all) |
| **Effective status** | Looks up `statusMap[img.id]`, defaults to `"unset"` |
| **Comparison** | Strict equality (`===`) |

---

### 2. statusConfig.ts — Single Source of Truth

```mermaid
graph TB
    subgraph "Core Config"
        C1["statusConfig<br/>Record<ImageStatus, { label, color }>"] --> C2["approved → Goedgekeurd / green"]
        C1 --> C3["review → Te beoordelen / amber"]
        C1 --> C4["needs-replacement → Vervangen / red"]
        C1 --> C5["unset → Niet ingesteld / gray"]
    end

    subgraph "Derived Arrays"
        D1["statusFilterOptions<br/>(includes null/'Alles')"] --> D2["For filter pill buttons"]
        D3["statusSelectOptions<br/>(no null)"] --> D4["For Select dropdowns"]
        D5["validStatuses<br/>Set<ImageStatus>"] --> D6["For URL param validation"]
    end

    C1 --> D1
    C1 --> D3
    C1 --> D5
```

#### `satisfies` Pattern

```typescript
export const statusConfig = {
  approved: { label: "Goedgekeurd", color: "green" as const },
  review: { label: "Te beoordelen", color: "amber" as const },
  "needs-replacement": { label: "Vervangen", color: "red" as const },
  unset: { label: "Niet ingesteld", color: "gray" as const },
} as const satisfies Record<ImageStatus, { label: string; color: string }>;
```

The `satisfies` operator ensures:
1. All `ImageStatus` keys are present (completeness check)
2. Values have the correct shape (`{ label: string; color: string }`)
3. Literal types are preserved (`"green"` not `string`)

#### Usage Chain

```mermaid
sequenceDiagram
    participant Config as statusConfig
    participant Filter as statusFilterOptions
    participant UI as ChapterView
    participant Card as ImageCard
    participant Lightbox as ImageLightbox

    Config->>Filter: Derive filter options
    Filter->>UI: Render filter pill buttons
    UI->>Config: Get label/color for active state

    Config->>Card: Get label/color for status badge
    Card->>Card: Display Radix Badge with color

    Config->>Lightbox: Get label for Select options
    Lightbox->>Lightbox: Render Select.Content items
```

---

### 3. typeGuards.ts — Runtime Validation

```mermaid
graph TB
    subgraph "Type Predicate Functions"
        T1["isImageStatus(value: string)<br/>value is ImageStatus"] --> T2["Check against<br/>IMAGE_STATUSES array"]
        T3["isImageVersion(value: string)<br/>value is ImageVersion"] --> T4["Check against<br/>IMAGE_VERSIONS array"]
    end

    subgraph "Usage Contexts"
        U1[URL param parsing] --> T1
        U2[Lightbox version tabs] --> T3
        U3[localStorage validation] --> T1
    end
```

#### Implementation

```typescript
const IMAGE_STATUSES: readonly string[] = ["approved", "review", "needs-replacement", "unset"];
const IMAGE_VERSIONS: readonly string[] = ["regular", "optimized", "print"];

export function isImageStatus(value: string): value is ImageStatus {
  return (IMAGE_STATUSES as readonly string[]).includes(value);
}

export function isImageVersion(value: string): value is ImageVersion {
  return (IMAGE_VERSIONS as readonly string[]).includes(value);
}
```

#### Type Predicate Benefits

```typescript
// Without type predicate
const rawStatus = searchParams.get("status");
if (rawStatus === "approved" || rawStatus === "review" || ...) {
  // Type is still string | null
}

// With type predicate
if (rawStatus && isImageStatus(rawStatus)) {
  // Type is narrowed to ImageStatus
  const status: ImageStatus = rawStatus;
}
```

Type predicates enable TypeScript's **control flow narrowing**, eliminating the need for manual type assertions.

#### Consumption Points

| Function | Used By | Purpose |
|----------|---------|---------|
| `isImageStatus` | `routeSearch.ts` | Validate URL `?status=` param |
| `isImageStatus` | `atoms.ts` | Validate corrupted localStorage data |
| `isImageStatus` | `ImageLightbox.tsx` | Validate Select dropdown value |
| `isImageVersion` | `ImageLightbox.tsx` | Validate version tab value |

---

### 4. imageHelpers.ts — Image Computations

```mermaid
graph TB
    subgraph "Pure Functions"
        F1["resolveStatus(id, statusMap)<br/>→ ImageStatus"] --> F2["statusMap[id] ?? 'unset'"]
        F3["getImageAltText(img)<br/>→ string"] --> F4["img.alt || img.description ||<br/>img.caption || img.filename"]
        F5["computeStatusCounts(items, statusMap)<br/>→ Record<ImageStatus, number>"] --> F6["Iterate + count + Object.freeze"]
    end
```

#### `resolveStatus`

```typescript
export const resolveStatus = (
  id: string,
  statusMap: Readonly<Record<string, ImageStatus>>,
): ImageStatus => statusMap[id] ?? "unset";
```

The canonical function for resolving an image's effective status. Used in virtually every component that displays status information.

#### `getImageAltText`

```typescript
export const getImageAltText = (img: ImageAsset): string =>
  img.alt || img.description || img.caption || img.filename;
```

Provides **graceful degradation** for alt text:
1. `alt` — Most specific accessibility text
2. `description` — Detailed description
3. `caption` — Short caption
4. `filename` — Guaranteed fallback

#### `computeStatusCounts`

```typescript
export const computeStatusCounts = (
  items: readonly { readonly id: string }[],
  statusMap: Readonly<Record<string, ImageStatus>>,
): Readonly<Record<ImageStatus, number>> => {
  const counts: Record<ImageStatus, number> = {
    approved: 0, review: 0, "needs-replacement": 0, unset: 0
  };
  for (const item of items) {
    const s = resolveStatus(item.id, statusMap);
    counts[s] = (counts[s] ?? 0) + 1;
  }
  return Object.freeze(counts);
};
```

| Aspect | Detail |
|--------|--------|
| **Input abstraction** | Accepts `readonly { readonly id: string }[]`, not `ImageAsset[]` |
| **Completeness** | Initializes all 4 status counters to 0 |
| **Safety** | `(counts[s] ?? 0) + 1` handles unexpected status values |
| **Immutability** | Returns `Object.freeze(counts)` |
| **Time complexity** | O(n) single pass |

---

## Predicate Composition Flow

```mermaid
sequenceDiagram
    participant View as ChapterView
    participant allOf as allOf()
    participant mq as matchesQuery()
    participant ms as matchesStatus()
    participant Images as allChapterImages

    View->>allOf: allOf(matchesQuery("zonnebloem"), matchesStatus("approved", statusMap))
    allOf-->>View: combinedPredicate

    View->>Images: filter(combinedPredicate)
    Images->>combinedPredicate: Call with image1
    combinedPredicate->>mq: Test image1
    mq-->>combinedPredicate: true
    combinedPredicate->>ms: Test image1
    ms-->>combinedPredicate: false
    combinedPredicate-->>Images: false (rejected)

    Images->>combinedPredicate: Call with image52
    combinedPredicate->>mq: Test image52
    mq-->>combinedPredicate: true
    combinedPredicate->>ms: Test image52
    ms-->>combinedPredicate: true
    combinedPredicate-->>Images: true (accepted)
```

---

## Cross-Module Data Flow

```mermaid
graph LR
    subgraph "Type Guards"
        A1[isImageStatus] --> B1[routeSearch.ts]
        A1 --> B2[atoms.ts]
        A2[isImageVersion] --> B3[ImageLightbox.tsx]
    end

    subgraph "Status Config"
        C1[statusConfig] --> D1[ImageCard.tsx<br/>Badge color]
        C1 --> D2[ChapterView.tsx<br/>Filter labels]
        C1 --> D3[ImageLightbox.tsx<br/>Select options]
        C1 --> D4[Sidebar.tsx<br/>Stat labels]
    end

    subgraph "Image Helpers"
        E1[resolveStatus] --> F1[ImageCard.tsx]
        E1 --> F2[OverviewDashboard.tsx]
        E1 --> F3[ImageLightbox.tsx]
        E2[getImageAltText] --> F4[ImageCard.tsx]
        E2 --> F5[OverviewDashboard.tsx]
        E2 --> F6[ImageLightbox.tsx]
        E3[computeStatusCounts] --> F7[derivedAtoms.ts]
    end

    subgraph "Predicates"
        G1[matchesQuery] --> H1[ChapterView.tsx]
        G2[matchesStatus] --> H1
        G3[allOf] --> H1
    end
```

---

## Functional Programming Patterns

```mermaid
graph LR
    subgraph "Patterns Used"
        A["Higher-Order Functions<br/>matchesQuery returns Predicate"] --> B["Composable, testable"]
        C["Type Predicates<br/>isImageStatus"] --> D["Runtime validation + TS narrowing"]
        E["Pure Functions<br/>All utilities"] --> F["No side effects, deterministic"]
        G["Immutable Returns<br/>Object.freeze, Readonly<T>"] --> H["Prevent accidental mutation"]
        I["Default Values<br/>?? 'unset', ?? 0"] --> J["Defensive programming"]
    end
```

---

## Testability Assessment

| Module | Pure Functions | Side Effects | Mocking Needed | Test Priority |
|--------|---------------|-------------|----------------|---------------|
| `predicates.ts` | ✅ All | None | None | High |
| `statusConfig.ts` | ✅ All | None | None | Medium |
| `typeGuards.ts` | ✅ All | None | None | High |
| `imageHelpers.ts` | ✅ All | None | None | High |

All utility modules are **100% pure** and require zero mocking, making them ideal candidates for unit testing.

### Example Test Cases

```typescript
// predicates.ts
describe("matchesQuery", () => {
  const img = { filename: "test.jpg", caption: "Sunflower", section: "Art", description: "", alt: "" };

  it("matches filename", () => {
    expect(matchesQuery("test")(img)).toBe(true);
  });

  it("is case-insensitive", () => {
    expect(matchesQuery("SUNFLOWER")(img)).toBe(true);
  });

  it("returns true for empty query", () => {
    expect(matchesQuery("")(img)).toBe(true);
  });
});

// imageHelpers.ts
describe("computeStatusCounts", () => {
  it("counts all statuses correctly", () => {
    const items = [{ id: "a" }, { id: "b" }, { id: "c" }];
    const statusMap = { a: "approved", b: "review" };
    const counts = computeStatusCounts(items, statusMap);
    expect(counts).toEqual({ approved: 1, review: 1, "needs-replacement": 0, unset: 1 });
  });
});
```
