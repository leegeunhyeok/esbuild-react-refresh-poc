const fs = require('node:fs/promises');
const esbuild = require('esbuild');
const babel = require('@babel/core');
const reactRefresh = require('react-refresh/babel');

let code = `
export function FakeComponent() {
  return null;
};
`;

(async function () {
  // transform tsx to js
  code = (await esbuild.transform(code, { loader: 'ts' })).code;
  await fs.writeFile('outputs/react-refresh-babel-non-component2-1.js', code, 'utf-8');

  // apply react-refresh/babel plugin
  code = babel.transform(code, {
    filename: 'src/index.ts',
    ast: false,
    compact: false,
    sourceMaps: false,
    babelrc: false,
    plugins: [[reactRefresh, { skipEnvCheck: true }]],
  }).code;

  await fs.writeFile('outputs/react-refresh-babel-non-component2-2.js', code, 'utf-8');
  console.log('done');
})();
