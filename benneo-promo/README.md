# Benneo — vidéo de présentation (Remotion)

Vidéo motion design de 60 s (1920×1080, 30 fps) pour la candidature de Benneo
au Concours Innovation Outre-Mer (CleanTech & Eau).

## Démarrer

```bash
cd benneo-promo
npm install
npm run dev          # ouvre Remotion Studio sur http://localhost:3000
```

Dans le Studio, sélectionnez la composition **BenneoPromo** : la timeline permet
de lire, de parcourir image par image et de voir chaque scène.

## Exporter en MP4

```bash
npm run render                 # → out/benneo-promo.mp4 (H.264, sans musique)
npm run render:music           # → idem, avec public/music.mp3
```

Options utiles :

```bash
npx remotion render BenneoPromo out/benneo.mp4 --crf=12        # qualité supérieure
npx remotion render BenneoPromo out/benneo.mp4 --scale=0.5     # aperçu 960×540 rapide
npx remotion render BenneoPromo out/benneo.mp4 --frames=540-839 # scène 4 seule
npm run still -- --frame=700                                   # image fixe PNG
```

Vous pouvez aussi exporter depuis le Studio : bouton **Render** en haut à droite.

## Musique

1. Déposez votre piste dans `public/music.mp3`.
2. Mettez `ENABLE_MUSIC = true` dans `src/data.ts` (ou utilisez `npm run render:music`).

Le volume (`MUSIC_VOLUME`) monte en fondu au début et descend sur les 2 dernières
secondes. Sans fichier, laissez `ENABLE_MUSIC = false`.

## Modifier le contenu

| Fichier | Rôle |
| --- | --- |
| `src/data.ts` | **Tous les chiffres et textes** : sites, statuts, taux, KPIs, affluence, heatmap, conversation, marché, durées des scènes |
| `src/theme.ts` | Couleurs, polices (Inter, Poppins), rayons, ombres, ressorts d'animation |
| `src/BenneoPromo.tsx` | Composition principale : enchaînement des scènes et transitions |
| `src/scenes/Scene*.tsx` | Une scène par fichier |
| `src/components/` | Interface recréée : sidebar, carte de la Martinique, épingles, jauges, iPhone, logo… |

Les KPIs de la page Sites (nombre de sites, moyenne, sites ≥ 80 %) et les
compteurs de la légende sont calculés à partir de la liste `SITES` : modifiez
un site, tout reste cohérent.

## Storyboard

| # | Temps | Scène | Transition d'entrée |
| --- | --- | --- | --- |
| 1 | 0–5 s | Accroche : logo + signature | — |
| 2 | 5–13 s | Le constat : 4 cartes-problèmes | fondu |
| 3 | 13–18 s | La solution : fusion → écran, Benneo Pro / City | fondu |
| 4 | 18–28 s | Dashboard : carte, 13 épingles, remplissage | fondu (plongée dans l'écran) |
| 5 | 28–35 s | Sites : KPIs + 3 déchèteries | fondu |
| 6 | 35–41 s | Affluence : courbe 7 jours + heatmap | volet |
| 7 | 41–48 s | Assistant IA WhatsApp | glissement |
| 8 | 48–54 s | Le marché | glissement |
| 9 | 54–60 s | Conclusion + https://benneo.io | volet |
