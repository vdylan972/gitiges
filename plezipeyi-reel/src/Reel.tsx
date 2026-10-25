import React from 'react';
import { AbsoluteFill } from 'remotion';
import { brand, options } from './config/film.config';
import { SafeZoneOverlay } from './components/SafeZoneOverlay';
import { Soundtrack } from './components/Soundtrack';
import { loadFilmFonts } from './lib/fonts';
import { MediaDurationsContext } from './lib/media-context';
import { Scene1Rush } from './scenes/Scene1Rush';
import { Scene2Far } from './scenes/Scene2Far';
import { Scene3Close } from './scenes/Scene3Close';
import { Scene4Gesture } from './scenes/Scene4Gesture';
import { Scene5Signature } from './scenes/Scene5Signature';

loadFilmFonts();

export type ReelProps = {
  /** false = version sans musique (sons seuls). */
  withMusic: boolean;
  /** null = valeur de film.config.ts (options.showSafeZones). */
  showSafeZones: boolean | null;
  /** Rempli automatiquement (durées des rushes présents). */
  mediaDurations: Record<string, number>;
};

export const Reel: React.FC<ReelProps> = ({ withMusic, showSafeZones, mediaDurations }) => (
  <MediaDurationsContext.Provider value={mediaDurations}>
    <AbsoluteFill style={{ backgroundColor: brand.colors.textDark }}>
      <Scene1Rush />
      <Scene2Far />
      <Scene3Close />
      <Scene4Gesture />
      <Scene5Signature />
      <Soundtrack withMusic={withMusic} />
      {(showSafeZones ?? options.showSafeZones) ? <SafeZoneOverlay /> : null}
    </AbsoluteFill>
  </MediaDurationsContext.Provider>
);
