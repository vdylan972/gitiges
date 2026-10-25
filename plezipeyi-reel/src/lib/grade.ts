import { interpolate, interpolateColors } from 'remotion';
import { grading, timeline, type Grade, type SceneId } from '../config/film.config';

const lerpGrade = (a: Grade, b: Grade, t: number): Grade => ({
  saturate: interpolate(t, [0, 1], [a.saturate, b.saturate]),
  brightness: interpolate(t, [0, 1], [a.brightness, b.brightness]),
  contrast: interpolate(t, [0, 1], [a.contrast, b.contrast]),
  overlayColor: interpolateColors(t, [0, 1], [a.overlayColor, b.overlayColor]),
  overlayOpacity: interpolate(t, [0, 1], [a.overlayOpacity, b.overlayOpacity]),
  overlayBlend: t < 0.5 ? a.overlayBlend : b.overlayBlend,
});

/** Étalonnage d'une scène à une progression donnée (0 → 1). */
export const gradeAtProgress = (scene: SceneId, progress: number): Grade | null => {
  if (scene === 'f5') {
    return null;
  }
  const g = grading[scene];
  return g.to ? lerpGrade(g.from, g.to, Math.min(1, Math.max(0, progress))) : g.from;
};

/** Étalonnage d'une scène à une frame absolue. */
export const gradeAtFrame = (scene: SceneId, frame: number): Grade | null => {
  const { from, durationInFrames } = timeline.scenes[scene];
  return gradeAtProgress(scene, (frame - from) / durationInFrames);
};

export const gradeFilter = (g: Grade) =>
  `saturate(${g.saturate.toFixed(3)}) brightness(${g.brightness.toFixed(3)}) contrast(${g.contrast.toFixed(3)})`;
