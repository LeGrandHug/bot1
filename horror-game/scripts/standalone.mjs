import { readFileSync, writeFileSync } from 'node:fs';
const root = new URL('../', import.meta.url);
let html = readFileSync(new URL('dist/index.html', root), 'utf8');
html = html.replace(/<script type="module"[^>]*src="([^"]+)"[^>]*><\/script>/g, (_, path) => {
  const js = readFileSync(new URL('dist' + path, root), 'utf8');
  return `<script type="module">${js.replace(/<\/script/gi, '<\\/script')}</script>`;
});
html = html.replace(/<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g, (_, path) => {
  const css = readFileSync(new URL('dist' + path, root), 'utf8').replace(/@import[^;]+;/g, '');
  return `<style>${css}</style>`;
});
writeFileSync(new URL('JOUER.html', root), html);
console.log('JOUER.html créé : ouvrir directement dans un navigateur de bureau.');
