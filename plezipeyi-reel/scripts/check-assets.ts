/**
 * Liste les assets présents et manquants d'après src/config/film.config.ts.
 * Usage : npm run check-assets
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { brand, fonts, music, sfx, shots, ui } from '../src/config/film.config';

const publicDir = join(import.meta.dirname, '..', 'public');

type Entry = { group: string; path: string; note: string };

const entries: Entry[] = [
  { group: 'Marque', path: brand.logo.color, note: 'Logo couleur (signature)' },
  { group: 'Marque', path: brand.logo.white, note: 'Logo blanc (réserve)' },
  ...fonts.files.map((f) => ({ group: 'Marque', path: f.src, note: `Police ${f.family}` })),
  ...shots.map((s) => ({ group: `Vidéo ${s.scene.toUpperCase()}`, path: s.src, note: `${s.label} — ${s.description}` })),
  { group: 'Interface', path: ui.screens.catalog, note: 'Capture réelle : catalogue' },
  { group: 'Interface', path: ui.screens.product, note: 'Capture réelle : produit' },
  { group: 'Interface', path: ui.screens.confirm, note: 'Capture réelle : confirmation' },
  { group: 'Interface', path: ui.phoneFrame, note: 'Mockup de téléphone' },
  { group: 'Audio', path: music.src, note: 'Musique' },
  ...sfx.map((s) => ({ group: 'Audio', path: s.src, note: `Son : ${s.id}` })),
];

let missing = 0;
let lastGroup = '';
console.log('\nPleziPeyi — état des assets (public/)\n');
for (const e of entries) {
  if (e.group !== lastGroup) {
    console.log(`\n${e.group}`);
    lastGroup = e.group;
  }
  const ok = existsSync(join(publicDir, e.path));
  if (!ok) missing++;
  console.log(`  ${ok ? '[ok]      ' : '[MANQUANT]'} ${e.path}  ·  ${e.note}`);
}
console.log(`\n${entries.length - missing} présent(s), ${missing} manquant(s) sur ${entries.length}.`);
if (missing > 0) {
  console.log('Les assets manquants sont remplacés par des placeholders : le rendu fonctionne quand même.\n');
}
