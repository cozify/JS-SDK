import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import flow from 'rollup-plugin-flow'
import flowEntry from 'rollup-plugin-flow-entry'
import json from 'rollup-plugin-json'
import copy from 'rollup-plugin-cpy'
import pkg from './package.json'
import replace from 'rollup-plugin-replace';

const isProduction = process.env.NODE_ENV === 'production';

// Some ideas from
// https://www.grzegorowski.com/publishing-npm-package-with-rollup-babel-and/
//
export default {
  input: 'src/index.js',
  output: [
    // Existence of browser version causes problem to run es ersion in react-example, so remove them from dist before starting react-example
    {
      file: pkg.iife,
      name: 'CozifySDK',
      format: 'iife',
      globals: {
        'lodash/isEmpty': 'isEmpty',
        'axios': 'axios',
        'retry-axios': 'retry-axios'
      },
      sourcemap: true
    },
    {
      file: pkg.node,
      format: 'cjs',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    },
  ],
  plugins: [
    replace({
      ENVIRONMENT: JSON.stringify(process.env.NODE_ENV || 'production'),
      'process.env.NODE_ENV': "'production'",
    })
    , flow()
    , flowEntry()
    , resolve({
      jsnext: true, preferBuiltins: true, browser: true,
      // pass custom options to the resolve plugin
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      }
    })
    , babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true,
      comments: true
    })
    //Convert CommonJS modules to ES6, so they can be included in a Rollup bundle
    , json()
    , commonjs({
      include: ['node_modules/**']
    })
    // copy Flow definitions from source to destination directory
    // , copy({
    //  files: ['src/*.flow'],
    //  dest: 'dist',
    //}),

  ],
  external: ['axios']
}
