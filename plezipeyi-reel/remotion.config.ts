/**
 * Réglages de rendu CLI (npx remotion render / still / studio).
 * Export : H.264, CRF 18, yuv420p, audio AAC 320 kbps.
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from '@remotion/cli/config';

Config.setRspack(true);
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
Config.setDefaultPremountInSeconds(2);

Config.setCodec('h264');
Config.setCrf(18);
Config.setPixelFormat('yuv420p');
Config.setColorSpace('bt709');
Config.setAudioCodec('aac');
Config.setAudioBitrate('320k');
// Piste audio toujours présente (même silencieuse) pour Instagram.
Config.setEnforceAudioTrack(true);

// Navigateur local optionnel (ex. environnement sans accès au téléchargement de Chrome).
if (process.env.REMOTION_BROWSER_EXECUTABLE) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER_EXECUTABLE);
}
