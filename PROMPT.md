# Prompt: Interactive World Map of the Global Space Exploration Ecosystem

Build a polished, interactive **web application**: a click-through, zoomable world map that visualizes the global space exploration ecosystem — who is doing what, where. The experience should feel exploratory and delightful for the general public, students, and industry/investor audiences alike.

## Core Concept

A world map the user can **drag, zoom, and click through**. Clicking a country smoothly zooms into it and reveals **pins at real city/facility locations** (e.g., Sriharikota, Cape Canaveral, Kourou, Baikonur, Bengaluru, Hawthorne). Clicking a pin opens a rich profile panel about that organization or site. The user should be able to wander the globe and serendipitously discover the space ecosystem of any region.

## Entity Types on the Map

Each entity is a pin, color-coded and icon-differentiated by category, with a legend that can toggle categories on/off:

1. **National space agencies** — NASA, ESA, ISRO, CNSA, JAXA, Roscosmos, KARI, UAE Space Agency, etc., including their major centers (e.g., JPL, Johnson Space Center, Vikram Sarabhai Space Centre).
2. **Space startups & private companies** — launch providers, satellite operators, in-space services (SpaceX, Rocket Lab, Skyroot, Agnikul, Astroscale, Planet Labs, etc.).
3. **Manufacturers & component suppliers** — engine makers, satellite bus builders, avionics, materials, and precision component suppliers.
4. **R&D institutions & universities** — research labs, institutes, and universities with significant space programs.
5. **Launch sites & spaceports** — physical launch facilities as their own category.
6. **Ground stations & tracking networks** — deep space network antennas, TT&C stations.
7. **Investors & space-focused VCs** — venture funds and accelerators funding space startups.
8. **Missions & programs** — notable missions (Apollo, Chandrayaan, Artemis, Tianwen, Hayabusa) are NOT standalone pins; they are browsable items attached to their parent organization's profile.

## Data

- **Phase 1 (build this now):** a hand-curated **demo dataset of ~30 well-known entities** spanning all categories and at least 10 countries across every continent with space activity. Store it in a clean, well-documented, easily extensible format (e.g., a single JSON/TS data file) with a clear schema.
- **Phase 2 (design for it now, populate later):** the same schema will scale to a **curated dataset of 100–300 entities**. Do not hard-code anything that assumes a small dataset — clustering, search, and filtering must handle hundreds of pins.
- Suggested schema per entity: `id`, `name`, `category`, `country`, `city`, `lat/lng`, `founded`, `description` (2–3 paragraphs), `keyPrograms[]` (missions/products with 1–2 sentence blurbs and key historical milestones/dates), `achievements[]`, `tags[]`, `website`, `relatedEntityIds[]` (with relationship type: supplier-of, launches-from, funded-by, partner-of, tracks-for).
- Data accuracy matters: use real facts, real coordinates, real founding years. If uncertain, prefer well-established facts over speculation.

## Interactions & Features

- **Pan/drag and zoom** with smooth animated transitions; clicking a country animates a fly-to zoom into that country and reveals its pins.
- **Rich profile panel** (slide-in side panel) on pin click: name, category badge, location, founding year, 2–3 paragraph description, key programs/missions with historical milestones, notable achievements, tags, website link, and a "Related" section.
- **Connection lines:** when an entity is selected, draw animated glowing arcs on the map to its related entities (supplier → agency, startup → launch site, VC → portfolio startups, ground station → missions it supports). Arcs are labeled by relationship type on hover.
- **Search & filter:** a search box (by name, city, tag) with autocomplete; filters by category and country. Selecting a search result flies the map to that pin and opens its panel.
- **Category legend:** color-coded, clickable to toggle each category's visibility.
- **Country summary stats:** hovering or selecting a country shows a compact stats card — counts of agencies, startups, suppliers, launch sites, etc. in that country.
- **Guided tour mode:** a "Take the tour" button that flies the camera between 8–10 global highlights (e.g., Kennedy Space Center → Kourou → Sriharikota → Jiuquan → Tanegashima → Baikonur → Rocket Lab NZ) with a short narrated caption for each stop, and next/prev/exit controls.
- **Pin clustering** at low zoom levels so hundreds of pins stay legible.
- Time dimension: the map shows the **current state** of the ecosystem; **historical context lives inside profiles** (milestone timelines per org/mission). No timeline slider needed.

## Visual Design

- **Dark space theme:** deep navy/black basemap, subtle starfield or grid texture, country borders in muted blue-gray, glowing neon-accent pins and arcs. Category colors should be vivid and distinguishable against the dark background (and colorblind-friendly).
- Smooth micro-animations: pin hover effects, panel slide-ins, arc drawing animations, camera fly-tos.
- Typography: clean, modern, slightly technical feel. The app should look like a premium data-visualization product.
- Fully **responsive**: works with mouse on desktop and touch gestures (drag, pinch-zoom, tap) on mobile; the profile panel becomes a bottom sheet on small screens.

## Technical Requirements

- Choose the best-fit modern web stack for an interactive map app of this kind (you decide — e.g., a component framework plus a mature map/visualization library). Justify the choice briefly.
- No backend required for v1: all data ships with the app. Architect the data layer so it could later swap to an API/database without rewriting the UI.
- Performance: 60fps pan/zoom, lazy rendering where sensible, fast initial load.
- Clean, well-organized, commented code; easy for a developer to add new entities by editing the data file alone.
- Accessible: keyboard navigation for search/panel, ARIA labels, sufficient contrast.

## Deliverables

1. The complete, runnable web application with the ~30-entity demo dataset.
2. A README covering: how to run it, the data schema, and exactly how to add/edit entities (Phase 2 expansion).
3. Brief notes on the chosen stack and architecture.

Start by proposing the stack and the data schema, then build the full app.
