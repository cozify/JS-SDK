// @flow
import isEmpty from 'lodash/isEmpty'
import { HUB_STATES, REMOTE_POLL_INTERVAL_MS, HUB_PROTOCOL, HUB_PORT } from './constants'
import { HUB_CONNECTION_STATES } from '../connection/constants'
import { events } from '../events/events'
import { EVENTS } from '../events/constants'
import { COMMANDS, send, sendAll } from '../connection/send'
import { ROLES } from '../user/constants'
import { deviceDeltaHandler } from '../devices/devices'
import { isNode } from '../utils'
import { getStore } from "../store"
import { hubsState, hubsReducer } from "../reducers/hubs"
import { userState, userReducer } from "../reducers/user"

import type { HUB_STATES_TYPE } from './constants'




let _hubState: HUB_STATES_TYPE = HUB_STATES.LOST;

let _hubs: Object = {}


/**
 * Helper method to Base64 decode
 * @param  {string} str - string to be decoded
 * @return {<string>}  - decoded string
 */
function urlBase64Decode(encoded): string {
  let str = encoded.replace(/-/g, "+").replace(/_/g, "/");
  let output = str;
  switch (output.length % 4) {
      case 0:
      case 2:
          output += "==";
          break;
      case 3:
          output += "=";
          break;
      default:
          throw "Illegal base64url string!"
  }
  var retVal = "";

  let atob = function(a:string) {};
  if(!isNode){
    atob  = window.atob;
  } else {
    atob = function(a) {
      return new Buffer(a, 'base64').toString('binary');
    };
  }

  try {
        retVal = atob(str);
  } catch(error){
      try {
        retVal = atob(output);
      } catch(error){
        console.error( "urlBase64Decode: trying atob failed");
      }
  }
  return retVal
}

/**
 * Helper method to extract hub info from JWT based hub keys
 * @param  {{Object<HubKeys>}} HubKeys - map of hub keys
 * @return {Object<HubInfo>}  - map of hub information
 */
function setHubInfo(HUBKeys: Object): {} {
  let hubs = {};
  for (let key in HUBKeys) {
      let coded = HUBKeys[key].split('.')[1];
      let decoded = urlBase64Decode(coded);
      let payload = JSON.parse(decoded);
      let info = {};
      info.id = payload.hubId || payload.hub_id;
      info.name = payload.hubName || payload.hub_name;
      info.hubKey = HUBKeys[key];
      info.connectionState = undefined;
      if (payload.role){
          info.role = payload.role;
          info.roleString = ''
          Object.keys(ROLES).forEach( (key)=> {
            if (ROLES[key] === info.role)
              info.roleString = key
          });
      }
      hubs[ info.id ] = info;
  }
  return hubs;
}

/**
 * Hub metadata is received and will be stored
 * @param  {string} url
 * @param  {Object} foundHub
 */
export function updateFoundHub(hubURL: string, foundHub) {
  const hubData = {}
  hubData[foundHub.hubId] = {
    connectionState: HUB_CONNECTION_STATES.REMOTE,
    connected: foundHub.connected,
    features: foundHub.features,
    state: foundHub.state,
    version: foundHub.version
  }
  if (hubURL) {
    hubData[foundHub.hubId].connectionState = HUB_CONNECTION_STATES.LOCAL;
    hubData[foundHub.hubId].url =  hubURL
  }
  console.log("Hub metadata found ", JSON.stringify(hubData));
  getStore().dispatch(hubsState.actions.updateHubs(hubData));

}

/**
 * Remote hub metamata request for version etc information
 * @param  {string} authKey - user authKey
 */
function doRemoteIdQuery(hubId, authKey, hubKey) {
  return new Promise( (resolve, reject) => {
    send( {command: COMMANDS.CLOUD_META, authKey: authKey, hubKey: hubKey, hubId: hubId })
    .then((hubData) => {
      updateFoundHub(undefined, hubData);
      resolve(hubId);
    }).catch((error) => {
      console.log(`doRemoteIdQuery ${hubId} error `, error.message);
      reject(hubId);
    });
  });
}

/**
 * Local hub metadata request for version etc information
 * @param  {string} authKey - user authKey
 */
function doLocalIdQuery(ip: string) {
  if (ip) {
    const hubURL = HUB_PROTOCOL + ip + ":" + HUB_PORT
    const url = hubURL + "/hub";
    send( {url: url })
    .then((hubData) => {
      updateFoundHub(hubURL, hubData)
    });
  }
}

/**
 * Fetch HUB IP addresses in the same network
 * @param  {string} authKey   - user authKey
 */
function doCloudDiscovery(authKey: string) {
  send( {command: COMMANDS.CLOUD_IP }) //,  authKey: authKey })
  .then((ips) => {
    if (ips && !isEmpty(ips)) {
      console.log("doCloudDiscovery ", JSON.stringify(ips));
      for(var ip of ips){
        doLocalIdQuery(ip)
      }
    }
  })
  .catch((error) => {
    console.error("doCloudDiscovery error: ", error.message);
  });
}

/**
 * Fetch hub metadatas
 * @param  {string} authKey   - user authKey
 */
function fetchMetaData(authKey: string) {
  const hubs = getHubs();

  let queries = []
  for (var hub of Object.values(hubs)) {
    queries.push(doRemoteIdQuery(hub.id, authKey, hub.hubKey))
  }
  sendAll(queries)
  .then( values => {
    //console.log(values);
  })
  .catch(error => {
    //console.log(error);
  })
  .finally(() => {
    doCloudDiscovery();
  });
}

/**
 * Fetch Hub Tokens by given authKey and start fetching hub meta datas
 * @param  {string} authKey   - user authKey got from login
 * @return {Promise<Object>}
 */
export function fetchHubTokens( authKey: string ): Promise<Object> {
  return new Promise( (resolve, reject) => {
    send( {command: COMMANDS.HUB_KEYS,  authKey: authKey })
    .then((tokens) => {
      if (tokens) {
        const hubs = setHubInfo(tokens);
        getStore().dispatch(hubsState.actions.updateHubs(hubs));
        events.emit(EVENTS.HUBS_LIST_CHANGED, getHubs());
        fetchMetaData(authKey);
      }
      resolve(authKey: string);
    })
    .catch((error) => {
      console.error("fetchHubTokens error: ", error.message);
      reject(error)
    });
  });
}

/**
 * Un select hub by id
 * @param  {string} selectedId   - id to be selected
 */
export function unSelectHubById( selectedId: string ) {
  const hubs = getHubs();
  for (var hub of Object.values(hubs)) {
    if (selectedId === hub.id) {
      getStore().dispatch(hubsState.actions.unSelectHub(hub.id));
      stopPolling(hub.id);
    }
  }
}

/**
 * Select hub by id
 * @param  {string} selectedId   - id to be selected
 */
export function selectHubById( selectedId: string ) {
  const hubs = getHubs();
  for (var hub of Object.values(hubs)) {
    if (selectedId === hub.id) {
      getStore().dispatch(hubsState.actions.selectHub(hub.id));
      startPolling(hub);
    }
  }
}



/*
** Polling
 */

let pollIntervals = {}
let pollTimeStamp = 0


export function doPoll(hubId: string){
  const hub = getHubs()[hubId];
  const authKey = storedUser().authKey;
  const hubKey = hub.hubKey;
  const reset = pollTimeStamp === 0 ? true : false
  send( {command: COMMANDS.POLL, hubId:hubId, authKey: authKey, hubKey: hubKey, localUrl: hub.url, data: {ts:pollTimeStamp} })
  .then((deltas) => {
    if (deltas) {
      //console.log(JSON.stringify(deltas));
      pollTimeStamp = deltas.timestamp
      // Return can be null poll, even if not asked that
      if (pollTimeStamp === 0) {
        reset = true
      }
      for (let delta of deltas.polls) {
        switch(delta.type) {
          case "DEVICE_DELTA": {
            deviceDeltaHandler(hubId, reset, delta.devices)
            break;
          }
          case "GROUP_DELTA": {
            break;
          }
          case "SCENE_DELTA": {
            break;
          }
          case "RULE_DELTA": {
            break;
          }
          case "USERS_DELTA": {
            break;
          }
          case "ROOM_DELTA": {
            break;
          }
          case "ZONE_DELTA": {
            break;
          }
          case "ALARM_DELTA": {
            break;
          }
          default: {
            break;
          }
        }
      }
    }
  })
  .catch((error) => {
    //getStore().dispatch(hubsState.actions.hubPollFailed())
    console.error("doPoll error: ", error.message);
  });
}

export function startPolling(hub) {
  const intervalTime = REMOTE_POLL_INTERVAL_MS
  pollIntervals[hub.id] = setInterval(doPoll, intervalTime, hub.id);
}

export function stopPolling(hubId: string) {
  clearInterval(pollIntervals[hubId]);
}

function storedUser() {
  const stateNow = getStore().getState()
  const storedUser = userState.selectors.getUser(stateNow)
  return storedUser;
}

export function getHubs () {
  const stateNow = getStore().getState()
  const storedHubs = hubsState.selectors.getHubs(stateNow)
  return storedHubs;
}

