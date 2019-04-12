// @flow


/**
  * Enumeration of cloud connection state, that could be
  * UNCONNECTED or CONNECTED
  * @readonly
  * @enum {string}
  */
export const CLOUD_CONNECTION_STATES = Object.freeze({
  UNCONNECTED: 'no connection',
  CONNECTED: 'connected',
});
export type CLOUD_CONNECTION_STATE_TYPE = $Values<typeof CLOUD_CONNECTION_STATES>;

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


export const CLOUD_API_VERSION: string = "ui/0.2/";
export const CLOUD_URL: string = "https://testapi.cozify.fi/" + CLOUD_API_VERSION;
