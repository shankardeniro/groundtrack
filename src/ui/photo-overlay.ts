/** Large photo overlay for flagship-vehicle photography. */
export function openPhotoOverlay(title: string, sub: string, src: string, alt: string): void {
  const el = document.getElementById('vehicle-overlay')!;
  el.innerHTML = `<div class="vehicle-stage">
      <button class="panel-close" aria-label="Close photo viewer">×</button>
      <img class="vehicle-photo" src="${src}" alt="${alt}" />
      <div class="vehicle-caption">
        <strong>${title}</strong>
        <span>${sub}</span>
      </div>
    </div>`;
  el.hidden = false;
  el.addEventListener('click', (ev) => {
    if (ev.target === el) closeVehicleOverlay();
  });
  el.querySelector('.panel-close')!.addEventListener('click', () => closeVehicleOverlay());
}

/** Close the overlay if open; returns whether it was open. */
export function closeVehicleOverlay(): boolean {
  const el = document.getElementById('vehicle-overlay')!;
  if (el.hidden) return false;
  el.hidden = true;
  el.innerHTML = '';
  return true;
}
