import { CATEGORIES } from '../types';
import type { SpaceEntity } from '../types';
import { ENTITIES } from '../data/entities';

export interface SearchCallbacks {
  onSelectEntity(e: SpaceEntity): void;
  onCountryFilter(country: string | null): void;
}

/** Search box with keyboard-navigable autocomplete, plus a country filter. */
export class Search {
  private input = document.getElementById('search') as HTMLInputElement;
  private results = document.getElementById('search-results') as HTMLElement;
  private countrySel = document.getElementById('country-filter') as HTMLSelectElement;
  private matches: SpaceEntity[] = [];
  private active = -1;

  constructor(private cb: SearchCallbacks) {
    const countries = [...new Set(ENTITIES.map((e) => e.country))].sort();
    this.countrySel.innerHTML =
      `<option value="">All countries</option>` + countries.map((c) => `<option>${c}</option>`).join('');
    this.countrySel.addEventListener('change', () => this.cb.onCountryFilter(this.countrySel.value || null));

    this.input.addEventListener('input', () => this.update());
    this.input.addEventListener('keydown', (ev) => this.onKey(ev));
    this.input.addEventListener('focus', () => this.update());
    document.addEventListener('click', (ev) => {
      if (!(ev.target as HTMLElement).closest('#search-wrap')) this.close();
    });
  }

  private update(): void {
    const q = this.input.value.trim().toLowerCase();
    if (q.length < 2) return this.close();
    this.matches = ENTITIES.filter((e) =>
      [e.name, e.city, e.country, ...e.tags].some((s) => s.toLowerCase().includes(q)),
    ).slice(0, 8);
    this.active = -1;
    if (!this.matches.length) return this.close();
    this.results.innerHTML = this.matches
      .map(
        (e, i) =>
          `<button class="result" role="option" data-i="${i}">
             <span class="tt-dot" style="background:${CATEGORIES[e.category].color}"></span>
             <strong>${e.name}</strong><span class="result-sub">${e.city}, ${e.country}</span>
           </button>`,
      )
      .join('');
    this.results.hidden = false;
    this.results.querySelectorAll<HTMLButtonElement>('.result').forEach((btn) =>
      btn.addEventListener('click', () => this.pick(Number(btn.dataset.i))),
    );
  }

  private onKey(ev: KeyboardEvent): void {
    if (this.results.hidden) return;
    if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
      ev.preventDefault();
      const dir = ev.key === 'ArrowDown' ? 1 : -1;
      this.active = (this.active + dir + this.matches.length) % this.matches.length;
      this.results.querySelectorAll('.result').forEach((el, i) => el.classList.toggle('active', i === this.active));
    } else if (ev.key === 'Enter' && this.active >= 0) {
      ev.preventDefault();
      this.pick(this.active);
    } else if (ev.key === 'Escape') {
      this.close();
      this.input.blur();
    }
  }

  private pick(i: number): void {
    const e = this.matches[i];
    this.input.value = e.name;
    this.close();
    this.cb.onSelectEntity(e);
  }

  private close(): void {
    this.results.hidden = true;
    this.results.innerHTML = '';
  }
}
