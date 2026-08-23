import { CATEGORIES, mapCountryName } from '../types';
import type { Category, SpaceEntity } from '../types';
import { ENTITIES } from '../data/entities';

export interface StatsCallbacks {
  onSelectEntity(e: SpaceEntity): void;
  onClose(): void;
}

/** Country summary card: counts by category plus a clickable entity list. */
export class Stats {
  private el = document.getElementById('stats') as HTMLElement;

  constructor(private cb: StatsCallbacks) {}

  show(mapName: string, visible: (e: SpaceEntity) => boolean): void {
    const here = ENTITIES.filter((e) => mapCountryName(e) === mapName && visible(e));
    const displayName = here[0]?.country ?? mapName;
    const byCat = new Map<Category, SpaceEntity[]>();
    for (const e of here) {
      if (!byCat.has(e.category)) byCat.set(e.category, []);
      byCat.get(e.category)!.push(e);
    }

    this.el.innerHTML = `
      <button class="panel-close" aria-label="Close country summary">×</button>
      <h2>${displayName}</h2>
      <div class="stats-total">${here.length} ${here.length === 1 ? 'entry' : 'entries'} in the atlas</div>
      ${
        here.length === 0
          ? `<p class="tt-muted">No entries yet for this country — the space ecosystem here is still emerging, or awaiting a future dataset update.</p>`
          : [...byCat.entries()]
              .map(
                ([cat, list]) => `
                  <div class="stats-group">
                    <div class="stats-cat"><span class="legend-dot" style="background:${CATEGORIES[cat].color}"></span>${list.length === 1 ? CATEGORIES[cat].label : CATEGORIES[cat].plural} · ${list.length}</div>
                    ${list
                      .map((e) => `<button class="stats-entity" data-id="${e.id}">${e.name}<span class="result-sub">${e.city}</span></button>`)
                      .join('')}
                  </div>`,
              )
              .join('')
      }`;

    this.el.querySelector('.panel-close')!.addEventListener('click', () => this.cb.onClose());
    this.el.querySelectorAll<HTMLButtonElement>('.stats-entity').forEach((btn) =>
      btn.addEventListener('click', () => {
        const e = ENTITIES.find((x) => x.id === btn.dataset.id);
        if (e) this.cb.onSelectEntity(e);
      }),
    );
    this.el.hidden = false;
  }

  hide(): void {
    this.el.hidden = true;
  }
}
