/**
 * PNG de contrôle : une frame par scène (+ version avec zones de sécurité).
 * Usage : npm run render:stills
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { controlStills } from '../src/config/film.config';

const run = (args: string[]) => execFileSync('npx', ['remotion', ...args], { stdio: 'inherit' });

mkdirSync('out/stills/safezones', { recursive: true });
controlStills.forEach((frame, i) => {
  const name = `scene${i + 1}-f${String(frame).padStart(3, '0')}.png`;
  run(['still', 'PleziPeyiReel', `out/stills/${name}`, `--frame=${frame}`]);
  run(['still', 'PleziPeyiReel', `out/stills/safezones/${name}`, `--frame=${frame}`, '--props={"showSafeZones":true}']);
});
run(['still', 'Cover', 'out/stills/safezones/cover.png', '--props={"showSafeZones":true}']);
