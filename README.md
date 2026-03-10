# Baby Allergen Tracker

A progressive web app for tracking baby allergen introduction schedules based on ASCIA 2026 guidelines. Helps parents manage when different allergens are introduced, monitor exposure frequency, track reactions, and maintain detailed logs.

## Features

- **9 major allergens tracked** — peanut, tree nuts, milk, egg, wheat, soy, sesame, fish, shellfish
- **Smart status dashboard** — cards sorted by urgency (overdue, never logged, due soon, on track)
- **Exposure logging** — record date, food, amount, notes, and reaction severity (none/mild/moderate/severe)
- **Saved foods library** — save frequently used foods with their allergen associations for quick logging
- **Calendar view** — month-by-month view of all logged exposures with reaction indicators
- **Detail view** — per-allergen history, editable frequency targets, clinical notes, and allergen guides
- **Weekly summary** — progress banner showing allergens introduced this week vs. last week
- **Quick log strip** — one-tap logging of saved foods from the dashboard
- **Dark/light/system themes** — full theme support with CSS custom properties
- **Offline support** — service worker caching, offline banner, auto-sync on reconnect
- **Installable PWA** — add to home screen on iOS and Android
- **Pull-to-refresh** — native-feeling gesture to refresh data
- **Swipe-to-delete** — swipe entries to remove them
- **Accessible** — focus traps in modals, ARIA labels, keyboard navigation, 44px touch targets

## Tech Stack

| Layer     | Technology                       |
|-----------|----------------------------------|
| Frontend  | React 19, Vite 7                 |
| Backend   | Node.js, Express 5               |
| Storage   | File-based JSON + localStorage   |
| Build     | Multi-stage Docker               |
| PWA       | Service Worker, Web App Manifest |

## Quick Start

### Docker (recommended)

```bash
docker compose up -d --build
```

The app will be available at `http://localhost:3004`.

### Local Development

```bash
# Install dependencies
npm install

# Start the Express API server
npm start

# In a separate terminal, start the Vite dev server
npm run dev
```

- Frontend dev server: `http://localhost:5173`
- API server: `http://localhost:3000`

### Build for Production

```bash
npm run build     # Build frontend to dist/
npm start         # Serve with Express
```

## Project Structure

```
allergen-tracker/
├── src/
│   ├── App.jsx                          # Root component, routing, dashboard
│   ├── main.jsx                         # Entry point, context providers
│   ├── index.css                        # Global styles, theming, animations
│   ├── components/
│   │   ├── AddEntryModal.jsx            # Bottom sheet for logging exposures
│   │   ├── AllergenCard.jsx             # Status card on dashboard
│   │   ├── BottomNav.jsx                # Tab navigation (Dashboard, Calendar, Foods)
│   │   ├── CalendarView.jsx             # Month calendar with exposure indicators
│   │   ├── DetailView.jsx               # Single allergen detail + history
│   │   ├── FAB.jsx                      # Floating action button (+ log)
│   │   ├── FoodsView.jsx                # Saved foods management
│   │   ├── InfoModal.jsx                # Allergen clinical guide modal
│   │   ├── OfflineBanner.jsx            # Offline status indicator
│   │   ├── QuickLogStrip.jsx            # Quick-log saved foods from dashboard
│   │   ├── ReactionSummary.jsx          # Reaction severity breakdown
│   │   ├── SkeletonDashboard.jsx        # Loading placeholder
│   │   ├── SwipeableEntry.jsx           # Swipe-to-delete entry row
│   │   ├── WeeklyBanner.jsx             # Weekly progress summary
│   │   └── shared/
│   │       ├── AllergenChip.jsx         # Toggle chip for allergen selection
│   │       ├── BackBtn.jsx              # Back navigation button
│   │       ├── IconBtn.jsx              # Generic icon button
│   │       ├── Label.jsx                # Form label (with optional required marker)
│   │       ├── Pill.jsx                 # Small rounded tag
│   │       ├── SectionHeading.jsx       # Uppercase section title
│   │       ├── SeverityBadge.jsx        # Reaction severity indicator
│   │       └── SeverityPicker.jsx       # Severity radio group
│   ├── hooks/
│   │   ├── useAllergenData.js           # Data loading, saving, sync
│   │   ├── useModalA11y.js              # Focus trap + keyboard nav for modals
│   │   ├── useOnlineStatus.js           # Online/offline detection
│   │   └── usePullToRefresh.js          # Pull-to-refresh touch handling
│   ├── utils/
│   │   ├── date.js                      # today(), daysSince(), startOfWeek()
│   │   ├── status.js                    # getStatus() — allergen urgency calc
│   │   └── storage.js                   # localStorage + server sync
│   ├── constants/
│   │   └── allergens.js                 # Allergen definitions, severity levels, helpers
│   └── contexts/
│       ├── ThemeContext.jsx              # Theme provider (light/dark/system)
│       └── ToastContext.jsx             # Toast notification provider
├── public/
│   ├── manifest.json                    # PWA manifest
│   ├── sw.js                            # Service worker
│   ├── icon.svg                         # App icon (SVG)
│   ├── icon-192.png                     # Android icon
│   ├── icon-512.png                     # Splash icon
│   └── apple-touch-icon.png             # iOS icon
├── server.js                            # Express API server
├── Dockerfile                           # Multi-stage Docker build
├── docker-compose.yml                   # Docker Compose config
├── vite.config.js                       # Vite configuration
└── package.json                         # Dependencies and scripts
```

## API Endpoints

### `GET /api/data`

Returns all app data.

```json
{
  "frequencies": {
    "peanut": 4,
    "egg": 4,
    "milk": 7
  },
  "logs": {
    "peanut": [
      {
        "id": "a1b2c3",
        "date": "2026-03-09",
        "food": "Peanut butter on toast",
        "amount": "1 tsp",
        "notes": "",
        "foodId": null,
        "severity": "none"
      }
    ]
  },
  "foods": [
    {
      "id": "d4e5f6",
      "name": "Everything spread",
      "allergens": ["peanut", "treenuts", "sesame"]
    }
  ]
}
```

### `POST /api/data`

Saves the full data object. Validates shape before writing. Uses a write mutex to prevent race conditions.

**Request body:** Same structure as `GET /api/data` response.

**Response:** `{ "success": true }` or `400`/`500` error.

### `GET /api/health`

Health check. Returns `{ "status": "healthy", "timestamp": "..." }`.

## Data Model

### Allergen IDs

`peanut`, `treenuts`, `milk`, `egg`, `wheat`, `soy`, `sesame`, `fish`, `shellfish`

### Log Entry

| Field      | Type                | Description                          |
|------------|---------------------|--------------------------------------|
| `id`       | `string`            | Unique identifier                    |
| `date`     | `string`            | `YYYY-MM-DD` format                  |
| `food`     | `string`            | What was eaten                       |
| `amount`   | `string`            | Optional portion description         |
| `notes`    | `string`            | Optional observations                |
| `foodId`   | `string \| null`    | Reference to saved food, if any      |
| `severity` | `string`            | `none`, `mild`, `moderate`, `severe` |

### Saved Food

| Field      | Type       | Description                        |
|------------|------------|------------------------------------|
| `id`       | `string`   | Unique identifier                  |
| `name`     | `string`   | Food name                          |
| `allergens`| `string[]` | Array of allergen IDs              |

### Status Calculation

Each allergen's status is calculated based on days since last exposure vs. the target frequency:

| Status      | Condition                              |
|-------------|----------------------------------------|
| `never`     | No logs exist                          |
| `good`      | Days since last log <= 60% of target   |
| `soon`      | Days since last log < target           |
| `overdue`   | Days since last log >= target          |

### Default Frequencies

| Allergen   | Default Target |
|------------|----------------|
| Peanut     | Every 4 days   |
| Egg        | Every 4 days   |
| Tree Nuts  | Every 7 days   |
| Milk       | Every 7 days   |
| Wheat      | Every 7 days   |
| Soy        | Every 10 days  |
| Sesame     | Every 10 days  |
| Fish       | Every 14 days  |
| Shellfish  | Every 14 days  |

## Storage

Data is stored in two locations and kept in sync:

1. **Server** — `data/store.json` (file-based, persisted via Docker volume)
2. **Browser** — `localStorage` key `baby-allergen-tracker-v5`

On startup, the app loads from localStorage first (instant), then fetches from the server and merges. Changes are debounced (800ms) and written to both locations. The server POST uses a write mutex to prevent concurrent file writes.

## Theming

Three modes: **light**, **dark**, and **system** (follows OS preference). Stored in localStorage as `allergen-theme`. Toggle via the sun/moon button on the dashboard.

All colors use CSS custom properties defined in `src/index.css`, scoped to `:root` (light) and `[data-theme="dark"]` (dark). This includes status colors, severity colors, backgrounds, text, borders, and component-specific tokens (FAB, toast, nav, skeleton, etc.).

## PWA / Offline

- **Service Worker** (`public/sw.js`): Caches static assets on install. API calls use network-first strategy with cache fallback. Static assets use cache-first.
- **Manifest** (`public/manifest.json`): Standalone display, portrait orientation, app icons for Android and iOS.
- **Offline banner**: Shown when the device loses connectivity.
- **Auto-sync**: Changes made offline are saved to localStorage and synced to the server when back online.

## Docker

### Dockerfile

Multi-stage build:
1. **Builder stage** — `node:22-alpine`, installs all deps, runs `vite build`
2. **Runtime stage** — `node:22-alpine`, copies `dist/` and `server.js`, installs production deps only

### docker-compose.yml

```yaml
services:
  allergen-tracker:
    build: .
    ports:
      - "3004:3000"
    volumes:
      - ./data:/app/data
    restart: unless-stopped
```

- Exposed on port **3004**
- `./data` is mounted to persist `store.json` across container restarts

## Environment Variables

| Variable         | Default                                          | Description                                |
|------------------|--------------------------------------------------|--------------------------------------------|
| `PORT`           | `3000`                                           | Server listening port                      |
| `NODE_ENV`       | (unset)                                          | Set to `production` to disable CORS        |
| `ALLOWED_ORIGIN` | `http://localhost:5173,http://localhost:3000`     | Dev CORS origins (comma-separated)         |

## Disclaimer

This tracker is a personal tool, not medical advice. Allergen introduction guidelines are based on ASCIA 2026. If your child has a known allergy, severe eczema, or has had a reaction, consult your GP or allergist before continuing introduction.
