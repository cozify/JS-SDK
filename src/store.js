
let _store = null;

export function initStore(store) {
  _store = store;
}

export function getStore() {
  return _store
}
