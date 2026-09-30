import React from 'react';
import {AbsoluteFill, Audio, interpolate, staticFile, useVideoConfig} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';
import {MUSIC_VOLUME, SCENE_SECONDS, TRANSITION_FRAMES} from './data';
import {colors, easeInOut} from './theme';
import {Scene1Hook} from './scenes/Scene1Hook';
import {Scene2Problem} from './scenes/Scene2Problem';
import {Scene3Solution} from './scenes/Scene3Solution';
import {Scene4Dashboard} from './scenes/Scene4Dashboard';
import {Scene5Sites} from './scenes/Scene5Sites';
import {Scene6Affluence} from './scenes/Scene6Affluence';
import {Scene7Assistant} from './scenes/Scene7Assistant';
import {Scene8Market} from './scenes/Scene8Market';
import {Scene9Outro} from './scenes/Scene9Outro';

export type BenneoPromoProps = {
  /** Active la piste public/music.mp3 */
  withMusic: boolean;
};

const FPS = 30;
const T = TRANSITION_FRAMES;
const timing = linearTiming({durationInFrames: T, easing: easeInOut});

// Les transitions chevauchent deux scènes : chaque scène (sauf la dernière)
// dure T images de plus, pour que les scènes démarrent aux temps du storyboard.
const d = (seconds: number, last = false) => Math.round(seconds * FPS) + (last ? 0 : T);

export const TOTAL_FRAMES = Object.values(SCENE_SECONDS).reduce((s, x) => s + Math.round(x * FPS), 0);

const Music: React.FC = () => {
  const {durationInFrames} = useVideoConfig();
  return (
    <Audio
      src={staticFile('music.mp3')}
      volume={(f) =>
        interpolate(f, [0, 20, durationInFrames - 60, durationInFrames], [0, MUSIC_VOLUME, MUSIC_VOLUME, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      }
    />
  );
};

export const BenneoPromo: React.FC<BenneoPromoProps> = ({withMusic}) => {
  return (
    <AbsoluteFill style={{background: colors.bg}}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={d(SCENE_SECONDS.hook)}>
          <Scene1Hook />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={timing} />

        <TransitionSeries.Sequence durationInFrames={d(SCENE_SECONDS.problem)}>
          <Scene2Problem />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={timing} />

        <TransitionSeries.Sequence durationInFrames={d(SCENE_SECONDS.solution)}>
          <Scene3Solution />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={timing} />

        <TransitionSeries.Sequence durationInFrames={d(SCENE_SECONDS.dashboard)}>
          <Scene4Dashboard />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={timing} />

        <TransitionSeries.Sequence durationInFrames={d(SCENE_SECONDS.sites)}>
          <Scene5Sites />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({direction: 'from-right'})} timing={timing} />

        <TransitionSeries.Sequence durationInFrames={d(SCENE_SECONDS.affluence)}>
          <Scene6Affluence />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({direction: 'from-right'})} timing={timing} />

        <TransitionSeries.Sequence durationInFrames={d(SCENE_SECONDS.assistant)}>
          <Scene7Assistant />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({direction: 'from-bottom'})} timing={timing} />

        <TransitionSeries.Sequence durationInFrames={d(SCENE_SECONDS.market)}>
          <Scene8Market />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({direction: 'from-left'})} timing={timing} />

        <TransitionSeries.Sequence durationInFrames={d(SCENE_SECONDS.outro, true)}>
          <Scene9Outro />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {withMusic ? <Music /> : null}
    </AbsoluteFill>
  );
};
