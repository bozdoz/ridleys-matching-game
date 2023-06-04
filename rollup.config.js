import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';
// eslint-disable-next-line import/extensions
import htmlPlugin from './rollup/html-plugin.js';

const production = process.env.NODE_ENV === 'production';

const plugins = [
  replace({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.env.npm_package_version': process.env.npm_package_version,
  }),
  commonjs(),
  nodeResolve(),
  babel({
    babelHelpers: 'bundled',
    presets: ['@babel/preset-react'],
  }),
  production && terser(),
];

export default () => {
  const main = {
    input: 'src/main.jsx',
    output: {
      file: 'public/main.js',
      format: 'iife',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      },
    },
    external: [
      'react',
      'react-dom',
    ],
    plugins: [
      ...plugins,
      htmlPlugin({
        targets: [{
          src: './src/index.html',
          dest: './public/index.html',
        }],
        replacements: {
          title: "Ridley and Ben's Card Matcher",
          description: 'The first card matching game created by Ridley and Ben',
          site: 'https://ridleys-matching-game.vercel.app',
        },
      }),
    ],
  };

  const sw = {
    plugins,
    input: 'src/sw.js',
    output: {
      file: 'public/sw.js',
      sourcemap: false,
      format: 'cjs',
      strict: false,
    },
  };

  return [main, sw];
};
