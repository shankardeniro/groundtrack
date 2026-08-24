import falcon9 from '../assets/vehicles/falcon9.jpg';
import electron from '../assets/vehicles/electron.jpg';
import newglenn from '../assets/vehicles/newglenn.jpg';
import vulcan from '../assets/vehicles/vulcan.jpg';
import alpha from '../assets/vehicles/alpha.jpg';
import vikram1 from '../assets/vehicles/vikram1.jpg';
import ariane6 from '../assets/vehicles/ariane6.jpg';

/**
 * Real photographs for flagship vehicles, keyed by entity id. All images are
 * verified freely licensed (public domain, CC0, CC BY-SA, or GODL-India) —
 * full sources and license links live in ATTRIBUTIONS.md. Vehicles without a
 * cleanly licensed photo fall back to the stylized 3D model.
 */
export interface VehiclePhoto {
  src: string;
  alt: string;
  credit: string;
  license: string;
}

export const VEHICLE_PHOTOS: Record<string, VehiclePhoto> = {
  spacex: {
    src: falcon9,
    alt: 'Falcon 9 lifting off from Vandenberg on the Iridium-1 mission',
    credit: 'SpaceX',
    license: 'CC0',
  },
  'rocket-lab': {
    src: electron,
    alt: 'Electron climbing away from Launch Complex 1 at Māhia on the TROPICS mission',
    credit: 'NASA KSC / Rocket Lab',
    license: 'Public domain',
  },
  'blue-origin': {
    src: newglenn,
    alt: 'New Glenn launching from Cape Canaveral SLC-36',
    credit: 'US Space Force / G. Kurzen',
    license: 'Public domain',
  },
  ula: {
    src: vulcan,
    alt: 'Vulcan Centaur night launch on its first certification flight',
    credit: 'US Space Force / A1C S. Contreras',
    license: 'Public domain',
  },
  firefly: {
    src: alpha,
    alt: 'Firefly Alpha lifting off from Vandenberg on its maiden flight',
    credit: 'A. Valdez, via Wikimedia Commons',
    license: 'CC BY-SA 4.0',
  },
  skyroot: {
    src: vikram1,
    alt: 'Vikram-1 vertical on the launch pad at Satish Dhawan Space Centre',
    credit: 'ISRO',
    license: 'GODL-India',
  },
  arianespace: {
    src: ariane6,
    alt: 'Full-scale Ariane 6 standing on the launch pad at Europe’s Spaceport in Kourou',
    credit: 'ESA',
    license: 'CC BY-SA 3.0 IGO',
  },
  arianegroup: {
    src: ariane6,
    alt: 'Full-scale Ariane 6 standing on the launch pad at Europe’s Spaceport in Kourou',
    credit: 'ESA',
    license: 'CC BY-SA 3.0 IGO',
  },
};
