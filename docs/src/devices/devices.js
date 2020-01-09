// 
import { store } from '../store';
import { devicesState } from '../reducers/devices';
import { pairingsState } from '../reducers/pairings';



/**
 * Get devices of all selected hubs
 * @return {HUB_DEVICES_MAP_TYPE}
 */
export function getDevices() {
  const stateNow = store.getState();
  return devicesState.selectors.getDevices(stateNow);
}

/**
 * Get pairing devices of all selected hubs
 * @return {HUB_DEVICES_MAP_TYPE}
 */
export function getPairingDevices() {
  const stateNow = store.getState();
  return pairingsState.selectors.getPairings(stateNow);
}

/**
 * Get devices of given hub
 * @param  {string} hubId
 * @return {DEVICES_MAP_TYPE}
 */
export function getHubDevices(hubId) {
  let retVal;
  const devices = getDevices();
  if (devices && devices[hubId]) {
    retVal = devices[hubId];
  }
  return retVal;
}

/**
 * Get pairing devices of given hub
 * @param  {string} hubId
 * @return {DEVICES_MAP_TYPE}
 */
export function getHubPairingDevices(hubId) {
  let retVal;
  const devices = getPairingDevices();
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
export function devicesDeltaHandler(hubId, reset, devices) {
  let oldHubDevices = {};
  const storedDevices = getDevices();
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
        store.dispatch(devicesState.actions.deleteDevice(key));
      }
    });
  }
}

/**
 * Device handler for poll delta results
 * @param  {string} hubId
 * @param  {boolean} reset
 * @param  {Array} pairingDevices
 */
export function pairingDevicesDeltaHandler(hubId, reset, pairingDevices) {
  let oldPairingDevices = {};
  const storedPairingDevices = getPairingDevices();
  if (storedPairingDevices && storedPairingDevices[hubId]) {
    oldPairingDevices = storedPairingDevices[hubId];
  }

  // If reset then set  devices as they are received
  const statePairingDevices = {
    hubId,
    devices: {},
  };
  pairingDevices.map((device) => {
    statePairingDevices.devices[device.id] = device;
    return true;
  });

  if (reset) {
    // If reset then set  devices as they are received
    store.dispatch(pairingsState.actions.setPairingDevices(statePairingDevices));
  } else {
    // Loop devices to check could it be added or should be removed
    Object.entries(statePairingDevices.devices).forEach(([key, device]) => {
      const statePairingDevice = {
        hubId,
        device,
      };
      /*
      for(devRoom in device.status.room){
        for room in _rooms when devRoom is room.id
            device.status.room = angular.copy room
      }
      */
      if (key && device) {
        store.dispatch(pairingsState.actions.setPairingDevice(statePairingDevice));
      } else if (key && oldPairingDevices[key]) {
        store.dispatch(pairingsState.actions.deletePairingDevice(key));
      }
    });
  }
}
