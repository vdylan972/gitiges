import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {loadFont as loadPoppins} from '@remotion/google-fonts/Poppins';
import {Easing} from 'remotion';

// ---------------------------------------------------------------------------
// Polices
// ---------------------------------------------------------------------------
const inter = loadInter('normal', {
  weights: ['400', '500', '600', '700', '800'],
  subsets: ['latin', 'latin-ext'],
});
const poppins = loadPoppins('normal', {
  weights: ['400', '500', '600'],
  subsets: ['latin', 'latin-ext'],
});

export const fonts = {
  /** UI et titres */
  title: inter.fontFamily,
  /** Textes secondaires */
  body: poppins.fontFamily,
};

// ---------------------------------------------------------------------------
// Couleurs
// ---------------------------------------------------------------------------
export const colors = {
  green: '#173A2D', // vert foncé principal : logo, boutons, textes forts
  greenSoft: '#2C5A47',
  lime: '#C8E06B', // accent vert citron
  limeSoft: '#E6F1BE',
  bg: '#F6FBEC', // fond clair
  white: '#FFFFFF',
  sea: '#E4F1EC', // mer autour de la Martinique
  seaLine: '#D2E7DE',
  land: '#F3F8E6',
  landStroke: '#B9D19A',

  text: '#173A2D',
  textMuted: '#5B6B63',
  textSoft: '#8A9A91',
  border: '#E6EDE0',
  track: '#EEF3E6', // fond des jauges

  status: {
    ok: '#4CAF50', // en service
    warn: '#E8A33D', // au seuil
    alert: '#D63B3B', // en alerte
    off: '#6B7280', // hors service
  },
} as const;

export type Status = keyof typeof colors.status;

export const statusLabel: Record<Status, string> = {
  ok: 'En service',
  warn: 'Au seuil',
  alert: 'En alerte',
  off: 'Hors service',
};

// ---------------------------------------------------------------------------
// Formes
// ---------------------------------------------------------------------------
export const radius = {
  card: 24,
  small: 14,
  pill: 999,
};

export const shadows = {
  card: '0 18px 50px -18px rgba(23, 58, 45, 0.18), 0 2px 6px rgba(23, 58, 45, 0.04)',
  soft: '0 10px 30px -12px rgba(23, 58, 45, 0.16)',
  strong: '0 40px 90px -30px rgba(23, 58, 45, 0.35)',
};

// ---------------------------------------------------------------------------
// Mouvement
// ---------------------------------------------------------------------------
/** Ressort doux, sans rebond : entrées d'éléments d'interface */
export const springSoft = {damping: 200, mass: 0.9, stiffness: 90};
/** Ressort légèrement élastique : épingles, badges, pop */
export const springBouncy = {damping: 11, mass: 0.7, stiffness: 120};
/** Ressort standard */
export const springSmooth = {damping: 18, mass: 0.8, stiffness: 100};

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

export const VIDEO = {
  width: 1920,
  height: 1080,
  fps: 30,
};
