import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {SITES} from '../data';
import {colors, fonts, radius, springSmooth} from '../theme';
import {ease, springAt} from './anim';
import {NavIcon} from './Icons';
import {LogoMark, Wordmark} from './Logo';

export const NAV_ITEMS = [
  'Dashboard',
  'Sites',
  'Bennes',
  'Collectes',
  'Affluence',
  'Visites',
  'Notifications',
  'Incidents',
];

export const SIDEBAR_W = 300;
export const TOPBAR_H = 100;
const ITEM_H = 60;
const NAV_TOP = 150;

const SEARCH_PLACEHOLDER = 'Rechercher un site, une benne, une commune…';

type Props = {
  /** Index de l'onglet actif au début de la scène */
  activeFrom: number;
  /** Index de l'onglet actif après la bascule (optionnel) */
  activeTo?: number;
  /** Image de début de la bascule d'onglet */
  switchAt?: number;
  /** Joue l'animation d'apparition de l'interface */
  enter?: boolean;
  children: React.ReactNode;
};

/**
 * Coque de l'application Benneo Pro : barre latérale, barre de recherche,
 * zone de contenu. Recréée en composants pour animer chaque élément.
 */
export const AppShell: React.FC<Props> = ({activeFrom, activeTo, switchAt = 0, enter = false, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const sidebarP = enter ? springAt(frame, fps, 0) : 1;
  const topbarP = enter ? springAt(frame, fps, 8) : 1;

  const target = activeTo ?? activeFrom;
  const switchP = springAt(frame, fps, switchAt, springSmooth);
  const activePos = interpolate(switchP, [0, 1], [activeFrom, target]);
  const activeIdx = switchP > 0.5 ? target : activeFrom;

  // Saisie du texte dans la recherche
  const typed = enter
    ? Math.floor(interpolate(frame, [22, 62], [0, SEARCH_PLACEHOLDER.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}))
    : SEARCH_PLACEHOLDER.length;
  const caretOn = enter && frame < 75 && Math.floor(frame / 8) % 2 === 0;

  return (
    <div style={{position: 'absolute', inset: 0, background: colors.bg, overflow: 'hidden'}}>
      {/* ------------------------------------------------ Sidebar */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: SIDEBAR_W,
          background: colors.white,
          borderRight: `1px solid ${colors.border}`,
          transform: `translateX(${(1 - sidebarP) * -SIDEBAR_W}px)`,
          zIndex: 2,
        }}
      >
        <div style={{position: 'absolute', left: 36, top: 36, display: 'flex', alignItems: 'center', gap: 14}}>
          <LogoMark size={52} />
          <Wordmark size={34} />
        </div>

        {/* indicateur de l'onglet actif */}
        <div
          style={{
            position: 'absolute',
            left: 20,
            right: 20,
            top: NAV_TOP + activePos * ITEM_H,
            height: ITEM_H - 8,
            borderRadius: radius.small,
            background: colors.green,
            opacity: enter ? ease(frame, 18, 30) : 1,
          }}
        />

        {NAV_ITEMS.map((item, i) => {
          const p = enter ? springAt(frame, fps, 10 + i * 3) : 1;
          const isActive = i === activeIdx;
          return (
            <div
              key={item}
              style={{
                position: 'absolute',
                left: 20,
                right: 20,
                top: NAV_TOP + i * ITEM_H,
                height: ITEM_H - 8,
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                paddingLeft: 20,
                fontFamily: fonts.title,
                fontWeight: isActive ? 700 : 500,
                fontSize: 21,
                color: isActive ? colors.white : colors.textMuted,
                opacity: p,
                transform: `translateX(${(1 - p) * -30}px)`,
              }}
            >
              <NavIcon name={item} color={isActive ? colors.lime : colors.textMuted} />
              {item}
              {item === 'Incidents' ? (
                <span
                  style={{
                    marginLeft: 'auto',
                    marginRight: 16,
                    background: colors.status.alert,
                    color: colors.white,
                    fontSize: 15,
                    fontWeight: 700,
                    borderRadius: radius.pill,
                    padding: '2px 10px',
                  }}
                >
                  {SITES.filter((s) => s.status === 'alert').length}
                </span>
              ) : null}
            </div>
          );
        })}

        {/* carte d'aide en bas de la sidebar */}
        <div
          style={{
            position: 'absolute',
            left: 20,
            right: 20,
            bottom: 28,
            borderRadius: radius.card - 6,
            background: colors.limeSoft,
            padding: '20px 22px',
            fontFamily: fonts.body,
            fontSize: 17,
            color: colors.green,
            opacity: enter ? ease(frame, 40, 60) : 1,
          }}
        >
          <div style={{fontFamily: fonts.title, fontWeight: 700, fontSize: 19, marginBottom: 4}}>Assistant Benneo</div>
          Posez vos questions à l'IA
        </div>
      </div>

      {/* ------------------------------------------------ Topbar */}
      <div
        style={{
          position: 'absolute',
          left: SIDEBAR_W,
          right: 0,
          top: 0,
          height: TOPBAR_H,
          display: 'flex',
          alignItems: 'center',
          padding: '0 48px',
          gap: 24,
          opacity: topbarP,
          transform: `translateY(${(1 - topbarP) * -20}px)`,
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: 640,
            height: 58,
            borderRadius: radius.pill,
            background: colors.white,
            border: `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '0 24px',
            fontFamily: fonts.body,
            fontSize: 19,
            color: colors.textSoft,
          }}
        >
          <NavIcon name="Search" color={colors.textSoft} />
          <span>
            {SEARCH_PLACEHOLDER.slice(0, typed)}
            <span style={{opacity: caretOn ? 1 : 0, color: colors.green}}>|</span>
          </span>
        </div>
        <div style={{flex: 1}} />
        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: '50%',
            background: colors.white,
            border: `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <NavIcon name="Bell" color={colors.green} />
          <span
            style={{
              position: 'absolute',
              top: 12,
              right: 14,
              width: 11,
              height: 11,
              borderRadius: '50%',
              background: colors.status.alert,
              border: `2px solid ${colors.white}`,
            }}
          />
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: '50%',
              background: colors.green,
              color: colors.lime,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: fonts.title,
              fontWeight: 700,
              fontSize: 21,
            }}
          >
            GS
          </div>
          <div style={{fontFamily: fonts.title}}>
            <div style={{fontWeight: 700, fontSize: 19, color: colors.text}}>Gestionnaire</div>
            <div style={{fontFamily: fonts.body, fontSize: 15, color: colors.textSoft}}>Réseau Martinique</div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------ Contenu */}
      <div
        style={{
          position: 'absolute',
          left: SIDEBAR_W,
          top: TOPBAR_H,
          right: 0,
          bottom: 0,
          padding: '12px 48px 40px 48px',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </div>
    </div>
  );
};
