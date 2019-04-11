/**
  * Enumeration of hub state, that could be
  * UNCLAIMED, CLAIMED, TOO_NEW_VERSION, NO_ACCESS or CONNECTED
  * @readonly
  * @enum {string}
  */
export const HUB_STATES = Object.freeze({
  LOST: 'lost',
  UNCLAIMED: 'unclaimed',
  CLAIMED: 'claimed',
  TOO_NEW_VERSION: 'new version',
  NO_ACCESS: 'no access',
  CONNECTED: 'connected',
});
export type HUB_STATE_TYPE = $Values<typeof HUB_STATES>;

/**
  * Enumeration of HUB connection state, that could be
  * UNCONNECTED, REMOTE or LOCAL
  * @readonly
  * @enum {string}
  */
export const HUB_CONNECTION_STATES = Object.freeze({
  UNCONNECTED: 'no connection',
  REMOTE: 'remote',
  LOCAL: 'local'
});
export type HUB_CONNECTION_STATE_TYPE = $Values<typeof HUB_CONNECTION_STATES>;


export const REMOTE_POLL_INTERVAL_MS = 2000
export const HUB_PROTOCOL = 'http://'
export const HUB_PORT = '8893'

