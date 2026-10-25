import { parseMedia } from '@remotion/media-parser';
import React from 'react';
import { CalculateMetadataFunction, Composition, Still } from 'remotion';
import { shots, video } from './config/film.config';
import { Cover, type CoverProps } from './Cover';
import { Reel, type ReelProps } from './Reel';
import { asset, assetExists } from './lib/assets';

/** Mesure la durée des rushes présents pour adapter la vitesse de lecture. */
const calculateMetadata: CalculateMetadataFunction<ReelProps> = async ({ props }) => {
  const mediaDurations: Record<string, number> = {};
  await Promise.all(
    shots
      .filter((s) => assetExists(s.src))
      .map(async (s) => {
        try {
          const { durationInSeconds } = await parseMedia({
            src: asset(s.src),
            fields: { durationInSeconds: true },
            acknowledgeRemotionLicense: true,
          });
          if (durationInSeconds) {
            mediaDurations[s.src] = durationInSeconds;
          }
        } catch (err) {
          console.warn(`Durée illisible pour ${s.src}`, err);
        }
      }),
  );
  return { props: { ...props, mediaDurations } };
};

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="PleziPeyiReel"
      component={Reel}
      durationInFrames={video.durationInFrames}
      fps={video.fps}
      width={video.width}
      height={video.height}
      defaultProps={{ withMusic: true, showSafeZones: null, mediaDurations: {} } satisfies ReelProps}
      calculateMetadata={calculateMetadata}
    />
    <Still
      id="Cover"
      component={Cover}
      width={video.width}
      height={video.height}
      defaultProps={{ showSafeZones: null } satisfies CoverProps}
    />
  </>
);
