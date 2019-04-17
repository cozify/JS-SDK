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


export const DISCOVERY_INTERVAL_MS = 60 * 1000
export const POLL_INTERVAL_MS = 1 * 1000
export const HUB_PROTOCOL = 'http://'
export const HUB_PORT = '8893'

