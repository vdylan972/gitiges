import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { brand, layout, typography, video } from '../config/film.config';
import { titleFont } from '../lib/fonts';

export type KineticLine = {
  text: string;
  /** Frame absolue d'apparition. */
  from: number;
  style?: React.CSSProperties;
};

/**
 * Texte écran sobre : apparition mot par mot ou ligne par ligne
 * (opacité 0 → 1, translateY 24 px → 0, spring amorti sans rebond),
 * disparition en fondu. Doit être rendu hors <Sequence> (frames absolues).
 */
export const KineticText: React.FC<{
  lines: KineticLine[];
  /** Frame absolue où le texte a totalement disparu. null = reste affiché. */
  exit: number | null;
  mode: 'word' | 'line';
  /** Centre vertical du bloc (px). */
  centerY: number;
  variant: 'video' | 'brand';
  fontSize?: number;
  fontWeight?: number;
}> = ({ lines, exit, mode, centerY, variant, fontSize = typography.titleSize, fontWeight }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { animation } = typography;

  if (exit !== null && frame >= exit) {
    return null;
  }
  const exitOpacity =
    exit === null
      ? 1
      : interpolate(frame, [exit - animation.exitFrames, exit], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

  const reveal = (start: number) => {
    const p = spring({
      frame: frame - start,
      fps,
      config: { damping: animation.damping },
      durationInFrames: animation.springDuration,
    });
    return { opacity: p, transform: `translateY(${(1 - p) * animation.translateY}px)` };
  };

  const side = layout.safeZone.side;

  return (
    <div
      style={{
        position: 'absolute',
        left: side,
        width: video.width - side * 2,
        top: centerY,
        transform: 'translateY(-50%)',
        textAlign: 'center',
        fontFamily: titleFont(),
        fontSize,
        fontWeight: fontWeight ?? 500,
        lineHeight: typography.lineHeight,
        letterSpacing: '-0.01em',
        color: variant === 'video' ? brand.colors.textLight : brand.colors.textDark,
        textShadow: variant === 'video' ? typography.shadowOnVideo : undefined,
        opacity: exitOpacity,
      }}
    >
      {lines.map((line, li) => (
        <div key={li} style={line.style}>
          {mode === 'line' ? (
            <span style={{ display: 'inline-block', ...reveal(line.from) }}>{line.text}</span>
          ) : (
            line.text.split(' ').map((word, wi, arr) => (
              <React.Fragment key={wi}>
                <span style={{ display: 'inline-block', ...reveal(line.from + wi * animation.wordStagger) }}>
                  {word}
                </span>
                {wi < arr.length - 1 ? ' ' : null}
              </React.Fragment>
            ))
          )}
        </div>
      ))}
    </div>
  );
};
