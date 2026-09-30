import React from 'react';
import {fonts} from '../theme';

export const PHONE = {w: 470, h: 960, bezel: 16, radius: 74};

/** Cadre d'iPhone minimaliste avec barre d'état et Dynamic Island. */
export const Phone: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div
    style={{
      width: PHONE.w,
      height: PHONE.h,
      borderRadius: PHONE.radius,
      background: '#15191A',
      padding: PHONE.bezel,
      boxSizing: 'border-box',
      boxShadow: '0 60px 120px -40px rgba(23,58,45,0.55), inset 0 0 0 3px #3A4043',
      position: 'relative',
      ...style,
    }}
  >
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: PHONE.radius - PHONE.bezel,
        overflow: 'hidden',
        background: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* barre d'état */}
      <div
        style={{
          height: 54,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 34px 0 40px',
          fontFamily: fonts.title,
          fontWeight: 700,
          fontSize: 18,
          color: '#111',
          background: '#F7F8FA',
        }}
      >
        <span>9:41</span>
        <span style={{display: 'flex', gap: 6, alignItems: 'center'}}>
          <svg width={20} height={12} viewBox="0 0 20 12">
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x={i * 5} y={9 - i * 3} width={3.5} height={3 + i * 3} rx={1} fill="#111" />
            ))}
          </svg>
          <svg width={28} height={13} viewBox="0 0 28 13">
            <rect x={0.5} y={0.5} width={24} height={12} rx={3.5} fill="none" stroke="#111" opacity={0.5} />
            <rect x={2.5} y={2.5} width={17} height={8} rx={2} fill="#111" />
            <rect x={26} y={4} width={1.8} height={5} rx={1} fill="#111" opacity={0.5} />
          </svg>
        </span>
      </div>
      {/* Dynamic Island */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: '50%',
          width: 124,
          height: 36,
          marginLeft: -62,
          borderRadius: 20,
          background: '#000',
          zIndex: 5,
        }}
      />
      {children}
    </div>
  </div>
);
