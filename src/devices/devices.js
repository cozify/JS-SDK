//@flow

//import { COMMANDS, send, sendAll } from '../connection/send'
import { ROLES } from '../user/constants'
import { getStore } from "../store"
import { devicesState, devicesReducer } from "../reducers/devices"

export function deviceDeltaHandler(hubId: string, reset: boolean, devices: Object) {
  let oldHubDevices = {}
  const storedDevices = getDevices()
  if (storedDevices && storedDevices[hubId]) {
    oldHubDevices = storedDevices[hubId];
  }

  if (reset) {
    // If reset then set  devices as they are received
    const stateDevices = {
      hubId: hubId,
      devices: devices
    };
    getStore().dispatch(devicesState.actions.setDevices(stateDevices));
  } else {
    // Loop devices to check could it be added or should be removed
    Object.entries(devices).forEach(([key, device]) => {
      const stateDevice = {
        hubId: hubId,
        device: device
      };
      if (key && device) {
        getStore().dispatch(devicesState.actions.setDevice(stateDevice));
      } else if (key && oldHubDevices[key]) {
        getStore().dispatch(devicesState.actions.deleteDevice(stateDevice));
      }
    });
  }
}


export function getHubDevices(hubId) {
  let retVal = undefined;
  const devices = getDevices();
  if (devices && devices[hubId]) {
    retVal = devices[hubId];
  }
  return retVal;
}

export function getDevices() {
  const stateNow = getStore().getState();
  return devicesState.selectors.getDevices(stateNow)
}

