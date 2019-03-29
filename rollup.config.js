import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import resolve from 'rollup-plugin-node-resolve'
import flow from 'rollup-plugin-flow'
import flowEntry from 'rollup-plugin-flow-entry'
import json from 'rollup-plugin-json'
import copy from 'rollup-plugin-cpy'
import pkg from './package.json'

// Some ideas from
// https://www.grzegorowski.com/publishing-npm-package-with-rollup-babel-and/
//
export default {
  input: 'src/index.js',
  output: [
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
    // Existence of browser version causes problem to run es ersion in react-example, so remove them from dist before starting react-example
    {
      file: pkg.browser,
      name: 'CozifySDK',
      format: 'iife',
      globals: {
        'lodash/isEmpty': 'isEmpty',
        'axios': 'axios',
        'retry-axios': 'retry-axios'
      },
      sourcemap: true
    }
  ],
  external: ['axios'],
  plugins: [
    external('axios'),
    flow()
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
      comments: false
    })
    //Convert CommonJS modules to ES6, so they can be included in a Rollup bundle
    , json()
    , commonjs({
      include: ['node_modules/**']
    })
    // copy Flow definitions from source to destination directory
    /*
    ,
    copy({
      files: ['src/*.flow'],
      dest: 'lib',
    }),
    */
  ]
}
