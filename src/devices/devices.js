//@flow

//import { COMMANDS, send, sendAll } from '../connection/send'
import { ROLES } from '../user/constants'
import { store } from "../store"
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
    store.dispatch(devicesState.actions.setDevices(stateDevices));
  } else {
    // Loop devices to check could it be added or should be removed
    Object.entries(devices).forEach(([key, device]) => {
      const stateDevice = {
        hubId: hubId,
        device: device
      };
      if (key && device) {
        store.dispatch(devicesState.actions.setDevice(stateDevice));
      } else if (key && oldHubDevices[key]) {
        store.dispatch(devicesState.actions.deleteDevice(stateDevice));
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
  const stateNow = store.getState();
  return devicesState.selectors.getDevices(stateNow)
}

