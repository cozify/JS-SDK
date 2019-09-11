
// 
import isEmpty from 'lodash/isEmpty';
import pick from 'lodash/pick';


import { send, COMMANDS } from '../connection/send';
import { store } from '../store';
import { userState } from '../reducers/user';
import { hubsState } from '../reducers/hubs';


/**
 * Device command to be sent
 * @param  {string} hubId
 * @param  {string} deviceId
 * @param  {Object} state
 * @param  {Array<string>} properties - optional properties
 * @return {Promise}
 */
export function sendDeviceCmd(hubId, deviceId, state, properties) {
  return new Promise((resolve, reject) => {
    const stateNow = store.getState();
    const user = userState.selectors.getUser(stateNow);
    if (!user || !user.authKey) {
      reject(new Error('Device command error: No userKey!'));
      return;
    }

    const hubs = hubsState.selectors.getHubs(stateNow);
    if (!hubs[hubId] || !hubs[hubId].hubKey) {
      reject(new Error('Device command error: No hubKey!'));
      return;
    }

    const { authKey } = user;
    const { hubKey } = hubs[hubId];
    let sendState = state;
    if (!isEmpty(properties)) {
      sendState = pick(sendState, properties);
    }

    send({
      command: COMMANDS.CMD_DEVICE, authKey, hubId, hubKey, data: [{ id: deviceId, state: sendState }],
    })
      .then((response) => {
        console.debug('sendDeviceCmd ok', response);
        resolve(response);
      })
      .catch((error) => {
        console.error(error);
        reject(new Error('Device command error!'));
      });
  });
}
