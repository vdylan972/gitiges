# PleziPeyi — Reel « Soyez là quand ça compte »

Reel Instagram en motion design, construit avec [Remotion](https://www.remotion.dev) (React + TypeScript).
1080 × 1920, 30 fps, 25 s (750 frames). Export H.264 CRF 18, yuv420p, audio AAC 320 kbps.

Tout est piloté par **`src/config/film.config.ts`** : textes, timeline, plans (chemin, description, recadrage, vitesse),
couleurs, polices, étalonnage, fil, sons, options. Les composants ne contiennent aucune valeur éditoriale.

## Démarrer

```bash
npm install
npm run check-assets     # assets présents / manquants
npm run check-timeline   # durée, lisibilité des textes, règles éditoriales
npx remotion studio      # prévisualisation (ou npm run dev)
```

Les assets manquants n'interrompent jamais le rendu : un placeholder gris (#2A2A2A) affiche le nom du plan attendu,
sa description et le chemin du fichier. Le rythme du montage se valide avant d'avoir les rushes.

## Exporter

| Commande | Sortie |
| --- | --- |
| `npm run render` | `out/plezipeyi-reel-v1.mp4` (avec musique) |
| `npm run render:nomusic` | `out/plezipeyi-reel-v1-nomusic.mp4` (sons seuls) |
| `npm run render:safezones` | `out/plezipeyi-reel-v1-safezones.mp4` (contrôle, zones de sécurité en rouge) |
| `npm run render:cover` | `out/cover-1080x1920.png` |
| `npm run render:stills` | `out/stills/` (frames 45, 165, 330, 470, 610, 735) + `out/stills/safezones/` |
| `npm run render:all` | tout ce qui précède, après les vérifications |

Si Remotion ne peut pas télécharger Chrome Headless Shell (réseau filtré), pointez un Chromium local :
`REMOTION_BROWSER_EXECUTABLE=/chemin/vers/chrome-headless-shell npm run render`.

## Où déposer les fichiers

```
public/assets/brand/      logo-color.svg, logo-white.svg, fonts/
public/assets/video/f1/   f1-01.mp4 … f1-06.mp4
public/assets/video/f2/   f2-01.mp4 … f2-05.mp4
public/assets/video/f3/   f3-01.mp4 … f3-04.mp4
public/assets/video/f4/   f4-hands-phone.mp4, f4-arrival.mp4, f4-door.mp4, f4-reveal.mp4, f4-reaction.mp4
public/assets/ui/         screen-catalog.png, screen-product.png, screen-confirm.png, phone-frame.png
public/assets/audio/      music.mp3, sfx/{cash-beep,washer,keys,whoosh,gate,unwrap,ambience-mq}.mp3
```

Les noms et extensions sont modifiables dans la config (`shots`, `ui`, `music`, `sfx`).

## Réglages fréquents (film.config.ts)

- **Couleurs** : `brand.colors` (valeurs provisoires, marquées « À REMPLACER PAR LA CHARTE OFFICIELLE »).
- **Polices** : `fonts.files` + `fonts.title` / `fonts.body`. DM Sans (OFL) est embarquée à titre provisoire.
- **Recadrage d'un rush** : `focalX` / `focalY` du plan (0 → 1). Point d'entrée : `inPoint` (secondes).
- **Synchro musique** : `music.bpm` + `music.firstBeatFrame`, ou `music.beatFrames` saisis à la main.
  Les cuts de la scène 1 se calent sur le temps le plus proche (± `snapTolerance` frames).
  Les sons de F1 sont ancrés sur les plans et suivent ce recalage.
- **Volume musique** : `music.volumeCurve` (paires `[frame, volume]`, toujours interpolées).
- **Mockup téléphone** : `ui.phone` (largeur, ratio, position de l'écran dans `phone-frame.png`) et
  positions des taps dans `timeline.phone.screens`. À ajuster une fois les captures et le mockup fournis.
- **Fil** : `thread` (zones verticales par scène, à ajuster pour ne jamais passer sur un visage).
- **Options** : `options.enableThread`, `options.showSafeZones`, `options.musicVolume`, `options.sfxVolume`.
- **Handle Instagram / URL** : `texts.handle` (vide = rien n'est affiché).

## Structure

```
src/config/film.config.ts   configuration complète
src/scenes/                 Scene1Rush, Scene2Far, Scene3Close, Scene4Gesture, Scene5Signature
src/components/             Shot, KineticText, Thread, PhoneUI, Placeholder, SafeZoneOverlay, Soundtrack
src/lib/                    timeline (recalage BPM), étalonnage, assets, polices
scripts/                    check-assets, check-timeline, render-stills
```
