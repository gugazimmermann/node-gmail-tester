import babel from '@rollup/plugin-babel';

export default {
  input: './src/index.js',
  output: {
    file: './lib/index.js',
    format: 'cjs',
    name: 'bundle',
  },
  external: ['googleapis', 'fs', 'path'],
  plugins: [
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
    }),
  ],
};
