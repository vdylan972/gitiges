import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { brand, layout, texts, timeline, typography } from '../config/film.config';
import { KineticText } from '../components/KineticText';
import { Thread } from '../components/Thread';
import { asset, assetExists } from '../lib/assets';
import { bodyFont } from '../lib/fonts';

const Logo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { from, durationInFrames, scaleFrom } = timeline.logoIn;
  const p = spring({ frame: frame - from, fps, config: { damping: 200 }, durationInFrames });
  const { centerY, width } = layout.logo;
  const style: React.CSSProperties = {
    position: 'absolute',
    left: (1080 - width) / 2,
    width,
    top: centerY,
    transform: `translateY(-50%) scale(${scaleFrom + (1 - scaleFrom) * p})`,
    opacity: p,
  };
  if (!assetExists(brand.logo.color)) {
    return (
      <div
        style={{
          ...style,
          height: 200,
          border: `2px dashed ${brand.colors.textDark}`,
          opacity: p * 0.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: bodyFont(),
          fontSize: 26,
          color: brand.colors.textDark,
        }}
      >
        Logo à fournir : public/{brand.logo.color}
      </div>
    );
  }
  return <Img src={asset(brand.logo.color)} style={style} />;
};

/** SCÈNE 5 — Signature sur fond uni de marque. Les dernières frames restent fixes. */
export const Scene5Signature: React.FC = () => {
  const frame = useCurrentFrame();
  const { from, durationInFrames } = timeline.signatureFadeIn;
  if (frame < from) {
    return null;
  }
  const bg = interpolate(frame, [from, from + durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const s5 = timeline.texts.s5;
  const line2Style: React.CSSProperties =
    typography.signatureLine2Style === 'accent' ? { color: brand.colors.accent } : {};
  return (
    <>
      <AbsoluteFill style={{ backgroundColor: brand.colors.background, opacity: bg }} />
      <Thread scene="f5" />
      <Logo />
      <KineticText
        lines={[{ text: texts.s5Line1, from: s5.line1 }]}
        exit={null}
        mode="line"
        centerY={layout.textY.s5Line1}
        variant="brand"
        fontSize={typography.signatureSize}
      />
      <KineticText
        lines={[{ text: texts.s5Line2, from: s5.line2, style: line2Style }]}
        exit={null}
        mode="line"
        centerY={layout.textY.s5Line2}
        variant="brand"
        fontSize={typography.signatureSize}
        fontWeight={typography.signatureLine2Style === 'lighter' ? typography.signatureLine2Weight : undefined}
      />
      {texts.handle ? (
        <KineticText
          lines={[{ text: texts.handle, from: s5.handle }]}
          exit={null}
          mode="line"
          centerY={layout.handleBottomY - typography.handleSize * typography.lineHeight}
          variant="brand"
          fontSize={typography.handleSize}
          fontWeight={400}
        />
      ) : null}
    </>
  );
};
