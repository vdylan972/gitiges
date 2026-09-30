import React from 'react';
import {colors} from '../theme';

// ---------------------------------------------------------------------------
// Silhouette simplifiée de la Martinique (longitude, latitude), sens horaire
// depuis le Prêcheur. Volontairement stylisée : pas de tuiles de carte réelles.
// ---------------------------------------------------------------------------
const COAST: [number, number][] = [
  [-61.228, 14.812], [-61.215, 14.845], [-61.185, 14.872], [-61.14, 14.878],
  [-61.1, 14.866], [-61.06, 14.845], [-61.025, 14.822], [-60.99, 14.795],
  [-60.97, 14.765], [-60.94, 14.772], [-60.88, 14.782], [-60.862, 14.768],
  [-60.905, 14.756], [-60.95, 14.745], [-60.935, 14.715], [-60.905, 14.7],
  [-60.915, 14.672], [-60.875, 14.66], [-60.865, 14.635], [-60.84, 14.61],
  [-60.83, 14.575], [-60.815, 14.545], [-60.82, 14.51], [-60.8, 14.475],
  [-60.82, 14.44], [-60.84, 14.41], [-60.865, 14.393], [-60.885, 14.405],
  [-60.885, 14.435], [-60.87, 14.462], [-60.895, 14.458], [-60.93, 14.462],
  [-60.97, 14.466], [-61.02, 14.474], [-61.06, 14.462], [-61.09, 14.478],
  [-61.085, 14.505], [-61.07, 14.53], [-61.045, 14.548], [-61.02, 14.56],
  [-60.995, 14.575], [-60.99, 14.598], [-61.02, 14.605], [-61.06, 14.598],
  [-61.085, 14.61], [-61.11, 14.625], [-61.14, 14.645], [-61.16, 14.675],
  [-61.175, 14.71], [-61.18, 14.745], [-61.2, 14.775],
];

const LON_MIN = -61.25;
const LON_MAX = -60.78;
const LAT_MIN = 14.37;
const LAT_MAX = 14.9;
const COS_LAT = Math.cos((14.63 * Math.PI) / 180);

export type Projection = (lon: number, lat: number) => {x: number; y: number};

/** Projection équirectangulaire centrée dans une boîte width × height. */
export const makeProjection = (width: number, height: number, padding = 30): Projection => {
  const wDeg = (LON_MAX - LON_MIN) * COS_LAT;
  const hDeg = LAT_MAX - LAT_MIN;
  const scale = Math.min((width - padding * 2) / wDeg, (height - padding * 2) / hDeg);
  const offX = (width - wDeg * scale) / 2;
  const offY = (height - hDeg * scale) / 2;
  return (lon, lat) => ({
    x: offX + (lon - LON_MIN) * COS_LAT * scale,
    y: offY + (LAT_MAX - lat) * scale,
  });
};

/** Courbe de Catmull-Rom fermée → chemin de Bézier lisse. */
const smoothPath = (pts: {x: number; y: number}[]) => {
  const n = pts.length;
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const t = 0.18;
    const c1 = {x: p1.x + (p2.x - p0.x) * t, y: p1.y + (p2.y - p0.y) * t};
    const c2 = {x: p2.x - (p3.x - p1.x) * t, y: p2.y - (p3.y - p1.y) * t};
    d += ` C ${c1.x.toFixed(1)} ${c1.y.toFixed(1)}, ${c2.x.toFixed(1)} ${c2.y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d + ' Z';
};

type Props = {
  width: number;
  height: number;
  /** 0 → 1 : tracé du contour */
  draw: number;
  /** 0 → 1 : remplissage de l'île */
  fill: number;
  /** Marge intérieure autour de l'île (doit être identique à makeProjection) */
  padding?: number;
  /** Éléments posés sur la carte (épingles), rendus au-dessus */
  children?: React.ReactNode;
};

export const MartiniqueMap: React.FC<Props> = ({width, height, draw, fill, padding = 30, children}) => {
  const project = makeProjection(width, height, padding);
  const d = smoothPath(COAST.map(([lon, lat]) => project(lon, lat)));

  return (
    <div style={{position: 'relative', width, height}}>
      <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
        <defs>
          <pattern id="waves" width="60" height="26" patternUnits="userSpaceOnUse">
            <path d="M0 13 q15 -8 30 0 t30 0" fill="none" stroke={colors.seaLine} strokeWidth={1.5} />
          </pattern>
          <linearGradient id="land" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EAF4D2" />
            <stop offset="100%" stopColor={colors.land} />
          </linearGradient>
        </defs>
        <rect width={width} height={height} fill={colors.sea} />
        <rect width={width} height={height} fill="url(#waves)" opacity={0.7} />
        {/* halo côtier */}
        <path d={d} fill="none" stroke={colors.white} strokeWidth={22} strokeLinejoin="round" opacity={0.55 * fill} />
        <path d={d} fill="url(#land)" opacity={fill} />
        <path
          d={d}
          fill="none"
          stroke={colors.landStroke}
          strokeWidth={3}
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - draw}
        />
      </svg>
      <div style={{position: 'absolute', inset: 0}}>{children}</div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Épingle de carte
// ---------------------------------------------------------------------------
export const MapPin: React.FC<{
  color: string;
  size?: number;
  /** 0 → 1 : chute (ressort avec rebond) */
  drop: number;
  /** pulsation (pour les sites en alerte) : temps local en images, ou null */
  pulseFrame?: number | null;
}> = ({color, size = 44, drop, pulseFrame = null}) => {
  const h = size * 1.3;
  const fall = (1 - drop) * -260;
  const visible = drop > 0.001 ? 1 : 0;
  const landed = Math.min(1, Math.max(0, drop));

  const rings =
    pulseFrame !== null && pulseFrame > 0
      ? [0, 22].map((offset) => ((pulseFrame + offset) % 44) / 44)
      : [];

  return (
    <div style={{position: 'absolute', transform: 'translate(-50%, -100%)', opacity: visible}}>
      {/* ombre au sol */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: -5,
          width: size * 0.6,
          height: size * 0.18,
          borderRadius: '50%',
          background: 'rgba(23,58,45,0.25)',
          transform: `translateX(-50%) scale(${0.3 + 0.7 * landed})`,
          filter: 'blur(2px)',
        }}
      />
      {rings.map((r, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: '50%',
            top: '100%',
            width: size * 2,
            height: size,
            borderRadius: '50%',
            border: `3px solid ${color}`,
            opacity: (1 - r) * 0.8,
            transform: `translate(-50%, -50%) scale(${0.2 + r})`,
          }}
        />
      ))}
      <svg
        width={size}
        height={h}
        viewBox="0 0 40 52"
        style={{display: 'block', transform: `translateY(${fall}px)`, overflow: 'visible'}}
      >
        <path
          d="M20 51 C 20 51, 3 31, 3 19 A 17 17 0 0 1 37 19 C 37 31, 20 51, 20 51 Z"
          fill={color}
          stroke={colors.white}
          strokeWidth={2.5}
        />
        <circle cx={20} cy={19} r={7} fill={colors.white} />
      </svg>
    </div>
  );
};
