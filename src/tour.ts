import { ENTITY_BY_ID } from './data/entities';
import { CATEGORIES } from './types';
import type { SpaceEntity } from './types';

interface TourStop {
  id: string;
  caption: string;
}

/** A guided fly-through of global highlights. */
const STOPS: TourStop[] = [
  { id: 'ksc', caption: 'Our tour begins at Kennedy Space Center, Florida — every human who has walked on the Moon left Earth from these pads.' },
  { id: 'kourou', caption: 'Across the Atlantic, Europe launches from the edge of the Amazon. Kourou sits 5° from the equator — a free performance boost for every rocket.' },
  { id: 'seraphim', caption: 'In London, Seraphim Space runs the world’s largest space-tech venture fund — the money behind many of the startups on this map.' },
  { id: 'sriharikota', caption: 'On an island in the Bay of Bengal, Sriharikota has launched every Indian mission — and now hosts India’s first private launchpads.' },
  { id: 'baikonur', caption: 'The Kazakh steppe, where the Space Age began: Sputnik and Gagarin both left Earth from Baikonur.' },
  { id: 'jiuquan', caption: 'Deep in the Gobi Desert, Jiuquan launches every Chinese crewed mission and anchors China’s booming commercial launch scene.' },
  { id: 'tanegashima', caption: 'Japan launches from a cliff-top pad above the Pacific — often called the most beautiful spaceport on Earth.' },
  { id: 'mahia-lc1', caption: 'On a New Zealand sheep-farming peninsula, Rocket Lab built the world’s first private orbital launch site.' },
  { id: 'canberra-dsn', caption: 'These Australian dishes are humanity’s only link to Voyager 2, and they relayed Apollo 11’s moonwalk to the world.' },
  { id: 'spacex', caption: 'We end in Hawthorne, California — where SpaceX’s reusable rockets rewrote the economics of reaching orbit.' },
];

export class Tour {
  private card = document.getElementById('tour-card') as HTMLElement;
  private index = -1;

  constructor(private onStop: (e: SpaceEntity) => void, private onEnd: () => void) {}

  get running(): boolean {
    return this.index >= 0;
  }

  start(): void {
    this.index = -1;
    this.next();
  }

  next(): void {
    if (this.index >= STOPS.length - 1) return this.stop();
    this.index += 1;
    this.render();
  }

  prev(): void {
    if (this.index <= 0) return;
    this.index -= 1;
    this.render();
  }

  stop(): void {
    this.index = -1;
    this.card.hidden = true;
    this.onEnd();
  }

  private render(): void {
    const stop = STOPS[this.index];
    const e = ENTITY_BY_ID.get(stop.id)!;
    this.card.innerHTML = `
      <div class="tour-step" style="--chip:${CATEGORIES[e.category].color}"><span class="chip-dot"></span>Stop ${this.index + 1} of ${STOPS.length}</div>
      <div class="tour-name">${e.name}</div>
      <p>${stop.caption}</p>
      <div class="tour-controls">
        <button id="tour-prev" ${this.index === 0 ? 'disabled' : ''}>← Back</button>
        <button id="tour-next" class="primary">${this.index === STOPS.length - 1 ? 'Finish' : 'Next →'}</button>
        <button id="tour-exit">Exit tour</button>
      </div>`;
    this.card.hidden = false;
    this.card.querySelector('#tour-prev')!.addEventListener('click', () => this.prev());
    this.card.querySelector('#tour-next')!.addEventListener('click', () => this.next());
    this.card.querySelector('#tour-exit')!.addEventListener('click', () => this.stop());
    this.onStop(e);
  }
}
