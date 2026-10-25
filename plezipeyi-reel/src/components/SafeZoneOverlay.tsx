import React from 'react';
import { AbsoluteFill } from 'remotion';
import { layout, video } from '../config/film.config';

const zone = 'rgba(255, 0, 0, 0.32)';

/** Zones interdites au texte (Reels) en rouge semi-transparent. */
export const SafeZoneOverlay: React.FC = () => {
  const { top, bottom, side } = layout.safeZone;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: video.width, height: top, background: zone }} />
      <div style={{ position: 'absolute', left: 0, bottom: 0, width: video.width, height: bottom, background: zone }} />
      <div style={{ position: 'absolute', left: 0, top, width: side, height: video.height - top - bottom, background: zone }} />
      <div style={{ position: 'absolute', right: 0, top, width: side, height: video.height - top - bottom, background: zone }} />
    </AbsoluteFill>
  );
};
