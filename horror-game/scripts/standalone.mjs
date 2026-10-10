import { readFileSync, writeFileSync } from 'node:fs';
const root = new URL('../', import.meta.url);
for (const [input, output] of [['index.html', 'JOUER.html'], ['personnage.html', 'PERSONNAGE.html']]) {
let html = readFileSync(new URL('dist/' + input, root), 'utf8');
// Inline shared chunks as well: the standalone file must not fetch any module.
html = html.replace(/<link rel="modulepreload"[^>]*>/g, '');
html = html.replace(/<script type="module"[^>]*src="([^"]+)"[^>]*><\/script>/g, (_, path) => {
  let js = readFileSync(new URL('dist' + path, root), 'utf8');
  js = js.replace(/import\s*\{([^}]+)\}\s*from\s*["']([^"']+)["'];?/g, (_, bindings, dependency) => {
    let shared = readFileSync(new URL(dependency, new URL('dist' + path, root)), 'utf8');
    const match = shared.match(/export\s*\{([^}]+)\};?\s*$/);
    if (!match) throw new Error('Unsupported shared chunk');
    const symbols = Object.fromEntries(match[1].split(',').map(item => { const [local, exported] = item.trim().split(/\s+as\s+/); return [exported || local, local]; }));
    shared = shared.slice(0, match.index);
    const result = bindings.split(',').map(item => { const [exported, local] = item.trim().split(/\s+as\s+/); return `${local || exported}:${symbols[exported]}`; }).join(',');
    return `const {${bindings.split(',').map(item => { const [exp, local] = item.trim().split(/\s+as\s+/); return `${local || exp}`; }).join(',')}} = (() => {${shared};return {${result}};})();`;
  });
  return `<script type="module">${js.replace(/<\/script/gi, '<\\/script')}</script>`;
});
html = html.replace(/<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g, (_, path) => {
  const css = readFileSync(new URL('dist' + path, root), 'utf8').replace(/@import[^;]+;/g, '');
  return `<style>${css}</style>`;
});
writeFileSync(new URL(output, root), html);
console.log(output + ' créé : ouvrir directement dans un navigateur de bureau.');
}
