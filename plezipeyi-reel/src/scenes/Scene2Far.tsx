import React from 'react';
import { layout, texts, timeline } from '../config/film.config';
import { KineticText } from '../components/KineticText';
import { ShotOnTimeline } from '../components/Shot';
import { Thread } from '../components/Thread';
import { shotsOfScene } from '../lib/timeline';

/** SCÈNE 2 — « La vie vous emmène loin » : fondus enchaînés, ralenti léger. */
export const Scene2Far: React.FC = () => (
  <>
    {shotsOfScene('f2').map((s) => (
      <ShotOnTimeline key={s.id} shotId={s.id} />
    ))}
    <Thread scene="f2" />
    <KineticText
      lines={[{ text: texts.s2, from: timeline.texts.s2.from }]}
      exit={timeline.texts.s2.to}
      mode="word"
      centerY={layout.textY.s2}
      variant="video"
    />
  </>
);
