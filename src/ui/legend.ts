import { CATEGORIES } from '../types';
import type { Category } from '../types';

/** Color-coded category legend; clicking an item toggles that category. */
export class Legend {
  private el = document.getElementById('legend') as HTMLElement;
  readonly visible = new Set<Category>(Object.keys(CATEGORIES) as Category[]);

  constructor(private onChange: () => void) {
    this.el.innerHTML =
      `<div class="legend-title" style="--chip:var(--cat-mixed)"><span class="chip-dot"></span>Categories</div>` +
      (Object.keys(CATEGORIES) as Category[])
        .map(
          (cat) =>
            `<button class="legend-item" data-cat="${cat}" aria-pressed="true">
               <span class="legend-dot" style="background:${CATEGORIES[cat].color}"></span>${CATEGORIES[cat].plural}
             </button>`,
        )
        .join('');

    this.el.querySelectorAll<HTMLButtonElement>('.legend-item').forEach((btn) =>
      btn.addEventListener('click', () => {
        const cat = btn.dataset.cat as Category;
        if (this.visible.has(cat)) this.visible.delete(cat);
        else this.visible.add(cat);
        const on = this.visible.has(cat);
        btn.setAttribute('aria-pressed', String(on));
        btn.classList.toggle('off', !on);
        this.onChange();
      }),
    );
  }
}
