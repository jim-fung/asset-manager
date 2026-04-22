# Image Asset Manager

A React + TypeScript review workspace for Winston van der Bok book assets and related digital file collections.

## What It Does

- Browse book images by chapter and open them in a review-focused lightbox
- Browse external digi-file collections from preview-ready assets
- Track per-image status and notes in localStorage
- Keep review navigation scoped to the visible result set instead of jumping to hidden images

## Local Development

```bash
npm install
npm run dev
```

Open the local Next.js URL shown in the terminal (usually http://localhost:3000).

## Scripts

- `npm run dev` starts the Next.js development server
- `npm run build` type-checks and builds the app
- `npm run lint` runs ESLint

## Data Model

- Book assets live in [src/data/imageData.ts](/Users/jim/Documents/projects/image-asset-manager/src/data/imageData.ts)
- Digi-file collections live in [src/data/digiFilesData.ts](/Users/jim/Documents/projects/image-asset-manager/src/data/digiFilesData.ts)
- Every asset now exposes:
  - `preview` for dashboard and grid thumbnails
  - `src` for the canonical served asset
  - `versions` for optional optimized and print-ready variants in the lightbox

## Asset Storage

This repo now stores preview-ready assets directly under:

- `public/previews/book`
- `public/previews/digi-files/<collection-id>`

If you add new images, prepare them before copying them into those folders. This repo no longer keeps the larger source-image bundle or an in-repo preview-generation step.

## State and Persistence

- Review state is stored in localStorage via Jotai:
  - `iam-status-map`
  - `iam-notes-map`
- Lightbox navigation context is ephemeral and follows the visible result set that opened it

## Verification Checklist

Before shipping changes, run:

```bash
npm run lint
npm run build
```

Then verify:

- Chapter search and status filters still constrain lightbox next/previous navigation
- Digi-file browsing stays inside the visible selection, including All Collections
- Mobile review keeps filters, view mode, status editing, and notes available
- Grid and lightbox both load the preview asset set unless explicit alternate variants are added later
