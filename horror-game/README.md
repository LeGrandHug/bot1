# Les ombres du château

Prototype de jeu d’horreur 3D pour navigateur de bureau, développé avec Three.js et Vite. Cour de château abandonné, personnage à la troisième personne, zombies par vagues, pistolet, points de vie et sons synthétisés. Aucun compte ni secret requis.

## Lancer

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

`npm run build` génère `dist/`. Le lancement, le tir et le rechargement ont été vérifiés dans Chromium. Ce prototype utilise des personnages et un décor géométriques ; il ne comprend pas de modèles animés réalistes, de sauvegarde ou de commandes tactiles.

Le bot Discord situé à la racine du dépôt reste indépendant du jeu.
