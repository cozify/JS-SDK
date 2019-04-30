// 
//
/**
  * Enumeration of hub state, that could be
  * UNCLAIMED, CLAIMED, TOO_NEW_VERSION, NO_ACCESS or CONNECTED
  * @readonly
  * @enum {string}
  */
export const HUB_STATES = Object.freeze({
  UNCLAIMED: 'unclaimed',
  CLAIMED: 'claimed',
  TOO_NEW_VERSION: 'new version',
  NO_ACCESS: 'no access',
  CONNECTED: 'connected',
});



/*
 * Intervall defining how often hubkeys and metadatas are fetched
 */
export const DISCOVERY_INTERVAL_MS = 45 * 1000

/*
 * Interval defining how often hubs are polled at max
 * This value is used as is in local connection, and multiplied in remote connection
 */
export const POLL_INTERVAL_MS = 1 * 1000

export const HUB_PROTOCOL = 'http://'
export const HUB_PORT = '8893'

