import { loadFont } from '@remotion/fonts';
import { continueRender, delayRender, staticFile } from 'remotion';
import { fonts } from '../config/film.config';

let loaded = false;

/** Charge les polices déclarées dans film.config.ts (fichiers locaux). */
export const loadFilmFonts = () => {
  if (loaded || fonts.files.length === 0) {
    return;
  }
  loaded = true;
  const handle = delayRender('Chargement des polices');
  Promise.all(
    fonts.files.map((f) =>
      loadFont({ family: f.family, url: staticFile(f.src), weight: f.weight, style: f.style ?? 'normal' }),
    ),
  )
    .catch((err) => console.error('Police introuvable (voir fonts.files dans film.config.ts)', err))
    .finally(() => continueRender(handle));
};

export const titleFont = () => `'${fonts.title.family}', system-ui, sans-serif`;
export const bodyFont = () => `'${fonts.body.family}', system-ui, sans-serif`;
