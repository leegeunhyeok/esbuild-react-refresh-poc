const fs = require('node:fs/promises');
const esbuild = require('esbuild');
const babel = require('@babel/core');
const reactRefresh = require('react-refresh/babel');

const originCode = `
export class MyComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      number: 1,
    };
  }

  render() {
    return <div>Hello, {this.state.number}</div>;
  }
}
`;

(async function () {
  let code = originCode

  // transform tsx to js
  code = (await esbuild.transform(code, { loader: 'jsx' })).code;
  await fs.writeFile('outputs/react-refresh-babel-class-component-1.js', code, 'utf-8');

  // apply react-refresh/babel plugin
  code = babel.transform(code, {
    filename: 'ClassComponent.jsx',
    ast: false,
    compact: false,
    sourceMaps: false,
    babelrc: false,
    plugins: [[reactRefresh, { skipEnvCheck: true }]],
  }).code;

  await fs.writeFile('outputs/react-refresh-babel-class-component-2.js', code, 'utf-8');
  console.log('done');
})();
