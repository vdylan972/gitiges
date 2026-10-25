/**
 * PleziPeyi — « Soyez là quand ça compte »
 * Reel Instagram 1080 × 1920, 30 fps, 25 s (750 frames).
 *
 * TOUT le film est piloté depuis ce fichier : textes, durées, couleurs,
 * assets, étalonnage, fil, sons. Les composants ne contiennent aucune valeur
 * éditoriale. Toutes les frames sont ABSOLUES (frame 0 = début du film).
 *
 * Ce fichier ne doit rien importer : il est aussi lu par `npm run check-assets`.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SceneId = 'f1' | 'f2' | 'f3' | 'f4' | 'f5';

export type ShotConfig = {
  /** Identifiant interne (utilisé par le fil, les sons, la couverture). */
  id: string;
  /** Libellé affiché par le placeholder. */
  label: string;
  scene: SceneId;
  /** Chemin dans /public. */
  src: string;
  /** Description du plan attendu (affichée si le fichier manque). */
  description: string;
  /** Début du plan (frame absolue). Pour F1, recalculé sur les temps si un BPM est fourni. */
  from: number;
  durationInFrames: number;
  /** Fondu enchaîné d'entrée, en frames, centré sur `from`. 0 = cut sec. */
  transitionIn: number;
  /** Point de recadrage pour object-fit: cover (0 = gauche/haut, 1 = droite/bas). */
  focalX: number;
  focalY: number;
  /** Vitesse de lecture du rush (0.8 = léger ralenti). Réduite automatiquement si le rush est trop court. */
  speed: number;
  /** Point d'entrée dans le rush, en secondes. */
  inPoint?: number;
  /** Push-in : échelle de départ → échelle d'arrivée sur la durée du plan. */
  pushIn?: [number, number];
  /** Flou + assombrissement (fond de la séquence téléphone). */
  blur?: number;
  darken?: number;
};

export type Grade = {
  saturate: number;
  brightness: number;
  contrast: number;
  /** Voile coloré posé sur l'image (étalonnage). */
  overlayColor: string;
  overlayOpacity: number;
  overlayBlend: 'normal' | 'soft-light' | 'overlay' | 'color' | 'multiply';
};

export type SfxConfig = {
  id: string;
  src: string;
  /** Frame absolue, ou ancrage sur le début d'un plan (suit le recalage BPM de F1). */
  at: number | { shot: string; offset: number };
  volume: number;
  /** Durée max de lecture (frames). Absent = jusqu'à la fin du fichier. */
  durationInFrames?: number;
  fadeIn?: number;
  fadeOut?: number;
};

// ---------------------------------------------------------------------------
// Format
// ---------------------------------------------------------------------------

export const video = {
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 750,
} as const;

// ---------------------------------------------------------------------------
// Marque
// ---------------------------------------------------------------------------

export const brand = {
  // À REMPLACER PAR LA CHARTE OFFICIELLE
  colors: {
    primary: '#1F1A17', // À REMPLACER PAR LA CHARTE OFFICIELLE
    accent: '#D9822B', // À REMPLACER PAR LA CHARTE OFFICIELLE
    textLight: '#FFFFFF', // À REMPLACER PAR LA CHARTE OFFICIELLE
    textDark: '#1F1A17', // À REMPLACER PAR LA CHARTE OFFICIELLE
    background: '#F6EFE6', // À REMPLACER PAR LA CHARTE OFFICIELLE
  },
  logo: {
    color: 'assets/brand/logo-color.svg',
    white: 'assets/brand/logo-white.svg',
  },
};

// ---------------------------------------------------------------------------
// Polices
// ---------------------------------------------------------------------------
// PROVISOIRE : DM Sans (sans-serif humaniste, licence OFL), embarquée dans
// public/assets/brand/fonts/provisoire/ pour un rendu sans dépendance réseau.
// Pour passer aux polices de marque : déposez les fichiers dans
// public/assets/brand/fonts/, remplacez `files` et les `family` ci-dessous.

export const fonts = {
  /** weight : un poids ('500') ou une plage pour une police variable ('100 1000'). */
  files: [
    { family: 'DM Sans', src: 'assets/brand/fonts/provisoire/DMSans-latin-variable.woff2', weight: '100 1000' },
  ] as Array<{ family: string; src: string; weight: string; style?: 'normal' | 'italic' }>,
  title: { family: 'DM Sans', weight: 500 }, // À REMPLACER PAR LA POLICE DE MARQUE
  body: { family: 'DM Sans', weight: 400 }, // À REMPLACER PAR LA POLICE DE MARQUE
};

// ---------------------------------------------------------------------------
// Textes écran (casse normale, sans point d'exclamation, sans émoji)
// ---------------------------------------------------------------------------

export const texts = {
  s1: 'La vie va vite.',
  s2: 'La vie vous emmène loin.',
  s3Line1: 'Mais certaines personnes',
  s3Line2: 'ne sont jamais vraiment loin.',
  s5Line1: 'Soyez là quand ça compte.',
  s5Line2: 'Même quand vous êtes loin.',
  /** Texte de la couverture du Reel (une entrée = une ligne). */
  cover: ['Certaines personnes', 'ne sont jamais vraiment loin.'],
  /** Handle Instagram ou URL. Laisser vide pour ne rien afficher. Ex. '@plezipeyi' */
  handle: '',
};

// ---------------------------------------------------------------------------
// Typographie & animation des textes
// ---------------------------------------------------------------------------

export const typography = {
  titleSize: 66, // 64 à 76 px (au-delà, « ne sont jamais vraiment loin. » passe sur deux lignes)
  signatureSize: 56,
  handleSize: 32,
  lineHeight: 1.15,
  shadowOnVideo: '0 2px 24px rgba(0,0,0,0.35)',
  /** Seconde ligne de la signature : 'lighter' (poids plus léger) ou 'accent' (couleur accent). */
  signatureLine2Style: 'lighter' as 'lighter' | 'accent',
  signatureLine2Weight: 300,
  animation: {
    /** Décalage entre deux mots (mode mot par mot). */
    wordStagger: 4,
    /** Spring Remotion : amorti, sans rebond. */
    damping: 200,
    springDuration: 20,
    translateY: 24,
    /** Disparition en fondu. */
    exitFrames: 8,
  },
};

// ---------------------------------------------------------------------------
// Mise en page (px, sur 1080 × 1920)
// ---------------------------------------------------------------------------

export const layout = {
  safeZone: { top: 250, bottom: 420, side: 90 },
  /** Centre vertical des textes. */
  textY: {
    s1: 860, // légèrement au-dessus du milieu (960)
    s2: 860,
    s3: 880,
    s5Line1: 1110,
    s5Line2: 1185,
  },
  logo: { centerY: 860, width: 520 },
  /** Position du handle : bas de la zone de sécurité. */
  handleBottomY: 1920 - 420,
};

// ---------------------------------------------------------------------------
// Timeline (frames absolues)
// ---------------------------------------------------------------------------

export const timeline = {
  scenes: {
    f1: { from: 0, durationInFrames: 90 }, // La vie va vite
    f2: { from: 90, durationInFrames: 150 }, // La vie vous emmène loin
    f3: { from: 240, durationInFrames: 180 }, // Certaines personnes…
    f4: { from: 420, durationInFrames: 210 }, // Le geste (A : 420-510, B : 510-630)
    f5: { from: 630, durationInFrames: 120 }, // Signature
  },
  texts: {
    s1: { from: 12, to: 84 },
    s2: { from: 105, to: 228 },
    s3: { line1: 255, line2: 275, to: 405 },
    s5: { line1: 675, line2: 700, handle: 720 },
  },
  /** Fondu de la réaction vers le fond de marque. */
  signatureFadeIn: { from: 630, durationInFrames: 10 },
  /** Apparition du logo (opacité + scale 0.96 → 1). */
  logoIn: { from: 640, durationInFrames: 30, scaleFrom: 0.96 },
  /** Séquence téléphone (F4-A). */
  phone: {
    from: 420,
    to: 510,
    enterFrames: 10,
    slideFrames: 8,
    /** Début d'affichage de chaque écran. */
    screens: [
      { key: 'catalog', from: 420, tap: { frame: 440, x: 0.3, y: 0.42 } },
      { key: 'product', from: 452, tap: { frame: 472, x: 0.5, y: 0.86 } },
      { key: 'confirm', from: 482, tap: { frame: 496, x: 0.5, y: 0.86 } },
    ] as Array<{ key: 'catalog' | 'product' | 'confirm'; from: number; tap: { frame: number; x: number; y: number } }>,
    /** Frame de validation : le fil part de l'écran, whoosh. */
    validateFrame: 496,
  },
};

// ---------------------------------------------------------------------------
// Plans
// ---------------------------------------------------------------------------

const f1 = (n: number, description: string, focalX = 0.5, focalY = 0.5): ShotConfig => ({
  id: `f1-0${n}`,
  label: `F1-0${n}`,
  scene: 'f1',
  src: `assets/video/f1/f1-0${n}.mp4`,
  description,
  from: (n - 1) * 15,
  durationInFrames: 15,
  transitionIn: 0,
  focalX,
  focalY,
  speed: 1,
});

const f2 = (n: number, description: string, focalX = 0.5, focalY = 0.5): ShotConfig => ({
  id: `f2-0${n}`,
  label: `F2-0${n}`,
  scene: 'f2',
  src: `assets/video/f2/f2-0${n}.mp4`,
  description,
  from: 90 + (n - 1) * 30,
  durationInFrames: 30,
  transitionIn: n === 1 ? 0 : 6,
  focalX,
  focalY,
  speed: 0.8,
});

const f3 = (n: number, description: string, focalX = 0.5, focalY = 0.4): ShotConfig => ({
  id: `f3-0${n}`,
  label: `F3-0${n}`,
  scene: 'f3',
  src: `assets/video/f3/f3-0${n}.mp4`,
  description,
  from: 240 + (n - 1) * 45,
  durationInFrames: 45,
  transitionIn: n === 1 ? 10 : 8,
  focalX,
  focalY,
  speed: 1,
});

export const shots: ShotConfig[] = [
  // SCÈNE 1 — La vie va vite (cuts secs de 15 frames)
  f1(1, 'Caddie poussé dans un supermarché'),
  f1(2, 'Machine à laver qui tourne (hublot)'),
  f1(3, 'Cuisine en vitesse (mains, poêle)'),
  f1(4, 'Mains sur un téléphone ou un clavier'),
  f1(5, 'Clés attrapées sur un meuble, sac à l’épaule'),
  f1(6, 'Portique ou quai de métro'),

  // SCÈNE 2 — La vie vous emmène loin (fondus de 6 frames, ralenti 0.8)
  f2(1, 'Paris, toits ou vue sur la ville, ciel gris'),
  f2(2, 'Quai de RER ou de métro en heure de pointe'),
  f2(3, 'Rue d’une grande ville de l’Hexagone (Lyon, Marseille, Bordeaux…)'),
  f2(4, 'Fenêtre de bureau ou d’appartement, pluie sur la vitre'),
  f2(5, 'Silhouette qui marche seule, de dos'),

  // SCÈNE 3 — Certaines personnes ne sont jamais vraiment loin (fondus de 8 frames)
  f3(1, 'Une mère regarde son téléphone et sourit légèrement'),
  f3(2, 'Une grand-mère chez elle, lumière naturelle de fin de journée'),
  f3(3, 'Un frère et une sœur, ou un couple, dans un moment complice'),
  f3(4, 'Un enfant qui fête son anniversaire (bougies, rires)'),

  // SCÈNE 4-A — L'envoi (fond flouté sous le téléphone)
  {
    id: 'f4-hands-phone',
    label: 'F4-A — hands-phone',
    scene: 'f4',
    src: 'assets/video/f4/f4-hands-phone.mp4',
    description: 'Mains qui tiennent un téléphone (fond flouté sous l’interface)',
    from: 420,
    durationInFrames: 90,
    transitionIn: 8,
    focalX: 0.5,
    focalY: 0.5,
    speed: 1,
    blur: 18,
    darken: 0.45,
  },
  // SCÈNE 4-B — L'arrivée (cuts)
  {
    id: 'f4-arrival',
    label: 'F4-B1 — arrival',
    scene: 'f4',
    src: 'assets/video/f4/f4-arrival.mp4',
    description: 'Quelqu’un arrive au portail ou à la porte d’une maison en Martinique',
    from: 510,
    durationInFrames: 30,
    transitionIn: 0,
    focalX: 0.5,
    focalY: 0.5,
    speed: 1,
  },
  {
    id: 'f4-door',
    label: 'F4-B2 — door',
    scene: 'f4',
    src: 'assets/video/f4/f4-door.mp4',
    description: 'La porte s’ouvre',
    from: 540,
    durationInFrames: 25,
    transitionIn: 0,
    focalX: 0.5,
    focalY: 0.5,
    speed: 1,
  },
  {
    id: 'f4-reveal',
    label: 'F4-B3 — reveal',
    scene: 'f4',
    src: 'assets/video/f4/f4-reveal.mp4',
    description: 'Les mains ouvrent le cadeau (papier ou carton)',
    from: 565,
    durationInFrames: 30,
    transitionIn: 0,
    focalX: 0.5,
    focalY: 0.55,
    speed: 1,
  },
  {
    id: 'f4-reaction',
    label: 'F4-B4 — reaction',
    scene: 'f4',
    src: 'assets/video/f4/f4-reaction.mp4',
    description: 'La personne découvre le cadeau : un temps de silence, puis un sourire naturel',
    from: 595,
    // Prolongé jusqu'à 640 pour le fondu vers la signature (630 → 640).
    durationInFrames: 45,
    transitionIn: 0,
    focalX: 0.5,
    focalY: 0.4,
    speed: 1,
  },
];

// ---------------------------------------------------------------------------
// Interface du service (captures réelles uniquement)
// ---------------------------------------------------------------------------

export const ui = {
  screens: {
    catalog: 'assets/ui/screen-catalog.png',
    product: 'assets/ui/screen-product.png',
    confirm: 'assets/ui/screen-confirm.png',
  },
  phoneFrame: 'assets/ui/phone-frame.png',
  /**
   * Géométrie du mockup. À AJUSTER selon phone-frame.png :
   * `aspect` = hauteur / largeur de l'image, `screen` = position de l'écran
   * dans l'image, en fractions de sa largeur / hauteur.
   */
  phone: {
    width: 560,
    centerY: 960,
    aspect: 2.04,
    screen: { left: 0.055, top: 0.026, width: 0.89, height: 0.948, radius: 48 },
  },
  missingScreensMessage: 'CAPTURES RÉELLES DU SERVICE À FOURNIR',
};

// ---------------------------------------------------------------------------
// Étalonnage par scène (interpolé de `from` à `to` sur la durée de la scène)
// ---------------------------------------------------------------------------

const neutral: Grade = {
  saturate: 1,
  brightness: 1,
  contrast: 1,
  overlayColor: '#000000',
  overlayOpacity: 0,
  overlayBlend: 'soft-light',
};

export const grading: Record<Exclude<SceneId, 'f5'>, { from: Grade; to?: Grade }> = {
  // F1 : légèrement désaturé, neutre-froid
  f1: { from: { ...neutral, saturate: 0.82, contrast: 1.03, overlayColor: '#8FA6BE', overlayOpacity: 0.18 } },
  // F2 : froid, gris-bleu (l'éloignement)
  f2: {
    from: { ...neutral, saturate: 0.62, brightness: 0.96, contrast: 1.05, overlayColor: '#4E6A85', overlayOpacity: 0.42 },
  },
  // F3 : réchauffement progressif
  f3: {
    from: { ...neutral, saturate: 0.8, brightness: 0.98, contrast: 1.02, overlayColor: '#7E8FA0', overlayOpacity: 0.2 },
    to: { ...neutral, saturate: 1.05, brightness: 1.02, contrast: 1.02, overlayColor: '#E39A55', overlayOpacity: 0.3 },
  },
  // F4 : chaud, lumière naturelle
  f4: { from: { ...neutral, saturate: 1.06, brightness: 1.02, contrast: 1.02, overlayColor: '#E8A05A', overlayOpacity: 0.3 } },
};

// ---------------------------------------------------------------------------
// Le fil
// ---------------------------------------------------------------------------
// Les zones (y en px) sont choisies pour rester hors des visages dans un
// cadrage vertical classique. Ajustez-les une fois les rushes posés.

export const thread = {
  strokeWidth: 3,
  /** Couleur : null = brand.colors.accent */
  color: null as string | null,
  maxOpacity: 0.85,
  glow: 6,
  f1: { bandTop: 1240, bandBottom: 1480, fragmentsPerCut: 3, opacity: 0.7, drawFrames: 4 },
  f2: { y: 1360, sag: 70, drawFrom: 100, drawTo: 226, fadeOutFrom: 230, fadeOutTo: 246, opacity: 0.75 },
  f3: { y: 1420, amplitude: 90, before: 14, after: 18, opacity: 0.75 },
  f4: {
    // Sortie par le haut depuis le bouton de validation.
    exitFrom: 497,
    exitTo: 510,
    // Réapparition par le haut du plan de la porte.
    reenterFrom: 541,
    reenterTo: 564,
    reenterX: 760,
    reenterDepth: 520,
    opacity: 0.8,
  },
  // Courbe qui vient souligner le logo (underlineY = hauteur du soulignement, px).
  f5: { drawFrom: 632, drawTo: 668, fadeFrom: 672, fadeTo: 694, underlineY: 1000, underlineHalfWidth: 230, opacity: 0.85 },
};

// ---------------------------------------------------------------------------
// Audio
// ---------------------------------------------------------------------------

export const music = {
  src: 'assets/audio/music.mp3',
  /** BPM du morceau. null = pas de recalage. */
  bpm: null as number | null,
  /** Frame du premier temps (si bpm renseigné). */
  firstBeatFrame: 0,
  /** Temps saisis à la main (prioritaires sur le bpm). */
  beatFrames: [] as number[],
  /** Tolérance de recalage des cuts de F1 sur les temps. */
  snapTolerance: 2,
  /** Courbe de volume [frame, volume] — toujours interpolée. */
  volumeCurve: [
    [0, 1.0], // F1 : 100 %
    [84, 1.0],
    [96, 0.8], // F2 : 80 %
    [234, 0.8],
    [246, 0.7], // F3 : 70 %
    [565, 0.7],
    [575, 0.15], // 15 % pendant la découverte
    [615, 0.15],
    [640, 0.9], // retour à 90 % pour la signature
    [735, 0.9],
    [750, 0], // fondu de sortie sur les 15 dernières frames
  ] as Array<[number, number]>,
};

export const sfx: SfxConfig[] = [
  { id: 'cash-beep', src: 'assets/audio/sfx/cash-beep.mp3', at: { shot: 'f1-01', offset: 2 }, volume: 0.35, durationInFrames: 12, fadeOut: 3 },
  { id: 'washer', src: 'assets/audio/sfx/washer.mp3', at: { shot: 'f1-02', offset: 0 }, volume: 0.3, durationInFrames: 15, fadeIn: 2, fadeOut: 4 },
  { id: 'keys', src: 'assets/audio/sfx/keys.mp3', at: { shot: 'f1-05', offset: 1 }, volume: 0.35, durationInFrames: 14, fadeOut: 4 },
  { id: 'whoosh', src: 'assets/audio/sfx/whoosh.mp3', at: 496, volume: 0.45, durationInFrames: 24, fadeOut: 6 },
  { id: 'gate', src: 'assets/audio/sfx/gate.mp3', at: 511, volume: 0.7, durationInFrames: 40, fadeOut: 8 },
  { id: 'unwrap', src: 'assets/audio/sfx/unwrap.mp3', at: 567, volume: 0.85, durationInFrames: 45, fadeOut: 10 },
  { id: 'ambience-mq', src: 'assets/audio/sfx/ambience-mq.mp3', at: 510, volume: 0.6, durationInFrames: 140, fadeIn: 12, fadeOut: 20 },
];

// ---------------------------------------------------------------------------
// Couverture
// ---------------------------------------------------------------------------

export const cover = {
  shotId: 'f3-02',
  /** Frame à l'intérieur du plan. */
  frameInShot: 22,
  /** Étalonnage : position dans la scène F3 (0 = début froid, 1 = fin chaude). */
  gradeProgress: 0.7,
  textY: 880,
};

// ---------------------------------------------------------------------------
// Options
// ---------------------------------------------------------------------------

export const options = {
  enableThread: true,
  showSafeZones: false,
  musicVolume: 1,
  sfxVolume: 1,
};

// Stills de contrôle (une frame par scène).
export const controlStills = [45, 165, 330, 470, 610, 735];
