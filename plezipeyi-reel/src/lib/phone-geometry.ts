import { ui, video } from '../config/film.config';

/** Rectangles du mockup et de son écran, en px du film. */
export const phoneGeometry = () => {
  const { width, centerY, aspect, screen } = ui.phone;
  const height = width * aspect;
  const left = (video.width - width) / 2;
  const top = centerY - height / 2;
  const screenRect = {
    left: left + screen.left * width,
    top: top + screen.top * height,
    width: screen.width * width,
    height: screen.height * height,
  };
  return { frame: { left, top, width, height }, screen: screenRect };
};

export const pointOnScreen = (x: number, y: number) => {
  const { screen } = phoneGeometry();
  return { x: screen.left + x * screen.width, y: screen.top + y * screen.height };
};
