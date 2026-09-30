import React from 'react';
import {interpolate} from 'remotion';
import {colors} from '../theme';

// ===========================================================================
// Icônes animées de la scène « Le constat »
// Chaque icône reçoit `frame` (temps local) pour animer ses éléments.
// ===========================================================================
type AnimIconProps = {frame: number; size?: number; color?: string};

/** Œil qui cligne et dont la pupille cherche l'information. */
export const EyeIcon: React.FC<AnimIconProps> = ({frame, size = 64, color = colors.green}) => {
  const cycle = frame % 75;
  const blink = cycle > 60 ? Math.abs(Math.sin(((cycle - 60) / 15) * Math.PI)) : 0;
  const look = Math.sin(frame / 14) * 5;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <g transform={`translate(32 32) scale(1 ${1 - blink * 0.9}) translate(-32 -32)`}>
        <path
          d="M4 32 C 14 14, 50 14, 60 32 C 50 50, 14 50, 4 32 Z"
          stroke={color}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <circle cx={32 + look} cy={32} r={9} fill={color} />
        <circle cx={35 + look} cy={29} r={2.6} fill={colors.white} />
      </g>
      {/* barre : « on ne voit pas » */}
      <line
        x1={12}
        y1={54}
        x2={52}
        y2={10}
        stroke={colors.status.alert}
        strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray={60}
        strokeDashoffset={interpolate(frame, [20, 40], [60, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })}
      />
    </svg>
  );
};

/** Triangle d'alerte qui pulse avec un léger tremblement. */
export const AlertIcon: React.FC<AnimIconProps> = ({frame, size = 64}) => {
  const pulse = 1 + Math.max(0, Math.sin(frame / 6)) * 0.06;
  const wobble = Math.sin(frame / 2.2) * Math.max(0, Math.sin(frame / 18)) * 4;
  const c = colors.status.alert;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <g transform={`translate(32 36) rotate(${wobble}) scale(${pulse}) translate(-32 -36)`}>
        <path
          d="M32 7 L60 55 H4 Z"
          fill={`${c}22`}
          stroke={c}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <line x1={32} y1={24} x2={32} y2={38} stroke={c} strokeWidth={5} strokeLinecap="round" />
        <circle cx={32} cy={46} r={3.2} fill={c} />
      </g>
    </svg>
  );
};

/** Base de données dont les disques se dispersent. */
export const DataIcon: React.FC<AnimIconProps> = ({frame, size = 64, color = colors.green}) => {
  const s = (Math.sin(frame / 16 - Math.PI / 2) + 1) / 2; // 0..1..0
  const disks = [
    {y: 16, dx: -10, dy: -6, r: -14},
    {y: 30, dx: 12, dy: 0, r: 10},
    {y: 44, dx: -6, dy: 7, r: -8},
  ];
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={{overflow: 'visible'}}>
      {disks.map((d, i) => (
        <g key={i} transform={`translate(${d.dx * s} ${d.dy * s}) rotate(${d.r * s} 32 ${d.y})`}>
          <ellipse cx={32} cy={d.y} rx={20} ry={6} fill={i === 0 ? colors.limeSoft : colors.white} stroke={color} strokeWidth={3.5} />
          <path d={`M12 ${d.y} v8 c0 3.3 9 6 20 6 s20 -2.7 20 -6 v-8`} stroke={color} strokeWidth={3.5} fill={colors.white} />
        </g>
      ))}
      {/* petits fragments qui s'échappent */}
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx={32 + Math.cos(i * 2.1) * (24 + s * 10)}
          cy={32 + Math.sin(i * 2.1) * (24 + s * 10)}
          r={2.5}
          fill={colors.lime}
          opacity={s}
        />
      ))}
    </svg>
  );
};

/** Horloge dont les aiguilles tournent trop vite. */
export const ClockIcon: React.FC<AnimIconProps> = ({frame, size = 64, color = colors.green}) => {
  const minute = frame * 9;
  const hour = frame * 0.75;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx={32} cy={34} r={24} stroke={color} strokeWidth={4} fill={colors.white} />
      {[0, 90, 180, 270].map((a) => (
        <line
          key={a}
          x1={32}
          y1={14}
          x2={32}
          y2={18}
          stroke={color}
          strokeWidth={3}
          strokeLinecap="round"
          transform={`rotate(${a} 32 34)`}
        />
      ))}
      <line x1={32} y1={34} x2={32} y2={22} stroke={color} strokeWidth={4} strokeLinecap="round" transform={`rotate(${hour} 32 34)`} />
      <line x1={32} y1={34} x2={32} y2={17} stroke={colors.status.warn} strokeWidth={3} strokeLinecap="round" transform={`rotate(${minute} 32 34)`} />
      <circle cx={32} cy={34} r={3} fill={color} />
      <path d="M20 6 l-6 5 M44 6 l6 5" stroke={color} strokeWidth={4} strokeLinecap="round" />
    </svg>
  );
};

// ===========================================================================
// Icônes de navigation (sidebar Benneo Pro), style trait
// ===========================================================================
const NAV_PATHS: Record<string, React.ReactNode> = {
  Dashboard: (
    <>
      <rect x={3} y={3} width={8} height={8} rx={2} />
      <rect x={13} y={3} width={8} height={5} rx={2} />
      <rect x={13} y={10} width={8} height={11} rx={2} />
      <rect x={3} y={13} width={8} height={8} rx={2} />
    </>
  ),
  Sites: (
    <>
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
      <circle cx={12} cy={9.5} r={2.6} />
    </>
  ),
  Bennes: (
    <>
      <path d="M3 8h18l-2 11H5z" />
      <path d="M7 8l2-4h6l2 4" />
    </>
  ),
  Collectes: (
    <>
      <rect x={2} y={7} width={12} height={9} rx={1.5} />
      <path d="M14 10h4l3 3v3h-7" />
      <circle cx={6} cy={18} r={2} />
      <circle cx={17} cy={18} r={2} />
    </>
  ),
  Affluence: (
    <>
      <path d="M3 20h18" />
      <path d="M6 16v-5M11 16V7M16 16v-8M20 16v-3" />
    </>
  ),
  Visites: (
    <>
      <circle cx={9} cy={8} r={3.5} />
      <path d="M2.5 20c.8-3.6 3.3-5.5 6.5-5.5s5.7 1.9 6.5 5.5" />
      <path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.8c1.8.6 3 2.3 3.5 5.2" />
    </>
  ),
  Notifications: (
    <>
      <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" />
      <path d="M10 20.5a2 2 0 0 0 4 0" />
    </>
  ),
  Incidents: (
    <>
      <path d="M12 3l9.5 17h-19z" />
      <path d="M12 10v4.5M12 17.2v.3" />
    </>
  ),
  Search: (
    <>
      <circle cx={11} cy={11} r={6.5} />
      <path d="M16 16l4.5 4.5" />
    </>
  ),
  Bell: (
    <>
      <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" />
      <path d="M10 20.5a2 2 0 0 0 4 0" />
    </>
  ),
};

export const NavIcon: React.FC<{name: string; size?: number; color?: string}> = ({
  name,
  size = 24,
  color = colors.textMuted,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={1.9}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {NAV_PATHS[name]}
  </svg>
);
