# Component Architecture Report

## Executive Summary

The Image Asset Manager follows a **layered component architecture** built on Next.js App Router patterns. The application shell (`Layout`, `Sidebar`, `Header`) provides persistent navigation and chrome, while view components (`OverviewDashboard`, `ChapterView`, `DigiFilesView`) render page-specific content. A shared `ImageLightbox` component serves as a universal overlay for inspecting assets across all views. All interactive components are client components; the root layout is server-rendered.

---

## Component Hierarchy Tree

```mermaid
graph TB
    subgraph "Root"
        R1[RootLayout<br/>Server Component]
    end

    subgraph "Providers"
        P1[JotaiProvider]
        P2[Theme<br/>Radix UI]
    end

    subgraph "Shell"
        S1[Layout<br/>"use client"]
        S2[Sidebar<br/>"use client"]
        S3[Header<br/>"use client"]
    end

    subgraph "Pages"
        PG1[HomePage<br/>/]
        PG2[ChapterPage<br/>/book/:id]
        PG3[DigiFilesPage<br/>/digi-files/:id?]
        PG4[NotFoundPage<br/>404]
    end

    subgraph "Views"
        V1[OverviewDashboard<br/>"use client"]
        V2[ChapterView<br/>"use client"]
        V3[DigiFilesView<br/>"use client"]
    end

    subgraph "Shared Components"
        C1[ImageLightbox<br/>"use client"]
        C2[ImageCard<br/>memo]
        C3[DigiFileCard<br/>memo]
        C4[ConditionalTooltip]
        C5[Icons<br/>pure functions]
        C6[ErrorBoundary<br/>class component]
    end

    R1 --> P1
    P1 --> P2
    P2 --> S1
    S1 --> S2
    S1 --> S3
    S1 --> PG1
    S1 --> PG2
    S1 --> PG3
    S1 --> PG4
    PG1 --> V1
    PG2 --> V2
    PG3 --> V3
    V1 --> C1
    V1 --> C2
    V2 --> C1
    V2 --> C2
    V3 --> C1
    V3 --> C3
    S2 --> C4
    S2 --> C5
    S3 --> C5
    C1 --> C5
```

---

## Application Shell Architecture

```mermaid
graph LR
    subgraph "Layout Component"
        A[app-layout CSS class] --> B[skip-link]
        A --> C[sidebar-overlay]
        A --> D[FocusScope]
        D --> E[app-sidebar]
        E --> F[mobile-close-btn]
        E --> G[Sidebar content]
        A --> H[app-main]
        H --> I[page content]
    end

    subgraph "State-Driven Classes"
        J[mobile-sidebar-open] --> K[Show overlay + translate sidebar]
        L[sidebar-collapsed] --> M[304px → 88px width]
    end

    J --> A
    L --> A
```

### Layout Responsibilities

| Feature | Implementation |
|---------|---------------|
| **Skip Link** | Accessibility-first: "Naar hoofdinhoud" jumps to `#main-content` |
| **Mobile Drawer** | Fixed sidebar with overlay, `FocusScope` traps focus when open |
| **Desktop Collapse** | CSS class toggle transitions width (304px ↔ 88px) |
| **Focus Restoration** | `useEffect` returns focus to trigger button when mobile sidebar closes |

---

## Sidebar Component Deep Dive

```mermaid
graph TB
    subgraph "Sidebar Sections"
        S1[sidebar-header<br/>Brand mark + logo]
        S2[sidebar-nav<br/>Navigation links]
        S3[sidebar-stats<br/>Status counters]
    end

    subgraph "Navigation Groups"
        N1["Bibliotheek<br/>Overzicht"]
        N2["Hoofdstukken<br/>9 chapter links"]
        N3["Digitale bestanden<br/>All collections + 5 collections"]
    end

    subgraph "Active State Logic"
        A1[pathname === '/' ?]
        A2[pathname === '/book/:id' ?]
        A3[pathname === '/digi-files/:id' ?]
    end

    subgraph "Link Search Preservation"
        L1[readLooseRouteSearchState]
        L2[buildSurfaceSearchString]
        L3[href = /path?preservedParams]
    end

    S2 --> N1
    S2 --> N2
    S2 --> N3
    N1 --> A1
    N2 --> A2
    N3 --> A3
    N1 --> L1
    N2 --> L1
    N3 --> L1
    L1 --> L2
    L2 --> L3
```

### Sidebar Features

| Feature | Behavior |
|---------|----------|
| **Collapsible Desktop** | IconButton toggles `sidebarCollapsedAtom`; labels/counts hide |
| **Tooltips** | `ConditionalTooltip` shows on collapsed sidebar hover |
| **Active Indicators** | Gradient background + border on active route |
| **Counters** | Image/file counts displayed as pill badges |
| **Stats Footer** | Total + per-status counts with color coding |
| **Mobile Close** | Close button inside sidebar, overlay click also closes |

---

## Header Component: Slot Pattern

```mermaid
graph LR
    subgraph "Header Structure"
        H1[header-leading] --> H2[mobile-menu-btn]
        H1 --> H3[desktop-sidebar-btn]
        H1 --> H4[header-titles<br/>title + subtitle]
        H5[header-actions] --> H6["Children slot<br/>search / filters / toggles"]
    end

    subgraph "Used In ChapterView"
        C1[TextField.Root<br/>search input]
        C2[filter-pills<br/>status buttons]
        C3[SegmentedControl<br/>grid/list toggle]
    end

    subgraph "Used In DigiFilesView"
        D1[TextField.Root<br/>search input]
        D2[SegmentedControl<br/>grid/list toggle]
    end

    H6 --> C1
    H6 --> C2
    H6 --> C3
    H6 --> D1
    H6 --> D2
```

The Header uses a **slot pattern** (`children` prop) for the action area, allowing each view to inject its own controls without Header knowing about specific filter implementations.

---

## View Components Comparison

```mermaid
graph TB
    subgraph "OverviewDashboard"
        O1[overview-hero<br/>Stats + copy]
        O2[chapter-cards-grid<br/>9 chapter cards]
        O3[overview-images-grid<br/>141 thumbnail buttons]
        O4[ImageLightbox<br/>all images]
    end

    subgraph "ChapterView"
        C1[view-summary<br/>Chapter info + counts]
        C2[header-actions<br/>Search + filters + view toggle]
        C3[image-grid<br/>Filtered ImageCards]
        C4[ImageLightbox<br/>filtered images only]
    end

    subgraph "DigiFilesView"
        D1[view-summary<br/>Collection info + counts]
        D2[header-actions<br/>Search + view toggle]
        D3[image-grid<br/>Filtered DigiFileCards]
        D4[ImageLightbox<br/>filtered files only]
    end
```

| Feature | OverviewDashboard | ChapterView | DigiFilesView |
|---------|------------------|-------------|---------------|
| **Search** | ❌ No | ✅ Yes | ✅ Yes |
| **Status Filters** | ❌ No | ✅ Pills | ❌ No |
| **View Toggle** | ❌ No | ✅ Grid/List | ✅ Grid/List |
| **Lightbox Scope** | All 141 images | Filtered chapter images | Filtered digi files |
| **Hero Section** | ✅ Rich hero | ✅ View summary | ✅ View summary |
| **Cards** | Chapter cards | ImageCards | DigiFileCards |

---

## ImageLightbox State Machine

```mermaid
stateDiagram-v2
    [*] --> Closed: Initial state
    Closed --> Open: Click image card
    Open --> NavigatingPrev: ArrowLeft / Click prev
    Open --> NavigatingNext: ArrowRight / Click next
    Open --> VersionSwitching: Click version tab
    Open --> EditingStatus: Select from dropdown
    Open --> EditingNotes: Type in textarea
    Open --> Closed: Click close / Esc / Back button

    NavigatingPrev --> Open: New image loaded
    NavigatingNext --> Open: New image loaded
    VersionSwitching --> Open: New version displayed
    EditingStatus --> Open: Status saved to localStorage
    EditingNotes --> Open: Notes saved to localStorage
```

### Lightbox Component Structure

```mermaid
graph LR
    subgraph "Dialog.Root"
        D1[Dialog.Content<br/>100vw × 100dvh] --> D2[lightbox-content]
        D1 --> D3[lightbox-panel]
    end

    subgraph "Image Side"
        I1[close button]
        I2[prev button]
        I3[next button]
        I4[version bar<br/>SegmentedControl]
        I5[main image]
    end

    subgraph "Metadata Panel"
        M1[filename title]
        M2[chapter, section]
        M3[description, caption]
        M4[position counter]
        M5[version availability]
        M6[status Select]
        M7[notes TextArea]
    end

    D2 --> I1
    D2 --> I2
    D2 --> I3
    D2 --> I4
    D2 --> I5
    D3 --> M1
    D3 --> M2
    D3 --> M3
    D3 --> M4
    D3 --> M5
    D3 --> M6
    D3 --> M7
```

### Lightbox Navigation Rules

| Condition | Behavior |
|-----------|----------|
| `items.length > 1` | Prev/Next buttons visible |
| `items.length === 1` | No navigation buttons |
| `currentIndex` | `(currentIndex + delta + items.length) % items.length` |
| Arrow keys | Ignored when focus is in text input |
| Version reset | Always resets to "regular" on new image open |
| Focus restore | Returns focus to trigger element on close |

---

## Card Components: ImageCard vs DigiFileCard

```mermaid
classDiagram
    class ImageCard {
        +image: ImageAsset
        +onClick: () => void
        +triggerId?: string
        +memo
        --
        +status dot indicator
        +filename
        +description/caption
        +Badge with status label
        +section label
    }

    class DigiFileCard {
        +file: DigiFile
        +onClick: () => void
        +triggerId: string
        +memo
        --
        +lazy loaded image
        +error placeholder fallback
        +TIFF-JPG badge (if tiff)
        +filename
        +collection label
        +format label
    }

    ImageCard --> ImageAsset : displays
    DigiFileCard --> DigiFile : displays
```

| Aspect | ImageCard | DigiFileCard |
|--------|-----------|--------------|
| **Memoization** | `memo()` | `memo()` |
| **Status Display** | Color dot + Radix Badge | TIFF-JPG badge only |
| **Error Handling** | None (assumes preview exists) | `onError` → placeholder |
| **Meta Row** | Status badge + section | Collection + format |
| **Image Source** | `image.preview` | `file.preview` |

---

## Component Rendering Performance

```mermaid
graph LR
    subgraph "Optimization Strategies"
        A["memo() on cards<br/>ImageCard, DigiFileCard"] --> B["Prevent re-render<br/>when parent updates"]
        C["useDeferredValue(q)"] --> D["Non-blocking<br/>search filtering"]
        E["useMemo for atoms"] --> F["Stable atom instances<br/>in ImageLightbox"]
        G["lazy loading images"] --> H["Defer offscreen<br/>image loads"]
    end
```

### Memo Usage

```typescript
export const ImageCard = memo(function ImageCard({ image, onClick, triggerId }: ImageCardProps) { ... });

const DigiFileCard = memo(function DigiFileCard({ file, onClick, triggerId }: DigiFileCardProps) { ... });
```

Both card components use `memo()` to prevent re-renders when parent components update (e.g., search query changes). Since cards receive stable `image`/`file` objects and callback props, memoization is effective.

### `useDeferredValue` for Search

```typescript
const deferredSearchQuery = useDeferredValue(q);

const filteredImages = useMemo(
  () => allChapterImages.filter(allOf(matchesQuery(deferredSearchQuery), matchesStatus(status, statusMap))),
  [allChapterImages, deferredSearchQuery, status, statusMap],
);
```

The search query is deferred, allowing the UI to remain responsive while filtering large lists.

---

## Error Handling

```mermaid
graph TB
    subgraph "Error Boundary"
        E1[ErrorBoundary<br/>class component] --> E2{hasError?}
        E2 -->|No| E3[Render children]
        E2 -->|Yes| E4[Error UI card]
        E4 --> E5["Er is iets misgegaan"]
        E4 --> E6[Herladen button]
    end

    subgraph "Error Scenarios"
        S1[React render error] --> E1
        S2[Component crash] --> E1
    end
```

The `ErrorBoundary` is a traditional class component (required for `getDerivedStateFromError`). It catches errors and displays a Dutch error message with a reload button. Currently used in `Providers.tsx` via `Suspense`.

---

## Data Flow Patterns

```mermaid
graph TB
    subgraph "Top-Down Data Flow"
        A1[Data Layer<br/>imageData.ts, digiFilesData.ts] --> B1[Store Layer<br/>atoms.ts, derivedAtoms.ts]
        B1 --> C1[Hook Layer<br/>useImageStatuses, useSurfaceSearchState]
        C1 --> D1[View Layer<br/>OverviewDashboard, ChapterView, DigiFilesView]
        D1 --> E1[Component Layer<br/>ImageCard, ImageLightbox]
    end

    subgraph "Bottom-Up Events"
        E2[User clicks card] --> D2[onClick handler]
        D2 --> C2[setRouteState({ imageId })]
        C2 --> B2[URL updated]
        B2 --> A2[Lightbox opens]
    end
```

The architecture follows **unidirectional data flow** with Jotai atoms as the single source of truth. Events bubble up through callbacks, and state changes flow down through atom subscriptions.
