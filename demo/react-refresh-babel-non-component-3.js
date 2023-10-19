const fs = require('node:fs/promises');
const esbuild = require('esbuild');
const babel = require('@babel/core');
const reactRefresh = require('react-refresh/babel');

let code = `
export const TEST_VALUE = 1;
export const TEST_VALUE_2 = 2;
export const TEST_VALUE_3 = 3;

export const getValue = () => TEST_VALUE;

export const GetValue = () => TEST_VALUE;
`;

(async function () {
  // transform tsx to js
  code = (await esbuild.transform(code, { loader: 'ts' })).code;
  await fs.writeFile('outputs/react-refresh-babel-non-component3-1.js', code, 'utf-8');

  // apply react-refresh/babel plugin
  code = babel.transform(code, {
    filename: 'src/index.ts',
    ast: false,
    compact: false,
    sourceMaps: false,
    babelrc: false,
    plugins: [[reactRefresh, { skipEnvCheck: true }]],
  }).code;

  await fs.writeFile('outputs/react-refresh-babel-non-component3-2.js', code, 'utf-8');
  console.log('done');
})();
