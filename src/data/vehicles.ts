/**
 * Stylized 3D vehicle specs for flagship launchers, rendered procedurally by
 * src/vehicle3d.ts. These are deliberate stylizations in the app's design
 * language — recognizable silhouettes and liveries, not engineering models —
 * but `stats` carries real public figures (conservative where sources vary).
 *
 * Authoring: `body` is a stack of segments bottom → top (real metres).
 * Distinctive features: `gridFins` (Falcon-style), `legs` (stowed landing
 * legs), `strakes` (aft fins), `boosters`, `glowRing` accent. `entityIds`
 * lists every entity whose profile shows the vehicle.
 */
export interface BodySegment {
  h: number;
  rBottom: number;
  rTop: number;
  color: string;
  metal?: number;
  rough?: number;
}

export interface VehicleStats {
  diameter: string;
  stages: string;
  engines: string;
  propellant: string;
  payloadLeo: string;
  firstFlight: string;
}

export interface VehicleSpec {
  entityIds: string[];
  name: string;
  heightM: number;
  accent: string;
  stats: VehicleStats;
  body: BodySegment[];
  boosters?: { count: number; r: number; h: number; color: string; noseColor?: string };
  strakes?: { count: number; h: number; w: number; color: string };
  gridFins?: { y: number; size: number; color: string };
  legs?: { count: number; len: number; color: string };
  engines?: { count: number; r: number };
}

export const VEHICLES: VehicleSpec[] = [
  {
    entityIds: ['spacex'],
    name: 'Falcon 9',
    heightM: 70,
    accent: '#ff8c42',
    stats: {
      diameter: '3.7 m',
      stages: '2',
      engines: '9 × Merlin 1D',
      propellant: 'RP-1 / LOX',
      payloadLeo: '22,800 kg',
      firstFlight: '2010',
    },
    body: [
      { h: 41, rBottom: 1.85, rTop: 1.85, color: '#eef1f5' },
      { h: 4, rBottom: 1.85, rTop: 1.85, color: '#15181e' },
      { h: 11, rBottom: 1.85, rTop: 1.85, color: '#eef1f5' },
      { h: 2.5, rBottom: 1.85, rTop: 2.6, color: '#eef1f5' },
      { h: 7.5, rBottom: 2.6, rTop: 2.6, color: '#eef1f5' },
      { h: 3.2, rBottom: 2.6, rTop: 0.7, color: '#eef1f5' },
      { h: 0.8, rBottom: 0.7, rTop: 0, color: '#eef1f5' },
    ],
    gridFins: { y: 44.2, size: 1.35, color: '#3a4048' },
    legs: { count: 4, len: 15, color: '#15181e' },
    engines: { count: 9, r: 0.42 },
  },
  {
    entityIds: ['rocket-lab'],
    name: 'Electron',
    heightM: 18,
    accent: '#ff8c42',
    stats: {
      diameter: '1.2 m',
      stages: '2 + kick stage',
      engines: '9 × Rutherford',
      propellant: 'RP-1 / LOX',
      payloadLeo: '300 kg',
      firstFlight: '2017',
    },
    body: [
      { h: 11.5, rBottom: 0.6, rTop: 0.6, color: '#101318', metal: 0.35, rough: 0.3 },
      { h: 0.7, rBottom: 0.6, rTop: 0.6, color: '#eef1f5' },
      { h: 2.3, rBottom: 0.6, rTop: 0.6, color: '#101318', metal: 0.35, rough: 0.3 },
      { h: 0.8, rBottom: 0.6, rTop: 0.72, color: '#101318', metal: 0.35, rough: 0.3 },
      { h: 2.2, rBottom: 0.72, rTop: 0.2, color: '#101318', metal: 0.35, rough: 0.3 },
      { h: 0.5, rBottom: 0.2, rTop: 0, color: '#101318', metal: 0.35, rough: 0.3 },
    ],
    engines: { count: 9, r: 0.14 },
  },
  {
    entityIds: ['blue-origin'],
    name: 'New Glenn',
    heightM: 98,
    accent: '#3d7fe0',
    stats: {
      diameter: '7 m',
      stages: '2',
      engines: '7 × BE-4',
      propellant: 'LNG / LOX',
      payloadLeo: '45,000 kg',
      firstFlight: '2025',
    },
    body: [
      { h: 50, rBottom: 3.5, rTop: 3.5, color: '#eef1f5' },
      { h: 3, rBottom: 3.5, rTop: 3.5, color: '#1c4fd6' },
      { h: 6, rBottom: 3.5, rTop: 3.5, color: '#eef1f5' },
      { h: 24, rBottom: 3.5, rTop: 3.5, color: '#f4f6f9' },
      { h: 11, rBottom: 3.5, rTop: 1.1, color: '#f4f6f9' },
      { h: 4, rBottom: 1.1, rTop: 0, color: '#f4f6f9' },
    ],
    strakes: { count: 2, h: 9, w: 4.6, color: '#c9d2dd' },
    engines: { count: 7, r: 0.8 },
  },
  {
    entityIds: ['ula'],
    name: 'Vulcan Centaur',
    heightM: 62,
    accent: '#c0432e',
    stats: {
      diameter: '5.4 m',
      stages: '2 + up to 6 SRBs',
      engines: '2 × BE-4',
      propellant: 'LNG / LOX',
      payloadLeo: '27,200 kg',
      firstFlight: '2024',
    },
    body: [
      { h: 4, rBottom: 2.7, rTop: 2.7, color: '#8a5a2b', metal: 0.7, rough: 0.35 },
      { h: 29, rBottom: 2.7, rTop: 2.7, color: '#eef1f5' },
      { h: 1.6, rBottom: 2.7, rTop: 2.7, color: '#7a3021' },
      { h: 13, rBottom: 2.7, rTop: 2.7, color: '#eef1f5' },
      { h: 10, rBottom: 2.7, rTop: 0.9, color: '#eef1f5' },
      { h: 2.5, rBottom: 0.9, rTop: 0, color: '#eef1f5' },
    ],
    boosters: { count: 2, r: 0.8, h: 20, color: '#dfe4ea', noseColor: '#3a4048' },
    engines: { count: 2, r: 0.7 },
  },
  {
    entityIds: ['arianespace', 'arianegroup'],
    name: 'Ariane 6',
    heightM: 63,
    accent: '#5aa2ff',
    stats: {
      diameter: '5.4 m',
      stages: '2 + 2–4 boosters',
      engines: 'Vulcain 2.1 + Vinci',
      propellant: 'LH2 / LOX',
      payloadLeo: '21,600 kg',
      firstFlight: '2024',
    },
    body: [
      { h: 30, rBottom: 2.7, rTop: 2.7, color: '#eef1f5' },
      { h: 1.6, rBottom: 2.7, rTop: 2.7, color: '#123a8f' },
      { h: 13, rBottom: 2.7, rTop: 2.7, color: '#eef1f5' },
      { h: 13, rBottom: 2.7, rTop: 0.9, color: '#eef1f5' },
      { h: 2.6, rBottom: 0.9, rTop: 0, color: '#eef1f5' },
    ],
    boosters: { count: 2, r: 1.1, h: 20, color: '#e5dfd0', noseColor: '#c9bfa5' },
    engines: { count: 1, r: 0.95 },
  },
  {
    entityIds: ['skyroot'],
    name: 'Vikram-1',
    heightM: 20,
    accent: '#5aa2ff',
    stats: {
      diameter: '≈1.8 m',
      stages: '3 solid + liquid stage',
      engines: 'Kalam solids + Raman liquid',
      propellant: 'Solid / liquid',
      payloadLeo: '≈300–480 kg',
      firstFlight: 'In development',
    },
    body: [
      { h: 8, rBottom: 0.9, rTop: 0.9, color: '#eef1f5' },
      { h: 0.6, rBottom: 0.9, rTop: 0.9, color: '#101527' },
      { h: 5, rBottom: 0.9, rTop: 0.9, color: '#eef1f5' },
      { h: 3.1, rBottom: 0.9, rTop: 0.9, color: '#101527' },
      { h: 2.6, rBottom: 0.9, rTop: 0.32, color: '#eef1f5' },
      { h: 0.7, rBottom: 0.32, rTop: 0, color: '#101527' },
    ],
    strakes: { count: 4, h: 1.9, w: 1.1, color: '#101527' },
    engines: { count: 1, r: 0.36 },
  },
  {
    entityIds: ['landspace'],
    name: 'Zhuque-2',
    heightM: 50,
    accent: '#22d3ee',
    stats: {
      diameter: '3.35 m',
      stages: '2',
      engines: '4 × TQ-12',
      propellant: 'Methane / LOX',
      payloadLeo: '6,000 kg',
      firstFlight: '2022',
    },
    body: [
      { h: 3, rBottom: 1.68, rTop: 1.68, color: '#20262f', metal: 0.5, rough: 0.4 },
      { h: 29, rBottom: 1.68, rTop: 1.68, color: '#eef1f5' },
      { h: 2.6, rBottom: 1.68, rTop: 1.68, color: '#0e7c92' },
      { h: 8, rBottom: 1.68, rTop: 1.68, color: '#eef1f5' },
      { h: 6, rBottom: 1.68, rTop: 0.5, color: '#eef1f5' },
      { h: 1.4, rBottom: 0.5, rTop: 0, color: '#0e7c92' },
    ],
    engines: { count: 4, r: 0.42 },
  },
  {
    entityIds: ['isar-aerospace'],
    name: 'Spectrum',
    heightM: 28,
    accent: '#c084fc',
    stats: {
      diameter: '2 m',
      stages: '2',
      engines: '9 × Aquila',
      propellant: 'Propane / LOX',
      payloadLeo: '1,000 kg',
      firstFlight: '2025',
    },
    body: [
      { h: 2.2, rBottom: 1, rTop: 1, color: '#191d26' },
      { h: 16, rBottom: 1, rTop: 1, color: '#f2f4f7' },
      { h: 1, rBottom: 1, rTop: 1, color: '#191d26' },
      { h: 4.2, rBottom: 1, rTop: 1, color: '#f2f4f7' },
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
    stats: {
      diameter: '1.8 m',
      stages: '2',
      engines: '4 × Reaver 1',
      propellant: 'RP-1 / LOX',
      payloadLeo: '1,030 kg',
      firstFlight: '2021',
    },
    body: [
      { h: 18, rBottom: 0.9, rTop: 0.9, color: '#171a20', metal: 0.35, rough: 0.32 },
      { h: 1.2, rBottom: 0.9, rTop: 0.9, color: '#1f8a63' },
      { h: 4.2, rBottom: 0.9, rTop: 0.9, color: '#171a20', metal: 0.35, rough: 0.32 },
      { h: 3.6, rBottom: 0.9, rTop: 0.3, color: '#eef1f5' },
      { h: 1, rBottom: 0.3, rTop: 0, color: '#eef1f5' },
    ],
    engines: { count: 4, r: 0.28 },
  },
  {
    entityIds: ['relativity'],
    name: 'Terran R',
    heightM: 82,
    accent: '#9aa3ad',
    stats: {
      diameter: '5.5 m',
      stages: '2',
      engines: '13 × Aeon R',
      propellant: 'Methane / LOX',
      payloadLeo: '23,500 kg',
      firstFlight: 'In development',
    },
    body: [
      { h: 52, rBottom: 2.75, rTop: 2.75, color: '#aab3bd', metal: 0.85, rough: 0.25 },
      { h: 2.4, rBottom: 2.75, rTop: 2.75, color: '#2a2f38', metal: 0.6, rough: 0.4 },
      { h: 16, rBottom: 2.75, rTop: 2.75, color: '#aab3bd', metal: 0.85, rough: 0.25 },
      { h: 9.5, rBottom: 2.75, rTop: 0.9, color: '#aab3bd', metal: 0.85, rough: 0.25 },
      { h: 2.1, rBottom: 0.9, rTop: 0, color: '#aab3bd', metal: 0.85, rough: 0.25 },
    ],
    legs: { count: 4, len: 16, color: '#2a2f38' },
    engines: { count: 13, r: 0.5 },
  },
  {
    entityIds: ['agnikul'],
    name: 'Agnibaan',
    heightM: 18,
    accent: '#ff8c42',
    stats: {
      diameter: '1.3 m',
      stages: '2',
      engines: '7 × Agnilet',
      propellant: 'Kerosene / LOX',
      payloadLeo: '300 kg',
      firstFlight: 'In development',
    },
    body: [
      { h: 10, rBottom: 0.65, rTop: 0.65, color: '#f2f4f7' },
      { h: 1, rBottom: 0.65, rTop: 0.65, color: '#d4581f' },
      { h: 3, rBottom: 0.65, rTop: 0.65, color: '#f2f4f7' },
      { h: 2.4, rBottom: 0.65, rTop: 0.22, color: '#131720' },
      { h: 0.7, rBottom: 0.22, rTop: 0, color: '#131720' },
    ],
    engines: { count: 7, r: 0.12 },
  },
];

/** Lookup: entity id → vehicle spec. */
export const VEHICLE_BY_ENTITY = new Map<string, VehicleSpec>(
  VEHICLES.flatMap((v) => v.entityIds.map((id) => [id, v] as [string, VehicleSpec])),
);
