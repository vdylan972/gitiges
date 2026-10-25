import { music, video } from '../config/film.config';

/** Positions des temps (frames), depuis beatFrames ou le BPM. */
export const getBeatFrames = (): number[] => {
  if (music.beatFrames.length > 0) {
    return [...music.beatFrames].sort((a, b) => a - b);
  }
  if (!music.bpm || music.bpm <= 0) {
    return [];
  }
  const step = (video.fps * 60) / music.bpm;
  const beats: number[] = [];
  for (let f = music.firstBeatFrame; f <= video.durationInFrames; f += step) {
    beats.push(Math.round(f));
  }
  return beats;
};

/** Cale une frame sur le temps le plus proche si l'écart est dans la tolérance. */
export const snapToBeat = (frame: number, beats: number[], tolerance = music.snapTolerance): number => {
  let best = frame;
  let bestDist = Infinity;
  for (const b of beats) {
    const d = Math.abs(b - frame);
    if (d < bestDist) {
      bestDist = d;
      best = b;
    }
  }
  return bestDist <= tolerance ? best : frame;
};
