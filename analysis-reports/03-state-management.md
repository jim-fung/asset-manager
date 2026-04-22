# State Management Report

## Executive Summary

State management in the Image Asset Manager is built entirely on **Jotai**, an atomic state library for React. The architecture follows a two-tier pattern: **primitive atoms** for raw state persistence (backed by `localStorage`) and **derived atoms** for computed values and focused per-entity access. No Redux, Context API, or Zustand is used. All state is client-side; there is no server state or API integration.

---

## State Architecture Overview

```mermaid
graph TB
    subgraph "Persistence Layer"
        L1["localStorage: iam-status-map"]
        L2["localStorage: iam-notes-map"]
    end

    subgraph "Primitive Atoms"
        A1["rawStatusMapAtom<br/>atomWithStorage"]
        A2["imageStatusMapAtom<br/>validated read"]
        A3["imageNotesMapAtom<br/>atomWithStorage"]
        A4["lightboxTriggerIdAtom"]
        A5["sidebarCollapsedAtom"]
        A6["mobileSidebarOpenAtom"]
        A7["mobileSidebarTriggerIdAtom"]
        A8["activeVersionAtom"]
    end

    subgraph "Derived Atoms"
        D1["statusCountsAtom<br/>computed from status map"]
        D2["imageStatusAtom(id)<br/>factory function"]
        D3["imageNotesAtom(id)<br/>factory function"]
    end

    subgraph "Consumers"
        C1[OverviewDashboard]
        C2[ChapterView]
        C3[ImageLightbox]
        C4[Sidebar]
        C5[Layout]
    end

    L1 --> A1
    L2 --> A3
    A1 --> A2
    A2 --> D1
    A2 --> D2
    A3 --> D3
    A2 --> C1
    A2 --> C2
    A2 --> C3
    D1 --> C1
    D1 --> C4
    D2 --> C3
    D3 --> C3
    A4 --> C3
    A5 --> C5
    A6 --> C5
    A7 --> C5
    A8 --> C3
```

---

## Primitive Atoms

### Persistence Atoms

```mermaid
sequenceDiagram
    participant UI as User Action
    participant Component as React Component
    participant Atom as imageStatusMapAtom
    participant RawAtom as rawStatusMapAtom
    participant Storage as localStorage

    UI->>Component: Set status to "approved"
    Component->>Atom: set({ ...map, [id]: "approved" })
    Atom->>RawAtom: Forward update
    RawAtom->>Storage: Serialize & save "iam-status-map"
    Storage-->>RawAtom: Acknowledge
    RawAtom-->>Atom: Notify subscribers
    Atom-->>Component: Re-render with new state
```

#### `imageStatusMapAtom`

| Aspect | Implementation |
|--------|---------------|
| Storage Key | `iam-status-map` |
| Default Value | `{}` |
| Validation | `isValidStatusMap()` checks every value against `isImageStatus()` |
| Corruption Handling | Returns `{}` if localStorage contains invalid data |
| Write Pattern | Spread update: `{ ...current, [id]: value }` |

```typescript
export const imageStatusMapAtom = atom<Record<string, ImageStatus>, [Record<string, ImageStatus>], void>(
  (get) => {
    const raw = get(rawStatusMapAtom);
    return isValidStatusMap(raw) ? raw : {};
  },
  (_get, set, next) => {
    set(rawStatusMapAtom, next);
  },
);
```

This is a **read-write derived atom** that wraps the raw storage atom with validation. The validation runs on every read, ensuring corrupted localStorage entries never propagate to the UI.

#### `imageNotesMapAtom`

| Aspect | Implementation |
|--------|---------------|
| Storage Key | `iam-notes-map` |
| Default Value | `{}` |
| Validation | None (strings are forgiving) |
| Write Pattern | Spread update |

### UI State Atoms

| Atom | Purpose | Persisted? |
|------|---------|-----------|
| `lightboxTriggerIdAtom` | Restore focus after lightbox closes | No |
| `sidebarCollapsedAtom` | Desktop sidebar collapsed state | No |
| `mobileSidebarOpenAtom` | Mobile drawer open state | No |
| `mobileSidebarTriggerIdAtom` | Restore focus after mobile sidebar closes | No |
| `activeVersionAtom` | Current version tab in lightbox | No |

---

## Derived Atoms

### `statusCountsAtom`

```mermaid
flowchart LR
    A[images<br/>readonly ImageAsset[]] --> C[computeStatusCounts]
    B[imageStatusMapAtom] --> C
    C --> D[statusCountsAtom]
    D --> E[Record<ImageStatus, number>]

    style E fill:#e0f2fe
```

Computes per-status counters across the **entire image registry**. The derived atom only recomputes when `imageStatusMapAtom` changes, thanks to Jotai's dependency tracking.

```typescript
export const statusCountsAtom = atom((get) => {
  const statusMap = get(imageStatusMapAtom);
  return computeStatusCounts(images, statusMap);
});
```

### Factory Functions: `imageStatusAtom()` and `imageNotesAtom()`

```mermaid
graph TB
    subgraph "Factory Pattern"
        F1["imageStatusAtom(id: string)"] --> A1["atom(get => statusMap[id] ?? 'unset')"]
        F1 --> A2["atom(set => spread update)"]
        F2["imageNotesAtom(id: string)"] --> A3["atom(get => notesMap[id] ?? '')"]
        F2 --> A4["atom(set => spread update)"]
    end

    subgraph "Usage Pattern"
        U1["useMemo(() => imageStatusAtom(id), [id])"] --> U2["useAtom(statusAtom)"]
    end

    F1 --> U1
```

**Critical Design Decision**: These are **plain factory functions**, NOT Jotai's `atomFamily`. The caller MUST memoize the returned atom with `useMemo`:

```typescript
const statusAtom = useMemo(() => imageStatusAtom(selectedImage?.id ?? ""), [selectedImage?.id]);
const [currentStatus, setCurrentStatus] = useAtom(statusAtom);
```

Without `useMemo`, a new atom instance would be created on every render, losing state and causing unnecessary re-renders.

---

## State Flow in ImageLightbox

```mermaid
sequenceDiagram
    participant User as User
    participant Lightbox as ImageLightbox
    participant VersionAtom as activeVersionAtom
    participant StatusFactory as imageStatusAtom(id)
    participant NotesFactory as imageNotesAtom(id)
    participant StatusMap as imageStatusMapAtom
    participant NotesMap as imageNotesMapAtom
    participant Storage as localStorage

    User->>Lightbox: Click image card
    Lightbox->>Lightbox: selectedImage changes
    Lightbox->>VersionAtom: Reset to "regular"
    Lightbox->>StatusFactory: Create focused atom (useMemo)
    Lightbox->>NotesFactory: Create focused atom (useMemo)
    Lightbox->>StatusFactory: Read current status
    StatusFactory->>StatusMap: Read full map
    StatusMap-->>StatusFactory: Return status or "unset"
    StatusFactory-->>Lightbox: Display status

    User->>Lightbox: Change status in dropdown
    Lightbox->>StatusFactory: set(newStatus)
    StatusFactory->>StatusMap: Spread update
    StatusMap->>Storage: Persist to localStorage
    StatusMap-->>Lightbox: Notify subscribers (re-render)

    User->>Lightbox: Type note
    Lightbox->>NotesFactory: set(noteText)
    NotesFactory->>NotesMap: Spread update
    NotesMap->>Storage: Persist to localStorage
    NotesMap-->>Lightbox: Notify subscribers
```

---

## Status Lifecycle

```mermaid
stateDiagram-v2
    [*] --> unset: Initial state
    unset --> approved: Review complete
    unset --> review: Flag for review
    unset --> needs_replacement: Flag for replacement
    approved --> review: Re-open review
    approved --> needs_replacement: Degrade
    review --> approved: Approve
    review --> needs_replacement: Reject
    needs_replacement --> review: Re-evaluate
    needs_replacement --> approved: Accept replacement
    needs_replacement --> unset: Clear status
    review --> unset: Clear status
    approved --> unset: Clear status
```

---

## Sidebar Stats Integration

```mermaid
flowchart TB
    subgraph "Data Sources"
        A[images.length] --> D[Sidebar Stats]
        B[statusCountsAtom] --> D
        C[statusConfig] --> D
    end

    subgraph "Displayed Stats"
        D --> E["Totaal beelden: 141"]
        D --> F["Goedgekeurd: N"]
        D --> G["Te beoordelen: N"]
        D --> H["Vervangen: N"]
    end

    B --> F
    B --> G
    B --> H
```

The sidebar displays four statistics derived from two sources:
1. **Static**: Total image count from `images.length`
2. **Dynamic**: Per-status counts from `statusCountsAtom` (reactive to status changes)

---

## State Consistency Guarantees

| Guarantee | Mechanism |
|-----------|-----------|
| **No stale data** | Jotai's dependency graph ensures derived atoms recompute when dependencies change |
| **No corruption** | `isValidStatusMap()` validates localStorage on every read |
| **No lost updates** | `atomWithStorage` handles serialization/deserialization |
| **Focus restoration** | `lightboxTriggerIdAtom` + `mobileSidebarTriggerIdAtom` capture trigger element IDs |
| **URL sync** | `useSurfaceSearchState` keeps React state and URL params in sync |

---

## Comparison: Why Jotai?

```mermaid
graph LR
    subgraph "Redux/Zustand"
        A["Single store<br/>dispatch/actions"] --> B["Boilerplate heavy<br/>for small apps"]
    end

    subgraph "Context API"
        C["Provider tree<br/>useContext"] --> D["Re-renders all consumers<br/>on any change"]
    end

    subgraph "Jotai (Chosen)"
        E["Atomic state<br/>Atoms as primitives"] --> F["Fine-grained<br/>subscriptions"]
        F --> G["Minimal boilerplate<br/>Built-in persistence"]
        G --> H["Derived atoms<br/>for computed state"]
    end
```

Jotai was chosen because:
1. **Minimal boilerplate** — atoms are simple declarations
2. **Fine-grained reactivity** — only components subscribing to changed atoms re-render
3. **Built-in persistence** — `atomWithStorage` handles localStorage with one line
4. **Derived state** — computed values are first-class citizens
5. **TypeScript native** — excellent type inference throughout
