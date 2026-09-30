import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {colors} from '../theme';

type Props = {
  /** Variante « tropicale » : dégradé plus présent (scène finale) */
  tropical?: boolean;
  dark?: boolean;
};

/**
 * Fond clair avec de grandes taches de couleur floues qui dérivent très
 * lentement : ambiance apaisée, jamais distrayante.
 */
export const Background: React.FC<Props> = ({tropical = false, dark = false}) => {
  const frame = useCurrentFrame();
  const t = frame / 30;

  const blob = (
    x: number,
    y: number,
    size: number,
    color: string,
    opacity: number,
    phase: number,
  ): React.CSSProperties => ({
    position: 'absolute',
    left: x + Math.sin(t * 0.35 + phase) * 40,
    top: y + Math.cos(t * 0.3 + phase) * 30,
    width: size,
    height: size,
    borderRadius: '50%',
    background: color,
    opacity,
    filter: 'blur(120px)',
  });

  if (dark) {
    return (
      <AbsoluteFill style={{background: colors.green, overflow: 'hidden'}}>
        <div style={blob(-200, -250, 900, '#2F6B52', 0.7, 0)} />
        <div style={blob(1200, 500, 900, colors.lime, 0.14, 2)} />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill
      style={{
        background: tropical
          ? `linear-gradient(135deg, ${colors.bg} 0%, #EEF7DA 45%, #E2F2EA 100%)`
          : colors.bg,
        overflow: 'hidden',
      }}
    >
      <div style={blob(-250, -300, 900, colors.lime, tropical ? 0.45 : 0.3, 0)} />
      <div style={blob(1250, 550, 900, '#9FD8C4', tropical ? 0.4 : 0.22, 1.5)} />
      <div style={blob(700, 700, 600, colors.limeSoft, 0.35, 3)} />
    </AbsoluteFill>
  );
};
