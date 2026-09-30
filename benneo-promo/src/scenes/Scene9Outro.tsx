import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {LogoMark, Wordmark} from '../components/Logo';
import {ease, springAt} from '../components/anim';
import {BRAND, OUTRO} from '../data';
import {colors, easeInOut, fonts, radius, springBouncy, springSoft} from '../theme';

/**
 * Scène 9 — Conclusion (54-60 s)
 */
export const Scene9Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const logoCircle = springAt(frame, fps, 62, springBouncy);
  const logoArrow = ease(frame, 66, 92, easeInOut);
  const logoLetter = springAt(frame, fps, 76, springSoft);
  const wordP = (i: number) => springAt(frame, fps, 74 + i * 3, springSoft);

  const band = springAt(frame, fps, 98, springSoft);
  const url = ease(frame, 106, 124);

  return (
    <AbsoluteFill>
      <Background tropical />

      {/* ------------------------------------------------ Trois lignes */}
      <div
        style={{
          position: 'absolute',
          top: 130,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}
      >
        {OUTRO.lines.map((line, i) => {
          const p = springAt(frame, fps, 6 + i * 18, springSoft);
          const last = i === OUTRO.lines.length - 1;
          return (
            <div
              key={line}
              style={{
                fontFamily: fonts.title,
                fontWeight: 800,
                fontSize: last ? 70 : 78,
                letterSpacing: -2,
                lineHeight: 1.15,
                color: last ? colors.greenSoft : colors.green,
                opacity: p,
                transform: `translateY(${(1 - p) * 40}px)`,
                filter: `blur(${(1 - p) * 8}px)`,
              }}
            >
              {line}
            </div>
          );
        })}
      </div>

      {/* ------------------------------------------------ Logo */}
      <div
        style={{
          position: 'absolute',
          top: 520,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 40,
        }}
      >
        <LogoMark size={170} circle={logoCircle} arrow={logoArrow} letter={logoLetter} />
        <Wordmark size={120} letterProgress={wordP} />
      </div>

      {/* ------------------------------------------------ URL */}
      <div
        style={{
          position: 'absolute',
          top: 790,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            background: colors.lime,
            borderRadius: radius.pill,
            padding: '22px 64px',
            clipPath: `inset(0 ${(1 - band) * 50}% 0 ${(1 - band) * 50}% round 999px)`,
            boxShadow: '0 20px 50px -20px rgba(23,58,45,0.35)',
          }}
        >
          <div
            style={{
              fontFamily: fonts.title,
              fontWeight: 800,
              fontSize: 50,
              color: colors.green,
              letterSpacing: -0.5,
              opacity: url,
              transform: `translateY(${(1 - url) * 14}px)`,
            }}
          >
            {BRAND.url}
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: fonts.body,
          fontSize: 24,
          color: colors.textMuted,
          opacity: ease(frame, 120, 140),
        }}
      >
        {BRAND.contest}
      </div>
    </AbsoluteFill>
  );
};
