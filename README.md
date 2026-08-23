# 🛰️ Orbital Atlas

An interactive 3D globe of the global space exploration ecosystem — agencies, startups, manufacturers, R&D labs, launch sites, ground stations, and investors — rendered in a dark space theme with glowing pins, great-circle relationship arcs, and a guided tour that flies around the planet.

**Live: [shankardeniro.github.io/orbital-atlas](https://shankardeniro.github.io/orbital-atlas/)**

![Stack](https://img.shields.io/badge/stack-Vite%20%2B%20TypeScript%20%2B%20D3-blue)
[![Deploy](https://github.com/shankardeniro/orbital-atlas/actions/workflows/deploy.yml/badge.svg)](https://github.com/shankardeniro/orbital-atlas/actions/workflows/deploy.yml)

## Running it

```bash
npm install
npm run dev        # dev server at http://localhost:5173
```

```bash
npm run build      # type-checks and builds to dist/
npm run preview    # serve the production build
```

No backend, no API keys, no tile servers — the world geometry ships with the app (`world-atlas` TopoJSON), so it works fully offline once built.

## Deployment

Every push to `main` builds and deploys the site to [GitHub Pages](https://shankardeniro.github.io/orbital-atlas/) via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). `npm run build:single` additionally produces `dist/orbital-atlas-artifact.html`, a fully self-contained single file used for the Claude Artifact deployment.

## Using the app

- **Drag to spin the globe**, scroll/pinch to zoom; the globe idles with a slow rotation until you interact. **Click a country** to fly to it and see its summary stats.
- **Click a pin** to open the profile panel: description, key programs, milestone timeline, achievements, and clickable connections.
- Selecting an organization draws **glowing great-circle arcs** to its related entities (suppliers, launch sites, investors, partners), clipped at the horizon. Hover an arc to read the relationship.
- **Numbered circles are clusters** — click to zoom in and split them apart.
- **Search** by name, city, country, or tag; **filter** by country; **toggle categories** in the legend.
- **✦ Take the tour** flies you through ten global highlights; **⌂** resets the view; **Esc** closes panels.
- Works with touch gestures on mobile; the profile panel becomes a bottom sheet.

## Architecture

| Path | Role |
| --- | --- |
| `DESIGN.md` + `src/styles/tokens.css` | **The design system** — visual identity, tokens (color, type, spacing, shape, motion), and component specs. Change look-and-feel by editing tokens, guided by DESIGN.md. |
| `src/data/` | **The dataset** (~150 curated entities). `entities.ts` holds the founding set and aggregates the per-category files (`agencies.ts`, `startups.ts`, `manufacturers.ts`, `rnd.ts`, `launch-sites.ts`, `ground-stations.ts`, `investors.ts`) — add new entries to the file for their category. |
| `scripts/validate-data.mjs` | Dataset linter: unique ids, resolvable relations, valid coords, and country names that exist in the map geometry. Run `node scripts/validate-data.mjs` after editing data. |
| `src/types.ts` | Schema (`SpaceEntity`), category colors, relationship phrasing. |
| `src/map.ts` | `MapView`: orthographic globe (drag-rotate, wheel/pinch zoom, animated camera flights), dual-resolution country layers (110m while moving, 50m at rest), pin clustering with far-side culling, great-circle arcs, touch-tap handling. |
| `src/ui/` | `panel` (profile), `legend`, `search`, `stats` (country card), `tooltip`. |
| `src/tour.ts` | Guided tour stops and controls. |
| `src/main.ts` | App state and wiring between map and UI, starfield backdrop. |

**Stack choice:** Vite + TypeScript + D3 (`d3-geo` orthographic projection + `d3-zoom`/`d3-drag`), no framework. A single-view globe app doesn't need component-tree overhead; D3 gives full control over the custom dark cartography, constant-size pins (drawn in screen space, culled on the far side, recomputed per frame — which is also what makes clustering cheap), and great-circle arcs. Both country detail layers stay mounted permanently and visibility-toggle between 110m (while the globe moves) and 50m (at rest) — rebinding DOM mid-gesture would make browsers swallow clicks. The data layer is one typed module, so swapping it for an API later touches nothing else.

## Adding or editing entities

Append an object to the array in the per-category file (e.g. a new startup goes in `src/data/startups.ts`):

```ts
{
  id: 'my-org',                    // unique slug
  name: 'My Org',
  category: 'startup',             // agency | startup | manufacturer | rnd |
                                   // launch-site | ground-station | investor
  country: 'India',                // display name
  // mapName: '…'                  // only if world-atlas names it differently
                                   // (e.g. country: 'United States' needs
                                   //  mapName: 'United States of America')
  city: 'Bengaluru',
  coords: [77.59, 12.97],          // [longitude, latitude]
  founded: 2020,
  description: ['Para 1…', 'Para 2…'],
  programs: [{ name: 'X', blurb: '…' }],
  milestones: [{ year: 2022, text: '…' }],
  achievements: ['…'],
  tags: ['smallsats'],
  website: 'https://…',
  related: [{ id: 'isro', type: 'partner-of' }],
}
```

Relation types (directed, shown from both sides automatically): `supplier-of`, `launches-from`, `invested-in`, `partner-of`, `operates`, `tracks-for`.

Everything else — pins, clustering, search, stats, filters, arcs — picks the new entry up automatically. The clustering and search are built to stay smooth at hundreds of entities. After editing, run `node scripts/validate-data.mjs` to catch typos in ids, relations, coordinates, or country names.

To add a **tour stop**, add `{ id, caption }` to `STOPS` in `src/tour.ts`.

## Data notes

The dataset is hand-curated with real facts, coordinates, and dates (accurate to mid-2025). At ~150 entities across ~40 countries it is a representative map of the global space ecosystem, not an exhaustive census — every entry aims for accuracy over completeness, and phrasing stays conservative where exact figures move quickly (funding rounds, launch counts).
