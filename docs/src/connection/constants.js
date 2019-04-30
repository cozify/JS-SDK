// 
import { isNode } from '../utils.js'

/*
* Cloud servers SSL cretification fingerprints to be checked if possible
* Fingerprint could be found by opening the server URL like https://testapi.cozify.fi/ui/0.2/hub/lan_ip in Chrome.
* Then click the green certificate in front of the URL, click 'Connection', 'Certificate details', expand the details
* and scroll down to the SHA1 fingerprint.
* testapi 91 30 CF 20 17 F7 D7 EC F7 BA 43 30 8E 19 83 B4 CF DE 5A CC
* cloud & cloud2 26 B0 20 FA AB E8 A3 81 63 37 C6 B7 EF 94 4D 40 3D 1B 85 10
*/
export const CLOUD_FINGERPRINTS_SHA1 = ["91 30 CF 20 17 F7 D7 EC F7 BA 43 30 8E 19 83 B4 CF DE 5A CC", "26 B0 20 FA AB E8 A3 81 63 37 C6 B7 EF 94 4D 40 3D 1B 85 10"];
/* Cloud HTTPS host name */
export const CLOUD_HOST = 'https://testapi.cozify.fi';
/* Cloud API VERSION */
export const CLOUD_API_VERSION = "ui/0.2/";
/* Cloud URL */
export const CLOUD_URL = CLOUD_HOST + "/" + CLOUD_API_VERSION;


/**
 *  Enumeration of supported API commands, that could be
 *  USER_LOGIN, HUB_KEYS, REFRESH_AUTHKEY, CLOUD_IP, CLOUD_META, POLL, CMD_DEVICE
 *  @typedef {Object} COMMANDS_TYPE
 *  @readonly
 *
  */
export const COMMANDS = Object.freeze({
  USER_LOGIN: { method: 'POST', url: CLOUD_URL + "user/login", params: ['password', 'email'], config:{responseType: isNode ? 'blob' : 'stream', timeout: 5000} },
  HUB_KEYS: { method: 'GET', url: CLOUD_URL + "user/hubkeys"},
  REFRESH_AUTHKEY: { method: 'GET', url: CLOUD_URL + "user/refreshsession"},
  CLOUD_IP: {method: 'GET', url: CLOUD_URL + "hub/lan_ip"},
  CLOUD_META: {method: 'GET', url: CLOUD_URL + "hub/remote/hub"},
  POLL: {method: 'GET', url: CLOUD_URL + "hub/remote/cc/1.11" + "/hub/poll" , urlParams: ['ts']},
  CMD_DEVICE: {method: 'PUT', url: CLOUD_URL + "hub/remote/cc/1.11" + "/devices/command", type: 'CMD_DEVICE', params: ['id', 'state']}
});



/**
 * COMMAND_TYPE
 *  @typedef {Object} COMMANDS_TYPE
 *  @property {COMMANDS_TYPE} [command]      - Optional command like USER_LOGIN,
 *  @property {string} [localUrl]     - Optional localUrl for direct hub access
 *  @property {string} [hubId]        - Optional hub Id when messaging to hub
 *  @property {string} [url]          - Optional url
 *  @property {string} [method]       - Optional method
 *  @property {string} [authKey]      - Optional authKey
 *  @property {string} [hubKey]       - Optional hubKey
 *  @property {string} [type]         - Optional type that defaults to 'application/json',
 *  @property {Object} [config]       - Optional config that might have 'timeout' or 'responseType' configs to be used over defaults,
 *  @property {Object} [data]         - Optional data to be sent over url or body parameters (depending command)
 */

/**
  * Enumeration of cloud connection state, that could be
  * UNCONNECTED, UNAUTHENTICATED, UNAUTHORIZED, OBSOLETE_API_VERSION, LATE_PAYMENT or CONNECTED
  * @readonly
  * @enum {string}
  * @typedef {string} CLOUD_CONNECTION_STATE_TYPE
  */
export const CLOUD_CONNECTION_STATES = Object.freeze({
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
export const HUB_CONNECTION_STATES = Object.freeze({
  UNCONNECTED: 'no connection',
  UNAUTHENTICATED: 'unauthenticated',
  UNAUTHORIZED: 'unauthorized',
  OBSOLETE_API_VERSION: 'obsolete api version',
  REMOTE: 'remote',
  LOCAL: 'local'
});


