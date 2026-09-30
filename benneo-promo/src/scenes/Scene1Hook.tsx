import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {LogoMark, Wordmark} from '../components/Logo';
import {RevealText} from '../components/ui';
import {ease, springAt} from '../components/anim';
import {BRAND} from '../data';
import {colors, easeInOut, fonts, springBouncy, springSoft} from '../theme';

/**
 * Scène 1 — Accroche (0-5 s)
 * Le logo se dessine, le nom apparaît lettre par lettre, puis la signature.
 */
export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const circle = springAt(frame, fps, 2, springBouncy);
  const arrow = ease(frame, 10, 44, easeInOut);
  const letter = springAt(frame, fps, 30, springSoft);
  const spin = interpolate(ease(frame, 10, 70), [0, 1], [-90, 0]);

  // Le nom se « déplie » à côté du pictogramme
  const reveal = ease(frame, 42, 72, easeInOut);
  const letterP = (i: number) => springAt(frame, fps, 46 + i * 4, springSoft);

  // Le groupe logo remonte légèrement pour laisser place à la signature
  const lift = interpolate(ease(frame, 62, 90, easeInOut), [0, 1], [60, 0]);

  return (
    <AbsoluteFill>
      <Background />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{transform: `translateY(${lift}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <LogoMark size={210} circle={circle} arrow={arrow} letter={letter} spin={spin} />
            <div
              style={{
                maxWidth: reveal * 620,
                marginLeft: reveal * 48,
                overflow: 'hidden',
                paddingBottom: 12,
              }}
            >
              <Wordmark size={150} letterProgress={letterP} />
            </div>
          </div>

          <RevealText
            text={BRAND.tagline}
            start={70}
            stagger={2.5}
            style={{
              marginTop: 70,
              maxWidth: 1100,
              fontFamily: fonts.body,
              fontWeight: 500,
              fontSize: 50,
              lineHeight: 1.3,
              color: colors.green,
              textAlign: 'center',
            }}
            wordStyle={(w) =>
              w.startsWith('préservés') ? {color: colors.greenSoft, fontWeight: 600} : undefined
            }
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
