# Groundtrack — Design System

The visual identity of Groundtrack: a night-side view of Earth as an instrument you can hold. The name is the concept — a satellite's groundtrack is its path projected onto Earth's surface, and the site projects the whole space ecosystem back onto the globe. The UI floats over the globe as frosted glass; the data provides the color. This document is the source of truth — the tokens in [`src/styles/tokens.css`](src/styles/tokens.css) implement it.

## 1. Principles

1. **The globe is the hero.** UI surfaces are translucent and stay out of the scene's way; nothing competes with the planet for attention.
2. **Color is data.** The seven category hues are the only vivid colors. Chrome (surfaces, borders, text) stays in the blue-grey neutral ramp; the accent blue is reserved for interaction (focus, selection, links, primary actions).
3. **Purposeful motion.** Every animation communicates something — a camera flight, an arc drawing a relationship, a panel arriving. No ambient decoration beyond the idle globe rotation, which stops at first touch.
4. **Balanced density.** Generous enough to feel premium, tight enough to be a tool. All spacing comes from the 4px scale; no ad-hoc values.
5. **One committed theme.** The app is deliberately single-theme dark — a night-side Earth has no light mode. Every color is painted explicitly; nothing inherits from the host.

## 2. Color

### Ground (neutral ramp)

Blue-biased neutrals — never pure grey.

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#060a14` | Page ground (under starfield) |
| `--bg-glow` | `#101a33` | Radial glow at top of page |
| `--land` | `#131d33` | Country fill |
| `--land-hover` | `#1c2a47` | Country hover |
| `--land-active` | `#22335a` | Selected country |
| `--border-map` | `#2a3a5c` | Country borders |

The globe's ocean is a radial gradient (`#14203c → #0b1226 → #070c1a`, light biased upper-left) defined in `map.ts` SVG defs — keep its stops in step with this ramp.

### Text

| Token | Value | Use |
| --- | --- | --- |
| `--text` | `#e8eefa` | Headings, primary UI text |
| `--text-body` | `#c3d2e8` | Reading text in panels |
| `--muted` | `#8ea3c2` | Labels, captions, secondary info |

### Accent (interaction only)

| Token | Value | Use |
| --- | --- | --- |
| `--accent` | `#5aa2ff` | Focus rings, links, section headings, selection, primary buttons |
| `--accent-soft` | `rgba(90,162,255,.14)` | Hover fills, selected-row fills |

The accent is intentionally the same hue as the agency category — the "space blue" is the brand.

### Category spectrum (defined in `src/types.ts` — single source of truth)

| Category | Hex | |
| --- | --- | --- |
| Space agencies | `#5aa2ff` | blue |
| Startups & private | `#ff8c42` | orange |
| Manufacturers & suppliers | `#ffd166` | gold |
| R&D & universities | `#c084fc` | violet |
| Launch sites | `#34d399` | green |
| Ground stations | `#22d3ee` | cyan |
| Investors & VCs | `#f472b6` | pink |

Rules: category colors appear at full saturation only as pins, arcs, dots, and chips. Never as large fills, backgrounds, or body text. Mixed-category clusters use neutral `#9fb4d8`.

## 3. Typography

One family: **[Sora](https://fonts.google.com/specimen/Sora)** (Google Fonts, weights 400/600/700), fallback `-apple-system, 'Segoe UI', Roboto, sans-serif`. Sora's sharp joints and excellent numerals give the product its slightly technical voice without a second face.

| Role | Token | Size / weight / treatment |
| --- | --- | --- |
| Display (brand, panel titles) | `--fs-display` | 21px / 700 |
| Card title (tour, stats) | `--fs-title` | 17px / 700 |
| Subtitle (entity name in tooltip) | `--fs-sub` | 14px / 600 |
| Body (paragraphs, list items) | `--fs-body` | 13.5px / 400 / line-height 1.65 |
| UI (buttons, inputs, rows) | `--fs-ui` | 12.5px / 400–600 |
| Micro label (eyebrows, legend title, section headings) | `--fs-micro` | 11px / 600 / UPPERCASE / letter-spacing `--track-label` (0.12em) |

Rules: section headings inside panels are micro labels in `--accent`. Years and counts use `font-variant-numeric: tabular-nums`. No font sizes outside the scale.

## 4. Space, shape, surfaces

**Spacing** — 4px scale: `4, 8, 12, 16, 20, 24, 32` (`--sp-1…--sp-7`). Panels pad `--sp-5` (20px), cards `--sp-4`, row gaps `--sp-2`/`--sp-3`. Sibling groups use flex/grid `gap`, not stacked margins.

**Shape** — soft language:

| Token | Value | Use |
| --- | --- | --- |
| `--r-control` | 10px | Inputs, buttons, small rows |
| `--r-card` | 12px | Legend, tooltip, relation cards |
| `--r-panel` | 16px | Panels, stats, tour card |
| `--r-pill` | 999px | Reserved for pill moments (currently unused — chips became eyebrows, tags became an inline list) |

**Surfaces** — two frosted-glass elevations over the scene plus one inset:

| Token set | Recipe | Use |
| --- | --- | --- |
| Glass 1 | `--glass-1` `rgba(13,20,38,.85)` + blur 10px + border `--glass-border` `rgba(122,162,247,.18)` | Legend, tooltip, search field |
| Glass 2 | `--glass-2` `rgba(12,18,34,.92)` + blur 16px + border `--glass-border-strong` `rgba(122,162,247,.25)` + `--shadow-card` | Profile panel, stats card, tour card, dropdowns |
| Inset | `--inset` `rgba(8,13,26,.55)` | Rows and relation cards *inside* glass 2 |

## 5. The scene (globe, pins, arcs)

- **Pins**: 5.5px dot in category color, dark `#0a0f1c` stroke, soft glow filter, 16% halo, and an invisible ≥16px-radius hit circle so the true target is at least 32px wide. Selected: 8px, 35% halo with a pulse. Labels appear at zoom ≥ 3.5× (or when selected): 11.5px / 600 with a dark paint-order stroke for legibility — and they are click targets, not just captions. Hovering a pin (dot, halo, or label) brightens the label to white, blooms the halo to 40%, and shows the entity tooltip.
- **Clusters**: dark disc, category-colored (or neutral `#9fb4d8`) 2px ring and count.
- **Arcs**: 1.6px great-circle strokes in the *other* endpoint's category color, drawn with a 1.1s dash animation, glow via drop-shadow.
- **Atmosphere**: soft `--accent` radial glow ring at 8% beyond the limb.

## 6. Motion

| Token | Value | Use |
| --- | --- | --- |
| `--t-fast` | 150ms | Hovers, color/border changes |
| `--t-base` | 250ms | Reveals, toggles |
| `--t-slide` | 300ms | Panel/card entrances |
| `--ease` | `cubic-bezier(.2, 0, 0, 1)` | Everything in CSS |

Sanctioned motion: camera flights (1.5s, `easeCubicInOut`, long hops dip out first), arc draws, panel slide-ins, selected-pin pulse, hover lifts (≤1px), idle globe spin (until first interaction). Nothing else moves. `prefers-reduced-motion` disables the idle spin, pulses, and entrance animations.

## 7. Components

### The eyebrow

The shared heading component for anything category-scoped: an **uncontained uppercase micro-label** (`--fs-micro` / 600 / `--track-label`) led by a **7px glowing dot** (`.chip-dot`, `box-shadow: 0 0 6px`), both in a color set via the `--chip` custom property. One CSS implementation; five homes:

| Surface | `--chip` color |
| --- | --- |
| Profile panel (category line) | The entity's category |
| Stats card group headers | Each group's category (+ muted tabular count) |
| Tour step counter | The current stop's category |
| Cluster chooser title | The cluster's category; `--cat-mixed` when members span categories |
| Legend title | `--cat-mixed` — it indexes every category |

Rule: **dot when category-scoped, dotless when structural.** The panel's section headings ("MILESTONES", "CONNECTIONS") share the same type treatment but stay dotless in `--accent` — that distinction is what keeps the two heading roles readable.

### Surfaces

- **Top bar**: gradient scrim from `--bg` to transparent; brand wordmark Sora 700 with a subtle blue-white gradient; search (glass 1, accent focus ring), country select, tour button (accent gradient fill), reset (glass, icon-only).
- **Legend** (bottom-left, glass 1): eyebrow title, then rows of 10px category dots with soft glow; toggled-off rows drop to 35% opacity.
- **Tooltip** (glass 1): entity name at `--fs-sub`, category dot row, muted hint line. Follows cursor, never intercepts it.
- **Country stats card** (top-left, glass 2): country name at display size, muted total, eyebrow group headers over clickable entity rows (accent-soft hover).
- **Profile panel** (right, glass 2, 420px): category eyebrow → name → meta row → website link → body paragraphs → dotless accent section headings (programs, milestones as an accent-ruled timeline with tabular years, achievements, connections as inset rows with dot + relation phrase, tags as a muted interpunct-separated line — no chrome, echoing the meta row so the panel opens and closes quietly). Bottom sheet ≤ 720px.
- **Cluster chooser** (glass 2 popover at the click point): appears when a clicked cluster's members are too co-located for zooming to ever separate (e.g. KSC / Cape Canaveral) — eyebrow title over clickable entity rows.
- **Tour card** (bottom-center, glass 2): "STOP n OF 10" eyebrow, stop name, caption, Back / Next (primary) / Exit controls.

## 8. Accessibility

- Text ≥ 4.5:1 against glass surfaces (the ramp above satisfies this; don't lighten glass fills without rechecking).
- Every interactive element has a visible `:focus-visible` state: 2px `--accent` ring (pins: white stroke).
- Pins are keyboard-focusable (`tabindex`, Enter to open). Escape closes any panel/tour.
- Hit targets ≥ 32px on touch (pin halos count toward this).
- Category color is never the only signal — every colored dot sits next to a text label.

## 9. Implementation map

| Where | What lives there |
| --- | --- |
| `src/styles/tokens.css` | Every token above (`:root` custom properties) |
| `src/styles.css` | Components, consuming tokens only — no raw hex except documented one-offs |
| `src/types.ts` `CATEGORIES` | Category colors (JS-side source of truth, mirrored as `--cat-*` tokens) |
| `src/map.ts` | Scene styling that must live in JS: ocean/atmosphere gradient defs, pin geometry, glow filter |
| `index.html` | Google Fonts link for Sora (kept by the artifact build) |

Changing a color, radius, or duration = edit `tokens.css`. Changing a category hue = edit `types.ts` *and* the mirror token.
