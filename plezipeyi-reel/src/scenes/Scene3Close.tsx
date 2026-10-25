import React from 'react';
import { layout, texts, timeline } from '../config/film.config';
import { KineticText } from '../components/KineticText';
import { ShotOnTimeline } from '../components/Shot';
import { Thread } from '../components/Thread';
import { shotsOfScene } from '../lib/timeline';

/** SCÈNE 3 — « Certaines personnes ne sont jamais vraiment loin » : réchauffement progressif. */
export const Scene3Close: React.FC = () => (
  <>
    {shotsOfScene('f3').map((s) => (
      <ShotOnTimeline key={s.id} shotId={s.id} />
    ))}
    <Thread scene="f3" />
    <KineticText
      lines={[
        { text: texts.s3Line1, from: timeline.texts.s3.line1 },
        { text: texts.s3Line2, from: timeline.texts.s3.line2 },
      ]}
      exit={timeline.texts.s3.to}
      mode="line"
      centerY={layout.textY.s3}
      variant="video"
    />
  </>
);
