const fs = require('node:fs/promises');
const esbuild = require('esbuild');
const babel = require('@babel/core');
const reactRefresh = require('react-refresh/babel');

const originCode1 = `
class MyComponent1 extends React.Component {
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

export const HoC1 = withHoc(MyComponent1);
`;

const originCode2 = `
const MyComponent2 = () => {
  const [number, setNumber] = useState(0);

  return <div>Hello, {number}</div>;
};

export const HoC2 = withHoc(MyComponent2);
`;

(async function () {
  let i = 0;
  for await (let code of [originCode1, originCode2]) {
    i++;
    // transform tsx to js
    code = (await esbuild.transform(code, { loader: 'jsx' })).code;
    await fs.writeFile(`outputs/react-refresh-babel-hoc-1-${i}.js`, code, 'utf-8');

    // apply react-refresh/babel plugin
    code = babel.transform(code, {
      filename: 'HoC.jsx',
      ast: false,
      compact: false,
      sourceMaps: false,
      babelrc: false,
      plugins: [[reactRefresh, { skipEnvCheck: true }]],
    }).code;

    await fs.writeFile(`outputs/react-refresh-babel-hoc-2-${i}.js`, code, 'utf-8');
    console.log('done');
  }
})();
