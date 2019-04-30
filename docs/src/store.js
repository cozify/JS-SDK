
import { configureStore, getDefaultMiddleware } from 'redux-starter-kit';
import {rootReducer} from './reducers';

import get from 'get-value'

/**
 * store as a redux state store
 * @type {Object}
 */
export const store = configureStore({
  reducer: rootReducer
  //middleware: [...getDefaultMiddleware(), logger]
  // default true like: devTools: process.env.NODE_ENV !== 'production'
  //preloadedState
  //enhancers: [reduxBatch]
});
console.log("Initial state", store.getState())

function watchState (getState, objectPath) {
  var currentValue = get(getState(), objectPath)
  return function w (fn) {
    return function () {
      var newValue = get(getState(), objectPath)
      if (currentValue !== newValue) {
        var oldValue = currentValue
        currentValue = newValue
        fn(newValue, oldValue)
      }
    }
  }
}

/**
 * Helper to subscribe to store changes
 * @param  {string} path - attribute path to watch changes, e.g. 'user.state'
 * @param  {function} changed - function to handle changes
 * @param  {Object} optionalStore - optional store for unit tests etc.
 */
export function watchChanges(path, changed, optionalStore) {
    let selectedStore = optionalStore ? optionalStore : store
    let watchFn = watchState(selectedStore.getState, path);
    selectedStore.subscribe(watchFn(changed));
}

