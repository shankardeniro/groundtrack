import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import world50Url from 'world-atlas/countries-50m.json?url';
import world110Url from 'world-atlas/countries-110m.json?url';
import { CATEGORIES, mapCountryName, RELATION_TEXT } from './types';
import type { SpaceEntity } from './types';

export interface MapCallbacks {
  onEntityClick(e: SpaceEntity): void;
  /** A cluster that zooming cannot split apart was clicked. */
  onClusterClick(members: SpaceEntity[], x: number, y: number): void;
  onCountryClick(name: string): void;
  onBackgroundClick(): void;
  /** Hover feedback; `html === null` hides the tooltip. */
  onHover(html: string | null, x: number, y: number): void;
}

interface Cluster {
  x: number;
  y: number;
  members: SpaceEntity[];
  /** geographic centroid [lng, lat], for fly-to targeting */
  lng: number;
  lat: number;
}

interface ArcDatum {
  other: SpaceEntity;
  text: string;
}

const CLUSTER_RADIUS = 34;
const LABEL_K = 3.5;
const MAX_K = 30;
const HOME_ROTATION: [number, number] = [-10, -18];

/**
 * An interactive 3D globe (orthographic projection). Dragging rotates the
 * globe, wheel/pinch zooms, and camera flights animate rotation + zoom
 * together. Countries render from 110m geometry while the globe is moving and
 * from 50m detail when it settles.
 */
export class MapView {
  private svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private mapG: d3.Selection<SVGGElement, unknown, null, undefined>;
  private arcsG: d3.Selection<SVGGElement, unknown, null, undefined>;
  private pinsG: d3.Selection<SVGGElement, unknown, null, undefined>;
  private atmosphere: d3.Selection<SVGCircleElement, unknown, null, undefined>;
  private spherePath!: d3.Selection<SVGPathElement, unknown, null, undefined>;
  private graticulePath!: d3.Selection<SVGPathElement, d3.GeoPermissibleObjects, null, undefined>;
  private outlinePath!: d3.Selection<SVGPathElement, unknown, null, undefined>;
  private countries50G!: d3.Selection<SVGGElement, unknown, null, undefined>;
  private countries110G!: d3.Selection<SVGGElement, unknown, null, undefined>;
  private paths50: d3.Selection<SVGPathElement, GeoJSON.Feature, SVGGElement, unknown> | null = null;
  private paths110: d3.Selection<SVGPathElement, GeoJSON.Feature, SVGGElement, unknown> | null = null;

  private projection = d3.geoOrthographic().clipAngle(90);
  private geoPath = d3.geoPath(this.projection);
  private zoom: d3.ZoomBehavior<SVGSVGElement, unknown>;

  private features50: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] };
  private features110: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] };
  private detailed = true;

  private width = 0;
  private height = 0;
  private baseScale = 1;
  private k = 1;
  private rotation: [number, number] = [...HOME_ROTATION];
  private autoTimer: d3.Timer | null = null;

  private selectedId: string | null = null;
  private highlightedCountry: string | null = null;
  private visible: (e: SpaceEntity) => boolean = () => true;
  private touchOrigin: [number, number] | null = null;
  private lastTapTime = 0;

  constructor(
    private container: HTMLElement,
    private entities: SpaceEntity[],
    private cb: MapCallbacks,
  ) {
    this.svg = d3
      .select(container)
      .append('svg')
      .attr('class', 'map-svg')
      .attr('role', 'application')
      .attr('aria-label', 'Interactive globe of space organizations');

    const defs = this.svg.append('defs');
    const glow = defs.append('filter').attr('id', 'pin-glow').attr('x', '-80%').attr('y', '-80%').attr('width', '260%').attr('height', '260%');
    glow.append('feGaussianBlur').attr('stdDeviation', 2.6).attr('result', 'blur');
    const merge = glow.append('feMerge');
    merge.append('feMergeNode').attr('in', 'blur');
    merge.append('feMergeNode').attr('in', 'SourceGraphic');

    // subtle 3D shading for the ocean sphere
    const ocean = defs.append('radialGradient').attr('id', 'ocean-grad').attr('cx', '38%').attr('cy', '32%').attr('r', '75%');
    ocean.append('stop').attr('offset', '0%').attr('stop-color', '#14203c');
    ocean.append('stop').attr('offset', '65%').attr('stop-color', '#0b1226');
    ocean.append('stop').attr('offset', '100%').attr('stop-color', '#070c1a');
    const atmo = defs.append('radialGradient').attr('id', 'atmo-grad');
    atmo.append('stop').attr('offset', '82%').attr('stop-color', 'rgba(90, 162, 255, 0)');
    atmo.append('stop').attr('offset', '94%').attr('stop-color', 'rgba(90, 162, 255, 0.16)');
    atmo.append('stop').attr('offset', '100%').attr('stop-color', 'rgba(90, 162, 255, 0)');

    this.atmosphere = this.svg.append('circle').attr('class', 'atmosphere').attr('fill', 'url(#atmo-grad)');
    this.mapG = this.svg.append('g').attr('class', 'map-layer');
    this.arcsG = this.svg.append('g').attr('class', 'arcs-layer');
    this.pinsG = this.svg.append('g').attr('class', 'pins-layer');

    // Wheel / pinch = zoom (scale only; the globe stays centered).
    this.zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, MAX_K])
      .filter((event: any) => event.type === 'wheel' || (event.touches && event.touches.length >= 2))
      .on('start', () => {
        this.stopAuto();
        this.setDetail(false);
      })
      .on('zoom', (event) => {
        this.k = event.transform.k;
        this.projection.scale(this.baseScale * this.k);
        this.redraw();
      })
      .on('end', () => this.setDetail(true));
    this.svg.call(this.zoom).on('dblclick.zoom', null);

    // Drag = rotate the globe.
    const drag = d3
      .drag<SVGSVGElement, unknown>()
      .on('start', () => {
        this.stopAuto();
        this.setDetail(false);
        this.cb.onHover(null, 0, 0);
      })
      .on('drag', (event) => {
        if (event.sourceEvent?.touches?.length > 1) return; // pinch is zoom's job
        const f = 57.3 / this.projection.scale(); // ≈ degrees per pixel at globe center
        this.rotation[0] += event.dx * f;
        this.rotation[1] = Math.max(-90, Math.min(90, this.rotation[1] - event.dy * f));
        this.projection.rotate(this.rotation);
        this.redraw();
      })
      .on('end', () => this.setDetail(true));
    this.svg.call(drag);

    // Track where a touch began so taps can be told apart from drags/pinches
    // (the gesture handlers swallow the synthetic click events touches produce).
    this.svg.on('pointerdown.tap', (event: PointerEvent) => {
      this.touchOrigin = [event.clientX, event.clientY];
      this.stopAuto();
    });
    this.bindTap(this.svg, () => this.cb.onBackgroundClick());

    window.addEventListener('resize', () => this.resize());
  }

  /**
   * Load a JSON asset. In the single-file build the ?url imports become
   * data: URIs, which are decoded locally — strict CSPs (e.g. the Artifact
   * host) block fetch() even for data: URLs.
   */
  private static async loadJson(url: string): Promise<any> {
    if (url.startsWith('data:')) {
      const comma = url.indexOf(',');
      const payload = url.slice(comma + 1);
      if (url.slice(0, comma).endsWith(';base64')) {
        const bytes = Uint8Array.from(atob(payload), (c) => c.charCodeAt(0));
        return JSON.parse(new TextDecoder().decode(bytes));
      }
      return JSON.parse(decodeURIComponent(payload));
    }
    return (await fetch(url)).json();
  }

  /** Load world geometry and draw the globe. */
  async init(): Promise<void> {
    const [t50, t110] = await Promise.all([MapView.loadJson(world50Url), MapView.loadJson(world110Url)]);
    this.features50 = topojson.feature(t50, t50.objects.countries) as unknown as GeoJSON.FeatureCollection;
    this.features110 = topojson.feature(t110, t110.objects.countries) as unknown as GeoJSON.FeatureCollection;
    this.projection.rotate(this.rotation);
    this.resize();
    this.startAuto();
  }

  private resize(): void {
    const rect = this.container.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    this.svg.attr('width', this.width).attr('height', this.height);
    this.baseScale = Math.min(this.width, this.height) / 2 - 24;
    this.projection.translate([this.width / 2, this.height / 2]).scale(this.baseScale * this.k);
    this.drawBase();
    this.bindCountries();
    this.redraw();
  }

  private drawBase(): void {
    this.mapG.selectAll('*').remove();
    this.spherePath = this.mapG.append('path').attr('class', 'sphere-fill');
    this.graticulePath = this.mapG
      .append('path')
      .attr('class', 'graticule')
      .datum(d3.geoGraticule10() as d3.GeoPermissibleObjects);
    this.countries110G = this.mapG.append('g');
    this.countries50G = this.mapG.append('g');
    this.outlinePath = this.mapG.append('path').attr('class', 'sphere-outline');
  }

  /**
   * Bind BOTH detail layers once. They stay in the DOM permanently and
   * setDetail() only toggles which one is displayed — rebinding elements
   * mid-gesture would make the browser swallow the click that follows a
   * mousedown on a country.
   */
  private bindCountries(): void {
    const bind = (
      g: d3.Selection<SVGGElement, unknown, null, undefined>,
      feats: GeoJSON.FeatureCollection,
    ) => {
      const sel = g
        .selectAll<SVGPathElement, GeoJSON.Feature>('.country')
        .data(feats.features, (d) => this.countryName(d))
        .join('path')
        .attr('class', 'country')
        .classed('country--active', (d) => this.countryName(d) === this.highlightedCountry)
        .on('mousemove', (event, d) => {
          const name = this.countryName(d);
          this.cb.onHover(this.countryTooltip(name), event.clientX, event.clientY);
        })
        .on('mouseleave', () => this.cb.onHover(null, 0, 0));
      this.bindTap(sel, (event, d) => {
        event.stopPropagation();
        this.cb.onCountryClick(this.countryName(d));
      });
      return sel;
    };
    this.paths50 = bind(this.countries50G, this.features50);
    this.paths110 = bind(this.countries110G, this.features110);
    this.countries50G.attr('display', this.detailed ? null : 'none');
    this.countries110G.attr('display', this.detailed ? 'none' : null);
  }

  private activePaths() {
    return this.detailed ? this.paths50 : this.paths110;
  }

  /** Recompute every projected path for the current rotation/scale. */
  private redraw(): void {
    const sphere = { type: 'Sphere' } as d3.GeoPermissibleObjects;
    this.spherePath.attr('d', this.geoPath(sphere));
    this.outlinePath.attr('d', this.geoPath(sphere));
    this.graticulePath.attr('d', this.geoPath);
    this.activePaths()?.attr('d', this.geoPath);
    this.atmosphere
      .attr('cx', this.width / 2)
      .attr('cy', this.height / 2)
      .attr('r', this.projection.scale() * 1.08);
    this.renderOverlay();
  }

  private setDetail(detailed: boolean): void {
    if (this.detailed === detailed) return;
    this.detailed = detailed;
    this.countries50G.attr('display', detailed ? null : 'none');
    this.countries110G.attr('display', detailed ? 'none' : null);
    this.activePaths()?.attr('d', this.geoPath); // refresh the newly shown layer
  }

  // ────────────────────────── idle auto-rotation ──────────────────────────

  private startAuto(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let last = 0;
    this.setDetail(false);
    this.autoTimer = d3.timer((elapsed) => {
      this.rotation[0] += (elapsed - last) * 0.0035;
      last = elapsed;
      this.projection.rotate(this.rotation);
      this.redraw();
    });
  }

  private stopAuto(): void {
    if (!this.autoTimer) return;
    this.autoTimer.stop();
    this.autoTimer = null;
    this.setDetail(true);
  }

  // ────────────────────────── tap handling ──────────────────────────

  /**
   * Attach a handler that fires on mouse click AND on a stationary touch tap.
   * Touch taps use pointerup because the gesture handlers suppress the
   * synthetic click; a recent-tap guard stops double-firing when a browser
   * delivers both.
   */
  private bindTap<E extends d3.BaseType, D>(
    sel: d3.Selection<E, D, d3.BaseType, unknown>,
    handler: (event: Event, d: D) => void,
  ): void {
    sel
      .on('click', (event: Event, d: D) => {
        if (performance.now() - this.lastTapTime < 500) return;
        handler(event, d);
      })
      .on('pointerup.tap', (event: PointerEvent, d: D) => {
        if (event.pointerType === 'mouse') return;
        const [ox, oy] = this.touchOrigin ?? [event.clientX, event.clientY];
        if (Math.hypot(event.clientX - ox, event.clientY - oy) < 12) {
          event.stopPropagation();
          this.lastTapTime = performance.now();
          handler(event, d);
        }
      });
  }

  private countryName(d: GeoJSON.Feature): string {
    return (d.properties as { name?: string })?.name ?? '';
  }

  private countryTooltip(name: string): string {
    const here = this.entities.filter((e) => mapCountryName(e) === name && this.visible(e));
    if (here.length === 0) {
      return `<strong>${name}</strong><div class="tt-muted">No entries yet — click to explore</div>`;
    }
    const counts = d3.rollup(here, (v) => v.length, (e) => e.category);
    const rows = [...counts.entries()]
      .map(([cat, n]) => `<div class="tt-row"><span class="tt-dot" style="background:${CATEGORIES[cat].color}"></span>${n} ${n === 1 ? CATEGORIES[cat].label : CATEGORIES[cat].plural}</div>`)
      .join('');
    return `<strong>${name}</strong>${rows}<div class="tt-muted">Click to zoom in</div>`;
  }

  /** Set which entities are shown (category toggles + country filter). */
  setFilter(pred: (e: SpaceEntity) => boolean): void {
    this.visible = pred;
    this.renderOverlay();
  }

  /** Select an entity (draws arcs and a highlight ring); null clears. */
  select(id: string | null): void {
    this.selectedId = id;
    this.renderOverlay();
  }

  highlightCountry(name: string | null): void {
    this.highlightedCountry = name;
    for (const sel of [this.paths50, this.paths110]) {
      sel?.classed('country--active', (d) => this.countryName(d) === name);
    }
  }

  // ────────────────────────── camera ──────────────────────────

  flyToCountry(name: string): void {
    const feature = this.features50.features.find((f) => this.countryName(f) === name);
    if (!feature) return;
    const [cx, cy] = d3.geoCentroid(feature);
    // measure how big the country renders at base scale when centered
    const prevRotate = this.projection.rotate();
    const prevScale = this.projection.scale();
    this.projection.rotate([-cx, -cy]).scale(this.baseScale);
    const [[x0, y0], [x1, y1]] = this.geoPath.bounds(feature);
    this.projection.rotate(prevRotate).scale(prevScale);
    const k = Math.max(1, Math.min(18, 0.7 / Math.max((x1 - x0) / this.width, (y1 - y0) / this.height)));
    this.flyTo([-cx, -cy], k);
  }

  flyToEntity(e: SpaceEntity, scale?: number): void {
    const k = scale ?? Math.min(MAX_K, Math.max(this.k, 6));
    this.flyTo([-e.coords[0], -e.coords[1]], k);
  }

  resetView(): void {
    this.flyTo([...HOME_ROTATION], 1);
  }

  /** Animate rotation + zoom together; long hops dip out for orientation. */
  private flyTo(target: [number, number], targetK: number, ms = 1500): void {
    this.stopAuto();
    this.cb.onHover(null, 0, 0); // the globe is about to move under the cursor
    const start: [number, number] = [...this.rotation];
    let dl = target[0] - start[0];
    dl = ((((dl + 180) % 360) + 360) % 360) - 180; // shortest way around
    const end: [number, number] = [start[0] + dl, target[1]];
    const ri = d3.interpolate(start, end);
    const startK = this.k;
    const dist = Math.abs(dl) + Math.abs(end[1] - start[1]);
    const kMid = Math.min(startK, targetK, 2.2);
    const dip = dist > 45 && (startK > 2.5 || targetK > 2.5);
    const ki = dip
      ? (t: number) => (t < 0.5 ? startK + (kMid - startK) * (t * 2) : kMid + (targetK - kMid) * ((t - 0.5) * 2))
      : d3.interpolate(startK, targetK);

    this.setDetail(false);
    this.svg
      .transition('fly')
      .duration(dip ? ms + 400 : ms)
      .ease(d3.easeCubicInOut)
      .tween('fly', () => (t: number) => {
        this.rotation = [...(ri(t) as [number, number])];
        this.k = ki(t);
        this.projection.rotate(this.rotation).scale(this.baseScale * this.k);
        this.redraw();
      })
      .on('end interrupt', () => {
        this.setDetail(true);
        // keep the wheel/pinch zoom state in sync with where the flight ended
        this.svg.call(this.zoom.transform, d3.zoomIdentity.scale(this.k));
      });
  }

  // ────────────────────────── overlay: pins, clusters, arcs ──────────────────────────

  /** Screen position of an entity, or null when it faces away from the viewer. */
  private screenPos(e: SpaceEntity): [number, number] | null {
    const r = this.projection.rotate();
    if (d3.geoDistance(e.coords, [-r[0], -r[1]]) > Math.PI / 2 - 0.01) return null;
    return this.projection(e.coords);
  }

  private clusterEntities(): Cluster[] {
    const clusters: Cluster[] = [];
    for (const e of this.entities) {
      if (!this.visible(e)) continue;
      const pos = this.screenPos(e);
      if (!pos) continue;
      const [x, y] = pos;
      if (x < -60 || y < -60 || x > this.width + 60 || y > this.height + 60) continue;
      // never fold the selected entity into a cluster — its pin anchors the arcs
      const near = e.id === this.selectedId
        ? undefined
        : clusters.find(
            (c) => c.members.every((m) => m.id !== this.selectedId) && Math.hypot(c.x - x, c.y - y) < CLUSTER_RADIUS,
          );
      if (near) {
        const n = near.members.push(e);
        near.x = (near.x * (n - 1) + x) / n;
        near.y = (near.y * (n - 1) + y) / n;
        near.lng = (near.lng * (n - 1) + e.coords[0]) / n;
        near.lat = (near.lat * (n - 1) + e.coords[1]) / n;
      } else {
        clusters.push({ x, y, members: [e], lng: e.coords[0], lat: e.coords[1] });
      }
    }
    return clusters;
  }

  private renderOverlay(): void {
    this.renderArcs();
    this.renderPins(this.clusterEntities());
  }

  private renderPins(clusters: Cluster[]): void {
    const groups = this.pinsG
      .selectAll<SVGGElement, Cluster>('g.pin')
      .data(clusters, (c) => (c.members.length === 1 ? c.members[0].id : `cl-${c.members.map((m) => m.id).join('.')}`))
      .join((enter) => {
        const g = enter.append('g').attr('class', 'pin');
        g.append('circle').attr('class', 'pin-hit'); // generous invisible hit target
        g.append('circle').attr('class', 'pin-halo');
        g.append('circle').attr('class', 'pin-dot');
        g.append('text').attr('class', 'pin-count');
        g.append('text').attr('class', 'pin-label');
        return g;
      });

    groups
      .attr('transform', (c) => `translate(${c.x},${c.y})`)
      .attr('tabindex', 0)
      .style('cursor', 'pointer')
      .on('keydown', (event, c) => {
        if ((event as KeyboardEvent).key === 'Enter' && c.members.length === 1) this.cb.onEntityClick(c.members[0]);
      })
      .on('mousemove', (event, c) => {
        const html =
          c.members.length === 1
            ? `<strong>${c.members[0].name}</strong><div class="tt-row"><span class="tt-dot" style="background:${CATEGORIES[c.members[0].category].color}"></span>${CATEGORIES[c.members[0].category].label} · ${c.members[0].city}</div>`
            : `<strong>${c.members.length} organizations</strong><div class="tt-muted">Click to zoom in</div>`;
        this.cb.onHover(html, event.clientX, event.clientY);
      })
      .on('mouseleave', () => this.cb.onHover(null, 0, 0));

    this.bindTap(groups, (event, c) => {
      event.stopPropagation();
      if (c.members.length === 1) {
        this.cb.onEntityClick(c.members[0]);
        return;
      }
      // Would zooming in actually split this cluster? Members that are
      // essentially co-located (KSC and Cape Canaveral, for example) never
      // separate — offer a chooser instead of a dead-end zoom.
      const zoomFactor = Math.min(MAX_K, this.k * 2.6) / this.k;
      let spread = 0;
      for (let i = 0; i < c.members.length; i++) {
        for (let j = i + 1; j < c.members.length; j++) {
          const a = this.screenPos(c.members[i]);
          const b = this.screenPos(c.members[j]);
          if (a && b) spread = Math.max(spread, Math.hypot(a[0] - b[0], a[1] - b[1]));
        }
      }
      if (zoomFactor <= 1.05 || spread * zoomFactor < CLUSTER_RADIUS) {
        const ev = event as PointerEvent;
        this.cb.onClusterClick(c.members, ev.clientX ?? this.width / 2, ev.clientY ?? this.height / 2);
      } else {
        this.flyTo([-c.lng, -c.lat], Math.min(MAX_K, this.k * 2.6), 900);
      }
    });

    groups.each((c, i, nodes) => {
      const g = d3.select(nodes[i]);
      const single = c.members.length === 1;
      const e = c.members[0];
      const isSelected = single && e.id === this.selectedId;
      const color = single
        ? CATEGORIES[e.category].color
        : c.members.every((m) => m.category === c.members[0].category)
          ? CATEGORIES[c.members[0].category].color
          : '#9fb4d8';
      const r = single ? (isSelected ? 8 : 5.5) : Math.min(16, 9 + c.members.length);

      g.select<SVGCircleElement>('.pin-hit').attr('r', Math.max(16, r + 8));
      g.select<SVGCircleElement>('.pin-halo')
        .attr('r', r + (single ? 5 : 4))
        .attr('fill', color)
        .attr('opacity', isSelected ? 0.35 : 0.16)
        .classed('pulse', isSelected);
      g.select<SVGCircleElement>('.pin-dot')
        .attr('r', r)
        .attr('fill', single ? color : '#101a2e')
        .attr('stroke', single ? '#0a0f1c' : color)
        .attr('stroke-width', single ? 1.4 : 2)
        .attr('filter', 'url(#pin-glow)');
      g.select<SVGTextElement>('.pin-count')
        .attr('dy', '0.35em')
        .attr('fill', color)
        .text(single ? '' : String(c.members.length));
      g.select<SVGTextElement>('.pin-label')
        .attr('x', r + 7)
        .attr('dy', '0.35em')
        .text(single && (this.k >= LABEL_K || isSelected) ? e.name : '');
    });
  }

  private renderArcs(): void {
    const selected = this.selectedId ? this.entities.find((e) => e.id === this.selectedId) : undefined;
    const arcs: ArcDatum[] = [];
    if (selected) {
      for (const rel of selected.related) {
        const other = this.entities.find((e) => e.id === rel.id);
        if (other && this.visible(other)) {
          arcs.push({ other, text: `${selected.name} ${RELATION_TEXT[rel.type].fwd} ${other.name}` });
        }
      }
      for (const e of this.entities) {
        if (e.id === selected.id || !this.visible(e)) continue;
        for (const rel of e.related) {
          if (rel.id === selected.id) arcs.push({ other: e, text: `${e.name} ${RELATION_TEXT[rel.type].fwd} ${selected.name}` });
        }
      }
    }

    this.arcsG
      .selectAll<SVGPathElement, ArcDatum>('path.arc')
      .data(selected ? arcs : [], (d) => d.other.id)
      .join(
        (enter) =>
          enter
            .append('path')
            .attr('class', 'arc')
            .attr('pathLength', 1)
            .call((sel) =>
              sel
                .on('mousemove', (event, d) => this.cb.onHover(`<strong>${d.text}</strong>`, event.clientX, event.clientY))
                .on('mouseleave', () => this.cb.onHover(null, 0, 0)),
            ),
        (update) => update,
        (exit) => exit.remove(),
      )
      .attr('stroke', (d) => CATEGORIES[d.other.category].color)
      .attr('d', (d) => {
        // great-circle route; the projection clips it at the horizon
        const line: GeoJSON.LineString = { type: 'LineString', coordinates: [selected!.coords, d.other.coords] };
        return this.geoPath(line) ?? '';
      });
  }
}
