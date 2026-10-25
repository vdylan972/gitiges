import { shots, timeline, type SceneId, type ShotConfig, type SfxConfig } from '../config/film.config';
import { getBeatFrames, snapToBeat } from './beats';

/**
 * Plans résolus : les cuts internes de F1 sont recalés sur les temps de la
 * musique (± tolérance). Les bornes de scène ne bougent pas.
 */
const resolveShots = (): ShotConfig[] => {
  const beats = getBeatFrames();
  const scene1 = shots.filter((s) => s.scene === 'f1');
  if (beats.length === 0 || scene1.length < 2) {
    return shots;
  }
  const { from: sceneFrom, durationInFrames } = timeline.scenes.f1;
  const sceneEnd = sceneFrom + durationInFrames;
  // Cuts internes recalés, en gardant au moins 6 frames par plan.
  const cuts = [sceneFrom];
  for (let i = 1; i < scene1.length; i++) {
    const snapped = snapToBeat(scene1[i].from, beats);
    cuts.push(Math.max(cuts[i - 1] + 6, Math.min(snapped, sceneEnd - 6 * (scene1.length - i))));
  }
  cuts.push(sceneEnd);
  const resolved = new Map(
    scene1.map((s, i) => [s.id, { ...s, from: cuts[i], durationInFrames: cuts[i + 1] - cuts[i] }]),
  );
  return shots.map((s) => resolved.get(s.id) ?? s);
};

export const resolvedShots = resolveShots();

export const getShot = (id: string): ShotConfig => {
  const shot = resolvedShots.find((s) => s.id === id);
  if (!shot) {
    throw new Error(`Plan inconnu dans film.config.ts : ${id}`);
  }
  return shot;
};

export const shotsOfScene = (scene: SceneId) => resolvedShots.filter((s) => s.scene === scene);

/** Fenêtre réellement affichée d'un plan, fondus inclus. */
export const shotWindow = (shot: ShotConfig) => {
  const next = resolvedShots[resolvedShots.indexOf(shot) + 1];
  const inHalf = Math.ceil(shot.transitionIn / 2);
  const outHalf = next && next.from === shot.from + shot.durationInFrames ? Math.floor(next.transitionIn / 2) : 0;
  const start = shot.from - inHalf;
  const end = shot.from + shot.durationInFrames + outHalf;
  return { start, end, duration: end - start };
};

export const resolveSfxFrame = (s: SfxConfig): number =>
  typeof s.at === 'number' ? s.at : getShot(s.at.shot).from + s.at.offset;
