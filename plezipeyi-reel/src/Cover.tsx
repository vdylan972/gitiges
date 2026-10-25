import React from 'react';
import { AbsoluteFill, Freeze } from 'remotion';
import { cover, options, texts } from './config/film.config';
import { KineticText } from './components/KineticText';
import { SafeZoneOverlay } from './components/SafeZoneOverlay';
import { Shot } from './components/Shot';
import { loadFilmFonts } from './lib/fonts';
import { gradeAtProgress } from './lib/grade';
import { getShot, shotWindow } from './lib/timeline';

loadFilmFonts();

export type CoverProps = { showSafeZones: boolean | null };

/** Couverture du Reel : un plan de F3 + « Certaines personnes ne sont jamais vraiment loin. » */
export const Cover: React.FC<CoverProps> = ({ showSafeZones }) => {
  const shot = getShot(cover.shotId);
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <Freeze frame={cover.frameInShot}>
        <Shot shot={shot} visibleFrames={shotWindow(shot).duration} grade={gradeAtProgress(shot.scene, cover.gradeProgress)} />
      </Freeze>
      <KineticText
        lines={texts.cover.map((text) => ({ text, from: -100 }))}
        exit={null}
        mode="line"
        centerY={cover.textY}
        variant="video"
      />
      {(showSafeZones ?? options.showSafeZones) ? <SafeZoneOverlay /> : null}
    </AbsoluteFill>
  );
};
