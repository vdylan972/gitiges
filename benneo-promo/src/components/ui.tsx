import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts, radius, shadows, springSoft} from '../theme';
import type {Status} from '../theme';
import {statusLabel} from '../theme';
import {ease, springAt} from './anim';

// ---------------------------------------------------------------------------
// Carte blanche arrondie
// ---------------------------------------------------------------------------
export const Card: React.FC<{
  style?: React.CSSProperties;
  children?: React.ReactNode;
  padding?: number;
}> = ({style, children, padding = 32}) => (
  <div
    style={{
      background: colors.white,
      borderRadius: radius.card,
      boxShadow: shadows.card,
      border: `1px solid ${colors.border}`,
      padding,
      boxSizing: 'border-box',
      ...style,
    }}
  >
    {children}
  </div>
);

// ---------------------------------------------------------------------------
// Compteur animé
// ---------------------------------------------------------------------------
const formatFr = (n: number) =>
  Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

export const Counter: React.FC<{
  value: number;
  start: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  style?: React.CSSProperties;
}> = ({value, start, duration = 45, suffix = '', prefix = '', style}) => {
  const frame = useCurrentFrame();
  const p = ease(frame, start, start + duration);
  return (
    <span style={{fontVariantNumeric: 'tabular-nums', ...style}}>
      {prefix}
      {formatFr(value * p)}
      {suffix}
    </span>
  );
};

// ---------------------------------------------------------------------------
// Texte révélé mot par mot
// ---------------------------------------------------------------------------
export const RevealText: React.FC<{
  text: string;
  start: number;
  stagger?: number;
  style?: React.CSSProperties;
  wordStyle?: (word: string, i: number) => React.CSSProperties | undefined;
}> = ({text, start, stagger = 3, style, wordStyle}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = text.split(' ');
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', ...style}}>
      {words.map((w, i) => {
        const p = springAt(frame, fps, start + i * stagger, springSoft);
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              marginRight: '0.26em',
              opacity: p,
              transform: `translateY(${(1 - p) * 26}px)`,
              filter: `blur(${(1 - p) * 6}px)`,
              ...wordStyle?.(w, i),
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Pastille de statut
// ---------------------------------------------------------------------------
export const StatusBadge: React.FC<{status: Status; label?: string; size?: number}> = ({
  status,
  label,
  size = 18,
}) => {
  const c = colors.status[status];
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size * 0.45,
        padding: `${size * 0.35}px ${size * 0.8}px`,
        borderRadius: radius.pill,
        background: `${c}1F`,
        color: c,
        fontFamily: fonts.title,
        fontWeight: 600,
        fontSize: size,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{width: size * 0.5, height: size * 0.5, borderRadius: '50%', background: c}} />
      {label ?? statusLabel[status]}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Barre de progression
// ---------------------------------------------------------------------------
export const ProgressBar: React.FC<{
  progress: number; // 0..1 de l'animation
  value: number; // %
  color: string;
  height?: number;
}> = ({progress, value, color, height = 14}) => (
  <div
    style={{
      height,
      borderRadius: height,
      background: colors.track,
      overflow: 'hidden',
      width: '100%',
    }}
  >
    <div
      style={{
        height: '100%',
        width: `${value * progress}%`,
        borderRadius: height,
        background: color,
      }}
    />
  </div>
);

/** Couleur d'une jauge selon le taux de remplissage. */
export const fillColor = (v: number) =>
  v >= 85 ? colors.status.alert : v >= 70 ? colors.status.warn : v >= 55 ? '#8DBF4A' : colors.status.ok;

// ---------------------------------------------------------------------------
// Jauge circulaire
// ---------------------------------------------------------------------------
export const RingGauge: React.FC<{
  size: number;
  value: number;
  progress: number;
  color: string;
  stroke?: number;
}> = ({size, value, progress, color, stroke = 14}) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const v = value * progress;
  return (
    <div style={{position: 'relative', width: size, height: size}}>
      <svg width={size} height={size} style={{transform: 'rotate(-90deg)'}}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={colors.track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - v / 100)}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: fonts.title,
          fontWeight: 800,
          fontSize: size * 0.26,
          color: colors.text,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {Math.round(v)}
        <span style={{fontSize: size * 0.14, marginLeft: 2, marginTop: size * 0.06}}>%</span>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// En-tête de page (titre + sous-titre)
// ---------------------------------------------------------------------------
export const PageHeader: React.FC<{title: string; subtitle: string; start?: number}> = ({
  title,
  subtitle,
  start = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = springAt(frame, fps, start);
  return (
    <div style={{opacity: p, transform: `translateY(${interpolate(p, [0, 1], [20, 0])}px)`}}>
      <div style={{fontFamily: fonts.title, fontWeight: 800, fontSize: 44, color: colors.text, letterSpacing: -1}}>
        {title}
      </div>
      <div style={{fontFamily: fonts.body, fontSize: 22, color: colors.textMuted, marginTop: 6}}>{subtitle}</div>
    </div>
  );
};
