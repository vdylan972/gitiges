import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {MapPin} from '../components/MartiniqueMap';
import {Counter} from '../components/ui';
import {ease, springAt} from '../components/anim';
import {MARKET} from '../data';
import {colors, easeInOut, fonts, springBouncy, springSmooth, springSoft} from '../theme';

const NET_CENTER = {x: 1390, y: 500};

// Positions du réseau : spirale « tournesol » (angle d'or), déterministe.
const NODES = Array.from({length: MARKET.networkSize}, (_, i) => {
  const angle = i * 2.39996 + 0.6;
  const r = 150 + Math.sqrt(i + 1) * 78;
  return {
    x: NET_CENTER.x + Math.cos(angle) * r * 1.15,
    y: NET_CENTER.y + Math.sin(angle) * r * 0.82,
  };
});

// Chaque nœud est relié à son plus proche voisin déjà apparu.
const LINKS = NODES.map((n, i) => {
  let best = -1;
  let bestD = Infinity;
  for (let j = 0; j < i; j++) {
    const d = Math.hypot(NODES[j].x - n.x, NODES[j].y - n.y);
    if (d < bestD) {
      bestD = d;
      best = j;
    }
  }
  return best;
});

const NODE_START = 46;
const NODE_STAGGER = 4;

/**
 * Scène 8 — Le marché (48-54 s)
 */
export const Scene8Market: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const centerPin = springAt(frame, fps, 12, springBouncy);

  return (
    <AbsoluteFill>
      <Background dark />

      {/* ------------------------------------------------ Chiffres */}
      <div style={{position: 'absolute', left: 150, top: 190}}>
        <div
          style={{
            fontFamily: fonts.title,
            fontWeight: 700,
            fontSize: 24,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: colors.lime,
            opacity: ease(frame, 0, 18),
          }}
        >
          {MARKET.title}
        </div>
        {MARKET.stats.map((s, i) => {
          const start = 10 + i * 34;
          const p = springAt(frame, fps, start, springSoft);
          return (
            <div
              key={s.label}
              style={{marginTop: i === 0 ? 30 : 56, opacity: p, transform: `translateY(${(1 - p) * 40}px)`}}
            >
              <Counter
                value={s.value}
                prefix={s.prefix}
                start={start}
                duration={55}
                style={{
                  display: 'block',
                  fontFamily: fonts.title,
                  fontWeight: 800,
                  fontSize: 170,
                  lineHeight: 1,
                  letterSpacing: -6,
                  color: colors.white,
                }}
              />
              <div style={{fontFamily: fonts.body, fontSize: 38, color: colors.limeSoft, marginTop: 10}}>{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* ------------------------------------------------ Réseau */}
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {NODES.map((n, i) => {
          const from = LINKS[i] === -1 ? NET_CENTER : NODES[LINKS[i]];
          const p = ease(frame, NODE_START + i * NODE_STAGGER, NODE_START + i * NODE_STAGGER + 18, easeInOut);
          const len = Math.hypot(n.x - from.x, n.y - from.y);
          return (
            <g key={i}>
              <line
                x1={from.x}
                y1={from.y}
                x2={n.x}
                y2={n.y}
                stroke={colors.lime}
                strokeOpacity={0.45}
                strokeWidth={2.5}
                strokeDasharray={len}
                strokeDashoffset={len * (1 - p)}
              />
              {i < 4 ? (
                <line
                  x1={NET_CENTER.x}
                  y1={NET_CENTER.y}
                  x2={n.x}
                  y2={n.y}
                  stroke={colors.lime}
                  strokeOpacity={0.25}
                  strokeWidth={2}
                  strokeDasharray="4 8"
                  opacity={p}
                />
              ) : null}
            </g>
          );
        })}
        {/* halo du site d'origine */}
        {[0, 30].map((o) => {
          const r = ((frame + o) % 60) / 60;
          return (
            <circle
              key={o}
              cx={NET_CENTER.x}
              cy={NET_CENTER.y}
              r={30 + r * 120}
              fill="none"
              stroke={colors.lime}
              strokeWidth={2}
              opacity={(1 - r) * 0.5 * centerPin}
            />
          );
        })}
      </svg>

      {/* épingles dupliquées : elles partent du centre vers leur position */}
      {NODES.map((n, i) => {
        const p = springAt(frame, fps, NODE_START + i * NODE_STAGGER, springSmooth);
        const x = interpolate(p, [0, 1], [NET_CENTER.x, n.x]);
        const y = interpolate(p, [0, 1], [NET_CENTER.y, n.y]);
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y + 16, opacity: Math.min(1, p * 2)}}>
            <MapPin color={i % 3 === 0 ? colors.lime : colors.white} size={30} drop={1} />
          </div>
        );
      })}

      <div style={{position: 'absolute', left: NET_CENTER.x, top: NET_CENTER.y + 30}}>
        <MapPin color={colors.lime} size={64} drop={centerPin} />
      </div>

      <div
        style={{
          position: 'absolute',
          left: NET_CENTER.x - 400,
          width: 800,
          top: 930,
          textAlign: 'center',
          fontFamily: fonts.body,
          fontSize: 32,
          color: colors.white,
          opacity: ease(frame, 100, 120),
        }}
      >
        <span style={{color: colors.lime, fontWeight: 600}}>1 site</span> → {MARKET.networkCaption}
      </div>
    </AbsoluteFill>
  );
};
