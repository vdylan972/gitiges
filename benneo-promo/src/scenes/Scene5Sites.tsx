import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {AppShell} from '../components/AppShell';
import {NavIcon} from '../components/Icons';
import {Card, Counter, PageHeader, ProgressBar, RingGauge, StatusBadge, fillColor} from '../components/ui';
import {springAt} from '../components/anim';
import {FILL_THRESHOLD, KPIS, SITE_CARDS} from '../data';
import {colors, fonts, springSmooth, springSoft} from '../theme';

const KPI_LIST = [
  {label: 'Sites suivis', value: KPIS.sites, suffix: '', sub: 'déchèteries connectées', icon: 'Sites'},
  {label: 'Remplissage moyen', value: KPIS.avgFill, suffix: ' %', sub: 'sur l’ensemble des bennes', icon: 'Bennes'},
  {
    label: `Sites ≥ ${FILL_THRESHOLD} %`,
    value: KPIS.overThreshold,
    suffix: '',
    sub: KPIS.overThreshold === 0 ? 'aucune saturation' : 'à collecter en priorité',
    icon: 'Incidents',
  },
];

/**
 * Scène 5 — Sites et KPIs (28-35 s)
 */
export const Scene5Sites: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <AbsoluteFill>
      <AppShell activeFrom={0} activeTo={1} switchAt={2}>
        <PageHeader title="Sites" subtitle="Suivi en temps réel de vos déchèteries" start={4} />

        {/* ------------------------------------------------ KPIs */}
        <div style={{display: 'flex', gap: 24, marginTop: 26}}>
          {KPI_LIST.map((k, i) => {
            const p = springAt(frame, fps, 10 + i * 6, springSoft);
            const good = i === 2 && k.value === 0;
            return (
              <Card
                key={k.label}
                padding={30}
                style={{
                  flex: 1,
                  height: 180,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  opacity: p,
                  transform: `translateY(${(1 - p) * 30}px)`,
                }}
              >
                <div>
                  <div style={{fontFamily: fonts.body, fontSize: 21, color: colors.textMuted}}>{k.label}</div>
                  <Counter
                    value={k.value}
                    suffix={k.suffix}
                    start={16 + i * 6}
                    duration={40}
                    style={{
                      display: 'block',
                      fontFamily: fonts.title,
                      fontWeight: 800,
                      fontSize: 70,
                      lineHeight: 1.1,
                      color: good ? colors.status.ok : colors.text,
                      letterSpacing: -2,
                    }}
                  />
                  <div style={{fontFamily: fonts.body, fontSize: 18, color: colors.textSoft}}>{k.sub}</div>
                </div>
                <div
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: 22,
                    background: good ? `${colors.status.ok}1A` : colors.limeSoft,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <NavIcon name={k.icon} size={38} color={good ? colors.status.ok : colors.green} />
                </div>
              </Card>
            );
          })}
        </div>

        {/* ------------------------------------------------ Cartes des déchèteries */}
        <div style={{display: 'flex', gap: 24, marginTop: 24}}>
          {SITE_CARDS.map((site, i) => {
            const delay = 52 + i * 12;
            const p = springAt(frame, fps, delay, springSmooth);
            const gauge = springAt(frame, fps, delay + 16, springSoft, 45);
            return (
              <Card
                key={site.name}
                padding={32}
                style={{
                  flex: 1,
                  height: 588,
                  transform: `translateY(${(1 - p) * 640}px)`,
                }}
              >
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                  <div>
                    <div style={{fontFamily: fonts.title, fontWeight: 800, fontSize: 27, color: colors.text, letterSpacing: -0.4}}>
                      {site.name}
                    </div>
                    <div style={{fontFamily: fonts.body, fontSize: 19, color: colors.textMuted, marginTop: 4}}>
                      {site.commune}
                    </div>
                  </div>
                </div>
                <div style={{marginTop: 14}}>
                  <StatusBadge status={site.status} size={17} />
                </div>

                <div style={{display: 'flex', alignItems: 'center', gap: 26, marginTop: 26}}>
                  <RingGauge size={150} value={site.fill} progress={gauge} color={fillColor(site.fill)} />
                  <div style={{fontFamily: fonts.body, fontSize: 19, color: colors.textMuted, lineHeight: 1.45}}>
                    Remplissage
                    <br />
                    moyen du site
                  </div>
                </div>

                <div style={{marginTop: 26, display: 'flex', flexDirection: 'column', gap: 16}}>
                  {site.flux.map((f, j) => {
                    const fp = springAt(frame, fps, delay + 24 + j * 5, springSoft, 40);
                    return (
                      <div key={f.label}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontFamily: fonts.title,
                            fontSize: 18,
                            marginBottom: 7,
                            color: colors.text,
                          }}
                        >
                          <span style={{fontWeight: 500}}>{f.label}</span>
                          <span style={{fontWeight: 700, fontVariantNumeric: 'tabular-nums'}}>{Math.round(f.fill * fp)} %</span>
                        </div>
                        <ProgressBar progress={fp} value={f.fill} color={fillColor(f.fill)} height={11} />
                      </div>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>
      </AppShell>
    </AbsoluteFill>
  );
};
