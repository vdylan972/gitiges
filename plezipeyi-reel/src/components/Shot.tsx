import React from 'react';
import { AbsoluteFill, interpolate, OffthreadVideo, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';
import type { Grade, ShotConfig } from '../config/film.config';
import { asset, assetExists } from '../lib/assets';
import { gradeAtFrame, gradeFilter } from '../lib/grade';
import { useSourceDuration } from '../lib/media-context';
import { getShot, shotWindow } from '../lib/timeline';
import { Placeholder } from './Placeholder';

/**
 * Plan vidéo plein cadre : object-fit cover recadré sur (focalX, focalY),
 * push-in léger, étalonnage. Si le rush manque : <Placeholder>.
 * Le frame courant est local au plan (à placer dans une <Sequence>).
 */
export const Shot: React.FC<{
  shot: ShotConfig;
  /** Durée visible du plan (fondus inclus), pour le push-in. */
  visibleFrames: number;
  grade: Grade | null;
  /** Durée du rush en secondes (si connue) pour adapter la vitesse. */
  sourceDuration?: number;
}> = ({ shot, visibleFrames, grade, sourceDuration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!assetExists(shot.src)) {
    return <Placeholder label={shot.label} description={shot.description} src={shot.src} />;
  }

  const [scaleFrom, scaleTo] = shot.pushIn ?? [1, 1.06];
  const scale = interpolate(frame, [0, Math.max(1, visibleFrames - 1)], [scaleFrom, scaleTo], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Vitesse : réduite si le rush n'est pas assez long pour couvrir le plan.
  const inPoint = shot.inPoint ?? 0;
  const neededSeconds = visibleFrames / fps;
  let rate = shot.speed;
  if (sourceDuration && (sourceDuration - inPoint) / rate < neededSeconds) {
    rate = Math.max(0.25, (sourceDuration - inPoint) / neededSeconds);
  }

  const filters = [grade ? gradeFilter(grade) : null, shot.blur ? `blur(${shot.blur}px)` : null]
    .filter(Boolean)
    .join(' ');

  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: '#000' }}>
      <AbsoluteFill
        style={{
          transform: `scale(${scale * (shot.blur ? 1.08 : 1)})`,
          transformOrigin: `${shot.focalX * 100}% ${shot.focalY * 100}%`,
          filter: filters || undefined,
        }}
      >
        <OffthreadVideo
          src={asset(shot.src)}
          muted
          playbackRate={rate}
          trimBefore={Math.round(inPoint * fps) || undefined}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: `${shot.focalX * 100}% ${shot.focalY * 100}%`,
          }}
        />
      </AbsoluteFill>
      {grade && grade.overlayOpacity > 0 ? (
        <AbsoluteFill
          style={{ backgroundColor: grade.overlayColor, opacity: grade.overlayOpacity, mixBlendMode: grade.overlayBlend }}
        />
      ) : null}
      {shot.darken ? <AbsoluteFill style={{ backgroundColor: '#000', opacity: shot.darken }} /> : null}
    </AbsoluteFill>
  );
};

/**
 * Place un plan sur la timeline du film (frames absolues) avec son fondu
 * enchaîné d'entrée et l'étalonnage de sa scène.
 */
export const ShotOnTimeline: React.FC<{ shotId: string }> = ({ shotId }) => {
  const frame = useCurrentFrame();
  const shot = getShot(shotId);
  const win = shotWindow(shot);
  const sourceDuration = useSourceDuration(shot.src);
  const opacity =
    shot.transitionIn > 0
      ? interpolate(frame, [win.start, win.start + shot.transitionIn], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 1;
  return (
    <Sequence from={win.start} durationInFrames={win.duration} name={shot.label} layout="none">
      <AbsoluteFill style={{ opacity }}>
        <Shot
          shot={shot}
          visibleFrames={win.duration}
          grade={gradeAtFrame(shot.scene, frame)}
          sourceDuration={sourceDuration}
        />
      </AbsoluteFill>
    </Sequence>
  );
};
