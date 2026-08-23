/** Category of an entity on the map. */
export type Category =
  | 'agency'
  | 'startup'
  | 'manufacturer'
  | 'rnd'
  | 'launch-site'
  | 'ground-station'
  | 'investor';

/** How one entity relates to another. Read as: <source> <type> <target>. */
export type RelationType =
  | 'supplier-of'
  | 'launches-from'
  | 'invested-in'
  | 'partner-of'
  | 'operates'
  | 'tracks-for';

export interface Relation {
  /** id of the target entity */
  id: string;
  type: RelationType;
}

export interface Program {
  name: string;
  blurb: string;
}

export interface Milestone {
  year: number;
  text: string;
}

export interface SpaceEntity {
  id: string;
  name: string;
  category: Category;
  /** Display country name, e.g. "United States" */
  country: string;
  /**
   * Country name as it appears in the world-atlas TopoJSON, when it differs
   * from `country` (e.g. "United States of America"). Used to attach the
   * entity to a country polygon on the map.
   */
  mapName?: string;
  city: string;
  /** [longitude, latitude] */
  coords: [number, number];
  founded: number;
  /** Paragraphs of description text. */
  description: string[];
  programs: Program[];
  milestones: Milestone[];
  achievements: string[];
  tags: string[];
  website: string;
  related: Relation[];
}

export interface CategoryMeta {
  label: string;
  /** Plural label used in stats. */
  plural: string;
  color: string;
}

export const CATEGORIES: Record<Category, CategoryMeta> = {
  agency: { label: 'Space agency', plural: 'Space agencies', color: '#5aa2ff' },
  startup: { label: 'Startup / private', plural: 'Startups & private companies', color: '#ff8c42' },
  manufacturer: { label: 'Manufacturer / supplier', plural: 'Manufacturers & suppliers', color: '#ffd166' },
  rnd: { label: 'R&D / university', plural: 'R&D & universities', color: '#c084fc' },
  'launch-site': { label: 'Launch site', plural: 'Launch sites', color: '#34d399' },
  'ground-station': { label: 'Ground station', plural: 'Ground stations', color: '#22d3ee' },
  investor: { label: 'Investor / VC', plural: 'Investors & VCs', color: '#f472b6' },
};

/** Human-readable phrasing for relations, in both directions. */
export const RELATION_TEXT: Record<RelationType, { fwd: string; rev: string }> = {
  'supplier-of': { fwd: 'supplies', rev: 'is supplied by' },
  'launches-from': { fwd: 'launches from', rev: 'hosts launches for' },
  'invested-in': { fwd: 'invested in', rev: 'is backed by' },
  'partner-of': { fwd: 'partners with', rev: 'partners with' },
  operates: { fwd: 'operates', rev: 'is operated by' },
  'tracks-for': { fwd: 'provides tracking for', rev: 'is tracked by' },
};

/** The map name for a given entity (falls back to display country). */
export function mapCountryName(e: SpaceEntity): string {
  return e.mapName ?? e.country;
}
