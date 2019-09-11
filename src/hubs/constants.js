// @flow
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
export type HUB_STATES_TYPE = $Values<typeof HUB_STATES>;

export type HUB_TYPE = {
  id: string,
  hubId?: ?string,
  connectionState?: ?string,
  connected?: boolean,
  features?: ?Array<number>,
  state?: ?string,
  version?: ?string,
  hubKey?: ?string,
  name?: ?string,
  role?: ?number,
  roleString?: ?string,
  url?: ?string,
  selected?: ?boolean
}

export type HUBS_MAP_TYPE = {[hubId: string]: HUB_TYPE}

/*
 * Intervall defining how often hubkeys and metadatas are fetched
 */
export const DISCOVERY_INTERVAL_MS: number = 45 * 1000;

/*
 * Interval defining how often hubs are polled at max
 * This value is used as is in local connection, and multiplied in remote connection
 */
export const POLL_INTERVAL_MS: number = 1 * 1000;

export const HUB_PROTOCOL: string = 'http://';
export const HUB_PORT: string = '8893';
