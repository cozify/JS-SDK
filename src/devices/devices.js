// @flow
import { store } from '../store';
import { devicesState } from '../reducers/devices';

import type { DEVICES_MAP_TYPE, HUB_DEVICES_MAP_TYPE } from './constants';


/**
 * Get devices of all selected hubs
 * @return {HUB_DEVICES_MAP_TYPE}
 */
export function getDevices(): HUB_DEVICES_MAP_TYPE {
  const stateNow = store.getState();
  return devicesState.selectors.getDevices(stateNow);
}

/**
 * Get devices of given hub
 * @param  {string} hubId
 * @return {DEVICES_MAP_TYPE}
 */
export function getHubDevices(hubId: string): ?DEVICES_MAP_TYPE {
  let retVal: ?DEVICES_MAP_TYPE;
  const devices: HUB_DEVICES_MAP_TYPE = getDevices();
  if (devices && devices[hubId]) {
    retVal = devices[hubId];
  }
  return retVal;
}

/**
 * Device handler for poll delta results
 * @param  {string} hubId
 * @param  {boolean} reset
 * @param  {Object} devices
 */
export function deviceDeltaHandler(hubId: string, reset: boolean, devices: Object) {
  let oldHubDevices: DEVICES_MAP_TYPE = {};
  const storedDevices: HUB_DEVICES_MAP_TYPE = getDevices();
  if (storedDevices && storedDevices[hubId]) {
    oldHubDevices = storedDevices[hubId];
  }

  if (reset) {
    // If reset then set  devices as they are received
    const stateDevices = {
      hubId,
      devices,
    };
    store.dispatch(devicesState.actions.setDevices(stateDevices));
  } else {
    // Loop devices to check could it be added or should be removed
    Object.entries(devices).forEach(([key, device]) => {
      const stateDevice = {
        hubId,
        device,
      };
      if (key && device) {
        store.dispatch(devicesState.actions.setDevice(stateDevice));
      } else if (key && oldHubDevices[key]) {
        store.dispatch(devicesState.actions.deleteDevice(stateDevice));
      }
    });
  }
}
