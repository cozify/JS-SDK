import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import flow from 'rollup-plugin-flow';
import flowEntry from 'rollup-plugin-flow-entry';
import json from 'rollup-plugin-json';
import replace from 'rollup-plugin-replace';
import pkg from './package.json';


export default [
  // Node
  {
    input: 'src/index.js',
    output: {
      file: pkg.node,
      format: 'cjs',
    },
    plugins: [
      replace({
        ENVIRONMENT: JSON.stringify(process.env.NODE_ENV || 'production'),
        'process.env.NODE_ENV': "'production'",
      }),
      flow(),
      flowEntry(),
      resolve(),

      babel({
        exclude: 'node_modules/**',
        babelrc: false,
        presets: [
          [
            '@babel/env',
            {
              modules: false,
              useBuiltIns: 'usage',
              corejs: '3',
              targets: 'maintained node versions',
            },
          ],
        ],
      }),
      // Convert CommonJS modules to ES6, so they can be included in a Rollup bundle
      json(),
      commonjs({
        include: ['node_modules/**'],
      }),

    ],
  },

  // Browser
  {
    input: 'src/index.js',
    output: {
      file: pkg.browser,
      format: 'umd',
      name: 'CozifySDK',
      globals: {
        'lodash/isEmpty': 'isEmpty',
        'axios': 'axios',
        'retry-axios': 'retry-axios'
      },
      sourcemap: true,
    },
    plugins: [
      replace({
        ENVIRONMENT: JSON.stringify(process.env.NODE_ENV || 'production'),
        'process.env.NODE_ENV': "'production'",
      }),
      flow(),
      flowEntry(),
      resolve({browser: true}),
      commonjs(),
      babel({
        exclude: 'node_modules/**',
        runtimeHelpers: true,
      }),
    ],
    external: ['axios'],
  },

  // Browser minified
  {
    input: 'src/index.js',
    output: {
      file: pkg.browser.replace(/\.js$/, '.min.js'),
      format: 'umd',
      name: 'CozifySDK',
      globals: {
        'lodash/isEmpty': 'isEmpty',
        'axios': 'axios',
        'retry-axios': 'retry-axios'
      },
    },
    plugins: [
      replace({
        ENVIRONMENT: JSON.stringify(process.env.NODE_ENV || 'production'),
        'process.env.NODE_ENV': "'production'",
      }),
      flow(),
      flowEntry(),
      resolve({browser: true}),
      commonjs(),
      babel({
        exclude: 'node_modules/**',
        runtimeHelpers: true,
      }),
      terser(),
    ],
    external: ['axios'],
  },

  // ES6 modules
  {
    input: 'src/index.js',
    output: {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      replace({
        ENVIRONMENT: JSON.stringify(process.env.NODE_ENV || 'production'),
        'process.env.NODE_ENV': "'production'",
      }),
      flow(),
      flowEntry(),
      resolve({
      jsnext: true, preferBuiltins: true, browser: true,
      // pass custom options to the resolve plugin
        customResolveOptions: {
          moduleDirectory: 'node_modules'
        }
      }),
      commonjs({
        include: ['node_modules/**']
      }),
      babel({
        exclude: 'node_modules/**',
        runtimeHelpers: true,
        comments: true
      }),
      json(),
    ],
    external: ['axios'],
  },

];
