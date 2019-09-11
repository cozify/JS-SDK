
import { configureStore } from 'redux-starter-kit';
import get from 'get-value';
import rootReducer from './reducers';


/**
 * store as a redux state store
 * @type {Object}
 */
export const store = configureStore({
  reducer: rootReducer,
  // middleware: [...getDefaultMiddleware(), logger]
  // default true like: devTools: process.env.NODE_ENV !== 'production'
  // preloadedState
  // enhancers: [reduxBatch]
});
console.log('Store Initial State: ', store.getState());

function watchState (getState, objectPath) {
  let currentValue = get(getState(), objectPath);
  return function w (fn) {
    return () => {
      const newValue = get(getState(), objectPath);
      if (currentValue !== newValue) {
        const oldValue = currentValue;
        currentValue = newValue;
        fn(newValue, oldValue);
      }
    };
  };
}

/**
 * Helper to subscribe to store changes
 * @param  {string} path - attribute path to watch changes, e.g. 'user.state'
 * @param  {function} changed - function to handle changes
 * @param  {Object} optionalStore - optional store for unit tests etc.
 */
export function watchChanges(path, changed, optionalStore) {
  const selectedStore = optionalStore || store;
  const watchFn = watchState(selectedStore.getState, path);
  selectedStore.subscribe(watchFn(changed));
}
