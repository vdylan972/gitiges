import React from 'react';
import {Composition} from 'remotion';
import {BenneoPromo, TOTAL_FRAMES} from './BenneoPromo';
import {ENABLE_MUSIC} from './data';
import {VIDEO} from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="BenneoPromo"
    component={BenneoPromo}
    durationInFrames={TOTAL_FRAMES}
    fps={VIDEO.fps}
    width={VIDEO.width}
    height={VIDEO.height}
    defaultProps={{withMusic: ENABLE_MUSIC}}
  />
);
