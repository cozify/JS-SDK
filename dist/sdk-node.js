'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var axios = _interopDefault(require('axios'));

function symbolObservablePonyfill(root) {
	var result;
	var Symbol = root.Symbol;

	if (typeof Symbol === 'function') {
		if (Symbol.observable) {
			result = Symbol.observable;
		} else {
			result = Symbol('observable');
			Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
}

/* global window */

var root;

if (typeof self !== 'undefined') {
  root = self;
} else if (typeof window !== 'undefined') {
  root = window;
} else if (typeof global !== 'undefined') {
  root = global;
} else if (typeof module !== 'undefined') {
  root = module;
} else {
  root = Function('return this')();
}

var result = symbolObservablePonyfill(root);

/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
var randomString = function randomString() {
  return Math.random().toString(36).substring(7).split('').join('.');
};

var ActionTypes = {
  INIT: "@@redux/INIT" + randomString(),
  REPLACE: "@@redux/REPLACE" + randomString(),
  PROBE_UNKNOWN_ACTION: function PROBE_UNKNOWN_ACTION() {
    return "@@redux/PROBE_UNKNOWN_ACTION" + randomString();
  }
};

/**
 * @param {any} obj The object to inspect.
 * @returns {boolean} True if the argument appears to be a plain object.
 */
function isPlainObject(obj) {
  if (typeof obj !== 'object' || obj === null) return false;
  var proto = obj;

  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(obj) === proto;
}

/**
 * Creates a Redux store that holds the state tree.
 * The only way to change the data in the store is to call `dispatch()` on it.
 *
 * There should only be a single store in your app. To specify how different
 * parts of the state tree respond to actions, you may combine several reducers
 * into a single reducer function by using `combineReducers`.
 *
 * @param {Function} reducer A function that returns the next state tree, given
 * the current state tree and the action to handle.
 *
 * @param {any} [preloadedState] The initial state. You may optionally specify it
 * to hydrate the state from the server in universal apps, or to restore a
 * previously serialized user session.
 * If you use `combineReducers` to produce the root reducer function, this must be
 * an object with the same shape as `combineReducers` keys.
 *
 * @param {Function} [enhancer] The store enhancer. You may optionally specify it
 * to enhance the store with third-party capabilities such as middleware,
 * time travel, persistence, etc. The only store enhancer that ships with Redux
 * is `applyMiddleware()`.
 *
 * @returns {Store} A Redux store that lets you read the state, dispatch actions
 * and subscribe to changes.
 */

function createStore(reducer, preloadedState, enhancer) {
  var _ref2;

  if (typeof preloadedState === 'function' && typeof enhancer === 'function' || typeof enhancer === 'function' && typeof arguments[3] === 'function') {
    throw new Error('It looks like you are passing several store enhancers to ' + 'createStore(). This is not supported. Instead, compose them ' + 'together to a single function');
  }

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore)(reducer, preloadedState);
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }
  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */


  function getState() {
    if (isDispatching) {
      throw new Error('You may not call store.getState() while the reducer is executing. ' + 'The reducer has already received the state as an argument. ' + 'Pass it down from the top reducer instead of reading it from the store.');
    }

    return currentState;
  }
  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */


  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected the listener to be a function.');
    }

    if (isDispatching) {
      throw new Error('You may not call store.subscribe() while the reducer is executing. ' + 'If you would like to be notified after the store has been updated, subscribe from a ' + 'component and invoke store.getState() in the callback to access the latest state. ' + 'See https://redux.js.org/api-reference/store#subscribe(listener) for more details.');
    }

    var isSubscribed = true;
    ensureCanMutateNextListeners();
    nextListeners.push(listener);
    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      if (isDispatching) {
        throw new Error('You may not unsubscribe from a store listener while the reducer is executing. ' + 'See https://redux.js.org/api-reference/store#subscribe(listener) for more details.');
      }

      isSubscribed = false;
      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
    };
  }
  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */


  function dispatch(action) {
    if (!isPlainObject(action)) {
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    var listeners = currentListeners = nextListeners;

    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener();
    }

    return action;
  }
  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */


  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.');
    }

    currentReducer = nextReducer;
    dispatch({
      type: ActionTypes.REPLACE
    });
  }
  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/tc39/proposal-observable
   */


  function observable() {
    var _ref;

    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe: function subscribe(observer) {
        if (typeof observer !== 'object' || observer === null) {
          throw new TypeError('Expected the observer to be an object.');
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }

        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return {
          unsubscribe: unsubscribe
        };
      }
    }, _ref[result] = function () {
      return this;
    }, _ref;
  } // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.


  dispatch({
    type: ActionTypes.INIT
  });
  return _ref2 = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  }, _ref2[result] = observable, _ref2;
}

function getUndefinedStateErrorMessage(key, action) {
  var actionType = action && action.type;
  var actionDescription = actionType && "action \"" + String(actionType) + "\"" || 'an action';
  return "Given " + actionDescription + ", reducer \"" + key + "\" returned undefined. " + "To ignore an action, you must explicitly return the previous state. " + "If you want this reducer to hold no value, you can return null instead of undefined.";
}

function assertReducerShape(reducers) {
  Object.keys(reducers).forEach(function (key) {
    var reducer = reducers[key];
    var initialState = reducer(undefined, {
      type: ActionTypes.INIT
    });

    if (typeof initialState === 'undefined') {
      throw new Error("Reducer \"" + key + "\" returned undefined during initialization. " + "If the state passed to the reducer is undefined, you must " + "explicitly return the initial state. The initial state may " + "not be undefined. If you don't want to set a value for this reducer, " + "you can use null instead of undefined.");
    }

    if (typeof reducer(undefined, {
      type: ActionTypes.PROBE_UNKNOWN_ACTION()
    }) === 'undefined') {
      throw new Error("Reducer \"" + key + "\" returned undefined when probed with a random type. " + ("Don't try to handle " + ActionTypes.INIT + " or other actions in \"redux/*\" ") + "namespace. They are considered private. Instead, you must return the " + "current state for any unknown actions, unless it is undefined, " + "in which case you must return the initial state, regardless of the " + "action type. The initial state may not be undefined, but can be null.");
    }
  });
}
/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */


function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers);
  var finalReducers = {};

  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i];

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }

  var finalReducerKeys = Object.keys(finalReducers);

  var shapeAssertionError;

  try {
    assertReducerShape(finalReducers);
  } catch (e) {
    shapeAssertionError = e;
  }

  return function combination(state, action) {
    if (state === void 0) {
      state = {};
    }

    if (shapeAssertionError) {
      throw shapeAssertionError;
    }

    var hasChanged = false;
    var nextState = {};

    for (var _i = 0; _i < finalReducerKeys.length; _i++) {
      var _key = finalReducerKeys[_i];
      var reducer = finalReducers[_key];
      var previousStateForKey = state[_key];
      var nextStateForKey = reducer(previousStateForKey, action);

      if (typeof nextStateForKey === 'undefined') {
        var errorMessage = getUndefinedStateErrorMessage(_key, action);
        throw new Error(errorMessage);
      }

      nextState[_key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }

    return hasChanged ? nextState : state;
  };
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */
function compose() {
  for (var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(function (a, b) {
    return function () {
      return a(b.apply(void 0, arguments));
    };
  });
}

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */

function applyMiddleware() {
  for (var _len = arguments.length, middlewares = new Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }

  return function (createStore) {
    return function () {
      var store = createStore.apply(void 0, arguments);

      var _dispatch = function dispatch() {
        throw new Error("Dispatching while constructing your middleware is not allowed. " + "Other middleware would not be applied to this dispatch.");
      };

      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch() {
          return _dispatch.apply(void 0, arguments);
        }
      };
      var chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = compose.apply(void 0, chain)(store.dispatch);
      return _objectSpread({}, store, {
        dispatch: _dispatch
      });
    };
  };
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var NOTHING = typeof Symbol !== "undefined" ? Symbol("immer-nothing") : defineProperty({}, "immer-nothing", true);

var DRAFTABLE = typeof Symbol !== "undefined" ? Symbol("immer-draftable") : "__$immer_draftable";

var DRAFT_STATE = typeof Symbol !== "undefined" ? Symbol("immer-state") : "__$immer_state";

function isDraft(value) {
    return !!value && !!value[DRAFT_STATE];
}

function isDraftable(value) {
    if (!value || (typeof value === "undefined" ? "undefined" : _typeof(value)) !== "object") return false;
    if (Array.isArray(value)) return true;
    var proto = Object.getPrototypeOf(value);
    if (!proto || proto === Object.prototype) return true;
    return !!value[DRAFTABLE] || !!value.constructor[DRAFTABLE];
}

var assign = Object.assign || function assign(target, value) {
    for (var key in value) {
        if (has(value, key)) {
            target[key] = value[key];
        }
    }
    return target;
};

var ownKeys = typeof Reflect !== "undefined" && Reflect.ownKeys ? Reflect.ownKeys : typeof Object.getOwnPropertySymbols !== "undefined" ? function (obj) {
    return Object.getOwnPropertyNames(obj).concat(Object.getOwnPropertySymbols(obj));
} : Object.getOwnPropertyNames;

function shallowCopy(base) {
    var invokeGetters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (Array.isArray(base)) return base.slice();
    var clone = Object.create(Object.getPrototypeOf(base));
    ownKeys(base).forEach(function (key) {
        if (key === DRAFT_STATE) {
            return; // Never copy over draft state.
        }
        var desc = Object.getOwnPropertyDescriptor(base, key);
        if (desc.get) {
            if (!invokeGetters) {
                throw new Error("Immer drafts cannot have computed properties");
            }
            desc.value = desc.get.call(base);
        }
        if (desc.enumerable) {
            clone[key] = desc.value;
        } else {
            Object.defineProperty(clone, key, {
                value: desc.value,
                writable: true,
                configurable: true
            });
        }
    });
    return clone;
}

function each(value, cb) {
    if (Array.isArray(value)) {
        for (var i = 0; i < value.length; i++) {
            cb(i, value[i], value);
        }
    } else {
        ownKeys(value).forEach(function (key) {
            return cb(key, value[key], value);
        });
    }
}

function isEnumerable(base, prop) {
    return Object.getOwnPropertyDescriptor(base, prop).enumerable;
}

function has(thing, prop) {
    return Object.prototype.hasOwnProperty.call(thing, prop);
}

function is(x, y) {
    // From: https://github.com/facebook/fbjs/blob/c69904a511b900266935168223063dd8772dfc40/packages/fbjs/src/core/shallowEqual.js
    if (x === y) {
        return x !== 0 || 1 / x === 1 / y;
    } else {
        return x !== x && y !== y;
    }
}

// @ts-check

var descriptors = {};

// For nested produce calls:
var scopes = [];
var currentScope = function currentScope() {
    return scopes[scopes.length - 1];
};

function willFinalize(result, baseDraft, needPatches) {
    var scope = currentScope();
    scope.forEach(function (state) {
        return state.finalizing = true;
    });
    if (result === undefined || result === baseDraft) {
        if (needPatches) markChangesRecursively(baseDraft);
        // This is faster when we don't care about which attributes changed.
        markChangesSweep(scope);
    }
}

function createDraft(base, parent) {
    var isArray = Array.isArray(base);
    var draft = clonePotentialDraft(base);
    each(draft, function (prop) {
        proxyProperty(draft, prop, isArray || isEnumerable(base, prop));
    });

    // See "proxy.js" for property documentation.
    var state = {
        scope: parent ? parent.scope : currentScope(),
        modified: false,
        finalizing: false, // es5 only
        finalized: false,
        assigned: {},
        parent: parent,
        base: base,
        draft: draft,
        copy: null,
        revoke: revoke,
        revoked: false // es5 only
    };

    createHiddenProperty(draft, DRAFT_STATE, state);
    state.scope.push(state);
    return draft;
}

function revoke() {
    this.revoked = true;
}

function source(state) {
    return state.copy || state.base;
}

function _get(state, prop) {
    assertUnrevoked(state);
    var value = source(state)[prop];
    // Drafts are only created for proxyable values that exist in the base state.
    if (!state.finalizing && value === state.base[prop] && isDraftable(value)) {
        prepareCopy(state);
        return state.copy[prop] = createDraft(value, state);
    }
    return value;
}

function _set(state, prop, value) {
    assertUnrevoked(state);
    state.assigned[prop] = true;
    if (!state.modified) {
        if (is(source(state)[prop], value)) return;
        markChanged(state);
        prepareCopy(state);
    }
    state.copy[prop] = value;
}

function markChanged(state) {
    if (!state.modified) {
        state.modified = true;
        if (state.parent) markChanged(state.parent);
    }
}

function prepareCopy(state) {
    if (!state.copy) state.copy = clonePotentialDraft(state.base);
}

function clonePotentialDraft(base) {
    var state = base && base[DRAFT_STATE];
    if (state) {
        state.finalizing = true;
        var draft = shallowCopy(state.draft, true);
        state.finalizing = false;
        return draft;
    }
    return shallowCopy(base);
}

function proxyProperty(draft, prop, enumerable) {
    var desc = descriptors[prop];
    if (desc) {
        desc.enumerable = enumerable;
    } else {
        descriptors[prop] = desc = {
            configurable: true,
            enumerable: enumerable,
            get: function get$$1() {
                return _get(this[DRAFT_STATE], prop);
            },
            set: function set$$1(value) {
                _set(this[DRAFT_STATE], prop, value);
            }
        };
    }
    Object.defineProperty(draft, prop, desc);
}

function assertUnrevoked(state) {
    if (state.revoked === true) throw new Error("Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? " + JSON.stringify(source(state)));
}

// This looks expensive, but only proxies are visited, and only objects without known changes are scanned.
function markChangesSweep(scope) {
    // The natural order of drafts in the `scope` array is based on when they
    // were accessed. By processing drafts in reverse natural order, we have a
    // better chance of processing leaf nodes first. When a leaf node is known to
    // have changed, we can avoid any traversal of its ancestor nodes.
    for (var i = scope.length - 1; i >= 0; i--) {
        var state = scope[i];
        if (state.modified === false) {
            if (Array.isArray(state.base)) {
                if (hasArrayChanges(state)) markChanged(state);
            } else if (hasObjectChanges(state)) markChanged(state);
        }
    }
}

function markChangesRecursively(object) {
    if (!object || (typeof object === "undefined" ? "undefined" : _typeof(object)) !== "object") return;
    var state = object[DRAFT_STATE];
    if (!state) return;
    var base = state.base,
        draft = state.draft,
        assigned = state.assigned;

    if (!Array.isArray(object)) {
        // Look for added keys.
        Object.keys(draft).forEach(function (key) {
            // The `undefined` check is a fast path for pre-existing keys.
            if (base[key] === undefined && !has(base, key)) {
                assigned[key] = true;
                markChanged(state);
            } else if (!assigned[key]) {
                // Only untouched properties trigger recursion.
                markChangesRecursively(draft[key]);
            }
        });
        // Look for removed keys.
        Object.keys(base).forEach(function (key) {
            // The `undefined` check is a fast path for pre-existing keys.
            if (draft[key] === undefined && !has(draft, key)) {
                assigned[key] = false;
                markChanged(state);
            }
        });
    } else if (hasArrayChanges(state)) {
        markChanged(state);
        assigned.length = true;
        if (draft.length < base.length) {
            for (var i = draft.length; i < base.length; i++) {
                assigned[i] = false;
            }
        } else {
            for (var _i = base.length; _i < draft.length; _i++) {
                assigned[_i] = true;
            }
        }
        for (var _i2 = 0; _i2 < draft.length; _i2++) {
            // Only untouched indices trigger recursion.
            if (assigned[_i2] === undefined) markChangesRecursively(draft[_i2]);
        }
    }
}

function hasObjectChanges(state) {
    var base = state.base,
        draft = state.draft;

    // Search for added keys. Start at the back, because non-numeric keys
    // are ordered by time of definition on the object.

    var keys = Object.keys(draft);
    for (var i = keys.length - 1; i >= 0; i--) {
        // The `undefined` check is a fast path for pre-existing keys.
        if (base[keys[i]] === undefined && !has(base, keys[i])) {
            return true;
        }
    }

    // Since no keys have been added, we can compare lengths to know if an
    // object has been deleted.
    return keys.length !== Object.keys(base).length;
}

function hasArrayChanges(state) {
    var draft = state.draft;

    if (draft.length !== state.base.length) return true;
    // See #116
    // If we first shorten the length, our array interceptors will be removed.
    // If after that new items are added, result in the same original length,
    // those last items will have no intercepting property.
    // So if there is no own descriptor on the last position, we know that items were removed and added
    // N.B.: splice, unshift, etc only shift values around, but not prop descriptors, so we only have to check
    // the last one
    var descriptor = Object.getOwnPropertyDescriptor(draft, draft.length - 1);
    // descriptor can be null, but only for newly created sparse arrays, eg. new Array(10)
    if (descriptor && !descriptor.get) return true;
    // For all other cases, we don't have to compare, as they would have been picked up by the index setters
    return false;
}

function createHiddenProperty(target, prop, value) {
    Object.defineProperty(target, prop, {
        value: value,
        enumerable: false,
        writable: true
    });
}



var legacyProxy = Object.freeze({
	scopes: scopes,
	currentScope: currentScope,
	willFinalize: willFinalize,
	createDraft: createDraft
});

// @ts-check

// For nested produce calls:
var scopes$1 = [];
var currentScope$1 = function currentScope() {
    return scopes$1[scopes$1.length - 1];
};

// Do nothing before being finalized.
function willFinalize$1() {}

function createDraft$1(base, parent) {
    var state = {
        // Track which produce call this is associated with.
        scope: parent ? parent.scope : currentScope$1(),
        // True for both shallow and deep changes.
        modified: false,
        // Used during finalization.
        finalized: false,
        // Track which properties have been assigned (true) or deleted (false).
        assigned: {},
        // The parent draft state.
        parent: parent,
        // The base state.
        base: base,
        // The base proxy.
        draft: null,
        // Any property proxies.
        drafts: {},
        // The base copy with any updated values.
        copy: null,
        // Called by the `produce` function.
        revoke: null
    };

    var _ref = Array.isArray(base) ? Proxy.revocable([state], arrayTraps) : Proxy.revocable(state, objectTraps),
        revoke = _ref.revoke,
        proxy = _ref.proxy;

    state.draft = proxy;
    state.revoke = revoke;

    state.scope.push(state);
    return proxy;
}

var objectTraps = {
    get: get$1,
    has: function has$$1(target, prop) {
        return prop in source$1(target);
    },
    ownKeys: function ownKeys$$1(target) {
        return Reflect.ownKeys(source$1(target));
    },

    set: set$1,
    deleteProperty: deleteProperty,
    getOwnPropertyDescriptor: getOwnPropertyDescriptor,
    defineProperty: function defineProperty() {
        throw new Error("Object.defineProperty() cannot be used on an Immer draft"); // prettier-ignore
    },
    getPrototypeOf: function getPrototypeOf(target) {
        return Object.getPrototypeOf(target.base);
    },
    setPrototypeOf: function setPrototypeOf() {
        throw new Error("Object.setPrototypeOf() cannot be used on an Immer draft"); // prettier-ignore
    }
};

var arrayTraps = {};
each(objectTraps, function (key, fn) {
    arrayTraps[key] = function () {
        arguments[0] = arguments[0][0];
        return fn.apply(this, arguments);
    };
});
arrayTraps.deleteProperty = function (state, prop) {
    if (isNaN(parseInt(prop))) {
        throw new Error("Immer only supports deleting array indices"); // prettier-ignore
    }
    return objectTraps.deleteProperty.call(this, state[0], prop);
};
arrayTraps.set = function (state, prop, value) {
    if (prop !== "length" && isNaN(parseInt(prop))) {
        throw new Error("Immer only supports setting array indices and the 'length' property"); // prettier-ignore
    }
    return objectTraps.set.call(this, state[0], prop, value);
};

function source$1(state) {
    return state.copy || state.base;
}

function get$1(state, prop) {
    if (prop === DRAFT_STATE) return state;
    var drafts = state.drafts;

    // Check for existing draft in unmodified state.

    if (!state.modified && has(drafts, prop)) {
        return drafts[prop];
    }

    var value = source$1(state)[prop];
    if (state.finalized || !isDraftable(value)) return value;

    // Check for existing draft in modified state.
    if (state.modified) {
        // Assigned values are never drafted. This catches any drafts we created, too.
        if (value !== state.base[prop]) return value;
        // Store drafts on the copy (when one exists).
        drafts = state.copy;
    }

    return drafts[prop] = createDraft$1(value, state);
}

function set$1(state, prop, value) {
    if (!state.modified) {
        // Optimize based on value's truthiness. Truthy values are guaranteed to
        // never be undefined, so we can avoid the `in` operator. Lastly, truthy
        // values may be drafts, but falsy values are never drafts.
        var isUnchanged = value ? is(state.base[prop], value) || value === state.drafts[prop] : is(state.base[prop], value) && prop in state.base;
        if (isUnchanged) return true;
        markChanged$1(state);
    }
    state.assigned[prop] = true;
    state.copy[prop] = value;
    return true;
}

function deleteProperty(state, prop) {
    // The `undefined` check is a fast path for pre-existing keys.
    if (state.base[prop] !== undefined || prop in state.base) {
        state.assigned[prop] = false;
        markChanged$1(state);
    }
    if (state.copy) delete state.copy[prop];
    return true;
}

function getOwnPropertyDescriptor(state, prop) {
    var owner = source$1(state);
    var desc = Reflect.getOwnPropertyDescriptor(owner, prop);
    if (desc) {
        desc.writable = true;
        desc.configurable = !Array.isArray(owner) || prop !== "length";
    }
    return desc;
}

function markChanged$1(state) {
    if (!state.modified) {
        state.modified = true;
        state.copy = assign(shallowCopy(state.base), state.drafts);
        state.drafts = null;
        if (state.parent) markChanged$1(state.parent);
    }
}

var modernProxy = Object.freeze({
	scopes: scopes$1,
	currentScope: currentScope$1,
	willFinalize: willFinalize$1,
	createDraft: createDraft$1
});

function generatePatches(state, basePath, patches, inversePatches) {
    Array.isArray(state.base) ? generateArrayPatches(state, basePath, patches, inversePatches) : generateObjectPatches(state, basePath, patches, inversePatches);
}

function generateArrayPatches(state, basePath, patches, inversePatches) {
    var base = state.base,
        copy = state.copy,
        assigned = state.assigned;

    var minLength = Math.min(base.length, copy.length);

    // Look for replaced indices.
    for (var i = 0; i < minLength; i++) {
        if (assigned[i] && base[i] !== copy[i]) {
            var path = basePath.concat(i);
            patches.push({ op: "replace", path: path, value: copy[i] });
            inversePatches.push({ op: "replace", path: path, value: base[i] });
        }
    }

    // Did the array expand?
    if (minLength < copy.length) {
        for (var _i = minLength; _i < copy.length; _i++) {
            patches.push({
                op: "add",
                path: basePath.concat(_i),
                value: copy[_i]
            });
        }
        inversePatches.push({
            op: "replace",
            path: basePath.concat("length"),
            value: base.length
        });
    }

    // ...or did it shrink?
    else if (minLength < base.length) {
            patches.push({
                op: "replace",
                path: basePath.concat("length"),
                value: copy.length
            });
            for (var _i2 = minLength; _i2 < base.length; _i2++) {
                inversePatches.push({
                    op: "add",
                    path: basePath.concat(_i2),
                    value: base[_i2]
                });
            }
        }
}

function generateObjectPatches(state, basePath, patches, inversePatches) {
    var base = state.base,
        copy = state.copy;

    each(state.assigned, function (key, assignedValue) {
        var origValue = base[key];
        var value = copy[key];
        var op = !assignedValue ? "remove" : key in base ? "replace" : "add";
        if (origValue === value && op === "replace") return;
        var path = basePath.concat(key);
        patches.push(op === "remove" ? { op: op, path: path } : { op: op, path: path, value: value });
        inversePatches.push(op === "add" ? { op: "remove", path: path } : op === "remove" ? { op: "add", path: path, value: origValue } : { op: "replace", path: path, value: origValue });
    });
}

function applyPatches(draft, patches) {
    for (var i = 0; i < patches.length; i++) {
        var patch = patches[i];
        var path = patch.path;

        if (path.length === 0 && patch.op === "replace") {
            draft = patch.value;
        } else {
            var base = draft;
            for (var _i3 = 0; _i3 < path.length - 1; _i3++) {
                base = base[path[_i3]];
                if (!base || (typeof base === "undefined" ? "undefined" : _typeof(base)) !== "object") throw new Error("Cannot apply patch, path doesn't resolve: " + path.join("/")); // prettier-ignore
            }
            var key = path[path.length - 1];
            switch (patch.op) {
                case "replace":
                case "add":
                    // TODO: add support is not extensive, it does not support insertion or `-` atm!
                    base[key] = patch.value;
                    break;
                case "remove":
                    if (Array.isArray(base)) {
                        if (key !== base.length - 1) throw new Error("Only the last index of an array can be removed, index: " + key + ", length: " + base.length); // prettier-ignore
                        base.length -= 1;
                    } else {
                        delete base[key];
                    }
                    break;
                default:
                    throw new Error("Unsupported patch operation: " + patch.op);
            }
        }
    }
    return draft;
}

function verifyMinified() {}

var configDefaults = {
    useProxies: typeof Proxy !== "undefined" && typeof Reflect !== "undefined",
    autoFreeze: typeof process !== "undefined" ? 'production' !== "production" : verifyMinified.name === "verifyMinified",
    onAssign: null,
    onDelete: null,
    onCopy: null
};

var Immer = function () {
    function Immer(config) {
        classCallCheck(this, Immer);

        assign(this, configDefaults, config);
        this.setUseProxies(this.useProxies);
        this.produce = this.produce.bind(this);
    }

    createClass(Immer, [{
        key: "produce",
        value: function produce(base, recipe, patchListener) {
            var _this = this;

            // curried invocation
            if (typeof base === "function" && typeof recipe !== "function") {
                var defaultBase = recipe;
                recipe = base;

                // prettier-ignore
                return function () {
                    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                        args[_key - 1] = arguments[_key];
                    }

                    var base = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultBase;
                    return _this.produce(base, function (draft) {
                        var _recipe;

                        return (_recipe = recipe).call.apply(_recipe, [draft, draft].concat(args));
                    });
                };
            }

            // prettier-ignore
            {
                if (typeof recipe !== "function") throw new Error("if first argument is not a function, the second argument to produce should be a function");
                if (patchListener !== undefined && typeof patchListener !== "function") throw new Error("the third argument of a producer should not be set or a function");
            }

            var result = void 0;
            // Only create proxies for plain objects/arrays.
            if (!isDraftable(base)) {
                result = recipe(base);
                if (result === undefined) return base;
            }
            // The given value must be proxied.
            else {
                    this.scopes.push([]);
                    var baseDraft = this.createDraft(base);
                    try {
                        result = recipe.call(baseDraft, baseDraft);
                        this.willFinalize(result, baseDraft, !!patchListener);

                        // Never generate patches when no listener exists.
                        var patches = patchListener && [],
                            inversePatches = patchListener && [];

                        // Finalize the modified draft...
                        if (result === undefined || result === baseDraft) {
                            result = this.finalize(baseDraft, [], patches, inversePatches);
                        }
                        // ...or use a replacement value.
                        else {
                                // Users must never modify the draft _and_ return something else.
                                if (baseDraft[DRAFT_STATE].modified) throw new Error("An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft."); // prettier-ignore

                                // Finalize the replacement in case it contains (or is) a subset of the draft.
                                if (isDraftable(result)) result = this.finalize(result);

                                if (patchListener) {
                                    patches.push({
                                        op: "replace",
                                        path: [],
                                        value: result
                                    });
                                    inversePatches.push({
                                        op: "replace",
                                        path: [],
                                        value: base
                                    });
                                }
                            }
                    } finally {
                        this.currentScope().forEach(function (state) {
                            return state.revoke();
                        });
                        this.scopes.pop();
                    }
                    patchListener && patchListener(patches, inversePatches);
                }
            // Normalize the result.
            return result === NOTHING ? undefined : result;
        }
    }, {
        key: "setAutoFreeze",
        value: function setAutoFreeze(value) {
            this.autoFreeze = value;
        }
    }, {
        key: "setUseProxies",
        value: function setUseProxies(value) {
            this.useProxies = value;
            assign(this, value ? modernProxy : legacyProxy);
        }
    }, {
        key: "applyPatches",
        value: function applyPatches$$1(base, patches) {
            // Mutate the base state when a draft is passed.
            if (isDraft(base)) {
                return applyPatches(base, patches);
            }
            // Otherwise, produce a copy of the base state.
            return this.produce(base, function (draft) {
                return applyPatches(draft, patches);
            });
        }
        /**
         * @internal
         * Finalize a draft, returning either the unmodified base state or a modified
         * copy of the base state.
         */

    }, {
        key: "finalize",
        value: function finalize(draft, path, patches, inversePatches) {
            var _this2 = this;

            var state = draft[DRAFT_STATE];
            if (!state) {
                if (Object.isFrozen(draft)) return draft;
                return this.finalizeTree(draft);
            }
            // Never finalize drafts owned by an outer scope.
            if (state.scope !== this.currentScope()) {
                return draft;
            }
            if (!state.modified) return state.base;
            if (!state.finalized) {
                state.finalized = true;
                this.finalizeTree(state.draft, path, patches, inversePatches);
                if (this.onDelete) {
                    // The `assigned` object is unreliable with ES5 drafts.
                    if (this.useProxies) {
                        var assigned = state.assigned;

                        for (var prop in assigned) {
                            if (!assigned[prop]) this.onDelete(state, prop);
                        }
                    } else {
                        var base = state.base,
                            copy = state.copy;

                        each(base, function (prop) {
                            if (!has(copy, prop)) _this2.onDelete(state, prop);
                        });
                    }
                }
                if (this.onCopy) this.onCopy(state);

                // Nested producers must never auto-freeze their result,
                // because it may contain drafts from parent producers.
                if (this.autoFreeze && this.scopes.length === 1) {
                    Object.freeze(state.copy);
                }

                if (patches) generatePatches(state, path, patches, inversePatches);
            }
            return state.copy;
        }
        /**
         * @internal
         * Finalize all drafts in the given state tree.
         */

    }, {
        key: "finalizeTree",
        value: function finalizeTree(root, path, patches, inversePatches) {
            var _this3 = this;

            var state = root[DRAFT_STATE];
            if (state) {
                if (!this.useProxies) {
                    state.finalizing = true;
                    state.copy = shallowCopy(state.draft, true);
                    state.finalizing = false;
                }
                root = state.copy;
            }

            var onAssign = this.onAssign;

            var finalizeProperty = function finalizeProperty(prop, value, parent) {
                if (value === parent) {
                    throw Error("Immer forbids circular references");
                }

                // The only possible draft (in the scope of a `finalizeTree` call) is the `root` object.
                var inDraft = !!state && parent === root;

                if (isDraft(value)) {
                    value =
                    // Patches are never generated for assigned properties.
                    patches && inDraft && !state.assigned[prop] ? _this3.finalize(value, path.concat(prop), patches, inversePatches) // prettier-ignore
                    : _this3.finalize(value);

                    // Preserve non-enumerable properties.
                    if (Array.isArray(parent) || isEnumerable(parent, prop)) {
                        parent[prop] = value;
                    } else {
                        Object.defineProperty(parent, prop, { value: value });
                    }

                    // Unchanged drafts are never passed to the `onAssign` hook.
                    if (inDraft && value === state.base[prop]) return;
                }
                // Unchanged draft properties are ignored.
                else if (inDraft && is(value, state.base[prop])) {
                        return;
                    }
                    // Search new objects for unfinalized drafts. Frozen objects should never contain drafts.
                    else if (isDraftable(value) && !Object.isFrozen(value)) {
                            each(value, finalizeProperty);
                        }

                if (inDraft && onAssign) {
                    onAssign(state, prop, value);
                }
            };

            each(root, finalizeProperty);
            return root;
        }
    }]);
    return Immer;
}();

var immer = new Immer();

/**
 * The `produce` function takes a value and a "recipe function" (whose
 * return value often depends on the base state). The recipe function is
 * free to mutate its first argument however it wants. All mutations are
 * only ever applied to a __copy__ of the base state.
 *
 * Pass only a function to create a "curried producer" which relieves you
 * from passing the recipe function every time.
 *
 * Only plain objects and arrays are made mutable. All other objects are
 * considered uncopyable.
 *
 * Note: This function is __bound__ to its `Immer` instance.
 *
 * @param {any} base - the initial state
 * @param {Function} producer - function that receives a proxy of the base state as first argument and which can be freely modified
 * @param {Function} patchListener - optional function that will be called with all the patches produced here
 * @returns {any} a new state, or the initial state if nothing was modified
 */
var produce = immer.produce;
/**
 * Pass true to automatically freeze all copies created by Immer.
 *
 * By default, auto-freezing is disabled in production.
 */
var setAutoFreeze = immer.setAutoFreeze.bind(immer);

/**
 * Pass true to use the ES2015 `Proxy` class when creating drafts, which is
 * always faster than using ES5 proxies.
 *
 * By default, feature detection is used, so calling this is rarely necessary.
 */
var setUseProxies = immer.setUseProxies.bind(immer);

/**
 * Apply an array of Immer patches to the first argument.
 *
 * This function is a producer, which means copy-on-write is in effect.
 */
var applyPatches$1 = immer.applyPatches.bind(immer);
//# sourceMappingURL=immer.module.js.map

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x.default : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

/**
 * @constant {Object} CACHE
 *
 * @property {function} clear clear the cache results
 * @property {Object} results the map of path => array results
 * @property {number} size the size of the cache
 */
var CACHE = {
  clear: function clear() {
    CACHE.results = {};
    CACHE.size = 0;
  },
  results: {},
  size: 0
};
/**
 * @constant {RegExp} DOTTY_WITH_BRACKETS_SYNTAX
 */

var DOTTY_WITH_BRACKETS_SYNTAX = /"[^"]+"|`[^`]+`|'[^']+'|[^.[\]]+/g;
/**
 * @constant {number} MAX_CACHE_SIZE
 */

var MAX_CACHE_SIZE = 500;
/**
 * @constant {RegExp} NUMBER
 */

var NUMBER = /^\d+$/i;
/**
 * @constant {RegExp} QUOTED_KEY
 */

var QUOTED_KEY = /^"[^"]+"|`[^`]+`|'[^']+'$/;
/**
 * @constant {Array<string>} VALID_QUOTES
 */

var VALID_QUOTES = /^["'`]{1}$/;
/**
 * @constant {RegExp} VALID_KEY
 */

var VALID_KEY = /^\d+$|^[a-zA-Z_$][\w$]+$/;
/**
 * @constant {RegExp} WHITE_SPACE
 */

var WHITE_SPACE = /\s/;

// constants
/**
 * @function isNumericKey
 *
 * @description
 * is the key passed a numeric string
 *
 * @param {string} key the key to test
 * @returns {boolean} is the key passed a numeric string
 */

var isNumericKey = function isNumericKey(key) {
  return !!(key && key.length) && NUMBER.test(key);
};
/**
 * @function isQuotedKey
 *
 * @description
 * is the key passed a quoted key
 *
 * @param {string} key the key to test
 * @returns {boolean} is the key a quoted key
 */

var isQuotedKey = function isQuotedKey(key) {
  return QUOTED_KEY.test(key);
};
/**
 * @function map
 *
 * @description
 * map the array to a new array based on fn
 *
 * @param {Array<*>} array the array to map
 * @param {function} fn the function to call with each iteration value
 * @returns {Array<*>} the mapped array
 */

var map = function map(array, fn) {
  var length = array.length;
  var mapped = [];

  for (var index = 0; index < length; index++) {
    mapped[index] = fn(array[index]);
  }

  return mapped;
};
/**
 * @function shouldBeInBrackets
 *
 * @description
 * should the key passed be encased in brackets when in the path string
 *
 * @param {*} key the key that is being added to the path string
 * @returns {boolean} should the key be in brackets
 */

var shouldBeInBrackets = function shouldBeInBrackets(key) {
  return typeof key === 'number' || isNumericKey(key) || isQuotedKey(key);
};
/**
 * @function shouldBeInQuotes
 *
 * @description
 * should the key passed be encased in quotes when in the path string
 *
 * @param {*} key the key that is being added to the path string
 * @returns {boolean} should the key be in quotes
 */

var shouldBeInQuotes = function shouldBeInQuotes(key) {
  return WHITE_SPACE.test(key) || !VALID_KEY.test(key);
};
/**
 * @function createGetNormalizedCreateKey
 *
 * @description
 * get the normalized path string based on the quote and key passed
 *
 * @param {string} [quote="] the quote string to use
 * @returns {function(string, *): string}
 */

var createGetNormalizedCreateKey = function createGetNormalizedCreateKey(quote) {
  return function (existingString, key) {
    var normalizedKey = shouldBeInQuotes(key) ? "" + quote + key + quote : key;
    return existingString + (shouldBeInBrackets(normalizedKey) ? "[" + normalizedKey + "]" : "." + normalizedKey);
  };
};
/**
 * @function getNormalizedParseKey
 *
 * @description
 * get the key as a number if parseable, or as a quoted string if applicable
 *
 * @param {string} key the key to try to parse
 * @returns {number|string} the parsed key
 */

var getNormalizedParseKey = function getNormalizedParseKey(key) {
  var cleanKey = isQuotedKey(key) ? key.slice(1, key.length - 1) : key;
  return isNumericKey(cleanKey) ? +cleanKey : cleanKey;
};
/**
 * @function parsePath
 *
 * @description
 * parse the path, memoizing the results
 *
 * @param {string} path the path to parse
 * @returns {Array<number|string>} the parsed path
 */

var parseStringPath = function parseStringPath(path) {
  if (CACHE.results[path]) {
    return CACHE.results[path];
  }

  if (CACHE.size > MAX_CACHE_SIZE) {
    CACHE.clear();
  }

  CACHE.results[path] = path ? map(path.match(DOTTY_WITH_BRACKETS_SYNTAX), getNormalizedParseKey) : [path];
  CACHE.size++;
  return CACHE.results[path];
};

// constants
var isArray = Array.isArray;
/**
 * @function create
 *
 * @description
 * create a new path string based on the path and quote passed
 *
 * @param {Array<number|string>} path the path to convert to a string
 * @param {string} [quote="] the quote string to use when quoting keys
 * @returns {string} the path string
 */

var create = function create(path, quote) {
  if (quote === void 0) {
    quote = '"';
  }

  if (!isArray(path)) {
    throw new ReferenceError('path passed must be an array');
  }

  if (!VALID_QUOTES.test(quote)) {
    throw new SyntaxError("quote " + quote + " passed is invalid, must be \", `, or '.");
  }

  var pathString = path.reduce(createGetNormalizedCreateKey(quote), '');
  return pathString[0] === '.' ? pathString.slice(1) : pathString;
};
/**
 * @function parse
 *
 * @description
 * the path parsed into a valid array of keys / indices
 *
 * @param {Array<number|string>|number|string} path the path to parse
 * @returns {Array<number|string>} the parsed path
 */

var parse = function parse(path) {
  if (typeof path === 'string') {
    return parseStringPath(path);
  }

  if (isArray(path)) {
    return map(path, getNormalizedParseKey);
  }

  var normalizedParseKey = getNormalizedParseKey(path);
  return [typeof normalizedParseKey === 'number' ? normalizedParseKey : "" + normalizedParseKey];
};

var es = /*#__PURE__*/Object.freeze({
	create: create,
	parse: parse
});

/**
 * @function getNestedProperty
 *
 * @description
 * recursive function to get the nested property at path
 *
 * @param {Array<number|string>} path the path to retrieve values from the object
 * @param {*} object the object to get values from
 * @returns {*} the retrieved values
 */
var getNestedProperty = function getNestedProperty(path, object) {
  if (path.length === 1) {
    return object ? object[path[0]] : void 0;
  }

  var property = path.shift();
  return object && object.hasOwnProperty(property) ? getNestedProperty(path, object[property]) : void 0;
};

// external dependencies
/**
 * @function createIdentity
 *
 * @description
 * create an identity method for a specific argument index
 *
 * @param {number} argIndex the index of the argument to get
 * @param {Array<number|string>|number|string} path the nested path to retrieve the value from
 * @returns {function(...Array<*>): *} the identity method for the given argument
 */

var createIdentity = function createIdentity(argIndex, path) {
  var shouldGetNestedValue = path !== void 0;
  return function () {
    // eslint-disable-next-line prefer-rest-params
    var value = arguments[argIndex < 0 ? arguments.length + argIndex : argIndex];
    return shouldGetNestedValue ? getNestedProperty(parse(path), value) : value;
  };
};
var identity = createIdentity(0);
var identitySecond = createIdentity(1);
var identityLast = createIdentity(-1);
var identitySecondLast = createIdentity(-2);

var es$1 = /*#__PURE__*/Object.freeze({
	createIdentity: createIdentity,
	identity: identity,
	identitySecond: identitySecond,
	identityLast: identityLast,
	identitySecondLast: identitySecondLast
});

var fastEquals = createCommonjsModule(function (module, exports) {
(function (global, factory) {
  factory(exports);
}(commonjsGlobal, function (exports) {
  /**
   * @constant {boolean} HAS_MAP_SUPPORT
   */
  var HAS_MAP_SUPPORT = typeof Map === 'function';
  /**
   * @constant {boolean} HAS_SET_SUPPORT
   */

  var HAS_SET_SUPPORT = typeof Set === 'function';
  /**
   * @constant {boolean} HAS_WEAKSET_SUPPORT
   */

  var HAS_WEAKSET_SUPPORT = typeof WeakSet === 'function';

  // constants
  var keys = Object.keys;
  /**
   * @function addObjectToCache
   *
   * @description
   * add object to cache if it is indeed an object
   *
   * @param {any} object the object to potentially add to the cache
   * @param {Object|WeakSet} cache the cache to add to
   * @returns {void}
   */

  var addObjectToCache = function addObjectToCache(object, cache) {
    return object && typeof object === 'object' && cache.add(object);
  };
  /**
   *
   * @param {Array<Array<any>>} pairs the pairs to check in
   * @param {Array<any>} pairToMatch the pair to check if exists
   * @param {function} isEqual the equality comparator
   * @param {any} meta the meta item to pass through
   * @returns {boolean} does the pair exist in the pairs
   */

  var hasPair = function hasPair(pairs, pairToMatch, isEqual, meta) {
    var pair;

    for (var index = 0; index < pairs.length; index++) {
      pair = pairs[index];

      if (isEqual(pair[0], pairToMatch[0], meta) && isEqual(pair[1], pairToMatch[1], meta)) {
        return true;
      }
    }

    return false;
  };
  /**
   * @function hasValue
   *
   * @description
   * does the values include the vakye passed
   *
   * @param {Array<any>} values the values to check in
   * @param {any} item the value to locate
   * @param {function} isEqual the equality comparator
   * @param {any} meta the meta item to pass through
   * @returns {boolean} does the value exist in the values
   */

  var hasValue = function hasValue(values, item, isEqual, meta) {
    for (var index = 0; index < values.length; index++) {
      if (isEqual(values[index], item, meta)) {
        return true;
      }
    }

    return false;
  };
  /**
   * @function sameValueZeroEqual
   *
   * @description
   * are the objects passed strictly equal or both NaN
   *
   * @param {any} objectA the object to compare against
   * @param {any} objectB the object to test
   * @returns {boolean} are the objects equal by the SameValueZero principle
   */

  var sameValueZeroEqual = function sameValueZeroEqual(objectA, objectB) {
    return objectA === objectB || objectA !== objectA && objectB !== objectB;
  };
  /**
   * @function isPlainObject
   *
   * @description
   * is the object a plain object
   *
   * @param {any} object the object to test
   * @returns {boolean} is the object a plain object
   */

  var isPlainObject = function isPlainObject(object) {
    return object.constructor === Object;
  };
  /**
   * @function isPromiseLike
   *
   * @description
   * is the object promise-like (thenable)
   *
   * @param {any} object the object to test
   * @returns {boolean} is the object promise-like
   */

  var isPromiseLike = function isPromiseLike(object) {
    return typeof object.then === 'function';
  };
  /**
   * @function isReactElement
   *
   * @description
   * is the object passed a react element
   *
   * @param {any} object the object to test
   * @returns {boolean} is the object a react element
   */

  var isReactElement = function isReactElement(object) {
    return !!(object.$$typeof && object._store);
  };
  /**
   * @function getNewCache
   *
   * @description
   * get a new cache object to prevent circular references
   *
   * @returns {Object|Weakset} the new cache object
   */

  var getNewCache = function getNewCache() {
    return HAS_WEAKSET_SUPPORT ? new WeakSet() : Object.create({
      _values: [],
      add: function add(value) {
        this._values.push(value);
      },
      has: function has(value) {
        return !!~this._values.indexOf(value);
      }
    });
  };
  /**
   * @function createCircularEqual
   *
   * @description
   * create a custom isEqual handler specific to circular objects
   *
   * @param {funtion} [isEqual] the isEqual comparator to use instead of isDeepEqual
   * @returns {function(any, any): boolean}
   */

  var createCircularEqual = function createCircularEqual(isEqual) {
    return function (isDeepEqual) {
      var comparator = isEqual || isDeepEqual;
      return function (objectA, objectB, cache) {
        if (cache === void 0) {
          cache = getNewCache();
        }

        var cacheHasA = cache.has(objectA);
        var cacheHasB = cache.has(objectB);

        if (cacheHasA || cacheHasB) {
          return cacheHasA && cacheHasB;
        }

        addObjectToCache(objectA, cache);
        addObjectToCache(objectB, cache);
        return comparator(objectA, objectB, cache);
      };
    };
  };
  /**
   * @function toPairs
   *
   * @param {Map} map the map to convert to [key, value] pairs (entries)
   * @returns {Array<Array<*>>} the [key, value] pairs
   */

  var toPairs = function toPairs(map) {
    var pairs = [];
    map.forEach(function (value, key) {
      return pairs.push([key, value]);
    });
    return pairs;
  };
  /**
   * @function toValues
   *
   * @param {Set} set the set to convert to values
   * @returns {Array<*>} the values
   */

  var toValues = function toValues(set) {
    var values = [];
    set.forEach(function (value) {
      return values.push(value);
    });
    return values;
  };
  /**
   * @function areArraysEqual
   *
   * @description
   * are the arrays equal in value
   *
   * @param {Array<any>} arrayA the array to test
   * @param {Array<any>} arrayB the array to test against
   * @param {function} isEqual the comparator to determine equality
   * @param {any} meta the meta object to pass through
   * @returns {boolean} are the arrays equal
   */

  var areArraysEqual = function areArraysEqual(arrayA, arrayB, isEqual, meta) {
    if (arrayA.length !== arrayB.length) {
      return false;
    }

    for (var index = 0; index < arrayA.length; index++) {
      if (!isEqual(arrayA[index], arrayB[index], meta)) {
        return false;
      }
    }

    return true;
  };
  /**
   * @function areMapsEqual
   *
   * @description
   * are the maps equal in value
   *
   * @param {Map} mapA the map to test
   * @param {Map} mapB the map to test against
   * @param {function} isEqual the comparator to determine equality
   * @param {any} meta the meta map to pass through
   * @returns {boolean} are the maps equal
   */

  var areMapsEqual = function areMapsEqual(mapA, mapB, isEqual, meta) {
    var pairsA = toPairs(mapA);
    var pairsB = toPairs(mapB);

    if (pairsA.length !== pairsB.length) {
      return false;
    }

    for (var index = 0; index < pairsA.length; index++) {
      if (!hasPair(pairsB, pairsA[index], isEqual, meta) || !hasPair(pairsA, pairsB[index], isEqual, meta)) {
        return false;
      }
    }

    return true;
  };
  /**
   * @function areObjectsEqual
   *
   * @description
   * are the objects equal in value
   *
   * @param {Object} objectA the object to test
   * @param {Object} objectB the object to test against
   * @param {function} isEqual the comparator to determine equality
   * @param {any} meta the meta object to pass through
   * @returns {boolean} are the objects equal
   */

  var areObjectsEqual = function areObjectsEqual(objectA, objectB, isEqual, meta) {
    var keysA = keys(objectA);
    var keysB = keys(objectB);

    if (keysA.length !== keysB.length) {
      return false;
    }

    var key;

    for (var index = 0; index < keysA.length; index++) {
      key = keysA[index];

      if (!hasValue(keysB, key, sameValueZeroEqual)) {
        return false;
      } // if a react element, ignore the "_owner" key because its not necessary for equality comparisons


      if (key === '_owner' && isReactElement(objectA) && isReactElement(objectB)) {
        continue;
      }

      if (!isEqual(objectA[key], objectB[key], meta)) {
        return false;
      }
    }

    return true;
  };
  /**
   * @function areRegExpsEqual
   *
   * @description
   * are the regExps equal in value
   *
   * @param {RegExp} regExpA the regExp to test
   * @param {RegExp} regExpB the regExp to test agains
   * @returns {boolean} are the regExps equal
   */

  var areRegExpsEqual = function areRegExpsEqual(regExpA, regExpB) {
    return regExpA.source === regExpB.source && regExpA.global === regExpB.global && regExpA.ignoreCase === regExpB.ignoreCase && regExpA.multiline === regExpB.multiline && regExpA.unicode === regExpB.unicode && regExpA.sticky === regExpB.sticky && regExpA.lastIndex === regExpB.lastIndex;
  };
  /**
   * @function areSetsEqual
   *
   * @description
   * are the sets equal in value
   *
   * @param {Set} setA the set to test
   * @param {Set} setB the set to test against
   * @param {function} isEqual the comparator to determine equality
   * @param {any} meta the meta set to pass through
   * @returns {boolean} are the sets equal
   */

  var areSetsEqual = function areSetsEqual(setA, setB, isEqual, meta) {
    var valuesA = toValues(setA);
    var valuesB = toValues(setB);

    if (valuesA.length !== valuesB.length) {
      return false;
    }

    for (var index = 0; index < valuesA.length; index++) {
      if (!hasValue(valuesB, valuesA[index], isEqual, meta) || !hasValue(valuesA, valuesB[index], isEqual, meta)) {
        return false;
      }
    }

    return true;
  };

  // constants
  var isArray = Array.isArray;

  var createComparator = function createComparator(createIsEqual) {
    // eslint-disable-next-line no-use-before-define
    var isEqual = typeof createIsEqual === 'function' ? createIsEqual(comparator) : comparator;
    /**
     * @function comparator
     *
     * @description
     * compare the value of the two objects and return true if they are equivalent in values
     *
     * @param {any} objectA the object to test against
     * @param {any} objectB the object to test
     * @param {any} [meta] an optional meta object that is passed through to all equality test calls
     * @returns {boolean} are objectA and objectB equivalent in value
     */

    function comparator(objectA, objectB, meta) {
      if (sameValueZeroEqual(objectA, objectB)) {
        return true;
      }

      var typeOfA = typeof objectA;

      if (typeOfA !== typeof objectB || typeOfA !== 'object' || !objectA || !objectB) {
        return false;
      }

      if (isPlainObject(objectA) && isPlainObject(objectB)) {
        return areObjectsEqual(objectA, objectB, isEqual, meta);
      }

      var arrayA = isArray(objectA);
      var arrayB = isArray(objectB);

      if (arrayA || arrayB) {
        return arrayA === arrayB && areArraysEqual(objectA, objectB, isEqual, meta);
      }

      var dateA = objectA instanceof Date;
      var dateB = objectB instanceof Date;

      if (dateA || dateB) {
        return dateA === dateB && sameValueZeroEqual(objectA.getTime(), objectB.getTime());
      }

      var regexpA = objectA instanceof RegExp;
      var regexpB = objectB instanceof RegExp;

      if (regexpA || regexpB) {
        return regexpA === regexpB && areRegExpsEqual(objectA, objectB);
      }

      if (isPromiseLike(objectA) || isPromiseLike(objectB)) {
        return objectA === objectB;
      }

      if (HAS_MAP_SUPPORT) {
        var mapA = objectA instanceof Map;
        var mapB = objectB instanceof Map;

        if (mapA || mapB) {
          return mapA === mapB && areMapsEqual(objectA, objectB, isEqual, meta);
        }
      }

      if (HAS_SET_SUPPORT) {
        var setA = objectA instanceof Set;
        var setB = objectB instanceof Set;

        if (setA || setB) {
          return setA === setB && areSetsEqual(objectA, objectB, isEqual, meta);
        }
      }

      return areObjectsEqual(objectA, objectB, isEqual, meta);
    }

    return comparator;
  };

  // comparator
  var circularDeepEqual = createComparator(createCircularEqual());
  var circularShallowEqual = createComparator(createCircularEqual(sameValueZeroEqual));
  var deepEqual = createComparator();
  var shallowEqual = createComparator(function () {
    return sameValueZeroEqual;
  });
  var index = {
    circularDeep: circularDeepEqual,
    circularShallow: circularShallowEqual,
    createCustom: createComparator,
    deep: deepEqual,
    sameValueZero: sameValueZeroEqual,
    shallow: shallowEqual
  };

  exports.createCustomEqual = createComparator;
  exports.sameValueZeroEqual = sameValueZeroEqual;
  exports.circularDeepEqual = circularDeepEqual;
  exports.circularShallowEqual = circularShallowEqual;
  exports.deepEqual = deepEqual;
  exports.shallowEqual = shallowEqual;
  exports.default = index;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=fast-equals.js.map
});

unwrapExports(fastEquals);

function defaultEqualityCheck(a, b) {
  return a === b;
}

function areArgumentsShallowlyEqual(equalityCheck, prev, next) {
  if (prev === null || next === null || prev.length !== next.length) {
    return false;
  }

  // Do this in a for loop (and not a `forEach` or an `every`) so we can determine equality as fast as possible.
  var length = prev.length;
  for (var i = 0; i < length; i++) {
    if (!equalityCheck(prev[i], next[i])) {
      return false;
    }
  }

  return true;
}

function defaultMemoize(func) {
  var equalityCheck = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultEqualityCheck;

  var lastArgs = null;
  var lastResult = null;
  // we reference arguments instead of spreading them for performance reasons
  return function () {
    if (!areArgumentsShallowlyEqual(equalityCheck, lastArgs, arguments)) {
      // apply arguments instead of spreading for performance.
      lastResult = func.apply(null, arguments);
    }

    lastArgs = arguments;
    return lastResult;
  };
}

function getDependencies(funcs) {
  var dependencies = Array.isArray(funcs[0]) ? funcs[0] : funcs;

  if (!dependencies.every(function (dep) {
    return typeof dep === 'function';
  })) {
    var dependencyTypes = dependencies.map(function (dep) {
      return typeof dep;
    }).join(', ');
    throw new Error('Selector creators expect all input-selectors to be functions, ' + ('instead received the following types: [' + dependencyTypes + ']'));
  }

  return dependencies;
}

function createSelectorCreator(memoize) {
  for (var _len = arguments.length, memoizeOptions = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    memoizeOptions[_key - 1] = arguments[_key];
  }

  return function () {
    for (var _len2 = arguments.length, funcs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      funcs[_key2] = arguments[_key2];
    }

    var recomputations = 0;
    var resultFunc = funcs.pop();
    var dependencies = getDependencies(funcs);

    var memoizedResultFunc = memoize.apply(undefined, [function () {
      recomputations++;
      // apply arguments instead of spreading for performance.
      return resultFunc.apply(null, arguments);
    }].concat(memoizeOptions));

    // If a selector is called with the exact same arguments we don't need to traverse our dependencies again.
    var selector = memoize(function () {
      var params = [];
      var length = dependencies.length;

      for (var i = 0; i < length; i++) {
        // apply arguments instead of spreading and mutate a local list of params for performance.
        params.push(dependencies[i].apply(null, arguments));
      }

      // apply arguments instead of spreading for performance.
      return memoizedResultFunc.apply(null, params);
    });

    selector.resultFunc = resultFunc;
    selector.dependencies = dependencies;
    selector.recomputations = function () {
      return recomputations;
    };
    selector.resetRecomputations = function () {
      return recomputations = 0;
    };
    return selector;
  };
}

var createSelector = createSelectorCreator(defaultMemoize);

function createStructuredSelector(selectors) {
  var selectorCreator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : createSelector;

  if (typeof selectors !== 'object') {
    throw new Error('createStructuredSelector expects first argument to be an object ' + ('where each property is a selector, instead received a ' + typeof selectors));
  }
  var objectKeys = Object.keys(selectors);
  return selectorCreator(objectKeys.map(function (key) {
    return selectors[key];
  }), function () {
    for (var _len3 = arguments.length, values = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      values[_key3] = arguments[_key3];
    }

    return values.reduce(function (composition, value, index) {
      composition[objectKeys[index]] = value;
      return composition;
    }, {});
  });
}

var es$2 = /*#__PURE__*/Object.freeze({
	defaultMemoize: defaultMemoize,
	createSelectorCreator: createSelectorCreator,
	createSelector: createSelector,
	createStructuredSelector: createStructuredSelector
});

var curriable = createCommonjsModule(function (module, exports) {
(function (global, factory) {
  factory(exports);
}(commonjsGlobal, function (exports) {
  /**
   * @constant __ placeholder used when parameters are skipped
   */
  var __ = typeof Symbol === 'function' ? Symbol('curriable placeholder') : 0xedd1;
  /**
   * @function recursiveCurry
   *
   * @description
   * recursively curry over the arguments until all have been resolved
   *
   * @param fn the function to curry
   * @param arity the length of the function to curry until
   * @param args the existing arguments
   * @returns the result of the function call
   */
  var recursiveCurry = function (fn, arity, args) {
      return function () {
          var length = args.length;
          var newArgs = arguments;
          var newArgsLength = newArgs.length;
          var combined = [];
          var newArgsIndex = 0;
          var remaining = arity;
          var value;
          if (length) {
              for (var index = 0; index < length; index++) {
                  combined[index] = value =
                      args[index] === __ && newArgsIndex < newArgsLength
                          ? newArgs[newArgsIndex++]
                          : args[index];
                  if (value !== __) {
                      --remaining;
                  }
              }
          }
          if (newArgsIndex < newArgsLength) {
              for (; newArgsIndex < newArgsLength; newArgsIndex++) {
                  combined[combined.length] = value = newArgs[newArgsIndex];
                  if (value !== __ && newArgsIndex < arity) {
                      --remaining;
                  }
              }
          }
          return remaining > 0
              ? recursiveCurry(fn, arity, combined)
              : fn.apply(this, combined);
      };
  };

  // utils
  /**
   * @function curry
   *
   * @description
   * get the method passed as a curriable method based on its parameters
   *
   * @param fn the method to make curriable
   * @param arity the arity of the curried method
   * @returns the fn passed as a curried function
   */
  var curry = function (fn, arity) {
      if (arity === void 0) { arity = fn.length; }
      var curried = recursiveCurry(fn, arity, []);
      curried.arity = arity;
      curried.fn = fn;
      return curried;
  };
  curry.__ = __;
  /**
   * @function uncurry
   *
   * @description
   * return a function that is the non-curried version of the fn passed
   *
   * @param curried the curried function to uncurry
   * @returns the original fn
   */
  var uncurry = function (curried) { return curried.fn; };
  curry.uncurry = uncurry;

  exports.__ = __;
  exports.curry = curry;
  exports.uncurry = uncurry;
  exports.default = curry;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=curriable.js.map
});

unwrapExports(curriable);

var unchanged = createCommonjsModule(function (module, exports) {
(function (global, factory) {
  factory(exports, curriable, es);
}(commonjsGlobal, function (exports, curriable, pathington) {
  // external dependencies
  var O = Object;
  var create = O.create, getOwnPropertySymbols = O.getOwnPropertySymbols, getPrototypeOf = O.getPrototypeOf, keys = O.keys, propertyIsEnumerable = O.propertyIsEnumerable;
  var toStringObject = O.prototype.toString;
  var toStringFunction = Function.prototype.toString;
  var isArray = Array.isArray;
  /**
   * @constant REACT_ELEMENT the symbol / number specific to react elements
   */
  var REACT_ELEMENT = typeof Symbol === 'function' && typeof Symbol.for === 'function'
      ? Symbol.for('react.element')
      : 0xeac7;
  /**
   * @function cloneArray
   *
   * @description
   * clone an array to a new array
   *
   * @param array the array to clone
   * @returns the cloned array
   */
  var cloneArray = function (array) {
      // @ts-ignore
      var cloned = new array.constructor();
      for (var index = 0; index < array.length; index++) {
          cloned[index] = array[index];
      }
      return cloned;
  };
  /**
   * @function reduce
   *
   * @description
   * a targeted reduce method faster than the native
   *
   * @param array the array to reduce
   * @param fn the method to reduce each array value with
   * @param initialValue the initial value of the reduction
   * @returns the reduced value
   */
  var reduce = function (array, fn, initialValue) {
      var value = initialValue;
      for (var index = 0; index < array.length; index++) {
          value = fn(value, array[index]);
      }
      return value;
  };
  /**
   * @function getOwnProperties
   *
   * @description
   * get the all properties (keys and symbols) of the object passed
   *
   * @param object the object to get the properties of
   * @returns the keys and symbols the object has
   */
  var getOwnProperties = function (object) {
      var ownSymbols = getOwnPropertySymbols(object);
      if (!ownSymbols.length) {
          return keys(object);
      }
      return keys(object).concat(reduce(ownSymbols, function (enumerableSymbols, symbol) {
          if (propertyIsEnumerable.call(object, symbol)) {
              enumerableSymbols.push(symbol);
          }
          return enumerableSymbols;
      }, []));
  };
  /**
   * @function assignFallback
   *
   * @description
   * a targeted fallback if native Object.assign is unavailable
   *
   * @param target the object to shallowly merge into
   * @param source the object to shallowly merge into target
   * @returns the shallowly merged object
   */
  var assignFallback = function (target, source) {
      if (!source) {
          return target;
      }
      return reduce(getOwnProperties(source), function (clonedObject, property) {
          clonedObject[property] = source[property];
          return clonedObject;
      }, Object(target));
  };
  var assign = typeof O.assign === 'function' ? O.assign : assignFallback;
  /**
   * @function createWithProto
   *
   * @description
   * create a new object with the prototype of the object passed
   *
   * @param object object whose prototype will be the new object's prototype
   * @returns object with the prototype of the one passed
   */
  var createWithProto = function (object) { return create(object.__proto__ || getPrototypeOf(object)); };
  /**
   * @function isCloneable
   *
   * @description
   * is the object passed considered cloneable
   *
   * @param object the object that is being checked for cloneability
   * @returns whether the object can be cloned
   */
  var isCloneable = function (object) {
      if (!object ||
          typeof object !== 'object' ||
          object.$$typeof === REACT_ELEMENT) {
          return false;
      }
      var type = toStringObject.call(object);
      return type !== '[object Date]' && type !== '[object RegExp]';
  };
  /**
   * @function isEmptyPath
   *
   * @description
   * is the path passed an empty path
   *
   * @param path the path to check for emptiness
   * @returns whether the path passed is considered empty
   */
  var isEmptyPath = function (path) {
      return path == null || (isArray(path) && !path.length);
  };
  /**
   * @function isGlobalConstructor
   *
   * @description
   * is the fn passed a global constructor
   *
   * @param fn the fn to check if a global constructor
   * @returns whether the fn passed is a global constructor
   */
  var isGlobalConstructor = function (fn) {
      return typeof fn === 'function' &&
          !!~toStringFunction.call(fn).indexOf('[native code]');
  };
  /**
   * @function callIfFunction
   *
   * @description
   * if the object passed is a function, call it and return its return, else return undefined
   *
   * @param object the object to call if a function
   * @param context the context to call the function with
   * @param parameters the parameters to call the function with
   * @returns the result of the function call, or undefined
   */
  var callIfFunction = function (object, context, parameters) {
      return typeof object === 'function' ? object.apply(context, parameters) : void 0;
  };
  /**
   * @function getNewEmptyChild
   *
   * @description
   * get a new empty child object based on the key passed
   *
   * @param key the key to base the empty child on
   * @returns the empty object the child is built from
   */
  var getNewEmptyChild = function (key) {
      return typeof key === 'number' ? [] : {};
  };
  /**
   * @function getNewEmptyObject
   *
   * @description
   * get a new empty object based on the object passed
   *
   * @param object the object to base the empty object on
   * @returns an empty version of the object passed
   */
  var getNewEmptyObject = function (object) { return (isArray(object) ? [] : {}); };
  /**
   * @function getShallowClone
   *
   * @description
   * create a shallow clone of the object passed, respecting its prototype
   *
   * @param object the object to clone
   * @returns a shallow clone of the object passed
   */
  var getShallowClone = function (object) {
      if (object.constructor === O) {
          return assign({}, object);
      }
      if (isArray(object)) {
          return cloneArray(object);
      }
      return isGlobalConstructor(object.constructor)
          ? {}
          : assign(createWithProto(object), object);
  };
  /**
   * @function isSameValueZero
   *
   * @description
   * are the values equal based on SameValueZero
   *
   * @param value1 the first value to test
   * @param value2 the second value to test
   * @returns are the two values passed equal based on SameValueZero
   */
  var isSameValueZero = function (value1, value2) {
      return value1 === value2 || (value1 !== value1 && value2 !== value2);
  };
  /**
   * @function cloneIfPossible
   *
   * @description
   * clone the object if it can be cloned, otherwise return the object itself
   *
   * @param object the object to clone
   * @returns a cloned version of the object, or the object itself if not cloneable
   */
  var cloneIfPossible = function (object) {
      return isCloneable(object) ? getShallowClone(object) : object;
  };
  /**
   * @function getCloneOrEmptyObject
   *
   * @description
   * if the object is cloneable, get a clone of the object, else get a new
   * empty child object based on the key
   *
   * @param object the object to clone
   * @param nextKey the key to base the empty child object on
   * @returns a clone of the object, or an empty child object
   */
  var getCloneOrEmptyObject = function (object, nextKey) {
      return isCloneable(object) ? getShallowClone(object) : getNewEmptyChild(nextKey);
  };
  /**
   * @function getCoalescedValue
   *
   * @description
   * return the value if not undefined, otherwise return the fallback value
   *
   * @param value the value to coalesce if undefined
   * @param fallbackValue the value to coalesce to
   * @returns the coalesced value
   */
  var getCoalescedValue = function (value, fallbackValue) { return (value === void 0 ? fallbackValue : value); };
  /**
   * @function getParsedPath
   *
   * @description
   * parse the path passed into an array path
   *
   * @param path the path to parse
   * @returns the parsed path
   */
  var getParsedPath = function (path) { return (isArray(path) ? path : pathington.parse(path)); };
  /**
   * @function getCloneAtPath
   *
   * @description
   * get a new object, cloned at the path specified while leveraging
   * structural sharing for the rest of the properties
   *
   * @param path the path to clone at
   * @param object the object with cloned children at path
   * @param onMatch the method to call once the end of the path is reached
   * @param index the path index
   * @returns the object deeply cloned at the path specified
   */
  var getCloneAtPath = function (path, object, onMatch, index) {
      var key = path[index];
      var nextIndex = index + 1;
      if (nextIndex === path.length) {
          onMatch(object, key);
      }
      else {
          object[key] = getCloneAtPath(path, getCloneOrEmptyObject(object[key], path[nextIndex]), onMatch, nextIndex);
      }
      return object;
  };
  /**
   * @function getDeepClone
   *
   * @description
   * get a clone of the object at the path specified
   *
   * @param path the path to clone at
   * @param object the object to clone at the path
   * @param onMatch once a patch match is found, the callback to fire
   * @returns the clone of the object at path specified
   */
  var getDeepClone = function (path, object, onMatch) {
      var parsedPath = getParsedPath(path);
      var topLevelClone = getCloneOrEmptyObject(object, parsedPath[0]);
      if (parsedPath.length === 1) {
          onMatch(topLevelClone, parsedPath[0]);
          return topLevelClone;
      }
      return getCloneAtPath(parsedPath, topLevelClone, onMatch, 0);
  };
  /**
   * @function getMergedObject
   *
   * @description
   * merge the source into the target, either deeply or shallowly
   *
   * @param target the object to merge into
   * @param source the object being merged into the target
   * @param isDeep is the merge a deep merge
   * @returns the merged object
   */
  var getMergedObject = function (target, source, isDeep) {
      var isObject1Array = isArray(target);
      if (isObject1Array !== isArray(source) || !isCloneable(target)) {
          return cloneIfPossible(source);
      }
      if (isObject1Array) {
          return target.concat(source);
      }
      var targetClone = target.constructor === O || isGlobalConstructor(target.constructor)
          ? {}
          : createWithProto(target);
      return reduce(getOwnProperties(source), function (clone, key) {
          clone[key] =
              isDeep && isCloneable(source[key])
                  ? getMergedObject(target[key], source[key], isDeep)
                  : source[key];
          return clone;
      }, assign(targetClone, target));
  };
  /**
   * @function getValueAtPath
   *
   * @description
   * get the value at the nested property, or the fallback provided
   *
   * @param path the path to get the value from
   * @param object the object to get the value from at path
   * @param noMatchValue the value returned if no match is found
   * @returns the matching value, or the fallback provided
   */
  var getValueAtPath = function (path, object, noMatchValue) {
      var parsedPath = getParsedPath(path);
      if (parsedPath.length === 1) {
          return object
              ? getCoalescedValue(object[parsedPath[0]], noMatchValue)
              : noMatchValue;
      }
      var ref = object;
      var key = parsedPath[0];
      for (var index = 0; index < parsedPath.length - 1; index++) {
          if (!ref || !ref[key]) {
              return noMatchValue;
          }
          ref = ref[key];
          key = parsedPath[index + 1];
      }
      return ref ? getCoalescedValue(ref[key], noMatchValue) : noMatchValue;
  };
  /**
   * @function getFullPath
   *
   * @description
   * get the path to add to, based on the object and fn passed
   *
   * @param path the path to add to
   * @param object the object traversed by the path
   * @param fn the function to transform the retrieved value with
   * @returns the full path to add to
   */
  var getFullPath = function (path, object, fn) {
      var isPathEmpty = isEmptyPath(path);
      var valueAtPath = isPathEmpty
          ? object
          : fn
              ? fn(getValueAtPath(path, object))
              : getValueAtPath(path, object);
      return isArray(valueAtPath)
          ? isArray(path)
              ? path.concat([valueAtPath.length])
              : (isPathEmpty ? '' : path) + "[" + valueAtPath.length + "]"
          : path;
  };
  /**
   * @function splice
   *
   * @description
   * a faster, more targeted version of the native splice
   *
   * @param array the array to remove the value from
   * @param splicedIndex the index of the value to remove
   */
  var splice = function (array, splicedIndex) {
      if (array.length) {
          var length_1 = array.length;
          var index = splicedIndex;
          while (index < length_1 - 1) {
              array[index] = array[index + 1];
              ++index;
          }
          --array.length;
      }
  };
  /**
   * @function throwInvalidFnError
   *
   * @description
   * throw the TypeError based on the invalid handler
   *
   * @throws
   */
  var throwInvalidFnError = function () {
      throw new TypeError('handler passed is not of type "function".');
  };

  // utils
  var isArray$1 = Array.isArray;
  var slice = Array.prototype.slice;
  /**
   * @function createCall
   *
   * @description
   * create handlers for call / callWith
   *
   * @param isWithHandler is the method using a with handler
   * @returns call / callWith
   */
  var createCall = function (isWithHandler) {
      if (isWithHandler) {
          return function (fn, path, parameters, object, context) {
              if (context === void 0) { context = object; }
              if (typeof fn !== 'function') {
                  throwInvalidFnError();
              }
              var extraArgs = slice.call(arguments, 5);
              if (isEmptyPath(path)) {
                  return callIfFunction(fn.apply(void 0, [object].concat(extraArgs)), context, parameters);
              }
              var value = getValueAtPath(path, object);
              if (value === void 0) {
                  return;
              }
              var result = fn.apply(void 0, [value].concat(extraArgs));
              return callIfFunction(result, context, parameters);
          };
      }
      return function (path, parameters, object, context) {
          if (context === void 0) { context = object; }
          var callable = isEmptyPath(path)
              ? object
              : getValueAtPath(path, object);
          return callIfFunction(callable, context, parameters);
      };
  };
  /**
   * @function createGet
   *
   * @description
   * create handlers for get / getWith
   *
   * @param isWithHandler is the method using a with handler
   * @returns get / getWith
   */
  var createGet = function (isWithHandler) {
      if (isWithHandler) {
          return function (fn, path, object) {
              if (typeof fn !== 'function') {
                  throwInvalidFnError();
              }
              var extraArgs = slice.call(arguments, 4);
              if (isEmptyPath(path)) {
                  return fn.apply(void 0, [object].concat(extraArgs));
              }
              var value = getValueAtPath(path, object);
              return value === void 0 ? value : fn.apply(void 0, [value].concat(extraArgs));
          };
      }
      return function (path, object) {
          return isEmptyPath(path) ? object : getValueAtPath(path, object);
      };
  };
  /**
   * @function createGetOr
   *
   * @description
   * create handlers for getOr / getWithOr
   *
   * @param isWithHandler is the method using a with handler
   * @returns getOr / getWithOr
   */
  var createGetOr = function (isWithHandler) {
      if (isWithHandler) {
          return function (fn, noMatchValue, path, object) {
              if (typeof fn !== 'function') {
                  throwInvalidFnError();
              }
              var extraArgs = slice.call(arguments, 4);
              if (isEmptyPath(path)) {
                  return fn.apply(void 0, [object].concat(extraArgs));
              }
              var value = getValueAtPath(path, object);
              return value === void 0 ? noMatchValue : fn.apply(void 0, [value].concat(extraArgs));
          };
      }
      return function (noMatchValue, path, object) {
          return isEmptyPath(path) ? object : getValueAtPath(path, object, noMatchValue);
      };
  };
  /**
   * @function createHas
   *
   * @description
   * create handlers for has / hasWith
   *
   * @param isWithHandler is the method using a with handler
   * @returns has / hasWith
   */
  var createHas = function (isWithHandler) {
      if (isWithHandler) {
          return function (fn, path, object) {
              if (typeof fn !== 'function') {
                  throwInvalidFnError();
              }
              var extraArgs = slice.call(arguments, 3);
              if (isEmptyPath(path)) {
                  return !!fn.apply(void 0, [object].concat(extraArgs));
              }
              var value = getValueAtPath(path, object);
              return value !== void 0 && !!fn.apply(void 0, [value].concat(extraArgs));
          };
      }
      return function (path, object) {
          return isEmptyPath(path)
              ? object != null
              : getValueAtPath(path, object) !== void 0;
      };
  };
  /**
   * @function createIs
   *
   * @description
   * create handlers for is / isWith
   *
   * @param isWithHandler is the method using a with handler
   * @returns is / isWith
   */
  var createIs = function (isWithHandler) {
      if (isWithHandler) {
          return function (fn, path, value, object) {
              if (typeof fn !== 'function') {
                  throwInvalidFnError();
              }
              var extraArgs = slice.call(arguments, 4);
              if (isEmptyPath(path)) {
                  return isSameValueZero(fn.apply(void 0, [object].concat(extraArgs)), value);
              }
              return isSameValueZero(fn.apply(void 0, [getValueAtPath(path, object)].concat(extraArgs)), value);
          };
      }
      return function (path, value, object) {
          return isEmptyPath(path)
              ? isSameValueZero(object, value)
              : isSameValueZero(getValueAtPath(path, object), value);
      };
  };
  /**
   * @function createMerge
   *
   * @description
   * create handlers for merge / mergeWith
   *
   * @param isWithHandler is the method using a with handler
   * @param isDeep is the handler for a deep merge or shallow
   * @returns merge / mergeWith
   */
  var createMerge = function (isWithHandler, isDeep) {
      if (isWithHandler) {
          return function (fn, path, object) {
              if (typeof fn !== 'function') {
                  throwInvalidFnError();
              }
              var extraArgs = slice.call(arguments, 3);
              if (!isCloneable(object)) {
                  return fn.apply(void 0, [object].concat(extraArgs));
              }
              if (isEmptyPath(path)) {
                  var objectToMerge = fn.apply(void 0, [object].concat(extraArgs));
                  return objectToMerge
                      ? getMergedObject(object, objectToMerge, isDeep)
                      : object;
              }
              var hasChanged = false;
              var result = getDeepClone(path, object, function (ref, key) {
                  var objectToMerge = fn.apply(void 0, [ref[key]].concat(extraArgs));
                  if (objectToMerge) {
                      ref[key] = getMergedObject(ref[key], objectToMerge, isDeep);
                      hasChanged = true;
                  }
              });
              return hasChanged ? result : object;
          };
      }
      return function (path, objectToMerge, object) {
          if (!isCloneable(object)) {
              return objectToMerge;
          }
          return isEmptyPath(path)
              ? getMergedObject(object, objectToMerge, true)
              : getDeepClone(path, object, function (ref, key) {
                  ref[key] = getMergedObject(ref[key], objectToMerge, isDeep);
              });
      };
  };
  /**
   * @function createNot
   *
   * @description
   * create handlers for not / notWith
   *
   * @param isWithHandler not the method using a with handler
   * @returns not / notWithHandler
   */
  var createNot = function (isWithHandler) {
      var is = createIs(isWithHandler);
      return function () {
          return !is.apply(this, arguments);
      };
  };
  /**
   * @function createRemove
   *
   * @description
   * create handlers for remove / removeWith
   *
   * @param isWithHandler is the method using a with handler
   * @returns remove / removeWith
   */
  var createRemove = function (isWithHandler) {
      if (isWithHandler) {
          return function (fn, path, object) {
              if (typeof fn !== 'function') {
                  throwInvalidFnError();
              }
              var extraArgs = slice.call(arguments, 3);
              if (isEmptyPath(path)) {
                  var emptyObject = getNewEmptyObject(object);
                  return fn.apply(void 0, [emptyObject].concat(extraArgs)) ? emptyObject : object;
              }
              var value = getValueAtPath(path, object);
              return value !== void 0 && fn.apply(void 0, [value].concat(extraArgs))
                  ? getDeepClone(path, object, function (ref, key) {
                      if (isArray$1(ref)) {
                          splice(ref, key);
                      }
                      else {
                          delete ref[key];
                      }
                  })
                  : object;
          };
      }
      return function (path, object) {
          if (isEmptyPath(path)) {
              return getNewEmptyObject(object);
          }
          return getValueAtPath(path, object) !== void 0
              ? getDeepClone(path, object, function (ref, key) {
                  if (isArray$1(ref)) {
                      splice(ref, key);
                  }
                  else {
                      delete ref[key];
                  }
              })
              : object;
      };
  };
  /**
   * @function createSet
   *
   * @description
   * create handlers for set / setWith
   *
   * @param isWithHandler is the method using a with handler
   * @returns set / setWith
   */
  var createSet = function (isWithHandler) {
      if (isWithHandler) {
          return function (fn, path, object) {
              if (typeof fn !== 'function') {
                  throwInvalidFnError();
              }
              var extraArgs = slice.call(arguments, 3);
              return isEmptyPath(path)
                  ? fn.apply(void 0, [object].concat(extraArgs)) : getDeepClone(path, object, function (ref, key) {
                  ref[key] = fn.apply(void 0, [ref[key]].concat(extraArgs));
              });
          };
      }
      return function (path, value, object) {
          return isEmptyPath(path)
              ? value
              : getDeepClone(path, object, function (ref, key) {
                  ref[key] = value;
              });
      };
  };
  /**
   * @function createAdd
   *
   * @description
   * create handlers for add / addWith
   *
   * @param isWithHandler is the method using a with handler
   * @returns add / addWith
   */
  var createAdd = function (isWithHandler) {
      var add = createSet(isWithHandler);
      if (isWithHandler) {
          return function (fn, path, object) {
              return add.apply(this, [fn, getFullPath(path, object, fn), object].concat(slice.call(arguments, 3)));
          };
      }
      return function (path, value, object) { return add(getFullPath(path, object), value, object); };
  };

  // external dependencies
  var add = curriable.curry(createAdd(false), 3);
  var addWith = curriable.curry(createAdd(true), 3);
  var assign$1 = curriable.curry(createMerge(false, false), 3);
  var assignWith = curriable.curry(createMerge(true, false), 3);
  var call = curriable.curry(createCall(false), 3);
  var callWith = curriable.curry(createCall(true), 4);
  var get = curriable.curry(createGet(false), 2);
  var getOr = curriable.curry(createGetOr(false), 3);
  var getWith = curriable.curry(createGet(true), 3);
  var getWithOr = curriable.curry(createGetOr(true), 4);
  var has = curriable.curry(createHas(false), 2);
  var hasWith = curriable.curry(createHas(true), 3);
  var is = curriable.curry(createIs(false), 3);
  var isWith = curriable.curry(createIs(true), 4);
  var merge = curriable.curry(createMerge(false, true), 3);
  var mergeWith = curriable.curry(createMerge(true, true), 3);
  var not = curriable.curry(createNot(false), 3);
  var notWith = curriable.curry(createNot(true), 4);
  var remove = curriable.curry(createRemove(false), 2);
  var removeWith = curriable.curry(createRemove(true), 3);
  var set = curriable.curry(createSet(false), 3);
  var setWith = curriable.curry(createSet(true), 3);

  exports.__ = curriable.__;
  exports.add = add;
  exports.addWith = addWith;
  exports.assign = assign$1;
  exports.assignWith = assignWith;
  exports.call = call;
  exports.callWith = callWith;
  exports.get = get;
  exports.getOr = getOr;
  exports.getWith = getWith;
  exports.getWithOr = getWithOr;
  exports.has = has;
  exports.hasWith = hasWith;
  exports.is = is;
  exports.isWith = isWith;
  exports.merge = merge;
  exports.mergeWith = mergeWith;
  exports.not = not;
  exports.notWith = notWith;
  exports.remove = remove;
  exports.removeWith = removeWith;
  exports.set = set;
  exports.setWith = setWith;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=unchanged.js.map
});

unwrapExports(unchanged);

var selectorator = createCommonjsModule(function (module, exports) {
(function (global, factory) {
  factory(exports, es$1, fastEquals, es$2, unchanged);
}(commonjsGlobal, function (exports, identitate, fastEquals, reselect, unchanged) {
  var INVALID_ARRAY_PATHS_MESSAGE = 'You have not provided any values for paths, so no values can be retrieved from state.';
  var INVALID_PATHS_MESSAGE = [
      'First parameter passed must be either an array or a plain object.',
      'If you are creating a standard selector, pass an array of either',
      'properties on the state to retrieve, or custom selector functions.',
      'If creating a structured selector, pass a plain object with source',
      'and destination properties, where source is an array of properties',
      'or custom selector functions, and destination is an array of property',
      'names to assign the values from source to.',
  ].join(' ');
  var INVALID_OBJECT_PATH_MESSAGE = "\nWhen providing an object path, you must provide the following properties:\n  * path: the path to retrieve, e.g. \"foo.bar\"\n  * argIndx: the index of the argument to retrieve the path from\n".trim();
  var INVALID_PATH_MESSAGE = "\nPath provided is of invalid type. It can be any one of the following values:\n  * Dot-bracket notation, e.g. \"foo.bar\" or \"bar[0].baz\"\n  * Number index, e.g. 0\n  * Object {path, argIndex}, e.g. {path: \"foo.bar\", argIndex: 1}\n  * Selector function\n".trim();

  // external dependencies
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  /**
   * @private
   *
   * @function isFunctionPath
   *
   * @description
   * is the path a function
   *
   * @param path the path to test
   * @param type the typeof value for the path
   * @returns is the path a function
   */
  var isFunctionPath = function (path, type) { return type === 'function'; };
  /**
   * @private
   *
   * @function isObjectPath
   *
   * @description
   * is the path an object
   *
   * @param path the path to test
   * @param type the typeof value for the path
   * @returns is the path an object
   */
  var isObjectPath = function (path, type) { return !!path && type === 'object'; };
  /**
   * @private
   *
   * @function isUnchangedPath
   *
   * @description
   * is the path an unchanged path value
   *
   * @param path the path to test
   * @param type the typeof value for the path
   * @returns is the path an unchanged path value
   */
  var isUnchangedPath = function (path, type) {
      return type === 'string' || type === 'number' || Array.isArray(path);
  };
  /**
   * @private
   *
   * @function createIdentitySelector
   *
   * @description
   * based on the path passed, create the identity function for it or return the function itself
   *
   * @param path nested path to retrieve from the state object
   * @returns identity function to retrieve value from state for given property
   */
  var createIdentitySelector = function (path) {
      var type = typeof path;
      if (isFunctionPath(path, type)) {
          return path;
      }
      if (isUnchangedPath(path, type)) {
          return function (state) { return unchanged.get(path, state); };
      }
      if (isObjectPath(path, type)) {
          if (hasOwnProperty.call(path, 'path') &&
              hasOwnProperty.call(path, 'argIndex')) {
              var selectorIdentity_1 = identitate.createIdentity(path.argIndex);
              return function () {
                  return unchanged.get(path.path, selectorIdentity_1.apply(null, arguments));
              };
          }
          throw new ReferenceError(INVALID_OBJECT_PATH_MESSAGE);
      }
      throw new TypeError(INVALID_PATH_MESSAGE);
  };
  /**
   * @private
   *
   * @function getSelectorCreator
   *
   * @description
   * get the creator function to use when generating the selector
   *
   * @param deepEqual should the memoizer be based on strict equality
   * @param isEqual the custom equality method to use when comparing values
   * @param memoizer custom selector memoizer
   * @param memoizerParams custom parameters to pass to the memoizer function
   * @returns function to create selector with
   */
  var getSelectorCreator = function (_a) {
      var _b = _a.deepEqual, deepEqual = _b === void 0 ? false : _b, _c = _a.isEqual, isEqual = _c === void 0 ? fastEquals.sameValueZeroEqual : _c, memoizer = _a.memoizer, _d = _a.memoizerParams, memoizerParams = _d === void 0 ? [] : _d;
      var _e;
      var memoizerFn = memoizer || reselect.defaultMemoize;
      var equals = deepEqual ? fastEquals.deepEqual : isEqual;
      return (_e = reselect.createSelectorCreator).call.apply(_e, [// fix strict mode error
          null,
          memoizerFn,
          equals].concat(memoizerParams));
  };
  /**
   * @private
   *
   * @function getStandardSelector
   *
   * @description
   * get a standard selector based on the paths and getComputedValue provided
   *
   * @param paths paths to retrieve values from state from
   * @param selectorCreator function to create selector with
   * @param getComputedValue function to compute values with, receiving properties in state based
   *   on paths and returning computed values from them (defaults to pass-through identity function)
   * @returns selector to return computed value from state
   */
  var getStandardSelector = function (paths, selectorCreator, getComputedValue) {
      return selectorCreator(paths.map(createIdentitySelector), getComputedValue);
  };
  /**
   * @private
   *
   * @function getStructuredObject
   *
   * @description
   * get the structured object based on the computed selector values
   *
   * @param properties properties to assign values from state to
   * @returns object of property => selected value pairs
   */
  var getStructuredObject = function (properties) { return function () {
      var values = [];
      for (var _i = 0; _i < arguments.length; _i++) {
          values[_i] = arguments[_i];
      }
      return properties.reduce(function (structuredObject, property, index) {
          structuredObject[property] = values[index];
          return structuredObject;
      }, {});
  }; };
  /**
   * @private
   *
   * @function getStructuredSelector
   *
   * @description
   * get an object of property => selected value pairs bsaed on paths
   *
   * @param paths property => path pairs, where path is state value to retrieve and assign to property
   * @param selectorCreator function to create selector with
   * @returns selector to return structured values from state
   */
  var getStructuredSelector = function (paths, selectorCreator) {
      var destinationKeys = Object.keys(paths);
      var selectors = destinationKeys.map(function (key) { return createIdentitySelector(paths[key]); });
      return selectorCreator(selectors, getStructuredObject(destinationKeys));
  };

  // external dependencies
  function createSelector(// actual implementation - no changes
  paths, getComputedValue, options) {
      if (getComputedValue === void 0) { getComputedValue = identitate.identity; }
      if (options === void 0) { options = {}; }
      var selectorCreator = getSelectorCreator(options);
      if (Array.isArray(paths)) {
          if (!paths.length) {
              throw new ReferenceError(INVALID_ARRAY_PATHS_MESSAGE);
          }
          return getStandardSelector(paths, selectorCreator, getComputedValue);
      }
      // added null check
      if (paths && paths !== null && typeof paths === 'object') {
          return getStructuredSelector(paths, selectorCreator);
      }
      throw new TypeError(INVALID_PATHS_MESSAGE);
  }

  exports.default = createSelector;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=selectorator.js.map
});

unwrapExports(selectorator);

/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
var randomString$1 = function randomString() {
  return Math.random().toString(36).substring(7).split('').join('.');
};

var ActionTypes$1 = {
  INIT: "@@redux/INIT" + randomString$1(),
  REPLACE: "@@redux/REPLACE" + randomString$1(),
  PROBE_UNKNOWN_ACTION: function PROBE_UNKNOWN_ACTION() {
    return "@@redux/PROBE_UNKNOWN_ACTION" + randomString$1();
  }
};

/**
 * @param {any} obj The object to inspect.
 * @returns {boolean} True if the argument appears to be a plain object.
 */
function isPlainObject$1(obj) {
  if (typeof obj !== 'object' || obj === null) return false;
  var proto = obj;

  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(obj) === proto;
}

/**
 * Creates a Redux store that holds the state tree.
 * The only way to change the data in the store is to call `dispatch()` on it.
 *
 * There should only be a single store in your app. To specify how different
 * parts of the state tree respond to actions, you may combine several reducers
 * into a single reducer function by using `combineReducers`.
 *
 * @param {Function} reducer A function that returns the next state tree, given
 * the current state tree and the action to handle.
 *
 * @param {any} [preloadedState] The initial state. You may optionally specify it
 * to hydrate the state from the server in universal apps, or to restore a
 * previously serialized user session.
 * If you use `combineReducers` to produce the root reducer function, this must be
 * an object with the same shape as `combineReducers` keys.
 *
 * @param {Function} [enhancer] The store enhancer. You may optionally specify it
 * to enhance the store with third-party capabilities such as middleware,
 * time travel, persistence, etc. The only store enhancer that ships with Redux
 * is `applyMiddleware()`.
 *
 * @returns {Store} A Redux store that lets you read the state, dispatch actions
 * and subscribe to changes.
 */

function createStore$1(reducer, preloadedState, enhancer) {
  var _ref2;

  if (typeof preloadedState === 'function' && typeof enhancer === 'function' || typeof enhancer === 'function' && typeof arguments[3] === 'function') {
    throw new Error('It looks like you are passing several store enhancers to ' + 'createStore(). This is not supported. Instead, compose them ' + 'together to a single function');
  }

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore$1)(reducer, preloadedState);
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }
  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */


  function getState() {
    if (isDispatching) {
      throw new Error('You may not call store.getState() while the reducer is executing. ' + 'The reducer has already received the state as an argument. ' + 'Pass it down from the top reducer instead of reading it from the store.');
    }

    return currentState;
  }
  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */


  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected the listener to be a function.');
    }

    if (isDispatching) {
      throw new Error('You may not call store.subscribe() while the reducer is executing. ' + 'If you would like to be notified after the store has been updated, subscribe from a ' + 'component and invoke store.getState() in the callback to access the latest state. ' + 'See https://redux.js.org/api-reference/store#subscribe(listener) for more details.');
    }

    var isSubscribed = true;
    ensureCanMutateNextListeners();
    nextListeners.push(listener);
    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      if (isDispatching) {
        throw new Error('You may not unsubscribe from a store listener while the reducer is executing. ' + 'See https://redux.js.org/api-reference/store#subscribe(listener) for more details.');
      }

      isSubscribed = false;
      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
    };
  }
  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */


  function dispatch(action) {
    if (!isPlainObject$1(action)) {
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    var listeners = currentListeners = nextListeners;

    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener();
    }

    return action;
  }
  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */


  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.');
    }

    currentReducer = nextReducer;
    dispatch({
      type: ActionTypes$1.REPLACE
    });
  }
  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/tc39/proposal-observable
   */


  function observable() {
    var _ref;

    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe: function subscribe(observer) {
        if (typeof observer !== 'object' || observer === null) {
          throw new TypeError('Expected the observer to be an object.');
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }

        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return {
          unsubscribe: unsubscribe
        };
      }
    }, _ref[result] = function () {
      return this;
    }, _ref;
  } // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.


  dispatch({
    type: ActionTypes$1.INIT
  });
  return _ref2 = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  }, _ref2[result] = observable, _ref2;
}

function getUndefinedStateErrorMessage$1(key, action) {
  var actionType = action && action.type;
  var actionDescription = actionType && "action \"" + String(actionType) + "\"" || 'an action';
  return "Given " + actionDescription + ", reducer \"" + key + "\" returned undefined. " + "To ignore an action, you must explicitly return the previous state. " + "If you want this reducer to hold no value, you can return null instead of undefined.";
}

function assertReducerShape$1(reducers) {
  Object.keys(reducers).forEach(function (key) {
    var reducer = reducers[key];
    var initialState = reducer(undefined, {
      type: ActionTypes$1.INIT
    });

    if (typeof initialState === 'undefined') {
      throw new Error("Reducer \"" + key + "\" returned undefined during initialization. " + "If the state passed to the reducer is undefined, you must " + "explicitly return the initial state. The initial state may " + "not be undefined. If you don't want to set a value for this reducer, " + "you can use null instead of undefined.");
    }

    if (typeof reducer(undefined, {
      type: ActionTypes$1.PROBE_UNKNOWN_ACTION()
    }) === 'undefined') {
      throw new Error("Reducer \"" + key + "\" returned undefined when probed with a random type. " + ("Don't try to handle " + ActionTypes$1.INIT + " or other actions in \"redux/*\" ") + "namespace. They are considered private. Instead, you must return the " + "current state for any unknown actions, unless it is undefined, " + "in which case you must return the initial state, regardless of the " + "action type. The initial state may not be undefined, but can be null.");
    }
  });
}
/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */


function combineReducers$1(reducers) {
  var reducerKeys = Object.keys(reducers);
  var finalReducers = {};

  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i];

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }

  var finalReducerKeys = Object.keys(finalReducers);

  var shapeAssertionError;

  try {
    assertReducerShape$1(finalReducers);
  } catch (e) {
    shapeAssertionError = e;
  }

  return function combination(state, action) {
    if (state === void 0) {
      state = {};
    }

    if (shapeAssertionError) {
      throw shapeAssertionError;
    }

    var hasChanged = false;
    var nextState = {};

    for (var _i = 0; _i < finalReducerKeys.length; _i++) {
      var _key = finalReducerKeys[_i];
      var reducer = finalReducers[_key];
      var previousStateForKey = state[_key];
      var nextStateForKey = reducer(previousStateForKey, action);

      if (typeof nextStateForKey === 'undefined') {
        var errorMessage = getUndefinedStateErrorMessage$1(_key, action);
        throw new Error(errorMessage);
      }

      nextState[_key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }

    return hasChanged ? nextState : state;
  };
}

function bindActionCreator(actionCreator, dispatch) {
  return function () {
    return dispatch(actionCreator.apply(this, arguments));
  };
}
/**
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly. This is just a convenience method, as you can call
 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
 *
 * For convenience, you can also pass a single function as the first argument,
 * and get a function in return.
 *
 * @param {Function|Object} actionCreators An object whose values are action
 * creator functions. One handy way to obtain it is to use ES6 `import * as`
 * syntax. You may also pass a single function.
 *
 * @param {Function} dispatch The `dispatch` function available on your Redux
 * store.
 *
 * @returns {Function|Object} The object mimicking the original object, but with
 * every action creator wrapped into the `dispatch` call. If you passed a
 * function as `actionCreators`, the return value will also be a single
 * function.
 */


function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error("bindActionCreators expected an object or a function, instead received " + (actionCreators === null ? 'null' : typeof actionCreators) + ". " + "Did you write \"import ActionCreators from\" instead of \"import * as ActionCreators from\"?");
  }

  var keys = Object.keys(actionCreators);
  var boundActionCreators = {};

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var actionCreator = actionCreators[key];

    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }

  return boundActionCreators;
}

function _defineProperty$1(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread$1(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty$1(target, key, source[key]);
    });
  }

  return target;
}

/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */
function compose$1() {
  for (var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(function (a, b) {
    return function () {
      return a(b.apply(void 0, arguments));
    };
  });
}

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */

function applyMiddleware$1() {
  for (var _len = arguments.length, middlewares = new Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }

  return function (createStore) {
    return function () {
      var store = createStore.apply(void 0, arguments);

      var _dispatch = function dispatch() {
        throw new Error("Dispatching while constructing your middleware is not allowed. " + "Other middleware would not be applied to this dispatch.");
      };

      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch() {
          return _dispatch.apply(void 0, arguments);
        }
      };
      var chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = compose$1.apply(void 0, chain)(store.dispatch);
      return _objectSpread$1({}, store, {
        dispatch: _dispatch
      });
    };
  };
}

var redux = /*#__PURE__*/Object.freeze({
	createStore: createStore$1,
	combineReducers: combineReducers$1,
	bindActionCreators: bindActionCreators,
	applyMiddleware: applyMiddleware$1,
	compose: compose$1,
	__DO_NOT_USE__ActionTypes: ActionTypes$1
});

var reduxDevtoolsExtension = createCommonjsModule(function (module, exports) {

var compose = redux.compose;

exports.__esModule = true;
exports.composeWithDevTools = (
  typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ :
    function() {
      if (arguments.length === 0) return undefined;
      if (typeof arguments[0] === 'object') return compose;
      return compose.apply(null, arguments);
    }
);

exports.devToolsEnhancer = (
  typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__ ?
    window.__REDUX_DEVTOOLS_EXTENSION__ :
    function() { return function(noop) { return noop; } }
);
});

unwrapExports(reduxDevtoolsExtension);
var reduxDevtoolsExtension_1 = reduxDevtoolsExtension.composeWithDevTools;
var reduxDevtoolsExtension_2 = reduxDevtoolsExtension.devToolsEnhancer;

function createThunkMiddleware(extraArgument) {
  return function (_ref) {
    var dispatch = _ref.dispatch,
        getState = _ref.getState;
    return function (next) {
      return function (action) {
        if (typeof action === 'function') {
          return action(dispatch, getState, extraArgument);
        }

        return next(action);
      };
    };
  };
}

var thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

function _typeof$1(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof$1 = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof$1 = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof$1(obj);
}

function _defineProperty$2(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

/**
 * Returns true if the passed value is "plain" object, i.e. an object whose
 * protoype is the root `Object.prototype`. This includes objects created
 * using object literals, but not for instance for class instances.
 *
 * @param {any} value The value to inspect.
 * @returns {boolean} True if the argument appears to be a plain object.
 */
function isPlainObject$2(value) {
  if (_typeof$1(value) !== 'object' || value === null) return false;
  var proto = value;

  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(value) === proto;
}

var IS_PRODUCTION = 'production' === 'production';
/**
 * Returns any array containing the default middleware installed by
 * `configureStore()`. Useful if you want to configure your store with a custom
 * `middleware` array but still keep the default set.
 *
 * @return The default middleware used by `configureStore()`.
 */

function getDefaultMiddleware() {
  var middlewareArray = [thunk];

  return middlewareArray;
}
/**
 * Options for `configureStore()`.
 */

/**
 * A friendly abstraction over the standard Redux `createStore()` function.
 *
 * @param config The store configuration.
 * @returns A configured Redux store.
 */
function configureStore(options) {
  var _ref = options || {},
      _ref$reducer = _ref.reducer,
      reducer = _ref$reducer === void 0 ? undefined : _ref$reducer,
      _ref$middleware = _ref.middleware,
      middleware = _ref$middleware === void 0 ? getDefaultMiddleware() : _ref$middleware,
      _ref$devTools = _ref.devTools,
      devTools = _ref$devTools === void 0 ? true : _ref$devTools,
      _ref$preloadedState = _ref.preloadedState,
      preloadedState = _ref$preloadedState === void 0 ? undefined : _ref$preloadedState,
      _ref$enhancers = _ref.enhancers,
      enhancers = _ref$enhancers === void 0 ? [] : _ref$enhancers;

  var rootReducer;

  if (typeof reducer === 'function') {
    rootReducer = reducer;
  } else if (isPlainObject$2(reducer)) {
    rootReducer = combineReducers(reducer);
  } else {
    throw new Error('Reducer argument must be a function or an object of functions that can be passed to combineReducers');
  }

  var middlewareEnhancer = applyMiddleware.apply(void 0, _toConsumableArray(middleware));
  var finalCompose = compose;

  if (devTools) {
    finalCompose = reduxDevtoolsExtension_1({
      // Enable capture of stack traces for dispatched Redux actions
      // @ts-ignore redux-devtools-extension doesn't have `trace` defined in
      // its type definition file yet:
      //
      // https://github.com/zalmoxisus/redux-devtools-extension/pull/624
      trace: !IS_PRODUCTION
    });
  }

  var storeEnhancers = [middlewareEnhancer].concat(_toConsumableArray(enhancers));
  var composedEnhancer = finalCompose.apply(void 0, _toConsumableArray(storeEnhancers));
  return createStore(rootReducer, preloadedState, composedEnhancer);
}

/**
 * An action with a string type and an associated payload. This is the
 * type of action returned by `createAction()` action creators.
 *
 * @template P The type of the action's payload.
 * @template T the type used for the action type.
 */

/**
 * An action creator that produces actions with a `payload` attribute.
 */

/**
 * A utility function to create an action creator for the given action type
 * string. The action creator accepts a single argument, which will be included
 * in the action object as a field called payload. The action creator function
 * will also have its toString() overriden so that it returns the action type,
 * allowing it to be used in reducer logic that is looking for that action type.
 *
 * @param type The action type to use for created actions.
 */
function createAction(type) {
  function actionCreator(payload) {
    return {
      type: type,
      payload: payload
    };
  }

  actionCreator.toString = function () {
    return "".concat(type);
  };

  actionCreator.type = type;
  return actionCreator;
}

/**
 * A utility function that allows defining a reducer as a mapping from action
 * type to *case reducer* functions that handle these action types. The
 * reducer's initial state is passed as the first argument.
 *
 * The body of every case reducer is implicitly wrapped with a call to
 * `produce()` from the [immer](https://github.com/mweststrate/immer) library.
 * This means that rather than returning a new state object, you can also
 * mutate the passed-in state object directly; these mutations will then be
 * automatically and efficiently translated into copies, giving you both
 * convenience and immutability.
 *
 * @param initialState The initial state to be returned by the reducer.
 * @param actionsMap A mapping from action types to action-type-specific
 *   case redeucers.
 */
function createReducer(initialState, actionsMap) {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments.length > 1 ? arguments[1] : undefined;
    // @ts-ignore createNextState() produces an Immutable<Draft<S>> rather
    // than an Immutable<S>, and TypeScript cannot find out how to reconcile
    // these two types.
    return produce(state, function (draft) {
      var caseReducer = actionsMap[action.type];
      return caseReducer ? caseReducer(draft, action) : undefined;
    });
  };
}

function createSliceSelector(slice) {
  if (!slice) {
    return function (state) {
      return state;
    };
  }

  return function (state) {
    return state[slice];
  };
}
function createSelectorName(slice) {
  if (!slice) {
    return 'getState';
  }

  return camelize("get ".concat(slice));
}

function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
    return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
  }).replace(/\s+/g, '').replace(/[-_]/g, '');
}

/**
 * An action creator atttached to a slice.
 */

function getType$1(slice, actionKey) {
  return slice ? "".concat(slice, "/").concat(actionKey) : actionKey;
}
/**
 * A function that accepts an initial state, an object full of reducer
 * functions, and optionally a "slice name", and automatically generates
 * action creators, action types, and selectors that correspond to the
 * reducers and state.
 *
 * The `reducer` argument is passed to `createReducer()`.
 */


function createSlice(options) {
  var _options$slice = options.slice,
      slice = _options$slice === void 0 ? '' : _options$slice,
      initialState = options.initialState;
  var reducers = options.reducers || {};
  var extraReducers = options.extraReducers || {};
  var actionKeys = Object.keys(reducers);
  var reducerMap = actionKeys.reduce(function (map, actionKey) {
    map[getType$1(slice, actionKey)] = reducers[actionKey];
    return map;
  }, extraReducers);
  var reducer = createReducer(initialState, reducerMap);
  var actionMap = actionKeys.reduce(function (map, action) {
    var type = getType$1(slice, action);
    map[action] = createAction(type);
    return map;
  }, {});

  var selectors = _defineProperty$2({}, createSelectorName(slice), createSliceSelector(slice));

  return {
    slice: slice,
    reducer: reducer,
    actions: actionMap,
    selectors: selectors
  };
}

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

var _isPrototype = isPrototype;

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

var _overArg = overArg;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = _overArg(Object.keys, Object);

var _nativeKeys = nativeKeys;

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto$1.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!_isPrototype(object)) {
    return _nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

var _baseKeys = baseKeys;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

var _freeGlobal = freeGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root$1 = _freeGlobal || freeSelf || Function('return this')();

var _root = root$1;

/** Built-in value references. */
var Symbol$1 = _root.Symbol;

var _Symbol = Symbol$1;

/** Used for built-in method references. */
var objectProto$2 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto$2.toString;

/** Built-in value references. */
var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty$1.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

var _getRawTag = getRawTag;

/** Used for built-in method references. */
var objectProto$3 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$3.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

var _objectToString = objectToString;

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag$1 && symToStringTag$1 in Object(value))
    ? _getRawTag(value)
    : _objectToString(value);
}

var _baseGetTag = baseGetTag;

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

var isObject_1 = isObject;

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject_1(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = _baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

var isFunction_1 = isFunction;

/** Used to detect overreaching core-js shims. */
var coreJsData = _root['__core-js_shared__'];

var _coreJsData = coreJsData;

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(_coreJsData && _coreJsData.keys && _coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

var _isMasked = isMasked;

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

var _toSource = toSource;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto$1 = Function.prototype,
    objectProto$4 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$4.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString$1.call(hasOwnProperty$2).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject_1(value) || _isMasked(value)) {
    return false;
  }
  var pattern = isFunction_1(value) ? reIsNative : reIsHostCtor;
  return pattern.test(_toSource(value));
}

var _baseIsNative = baseIsNative;

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

var _getValue = getValue;

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = _getValue(object, key);
  return _baseIsNative(value) ? value : undefined;
}

var _getNative = getNative;

/* Built-in method references that are verified to be native. */
var DataView = _getNative(_root, 'DataView');

var _DataView = DataView;

/* Built-in method references that are verified to be native. */
var Map$1 = _getNative(_root, 'Map');

var _Map = Map$1;

/* Built-in method references that are verified to be native. */
var Promise$1 = _getNative(_root, 'Promise');

var _Promise = Promise$1;

/* Built-in method references that are verified to be native. */
var Set$1 = _getNative(_root, 'Set');

var _Set = Set$1;

/* Built-in method references that are verified to be native. */
var WeakMap = _getNative(_root, 'WeakMap');

var _WeakMap = WeakMap;

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = _toSource(_DataView),
    mapCtorString = _toSource(_Map),
    promiseCtorString = _toSource(_Promise),
    setCtorString = _toSource(_Set),
    weakMapCtorString = _toSource(_WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = _baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((_DataView && getTag(new _DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (_Map && getTag(new _Map) != mapTag) ||
    (_Promise && getTag(_Promise.resolve()) != promiseTag) ||
    (_Set && getTag(new _Set) != setTag) ||
    (_WeakMap && getTag(new _WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = _baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? _toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

var _getTag = getTag;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

var isObjectLike_1 = isObjectLike;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike_1(value) && _baseGetTag(value) == argsTag;
}

var _baseIsArguments = baseIsArguments;

/** Used for built-in method references. */
var objectProto$5 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$5.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto$5.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = _baseIsArguments(function() { return arguments; }()) ? _baseIsArguments : function(value) {
  return isObjectLike_1(value) && hasOwnProperty$3.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

var isArguments_1 = isArguments;

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray$1 = Array.isArray;

var isArray_1 = isArray$1;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

var isLength_1 = isLength;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength_1(value.length) && !isFunction_1(value);
}

var isArrayLike_1 = isArrayLike;

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

var stubFalse_1 = stubFalse;

var isBuffer_1 = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports = exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? _root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse_1;

module.exports = isBuffer;
});

/** `Object#toString` result references. */
var argsTag$1 = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag$1 = '[object Function]',
    mapTag$1 = '[object Map]',
    numberTag = '[object Number]',
    objectTag$1 = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag$1 = '[object Set]',
    stringTag = '[object String]',
    weakMapTag$1 = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag$1 = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag$1] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag$1] =
typedArrayTags[mapTag$1] = typedArrayTags[numberTag] =
typedArrayTags[objectTag$1] = typedArrayTags[regexpTag] =
typedArrayTags[setTag$1] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag$1] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike_1(value) &&
    isLength_1(value.length) && !!typedArrayTags[_baseGetTag(value)];
}

var _baseIsTypedArray = baseIsTypedArray;

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

var _baseUnary = baseUnary;

var _nodeUtil = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports = exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && _freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;
});

/* Node.js helper references. */
var nodeIsTypedArray = _nodeUtil && _nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? _baseUnary(nodeIsTypedArray) : _baseIsTypedArray;

var isTypedArray_1 = isTypedArray;

/** `Object#toString` result references. */
var mapTag$2 = '[object Map]',
    setTag$2 = '[object Set]';

/** Used for built-in method references. */
var objectProto$6 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$4 = objectProto$6.hasOwnProperty;

/**
 * Checks if `value` is an empty object, collection, map, or set.
 *
 * Objects are considered empty if they have no own enumerable string keyed
 * properties.
 *
 * Array-like values such as `arguments` objects, arrays, buffers, strings, or
 * jQuery-like collections are considered empty if they have a `length` of `0`.
 * Similarly, maps and sets are considered empty if they have a `size` of `0`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is empty, else `false`.
 * @example
 *
 * _.isEmpty(null);
 * // => true
 *
 * _.isEmpty(true);
 * // => true
 *
 * _.isEmpty(1);
 * // => true
 *
 * _.isEmpty([1, 2, 3]);
 * // => false
 *
 * _.isEmpty({ 'a': 1 });
 * // => false
 */
function isEmpty(value) {
  if (value == null) {
    return true;
  }
  if (isArrayLike_1(value) &&
      (isArray_1(value) || typeof value == 'string' || typeof value.splice == 'function' ||
        isBuffer_1(value) || isTypedArray_1(value) || isArguments_1(value))) {
    return !value.length;
  }
  var tag = _getTag(value);
  if (tag == mapTag$2 || tag == setTag$2) {
    return !value.size;
  }
  if (_isPrototype(value)) {
    return !_baseKeys(value).length;
  }
  for (var key in value) {
    if (hasOwnProperty$4.call(value, key)) {
      return false;
    }
  }
  return true;
}

var isEmpty_1 = isEmpty;

const CLOUD_CONNECTION_STATES = Object.freeze({
  UNCONNECTED: 'no connection',
  CONNECTED: 'connected'
});
const HUB_CONNECTION_STATES$1 = Object.freeze({
  UNCONNECTED: 'no connection',
  REMOTE: 'remote',
  LOCAL: 'local'
});
const CLOUD_API_VERSION = "ui/0.2/";
const CLOUD_URL = "https://cloud.cozify.fi/" + CLOUD_API_VERSION;

//      
// An event handler can take an optional event argument
// and should not return a value
                                          
                                                               

// An array of all currently registered event handlers for a type
                                            
                                                            
// A map of event types and their corresponding event handlers.
                        
                                 
                                   
  

/** Mitt: Tiny (~200b) functional event emitter / pubsub.
 *  @name mitt
 *  @returns {Mitt}
 */
function mitt(all                 ) {
	all = all || Object.create(null);

	return {
		/**
		 * Register an event handler for the given type.
		 *
		 * @param  {String} type	Type of event to listen for, or `"*"` for all events
		 * @param  {Function} handler Function to call in response to given event
		 * @memberOf mitt
		 */
		on: function on(type        , handler              ) {
			(all[type] || (all[type] = [])).push(handler);
		},

		/**
		 * Remove an event handler for the given type.
		 *
		 * @param  {String} type	Type of event to unregister `handler` from, or `"*"`
		 * @param  {Function} handler Handler function to remove
		 * @memberOf mitt
		 */
		off: function off(type        , handler              ) {
			if (all[type]) {
				all[type].splice(all[type].indexOf(handler) >>> 0, 1);
			}
		},

		/**
		 * Invoke all handlers for the given type.
		 * If present, `"*"` handlers are invoked after type-matched handlers.
		 *
		 * @param {String} type  The event type to invoke
		 * @param {Any} [evt]  Any value (object is recommended and powerful), passed to each handler
		 * @memberOf mitt
		 */
		emit: function emit(type        , evt     ) {
			(all[type] || []).slice().map(function (handler) { handler(evt); });
			(all['*'] || []).slice().map(function (handler) { handler(type, evt); });
		}
	};
}
//# sourceMappingURL=mitt.es.js.map

const events$1 = mitt();

const EVENTS$1 = Object.freeze({
  USER_STATE_CHANGED: 'USER STATE CHANGED',
  HUBS_LIST_CHANGED: 'HUBS LIST CHANGED',
  HUB_SELECTED: 'HUBS LIST CHANGED',
  CLOUD_CONNECTION_STATE_CHANGED: 'CLOUD CONNECTION STATE CHANGED',
  HUB_CONNECTION_STATE_CHANGED: 'HUB CONNECTION STATE CHANGED'
});

const connectionsState = createSlice({
  slice: 'connections',
  initialState: {
    cloudState: CLOUD_CONNECTION_STATES.UNCONNECTED,
    hubState: {}
  },
  reducers: {
    setCloudConnectionState(state, action) {
      const newState = action.payload;
      const oldState = state.cloudState;

      if (Object.values(CLOUD_CONNECTION_STATES).indexOf(newState) > -1) {
        if (oldState !== newState) {
          console.log("CLOUD connection state " + oldState + " -> " + newState);
          state.cloudState = newState;
          events$1.emit(EVENTS$1.CLOUD_CONNECTION_STATE_CHANGED, state.state);
        }
      }
    }

  }
});
const {
  actions,
  reducer
} = connectionsState;
const connectionsReducer = reducer;

function _defineProperty$3(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var defineProperty$1 = _defineProperty$3;

function _objectSpread$2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      defineProperty$1(target, key, source[key]);
    });
  }

  return target;
}

var objectSpread = _objectSpread$2;

const devicesState = createSlice({
  slice: 'devices',
  initialState: {},
  reducers: {
    setDevices(state, action) {
      const hubId = action.payload.hubId;
      const devices = action.payload.devices;
      const hubDevices = {};

      for (const [id, device] of Object.entries(devices)) {
        hubDevices[id] = objectSpread({}, device);
      }

      state[hubId] = objectSpread({}, hubDevices);
    },

    setDevice(state, action) {
      const hubId = action.payload.hubId;
      const device = action.payload.device;
      state[hubId][device.id] = objectSpread({}, device);
    },

    deleteDevice(state, action) {
      const hubId = action.payload.hubId;
      const device = action.payload.device;
      delete state[hubId][device.id];
    }

  }
});
const {
  actions: actions$1,
  reducer: reducer$1
} = devicesState;
const devicesReducer = reducer$1;
const {
  setDevices,
  deleteDevice
} = actions$1;

const hubsState = createSlice({
  slice: 'hubs',
  initialState: {},
  reducers: {
    updateHubs(state, action) {
      for (const [id, hub] of Object.entries(action.payload)) {
        state[id] = objectSpread({}, state[id], hub);
      }
    },

    selectHub(state, action) {
      if (state[action.payload]) {
        state[action.payload].selected = true;
      }
    },

    unSelectHub(state, action) {
      if (state[action.payload]) {
        state[action.payload].selected = false;
      }
    },

    setHubConnectionState(state, action) {
      const hubId = action.payload.hubId;
      const newState = action.payload.state;
      const oldState = state[hubId].connectionState;

      if (Object.values(HUB_CONNECTION_STATES$1).indexOf(newState) > -1) {
        if (oldState !== newState) {
          console.log(`HUB ${hubId} connection state ${oldState} -> ${newState}`);
          state[hubId].connectionState = newState;
          events.emit(EVENTS.HUB_CONNECTION_STATE_CHANGED, newState);
        }
      }
    }

  }
});
const {
  actions: actions$2,
  reducer: reducer$2
} = hubsState;
const hubsReducer = reducer$2;
const {
  updateHubs,
  selectHub,
  unSelectHub,
  setHubConnectionState
} = actions$2;

const LANGUAGES = Object.freeze({
  NONE: 'none',
  EN_UK: 'en-uk',
  FI_FI: 'fi-fi'
});
const USER_STATES = Object.freeze({
  WAITING_LANGUAGE: 'wait language',
  LANGUAGE_SET: 'language set',
  WAITING_LOGIN: 'wait login',
  LOGIN_DONE: 'login done',
  WAITING_EULA: 'wait eula',
  EULA_ACCEPTED: 'eula accepted',
  AUTHENTICATED: 'logged in',
  LOGGED_OUT: 'loged out'
});
const ROLES = Object.freeze({
  ADMIN: 32,
  USER: 8,
  GUEST: 2,
  ANONYMOUS: 1
});

const userState = createSlice({
  slice: 'user',
  initialState: {
    firstName: '',
    lastName: '',
    email: '',
    language: LANGUAGES.NONE,
    authKey: '',
    role: ROLES.ANONYMOUS,
    eulaAccepted: false,
    state: USER_STATES.WAITING_LANGUAGE
  },
  reducers: {
    changeState(state, action) {
      const newState = action.payload;
      const oldState = state.state;
      console.log("User state " + oldState + " -> " + newState);

      switch (oldState) {
        case USER_STATES.WAITING_LANGUAGE:
          {
            if (newState === USER_STATES.LANGUAGE_SET) {
              if (!isEmpty_1(state.language)) {
                state.state = USER_STATES.WAITING_LOGIN;
              }
            }

            break;
          }

        case USER_STATES.WAITING_LOGIN:
          {
            if (newState === USER_STATES.LOGIN_DONE) {
              if (!isEmpty_1(state.authKey)) {
                if (isEmpty_1(state.eulaAcceted)) {
                  state.state = USER_STATES.WAITING_EULA;
                } else {
                  state.state = USER_STATES.AUTHENTICATED;
                }
              }
            }

            break;
          }

        case USER_STATES.WAITING_EULA:
          {
            if (newState === USER_STATES.EULA_ACCEPTED) {
              state.state = USER_STATES.AUTHENTICATED;
            }

            break;
          }

        case USER_STATES.AUTHENTICATED:
          {
            if (newState === USER_STATES.LOGGED_OUT) {
              state.state = USER_STATES.WAITING_LOGIN;
            }

            break;
          }

        default:
          {
            break;
          }
      }

      if (oldState !== state.state) {
        events$1.emit(EVENTS$1.USER_STATE_CHANGED, state.state);
      }
    },

    setEula(state, action) {
      state.eulaAccepted = action.payload;
    },

    setLanguage(state, action) {
      state.language = action.payload;
    },

    setAuthKey(state, action) {
      state.authKey = action.payload;
    }

  }
});
const {
  actions: actions$3,
  reducer: reducer$3
} = userState;
const userReducer = reducer$3;

const rootReducer = {
  connections: connectionsReducer,
  devices: devicesReducer,
  hubs: hubsReducer,
  user: userReducer
};

let _store = null;
function initStore(store) {
  _store = store;
}
function getStore() {
  return _store;
}

const HUB_STATES = Object.freeze({
  LOST: 'lost',
  UNCLAIMED: 'unclaimed',
  CLAIMED: 'claimed',
  TOO_NEW_VERSION: 'new version',
  NO_ACCESS: 'no access',
  CONNECTED: 'connected'
});
const REMOTE_POLL_INTERVAL_MS = 2000;
const HUB_PROTOCOL = 'http://';
const HUB_PORT = '8893';

/** `Object#toString` result references. */
var stringTag$1 = '[object String]';

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a string, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */
function isString(value) {
  return typeof value == 'string' ||
    (!isArray_1(value) && isObjectLike_1(value) && _baseGetTag(value) == stringTag$1);
}

var isString_1 = isString;

var WHITELIST = [
	'ETIMEDOUT',
	'ECONNRESET',
	'EADDRINUSE',
	'ESOCKETTIMEDOUT',
	'ECONNREFUSED',
	'EPIPE'
];

var BLACKLIST = [
	'ENOTFOUND',
	'ENETUNREACH',

	// SSL errors from https://github.com/nodejs/node/blob/ed3d8b13ee9a705d89f9e0397d9e96519e7e47ac/src/node_crypto.cc#L1950
	'UNABLE_TO_GET_ISSUER_CERT',
	'UNABLE_TO_GET_CRL',
	'UNABLE_TO_DECRYPT_CERT_SIGNATURE',
	'UNABLE_TO_DECRYPT_CRL_SIGNATURE',
	'UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY',
	'CERT_SIGNATURE_FAILURE',
	'CRL_SIGNATURE_FAILURE',
	'CERT_NOT_YET_VALID',
	'CERT_HAS_EXPIRED',
	'CRL_NOT_YET_VALID',
	'CRL_HAS_EXPIRED',
	'ERROR_IN_CERT_NOT_BEFORE_FIELD',
	'ERROR_IN_CERT_NOT_AFTER_FIELD',
	'ERROR_IN_CRL_LAST_UPDATE_FIELD',
	'ERROR_IN_CRL_NEXT_UPDATE_FIELD',
	'OUT_OF_MEM',
	'DEPTH_ZERO_SELF_SIGNED_CERT',
	'SELF_SIGNED_CERT_IN_CHAIN',
	'UNABLE_TO_GET_ISSUER_CERT_LOCALLY',
	'UNABLE_TO_VERIFY_LEAF_SIGNATURE',
	'CERT_CHAIN_TOO_LONG',
	'CERT_REVOKED',
	'INVALID_CA',
	'PATH_LENGTH_EXCEEDED',
	'INVALID_PURPOSE',
	'CERT_UNTRUSTED',
	'CERT_REJECTED'
];

var isRetryAllowed = function (err) {
	if (!err || !err.code) {
		return true;
	}

	if (WHITELIST.indexOf(err.code) !== -1) {
		return true;
	}

	if (BLACKLIST.indexOf(err.code) !== -1) {
		return false;
	}

	return true;
};

var lib = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isNetworkError = isNetworkError;
exports.isRetryableError = isRetryableError;
exports.isSafeRequestError = isSafeRequestError;
exports.isIdempotentRequestError = isIdempotentRequestError;
exports.isNetworkOrIdempotentRequestError = isNetworkOrIdempotentRequestError;
exports.exponentialDelay = exponentialDelay;
exports.default = axiosRetry;



var _isRetryAllowed2 = _interopRequireDefault(isRetryAllowed);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var namespace = 'axios-retry';

/**
 * @param  {Error}  error
 * @return {boolean}
 */
function isNetworkError(error) {
  return !error.response && Boolean(error.code) && // Prevents retrying cancelled requests
  error.code !== 'ECONNABORTED' && // Prevents retrying timed out requests
  (0, _isRetryAllowed2.default)(error); // Prevents retrying unsafe errors
}

var SAFE_HTTP_METHODS = ['get', 'head', 'options'];
var IDEMPOTENT_HTTP_METHODS = SAFE_HTTP_METHODS.concat(['put', 'delete']);

/**
 * @param  {Error}  error
 * @return {boolean}
 */
function isRetryableError(error) {
  return error.code !== 'ECONNABORTED' && (!error.response || error.response.status >= 500 && error.response.status <= 599);
}

/**
 * @param  {Error}  error
 * @return {boolean}
 */
function isSafeRequestError(error) {
  if (!error.config) {
    // Cannot determine if the request can be retried
    return false;
  }

  return isRetryableError(error) && SAFE_HTTP_METHODS.indexOf(error.config.method) !== -1;
}

/**
 * @param  {Error}  error
 * @return {boolean}
 */
function isIdempotentRequestError(error) {
  if (!error.config) {
    // Cannot determine if the request can be retried
    return false;
  }

  return isRetryableError(error) && IDEMPOTENT_HTTP_METHODS.indexOf(error.config.method) !== -1;
}

/**
 * @param  {Error}  error
 * @return {boolean}
 */
function isNetworkOrIdempotentRequestError(error) {
  return isNetworkError(error) || isIdempotentRequestError(error);
}

/**
 * @return {number} - delay in milliseconds, always 0
 */
function noDelay() {
  return 0;
}

/**
 * @param  {number} [retryNumber=0]
 * @return {number} - delay in milliseconds
 */
function exponentialDelay() {
  var retryNumber = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

  var delay = Math.pow(2, retryNumber) * 100;
  var randomSum = delay * 0.2 * Math.random(); // 0-20% of the delay
  return delay + randomSum;
}

/**
 * Initializes and returns the retry state for the given request/config
 * @param  {AxiosRequestConfig} config
 * @return {Object}
 */
function getCurrentState(config) {
  var currentState = config[namespace] || {};
  currentState.retryCount = currentState.retryCount || 0;
  config[namespace] = currentState;
  return currentState;
}

/**
 * Returns the axios-retry options for the current request
 * @param  {AxiosRequestConfig} config
 * @param  {AxiosRetryConfig} defaultOptions
 * @return {AxiosRetryConfig}
 */
function getRequestOptions(config, defaultOptions) {
  return Object.assign({}, defaultOptions, config[namespace]);
}

/**
 * @param  {Axios} axios
 * @param  {AxiosRequestConfig} config
 */
function fixConfig(axios, config) {
  if (axios.defaults.agent === config.agent) {
    delete config.agent;
  }
  if (axios.defaults.httpAgent === config.httpAgent) {
    delete config.httpAgent;
  }
  if (axios.defaults.httpsAgent === config.httpsAgent) {
    delete config.httpsAgent;
  }
}

/**
 * Adds response interceptors to an axios instance to retry requests failed due to network issues
 *
 * @example
 *
 * import axios from 'axios';
 *
 * axiosRetry(axios, { retries: 3 });
 *
 * axios.get('http://example.com/test') // The first request fails and the second returns 'ok'
 *   .then(result => {
 *     result.data; // 'ok'
 *   });
 *
 * // Exponential back-off retry delay between requests
 * axiosRetry(axios, { retryDelay : axiosRetry.exponentialDelay});
 *
 * // Custom retry delay
 * axiosRetry(axios, { retryDelay : (retryCount) => {
 *   return retryCount * 1000;
 * }});
 *
 * // Also works with custom axios instances
 * const client = axios.create({ baseURL: 'http://example.com' });
 * axiosRetry(client, { retries: 3 });
 *
 * client.get('/test') // The first request fails and the second returns 'ok'
 *   .then(result => {
 *     result.data; // 'ok'
 *   });
 *
 * // Allows request-specific configuration
 * client
 *   .get('/test', {
 *     'axios-retry': {
 *       retries: 0
 *     }
 *   })
 *   .catch(error => { // The first request fails
 *     error !== undefined
 *   });
 *
 * @param {Axios} axios An axios instance (the axios object or one created from axios.create)
 * @param {Object} [defaultOptions]
 * @param {number} [defaultOptions.retries=3] Number of retries
 * @param {boolean} [defaultOptions.shouldResetTimeout=false]
 *        Defines if the timeout should be reset between retries
 * @param {Function} [defaultOptions.retryCondition=isNetworkOrIdempotentRequestError]
 *        A function to determine if the error can be retried
 * @param {Function} [defaultOptions.retryDelay=noDelay]
 *        A function to determine the delay between retry requests
 */
function axiosRetry(axios, defaultOptions) {
  axios.interceptors.request.use(function (config) {
    var currentState = getCurrentState(config);
    currentState.lastRequestTime = Date.now();
    return config;
  });

  axios.interceptors.response.use(null, function (error) {
    var config = error.config;

    // If we have no information to retry the request
    if (!config) {
      return Promise.reject(error);
    }

    var _getRequestOptions = getRequestOptions(config, defaultOptions),
        _getRequestOptions$re = _getRequestOptions.retries,
        retries = _getRequestOptions$re === undefined ? 3 : _getRequestOptions$re,
        _getRequestOptions$re2 = _getRequestOptions.retryCondition,
        retryCondition = _getRequestOptions$re2 === undefined ? isNetworkOrIdempotentRequestError : _getRequestOptions$re2,
        _getRequestOptions$re3 = _getRequestOptions.retryDelay,
        retryDelay = _getRequestOptions$re3 === undefined ? noDelay : _getRequestOptions$re3,
        _getRequestOptions$sh = _getRequestOptions.shouldResetTimeout,
        shouldResetTimeout = _getRequestOptions$sh === undefined ? false : _getRequestOptions$sh;

    var currentState = getCurrentState(config);

    var shouldRetry = retryCondition(error) && currentState.retryCount < retries;

    if (shouldRetry) {
      currentState.retryCount += 1;
      var delay = retryDelay(currentState.retryCount, error);

      // Axios fails merging this configuration to the default configuration because it has an issue
      // with circular structures: https://github.com/mzabriskie/axios/issues/370
      fixConfig(axios, config);

      if (!shouldResetTimeout && config.timeout && currentState.lastRequestTime) {
        var lastRequestDuration = Date.now() - currentState.lastRequestTime;
        // Minimum 1ms timeout (passing 0 or less to XHR means no timeout)
        config.timeout = Math.max(config.timeout - lastRequestDuration - delay, 1);
      }

      config.transformRequest = [function (data) {
        return data;
      }];

      return new Promise(function (resolve) {
        return setTimeout(function () {
          return resolve(axios(config));
        }, delay);
      });
    }

    return Promise.reject(error);
  });
}

// Compatibility with CommonJS
axiosRetry.isNetworkError = isNetworkError;
axiosRetry.isSafeRequestError = isSafeRequestError;
axiosRetry.isIdempotentRequestError = isIdempotentRequestError;
axiosRetry.isNetworkOrIdempotentRequestError = isNetworkOrIdempotentRequestError;
axiosRetry.exponentialDelay = exponentialDelay;
axiosRetry.isRetryableError = isRetryableError;
//# sourceMappingURL=index.js.map
});

unwrapExports(lib);
var lib_1 = lib.isNetworkError;
var lib_2 = lib.isRetryableError;
var lib_3 = lib.isSafeRequestError;
var lib_4 = lib.isIdempotentRequestError;
var lib_5 = lib.isNetworkOrIdempotentRequestError;
var lib_6 = lib.exponentialDelay;

var axiosRetry = lib.default;

let isNode = false;

if (typeof process === 'object') {
  if (typeof process.versions === 'object') {
    if (typeof process.versions.node !== 'undefined') {
      isNode = true;
      console.log("Running in node.js");
    } else {
      console.log("Running in browser");
    }
  }
}

function setCloudConnectionState(value) {
  getStore().dispatch(connectionsState.actions.setCloudConnectionState(value));
}
function setHubConnectionState$1(hubAndSate) {
  const stateNow = getStore().getState();
  const storedHubs = hubsState.selectors.getHubs(stateNow);

  if (hubAndSate.state === HUB_CONNECTION_STATES.UNCONNECTED && storedHubs[hubAndSate.hubId]) {
    if (storedHubs[hubAndSate.hubId].connectionState === HUB_CONNECTION_STATES.REMOTE) {
      hubAndSate.state = HUB_CONNECTION_STATES.LOCALE;
    }
  }

  getStore().dispatch(hubsState.actions.setHubConnectionState(hubAndSate));
}

const COMMANDS = Object.freeze({
  USER_LOGIN: {
    method: 'POST',
    url: CLOUD_URL + "user/login",
    params: ['password', 'email'],
    config: {
      responseType: isNode ? 'blob' : 'stream',
      timeout: 5000
    }
  },
  HUB_KEYS: {
    method: 'GET',
    url: CLOUD_URL + "user/hubkeys"
  },
  CLOUD_IP: {
    method: 'GET',
    url: CLOUD_URL + "hub/lan_ip"
  },
  CLOUD_META: {
    method: 'GET',
    url: CLOUD_URL + "hub/remote/hub"
  },
  POLL: {
    method: 'GET',
    url: CLOUD_URL + "hub/remote/cc/1.11" + "/hub/poll",
    urlParams: ['ts']
  }
});
function sendAll(requests) {
  return new Promise((resolve, reject) => {
    axios.all(requests).then(axios.spread(function (succ, err) {
      resolve(succ);
    })).catch(error => {
      reject(error);
    });
  });
}
function send({
  command = {},
  localUrl = '',
  hubId = '',
  url = '',
  method = 'GET',
  authKey = '',
  hubKey = '',
  config = {},
  data = {}
}) {
  let body = {};
  let remoteConnection = false;
  const hubCommand = isEmpty_1(hubId) ? false : true;

  if (typeof command != "undefined" && command) {
    if (command.method) {
      method = command.method;
    }

    if (isEmpty_1(url) && command.url) {
      url = command.url;
    }

    var parts = url.split('hub/remote');

    if (parts && parts[1]) {
      if (localUrl) {
        url = localUrl + parts[1];
        authKey = hubKey;
        hubKey = undefined;
      }
    }

    if (url.indexOf(CLOUD_URL) > -1) {
      remoteConnection = true;
    }

    if (command.params) {
      command.params.forEach(param => {
        body[param] = data[param];
      });
    }

    if (command.urlParams) {
      url = url + "?";
      command.urlParams.forEach(param => {
        url = url + param + '=' + data[param] + '&';
      });
    }

    if (command.config) {
      config = command.config;
    }
  }

  const bodyString = JSON.stringify(body);
  const reqConf = {
    timeout: 1000,
    method: method,
    headers: {
      'Accept': 'application/json, application/binary, text/plain, */*',
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': authKey,
      'X-Hub-Key': hubKey
    },
    crossDomain: true,
    responseType: 'application/json',
    url: url,
    data: isEmpty_1(bodyString) ? null : bodyString
  };
  Object.assign(reqConf, config);
  return new Promise((resolve, reject) => {
    if (command || url) {
      axios.interceptors.response.use(response => {
        if (response.headers['content-type'] === 'application/json' || response.headers['content-type'] === 'application/binary') {
          return response;
        } else {
          console.error("send: unknown response type");
          debugger;
          return Promise.reject(response);
        }
      }, error => Promise.reject(error));
      axiosRetry(axios, {
        retries: 3,
        shouldResetTimeout: true
      });
      axios(reqConf).then(function (response) {
        if (remoteConnection) {
          setCloudConnectionState(CLOUD_CONNECTION_STATES.CONNECTED);
        } else if (!isEmpty_1(hubId)) {
          setHubConnectionState$1({
            hubId: hubId,
            state: HUB_CONNECTION_STATES$1.LOCAL
          });
        }

        resolve(response.data);
      }).catch(function (error) {
        if (error.response) ; else if (error.request) ;

        if (remoteConnection) {
          if (error && error.response && error.response.status === 400) {
            console.log("send: no connection error ", error);
          } else if (error && error.response && error.response.status === 401) {
            console.error("send: unauhorized error ", error);
          } else {
            setCloudConnectionState(CLOUD_CONNECTION_STATES.UNCONNECTED);

            if (hubCommand) {
              setHubConnectionState$1({
                hubId: hubId,
                state: HUB_CONNECTION_STATES$1.UNCONNECTED
              });
            }
          }
        } else if (!isEmpty_1(hubId)) {
          setHubConnectionState$1({
            hubId: hubId,
            state: HUB_CONNECTION_STATES$1.UNCONNECTED
          });
        }

        console.error("send: error ", error);
        reject(error);
      });
    } else {
      reject(new Error('Command not found.'));
    }
  });
}

function storedUser() {
  const stateNow = getStore().getState();
  const storedUser = userState.selectors.getUser(stateNow);
  return storedUser;
}

function changeLanguage(newLanguage) {
  let retVel = false;

  if (Object.values(LANGUAGES).indexOf(newLanguage) > -1) {
    getStore().dispatch(userState.actions.setLanguage(newLanguage));

    if (storedUser().state === USER_STATES.WAITING_LANGUAGE) {
      getStore().dispatch(userState.actions.changeState(USER_STATES.LANGUAGE_SET));
    }

    retVel = true;
  }

  return retVel;
}
function acceptEula() {
  let retVel = false;
  getStore().dispatch(userState.actions.setEula(true));

  if (storedUser().state === USER_STATES.WAITING_EULA) {
    getStore().dispatch(userState.actions.changeState(USER_STATES.EULA_ACCEPTED));
  }

  retVel = true;
  return retVel;
}
function doPwLogin(email, password) {
  return new Promise((resolve, reject) => {
    send({
      command: COMMANDS.USER_LOGIN,
      data: {
        email: email,
        password: password
      }
    }).then(response => {
      if (response && isString_1(response)) {
        getStore().dispatch(userState.actions.setAuthKey(response));

        if (storedUser().state === USER_STATES.WAITING_LOGIN) {
          getStore().dispatch(userState.actions.changeState(USER_STATES.LOGIN_DONE));
        }
      }

      resolve(response);
    }).catch(error => {
      reject(false);
    });
  });
}
function getUserState() {
  return storedUser().state;
}

function deviceDeltaHandler(hubId, reset, devices) {
  let oldHubDevices = {};
  const stateNow = getStore().getState();
  const storedDevices = devicesState.selectors.getDevices(stateNow);

  if (storedDevices && storedDevices[hubId]) {
    oldHubDevices = storedDevices[hubId];
  }

  if (reset) {
    const stateDevices = {
      hubId: hubId,
      devices: devices
    };
    getStore().dispatch(devicesState.actions.setDevices(stateDevices));
  } else {
    Object.entries(devices).forEach(([key, device]) => {
      const stateDevice = {
        hubId: hubId,
        device: device
      };

      if (key && device) {
        getStore().dispatch(devicesState.actions.setDevice(stateDevice));
      } else if (key && oldHubDevices[key]) {
        getStore().dispatch(devicesState.actions.deleteDevice(stateDevice));
      }
    });
  }
}

let _hubState = HUB_STATES.LOST;

function urlBase64Decode(encoded) {
  let str = encoded.replace(/-/g, "+").replace(/_/g, "/");
  let output = str;

  switch (output.length % 4) {
    case 0:
    case 2:
      output += "==";
      break;

    case 3:
      output += "=";
      break;

    default:
      throw "Illegal base64url string!";
  }

  var retVal = "";

  let atob = function (a) {};

  if (!isNode) {
    atob = window.atob;
  } else {
    atob = function (a) {
      return new Buffer(a, 'base64').toString('binary');
    };
  }

  try {
    retVal = atob(str);
  } catch (error) {
    try {
      retVal = atob(output);
    } catch (error) {
      console.error("urlBase64Decode: trying atob failed");
    }
  }

  return retVal;
}

function setHubInfo(HUBKeys) {
  let hubs = {};

  for (let key in HUBKeys) {
    let coded = HUBKeys[key].split('.')[1];
    let decoded = urlBase64Decode(coded);
    let payload = JSON.parse(decoded);
    let info = {};
    info.id = payload.hubId || payload.hub_id;
    info.name = payload.hubName || payload.hub_name;
    info.hubKey = HUBKeys[key];
    info.connectionState = undefined;

    if (payload.role) {
      info.role = payload.role;
      info.roleString = '';
      Object.keys(ROLES).forEach(key => {
        if (ROLES[key] === info.role) info.roleString = key;
      });
    }

    hubs[info.id] = info;
  }

  return hubs;
}

function updateFoundHub(hubURL, foundHub) {
  const hubData = {};
  hubData[foundHub.hubId] = {
    connectionState: HUB_CONNECTION_STATES$1.REMOTE,
    connected: foundHub.connected,
    features: foundHub.features,
    state: foundHub.state,
    version: foundHub.version
  };

  if (hubURL) {
    hubData[foundHub.hubId].connectionState = HUB_CONNECTION_STATES$1.LOCAL;
    hubData[foundHub.hubId].url = hubURL;
  }

  console.log("Hub metadata found ", JSON.stringify(hubData));
  getStore().dispatch(hubsState.actions.updateHubs(hubData));
}

function doRemoteIdQuery(hubId, authKey, hubKey) {
  return new Promise((resolve, reject) => {
    send({
      command: COMMANDS.CLOUD_META,
      authKey: authKey,
      hubKey: hubKey,
      hubId: hubId
    }).then(hubData => {
      updateFoundHub(undefined, hubData);
      resolve(hubId);
    }).catch(error => {
      console.log(`doRemoteIdQuery ${hubId} error `, error.message);
      reject(hubId);
    });
  });
}

function doLocalIdQuery(ip) {
  if (ip) {
    const hubURL = HUB_PROTOCOL + ip + ":" + HUB_PORT;
    const url = hubURL + "/hub";
    send({
      url: url
    }).then(hubData => {
      updateFoundHub(hubURL, hubData);
    });
  }
}

function doCloudDiscovery(authKey) {
  send({
    command: COMMANDS.CLOUD_IP
  }).then(ips => {
    if (ips && !isEmpty_1(ips)) {
      console.log("doCloudDiscovery ", JSON.stringify(ips));

      for (var ip of ips) {
        doLocalIdQuery(ip);
      }
    }
  }).catch(error => {
    console.error("doCloudDiscovery error: ", error.message);
  });
}

function fetchMetaData(authKey) {
  const hubs = getHubs();
  let queries = [];

  for (var hub of Object.values(hubs)) {
    queries.push(doRemoteIdQuery(hub.id, authKey, hub.hubKey));
  }

  sendAll(queries).then(values => {}).catch(error => {}).finally(() => {
    doCloudDiscovery();
  });
}

function fetchHubTokens(authKey) {
  return new Promise((resolve, reject) => {
    send({
      command: COMMANDS.HUB_KEYS,
      authKey: authKey
    }).then(tokens => {
      if (tokens) {
        const hubs = setHubInfo(tokens);
        getStore().dispatch(hubsState.actions.updateHubs(hubs));
        events$1.emit(EVENTS$1.HUBS_LIST_CHANGED, getHubs());
        fetchMetaData(authKey);
      }

      resolve(authKey);
    }).catch(error => {
      console.error("fetchHubTokens error: ", error.message);
      reject(error);
    });
  });
}
function unSelectHubById(selectedId) {
  const hubs = getHubs();

  for (var hub of Object.values(hubs)) {
    if (selectedId === hub.id) {
      getStore().dispatch(hubsState.actions.unSelectHub(hub.id));
      stopPolling(hub.id);
    }
  }
}
function selectHubById(selectedId) {
  const hubs = getHubs();

  for (var hub of Object.values(hubs)) {
    if (selectedId === hub.id) {
      getStore().dispatch(hubsState.actions.selectHub(hub.id));
      startPolling(hub);
    }
  }
}
let pollIntervals = {};
let pollTimeStamp = 0;
function doPoll(hubId) {
  const hub = getHubs()[hubId];
  const authKey = storedUser$1().authKey;
  const hubKey = hub.hubKey;
  const reset = pollTimeStamp === 0 ? true : false;
  send({
    command: COMMANDS.POLL,
    hubId: hubId,
    authKey: authKey,
    hubKey: hubKey,
    localUrl: hub.url,
    data: {
      ts: pollTimeStamp
    }
  }).then(deltas => {
    if (deltas) {
      pollTimeStamp = deltas.timestamp;

      if (pollTimeStamp === 0) {
        reset = true;
      }

      for (let delta of deltas.polls) {
        switch (delta.type) {
          case "DEVICE_DELTA":
            {
              deviceDeltaHandler(hubId, reset, delta.devices);
              break;
            }

          case "GROUP_DELTA":
            {
              break;
            }

          case "SCENE_DELTA":
            {
              break;
            }

          case "RULE_DELTA":
            {
              break;
            }

          case "USERS_DELTA":
            {
              break;
            }

          case "ROOM_DELTA":
            {
              break;
            }

          case "ZONE_DELTA":
            {
              break;
            }

          case "ALARM_DELTA":
            {
              break;
            }

          default:
            {
              break;
            }
        }
      }
    }
  }).catch(error => {
    console.error("doPoll error: ", error.message);
  });
}
function startPolling(hub) {
  const intervalTime = REMOTE_POLL_INTERVAL_MS;
  pollIntervals[hub.id] = setInterval(doPoll, intervalTime, hub.id);
}
function stopPolling(hubId) {
  clearInterval(pollIntervals[hubId]);
}

function storedUser$1() {
  const stateNow = getStore().getState();
  const storedUser = userState.selectors.getUser(stateNow);
  return storedUser;
}

function getHubs() {
  const stateNow = getStore().getState();
  const storedHubs = hubsState.selectors.getHubs(stateNow);
  return storedHubs;
}

const store = configureStore({
  reducer: rootReducer
});
console.log("Initial state", store.getState());
initStore(store);

exports.CLOUD_CONNECTION_STATES = CLOUD_CONNECTION_STATES;
exports.EVENTS = EVENTS$1;
exports.HUB_CONNECTION_STATES = HUB_CONNECTION_STATES$1;
exports.HUB_STATES = HUB_STATES;
exports.LANGUAGES = LANGUAGES;
exports.ROLES = ROLES;
exports.USER_STATES = USER_STATES;
exports.acceptEula = acceptEula;
exports.changeLanguage = changeLanguage;
exports.deleteDevice = deleteDevice;
exports.devicesState = devicesState;
exports.doPwLogin = doPwLogin;
exports.events = events$1;
exports.fetchHubTokens = fetchHubTokens;
exports.getHubs = getHubs;
exports.getUserState = getUserState;
exports.hubsState = hubsState;
exports.selectHubById = selectHubById;
exports.setDevices = setDevices;
exports.startPolling = startPolling;
exports.stopPolling = stopPolling;
exports.store = store;
exports.unSelectHubById = unSelectHubById;
exports.updateHubs = updateHubs;
//# sourceMappingURL=sdk-node.js.map
