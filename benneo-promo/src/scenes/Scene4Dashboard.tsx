import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {AppShell} from '../components/AppShell';
import {MapPin, MartiniqueMap, makeProjection} from '../components/MartiniqueMap';
import {Card, PageHeader, ProgressBar} from '../components/ui';
import {ease, springAt} from '../components/anim';
import {FILL_RANKING, SITES} from '../data';
import {colors, easeInOut, fonts, radius, springBouncy, springSmooth, springSoft, statusLabel} from '../theme';
import type {Status} from '../theme';

const MAP_W = 876;
const MAP_H = 560;
const PIN_START = 84;
const PIN_STAGGER = 7;
const LEGEND_ORDER: Status[] = ['ok', 'warn', 'alert', 'off'];
const ALERT_SITES = SITES.filter((s) => s.status === 'alert').map((s) => s.name);

// Ordre de chute des épingles : du nord au sud, pour un effet de « pluie ».
const PIN_ORDER = SITES.map((s, i) => ({s, i}))
  .sort((a, b) => b.s.lat - a.s.lat)
  .map((x, rank) => ({...x, delay: PIN_START + rank * PIN_STAGGER}));

/**
 * Scène 4 — Dashboard et carte (18-28 s) — scène phare
 */
export const Scene4Dashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const project = makeProjection(MAP_W, MAP_H);

  const mapCard = springAt(frame, fps, 22, springSoft);
  const rightCard = springAt(frame, fps, 44, springSoft);
  const draw = ease(frame, 34, 84, easeInOut);
  const fill = ease(frame, 60, 96);
  const live = (Math.sin(frame / 6) + 1) / 2;

  const landedAt = (delay: number) => delay + 10;

  return (
    <AbsoluteFill>
      <AppShell activeFrom={0} enter>
        <PageHeader title="Dashboard" subtitle={`Vue d'ensemble de vos ${SITES.length} déchèteries`} start={14} />

        <div style={{display: 'flex', gap: 24, marginTop: 26}}>
          {/* ------------------------------------------------ Carte des sites */}
          <Card
            padding={32}
            style={{
              width: 940,
              height: 790,
              opacity: mapCard,
              transform: `translateY(${(1 - mapCard) * 60}px)`,
            }}
          >
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20}}>
              <div style={{fontFamily: fonts.title, fontWeight: 800, fontSize: 28, color: colors.text}}>Carte des sites</div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  background: colors.limeSoft,
                  color: colors.green,
                  padding: '8px 18px',
                  borderRadius: radius.pill,
                  fontFamily: fonts.title,
                  fontWeight: 600,
                  fontSize: 18,
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: colors.status.ok,
                    boxShadow: `0 0 0 ${4 + live * 4}px ${colors.status.ok}33`,
                  }}
                />
                Temps réel
              </div>
            </div>

            <div style={{borderRadius: 18, overflow: 'hidden'}}>
              <MartiniqueMap width={MAP_W} height={MAP_H} draw={draw} fill={fill}>
                {PIN_ORDER.map(({s, delay}) => {
                  const {x, y} = project(s.lon, s.lat);
                  const drop = springAt(frame, fps, delay, springBouncy);
                  const pulse = s.status === 'alert' ? frame - landedAt(delay) : null;
                  return (
                    <div key={s.name} style={{position: 'absolute', left: x, top: y}}>
                      <MapPin color={colors.status[s.status]} drop={drop} pulseFrame={pulse} />
                    </div>
                  );
                })}
              </MartiniqueMap>
            </div>

            {/* Légende avec compteurs */}
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 26, padding: '0 6px'}}>
              {LEGEND_ORDER.map((st, i) => {
                const pins = PIN_ORDER.filter((p) => p.s.status === st);
                const landed = pins.filter((p) => frame >= landedAt(p.delay));
                const last = landed.length ? landedAt(landed[landed.length - 1].delay) : -100;
                const pop = 1 + 0.35 * (1 - springAt(frame, fps, last, springSmooth));
                const appear = springAt(frame, fps, 60 + i * 5, springSoft);
                return (
                  <div
                    key={st}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      fontFamily: fonts.title,
                      fontSize: 21,
                      color: colors.textMuted,
                      opacity: appear,
                      transform: `translateY(${(1 - appear) * 16}px)`,
                    }}
                  >
                    <span style={{width: 16, height: 16, borderRadius: '50%', background: colors.status[st]}} />
                    {statusLabel[st]}
                    <span
                      style={{
                        minWidth: 44,
                        textAlign: 'center',
                        padding: '4px 10px',
                        borderRadius: radius.pill,
                        background: `${colors.status[st]}1A`,
                        color: colors.status[st],
                        fontWeight: 800,
                        fontSize: 22,
                        display: 'inline-block',
                        transform: `scale(${pop})`,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {landed.length}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* ------------------------------------------------ Remplissage par site */}
          <Card
            padding={36}
            style={{
              flex: 1,
              height: 790,
              opacity: rightCard,
              transform: `translateX(${(1 - rightCard) * 80}px)`,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{fontFamily: fonts.title, fontWeight: 800, fontSize: 28, color: colors.text}}>
              Taux de remplissage par site
            </div>
            <div style={{fontFamily: fonts.body, fontSize: 19, color: colors.textSoft, marginTop: 6}}>
              Moyenne des bennes · mise à jour il y a 2 min
            </div>

            <div style={{marginTop: 34, display: 'flex', flexDirection: 'column', gap: 30}}>
              {FILL_RANKING.map((r, i) => {
                const start = 120 + i * 12;
                const p = springAt(frame, fps, start, springSoft, 40);
                const rowIn = springAt(frame, fps, 60 + i * 5, springSoft);
                const color = r.fill >= 75 ? colors.status.alert : r.fill >= 60 ? colors.status.warn : colors.status.ok;
                return (
                  <div key={r.name} style={{opacity: rowIn, transform: `translateY(${(1 - rowIn) * 20}px)`}}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontFamily: fonts.title,
                        fontSize: 22,
                        marginBottom: 12,
                      }}
                    >
                      <span style={{fontWeight: 600, color: colors.text}}>{r.name}</span>
                      <span style={{fontWeight: 800, color, fontVariantNumeric: 'tabular-nums'}}>
                        {Math.round(r.fill * p)} %
                      </span>
                    </div>
                    <ProgressBar progress={p} value={r.fill} color={color} height={16} />
                  </div>
                );
              })}
            </div>

            <div style={{flex: 1}} />
            {(() => {
              const p = springAt(frame, fps, 196, springBouncy);
              return (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    background: `${colors.status.alert}10`,
                    border: `1px solid ${colors.status.alert}33`,
                    borderRadius: 18,
                    padding: '18px 22px',
                    opacity: Math.min(1, p),
                    transform: `scale(${0.9 + 0.1 * p})`,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: colors.status.alert,
                      color: colors.white,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: fonts.title,
                      fontWeight: 800,
                      fontSize: 26,
                    }}
                  >
                    !
                  </div>
                  <div style={{fontFamily: fonts.title}}>
                    <div style={{fontWeight: 700, fontSize: 21, color: colors.text}}>
                      {ALERT_SITES.length} sites en alerte
                    </div>
                    <div style={{fontFamily: fonts.body, fontSize: 17, color: colors.textMuted}}>
                      Collecte recommandée : {ALERT_SITES.join(' et ')}
                    </div>
                  </div>
                </div>
              );
            })()}
          </Card>
        </div>
      </AppShell>
    </AbsoluteFill>
  );
};
