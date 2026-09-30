// ===========================================================================
//  DONNÉES DE LA VIDÉO
//  Tous les chiffres (et les textes principaux) sont centralisés ici :
//  modifiez ce fichier, la vidéo se met à jour automatiquement.
// ===========================================================================
import type {Status} from './theme';

/** Passer à true (ou lancer `npm run render:music`) pour utiliser public/music.mp3 */
export const ENABLE_MUSIC = false;
export const MUSIC_VOLUME = 0.6;

export const BRAND = {
  name: 'Benneo',
  url: 'https://benneo.io',
  tagline: 'Des déchets mieux gérés pour des territoires mieux préservés.',
  contest: 'Concours Innovation Outre-Mer · CleanTech & Eau',
};

// ---------------------------------------------------------------------------
// Durées des scènes (en secondes) — le total fait 60 s
// ---------------------------------------------------------------------------
export const SCENE_SECONDS = {
  hook: 5,
  problem: 8,
  solution: 5,
  dashboard: 10,
  sites: 7,
  affluence: 6,
  assistant: 7,
  market: 6,
  outro: 6,
};
/** Durée des transitions entre scènes (en images) */
export const TRANSITION_FRAMES = 18;

// ---------------------------------------------------------------------------
// Scène 2 — Le constat
// ---------------------------------------------------------------------------
export const PROBLEM = {
  title: "Quand l'information manque, le bon geste devient compliqué.",
  cards: [
    {
      icon: 'eye',
      title: 'Aucune visibilité',
      text: 'Impossible de savoir en temps réel si une benne est pleine.',
    },
    {
      icon: 'alert',
      title: 'Débordements',
      text: 'Bennes saturées et dépôts sauvages aux abords des sites.',
    },
    {
      icon: 'data',
      title: 'Données éparpillées',
      text: "Entre appels, messages et tableaux, l'information se perd.",
    },
    {
      icon: 'clock',
      title: 'Rotations mal calées',
      text: 'Des enlèvements déclenchés trop tôt ou trop tard.',
    },
  ] as const,
};

// ---------------------------------------------------------------------------
// Scène 3 — La solution
// ---------------------------------------------------------------------------
export const SOLUTION = {
  text: 'Une plateforme simple, connectée et responsable.',
  products: [
    {name: 'Benneo Pro', desc: 'Pilotage des sites'},
    {name: 'Benneo City', desc: 'Information des usagers'},
  ],
};

// ---------------------------------------------------------------------------
// Scènes 4 & 5 — Les 13 déchèteries de Martinique
// lon/lat : position sur la carte · fill : taux de remplissage moyen (%)
// Les KPIs de la scène 5 (nombre de sites, moyenne, sites ≥ 80 %) sont
// calculés automatiquement à partir de cette liste.
// ---------------------------------------------------------------------------
export type Site = {
  name: string;
  commune: string;
  lon: number;
  lat: number;
  status: Status;
  fill: number;
};

export const SITES: Site[] = [
  {name: 'Chateaubœuf', commune: 'Fort-de-France', lon: -61.045, lat: 14.625, status: 'alert', fill: 76},
  {name: 'Case Navire', commune: 'Schœlcher', lon: -61.098, lat: 14.628, status: 'alert', fill: 75},
  {name: 'Le Marin', commune: 'Le Marin', lon: -60.872, lat: 14.478, status: 'warn', fill: 68},
  {name: 'Le Robert', commune: 'Le Robert', lon: -60.945, lat: 14.679, status: 'warn', fill: 56},
  {name: 'Saint-Esprit', commune: 'Saint-Esprit', lon: -60.935, lat: 14.56, status: 'warn', fill: 51},
  {name: 'Le Vauclin', commune: 'Le Vauclin', lon: -60.845, lat: 14.548, status: 'warn', fill: 50},
  {name: 'Le Lamentin', commune: 'Le Lamentin', lon: -60.995, lat: 14.612, status: 'warn', fill: 49},
  {name: 'Le François', commune: 'Le François', lon: -60.9, lat: 14.618, status: 'warn', fill: 48},
  {name: 'Ducos', commune: 'Ducos', lon: -60.972, lat: 14.575, status: 'ok', fill: 47},
  {name: 'Rivière-Pilote', commune: 'Rivière-Pilote', lon: -60.9, lat: 14.49, status: 'ok', fill: 46},
  {name: 'Saint-Pierre', commune: 'Saint-Pierre', lon: -61.17, lat: 14.742, status: 'ok', fill: 45},
  {name: 'Le Lorrain', commune: 'Le Lorrain', lon: -61.062, lat: 14.822, status: 'ok', fill: 42},
  {name: 'La Trinité', commune: 'La Trinité', lon: -60.968, lat: 14.735, status: 'off', fill: 36},
];

/** Panneau « Taux de remplissage par site » (scène 4) */
export const FILL_RANKING = [
  {name: 'Fort-de-France', fill: 76},
  {name: 'Schœlcher', fill: 75},
  {name: 'Le Marin', fill: 68},
  {name: 'Le Robert', fill: 56},
  {name: 'Saint-Esprit', fill: 51},
];

/** Seuil d'alerte utilisé pour le KPI « sites ≥ X % » */
export const FILL_THRESHOLD = 80;

export const KPIS = {
  sites: SITES.length,
  avgFill: Math.round(SITES.reduce((s, x) => s + x.fill, 0) / SITES.length),
  overThreshold: SITES.filter((s) => s.fill >= FILL_THRESHOLD).length,
};

/** Cartes détaillées de la page Sites (scène 5) */
export const SITE_CARDS: {
  name: string;
  commune: string;
  status: Status;
  fill: number;
  flux: {label: string; fill: number}[];
}[] = [
  {
    name: 'Déchèterie de Chateaubœuf',
    commune: 'Fort-de-France',
    status: 'alert',
    fill: 76,
    flux: [
      {label: 'Encombrants', fill: 92},
      {label: 'Déchets verts', fill: 78},
      {label: 'Métal', fill: 70},
      {label: 'Gravats', fill: 64},
    ],
  },
  {
    name: 'Déchèterie de Case Navire',
    commune: 'Schœlcher',
    status: 'alert',
    fill: 75,
    flux: [
      {label: 'Déchets verts', fill: 90},
      {label: 'Bois', fill: 77},
      {label: 'Cartons', fill: 71},
      {label: 'Métal', fill: 62},
    ],
  },
  {
    name: 'Déchèterie du Marin',
    commune: 'Le Marin',
    status: 'warn',
    fill: 68,
    flux: [
      {label: 'Encombrants', fill: 79},
      {label: 'Déchets verts', fill: 72},
      {label: 'Gravats', fill: 63},
      {label: 'Métal', fill: 58},
    ],
  },
];

// ---------------------------------------------------------------------------
// Scène 6 — Affluence (données de démonstration)
// ---------------------------------------------------------------------------
export const DAILY_VISITS = [
  {day: 'Lun', visits: 318},
  {day: 'Mar', visits: 284},
  {day: 'Mer', visits: 352},
  {day: 'Jeu', visits: 331},
  {day: 'Ven', visits: 406},
  {day: 'Sam', visits: 517},
  {day: 'Dim', visits: 289},
];

export const HEATMAP_DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
export const HEATMAP_HOURS = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

/**
 * Visites moyennes par créneau horaire (lignes = jours, colonnes = heures).
 * Profil réaliste : pic en milieu de matinée, creux à midi, reprise en
 * fin d'après-midi ; samedi très chargé, dimanche uniquement le matin.
 */
export const HEATMAP: number[][] = [
  [14, 26, 38, 42, 36, 18, 12, 22, 30, 34, 24], // Lun
  [12, 22, 34, 38, 30, 16, 10, 20, 28, 30, 20], // Mar
  [16, 28, 42, 46, 40, 20, 14, 26, 34, 36, 26], // Mer
  [14, 26, 40, 44, 36, 18, 12, 24, 32, 34, 24], // Jeu
  [18, 32, 48, 52, 44, 24, 16, 30, 40, 44, 32], // Ven
  [30, 52, 70, 78, 72, 46, 34, 44, 56, 58, 40], // Sam
  [34, 56, 66, 64, 50, 22, 0, 0, 0, 0, 0], // Dim (fermé l'après-midi)
];

// ---------------------------------------------------------------------------
// Scène 7 — Assistant IA (conversation WhatsApp)
// ---------------------------------------------------------------------------
export const ASSISTANT = {
  text: 'Un assistant IA pour les gestionnaires et les habitants.',
  subtitle: 'Sur WhatsApp, 24 h/24, en quelques secondes.',
  greeting: 'Bonjour ! Quelle déchèterie vous intéresse ?',
  siteChoices: ['Le Vauclin', 'Le Marin', 'Le Robert'],
  chosenSite: 'Le Vauclin',
  fluxQuestion: 'Quel flux souhaitez-vous déposer ?',
  fluxChoices: ['Métal', 'Bois', 'Déchets verts'],
  chosenFlux: 'Métal',
  result: {
    title: 'Métal — Déchèterie du Vauclin',
    fill: 82,
    statusText: 'presque pleine',
  },
};

// ---------------------------------------------------------------------------
// Scène 8 — Le marché
// ---------------------------------------------------------------------------
export const MARKET = {
  title: 'Un marché national à équiper',
  stats: [
    {prefix: '', value: 4620, label: 'déchèteries en France'},
    {prefix: '≈ ', value: 1200, label: 'structures publiques compétentes'},
  ],
  networkCaption: 'un réseau à l’échelle nationale',
  networkSize: 14,
};

// ---------------------------------------------------------------------------
// Scène 9 — Conclusion
// ---------------------------------------------------------------------------
export const OUTRO = {
  lines: ['Mieux informer.', 'Mieux piloter.', 'Pour des territoires plus propres.'],
};
