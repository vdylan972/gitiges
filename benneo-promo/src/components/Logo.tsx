import React from 'react';
import {interpolate} from 'remotion';
import {colors, fonts} from '../theme';
import {clamp01} from './anim';

const C = 100;
const R_ARROW = 68;
const ARC_START = 38; // degrés, sens horaire depuis le haut
const ARC_END = 322;
const ARC_LENGTH = (R_ARROW * ((ARC_END - ARC_START) * Math.PI)) / 180;

const pt = (deg: number, r = R_ARROW) => {
  const a = (deg * Math.PI) / 180;
  return {x: C + r * Math.sin(a), y: C - r * Math.cos(a)};
};

type MarkProps = {
  size: number;
  /** 0 → 1 : le cercle apparaît */
  circle?: number;
  /** 0 → 1 : la flèche circulaire se dessine */
  arrow?: number;
  /** 0 → 1 : la lettre B apparaît */
  letter?: number;
  /** rotation continue de la flèche (degrés) */
  spin?: number;
};

/** Pictogramme Benneo : cercle vert foncé, « B » et flèche circulaire. */
export const LogoMark: React.FC<MarkProps> = ({size, circle = 1, arrow = 1, letter = 1, spin = 0}) => {
  const start = pt(ARC_START);
  const end = pt(ARC_END);
  // Pointe de flèche orientée selon la tangente (sens horaire) au point final.
  const a = (ARC_END * Math.PI) / 180;
  const tx = Math.cos(a);
  const ty = Math.sin(a);
  const nx = -ty;
  const ny = tx;
  const head = 15;
  const tip = {x: end.x + tx * head, y: end.y + ty * head};
  const l = {x: end.x + nx * head * 0.85, y: end.y + ny * head * 0.85};
  const r = {x: end.x - nx * head * 0.85, y: end.y - ny * head * 0.85};
  const headP = clamp01(interpolate(arrow, [0.85, 1], [0, 1]));

  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{overflow: 'visible'}}>
      <circle
        cx={C}
        cy={C}
        r={96}
        fill={colors.green}
        transform={`translate(${C} ${C}) scale(${circle}) translate(${-C} ${-C})`}
      />
      <g transform={`rotate(${spin} ${C} ${C})`}>
        <path
          d={`M ${start.x} ${start.y} A ${R_ARROW} ${R_ARROW} 0 1 1 ${end.x} ${end.y}`}
          fill="none"
          stroke={colors.lime}
          strokeWidth={11}
          strokeLinecap="round"
          strokeDasharray={ARC_LENGTH}
          strokeDashoffset={ARC_LENGTH * (1 - arrow)}
        />
        <polygon
          points={`${tip.x},${tip.y} ${l.x},${l.y} ${r.x},${r.y}`}
          fill={colors.lime}
          stroke={colors.lime}
          strokeWidth={4}
          strokeLinejoin="round"
          opacity={headP}
          transform={`translate(${end.x} ${end.y}) scale(${headP}) translate(${-end.x} ${-end.y})`}
        />
      </g>
      <text
        x={C}
        y={C + 3}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={fonts.title}
        fontWeight={800}
        fontSize={78}
        fill={colors.white}
        opacity={letter}
        transform={`translate(${C} ${C}) scale(${0.6 + 0.4 * letter}) translate(${-C} ${-C})`}
      >
        B
      </text>
    </svg>
  );
};

type WordmarkProps = {
  size: number;
  /** progression par lettre : fonction index → 0..1 */
  letterProgress?: (i: number) => number;
  color?: string;
};

export const Wordmark: React.FC<WordmarkProps> = ({size, letterProgress = () => 1, color = colors.green}) => {
  const letters = 'Benneo'.split('');
  return (
    <div
      style={{
        display: 'flex',
        fontFamily: fonts.title,
        fontWeight: 800,
        fontSize: size,
        color,
        letterSpacing: -size * 0.035,
        lineHeight: 1,
      }}
    >
      {letters.map((ch, i) => {
        const p = letterProgress(i);
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: p,
              transform: `translateY(${(1 - p) * size * 0.45}px)`,
              filter: `blur(${(1 - p) * 8}px)`,
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
};

/** Logo complet (pictogramme + nom), statique. */
export const Logo: React.FC<{size: number; color?: string}> = ({size, color}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: size * 0.28}}>
    <LogoMark size={size} />
    <Wordmark size={size * 0.62} color={color} />
  </div>
);
