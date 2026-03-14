# Implementation Plan: "New Templates" Section with Higher Prominence

## Overview
Add a dedicated "New Templates" section that automatically features recently added templates with higher visual prominence on the homepage. Templates added within a configurable time window (default: 14 days) are automatically promoted to this section.

## Architecture Decisions
- **No schema changes needed** — the existing `createdAt` timestamp on bookmarks is sufficient to determine "newness"
- **Configurable** — the "new" threshold (days) is defined in `directory.config.ts` so site owners can tune it
- **Automatic** — no manual intervention; templates age out of the "New" section naturally
- **Non-destructive** — new templates still appear in the main grid; the "New" section is an additional prominent display above it

## Files to Change

### 1. `directory.config.ts` — Add configuration
Add a `newTemplates` config option:
```ts
newTemplates: {
  days: 14,          // Templates newer than this many days are "new"
  label: "New",      // Badge label
  sectionTitle: "Recently Added",
}
```

### 2. `lib/data.ts` — Add `getNewBookmarks()` query
Add a new data function that fetches bookmarks created within the configured time window, ordered by `createdAt DESC`. This avoids filtering in JS and keeps the query efficient.

### 3. `components/new-templates-section.tsx` — New component (the section)
A new component that renders the "New Templates" section:
- Section header with title ("Recently Added") and a sparkle/clock icon
- Horizontally scrollable row or larger-card grid (2 columns max) for prominence
- Each card uses an enhanced version of `BookmarkCard` with a "New" badge
- Subtle gradient background or accent border to visually distinguish from the main grid

### 4. `components/bookmark-card.tsx` — Add `isNew` prop
Add an optional `isNew` boolean prop:
- When `true`, renders a "New" badge (green/blue accent) in the status indicators area (top-right, alongside favorite/archived badges)
- No other visual changes to the card itself — the prominence comes from placement in the new section

### 5. `app/page.tsx` — Integrate the new section
- Import and call `getNewBookmarks()` alongside existing data fetches
- Render `<NewTemplatesSection>` between the email form and the category filter
- Pass the new bookmarks with their `isNew` flag
- In the main grid, also mark bookmarks that are "new" so they show the badge there too

## Detailed Component Design

### `NewTemplatesSection`
```
┌─────────────────────────────────────────────────────┐
│  ✨ Recently Added                                  │
│                                                     │
│  ┌──────────────────┐  ┌──────────────────┐        │
│  │   [OG Image]     │  │   [OG Image]     │  →     │
│  │   NEW            │  │   NEW            │        │
│  │   Title          │  │   Title          │        │
│  │   Description    │  │   Description    │        │
│  │   [Category]     │  │   [Category]     │        │
│  │   [View] [Visit] │  │   [View] [Visit] │        │
│  └──────────────────┘  └──────────────────┘        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

- Uses a 2-column grid on desktop (larger cards = more prominence)
- Falls back to 1-column on mobile
- Shows max 4 new templates (most recent first)
- Has a subtle accent background (`bg-accent/5` with a border)

### `BookmarkCard` "New" badge
- Green accent badge: `bg-green-500/10 text-green-600` with a sparkle icon
- Positioned alongside existing favorite/archived badges in top-right

## Implementation Order

1. **Update `directory.config.ts`** — add new templates config
2. **Add `getNewBookmarks()` to `lib/data.ts`** — data layer
3. **Update `BookmarkCard`** — add `isNew` prop and badge
4. **Create `NewTemplatesSection` component** — the featured section
5. **Update `app/page.tsx`** — wire everything together
