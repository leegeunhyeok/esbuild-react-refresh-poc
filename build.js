const esbuild = require('esbuild');

esbuild.build({
  outdir: 'dist',
  platform: 'browser',
  entryPoints: ['src/index.ts'],
  bundle: true,
  write: true,
})
  .then(() => console.log('done'))
  .catch(console.error);
