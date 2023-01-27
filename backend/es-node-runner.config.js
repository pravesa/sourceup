/**
 * @type { import('es-node-runner').Config }
 */

export default {
  buildOptions: {
    entry: 'src/bin/www.ts',
    format: 'esm',
    target: 'node16',
  },
  spawnOptions: {
    autoRestart: false,
  },
};
