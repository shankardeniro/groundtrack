/**
 * Custom country dropdown. The native <select> pops an OS-drawn menu that
 * cannot take the app's glass surface, so this renders its own listbox and
 * keeps the button focused, driving the list via aria-activedescendant.
 */
export class CountryPicker {
  private btn = document.getElementById('country-filter') as HTMLButtonElement;
  private label = document.getElementById('country-label') as HTMLElement;
  private menu = document.getElementById('country-menu') as HTMLElement;
  private options: string[];
  private opts: HTMLButtonElement[];
  private value = '';
  private active = 0;
  private typed = '';
  private typedAt = 0;

  constructor(countries: string[], private onChange: (country: string | null) => void) {
    this.options = ['', ...countries];
    this.menu.innerHTML = this.options
      .map(
        (c, i) =>
          `<button class="country-opt" role="option" id="country-opt-${i}" data-i="${i}" tabindex="-1" aria-selected="${i === 0}">
             <span class="country-check" aria-hidden="true">✓</span>${c || 'All countries'}
           </button>`,
      )
      .join('');
    this.opts = [...this.menu.querySelectorAll<HTMLButtonElement>('.country-opt')];
    this.opts.forEach((o) => {
      o.addEventListener('click', () => this.pick(Number(o.dataset.i)));
      o.addEventListener('mousemove', () => this.setActive(Number(o.dataset.i), false));
    });
    this.btn.addEventListener('click', () => (this.isOpen ? this.close() : this.open()));
    this.btn.addEventListener('keydown', (ev) => this.onKey(ev));
    document.addEventListener('click', (ev) => {
      if (!(ev.target as HTMLElement).closest('#country-wrap')) this.close();
    });
  }

  private get isOpen(): boolean {
    return !this.menu.hidden;
  }

  private open(): void {
    this.menu.hidden = false;
    this.btn.setAttribute('aria-expanded', 'true');
    this.setActive(Math.max(0, this.options.indexOf(this.value)));
  }

  private close(): void {
    if (!this.isOpen) return;
    this.menu.hidden = true;
    this.btn.setAttribute('aria-expanded', 'false');
    this.btn.removeAttribute('aria-activedescendant');
  }

  private setActive(i: number, scroll = true): void {
    this.active = i;
    this.opts.forEach((o, j) => o.classList.toggle('active', j === i));
    this.btn.setAttribute('aria-activedescendant', this.opts[i].id);
    if (scroll) this.opts[i].scrollIntoView({ block: 'nearest' });
  }

  private pick(i: number): void {
    this.value = this.options[i];
    this.label.textContent = this.value || 'All countries';
    this.opts.forEach((o, j) => o.setAttribute('aria-selected', String(j === i)));
    this.close();
    this.btn.focus();
    this.onChange(this.value || null);
  }

  private onKey(ev: KeyboardEvent): void {
    const n = this.options.length;
    switch (ev.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        ev.preventDefault();
        if (!this.isOpen) return this.open();
        const dir = ev.key === 'ArrowDown' ? 1 : -1;
        return this.setActive((this.active + dir + n) % n);
      }
      case 'Home':
      case 'End':
        if (!this.isOpen) return;
        ev.preventDefault();
        return this.setActive(ev.key === 'Home' ? 0 : n - 1);
      case 'Enter':
      case ' ':
        ev.preventDefault();
        return this.isOpen ? this.pick(this.active) : this.open();
      case 'Escape':
        if (!this.isOpen) return;
        ev.preventDefault();
        return this.close();
      case 'Tab':
        return this.close();
    }
    // Type-ahead: letters typed within a second jump to the first matching country.
    if (ev.key.length === 1 && /\S/.test(ev.key)) {
      const now = Date.now();
      this.typed = (now - this.typedAt < 1000 ? this.typed : '') + ev.key.toLowerCase();
      this.typedAt = now;
      const hit = this.options.findIndex((c, i) => i > 0 && c.toLowerCase().startsWith(this.typed));
      if (hit < 0) return;
      if (!this.isOpen) this.open();
      this.setActive(hit);
    }
  }
}
