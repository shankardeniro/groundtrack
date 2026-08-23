import type { SpaceEntity } from '../types';

// Curated space investors & VCs — venture firms, deep-tech funds, and
// accelerators that finance the commercial space economy.
export const MORE_INVESTORS: SpaceEntity[] = [
  {
    id: 'founders-fund',
    name: 'Founders Fund',
    category: 'investor',
    country: 'United States',
    mapName: 'United States of America',
    city: 'San Francisco',
    coords: [-122.4194, 37.7749],
    founded: 2005,
    description: [
      'Founders Fund is the San Francisco venture firm co-founded by Peter Thiel, famous for backing contrarian bets that other investors call impossible. In 2008 it became the first institutional investor in SpaceX — at a time when private rockets were widely considered un-investable — and has followed on repeatedly since.',
      'That early conviction helped legitimize space as a venture category. The firm continues to fund frontier and defense-adjacent technology, including Anduril, keeping it at the center of the new aerospace-and-defense investment wave.',
    ],
    programs: [
      { name: 'Founders Fund venture funds', blurb: 'Multi-billion-dollar funds backing contrarian frontier-technology bets.' },
    ],
    milestones: [
      { year: 2005, text: 'Founded by Peter Thiel and partners in San Francisco.' },
      { year: 2008, text: 'Makes the first institutional investment in SpaceX.' },
      { year: 2017, text: 'Backs defense-technology startup Anduril, deepening its aerospace thesis.' },
    ],
    achievements: [
      'First institutional investor in SpaceX',
      'Helped legitimize space as a venture capital category',
      'Backer of frontier defense and aerospace companies like Anduril',
    ],
    tags: ['venture capital', 'frontier tech', 'defense', 'early stage'],
    website: 'https://foundersfund.com',
    related: [{ id: 'spacex', type: 'invested-in' }],
  },
  {
    id: 'lux-capital',
    name: 'Lux Capital',
    category: 'investor',
    country: 'United States',
    mapName: 'United States of America',
    city: 'New York City',
    coords: [-74.006, 40.7128],
    founded: 2000,
    description: [
      'Lux Capital is a New York venture firm that invests where science fiction becomes science fact — funding companies built on hard physics, biology, and engineering rather than software alone. Space has become a natural corner of that portfolio.',
      'The firm co-led the seed round of Varda Space Industries, betting early on in-space manufacturing, and backs a constellation of space-adjacent robotics, AI, and defense startups pushing the frontier of what venture capital will finance.',
    ],
    programs: [
      { name: 'Lux venture funds', blurb: 'Deep-tech funds spanning space, robotics, AI, and frontier science.' },
    ],
    milestones: [
      { year: 2000, text: 'Founded in New York to invest in emerging deep science and technology.' },
      { year: 2020, text: 'Co-leads the seed round of in-space manufacturing startup Varda.' },
    ],
    achievements: [
      'Early backer of in-space manufacturing via Varda',
      'One of the most prominent deep-tech and frontier-science VC firms',
    ],
    tags: ['venture capital', 'deep tech', 'frontier science', 'early stage'],
    website: 'https://www.luxcapital.com',
    related: [{ id: 'varda', type: 'invested-in' }],
  },
  {
    id: 'promus',
    name: 'Promus Ventures',
    category: 'investor',
    country: 'United States',
    mapName: 'United States of America',
    city: 'Chicago',
    coords: [-87.6298, 41.8781],
    founded: 2012,
    description: [
      'Chicago-based Promus Ventures is an early-stage deep-tech investor with one of the best space track records in venture capital, having put early money into Rocket Lab, Spire, and ICEYE before they became household names in the industry.',
      'Through Orbital Ventures, a dedicated space fund based in Luxembourg, the firm channels European capital into launch, Earth observation, and satellite infrastructure startups on both sides of the Atlantic.',
    ],
    programs: [
      { name: 'Orbital Ventures', blurb: 'Luxembourg-based fund dedicated to early-stage space companies.' },
    ],
    milestones: [
      { year: 2012, text: 'Founded in Chicago as an early-stage deep-tech investor.' },
      { year: 2013, text: 'Makes early investments in Rocket Lab and Spire.' },
      { year: 2020, text: 'Launches the Luxembourg-based Orbital Ventures space fund.' },
    ],
    achievements: [
      'Early investor in Rocket Lab, Spire, and ICEYE',
      'Runs a dedicated Luxembourg space fund, Orbital Ventures',
    ],
    tags: ['venture capital', 'deep tech', 'early stage', 'space economy'],
    website: 'https://www.promusventures.com',
    related: [
      { id: 'rocket-lab', type: 'invested-in' },
      { id: 'spire', type: 'invested-in' },
      { id: 'iceye', type: 'invested-in' },
    ],
  },
  {
    id: 'otb',
    name: 'OTB Ventures',
    category: 'investor',
    country: 'Poland',
    city: 'Warsaw',
    coords: [21.0122, 52.2297],
    founded: 2017,
    description: [
      'Warsaw-based OTB Ventures is Central Europe’s leading deep-tech venture firm, built on the thesis that the region’s engineering talent can produce world-class frontier companies. It was an early investor in Finnish radar-satellite operator ICEYE.',
      'With a major SpaceTech fund backed by the European Investment Fund, OTB has become one of Europe’s most active investors in satellites, in-orbit services, and space infrastructure — proof that space venture capital now stretches well beyond London and Silicon Valley.',
    ],
    programs: [
      { name: 'OTB SpaceTech Fund', blurb: 'European Investment Fund-backed fund for space technology startups.' },
    ],
    milestones: [
      { year: 2017, text: 'Founded in Warsaw to back Central European deep-tech founders.' },
      { year: 2018, text: 'Invests early in radar-satellite startup ICEYE.' },
      { year: 2023, text: 'Raises a dedicated SpaceTech fund backed by the European Investment Fund.' },
    ],
    achievements: [
      'Central Europe’s leading deep-tech venture firm',
      'Early ICEYE investor',
      'Runs one of Europe’s largest dedicated space tech funds',
    ],
    tags: ['venture capital', 'deep tech', 'europe', 'space economy'],
    website: 'https://www.otb.vc',
    related: [{ id: 'iceye', type: 'invested-in' }],
  },
  {
    id: 'airbus-ventures',
    name: 'Airbus Ventures',
    category: 'investor',
    country: 'United States',
    mapName: 'United States of America',
    city: 'Menlo Park',
    coords: [-122.1817, 37.4529],
    founded: 2015,
    description: [
      'Airbus Ventures is the independently run venture arm seeded by European aerospace giant Airbus, headquartered in Silicon Valley with offices spanning Europe and Asia. It invests its own funds at frontier-technology startups rather than acting as a strategic checkbook.',
      'Its portfolio of roughly sixty deep-tech companies includes Japanese lunar exploration company ispace and orbital-tracking specialist LeoLabs — bets that span from the Moon’s surface to the increasingly crowded traffic lanes of low Earth orbit.',
    ],
    programs: [
      { name: 'Airbus Ventures funds', blurb: 'Independent venture funds investing in frontier aerospace and deep tech.' },
    ],
    milestones: [
      { year: 2015, text: 'Launched as an independently managed venture firm seeded by Airbus.' },
      { year: 2017, text: 'Backs Japanese lunar exploration startup ispace.' },
    ],
    achievements: [
      'Built a portfolio of around 60 frontier and space startups',
      'Early backer of ispace and LeoLabs',
    ],
    tags: ['venture capital', 'corporate venture', 'aerospace', 'deep tech'],
    website: 'https://www.airbusventures.vc',
    related: [{ id: 'ispace-japan', type: 'invested-in' }],
  },
  {
    id: 'starburst',
    name: 'Starburst Aerospace',
    category: 'investor',
    country: 'United States',
    mapName: 'United States of America',
    city: 'Los Angeles',
    coords: [-118.2437, 34.0522],
    founded: 2012,
    description: [
      'Starburst Aerospace is the world’s leading accelerator dedicated to aviation, space, and defense startups, headquartered in Los Angeles with hubs in Paris, Singapore, Seoul, Munich, Tel Aviv, and Madrid. It sits at the junction where young companies meet aerospace primes and government agencies.',
      'Having accelerated hundreds of startups, Starburst functions as connective tissue for the global aerospace ecosystem — matchmaking founders with corporates, investors, and defense customers who would otherwise be nearly impossible for a small team to reach.',
    ],
    programs: [
      { name: 'Starburst Accelerator', blurb: 'Global accelerator connecting aerospace startups with primes, agencies, and investors.' },
    ],
    milestones: [
      { year: 2012, text: 'Founded as an aerospace-focused accelerator.' },
      { year: 2015, text: 'Expands with international hubs, starting in Los Angeles and Paris.' },
      { year: 2021, text: 'Grows its network across Asia, Europe, and the Middle East.' },
    ],
    achievements: [
      'World’s leading aerospace and defense startup accelerator',
      'Hubs on three continents, from LA to Seoul to Tel Aviv',
      'Has accelerated hundreds of aviation and space startups',
    ],
    tags: ['accelerator', 'aerospace', 'defense', 'startup ecosystem'],
    website: 'https://starburst.aero',
    related: [],
  },
];
