/**
 * Stylized 3D vehicle specs for flagship launchers, rendered procedurally by
 * src/vehicle3d.ts. These are deliberate stylizations in the app's design
 * language — recognizable silhouettes and liveries, not engineering models.
 *
 * Authoring: `body` is a stack of segments bottom → top (real metres; radii
 * in metres). `accent` tints the rim light and glow. `entityIds` lists every
 * entity whose profile shows the vehicle.
 */
export interface BodySegment {
  /** segment height (m) */
  h: number;
  rBottom: number;
  rTop: number;
  color: string;
  metal?: number;
  rough?: number;
}

export interface VehicleSpec {
  entityIds: string[];
  name: string;
  heightM: number;
  accent: string;
  body: BodySegment[];
  boosters?: { count: number; r: number; h: number; color: string };
  fins?: { count: number; h: number; w: number; color: string };
  engines?: { count: number; r: number };
}

export const VEHICLES: VehicleSpec[] = [
  {
    entityIds: ['spacex'],
    name: 'Falcon 9',
    heightM: 70,
    accent: '#ff8c42',
    body: [
      { h: 41, rBottom: 1.85, rTop: 1.85, color: '#eef1f5' },
      { h: 4, rBottom: 1.85, rTop: 1.85, color: '#15181e' },
      { h: 11, rBottom: 1.85, rTop: 1.85, color: '#eef1f5' },
      { h: 2.5, rBottom: 1.85, rTop: 2.6, color: '#eef1f5' },
      { h: 7.5, rBottom: 2.6, rTop: 2.6, color: '#eef1f5' },
      { h: 3.2, rBottom: 2.6, rTop: 0.7, color: '#eef1f5' },
      { h: 0.8, rBottom: 0.7, rTop: 0, color: '#eef1f5' },
    ],
    engines: { count: 9, r: 0.42 },
  },
  {
    entityIds: ['rocket-lab'],
    name: 'Electron',
    heightM: 18,
    accent: '#ff8c42',
    body: [
      { h: 11.5, rBottom: 0.6, rTop: 0.6, color: '#14171d' },
      { h: 0.7, rBottom: 0.6, rTop: 0.6, color: '#eef1f5' },
      { h: 2.3, rBottom: 0.6, rTop: 0.6, color: '#14171d' },
      { h: 0.8, rBottom: 0.6, rTop: 0.72, color: '#14171d' },
      { h: 2.2, rBottom: 0.72, rTop: 0.2, color: '#14171d' },
      { h: 0.5, rBottom: 0.2, rTop: 0, color: '#14171d' },
    ],
    engines: { count: 9, r: 0.14 },
  },
  {
    entityIds: ['blue-origin'],
    name: 'New Glenn',
    heightM: 98,
    accent: '#3d7fe0',
    body: [
      { h: 56, rBottom: 3.5, rTop: 3.5, color: '#eef1f5' },
      { h: 3, rBottom: 3.5, rTop: 3.5, color: '#1c4fd6' },
      { h: 24, rBottom: 3.5, rTop: 3.5, color: '#eef1f5' },
      { h: 11, rBottom: 3.5, rTop: 1.1, color: '#eef1f5' },
      { h: 4, rBottom: 1.1, rTop: 0, color: '#eef1f5' },
    ],
    fins: { count: 2, h: 7, w: 4.2, color: '#d8dde5' },
    engines: { count: 7, r: 0.8 },
  },
  {
    entityIds: ['ula'],
    name: 'Vulcan Centaur',
    heightM: 62,
    accent: '#c0432e',
    body: [
      { h: 33, rBottom: 2.7, rTop: 2.7, color: '#eef1f5' },
      { h: 1.6, rBottom: 2.7, rTop: 2.7, color: '#7a3021' },
      { h: 13, rBottom: 2.7, rTop: 2.7, color: '#eef1f5' },
      { h: 10, rBottom: 2.7, rTop: 0.9, color: '#eef1f5' },
      { h: 2.5, rBottom: 0.9, rTop: 0, color: '#eef1f5' },
    ],
    boosters: { count: 2, r: 0.8, h: 20, color: '#dfe4ea' },
    engines: { count: 2, r: 0.7 },
  },
  {
    entityIds: ['arianespace', 'arianegroup'],
    name: 'Ariane 6',
    heightM: 63,
    accent: '#5aa2ff',
    body: [
      { h: 30, rBottom: 2.7, rTop: 2.7, color: '#eef1f5' },
      { h: 1.6, rBottom: 2.7, rTop: 2.7, color: '#123a8f' },
      { h: 13, rBottom: 2.7, rTop: 2.7, color: '#eef1f5' },
      { h: 13, rBottom: 2.7, rTop: 0.9, color: '#eef1f5' },
      { h: 2.6, rBottom: 0.9, rTop: 0, color: '#eef1f5' },
    ],
    boosters: { count: 2, r: 1.1, h: 20, color: '#e8e2d4' },
    engines: { count: 1, r: 0.95 },
  },
  {
    entityIds: ['skyroot'],
    name: 'Vikram-1',
    heightM: 20,
    accent: '#5aa2ff',
    body: [
      { h: 12, rBottom: 0.85, rTop: 0.85, color: '#101527' },
      { h: 0.6, rBottom: 0.85, rTop: 0.85, color: '#eef1f5' },
      { h: 4, rBottom: 0.85, rTop: 0.85, color: '#101527' },
      { h: 2.6, rBottom: 0.85, rTop: 0.3, color: '#eef1f5' },
      { h: 0.7, rBottom: 0.3, rTop: 0, color: '#eef1f5' },
    ],
    fins: { count: 4, h: 2.2, w: 1.3, color: '#1a2138' },
    engines: { count: 1, r: 0.34 },
  },
  {
    entityIds: ['landspace'],
    name: 'Zhuque-2',
    heightM: 50,
    accent: '#22d3ee',
    body: [
      { h: 33, rBottom: 1.68, rTop: 1.68, color: '#eef1f5' },
      { h: 1.4, rBottom: 1.68, rTop: 1.68, color: '#0e7c92' },
      { h: 9, rBottom: 1.68, rTop: 1.68, color: '#eef1f5' },
      { h: 5.4, rBottom: 1.68, rTop: 0.5, color: '#eef1f5' },
      { h: 1.2, rBottom: 0.5, rTop: 0, color: '#eef1f5' },
    ],
    engines: { count: 4, r: 0.42 },
  },
  {
    entityIds: ['isar-aerospace'],
    name: 'Spectrum',
    heightM: 28,
    accent: '#c084fc',
    body: [
      { h: 18, rBottom: 1, rTop: 1, color: '#f2f4f7' },
      { h: 1, rBottom: 1, rTop: 1, color: '#191d26' },
      { h: 4.4, rBottom: 1, rTop: 1, color: '#f2f4f7' },
      { h: 3.6, rBottom: 1, rTop: 0.32, color: '#191d26' },
      { h: 1, rBottom: 0.32, rTop: 0, color: '#191d26' },
    ],
    engines: { count: 9, r: 0.2 },
  },
  {
    entityIds: ['firefly'],
    name: 'Alpha',
    heightM: 29,
    accent: '#34d399',
    body: [
      { h: 19, rBottom: 0.9, rTop: 0.9, color: '#171a20' },
      { h: 0.8, rBottom: 0.9, rTop: 0.9, color: '#eef1f5' },
      { h: 4.6, rBottom: 0.9, rTop: 0.9, color: '#171a20' },
      { h: 3.6, rBottom: 0.9, rTop: 0.3, color: '#171a20' },
      { h: 1, rBottom: 0.3, rTop: 0, color: '#171a20' },
    ],
    engines: { count: 4, r: 0.28 },
  },
  {
    entityIds: ['relativity'],
    name: 'Terran R',
    heightM: 82,
    accent: '#9aa3ad',
    body: [
      { h: 52, rBottom: 2.75, rTop: 2.75, color: '#aab3bd', metal: 0.75, rough: 0.32 },
      { h: 2.4, rBottom: 2.75, rTop: 2.75, color: '#2a2f38', metal: 0.6, rough: 0.4 },
      { h: 16, rBottom: 2.75, rTop: 2.75, color: '#aab3bd', metal: 0.75, rough: 0.32 },
      { h: 9.5, rBottom: 2.75, rTop: 0.9, color: '#aab3bd', metal: 0.75, rough: 0.32 },
      { h: 2.1, rBottom: 0.9, rTop: 0, color: '#aab3bd', metal: 0.75, rough: 0.32 },
    ],
    engines: { count: 13, r: 0.5 },
  },
  {
    entityIds: ['agnikul'],
    name: 'Agnibaan',
    heightM: 18,
    accent: '#ff8c42',
    body: [
      { h: 11, rBottom: 0.65, rTop: 0.65, color: '#f2f4f7' },
      { h: 0.7, rBottom: 0.65, rTop: 0.65, color: '#131720' },
      { h: 3.2, rBottom: 0.65, rTop: 0.65, color: '#f2f4f7' },
      { h: 2.4, rBottom: 0.65, rTop: 0.22, color: '#f2f4f7' },
      { h: 0.7, rBottom: 0.22, rTop: 0, color: '#f2f4f7' },
    ],
    engines: { count: 7, r: 0.12 },
  },
];

/** Lookup: entity id → vehicle spec. */
export const VEHICLE_BY_ENTITY = new Map<string, VehicleSpec>(
  VEHICLES.flatMap((v) => v.entityIds.map((id) => [id, v] as [string, VehicleSpec])),
);
