/**
 * import all plugins. just a sample. your project may
 * not use all the plugins shown below
*/
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import {uglify} from 'rollup-plugin-uglify';

import rollupAll from 'rollup-all';

import flow from 'rollup-plugin-flow'
import flowEntry from 'rollup-plugin-flow-entry'
import json from 'rollup-plugin-json'
import pkg from './package.json'

/**
 * run all plugins and store results in an array.
 *  do not include the uglifier plugin here.
*/
const plugins = [
    flow(),
    flowEntry(),
    resolve(),
    babel({
        exclude: 'node_modules/**'
    })
];

/**
 * if there is a custom build config file
 * you defined, and it is not named .buildrc.json
 * or placed in the root directory,
 * then specify the relative path here
*/
const configPath = ',/all-builddr.json';

/**
 * call the api and export the result.
 * if you are not using any uglifier
 * pass in null as second paramter
*/
export default rollupAll.getExports(uglify(), plugins, configPath);
