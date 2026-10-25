import React from 'react';
import { layout, texts, timeline } from '../config/film.config';
import { KineticText } from '../components/KineticText';
import { ShotOnTimeline } from '../components/Shot';
import { Thread } from '../components/Thread';
import { shotsOfScene } from '../lib/timeline';

/** SCÈNE 1 — « La vie va vite » : cuts secs sur les temps. */
export const Scene1Rush: React.FC = () => (
  <>
    {shotsOfScene('f1').map((s) => (
      <ShotOnTimeline key={s.id} shotId={s.id} />
    ))}
    <Thread scene="f1" />
    <KineticText
      lines={[{ text: texts.s1, from: timeline.texts.s1.from }]}
      exit={timeline.texts.s1.to}
      mode="word"
      centerY={layout.textY.s1}
      variant="video"
    />
  </>
);
