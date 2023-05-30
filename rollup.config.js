import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';
// eslint-disable-next-line import/extensions
import htmlPlugin from './rollup/html-plugin.js';

export default () => ({
  input: 'src/main.jsx',
  output: {
    file: 'public/js/main.js',
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
    nodeResolve(),
    babel({
      babelHelpers: 'bundled',
      presets: ['@babel/preset-react'],
    }),
    commonjs(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    terser(),
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
});
