import React from 'react';
import { PhoneUI } from '../components/PhoneUI';
import { ShotOnTimeline } from '../components/Shot';
import { Thread } from '../components/Thread';
import { shotsOfScene } from '../lib/timeline';

/**
 * SCÈNE 4 — Le geste. A : l'envoi (téléphone sur fond flouté).
 * B : l'arrivée. Aucun texte écran.
 */
export const Scene4Gesture: React.FC = () => (
  <>
    {shotsOfScene('f4').map((s) => (
      <ShotOnTimeline key={s.id} shotId={s.id} />
    ))}
    <PhoneUI />
    <Thread scene="f4" />
  </>
);
