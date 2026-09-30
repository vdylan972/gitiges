import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {LogoMark} from '../components/Logo';
import {Phone} from '../components/Phone';
import {RevealText} from '../components/ui';
import {ease, springAt} from '../components/anim';
import {ASSISTANT} from '../data';
import {colors, fonts, springBouncy, springSmooth, springSoft} from '../theme';

// Couleurs de l'interface de messagerie
const WA = {
  wallpaper: '#EFEAE2',
  outgoing: '#D9FDD3',
  incoming: '#FFFFFF',
  tick: '#53BDEB',
  time: '#667781',
  link: '#027EB5',
};

// ---------------------------------------------------------------------------
// Script de la conversation (images locales à la scène)
// ---------------------------------------------------------------------------
type Msg =
  | {kind: 'typing'; from: number; to: number}
  | {kind: 'in'; at: number; text: string; buttons?: string[]; tapped?: {label: string; at: number}}
  | {kind: 'out'; at: number; text: string}
  | {kind: 'result'; at: number};

const SCRIPT: Msg[] = [
  {kind: 'typing', from: 22, to: 40},
  {
    kind: 'in',
    at: 40,
    text: ASSISTANT.greeting,
    buttons: ASSISTANT.siteChoices,
    tapped: {label: ASSISTANT.chosenSite, at: 54},
  },
  {kind: 'out', at: 60, text: ASSISTANT.chosenSite},
  {kind: 'typing', from: 68, to: 84},
  {
    kind: 'in',
    at: 84,
    text: ASSISTANT.fluxQuestion,
    buttons: ASSISTANT.fluxChoices,
    tapped: {label: ASSISTANT.chosenFlux, at: 98},
  },
  {kind: 'out', at: 104, text: ASSISTANT.chosenFlux},
  {kind: 'typing', from: 112, to: 128},
  {kind: 'result', at: 128},
];

const Time: React.FC<{out?: boolean}> = ({out}) => (
  <span
    style={{
      float: 'right',
      marginLeft: 12,
      marginTop: 8,
      fontSize: 13,
      color: WA.time,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 3,
    }}
  >
    10:42
    {out ? (
      <svg width={18} height={11} viewBox="0 0 18 11" fill="none" stroke={WA.tick} strokeWidth={1.8} strokeLinecap="round">
        <path d="M1 6l3 3 6-7M7 8.5l1 .5 6-7" />
      </svg>
    ) : null}
  </span>
);

const bubbleBase: React.CSSProperties = {
  fontFamily: fonts.body,
  fontSize: 19,
  lineHeight: 1.4,
  color: '#111B21',
  padding: '10px 14px',
  borderRadius: 16,
  boxShadow: '0 1px 1px rgba(0,0,0,0.08)',
  maxWidth: 330,
};

const TypingDots: React.FC<{frame: number}> = ({frame}) => (
  <div style={{...bubbleBase, background: WA.incoming, display: 'inline-flex', gap: 6, padding: '16px 18px'}}>
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        style={{
          width: 9,
          height: 9,
          borderRadius: '50%',
          background: '#8696A0',
          opacity: 0.4 + 0.6 * Math.max(0, Math.sin(frame / 3 - i * 0.9)),
          transform: `translateY(${-3 * Math.max(0, Math.sin(frame / 3 - i * 0.9))}px)`,
        }}
      />
    ))}
  </div>
);

const ResultCard: React.FC<{frame: number}> = ({frame}) => {
  const {result} = ASSISTANT;
  const bar = ease(frame, 8, 40);
  return (
    <div style={{...bubbleBase, background: WA.incoming, width: 330, padding: '14px 16px'}}>
      <div style={{fontFamily: fonts.title, fontWeight: 800, fontSize: 19, color: colors.green}}>{result.title}</div>
      <div style={{marginTop: 10, fontSize: 18}}>
        Remplissage : <b style={{fontFamily: fonts.title}}>{Math.round(result.fill * bar)} %</b>
      </div>
      <div style={{height: 10, borderRadius: 5, background: colors.track, marginTop: 8, overflow: 'hidden'}}>
        <div style={{height: '100%', width: `${result.fill * bar}%`, background: colors.status.warn, borderRadius: 5}} />
      </div>
      <div style={{marginTop: 10, fontSize: 18, display: 'flex', alignItems: 'center', gap: 8}}>
        Statut :
        <span
          style={{
            background: `${colors.status.warn}22`,
            color: '#B9761A',
            fontFamily: fonts.title,
            fontWeight: 700,
            borderRadius: 999,
            padding: '2px 12px',
            fontSize: 17,
          }}
        >
          {result.statusText}
        </span>
      </div>
      <Time />
    </div>
  );
};

/**
 * Scène 7 — Assistant IA (41-48 s)
 */
export const Scene7Assistant: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const phoneIn = springAt(frame, fps, 0, springSmooth);
  const floatY = Math.sin(frame / 22) * 6;

  const renderMsg = (m: Msg, i: number) => {
    let p: number;
    let content: React.ReactNode;
    let align: 'flex-start' | 'flex-end' = 'flex-start';
    let maxH = 80;

    if (m.kind === 'typing') {
      const inP = springAt(frame, fps, m.from, springSoft);
      const outP = frame >= m.to ? 0 : 1;
      p = inP * outP;
      if (p <= 0.001) return null;
      content = <TypingDots frame={frame} />;
    } else if (m.kind === 'out') {
      p = springAt(frame, fps, m.at, springBouncy);
      align = 'flex-end';
      content = (
        <div style={{...bubbleBase, background: WA.outgoing}}>
          {m.text}
          <Time out />
        </div>
      );
    } else if (m.kind === 'in') {
      p = springAt(frame, fps, m.at, springBouncy);
      maxH = 320;
      content = (
        <div style={{width: 330}}>
          <div style={{...bubbleBase, background: WA.incoming}}>
            {m.text}
            <Time />
          </div>
          {m.buttons?.map((b) => {
            const tapped = m.tapped && m.tapped.label === b && frame >= m.tapped.at;
            return (
              <div
                key={b}
                style={{
                  ...bubbleBase,
                  marginTop: 4,
                  background: tapped ? '#E7F3FF' : WA.incoming,
                  textAlign: 'center',
                  color: WA.link,
                  fontWeight: 500,
                  padding: '9px 14px',
                  transform: tapped ? `scale(${interpolate(frame - (m.tapped?.at ?? 0), [0, 3, 8], [1, 0.95, 1], {extrapolateRight: 'clamp'})})` : undefined,
                }}
              >
                {b}
              </div>
            );
          })}
        </div>
      );
    } else {
      p = springAt(frame, fps, m.at, springBouncy);
      maxH = 260;
      content = <ResultCard frame={frame - m.at} />;
    }

    if (p <= 0.001) return null;
    return (
      <div
        key={i}
        style={{
          display: 'flex',
          justifyContent: align,
          maxHeight: Math.max(0, Math.min(1, p)) * maxH,
          marginTop: 10 * Math.min(1, p),
          flexShrink: 0,
        }}
      >
        <div
          style={{
            transformOrigin: align === 'flex-end' ? 'bottom right' : 'bottom left',
            transform: `scale(${0.6 + 0.4 * p})`,
            opacity: Math.min(1, p * 1.4),
          }}
        >
          {content}
        </div>
      </div>
    );
  };

  return (
    <AbsoluteFill>
      <Background />

      {/* ------------------------------------------------ Téléphone */}
      <div
        style={{
          position: 'absolute',
          left: 300,
          top: 60,
          transform: `translateY(${(1 - phoneIn) * 900 + floatY}px) rotate(${(1 - phoneIn) * -8}deg)`,
        }}
      >
        <Phone>
          {/* en-tête de conversation */}
          <div
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 18px 14px',
              background: '#F7F8FA',
              borderBottom: '1px solid #E4E6E8',
            }}
          >
            <svg width={14} height={24} viewBox="0 0 14 24" fill="none" stroke={WA.link} strokeWidth={3} strokeLinecap="round">
              <path d="M12 2L2 12l10 10" />
            </svg>
            <LogoMark size={46} />
            <div style={{fontFamily: fonts.title}}>
              <div style={{fontWeight: 700, fontSize: 20, color: '#111B21', display: 'flex', alignItems: 'center', gap: 6}}>
                Benneo
                <svg width={18} height={18} viewBox="0 0 24 24">
                  <circle cx={12} cy={12} r={11} fill="#25D366" />
                  <path d="M7 12.5l3 3 7-7" stroke="#fff" strokeWidth={2.6} fill="none" strokeLinecap="round" />
                </svg>
              </div>
              <div style={{fontFamily: fonts.body, fontSize: 14, color: WA.time}}>
                {SCRIPT.some((m) => m.kind === 'typing' && frame >= m.from && frame < m.to) ? 'écrit…' : 'en ligne'}
              </div>
            </div>
          </div>

          {/* fil de messages */}
          <div
            style={{
              flex: 1,
              background: WA.wallpaper,
              backgroundImage: 'radial-gradient(rgba(0,0,0,0.035) 1.5px, transparent 1.5px)',
              backgroundSize: '22px 22px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '0 16px 14px',
              overflow: 'hidden',
            }}
          >
            {SCRIPT.map(renderMsg)}
          </div>

          {/* barre de saisie */}
          <div
            style={{
              flexShrink: 0,
              height: 78,
              background: '#F7F8FA',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '0 16px 12px',
            }}
          >
            <div
              style={{
                flex: 1,
                height: 44,
                borderRadius: 22,
                background: '#fff',
                border: '1px solid #E4E6E8',
                fontFamily: fonts.body,
                fontSize: 17,
                color: '#9AA5AC',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 18,
              }}
            >
              Message
            </div>
            <div style={{width: 44, height: 44, borderRadius: '50%', background: '#25D366'}} />
          </div>
        </Phone>
      </div>

      {/* ------------------------------------------------ Texte */}
      <div style={{position: 'absolute', left: 900, right: 140, top: 330}}>
        <div
          style={{
            display: 'inline-block',
            fontFamily: fonts.title,
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: colors.green,
            background: colors.lime,
            padding: '8px 18px',
            borderRadius: 999,
            opacity: ease(frame, 10, 26),
          }}
        >
          Assistant IA
        </div>
        <RevealText
          text={ASSISTANT.text}
          start={14}
          stagger={3}
          style={{
            justifyContent: 'flex-start',
            marginTop: 28,
            fontFamily: fonts.title,
            fontWeight: 800,
            fontSize: 72,
            lineHeight: 1.12,
            letterSpacing: -1.8,
            color: colors.green,
          }}
        />
        <div
          style={{
            marginTop: 30,
            fontFamily: fonts.body,
            fontSize: 32,
            color: colors.textMuted,
            opacity: ease(frame, 40, 60),
            transform: `translateY(${(1 - ease(frame, 40, 60)) * 20}px)`,
          }}
        >
          {ASSISTANT.subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};
