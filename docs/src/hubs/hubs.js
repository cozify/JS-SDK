// 
import isEmpty from 'lodash/isEmpty'
import { HUB_STATES, POLL_INTERVAL_MS, HUB_PROTOCOL, HUB_PORT, DISCOVERY_INTERVAL_MS } from './constants'
import { USER_STATES } from '../user/constants';
import { HUB_CONNECTION_STATES } from '../connection/constants'
import { COMMANDS, send, sendAll } from '../connection/send'
import { getHubConnectionState } from '../connection/state'
import { ROLES } from '../user/constants'
import { deviceDeltaHandler } from '../devices/devices'
import { isNode, urlBase64Decode } from '../utils'
import { store, watchChanges } from "../store"
import { hubsState, hubsReducer } from "../reducers/hubs"
import { userState, userReducer } from "../reducers/user"






let _hubs = {}


/*
 * Helper method to extract hub info from JWT based hub keys
 */
function extractHubInfo(HUBKeys) {
  let hubs = {};
  for (let key in HUBKeys) {
      let coded = HUBKeys[key].split('.')[1];
      let decoded = urlBase64Decode(coded);
      let payload = JSON.parse(decoded);
      let info = {};
      info.id = payload.hubId || payload.hub_id;
      info.name = payload.hubName || payload.hub_name;
      info.hubKey = HUBKeys[key];
      info.connectionState = HUB_CONNECTION_STATES.UNCONNECTED;
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


/*
 * Hub metadata is received and will be stored
 */
function updateFoundHub(hubURL, foundHub) {
  // Hub keys returns ids, idQuerys return hubId
  if(foundHub.hubId){
    foundHub.id = foundHub.hubId;
    delete foundHub.hubId;
  }
  _hubs[foundHub.id].connected = foundHub.connected;
  _hubs[foundHub.id].features = foundHub.features;
  _hubs[foundHub.id].state = foundHub.state;
  _hubs[foundHub.id].version = foundHub.version;
  _hubs[foundHub.id].connectionState = foundHub.connected ? HUB_CONNECTION_STATES.REMOTE : HUB_CONNECTION_STATES.UNCONNECTED;
  if (hubURL) {
    _hubs[foundHub.id].connectionState = HUB_CONNECTION_STATES.LOCAL;
    _hubs[foundHub.id].url =  hubURL
  } else {
    _hubs[foundHub.id].url =  undefined
  }


}

/*
 * Remote hub metamata request for version etc information
 */
function doRemoteIdQuery(hubId, authKey, hubKey) {
  return new Promise( (resolve, reject) => {
    send( {command: COMMANDS.CLOUD_META, authKey: authKey, hubKey: hubKey, hubId: hubId })
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
function doLocalIdQuery(ip) {
  return new Promise( (resolve, reject) => {
    if (ip) {
      const hubURL = HUB_PROTOCOL + ip + ":" + HUB_PORT
      const url = hubURL + "/hub";
      send( {url: url} )
      .then((hubData) => {
        updateFoundHub(hubURL, hubData)
        resolve(ip)
      })
      .catch((error) => {
        console.log(`doLocalIdQuery ${ip} error `, error.message);
        resolve(ip);
      });
    } else {
      resolve()
    }
  });
}

/*
 * Fetch HUB IP addresses in the same network
 */
function doCloudDiscovery() {
  return new Promise( (resolve, reject) => {
    send( {command: COMMANDS.CLOUD_IP })
    .then((ips) => {
      let queries = []
      if (ips && !isEmpty(ips)) {
        for(var ip of ips){
          queries.push(doLocalIdQuery(ip));
        }
      }
      sendAll(queries)
      .finally(() => {
        // mark selected hubs to be selected after
        setSelectedHubs(_hubs);
        store.dispatch(hubsState.actions.updateHubs(_hubs));
        resolve('ok');
      });
    })
    .catch((error) => {
      console.error("doCloudDiscovery error: ", error.message);
      store.dispatch(hubsState.actions.updateHubs(_hubs));
      resolve('error');
    });
  });
}

/*
 * Fetch hub metadatas
 */
function fetchMetaData(hubs, authKey) {
  return new Promise( (resolve, reject) => {
    let queries = []
    for (var hub of (Object.values(hubs)) ) {
      if (hub.hubKey){
        queries.push(doRemoteIdQuery(hub.id, authKey, hub.hubKey));
      }
    }
    sendAll(queries)
    .then( values => {
      //console.log(values);
    })
    .catch(error => {
      //console.log(error);
    })
    .finally(() => {
        resolve();
    });
  });
}

/*
 * Check hubs that are currently selected and mark them selected also in map of given hubs
 */
function setSelectedHubs(newHubs) {
  const hubs = getHubs();
  for (var hub of (Object.values(hubs)) ) {
    if (hub.selected) {
      const selectedNewHub = newHubs[hub.id]
      if (selectedNewHub) {
        selectedNewHub.selected = true
      }
    }
  }
}


/*
 * Fetch Hub keys by user authKey and start fetching hub meta datas
 */
function fetchHubs() {
  const authKey = storedUser().authKey;
  return new Promise( (resolve, reject) => {

    if (!authKey) {
      reject('No userKey!');
      return;
    }
    send({ command: COMMANDS.HUB_KEYS,  authKey: authKey })
    .then((tokens) => {
      if (tokens) {
        _hubs = extractHubInfo(tokens);
        fetchMetaData(_hubs, authKey)
        .finally(() => {
          doCloudDiscovery();
          resolve(getHubs());
        });
      } else {
        resolve(getHubs());
      }
    })
    .catch((error) => {
      console.error("fetchHubTokens error: ", error.message);
      reject(error)
    });
  });
}


let _discoveryInterval = undefined;

/**
 * Start discovering hubs every DISCOVERY_INTERVAL_MS
 * Sequence includes requests of hub-keys, remote meta-infos, lan-ips and local meta-infos
 */
export function startDiscoveringHubs() {
  if (!_discoveryInterval) {
    fetchHubs(); // call immediately and then every 30s
    //_discoveryInterval = setInterval(fetchHubs, DISCOVERY_INTERVAL_MS);
  }
}

/**
 * Stop discovering hubs
 */
export function stopDiscoveringHubs() {
  clearInterval(_discoveryInterval);
}


/**
 * Unselect hub by id, stops hub polling
 * @param  {string} selectedId   - hub id to be selected
 */
export function unSelectHubById( selectedId ) {
  const hubs = getHubs();
  for (var hub of (Object.values(hubs)) ) {
    if (selectedId === hub.id) {
      store.dispatch(hubsState.actions.unSelectHub(hub.id));
      stopPolling(hub.id);
    }
  }
}


/**
 * Select hub by id, starts hub polling
 * @param  {string} selectedId   - hub id to be selected
 */
export function selectHubById( selectedId ) {
  const hubs = getHubs();
  for (var hub of (Object.values(hubs)) ) {
    if (selectedId === hub.id) {
      store.dispatch(hubsState.actions.selectHub(hub.id));
      startPolling(hub.id);
    }
  }
}



/*
** Polling
*/

let _pollIntervals= {};
let _pollTimeStamp = 0;
let _pollInAction = false;
let _secondPoll = false;

/*
 * Do poll if hub connection is ok
 * Remote poll is executed only every second call
 */
function doPoll(hubId){

  const hub = getHubs()[hubId];
  if (hub.connectionState !== HUB_CONNECTION_STATES.LOCAL && hub.connectionState !== HUB_CONNECTION_STATES.REMOTE){
    return;
  }

  //just return every second -> not doing so often as in local connection
  if (hub.connectionState === HUB_CONNECTION_STATES.REMOTE){
    if (_secondPoll) {
      _secondPoll = false;
      return
    }
    _secondPoll = true;
  }

  const authKey = storedUser().authKey;
  const hubKey = hub.hubKey;

  if (_pollInAction) {
    return;
  }
  _pollInAction = true

  let reset = _pollTimeStamp === 0 ? true : false
  send( {command: COMMANDS.POLL, hubId:hubId, authKey: authKey, hubKey: hubKey, localUrl: hub.url, data: {ts:_pollTimeStamp} })
  .then((deltas) => {
    if (deltas) {
      //console.log(JSON.stringify(deltas));
      // Return can be null poll, even if not asked that
      if (_pollTimeStamp === 0 || deltas.full) {
        reset = true
      }

      _pollTimeStamp = deltas.timestamp

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
    _pollInAction = false;
  })
  .catch((error) => {
    //store.dispatch(hubsState.actions.hubPollFailed())
    console.error("doPoll error: ", error.message);
    _pollInAction = false;
  });
}

/*
 * Start polling of given hub
 */
function startPolling(hubId) {
  const intervalTime = POLL_INTERVAL_MS;
  _pollIntervals[hubId] = setInterval(doPoll, intervalTime, hubId);
}

/*
 * Stop polling of given hub
 */
function stopPolling(hubId) {
  clearInterval(_pollIntervals[hubId]);
}


/**
 * Helper to get current user from state
 */
function storedUser() {
  return userState.selectors.getUser(store.getState());
}

/**
 * Helper to get current hubs from state
 * @return {HUBS_MAP_TYPE} - hubs
 */
export function getHubs() {
  return hubsState.selectors.getHubs(store.getState());
}


/*
 * Listener of User state changes
 * Hub discovery is started when user's new state is AUTHENTICATED
 */
watchChanges('user.state', (newState, oldState) => {
  // Start discovery when user is authenticated
  if (newState === USER_STATES.AUTHENTICATED) {
    startDiscoveringHubs();
  }
});
