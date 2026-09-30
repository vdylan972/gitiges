import React from 'react';
import {AbsoluteFill, interpolate, interpolateColors, useCurrentFrame, useVideoConfig} from 'remotion';
import {AppShell} from '../components/AppShell';
import {Card, Counter, PageHeader} from '../components/ui';
import {ease, springAt} from '../components/anim';
import {DAILY_VISITS, HEATMAP, HEATMAP_DAYS, HEATMAP_HOURS} from '../data';
import {colors, easeInOut, fonts, radius, springBouncy, springSoft} from '../theme';

// ------------------------------------------------------------ Courbe
const CHART_W = 700;
const CHART_H = 440;
const Y_MIN = 200;
const Y_MAX = 600;
const Y_TICKS = [200, 300, 400, 500, 600];
const LINE_START = 18;
const LINE_END = 78;

const xAt = (i: number) => 20 + (i / (DAILY_VISITS.length - 1)) * (CHART_W - 40);
const yAt = (v: number) => CHART_H - ((v - Y_MIN) / (Y_MAX - Y_MIN)) * CHART_H;

const linePath = () => {
  const pts = DAILY_VISITS.map((d, i) => ({x: xAt(i), y: yAt(d.visits)}));
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    const mx = (a.x + b.x) / 2;
    d += ` C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`;
  }
  return d;
};

// ------------------------------------------------------------ Heatmap
const MAX_HEAT = Math.max(...HEATMAP.flat());
const heatColor = (v: number) =>
  v === 0
    ? '#F1F3EE'
    : interpolateColors(v / MAX_HEAT, [0, 0.35, 0.7, 1], ['#EEF6DA', colors.lime, '#5E9A5A', colors.green]);

// Rang de chaque case (ordre croissant de valeur) : les cases claires se
// colorent d'abord, les plus foncées en dernier.
const HEAT_RANK = (() => {
  const cells = HEATMAP.flatMap((row, r) => row.map((v, c) => ({v, r, c})));
  const sorted = [...cells].sort((a, b) => a.v - b.v || a.r - b.r || a.c - b.c);
  const rank: number[][] = HEATMAP.map((row) => row.map(() => 0));
  sorted.forEach((cell, i) => {
    rank[cell.r][cell.c] = i;
  });
  return {rank, total: cells.length};
})();
const HEAT_START = 66;
const HEAT_SPAN = 84;

/**
 * Scène 6 — Affluence (35-41 s)
 */
export const Scene6Affluence: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const leftCard = springAt(frame, fps, 6, springSoft);
  const rightCard = springAt(frame, fps, 16, springSoft);
  const draw = ease(frame, LINE_START, LINE_END, easeInOut);
  const total = DAILY_VISITS.reduce((s, d) => s + d.visits, 0);
  const peakIdx = DAILY_VISITS.reduce((best, d, i) => (d.visits > DAILY_VISITS[best].visits ? i : best), 0);
  const peak = DAILY_VISITS[peakIdx];
  const peakP = springAt(frame, fps, LINE_END - 4, springBouncy);

  return (
    <AbsoluteFill>
      <AppShell activeFrom={1} activeTo={4} switchAt={2}>
        <PageHeader title="Affluence" subtitle="Fréquentation de la semaine · toutes déchèteries" start={4} />

        <div style={{display: 'flex', gap: 24, marginTop: 26}}>
          {/* ------------------------------------------------ Courbe journalière */}
          <Card
            padding={36}
            style={{width: 800, height: 790, opacity: leftCard, transform: `translateY(${(1 - leftCard) * 50}px)`}}
          >
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
              <div>
                <div style={{fontFamily: fonts.title, fontWeight: 800, fontSize: 28, color: colors.text}}>
                  Évolution journalière
                </div>
                <div style={{fontFamily: fonts.body, fontSize: 19, color: colors.textSoft, marginTop: 6}}>
                  Visites par jour · 7 derniers jours
                </div>
              </div>
              <div style={{textAlign: 'right'}}>
                <Counter
                  value={total}
                  start={14}
                  duration={60}
                  style={{fontFamily: fonts.title, fontWeight: 800, fontSize: 46, color: colors.green, letterSpacing: -1}}
                />
                <div style={{fontFamily: fonts.body, fontSize: 17, color: colors.textSoft}}>visites cette semaine</div>
              </div>
            </div>

            <div style={{position: 'relative', marginTop: 56, marginLeft: 20}}>
              <svg width={CHART_W} height={CHART_H + 50} style={{overflow: 'visible'}}>
                <defs>
                  <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={colors.lime} stopOpacity={0.55} />
                    <stop offset="100%" stopColor={colors.lime} stopOpacity={0} />
                  </linearGradient>
                  <clipPath id="reveal">
                    <rect x={0} y={-40} width={CHART_W * draw + 4} height={CHART_H + 80} />
                  </clipPath>
                </defs>
                {Y_TICKS.map((t) => (
                  <g key={t}>
                    <line x1={0} x2={CHART_W} y1={yAt(t)} y2={yAt(t)} stroke={colors.border} strokeWidth={1.5} strokeDasharray="6 8" />
                    <text x={-14} y={yAt(t)} textAnchor="end" dominantBaseline="central" fontFamily={fonts.body} fontSize={16} fill={colors.textSoft}>
                      {t}
                    </text>
                  </g>
                ))}
                <path d={`${linePath()} L ${xAt(6)} ${CHART_H} L ${xAt(0)} ${CHART_H} Z`} fill="url(#area)" clipPath="url(#reveal)" />
                <path
                  d={linePath()}
                  fill="none"
                  stroke={colors.green}
                  strokeWidth={5}
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - draw}
                />
                {DAILY_VISITS.map((d, i) => {
                  const at = LINE_START + (i / 6) * (LINE_END - LINE_START);
                  const p = springAt(frame, fps, at, springBouncy);
                  const isPeak = i === peakIdx;
                  return (
                    <g key={d.day}>
                      <circle
                        cx={xAt(i)}
                        cy={yAt(d.visits)}
                        r={(isPeak ? 11 : 8) * p}
                        fill={isPeak ? colors.lime : colors.white}
                        stroke={colors.green}
                        strokeWidth={4}
                      />
                      <text
                        x={xAt(i)}
                        y={CHART_H + 36}
                        textAnchor="middle"
                        fontFamily={fonts.title}
                        fontWeight={isPeak ? 800 : 500}
                        fontSize={19}
                        fill={isPeak ? colors.green : colors.textMuted}
                      >
                        {d.day}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Info-bulle du pic */}
              <div
                style={{
                  position: 'absolute',
                  left: xAt(peakIdx),
                  top: yAt(peak.visits) - 24,
                  transform: `translate(-50%, -100%) scale(${peakP})`,
                  transformOrigin: 'bottom center',
                  background: colors.green,
                  color: colors.white,
                  borderRadius: 16,
                  padding: '12px 18px',
                  fontFamily: fonts.title,
                  whiteSpace: 'nowrap',
                  textAlign: 'center',
                }}
              >
                <div style={{fontSize: 15, color: colors.lime, fontWeight: 600}}>Pic · {peak.day}</div>
                <div style={{fontSize: 26, fontWeight: 800}}>{peak.visits} visites</div>
              </div>
            </div>
          </Card>

          {/* ------------------------------------------------ Heatmap */}
          <Card
            padding={36}
            style={{flex: 1, height: 790, opacity: rightCard, transform: `translateY(${(1 - rightCard) * 50}px)`}}
          >
            <div style={{fontFamily: fonts.title, fontWeight: 800, fontSize: 28, color: colors.text}}>Affluence par heure</div>
            <div style={{fontFamily: fonts.body, fontSize: 19, color: colors.textSoft, marginTop: 6}}>
              Visites moyennes par créneau
            </div>

            <div style={{marginTop: 44}}>
              <div style={{display: 'flex', marginLeft: 64, marginBottom: 10}}>
                {HEATMAP_HOURS.map((h) => (
                  <div
                    key={h}
                    style={{width: 50, textAlign: 'center', fontFamily: fonts.body, fontSize: 15, color: colors.textSoft}}
                  >
                    {h % 2 === 1 ? `${h}h` : ''}
                  </div>
                ))}
              </div>
              {HEATMAP.map((row, r) => (
                <div key={r} style={{display: 'flex', alignItems: 'center', marginBottom: 6}}>
                  <div
                    style={{
                      width: 64,
                      fontFamily: fonts.title,
                      fontWeight: 600,
                      fontSize: 18,
                      color: colors.textMuted,
                    }}
                  >
                    {HEATMAP_DAYS[r]}
                  </div>
                  {row.map((v, c) => {
                    const at = HEAT_START + (HEAT_RANK.rank[r][c] / HEAT_RANK.total) * HEAT_SPAN;
                    const p = ease(frame, at, at + 10);
                    return (
                      <div
                        key={c}
                        style={{
                          width: 44,
                          height: 44,
                          marginRight: 6,
                          borderRadius: 10,
                          background: interpolateColors(p, [0, 1], [colors.track, heatColor(v)]),
                          transform: `scale(${interpolate(p, [0, 0.6, 1], [0.8, 1.08, 1])})`,
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Légende */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                marginTop: 34,
                marginLeft: 64,
                fontFamily: fonts.body,
                fontSize: 16,
                color: colors.textSoft,
                opacity: ease(frame, 40, 60),
              }}
            >
              Faible
              <div
                style={{
                  width: 260,
                  height: 14,
                  borderRadius: radius.pill,
                  background: `linear-gradient(90deg, #EEF6DA, ${colors.lime}, #5E9A5A, ${colors.green})`,
                }}
              />
              Forte
            </div>
          </Card>
        </div>
      </AppShell>
    </AbsoluteFill>
  );
};
