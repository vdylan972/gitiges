import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {SpringConfig} from 'remotion';
import {easeOut, springSoft} from '../theme';

/** Progression 0 → 1 d'un ressort qui démarre à `delay` images. */
export const useSpring = (delay = 0, config: Partial<SpringConfig> = springSoft, durationInFrames?: number) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config, durationInFrames});
};

/** Version non-hook, pratique dans les boucles (.map). */
export const springAt = (
  frame: number,
  fps: number,
  delay = 0,
  config: Partial<SpringConfig> = springSoft,
  durationInFrames?: number,
) => spring({frame: frame - delay, fps, config, durationInFrames});

/** Progression 0 → 1 avec easing doux entre deux images. */
export const ease = (frame: number, from: number, to: number, easing = easeOut) =>
  interpolate(frame, [from, to], [0, 1], {
    easing,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

/** Style d'entrée standard : apparition + léger glissement vers le haut. */
export const fadeUp = (p: number, distance = 40): React.CSSProperties => ({
  opacity: p,
  transform: `translateY(${(1 - p) * distance}px)`,
});

/** Fondu de sortie sur les dernières images d'une scène. */
export const fadeOutAt = (frame: number, start: number, length = 15) =>
  interpolate(frame, [start, start + length], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
