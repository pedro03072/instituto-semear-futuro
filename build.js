/*
 * build.js — gera a versão de produção do site na pasta dist/.
 *
 *   npm run build
 *
 * O que faz:
 *  1. CSS: resolve os @import das 7 camadas e minifica em um único arquivo.
 *  2. JS: junta os módulos na ordem declarada em html/index.html e minifica
 *     em um único arquivo (1 requisição em vez de 20).
 *  3. Mantém separados o tema.js (precisa rodar antes da pintura) e o Chart.js (já minificado).
 *  4. Imagens: otimiza os SVG com SVGO e copia WebP e PNG (já comprimidos na origem).
 *  5. HTML: gera dist/index.html com os novos caminhos e minifica com html-minifier-terser.
 *  6. Mostra o tamanho antes e depois.
 */
const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');
const { minify: minificarHtml } = require('html-minifier-terser');
const { optimize: otimizarSvg } = require('svgo');

const RAIZ = __dirname;
const DIST = path.join(RAIZ, 'dist');
const ASSETS = path.join(DIST, 'assets');

const kb = (bytes) => (bytes / 1024).toFixed(1) + ' KB';
const tamanho = (arquivos) => arquivos.reduce((t, a) => t + fs.statSync(a).size, 0);

async function main() {
  // 0) limpa a pasta de saída
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(ASSETS, { recursive: true });

  const html = fs.readFileSync(path.join(RAIZ, 'html/index.html'), 'utf8');

  // 1) CSS — esbuild segue os @import e minifica
  const cssOrigem = fs.readdirSync(path.join(RAIZ, 'css')).map((f) => path.join(RAIZ, 'css', f));
  await esbuild.build({
    entryPoints: [path.join(RAIZ, 'css/style.css')],
    bundle: true,
    minify: true,
    outfile: path.join(ASSETS, 'estilo.min.css'),
    logLevel: 'error'
  });

  // 2) JS — lê a ordem dos <script defer> do HTML (a mesma ordem de dependência)
  const scripts = [...html.matchAll(/<script src="\.\.\/(js\/[^"]+)" defer><\/script>/g)].map((m) => m[1]);
  const modulos = scripts.filter((s) => !s.startsWith('js/lib/'));
  const codigo = modulos
    .map((s) => `/* ${s} */\n` + fs.readFileSync(path.join(RAIZ, s), 'utf8'))
    .join('\n;\n')
    .replace(/\.\.\/imagens\//g, 'imagens/'); // no dist o index.html fica na raiz

  const js = await esbuild.transform(codigo, { minify: true, target: 'es2019', legalComments: 'none' });
  fs.writeFileSync(path.join(ASSETS, 'app.min.js'), js.code);

  const tema = await esbuild.transform(fs.readFileSync(path.join(RAIZ, 'js/components/tema.js'), 'utf8'), { minify: true, target: 'es2019' });
  fs.writeFileSync(path.join(ASSETS, 'tema.min.js'), tema.code);

  fs.copyFileSync(path.join(RAIZ, 'js/lib/chart.umd.min.js'), path.join(ASSETS, 'chart.umd.min.js'));

  // 3) Imagens (JPG não é usado pelas páginas, então fica de fora)
  fs.mkdirSync(path.join(DIST, 'imagens'));
  const imgsOrigem = [];
  for (const img of fs.readdirSync(path.join(RAIZ, 'imagens'))) {
    const origem = path.join(RAIZ, 'imagens', img);
    const destino = path.join(DIST, 'imagens', img);
    if (img.endsWith('.svg')) {
      // SVGO remove metadados, comentários e casas decimais desnecessárias
      const { data } = otimizarSvg(fs.readFileSync(origem, 'utf8'), { multipass: true, path: origem });
      fs.writeFileSync(destino, data);
      imgsOrigem.push(origem);
    } else if (/\.(webp|png)$/.test(img)) {
      fs.copyFileSync(origem, destino);
      imgsOrigem.push(origem);
    }
  }

  // 4) HTML de produção
  let saida = html
    .replace(/\s*<!--[\s\S]*?-->/g, '')                                   // remove comentários
    .replace(/\s*<script src="\.\.\/js\/[^"]+" defer><\/script>/g, '')     // remove os 20 scripts
    .replace('<script src="../js/components/tema.js"></script>', '<script src="assets/tema.min.js"></script>')
    .replace('<link rel="stylesheet" href="../css/style.css">',
      '<link rel="stylesheet" href="assets/estilo.min.css">\n  <script src="assets/app.min.js" defer></script>')
    .replace('content="../js/lib/chart.umd.min.js"', 'content="assets/chart.umd.min.js"')
    .replace(/\.\.\/imagens\//g, 'imagens/');
  const htmlAntes = Buffer.byteLength(html);
  saida = await minificarHtml(saida, {
    collapseWhitespace: true,
    conservativeCollapse: true,   // mantém um espaço onde o texto depende dele
    removeComments: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
    minifyCSS: true,
    minifyJS: true
  });
  fs.writeFileSync(path.join(DIST, 'index.html'), saida);
  fs.writeFileSync(path.join(DIST, '.nojekyll'), ''); // GitHub Pages: servir arquivos como estão

  // 5) Relatório
  const antesCss = tamanho(cssOrigem.filter((f) => f.endsWith('.css')));
  const antesJs = tamanho(modulos.map((s) => path.join(RAIZ, s)).concat(path.join(RAIZ, 'js/components/tema.js')));
  const depoisCss = fs.statSync(path.join(ASSETS, 'estilo.min.css')).size;
  const depoisJs = fs.statSync(path.join(ASSETS, 'app.min.js')).size + fs.statSync(path.join(ASSETS, 'tema.min.js')).size;

  const imgsDepois = tamanho(fs.readdirSync(path.join(DIST, 'imagens')).map((f) => path.join(DIST, 'imagens', f)));
  const htmlDepois = fs.statSync(path.join(DIST, 'index.html')).size;

  console.log('Build concluído em dist/');
  console.log(`  HTML: ${kb(htmlAntes)} → ${kb(htmlDepois)} (-${Math.round((1 - htmlDepois / htmlAntes) * 100)}%)`);
  console.log(`  CSS: ${cssOrigem.length} arquivos, ${kb(antesCss)} → 1 arquivo, ${kb(depoisCss)} (-${Math.round((1 - depoisCss / antesCss) * 100)}%)`);
  console.log(`  JS:  ${modulos.length + 1} arquivos, ${kb(antesJs)} → 2 arquivos, ${kb(depoisJs)} (-${Math.round((1 - depoisJs / antesJs) * 100)}%)`);
  console.log(`  Imagens (SVG, WebP, PNG): ${kb(tamanho(imgsOrigem))} → ${kb(imgsDepois)}`);
}

main().catch((erro) => {
  console.error('Falha no build:', erro.message);
  process.exit(1);
});
