# Routing & URL State Management Report

## Executive Summary

The Image Asset Manager implements a **sophisticated URL-as-state system** that persists application state in the browser's URL search parameters. This enables deep-linking to any view configuration (search queries, filters, selected images, view modes) and provides full back-button support. The system is surface-aware, meaning different pages persist different subsets of state.

---

## URL State Architecture

```mermaid
graph TB
    subgraph "Route Surfaces"
        S1["overview<br/>/"]
        S2["book<br/>/book/:chapterId"]
        S3["digi<br/>/digi-files/:collectionId?"]
    end

    subgraph "State Fields"
        F1["q: string<br/>search query"]
        F2["status: ImageStatus | null<br/>status filter"]
        F3["view: 'grid' | 'list'<br/>view mode"]
        F4["imageId: string | null<br/>selected image"]
    end

    subgraph "Serialization Logic"
        L1["readLooseRouteSearchState()<br/>Parse + Validate"]
        L2["createSurfaceSearchParams()<br/>Serialize per surface"]
        L3["buildSurfaceSearchString()<br/>Build query string"]
    end

    subgraph "React Integration"
        H1["useSurfaceSearchState()<br/>URL ↔ State sync hook"]
        H2["useSyncedImageId()<br/>Validate + cleanup imageId"]
    end

    S1 --> H1
    S2 --> H1
    S3 --> H1
    F1 --> L1
    F2 --> L1
    F3 --> L1
    F4 --> L1
    L1 --> L2
    L2 --> L3
    H1 --> L1
    H1 --> L2
    H1 --> H2
```

---

## Surface-Aware State Serialization

```mermaid
flowchart TD
    A[RouteSearchState] --> B{Which Surface?}

    B -->|overview| C["Only imageId persisted<br/>q, status, view ignored"]
    B -->|book| D["q + status + view + imageId<br/>All fields persisted"]
    B -->|digi| E["q + view + imageId<br/>status not applicable"]

    C --> F[createSurfaceSearchParams]
    D --> F
    E --> F

    F --> G["URLSearchParams → URL"]
```

### Serialization Rules by Surface

| State Field | `overview` | `book` | `digi` |
|------------|------------|--------|--------|
| `q` (search) | ❌ Not persisted | ✅ Persisted if non-empty | ✅ Persisted if non-empty |
| `status` | ❌ Not applicable | ✅ Persisted if set | ❌ Not applicable |
| `view` | ❌ Default (grid) | ✅ Persisted if not grid | ✅ Persisted if not grid |
| `imageId` | ✅ Always persisted | ✅ Always persisted | ✅ Always persisted |

```typescript
export function createSurfaceSearchParams(surface: RouteSurface, state: RouteSearchState): URLSearchParams {
  const nextSearchParams = new URLSearchParams();

  if (surface !== "overview" && state.q) {
    nextSearchParams.set("q", state.q);
  }

  if (surface === "book" && state.status) {
    nextSearchParams.set("status", state.status);
  }

  if (surface !== "overview" && state.view !== "grid") {
    nextSearchParams.set("view", state.view);
  }

  if (state.imageId) {
    nextSearchParams.set("image", state.imageId);
  }

  return nextSearchParams;
}
```

---

## URL State Machine

```mermaid
stateDiagram-v2
    [*] --> GridView: Load page (no params)
    [*] --> GridViewWithImage: ?image=xyz
    [*] --> ListView: ?view=list
    [*] --> FilteredView: ?status=approved
    [*] --> SearchView: ?q=searchterm
    [*] --> ComplexView: ?q=term&status=review&view=list&image=xyz

    GridView --> SearchView: Type query
    GridView --> FilteredView: Click status filter
    GridView --> ListView: Toggle view mode
    GridView --> GridViewWithImage: Click image

    SearchView --> GridView: Clear query
    FilteredView --> GridView: Clear filter
    ListView --> GridView: Toggle back to grid
    GridViewWithImage --> GridView: Close lightbox

    SearchView --> SearchViewWithImage: Click image
    FilteredView --> FilteredViewWithImage: Click image
    ListView --> ListViewWithImage: Click image
```

---

## `useSurfaceSearchState` Hook Flow

```mermaid
sequenceDiagram
    participant Component as ChapterView / DigiFilesView
    participant Hook as useSurfaceSearchState
    participant Next as Next.js Router
    participant URL as Browser URL
    participant Parse as readLooseRouteSearchState
    participant Serialize as createSurfaceSearchParams

    Note over Component,URL: Initial Load
    URL->>Next: Page load with query params
    Next->>Hook: searchParams from useSearchParams()
    Hook->>Parse: Parse raw params
    Parse->>Parse: Validate status (isImageStatus)
    Parse->>Parse: Validate view (validViews.has)
    Parse-->>Hook: Return normalized RouteSearchState

    Note over Component,URL: Canonicalization Effect
    Hook->>Serialize: Create canonical params for surface
    Serialize-->>Hook: URLSearchParams
    Hook->>Hook: Compare current vs canonical
    alt URLs differ
        Hook->>Next: router.replace(canonicalURL)
        Next->>URL: Update URL silently
    end

    Note over Component,URL: User Interaction
    Component->>Hook: setRouteState({ q: "new query" })
    Hook->>Serialize: Merge update + serialize
    Serialize-->>Hook: New URLSearchParams
    Hook->>Next: router.push(newURL)
    Next->>URL: Update URL (adds history entry)
    URL->>Next: Location change
    Next->>Hook: New searchParams
    Hook-->>Component: Return updated state
```

### Key Behaviors

1. **Canonicalization**: On mount, the hook compares the current URL against the canonical form for the surface. If they differ (e.g., invalid params, unnecessary defaults), it silently replaces the URL via `router.replace()`.

2. **Push vs Replace**: `setRouteState()` accepts an `options.replace` flag. Search text changes use `replace` (don't pollute history), while image selection uses `push` (back button closes lightbox).

3. **Validation**: `readLooseRouteSearchState()` validates all incoming params:
   - `status`: Must be a valid `ImageStatus` via `isImageStatus()`
   - `view`: Must be `"grid"` or `"list"`
   - `imageId`: Trimmed, empty becomes `null`
   - `q`: Trimmed

---

## `useSyncedImageId` Validation Flow

```mermaid
flowchart TB
    A[URL contains ?image=xyz] --> B{Is xyz in current items?}
    B -->|Yes| C[selectedImageId = xyz]
    B -->|No| D[selectedImageId = null]
    D --> E[useEffect cleanup]
    E --> F[setRouteState({ imageId: null }, { replace: true })]
    F --> G[Remove stale ?image param from URL]

    style C fill:#dcfce7
    style D fill:#fee2e2
```

This hook solves a critical UX problem: when filters change and the selected image is no longer in the visible results, the lightbox should close automatically rather than showing an orphaned image.

```typescript
export function useSyncedImageId(
  items: readonly { readonly id: string }[],
  imageId: string | null,
  setRouteState: (updates: Partial<RouteSearchState>, opts?: SetRouteStateOptions) => void,
): string | null {
  const isValid = imageId ? items.some((i) => i.id === imageId) : false;
  const selectedImageId = isValid ? imageId : null;

  useEffect(() => {
    if (imageId && !selectedImageId) {
      setRouteState({ imageId: null }, { replace: true });
    }
  }, [imageId, selectedImageId, setRouteState]);

  return selectedImageId;
}
```

---

## URL State in Practice

### Example URL Evolution

```mermaid
graph LR
    A["/book/hoofdstuk-1"] --> B["/book/hoofdstuk-1?view=list"]
    B --> C["/book/hoofdstuk-1?view=list&status=review"]
    C --> D["/book/hoofdstuk-1?view=list&status=review&q=zonnebloem"]
    D --> E["/book/hoofdstuk-1?view=list&status=review&q=zonnebloem&image=image52"]
    E --> F["/book/hoofdstuk-1?view=list&status=review&q=zonnebloem"]

    style A fill:#e0f2fe
    style E fill:#dcfce7
```

| Action | URL Change | History |
|--------|-----------|---------|
| Navigate to chapter | `/book/hoofdstuk-1` | Push |
| Switch to list view | `?view=list` | Push |
| Filter by "review" | `&status=review` | Push |
| Search "zonnebloem" | `&q=zonnebloem` | Replace |
| Open image | `&image=image52` | Push |
| Close lightbox (back) | Remove `&image=image52` | Back button |

---

## Sidebar Navigation with State Preservation

```mermaid
sequenceDiagram
    participant User as User
    participant Sidebar as Sidebar
    participant Link as Next.js Link
    participant URL as URL

    User->>Sidebar: Click chapter link
    Sidebar->>Sidebar: readLooseRouteSearchState(currentParams)
    Sidebar->>Sidebar: buildSurfaceSearchString("book", { ...state, imageId: null })
    Note over Sidebar: Preserves q, status, view<br/>Clears imageId for new page
    Sidebar->>Link: href="/book/chapter-id?q=...&status=..."
    Link->>URL: Navigate with preserved filters
```

The sidebar preserves the user's current search/filter state when navigating between chapters or collections, but intentionally clears `imageId` since the selected image is page-specific.

---

## Benefits of URL-as-State

```mermaid
graph LR
    A["URL-as-State Design"] --> B["Shareable Links"]
    A --> C["Back Button Support"]
    A --> D["No Server Session"]
    A --> E["Refresh Resilience"]
    A --> F["Bookmarkable Views"]

    B --> B1["Send filtered view<br/>to colleague via URL"]
    C --> C1["Back button closes<br/>lightbox naturally"]
    D --> D1["100% client-side<br/>static hosting compatible"]
    E --> E1["Page refresh preserves<br/>all view state"]
    F --> F1["Bookmark specific<br/>search + filter combo"]
```

---

## Route Surface Comparison

```mermaid
graph TB
    subgraph "Overview (/ )"
        O1["No search (static display)"]
        O2["No status filter"]
        O3["No view toggle"]
        O4["Lightbox opens over all images"]
    end

    subgraph "Book (/book/:id )"
        B1["Search within chapter"]
        B2["Status filter pills"]
        B3["Grid/list toggle"]
        B4["Lightbox scoped to filtered results"]
    end

    subgraph "Digi (/digi-files/:id? )"
        D1["Search filenames"]
        D2["No status filter"]
        D3["Grid/list toggle"]
        D4["Lightbox scoped to filtered files"]
    end
```
