const fs = require('node:fs/promises');
const esbuild = require('esbuild');
const babel = require('@babel/core');
const reactRefresh = require('react-refresh/babel');

(async function () {
  let code = await fs.readFile('../src/App.tsx', 'utf-8');

  // transform tsx to js
  code = (await esbuild.transform(code, { loader: 'tsx' })).code;
  await fs.writeFile('outputs/react-refresh-babel-1.js', code, 'utf-8');

  // apply react-refresh/babel plugin
  code = babel.transform(code, {
    filename: 'src/App.tsx',
    ast: false,
    compact: false,
    sourceMaps: false,
    babelrc: false,
    plugins: [[reactRefresh, { skipEnvCheck: true }]],
  }).code;

  await fs.writeFile('outputs/react-refresh-babel-2.js', code, 'utf-8');
  console.log('done');
})();
