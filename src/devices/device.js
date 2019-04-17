
//@flow

import { send, COMMANDS } from '../connection/send.js'
import { store } from "../store.js"
import { userState } from "../reducers/user"
import { hubsState } from "../reducers/hubs"

/**
 * Device command
 * @param {string} id
 * @param {Object} state
 */
export function sendDeviceCmd(hubId: string, deviceId: string, state: Object): Promise<Object> {
  return new Promise( (resolve, reject) => {
     const stateNow = store.getState()

    const user = userState.selectors.getUser(stateNow);
    if (!user || !user.authKey) {
      reject('No userKey!');
      return;
    }

    const hubs = hubsState.selectors.getHubs(stateNow)
    if (!hubs[hubId] || !hubs[hubId].hubKey) {
      reject('No hubKey!');
      return;
    }

    const authKey = user.authKey;
    const hubKey = hubs[hubId].hubKey;

    send( {command: COMMANDS.CMD_DEVICE, authKey: authKey, hubKey: hubKey, data:[{id:deviceId, state:state}] })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        //console.error(error);
        reject(false)
      });
  });
}

