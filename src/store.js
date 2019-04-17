
import get from 'get-value'

let _store = null;


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

export function initStore(store) {
  _store = store;
}

export function watchChanges(path, changed) {
    let watchFn = watchState(_store.getState, path);
    _store.subscribe(watchFn(changed));
}

export function getStore() {
  return _store
}
