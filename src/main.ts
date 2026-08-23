import './styles.css';
import { MapView } from './map';
import { ENTITIES } from './data/entities';
import { mapCountryName } from './types';
import type { SpaceEntity } from './types';
import { Tooltip } from './ui/tooltip';
import { Panel } from './ui/panel';
import { Legend } from './ui/legend';
import { Search } from './ui/search';
import { Stats } from './ui/stats';
import { Chooser } from './ui/chooser';
import { Tour } from './tour';

// ────────────────────────── starfield backdrop ──────────────────────────
function drawStarfield(): void {
  const canvas = document.getElementById('starfield') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.scale(dpr, dpr);
  const n = Math.floor((window.innerWidth * window.innerHeight) / 3800);
  for (let i = 0; i < n; i++) {
    const r = Math.random() * 1.1 + 0.2;
    ctx.beginPath();
    ctx.arc(Math.random() * window.innerWidth, Math.random() * window.innerHeight, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200, 220, 255, ${Math.random() * 0.55 + 0.1})`;
    ctx.fill();
  }
}
drawStarfield();
window.addEventListener('resize', drawStarfield);

// ────────────────────────── app state & wiring ──────────────────────────
let countryFilter: string | null = null;
let openCountry: string | null = null; // map (TopoJSON) name of the country whose stats card is open

const isVisible = (e: SpaceEntity): boolean =>
  legend.visible.has(e.category) && (!countryFilter || e.country === countryFilter);

const tooltip = new Tooltip();

const panel = new Panel({
  onNavigate: (e) => selectEntity(e),
  onClose: () => clearSelection(),
});

const stats = new Stats({
  onSelectEntity: (e) => selectEntity(e),
  onClose: () => {
    stats.hide();
    openCountry = null;
    map.highlightCountry(null);
  },
});

const legend = new Legend(() => {
  map.setFilter(isVisible);
  if (selected && !isVisible(selected)) clearSelection();
  if (openCountry) stats.show(openCountry, isVisible);
});

const chooser = new Chooser((e) => selectEntity(e, { fly: false }));

const map = new MapView(document.getElementById('map')!, ENTITIES, {
  onEntityClick: (e) => selectEntity(e, { fly: false }),
  onClusterClick: (members, x, y) => {
    tooltip.hide();
    chooser.show(members, x, y);
  },
  onCountryClick: (name) => showCountry(name),
  onBackgroundClick: () => {
    if (!tour.running) clearSelection();
  },
  onHover: (html, x, y) => (html ? tooltip.show(html, x, y) : tooltip.hide()),
});

const tour = new Tour(
  (e) => {
    // during the tour the caption card narrates; keep the big panel closed
    panel.hide();
    chooser.hide();
    stats.hide();
    openCountry = null;
    map.highlightCountry(null);
    selected = e;
    map.select(e.id);
    map.flyToEntity(e, 7);
  },
  () => {
    selected = null;
    map.select(null);
    map.resetView();
  },
);

new Search({
  onSelectEntity: (e) => selectEntity(e),
  onCountryFilter: (country) => {
    countryFilter = country;
    map.setFilter(isVisible);
    if (country) {
      const sample = ENTITIES.find((e) => e.country === country);
      if (sample) {
        map.flyToCountry(mapCountryName(sample));
        map.highlightCountry(mapCountryName(sample));
      }
    } else {
      map.highlightCountry(null);
      map.resetView();
    }
  },
});

let selected: SpaceEntity | null = null;

function selectEntity(e: SpaceEntity, opts: { fly?: boolean } = {}): void {
  if (tour.running) tour.stop();
  tooltip.hide();
  chooser.hide();
  stats.hide();
  openCountry = null;
  selected = e;
  map.select(e.id);
  if (opts.fly !== false) map.flyToEntity(e);
  panel.show(e);
}

function showCountry(name: string): void {
  if (tour.running) tour.stop();
  chooser.hide();
  selected = null;
  map.select(null);
  panel.hide();
  openCountry = name;
  map.highlightCountry(name);
  map.flyToCountry(name);
  stats.show(name, isVisible);
}

function clearSelection(): void {
  selected = null;
  map.select(null);
  panel.hide();
  chooser.hide();
  stats.hide();
  openCountry = null;
  map.highlightCountry(null);
}

document.getElementById('tour-btn')!.addEventListener('click', () => {
  clearSelection();
  tour.start();
});
document.getElementById('reset-btn')!.addEventListener('click', () => {
  clearSelection();
  map.resetView();
});
document.addEventListener('keydown', (ev) => {
  if (ev.key === 'Escape') {
    if (tour.running) tour.stop();
    else clearSelection();
  }
});

map.init().then(() => {
  map.setFilter(isVisible);
  document.getElementById('loading')?.remove();
});
