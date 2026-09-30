import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {AlertIcon, ClockIcon, DataIcon, EyeIcon} from '../components/Icons';
import {Card, RevealText} from '../components/ui';
import {springAt} from '../components/anim';
import {PROBLEM} from '../data';
import {colors, fonts, springSmooth} from '../theme';

// Disposition partagée avec la scène 3 (les cartes y fusionnent).
export const PROBLEM_LAYOUT = {
  cardW: 380,
  cardH: 440,
  gap: 36,
  top: 380,
  left: (1920 - (4 * 380 + 3 * 36)) / 2,
};

export const ICONS = {
  eye: EyeIcon,
  alert: AlertIcon,
  data: DataIcon,
  clock: ClockIcon,
};

export const ProblemCardContent: React.FC<{index: number; frame: number}> = ({index, frame}) => {
  const card = PROBLEM.cards[index];
  const Icon = ICONS[card.icon];
  const isAlert = card.icon === 'alert';
  return (
    <>
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: 30,
          background: isAlert ? `${colors.status.alert}14` : colors.limeSoft,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon frame={frame} size={70} />
      </div>
      <div
        style={{
          fontFamily: fonts.title,
          fontWeight: 800,
          fontSize: 34,
          color: colors.text,
          marginTop: 40,
          letterSpacing: -0.5,
          lineHeight: 1.15,
        }}
      >
        {card.title}
      </div>
      <div style={{fontFamily: fonts.body, fontSize: 24, lineHeight: 1.45, color: colors.textMuted, marginTop: 16}}>
        {card.text}
      </div>
    </>
  );
};

/**
 * Scène 2 — Le constat (5-13 s)
 * Quatre cartes-problèmes apparaissent en cascade avec leur icône animée.
 */
export const Scene2Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {cardW, cardH, gap, top, left} = PROBLEM_LAYOUT;

  return (
    <AbsoluteFill>
      <Background />
      <RevealText
        text={PROBLEM.title}
        start={4}
        stagger={3}
        style={{
          position: 'absolute',
          top: 110,
          left: 260,
          right: 260,
          fontFamily: fonts.title,
          fontWeight: 800,
          fontSize: 66,
          lineHeight: 1.15,
          letterSpacing: -1.5,
          color: colors.green,
        }}
      />

      {PROBLEM.cards.map((_, i) => {
        const delay = 34 + i * 14;
        const p = springAt(frame, fps, delay, springSmooth);
        return (
          <Card
            key={i}
            padding={40}
            style={{
              position: 'absolute',
              left: left + i * (cardW + gap),
              top,
              width: cardW,
              height: cardH,
              opacity: Math.min(1, p * 1.5),
              transform: `translateY(${(1 - p) * 120}px) scale(${0.9 + 0.1 * p})`,
            }}
          >
            <ProblemCardContent index={i} frame={Math.max(0, frame - delay)} />
          </Card>
        );
      })}
    </AbsoluteFill>
  );
};
