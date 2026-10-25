import React from 'react';
import { AbsoluteFill, Easing, Img, interpolate, useCurrentFrame } from 'remotion';
import { timeline, ui } from '../config/film.config';
import { asset, assetExists } from '../lib/assets';
import { phoneGeometry, pointOnScreen } from '../lib/phone-geometry';
import { Placeholder } from './Placeholder';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const ease = Easing.bezier(0.4, 0, 0.2, 1);

/** Indicateur de tap discret : un point qui apparaît, puis une onde qui s'efface. */
const Tap: React.FC<{ frame: number; at: number; x: number; y: number }> = ({ frame, at, x, y }) => {
  if (frame < at - 8 || frame > at + 14) {
    return null;
  }
  const p = pointOnScreen(x, y);
  const dot = interpolate(frame, [at - 8, at - 2, at + 2, at + 8], [0, 0.55, 0.55, 0], clamp);
  const ring = interpolate(frame, [at, at + 14], [0, 1], clamp);
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: p.x - 26,
          top: p.y - 26,
          width: 52,
          height: 52,
          borderRadius: 26,
          background: 'rgba(255,255,255,0.9)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
          opacity: dot,
          transform: `scale(${interpolate(frame, [at - 2, at + 2], [1, 0.85], clamp)})`,
        }}
      />
      {frame >= at ? (
        <div
          style={{
            position: 'absolute',
            left: p.x - 26,
            top: p.y - 26,
            width: 52,
            height: 52,
            borderRadius: 26,
            border: '3px solid rgba(255,255,255,0.9)',
            opacity: 0.7 * (1 - ring),
            transform: `scale(${1 + ring * 1.4})`,
          }}
        />
      ) : null}
    </>
  );
};

/**
 * Mockup téléphone avec les VRAIES captures du service (aucune interface
 * inventée). Captures absentes : placeholder explicite. Frames absolues.
 */
export const PhoneUI: React.FC = () => {
  const frame = useCurrentFrame();
  const cfg = timeline.phone;
  const { frame: phoneRect, screen } = phoneGeometry();

  if (frame < cfg.from || frame >= cfg.to) {
    return null;
  }

  const enter = interpolate(frame, [cfg.from, cfg.from + cfg.enterFrames], [0, 1], { ...clamp, easing: ease });
  const screens = cfg.screens;
  const anyScreen = screens.some((s) => assetExists(ui.screens[s.key]));
  const hasFrame = assetExists(ui.phoneFrame);

  return (
    <AbsoluteFill style={{ opacity: enter, transform: `translateY(${(1 - enter) * 30}px)` }}>
      {!hasFrame ? (
        // Pas de mockup fourni : simple silhouette neutre, sans interface.
        <div
          style={{
            position: 'absolute',
            left: phoneRect.left,
            top: phoneRect.top,
            width: phoneRect.width,
            height: phoneRect.height,
            borderRadius: ui.phone.screen.radius + 18,
            background: '#111',
            boxShadow: '0 30px 80px rgba(0,0,0,0.45)',
          }}
        />
      ) : null}
      <div
        style={{
          position: 'absolute',
          left: screen.left,
          top: screen.top,
          width: screen.width,
          height: screen.height,
          borderRadius: ui.phone.screen.radius,
          overflow: 'hidden',
          background: '#2A2A2A',
        }}
      >
        {!anyScreen ? (
          <Placeholder label={ui.missingScreensMessage} position="center" scale={0.8} />
        ) : (
          screens.map((s, i) => {
            const next = screens[i + 1];
            const inX = i === 0 ? 0 : interpolate(frame, [s.from, s.from + cfg.slideFrames], [screen.width, 0], { ...clamp, easing: ease });
            const outX = next
              ? interpolate(frame, [next.from, next.from + cfg.slideFrames], [0, -screen.width], { ...clamp, easing: ease })
              : 0;
            const x = inX + outX;
            if (frame < s.from || Math.abs(x) >= screen.width) {
              return null;
            }
            const src = ui.screens[s.key];
            return (
              <AbsoluteFill key={s.key} style={{ transform: `translateX(${x}px)` }}>
                {assetExists(src) ? (
                  <Img src={asset(src)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Placeholder label={ui.missingScreensMessage} description={s.key} src={src} position="center" scale={0.7} />
                )}
              </AbsoluteFill>
            );
          })
        )}
      </div>
      {hasFrame ? (
        <Img
          src={asset(ui.phoneFrame)}
          style={{
            position: 'absolute',
            left: phoneRect.left,
            top: phoneRect.top,
            width: phoneRect.width,
            height: phoneRect.height,
          }}
        />
      ) : null}
      {screens.map((s) => (
        <Tap key={s.key} frame={frame} at={s.tap.frame} x={s.tap.x} y={s.tap.y} />
      ))}
    </AbsoluteFill>
  );
};
