import React from 'react';
import {AbsoluteFill, interpolate, interpolateColors, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {LogoMark} from '../components/Logo';
import {MapPin, MartiniqueMap, makeProjection} from '../components/MartiniqueMap';
import {Card, RevealText} from '../components/ui';
import {ease, springAt} from '../components/anim';
import {SCENE_SECONDS, SITES, SOLUTION} from '../data';
import {colors, easeInOut, fonts, radius, shadows, springBouncy, springSmooth, springSoft} from '../theme';
import {PROBLEM_LAYOUT, ProblemCardContent} from './Scene2Problem';

const CENTER = {x: 960, y: 430};
const SCREEN = {w: 880, h: 520};

/** Mini interface affichée dans l'écran d'ordinateur. */
const MiniDashboard: React.FC<{frame: number}> = ({frame}) => {
  const mapW = 300;
  const mapH = 448;
  const project = makeProjection(mapW, mapH, 16);
  return (
    <div style={{position: 'absolute', inset: 0, background: colors.bg, display: 'flex'}}>
      <div style={{width: 150, background: colors.white, borderRight: `1px solid ${colors.border}`, padding: 18}}>
        <LogoMark size={34} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              height: 14,
              borderRadius: 7,
              marginTop: i === 0 ? 26 : 16,
              width: i === 0 ? '100%' : `${60 + ((i * 17) % 35)}%`,
              background: i === 0 ? colors.green : colors.track,
            }}
          />
        ))}
      </div>
      <div style={{flex: 1, padding: 22, display: 'flex', gap: 18}}>
        <div style={{borderRadius: 16, overflow: 'hidden', background: colors.white, boxShadow: shadows.soft}}>
          <MartiniqueMap width={mapW} height={mapH} padding={16} draw={1} fill={1}>
            {SITES.map((s, i) => {
              const {x, y} = project(s.lon, s.lat);
              return (
                <div key={s.name} style={{position: 'absolute', left: x, top: y}}>
                  <MapPin color={colors.status[s.status]} size={18} drop={springAt(frame, 30, 20 + i * 2, springBouncy)} />
                </div>
              );
            })}
          </MartiniqueMap>
        </div>
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 14}}>
          {[76, 75, 68, 56, 51].map((v, i) => (
            <div key={i} style={{background: colors.white, borderRadius: 12, padding: 12, boxShadow: shadows.soft}}>
              <div style={{height: 8, width: '45%', borderRadius: 4, background: colors.track, marginBottom: 8}} />
              <div style={{height: 10, borderRadius: 5, background: colors.track}}>
                <div
                  style={{
                    height: '100%',
                    borderRadius: 5,
                    width: `${v * ease(frame, 24 + i * 4, 50 + i * 4)}%`,
                    background: v >= 70 ? colors.status.warn : colors.status.ok,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProductBadge: React.FC<{name: string; desc: string; p: number; side: 'left' | 'right'}> = ({
  name,
  desc,
  p,
  side,
}) => (
  <Card
    padding={30}
    style={{
      position: 'absolute',
      top: 300,
      [side]: 110,
      width: 340,
      opacity: p,
      transform: `translateX(${(1 - p) * (side === 'left' ? -80 : 80)}px) scale(${0.85 + 0.15 * p})`,
      boxShadow: shadows.strong,
    }}
  >
    <div
      style={{
        display: 'inline-block',
        background: side === 'left' ? colors.green : colors.lime,
        color: side === 'left' ? colors.lime : colors.green,
        fontFamily: fonts.title,
        fontWeight: 800,
        fontSize: 30,
        padding: '10px 22px',
        borderRadius: radius.pill,
      }}
    >
      {name}
    </div>
    <div style={{fontFamily: fonts.body, fontSize: 26, color: colors.text, marginTop: 18, lineHeight: 1.35}}>{desc}</div>
  </Card>
);

/**
 * Scène 3 — La solution (13-18 s)
 * Les cartes du constat fusionnent en un point, qui devient un écran.
 */
export const Scene3Solution: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {cardW, cardH, gap, top, left} = PROBLEM_LAYOUT;
  const prevSceneFrames = SCENE_SECONDS.problem * 30;

  // 1. Fusion des cartes vers le centre
  const merge = ease(frame, 6, 42, easeInOut);
  const contentFade = interpolate(frame, [0, 14], [1, 0], {extrapolateRight: 'clamp'});

  // 2. Le point devient un écran
  const grow = springAt(frame, fps, 44, springSmooth);
  const dotVisible = frame >= 38;
  const w = interpolate(grow, [0, 1], [70, SCREEN.w]);
  const h = interpolate(grow, [0, 1], [70, SCREEN.h]);
  const pulse = dotVisible && frame < 50 ? 1 + Math.sin((frame - 38) / 2) * 0.08 : 1;
  const screenContent = ease(frame, 62, 80);
  const stand = springAt(frame, fps, 62, springSoft);

  // 3. Badges produits
  const badgeL = springAt(frame, fps, 78, springBouncy);
  const badgeR = springAt(frame, fps, 90, springBouncy);

  // 4. Plongée dans l'écran avant la scène suivante
  const zoom = interpolate(ease(frame, 142, 168, easeInOut), [0, 1], [1, 1.35]);

  return (
    <AbsoluteFill>
      <Background />
      <AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: `${CENTER.x}px ${CENTER.y}px`}}>
        {/* Cartes qui fusionnent */}
        {!dotVisible &&
          [0, 1, 2, 3].map((i) => {
            const x0 = left + i * (cardW + gap) + cardW / 2;
            const y0 = top + cardH / 2;
            const x = interpolate(merge, [0, 1], [x0, CENTER.x]);
            const y = interpolate(merge, [0, 1], [y0, CENTER.y]);
            const cw = interpolate(merge, [0, 1], [cardW, 70]);
            const ch = interpolate(merge, [0, 1], [cardH, 70]);
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: x - cw / 2,
                  top: y - ch / 2,
                  width: cw,
                  height: ch,
                  borderRadius: interpolate(merge, [0, 1], [24, 35]),
                  background: interpolateColors(merge, [0, 0.6, 1], [colors.white, colors.white, colors.green]),
                  boxShadow: shadows.card,
                  border: `1px solid ${colors.border}`,
                  overflow: 'hidden',
                  transform: `rotate(${merge * (i - 1.5) * 20}deg)`,
                }}
              >
                <div style={{padding: 40, opacity: contentFade}}>
                  <ProblemCardContent index={i} frame={prevSceneFrames + frame - (34 + i * 14)} />
                </div>
              </div>
            );
          })}

        {/* Point → écran d'ordinateur */}
        {dotVisible && (
          <>
            <div
              style={{
                position: 'absolute',
                left: CENTER.x - (SCREEN.w * 0.3 * stand) / 2,
                top: CENTER.y + SCREEN.h / 2 + 10,
                width: SCREEN.w * 0.3 * stand,
                height: 70 * stand,
                background: `linear-gradient(180deg, #CBD6C6, #E3EADF)`,
                clipPath: 'polygon(28% 0, 72% 0, 100% 100%, 0 100%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: CENTER.x - (SCREEN.w * 0.42 * stand) / 2,
                top: CENTER.y + SCREEN.h / 2 + 76,
                width: SCREEN.w * 0.42 * stand,
                height: 14,
                borderRadius: 7,
                background: '#CBD6C6',
                opacity: stand,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: CENTER.x - w / 2,
                top: CENTER.y - h / 2,
                width: w,
                height: h,
                borderRadius: interpolate(grow, [0, 1], [35, 26]),
                background: colors.green,
                padding: 14 * grow,
                boxSizing: 'border-box',
                boxShadow: shadows.strong,
                transform: `scale(${pulse})`,
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  borderRadius: 16,
                  overflow: 'hidden',
                  opacity: screenContent,
                }}
              >
                <MiniDashboard frame={frame - 62} />
              </div>
            </div>
          </>
        )}

        <ProductBadge {...SOLUTION.products[0]} p={badgeL} side="left" />
        <ProductBadge {...SOLUTION.products[1]} p={badgeR} side="right" />
      </AbsoluteFill>

      <RevealText
        text={SOLUTION.text}
        start={70}
        stagger={3}
        style={{
          position: 'absolute',
          top: 880,
          left: 0,
          right: 0,
          fontFamily: fonts.title,
          fontWeight: 800,
          fontSize: 60,
          letterSpacing: -1.2,
          color: colors.green,
        }}
      />
    </AbsoluteFill>
  );
};
