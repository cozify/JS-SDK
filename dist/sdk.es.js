import axios from 'axios';

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

var defineProperty = _defineProperty;

function n(n){for(var t=arguments.length,r=Array(t>1?t-1:0),e=1;e<t;e++)r[e-1]=arguments[e];throw Error("[Immer] minified error nr: "+n+(r.length?" "+r.join(","):"")+". Find the full error at: https://bit.ly/3cXEKWf")}function t(n){return !!n&&!!n[B]}function r(n){return !!n&&(function(n){if(!n||"object"!=typeof n)return !1;var t=Object.getPrototypeOf(n);return !t||t===Object.prototype}(n)||Array.isArray(n)||!!n[q]||!!n.constructor[q]||c(n)||s(n))}function i(n,t){0===o(n)?L(n).forEach((function(r){return t(r,n[r],n)})):n.forEach((function(r,e){return t(e,r,n)}));}function o(n){var t=n[B];return t?t.i>3?t.i-4:t.i:Array.isArray(n)?1:c(n)?2:s(n)?3:0}function u(n,t){return 2===o(n)?n.has(t):Object.prototype.hasOwnProperty.call(n,t)}function a(n,t){return 2===o(n)?n.get(t):n[t]}function f(n,t){return n===t?0!==n||1/n==1/t:n!=n&&t!=t}function c(n){return $&&n instanceof Map}function s(n){return U&&n instanceof Set}function v(n){return n.o||n.t}function p(t,r){if(void 0===r&&(r=!1),Array.isArray(t))return t.slice();var e=Object.create(Object.getPrototypeOf(t));return i(t,(function(i){if(i!==B){var o=Object.getOwnPropertyDescriptor(t,i),u=o.value;o.get&&(r||n(1),u=o.get.call(t)),o.enumerable?e[i]=u:Object.defineProperty(e,i,{value:u,writable:!0,configurable:!0});}})),e}function d(n,e){t(n)||Object.isFrozen(n)||!r(n)||(o(n)>1&&(n.set=n.add=n.clear=n.delete=l),Object.freeze(n),e&&i(n,(function(n,t){return d(t,!0)})));}function l(){n(2);}function h(t){var r=Q[t];return r||n(19,t),r}function y(n,t){Q[n]=t;}function m(){return J}function b(n,t){t&&(h("Patches"),n.u=[],n.s=[],n.v=t);}function _(n){j(n),n.p.forEach(g),n.p=null;}function j(n){n===J&&(J=n.l);}function O(n){return J={p:[],l:J,h:n,m:!0,_:0}}function g(n){var t=n[B];0===t.i||1===t.i?t.j():t.O=!0;}function w(t,e){e._=e.p.length;var i=e.p[0],o=void 0!==t&&t!==i;return e.h.g||h("ES5").S(e,t,o),o?(i[B].P&&(_(e),n(4)),r(t)&&(t=S(e,t),e.l||M(e,t)),e.u&&h("Patches").M(i[B],t,e.u,e.s)):t=S(e,i,[]),_(e),e.u&&e.v(e.u,e.s),t!==X?t:void 0}function S(n,t,r){if(Object.isFrozen(t))return t;var e=t[B];if(!e)return i(t,(function(i,o){return P(n,e,t,i,o,r)})),t;if(e.A!==n)return t;if(!e.P)return M(n,e.t,!0),e.t;if(!e.I){e.I=!0,e.A._--;var o=4===e.i||5===e.i?e.o=p(e.k,!0):e.o;i(o,(function(t,i){return P(n,e,o,t,i,r)})),M(n,o,!1),r&&n.u&&h("Patches").R(e,r,n.u,n.s);}return e.o}function P(e,i,c,s,v,p){if(t(v)){var d=S(e,v,p&&i&&3!==i.i&&!u(i.D,s)?p.concat(s):void 0);if(h=s,y=d,2===(m=o(l=c))?l.set(h,y):3===m?(l.delete(h),l.add(y)):l[h]=y,!t(d))return;e.m=!1;}var l,h,y,m;if((!i||!f(v,a(i.t,s)))&&r(v)){if(!e.h.N&&e._<1)return;S(e,v),i&&i.A.l||M(e,v);}}function M(n,t,r){void 0===r&&(r=!1),n.h.N&&n.m&&d(t,r);}function A(n,t){var r=n[B],e=Reflect.getOwnPropertyDescriptor(r?v(r):n,t);return e&&e.value}function z(n){if(!n.P){if(n.P=!0,0===n.i||1===n.i){var t=n.o=p(n.t);i(n.p,(function(n,r){t[n]=r;})),n.p=void 0;}n.l&&z(n.l);}}function x(n){n.o||(n.o=p(n.t));}function I(n,t,r){var e=c(t)?h("MapSet").T(t,r):s(t)?h("MapSet").F(t,r):n.g?function(n,t){var r=Array.isArray(n),e={i:r?1:0,A:t?t.A:m(),P:!1,I:!1,D:{},l:t,t:n,k:null,p:{},o:null,j:null,C:!1},i=e,o=V;r&&(i=[e],o=Y);var u=Proxy.revocable(i,o),a=u.revoke,f=u.proxy;return e.k=f,e.j=a,f}(t,r):h("ES5").J(t,r);return (r?r.A:m()).p.push(e),e}function k(){function e(n,t){var r=n[B];if(r&&!r.$){r.$=!0;var e=n[t];return r.$=!1,e}return n[t]}function o(n){n.P||(n.P=!0,n.l&&o(n.l));}function a(n){n.o||(n.o=c(n.t));}function c(n){var t=n&&n[B];if(t){t.$=!0;var r=p(t.k,!0);return t.$=!1,r}return p(n)}function s(n){for(var t=n.length-1;t>=0;t--){var r=n[t][B];if(!r.P)switch(r.i){case 5:l(r)&&o(r);break;case 4:d(r)&&o(r);}}}function d(n){for(var t=n.t,r=n.k,e=Object.keys(r),i=e.length-1;i>=0;i--){var o=e[i],a=t[o];if(void 0===a&&!u(t,o))return !0;var c=r[o],s=c&&c[B];if(s?s.t!==a:!f(c,a))return !0}return e.length!==Object.keys(t).length}function l(n){var t=n.k;if(t.length!==n.t.length)return !0;var r=Object.getOwnPropertyDescriptor(t,t.length-1);return !(!r||r.get)}function h(t){t.O&&n(3,JSON.stringify(v(t)));}var b={};y("ES5",{J:function(n,t){var u=Array.isArray(n),s=c(n);i(s,(function(t){!function(n,t,i){var u=b[t];u?u.enumerable=i:b[t]=u={enumerable:i,get:function(){return function(n,t){h(n);var i=e(v(n),t);return n.$?i:i===e(n.t,t)&&r(i)?(a(n),n.o[t]=I(n.A.h,i,n)):i}(this[B],t)},set:function(n){!function(n,t,r){if(h(n),n.D[t]=!0,!n.P){if(f(r,e(v(n),t)))return;o(n),a(n);}n.o[t]=r;}(this[B],t,n);}},Object.defineProperty(n,t,u);}(s,t,u||function(n,t){var r=Object.getOwnPropertyDescriptor(n,t);return !(!r||!r.enumerable)}(n,t));}));var p={i:u?5:4,A:t?t.A:m(),P:!1,$:!1,I:!1,D:{},l:t,t:n,k:s,o:null,O:!1,C:!1};return Object.defineProperty(s,B,{value:p,writable:!0}),s},K:o,S:function(n,r,e){n.p.forEach((function(n){n[B].$=!0;})),e?t(r)&&r[B].A===n&&s(n.p):(n.u&&function n(t){if(t&&"object"==typeof t){var r=t[B];if(r){var e=r.t,a=r.k,f=r.D,c=r.i;if(4===c)i(a,(function(t){t!==B&&(void 0!==e[t]||u(e,t)?f[t]||n(a[t]):(f[t]=!0,o(r)));})),i(e,(function(n){void 0!==a[n]||u(a,n)||(f[n]=!1,o(r));}));else if(5===c){if(l(r)&&(o(r),f.length=!0),a.length<e.length)for(var s=a.length;s<e.length;s++)f[s]=!1;else for(var v=e.length;v<a.length;v++)f[v]=!0;for(var p=Math.min(a.length,e.length),d=0;d<p;d++)void 0===f[d]&&n(a[d]);}}}}(n.p[0]),s(n.p));}});}var C,J,K="undefined"!=typeof Symbol,$="undefined"!=typeof Map,U="undefined"!=typeof Set,W="undefined"!=typeof Proxy&&void 0!==Proxy.revocable&&"undefined"!=typeof Reflect,X=K?Symbol("immer-nothing"):((C={})["immer-nothing"]=!0,C),q=K?Symbol("immer-draftable"):"__$immer_draftable",B=K?Symbol("immer-state"):"__$immer_state",L="undefined"!=typeof Reflect&&Reflect.ownKeys?Reflect.ownKeys:void 0!==Object.getOwnPropertySymbols?function(n){return Object.getOwnPropertyNames(n).concat(Object.getOwnPropertySymbols(n))}:Object.getOwnPropertyNames,Q={},V={get:function(n,t){if(t===B)return n;var e=n.p;if(!n.P&&u(e,t))return e[t];var i=v(n)[t];if(n.I||!r(i))return i;if(n.P){if(i!==A(n.t,t))return i;e=n.o;}return e[t]=I(n.A.h,i,n)},has:function(n,t){return t in v(n)},ownKeys:function(n){return Reflect.ownKeys(v(n))},set:function(n,t,r){if(!n.P){var e=A(n.t,t);if(r?f(e,r)||r===n.p[t]:f(e,r)&&t in n.t)return !0;x(n),z(n);}return n.D[t]=!0,n.o[t]=r,!0},deleteProperty:function(n,t){return void 0!==A(n.t,t)||t in n.t?(n.D[t]=!1,x(n),z(n)):n.D[t]&&delete n.D[t],n.o&&delete n.o[t],!0},getOwnPropertyDescriptor:function(n,t){var r=v(n),e=Reflect.getOwnPropertyDescriptor(r,t);return e&&(e.writable=!0,e.configurable=1!==n.i||"length"!==t),e},defineProperty:function(){n(11);},getPrototypeOf:function(n){return Object.getPrototypeOf(n.t)},setPrototypeOf:function(){n(12);}},Y={};i(V,(function(n,t){Y[n]=function(){return arguments[0]=arguments[0][0],t.apply(this,arguments)};})),Y.deleteProperty=function(t,r){return V.deleteProperty.call(this,t[0],r)},Y.set=function(t,r,e){return V.set.call(this,t[0],r,e,t[0])};var Z=function(){function e(n){this.g=W,this.N="production"!=='production',"boolean"==typeof(null==n?void 0:n.useProxies)&&this.setUseProxies(n.useProxies),"boolean"==typeof(null==n?void 0:n.autoFreeze)&&this.setAutoFreeze(n.autoFreeze),this.produce=this.produce.bind(this),this.produceWithPatches=this.produceWithPatches.bind(this);}var i=e.prototype;return i.produce=function(t,e,i){if("function"==typeof t&&"function"!=typeof e){var o=e;e=t;var u=this;return function(n){var t=this;void 0===n&&(n=o);for(var r=arguments.length,i=Array(r>1?r-1:0),a=1;a<r;a++)i[a-1]=arguments[a];return u.produce(n,(function(n){var r;return (r=e).call.apply(r,[t,n].concat(i))}))}}var a;if("function"!=typeof e&&n(6),void 0!==i&&"function"!=typeof i&&n(7),r(t)){var f=O(this),c=I(this,t,void 0),s=!0;try{a=e(c),s=!1;}finally{s?_(f):j(f);}return "undefined"!=typeof Promise&&a instanceof Promise?a.then((function(n){return b(f,i),w(n,f)}),(function(n){throw _(f),n})):(b(f,i),w(a,f))}if((a=e(t))!==X)return void 0===a&&(a=t),this.N&&d(a,!0),a},i.produceWithPatches=function(n,t){var r,e,i=this;return "function"==typeof n?function(t){for(var r=arguments.length,e=Array(r>1?r-1:0),o=1;o<r;o++)e[o-1]=arguments[o];return i.produceWithPatches(t,(function(t){return n.apply(void 0,[t].concat(e))}))}:[this.produce(n,t,(function(n,t){r=n,e=t;})),r,e]},i.createDraft=function(t){r(t)||n(8);var e=O(this),i=I(this,t,void 0);return i[B].C=!0,j(e),i},i.finishDraft=function(t,r){var e=t&&t[B];var i=e.A;return b(i,r),w(void 0,i)},i.setAutoFreeze=function(n){this.N=n;},i.setUseProxies=function(t){W||n(20),this.g=t;},i.applyPatches=function(n,r){var e;for(e=r.length-1;e>=0;e--){var i=r[e];if(0===i.path.length&&"replace"===i.op){n=i.value;break}}var o=h("Patches").U;return t(n)?o(n,r):this.produce(n,(function(n){return o(n,r.slice(e+1))}))},e}(),nn=new Z,tn=nn.produce,rn=nn.produceWithPatches.bind(nn),en=nn.setAutoFreeze.bind(nn),on=nn.setUseProxies.bind(nn),un=nn.applyPatches.bind(nn),an=nn.createDraft.bind(nn),fn=nn.finishDraft.bind(nn);

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
      throw new Error('You may not call store.subscribe() while the reducer is executing. ' + 'If you would like to be notified after the store has been updated, subscribe from a ' + 'component and invoke store.getState() in the callback to access the latest state. ' + 'See https://redux.js.org/api-reference/store#subscribelistener for more details.');
    }

    var isSubscribed = true;
    ensureCanMutateNextListeners();
    nextListeners.push(listener);
    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      if (isDispatching) {
        throw new Error('You may not unsubscribe from a store listener while the reducer is executing. ' + 'See https://redux.js.org/api-reference/store#subscribelistener for more details.');
      }

      isSubscribed = false;
      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
      currentListeners = null;
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

    currentReducer = nextReducer; // This action has a similiar effect to ActionTypes.INIT.
    // Any reducers that existed in both the new and old rootReducer
    // will receive the previous state. This effectively populates
    // the new state tree with any relevant data from the old one.

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

  var finalReducerKeys = Object.keys(finalReducers); // This is used to make sure we don't warn about the same

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

    hasChanged = hasChanged || finalReducerKeys.length !== Object.keys(state).length;
    return hasChanged ? nextState : state;
  };
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

function ownKeys(object, enumerableOnly) {
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
      ownKeys(source, true).forEach(function (key) {
        _defineProperty$1(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function (key) {
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
      _dispatch = compose.apply(void 0, chain)(store.dispatch);
      return _objectSpread2({}, store, {
        dispatch: _dispatch
      });
    };
  };
}

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

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

/**
 * @public
 */

var composeWithDevTools = typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : function () {
  if (arguments.length === 0) return undefined;
  if (typeof arguments[0] === 'object') return compose;
  return compose.apply(null, arguments);
};

/**
 * Returns true if the passed value is "plain" object, i.e. an object whose
 * protoype is the root `Object.prototype`. This includes objects created
 * using object literals, but not for instance for class instances.
 *
 * @param {any} value The value to inspect.
 * @returns {boolean} True if the argument appears to be a plain object.
 */
function isPlainObject$1(value) {
  if (typeof value !== 'object' || value === null) return false;
  var proto = value;

  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(value) === proto;
}

function isBoolean(x) {
  return typeof x === 'boolean';
}
/**
 * Returns any array containing the default middleware installed by
 * `configureStore()`. Useful if you want to configure your store with a custom
 * `middleware` array but still keep the default set.
 *
 * @return The default middleware used by `configureStore()`.
 *
 * @public
 */


function getDefaultMiddleware(options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      _options$thunk = _options.thunk,
      thunk$1 = _options$thunk === void 0 ? true : _options$thunk,
      _options$immutableChe = _options.immutableCheck,
      _options$serializable = _options.serializableCheck;
  var middlewareArray = [];

  if (thunk$1) {
    if (isBoolean(thunk$1)) {
      middlewareArray.push(thunk);
    } else {
      middlewareArray.push(thunk.withExtraArgument(thunk$1.extraArgument));
    }
  }

  return middlewareArray;
}

var IS_PRODUCTION = 'production' === 'production';
/**
 * A friendly abstraction over the standard Redux `createStore()` function.
 *
 * @param config The store configuration.
 * @returns A configured Redux store.
 *
 * @public
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
      enhancers = _ref$enhancers === void 0 ? undefined : _ref$enhancers;

  var rootReducer;

  if (typeof reducer === 'function') {
    rootReducer = reducer;
  } else if (isPlainObject$1(reducer)) {
    rootReducer = combineReducers(reducer);
  } else {
    throw new Error('"reducer" is a required argument, and must be a function or an object of functions that can be passed to combineReducers');
  }

  var middlewareEnhancer = applyMiddleware.apply(void 0, middleware);
  var finalCompose = compose;

  if (devTools) {
    finalCompose = composeWithDevTools(_extends({
      // Enable capture of stack traces for dispatched Redux actions
      trace: !IS_PRODUCTION
    }, typeof devTools === 'object' && devTools));
  }

  var storeEnhancers = [middlewareEnhancer];

  if (Array.isArray(enhancers)) {
    storeEnhancers = [middlewareEnhancer].concat(enhancers);
  } else if (typeof enhancers === 'function') {
    storeEnhancers = enhancers(storeEnhancers);
  }

  var composedEnhancer = finalCompose.apply(void 0, storeEnhancers);
  return createStore(rootReducer, preloadedState, composedEnhancer);
}

function createAction(type, prepareAction) {
  function actionCreator() {
    if (prepareAction) {
      var prepared = prepareAction.apply(void 0, arguments);

      if (!prepared) {
        throw new Error('prepareAction did not return an object');
      }

      return _extends({
        type: type,
        payload: prepared.payload
      }, 'meta' in prepared && {
        meta: prepared.meta
      }, {}, 'error' in prepared && {
        error: prepared.error
      });
    }

    return {
      type: type,
      payload: arguments.length <= 0 ? undefined : arguments[0]
    };
  }

  actionCreator.toString = function () {
    return "" + type;
  };

  actionCreator.type = type;

  actionCreator.match = function (action) {
    return action.type === type;
  };

  return actionCreator;
}
function isFSA(action) {
  return isPlainObject$1(action) && typeof action.type === 'string' && Object.keys(action).every(isValidKey);
}

function isValidKey(key) {
  return ['type', 'payload', 'error', 'meta'].indexOf(key) > -1;
}

function executeReducerBuilderCallback(builderCallback) {
  var actionsMap = {};
  var builder = {
    addCase: function addCase(typeOrActionCreator, reducer) {
      var type = typeof typeOrActionCreator === 'string' ? typeOrActionCreator : typeOrActionCreator.type;

      if (type in actionsMap) {
        throw new Error('addCase cannot be called with two reducers for the same action type');
      }

      actionsMap[type] = reducer;
      return builder;
    }
  };
  builderCallback(builder);
  return actionsMap;
}

function createReducer(initialState, mapOrBuilderCallback) {
  var actionsMap = typeof mapOrBuilderCallback === 'function' ? executeReducerBuilderCallback(mapOrBuilderCallback) : mapOrBuilderCallback;
  return function (state, action) {
    if (state === void 0) {
      state = initialState;
    }

    // @ts-ignore createNextState() produces an Immutable<Draft<S>> rather
    // than an Immutable<S>, and TypeScript cannot find out how to reconcile
    // these two types.
    return tn(state, function (draft) {
      var caseReducer = actionsMap[action.type];
      return caseReducer ? caseReducer(draft, action) : undefined;
    });
  };
}

function getType$1(slice, actionKey) {
  return slice + "/" + actionKey;
}
/**
 * A function that accepts an initial state, an object full of reducer
 * functions, and a "slice name", and automatically generates
 * action creators and action types that correspond to the
 * reducers and state.
 *
 * The `reducer` argument is passed to `createReducer()`.
 *
 * @public
 */


function createSlice(options) {
  var name = options.name,
      initialState = options.initialState;

  if (!name) {
    throw new Error('`name` is a required option for createSlice');
  }

  var reducers = options.reducers || {};
  var extraReducers = typeof options.extraReducers === 'undefined' ? {} : typeof options.extraReducers === 'function' ? executeReducerBuilderCallback(options.extraReducers) : options.extraReducers;
  var reducerNames = Object.keys(reducers);
  var sliceCaseReducersByName = {};
  var sliceCaseReducersByType = {};
  var actionCreators = {};
  reducerNames.forEach(function (reducerName) {
    var maybeReducerWithPrepare = reducers[reducerName];
    var type = getType$1(name, reducerName);
    var caseReducer;
    var prepareCallback;

    if ('reducer' in maybeReducerWithPrepare) {
      caseReducer = maybeReducerWithPrepare.reducer;
      prepareCallback = maybeReducerWithPrepare.prepare;
    } else {
      caseReducer = maybeReducerWithPrepare;
    }

    sliceCaseReducersByName[reducerName] = caseReducer;
    sliceCaseReducersByType[type] = caseReducer;
    actionCreators[reducerName] = prepareCallback ? createAction(type, prepareCallback) : createAction(type);
  });

  var finalCaseReducers = _extends({}, extraReducers, {}, sliceCaseReducersByType);

  var reducer = createReducer(initialState, finalCaseReducers);
  return {
    name: name,
    reducer: reducer,
    actions: actionCreators,
    caseReducers: sliceCaseReducersByName
  };
}

function getInitialEntityState() {
  return {
    ids: [],
    entities: {}
  };
}
function createInitialStateFactory() {
  function getInitialState(additionalState) {
    if (additionalState === void 0) {
      additionalState = {};
    }

    return Object.assign(getInitialEntityState(), additionalState);
  }

  return {
    getInitialState: getInitialState
  };
}

function createSelectorsFactory() {
  function getSelectors(selectState) {
    var selectIds = function selectIds(state) {
      return state.ids;
    };

    var selectEntities = function selectEntities(state) {
      return state.entities;
    };

    var selectAll = createSelector(selectIds, selectEntities, function (ids, entities) {
      return ids.map(function (id) {
        return entities[id];
      });
    });

    var selectId = function selectId(_, id) {
      return id;
    };

    var selectById = function selectById(entities, id) {
      return entities[id];
    };

    var selectTotal = createSelector(selectIds, function (ids) {
      return ids.length;
    });

    if (!selectState) {
      return {
        selectIds: selectIds,
        selectEntities: selectEntities,
        selectAll: selectAll,
        selectTotal: selectTotal,
        selectById: createSelector(selectEntities, selectId, selectById)
      };
    }

    var selectGlobalizedEntities = createSelector(selectState, selectEntities);
    return {
      selectIds: createSelector(selectState, selectIds),
      selectEntities: selectGlobalizedEntities,
      selectAll: createSelector(selectState, selectAll),
      selectTotal: createSelector(selectState, selectTotal),
      selectById: createSelector(selectGlobalizedEntities, selectId, selectById)
    };
  }

  return {
    getSelectors: getSelectors
  };
}

function createStateOperator(mutator) {
  return function operation(state, arg) {
    function isPayloadActionArgument(arg) {
      return isFSA(arg);
    }

    var runMutator = function runMutator(draft) {
      if (isPayloadActionArgument(arg)) {
        mutator(arg.payload, draft);
      } else {
        mutator(arg, draft);
      }
    };

    if (t(state)) {
      // we must already be inside a `createNextState` call, likely because
      // this is being wrapped in `createReducer` or `createSlice`.
      // It's safe to just pass the draft to the mutator.
      runMutator(state); // since it's a draft, we'll just return it

      return state;
    } else {
      // @ts-ignore createNextState() produces an Immutable<Draft<S>> rather
      // than an Immutable<S>, and TypeScript cannot find out how to reconcile
      // these two types.
      return tn(state, runMutator);
    }
  };
}

function selectIdValue(entity, selectId) {
  var key = selectId(entity);

  return key;
}

function createUnsortedStateAdapter(selectId) {
  function addOneMutably(entity, state) {
    var key = selectIdValue(entity, selectId);

    if (key in state.entities) {
      return;
    }

    state.ids.push(key);
    state.entities[key] = entity;
  }

  function addManyMutably(entities, state) {
    if (!Array.isArray(entities)) {
      entities = Object.values(entities);
    }

    for (var _iterator = entities, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var entity = _ref;
      addOneMutably(entity, state);
    }
  }

  function setAllMutably(entities, state) {
    if (!Array.isArray(entities)) {
      entities = Object.values(entities);
    }

    state.ids = [];
    state.entities = {};
    addManyMutably(entities, state);
  }

  function removeOneMutably(key, state) {
    return removeManyMutably([key], state);
  }

  function removeManyMutably(keys, state) {
    var didMutate = false;
    keys.forEach(function (key) {
      if (key in state.entities) {
        delete state.entities[key];
        didMutate = true;
      }
    });

    if (didMutate) {
      state.ids = state.ids.filter(function (id) {
        return id in state.entities;
      });
    }
  }

  function removeAll(state) {
    return Object.assign({}, state, {
      ids: [],
      entities: {}
    });
  }

  function takeNewKey(keys, update, state) {
    var original = state.entities[update.id];
    var updated = Object.assign({}, original, update.changes);
    var newKey = selectIdValue(updated, selectId);
    var hasNewKey = newKey !== update.id;

    if (hasNewKey) {
      keys[update.id] = newKey;
      delete state.entities[update.id];
    }

    state.entities[newKey] = updated;
    return hasNewKey;
  }

  function updateOneMutably(update, state) {
    return updateManyMutably([update], state);
  }

  function updateManyMutably(updates, state) {
    var newKeys = {};
    var updatesPerEntity = {};
    updates.forEach(function (update) {
      // Only apply updates to entities that currently exist
      if (update.id in state.entities) {
        // If there are multiple updates to one entity, merge them together
        updatesPerEntity[update.id] = _extends({}, updatesPerEntity[update.id], {}, update);
      }
    });
    updates = Object.values(updatesPerEntity);
    var didMutateEntities = updates.length > 0;

    if (didMutateEntities) {
      var didMutateIds = updates.filter(function (update) {
        return takeNewKey(newKeys, update, state);
      }).length > 0;

      if (didMutateIds) {
        state.ids = state.ids.map(function (id) {
          return newKeys[id] || id;
        });
      }
    }
  }

  function upsertOneMutably(entity, state) {
    return upsertManyMutably([entity], state);
  }

  function upsertManyMutably(entities, state) {
    if (!Array.isArray(entities)) {
      entities = Object.values(entities);
    }

    var added = [];
    var updated = [];

    for (var _iterator2 = entities, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
      var _ref2;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref2 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref2 = _i2.value;
      }

      var entity = _ref2;
      var id = selectIdValue(entity, selectId);

      if (id in state.entities) {
        updated.push({
          id: id,
          changes: entity
        });
      } else {
        added.push(entity);
      }
    }

    updateManyMutably(updated, state);
    addManyMutably(added, state);
  }

  return {
    removeAll: removeAll,
    addOne: createStateOperator(addOneMutably),
    addMany: createStateOperator(addManyMutably),
    setAll: createStateOperator(setAllMutably),
    updateOne: createStateOperator(updateOneMutably),
    updateMany: createStateOperator(updateManyMutably),
    upsertOne: createStateOperator(upsertOneMutably),
    upsertMany: createStateOperator(upsertManyMutably),
    removeOne: createStateOperator(removeOneMutably),
    removeMany: createStateOperator(removeManyMutably)
  };
}

function createSortedStateAdapter(selectId, sort) {
  var _createUnsortedStateA = createUnsortedStateAdapter(selectId),
      removeOne = _createUnsortedStateA.removeOne,
      removeMany = _createUnsortedStateA.removeMany,
      removeAll = _createUnsortedStateA.removeAll;

  function addOneMutably(entity, state) {
    return addManyMutably([entity], state);
  }

  function addManyMutably(newModels, state) {
    if (!Array.isArray(newModels)) {
      newModels = Object.values(newModels);
    }

    var models = newModels.filter(function (model) {
      return !(selectIdValue(model, selectId) in state.entities);
    });

    if (models.length !== 0) {
      merge(models, state);
    }
  }

  function setAllMutably(models, state) {
    if (!Array.isArray(models)) {
      models = Object.values(models);
    }

    state.entities = {};
    state.ids = [];
    addManyMutably(models, state);
  }

  function updateOneMutably(update, state) {
    return updateManyMutably([update], state);
  }

  function takeUpdatedModel(models, update, state) {
    if (!(update.id in state.entities)) {
      return false;
    }

    var original = state.entities[update.id];
    var updated = Object.assign({}, original, update.changes);
    var newKey = selectIdValue(updated, selectId);
    delete state.entities[update.id];
    models.push(updated);
    return newKey !== update.id;
  }

  function updateManyMutably(updates, state) {
    var models = [];
    updates.forEach(function (update) {
      return takeUpdatedModel(models, update, state);
    });

    if (models.length !== 0) {
      merge(models, state);
    }
  }

  function upsertOneMutably(entity, state) {
    return upsertManyMutably([entity], state);
  }

  function upsertManyMutably(entities, state) {
    if (!Array.isArray(entities)) {
      entities = Object.values(entities);
    }

    var added = [];
    var updated = [];

    for (var _iterator = entities, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var entity = _ref;
      var id = selectIdValue(entity, selectId);

      if (id in state.entities) {
        updated.push({
          id: id,
          changes: entity
        });
      } else {
        added.push(entity);
      }
    }

    updateManyMutably(updated, state);
    addManyMutably(added, state);
  }

  function areArraysEqual(a, b) {
    if (a.length !== b.length) {
      return false;
    }

    for (var i = 0; i < a.length && i < b.length; i++) {
      if (a[i] === b[i]) {
        continue;
      }

      return false;
    }

    return true;
  }

  function merge(models, state) {
    models.sort(sort); // Insert/overwrite all new/updated

    models.forEach(function (model) {
      state.entities[selectId(model)] = model;
    });
    var allEntities = Object.values(state.entities);
    allEntities.sort(sort);
    var newSortedIds = allEntities.map(selectId);
    var ids = state.ids;

    if (!areArraysEqual(ids, newSortedIds)) {
      state.ids = newSortedIds;
    }
  }

  return {
    removeOne: removeOne,
    removeMany: removeMany,
    removeAll: removeAll,
    addOne: createStateOperator(addOneMutably),
    updateOne: createStateOperator(updateOneMutably),
    upsertOne: createStateOperator(upsertOneMutably),
    setAll: createStateOperator(setAllMutably),
    addMany: createStateOperator(addManyMutably),
    updateMany: createStateOperator(updateManyMutably),
    upsertMany: createStateOperator(upsertManyMutably)
  };
}

/**
 *
 * @param options
 *
 * @public
 */

function createEntityAdapter(options) {
  if (options === void 0) {
    options = {};
  }

  var _sortComparer$selectI = _extends({
    sortComparer: false,
    selectId: function selectId(instance) {
      return instance.id;
    }
  }, options),
      selectId = _sortComparer$selectI.selectId,
      sortComparer = _sortComparer$selectI.sortComparer;

  var stateFactory = createInitialStateFactory();
  var selectorsFactory = createSelectorsFactory();
  var stateAdapter = sortComparer ? createSortedStateAdapter(selectId, sortComparer) : createUnsortedStateAdapter(selectId);
  return _extends({
    selectId: selectId,
    sortComparer: sortComparer
  }, stateFactory, {}, selectorsFactory, {}, stateAdapter);
}

// A type of promise-like that resolves synchronously and supports only one observer

const _iteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator"))) : "@@iterator";

const _asyncIteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.asyncIterator || (Symbol.asyncIterator = Symbol("Symbol.asyncIterator"))) : "@@asyncIterator";

// Asynchronously call a function and send errors to recovery continuation
function _catch(body, recover) {
	try {
		var result = body();
	} catch(e) {
		return recover(e);
	}
	if (result && result.then) {
		return result.then(void 0, recover);
	}
	return result;
}

// Borrowed from https://github.com/ai/nanoid/blob/3.0.2/non-secure/index.js
// This alphabet uses `A-Za-z0-9_-` symbols. A genetic algorithm helped
// optimize the gzip compression for this alphabet.
var urlAlphabet = 'ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW';
/**
 *
 * @public
 */

var nanoid = function nanoid(size) {
  if (size === void 0) {
    size = 21;
  }

  var id = ''; // A compact alternative for `for (var i = 0; i < step; i++)`.

  var i = size;

  while (i--) {
    // `| 0` is more compact and faster than `Math.floor()`.
    id += urlAlphabet[Math.random() * 64 | 0];
  }

  return id;
};

var commonProperties = ['name', 'message', 'stack', 'code'];

var RejectWithValue = function RejectWithValue(value) {
  this.value = value;
}; // Reworked from https://github.com/sindresorhus/serialize-error


var miniSerializeError = function miniSerializeError(value) {
  if (typeof value === 'object' && value !== null) {
    var simpleError = {};

    for (var _iterator = commonProperties, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var property = _ref;

      if (typeof value[property] === 'string') {
        simpleError[property] = value[property];
      }
    }

    return simpleError;
  }

  return {
    message: String(value)
  };
};
/**
 *
 * @param type
 * @param payloadCreator
 * @param options
 *
 * @public
 */

function createAsyncThunk(type, payloadCreator, options) {
  var fulfilled = createAction(type + '/fulfilled', function (result, requestId, arg) {
    return {
      payload: result,
      meta: {
        arg: arg,
        requestId: requestId
      }
    };
  });
  var pending = createAction(type + '/pending', function (requestId, arg) {
    return {
      payload: undefined,
      meta: {
        arg: arg,
        requestId: requestId
      }
    };
  });
  var rejected = createAction(type + '/rejected', function (error, requestId, arg, payload) {
    var aborted = !!error && error.name === 'AbortError';
    var condition = !!error && error.name === 'ConditionError';
    return {
      payload: payload,
      error: miniSerializeError(error || 'Rejected'),
      meta: {
        arg: arg,
        requestId: requestId,
        aborted: aborted,
        condition: condition
      }
    };
  });
  var AC = typeof AbortController !== 'undefined' ? AbortController :
  /*#__PURE__*/
  function () {
    function _class() {
      this.signal = {
        aborted: false,
        addEventListener: function addEventListener() {},
        dispatchEvent: function dispatchEvent() {
          return false;
        },
        onabort: function onabort() {},
        removeEventListener: function removeEventListener() {}
      };
    }

    var _proto = _class.prototype;

    _proto.abort = function abort() {
    };

    return _class;
  }();

  function actionCreator(arg) {
    return function (dispatch, getState, extra) {
      var requestId = nanoid();
      var abortController = new AC();
      var abortReason;
      var abortedPromise = new Promise(function (_, reject) {
        return abortController.signal.addEventListener('abort', function () {
          return reject({
            name: 'AbortError',
            message: abortReason || 'Aborted'
          });
        });
      });

      function abort(reason) {
        abortReason = reason;
        abortController.abort();
      }

      var promise = function () {
        try {
          var _temp3 = function _temp3(_result) {
            if (_exit2) return _result;
            // We dispatch the result action _after_ the catch, to avoid having any errors
            // here get swallowed by the try/catch block,
            // per https://twitter.com/dan_abramov/status/770914221638942720
            // and https://redux-toolkit.js.org/tutorials/advanced-tutorial#async-error-handling-logic-in-thunks
            var skipDispatch = options && !options.dispatchConditionRejection && rejected.match(finalAction) && finalAction.meta.condition;

            if (!skipDispatch) {
              dispatch(finalAction);
            }

            return finalAction;
          };

          var _exit2 = false;
          var finalAction;

          var _temp4 = _catch(function () {
            if (options && options.condition && options.condition(arg, {
              getState: getState,
              extra: extra
            }) === false) {
              throw {
                name: 'ConditionError',
                message: 'Aborted due to condition callback returning false.'
              };
            }

            dispatch(pending(requestId, arg));
            return Promise.resolve(Promise.race([abortedPromise, Promise.resolve(payloadCreator(arg, {
              dispatch: dispatch,
              getState: getState,
              extra: extra,
              requestId: requestId,
              signal: abortController.signal,
              rejectWithValue: function rejectWithValue(value) {
                return new RejectWithValue(value);
              }
            })).then(function (result) {
              if (result instanceof RejectWithValue) {
                return rejected(null, requestId, arg, result.value);
              }

              return fulfilled(result, requestId, arg);
            })])).then(function (_Promise$race) {
              finalAction = _Promise$race;
            });
          }, function (err) {
            finalAction = rejected(err, requestId, arg);
          });

          return Promise.resolve(_temp4 && _temp4.then ? _temp4.then(_temp3) : _temp3(_temp4));
        } catch (e) {
          return Promise.reject(e);
        }
      }();

      return Object.assign(promise, {
        abort: abort
      });
    };
  }

  return Object.assign(actionCreator, {
    pending: pending,
    rejected: rejected,
    fulfilled: fulfilled
  });
}

// we assume RTK will be used with React Native and other Proxy-less
// environments.  In addition, that's how Immer 4 behaved, and since
// we want to ship this in an RTK minor, we should keep the same behavior.

k();

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
/**
 * Alarms action creators object
 * @see  https://github.com/reduxjs/@reduxjs/toolkit/blob/master/docs/api/createSlice.md
 * @return { {
 *   name : string,
 *   reducer : ReducerFunction,
 *   actions : Object<string, ActionCreator},
 *   selectors : Object<string, Selector>
 *   }}
 */

const alarmsState = createSlice({
  name: 'alarms',
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
        hubAlarms[id] = _objectSpread({}, alarm);
      });
      stateToSet[hubId] = _objectSpread({}, hubAlarms);
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
        stateToSet[hubId][alarm.id] = _objectSpread({}, alarm);
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

const adapter = createEntityAdapter();
const {
  selectById: selectAlarmById,
  selectIds: selectAlarmIds,
  selectEntities: selectAlarmEntities,
  selectAll: selectAllAlarms,
  selectTotal: selectTotalAlarms
} = adapter.getSelectors(state => state.alarms);
alarmsState.selectors = adapter.getSelectors(state => state.alarms);
alarmsState.selectors.getAlarms = createSelector([state => state.alarms], alarms => alarms);
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
      return '%' + ('00' + c.charCodeAt(0).toString(16)).name(-2);
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
function selectCloud(host) {
  cloudHost = host;
}
function getCloudHost() {
  return cloudHost;
}
function getCloudURL() {
  if (cloudHost.indexOf('/site/') === -1) {
    return `${cloudHost}/${CLOUD_API_VERSION}`;
  }

  return `${cloudHost}`;
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
  CMD_DEVICE_VISIBILITY: {
    method: 'PUT',
    url: 'hub/remote/cc/$API_VER/devices',
    type: 'CMD_DEVICE_VISIBLE',
    params: ['id', 'visible']
  },
  CMD_DEVICE_LOCK: {
    method: 'PUT',
    url: 'hub/remote/cc/$API_VER/devices',
    type: 'CMD_DEVICE_LOCK',
    params: ['id', 'locked']
  },
  CMD_DEVICE_HOT_WATER: {
    method: 'PUT',
    url: 'hub/remote/cc/$API_VER/devices/command',
    type: 'CMD_DEVICE_META',
    params: ['id', 'locked']
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
  GET_MODBUS_DEVICE_PAIRINGS: {
    method: 'POST',
    url: 'hub/remote/cc/$API_VER/hub/protocolconfig',
    type: 'GET_MODBUS_PAIRINGS'
  },
  SET_MODBUS_DEVICE_PAIRINGS: {
    method: 'POST',
    url: 'hub/remote/cc/$API_VER/hub/protocolconfig',
    type: 'PAIR_MODBUS'
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
  ZWAVE_GET_NODES: {
    method: 'POST',
    url: 'hub/remote/cc/$API_VER/hub/protocolconfig',
    type: 'ZWAVE_GET_NODES'
  },
  ZWAVE_CHECK_IS_FAILED_NODE: {
    method: 'POST',
    url: 'hub/remote/cc/$API_VER/hub/protocolconfig',
    type: 'ZWAVE_CHECK_FAILED',
    params: ['nodeId'],
    timeout: 30000
  },
  ZWAVE_REMOVE_FAILED_NODE: {
    method: 'POST',
    url: 'hub/remote/cc/$API_VER/hub/protocolconfig',
    type: 'ZWAVE_REMOVE_FAILED',
    params: ['nodeId'],
    timeout: 30000
  },
  ZWAVE_GET_NODE_CONFIGURATION: {
    method: 'POST',
    url: 'hub/remote/cc/$API_VER/hub/protocolconfig',
    type: 'ZWAVE_UI_GET_CONFIGURATION',
    params: ['nodeId', 'parameter'],
    timeout: 30000
  },
  ZWAVE_SET_NODE_CONFIGURATION: {
    method: 'POST',
    url: 'hub/remote/cc/$API_VER/hub/protocolconfig',
    type: 'ZWAVE_UI_SET_CONFIGURATION',
    params: ['nodeId', 'parameter', 'size', 'default', 'value'],
    timeout: 30000
  },
  CMD_LIST_PLANS: {
    method: 'GET',
    url: 'plans'
  },
  CMD_GET_PLAN: {
    method: 'GET',
    url: 'plans'
  },
  CMD_SAVE_PLAN: {
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
 * @see  https://github.com/reduxjs/@reduxjs/toolkit/blob/master/docs/api/createSlice.md
 * @return { {
 *   slice : string,
 *   reducer : ReducerFunction,
 *   actions : Object<string, ActionCreator},
 *   selectors : Object<string, Selector>
 *   }}
 */

const connectionsState = createSlice({
  name: 'connections',
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
const adapter$1 = createEntityAdapter();
const {
  selectById: selectConnectionById,
  selectIds: selectConnectionIds,
  selectEntities: selectConnectionEntities,
  selectAll: selectAllConnections,
  selectTotal: selectTotalConnections
} = adapter$1.getSelectors(state => state.hubs);
connectionsState.selectors = adapter$1.getSelectors(state => state.connections);
connectionsState.selectors.getConnections = createSelector([state => state.connections], connections => connections);
const {
  actions: actions$1,
  reducer: reducer$1
} = connectionsState;

function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$2(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$2(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
/**
 * Devices action creators object
 * @see  https://github.com/reduxjs/@reduxjs/toolkit/blob/master/docs/api/createSlice.md
 * @return { {
 *   name : string,
 *   reducer : ReducerFunction,
 *   actions : Object<string, ActionCreator},
 *   selectors : Object<string, Selector>
 *   }}
 */

const pairingsState = createSlice({
  name: 'pairings',
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
        hubPairingDevices[id] = _objectSpread$1({}, device);
      });
      stateToSet[hubId] = _objectSpread$1({}, hubPairingDevices);
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
        stateToSet[hubId][device.id] = _objectSpread$1({}, device);
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
const adapter$2 = createEntityAdapter();
const {
  selectById: selectPairingById,
  selectIds: selectPairingIds,
  selectEntities: selectPairingEntities,
  selectAll: selectAllPairings,
  selectTotal: selectTotalPairings
} = adapter$2.getSelectors(state => state.hubs);
pairingsState.selectors = adapter$2.getSelectors(state => state.pairings);
pairingsState.selectors.getPairings = createSelector([state => state.pairings], pairings => pairings);
const {
  actions: actions$2,
  reducer: reducer$2
} = pairingsState;

function ownKeys$3(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$3(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$3(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
/**
 * Devices action creators object
 * @see  https://github.com/reduxjs/@reduxjs/toolkit/blob/master/docs/api/createSlice.md
 * @return { {
 *   name : string,
 *   reducer : ReducerFunction,
 *   actions : Object<string, ActionCreator},
 *   selectors : Object<string, Selector>
 *   }}
 */

const devicesState = createSlice({
  name: 'devices',
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
        hubDevices[id] = _objectSpread$2({}, device);
      });
      stateToSet[hubId] = _objectSpread$2({}, hubDevices);
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
        stateToSet[hubId][device.id] = _objectSpread$2({}, device);
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
const adapter$3 = createEntityAdapter();
const {
  selectById: selectDeviceById,
  selectIds: selectDeviceIds,
  selectEntities: selectDeviceEntities,
  selectAll: selectAllDevicess,
  selectTotal: selectTotalDevices
} = adapter$3.getSelectors(state => state.devices);
devicesState.selectors = adapter$3.getSelectors(state => state.devices);
devicesState.selectors.getDevices = createSelector([state => state.devices], devices => devices);
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

function ownKeys$4(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$3(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$4(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$4(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
/**
 * Hubs action creators object
 * @see  https://github.com/reduxjs/@reduxjs/toolkit/blob/master/docs/api/createSlice.md
 * @return { {
 *   name : string,
 *   reducer : ReducerFunction,
 *   actions : Object<string, ActionCreator},
 *   selectors : Object<string, Selector>
 *   }}
 */

const hubsState = createSlice({
  name: 'hubs',
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
        stateToSet[id] = _objectSpread$3({}, state[id], {}, hub);
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
});
const adapter$4 = createEntityAdapter();
const {
  selectById: selectHubById,
  selectIds: selectHubIds,
  selectEntities: selectHubEntities,
  selectAll: selectAllHubs,
  selectTotal: selectTotalHubs
} = adapter$4.getSelectors(state => state.hubs);
hubsState.selectors = adapter$4.getSelectors(state => state.hubs);
hubsState.selectors.getHubs = createSelector([state => state.hubs], hubs => hubs); // console.log("hubsState.selectors", hubsState.selectors );
// console.log('hubsState ', hubsState)

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

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

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
var isArray = Array.isArray;

var isArray_1 = isArray;

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
 * @see  https://github.com/reduxjs/@reduxjs/toolkit/blob/master/docs/api/createSlice.md
 * @return { {
 *   slice : string,
 *   reducer : ReducerFunction,
 *   actions : Object<string, ActionCreator},
 *   selectors : Object<string, Selector>
 *   }}
 */

const userState = createSlice({
  name: 'user',
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

const adapter$5 = createEntityAdapter();
userState.selectors = adapter$5.getSelectors(state => state.user);
userState.selectors.getUser = createSelector([state => state.user], user => user);
const {
  actions: actions$5,
  reducer: reducer$5
} = userState;

function ownKeys$5(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$4(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$5(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$5(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
/**
 * Rooms action creators object
 * @see  https://github.com/reduxjs/@reduxjs/toolkit/blob/master/docs/api/createSlice.md
 * @return { {
 *   name : string,
 *   reducer : ReducerFunction,
 *   actions : Object<string, ActionCreator},
 *   selectors : Object<string, Selector>
 *   }}
 */

const roomsState = createSlice({
  name: 'rooms',
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
        hubRooms[id] = _objectSpread$4({}, room);
      });
      stateToSet[hubId] = _objectSpread$4({}, hubRooms);
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
        stateToSet[hubId][room.id] = _objectSpread$4({}, room);
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

const adapter$6 = createEntityAdapter();
const {
  selectById: selectRoomById,
  selectIds: selectRoomIds,
  selectEntities: selectRoomEntities,
  selectAll: selectAllRooms,
  selectTotal: selectTotalRooms
} = adapter$6.getSelectors(state => state.rooms);
roomsState.selectors = adapter$6.getSelectors(state => state.rooms);
roomsState.selectors.getRooms = createSelector([state => state.rooms], rooms => rooms);
const {
  actions: actions$6,
  reducer: reducer$6
} = roomsState;

//      
// import { GET_PLANS, SUBS_PLANS, INSERT_PLAN, UPDATE_PLAN, REMOVE_PLAN, qqlClient, normalize, isAuth } from '../qql.js'

/*
** addOne: accepts a single entity, and adds it.
** addMany: accepts an array of entities or an object in the shape of Record<EntityId, T>, and adds them.
** setAll: accepts an array of entities or an object in the shape of Record<EntityId, T>,
** and replaces the existing entity contents with the values in the array.
** removeOne: accepts a single entity ID value, and removes the entity with that ID if it exists.
** removeMany: accepts an array of entity ID values, and removes each entity with those IDs if they exist.
** updateOne: accepts an "update object" containing an entity ID and an object containing one or
** more new field values to update inside a changes field, and performs a shallow update on the corresponding entity.
** updateMany: accepts an array of update objects, and performs shallow updates on all corresponding entities.
** upsertOne: accepts a single entity. If an entity with that ID exists, it will perform a shallow update
** and the specified fields will be merged into the existing entity, with any matching fields overwriting the existing values.
** If the entity does not exist, it will be added.
** upsertMany: accepts an array of entities or an object in the shape of Record<EntityId, T> that will be shallowly upserted.
*/

const plansAdapter = createEntityAdapter({
  // Assume IDs are stored in a field uid
  selectId: plan => {
    console.log('SDK plansAdapter: ', plan);
    return plan.uid;
  },
  // Keep the "all IDs" array sorted based on plan names
  sortComparer: (a, b) => b.changed_at.localeCompare(a.changed_at)
}); // Fetch all plans

async function fetchPlans() {
  return new Promise((resolve, reject) => {
    reject(new Error('fetchPlans TBD'));
    /*  Was just test implementation of qql
    qqlClient.query({
      query: GET_PLANS
    })
    .then((result) => {
      const queryResults = normalize(result);
      console.debug('SDK fetchPlans ok', queryResults);
      resolve(queryResults.plans);
    }).catch((error) => {
      debugger;
      console.error('SDK fetchPlans error:', error);
      reject(error);
    });
    */
  });
}

const reactFetchPlans = createAsyncThunk('plans/fetchPlans', async (params, ThunkAPI) => {
  // if (isAuth(ThunkAPI.getState())) {
  console.debug('reactFetchPlans state', ThunkAPI.getState());
  return fetchPlans(); // }
}, {
  condition: (params, {
    getState,
    extra
  }) => {
    const state = getState();
    console.debug('reactFetchPlans condition state: ', state);
    console.debug('reactFetchPlans condition extra: ', extra);
  }
}); // Subscribe

const reactSubscribePlans = createAsyncThunk('plans/subscribePlans', async (params, ThunkAPI) => new Promise((resolve, reject) => {
  console.debug('reactSubscribePlans state: ', ThunkAPI.getState());
  console.debug('reactSubscribePlans params: ', params);
  reject(new Error('subscribePlans TBD'));
  /*  Was just test implementation of qql
    if (isAuth(ThunkAPI.getState())) {
      const subsHandle = qqlClient.subscribe({
        query: SUBS_PLANS,
        //variables: { },
      }).subscribe({
        next(data) {
          try {
            if (data && data.data && data.data.t_plan &&data.data.t_plan.length > 0) {
              const results = normalize(data);
              // plansAdapter.setAll(ThunkAPI.getState(), results.plans)
              ThunkAPI.dispatch(plansState.actions.setPlansState(results.plans));
            } else {
              ThunkAPI.dispatch(plansState.actions.setPlansState({plans:{}}));
            }
            resolve()
          } catch(e) {
            reject(e)
            debugger
            console.error('reactSubscribePlans exception', e);
          }
        },
        error(err) {
          reject(err)
          debugger
          console.error('reactSubscribePlans err', err);
        }
      })
    } else {
      reject()
    }
  })
  */
})); // Insert plan

async function insertPlan(name) {
  return new Promise((resolve, reject) => {
    console.debug('SDK insertPlan name', name);
    reject(new Error('insertPlans TBD'));
    /*  Was just test implementation of qql
    qqlClient.mutate({
      variables: {
        object: {
          name: name,
          documents: {
            data: [
              {
                name: "?"
              }
            ]
          }
        }
      },
      mutation: INSERT_PLAN
    })
    .then((result) => {
      const queryResults = normalize(result);
      console.debug('SDK insertPlan ok', queryResults);
      resolve(queryResults.plans);
    }).catch((error) => {
      debugger;
      console.error('SDK insertPlan error:', error);
      reject(error);
    });
    */
  });
}

const reactInsertPlan = createAsyncThunk('plans/insertPlan', async (params, ThunkAPI) => {
  // if (isAuth(ThunkAPI.getState())) {
  console.debug('reactInsertPlan state: ', ThunkAPI.getState());
  const {
    name
  } = params;
  return insertPlan(name); // }
}); // Update Plan

async function updatePlan(uid, changes) {
  return new Promise((resolve, reject) => {
    reject(new Error(`updatePlan uid: ${uid} TBD, changes: ${changes}`));
    /*  Was just test implementation of qql
    qqlClient.mutate({
      variables: {
        uid: uid,
        changes: changes
      },
      mutation: UPDATE_PLAN
    })
    .then((result) => {
      const queryResults = normalize(result);
      console.debug('SDK updatePlan ok', queryResults);
      resolve(queryResults.plans);
    }).catch((error) => {
      debugger;
      console.error('SDK updatePlan error:', error);
      reject(error);
    });
    */
  });
}

const reactUpdatePlan = createAsyncThunk('plans/updatePlan', async (params, ThunkAPI) => {
  // if (isAuth(ThunkAPI.getState())) {
  console.debug('reactUpdatePlan state: ', ThunkAPI.getState());
  const {
    uid,
    changes
  } = params;
  return updatePlan(uid, changes); // }
}); // Remove Plan

async function removePlan(uid) {
  return new Promise((resolve, reject) => {
    reject(new Error(`removePlan  uid: ${uid} TBD`));
    /*  Was just test implementation of qql
    qqlClient.mutate({
      variables: {
        "uid": uid,
      },
      mutation: REMOVE_PLAN
    })
    .then((result) => {
      console.debug('SDK removePlan ok', result);
      resolve(result);
    }).catch((error) => {
      debugger;
      console.error('SDK removePlan error:', error);
      reject(error);
    });
    */
  });
}

const reactRemovePlan = createAsyncThunk('plans/removePlan', async (params, ThunkAPI) => {
  // if (isAuth(ThunkAPI.getState())) {
  console.debug('reactRemovePlan state: ', ThunkAPI.getState());
  const {
    uid
  } = params;
  return removePlan(uid); // }
}); // Slice

const plansState = createSlice({
  name: 'plans',
  initialState: plansAdapter.getInitialState(),
  reducers: {
    setPlansState(state, action) {
      // const stateToSet = state;
      // const oldState = stateToSet.plansState;
      const newState = action.payload;
      plansAdapter.setAll(state, newState); // console.log(`SDK setPlansState: PLANS state ${oldState} -> ${newState}`);
      // console.info('plans.js setPlansState: newState', newState)

      /*
      const normalized = normalize(newState, plansEntity);
      console.info('plans.js setPlansState: normalized plans', normalized)//.entities.plans)
       Object.entries(normalized.entities.plans).forEach(([id, plan]) => {
         console.info('plans.js document from plan:', JSON.stringify(plan.document));
         const locations = getLocationsFromDocument(plan.document)
        console.info('plans.js locations tree:', JSON.stringify(locations));
        plan.locations = locations;
         const document = getDocumentFromLocations(plan.locations)
        console.info('plans.js document from tree:', JSON.stringify(document))
      });
      plansAdapter.setAll(state, normalized.entities.plans)
      */
      // const normalized = normalize(newState, plansEntity);
      // console.info('plans.js setPlansState: normalized plans', normalized)

      /*
      Object.entries(normalized.entities.plans).forEach(([id, plan]) => {
        //const documents = normalize(plan, sEntity);
        //const normalizedDocuments = normalize(documents, documentsEntity);
        //Object.entries(normalizedDocuments.entities.documents).forEach(([id, docuement]) => {
          debugger
        //});
       });
      plansAdapter.setAll(state, normalized.entities.plans)
      */
    } // listPlans: listPlans,


  },
  extraReducers: {
    // Add reducers for additional action types here, and handle loading state as needed
    [reactFetchPlans.fulfilled]: (state, action) => {
      plansAdapter.upsertMany(state, action.payload);
    },
    [reactFetchPlans.rejected]: (state, action) => {
      console.error('SDK reactFetchPlans rejected state: ', state);
      console.error('SDK reactFetchPlans rejected action: ', action);
    },
    [reactInsertPlan.fulfilled]: (state, action) => {
      plansAdapter.updateOne(state, action.payload);
    },
    [reactInsertPlan.rejected]: (state, action) => {
      console.error('SDK reactInsertPlan rejected state: ', state);
      console.error('SDK reactInsertPlan rejected action: ', action);
    },
    [reactUpdatePlan.fulfilled]: (state, action) => {
      plansAdapter.updateOne(state, action.payload);
    },
    [reactUpdatePlan.rejected]: (state, action) => {
      console.error('SDK reactFetchPlans rejected state: ', state);
      console.error('SDK reactFetchPlans rejected action: ', action);
    },
    [reactRemovePlan.fulfilled]: (state, action) => {
      plansAdapter.updateOne(state, action.payload);
    },
    [reactRemovePlan.rejected]: (state, action) => {
      console.error('SDK reactRemovePlan rejected state: ', state);
      console.error('SDK reactRemovePlan rejected action: ', action);
    }
  }
});
plansState.selectors = plansAdapter.getSelectors(state => state.plans);
plansState.selectors.getPlans = plansState.selectors.selectEntities;
const {
  reducer: reducer$7
} = plansState; // const { actions, reducer } = plansState;

/*
export const {
  updateHubs, selectHub, unSelectHub, setHubConnectionState,
} = actions;
*/

const {
  selectById: reactSelectPlanById,
  selectIds: reactSelectPlanIds,
  selectEntities: reactSelectPlanEntities,
  selectAll: reactSelectAllPlans,
  selectTotal: reactSelectTotalPlans
} = plansAdapter.getSelectors(state => state.plans);

//      
/*
import {
  GET_PLAN_DOCUMENTS,
  SUBS_PLAN_DOCUMENTS,
  INSERT_PLAN_DOCUMENT,
  UPDATE_PLAN_DOCUMENT,
  REMOVE_PLAN_DOCUMENT,
  qqlClient,
  normalize,
  isAuth
  } from '../qql.js'
 */

const planDocumentsAdapter = createEntityAdapter({
  // Assume IDs are stored in a field uid
  selectId: document => document.uid,
  // Keep the "all IDs" array sorted based on plans
  sortComparer: (a, b) => a.plan_id.localeCompare(b.plan_id)
}); // Fetch

async function fetchPlanDocuments(planId) {
  return new Promise((resolve, reject) => {
    reject(new Error(`fetchPlanDocuments planId: ${planId} TBD`));
    /*  Was just test implementation of qql
    qqlClient.query({
      variables: {
        "plan_id": planId
      },
      query: GET_PLAN_DOCUMENTS
    })
    .then((result) => {
      const queryResults = normalize(result);
      console.debug('SDK fetchPlanDocuments ok', queryResults);
      resolve(queryResults.documents);
    }).catch((error) => {
      debugger;
      console.error('SDK fetchPlanDocuments error:', error);
      reject(error);
    });
    */
  });
}

const reactFetchPlanDocuments = createAsyncThunk('plans/fetchPlanDocuments', async (planId, ThunkAPI) => {
  // if (isAuth(ThunkAPI.getState())) {
  console.debug('fetchPlanDocuments state: ', ThunkAPI.getState());
  return fetchPlanDocuments(planId);
}); // Subscribe

const reactSubscribePlanDocuments = createAsyncThunk('plans/subscribePlanDocuments', async (params, ThunkAPI) => new Promise((resolve, reject) => {
  console.debug('reactSubscribePlanDocuments state: ', ThunkAPI.getState());
  reject(new Error(`reactSubscribePlanDocuments params: ${params} TBD`));
  /*  Was just test implementation of qql
    if (isAuth(ThunkAPI.getState())) {
      const {planId} = params;
      const subsHandle = qqlClient.subscribe({
        query: SUBS_PLAN_DOCUMENTS,
        variables: {"plan_id": planId },
      }).subscribe({
        next(data) {
          try {
            if (data && data.data && data.data.t_plan_document && data.data.t_plan_document.length > 0) {
              const results = normalize(data);
              ThunkAPI.dispatch(planDocumentsState.actions.setPlanDocumentsState(results.documents));
            } else {
              ThunkAPI.dispatch(planDocumentsState.actions.setPlanDocumentsState({documents:{}}));
            }
            resolve()
          } catch(e) {
            reject(e)
            debugger
            console.error('reactSubscribePlanDocuments exception', e);
          }
        },
        error(err) {
          reject(err)
          debugger
          console.error('reactSubscribePlanDocuments err', err);
        }
      })
    } else {
      reject()
    }
    */
})); // Insert document

async function insertPlanDocument(planId, changes) {
  return new Promise((resolve, reject) => {
    reject(new Error(`insertPlanDocument planId: ${planId} TBD, changes: ${changes}`));
    /*  Was just test implementation of qql
    qqlClient.mutate({
      variables: {
        object: {
          plan_id: planId,
          name: changes.name,
          nodes: {
            data: [
              {
                data: {
                  rooms: changes.rooms || [],
                  devices: changes.devices || [],
                  rules: changes.rules || [],
                  scenes: changes.scenes || [],
                  type: 'root',
                  __typename: 'node',
                  name: '?'
                }
              }
            ]
          }
        }
      },
      mutation: INSERT_PLAN_DOCUMENT
    })
    .then((result) => {
      const queryResults = normalize(result);
      console.debug('SDK insertPlanDocument ok', queryResults);
      resolve(queryResults.documents);
    }).catch((error) => {
      debugger;
      console.error('SDK insertPlanDocument error:', error);
      reject(error);
    });
    */
  });
}
/*
{
  "object": {
    "plan_id": "79089ab2-4e50-40b1-9b8a-a6cacab93373",
    "name": "uusi",
    "nodes": {
      "data": [
        {
          "data": {
            "rooms": [],
            "devices": [],
            "rules": [],
            "scenes": [],
            "type": "root",
            "name": "root"
          }
        }
      ]
    }
  }
}
*/


const reactInsertPlanDocument = createAsyncThunk('plans/insertPlanDocument', async (params, ThunkAPI) => {
  // if (isAuth(ThunkAPI.getState())) {
  console.debug('reactInsertPlanDocument state: ', ThunkAPI.getState());
  const {
    planId,
    changes
  } = params;
  return insertPlanDocument(planId, changes); // }
}); // Update Document

async function updatePlanDocument(uid, changes) {
  return new Promise((resolve, reject) => {
    reject(new Error(`updatePlanDocument uid: ${uid} TBD, changes: ${changes}`));
    /*  Was just test implementation of qql
    qqlClient.mutate({
      variables: {
        uid: uid,
        changes: changes
      },
      mutation: UPDATE_PLAN_DOCUMENT
    })
    .then((result) => {
      const queryResults = normalize(result);
      console.debug('SDK updatePlanDocument ok', queryResults);
      resolve(queryResults.documents);
    }).catch((error) => {
      debugger;
      console.error('SDK updatePlanDocument error:', error);
      reject(error);
    });
    */
  });
}

const reactUpdatePlanDocument = createAsyncThunk('plans/updatePlanDocument', async (params, ThunkAPI) => {
  // if (isAuth(ThunkAPI.getState())) {
  console.debug('reactUpdatePlanDocument state: ', ThunkAPI.getState());
  const {
    uid,
    changes
  } = params;
  return updatePlanDocument(uid, changes); // }
}); // Remove Plan

async function removePlanDocument(uid) {
  return new Promise((resolve, reject) => {
    reject(new Error(`removePlanDocument uid: ${uid} TBD`));
    /*  Was just test implementation of qql
    qqlClient.mutate({
      variables: {
        "uid": uid,
      },
      mutation: REMOVE_PLAN_DOCUMENT
    })
    .then((result) => {
      console.debug('SDK removePlanDocument ok', result);
      resolve(result);
    }).catch((error) => {
      debugger;
      console.error('SDK removePlanDocument error:', error);
      reject(error);
    });
    */
  });
}

const reactRemovePlanDocument = createAsyncThunk('plans/removePlanDocument', async (params, ThunkAPI) => {
  // if (isAuth(ThunkAPI.getState())) {
  console.debug('removePlanDocument state: ', ThunkAPI.getState());
  const {
    uid
  } = params;
  return removePlanDocument(uid); // }
});
const planDocumentsState = createSlice({
  name: 'documents',
  initialState: planDocumentsAdapter.getInitialState(),
  reducers: {
    setPlanDocumentsState(state, action) {
      const stateToSet = state;
      const newState = action.payload;
      planDocumentsAdapter.setAll(stateToSet, newState);
    }

  },
  extraReducers: {
    // Add reducers for additional action types here, and handle loading state as needed
    [reactFetchPlanDocuments.fulfilled]: (state, action) => {
      planDocumentsAdapter.upsertMany(state, action.payload);
    },
    [reactFetchPlanDocuments.rejected]: (state, action) => {
      console.error('SDK reactFetchPlanDocuments rejected state: ', state);
      console.error('SDK reactFetchPlanDocuments rejected action: ', action);
    },
    [reactInsertPlanDocument.fulfilled]: (state, action) => {
      planDocumentsAdapter.updateOne(state, action.payload);
    },
    [reactInsertPlanDocument.rejected]: (state, action) => {
      console.error('SDK reactInsertPlanDocument rejected state: ', state);
      console.error('SDK reactInsertPlanDocument rejected action: ', action);
    },
    [reactUpdatePlanDocument.fulfilled]: (state, action) => {
      planDocumentsAdapter.updateOne(state, action.payload);
    },
    [reactUpdatePlanDocument.rejected]: (state, action) => {
      console.error('SDK reactUpdatePlanDocument rejected state: ', state);
      console.error('SDK reactUpdatePlanDocument rejected action: ', action);
    },
    [reactRemovePlanDocument.fulfilled]: (state, action) => {
      planDocumentsAdapter.updateOne(state, action.payload);
    },
    [reactRemovePlanDocument.rejected]: (state, action) => {
      console.error('SDK reactRemovePlanDocument rejected state: ', state);
      console.error('SDK reactRemovePlanDocument rejected action: ', action);
    }
  }
});
planDocumentsState.selectors = planDocumentsAdapter.getSelectors(state => state.documents);
planDocumentsState.selectors.selectPlanDocuments = createSelector([state => state.documents, (state, planId) => planId], (documents, planId) => {
  const ids = documents.ids.filter(id => documents.entities[id].plan_id === planId);
  const entities = [];
  ids.forEach(id => {
    entities.push(documents.entities[id]);
  });
  return entities;
});
const {
  selectById: reactSelectDocumentById,
  selectIds: reactSelectDocumentIds,
  selectEntities: reactSelectDocumentEntities,
  selectAll: reactSelectAllDocuments,
  selectTotal: reactSelectTotalDocuments
} = planDocumentsAdapter.getSelectors(state => state.documents);
const reactSelectPlanDocuments = planDocumentsState.selectors.selectPlanDocuments; // const { actions, reducer } = planDocumentsState;

const {
  reducer: reducer$8
} = planDocumentsState;

//      
/* import {
  GET_PLAN_DOCUMENT_NODES,
  SUBS_PLAN_DOCUMENT_NODES,
  INSERT_PLAN_DOCUMENT_NODE,
  UPDATE_PLAN_DOCUMENT_NODE,
  REMOVE_PLAN_DOCUMENT_NODE,
  qqlClient,
  normalize,
  isAuth
} from '../qql.js'
*/

const planDocumentNodesAdapter = createEntityAdapter({
  // Assume IDs are stored in a field uid
  selectId: node => node.uid,
  // Keep the "all IDs" array sorted based on document
  sortComparer: (a, b) => a.document_id.localeCompare(b.document_id)
}); // Fetch

async function fetchPlanDocumentNodes(documentId) {
  return new Promise((resolve, reject) => {
    reject(new Error(`fetchPlanDocuments documentId: ${documentId} TBD`));
    /*  Was just test implementation of qql
    qqlClient.query({
      variables: {
        "document_id": documentId
      },
      query: GET_PLAN_DOCUMENT_NODES
    })
    .then((result) => {
      const queryResults = normalize(result);
      console.debug('SDK fetchPlanDocumentNodes ok', queryResults);
      resolve(queryResults.nodes);
    }).catch((error) => {
      debugger;
      console.error('SDK fetchPlanDocumentNodes error:', error);
      reject(error);
    });
    */
  });
}

const reactFetchPlanDocumentNodes = createAsyncThunk('plans/fetchPlanDocumentNodes', async (documentId, ThunkAPI) => {
  // if (isAuth(ThunkAPI.getState())) {
  console.debug('fetchPlanDocuments state: ', ThunkAPI.getState());
  return fetchPlanDocumentNodes(documentId);
}); // Subscribe

const reactSubscribePlanDocumentNodes = createAsyncThunk('plans/subscribePlanDocumentNodes', async (params, ThunkAPI) => new Promise((resolve, reject) => {
  console.debug('reactSubscribePlanDocumentNodes state: ', ThunkAPI.getState());
  reject(new Error('reactSubscribePlanDocumentNodes TBD'));
  /*  Was just test implementation of qql
    if (isAuth(ThunkAPI.getState())) {
      const {documentId} = params;
      const subsHandle = qqlClient.subscribe({
        query: SUBS_PLAN_DOCUMENT_NODES,
        variables: {"document_id": documentId },
      }).subscribe({
        next(data) {
          try {
            if (data && data.data && data.data.t_plan_document_node && data.data.t_plan_document_node.length > 0) {
              const results = normalize(data);
              ThunkAPI.dispatch(planDocumentNodesState.actions.setPlanDocumentNodesState(results.nodes));
            } else {
              ThunkAPI.dispatch(planDocumentNodesState.actions.setPlanDocumentNodesState({nodes:{}}));
            }
            resolve()
          } catch(e) {
            reject(e)
            debugger
            console.error('reactSubscribePlanDocumentNodes exception', e);
          }
        },
        error(err) {
          reject(err)
          debugger
          console.error('reactSubscribePlanDocumentNodes err', err);
        }
      })
    } else {
      reject()
    }
  }
  */
}));
/*
alinode
{
  "object": {
    "document_id": "d39e6ddc-6220-4c20-8c7d-9d01e65192de",
    "parent_id": "0d62e0bc-1c29-4cb9-bc79-a39a9b59768f",
    "data": {
      "type": "TEST0.1"
    }
  }
}

päätason
{
  "object": {
    "document_id": "d39e6ddc-6220-4c20-8c7d-9d01e65192de",
    "parent_id": null,
    "data": {
      "type": "TEST2"
    }
  }
}
 */
// Insert

async function insertPlanDocumentNode(documentId, parentId, changes) {
  const changesToBeMade = changes;

  if (changes && changes.type) {
    // eslint-disable-next-line
    changesToBeMade.__typename = changes.type;
  }

  return new Promise((resolve, reject) => {
    reject(new Error(`insertPlanDocumentNode docId: ${documentId}, parentId: ${parentId} TBD, changes: ${changesToBeMade}`));
    /*  Was just test implementation of qql
    qqlClient.mutate({
      variables: {
        object: {
          document_id: documentId,
          parent_id: parentId,
          data: changesToBeMade
        }
      },
      mutation: INSERT_PLAN_DOCUMENT_NODE
    })
    .then((result) => {
      const queryResults = normalize(result);
      console.debug('SDK insertPlanDocumentNode ok', queryResults);
      resolve(queryResults.nodes);
    }).catch((error) => {
      debugger;
      console.error('SDK insertPlanDocumentNode error:', error);
      reject(error);
    });
    */
  });
}

const reactInsertPlanDocumentNode = createAsyncThunk('plans/insertPlanDocumentNode', async (params, ThunkAPI) => {
  // if (isAuth(ThunkAPI.getState())) {
  console.debug('reactInsertPlanDocumentNode state:', ThunkAPI.getState());
  const {
    documentId,
    parentId,
    changes
  } = params;
  return insertPlanDocumentNode(documentId, parentId, changes); // }
});
/* {
  "uid": "e1727bae-cd29-4a77-8234-a6528fda48fc",
  "changes": {
    "data": {
      "name": "HUB 2.0"
    }
  }
} */
// Update

async function updatePlanDocumentNode(uid, changes) {
  return new Promise((resolve, reject) => {
    reject(new Error(`updatePlanDocumentNode uid: ${uid} TBD, changes: ${changes}`));
    /*  Was just test implementation of qql
    qqlClient.mutate({
      variables: {
        uid: uid,
        changes: changes
      },
      mutation: UPDATE_PLAN_DOCUMENT_NODE
    })
    .then((result) => {
      debugger
      const queryResults = normalize(result);
      console.debug('SDK updatePlanDocumentNode ok', queryResults);
      resolve(queryResults.nodes);
    }).catch((error) => {
      debugger;
      console.error('SDK updatePlanDocumentNode error:', error);
      reject(error);
    });
    */
  });
}

const reactUpdatePlanDocumentNode = createAsyncThunk('plans/updatePlanDocumentNode', async (params, ThunkAPI) => {
  // if (isAuth(ThunkAPI.getState())) {
  console.debug('reactUpdatePlanDocumentNode state: ', ThunkAPI.getState());
  const {
    uid,
    changes
  } = params;
  return updatePlanDocumentNode(uid, changes); // }
}); // Remove Plan

async function removePlanDocumentNode(uid) {
  return new Promise((resolve, reject) => {
    reject(new Error(`removePlanDocumentNode uid: ${uid} TBD`));
    /*  Was just test implementation of qql
    qqlClient.mutate({
      variables: {
        "uid": uid,
      },
      mutation: REMOVE_PLAN_DOCUMENT_NODE
    })
    .then((result) => {
      debugger
      console.debug('SDK removePlanDocumentNode ok', result);
      resolve(result);
    }).catch((error) => {
      debugger;
      console.error('SDK removePlanDocumentNode error:', error);
      reject(error);
    });
    */
  });
}

const reactRemovePlanDocumentNode = createAsyncThunk('plans/removePlanDocumentNode', async (params, ThunkAPI) => {
  // if (isAuth(ThunkAPI.getState())) {
  console.debug('reactRemovePlanDocumentNode state: ', ThunkAPI.getState());
  const {
    uid
  } = params;
  return removePlanDocumentNode(uid); // }
});
const planDocumentNodesState = createSlice({
  name: 'nodes',
  initialState: planDocumentNodesAdapter.getInitialState(),
  reducers: {
    setPlanDocumentNodesState(state, action) {
      const stateToSet = state;
      const newState = action.payload;
      planDocumentNodesAdapter.setAll(stateToSet, newState);
    }

  },
  extraReducers: {
    // Add reducers for additional action types here, and handle loading state as needed
    [reactFetchPlanDocumentNodes.fulfilled]: (state, action) => {
      planDocumentNodesAdapter.upsertMany(state, action.payload);
    },
    [reactFetchPlanDocumentNodes.rejected]: (state, action) => {
      console.error('SDK reactFetchPlanDocumentNodes rejected state: ', state);
      console.error('SDK reactFetchPlanDocumentNodes rejected action: ', action);
    },
    [reactInsertPlanDocumentNode.fulfilled]: (state, action) => {
      planDocumentNodesAdapter.updateOne(state, action.payload);
    },
    [reactInsertPlanDocumentNode.rejected]: (state, action) => {
      console.error('SDK reactInsertPlanDocumentNode rejected state: ', state);
      console.error('SDK reactInsertPlanDocumentNode rejected action: ', action);
    },
    [reactUpdatePlanDocumentNode.fulfilled]: (state, action) => {
      planDocumentNodesAdapter.updateOne(state, action.payload);
    },
    [reactUpdatePlanDocumentNode.rejected]: (state, action) => {
      console.error('SDK reactUpdatePlanDocumentNode rejected state: ', state);
      console.error('SDK reactUpdatePlanDocumentNode rejected action: ', action);
    },
    [reactRemovePlanDocumentNode.fulfilled]: (state, action) => {
      planDocumentNodesAdapter.updateOne(state, action.payload);
    },
    [reactRemovePlanDocumentNode.rejected]: (state, action) => {
      console.error('SDK reactRemovePlanDocumentNode rejected state: ', state);
      console.error('SDK reactRemovePlanDocumentNode rejected action: ', action);
    }
  }
});
planDocumentNodesState.selectors = planDocumentNodesAdapter.getSelectors(state => state.nodes);
planDocumentNodesState.selectors.selectPlanDocumentNodes = createSelector([state => state.nodes, (state, documentId) => documentId], (nodes, documentId) => {
  const ids = nodes.ids.filter(id => nodes.entities[id].document_id === documentId);
  const entities = [];
  ids.forEach(id => {
    entities.push(nodes.entities[id]);
  });
  return entities;
});
const {
  selectById: reactSelectDocumentNodeById,
  selectIds: reactSelectDocumentNodeIds,
  selectEntities: reactSelectDocumentNodeEntities,
  selectAll: reactSelectAllDocumentNodes,
  selectTotal: reactSelectTotalDocumentNodes
} = planDocumentNodesAdapter.getSelectors(state => state.nodes);
const reactSelectPlanDocumentNodes = planDocumentNodesState.selectors.selectPlanDocumentNodes; // const { actions, reducer } = planDocumentNodesState;

const {
  reducer: reducer$9
} = planDocumentNodesState;

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
  plans: reducer$7,
  documents: reducer$8,
  nodes: reducer$9
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

console.log('Store rootReducer: ', rootReducer);
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

    if (tokenParts[0]) {
      tokenParts[0] = tokenParts[0].replace('Bearer ', '');
      header = JSON.parse(urlBase64Decode(tokenParts[0]));
    }

    if (tokenParts[1]) {
      payload = JSON.parse(urlBase64Decode(tokenParts[1]));
    }
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
axiosRetry(axios, {
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
  let sendAuthKey = authKey; // let sendHubId = hubId;

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

        if (!hubs[hubId] || !hubs[hubId].hubKey && getCloudURL().indexOf('https://one.cozify.fi') === -1) {
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

      if (hubId && sendUrl.indexOf('https://one.cozify.fi') !== -1 && sendUrl.indexOf('hub/remote') !== -1) {
        const index = sendUrl.indexOf('hub/remote');
        const lastPart = sendUrl.substring(index + 10);
        const firstPart = sendUrl.substring(0, index);
        sendUrl = firstPart.concat('hub/').concat(hubId).concat('/remote').concat(lastPart);
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
      /* else {
        sendHubId = false;
      } */

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
      'Accept-Language': null,
      'X-Hub-Key': sendHubKey || null
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
  /*
  if (sendHubKey){
    reqConf.headers['X-Hub-Key'] = sendHubKey;
  }
  */

  /* VLi: not needed now
  if (sendHubId){
    reqConf.headers['X-Hub-Id'] = sendHubId;
  }
  */


  Object.assign(reqConf, sendConfig);
  return new Promise((resolve, reject) => {
    if (command || sendUrl) {
      axios.interceptors.response.use(response => {
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

      testSSLCertificate(!!(remoteConnection && sendUrl && sendUrl.indexOf('https://one.cozify.fi') === -1)).then(status => {
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


          axios(reqConf).then(response => {
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

function ownKeys$6(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$5(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$6(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$6(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
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
    const deviceProps = _objectSpread$5({}, device.status); // TODO: Start of remove when hub 'device.status.state.state'-bug fixed

    /*
    let deviceState = { ...device.status.state };
    if (device.status.state.state){
      deviceState = { ...device.status.state.state}
      delete device.status.state.state
    }
    deviceProps.status.state ={ ...deviceState}
    */
    // TODO: end of remove when hub bug fixed


    const deviceToHandle = device;
    delete deviceToHandle.status;

    const deviceToPair = _objectSpread$5({}, deviceToHandle, {}, deviceProps);

    statePairingDevices.devices[device.id] = deviceToPair;
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

    if (!hub || !hubKey && getCloudURL().indexOf('https://one.cozify.fi') === -1) {
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

    if (!hub || !hubKey && getCloudURL().indexOf('https://one.cozify.fi') === -1) {
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
      if (HUBKeys[hubKey]) {
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
      } else {
        hubs[hubKey] = {
          id: hubKey,
          connectionState: HUB_CONNECTION_STATES.UNCONNECTED
        };
      }
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

  hubsMap[foundHub.id].name = foundHub.name;
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
      console.log(`lockAndBackup ${hubId} error `, error.message);
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
      // if (hub.hubKey) {
      queries.push(doRemoteIdQuery(hub.id, authKey, hub.hubKey)); // }
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


function makeHubsMap(tokens, isCloudDiscovery = true, isSynchnonously = false) {
  const {
    authKey
  } = storedUser$1();
  return new Promise(resolve => {
    hubsMap = extractHubInfo(tokens);
    store.dispatch(hubsState.actions.updateHubs(hubsMap));
    fetchCloudMetaData(hubsMap, authKey).finally(() => {
      // Hubs map may be changed during fetching cloud metadata
      store.dispatch(hubsState.actions.updateHubs(hubsMap));

      if (isSynchnonously) {
        if (isCloudDiscovery) {
          doCloudDiscovery().then(() => {
            resolve(getHubs());
          }).catch(() => {
            resolve(getHubs());
          });
        } else {
          resolve(getHubs());
        }
      } else {
        if (isCloudDiscovery) {
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
                // alertsDeltaHandler(hubId, doReset, delta.alerts);
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

function selectHubById$1(hubId, poll = false) {
  return new Promise((resolve, reject) => {
    const hubs = getHubs();

    if (!isEmpty_1(hubs)) {
      let pollingHub = null;
      Object.values(hubs).every(hub => {
        if (hubId === hub.id) {
          store.dispatch(hubsState.actions.selectHub({
            hubId: hub.id
          }));

          if (poll) {
            pollingHub = startPollingById(hub.id);
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

      if (!pollingHub && poll) {
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
    makeHubsMap(tokens, discovery, sync).then(() => {
      selectHubById$1(hubId, false).then(() => {
        resolve(getHubs());
      }).catch(error => reject(error));
    }).catch(error => reject(error));
  });
}
function connectHubBySite(hubId, siteId, discovery = false, sync = true) {
  return new Promise((resolve, reject) => {
    const {
      authKey
    } = storedUser$1();
    if (!hubId) reject(new Error('No Hub Id'));
    if (!authKey) reject(new Error('No AuthKey'));
    const tokens = {};
    tokens[hubId] = null;
    makeHubsMap(tokens, discovery, sync).then(() => {
      selectHubById$1(hubId, false).then(() => {
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
/*
**
** Z-wave nodes
**
 */

const nodesInAction = {};
/**
 * Get Z-Wave nodes
 * @param {string} hubId
 * @return {Promise} that resolves node list when done
 */

async function getZwaveNodes(hubId) {
  return new Promise((resolve, reject) => {
    if (nodesInAction[hubId]) {
      reject(new Error('nodesInAction already in action'));
      return;
    }

    nodesInAction[hubId] = true;
    const {
      authKey
    } = storedUser$2();
    const hub = getHubs$1()[hubId];
    const {
      hubKey
    } = hub;
    send({
      command: COMMANDS.ZWAVE_GET_NODES,
      hubId,
      authKey,
      hubKey,
      localUrl: hub.url,
      data: []
    }).then(data => {
      console.debug('SDK: getZwaveNodes: Ok , data: ', data);
      nodesInAction[hubId] = false;
      resolve(data);
    }).catch(error => {
      console.error('SDK: getZwaveNodes error: ', error.message);
      nodesInAction[hubId] = false;
      reject(error);
    });
  });
}
/**
 * Get Z-Wave nodes
 * @param {string} hubId
 * @param {string} nodeId
 * @return {Promise} that resolves node list when done
 */

async function checkIsFailedZWaveNode(hubId, nodeId) {
  return new Promise((resolve, reject) => {
    /*
    if (nodesInActionNode[hubId]) {
      reject(new Error('nodesInAction already in action'));
      return;
    }
    nodesInAction[hubId] = true;
    */
    const {
      authKey
    } = storedUser$2();
    const hub = getHubs$1()[hubId];
    const {
      hubKey
    } = hub;
    send({
      command: COMMANDS.ZWAVE_CHECK_IS_FAILED_NODE,
      hubId,
      authKey,
      hubKey,
      localUrl: hub.url,
      data: [{
        nodeId
      }]
    }).then(data => {
      console.debug('SDK: checkIsFailedZWaveNode: Ok , data: ', data);

      if (data && data.status === 0) {
        nodesInAction[hubId] = false;

        if (data.isFailed) {
          resolve(true);
        } else {
          resolve(false);
        }
      } else {
        console.error('SDK: checkIsFailedZWaveNode error: ', data ? data.status : 'unknown');
        nodesInAction[hubId] = false;
        reject(data.status);
      }
    }).catch(error => {
      console.error('SDK: checkIsFailedZWaveNode error: ', error.message);
      nodesInAction[hubId] = false;
      reject(error);
    });
  });
}
/**
 * Get Z-Wave nodes
 * @param {string} hubId
 * @param {string} nodeId
 * @return {Promise} that resolves node list when done
 */

async function removeFailedZWaveNode(hubId, nodeId) {
  return new Promise((resolve, reject) => {
    /*
    if (nodesInAction[hubId]) {
      reject(new Error('nodesInAction already in action'));
      return;
    }
    nodesInAction[hubId] = true;
    */
    const {
      authKey
    } = storedUser$2();
    const hub = getHubs$1()[hubId];
    const {
      hubKey
    } = hub;
    send({
      command: COMMANDS.ZWAVE_REMOVE_FAILED_NODE,
      hubId,
      authKey,
      hubKey,
      localUrl: hub.url,
      data: [{
        nodeId
      }]
    }).then(data => {
      console.debug('SDK: removeFailedZWaveNode: Ok , data: ', data);

      if (data && data.status === 1) {
        nodesInAction[hubId] = false;
        resolve(true);
      } else {
        console.error('SDK: removeFailedZWaveNode error: ', data ? data.status : 'unknown');
        nodesInAction[hubId] = false;
        reject(data.status);
      }
    }).catch(error => {
      console.error('SDK: removeFailedZWaveNode error: ', error.message);
      nodesInAction[hubId] = false;
      reject(error);
    });
  });
}
/**
 * Get Z-Wave node parameter
 * @param {string} hubId
 * @param {string} nodeId
 * @param {number} parameter
 * @return {Promise} that resolves node list when done
 */

async function getZWaveNodeParameter(hubId, nodeId, parameter) {
  return new Promise((resolve, reject) => {
    /*
    if (nodesInAction[hubId]) {
      reject(new Error('nodesInAction already in action'));
      return;
    }
    nodesInAction[hubId] = true;
    */
    const {
      authKey
    } = storedUser$2();
    const hub = getHubs$1()[hubId];
    const {
      hubKey
    } = hub;
    send({
      command: COMMANDS.ZWAVE_GET_NODE_CONFIGURATION,
      hubId,
      authKey,
      hubKey,
      localUrl: hub.url,
      data: [{
        nodeId,
        parameter
      }]
    }).then(data => {
      if (data && data.status === 0) {
        console.debug('SDK: getZWaveNodeParameter: Ok , data: ', data); // nodesInAction[hubId] = false;

        resolve(data);
      } else {
        console.error('SDK: getZWaveNodeParameter error: ', data ? data.status : 'unknown'); // nodesInAction[hubId] = false;

        reject(new Error(`Getting ZWave node parem failed`));
      }
    }).catch(error => {
      console.error('SDK: getZWaveNodeParameter error: ', error.message); // nodesInAction[hubId] = false;

      reject(error);
    });
  });
}
/**
 * Set Z-Wave node parameter
 * @param {string} hubId
 * @param {string} nodeId
 * @param {number} parameter
 * @param {size} parameter
 * @param {boolean} default
 * @param {number} value
 * @return {Promise} that resolves node list when done
 */

async function setZWaveNodeParameter(hubId, nodeId, parameter, size, def, val) {
  return new Promise((resolve, reject) => {
    /*
    if (nodesInAction[hubId]) {
      reject(new Error('nodesInAction already in action'));
      return;
    }
    nodesInAction[hubId] = true;
    */
    const {
      authKey
    } = storedUser$2();
    const hub = getHubs$1()[hubId];
    const {
      hubKey
    } = hub;
    let value = val;

    if (def) {
      value = null;
    }

    send({
      command: COMMANDS.ZWAVE_SET_NODE_CONFIGURATION,
      hubId,
      authKey,
      hubKey,
      localUrl: hub.url,
      data: [{
        nodeId,
        parameter,
        size,
        default: def,
        value
      }]
    }).then(data => {
      if (data && data.status === 0) {
        console.debug('SDK: setZWaveNodeParameter: Ok , data: ', data); // nodesInAction[hubId] = false;

        resolve(data);
      } else {
        console.error('SDK: setZWaveNodeParameter error: ', data ? data.status : 'unknown'); // nodesInAction[hubId] = false;

        reject(new Error(`Setting ZWave node parem failed`));
      } // nodesInAction[hubId] = false;


      resolve(data);
    }).catch(error => {
      console.error('SDK: setZWaveNodeParameter error: ', error.message); // nodesInAction[hubId] = false;

      reject(error);
    });
  });
}

//      
/**
 * Helper to get current user from state
 */

function storedUser$3() {
  return userState.selectors.getUser(store.getState());
}
/**
 * Helper to get current hubs from state
 * @return {HUBS_MAP_TYPE} - hubs
 */


function getHubs$2() {
  return hubsState.selectors.getHubs(store.getState());
} // const modbusDevices: Object = {};

/*
 * Get hub modbus devices
 * @param {string} hubId
 * @return {Promise}
 */

async function getModbusDevicePairings(hubId) {
  return new Promise((resolve, reject) => {
    const hub = getHubs$2()[hubId];
    const {
      authKey
    } = storedUser$3();
    const {
      hubKey
    } = hub;
    console.debug('getModbusDevices connection state: ', hub.connectionState);

    if (hub.connectionState !== HUB_CONNECTION_STATES.LOCAL && hub.connectionState !== HUB_CONNECTION_STATES.REMOTE) {
      console.warn('SDK getModbusDevices: no Hub connection');
      reject(new Error('no hub connection'));
      return;
    }

    send({
      command: COMMANDS.GET_MODBUS_DEVICE_PAIRINGS,
      hubId,
      authKey,
      hubKey,
      localUrl: hub.url,
      data: []
    }).then(data => {
      console.info('SDK: getModbusDevicePairings success: ', data);
      return resolve(data);
    }).catch(error => {
      console.error('SDK: getModbusDevicePairings error: ', error.message);
      reject(error);
    });
  });
}
/*
 * Set hub modbus devices
 * @param {string} hubId
 * @param {MODBUS_DEVICE_PAIRING_TYPES} modbusDevices
 * @return {Promise}
 */

async function setModbusDevicePairings(hubId, modbusDevices) {
  return new Promise((resolve, reject) => {
    const hub = getHubs$2()[hubId];
    const {
      authKey
    } = storedUser$3();
    const {
      hubKey
    } = hub;
    console.debug('setModbusDevices connection state: ', hub.connectionState);

    if (hub.connectionState !== HUB_CONNECTION_STATES.LOCAL && hub.connectionState !== HUB_CONNECTION_STATES.REMOTE) {
      console.warn('SDK setModbusDevices: no Hub connection');
      reject(new Error('no hub connection'));
      return;
    }

    let invalidData = false;
    const data = [];
    modbusDevices.map(device => {
      if (!device.address) {
        invalidData = true;
        reject(new Error('Invalid address'));
      }

      if (!device.deviceType) {
        invalidData = true;
        reject(new Error('Invalid device type'));
      }

      const item = {
        address: Number(device.address),
        deviceType: device.deviceType,
        name: device.name || '',
        readDeviceIdSupported: device.readDeviceIdSupported,
        registerRequired: device.registerRequired,
        register: undefined,
        registerType: undefined,
        normallyOff: false,
        type: 'PAIR_MODBUS'
      };

      if (device.deviceType === 'RELAY' || device.deviceType === 'SIGNAL') {
        item.normallyOff = !!device.normallyOff;
      }

      if (device.name != null && device.name.length > 0 && device.address != null && device.address <= 247 && device.address > 0) {
        if (device.registerRequired) {
          if (device.register != null && device.register >= 0 && device.register <= 65535 && device.registerType) {
            item.registerRequired = true;
            item.register = Number(device.register);
            item.registerType = Number(device.registerType);
          } else {
            invalidData = true;
            reject(new Error('Invalid register data'));
          }
        } else {
          item.registerRequired = false;
        }
      } else {
        invalidData = true;
        reject(new Error('Invalid name or address data'));
      }

      data.push(item);
      return true;
    });

    if (!invalidData && data.length > 0) {
      send({
        command: COMMANDS.SET_MODBUS_DEVICE_PAIRINGS,
        hubId,
        authKey,
        hubKey,
        localUrl: hub.url,
        data
      }).then(reply => {
        console.info('SDK: setModbusDevicePairings success: ', reply);

        if (reply && reply === true) {
          return resolve(reply);
        }

        return reject(new Error(reply ? reply.message : 'unknown error'));
      }).catch(error => {
        console.error('SDK: setModbusDevicePairings error: ', error.message);
        reject(error);
      });
    } else {
      reject(new Error('Invalid data'));
    }
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
var splice = arrayProto.splice;

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
    splice.call(data, index, 1);
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
function toString(value) {
  return value == null ? '' : _baseToString(value);
}

var toString_1 = toString;

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

var _defineProperty$2 = defineProperty$1;

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
  if (key == '__proto__' && _defineProperty$2) {
    _defineProperty$2(object, key, {
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
var baseSetToString = !_defineProperty$2 ? identity_1 : function(func, string) {
  return _defineProperty$2(func, 'toString', {
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

    if (!hubs[hubId] || !hubs[hubId].hubKey && getCloudURL().indexOf('https://one.cozify.fi') === -1) {
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
    let hubKey;

    if (hub && hub.hubKey) {
      hubKey = hub.hubKey;
    }

    if (!hub || !hubKey && getCloudURL().indexOf('https://one.cozify.fi') === -1) {
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
      reject(new Error('Device command error: No authKey!'));
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
function setDeviceVisibility(hubId, deviceId, visible) {
  return sendDeviceCmd(hubId, deviceId, COMMANDS.CMD_DEVICE_VISIBILITY, {
    id: deviceId,
    visible
  });
}
function setDeviceLocked(hubId, deviceId, locked) {
  return sendDeviceCmd(hubId, deviceId, COMMANDS.CMD_DEVICE_LOCK, {
    id: deviceId,
    locked
  });
}
function setDeviceHotWater(hubId, deviceId, hotWater) {
  return sendDeviceCmd(hubId, deviceId, COMMANDS.CMD_DEVICE_HOT_WATER, {
    id: deviceId,
    hotWater
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
const PLAN_NODES = Object.freeze({
  LOCATION: 'LOCATION',
  TEMPLATE: 'TEMPLATE',
  HUB: 'HUB'
});
const DUMMY = Object.freeze({
  DUMMY: 'DUMMY'
});

export { CLOUD_CONNECTION_STATES, HUB_CONNECTION_STATES, HUB_STATES, LANGUAGES, PLAN_NODES, ROLES, USER_STATES, ZWAVE_EXCLUSION_STATUS, ZWAVE_INCLUSION_STATUS, acceptEula, addRoom, changeLanguage, checkIsFailedZWaveNode, closeAlarm, connectHubBySite, connectHubByTokens, rootReducer as cozifyReducer, deleteDevice, devicesState, doPoll, doPwLogin, doRemoteIdQuery, doZwaveExclusion, doZwaveInclusion, editRoom, fetchHubs, getAlarms, getCloudConnectionState, getDevices, getHubAlarms, getHubConnectionState, getHubDevices, getHubPairingDevices, getHubRooms, getHubs, getModbusDevicePairings, getPairingDevices, getRooms, getUserState, getZWaveNodeParameter, getZwaveNodes, healZwave, hubsState, identifyDevice, ignorePairingByIds, isZwaveEnabled, lockAndBackup, reactFetchPlanDocumentNodes, reactFetchPlanDocuments, reactFetchPlans, reactInsertPlan, reactInsertPlanDocument, reactInsertPlanDocumentNode, reactRemovePlan, reactRemovePlanDocument, reactRemovePlanDocumentNode, reactSelectAllDocumentNodes, reactSelectAllDocuments, reactSelectAllPlans, reactSelectPlanDocumentNodes, reactSelectPlanDocuments, reactSubscribePlanDocumentNodes, reactSubscribePlanDocuments, reactSubscribePlans, reactUpdatePlan, reactUpdatePlanDocument, reactUpdatePlanDocumentNode, removeAlarm, removeFailedZWaveNode, removeRoom, selectCloud, selectHubById$1 as selectHubById, sendDeviceCmd, sendDeviceStateCmd, setAuthenticated, setDeviceHotWater, setDeviceLocked, setDeviceMeta, setDeviceVisibility, setDevices, setModbusDevicePairings, setZWaveNodeParameter, startDiscoveringHubs, startPairingById, startPollingById, stopDiscoveringHubs, stopPairingById, stopPairings, stopPollingById, stopZwaveExclusion, stopZwaveInclusion, store, unSelectHubById, unSelectHubs, unpairDevice, updateHubs, urlBase64Decode, useTestcloud, watchChanges };
//# sourceMappingURL=sdk.es.js.map
