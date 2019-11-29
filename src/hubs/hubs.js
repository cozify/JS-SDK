// @flow
import isEmpty from 'lodash/isEmpty';
import {
  DISCOVERY_INTERVAL_MS, POLL_INTERVAL_MS, PAIRING_POLL_INTERVAL_MS, HUB_PROTOCOL, HUB_PORT,
} from './constants';
import { USER_STATES, ROLES } from '../user/constants';
import { HUB_CONNECTION_STATES } from '../connection/constants';
import { COMMANDS, send, sendAll } from '../connection/send';

import { devicesDeltaHandler, pairingDevicesDeltaHandler } from '../devices/devices';
import { roomsDeltaHandler } from '../rooms/rooms';
import { alarmsDeltaHandler } from '../alarms/alarms';
import { urlBase64Decode } from '../utils';
import { store, watchChanges } from '../store';
import { hubsState } from '../reducers/hubs';
import { userState } from '../reducers/user';

import type { HUB_TYPE, HUBS_MAP_TYPE, HUB_KEYS_TYPE } from './constants';


let hubsMap: HUBS_MAP_TYPE = {};


/*
 * Helper method to extract hub info from JWT based hub keys
 */
function extractHubInfo(HUBKeys: HUB_KEYS_TYPE): HUBS_MAP_TYPE {
  const hubs: HUBS_MAP_TYPE = {};
  if (HUBKeys) {
    Object.keys(HUBKeys).forEach((hubKey) => {
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
        Object.keys(ROLES).forEach((roleKey) => {
          if (ROLES[roleKey] === info.role) info.roleString = roleKey;
        });
      }
      hubs[info.id] = info;
    });
  }
  return hubs;
}


/*
 * Hub metadata is received and will be stored
 */
function updateFoundHub(hubURL: ?string, hub: HUB_TYPE) {
  const foundHub = hub;
  // Hub keys returns ids, idQuerys return hubId
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
      name: foundHub.name || '',
    };
  }
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
export function lockAndBackup(hubId: string, authKey: string, hubKey: string): Promise<any> {
  return new Promise((resolve, reject) => {
    send({
      command: COMMANDS.HUB_LOCK_BACKUP, authKey, hubKey, hubId,
    })
      .then((status) => {
        resolve(status);
      })
      .catch((error) => {
        console.log(`doRemoteIdQuery ${hubId} error `, error.message);
        reject(error);
      });
  });
}

/*
 * Remote hub metamata request for version etc information
 */
export function doRemoteIdQuery(hubId: string, authKey: string, hubKey: string): Promise<any> {
  return new Promise((resolve, reject) => {
    send({
      command: COMMANDS.CLOUD_META, authKey, hubKey, hubId,
    })
      .then((hubData) => {
        updateFoundHub(undefined, hubData);
        resolve(hubData);
      })
      .catch((error) => {
        console.log(`doRemoteIdQuery ${hubId} error `, error.message);
        reject(hubId);
      });
  });
}

/*
 * Local hub metadata request for version etc information
 */
function doLocalIdQuery(ip: string): Promise<?string> {
  return new Promise((resolve) => {
    if (ip) {
      const hubURL = `${HUB_PROTOCOL + ip}:${HUB_PORT}`;
      const url = `${hubURL}/hub`;
      send({ url, timeout: 500 })
        .then((hubData) => {
          updateFoundHub(hubURL, hubData);
          resolve(ip);
        })
        .catch((error) => {
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
export function getHubs(): HUBS_MAP_TYPE {
  return hubsState.selectors.getHubs(store.getState());
}

/*
 * Check hubs that are currently selected and mark them selected also in map of given hubs
 */
function setSelectedHubs(newHubs: HUBS_MAP_TYPE) {
  const hubs = getHubs();
  (Object.values(hubs): any).forEach((hub: HUB_TYPE) => {
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
function doCloudDiscovery(): Promise<string> {
  return new Promise((resolve) => {
    send({ command: COMMANDS.CLOUD_IP })
      .then((ips) => {
        const queries = [];
        if (ips && !isEmpty(ips)) {
          ips.forEach((ip) => {
            queries.push(doLocalIdQuery(ip));
          });
        }
        sendAll(queries)
          .finally(() => {
            // mark selected hubs to be selected after
            setSelectedHubs(hubsMap);
            store.dispatch(hubsState.actions.updateHubs(hubsMap));
            resolve('ok');
          });
      })
      .catch((error) => {
        console.error('doCloudDiscovery error: ', error.message);
        store.dispatch(hubsState.actions.updateHubs(hubsMap));
        resolve('error');
      });
  });
}

/*
 * Fetch hub metadatas from Cloud
 */
function fetchCloudMetaData(hubs: HUBS_MAP_TYPE, authKey: string): Promise<Object> {
  return new Promise((resolve) => {
    const queries = [];
    (Object.values(hubs): any).forEach((hub: HUB_TYPE) => {
      if (hub.hubKey) {
        queries.push(doRemoteIdQuery(hub.id, authKey, hub.hubKey));
      }
    });
    sendAll(queries)
      .then((values) => {
        console.debug('fetchCloudMetaData values', values);
      })
      .catch((error) => {
        console.error('fetchCloudMetaData error', error);
      })
      .finally(() => {
        resolve();
      });
  });
}


/**
 * Helper to get current user from state
 */
function storedUser(): Object {
  return userState.selectors.getUser(store.getState());
}

/*
 * Make hubsMap by fetching hub meta data from cloud and local
 */
function makeHubsMap(tokens: HUB_KEYS_TYPE, doCloudDicovery: boolean = true, doSynchnonously: boolean = false): Promise<Object> {
  const { authKey } = storedUser();
  return new Promise((resolve) => {
    hubsMap = extractHubInfo(tokens);
    store.dispatch(hubsState.actions.updateHubs(hubsMap));
    fetchCloudMetaData(hubsMap, authKey)
      .finally(() => {
        // Hubs map may be changed during fetching cloud metadata
        store.dispatch(hubsState.actions.updateHubs(hubsMap));
        if (doSynchnonously) {
          if (doCloudDicovery) {
            doCloudDiscovery()
              .then(() => {
                resolve(getHubs());
              })
              .catch(() => {
                resolve(getHubs());
              });
          } else {
            resolve(getHubs());
          }
        } else {
          if (doCloudDicovery) {
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
function fetchHubs(): Promise<Object> {
  const { authKey } = storedUser();
  return new Promise((resolve, reject) => {
    if (!authKey) {
      reject(new Error('No userKey!'));
      return;
    }
    send({ command: COMMANDS.HUB_KEYS, authKey })
      .then((tokens) => {
        if (tokens) {
          makeHubsMap(tokens).then((hubs) => resolve(hubs));
        } else {
          resolve(getHubs());
        }
      })
      .catch((error) => {
        console.error('fetchHubTokens error: ', error.message);
        reject(error);
      });
  });
}


let discoveryInterval: IntervalID;

/**
 * Start discovering hubs every DISCOVERY_INTERVAL_MS
 * Sequence includes requests of hub-keys, remote meta-infos, lan-ips and local meta-infos
 */
export function startDiscoveringHubs() {
  if (!discoveryInterval) {
    // call immediately...
    fetchHubs();
    // and then every DISCOVERY_INTERVAL_MS (30s?)
    discoveryInterval = setInterval(fetchHubs, DISCOVERY_INTERVAL_MS);
  }
}

/**
 * Stop discovering hubs
 */
export function stopDiscoveringHubs() {
  clearInterval(discoveryInterval);
}

/*
** Pairing
 */

const pairingIntervals: Object = {};
const pairingStopped: Object = {};
const pairingTimeStamp: Object = {};
const pairingInAction: Object = {};


/*
 * Do pairing of given hub if hub connection is ok
 * Remote pairing is executed only every second call
 * @param {string} hubId
 * @param {booleam} reset - set true for full scan, false if delta only
 * @return {Promise}
 */
function doPairingById(hubId: string, reset: boolean = false): Promise<Object> {
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

    const hub: HUB_TYPE = getHubs()[hubId];
    const { authKey } = storedUser();
    const { hubKey } = hub;

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
      command: COMMANDS.PAIR_START, hubId, authKey, hubKey, localUrl: hub.url, data: { ts: pairingTimeStamp[hubId] },
    })
      .then((delta) => {
        if (delta) {
          pairingTimeStamp[hubId] = delta.timestamp;
          switch (delta.type) {
            case 'SCAN_DELTA': {
              pairingDevicesDeltaHandler(hubId, doReset, delta.devices);
              break;
            }
            default: {
              break;
            }
          }
        }
        pairingInAction[hubId] = false;
        resolve('ok');
      })
      .catch((error) => {
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
export function ignorePairingByIds(hubId: string, deviceId: string, ignore: boolean): Promise<Object> {
  const { authKey } = storedUser();
  const hub: HUB_TYPE = getHubs()[hubId];
  const { hubKey } = hub;
  return send({
    command: COMMANDS.PAIR_IGNORE, hubId, authKey, hubKey, localUrl: hub.url, data: { id: deviceId, ignored: ignore },
  });
}


/**
 * Start pairing on given hub
 * @param {string} hubId
 * @param {booleam} reset - set true for full scan, false if delta only
 * @return {Promise}
 */
export function startPairingById(hubId: string, reset: boolean): Promise<Object> {
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
export function stopPairingById(hubId: string): Promise<Object> {
  return new Promise((resolve, reject) => {
    if (stopPairingInAction[hubId]) {
      reject(new Error('already stopping'));
      return;
    }
    stopPairingInAction[hubId] = true;

    const { authKey } = storedUser();
    const hub: HUB_TYPE = getHubs()[hubId];
    const { hubKey } = hub;


    clearInterval(pairingIntervals[hubId]);

    send({
      command: COMMANDS.PAIR_STOP, hubId, authKey, hubKey, localUrl: hub.url,
    })
      .then((data) => {
        console.debug('SDK: pairingStopped: Ok , data: ', data);
        pairingStopped[hubId] = true;
        stopPairingInAction[hubId] = false;
        pairingDevicesDeltaHandler(hubId, true, []);
        resolve('ok');
      })
      .catch((error) => {
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
export function stopPairings() {
  const hubs = getHubs();
  (Object.values(hubs): any).forEach((hub: HUB_TYPE) => {
    stopPairingById(hub.id)
      .then(() => console.debug('SDK: pairingStopped: ', hub.id))
      .catch(() => console.log('SDK: pairingStopped error: ', hub.id));
  });
}

/*
** Polling
*/
const pollIntervals: Object = {};
const pollingStopped: Object = {};
const pollTimeStamp: Object = {};
const pollInAction: Object = {};
const secondPoll: Object = {};


/**
 * Do poll on given hub if hub connection is ok.
 * Remote polls are executed only every second call.
 * @param {string} hubId
 * @param {booleam} reset - set true for full scan, false if delta only
 * @return {Promise} status or error
 */
export function doPoll(hubId: string, reset: boolean = false): Promise<Object> {
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
    const hub: HUB_TYPE = getHubs()[hubId];

    if (!hub || (hub.connectionState !== HUB_CONNECTION_STATES.LOCAL && hub.connectionState !== HUB_CONNECTION_STATES.REMOTE)) {
      console.warn('SDK doPoll: No Hub connection');
      reject(new Error('doPoll error: No Hub connection'));
      return;
    }

    console.debug('doPoll connection state: ', hub.connectionState);

    // just return every second -> not doing so often as in local connection
    if (hub.connectionState === HUB_CONNECTION_STATES.REMOTE && !doReset) {
      if (secondPoll[hubId]) {
        secondPoll[hubId] = false;
        resolve('skipped');
        return;
      }
      secondPoll[hubId] = true;
    }

    const { authKey } = storedUser();
    const { hubKey } = hub;

    if (pollInAction[hubId]) {
      reject(new Error('doPoll error: Already polling'));
      return;
    }
    pollInAction[hubId] = true;

    send({
      command: COMMANDS.POLL, hubId, authKey, hubKey, localUrl: hub.url, data: { ts: pollTimeStamp[hubId] },
    })
      .then((deltas) => {
        if (deltas) {
        // console.log(JSON.stringify(deltas));
        // Return can be null poll, even if not asked that
          if (pollTimeStamp[hubId] === 0 || deltas.full) {
            doReset = true;
          }

          pollTimeStamp[hubId] = deltas.timestamp;

          deltas.polls.forEach((delta) => {
            switch (delta.type) {
              case 'DEVICE_DELTA': {
                devicesDeltaHandler(hubId, doReset, delta.devices);
                break;
              }
              case 'GROUP_DELTA': {
                break;
              }
              case 'SCENE_DELTA': {
                break;
              }
              case 'RULE_DELTA': {
                break;
              }
              case 'USERS_DELTA': {
                break;
              }
              case 'ROOM_DELTA': {
                roomsDeltaHandler(hubId, doReset, delta.rooms);
                break;
              }
              case 'ZONE_DELTA': {
                break;
              }
              case 'USER_ALERTS': {
                break;
              }
              case 'ALARM_DELTA': {
                alarmsDeltaHandler(hubId, doReset, delta.alarms);
                break;
              }
              default: {
                break;
              }
            }
          });
        }
        pollInAction[hubId] = false;
        resolve(deltas);
      })
      .catch((error) => {
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
export function startPollingById(hubId: string): Promise<Object> {
  pollingStopped[hubId] = false;
  const intervalTime = POLL_INTERVAL_MS;
  const pollCall = (callHubId) => doPoll(callHubId).then(() => {}).catch(() => {});
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
export function stopPollingById(hubId: string) {
  pollingStopped[hubId] = true;
  clearInterval(pollIntervals[hubId]);
}


/**
 * Select hub by id, starts hub polling
 * @param  {string} hubId
 * @param  {boolean} poll - flag to start polling when connected, defaults to false
 * @return {Promise} status or error
 */
export function selectHubById(hubId: string, poll: boolean = false): Promise<Object> {
  return new Promise((resolve, reject) => {
    const hubs: HUBS_MAP_TYPE = getHubs();
    if (!isEmpty(hubs)) {
      let pollingHub = null;
      let error = null;
      (Object.values(hubs)).every((hub: any) => {
        if (hubId === hub.id) {
          store.dispatch(hubsState.actions.selectHub({ hubId: hub.id }));
          if (hub.hubKey && poll) {
            pollingHub = startPollingById(hub.id);
            return false; // break
          }
          if (!hub.hubKey) {
            console.error('SDK selectHubById: No hub key error');
            error = (new Error('no hubKey'));
            return false; // break
          }
          console.debug('SDK selectHubById: Ready to start polling');
          return false; // break
        }
        return true; // continue
      });
      if (pollingHub) {
        return pollingHub.then((status) => resolve(status)).catch(() => resolve('polling started'));
      }
      if (error) {
        reject(error);
      } else if (!pollingHub && poll) {
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
export function unSelectHubById(hubId: string) {
  const hubs: HUBS_MAP_TYPE = getHubs();
  (Object.values(hubs): any).forEach((hub: HUB_TYPE) => {
    if (hubId === hub.id) {
      store.dispatch(hubsState.actions.unSelectHub({ hubId: hub.id }));
      stopPollingById(hub.id);
    }
  });
}

/**
 * Unselect hubs, stops hub pollings
 * @return none
 */
export function unSelectHubs() {
  const hubs: HUBS_MAP_TYPE = getHubs();
  (Object.values(hubs): any).forEach((hub: HUB_TYPE) => {
    store.dispatch(hubsState.actions.unSelectHub({ hubId: hub.id }));
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
export function connectHubByTokens(hubId: string, hubKey: string, discovery: boolean = false, sync: boolean = true): Promise<Object> {
  return new Promise((resolve, reject) => {
    const { authKey } = storedUser();
    if (!hubId) reject(new Error('No Hub Id'));
    if (!hubKey) reject(new Error('No hubKey'));
    if (!authKey) reject(new Error('No AuthKey'));
    const tokens = {};
    tokens[hubId] = hubKey;
    makeHubsMap(tokens, discovery, sync).then(() => {
      selectHubById(hubId, false).then(() => {
        resolve(getHubs());
      }).catch((error) => reject(error));
    }).catch((error) => reject(error));
  });
}

/*
 * Listener of User state changes
 * Hub discovery is started when user's new state is AUTHENTICATED
 */
watchChanges('user.state', (newState) => {
  // Start discovery when user is authenticated
  if (newState === USER_STATES.AUTHENTICATED) {
    startDiscoveringHubs();
  }
});
