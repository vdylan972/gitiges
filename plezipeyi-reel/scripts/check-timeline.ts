/**
 * Vérifications éditoriales et de timing (sans rendu).
 * Usage : npm run check-timeline
 */
import { layout, texts, timeline, typography, video } from '../src/config/film.config';
import { resolvedShots } from '../src/lib/timeline';
import { getBeatFrames } from '../src/lib/beats';

const errors: string[] = [];
const ok = (msg: string) => console.log(`  [ok] ${msg}`);
const check = (cond: boolean, msg: string) => (cond ? ok(msg) : errors.push(msg));

console.log('\nPleziPeyi — vérifications\n');

check(video.durationInFrames === 750, `Durée totale = ${video.durationInFrames} frames (attendu 750)`);
const scenes = Object.values(timeline.scenes);
const last = scenes[scenes.length - 1];
check(last.from + last.durationInFrames === video.durationInFrames, 'Les scènes couvrent exactement 0 → 750');

const minFrames = Math.round(1.5 * video.fps);
const t = timeline.texts;
const cues: Array<[string, number, number]> = [
  [texts.s1, t.s1.from, t.s1.to],
  [texts.s2, t.s2.from, t.s2.to],
  [texts.s3Line1, t.s3.line1, t.s3.to],
  [texts.s3Line2, t.s3.line2, t.s3.to],
  [texts.s5Line1, t.s5.line1, video.durationInFrames],
  [texts.s5Line2, t.s5.line2, video.durationInFrames],
];
if (texts.handle) cues.push([texts.handle, t.s5.handle, video.durationInFrames]);
for (const [text, from, to] of cues) {
  check(to - from >= minFrames, `« ${text} » affiché ${to - from} frames (min ${minFrames})`);
}

const allTexts = [texts.s1, texts.s2, texts.s3Line1, texts.s3Line2, texts.s5Line1, texts.s5Line2, ...texts.cover, texts.handle];
for (const text of allTexts.filter(Boolean)) {
  check(!text.includes('!'), `Pas de point d'exclamation : « ${text} »`);
  check(!/\p{Extended_Pictographic}/u.test(text), `Pas d'émoji : « ${text} »`);
  const letters = text.replace(/[^\p{L}]/gu, '');
  check(letters.length < 4 || letters !== letters.toUpperCase(), `Pas de majuscules intégrales : « ${text} »`);
}

check(typography.titleSize >= 64 && typography.titleSize <= 76, `Taille titre ${typography.titleSize} px (64 à 76)`);
const { top, bottom } = layout.safeZone;
for (const [k, y] of Object.entries(layout.textY)) {
  check(y - 120 > top && y + 120 < video.height - bottom, `Texte ${k} centré à y=${y}, dans la zone utile`);
}

const beats = getBeatFrames();
const f1 = resolvedShots.filter((s) => s.scene === 'f1');
console.log(`\n  Cuts F1 : ${f1.map((s) => s.from).join(', ')}${beats.length ? ` (recalés sur ${beats.length} temps)` : ' (pas de BPM renseigné)'}`);

if (errors.length) {
  console.log('\nÉchecs :');
  errors.forEach((e) => console.log(`  [ÉCHEC] ${e}`));
  process.exit(1);
}
console.log('\nToutes les vérifications passent.\n');
