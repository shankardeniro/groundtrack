import { CATEGORIES, RELATION_TEXT } from '../types';
import type { SpaceEntity } from '../types';
import { ENTITIES, ENTITY_BY_ID } from '../data/entities';
import { VEHICLE_BY_ENTITY } from '../data/vehicles';
import { VEHICLE_PHOTOS } from '../data/vehicle-photos';
import { VehicleViewer, openVehicleOverlay, openPhotoOverlay } from '../vehicle3d';

export interface PanelCallbacks {
  onNavigate(e: SpaceEntity): void;
  onClose(): void;
}

/** Slide-in profile panel (bottom sheet on mobile). */
export class Panel {
  private el = document.getElementById('panel') as HTMLElement;
  private viewer: VehicleViewer | null = null;

  constructor(private cb: PanelCallbacks) {}

  get isOpen(): boolean {
    return !this.el.hidden;
  }

  show(e: SpaceEntity): void {
    const meta = CATEGORIES[e.category];
    const relations = this.relationsOf(e);
    const vehicle = VEHICLE_BY_ENTITY.get(e.id);
    const photo = VEHICLE_PHOTOS[e.id];

    this.el.innerHTML = `
      <button class="panel-close" aria-label="Close profile">×</button>
      <div class="panel-scroll">
        <span class="chip" style="--chip:${meta.color}"><span class="chip-dot"></span>${meta.label}</span>
        <h2>${e.name}</h2>
        <div class="panel-meta">
          <span>📍 ${e.city}, ${e.country}</span>
          <span>🗓 Founded ${e.founded}</span>
        </div>
        <a class="panel-link" href="${e.website}" target="_blank" rel="noopener">Visit website ↗</a>
        ${e.description.map((p) => `<p>${p}</p>`).join('')}

        ${
          vehicle
            ? `<h3>Flagship vehicle</h3>
               <div class="vehicle-box">
                 ${
                   photo
                     ? `<img class="vehicle-photo" src="${photo.src}" alt="${photo.alt}" />`
                     : `<canvas class="vehicle-canvas" aria-label="Stylized 3D model of ${vehicle.name}"></canvas>`
                 }
                 <div class="vehicle-caption">
                   <strong>${vehicle.name}</strong>
                   <span>${photo ? `Photo: ${photo.credit} · ${photo.license}` : `${vehicle.heightM} m · stylized · drag to rotate`}</span>
                   <button class="vehicle-expand">Expand ⤢</button>
                 </div>
               </div>
               <div class="vehicle-specs">
                 ${[
                   ['Height', `${vehicle.heightM} m`],
                   ['Diameter', vehicle.stats.diameter],
                   ['Payload · LEO', vehicle.stats.payloadLeo],
                   ['Stages', vehicle.stats.stages],
                   ['Engines', vehicle.stats.engines],
                   ['Propellant', vehicle.stats.propellant],
                   ['First flight', vehicle.stats.firstFlight],
                 ]
                   .map(([k, v]) => `<div class="vspec"><span>${k}</span><strong>${v}</strong></div>`)
                   .join('')}
               </div>`
            : ''
        }

        <h3>Key programs & missions</h3>
        <ul class="programs">
          ${e.programs.map((p) => `<li><strong>${p.name}</strong> — ${p.blurb}</li>`).join('')}
        </ul>

        <h3>Milestones</h3>
        <ol class="timeline">
          ${e.milestones.map((m) => `<li><span class="year">${m.year}</span><span>${m.text}</span></li>`).join('')}
        </ol>

        <h3>Notable achievements</h3>
        <ul class="achievements">
          ${e.achievements.map((a) => `<li>${a}</li>`).join('')}
        </ul>

        ${
          relations.length
            ? `<h3>Connections</h3>
               <div class="relations">
                 ${relations
                   .map(
                     (r) =>
                       `<button class="relation" data-id="${r.other.id}">
                          <span class="tt-dot" style="background:${CATEGORIES[r.other.category].color}"></span>
                          <span class="rel-text">${r.text}</span>
                          <strong>${r.other.name}</strong>
                        </button>`,
                   )
                   .join('')}
               </div>`
            : ''
        }

        <div class="tags">${e.tags.map((t) => `<span class="tag">${t}</span>`).join('')}</div>
      </div>`;

    this.el.querySelector('.panel-close')!.addEventListener('click', () => this.cb.onClose());
    this.el.querySelectorAll<HTMLButtonElement>('.relation').forEach((btn) =>
      btn.addEventListener('click', () => {
        const target = ENTITY_BY_ID.get(btn.dataset.id!);
        if (target) this.cb.onNavigate(target);
      }),
    );

    this.el.hidden = false;
    this.el.querySelector('.panel-scroll')!.scrollTop = 0;

    this.viewer?.destroy();
    this.viewer = null;
    if (vehicle) {
      if (!photo) {
        // create after unhiding so the canvas has real layout dimensions
        this.viewer = new VehicleViewer(this.el.querySelector('.vehicle-canvas')!, vehicle);
      }
      this.el.querySelector('.vehicle-expand')!.addEventListener('click', () =>
        photo
          ? openPhotoOverlay(vehicle.name, `Photo: ${photo.credit} · ${photo.license}`, photo.src, photo.alt)
          : openVehicleOverlay(vehicle),
      );
    }
  }

  hide(): void {
    this.viewer?.destroy();
    this.viewer = null;
    this.el.hidden = true;
  }

  /** Outgoing + incoming relations of an entity, with directional phrasing. */
  private relationsOf(e: SpaceEntity): { other: SpaceEntity; text: string }[] {
    const out = e.related
      .map((r) => ({ other: ENTITY_BY_ID.get(r.id), text: RELATION_TEXT[r.type].fwd }))
      .filter((r): r is { other: SpaceEntity; text: string } => !!r.other);
    const incoming = ENTITIES.flatMap((src) =>
      src.id === e.id
        ? []
        : src.related
            .filter((r) => r.id === e.id)
            .map((r) => ({ other: src, text: RELATION_TEXT[r.type].rev })),
    );
    return [...out, ...incoming];
  }
}
