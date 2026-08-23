import { CATEGORIES } from '../types';
import type { SpaceEntity } from '../types';

/**
 * Popover listing the members of a cluster that zooming cannot split
 * (co-located facilities like Kennedy Space Center and Cape Canaveral).
 */
export class Chooser {
  private el = document.getElementById('cluster-pop') as HTMLElement;

  constructor(private onSelect: (e: SpaceEntity) => void) {}

  show(members: SpaceEntity[], x: number, y: number): void {
    this.el.innerHTML =
      `<div class="chooser-title">${members.length} organizations here</div>` +
      members
        .map(
          (e, i) =>
            `<button class="stats-entity" data-i="${i}">
               <span class="tt-dot" style="background:${CATEGORIES[e.category].color}"></span>
               ${e.name}<span class="result-sub">${e.city}</span>
             </button>`,
        )
        .join('');
    this.el.querySelectorAll<HTMLButtonElement>('.stats-entity').forEach((btn) =>
      btn.addEventListener('click', () => this.onSelect(members[Number(btn.dataset.i)])),
    );
    this.el.hidden = false;
    const rect = this.el.getBoundingClientRect();
    const px = Math.min(Math.max(8, x + 12), window.innerWidth - rect.width - 8);
    const py = Math.min(Math.max(8, y + 12), window.innerHeight - rect.height - 8);
    this.el.style.transform = `translate(${px}px, ${py}px)`;
  }

  hide(): void {
    this.el.hidden = true;
  }
}
