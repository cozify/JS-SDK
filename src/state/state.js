// @flow


/**
  * Enumeration of connection state, that could be
  * UNCONNECTED, REMOTE, LOCAL or LOST
  * @readonly
  * @enum {string}
  */
export const CONNECTION_STATES = Object.freeze({
  UNCONNECTED: 'no connection',
  REMOTE: 'remote',
  LOCAL: 'local',
  LOST: 'lost',
});
type CONNECTION_STATE_TYPE = $Values<typeof CONNECTION_STATES>;

let _connectionState: CONNECTION_STATE_TYPE = CONNECTION_STATES.UNCONNECTED;
/*
 * state
 * @type {Object}
 */
export const state = {
  get connectionState(): CONNECTION_STATE_TYPE { return _connectionState; },
  set connectionState(value: CONNECTION_STATE_TYPE) { _connectionState = value; },
};
