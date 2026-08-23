/** Floating tooltip that follows the cursor for map hover feedback. */
export class Tooltip {
  private el = document.getElementById('tooltip') as HTMLDivElement;

  show(html: string, x: number, y: number): void {
    this.el.innerHTML = html;
    this.el.hidden = false;
    const rect = this.el.getBoundingClientRect();
    const px = Math.min(x + 14, window.innerWidth - rect.width - 10);
    const py = Math.min(y + 14, window.innerHeight - rect.height - 10);
    this.el.style.transform = `translate(${px}px, ${py}px)`;
  }

  hide(): void {
    this.el.hidden = true;
  }
}
