import React from 'react';
import { Audio, interpolate, Sequence } from 'remotion';
import { music, options, sfx } from '../config/film.config';
import { asset, assetExists } from '../lib/assets';
import { resolveSfxFrame } from '../lib/timeline';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

/** Volume de la musique à une frame absolue (courbe interpolée de la config). */
export const musicVolumeAt = (frame: number) =>
  interpolate(
    frame,
    music.volumeCurve.map(([f]) => f),
    music.volumeCurve.map(([, v]) => v),
    clamp,
  ) * options.musicVolume;

/** Musique + sons. Les fichiers absents sont ignorés sans bloquer le rendu. */
export const Soundtrack: React.FC<{ withMusic: boolean }> = ({ withMusic }) => (
  <>
    {withMusic && assetExists(music.src) ? <Audio src={asset(music.src)} volume={musicVolumeAt} /> : null}
    {sfx
      .filter((s) => assetExists(s.src))
      .map((s) => {
        const from = resolveSfxFrame(s);
        const dur = s.durationInFrames;
        const fadeIn = s.fadeIn ?? 0;
        const fadeOut = s.fadeOut ?? 0;
        const volume = (f: number) => {
          let v = s.volume * options.sfxVolume;
          if (fadeIn > 0) v *= interpolate(f, [0, fadeIn], [0, 1], clamp);
          if (dur && fadeOut > 0) v *= interpolate(f, [dur - fadeOut, dur], [1, 0], clamp);
          return v;
        };
        return (
          <Sequence key={s.id} from={from} durationInFrames={dur} name={`sfx ${s.id}`} layout="none">
            <Audio src={asset(s.src)} volume={volume} />
          </Sequence>
        );
      })}
  </>
);
