import { getLength } from '@remotion/paths';
import React, { useMemo } from 'react';
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from 'remotion';
import { brand, options, thread, timeline, video, type SceneId } from '../config/film.config';
import { pointOnScreen } from '../lib/phone-geometry';
import { shotsOfScene } from '../lib/timeline';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const ease = Easing.bezier(0.45, 0, 0.25, 1);

/** Segment de tracé : `tail` → `head` (0 → 1 le long du chemin). */
const Stroke: React.FC<{ d: string; head: number; tail?: number; opacity: number }> = ({
  d,
  head,
  tail = 0,
  opacity,
}) => {
  const length = useMemo(() => getLength(d), [d]);
  const visible = Math.max(0, head - tail) * length;
  if (visible <= 0.5 || opacity <= 0) {
    return null;
  }
  return (
    <path
      d={d}
      fill="none"
      stroke={thread.color ?? brand.colors.accent}
      strokeWidth={thread.strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={`${visible} ${length + 10}`}
      strokeDashoffset={-tail * length}
      opacity={Math.min(opacity, thread.maxOpacity)}
    />
  );
};

const range = (frame: number, input: [number, number], easing = ease) =>
  interpolate(frame, input, [0, 1], { ...clamp, easing });

// F1 — fragments nerveux, brisés, renouvelés à chaque cut.
const SceneOneThread: React.FC<{ frame: number }> = ({ frame }) => {
  const cfg = thread.f1;
  const shot = shotsOfScene('f1').find((s) => frame >= s.from && frame < s.from + s.durationInFrames);
  if (!shot) {
    return null;
  }
  return (
    <>
      {Array.from({ length: cfg.fragmentsPerCut }).map((_, k) => {
        const r = (n: number) => random(`thread-${shot.id}-${k}-${n}`);
        let x = 90 + r(0) * 760;
        let y = cfg.bandTop + r(1) * (cfg.bandBottom - cfg.bandTop);
        let d = `M ${x.toFixed(1)} ${y.toFixed(1)}`;
        const points = 3 + Math.floor(r(2) * 2);
        for (let p = 0; p < points; p++) {
          x += 45 + r(10 + p) * 90;
          y += (r(20 + p) - 0.5) * 90;
          d += ` L ${Math.min(x, video.width - 40).toFixed(1)} ${y.toFixed(1)}`;
        }
        const start = shot.from + k;
        return (
          <Stroke
            key={k}
            d={d}
            head={range(frame, [start, start + cfg.drawFrames], Easing.out(Easing.quad))}
            opacity={cfg.opacity}
          />
        );
      })}
    </>
  );
};

// F2 — une seule courbe horizontale qui s'étire lentement.
const SceneTwoThread: React.FC<{ frame: number }> = ({ frame }) => {
  const c = thread.f2;
  const d = `M -40 ${c.y} C 300 ${c.y + c.sag}, 780 ${c.y - c.sag * 0.4}, ${video.width + 40} ${c.y}`;
  const opacity =
    c.opacity *
    interpolate(frame, [c.drawFrom, c.drawFrom + 8, c.fadeOutFrom, c.fadeOutTo], [0, 1, 1, 0], clamp);
  return <Stroke d={d} head={range(frame, [c.drawFrom, c.drawTo])} opacity={opacity} />;
};

// F3 — une courbe souple d'un bord à l'autre à chaque transition.
const SceneThreeThread: React.FC<{ frame: number }> = ({ frame }) => {
  const c = thread.f3;
  return (
    <>
      {shotsOfScene('f3').map((shot, i) => {
        const t = shot.from;
        if (frame < t - c.before || frame > t + c.after) {
          return null;
        }
        const ltr = i % 2 === 0;
        const x0 = ltr ? -40 : video.width + 40;
        const x1 = ltr ? video.width + 40 : -40;
        const cx = (v: number) => (ltr ? v : video.width - v);
        const d = `M ${x0} ${c.y + c.amplitude * 0.4} C ${cx(360)} ${c.y + c.amplitude}, ${cx(720)} ${c.y - c.amplitude}, ${x1} ${c.y - c.amplitude * 0.3}`;
        return (
          <Stroke
            key={shot.id}
            d={d}
            head={range(frame, [t - c.before, t + c.after * 0.55])}
            tail={range(frame, [t - c.before * 0.3, t + c.after])}
            opacity={c.opacity}
          />
        );
      })}
    </>
  );
};

// F4 — part de l'écran, sort par le haut ; réapparaît par le haut du plan de la porte.
const SceneFourThread: React.FC<{ frame: number }> = ({ frame }) => {
  const c = thread.f4;
  const validate = timeline.phone.screens.find((s) => s.tap.frame === timeline.phone.validateFrame)?.tap ?? {
    x: 0.5,
    y: 0.86,
  };
  const p = pointOnScreen(validate.x, validate.y);
  const exitPath = `M ${p.x} ${p.y} C ${p.x + 30} ${p.y - 260}, ${p.x + 190} ${p.y - 480}, ${p.x + 150} -60`;
  const rx = c.reenterX;
  const reenterPath = `M ${rx} -40 C ${rx - 20} 160, ${rx - 170} ${c.reenterDepth * 0.6}, ${rx - 140} ${c.reenterDepth}`;
  const exitSpan = c.exitTo - c.exitFrom;
  const reSpan = c.reenterTo - c.reenterFrom;
  return (
    <>
      {frame >= c.exitFrom && frame < timeline.phone.to ? (
        <Stroke
          d={exitPath}
          head={range(frame, [c.exitFrom, c.exitFrom + exitSpan * 0.7], Easing.in(Easing.quad))}
          tail={range(frame, [c.exitFrom + exitSpan * 0.35, c.exitTo], Easing.in(Easing.quad))}
          opacity={c.opacity}
        />
      ) : null}
      {frame >= c.reenterFrom && frame <= c.reenterTo ? (
        <Stroke
          d={reenterPath}
          head={range(frame, [c.reenterFrom, c.reenterFrom + reSpan * 0.6], Easing.out(Easing.quad))}
          tail={range(frame, [c.reenterFrom + reSpan * 0.35, c.reenterTo])}
          opacity={c.opacity}
        />
      ) : null}
    </>
  );
};

// F5 — se referme en une courbe qui souligne le logo, puis se fond dedans.
const SceneFiveThread: React.FC<{ frame: number }> = ({ frame }) => {
  const c = thread.f5;
  const cx = video.width / 2;
  const uy = c.underlineY;
  const hw = c.underlineHalfWidth;
  const d = `M -40 ${uy + 220} C 160 ${uy + 200}, ${cx - hw - 120} ${uy + 4}, ${cx - hw} ${uy} C ${cx - hw / 2} ${uy - 6}, ${cx + hw / 2} ${uy + 10}, ${cx + hw} ${uy}`;
  const opacity = c.opacity * interpolate(frame, [c.fadeFrom, c.fadeTo], [1, 0], clamp);
  return <Stroke d={d} head={range(frame, [c.drawFrom, c.drawTo])} opacity={opacity} />;
};

const byScene: Record<SceneId, React.FC<{ frame: number }>> = {
  f1: SceneOneThread,
  f2: SceneTwoThread,
  f3: SceneThreeThread,
  f4: SceneFourThread,
  f5: SceneFiveThread,
};

/** Le fil conducteur (frames absolues, à rendre hors <Sequence>). */
export const Thread: React.FC<{ scene: SceneId }> = ({ scene }) => {
  const frame = useCurrentFrame();
  if (!options.enableThread) {
    return null;
  }
  const Part = byScene[scene];
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <svg
        width={video.width}
        height={video.height}
        viewBox={`0 0 ${video.width} ${video.height}`}
        style={{
          overflow: 'visible',
          filter: `drop-shadow(0 0 ${thread.glow}px ${thread.color ?? brand.colors.accent})`,
        }}
      >
        <Part frame={frame} />
      </svg>
    </AbsoluteFill>
  );
};
