// @flow
import isEmpty from 'lodash/isEmpty';
import {
  POLL_INTERVAL_MS, PAIRING_POLL_INTERVAL_MS, HUB_PROTOCOL, HUB_PORT,
} from './constants';
import { USER_STATES, ROLES } from '../user/constants';
import { HUB_CONNECTION_STATES } from '../connection/constants';
import { COMMANDS, send, sendAll } from '../connection/send';

import { devicesDeltaHandler, pairingDevicesDeltaHandler } from '../devices/devices';
import { roomsDeltaHandler } from '../rooms/rooms';
import { urlBase64Decode } from '../utils';
import { store, watchChanges } from '../store';
import { hubsState } from '../reducers/hubs';
import { userState } from '../reducers/user';

import type { HUB_TYPE, HUBS_MAP_TYPE } from './constants';


let hubsMap: HUBS_MAP_TYPE = {};


/*
 * Helper method to extract hub info from JWT based hub keys
 */
function extractHubInfo(HUBKeys: { [hubId: string]: string }): HUBS_MAP_TYPE {
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
 * Remote hub metamata request for version etc information
 */
function doRemoteIdQuery(hubId: string, authKey: string, hubKey: string): Promise<any> {
  return new Promise((resolve, reject) => {
    send({
      command: COMMANDS.CLOUD_META, authKey, hubKey, hubId,
    })
      .then((hubData) => {
        updateFoundHub(undefined, hubData);
        resolve(hubId);
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
 * Fetch HUB IP addresses in the same network
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
 * Fetch hub metadatas
 */
function fetchMetaData(hubs: HUBS_MAP_TYPE, authKey: string): Promise<Object> {
  return new Promise((resolve) => {
    const queries = [];
    (Object.values(hubs): any).forEach((hub: HUB_TYPE) => {
      if (hub.hubKey) {
        queries.push(doRemoteIdQuery(hub.id, authKey, hub.hubKey));
      }
    });
    sendAll(queries)
      .then((values) => {
        console.debug('fetchMetaData values', values);
      })
      .catch((error) => {
        console.debug('fetchMetaData error', error);
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
          hubsMap = extractHubInfo(tokens);
          store.dispatch(hubsState.actions.updateHubs(hubsMap));
          fetchMetaData(hubsMap, authKey)
            .finally(() => {
              doCloudDiscovery();
              resolve(getHubs());
            });
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


const discoveryInterval: ?Object = undefined;

/**
 * Start discovering hubs every DISCOVERY_INTERVAL_MS
 * Sequence includes requests of hub-keys, remote meta-infos, lan-ips and local meta-infos
 */
export function startDiscoveringHubs() {
  if (!discoveryInterval) {
    // call immediately...
    fetchHubs();
    // and then every DISCOVERY_INTERVAL_MS (30s?)
    // discoveryInterval = setInterval(fetchHubs, DISCOVERY_INTERVAL_MS);
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
let pairingStopped: boolean = false;
let pairingTimeStamp: number = 0;
let pairingInAction: boolean = false;


/*
 * Do pairing if hub connection is ok
 * Remote pairing is executed only every second call
 * @param {string} hubId
 * @param {booleam} reset - set true for full scan, false if delta only
 * @return none
 */
function doPairing(hubId: string, reset: boolean) {
  if (pairingStopped) {
    console.debug('doPairing: pairing stopped');
    return;
  }
  const hub: HUB_TYPE = getHubs()[hubId];
  const { authKey } = storedUser();
  const { hubKey } = hub;

  console.debug('doPairing connection state: ', hub.connectionState);
  if (hub.connectionState !== HUB_CONNECTION_STATES.LOCAL && hub.connectionState !== HUB_CONNECTION_STATES.REMOTE) {
    console.error('SDK doPairing error: no Hub connection');
    return;
  }

  if (pairingInAction) {
    return;
  }
  pairingInAction = true;

  // reset = pairingTimeStamp === 0;
  if (reset) pairingTimeStamp = 0;

  send({
    command: COMMANDS.PAIR_START, hubId, authKey, hubKey, localUrl: hub.url, data: { ts: pairingTimeStamp },
  })
    .then((delta) => {
      if (delta) {
        pairingTimeStamp = delta.timestamp;
        switch (delta.type) {
          case 'SCAN_DELTA': {
            pairingDevicesDeltaHandler(hubId, reset, delta.devices);
            break;
          }
          default: {
            break;
          }
        }
      }
      pairingInAction = false;
    })
    .catch((error) => {
    // store.dispatch(hubsState.actions.hubPollFailed())
      console.error('SDK: doPairing error: ', error.message);
      pairingInAction = false;
    });
}

/**
 * Set pairing ignore flag of given device in given hub
 * @param {string} hubId
 * @param {string} deviceId
 * @param {boolean} ignore
 * @return none
 */
export function ignorePairing(hubId: string, deviceId: string, ignore: boolean) {
  const { authKey } = storedUser();
  const hub: HUB_TYPE = getHubs()[hubId];
  const { hubKey } = hub;
  send({
    command: COMMANDS.PAIR_IGNORE, hubId, authKey, hubKey, localUrl: hub.url, data: { id: deviceId, ignored: ignore },
  })
    .then((data) => {
      console.debug('SDK: scanIgnore: Ok , data: ', data);
    })
    .catch((error) => {
    // store.dispatch(hubsState.actions.hubPollFailed())
      console.error('SDK: scanIgnore error: ', error.message);
    });
}


/**
 * Start pairing on given hub
 * @param {string} hubId
 * @param {booleam} reset - set true for full scan, false if delta only
 * @return none
 */
export function startPairing(hubId: string, reset: boolean) {
  const intervalTime = PAIRING_POLL_INTERVAL_MS;
  pairingStopped = false;
  doPairing(hubId, reset);
  pairingIntervals[hubId] = setInterval(doPairing, intervalTime, hubId, reset);
}

let stopPairingInAction = false;
/**
 * Stop pairing on given hub
 * @param {string} hubId
 * @return none
 */
export function stopPairing(hubId: string) {
  if (stopPairingInAction) {
    return;
  }
  stopPairingInAction = true;

  const { authKey } = storedUser();
  const hub: HUB_TYPE = getHubs()[hubId];
  const { hubKey } = hub;


  clearInterval(pairingIntervals[hubId]);
  send({
    command: COMMANDS.PAIR_STOP, hubId, authKey, hubKey, localUrl: hub.url,
  })
    .then((data) => {
      console.debug('SDK: pairingStopped: Ok , data: ', data);
      pairingStopped = true;
      stopPairingInAction = false;
    })
    .catch((error) => {
    // store.dispatch(hubsState.actions.hubPollFailed())
      console.error('SDK: pairingStopped error: ', error.message);
      stopPairingInAction = false;
    });
}


/*
** Polling
*/

const pollIntervals: Object = {};
let pollingStopped: boolean = false;
let pollTimeStamp: number = 0;
let pollInAction: boolean = false;
let secondPoll: boolean = false;


/**
 * Do poll on given hub if hub connection is ok
 * @param {string} hubId
 * Remote poll is executed only every second call
 */
function doPoll(hubId: string) {
  if (pollingStopped) {
    console.debug('doPolling: polling stopped');
    return;
  }

  const hub: HUB_TYPE = getHubs()[hubId];
  console.debug('doPoll connection state: ', hub.connectionState);
  if (hub.connectionState !== HUB_CONNECTION_STATES.LOCAL && hub.connectionState !== HUB_CONNECTION_STATES.REMOTE) {
    console.error('SDK doPoll error: No Hub connection');
    return;
  }

  // just return every second -> not doing so often as in local connection
  if (hub.connectionState === HUB_CONNECTION_STATES.REMOTE) {
    if (secondPoll) {
      secondPoll = false;
      return;
    }
    secondPoll = true;
  }

  const { authKey } = storedUser();
  const { hubKey } = hub;

  if (pollInAction) {
    return;
  }
  pollInAction = true;

  let reset = pollTimeStamp === 0;
  send({
    command: COMMANDS.POLL, hubId, authKey, hubKey, localUrl: hub.url, data: { ts: pollTimeStamp },
  })
    .then((deltas) => {
      if (deltas) {
      // console.log(JSON.stringify(deltas));
      // Return can be null poll, even if not asked that
        if (pollTimeStamp === 0 || deltas.full) {
          reset = true;
        }

        pollTimeStamp = deltas.timestamp;

        deltas.polls.forEach((delta) => {
          switch (delta.type) {
            case 'DEVICE_DELTA': {
              devicesDeltaHandler(hubId, reset, delta.devices);
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
              roomsDeltaHandler(hubId, reset, delta.rooms);
              break;
            }
            case 'ZONE_DELTA': {
              break;
            }
            case 'ALARM_DELTA': {
              break;
            }
            default: {
              break;
            }
          }
        });
      }
      pollInAction = false;
    })
    .catch((error) => {
    // store.dispatch(hubsState.actions.hubPollFailed())
      console.error('SDK doPoll error: ', error.message);
      pollInAction = false;
    });
}


/**
 * Start polling on given hub
 * @param {string} hubId
 * @return none
 */
export function startPolling(hubId: string) {
  pollingStopped = false;
  const intervalTime = POLL_INTERVAL_MS;
  pollIntervals[hubId] = setInterval(doPoll, intervalTime, hubId);
}

/**
 * Stop polling on given hub
 * @param {string} hubId   - hub id to be selected
 * @return none
 */
export function stopPolling(hubId: string) {
  pollingStopped = true;
  clearInterval(pollIntervals[hubId]);
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
      stopPolling(hub.id);
    }
  });
}


/**
 * Select hub by id, starts hub polling
 * @param  {string} hubId   - hub id to be selected
 * @param  {boolean} poll  - flag to start polling when connected, defaults to false
 * @return none
 */
export function selectHubById(hubId: string, poll: boolean = false) {
  const hubs: HUBS_MAP_TYPE = getHubs();

  (Object.values(hubs): any).forEach((hub: HUB_TYPE) => {
    if (hubId === hub.id) {
      store.dispatch(hubsState.actions.selectHub({ hubId: hub.id }));
      if (hub.hubKey && poll) {
        startPolling(hub.id);
      } else {
        if (!hub.hubKey) {
          console.error('SDK selectHubById: No hub key error');
        }
        console.debug('SDK selectHubById: Ready to start polling');
      }
    }
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
