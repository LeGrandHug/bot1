# Les ombres du château

Prototype de jeu d’horreur 3D pour navigateur de bureau, développé avec Three.js et Vite. Cour de château abandonné, personnage à la troisième personne, zombies par vagues, pistolet, points de vie et sons synthétisés. Aucun compte ni secret requis.

## Jouer sans installation

Télécharger `JOUER.html` avec le bouton de téléchargement du fichier sur GitHub, puis double-cliquer sur le fichier téléchargé. Utiliser Chrome, Edge ou Firefox sur ordinateur. Aucun terminal, serveur ou installation Node.js nécessaire. Le fichier embarque le jeu et fonctionne sans connexion Internet.

Pour régénérer ce fichier après une modification du jeu : `npm run build:standalone`.

## Développer et lancer avec Vite

```sh
cd /workspace/bot1/horror-game
npm ci --cache /tmp/horror-npm-cache --no-audit --no-fund
npm run dev
```

Ouvrir le serveur Vite dans un navigateur disposant de WebGL puis cliquer sur « Entrer dans le château ». Le jeu capture la souris. Échap met la partie en pause et libère la souris.

- ZQSD ou WASD : déplacement
- Souris : caméra
- Clic droit maintenu : visée
- Clic gauche : tir
- Maj gauche : sprint
- R : rechargement (1,5 seconde)

Deux impacts éliminent un zombie ; un tir à la tête suffit. Les vagues augmentent en nombre et en vitesse. Les munitions de réserve sont illimitées. Après la mort, le bouton permet de recommencer.

## Validation

`npm run build` génère `dist/`. Le lancement, le tir et le rechargement ont été vérifiés dans Chromium. Le personnage principal est un modèle procédural détaillé inspiré de la référence fournie, avec vêtements texturés, visage, cheveux, équipement et articulations animées. Il reste stylisé, et ne reproduit pas le photoréalisme de la référence. Les zombies et le château restent les modèles simples du prototype. Il ne comprend pas de sauvegarde ou de commandes tactiles.

Le bot Discord situé à la racine du dépôt reste indépendant du jeu.

## Personnage 3D

Télécharger `PERSONNAGE.html` et l’ouvrir dans un navigateur pour examiner le modèle à 360°, zoomer et tester les poses de marche et de visée. Le bouton d’export produit un fichier GLB avec géométrie, matériaux et textures intégrés.

Le modèle exporté est aussi disponible directement dans `models/survivant.glb`, importable dans Blender ou un moteur 3D. C’est un assemblage de maillages avec pivots nommés, sans squelette déformant ni animations enregistrées dans le GLB ; les animations de jeu sont pilotées par `src/character.js`. Aucun modèle tiers n’a été utilisé. La visionneuse et le jeu restent autonomes et ne nécessitent aucun serveur.

Pour développer la visionneuse avec Vite : ouvrir `/personnage.html`. `npm run build:standalone` reconstruit les deux fichiers autonomes.
