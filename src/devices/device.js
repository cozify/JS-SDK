
// @flow
import isEmpty from 'lodash/isEmpty';
import pick from 'lodash/pick';


import { send, COMMANDS } from '../connection/send';
import { store } from '../store';
import { userState } from '../reducers/user';
import { hubsState } from '../reducers/hubs';
import { HUB_CONNECTION_STATES, getCloudURL } from '../connection/constants';
// import type { COMMAND_TYPE } from '../connection/constants';

/**
 * Device state command to be sent
 * @param  {string} hubId
 * @param  {string} deviceId
 * @param  {Object} state
 * @param  {Array<string>} properties - optional properties
 * @return {Promise}
 */
export function sendDeviceStateCmd(hubId: string, deviceId: string, state: Object, properties?: Array<string>): Promise<Object> {
  return new Promise((resolve, reject) => {
    const stateNow = store.getState();
    const user = userState.selectors.getUser(stateNow);
    if (!user || !user.authKey) {
      console.error('SDK sendDeviceStateCmd error: No userKey!');
      reject(new Error('Device command error: No userKey!'));
      return;
    }

    const hubs = hubsState.selectors.getHubs(stateNow);
    if (!hubs[hubId] || (!hubs[hubId].hubKey && getCloudURL().indexOf('https://one.cozify.fi') === -1)) {
      console.error('SDK sendDeviceStateCmd error: No hubKey!');
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
      command: COMMANDS.CMD_DEVICE_STATE, authKey, hubId, hubKey, data: [{ id: deviceId, state: sendState }],
    })
      .then((response) => {
        console.debug('SDK sendDeviceCmd ok', response);
        resolve(response);
      })
      .catch((error) => {
        console.error(error);
        console.error('SDK sendDeviceStateCmd error:', error);
        reject(new Error('Device state command error!'));
      });
  });
}

/**
 * General device command to be sent
 * @param  {string} hubId
 * @param  {string} deviceId
 * @param  {Object} state
 * @param  {Array<string>} properties - optional properties
 * @return {Promise}
 */
export function sendDeviceCmd(hubId: string, deviceId: string, commandType: any, data: Object, properties?: Array<string>): Promise<Object> {
  return new Promise((resolve, reject) => {
    const stateNow = store.getState();
    const user = userState.selectors.getUser(stateNow);
    if (!user || !user.authKey) {
      console.error('SDK sendDeviceCmd error: No userKey!');
      reject(new Error('Device command error: No userKey!'));
      return;
    }

    const hubs = hubsState.selectors.getHubs(stateNow);
    const hub = hubs[hubId];
    let hubKey;
    if (hub && hub.hubKey) {
      hubKey = hub.hubKey;
    }
    if (!hub || (!hubKey && getCloudURL().indexOf('https://one.cozify.fi') === -1)) {
      console.error('SDK sendDeviceCmd error: No hubKey!');
      reject(new Error('Device command error: No hubKey!'));
      return;
    }

    if (hub.connectionState !== HUB_CONNECTION_STATES.LOCAL && hub.connectionState !== HUB_CONNECTION_STATES.REMOTE) {
      console.error('SDK sendDeviceCmd error: No Hub connection');
      reject(new Error('Device command error: No hub connection'));
      return;
    }


    const { authKey } = user;
    if (!authKey) {
      console.error('SDK sendDeviceCmd error: No authKey!');
      reject(new Error('Device command error: No authKey!'));
      return;
    }

    let sendData = data;
    if (!isEmpty(properties)) {
      sendData = pick(sendData, properties);
    }
    if (commandType) {
      send({
        command: commandType, method: undefined, authKey, hubId, localUrl: hub.url, hubKey, data: [sendData],
      })
        .then((response) => {
          console.debug('SDK sendDeviceCmd ok', response);
          resolve(response);
        })
        .catch((error) => {
          console.error('SDK sendDeviceCmd error:', error);
          reject(new Error('Device command error!'));
        });
    }
  });
}

export function setDeviceVisibility(hubId: string, deviceId: string, visible: boolean): Promise<Object> {
  return sendDeviceCmd(hubId, deviceId, COMMANDS.CMD_DEVICE_VISIBILITY, { id: deviceId, visible });
}
export function setDeviceLocked(hubId: string, deviceId: string, locked: boolean): Promise<Object> {
  return sendDeviceCmd(hubId, deviceId, COMMANDS.CMD_DEVICE_LOCK, { id: deviceId, locked });
}
export function setDeviceHotWater(hubId: string, deviceId: string, hotWater: boolean): Promise<Object> {
  return sendDeviceCmd(hubId, deviceId, COMMANDS.CMD_DEVICE_HOT_WATER, { id: deviceId, hotWater });
}
/**
 * Unpair device
 * @param  {string} hubId
 * @param  {string} deviceId
 * @return {Promise}
 */
export function unpairDevice(hubId: string, deviceId: string): Promise<Object> {
  return sendDeviceCmd(hubId, deviceId, COMMANDS.CMD_DEVICE_IGNORE, { id: deviceId });
}

/**
 * Identify device
 * @param  {string} hubId
 * @param  {string} deviceId
 * @return {Promise}
 */
export function identifyDevice(hubId: string, deviceId: string): Promise<Object> {
  return sendDeviceCmd(hubId, deviceId, COMMANDS.CMD_DEVICE_IDENTIFY, { id: deviceId });
}

/**
 * Identify device
 * @param  {string} hubId
 * @param  {string} deviceId
 * @param  {string} name
 * @param  {Array<string>} roomId
 * @return {Promise}
 */
export function setDeviceMeta(hubId: string, deviceId: string, name: string, rooms: Array<number>): Promise<Object> {
  return sendDeviceCmd(hubId, deviceId, COMMANDS.CMD_DEVICE_META, { id: deviceId, name, room: rooms });
}
