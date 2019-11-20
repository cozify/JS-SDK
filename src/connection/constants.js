// @flow
import { isNode } from '../utils';

/*
* Cloud servers SSL cretification fingerprints to be checked if possible
* Fingerprint could be found by opening the server URL like https://testapi.cozify.fi/ui/0.2/hub/lan_ip in Chrome.
* Then click the green certificate in front of the URL, click 'Connection', 'Certificate details', expand the details
* and scroll down to the SHA1 fingerprint.
* testapi 91 30 CF 20 17 F7 D7 EC F7 BA 43 30 8E 19 83 B4 CF DE 5A CC
* cloud & cloud2 26 B0 20 FA AB E8 A3 81 63 37 C6 B7 EF 94 4D 40 3D 1B 85 10
*/
export const CLOUD_FINGERPRINTS_SHA1: Array<string> = [
  '91 30 CF 20 17 F7 D7 EC F7 BA 43 30 8E 19 83 B4 CF DE 5A CC',
  '26 B0 20 FA AB E8 A3 81 63 37 C6 B7 EF 94 4D 40 3D 1B 85 10',
];

/* Cloud HTTPS host name */
const CLOUD_HOST: string = 'https://api.cozify.fi';
const CLOUD_HOST_TEST: string = 'https://testapi.cozify.fi';


/* Cloud API VERSION */
export const CLOUD_API_VERSION: string = 'ui/0.2/';


let cloudHost = CLOUD_HOST;

/**
 * Method to set Cozify test-cloud as an cloud API host.
 * Must be called at the early stage of SDK usage, otherwise production
 * cloud is used.
 *
 * @return {[type]} [description]
 */
export function useTestcloud() {
  cloudHost = CLOUD_HOST_TEST;
}

export function getCloudHost() {
  return cloudHost;
}

export function getCloudURL() {
  return `${cloudHost}/${CLOUD_API_VERSION}`;
}

export const MAX_API_VERSION: string = '1.13';
/**
 *  Enumeration of supported API commands, that could be
 *  USER_LOGIN, HUB_KEYS, REFRESH_AUTHKEY, CLOUD_IP, CLOUD_META, POLL, CMD_DEVICE
 *  @typedef {Object} COMMANDS_TYPE
 *  @readonly
 *
  */
export const COMMANDS = Object.freeze({
  USER_LOGIN: {
    method: 'POST', url: 'user/login', params: ['password', 'email'], config: { responseType: isNode ? 'blob' : 'stream', timeout: 15000 },
  },
  HUB_KEYS: { method: 'GET', url: 'user/hubkeys', timeout: 15000 },
  REFRESH_AUTHKEY: { method: 'GET', url: 'user/refreshsession' },
  CLOUD_IP: { method: 'GET', url: 'hub/lan_ip' },
  CLOUD_META: { method: 'GET', url: 'hub/remote/hub' },
  POLL: { method: 'GET', url: 'hub/remote/cc/$API_VER/hub/poll', urlParams: ['ts'] },
  PAIR_START: { method: 'GET', url: 'hub/remote/cc/$API_VER/hub/scan', urlParams: ['ts'] },
  PAIR_IGNORE: {
    method: 'PUT', url: 'hub/remote/cc/$API_VER/hub/scan', type: 'SET_SCAN_RESULT', params: ['id', 'ignored'],
  },
  PAIR_STOP: { method: 'GET', url: 'hub/remote/cc/$API_VER/hub/stopscan' },
  CMD_DEVICE_STATE: {
    method: 'PUT', url: 'hub/remote/cc/$API_VER/devices/command', type: 'CMD_DEVICE', params: ['id', 'state'],
  },
  CMD_DEVICE_IGNORE: {
    method: 'PUT', url: 'hub/remote/cc/$API_VER/devices/command', type: 'CMD_IGNORE_DEVICE', params: ['id'],
  },
  CMD_DEVICE_IDENTIFY: {
    method: 'PUT', url: 'hub/remote/cc/$API_VER/devices/command', type: 'CMD_IDENTIFY', params: ['id'],
  },
  CMD_DEVICE_META: {
    method: 'PUT', url: 'hub/remote/cc/$API_VER/devices/command', type: 'CMD_DEVICE_META', params: ['id', 'name', 'room'],
  },
  CMD_GET_ROOMS: { method: 'GET', url: 'hub/remote/cc/$API_VER/rooms' },
  CMD_SET_ROOM: {
    method: 'PUT', url: 'hub/remote/cc/$API_VER/rooms', type: 'CMD_ROOM', params: ['id', 'name', 'order'],
  },
  CMD_REMOVE_ROOM: { method: 'DELETE', url: 'hub/remote/cc/$API_VER/rooms', urlParams: ['roomId'] },
  CMD_GET_ALARMS: { method: 'GET', url: 'hub/remote/cc/$API_VER/alarms' },
  CMD_CLOSE_ALARM: { method: 'PUT', url: 'hub/remote/cc/$API_VER/alarms/close', urlParams: ['alarmId'] },
  CMD_REMOVE_ALARM: { method: 'DELETE', url: 'hub/remote/cc/$API_VER/alarms', urlParams: ['roomId'] },
  ZWAVE_START_INCLUSION: { method: 'POST', url: 'hub/remote/cc/$API_VER/hub/protocolconfig', type: 'ZWAVE_START_INCLUSION' },
  ZWAVE_STOP_INCLUSION: { method: 'POST', url: 'hub/remote/cc/$API_VER/hub/protocolconfig', type: 'ZWAVE_CANCEL_INCLUSION' },
  ZWAVE_START_EXCLUSION: { method: 'POST', url: 'hub/remote/cc/$API_VER/hub/protocolconfig', type: 'ZWAVE_START_EXCLUSION' },
  ZWAVE_STOP_EXCLUSION: { method: 'POST', url: 'hub/remote/cc/$API_VER/hub/protocolconfig', type: 'ZWAVE_CANCEL_EXCLUSION' },
  ZWAVE_INCLUSION_STATUS: { method: 'POST', url: 'hub/remote/cc/$API_VER/hub/protocolconfig', type: 'GET_ZWAVE_INCLUSION_STATUS' },
  ZWAVE_EXCLUSION_STATUS: { method: 'POST', url: 'hub/remote/cc/$API_VER/hub/protocolconfig', type: 'GET_ZWAVE_EXCLUSION_STATUS' },
});


export type COMMANDS_TYPE = $Values<typeof COMMANDS>;

// type dataArray = ?Array<{ [key: string | number]: any }>
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
export type COMMAND_TYPE = {
  command?: ?COMMANDS_TYPE,
  localUrl?: ?string,
  url?: ?string,
  timeout?: ?number,
  method?: ?string,
  authKey?: ?string,
  hubKey?: ?string,
  config?: ?any,
  data?: ?any,
  type?: ?string,
  hubId?: ?string
}

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
  CONNECTED: 'connected',
});

export type CLOUD_CONNECTION_STATE_TYPE = $Values<typeof CLOUD_CONNECTION_STATES>;

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
  LOCAL: 'local',
});
export type HUB_CONNECTION_STATE_TYPE = $Values<typeof HUB_CONNECTION_STATES>;
