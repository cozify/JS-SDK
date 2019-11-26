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

export const ZWAVE_INCLUSION_STATUS = Object.freeze({
  NOT_PAIRING: 'NOT_PAIRING', // Inclusion is not running
  IDLE: 'IDLE', // Inclusion is not running
  RUNNING: 'RUNNING', // Inclusion is running
  TIMEOUT: 'TIMEOUT', // Inclusion timed out and finished
  SUCCESS: 'SUCCESS', // Inclusion finished, a device was added
  CANCEL: 'CANCEL', // Inclusion was cancelled
  NO_ZWAVE: 'NO_ZWAVE', // ZWave not available
  ERROR: 'ERROR', // General error
});
export type ZWAVE_INCLUSION_STATUS_TYPE = $Values<typeof ZWAVE_INCLUSION_STATUS>;


export const ZWAVE_EXCLUSION_STATUS = Object.freeze({
  IDLE: 'IDLE', // Exclusion is not running
  RUNNING: 'RUNNING', // Exclusion is running
  TIMEOUT: 'TIMEOUT', // Exclusion timed out and finished
  SUCCESS: 'SUCCESS', // Exclusion finished, a device was added
  CANCEL: 'CANCEL', // Exclusion was cancelled
  NO_ZWAVE: 'NO_ZWAVE', // ZWave not available
  ERROR: 'ERROR', // General error
});
export type ZWAVE_EXCLUSION_STATUS_TYPE = $Values<typeof ZWAVE_EXCLUSION_STATUS>;


export type ZWAVE_INCLUSION_STATES_TYPE = {status: ZWAVE_INCLUSION_STATUS_TYPE, nodeId: string, type: string}
export type ZWAVE_EXCLUSION_STATES_TYPE = {status: ZWAVE_EXCLUSION_STATUS_TYPE, nodeId: string, type: string}

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

export type HUB_KEYS_TYPE = { [hubId: string]: string }
/*
 * Intervall defining how often hubkeys and metadatas are fetched
 */
export const DISCOVERY_INTERVAL_MS: number = 45 * 1000;

/*
 * Interval defining how often hubs are polled at max
 * This value is used as is in local connection, and multiplied in remote connection
 */
export const POLL_INTERVAL_MS: number = 1 * 1000;

/*
 * Interval defining how often hubs are polled when paired
 */
export const PAIRING_POLL_INTERVAL_MS: number = 3 * 1000;

/*
 * Interval defining how often zwave statuses are polled
 */
export const ZWAVE_INCLUSION_INTERVAL_MS: number = 3 * 1000;
export const ZWAVE_EXCLUSION_INTERVAL_MS: number = 3 * 1000;

export const HUB_PROTOCOL: string = 'http://';
export const HUB_PORT: string = '8893';
