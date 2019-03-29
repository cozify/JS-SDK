// @flow
import isEmpty from 'lodash/isEmpty';
import { HUB_STATES } from './constants.js';
import type { HUB_STATES_TYPE } from './constants.js';
import { events } from '../events/events.js'
import { EVENTS } from '../events/constants.js'
import {send, COMMANDS} from '../connection/send.js'
import { ROLES } from '../user/constants.js';
import {isNode} from '../utils.js'



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
      info.connState = undefined;
      if (payload.role){
          info.role = payload.role;
          info.roleString = ''
          Object.keys(ROLES).forEach( (key)=> {
            if (ROLES[key] === info.role)
              info.roleString = key
          });
      }
      hubs[ info.name ] = info;
  }
  return hubs;
}

/**
 * fetch Hub Tokens by given authKey
 * @param  {string} authKey   - user authKey got from login
 * @return {Promise<Object>}
 */
export function fetchHubTokens( authKey: string ): Promise<Object> {
  return new Promise( (resolve, reject) => {
    let retVel = false;
    send( {command: COMMANDS.HUB_KEYS,  authKey: authKey })
      .then((tokens) => {
        if (tokens) {
          _hubs = setHubInfo(tokens);
          //console.log(JSON.stringify(_hubs));
          events.emit(EVENTS.HUBS_LIST_CHANGED, _hubs);
        }
        resolve(_hubs);
      })
      .catch((error) => {
        console.error("fetchHubTokens error: ", error.data);
        reject(error)
      });
  });

}

export function getHubs () {
  return _hubs;
}

