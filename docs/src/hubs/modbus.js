// 
// import isEmpty from 'lodash/isEmpty';
import { HUB_CONNECTION_STATES } from '../connection/constants';
import { COMMANDS, send } from '../connection/send';
import { store } from '../store';
import { hubsState } from '../reducers/hubs';
import { userState } from '../reducers/user';



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

// const modbusDevices: Object = {};

/*
 * Get hub modbus devices
 * @param {string} hubId
 * @return {Promise}
 */
export async function getModbusDevicePairings(hubId) {
  return new Promise((resolve, reject) => {
    const hub = getHubs()[hubId];
    const { authKey } = storedUser();
    const { hubKey } = hub;

    console.debug('getModbusDevices connection state: ', hub.connectionState);
    if (hub.connectionState !== HUB_CONNECTION_STATES.LOCAL && hub.connectionState !== HUB_CONNECTION_STATES.REMOTE) {
      console.warn('SDK getModbusDevices: no Hub connection');
      reject(new Error('no hub connection'));
      return;
    }

    send({
      command: COMMANDS.GET_MODBUS_DEVICE_PAIRINGS, hubId, authKey, hubKey, localUrl: hub.url, data: [],
    })
      .then((data) => {
        console.info('SDK: getModbusDevicePairings success: ', data);
        return resolve(data);
      })
      .catch((error) => {
        console.error('SDK: getModbusDevicePairings error: ', error.message);
        reject(error);
      });
  });
}

/*
 * Set hub modbus devices
 * @param {string} hubId
 * @param {MODBUS_DEVICE_PAIRING_TYPES} modbusDevices
 * @return {Promise}
 */
export async function setModbusDevicePairings(hubId, modbusDevices) {
  return new Promise((resolve, reject) => {
    const hub = getHubs()[hubId];
    const { authKey } = storedUser();
    const { hubKey } = hub;

    console.debug('setModbusDevices connection state: ', hub.connectionState);
    if (hub.connectionState !== HUB_CONNECTION_STATES.LOCAL && hub.connectionState !== HUB_CONNECTION_STATES.REMOTE) {
      console.warn('SDK setModbusDevices: no Hub connection');
      reject(new Error('no hub connection'));
      return;
    }

    let invalidData = false;
    const data = [];
    modbusDevices.map((device) => {
      if (!device.address) {
        invalidData = true;
        reject(new Error('Invalid address'));
      }
      if (!device.deviceType) {
        invalidData = true;
        reject(new Error('Invalid device type'));
      }
      const item = {
        address: Number(device.address),
        deviceType: device.deviceType,
        name: device.name || '',
        readDeviceIdSupported: device.readDeviceIdSupported,
        registerRequired: device.registerRequired,
        register: undefined,
        registerType: undefined,
        normallyOff: false,
        type: 'PAIR_MODBUS',
      };
      if (device.deviceType === 'RELAY' || device.deviceType === 'SIGNAL') {
        item.normallyOff = !!device.normallyOff;
      }
      if ((device.name != null) && (device.name.length > 0) && (device.address != null) && ((device.address <= 247) && (device.address > 0))) {
        if (device.registerRequired) {
          if ((device.register != null) && (device.register >= 0) && (device.register <= 65535) && device.registerType) {
            item.registerRequired = true;
            item.register = Number(device.register);
            item.registerType = Number(device.registerType);
          } else {
            invalidData = true;
            reject(new Error('Invalid register data'));
          }
        } else {
          item.registerRequired = false;
        }
      } else {
        invalidData = true;
        reject(new Error('Invalid name or address data'));
      }
      data.push(item);
      return true;
    });

    if (!invalidData && data.length > 0) {
      send({
        command: COMMANDS.SET_MODBUS_DEVICE_PAIRINGS, hubId, authKey, hubKey, localUrl: hub.url, data,
      })
        .then((reply) => {
          console.info('SDK: setModbusDevicePairings success: ', reply);
          if (reply && reply === true) {
            return resolve(reply);
          }
          return reject(new Error(reply ? reply.message : 'unknown error'));
        })
        .catch((error) => {
          console.error('SDK: setModbusDevicePairings error: ', error.message);
          reject(error);
        });
    } else {
      reject(new Error('Invalid data'));
    }
  });
}
