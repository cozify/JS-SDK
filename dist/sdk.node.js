'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var http = _interopDefault(require('http'));
var https = _interopDefault(require('https'));
var url = _interopDefault(require('url'));
var assert = _interopDefault(require('assert'));
var stream = _interopDefault(require('stream'));
var tty = _interopDefault(require('tty'));
var util = _interopDefault(require('util'));
var os = _interopDefault(require('os'));
var zlib = _interopDefault(require('zlib'));

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

var isPlainObject$1 = function isPlainObject(object) {
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
var isArray$1 = Array.isArray;

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

    if (isPlainObject$1(objectA) && isPlainObject$1(objectB)) {
      return areObjectsEqual(objectA, objectB, isEqual, meta);
    }

    var arrayA = isArray$1(objectA);
    var arrayB = isArray$1(objectB);

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

// external dependencies
var O = Object;
var create = O.create, getOwnPropertySymbols = O.getOwnPropertySymbols, getPrototypeOf = O.getPrototypeOf, keys$1 = O.keys, propertyIsEnumerable = O.propertyIsEnumerable;
var toStringObject = O.prototype.toString;
var toStringFunction = Function.prototype.toString;
var isArray$2 = Array.isArray;
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
        return keys$1(object);
    }
    return keys$1(object).concat(reduce(ownSymbols, function (enumerableSymbols, symbol) {
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
var assign$1 = typeof O.assign === 'function' ? O.assign : assignFallback;
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
    return path == null || (isArray$2(path) && !path.length);
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
var getNewEmptyObject = function (object) { return (isArray$2(object) ? [] : {}); };
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
        return assign$1({}, object);
    }
    if (isArray$2(object)) {
        return cloneArray(object);
    }
    return isGlobalConstructor(object.constructor)
        ? {}
        : assign$1(createWithProto(object), object);
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
var getParsedPath = function (path) { return (isArray$2(path) ? path : parse(path)); };
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
    var isObject1Array = isArray$2(target);
    if (isObject1Array !== isArray$2(source) || !isCloneable(target)) {
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
    }, assign$1(targetClone, target));
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
    return isArray$2(valueAtPath)
        ? isArray$2(path)
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
var isArray$1$1 = Array.isArray;
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
                    if (isArray$1$1(ref)) {
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
                if (isArray$1$1(ref)) {
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
var add = curry(createAdd(false), 3);
var addWith = curry(createAdd(true), 3);
var assign$1$1 = curry(createMerge(false, false), 3);
var assignWith = curry(createMerge(true, false), 3);
var call = curry(createCall(false), 3);
var callWith = curry(createCall(true), 4);
var get = curry(createGet(false), 2);
var getOr = curry(createGetOr(false), 3);
var getWith = curry(createGet(true), 3);
var getWithOr = curry(createGetOr(true), 4);
var has$1 = curry(createHas(false), 2);
var hasWith = curry(createHas(true), 3);
var is$1 = curry(createIs(false), 3);
var isWith = curry(createIs(true), 4);
var merge = curry(createMerge(false, true), 3);
var mergeWith = curry(createMerge(true, true), 3);
var not = curry(createNot(false), 3);
var notWith = curry(createNot(true), 4);
var remove = curry(createRemove(false), 2);
var removeWith = curry(createRemove(true), 3);
var set = curry(createSet(false), 3);
var setWith = curry(createSet(true), 3);

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

function getCjsExportFromNamespace (n) {
	return n && n['default'] || n;
}

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
function isPlainObject$2(obj) {
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
    throw new Error('It looks like you are passing several store enhancers to ' + 'createStore(). This is not supported. Instead, compose them ' + 'together to a single function.');
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
  /**
   * This makes a shallow copy of currentListeners so we can use
   * nextListeners as a temporary list while dispatching.
   *
   * This prevents any bugs around consumers calling
   * subscribe/unsubscribe in the middle of a dispatch.
   */

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
    if (!isPlainObject$2(action)) {
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

    currentReducer = nextReducer; // This action has a similiar effect to ActionTypes.INIT.
    // Any reducers that existed in both the new and old rootReducer
    // will receive the previous state. This effectively populates
    // the new state tree with any relevant data from the old one.

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

  var finalReducerKeys = Object.keys(finalReducers); // This is used to make sure we don't warn about the same

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
 * For convenience, you can also pass an action creator as the first argument,
 * and get a dispatch wrapped function in return.
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

  var boundActionCreators = {};

  for (var key in actionCreators) {
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

function ownKeys$1(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    keys.push.apply(keys, Object.getOwnPropertySymbols(object));
  }

  if (enumerableOnly) keys = keys.filter(function (sym) {
    return Object.getOwnPropertyDescriptor(object, sym).enumerable;
  });
  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys$1(source, true).forEach(function (key) {
        _defineProperty$1(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys$1(source).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
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
        throw new Error('Dispatching while constructing your middleware is not allowed. ' + 'Other middleware would not be applied to this dispatch.');
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
      return _objectSpread2({}, store, {
        dispatch: _dispatch
      });
    };
  };
}

var redux = /*#__PURE__*/Object.freeze({
	__proto__: null,
	__DO_NOT_USE__ActionTypes: ActionTypes$1,
	applyMiddleware: applyMiddleware$1,
	bindActionCreators: bindActionCreators,
	combineReducers: combineReducers$1,
	compose: compose$1,
	createStore: createStore$1
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
function isPlainObject$3(value) {
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
  } else if (isPlainObject$3(reducer)) {
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

//      
/**
 * Alarms action creators object
 * @see  https://github.com/reduxjs/redux-starter-kit/blob/master/docs/api/createSlice.md
 * @return { {
 *   slice : string,
 *   reducer : ReducerFunction,
 *   actions : Object<string, ActionCreator},
 *   selectors : Object<string, Selector>
 *   }}
 */

const alarmsState = createSlice({
  slice: 'alarms',
  initialState: {},
  reducers: {
    /*
     * Reducer action of setting alarms state - sets all given alarms of given hub, keeps existing states
     * @param {Object} state
     * @param {Object} action
     */
    setAlarms(state, action) {
      const stateToSet = state;
      const {
        hubId
      } = action.payload;
      const {
        alarms
      } = action.payload;
      const hubAlarms = {};
      Object.entries(alarms).forEach(entry => {
        const [id, alarm] = entry;
        hubAlarms[id] = { ...alarm
        };
      });
      stateToSet[hubId] = { ...hubAlarms
      };
    },

    /*
     * Reducer action of set alarm state
     * @param {Object} state
     * @param {Object} action
     */
    setAlarm(state, action) {
      const stateToSet = state;
      const {
        hubId
      } = action.payload;
      const {
        alarm
      } = action.payload;

      if (hubId && stateToSet[hubId]) {
        stateToSet[hubId][alarm.id] = { ...alarm
        };
      }
    },

    /*
     * Reducer action of removing alarm state
     * @param {Object} state
     * @param {Object} action
     */
    removeAlarm(state, action) {
      const stateToSet = state;
      const {
        hubId
      } = action.payload;
      const {
        alarmId
      } = action.payload;

      if (hubId && alarmId && stateToSet[hubId] && stateToSet[hubId][alarmId]) {
        delete stateToSet[hubId][alarmId];
      }
    }

  }
});
/*
todos.selectors.getCompletedTodoCount = createSelector(
  [todos.selectors.getTodos],
  todos =>
    todos.reduce((count, todo) => (todo.completed ? count + 1 : count), 0)
);
*/

const {
  actions,
  reducer
} = alarmsState;

//      

/**
 * Helper to check if run environment is Node
 * @type {Boolean}
 */
let isNodeInUse = false;

if (typeof process === 'object') {
  if (typeof process.versions === 'object') {
    if (typeof process.versions.node !== 'undefined') {
      isNodeInUse = true;
      console.log('Running in node.js');
    } else {
      console.log('Running in browser');
    }
  }
}

const isNode = isNodeInUse;

let atobC = a => {
  console.error('Invalid atob for string ', a);
  return 'invalid atob';
};

if (!isNodeInUse) {
  atobC = window.atob;
} else {
  const nodeAtob = a => {
    const binVal = Buffer.from(a, 'base64').toString('binary');
    return binVal;
  };

  atobC = nodeAtob;
}
/**
 * Helper method to strip HTML presentation from string
 * @param  {string} html - HTML presentation
 * @return {string}  - text string
 */


function getTextFromNode(givenHTML) {
  let html = givenHTML;
  html = html.replace(/<\/div>/ig, ''); // '\n');

  html = html.replace(/<\/li>/ig, '');
  html = html.replace(/<li>/ig, '');
  html = html.replace(/<\/ul>/ig, '');
  html = html.replace(/<\/p>/ig, ''); // eslint-disable-next-line

  html = html.replace(/<br\s*[\/]?>/gi, '');
  html = html.replace(/<[^>]+>/ig, '');
  html = html.replace(/\s\s+/g, ' ');
  return html.trim();
}
/**
 * Helper method to get HTML presentation from unicode decoded base64 string
 * @param  {string} encoded - string to be decoded
 * @return {string}  - decoded string
 */

function b64DecodeUnicode(encoded) {
  try {
    // eslint-disable-next-line
    return decodeURIComponent(Array.prototype.map.call(atobC(encoded), function (c) {
      // eslint-disable-next-line
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  } catch (error) {
    console.error('b64DecodeUnicode: trying atob failed');
    return 'b64DecodeUnicode error';
  }
}
/**
 * Helper method to Base64 decode
 * @param  {string} encoded - string to be decoded
 * @return {string}  - decoded string
 */

function urlBase64Decode(encoded) {
  const str = encoded.replace(/-/g, '+').replace(/_/g, '/');
  let output = str;

  switch (output.length % 4) {
    case 0:
    case 2:
      output += '==';
      break;

    case 3:
      output += '=';
      break;

    default:
      throw new Error('Illegal base64url string!');
  }

  let retVal = '';

  let atob = a => {
    console.error('Invalid atob for string ', a);
    return 'invalid atob';
  };

  if (!isNodeInUse) {
    atob = window.atob;
  } else {
    const nodeAtob = a => {
      const binVal = Buffer.from(a, 'base64').toString('binary');
      return binVal;
    };

    atob = nodeAtob;
  }

  try {
    retVal = atob(str);
  } catch (error) {
    try {
      retVal = atob(output);
    } catch (error2) {
      console.error('urlBase64Decode: trying atob failed');
    }
  }

  return retVal;
}

//      
/*
* Cloud servers SSL cretification fingerprints to be checked if possible
* Fingerprint could be found by opening the server URL like https://testapi.cozify.fi/ui/0.2/hub/lan_ip in Chrome.
* Then click the green certificate in front of the URL, click 'Connection', 'Certificate details', expand the details
* and scroll down to the SHA1 fingerprint.
* testapi 91 30 CF 20 17 F7 D7 EC F7 BA 43 30 8E 19 83 B4 CF DE 5A CC
* cloud & cloud2 26 B0 20 FA AB E8 A3 81 63 37 C6 B7 EF 94 4D 40 3D 1B 85 10
*/

const CLOUD_FINGERPRINTS_SHA1 = ['91 30 CF 20 17 F7 D7 EC F7 BA 43 30 8E 19 83 B4 CF DE 5A CC', '26 B0 20 FA AB E8 A3 81 63 37 C6 B7 EF 94 4D 40 3D 1B 85 10'];
/* Cloud HTTPS host name */

const CLOUD_HOST = 'https://api.cozify.fi';
const CLOUD_HOST_TEST = 'https://testapi.cozify.fi';
/* Cloud API VERSION */

const CLOUD_API_VERSION = 'ui/0.2/';
let cloudHost = CLOUD_HOST;
/**
 * Method to set Cozify test-cloud as an cloud API host.
 * Must be called at the early stage of SDK usage, otherwise production
 * cloud is used.
 *
 * @return {[type]} [description]
 */

function useTestcloud() {
  cloudHost = CLOUD_HOST_TEST;
}
function getCloudHost() {
  return cloudHost;
}
function getCloudURL() {
  return `${cloudHost}/${CLOUD_API_VERSION}`;
}
const MAX_API_VERSION = '1.13';
/**
 *  Enumeration of supported API commands, that could be
 *  USER_LOGIN, HUB_KEYS, REFRESH_AUTHKEY, CLOUD_IP, CLOUD_META, POLL, CMD_DEVICE
 *  @typedef {Object} COMMANDS_TYPE
 *  @readonly
 *
  */

const COMMANDS = Object.freeze({
  USER_LOGIN: {
    method: 'POST',
    url: 'user/login',
    params: ['password', 'email'],
    config: {
      responseType: isNode ? 'blob' : 'stream',
      timeout: 15000
    }
  },
  HUB_KEYS: {
    method: 'GET',
    url: 'user/hubkeys',
    timeout: 15000
  },
  HUB_LOCK_BACKUP: {
    method: 'POST',
    url: 'hub/remote/cc/$API_VER/hub/lockconfig'
  },
  REFRESH_AUTHKEY: {
    method: 'GET',
    url: 'user/refreshsession'
  },
  CLOUD_IP: {
    method: 'GET',
    url: 'hub/lan_ip'
  },
  CLOUD_META: {
    method: 'GET',
    url: 'hub/remote/hub'
  },
  POLL: {
    method: 'GET',
    url: 'hub/remote/cc/$API_VER/hub/poll',
    urlParams: ['ts']
  },
  PAIR_START: {
    method: 'GET',
    url: 'hub/remote/cc/$API_VER/hub/scan',
    urlParams: ['ts']
  },
  PAIR_IGNORE: {
    method: 'PUT',
    url: 'hub/remote/cc/$API_VER/hub/scan',
    type: 'SET_SCAN_RESULT',
    params: ['id', 'ignored']
  },
  PAIR_STOP: {
    method: 'GET',
    url: 'hub/remote/cc/$API_VER/hub/stopscan'
  },
  CMD_DEVICE_STATE: {
    method: 'PUT',
    url: 'hub/remote/cc/$API_VER/devices/command',
    type: 'CMD_DEVICE',
    params: ['id', 'state']
  },
  CMD_DEVICE_IGNORE: {
    method: 'PUT',
    url: 'hub/remote/cc/$API_VER/devices/command',
    type: 'CMD_IGNORE_DEVICE',
    params: ['id']
  },
  CMD_DEVICE_IDENTIFY: {
    method: 'PUT',
    url: 'hub/remote/cc/$API_VER/devices/command',
    type: 'CMD_IDENTIFY',
    params: ['id']
  },
  CMD_DEVICE_META: {
    method: 'PUT',
    url: 'hub/remote/cc/$API_VER/devices/command',
    type: 'CMD_DEVICE_META',
    params: ['id', 'name', 'room']
  },
  CMD_GET_ROOMS: {
    method: 'GET',
    url: 'hub/remote/cc/$API_VER/rooms'
  },
  CMD_SET_ROOM: {
    method: 'PUT',
    url: 'hub/remote/cc/$API_VER/rooms',
    type: 'CMD_ROOM',
    params: ['id', 'name', 'order']
  },
  CMD_REMOVE_ROOM: {
    method: 'DELETE',
    url: 'hub/remote/cc/$API_VER/rooms',
    urlParams: ['roomId']
  },
  CMD_GET_ALARMS: {
    method: 'GET',
    url: 'hub/remote/cc/$API_VER/alarms'
  },
  CMD_CLOSE_ALARM: {
    method: 'PUT',
    url: 'hub/remote/cc/$API_VER/alarms/close',
    urlParams: ['alarmId']
  },
  CMD_REMOVE_ALARM: {
    method: 'DELETE',
    url: 'hub/remote/cc/$API_VER/alarms',
    urlParams: ['roomId']
  },
  ZWAVE_START_INCLUSION: {
    method: 'POST',
    url: 'hub/remote/cc/$API_VER/hub/protocolconfig',
    type: 'ZWAVE_START_INCLUSION'
  },
  ZWAVE_STOP_INCLUSION: {
    method: 'POST',
    url: 'hub/remote/cc/$API_VER/hub/protocolconfig',
    type: 'ZWAVE_CANCEL_INCLUSION'
  },
  ZWAVE_START_EXCLUSION: {
    method: 'POST',
    url: 'hub/remote/cc/$API_VER/hub/protocolconfig',
    type: 'ZWAVE_START_EXCLUSION'
  },
  ZWAVE_STOP_EXCLUSION: {
    method: 'POST',
    url: 'hub/remote/cc/$API_VER/hub/protocolconfig',
    type: 'ZWAVE_CANCEL_EXCLUSION'
  },
  ZWAVE_INCLUSION_STATUS: {
    method: 'POST',
    url: 'hub/remote/cc/$API_VER/hub/protocolconfig',
    type: 'GET_ZWAVE_INCLUSION_STATUS'
  },
  ZWAVE_EXCLUSION_STATUS: {
    method: 'POST',
    url: 'hub/remote/cc/$API_VER/hub/protocolconfig',
    type: 'GET_ZWAVE_EXCLUSION_STATUS'
  },
  ZWAVE_HEAL: {
    method: 'POST',
    url: 'hub/remote/cc/$API_VER/hub/protocolconfig',
    type: 'ZWAVE_HEAL'
  },
  CMD_GET_PLANS: {
    method: 'GET',
    url: 'plans'
  },
  CMD_SAVE_PLANS: {
    method: 'POST',
    url: 'plans',
    params: ['templates', 'installations', 'locations']
  }
}); // type dataArray = ?Array<{ [key: string | number]: any }>
// type dataObject = ?{ [key: string | number]: any }

/**
 * COMMAND_TYPE
 *  @typedef {Object} COMMANDS_TYPE
 *  @property {COMMANDS_TYPE} [command]   - Optional command like USER_LOGIN,
 *  @property {string} [localUrl]         - Optional localUrl for direct hub access
 *  @property {string} [url]              - Optional url
 *  @property {number} [timeout]          - Optional timeout
 *  @property {string} [method]           - Optional method
 *  @property {string} [authKey]          - Optional authKey
 *  @property {string} [hubKey]           - Optional hubKey
 *  @property {Object} [config]           - Optional config that might have 'timeout' or 'responseType' configs to be used over defaults,
 *  @property {Object} [data]             - Optional data to be sent over url or body parameters (depending command)
 *  @property {string} [type]             - Optional type that defaults to 'application/json',
 *  @property {string} [hubId]            - Optional hub Id when messaging to hub
 */

/**
  * Enumeration of cloud connection state, that could be
  * UNCONNECTED, UNAUTHENTICATED, UNAUTHORIZED, OBSOLETE_API_VERSION, LATE_PAYMENT or CONNECTED
  * @readonly
  * @enum {string}
  * @typedef {string} CLOUD_CONNECTION_STATE_TYPE
  */

const CLOUD_CONNECTION_STATES = Object.freeze({
  UNCONNECTED: 'no connection',
  UNAUTHENTICATED: 'unauthenticated',
  UNAUTHORIZED: 'unauthorized',
  OBSOLETE_API_VERSION: 'obsolete api version',
  LATE_PAYMENT: 'late payment',
  CONNECTED: 'connected'
});
/**
  * Enumeration of HUB connection state, that could be
  * UNCONNECTED, UNAUTHENTICATED, UNAUTHORIZED, OBSOLETE_API_VERSION, REMOTE or LOCAL
  * @readonly
  * @enum {string}
  * @typedef {string} HUB_CONNECTION_STATE_TYPE
  */

const HUB_CONNECTION_STATES = Object.freeze({
  UNCONNECTED: 'no connection',
  UNAUTHENTICATED: 'unauthenticated',
  UNAUTHORIZED: 'unauthorized',
  OBSOLETE_API_VERSION: 'obsolete api version',
  REMOTE: 'remote',
  LOCAL: 'local'
});

//      

/**
 * Connections action creators object
 * @see  https://github.com/reduxjs/redux-starter-kit/blob/master/docs/api/createSlice.md
 * @return { {
 *   slice : string,
 *   reducer : ReducerFunction,
 *   actions : Object<string, ActionCreator},
 *   selectors : Object<string, Selector>
 *   }}
 */

const connectionsState = createSlice({
  slice: 'connections',
  initialState: {
    cloudState: CLOUD_CONNECTION_STATES.UNCONNECTED
  },
  reducers: {
    /*
     * Reducer action of cloud connection state
     * @param {Object} state
     * @param {CLOUD_CONNECTION_STATES} action
     */
    setCloudConnectionState(state, action) {
      const stateToSet = state;
      const newState = action.payload;
      const oldState = state.cloudState;

      if (Object.values(CLOUD_CONNECTION_STATES).indexOf(newState) > -1) {
        if (oldState !== newState) {
          console.log(`CLOUD connection state ${oldState} -> ${newState}`);
          stateToSet.cloudState = newState;
        }
      }
    }

  }
});
const {
  actions: actions$1,
  reducer: reducer$1
} = connectionsState;

//      
/**
 * Devices action creators object
 * @see  https://github.com/reduxjs/redux-starter-kit/blob/master/docs/api/createSlice.md
 * @return { {
 *   slice : string,
 *   reducer : ReducerFunction,
 *   actions : Object<string, ActionCreator},
 *   selectors : Object<string, Selector>
 *   }}
 */

const pairingsState = createSlice({
  slice: 'pairings',
  initialState: {},
  reducers: {
    /*
     * Reducer action of setting pairing devices state - sets all given devices of given hub, keeps existing states
     * @param {Object} state
     * @param {Object} action
     */
    setPairingDevices(state, action) {
      const stateToSet = state;
      const {
        hubId
      } = action.payload;
      const {
        devices
      } = action.payload;
      const hubPairingDevices = {};
      Object.entries(devices).forEach(entry => {
        const [id, device] = entry;
        hubPairingDevices[id] = { ...device
        };
      });
      stateToSet[hubId] = { ...hubPairingDevices
      };
    },

    /*
     * Reducer action of setting device state - sets  given device of given hub, keeps existing states
     * @param {Object} state
     * @param {payload:{Object{hubId:string, device:Object}}} action
     */
    setPairingDevice(state, action) {
      const stateToSet = state;
      const {
        hubId
      } = action.payload;
      const {
        device
      } = action.payload;

      if (stateToSet[hubId]) {
        stateToSet[hubId][device.id] = { ...device
        };
      }
    },

    /*
     * Reducer action to remove device from state - sets all given devices of given hub, keeps existing states
     * @param {Object} state
     * @param {payload:{Object{hubId:string, device:Object}}} action
     */
    deletePairingDevice(state, action) {
      const stateToSet = state;
      const {
        hubId
      } = action.payload;
      const {
        deviceId
      } = action.payload;

      if (hubId && deviceId && stateToSet[hubId] && stateToSet[hubId][deviceId]) {
        delete stateToSet[hubId][deviceId];
      }
    }

  }
});
const {
  actions: actions$2,
  reducer: reducer$2
} = pairingsState;

//      
/**
 * Devices action creators object
 * @see  https://github.com/reduxjs/redux-starter-kit/blob/master/docs/api/createSlice.md
 * @return { {
 *   slice : string,
 *   reducer : ReducerFunction,
 *   actions : Object<string, ActionCreator},
 *   selectors : Object<string, Selector>
 *   }}
 */

const devicesState = createSlice({
  slice: 'devices',
  initialState: {},
  reducers: {
    /*
     * Reducer action of setting devices state - sets all given devices of given hub, keeps existing states
     * @param {Object} state
     * @param {Object} action
     */
    setDevices(state, action) {
      const stateToSet = state;
      const {
        hubId
      } = action.payload;
      const {
        devices
      } = action.payload;
      const hubDevices = {};
      Object.entries(devices).forEach(entry => {
        const [id, device] = entry;
        hubDevices[id] = { ...device
        };
      });
      stateToSet[hubId] = { ...hubDevices
      };
    },

    /*
     * Reducer action of setting device state - sets  given device of given hub, keeps existing states
     * @param {Object} state
     * @param {payload:{Object{hubId:string, device:Object}}} action
     */
    setDevice(state, action) {
      const stateToSet = state;
      const {
        hubId
      } = action.payload;
      const {
        device
      } = action.payload;

      if (stateToSet[hubId]) {
        stateToSet[hubId][device.id] = { ...device
        };
      }
    },

    /*
     * Reducer action to remove device from state - sets all given devices of given hub, keeps existing states
     * @param {Object} state
     * @param {payload:{Object{hubId:string, device:Object}}} action
     */
    deleteDevice(state, action) {
      const stateToSet = state;
      const {
        hubId
      } = action.payload;
      const {
        deviceId
      } = action.payload;

      if (hubId && deviceId && stateToSet[hubId] && stateToSet[hubId][deviceId]) {
        delete stateToSet[hubId][deviceId];
      }
    }

  }
});
const {
  actions: actions$3,
  reducer: reducer$3
} = devicesState;

/*
console.log(addDevice({ id: 123, name: 'Unnamed device' }))
{type : "devices/addDevice", payload : {id : 123, name: 'Unnamed device' }}
*/

const {
  setDevices,
  deleteDevice
} = actions$3;

//      
/**
 * Hubs action creators object
 * @see  https://github.com/reduxjs/redux-starter-kit/blob/master/docs/api/createSlice.md
 * @return { {
 *   slice : string,
 *   reducer : ReducerFunction,
 *   actions : Object<string, ActionCreator},
 *   selectors : Object<string, Selector>
 *   }}
 */

const hubsState = createSlice({
  slice: 'hubs',
  initialState: {},
  reducers: {
    /*
     * Reducer action of setting many hubs to state
     * @param  {Object} state
     * @param  {payload:{hubs:HUBS_MAP_TYPE}} action
     */
    updateHubs(state, action) {
      const stateToSet = state;
      const hubs = action.payload;
      console.log('updateHubs', hubs);
      Object.entries(hubs).forEach(entry => {
        const [id, hub] = entry;
        stateToSet[id] = { ...state[id],
          ...hub
        };
      });
    },

    /*
     * Reducer action of setting hub state to selected
     * @param  {Object} state
     * @param  {payload:{hubId:string}} action
     */
    selectHub(state, action) {
      const stateToSet = state;
      const {
        hubId
      } = action.payload;
      console.log('selectHub', hubId);

      if (state[hubId]) {
        stateToSet[hubId].selected = true;
        console.log('selectHub', state[hubId]);
      }
    },

    /*
     * Reducer action of setting hub state to unselected
     * @param  {Object} state
     * @param  {payload:{hubId:string}} action
     */
    unSelectHub(state, action) {
      const stateToSet = state;
      const {
        hubId
      } = action.payload;

      if (state[hubId]) {
        stateToSet[hubId].selected = false; // console.log("selectHub", state[action.payload]);
      }
    },

    /*
     * Reducer action of setting hub connection state
     * @param  {Object} state
     * @param  {payload:{hubId:string, state:HUB_STATES_TYPE}} action
     */
    setHubConnectionState(state, action) {
      const {
        hubId
      } = action.payload;
      const stateToSet = state;
      const newState = action.payload.state;
      const oldState = state[hubId] ? state[hubId].connectionState : undefined;

      if (Object.values(HUB_CONNECTION_STATES).indexOf(newState) > -1) {
        if (oldState && oldState !== newState) {
          // console.log (`HUB ${hubId} connection state ${oldState} -> ${newState}`);
          stateToSet[hubId].connectionState = newState;
        }
      }
    }

  }
}); // console.log('hubsState ', hubsState)

const {
  actions: actions$4,
  reducer: reducer$4
} = hubsState;

/*
console.log(updateHubs({ id: 123, name: 'Unnamed device' }))
{type : "hubs/updateHubs, payload : {id : 123, name: 'Unnamed device' }}
*/

const {
  updateHubs,
  selectHub,
  unSelectHub,
  setHubConnectionState
} = actions$4;

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
var propertyIsEnumerable$1 = objectProto$5.propertyIsEnumerable;

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
    !propertyIsEnumerable$1.call(value, 'callee');
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
var isArray$3 = Array.isArray;

var isArray_1 = isArray$3;

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
var freeExports =  exports && !exports.nodeType && exports;

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
var freeExports =  exports && !exports.nodeType && exports;

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

//      

/**
  * Enumeration of language, that could be
  * NONE, EN_UK or FI_FI
  * @readonly
  * @enum {string}
  */
const LANGUAGES = Object.freeze({
  NONE: 'none',
  EN_EN: 'en',
  EN_UK: 'en-UK',
  FI_FI: 'fi-FI',
  FI: 'fi',
  EN: 'en'
});
/**
  * Enumeration of user state, that could be
  * WAITING_LANGUAGE, LANGUAGE_SET, WAITING_LOGIN, LOGIN_DONE, WAITING_EULA, EULA_ACCEPTED, AUTHENTICATED or LOGGED_OUT
  * @readonly
  * @enum {string}
  */

const USER_STATES = Object.freeze({
  WAITING_LANGUAGE: 'wait language',
  LANGUAGE_SET: 'language set',
  WAITING_LOGIN: 'wait login',
  LOGIN_DONE: 'login done',
  WAITING_EULA: 'wait eula',
  EULA_ACCEPTED: 'eula accepted',
  AUTHENTICATED: 'logged in',
  KEYED: 'key entered',
  LOGGED_OUT: 'logged out'
});
/**
  * Enumeration of ROLES, that could be
  * ADMIN, USER, GUEST or ANONYMOUS
  * @readonly
  * @enum {string}
  */

const ROLES = Object.freeze({
  ADMIN: 32,
  USER: 8,
  GUEST: 2,
  ANONYMOUS: 1
});

//      
/**
 * User action creators object
 * @see  https://github.com/reduxjs/redux-starter-kit/blob/master/docs/api/createSlice.md
 * @return { {
 *   slice : string,
 *   reducer : ReducerFunction,
 *   actions : Object<string, ActionCreator},
 *   selectors : Object<string, Selector>
 *   }}
 */

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
    /*
     * Reducer action of setting user's state
     * @param  {Object} state
     * @param  {payload:{state:USER_STATE_TYPE}} action
     */
    changeState(state, action) {
      const stateToSet = state;
      const newState = action.payload;
      const oldState = state.state;
      console.log(`User state ${oldState} -> ${newState}`);

      switch (oldState) {
        case USER_STATES.WAITING_LANGUAGE:
          {
            if (newState === USER_STATES.LANGUAGE_SET) {
              if (!isEmpty_1(state.language)) {
                stateToSet.state = USER_STATES.WAITING_LOGIN;
              }
            }

            break;
          }

        case USER_STATES.WAITING_LOGIN:
          {
            if (newState === USER_STATES.LOGIN_DONE) {
              if (!isEmpty_1(state.authKey)) {
                if (isEmpty_1(state.eulaAcceted)) {
                  stateToSet.state = USER_STATES.WAITING_EULA;
                } else {
                  stateToSet.state = USER_STATES.AUTHENTICATED;
                }
              }
            }

            break;
          }

        case USER_STATES.WAITING_EULA:
          {
            if (newState === USER_STATES.EULA_ACCEPTED) {
              stateToSet.state = USER_STATES.AUTHENTICATED;
            }

            break;
          }

        case USER_STATES.AUTHENTICATED:
          {
            if (newState === USER_STATES.LOGGED_OUT) {
              stateToSet.state = USER_STATES.WAITING_LOGIN;
            }

            break;
          }
      }
    },

    /*
     * Reducer action of setting user's eula to accepted
     * @param  {Object} state
     * @param  {payload:boolean} action
     */
    setEula(state, action) {
      const stateToSet = state;
      stateToSet.eulaAccepted = action.payload;
    },

    /*
     * Reducer action of setting user's language
     * @param  {Object} state
     * @param  {payload:LANGUAGES_TYPE} action
     */
    setLanguage(state, action) {
      const stateToSet = state;
      stateToSet.language = action.payload;
    },

    /*
     * Reducer action of setting user's authKey
     * @param  {Object} state
     * @param  {payload:string} action
     */
    setAuthKey(state, action) {
      const stateToSet = state;
      stateToSet.authKey = action.payload;
    },

    /*
     * Reducer action of setting user's authKey and state
     * @param  {Object} state
     * @param  {payload:{state:USER_STATE_TYPE}} action
     */
    setAuthenticated(state, action) {
      const stateToSet = state;
      stateToSet.authKey = action.payload;
      stateToSet.state = USER_STATES.KEYED;
    }

  }
});
/*
console.log(user)
{
    actions : {
        setState
    },
    reducer
}
*/

const {
  actions: actions$5,
  reducer: reducer$5
} = userState;

//      
/**
 * Rooms action creators object
 * @see  https://github.com/reduxjs/redux-starter-kit/blob/master/docs/api/createSlice.md
 * @return { {
 *   slice : string,
 *   reducer : ReducerFunction,
 *   actions : Object<string, ActionCreator},
 *   selectors : Object<string, Selector>
 *   }}
 */

const roomsState = createSlice({
  slice: 'rooms',
  initialState: {},
  reducers: {
    /*
     * Reducer action of setting rooms state - sets all given rooms of given hub, keeps existing states
     * @param {Object} state
     * @param {Object} action
     */
    setRooms(state, action) {
      const stateToSet = state;
      const {
        hubId
      } = action.payload;
      const {
        rooms
      } = action.payload;
      const hubRooms = {};
      Object.entries(rooms).forEach(entry => {
        const [id, room] = entry;
        hubRooms[id] = { ...room
        };
      });
      stateToSet[hubId] = { ...hubRooms
      };
    },

    /*
     * Reducer action of set room state
     * @param {Object} state
     * @param {Object} action
     */
    setRoom(state, action) {
      const stateToSet = state;
      const {
        hubId
      } = action.payload;
      const {
        room
      } = action.payload;

      if (hubId && stateToSet[hubId]) {
        stateToSet[hubId][room.id] = { ...room
        };
      }
    },

    /*
     * Reducer action of removing room state
     * @param {Object} state
     * @param {Object} action
     */
    removeRoom(state, action) {
      const stateToSet = state;
      const {
        hubId
      } = action.payload;
      const {
        roomId
      } = action.payload;

      if (hubId && roomId && stateToSet[hubId] && stateToSet[hubId][roomId]) {
        delete stateToSet[hubId][roomId];
      }
    }
    /*
     * Reducer action of updating room state
     * @param {Object} state
     * @param {Object} action
     */

    /*
    editRoom(state, action) {
      const stateToSet = state;
      const { hubId } = action.payload;
      const { room } = action.payload;
      if (hubId && stateToSet[hubId]) {
        stateToSet[hubId][room.id] = { ...room };
      }
    },
    */


  }
});
/*
todos.selectors.getCompletedTodoCount = createSelector(
  [todos.selectors.getTodos],
  todos =>
    todos.reduce((count, todo) => (todo.completed ? count + 1 : count), 0)
);
*/

const {
  actions: actions$6,
  reducer: reducer$6
} = roomsState;

//      
/*
* Helpers
*/

const setId = idObj => {
  const givenObject = idObj;

  if (!givenObject.id) {
    givenObject.id = Date.now();
  }

  return givenObject;
};

const getAllDescendantIds = (state, nodeId) => state[nodeId].childIds.reduce((acc, childId) => [...acc, childId, ...getAllDescendantIds(state, childId)], []);

const deleteMany = (givenState, ids) => {
  const state = { ...givenState
  };
  ids.forEach(id => delete state[id]);
  return state;
};

const findChild = (state, id) => {
  let found;
  Object.values(state).forEach(node => {
    if (!found) {
      if (node && node.childIds) {
        // console.error(`FIND ${id} in ${JSON.stringify(node.childIds)} when node ${JSON.stringify(node)}`);
        if (isArray_1(node.childIds)) {
          if (node.childIds.includes(id)) {
            found = node;
          }
        }
      }
    }
  }); // console.error(`FOUND ${id} => ${JSON.stringify(found)}`);

  return found;
};
/**
 * Plans action creators object
 * @see  https://github.com/reduxjs/redux-starter-kit/blob/master/docs/api/createSlice.md
 * @return { {
 *   slice : string,
 *   reducer : ReducerFunction,
 *   actions : Object<string, ActionCreator},
 *   selectors : Object<string, Selector>
 *   }}
 */


const plansState = createSlice({
  slice: 'plans',
  initialState: {
    templates: {},
    installations: {},
    locations: {
      root: {
        id: 'root',
        childIds: [],
        data: {
          name: 'root'
        },
        open: false
      }
    }
  },
  reducers: {
    setPlansState(state, action) {
      const stateToSet = state;
      const newState = action.payload;
      const oldState = stateToSet.plansState;
      console.log(`PLANS state ${oldState} -> ${newState}`);
      stateToSet.templates = { ...newState.templates
      };
      stateToSet.installations = { ...newState.installations
      };
      stateToSet.locations = { ...newState.locations
      };
    },

    /*
     * Reducer action of setting all templates state
     * @param {Object} state
     * @param {Object} action
     */
    setTemplates(state, action) {
      const stateToSet = state;
      const {
        templates
      } = action.payload;
      const newTemplates = {};
      Object.entries(templates).forEach(entry => {
        setId(entry);
        const [id, template] = entry;
        newTemplates[id] = { ...template
        };
      });
      stateToSet.templates = { ...newTemplates
      };
    },

    /*
     * Reducer action of adding template state
     * @param {Object} state
     * @param {Object} action
     */
    addTemplate(state, action) {
      const stateToSet = state;
      const template = action.payload;
      setId(template);

      if (template.id) {
        stateToSet.templates[template.id] = { ...template
        };
      }
    },

    /*
     * Reducer action of setting template state
     * @param {Object} state
     * @param {Object} action
     */
    setTemplate(state, action) {
      const stateToSet = state;
      const template = action.payload;
      setId(template);

      if (template.id && stateToSet.templates[template.id]) {
        stateToSet.templates[template.id] = { ...template
        };
      }
    },

    /*
     * Reducer action of removing plan state
     * @param {Object} state
     * @param {Object} action
     */
    removeTemplate(state, action) {
      const stateToSet = state;
      const template = action.payload;
      setId(template);

      if (template.id && stateToSet.templates[template.id]) {
        delete stateToSet.templates[template.id];
      }
    },

    /*
     * Reducer action of setting installations state
     * @param {Object} state
     * @param {Object} action
     */
    setInstallations(state, action) {
      const stateToSet = state;
      const {
        installations
      } = action.payload;
      const newInstallations = {};
      Object.entries(installations).forEach(entry => {
        setId(entry);
        const [id, installation] = entry;
        newInstallations[id] = { ...installation
        };
      });
      stateToSet.installations = { ...newInstallations
      };
    },

    /*
     * Reducer action of adding installation state
     * @param {Object} state
     * @param {Object} action
     */
    addInstallation(state, action) {
      const stateToSet = state;
      const installation = action.payload;
      setId(installation);

      if (installation.id) {
        stateToSet.installations[installation.id] = { ...installation
        };
      }
    },

    /*
     * Reducer action of setting plan state
     * @param {Object} state
     * @param {Object} action
     */
    setInstallation(state, action) {
      const stateToSet = state;
      const installation = action.payload;
      setId(installation);

      if (stateToSet.installations[installation.id]) {
        stateToSet.installations[installation.id] = { ...installation
        };
      }
    },

    /*
     * Reducer action of removing plan state
     * @param {Object} state
     * @param {Object} action
     */
    removeInstallation(state, action) {
      const stateToSet = state;
      const installation = action.payload;
      setId(installation);

      if (installation.id && stateToSet.installations[installation.id]) {
        delete stateToSet.installations[installation.id];
      }
    },

    /*
     * Reducer action of adding country state
     * @param {Object} state
     * @param {Object} action
     */
    addLocationCountry(state, action) {
      const stateToSet = state;
      const country = action.payload;
      setId(country);

      if (country.id) {
        stateToSet.locations[country.id] = { ...country
        };
      }
    },

    /*
     * Reducer action of setting country state
     * @param {Object} state
     * @param {Object} action
     */
    setLocationCountry(state, action) {
      const stateToSet = state;
      const country = action.payload;
      setId(country);

      if (stateToSet.locations[country.id]) {
        stateToSet.locations[country.id] = { ...country
        };
      }
    },

    /*
     * Reducer action of removing country state
     * @param {Object} state
     * @param {Object} action
     */
    removeLocationCountry(state, action) {
      const stateToSet = state;
      const country = action.payload;
      setId(country);

      if (country.id && stateToSet.locations[country.id]) {
        delete stateToSet.locations[country.id];
      }
    },

    /*
     * Reducer action of adding location node state
     *
     * addLocationNode({parentId: parent, data:{}})
     *
     * addLocationNode({ parentId: null, newNode: country }));
     *
     */
    addLocationNode(state, action) {
      const stateToSet = state;
      const {
        parentId,
        newNode
      } = action.payload;
      const parentTempId = parentId || 'root';

      if (newNode.id) {
        newNode.id = parentTempId.concat(':').concat(newNode.id);
      } else if (newNode.data && newNode.data.name) {
        newNode.id = parentTempId.concat(':').concat(newNode.data.name.replace(/\s+/g, '').replace(/\./g, '').replace(/:/g, ''));
      } else {
        newNode.id = parentTempId.concat(':?');
      } // Check that node doesn't already exist


      if (!newNode || !newNode.id) {
        throw new Error('SDK addLocationNode - no new node given');
      }

      if (stateToSet.locations[newNode.id]) {
        throw new Error(`SDK addLocationNode - node ${newNode.id} already exist`);
      }

      if (!newNode.childIds) {
        newNode.childIds = [];
      }

      if (stateToSet.locations[parentTempId] && newNode && newNode.id) {
        if (!stateToSet.locations[parentTempId].childIds) {
          stateToSet.locations[parentTempId].childIds = [];
        }

        stateToSet.locations[parentTempId].childIds = [...stateToSet.locations[parentTempId].childIds, newNode.id];
        stateToSet.locations[newNode.id] = { ...newNode
        };
      }
    },

    /*
     * setLocationNode(node)
     */
    setLocationNode(state, action) {
      const stateToSet = state;
      const node = action.payload;

      if (!node || !node.id) {
        throw new Error('SDK setLocationNode - no node given');
      }

      if (!stateToSet.locations[node.id]) {
        throw new Error(`SDK setLocationNode - node ${node.id} does not exist`);
      }

      if (!node.childIds) {
        node.childIds = [];
      }

      const parentTempId = node.id.substr(0, node.id.lastIndexOf(':'));

      if (node.data && node.data.name) {
        const oldId = node.id;
        node.id = parentTempId.concat(':').concat(node.data.name.replace(/\s+/g, '').replace(/\./g, '').replace(/:/g, ''));

        if (oldId !== node.id && stateToSet.locations[oldId]) {
          stateToSet.locations[parentTempId].childIds = stateToSet.locations[parentTempId].childIds.filter(id => id !== oldId);
          stateToSet.locations[parentTempId].childIds.push(node.id);
          delete stateToSet.locations[oldId];
          stateToSet.locations[node.id] = { ...node
          };
        } else if (node && node.id && stateToSet.locations[node.id]) {
          stateToSet.locations[node.id] = { ...node
          };
        } else {
          throw new Error(`SDK setLocationNode - node ${node.id} could not be set`);
        }
      } else {
        stateToSet.locations[node.id] = { ...node
        };
      }
    },

    /*
     * removeLocationNode
     */
    removeLocationNode(state, action) {
      const stateToSet = state;
      const nodeId = action.payload;

      if (!nodeId) {
        throw new Error('SDK removeLocationNode - no nodeId given');
      }

      if (!stateToSet.locations[nodeId]) {
        throw new Error(`SDK removeLocationNode - node ${nodeId} doesnt exist`);
      } // console.info('removeLocationNode ', nodeId);


      if (nodeId && nodeId !== 'root') {
        const descendantIds = getAllDescendantIds(stateToSet.locations, nodeId); // console.info('descendantIds', descendantIds);

        const parent = findChild(stateToSet.locations, nodeId); // console.info('PARENT', JSON.stringify(parent));

        if (parent && parent.id) {
          stateToSet.locations = deleteMany(stateToSet.locations, [nodeId, ...descendantIds]); // console.info('child not yet removed', JSON.stringify(stateToSet.locations[parent.id].childIds));

          stateToSet.locations[parent.id].childIds = stateToSet.locations[parent.id].childIds.filter(id => id !== nodeId); // console.info('child removed', JSON.stringify(stateToSet.locations[parent.id].childIds));
        } else {
          throw new Error(`SDK removeLocationNode - node ${nodeId} parent does not exist`);
        }
      }
    }

  }
});
const {
  actions: actions$7,
  reducer: reducer$7
} = plansState;

/**
 * Root reducer
 * @type {Object}
 */

const rootReducer = {
  alarms: reducer,
  connections: reducer$1,
  pairings: reducer$2,
  devices: reducer$3,
  hubs: reducer$4,
  user: reducer$5,
  rooms: reducer$6,
  plans: reducer$7
};

/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

var isobject = function isObject(val) {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
};

/*!
 * get-value <https://github.com/jonschlinkert/get-value>
 *
 * Copyright (c) 2014-2018, Jon Schlinkert.
 * Released under the MIT License.
 */



var getValue$1 = function(target, path, options) {
  if (!isobject(options)) {
    options = { default: options };
  }

  if (!isValidObject(target)) {
    return typeof options.default !== 'undefined' ? options.default : target;
  }

  if (typeof path === 'number') {
    path = String(path);
  }

  const isArray = Array.isArray(path);
  const isString = typeof path === 'string';
  const splitChar = options.separator || '.';
  const joinChar = options.joinChar || (typeof splitChar === 'string' ? splitChar : '.');

  if (!isString && !isArray) {
    return target;
  }

  if (isString && path in target) {
    return isValid(path, target, options) ? target[path] : options.default;
  }

  let segs = isArray ? path : split(path, splitChar, options);
  let len = segs.length;
  let idx = 0;

  do {
    let prop = segs[idx];
    if (typeof prop === 'number') {
      prop = String(prop);
    }

    while (prop && prop.slice(-1) === '\\') {
      prop = join([prop.slice(0, -1), segs[++idx] || ''], joinChar, options);
    }

    if (prop in target) {
      if (!isValid(prop, target, options)) {
        return options.default;
      }

      target = target[prop];
    } else {
      let hasProp = false;
      let n = idx + 1;

      while (n < len) {
        prop = join([prop, segs[n++]], joinChar, options);

        if ((hasProp = prop in target)) {
          if (!isValid(prop, target, options)) {
            return options.default;
          }

          target = target[prop];
          idx = n - 1;
          break;
        }
      }

      if (!hasProp) {
        return options.default;
      }
    }
  } while (++idx < len && isValidObject(target));

  if (idx === len) {
    return target;
  }

  return options.default;
};

function join(segs, joinChar, options) {
  if (typeof options.join === 'function') {
    return options.join(segs);
  }
  return segs[0] + joinChar + segs[1];
}

function split(path, splitChar, options) {
  if (typeof options.split === 'function') {
    return options.split(path);
  }
  return path.split(splitChar);
}

function isValid(key, target, options) {
  if (typeof options.isValid === 'function') {
    return options.isValid(key, target);
  }
  return true;
}

function isValidObject(val) {
  return isobject(val) || Array.isArray(val) || typeof val === 'function';
}

/**
 * store as a redux state store
 * @type {Object}
 */

const store = configureStore({
  reducer: rootReducer // middleware: [...getDefaultMiddleware(), logger]
  // default true like: devTools: 'production' !== 'production'
  // preloadedState
  // enhancers: [reduxBatch]

});
console.log('Store Initial State: ', store.getState());

function watchState(getState, objectPath) {
  let currentValue = getValue$1(getState(), objectPath);
  return function w(fn) {
    return () => {
      const newValue = getValue$1(getState(), objectPath);

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


function watchChanges(path, changed, optionalStore) {
  const selectedStore = optionalStore || store;
  const watchFn = watchState(selectedStore.getState, path);
  selectedStore.subscribe(watchFn(changed));
}

//      
//

/**
  * Enumeration of hub state, that could be
  * UNCLAIMED, CLAIMED, TOO_NEW_VERSION, NO_ACCESS or CONNECTED
  * @readonly
  * @enum {string}
  */
const HUB_STATES = Object.freeze({
  UNCLAIMED: 'unclaimed',
  CLAIMED: 'claimed',
  TOO_NEW_VERSION: 'new version',
  NO_ACCESS: 'no access',
  CONNECTED: 'connected'
});
const ZWAVE_INCLUSION_STATUS = Object.freeze({
  NOT_PAIRING: 'NOT_PAIRING',
  // Inclusion is not running
  IDLE: 'IDLE',
  // Inclusion is not running
  RUNNING: 'RUNNING',
  // Inclusion is running
  TIMEOUT: 'TIMEOUT',
  // Inclusion timed out and finished
  SUCCESS: 'SUCCESS',
  // Inclusion finished, a device was added
  CANCEL: 'CANCEL',
  // Inclusion was cancelled
  NO_ZWAVE: 'NO_ZWAVE',
  // ZWave not available
  ERROR: 'ERROR' // General error

});
const ZWAVE_EXCLUSION_STATUS = Object.freeze({
  IDLE: 'IDLE',
  // Exclusion is not running
  RUNNING: 'RUNNING',
  // Exclusion is running
  TIMEOUT: 'TIMEOUT',
  // Exclusion timed out and finished
  SUCCESS: 'SUCCESS',
  // Exclusion finished, a device was added
  CANCEL: 'CANCEL',
  // Exclusion was cancelled
  NO_ZWAVE: 'NO_ZWAVE',
  // ZWave not available
  ERROR: 'ERROR' // General error

});
/*
 * Intervall defining how often hubkeys and metadatas are fetched
 */

const DISCOVERY_INTERVAL_MS = 45 * 1000;
/*
 * Interval defining how often hubs are polled at max
 * This value is used as is in local connection, and multiplied in remote connection
 */

const POLL_INTERVAL_MS = 1 * 1000;
/*
 * Interval defining how often hubs are polled when paired
 */

const PAIRING_POLL_INTERVAL_MS = 3 * 1000;
/*
 * Interval defining how often zwave statuses are polled
 */

const ZWAVE_INCLUSION_INTERVAL_MS = 3 * 1000;
const ZWAVE_EXCLUSION_INTERVAL_MS = 3 * 1000;
const HUB_PROTOCOL = 'http://';
const HUB_PORT = '8893';

//      
/**
 * Change Cloud connection state
 * @param {HUB_CONNECTION_STATE_TYPE} state
 */

function setCloudConnectionState(state) {
  store.dispatch(connectionsState.actions.setCloudConnectionState(state));
}
/**
 * Get Cloud connection state
 * @return {CLOUD_CONNECTION_STATE_TYPE}
 */

function getCloudConnectionState() {
  const stateNow = store.getState();
  return connectionsState.selectors.getConnections(stateNow).cloudState;
}
/**
 * Change hub connection state
 * @param {{hubId: string, state: HUB_CONNECTION_STATE_TYPE}} hubAndState - hubId and new state
 */

function setHubConnectionState$1(paramHubAndState) {
  const stateNow = store.getState();
  const storedHubs = hubsState.selectors.getHubs(stateNow);
  const hubAndState = paramHubAndState;
  /* If hub is unconnected, lets try remote */

  if (hubAndState.state === HUB_CONNECTION_STATES.UNCONNECTED && storedHubs[hubAndState.hubId]) {
    if (storedHubs[hubAndState.hubId].connectionState === HUB_CONNECTION_STATES.REMOTE) {
      hubAndState.state = HUB_CONNECTION_STATES.LOCAL;
    }
  }

  store.dispatch(hubsState.actions.setHubConnectionState(hubAndState));
}
/**
 * Get hub connection state by hub id
 * @param  {string} hubId
 * @return {HUB_CONNECTION_STATE_TYPE}
 */

function getHubConnectionState(hubId) {
  const stateNow = store.getState();

  if (hubsState.selectors.getHubs(stateNow)[hubId]) {
    return hubsState.selectors.getHubs(stateNow)[hubId].connectionState;
  }

  return HUB_CONNECTION_STATES.UNCONNECTED;
}

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

var bind = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

var isBuffer = function isBuffer (obj) {
  return obj != null && obj.constructor != null &&
    typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
};

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray$4(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString$1(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject$1(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction$1(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject$1(val) && isFunction$1(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray$4(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge$1(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge$1(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Function equal to merge with the difference being that no reference
 * to original objects is kept.
 *
 * @see merge
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function deepMerge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = deepMerge(result[key], val);
    } else if (typeof val === 'object') {
      result[key] = deepMerge({}, val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

var utils = {
  isArray: isArray$4,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString$1,
  isNumber: isNumber,
  isObject: isObject$1,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction$1,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge$1,
  deepMerge: deepMerge,
  extend: extend,
  trim: trim
};

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
var buildURL = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

var InterceptorManager_1 = InterceptorManager;

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
var transformData = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};

var isCancel = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

var normalizeHeaderName = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
var enhanceError = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
var createError = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
var settle = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

var ms = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse$1(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse$1(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}

var debug = createCommonjsModule(function (module, exports) {
/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = ms;

/**
 * Active `debug` instances.
 */
exports.instances = [];

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  var prevTime;

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);
  debug.destroy = destroy;

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  exports.instances.push(debug);

  return debug;
}

function destroy () {
  var index = exports.instances.indexOf(this);
  if (index !== -1) {
    exports.instances.splice(index, 1);
    return true;
  } else {
    return false;
  }
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var i;
  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }

  for (i = 0; i < exports.instances.length; i++) {
    var instance = exports.instances[i];
    instance.enabled = exports.enabled(instance.namespace);
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  if (name[name.length - 1] === '*') {
    return true;
  }
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}
});
var debug_1 = debug.coerce;
var debug_2 = debug.disable;
var debug_3 = debug.enable;
var debug_4 = debug.enabled;
var debug_5 = debug.humanize;
var debug_6 = debug.instances;
var debug_7 = debug.names;
var debug_8 = debug.skips;
var debug_9 = debug.formatters;

var browser = createCommonjsModule(function (module, exports) {
/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  '#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC',
  '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF',
  '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC',
  '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF',
  '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC',
  '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033',
  '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366',
  '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933',
  '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC',
  '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF',
  '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // Internet Explorer and Edge do not support colors.
  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit');

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}
});
var browser_1 = browser.log;
var browser_2 = browser.formatArgs;
var browser_3 = browser.save;
var browser_4 = browser.load;
var browser_5 = browser.useColors;
var browser_6 = browser.storage;
var browser_7 = browser.colors;

var hasFlag = (flag, argv) => {
	argv = argv || process.argv;
	const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
	const pos = argv.indexOf(prefix + flag);
	const terminatorPos = argv.indexOf('--');
	return pos !== -1 && (terminatorPos === -1 ? true : pos < terminatorPos);
};

const env = process.env;

let forceColor;
if (hasFlag('no-color') ||
	hasFlag('no-colors') ||
	hasFlag('color=false')) {
	forceColor = false;
} else if (hasFlag('color') ||
	hasFlag('colors') ||
	hasFlag('color=true') ||
	hasFlag('color=always')) {
	forceColor = true;
}
if ('FORCE_COLOR' in env) {
	forceColor = env.FORCE_COLOR.length === 0 || parseInt(env.FORCE_COLOR, 10) !== 0;
}

function translateLevel(level) {
	if (level === 0) {
		return false;
	}

	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3
	};
}

function supportsColor(stream) {
	if (forceColor === false) {
		return 0;
	}

	if (hasFlag('color=16m') ||
		hasFlag('color=full') ||
		hasFlag('color=truecolor')) {
		return 3;
	}

	if (hasFlag('color=256')) {
		return 2;
	}

	if (stream && !stream.isTTY && forceColor !== true) {
		return 0;
	}

	const min = forceColor ? 1 : 0;

	if (process.platform === 'win32') {
		// Node.js 7.5.0 is the first version of Node.js to include a patch to
		// libuv that enables 256 color output on Windows. Anything earlier and it
		// won't work. However, here we target Node.js 8 at minimum as it is an LTS
		// release, and Node.js 7 is not. Windows 10 build 10586 is the first Windows
		// release that supports 256 colors. Windows 10 build 14931 is the first release
		// that supports 16m/TrueColor.
		const osRelease = os.release().split('.');
		if (
			Number(process.versions.node.split('.')[0]) >= 8 &&
			Number(osRelease[0]) >= 10 &&
			Number(osRelease[2]) >= 10586
		) {
			return Number(osRelease[2]) >= 14931 ? 3 : 2;
		}

		return 1;
	}

	if ('CI' in env) {
		if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
			return 1;
		}

		return min;
	}

	if ('TEAMCITY_VERSION' in env) {
		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
	}

	if (env.COLORTERM === 'truecolor') {
		return 3;
	}

	if ('TERM_PROGRAM' in env) {
		const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

		switch (env.TERM_PROGRAM) {
			case 'iTerm.app':
				return version >= 3 ? 3 : 2;
			case 'Apple_Terminal':
				return 2;
			// No default
		}
	}

	if (/-256(color)?$/i.test(env.TERM)) {
		return 2;
	}

	if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
		return 1;
	}

	if ('COLORTERM' in env) {
		return 1;
	}

	if (env.TERM === 'dumb') {
		return min;
	}

	return min;
}

function getSupportLevel(stream) {
	const level = supportsColor(stream);
	return translateLevel(level);
}

var supportsColor_1 = {
	supportsColor: getSupportLevel,
	stdout: getSupportLevel(process.stdout),
	stderr: getSupportLevel(process.stderr)
};

var node = createCommonjsModule(function (module, exports) {
/**
 * Module dependencies.
 */




/**
 * This is the Node.js implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug;
exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;

/**
 * Colors.
 */

exports.colors = [ 6, 2, 3, 4, 5, 1 ];

try {
  var supportsColor = supportsColor_1;
  if (supportsColor && supportsColor.level >= 2) {
    exports.colors = [
      20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45, 56, 57, 62, 63, 68,
      69, 74, 75, 76, 77, 78, 79, 80, 81, 92, 93, 98, 99, 112, 113, 128, 129, 134,
      135, 148, 149, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171,
      172, 173, 178, 179, 184, 185, 196, 197, 198, 199, 200, 201, 202, 203, 204,
      205, 206, 207, 208, 209, 214, 215, 220, 221
    ];
  }
} catch (err) {
  // swallow - we only care if `supports-color` is available; it doesn't have to be.
}

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(function (key) {
  return /^debug_/i.test(key);
}).reduce(function (obj, key) {
  // camel-case
  var prop = key
    .substring(6)
    .toLowerCase()
    .replace(/_([a-z])/g, function (_, k) { return k.toUpperCase() });

  // coerce string value into JS value
  var val = process.env[key];
  if (/^(yes|on|true|enabled)$/i.test(val)) val = true;
  else if (/^(no|off|false|disabled)$/i.test(val)) val = false;
  else if (val === 'null') val = null;
  else val = Number(val);

  obj[prop] = val;
  return obj;
}, {});

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
  return 'colors' in exports.inspectOpts
    ? Boolean(exports.inspectOpts.colors)
    : tty.isatty(process.stderr.fd);
}

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

exports.formatters.o = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts)
    .split('\n').map(function(str) {
      return str.trim()
    }).join(' ');
};

/**
 * Map %o to `util.inspect()`, allowing multiple lines if needed.
 */

exports.formatters.O = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts);
};

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var name = this.namespace;
  var useColors = this.useColors;

  if (useColors) {
    var c = this.color;
    var colorCode = '\u001b[3' + (c < 8 ? c : '8;5;' + c);
    var prefix = '  ' + colorCode + ';1m' + name + ' ' + '\u001b[0m';

    args[0] = prefix + args[0].split('\n').join('\n' + prefix);
    args.push(colorCode + 'm+' + exports.humanize(this.diff) + '\u001b[0m');
  } else {
    args[0] = getDate() + name + ' ' + args[0];
  }
}

function getDate() {
  if (exports.inspectOpts.hideDate) {
    return '';
  } else {
    return new Date().toISOString() + ' ';
  }
}

/**
 * Invokes `util.format()` with the specified arguments and writes to stderr.
 */

function log() {
  return process.stderr.write(util.format.apply(util, arguments) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  if (null == namespaces) {
    // If you set a process.env field to null or undefined, it gets cast to the
    // string 'null' or 'undefined'. Just delete instead.
    delete process.env.DEBUG;
  } else {
    process.env.DEBUG = namespaces;
  }
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  return process.env.DEBUG;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init (debug) {
  debug.inspectOpts = {};

  var keys = Object.keys(exports.inspectOpts);
  for (var i = 0; i < keys.length; i++) {
    debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
  }
}

/**
 * Enable namespaces listed in `process.env.DEBUG` initially.
 */

exports.enable(load());
});
var node_1 = node.init;
var node_2 = node.log;
var node_3 = node.formatArgs;
var node_4 = node.save;
var node_5 = node.load;
var node_6 = node.useColors;
var node_7 = node.colors;
var node_8 = node.inspectOpts;

var src = createCommonjsModule(function (module) {
/**
 * Detect Electron renderer process, which is node, but we should
 * treat as a browser.
 */

if (typeof process === 'undefined' || process.type === 'renderer') {
  module.exports = browser;
} else {
  module.exports = node;
}
});

var Writable = stream.Writable;
var debug$1 = src("follow-redirects");

// RFC7231§4.2.1: Of the request methods defined by this specification,
// the GET, HEAD, OPTIONS, and TRACE methods are defined to be safe.
var SAFE_METHODS = { GET: true, HEAD: true, OPTIONS: true, TRACE: true };

// Create handlers that pass events from native requests
var eventHandlers = Object.create(null);
["abort", "aborted", "error", "socket", "timeout"].forEach(function (event) {
  eventHandlers[event] = function (arg) {
    this._redirectable.emit(event, arg);
  };
});

// An HTTP(S) request that can be redirected
function RedirectableRequest(options, responseCallback) {
  // Initialize the request
  Writable.call(this);
  options.headers = options.headers || {};
  this._options = options;
  this._redirectCount = 0;
  this._redirects = [];
  this._requestBodyLength = 0;
  this._requestBodyBuffers = [];

  // Since http.request treats host as an alias of hostname,
  // but the url module interprets host as hostname plus port,
  // eliminate the host property to avoid confusion.
  if (options.host) {
    // Use hostname if set, because it has precedence
    if (!options.hostname) {
      options.hostname = options.host;
    }
    delete options.host;
  }

  // Attach a callback if passed
  if (responseCallback) {
    this.on("response", responseCallback);
  }

  // React to responses of native requests
  var self = this;
  this._onNativeResponse = function (response) {
    self._processResponse(response);
  };

  // Complete the URL object when necessary
  if (!options.pathname && options.path) {
    var searchPos = options.path.indexOf("?");
    if (searchPos < 0) {
      options.pathname = options.path;
    }
    else {
      options.pathname = options.path.substring(0, searchPos);
      options.search = options.path.substring(searchPos);
    }
  }

  // Perform the first request
  this._performRequest();
}
RedirectableRequest.prototype = Object.create(Writable.prototype);

// Writes buffered data to the current native request
RedirectableRequest.prototype.write = function (data, encoding, callback) {
  // Validate input and shift parameters if necessary
  if (!(typeof data === "string" || typeof data === "object" && ("length" in data))) {
    throw new Error("data should be a string, Buffer or Uint8Array");
  }
  if (typeof encoding === "function") {
    callback = encoding;
    encoding = null;
  }

  // Ignore empty buffers, since writing them doesn't invoke the callback
  // https://github.com/nodejs/node/issues/22066
  if (data.length === 0) {
    if (callback) {
      callback();
    }
    return;
  }
  // Only write when we don't exceed the maximum body length
  if (this._requestBodyLength + data.length <= this._options.maxBodyLength) {
    this._requestBodyLength += data.length;
    this._requestBodyBuffers.push({ data: data, encoding: encoding });
    this._currentRequest.write(data, encoding, callback);
  }
  // Error when we exceed the maximum body length
  else {
    this.emit("error", new Error("Request body larger than maxBodyLength limit"));
    this.abort();
  }
};

// Ends the current native request
RedirectableRequest.prototype.end = function (data, encoding, callback) {
  // Shift parameters if necessary
  if (typeof data === "function") {
    callback = data;
    data = encoding = null;
  }
  else if (typeof encoding === "function") {
    callback = encoding;
    encoding = null;
  }

  // Write data and end
  var currentRequest = this._currentRequest;
  this.write(data || "", encoding, function () {
    currentRequest.end(null, null, callback);
  });
};

// Sets a header value on the current native request
RedirectableRequest.prototype.setHeader = function (name, value) {
  this._options.headers[name] = value;
  this._currentRequest.setHeader(name, value);
};

// Clears a header value on the current native request
RedirectableRequest.prototype.removeHeader = function (name) {
  delete this._options.headers[name];
  this._currentRequest.removeHeader(name);
};

// Proxy all other public ClientRequest methods
[
  "abort", "flushHeaders", "getHeader",
  "setNoDelay", "setSocketKeepAlive", "setTimeout",
].forEach(function (method) {
  RedirectableRequest.prototype[method] = function (a, b) {
    return this._currentRequest[method](a, b);
  };
});

// Proxy all public ClientRequest properties
["aborted", "connection", "socket"].forEach(function (property) {
  Object.defineProperty(RedirectableRequest.prototype, property, {
    get: function () { return this._currentRequest[property]; },
  });
});

// Executes the next native request (initial or redirect)
RedirectableRequest.prototype._performRequest = function () {
  // Load the native protocol
  var protocol = this._options.protocol;
  var nativeProtocol = this._options.nativeProtocols[protocol];
  if (!nativeProtocol) {
    this.emit("error", new Error("Unsupported protocol " + protocol));
    return;
  }

  // If specified, use the agent corresponding to the protocol
  // (HTTP and HTTPS use different types of agents)
  if (this._options.agents) {
    var scheme = protocol.substr(0, protocol.length - 1);
    this._options.agent = this._options.agents[scheme];
  }

  // Create the native request
  var request = this._currentRequest =
        nativeProtocol.request(this._options, this._onNativeResponse);
  this._currentUrl = url.format(this._options);

  // Set up event handlers
  request._redirectable = this;
  for (var event in eventHandlers) {
    /* istanbul ignore else */
    if (event) {
      request.on(event, eventHandlers[event]);
    }
  }

  // End a redirected request
  // (The first request must be ended explicitly with RedirectableRequest#end)
  if (this._isRedirect) {
    // Write the request entity and end.
    var i = 0;
    var buffers = this._requestBodyBuffers;
    (function writeNext() {
      if (i < buffers.length) {
        var buffer = buffers[i++];
        request.write(buffer.data, buffer.encoding, writeNext);
      }
      else {
        request.end();
      }
    }());
  }
};

// Processes a response from the current native request
RedirectableRequest.prototype._processResponse = function (response) {
  // Store the redirected response
  if (this._options.trackRedirects) {
    this._redirects.push({
      url: this._currentUrl,
      headers: response.headers,
      statusCode: response.statusCode,
    });
  }

  // RFC7231§6.4: The 3xx (Redirection) class of status code indicates
  // that further action needs to be taken by the user agent in order to
  // fulfill the request. If a Location header field is provided,
  // the user agent MAY automatically redirect its request to the URI
  // referenced by the Location field value,
  // even if the specific status code is not understood.
  var location = response.headers.location;
  if (location && this._options.followRedirects !== false &&
      response.statusCode >= 300 && response.statusCode < 400) {
    // RFC7231§6.4: A client SHOULD detect and intervene
    // in cyclical redirections (i.e., "infinite" redirection loops).
    if (++this._redirectCount > this._options.maxRedirects) {
      this.emit("error", new Error("Max redirects exceeded."));
      return;
    }

    // RFC7231§6.4: Automatic redirection needs to done with
    // care for methods not known to be safe […],
    // since the user might not wish to redirect an unsafe request.
    // RFC7231§6.4.7: The 307 (Temporary Redirect) status code indicates
    // that the target resource resides temporarily under a different URI
    // and the user agent MUST NOT change the request method
    // if it performs an automatic redirection to that URI.
    var header;
    var headers = this._options.headers;
    if (response.statusCode !== 307 && !(this._options.method in SAFE_METHODS)) {
      this._options.method = "GET";
      // Drop a possible entity and headers related to it
      this._requestBodyBuffers = [];
      for (header in headers) {
        if (/^content-/i.test(header)) {
          delete headers[header];
        }
      }
    }

    // Drop the Host header, as the redirect might lead to a different host
    if (!this._isRedirect) {
      for (header in headers) {
        if (/^host$/i.test(header)) {
          delete headers[header];
        }
      }
    }

    // Perform the redirected request
    var redirectUrl = url.resolve(this._currentUrl, location);
    debug$1("redirecting to", redirectUrl);
    Object.assign(this._options, url.parse(redirectUrl));
    this._isRedirect = true;
    this._performRequest();

    // Discard the remainder of the response to avoid waiting for data
    response.destroy();
  }
  else {
    // The response is not a redirect; return it as-is
    response.responseUrl = this._currentUrl;
    response.redirects = this._redirects;
    this.emit("response", response);

    // Clean up
    this._requestBodyBuffers = [];
  }
};

// Wraps the key/value object of protocols with redirect functionality
function wrap(protocols) {
  // Default settings
  var exports = {
    maxRedirects: 21,
    maxBodyLength: 10 * 1024 * 1024,
  };

  // Wrap each protocol
  var nativeProtocols = {};
  Object.keys(protocols).forEach(function (scheme) {
    var protocol = scheme + ":";
    var nativeProtocol = nativeProtocols[protocol] = protocols[scheme];
    var wrappedProtocol = exports[scheme] = Object.create(nativeProtocol);

    // Executes a request, following redirects
    wrappedProtocol.request = function (options, callback) {
      if (typeof options === "string") {
        options = url.parse(options);
        options.maxRedirects = exports.maxRedirects;
      }
      else {
        options = Object.assign({
          protocol: protocol,
          maxRedirects: exports.maxRedirects,
          maxBodyLength: exports.maxBodyLength,
        }, options);
      }
      options.nativeProtocols = nativeProtocols;
      assert.equal(options.protocol, protocol, "protocol mismatch");
      debug$1("options", options);
      return new RedirectableRequest(options, callback);
    };

    // Executes a GET request, following redirects
    wrappedProtocol.get = function (options, callback) {
      var request = wrappedProtocol.request(options, callback);
      request.end();
      return request;
    };
  });
  return exports;
}

// Exports
var followRedirects = wrap({ http: http, https: https });
var wrap_1 = wrap;
followRedirects.wrap = wrap_1;

var _args = [
	[
		"axios@0.19.0",
		"/Users/vesa/code/JS-SDK"
	]
];
var _from = "axios@0.19.0";
var _id = "axios@0.19.0";
var _inBundle = false;
var _integrity = "sha512-1uvKqKQta3KBxIz14F2v06AEHZ/dIoeKfbTRkK1E5oqjDnuEerLmYTgJB5AiQZHJcljpg1TuRzdjDR06qNk0DQ==";
var _location = "/axios";
var _phantomChildren = {
};
var _requested = {
	type: "version",
	registry: true,
	raw: "axios@0.19.0",
	name: "axios",
	escapedName: "axios",
	rawSpec: "0.19.0",
	saveSpec: null,
	fetchSpec: "0.19.0"
};
var _requiredBy = [
	"/"
];
var _resolved = "https://registry.npmjs.org/axios/-/axios-0.19.0.tgz";
var _spec = "0.19.0";
var _where = "/Users/vesa/code/JS-SDK";
var author = {
	name: "Matt Zabriskie"
};
var browser$1 = {
	"./lib/adapters/http.js": "./lib/adapters/xhr.js"
};
var bugs = {
	url: "https://github.com/axios/axios/issues"
};
var bundlesize = [
	{
		path: "./dist/axios.min.js",
		threshold: "5kB"
	}
];
var dependencies = {
	"follow-redirects": "1.5.10",
	"is-buffer": "^2.0.2"
};
var description = "Promise based HTTP client for the browser and node.js";
var devDependencies = {
	bundlesize: "^0.17.0",
	coveralls: "^3.0.0",
	"es6-promise": "^4.2.4",
	grunt: "^1.0.2",
	"grunt-banner": "^0.6.0",
	"grunt-cli": "^1.2.0",
	"grunt-contrib-clean": "^1.1.0",
	"grunt-contrib-watch": "^1.0.0",
	"grunt-eslint": "^20.1.0",
	"grunt-karma": "^2.0.0",
	"grunt-mocha-test": "^0.13.3",
	"grunt-ts": "^6.0.0-beta.19",
	"grunt-webpack": "^1.0.18",
	"istanbul-instrumenter-loader": "^1.0.0",
	"jasmine-core": "^2.4.1",
	karma: "^1.3.0",
	"karma-chrome-launcher": "^2.2.0",
	"karma-coverage": "^1.1.1",
	"karma-firefox-launcher": "^1.1.0",
	"karma-jasmine": "^1.1.1",
	"karma-jasmine-ajax": "^0.1.13",
	"karma-opera-launcher": "^1.0.0",
	"karma-safari-launcher": "^1.0.0",
	"karma-sauce-launcher": "^1.2.0",
	"karma-sinon": "^1.0.5",
	"karma-sourcemap-loader": "^0.3.7",
	"karma-webpack": "^1.7.0",
	"load-grunt-tasks": "^3.5.2",
	minimist: "^1.2.0",
	mocha: "^5.2.0",
	sinon: "^4.5.0",
	typescript: "^2.8.1",
	"url-search-params": "^0.10.0",
	webpack: "^1.13.1",
	"webpack-dev-server": "^1.14.1"
};
var homepage = "https://github.com/axios/axios";
var keywords = [
	"xhr",
	"http",
	"ajax",
	"promise",
	"node"
];
var license = "MIT";
var main = "index.js";
var name = "axios";
var repository = {
	type: "git",
	url: "git+https://github.com/axios/axios.git"
};
var scripts = {
	build: "NODE_ENV=production grunt build",
	coveralls: "cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js",
	examples: "node ./examples/server.js",
	fix: "eslint --fix lib/**/*.js",
	postversion: "git push && git push --tags",
	preversion: "npm test",
	start: "node ./sandbox/server.js",
	test: "grunt test && bundlesize",
	version: "npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json"
};
var typings = "./index.d.ts";
var version = "0.19.0";
var _package = {
	_args: _args,
	_from: _from,
	_id: _id,
	_inBundle: _inBundle,
	_integrity: _integrity,
	_location: _location,
	_phantomChildren: _phantomChildren,
	_requested: _requested,
	_requiredBy: _requiredBy,
	_resolved: _resolved,
	_spec: _spec,
	_where: _where,
	author: author,
	browser: browser$1,
	bugs: bugs,
	bundlesize: bundlesize,
	dependencies: dependencies,
	description: description,
	devDependencies: devDependencies,
	homepage: homepage,
	keywords: keywords,
	license: license,
	main: main,
	name: name,
	repository: repository,
	scripts: scripts,
	typings: typings,
	version: version
};

var _package$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	_args: _args,
	_from: _from,
	_id: _id,
	_inBundle: _inBundle,
	_integrity: _integrity,
	_location: _location,
	_phantomChildren: _phantomChildren,
	_requested: _requested,
	_requiredBy: _requiredBy,
	_resolved: _resolved,
	_spec: _spec,
	_where: _where,
	author: author,
	browser: browser$1,
	bugs: bugs,
	bundlesize: bundlesize,
	dependencies: dependencies,
	description: description,
	devDependencies: devDependencies,
	homepage: homepage,
	keywords: keywords,
	license: license,
	main: main,
	name: name,
	repository: repository,
	scripts: scripts,
	typings: typings,
	version: version,
	'default': _package
});

var pkg = getCjsExportFromNamespace(_package$1);

var httpFollow = followRedirects.http;
var httpsFollow = followRedirects.https;






var isHttps = /https:?/;

/*eslint consistent-return:0*/
var http_1 = function httpAdapter(config) {
  return new Promise(function dispatchHttpRequest(resolvePromise, rejectPromise) {
    var timer;
    var resolve = function resolve(value) {
      clearTimeout(timer);
      resolvePromise(value);
    };
    var reject = function reject(value) {
      clearTimeout(timer);
      rejectPromise(value);
    };
    var data = config.data;
    var headers = config.headers;

    // Set User-Agent (required by some servers)
    // Only set header if it hasn't been set in config
    // See https://github.com/axios/axios/issues/69
    if (!headers['User-Agent'] && !headers['user-agent']) {
      headers['User-Agent'] = 'axios/' + pkg.version;
    }

    if (data && !utils.isStream(data)) {
      if (Buffer.isBuffer(data)) ; else if (utils.isArrayBuffer(data)) {
        data = Buffer.from(new Uint8Array(data));
      } else if (utils.isString(data)) {
        data = Buffer.from(data, 'utf-8');
      } else {
        return reject(createError(
          'Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream',
          config
        ));
      }

      // Add Content-Length header if data exists
      headers['Content-Length'] = data.length;
    }

    // HTTP basic authentication
    var auth = undefined;
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      auth = username + ':' + password;
    }

    // Parse url
    var parsed = url.parse(config.url);
    var protocol = parsed.protocol || 'http:';

    if (!auth && parsed.auth) {
      var urlAuth = parsed.auth.split(':');
      var urlUsername = urlAuth[0] || '';
      var urlPassword = urlAuth[1] || '';
      auth = urlUsername + ':' + urlPassword;
    }

    if (auth) {
      delete headers.Authorization;
    }

    var isHttpsRequest = isHttps.test(protocol);
    var agent = isHttpsRequest ? config.httpsAgent : config.httpAgent;

    var options = {
      path: buildURL(parsed.path, config.params, config.paramsSerializer).replace(/^\?/, ''),
      method: config.method.toUpperCase(),
      headers: headers,
      agent: agent,
      auth: auth
    };

    if (config.socketPath) {
      options.socketPath = config.socketPath;
    } else {
      options.hostname = parsed.hostname;
      options.port = parsed.port;
    }

    var proxy = config.proxy;
    if (!proxy && proxy !== false) {
      var proxyEnv = protocol.slice(0, -1) + '_proxy';
      var proxyUrl = process.env[proxyEnv] || process.env[proxyEnv.toUpperCase()];
      if (proxyUrl) {
        var parsedProxyUrl = url.parse(proxyUrl);
        var noProxyEnv = process.env.no_proxy || process.env.NO_PROXY;
        var shouldProxy = true;

        if (noProxyEnv) {
          var noProxy = noProxyEnv.split(',').map(function trim(s) {
            return s.trim();
          });

          shouldProxy = !noProxy.some(function proxyMatch(proxyElement) {
            if (!proxyElement) {
              return false;
            }
            if (proxyElement === '*') {
              return true;
            }
            if (proxyElement[0] === '.' &&
                parsed.hostname.substr(parsed.hostname.length - proxyElement.length) === proxyElement &&
                proxyElement.match(/\./g).length === parsed.hostname.match(/\./g).length) {
              return true;
            }

            return parsed.hostname === proxyElement;
          });
        }


        if (shouldProxy) {
          proxy = {
            host: parsedProxyUrl.hostname,
            port: parsedProxyUrl.port
          };

          if (parsedProxyUrl.auth) {
            var proxyUrlAuth = parsedProxyUrl.auth.split(':');
            proxy.auth = {
              username: proxyUrlAuth[0],
              password: proxyUrlAuth[1]
            };
          }
        }
      }
    }

    if (proxy) {
      options.hostname = proxy.host;
      options.host = proxy.host;
      options.headers.host = parsed.hostname + (parsed.port ? ':' + parsed.port : '');
      options.port = proxy.port;
      options.path = protocol + '//' + parsed.hostname + (parsed.port ? ':' + parsed.port : '') + options.path;

      // Basic proxy authorization
      if (proxy.auth) {
        var base64 = Buffer.from(proxy.auth.username + ':' + proxy.auth.password, 'utf8').toString('base64');
        options.headers['Proxy-Authorization'] = 'Basic ' + base64;
      }
    }

    var transport;
    var isHttpsProxy = isHttpsRequest && (proxy ? isHttps.test(proxy.protocol) : true);
    if (config.transport) {
      transport = config.transport;
    } else if (config.maxRedirects === 0) {
      transport = isHttpsProxy ? https : http;
    } else {
      if (config.maxRedirects) {
        options.maxRedirects = config.maxRedirects;
      }
      transport = isHttpsProxy ? httpsFollow : httpFollow;
    }

    if (config.maxContentLength && config.maxContentLength > -1) {
      options.maxBodyLength = config.maxContentLength;
    }

    // Create the request
    var req = transport.request(options, function handleResponse(res) {
      if (req.aborted) return;

      // uncompress the response body transparently if required
      var stream = res;
      switch (res.headers['content-encoding']) {
      /*eslint default-case:0*/
      case 'gzip':
      case 'compress':
      case 'deflate':
        // add the unzipper to the body stream processing pipeline
        stream = (res.statusCode === 204) ? stream : stream.pipe(zlib.createUnzip());

        // remove the content-encoding in order to not confuse downstream operations
        delete res.headers['content-encoding'];
        break;
      }

      // return the last request in case of redirects
      var lastRequest = res.req || req;

      var response = {
        status: res.statusCode,
        statusText: res.statusMessage,
        headers: res.headers,
        config: config,
        request: lastRequest
      };

      if (config.responseType === 'stream') {
        response.data = stream;
        settle(resolve, reject, response);
      } else {
        var responseBuffer = [];
        stream.on('data', function handleStreamData(chunk) {
          responseBuffer.push(chunk);

          // make sure the content length is not over the maxContentLength if specified
          if (config.maxContentLength > -1 && Buffer.concat(responseBuffer).length > config.maxContentLength) {
            stream.destroy();
            reject(createError('maxContentLength size of ' + config.maxContentLength + ' exceeded',
              config, null, lastRequest));
          }
        });

        stream.on('error', function handleStreamError(err) {
          if (req.aborted) return;
          reject(enhanceError(err, config, null, lastRequest));
        });

        stream.on('end', function handleStreamEnd() {
          var responseData = Buffer.concat(responseBuffer);
          if (config.responseType !== 'arraybuffer') {
            responseData = responseData.toString(config.responseEncoding);
          }

          response.data = responseData;
          settle(resolve, reject, response);
        });
      }
    });

    // Handle errors
    req.on('error', function handleRequestError(err) {
      if (req.aborted) return;
      reject(enhanceError(err, config, null, req));
    });

    // Handle request timeout
    if (config.timeout) {
      timer = setTimeout(function handleRequestTimeout() {
        req.abort();
        reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED', req));
      }, config.timeout);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (req.aborted) return;

        req.abort();
        reject(cancel);
      });
    }

    // Send the request
    if (utils.isStream(data)) {
      data.on('error', function handleStreamError(err) {
        reject(enhanceError(err, config, null, req));
      }).pipe(req);
    } else {
      req.end(data);
    }
  });
};

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
var parseHeaders = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};

var isURLSameOrigin = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);

var cookies = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);

var xhr = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies$1 = cookies;

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
        cookies$1.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (config.withCredentials) {
      request.withCredentials = true;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  // Only Node.JS has a process variable that is of [[Class]] process
  if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = http_1;
  } else if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = xhr;
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

var defaults_1 = defaults;

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
var isAbsoluteURL = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
var combineURLs = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
var dispatchRequest = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults_1.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
var mergeConfig = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  utils.forEach(['url', 'method', 'params', 'data'], function valueFromConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    }
  });

  utils.forEach(['headers', 'auth', 'proxy'], function mergeDeepProperties(prop) {
    if (utils.isObject(config2[prop])) {
      config[prop] = utils.deepMerge(config1[prop], config2[prop]);
    } else if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (utils.isObject(config1[prop])) {
      config[prop] = utils.deepMerge(config1[prop]);
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  utils.forEach([
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'maxContentLength',
    'validateStatus', 'maxRedirects', 'httpAgent', 'httpsAgent', 'cancelToken',
    'socketPath'
  ], function defaultToConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  return config;
};

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager_1(),
    response: new InterceptorManager_1()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);
  config.method = config.method ? config.method.toLowerCase() : 'get';

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

var Axios_1 = Axios;

/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

var Cancel_1 = Cancel;

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel_1(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

var CancelToken_1 = CancelToken;

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
var spread = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios_1(defaultConfig);
  var instance = bind(Axios_1.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios_1.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults_1);

// Expose Axios class to allow class inheritance
axios.Axios = Axios_1;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = Cancel_1;
axios.CancelToken = CancelToken_1;
axios.isCancel = isCancel;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = spread;

var axios_1 = axios;

// Allow use of default import syntax in TypeScript
var default_1 = axios;
axios_1.default = default_1;

var axios$1 = axios_1;

var WHITELIST = [
	'ETIMEDOUT',
	'ECONNRESET',
	'EADDRINUSE',
	'ESOCKETTIMEDOUT',
	'ECONNREFUSED',
	'EPIPE',
	'EHOSTUNREACH',
	'EAI_AGAIN'
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

});

unwrapExports(lib);
var lib_1 = lib.isNetworkError;
var lib_2 = lib.isRetryableError;
var lib_3 = lib.isSafeRequestError;
var lib_4 = lib.isIdempotentRequestError;
var lib_5 = lib.isNetworkOrIdempotentRequestError;
var lib_6 = lib.exponentialDelay;

var axiosRetry = lib.default;

//      
const SSL_CHECK_INTERVALL = 1000 * 60 * 60; // One hour

/*
 * Returns > 0 if v1 > v2 and < 0 if v1 < v2 and 0 if v1 == v2
 */

function compareVersions(v1, v2) {
  const v1Parts = v1.split('.');
  const v2Parts = v2.split('.');
  const minLength = Math.min(v1Parts.length, v2Parts.length);

  if (minLength > 0) {
    for (let idx = 0; idx < minLength - 1; idx += 1) {
      const diff = Number(v1Parts[idx]) - Number(v2Parts[idx]);

      if (diff !== 0) {
        return diff;
      }
    }
  }

  return v1Parts.length - v2Parts.length;
}
/*
 * Get API version, or given MAX version, from given hubVersion string
 * e.g. 1.12.0.5
 */


function getAPIversion(hubVersion, maxVersion) {
  let retVal = '0.0';
  const majorEnd = hubVersion.indexOf('.');
  let minorEnd = -1;

  if (majorEnd !== -1) {
    minorEnd = hubVersion.indexOf('.', majorEnd + 1);
  }

  if (minorEnd !== -1) {
    retVal = hubVersion.substring(0, minorEnd);
  }

  if (compareVersions(retVal, maxVersion) > 0) {
    retVal = maxVersion;
  }

  return retVal;
}
/*
 * Return cloud connection state based on error
 */

function cloudErrorState(error) {
  let retVal = CLOUD_CONNECTION_STATES.UNCONNECTED;

  if (error && error.response && error.response.status === 401) {
    // 401 Authentication information missing or expired.
    retVal = CLOUD_CONNECTION_STATES.UNAUTHENTICATED;
    console.error('send: authentication error ', error);
  } else if (error && error.response && error.response.status === 403) {
    // 402 Late payment - > no remote access
    retVal = CLOUD_CONNECTION_STATES.LATE_PAYMENT;
    console.error('send: unauhorized error ', error);
  } else if (error && error.response && error.response.status === 403) {
    // 403 Unauthorized
    retVal = CLOUD_CONNECTION_STATES.UNAUTHORIZED;
    console.error('send: unauhorized error ', error);
  } else if (error && error.response && error.response.status === 410) {
    // 410 Version problem
    retVal = CLOUD_CONNECTION_STATES.OBSOLETE_API_VERSION;
    console.error('send: version error ', error);
  }

  return retVal;
}
/*
 * Return hub connection state based on given error
 * @param  {Object} error
 * @return {string} hub's connectionState
 */

function hubErrorState(error) {
  let retVal = HUB_CONNECTION_STATES.UNCONNECTED;

  if (error && error.response && error.response.status === 400) {
    // no connection to offline hub
    console.log('send: no-connection error ', error);
  } else if (error && error.response && error.response.status === 401) {
    // 401 Authentication information missing or expired.
    retVal = HUB_CONNECTION_STATES.UNAUTHENTICATED;
    console.error('send: authentication error ', error);
  } else if (error && error.response && error.response.status === 403) {
    // 403 Unauthorized
    retVal = HUB_CONNECTION_STATES.UNAUTHORIZED;
    console.error('send: unauhorized error ', error);
  } else if (error && error.response && error.response.status === 410) {
    // 410 Version problem
    retVal = HUB_CONNECTION_STATES.OBSOLETE_API_VERSION;
    console.error('send: version error ', error);
  }

  return retVal;
}
let ongoingSSLCertificateCheck = false;
let lastSSLCertificateCheckTime = null;
/*
 * Palceholder function for certificate checker
 * @return {Promise}
 */

function testSSLCertificate(remoteConnection) {
  return new Promise(resolve => {
    if (!remoteConnection) {
      // All requests are now complete
      resolve(true);
      return;
    }

    const now = new Date().getTime();

    if (!ongoingSSLCertificateCheck && (!lastSSLCertificateCheckTime || now - lastSSLCertificateCheckTime > SSL_CHECK_INTERVALL)) {
      ongoingSSLCertificateCheck = true;
      lastSSLCertificateCheckTime = now; // Cordova plugin?

      if (!isNode && window && window.plugins && window.plugins.sslCertificateChecker) {
        window.plugins.sslCertificateChecker.check(() => {
          ongoingSSLCertificateCheck = false;
          resolve(true);
        }, errorMsg => {
          if (errorMsg === 'CONNECTION_NOT_SECURE') {
            ongoingSSLCertificateCheck = false;
            resolve(false);
          } else {
            ongoingSSLCertificateCheck = false;
            lastSSLCertificateCheckTime = undefined;
            resolve(true);
          }
        }, getCloudHost(), CLOUD_FINGERPRINTS_SHA1);
      } else {
        setTimeout(() => {
          ongoingSSLCertificateCheck = false;
        }, SSL_CHECK_INTERVALL);
        resolve(true);
      }
    } else {
      resolve(true);
    }
  });
}

// import isRetryAllowed from 'is-retry-allowed';
const SAFE_HTTP_METHODS = ['get', 'head', 'options'];
const IDEMPOTENT_HTTP_METHODS = SAFE_HTTP_METHODS.concat(['put', 'delete']);
const ALL_HTTP_METHODS = IDEMPOTENT_HTTP_METHODS.concat(['post']);
/*
 * @param  {Error}  error
 * @return {boolean}

function isNetworkError(error) {
  return (
    !error.response
    && isRetryAllowed(error) // Prevents retrying unsafe errors
    && !(Boolean(error.code) && error.code === 'ECONNABORTED') // Prevents retrying timed out requests
  );
}
*/

/*
 * @param  {Error}  error
 * @return {boolean}
 */

function isRetryableError(error) {
  /*
  return (
    error.code !== 'ECONNABORTED'
    && (!error.response || (error.response.status >= 500 && error.response.status <= 599))
  );
  */
  return !error.response || error.response.status >= 500 && error.response.status <= 599;
}
/*
 * @param  {Error}  error
 * @return {boolean}
 */


function isSafeRequestError(error) {
  if (!error.config) {
    // Cannot determine if the request can be retried
    return false;
  }

  return isRetryableError(error) && ALL_HTTP_METHODS.indexOf(error.config.method) !== -1;
}

const httpRetries = {};
const RETRY_COUNT = 2;
function resetRetry(url) {
  if (httpRetries[url]) {
    console.warn('resetRetry to 0');
    httpRetries[url] = 0;
    delete httpRetries[url];
  }
}
/*
 * @param  {Error}  error
 * @return {boolean}
 */

function retryCondition(error) {
  // if (error.config.url.indexOf('192.168.1.119') !== -1) debugger;
  if (error && error.config && error.config.url) {
    if (httpRetries[error.config.url]) {
      if (httpRetries[error.config.url] >= RETRY_COUNT) {
        httpRetries[error.config.url] = 0;
        console.error('retryCondition count >', RETRY_COUNT);
        return false;
      }

      httpRetries[error.config.url] += httpRetries[error.config.url];
      console.info('retryCondition count set ', httpRetries[error.config.url]);
    } else {
      httpRetries[error.config.url] = 1;
      console.info('retryCondition count set to 1');
    }
  } else {
    console.error('retryCondition unknown', error); // Cannot determine if the request can be retried

    return false;
  }

  if (isSafeRequestError(error) && IDEMPOTENT_HTTP_METHODS.indexOf(error.config.method) !== -1) {
    console.info('retryCondition condition true', error.config);
  } else {
    console.info('retryCondition condition false', error.config);
    httpRetries[error.config.url] = 0;
  }

  const retVal = isSafeRequestError(error) && IDEMPOTENT_HTTP_METHODS.indexOf(error.config.method) !== -1;
  console.info('retryCondition return ', retVal);
  return retVal;
}
/*
 * @param  {Error}  error
 * @return {boolean}
function isNetworkOrIdempotentRequestError(error) {
  return isNetworkError(error) || isIdempotentRequestError(error);
}
 */

//      
let refreshingToken = false;
/* eslint no-use-before-define: ["error", { "functions": false }] */

/*
 * Refresh Auth key call
 */

function refreshAuthKey(authKey) {
  if (!refreshingToken) {
    refreshingToken = true;
    send({
      command: COMMANDS.REFRESH_AUTHKEY,
      authKey
    }).then(response => {
      setTimeout(() => {
        refreshingToken = false;
      }, 1000 * 60 * 10); // 10min

      if (response.length > 10) {
        store.dispatch(userState.actions.setAuthKey(response));
      }
    }).catch(() => {
      refreshingToken = false;
    });
  }
}
/*
 * Token refresh
 */


function testAndRefreshToken(key) {
  let exp = null;
  let header = {};
  let payload = {};
  let diff = null;

  if (key) {
    const tokenParts = key.split('.');
    header = JSON.parse(urlBase64Decode(tokenParts[0]));
    payload = JSON.parse(urlBase64Decode(tokenParts[1]));
  }

  if (header && header.exp || payload != null && payload.exp) {
    exp = header.exp ? header.exp : payload.exp;
  }

  if (exp) {
    diff = exp - Math.round(new Date().getTime() / 1000);
  }

  if (!diff || diff < 0) {
    // User is unauthenticated
    setCloudConnectionState(CLOUD_CONNECTION_STATES.UNAUTHENTICATED);
  } else if (diff && diff < 5 * 24 * 60 * 60) {
    // refresh if < 5 days to exp date
    refreshAuthKey(key);
  }
}
/**
 * Send multiple requests
 * @param  {Array<Oject>} requests - requests to be send
 * @return {Promise}
 */


function sendAll(requests) {
  return new Promise(resolve => {
    Promise.all(requests).then(() => {
      // Use the data from the results like so:
      // results[0].data
      // results[1].data
      resolve();
    }).catch(() => {
      // do whatever
      resolve();
    });
  });
}
axiosRetry(axios$1, {
  // retries: 1, DOESN'T WORK, see send_retry.js
  retryCondition,
  shouldResetTimeout: true,
  retryDelay: (retryCount, error) => {
    // console.error('axiosRetry ', retryCount); DOESN'T WORK , see send_retry.js
    console.error('axiosRetry ', error);
    return 5000; // retryCount * 1000;
  }
});
/* Flag to indicate SSL failures */

let permanentSSLFailure = false;
/**
 * Send method for REST API
 * @param {COMMAND_TYPE} params
 *
 * @return {Promise}
 *
 * @example
 *   send( {command: COMMANDS.USER_LOGIN,  data:{email:email, password:password} })
 *   .then((response) => {...});
 *
 * @example
 *   send( {command: COMMANDS.CMD_DEVICE, authKey: authKey, hubKey: hubKey, data:[{id:deviceId, state:state}] })
 *   .then((response) => {...});
 *
 * @example
 *   send( {url: hubURL + "/hub"} )
 *   .then((hubData) => {...});
 *
 */

function send({
  command,
  localUrl,
  url,
  timeout,
  method,
  authKey,
  hubKey,
  type,
  config,
  data,
  hubId
}) {
  let sendMethod = method;
  let sendUrl = url;
  let sendTimeout = timeout;
  let sendAuthKey = authKey;
  let sendHubKey = hubKey;
  let sendConfig = config;
  let sendType = type;

  if (sendMethod == null) {
    sendMethod = 'GET';
  }

  if (sendType == null) {
    sendType = 'application/json;charset=UTF-8';
  }

  const body = data;
  /*
  if (isArray(data)) {
    body = [];
    body.push({});
  }
  */
  // console.log("send: command ", command);
  // Flag to indicate are we using remote (vrs.local) connection

  let remoteConnection = false; // Flag to indicate are we sending hub command meaning using commandAPI (vrs. some cloud/videocloud command like login, log etc)

  const hubCommand = !isEmpty_1(hubId);
  const stateNow = store.getState();
  const user = userState.selectors.getUser(stateNow); // const { storedAuthKey } = user;

  if (typeof command !== 'undefined' && command) {
    if (command.method) {
      sendMethod = command.method;
    }

    if (isEmpty_1(sendUrl) && command.url) {
      // command with Hub API version
      if (command.url.indexOf('$API_VER') !== -1) {
        const hubs = hubsState.selectors.getHubs(stateNow);

        if (!hubs[hubId] || !hubs[hubId].hubKey) {
          return new Promise((resolve, reject) => {
            reject(new Error('SDK Error: Send - Hub or hubKey not found error'));
          });
        }

        const hub = hubs[hubId];

        if (!hub.version || hub.connectionState === HUB_CONNECTION_STATES.UNCONNECTED && command.url.indexOf('hub/remote/hub') === -1) {
          return new Promise((resolve, reject) => {
            reject(new Error('SDK Error: Send - No Hub connection error'));
          });
        }

        const hubVersion = getAPIversion(hub.version, MAX_API_VERSION);
        sendUrl = getCloudURL().concat(command.url.replace('$API_VER', hubVersion));
      } else {
        sendUrl = getCloudURL().concat(command.url);
      }
    }

    if (sendUrl) {
      const parts = sendUrl.split('hub/remote');

      if (parts && parts[1]) {
        if (localUrl) {
          sendUrl = localUrl + parts[1];

          if (sendHubKey) {
            sendAuthKey = sendHubKey;
            sendHubKey = null;
          }
        }
      }
    }

    if (sendUrl && sendUrl.indexOf(getCloudURL()) > -1) {
      remoteConnection = true;
    }

    if (command.type && body) {
      if (isArray_1(body)) {
        if (body[0]) {
          body[0].type = command.type;
        } else {
          body.push({
            type: command.type
          });
        }
      } else if (body) {
        body.type = command.type;
      }
    }

    if (command.params) {
      if (!command.params.includes('type')) {
        command.params.push('type');
      }

      command.params.forEach(param => {
        if (isArray_1(data)) {
          if (body && body[0] && data && data[0]) {
            body[0][param] = data[0][param];
          }
        } else if (body && data) {
          body[param] = data[param];
        }
      });
    }

    if (command.urlParams) {
      const params = [];
      command.urlParams.forEach(param => {
        if (data && data[param] !== undefined) {
          params.push(`${encodeURIComponent(param)}=${encodeURIComponent(data[param])}`);
        }
      });

      if (sendUrl && params.length > 0) {
        sendUrl = `${sendUrl}?${params.join('&')}`;
      }
    }

    if (command.timeout) {
      sendTimeout = command.timeout;
    }

    if (command.config) {
      sendConfig = command.config;
    }
  }

  const bodyString = JSON.stringify(body);
  const reqConf = {
    timeout: sendTimeout || 15000,
    method: sendMethod,
    // withCredentials: false,
    headers: {
      Accept: 'application/json, application/binary, text/plain, */*',
      'Content-Type': sendType,
      Authorization: sendAuthKey || null,
      'X-Hub-Key': sendHubKey || null,
      'Accept-Language': null
    },
    crossDomain: true,
    responseType: 'application/json',
    url: sendUrl,
    data: isEmpty_1(bodyString) ? null : bodyString
  };

  if (user.language && user.language !== LANGUAGES.NONE) {
    reqConf.headers['Accept-Language'] = user.language;
  } else {
    delete reqConf.headers['Accept-Language'];
  }

  Object.assign(reqConf, sendConfig);
  return new Promise((resolve, reject) => {
    if (command || sendUrl) {
      axios$1.interceptors.response.use(response => {
        if (response.headers['content-type'].includes('application/json') || response.headers['content-type'].includes('application/binary')) {
          resetRetry(sendUrl);
          return response;
        }

        console.error('send: unknown response type');
        return response; // Promise.reject(response);
      }, error => Promise.reject(error));
      /*
      axios.interceptors.request.use((reqConfig) => {
        //if (reqConfig.url.indexOf('192.168.1.119') !== -1) debugger;
        const rConfig = reqConfig;
        const retryState = rConfig['axios-retry'] || {};
        if (retryState.retryCount > 0) {
          rConfig.headers['x-retry-count'] = retryState.retryCount;
        }
        return rConfig;
      });
      */
      // retries if it is a network error or a 5xx error on an idempotent request (GET, HEAD, OPTIONS, PUT or DELETE).
      // axiosRetry(axios, {
      //  retries: 3, shouldResetTimeout: false, retryDelay: axiosRetry.exponentialDelay, retryCondition,
      // });
      //

      testSSLCertificate(remoteConnection).then(status => {
        // Cancel request if SSL Certificate status is invalid
        if (!status || permanentSSLFailure) {
          permanentSSLFailure = true;
          reject(new Error('SDK Error: SSL failure.'));
        } else {
          // SSL is ok,
          // check if auth Key needs to be refreshed
          if (sendAuthKey) {
            testAndRefreshToken(sendAuthKey);
          } // Send command
          // See options: https://github.com/axios/axios#request-config


          axios$1(reqConf).then(response => {
            // console.error("send: response ", response);
            if (remoteConnection) {
              setCloudConnectionState(CLOUD_CONNECTION_STATES.CONNECTED);
            } else if (hubId) {
              setHubConnectionState$1({
                hubId,
                state: HUB_CONNECTION_STATES.LOCAL
              });
            }

            resolve(response.data);
          }).catch(error => {
            let errorMsg = 'SDK Send error:';

            if (error && error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              if (error.response.data && error.response.data.message) {
                errorMsg = errorMsg.concat(error.response.data.message);
              }

              if (error.response.status) {
                errorMsg = errorMsg.concat(`Status: ${error.response.status}`);
              }

              if (remoteConnection) {
                if (command !== COMMANDS.CLOUD_META) {
                  setCloudConnectionState(cloudErrorState(error));
                }

                if (hubCommand && hubId) {
                  setHubConnectionState$1({
                    hubId,
                    state: hubErrorState(error)
                  });
                }
              } else {
                // Local connection
                // 401 means also cloud auth refresh is required
                if (error && error.response && error.response.status === 401) {
                  setCloudConnectionState(cloudErrorState(error));
                }

                if (hubCommand && hubId) {
                  setHubConnectionState$1({
                    hubId,
                    state: hubErrorState(error)
                  });
                }
              }
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              if (remoteConnection) {
                setCloudConnectionState(CLOUD_CONNECTION_STATES.UNCONNECTED);

                if (hubCommand && hubId) {
                  setHubConnectionState$1({
                    hubId,
                    state: HUB_CONNECTION_STATES.UNCONNECTED
                  });
                }

                errorMsg = errorMsg.concat(`Cloud unconnected in remote. Status ${error.request.status}`);
              } else if (hubCommand && hubId) {
                // Local connection
                setHubConnectionState$1({
                  hubId,
                  state: HUB_CONNECTION_STATES.UNCONNECTED
                });
                errorMsg = errorMsg.concat(`Hub unconnected. Status ${error.request.status}`);
              }
            } else if (remoteConnection) {
              // Something happened in setting up the request that triggered an Error
              setCloudConnectionState(CLOUD_CONNECTION_STATES.UNCONNECTED);
              errorMsg = errorMsg.concat('Cloud unconnected in remote');

              if (hubCommand && hubId) {
                setHubConnectionState$1({
                  hubId,
                  state: HUB_CONNECTION_STATES.UNCONNECTED
                });
                errorMsg = errorMsg.concat('Hub unconnected in remote');
              }
            } else if (hubCommand && hubId) {
              // Local connection
              setHubConnectionState$1({
                hubId,
                state: HUB_CONNECTION_STATES.UNCONNECTED
              });
              errorMsg = errorMsg.concat('Hub unconnected');
            }

            console.error(errorMsg);
            reject(error);
          });
        }
      });
    } else {
      reject(new Error('SDK Error: Command or Command API URL not found.'));
    }
  });
}

//      
/*
 * Helper to get user
 * @return {Object} user
 */

function storedUser() {
  return userState.selectors.getUser(store.getState());
}
/**
 * User action to change current language
 * @param {LANGUAGES_TYPE} newLanguage - language to be changed to
 * @return {Boolean} true if language was set
 */


function changeLanguage(newLanguage) {
  let retVel = false;

  if (Object.values(LANGUAGES).indexOf(newLanguage) > -1) {
    store.dispatch(userState.actions.setLanguage(newLanguage));
    retVel = true;

    if (storedUser().state === USER_STATES.WAITING_LANGUAGE) {
      store.dispatch(userState.actions.changeState(USER_STATES.LANGUAGE_SET));
    }
  }

  return retVel;
}
/**
 * User action to accept EULA
 * @return {Boolean} true if EULA was accepted
 */

function acceptEula() {
  store.dispatch(userState.actions.setEula(true));

  if (storedUser().state === USER_STATES.WAITING_EULA) {
    store.dispatch(userState.actions.changeState(USER_STATES.EULA_ACCEPTED));
  }

  return true;
}
/**
 * User action to log in
 * @param {string} email - email address
 * @param {password} password  - fixed password
 * @return { Promise}
 */

function doPwLogin(email, password) {
  return new Promise((resolve, reject) => {
    send({
      command: COMMANDS.USER_LOGIN,
      data: {
        email,
        password
      }
    }).then(response => {
      if (response && isString_1(response)) {
        store.dispatch(userState.actions.setAuthKey(response));

        if (storedUser().state === USER_STATES.WAITING_LOGIN) {
          store.dispatch(userState.actions.changeState(USER_STATES.LOGIN_DONE));
        }
      }

      resolve(response);
    }).catch(error => {
      console.debug('doPwLogin error', error);
      reject(new Error('Login failure'));
    });
  });
}
/**
 * User action to set user token
 * @param {string} userToken - Cozify user/cloud token
 * @return {Object} user
 */

function setAuthenticated(userToken) {
  store.dispatch(userState.actions.setAuthenticated(userToken));
  return storedUser();
}
/**
 * Get state of user state-machine
 * @return {USER_STATE_TYPE}
 */

function getUserState() {
  return storedUser().state;
}

//      
/**
 * Get devices of all selected hubs
 * @return {HUB_DEVICES_MAP_TYPE}
 */

function getDevices() {
  const stateNow = store.getState();
  return devicesState.selectors.getDevices(stateNow);
}
/**
 * Get pairing devices of all selected hubs
 * @return {HUB_DEVICES_MAP_TYPE}
 */

function getPairingDevices() {
  const stateNow = store.getState();
  return pairingsState.selectors.getPairings(stateNow);
}
/**
 * Get devices of given hub
 * @param  {string} hubId
 * @return {DEVICES_MAP_TYPE}
 */

function getHubDevices(hubId) {
  let retVal;
  const devices = getDevices();

  if (devices && devices[hubId]) {
    retVal = devices[hubId];
  }

  return retVal;
}
/**
 * Get pairing devices of given hub
 * @param  {string} hubId
 * @return {DEVICES_MAP_TYPE}
 */

function getHubPairingDevices(hubId) {
  let retVal;
  const devices = getPairingDevices();

  if (devices && devices[hubId]) {
    retVal = devices[hubId];
  }

  return retVal;
}
/**
 * Device handler for poll delta results
 * @param  {string} hubId
 * @param  {boolean} reset
 * @param  {Object} devices
 */

function devicesDeltaHandler(hubId, reset, devices) {
  let oldHubDevices = {};
  const storedDevices = getDevices();

  if (storedDevices && storedDevices[hubId]) {
    oldHubDevices = storedDevices[hubId];
  }

  if (reset) {
    // If reset then set  devices as they are received
    const stateDevices = {
      hubId,
      devices
    };
    store.dispatch(devicesState.actions.setDevices(stateDevices));
  } else {
    // Loop devices to check could it be added or should be removed
    Object.entries(devices).forEach(([key, device]) => {
      const stateDevice = {
        hubId,
        device
      };

      if (key && device) {
        store.dispatch(devicesState.actions.setDevice(stateDevice));
      } else if (key && oldHubDevices[key]) {
        store.dispatch(devicesState.actions.deleteDevice(key));
      }
    });
  }
}
/**
 * Device handler for poll delta results
 * @param  {string} hubId
 * @param  {boolean} reset
 * @param  {Array} pairingDevices
 */

function pairingDevicesDeltaHandler(hubId, reset, pairingDevices) {
  let oldPairingDevices = {};
  const storedPairingDevices = getPairingDevices();

  if (storedPairingDevices && storedPairingDevices[hubId]) {
    oldPairingDevices = storedPairingDevices[hubId];
  } // If reset then set  devices as they are received


  const statePairingDevices = {
    hubId,
    devices: {}
  };
  pairingDevices.map(device => {
    statePairingDevices.devices[device.id] = device;
    return true;
  });

  if (reset) {
    // If reset then set  devices as they are received
    store.dispatch(pairingsState.actions.setPairingDevices(statePairingDevices));
  } else {
    // Loop devices to check could it be added or should be removed
    Object.entries(statePairingDevices.devices).forEach(([key, device]) => {
      const statePairingDevice = {
        hubId,
        device
      };
      /*
      for(devRoom in device.status.room){
        for room in _rooms when devRoom is room.id
            device.status.room = angular.copy room
      }
      */

      if (key && device) {
        store.dispatch(pairingsState.actions.setPairingDevice(statePairingDevice));
      } else if (key && oldPairingDevices[key]) {
        store.dispatch(pairingsState.actions.deletePairingDevice(key));
      }
    });
  }
}

//      

/**
 * Get rooms of all selected hubs
 * @return {HUB_ROOMS_MAP_TYPE}
 */

function getRooms() {
  const stateNow = store.getState();
  return roomsState.selectors.getRooms(stateNow);
}
/**
 * Get rooms of given hub
 * @param  {string} hubId
 * @return {ROOMS_MAP_TYPE}
 */

function getHubRooms(hubId) {
  let retVal;
  const rooms = getRooms();

  if (rooms && rooms[hubId]) {
    retVal = rooms[hubId];
  }

  return retVal;
}
function sendRoomCmd(hubId, commandType, data) {
  return new Promise((resolve, reject) => {
    const stateNow = store.getState();
    const user = userState.selectors.getUser(stateNow);

    if (!user || !user.authKey) {
      console.error('SDK sendRoomCmd error: No userKey!');
      reject(new Error('Room command error: No userKey!'));
      return;
    }

    const hubs = hubsState.selectors.getHubs(stateNow);
    const hub = hubs[hubId];
    const {
      hubKey
    } = hubs[hubId];

    if (!hub || !hubKey) {
      console.error('SDK sendRoomCmd error: No hubKey!');
      reject(new Error('Room command error: No hubKey!'));
      return;
    }

    if (hub.connectionState !== HUB_CONNECTION_STATES.LOCAL && hub.connectionState !== HUB_CONNECTION_STATES.REMOTE) {
      console.error('SDK sendRoomCmd error: No Hub connection');
      reject(new Error('Room command error: No hub connection'));
      return;
    }

    const {
      authKey
    } = user;

    if (!authKey) {
      console.error('SDK sendRoomCmd error: No authKey!');
      reject(new Error('Room command error: No authKey!'));
      return;
    }

    if (commandType) {
      send({
        command: commandType,
        authKey,
        hubId,
        localUrl: hub.url,
        hubKey,
        data
      }).then(status => {
        console.debug('SDK sendRoomCmd ok', status);
        send({
          command: COMMANDS.CMD_GET_ROOMS,
          authKey,
          hubId,
          localUrl: hub.url,
          hubKey
        }).then(rooms => {
          console.debug('SDK sendRoomCmd refresh rooms ok', rooms);
          store.dispatch(roomsState.actions.setRooms({
            hubId,
            rooms
          }));
          resolve(rooms);
        }).catch(error => {
          console.error('SDK Room command error:', error);
          reject(error);
        });
      }).catch(error => {
        console.error('SDK Room command error:', error);
        reject(error);
      });
    }
  });
}
/**
 * Add room to given hub
 * do not usr store.dispatch(roomsState.actions.addRoom(hubId, room)) as rooms are coming back in delta
 * @param  {string} hubId
 * @param  {Object} room
 * @return {Promise<Object>} rooms
 */

async function addRoom(hubId, room) {
  return new Promise((resolve, reject) => {
    sendRoomCmd(hubId, COMMANDS.CMD_SET_ROOM, [room]).then(rooms => {
      resolve(rooms);
    }).catch(error => {
      reject(error);
    });
  });
}
/**
 * Edit room of given hub
 * do not usr store.dispatch(roomsState.actions.editRoom(hubId, room)) as rooms are coming back in delta
 * @param  {string} hubId
 * @param  {Object} room
 * @return {Promise<Object>} rooms
 */

async function editRoom(hubId, room) {
  return new Promise((resolve, reject) => {
    sendRoomCmd(hubId, COMMANDS.CMD_SET_ROOM, [room]).then(rooms => {
      resolve(rooms);
    }).catch(error => {
      reject(error);
    });
  });
}
/**
 * Remove given room of given hub
 * @param  {string} hubId
 * @param  {Object} room
 */

async function removeRoom(hubId, room) {
  // store.dispatch(roomsState.actions.removeRoom(hubId, room));
  return new Promise((resolve, reject) => {
    sendRoomCmd(hubId, COMMANDS.CMD_REMOVE_ROOM, {
      roomId: room.id
    }).then(rooms => {
      resolve(rooms);
    }).catch(error => {
      if (error.response && error.response.status && error.response.status === 404) {
        const storedRooms = getRooms();
        resolve(storedRooms[hubId]);
      }

      reject(error);
    });
  });
}
/**
 * Rooms handler for poll delta results
 * @param  {string} hubId
 * @param  {boolean} reset
 * @param  {Object} rooms
 */

function roomsDeltaHandler(hubId, reset, rooms) {
  let oldHubRooms = {};
  const storedRooms = getRooms();

  if (storedRooms && storedRooms[hubId]) {
    oldHubRooms = storedRooms[hubId];
  }

  if (reset) {
    // If reset then set rooms as they are received
    const stateRooms = {
      hubId,
      rooms
    };
    store.dispatch(roomsState.actions.setRooms(stateRooms));
  } else if (!isEmpty_1(rooms)) {
    // Loop rooms to check could it be added or should be removed
    Object.entries(rooms).forEach(([key, room]) => {
      const stateRoom = {
        hubId,
        room
      };

      if (key && room) {
        store.dispatch(roomsState.actions.setRoom(stateRoom));
      } else if (key && oldHubRooms[key]) {
        store.dispatch(roomsState.actions.removeRoom({
          hubId,
          roomId: key
        }));
      }
    });
  }
}

//      

const initAlarm = alarm => {
  const givenAlarm = alarm;

  if (alarm.message) {
    givenAlarm.messageHTML = b64DecodeUnicode(alarm.message);
    givenAlarm.messageTxt = getTextFromNode(givenAlarm.message);
  }

  return givenAlarm;
};
/**
 * Get alarms of all selected hubs
 * @return {HUB_ALARMS_MAP_TYPE}
 */


function getAlarms() {
  const stateNow = store.getState();
  return alarmsState.selectors.getAlarms(stateNow);
}
/**
 * Get alarms of given hub
 * @param  {string} hubId
 * @return {ROOMS_MAP_TYPE}
 */

function getHubAlarms(hubId) {
  let retVal;
  const alarms = getAlarms();

  if (alarms && alarms[hubId]) {
    retVal = alarms[hubId];
  }

  return retVal;
}
/**
 * Close given alarm of given hub
 * @param  {string} hubI
 * @param  {Object} alarm
 */

function sendAlarmCmd(hubId, commandType, data) {
  return new Promise((resolve, reject) => {
    const stateNow = store.getState();
    const user = userState.selectors.getUser(stateNow);

    if (!user || !user.authKey) {
      console.error('SDK closeAlarm error: No userKey!');
      reject(new Error('Alarm command error: No userKey!'));
      return;
    }

    const hubs = hubsState.selectors.getHubs(stateNow);
    const hub = hubs[hubId];
    const {
      hubKey
    } = hubs[hubId];

    if (!hub || !hubKey) {
      console.error('SDK closeAlarm error: No hubKey!');
      reject(new Error('Alarm command error: No hubKey!'));
      return;
    }

    if (hub.connectionState !== HUB_CONNECTION_STATES.LOCAL && hub.connectionState !== HUB_CONNECTION_STATES.REMOTE) {
      console.error('SDK closeAlarm error: No Hub connection');
      reject(new Error('Alarm command error: No hub connection'));
      return;
    }

    const {
      authKey
    } = user;

    if (!authKey) {
      console.error('SDK closeAlarm error: No authKey!');
      reject(new Error('Alarm command error: No authKey!'));
      return;
    }

    send({
      command: commandType,
      authKey,
      hubId,
      localUrl: hub.url,
      hubKey,
      data
    }).then(status => {
      console.debug('SDK sendAlarmCmd ok', status);
      send({
        command: COMMANDS.CMD_GET_ALARMS,
        authKey,
        hubId,
        localUrl: hub.url,
        hubKey
      }).then(alarms => {
        console.debug('SDK sendAlarmCmd refresh alarms ok', alarms);
        store.dispatch(alarmsState.actions.setRooms({
          hubId,
          alarms
        }));
        resolve(alarms);
      }).catch(error => {
        console.error('SDK Alarm command error:', error);
        reject(error);
      });
    }).catch(error => {
      reject(error);
    });
  });
}
/**
 * Remove given alarm of given hub
 * @param  {string} hubId
 * @param  {Object} room
 */

async function removeAlarm(hubId, alarm) {
  const givenAlarm = alarm;
  return new Promise((resolve, reject) => {
    sendAlarmCmd(hubId, COMMANDS.CMD_REMOVE_ALARM, {
      alarmId: givenAlarm.id
    }).then(alarms => {
      /*
      givenAlarm.closed = true;
      const stateAlarm = {
        hubId,
        alarmId: givenAlarm.id,
      };
      store.dispatch(alarmsState.actions.removeAlarm(stateAlarm));
      resolve(getAlarms());
      */
      resolve(alarms);
    }).catch(error => {
      reject(error);
    });
  });
}
async function closeAlarm(hubId, alarm) {
  const givenAlarm = alarm;
  return new Promise((resolve, reject) => {
    sendAlarmCmd(hubId, COMMANDS.CMD_CLOSE_ALARM, {
      alarmId: givenAlarm.id
    }).then(alarms => {
      /*
      givenAlarm.closed = true;
      const stateAlarm = {
        hubId,
        alarmId: givenAlarm.id,
      };
      store.dispatch(alarmsState.actions.setAlarm(stateAlarm));
      resolve(getAlarms());
      */
      resolve(alarms);
    }).catch(error => {
      reject(error);
    });
  });
}
/**
 * Alarms handler for poll delta results
 * @param  {string} hubId
 * @param  {boolean} reset
 * @param  {Object} rooms
 */

function alarmsDeltaHandler(hubId, reset, alarms) {
  let oldHubAlarms = {};
  const storedAlarms = getAlarms();

  if (storedAlarms && storedAlarms[hubId]) {
    oldHubAlarms = storedAlarms[hubId];
  }

  if (reset) {
    // If reset then set alarms as they are received
    const alarmsToBeSet = {};

    if (!isEmpty_1(alarms)) {
      Object.entries(alarms).forEach(([key, alarm]) => {
        alarmsToBeSet[key] = initAlarm(alarm);
      });
    }

    const stateAlarms = {
      hubId,
      alarms: alarmsToBeSet
    };
    store.dispatch(alarmsState.actions.setAlarms(stateAlarms));
  } else if (!isEmpty_1(alarms)) {
    // Loop alarms to check could it be added or should be removed
    Object.entries(alarms).forEach(([key, alarm]) => {
      if (key && alarm) {
        const stateAlarm = {
          hubId,
          alarm: initAlarm(alarm)
        };
        store.dispatch(alarmsState.actions.setAlarm(stateAlarm));
      } else if (key && oldHubAlarms[key]) {
        store.dispatch(alarmsState.actions.removeAlarm({
          hubId,
          alarmId: key
        }));
      }
    });
  }
}

//      
let hubsMap = {};
/*
 * Helper method to extract hub info from JWT based hub keys
 */

function extractHubInfo(HUBKeys) {
  const hubs = {};

  if (HUBKeys) {
    Object.keys(HUBKeys).forEach(hubKey => {
      const coded = HUBKeys[hubKey].split('.')[1];
      const decoded = urlBase64Decode(coded);
      const payload = JSON.parse(decoded);
      const info = {};
      info.id = payload.hubId || payload.hub_id;
      info.name = payload.hubName || payload.hub_name;
      info.hubKey = HUBKeys[hubKey];
      info.connectionState = HUB_CONNECTION_STATES.UNCONNECTED;

      if (payload.role) {
        info.role = payload.role;
        info.roleString = '';
        Object.keys(ROLES).forEach(roleKey => {
          if (ROLES[roleKey] === info.role) info.roleString = roleKey;
        });
      }

      hubs[info.id] = info;
    });
  }

  return hubs;
}
/*
 * Hub metadata is received and will be stored
 */


function updateFoundHub(hubURL, hub) {
  const foundHub = hub; // Hub keys returns ids, idQuerys return hubId

  if (foundHub.hubId) {
    foundHub.id = foundHub.hubId;
    delete foundHub.hubId;
  }

  if (!foundHub.id) {
    return;
  }

  if (!hubsMap[foundHub.id]) {
    hubsMap[foundHub.id] = {
      id: foundHub.id,
      name: foundHub.name || ''
    };
  }

  hubsMap[foundHub.id].connected = foundHub.connected;
  hubsMap[foundHub.id].features = foundHub.features;
  hubsMap[foundHub.id].state = foundHub.state;
  hubsMap[foundHub.id].version = foundHub.version;
  hubsMap[foundHub.id].connectionState = foundHub.connected ? HUB_CONNECTION_STATES.REMOTE : HUB_CONNECTION_STATES.UNCONNECTED;

  if (hubURL) {
    hubsMap[foundHub.id].connectionState = HUB_CONNECTION_STATES.LOCAL;
    hubsMap[foundHub.id].url = hubURL;
  } else {
    hubsMap[foundHub.id].url = undefined;
  }
}
/*
 * Remote hub backup and lock request
 */


function lockAndBackup(hubId, authKey, hubKey) {
  return new Promise((resolve, reject) => {
    send({
      command: COMMANDS.HUB_LOCK_BACKUP,
      authKey,
      hubKey,
      hubId
    }).then(status => {
      resolve(status);
    }).catch(error => {
      console.log(`doRemoteIdQuery ${hubId} error `, error.message);
      reject(error);
    });
  });
}
/*
 * Remote hub metamata request for version etc information
 */

function doRemoteIdQuery(hubId, authKey, hubKey) {
  return new Promise((resolve, reject) => {
    send({
      command: COMMANDS.CLOUD_META,
      authKey,
      hubKey,
      hubId
    }).then(hubData => {
      updateFoundHub(undefined, hubData);
      resolve(hubData);
    }).catch(error => {
      console.log(`doRemoteIdQuery ${hubId} error `, error.message);
      reject(hubId);
    });
  });
}
/*
 * Local hub metadata request for version etc information
 */

function doLocalIdQuery(ip) {
  return new Promise(resolve => {
    if (ip) {
      const hubURL = `${HUB_PROTOCOL + ip}:${HUB_PORT}`;
      const url = `${hubURL}/hub`;
      send({
        url,
        timeout: 500
      }).then(hubData => {
        updateFoundHub(hubURL, hubData);
        resolve(ip);
      }).catch(error => {
        console.log(`doLocalIdQuery ${ip} error `, error.message);
        resolve(ip);
      });
    } else {
      resolve();
    }
  });
}
/**
 * Helper to get current hubs from state
 * @return {HUBS_MAP_TYPE} - hubs
 */


function getHubs() {
  return hubsState.selectors.getHubs(store.getState());
}
/*
 * Check hubs that are currently selected and mark them selected also in map of given hubs
 */

function setSelectedHubs(newHubs) {
  const hubs = getHubs();
  Object.values(hubs).forEach(hub => {
    if (hub.selected) {
      const selectedNewHub = newHubs[hub.id];

      if (selectedNewHub) {
        selectedNewHub.selected = true;
      }
    }
  });
}
/*
 * Fetch HUB IP addresses and metadata of those in the same network
 */


function doCloudDiscovery() {
  return new Promise(resolve => {
    send({
      command: COMMANDS.CLOUD_IP
    }).then(ips => {
      const queries = [];

      if (ips && !isEmpty_1(ips)) {
        ips.forEach(ip => {
          queries.push(doLocalIdQuery(ip));
        });
      }

      sendAll(queries).finally(() => {
        // mark selected hubs to be selected after
        setSelectedHubs(hubsMap);
        store.dispatch(hubsState.actions.updateHubs(hubsMap));
        resolve('ok');
      });
    }).catch(error => {
      console.error('doCloudDiscovery error: ', error.message);
      store.dispatch(hubsState.actions.updateHubs(hubsMap));
      resolve('error');
    });
  });
}
/*
 * Fetch hub metadatas from Cloud
 */


function fetchCloudMetaData(hubs, authKey) {
  return new Promise(resolve => {
    const queries = [];
    Object.values(hubs).forEach(hub => {
      if (hub.hubKey) {
        queries.push(doRemoteIdQuery(hub.id, authKey, hub.hubKey));
      }
    });
    sendAll(queries).then(values => {
      console.debug('fetchCloudMetaData values', values);
    }).catch(error => {
      console.error('fetchCloudMetaData error', error);
    }).finally(() => {
      resolve();
    });
  });
}
/**
 * Helper to get current user from state
 */


function storedUser$1() {
  return userState.selectors.getUser(store.getState());
}
/*
 * Make hubsMap by fetching hub meta data from cloud and local
 */


function makeHubsMap(tokens, doCloudDicovery = true, doSynchnonously = false) {
  const {
    authKey
  } = storedUser$1();
  return new Promise(resolve => {
    hubsMap = extractHubInfo(tokens);
    store.dispatch(hubsState.actions.updateHubs(hubsMap));
    fetchCloudMetaData(hubsMap, authKey).finally(() => {
      // Hubs map may be changed during fetching cloud metadata
      store.dispatch(hubsState.actions.updateHubs(hubsMap));

      if (doSynchnonously) {
        if (doCloudDicovery) {
          doCloudDiscovery().then(() => {
            resolve(getHubs());
          }).catch(() => {
            resolve(getHubs());
          });
        } else {
          resolve(getHubs());
        }
      } else {
        if (doCloudDicovery) {
          doCloudDiscovery();
        }

        resolve(getHubs());
      }
    });
  });
}
/*
 * Fetch Hub keys by user authKey and start fetching hub meta datas
 */


function fetchHubs() {
  const {
    authKey
  } = storedUser$1();
  return new Promise((resolve, reject) => {
    if (!authKey) {
      reject(new Error('No userKey!'));
      return;
    }

    send({
      command: COMMANDS.HUB_KEYS,
      authKey
    }).then(tokens => {
      if (tokens) {
        makeHubsMap(tokens).then(hubs => resolve(hubs));
      } else {
        resolve(getHubs());
      }
    }).catch(error => {
      console.error('fetchHubTokens error: ', error.message);
      reject(error);
    });
  });
}

let discoveryInterval;
/**
 * Start discovering hubs every DISCOVERY_INTERVAL_MS
 * Sequence includes requests of hub-keys, remote meta-infos, lan-ips and local meta-infos
 */

function startDiscoveringHubs() {
  if (!discoveryInterval) {
    // call immediately...
    fetchHubs(); // and then every DISCOVERY_INTERVAL_MS (30s?)

    discoveryInterval = setInterval(fetchHubs, DISCOVERY_INTERVAL_MS);
  }
}
/**
 * Stop discovering hubs
 */

function stopDiscoveringHubs() {
  clearInterval(discoveryInterval);
}
/*
** Pairing
 */

const pairingIntervals = {};
const pairingStopped = {};
const pairingTimeStamp = {};
const pairingInAction = {};
/*
 * Do pairing of given hub if hub connection is ok
 * Remote pairing is executed only every second call
 * @param {string} hubId
 * @param {booleam} reset - set true for full scan, false if delta only
 * @return {Promise}
 */

function doPairingById(hubId, reset = false) {
  return new Promise((resolve, reject) => {
    let doReset = reset;

    if (pairingStopped[hubId]) {
      console.debug('doPairing: pairing stopped');
      reject(new Error('pairing stopped'));
      return;
    }

    if (!pairingTimeStamp[hubId]) {
      pairingTimeStamp[hubId] = 0;
    }

    const hub = getHubs()[hubId];
    const {
      authKey
    } = storedUser$1();
    const {
      hubKey
    } = hub;
    console.debug('doPairing connection state: ', hub.connectionState);

    if (hub.connectionState !== HUB_CONNECTION_STATES.LOCAL && hub.connectionState !== HUB_CONNECTION_STATES.REMOTE) {
      console.warn('SDK doPairing: no Hub connection');
      reject(new Error('no hub connection'));
      return;
    }

    if (pairingInAction[hubId]) {
      reject(new Error('pairing already in action'));
      return;
    }

    pairingInAction[hubId] = true;
    if (doReset) pairingTimeStamp[hubId] = 0;
    doReset = pairingTimeStamp[hubId] === 0;
    send({
      command: COMMANDS.PAIR_START,
      hubId,
      authKey,
      hubKey,
      localUrl: hub.url,
      data: {
        ts: pairingTimeStamp[hubId]
      }
    }).then(delta => {
      if (delta) {
        pairingTimeStamp[hubId] = delta.timestamp;

        switch (delta.type) {
          case 'SCAN_DELTA':
            {
              pairingDevicesDeltaHandler(hubId, doReset, delta.devices);
              break;
            }
        }
      }

      pairingInAction[hubId] = false;
      resolve('ok');
    }).catch(error => {
      // store.dispatch(hubsState.actions.hubPollFailed())
      console.error('SDK: doPairing error: ', error.message);
      pairingInAction[hubId] = false;
      reject(error);
    });
  });
}
/**
 * Set pairing ignore flag of given device in given hub
 * @param {string} hubId
 * @param {string} deviceId
 * @param {boolean} ignore
 * @return {Promise}
 */


function ignorePairingByIds(hubId, deviceId, ignore) {
  const {
    authKey
  } = storedUser$1();
  const hub = getHubs()[hubId];
  const {
    hubKey
  } = hub;
  return send({
    command: COMMANDS.PAIR_IGNORE,
    hubId,
    authKey,
    hubKey,
    localUrl: hub.url,
    data: {
      id: deviceId,
      ignored: ignore
    }
  });
}
/**
 * Start pairing on given hub
 * @param {string} hubId
 * @param {booleam} reset - set true for full scan, false if delta only
 * @return {Promise}
 */

function startPairingById(hubId, reset) {
  const intervalTime = PAIRING_POLL_INTERVAL_MS;
  pairingStopped[hubId] = false;

  const doPairing = (callHubId, callReset) => doPairingById(callHubId, callReset).then(() => {}).catch(() => {});

  try {
    pairingIntervals[hubId] = setInterval(doPairing, intervalTime, hubId, reset);
  } catch (error) {
    console.error('Catch startPairingById: ', error);
  }

  return doPairingById(hubId, reset);
}
const stopPairingInAction = {};
/**
 * Stop pairing on given hub
 * @param {string} hubId
 * @return {Promise}
 */

function stopPairingById(hubId) {
  return new Promise((resolve, reject) => {
    if (stopPairingInAction[hubId]) {
      reject(new Error('already stopping'));
      return;
    }

    stopPairingInAction[hubId] = true;
    const {
      authKey
    } = storedUser$1();
    const hub = getHubs()[hubId];
    const {
      hubKey
    } = hub;
    clearInterval(pairingIntervals[hubId]);
    send({
      command: COMMANDS.PAIR_STOP,
      hubId,
      authKey,
      hubKey,
      localUrl: hub.url
    }).then(data => {
      console.debug('SDK: pairingStopped: Ok , data: ', data);
      pairingStopped[hubId] = true;
      stopPairingInAction[hubId] = false;
      pairingDevicesDeltaHandler(hubId, true, []);
      resolve('ok');
    }).catch(error => {
      // store.dispatch(hubsState.actions.hubPollFailed())
      console.error('SDK: pairingStopped error: ', error.message);
      stopPairingInAction[hubId] = false;
      reject(error);
    });
  });
}
/**
 * Stop pairing on all hubs
 * @return none
 */

function stopPairings() {
  const hubs = getHubs();
  Object.values(hubs).forEach(hub => {
    stopPairingById(hub.id).then(() => console.debug('SDK: pairingStopped: ', hub.id)).catch(() => console.log('SDK: pairingStopped error: ', hub.id));
  });
}
/*
** Polling
*/

const pollIntervals = {};
const pollingStopped = {};
const pollTimeStamp = {};
const pollInAction = {};
const secondPoll = {};
/**
 * Do poll on given hub if hub connection is ok.
 * Remote polls are executed only every second call.
 * @param {string} hubId
 * @param {booleam} reset - set true for full scan, false if delta only
 * @return {Promise} status or error
 */

function doPoll(hubId, reset = false) {
  return new Promise((resolve, reject) => {
    let doReset = reset;
    if (doReset) pollTimeStamp[hubId] = 0;
    doReset = pollTimeStamp[hubId] === 0;

    if (pollingStopped[hubId]) {
      console.debug('doPolling: polling stopped');
      resolve('stopped');
      return;
    }

    if (!pollTimeStamp[hubId]) {
      pollTimeStamp[hubId] = 0;
    }

    const hub = getHubs()[hubId];

    if (!hub || hub.connectionState !== HUB_CONNECTION_STATES.LOCAL && hub.connectionState !== HUB_CONNECTION_STATES.REMOTE) {
      console.warn('SDK doPoll: No Hub connection');
      reject(new Error('doPoll error: No Hub connection'));
      return;
    }

    console.debug('doPoll connection state: ', hub.connectionState); // just return every second -> not doing so often as in local connection

    if (hub.connectionState === HUB_CONNECTION_STATES.REMOTE && !doReset) {
      if (secondPoll[hubId]) {
        secondPoll[hubId] = false;
        resolve('skipped');
        return;
      }

      secondPoll[hubId] = true;
    }

    const {
      authKey
    } = storedUser$1();
    const {
      hubKey
    } = hub;

    if (pollInAction[hubId]) {
      reject(new Error('doPoll error: Already polling'));
      return;
    }

    pollInAction[hubId] = true;
    send({
      command: COMMANDS.POLL,
      hubId,
      authKey,
      hubKey,
      localUrl: hub.url,
      data: {
        ts: pollTimeStamp[hubId]
      }
    }).then(deltas => {
      if (deltas) {
        // console.log(JSON.stringify(deltas));
        // Return can be null poll, even if not asked that
        if (pollTimeStamp[hubId] === 0 || deltas.full) {
          doReset = true;
        }

        pollTimeStamp[hubId] = deltas.timestamp;
        deltas.polls.forEach(delta => {
          switch (delta.type) {
            case 'DEVICE_DELTA':
              {
                devicesDeltaHandler(hubId, doReset, delta.devices);
                break;
              }

            case 'GROUP_DELTA':
              {
                break;
              }

            case 'SCENE_DELTA':
              {
                break;
              }

            case 'RULE_DELTA':
              {
                break;
              }

            case 'USERS_DELTA':
              {
                break;
              }

            case 'ROOM_DELTA':
              {
                roomsDeltaHandler(hubId, doReset, delta.rooms);
                break;
              }

            case 'ZONE_DELTA':
              {
                break;
              }

            case 'USER_ALERTS':
              {
                break;
              }

            case 'ALARM_DELTA':
              {
                alarmsDeltaHandler(hubId, doReset, delta.alarms);
                break;
              }
          }
        });
      }

      pollInAction[hubId] = false;
      resolve(deltas);
    }).catch(error => {
      // store.dispatch(hubsState.actions.hubPollFailed())
      console.error('SDK doPoll error: ', error.message);
      pollInAction[hubId] = false;
      reject(error);
    });
  });
}
/**
 * Start polling on given hub
 * @param {string} hubId
 * @return {Promise} status or error
 */

function startPollingById(hubId) {
  pollingStopped[hubId] = false;
  const intervalTime = POLL_INTERVAL_MS;

  const pollCall = callHubId => doPoll(callHubId).then(() => {}).catch(() => {});

  try {
    pollIntervals[hubId] = setInterval(pollCall, intervalTime, hubId);
  } catch (error) {
    console.error('Catch startPollingById: ', error);
  }

  return doPoll(hubId);
}
/**
 * Stop polling on given hub
 * @param {string} hubId   - hub id to be selected
 * @return none
 */

function stopPollingById(hubId) {
  pollingStopped[hubId] = true;
  clearInterval(pollIntervals[hubId]);
}
/**
 * Select hub by id, starts hub polling
 * @param  {string} hubId
 * @param  {boolean} poll - flag to start polling when connected, defaults to false
 * @return {Promise} status or error
 */

function selectHubById(hubId, poll = false) {
  return new Promise((resolve, reject) => {
    const hubs = getHubs();

    if (!isEmpty_1(hubs)) {
      let pollingHub = null;
      let error = null;
      Object.values(hubs).every(hub => {
        if (hubId === hub.id) {
          store.dispatch(hubsState.actions.selectHub({
            hubId: hub.id
          }));

          if (hub.hubKey && poll) {
            pollingHub = startPollingById(hub.id);
            return false; // break
          }

          if (!hub.hubKey) {
            console.error('SDK selectHubById: No hub key error');
            error = new Error('no hubKey');
            return false; // break
          }

          console.debug('SDK selectHubById: Ready to start polling');
          return false; // break
        }

        return true; // continue
      });

      if (pollingHub) {
        return pollingHub.then(status => resolve(status)).catch(() => resolve('polling started'));
      }

      if (error) {
        reject(error);
      } else if (!pollingHub && poll) {
        reject(new Error('hub not found'));
      } else {
        resolve('ready to poll');
      }

      return true;
    }

    reject(new Error('no hubs'));
    return true;
  });
}
/**
 * Unselect hub by id, stops hub polling
 * @param  {string} hubId   - hub id to be selected
 * @return none
 */

function unSelectHubById(hubId) {
  const hubs = getHubs();
  Object.values(hubs).forEach(hub => {
    if (hubId === hub.id) {
      store.dispatch(hubsState.actions.unSelectHub({
        hubId: hub.id
      }));
      stopPollingById(hub.id);
    }
  });
}
/**
 * Unselect hubs, stops hub pollings
 * @return none
 */

function unSelectHubs() {
  const hubs = getHubs();
  Object.values(hubs).forEach(hub => {
    store.dispatch(hubsState.actions.unSelectHub({
      hubId: hub.id
    }));
    stopPollingById(hub.id);
  });
}
/**
 * Connect to the given hub - local or remote.
 * @param  {string} hubId
 * @param  {string} hubKey
 * @param  {boolean} discovery true to make remote discovery, false to start without discovery
 * @param  {boolean} sync true to wait local hubs reply (in case of discovery), false to start with remote connection
 * @return {Promise} current hubs, should not reject never
 */

function connectHubByTokens(hubId, hubKey, discovery = false, sync = true) {
  return new Promise((resolve, reject) => {
    const {
      authKey
    } = storedUser$1();
    if (!hubId) reject(new Error('No Hub Id'));
    if (!hubKey) reject(new Error('No hubKey'));
    if (!authKey) reject(new Error('No AuthKey'));
    const tokens = {};
    tokens[hubId] = hubKey;
    makeHubsMap(tokens, discovery, sync).then(() => {
      selectHubById(hubId, false).then(() => {
        resolve(getHubs());
      }).catch(error => reject(error));
    }).catch(error => reject(error));
  });
}
/*
 * Listener of User state changes
 * Hub discovery is started when user's new state is AUTHENTICATED
 */

watchChanges('user.state', newState => {
  // Start discovery when user is authenticated
  if (newState === USER_STATES.AUTHENTICATED) {
    startDiscoveringHubs();
  }
});

//      
/**
 * Helper to get current user from state
 */

function storedUser$2() {
  return userState.selectors.getUser(store.getState());
}
/**
 * Helper to get current hubs from state
 * @return {HUBS_MAP_TYPE} - hubs
 */


function getHubs$1() {
  return hubsState.selectors.getHubs(store.getState());
}
/*
** Z-wave inclusion
 */

const inclusionStopped = {};
const inclusionInAction = {};
const stopInclusionInAction = {};
/*
 * Start inclusion of given hub if hub connection is ok
 * @param {string} hubId
 * @return {Promise}
 */

function startZwaveInclusion(hubId) {
  return new Promise((resolve, reject) => {
    if (inclusionStopped[hubId]) {
      console.debug('startZwaveInclusion: inclusion stopped');
      reject(new Error('inclusion stopped'));
      return;
    }

    const hub = getHubs$1()[hubId];
    const {
      authKey
    } = storedUser$2();
    const {
      hubKey
    } = hub;
    console.debug('startZwaveInclusion connection state: ', hub.connectionState);

    if (hub.connectionState !== HUB_CONNECTION_STATES.LOCAL && hub.connectionState !== HUB_CONNECTION_STATES.REMOTE) {
      console.warn('SDK startZwaveInclusion: no Hub connection');
      reject(new Error('no hub connection'));
      return;
    }

    if (inclusionInAction[hubId]) {
      reject(new Error('inclusion already in action'));
      return;
    }

    inclusionInAction[hubId] = true;
    send({
      command: COMMANDS.ZWAVE_START_INCLUSION,
      hubId,
      authKey,
      hubKey,
      localUrl: hub.url,
      data: []
    }).then(state => {
      inclusionInAction[hubId] = false;

      if (state) {
        if (state.status === ZWAVE_INCLUSION_STATUS.RUNNING) {
          resolve(state);
        } else {
          reject(state);
        }
      } else {
        reject(new Error('No inclusion state received'));
      }
    }).catch(error => {
      // store.dispatch(hubsState.actions.hubPollFailed())
      console.error('SDK: startZwaveInclusion error: ', error.message);
      inclusionInAction[hubId] = false;
      reject(error);
    });
  });
}
/*
 * Ask inclusion status of given hub if hub connection is ok
 * @param {string} hubId
 * @return {Promise}
 */


function askZwaveInclusionStatus(hubId) {
  return new Promise((resolve, reject) => {
    if (inclusionStopped[hubId]) {
      console.debug('askZwaveInclusionStatus: inclusion stopped');
      reject(new Error('inclusion stopped'));
      return;
    }

    const hub = getHubs$1()[hubId];
    const {
      authKey
    } = storedUser$2();
    const {
      hubKey
    } = hub;
    console.debug('askZwaveInclusionStatus connection state: ', hub.connectionState);

    if (hub.connectionState !== HUB_CONNECTION_STATES.LOCAL && hub.connectionState !== HUB_CONNECTION_STATES.REMOTE) {
      console.warn('SDK askZwaveInclusionStatus: no Hub connection');
      reject(new Error('no hub connection'));
      return;
    }

    if (inclusionInAction[hubId]) {
      reject(new Error('inclusion already in action'));
      return;
    }

    inclusionInAction[hubId] = true;
    send({
      command: COMMANDS.ZWAVE_INCLUSION_STATUS,
      hubId,
      authKey,
      hubKey,
      localUrl: hub.url,
      data: []
    }).then(state => {
      inclusionInAction[hubId] = false;
      resolve(state);
    }).catch(error => {
      // store.dispatch(hubsState.actions.hubPollFailed())
      console.error('SDK: askZwaveInclusionStatus error: ', error.message);
      inclusionInAction[hubId] = false;
      reject(error);
    });
  });
}

function askZwaveInclusionStatusPromise(hubId, resolve, reject) {
  askZwaveInclusionStatus(hubId).then(state => {
    if (state && state.status) {
      switch (state.status) {
        case ZWAVE_INCLUSION_STATUS.RUNNING:
          {
            // sleep 5s and try again
            setTimeout(() => {
              askZwaveInclusionStatusPromise(hubId, resolve, reject);
            }, ZWAVE_INCLUSION_INTERVAL_MS);
            break;
          }

        case ZWAVE_INCLUSION_STATUS.SUCCESS:
          {
            resolve(true);
            break;
          }

        case ZWAVE_INCLUSION_STATUS.TIMEOUT:
          {
            resolve(false);
            break;
          }

        case ZWAVE_INCLUSION_STATUS.CANCEL:
          {
            resolve(false);
            break;
          }

        default:
          {
            reject(new Error('Invalid inclusion state'));
            break;
          }
      }
    } else {
      reject(new Error('Invalid inclusion state'));
    }
  }).catch(error => {
    console.error('Error in askZwaveInclusionStatusPromise: ', error);
    reject(error);
  });
}
/**
 * Start zwave inclusion on given hub
 * @param {string} hubId
 * @return {Promise} that resolves true if device found and false if not
 */


async function doZwaveInclusion(hubId) {
  return new Promise((resolve, reject) => {
    inclusionStopped[hubId] = false;
    startZwaveInclusion(hubId).then(state => {
      if (state && state.status === ZWAVE_INCLUSION_STATUS.RUNNING) {
        new Promise((r, j) => {
          askZwaveInclusionStatusPromise(hubId, r, j);
        }).then(result => {
          resolve(result);
        }).catch(error => {
          reject(error);
        });
      } else {
        reject(new Error('Wrong inclusion status'));
      }
    }).catch(error => {
      console.error('Error in doZwavePairing: ', error);
      reject(error);
    });
  });
}
/**
 * Stop zwave inclusion on given hub
 * @param {string} hubId
 * @return {Promise}
 */

async function stopZwaveInclusion(hubId) {
  return new Promise((resolve, reject) => {
    if (stopInclusionInAction[hubId]) {
      reject(new Error('stopInclusionById already stopping'));
      return;
    }

    stopInclusionInAction[hubId] = true;
    const {
      authKey
    } = storedUser$2();
    const hub = getHubs$1()[hubId];
    const {
      hubKey
    } = hub;
    send({
      command: COMMANDS.ZWAVE_STOP_INCLUSION,
      hubId,
      authKey,
      hubKey,
      localUrl: hub.url,
      data: []
    }).then(status => {
      console.debug('SDK: stopZwavePairing: Ok , status: ', status);
      inclusionStopped[hubId] = true;
      stopInclusionInAction[hubId] = false;
      resolve('ok');
    }).catch(error => {
      console.error('SDK: stopZwavePairing error: ', error.message);
      stopInclusionInAction[hubId] = false;
      reject(error);
    });
  });
}
/**
 * Test if zwave of given hub is enabled
 * @param {string} hubId
 * @return {Promise} that resolves true if zwave is enabled

export async function isZwaveEnabled(hubId: string): Promise<Object> {
  return new Promise((resolve, reject) => {
    askZwaveInclusionStatus(hubId)
      .then((state) => {
        if (state !== ZWAVE_INCLUSION_STATES.NO_ZWAVE) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch((error) => {
        console.error('Error in isZwaveById: ', error);
        reject(error);
      });
  });
}
*/

/*
**
** Z-wave exclusion
**
 */

const exclusionStopped = {};
const exclusionInAction = {};
const stopExclusionInAction = {};
/*
 * Start exclusion of given hub if hub connection is ok
 * @param {string} hubId
 * @return {Promise}
 */

function startZwaveExclusion(hubId) {
  return new Promise((resolve, reject) => {
    if (exclusionStopped[hubId]) {
      console.debug('startZwaveExclusion: exclusion stopped');
      reject(new Error('exclusion stopped'));
      return;
    }

    const hub = getHubs$1()[hubId];
    const {
      authKey
    } = storedUser$2();
    const {
      hubKey
    } = hub;
    console.debug('startZwaveExclusion connection state: ', hub.connectionState);

    if (hub.connectionState !== HUB_CONNECTION_STATES.LOCAL && hub.connectionState !== HUB_CONNECTION_STATES.REMOTE) {
      console.warn('SDK startZwaveExclusion: no Hub connection');
      reject(new Error('no hub connection'));
      return;
    }

    if (exclusionInAction[hubId]) {
      reject(new Error('exclusion already in action'));
      return;
    }

    exclusionInAction[hubId] = true;
    send({
      command: COMMANDS.ZWAVE_START_EXCLUSION,
      hubId,
      authKey,
      hubKey,
      localUrl: hub.url,
      data: []
    }).then(state => {
      exclusionInAction[hubId] = false;

      if (state.status === ZWAVE_EXCLUSION_STATUS.RUNNING) {
        resolve(state);
      } else {
        console.error('SDK: doExclusionById - wrong state: ', state);
        reject(state);
      }
    }).catch(error => {
      // store.dispatch(hubsState.actions.hubPollFailed())
      console.error('SDK: doExclusionById error: ', error.message);
      exclusionInAction[hubId] = false;
      reject(error);
    });
  });
}
/*
 * Ask exclusion status of given hub if hub connection is ok
 * @param {string} hubId
 * @return {Promise}
 */


function askZwaveExclusionStatus(hubId) {
  return new Promise((resolve, reject) => {
    if (exclusionStopped[hubId]) {
      console.debug('askZwaveExclusionStatus: exclusion stopped');
      reject(new Error('exclusion stopped'));
      return;
    }

    const hub = getHubs$1()[hubId];
    const {
      authKey
    } = storedUser$2();
    const {
      hubKey
    } = hub;
    console.debug('askZwaveExclusionStatus connection state: ', hub.connectionState);

    if (hub.connectionState !== HUB_CONNECTION_STATES.LOCAL && hub.connectionState !== HUB_CONNECTION_STATES.REMOTE) {
      console.warn('SDK askZwaveExclusionStatus: no Hub connection');
      reject(new Error('no hub connection'));
      return;
    }

    if (exclusionInAction[hubId]) {
      reject(new Error('exclusion already in action'));
      return;
    }

    exclusionInAction[hubId] = true;
    send({
      command: COMMANDS.ZWAVE_EXCLUSION_STATUS,
      hubId,
      authKey,
      hubKey,
      localUrl: hub.url,
      data: []
    }).then(state => {
      exclusionInAction[hubId] = false;
      resolve(state);
    }).catch(error => {
      // store.dispatch(hubsState.actions.hubPollFailed())
      console.error('SDK: askZwaveExclusionStatus error: ', error.message);
      exclusionInAction[hubId] = false;
      reject(error);
    });
  });
}

function askZwaveExclusionStatusPromise(hubId, resolve, reject) {
  askZwaveExclusionStatus(hubId).then(state => {
    if (state && state.status) {
      switch (state.status) {
        case ZWAVE_EXCLUSION_STATUS.RUNNING:
          {
            // sleep 5s and try again
            setTimeout(() => {
              askZwaveExclusionStatusPromise(hubId, resolve, reject);
            }, ZWAVE_EXCLUSION_INTERVAL_MS);
            break;
          }

        case ZWAVE_EXCLUSION_STATUS.SUCCESS:
          {
            resolve(true);
            break;
          }

        case ZWAVE_EXCLUSION_STATUS.TIMEOUT:
          {
            resolve(false);
            break;
          }

        case ZWAVE_EXCLUSION_STATUS.CANCEL:
          {
            resolve(false);
            break;
          }

        default:
          {
            reject(new Error('Wrong exclusion status'));
            break;
          }
      }
    } else {
      reject(new Error('Wrong exclusion status'));
    }
  }).catch(error => {
    console.error('Error in askZwaveExclusionStatusPromise: ', error);
    reject(error);
  });
}
/**
 * Start zwave exclusion on given hub
 * @param {string} hubId
 * @return {Promise} that resolves true if device found and false if not
 */


async function doZwaveExclusion(hubId) {
  return new Promise((resolve, reject) => {
    exclusionStopped[hubId] = false;
    startZwaveExclusion(hubId).then(state => {
      if (state && state.status === ZWAVE_EXCLUSION_STATUS.RUNNING) {
        new Promise((r, j) => {
          askZwaveExclusionStatusPromise(hubId, r, j);
        }).then(result => {
          resolve(result);
        }).catch(error => {
          reject(error);
        });
      } else {
        reject(new Error('Wrong exclusion status'));
      }
    }).catch(error => {
      console.error('Error in doZwaveExclusion: ', error);
      reject(error);
    });
  });
}
/**
 * Stop zwave exclusion on given hub
 * @param {string} hubId
 * @return {Promise}
 */

async function stopZwaveExclusion(hubId) {
  return new Promise((resolve, reject) => {
    if (stopExclusionInAction[hubId]) {
      reject(new Error('stopExclusionById already stopping'));
      return;
    }

    stopExclusionInAction[hubId] = true;
    const {
      authKey
    } = storedUser$2();
    const hub = getHubs$1()[hubId];
    const {
      hubKey
    } = hub;
    send({
      command: COMMANDS.ZWAVE_STOP_EXCLUSION,
      hubId,
      authKey,
      hubKey,
      localUrl: hub.url,
      data: []
    }).then(status => {
      console.debug('SDK: stopZwaveExclusion: Ok , status: ', status);
      exclusionStopped[hubId] = true;
      stopExclusionInAction[hubId] = false;
      resolve('ok');
    }).catch(error => {
      console.error('SDK: stopZwaveExclusion error: ', error.message);
      stopExclusionInAction[hubId] = false;
      reject(error);
    });
  });
}
/**
 * Test if zwave of given hub is enabled
 * @param {string} hubId
 * @return {Promise} that resolves true if zwave is enabled
 */

async function isZwaveEnabled(hubId) {
  return new Promise((resolve, reject) => {
    askZwaveExclusionStatus(hubId).then(state => {
      if (state) {
        if (state.status !== ZWAVE_EXCLUSION_STATUS.NO_ZWAVE) {
          resolve(true);
        } else {
          resolve(false);
        }
      } else {
        resolve(false);
      }
    }).catch(error => {
      console.error('Error in isZwaveEnabled: ', error);
      reject(error);
    });
  });
}
/*
**
** Z-wave healing
**
 */

const healingInAction = {};
/**
 * Start healing of Zwave network
 * @param {string} hubId
 * @return {Promise} that resolves true when done
 */

async function healZwave(hubId) {
  return new Promise((resolve, reject) => {
    if (healingInAction[hubId]) {
      reject(new Error('healingInAction already in action'));
      return;
    }

    healingInAction[hubId] = true;
    const {
      authKey
    } = storedUser$2();
    const hub = getHubs$1()[hubId];
    const {
      hubKey
    } = hub;
    send({
      command: COMMANDS.ZWAVE_HEAL,
      hubId,
      authKey,
      hubKey,
      localUrl: hub.url,
      data: []
    }).then(status => {
      console.debug('SDK: healZwave: Ok , status: ', status);
      healingInAction[hubId] = false;
      resolve('ok');
    }).catch(error => {
      console.error('SDK: healZwave error: ', error.message);
      healingInAction[hubId] = false;
      reject(error);
    });
  });
}

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike_1(value) && _baseGetTag(value) == symbolTag);
}

var isSymbol_1 = isSymbol;

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray_1(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol_1(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

var _isKey = isKey;

/* Built-in method references that are verified to be native. */
var nativeCreate = _getNative(Object, 'create');

var _nativeCreate = nativeCreate;

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = _nativeCreate ? _nativeCreate(null) : {};
  this.size = 0;
}

var _hashClear = hashClear;

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

var _hashDelete = hashDelete;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto$7 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$5 = objectProto$7.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (_nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty$5.call(data, key) ? data[key] : undefined;
}

var _hashGet = hashGet;

/** Used for built-in method references. */
var objectProto$8 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$6 = objectProto$8.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return _nativeCreate ? (data[key] !== undefined) : hasOwnProperty$6.call(data, key);
}

var _hashHas = hashHas;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (_nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
  return this;
}

var _hashSet = hashSet;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = _hashClear;
Hash.prototype['delete'] = _hashDelete;
Hash.prototype.get = _hashGet;
Hash.prototype.has = _hashHas;
Hash.prototype.set = _hashSet;

var _Hash = Hash;

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

var _listCacheClear = listCacheClear;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

var eq_1 = eq;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq_1(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

var _assocIndexOf = assocIndexOf;

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice$1 = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice$1.call(data, index, 1);
  }
  --this.size;
  return true;
}

var _listCacheDelete = listCacheDelete;

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

var _listCacheGet = listCacheGet;

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return _assocIndexOf(this.__data__, key) > -1;
}

var _listCacheHas = listCacheHas;

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

var _listCacheSet = listCacheSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = _listCacheClear;
ListCache.prototype['delete'] = _listCacheDelete;
ListCache.prototype.get = _listCacheGet;
ListCache.prototype.has = _listCacheHas;
ListCache.prototype.set = _listCacheSet;

var _ListCache = ListCache;

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new _Hash,
    'map': new (_Map || _ListCache),
    'string': new _Hash
  };
}

var _mapCacheClear = mapCacheClear;

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

var _isKeyable = isKeyable;

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return _isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

var _getMapData = getMapData;

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = _getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

var _mapCacheDelete = mapCacheDelete;

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return _getMapData(this, key).get(key);
}

var _mapCacheGet = mapCacheGet;

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return _getMapData(this, key).has(key);
}

var _mapCacheHas = mapCacheHas;

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = _getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

var _mapCacheSet = mapCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = _mapCacheClear;
MapCache.prototype['delete'] = _mapCacheDelete;
MapCache.prototype.get = _mapCacheGet;
MapCache.prototype.has = _mapCacheHas;
MapCache.prototype.set = _mapCacheSet;

var _MapCache = MapCache;

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || _MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = _MapCache;

var memoize_1 = memoize;

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize_1(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

var _memoizeCapped = memoizeCapped;

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = _memoizeCapped(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46 /* . */) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

var _stringToPath = stringToPath;

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

var _arrayMap = arrayMap;

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = _Symbol ? _Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray_1(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return _arrayMap(value, baseToString) + '';
  }
  if (isSymbol_1(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

var _baseToString = baseToString;

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString$1(value) {
  return value == null ? '' : _baseToString(value);
}

var toString_1 = toString$1;

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray_1(value)) {
    return value;
  }
  return _isKey(value, object) ? [value] : _stringToPath(toString_1(value));
}

var _castPath = castPath;

/** Used as references for various `Number` constants. */
var INFINITY$1 = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol_1(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
}

var _toKey = toKey;

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = _castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[_toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

var _baseGet = baseGet;

var defineProperty$1 = (function() {
  try {
    var func = _getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

var _defineProperty$3 = defineProperty$1;

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && _defineProperty$3) {
    _defineProperty$3(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

var _baseAssignValue = baseAssignValue;

/** Used for built-in method references. */
var objectProto$9 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$7 = objectProto$9.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty$7.call(object, key) && eq_1(objValue, value)) ||
      (value === undefined && !(key in object))) {
    _baseAssignValue(object, key, value);
  }
}

var _assignValue = assignValue;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER$1 : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

var _isIndex = isIndex;

/**
 * The base implementation of `_.set`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize path creation.
 * @returns {Object} Returns `object`.
 */
function baseSet(object, path, value, customizer) {
  if (!isObject_1(object)) {
    return object;
  }
  path = _castPath(path, object);

  var index = -1,
      length = path.length,
      lastIndex = length - 1,
      nested = object;

  while (nested != null && ++index < length) {
    var key = _toKey(path[index]),
        newValue = value;

    if (index != lastIndex) {
      var objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : undefined;
      if (newValue === undefined) {
        newValue = isObject_1(objValue)
          ? objValue
          : (_isIndex(path[index + 1]) ? [] : {});
      }
    }
    _assignValue(nested, key, newValue);
    nested = nested[key];
  }
  return object;
}

var _baseSet = baseSet;

/**
 * The base implementation of  `_.pickBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The source object.
 * @param {string[]} paths The property paths to pick.
 * @param {Function} predicate The function invoked per property.
 * @returns {Object} Returns the new object.
 */
function basePickBy(object, paths, predicate) {
  var index = -1,
      length = paths.length,
      result = {};

  while (++index < length) {
    var path = paths[index],
        value = _baseGet(object, path);

    if (predicate(value, path)) {
      _baseSet(result, _castPath(path, object), value);
    }
  }
  return result;
}

var _basePickBy = basePickBy;

/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

var _baseHasIn = baseHasIn;

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = _castPath(path, object);

  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = _toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength_1(length) && _isIndex(key, length) &&
    (isArray_1(object) || isArguments_1(object));
}

var _hasPath = hasPath;

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && _hasPath(object, path, _baseHasIn);
}

var hasIn_1 = hasIn;

/**
 * The base implementation of `_.pick` without support for individual
 * property identifiers.
 *
 * @private
 * @param {Object} object The source object.
 * @param {string[]} paths The property paths to pick.
 * @returns {Object} Returns the new object.
 */
function basePick(object, paths) {
  return _basePickBy(object, paths, function(value, path) {
    return hasIn_1(object, path);
  });
}

var _basePick = basePick;

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

var _arrayPush = arrayPush;

/** Built-in value references. */
var spreadableSymbol = _Symbol ? _Symbol.isConcatSpreadable : undefined;

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return isArray_1(value) || isArguments_1(value) ||
    !!(spreadableSymbol && value && value[spreadableSymbol]);
}

var _isFlattenable = isFlattenable;

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = _isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        _arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

var _baseFlatten = baseFlatten;

/**
 * Flattens `array` a single level deep.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flatten([1, [2, [3, [4]], 5]]);
 * // => [1, 2, [3, [4]], 5]
 */
function flatten(array) {
  var length = array == null ? 0 : array.length;
  return length ? _baseFlatten(array, 1) : [];
}

var flatten_1 = flatten;

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

var _apply = apply;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return _apply(func, this, otherArgs);
  };
}

var _overRest = overRest;

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

var constant_1 = constant;

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

var identity_1 = identity;

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !_defineProperty$3 ? identity_1 : function(func, string) {
  return _defineProperty$3(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant_1(string),
    'writable': true
  });
};

var _baseSetToString = baseSetToString;

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
    HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

var _shortOut = shortOut;

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = _shortOut(_baseSetToString);

var _setToString = setToString;

/**
 * A specialized version of `baseRest` which flattens the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @returns {Function} Returns the new function.
 */
function flatRest(func) {
  return _setToString(_overRest(func, undefined, flatten_1), func + '');
}

var _flatRest = flatRest;

/**
 * Creates an object composed of the picked `object` properties.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The source object.
 * @param {...(string|string[])} [paths] The property paths to pick.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.pick(object, ['a', 'c']);
 * // => { 'a': 1, 'c': 3 }
 */
var pick = _flatRest(function(object, paths) {
  return object == null ? {} : _basePick(object, paths);
});

var pick_1 = pick;

//      

/**
 * Device state command to be sent
 * @param  {string} hubId
 * @param  {string} deviceId
 * @param  {Object} state
 * @param  {Array<string>} properties - optional properties
 * @return {Promise}
 */

function sendDeviceStateCmd(hubId, deviceId, state, properties) {
  return new Promise((resolve, reject) => {
    const stateNow = store.getState();
    const user = userState.selectors.getUser(stateNow);

    if (!user || !user.authKey) {
      console.error('SDK sendDeviceStateCmd error: No userKey!');
      reject(new Error('Device command error: No userKey!'));
      return;
    }

    const hubs = hubsState.selectors.getHubs(stateNow);

    if (!hubs[hubId] || !hubs[hubId].hubKey) {
      console.error('SDK sendDeviceStateCmd error: No hubKey!');
      reject(new Error('Device command error: No hubKey!'));
      return;
    }

    const {
      authKey
    } = user;
    const {
      hubKey
    } = hubs[hubId];
    let sendState = state;

    if (!isEmpty_1(properties)) {
      sendState = pick_1(sendState, properties);
    }

    send({
      command: COMMANDS.CMD_DEVICE_STATE,
      authKey,
      hubId,
      hubKey,
      data: [{
        id: deviceId,
        state: sendState
      }]
    }).then(response => {
      console.debug('SDK sendDeviceCmd ok', response);
      resolve(response);
    }).catch(error => {
      console.error(error);
      console.error('SDK sendDeviceStateCmd error:', error);
      reject(new Error('Device state command error!'));
    });
  });
}
/**
 * General device command to be sent
 * @param  {string} hubId
 * @param  {string} deviceId
 * @param  {Object} state
 * @param  {Array<string>} properties - optional properties
 * @return {Promise}
 */

function sendDeviceCmd(hubId, deviceId, commandType, data, properties) {
  return new Promise((resolve, reject) => {
    const stateNow = store.getState();
    const user = userState.selectors.getUser(stateNow);

    if (!user || !user.authKey) {
      console.error('SDK sendDeviceCmd error: No userKey!');
      reject(new Error('Device command error: No userKey!'));
      return;
    }

    const hubs = hubsState.selectors.getHubs(stateNow);
    const hub = hubs[hubId];
    const {
      hubKey
    } = hubs[hubId];

    if (!hub || !hubKey) {
      console.error('SDK sendDeviceCmd error: No hubKey!');
      reject(new Error('Device command error: No hubKey!'));
      return;
    }

    if (hub.connectionState !== HUB_CONNECTION_STATES.LOCAL && hub.connectionState !== HUB_CONNECTION_STATES.REMOTE) {
      console.error('SDK sendDeviceCmd error: No Hub connection');
      reject(new Error('Device command error: No hub connection'));
      return;
    }

    const {
      authKey
    } = user;

    if (!authKey) {
      console.error('SDK sendDeviceCmd error: No authKey!');
      reject(new Error('Device command error: No hubKey!'));
      return;
    }

    let sendData = data;

    if (!isEmpty_1(properties)) {
      sendData = pick_1(sendData, properties);
    }

    if (commandType) {
      send({
        command: commandType,
        method: undefined,
        authKey,
        hubId,
        localUrl: hub.url,
        hubKey,
        data: [sendData]
      }).then(response => {
        console.debug('SDK sendDeviceCmd ok', response);
        resolve(response);
      }).catch(error => {
        console.error('SDK sendDeviceCmd error:', error);
        reject(new Error('Device command error!'));
      });
    }
  });
}
/**
 * Unpair device
 * @param  {string} hubId
 * @param  {string} deviceId
 * @return {Promise}
 */

function unpairDevice(hubId, deviceId) {
  return sendDeviceCmd(hubId, deviceId, COMMANDS.CMD_DEVICE_IGNORE, {
    id: deviceId
  });
}
/**
 * Identify device
 * @param  {string} hubId
 * @param  {string} deviceId
 * @return {Promise}
 */

function identifyDevice(hubId, deviceId) {
  return sendDeviceCmd(hubId, deviceId, COMMANDS.CMD_DEVICE_IDENTIFY, {
    id: deviceId
  });
}
/**
 * Identify device
 * @param  {string} hubId
 * @param  {string} deviceId
 * @param  {string} name
 * @param  {Array<string>} roomId
 * @return {Promise}
 */

function setDeviceMeta(hubId, deviceId, name, rooms) {
  return sendDeviceCmd(hubId, deviceId, COMMANDS.CMD_DEVICE_META, {
    id: deviceId,
    name,
    room: rooms
  });
}

//      
/**
 * Set plans
 * @return {PLANS_TYPE}
 */

function setPlans(plans) {
  store.dispatch(plansState.actions.setPlansState(plans));
}
/**
 * Get plans
 * @return {PLANS_TYPE}
 */

function getPlans() {
  const stateNow = store.getState();
  return plansState.selectors.getPlans(stateNow);
}
function addLocationNode(parentId, newNode) {
  store.dispatch(plansState.actions.addLocationNode({
    parentId,
    newNode
  }));
}
function setLocationNode(nodeToBeSet) {
  store.dispatch(plansState.actions.setLocationNode(nodeToBeSet));
}
function removeLocationNode(nodeId) {
  store.dispatch(plansState.actions.removeLocationNode(nodeId));
}
/**
 * Load plans
 * @return {PLANS_TYPE}
 */

async function loadPlans() {
  return new Promise((resolve, reject) => {
    const stateNow = store.getState();
    const user = userState.selectors.getUser(stateNow);

    if (!user || !user.authKey) {
      console.error('SDK loadPlans error: No userKey!');
      reject(new Error('Load plans error: No userKey!'));
      return;
    }

    const {
      authKey
    } = user;

    if (!authKey) {
      console.error('SDK loadPlans error: No authKey!');
      reject(new Error('Load plans error: No authKey!'));
      return;
    }

    send({
      command: COMMANDS.CMD_GET_PLANS,
      authKey,
      url: 'http://localhost:3001/plans'
    }).then(plans => {
      console.debug('SDK loadPlans ok', plans);
      setPlans(plans);
      resolve(getPlans());
    }).catch(error => {
      console.error('SDK loadPlans error:', error);
      reject(error);
    });
  });
}
/**
 * Save plans
 * @return {PLANS_TYPE}
 */

async function savePlans() {
  return new Promise((resolve, reject) => {
    const stateNow = store.getState();
    const user = userState.selectors.getUser(stateNow);

    if (!user || !user.authKey) {
      console.error('SDK savePlans error: No userKey!');
      reject(new Error('Save plans error: No userKey!'));
      return;
    }

    const {
      authKey
    } = user;

    if (!authKey) {
      console.error('SDK savePlans error: No authKey!');
      reject(new Error('Save plans error: No authKey!'));
      return;
    }

    const plansToBeSaved = getPlans();
    const data = {
      templates: plansToBeSaved.templates,
      installations: plansToBeSaved.installations,
      locations: plansToBeSaved.locations
    };
    send({
      command: COMMANDS.CMD_SAVE_PLANS,
      authKey,
      data,
      url: 'http://localhost:3001/plans'
    }).then(status => {
      console.debug('SDK savePlans ok', status); // store.dispatch(setPlans(plans));

      resolve(status);
    }).catch(error => {
      debugger;
      console.error('SDK savePlans error:', error);
      reject(error);
    });
  });
}

exports.CLOUD_CONNECTION_STATES = CLOUD_CONNECTION_STATES;
exports.HUB_CONNECTION_STATES = HUB_CONNECTION_STATES;
exports.HUB_STATES = HUB_STATES;
exports.LANGUAGES = LANGUAGES;
exports.ROLES = ROLES;
exports.USER_STATES = USER_STATES;
exports.ZWAVE_EXCLUSION_STATUS = ZWAVE_EXCLUSION_STATUS;
exports.ZWAVE_INCLUSION_STATUS = ZWAVE_INCLUSION_STATUS;
exports.acceptEula = acceptEula;
exports.addLocationNode = addLocationNode;
exports.addRoom = addRoom;
exports.changeLanguage = changeLanguage;
exports.closeAlarm = closeAlarm;
exports.connectHubByTokens = connectHubByTokens;
exports.cozifyReducer = rootReducer;
exports.deleteDevice = deleteDevice;
exports.devicesState = devicesState;
exports.doPoll = doPoll;
exports.doPwLogin = doPwLogin;
exports.doRemoteIdQuery = doRemoteIdQuery;
exports.doZwaveExclusion = doZwaveExclusion;
exports.doZwaveInclusion = doZwaveInclusion;
exports.editRoom = editRoom;
exports.getAlarms = getAlarms;
exports.getCloudConnectionState = getCloudConnectionState;
exports.getDevices = getDevices;
exports.getHubAlarms = getHubAlarms;
exports.getHubConnectionState = getHubConnectionState;
exports.getHubDevices = getHubDevices;
exports.getHubPairingDevices = getHubPairingDevices;
exports.getHubRooms = getHubRooms;
exports.getHubs = getHubs;
exports.getPairingDevices = getPairingDevices;
exports.getPlans = getPlans;
exports.getRooms = getRooms;
exports.getUserState = getUserState;
exports.healZwave = healZwave;
exports.hubsState = hubsState;
exports.identifyDevice = identifyDevice;
exports.ignorePairingByIds = ignorePairingByIds;
exports.isZwaveEnabled = isZwaveEnabled;
exports.loadPlans = loadPlans;
exports.lockAndBackup = lockAndBackup;
exports.removeAlarm = removeAlarm;
exports.removeLocationNode = removeLocationNode;
exports.removeRoom = removeRoom;
exports.savePlans = savePlans;
exports.selectHubById = selectHubById;
exports.sendDeviceCmd = sendDeviceCmd;
exports.sendDeviceStateCmd = sendDeviceStateCmd;
exports.setAuthenticated = setAuthenticated;
exports.setDeviceMeta = setDeviceMeta;
exports.setDevices = setDevices;
exports.setLocationNode = setLocationNode;
exports.setPlans = setPlans;
exports.startDiscoveringHubs = startDiscoveringHubs;
exports.startPairingById = startPairingById;
exports.startPollingById = startPollingById;
exports.stopDiscoveringHubs = stopDiscoveringHubs;
exports.stopPairingById = stopPairingById;
exports.stopPairings = stopPairings;
exports.stopPollingById = stopPollingById;
exports.stopZwaveExclusion = stopZwaveExclusion;
exports.stopZwaveInclusion = stopZwaveInclusion;
exports.store = store;
exports.unSelectHubById = unSelectHubById;
exports.unSelectHubs = unSelectHubs;
exports.unpairDevice = unpairDevice;
exports.updateHubs = updateHubs;
exports.urlBase64Decode = urlBase64Decode;
exports.useTestcloud = useTestcloud;
exports.watchChanges = watchChanges;
