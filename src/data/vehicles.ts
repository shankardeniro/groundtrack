/**
 * Flagship launch vehicles shown in company profiles: real public figures in
 * `stats`, with photography (where cleanly licensed — see vehicle-photos.ts
 * and ATTRIBUTIONS.md) above the spec grid. `entityIds` lists every entity
 * whose profile shows the vehicle.
 */
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
  stats: VehicleStats;
}

export const VEHICLES: VehicleSpec[] = [
  {
    entityIds: ['spacex'],
    name: 'Falcon 9',
    heightM: 70,
    stats: {
      diameter: '3.7 m',
      stages: '2',
      engines: '9 × Merlin 1D',
      propellant: 'RP-1 / LOX',
      payloadLeo: '22,800 kg',
      firstFlight: '2010',
    },
  },
  {
    entityIds: ['rocket-lab'],
    name: 'Electron',
    heightM: 18,
    stats: {
      diameter: '1.2 m',
      stages: '2 + kick stage',
      engines: '9 × Rutherford',
      propellant: 'RP-1 / LOX',
      payloadLeo: '300 kg',
      firstFlight: '2017',
    },
  },
  {
    entityIds: ['blue-origin'],
    name: 'New Glenn',
    heightM: 98,
    stats: {
      diameter: '7 m',
      stages: '2',
      engines: '7 × BE-4',
      propellant: 'LNG / LOX',
      payloadLeo: '45,000 kg',
      firstFlight: '2025',
    },
  },
  {
    entityIds: ['ula'],
    name: 'Vulcan Centaur',
    heightM: 62,
    stats: {
      diameter: '5.4 m',
      stages: '2 + up to 6 SRBs',
      engines: '2 × BE-4',
      propellant: 'LNG / LOX',
      payloadLeo: '27,200 kg',
      firstFlight: '2024',
    },
  },
  {
    entityIds: ['arianespace', 'arianegroup'],
    name: 'Ariane 6',
    heightM: 63,
    stats: {
      diameter: '5.4 m',
      stages: '2 + 2–4 boosters',
      engines: 'Vulcain 2.1 + Vinci',
      propellant: 'LH2 / LOX',
      payloadLeo: '21,600 kg',
      firstFlight: '2024',
    },
  },
  {
    entityIds: ['skyroot'],
    name: 'Vikram-1',
    heightM: 20,
    stats: {
      diameter: '≈1.8 m',
      stages: '3 solid + liquid stage',
      engines: 'Kalam solids + Raman liquid',
      propellant: 'Solid / liquid',
      payloadLeo: '≈300–480 kg',
      firstFlight: 'In development',
    },
  },
  {
    entityIds: ['landspace'],
    name: 'Zhuque-2',
    heightM: 50,
    stats: {
      diameter: '3.35 m',
      stages: '2',
      engines: '4 × TQ-12',
      propellant: 'Methane / LOX',
      payloadLeo: '6,000 kg',
      firstFlight: '2022',
    },
  },
  {
    entityIds: ['isar-aerospace'],
    name: 'Spectrum',
    heightM: 28,
    stats: {
      diameter: '2 m',
      stages: '2',
      engines: '9 × Aquila',
      propellant: 'Propane / LOX',
      payloadLeo: '1,000 kg',
      firstFlight: '2025',
    },
  },
  {
    entityIds: ['firefly'],
    name: 'Alpha',
    heightM: 29,
    stats: {
      diameter: '1.8 m',
      stages: '2',
      engines: '4 × Reaver 1',
      propellant: 'RP-1 / LOX',
      payloadLeo: '1,030 kg',
      firstFlight: '2021',
    },
  },
  {
    entityIds: ['relativity'],
    name: 'Terran R',
    heightM: 82,
    stats: {
      diameter: '5.5 m',
      stages: '2',
      engines: '13 × Aeon R',
      propellant: 'Methane / LOX',
      payloadLeo: '23,500 kg',
      firstFlight: 'In development',
    },
  },
  {
    entityIds: ['agnikul'],
    name: 'Agnibaan',
    heightM: 18,
    stats: {
      diameter: '1.3 m',
      stages: '2',
      engines: '7 × Agnilet',
      propellant: 'Kerosene / LOX',
      payloadLeo: '300 kg',
      firstFlight: 'In development',
    },
  },
];

/** Lookup: entity id → vehicle spec. */
export const VEHICLE_BY_ENTITY = new Map<string, VehicleSpec>(
  VEHICLES.flatMap((v) => v.entityIds.map((id) => [id, v] as [string, VehicleSpec])),
);
